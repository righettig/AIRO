# Base stage for runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
ARG BASE_PATH=back-end/microservices
ARG PROJECT_NAME=airo-purchase-microservice
ARG PROJECT_PATH=$BASE_PATH/$PROJECT_NAME
WORKDIR /src

# Copy and restore dependencies in one step to leverage Docker layer caching
COPY ${PROJECT_PATH}/${PROJECT_NAME}.csproj ${PROJECT_NAME}/
COPY ${BASE_PATH}/airo-cqrs-eventsourcing-lib/airo-cqrs-eventsourcing-lib.csproj airo-cqrs-eventsourcing-lib/
COPY ${BASE_PATH}/airo-purchase-domain/airo-purchase-domain.csproj airo-purchase-domain/
RUN dotnet restore ${PROJECT_NAME}/${PROJECT_NAME}.csproj

# Copy the rest of the source code
COPY ${PROJECT_PATH}/ ${PROJECT_NAME}/
COPY ${BASE_PATH}/airo-cqrs-eventsourcing-lib/ airo-cqrs-eventsourcing-lib/
COPY ${BASE_PATH}/airo-purchase-domain/ airo-purchase-domain/

# Build and publish the service
RUN dotnet publish ${PROJECT_NAME}/${PROJECT_NAME}.csproj -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage for runtime
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

# Set environment variable for project name
ENV PROJECT_NAME=airo-purchase-microservice

# Use the environment variable in the ENTRYPOINT
ENTRYPOINT dotnet $PROJECT_NAME.dll