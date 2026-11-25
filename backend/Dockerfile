# ---- Stage 1: Build Spring Boot JAR ----
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY gradlew settings.gradle.kts build.gradle.kts ./
COPY gradle ./gradle
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew && ./gradlew dependencies --no-daemon || true

COPY src ./src
RUN ./gradlew bootJar --no-daemon -x test

# ---- Stage 2: Runtime ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8443

ENV STORAGE_PROVIDER=local
ENV LOCAL_S3_ENDPOINT=http://localstack:4566
ENV LOCAL_S3_PUBLIC_ENDPOINT=http://localhost:4566
ENV LOCAL_S3_REGION=us-east-1
ENV LOCAL_S3_BUCKET=silkroad-local
ENV LOCAL_S3_ACCESS_KEY=test
ENV LOCAL_S3_SECRET_KEY=test

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
