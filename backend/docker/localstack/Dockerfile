FROM localstack/localstack:4.4

ENV SERVICES=s3
ENV DEFAULT_REGION=us-east-1

COPY init-s3.sh /etc/localstack/init/ready.d/init-s3.sh
RUN sed -i 's/\r$//' /etc/localstack/init/ready.d/init-s3.sh && chmod +x /etc/localstack/init/ready.d/init-s3.sh

EXPOSE 4566
