# AIRO Event Subscriptions

## Overview
Provides CRUD endpoints to manage subscriptions to events.

## Responsibilities
- Manages the Event Subscription domain by implementing CRUD functionalities.

## Technology Stack
- **Programming Language:** C#
- **Frameworks:** ASP.NET Core
- **Database:** EventStore, InMemory
- **Messaging:** RabbitMq
- **Backend/Cloud Services:** None
- **Other:** Docker

## API Endpoints
| Method | Endpoint                               | Description                                         |
|--------|----------------------------------------|-----------------------------------------------------|
| POST   | `/api/eventsubscriptions`              | Creates a new event subscription                    |
| DELETE | `/api/eventsubscriptions`              | Deletes an event subscription                       |
| GET    | `/api/eventsubscriptions?eventId`      | Retrieves the participants userIds                  |
| GET    | `/api/eventsubscriptions/eventId/full` | Retrieves the full details of an event subscription |

## Dependencies
- EventStoreDb, RabbitMq.
- **Internal:** airo-event-subscriptions-domain (Domain model), airo-cqrs-eventsourcing-lib (CQRS/Event sourcing Framework), purchase-service.

## Message Queue Topics/Events
- Not applicable.

## Configuration
- **Environment Variables:** `EVENT_STORE_DB_URL`, `PURCHASE_API_URL`, `RABBITMQ_URL`

## Error Handling
- Basic error handling is currently in place (PurchaseService), missing error handling for the controller.
- **Logging:** No logging mechanism is in place. Plan to introduce logging to capture authentication and system errors.

## Performance Considerations
- Nothing to report.

## Security Considerations
- Expose Https endpoints.

## Testing
- **Unit Tests:** Brief description of how unit tests are organized.
- **Integration Tests:** Any integration testing strategies used.

## Future Improvements
- Make sure this microservice can run in isolation from Visual Studio. This requires all environment variables to be available from appsettings.json.
- Enforce validation on DTOs: SubscribeToEventRequest/UnsubscribeFromEventRequest. This is currently being done at the gateway level but as best practice I should perform checks on each microservice.
- Improve logging.
- Expose a `health` endpoint so that I can monitor and restart the service if necessary. Consider whether I also need to test EventStore health as well.
- Currently using an in-memory store for the read model. Switch to cosmos db, or any other 
db.

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
