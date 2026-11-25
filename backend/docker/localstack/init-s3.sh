#!/bin/bash
set -euo pipefail

BUCKET_NAME="${STORAGE_BUCKET:-silkroad-local}"
REGION="${STORAGE_REGION:-us-east-1}"

echo "[localstack-init] Ensuring S3 bucket '${BUCKET_NAME}' exists in region '${REGION}'..."
awslocal s3api head-bucket --bucket "${BUCKET_NAME}" 2>/dev/null || \
  awslocal s3api create-bucket --bucket "${BUCKET_NAME}" --region "${REGION}"

echo "[localstack-init] Applying CORS policy on '${BUCKET_NAME}' for direct browser pre-signed uploads/downloads..."
awslocal s3api put-bucket-cors --bucket "${BUCKET_NAME}" --cors-configuration '{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag", "Content-Disposition"],
      "MaxAgeSeconds": 3600
    }
  ]
}'

echo "[localstack-init] LocalStack S3 bucket '${BUCKET_NAME}' is ready."
