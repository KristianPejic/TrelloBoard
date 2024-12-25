# Use a Java runtime image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the JAR file into the container
COPY target/your-app-name.jar app.jar

# Expose the port your application runs on (e.g., 8080)
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "app.jar"]