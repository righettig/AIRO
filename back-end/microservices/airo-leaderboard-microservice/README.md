# AIRO Leaderboard

## Overview
Manages users and behaviours leaderboards.

## Responsibilities
- Expose leaderboard API.
- Assign scores to users and behaviours based on the outcome of an event simulation.

## Technology Stack
- **Programming Language:** C#
- **Frameworks:** ASP.NET Core
- **Database:** CosmosDb, Redis
- **Messaging:** RabbitMq
- **Backend/Cloud Services:** None
- **Other:** Docker

## API Endpoints
| Method | Endpoint                               | Description                                             |
|--------|----------------------------------------|---------------------------------------------------------|
| GET    | `api/leaderboard/behaviors/top/n`      | Returns the best "n" behaviours based on #wins          |
| GET    | `api/leaderboard/users/top/n`          | Returns the best "n" users based on #wins               |
| GET    | `api/leaderboard/behaviors/behaviorId` | Returns the leaderboard entry for given behaviour id    |
| GET    | `api/leaderboard/users/userId`         | Returns the leaderboard entry for given user id         |

## Dependencies
- CosmosDb, Redis, RabbitMq.
- **Internal:** event-subscriptions-service.
- **Projects:** No dependencies.

## Message Queue Topics/Events
- **Subscribed Events:** Upon receiving this message `event.completed` all participants' data is retrieved. The corresponding entries in both Redis and CosmosDb are updated.

## Configuration
- **Environment Variables:** `EVENT_SUBSCRIPTION_API_URL`, `REDIS_URL`, `RABBITMQ_URL`, `COSMOSDB_ENDPOINT`, `COSMOSDB_KEY`, `LEADERBOARD_DB`

## Error Handling
- No error handling is currently in place.
- **Logging:** Basic logging is in place using Console.WriteLine statements.

## Performance Considerations
- Nothing to report.

## Security Considerations
- Expose Https endpoints.

## Testing
- **Unit Tests:** Plan to add unit tests.
- **Integration Tests:** Plan to add integration tests for end-to-end authentication flow.
- **Other:** None.

## Future Improvements
- Make sure this microservice can run in isolation from Visual Studio. This requires all environment variables to be available from appsettings.json.
- Improve logging by replacing Console.WriteLine statements with a logging system. 
- Expose a `health` endpoint so that I can monitor and restart the service if necessary. Consider whether I also need to test CosmosDb, Redis and RabbitMq health as well.

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
