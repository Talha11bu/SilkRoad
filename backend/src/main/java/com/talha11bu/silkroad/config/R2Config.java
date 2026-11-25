package com.talha11bu.silkroad.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URI;

/**
 * Configuration for S3-compatible object storage clients (Cloudflare R2 in prod
 * or LocalStack S3 locally).
 *
 * <p>Controlled via {@code STORAGE_PROVIDER} in {@code .env} ({@code local} or {@code prod}/{@code r2}).
 * When {@code local}, uses {@code LOCAL_S3_*} settings (defaulting to LocalStack at
 * {@code http://localhost:4566}); when {@code prod} or {@code r2}, uses {@code cloudflare.r2.*} /
 * {@code R2_*} credentials.</p>
 */
@Configuration
public class R2Config {

        private static final Logger log = LoggerFactory.getLogger(R2Config.class);

        @Value("${storage.provider:prod}")
        private String provider;

        @Value("${storage.path-style-access:true}")
        private boolean pathStyleAccess;

        @Value("${storage.auto-create-bucket:#{null}}")
        private Boolean autoCreateBucket;

        // LocalStack S3 properties
        @Value("${storage.local.endpoint:http://localhost:4566}")
        private String localEndpoint;

        @Value("${storage.local.public-endpoint:}")
        private String localPublicEndpoint;

        @Value("${storage.local.region:us-east-1}")
        private String localRegion;

        @Value("${storage.local.bucket-name:silkroad-local}")
        private String localBucket;

        @Value("${storage.local.access-key:test}")
        private String localAccessKey;

        @Value("${storage.local.secret-key:test}")
        private String localSecretKey;

        // Cloudflare R2 production properties
        @Value("${cloudflare.r2.endpoint:}")
        private String r2Endpoint;

        @Value("${cloudflare.r2.region:auto}")
        private String r2Region;

        @Value("${cloudflare.r2.bucket-name:silkroad-r2}")
        private String r2Bucket;

        @Value("${cloudflare.r2.access-key:}")
        private String r2AccessKey;

        @Value("${cloudflare.r2.secret-key:}")
        private String r2SecretKey;

        private boolean isLocalProvider() {
                String normalized = provider == null ? "" : provider.trim().toLowerCase();
                return "local".equals(normalized) || "localstack".equals(normalized) || "s3".equals(normalized);
        }

        private static String nonBlankOrDefault(String value, String fallback) {
                return (value != null && !value.isBlank()) ? value.trim() : fallback;
        }

        private String resolveEndpoint() {
                return isLocalProvider()
                                ? nonBlankOrDefault(localEndpoint, "http://localhost:4566")
                                : nonBlankOrDefault(r2Endpoint, "http://localhost:4566");
        }

        private String resolvePresignerEndpoint() {
                if (isLocalProvider()) {
                        return nonBlankOrDefault(localPublicEndpoint, resolveEndpoint());
                }
                return resolveEndpoint();
        }

        private String resolveRegion() {
                return isLocalProvider()
                                ? nonBlankOrDefault(localRegion, "us-east-1")
                                : nonBlankOrDefault(r2Region, "auto");
        }

        private String resolveAccessKey() {
                return isLocalProvider()
                                ? nonBlankOrDefault(localAccessKey, "test")
                                : nonBlankOrDefault(r2AccessKey, "");
        }

        private String resolveSecretKey() {
                return isLocalProvider()
                                ? nonBlankOrDefault(localSecretKey, "test")
                                : nonBlankOrDefault(r2SecretKey, "");
        }

        /**
         * Resolves the active bucket name for the configured storage provider.
         *
         * @return the resolved bucket name.
         */
        @Bean("storageBucketName")
        public String storageBucketName() {
                return isLocalProvider()
                                ? nonBlankOrDefault(localBucket, "silkroad-local")
                                : nonBlankOrDefault(r2Bucket, "silkroad-r2");
        }

        /**
         * Configures the primary S3Client for either Cloudflare R2 or LocalStack S3.
         *
         * @return A configured S3Client instance.
         */
        @Bean
        public S3Client r2Client() {
                String endpoint = resolveEndpoint();
                String region = resolveRegion();
                String bucket = storageBucketName();

                log.info("Initializing S3Client [provider={}, endpoint={}, region={}, bucket={}, pathStyle={}]",
                                provider, endpoint, region, bucket, pathStyleAccess);

                S3Configuration serviceConfiguration = S3Configuration.builder()
                                .pathStyleAccessEnabled(pathStyleAccess)
                                .chunkedEncodingEnabled(false)
                                .build();

                S3Client client = S3Client.builder()
                                .region(Region.of(region))
                                .endpointOverride(URI.create(endpoint))
                                .serviceConfiguration(serviceConfiguration)
                                .credentialsProvider(StaticCredentialsProvider.create(
                                                AwsBasicCredentials.create(resolveAccessKey(), resolveSecretKey())))
                                .build();

                boolean shouldAutoCreate = autoCreateBucket != null ? autoCreateBucket : isLocalProvider();
                if (shouldAutoCreate) {
                        ensureBucketExists(client, bucket);
                }

                return client;
        }

        /**
         * Configures an S3Presigner to generate secure, temporary URLs for direct client uploads/downloads.
         *
         * @return A configured S3Presigner instance.
         */
        @Bean
        public S3Presigner r2Presigner() {
                String endpoint = resolvePresignerEndpoint();
                String region = resolveRegion();

                return S3Presigner.builder()
                                .region(Region.of(region))
                                .endpointOverride(URI.create(endpoint))
                                .credentialsProvider(StaticCredentialsProvider.create(
                                                AwsBasicCredentials.create(resolveAccessKey(), resolveSecretKey())))
                                .serviceConfiguration(S3Configuration.builder()
                                                .pathStyleAccessEnabled(pathStyleAccess)
                                                .build())
                                .build();
        }

        private void ensureBucketExists(S3Client client, String bucket) {
                try {
                        client.headBucket(HeadBucketRequest.builder().bucket(bucket).build());
                } catch (NoSuchBucketException e) {
                        log.info("Creating local S3 bucket '{}'", bucket);
                        client.createBucket(CreateBucketRequest.builder().bucket(bucket).build());
                } catch (Exception e) {
                        log.warn("Could not verify/create S3 bucket '{}' at startup: {}", bucket, e.getMessage());
                }
        }
}
