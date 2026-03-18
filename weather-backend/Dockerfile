# Use Java 17 (adjust version if needed)
FROM eclipse-temurin:17-jdk-alpine

# Create app directory
WORKDIR /app

# Copy Maven wrapper and pom.xml first (for better caching)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies (this layer caches dependencies)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port (Render will set PORT env variable)
EXPOSE 8080

# Run the application - USING THE EXACT JAR NAME
CMD ["java", "-jar", "target/weather-backend-0.0.1-SNAPSHOT.jar"]