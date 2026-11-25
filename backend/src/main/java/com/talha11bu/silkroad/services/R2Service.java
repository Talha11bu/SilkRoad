package com.talha11bu.silkroad.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.io.IOException;
import java.io.InputStream;
import java.io.PipedInputStream;
import java.io.PipedOutputStream;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Service for interacting with S3-compatible object storage (Cloudflare R2 / LocalStack S3).
 */
@Slf4j
@Service
public class R2Service {

    private final S3Client r2Client;
    private final S3Presigner r2Presigner;
    private final String bucketName;

    public R2Service(
            S3Client r2Client,
            S3Presigner r2Presigner,
            @Qualifier("storageBucketName") String bucketName) {
        this.r2Client = r2Client;
        this.r2Presigner = r2Presigner;
        this.bucketName = bucketName;
    }

    public Resource downloadFile(String r2FileKey) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(r2FileKey)
                .build();

        try {
            return new InputStreamResource(r2Client.getObject(getObjectRequest));
        } catch (S3Exception e) {
            if (e.statusCode() == 404) {
                throw new NoSuchElementException("File not found " + r2FileKey);
            }
            throw new RuntimeException("Failed to download from storage", e);
        }
    }

    public String generatePreSignedDownloadUrl(String objectKey, String fileName) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .responseContentDisposition("attachment; filename=\"" + fileName + "\"")
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(5))
                .getObjectRequest(getObjectRequest)
                .build();

        return r2Presigner.presignGetObject(presignRequest).url().toString();
    }

    public Map<String, String> generatePreSignedUploadUrl(String sessionId, String originalFilename,
            String contentType) {
        String fileKey = String.format("%s/%s-%s", sessionId, UUID.randomUUID(), originalFilename);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .putObjectRequest(putObjectRequest)
                .build();

        String url = r2Presigner.presignPutObject(presignRequest).url().toString();
        return Map.of("url", url, "fileKey", fileKey);
    }

    public Resource downloadFilesAsZip(List<String> r2Keys) throws IOException {
        PipedOutputStream outputStream = new PipedOutputStream();
        PipedInputStream inputStream = new PipedInputStream(outputStream);

        Thread.ofVirtual().name("r2-zipfolder-creator").start(() -> {
            try (ZipOutputStream zipOut = new ZipOutputStream(outputStream)) {
                for (String r2Key : r2Keys) {
                    String originalName = r2Key.substring(r2Key.lastIndexOf('-') + 1);
                    zipOut.putNextEntry(new ZipEntry(originalName));

                    GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                            .bucket(bucketName)
                            .key(r2Key)
                            .build();
                    try (InputStream fileInputStream = r2Client.getObject(getObjectRequest)) {
                        fileInputStream.transferTo(zipOut);
                    }
                    zipOut.closeEntry();
                }
            } catch (Exception e) {
                log.error("Error during storage zipping process: {}", e.getMessage());
            } finally {
                try {
                    outputStream.close();
                } catch (IOException e) {
                    log.error("Error closing zip output stream: {}", e.getMessage());
                }
            }
        });

        return new InputStreamResource(inputStream);
    }

    public void deleteFile(String r2FileKey) {
        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(r2FileKey)
                .build();

        try {
            r2Client.deleteObject(deleteRequest);
        } catch (S3Exception e) {
            log.error("Storage file deletion failed for key {}: {}", r2FileKey, e.awsErrorDetails().errorMessage());
            throw new RuntimeException(e);
        }
    }

    public int deleteFiles(Collection<String> r2FileKeys) {
        if (r2FileKeys.isEmpty()) {
            return 0;
        }

        List<ObjectIdentifier> identifiers = r2FileKeys.stream()
                .map(key -> ObjectIdentifier.builder().key(key).build())
                .toList();

        DeleteObjectsRequest deleteRequest = DeleteObjectsRequest.builder()
                .bucket(bucketName)
                .delete(Delete.builder().objects(identifiers).build())
                .build();

        try {
            r2Client.deleteObjects(deleteRequest);
            return identifiers.size();
        } catch (S3Exception e) {
            log.error("Bulk storage deletion failed: {}", e.awsErrorDetails().errorMessage());
            throw new RuntimeException("Failed to delete files", e);
        }
    }
}
