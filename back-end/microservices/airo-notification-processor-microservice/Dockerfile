# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/runtime:8.0 AS base
USER app
WORKDIR /app

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
ARG BASE_PATH=back-end/microservices
ARG PROJECT_NAME=airo-notification-processor-microservice
ARG PROJECT_PATH=$BASE_PATH/$PROJECT_NAME
WORKDIR /src

COPY ${PROJECT_PATH}/${PROJECT_NAME}.csproj ${PROJECT_NAME}/
RUN dotnet restore ${PROJECT_NAME}/${PROJECT_NAME}.csproj

# Copy the rest of the source code
COPY ${PROJECT_PATH}/ ${PROJECT_NAME}/
COPY ${BASE_PATH}/airo-cqrs-eventsourcing-lib/ airo-cqrs-eventsourcing-lib/
COPY ${BASE_PATH}/airo-bots-domain/ airo-bots-domain/
COPY ${BASE_PATH}/airo-events-domain/ airo-events-domain/
COPY ${BASE_PATH}/airo-event-subscriptions-domain/ airo-event-subscriptions-domain/

RUN dotnet build ${PROJECT_NAME}/${PROJECT_NAME}.csproj -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish ${PROJECT_NAME}/${PROJECT_NAME}.csproj -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create the /data directory and set permissions
# This ensures I can later write in the /data folder from the TimestampService
USER root
RUN mkdir -p /data && chown -R app:app /data

# Set environment variable for project name
ENV PROJECT_NAME=airo-notification-processor-microservice

# Use the environment variable in the ENTRYPOINT
ENTRYPOINT dotnet $PROJECT_NAME.dll