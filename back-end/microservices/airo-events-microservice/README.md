# AIRO Events

## Overview
Provides CRUD endpoints to manage events.

## Responsibilities
- Manages the Events domain by implementing CRUD functionalities.

## Technology Stack
- **Programming Language:** C#
- **Frameworks:** ASP.NET Core
- **Database:** EventStore, InMemory
- **Messaging:** RabbitMq
- **Backend/Cloud Services:** None
- **Other:** Docker

## API Endpoints
| Method | Endpoint                    | Description                         |
|--------|-----------------------------|-------------------------------------|
| POST   | `/api/events`               | Creates a new event                 |
| PUT    | `/api/events`               | Updates an event                    |
| DELETE | `/api/events/{id}`          | Deletes an event                    |
| POST   | `/api/events/{id}/start`    | Marks an event as started           |
| POST   | `/api/events/{id}/complete` | Marks an event as completed         |
| GET    | `/api/events`               | Returns all the events              |
| GET    | `/api/events/{id}`          | Returns the event with the given id |

## Dependencies
- EventStoreDb, RabbitMq.
- **Internal:** No dependencies.
- **Projects:** `airo-events-domain` (Domain model), `airo-cqrs-eventsourcing-lib` (CQRS/Event sourcing Framework).

## Message Queue Topics/Events
- **Published Events:** `event.created` (eventId, scheduledAt). `event.deleted` (eventId). `event.completed` (eventId, winnerUserId).

## Configuration
- **Environment Variables:** `EVENT_STORE_DB_URL`, `RABBITMQ_URL`

## Error Handling
- No error handling is currently in place.
- **Logging:** No logging mechanism is in place.

## Performance Considerations
- Nothing to report.

## Security Considerations
- Expose Https endpoints.

## Testing
- **Unit Tests:** There is a unit test project covering controller-level and query handler tests.
- **Integration Tests:** Plan to add integration tests for end-to-end authentication flow.
- **Other:** None.

## Future Improvements
- Make sure this microservice can run in isolation from Visual Studio. This requires all environment variables to be available from appsettings.json.
- Enforce validation on DTOs: CreateEventRequest/UpdateEventRequest/CompleteEventRequest. This is currently being done at the gateway level but as best practice I should perform checks on each microservice.
- Improve logging.
- Expose a `health` endpoint so that I can monitor and restart the service if necessary. Consider whether I also need to test EventStore health as well.
- Currently using an in-memory store for the read model. Switch to cosmos db, or any other db.
- TimeBasedGoal should use ITimeProvider

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
