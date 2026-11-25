package com.talha11bu.silkroad;

import com.talha11bu.silkroad.config.R2Config;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.boot.env.OriginTrackedMapPropertySource;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.core.env.PropertiesPropertySource;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class R2ConfigTest {

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withUserConfiguration(R2Config.class);

    @Test
    void localProviderUsesLocalStackEvenWhenR2PropertiesExist() {
        contextRunner
                .withPropertyValues(
                        "storage.provider=local",
                        "storage.auto-create-bucket=false",
                        "cloudflare.r2.endpoint=https://example.r2.cloudflarestorage.com",
                        "cloudflare.r2.bucket-name=silkroad-r2",
                        "cloudflare.r2.access-key=r2-key",
                        "cloudflare.r2.secret-key=r2-secret"
                )
                .run(context -> {
                    String bucket = context.getBean("storageBucketName", String.class);
                    assertEquals("silkroad-local", bucket);

                    S3Client client = context.getBean(S3Client.class);
                    assertEquals("us-east-1", client.serviceClientConfiguration().region().id());
                    assertEquals("http://localhost:4566",
                            client.serviceClientConfiguration().endpointOverride().orElseThrow().toString());

                    S3Presigner presigner = context.getBean(S3Presigner.class);
                    String url = presigner.presignGetObject(GetObjectPresignRequest.builder()
                            .signatureDuration(Duration.ofMinutes(1))
                            .getObjectRequest(GetObjectRequest.builder().bucket(bucket).key("demo.txt").build())
                            .build()).url().toString();
                    assertTrue(url.startsWith("http://localhost:4566/silkroad-local/demo.txt"));
                });
    }

    @Test
    void prodProviderUsesCloudflareR2EvenWhenLocalPropertiesExist() {
        contextRunner
                .withPropertyValues(
                        "storage.provider=prod",
                        "storage.auto-create-bucket=false",
                        "storage.local.endpoint=http://localhost:4566",
                        "storage.local.bucket-name=silkroad-local",
                        "storage.local.access-key=test",
                        "storage.local.secret-key=test",
                        "cloudflare.r2.endpoint=https://example.r2.cloudflarestorage.com",
                        "cloudflare.r2.bucket-name=silkroad-r2",
                        "cloudflare.r2.access-key=r2-key",
                        "cloudflare.r2.secret-key=r2-secret"
                )
                .run(context -> {
                    String bucket = context.getBean("storageBucketName", String.class);
                    assertEquals("silkroad-r2", bucket);

                    S3Client client = context.getBean(S3Client.class);
                    assertEquals("auto", client.serviceClientConfiguration().region().id());
                    assertEquals("https://example.r2.cloudflarestorage.com",
                            client.serviceClientConfiguration().endpointOverride().orElseThrow().toString());
                });
    }

    @Test
    void publicEndpointOverridesPresignerHost() {
        contextRunner
                .withPropertyValues(
                        "storage.provider=local",
                        "storage.local.endpoint=http://localstack:4566",
                        "storage.local.public-endpoint=http://localhost:4566",
                        "storage.auto-create-bucket=false"
                )
                .run(context -> {
                    S3Client client = context.getBean(S3Client.class);
                    assertEquals("http://localstack:4566",
                            client.serviceClientConfiguration().endpointOverride().orElseThrow().toString());

                    S3Presigner presigner = context.getBean(S3Presigner.class);
                    String url = presigner.presignGetObject(GetObjectPresignRequest.builder()
                            .signatureDuration(Duration.ofMinutes(1))
                            .getObjectRequest(GetObjectRequest.builder().bucket("silkroad-local").key("a.txt").build())
                            .build()).url().toString();
                    assertTrue(url.startsWith("http://localhost:4566/silkroad-local/a.txt"));
                });
    }

    @Test
    void backendDotEnvFileSwitchesProviderToLocal() throws Exception {
        Path dotEnv = Path.of(".env");
        assertTrue(Files.exists(dotEnv), "backend/.env should exist");
        Properties props = new Properties();
        try (StringReader reader = new StringReader(Files.readString(dotEnv))) {
            props.load(reader);
        }
        assertEquals("local", props.getProperty("STORAGE_PROVIDER"));
        assertEquals("http://localhost:4566", props.getProperty("LOCAL_S3_ENDPOINT"));
        assertEquals("silkroad-local", props.getProperty("LOCAL_S3_BUCKET"));
    }
}
