# Dockerfile for Spring Boot backend

FROM openjdk:17-jdk-slim as build

WORKDIR /app

# Copy maven files
COPY pom.xml .
COPY src ./src

# Build the application (assuming you have Maven wrapper)
RUN apt-get update && apt-get install -y maven
RUN mvn clean package -DskipTests

# Production stage
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the JAR file from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]