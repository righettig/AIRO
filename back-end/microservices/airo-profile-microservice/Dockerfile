# Base stage for runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
ARG PROJECT_PATH=back-end/microservices/airo-profile-microservice
ARG PROJECT_NAME=airo-profile-microservice
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["${PROJECT_PATH}/${PROJECT_NAME}.csproj", "./"]
RUN dotnet restore "./${PROJECT_NAME}.csproj"

# Copy the rest of the service source code and build
COPY ["${PROJECT_PATH}/", "./"]
RUN dotnet publish "./${PROJECT_NAME}.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage for runtime
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

# Set environment variable for project name
ENV PROJECT_NAME=airo-profile-microservice

# Use the environment variable in the ENTRYPOINT
ENTRYPOINT dotnet $PROJECT_NAME.dll
