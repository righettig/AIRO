# AIRO UI Notifications

## Overview
Manages all UI notifications.

## Responsibilities
- Send UI notifications by reacting to RabbitMQ messages.

## Technology Stack
- **Programming Language:** TypeScript
- **Frameworks:** NestJS
- **Database:** CosmosDB
- **Messaging:** RabbitMQ
- **Backend/Cloud Services:** None
- **Other:** Docker

## API Endpoints
| Method | Endpoint                                          | Description                                 |
|--------|---------------------------------------------------|---------------------------------------------|
| GET    | `/api/ui-notifications/{userId}`                  | Gets all notifications for a user           |
| PATCH  | `/api/ui-notifications/{userId}/read`             | Marks a notification as read                |
| DELETE | `/api/ui-notifications/{userId}/{notificationId}` | Deletes a notification                      |

## Dependencies
- CosmosDB, RabbitMQ.
- **Internal:** events-service.
- **Projects:** None.

## Message Queue Topics/Events
- **Subscribed Events:** `ui.notification.created`.

## Configuration
- **Environment Variables:** `RABBITMQ_URL`, `COSMOSDB_ENDPOINT`, `COSMOSDB_KEY`, `EVENTS_API_URL`

## Error Handling
- Check for exception handling improvements.
- **Logging:** Logging via Logger.

## Performance Considerations
- Nothing to report.

## Security Considerations
- Nothing to report.

## Testing
- **Unit Tests:** Plan to add unit tests.
- **Integration Tests:** Plan to add integration tests for end-to-end authentication flow.
- **Other:** None.

## Future Improvements
- It should be possible to run the service in isolation. The service currently depends on ConfigService to provide environment variables. Values can then be set to use localhost as a fallback. 
- Improve logging.
- Expose a `health` endpoint so that I can monitor and restart the service if necessary. Consider whether I also need to test RabbitMQ, CosmosDB health as well.
- Currently writing to the `airo` database. Consider switching a dedicated database for better isolation.

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
