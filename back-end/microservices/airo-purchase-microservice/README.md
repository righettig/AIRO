# AIRO Purchase

## Overview
Allows users to purchase bots.

## Responsibilities
- Manages the Events domain by implementing CRUD functionalities.

## Technology Stack
- **Programming Language:** C#
- **Frameworks:** ASP.NET Core
- **Database:** EventStore, InMemory
- **Messaging:** None
- **Backend/Cloud Services:** None
- **Other:** Docker

## API Endpoints
| Method | Endpoint                 | Description                                 |
|--------|--------------------------|---------------------------------------------|
| POST   | `/api/purchase`          | Purchase a bot                              |
| GET    | `/api/purchase/{userId}` | Returns the bot purchased by the given user |

## Dependencies
- EventStoreDb.
- **Internal:** No dependencies.
- **Internal:** `airo-purchase-domain` (Domain model), `airo-cqrs-eventsourcing-lib` (CQRS/Event sourcing Framework).

## Message Queue Topics/Events
- Not applicable.

## Configuration
- **Environment Variables:** `EVENT_STORE_DB_URL`

## Error Handling
- No error handling is currently in place.
- **Logging:** No logging mechanism is in place.

## Performance Considerations
- Nothing to report.

## Security Considerations
- Expose Https endpoints.

## Testing
- **Unit Tests:** There is a unit test project covering controller-level and query handler and controller tests.
- **Integration Tests:** Plan to add integration tests for end-to-end authentication flow.
- **Other:** None.

## Future Improvements
- Make sure this microservice can run in isolation from Visual Studio. This requires all environment variables to be available from appsettings.json.
- Enforce validation on DTOs: PurchaseBotRequest. This is currently being done at the gateway level but as best practice I should perform checks on each microservice.
- Improve logging.
- Expose a `health` endpoint so that I can monitor and restart the service if necessary. Consider whether I also need to test EventStore health as well.
- Currently using an in-memory store for the read model. Switch to cosmos db, or any other db.

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
