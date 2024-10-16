# AIRO Notification Processor

## Overview
Maps EventStore events to RabbitMq messages for other notification services (mail, UI).

## Responsibilities
- Maps EventStore events to RabbitMq messages for other notification services (mail, UI).

## Technology Stack
- **Programming Language:** C#
- **Frameworks:** .NET Console Application
- **Database:** EventStore
- **Messaging:** RabbitMq
- **Backend/Cloud Services:** None
- **Other:** Docker

## API Endpoints
- No endpoints published.

## Dependencies
- EventStoreDb, RabbitMq
- **Internal:** No dependencies.
- **Projects:** `airo-bots-domain` (Domain model), `airo-events-domain` (Domain model), `airo-event-subscriptions-domain` (Domain model), `airo-cqrs-eventsourcing-lib` (CQRS/Event sourcing Framework).

## Message Queue Topics/Events
- - **Published Events:** `ui.notification.created` (eventType, payload)

## Configuration
- **Environment Variables:** `EVENT_STORE_DB_URL`, `RABBITMQ_URL`

## Error Handling
- No error handling is currently in place.
- **Logging:** Logging via Console.WriteLine statements.

## Performance Considerations
- Nothing to report.

## Security Considerations
- Nothing to report.

## Testing
- **Unit Tests:** Plan to add unit tests project.
- **Integration Tests:** Plan to add integration tests for end-to-end authentication flow.
- **Other:** None.

## Future Improvements
- Make sure this microservice can run in isolation from Visual Studio. This requires all environment variables to be available from appsettings.json.
- Improve logging.
- Expose a `health` endpoint so that I can monitor and restart the service if necessary. Consider whether I also need to test EventStore health as well.

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
