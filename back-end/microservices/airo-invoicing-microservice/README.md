# AIRO Invoicing

## Overview
Manages all invoices.

## Responsibilities
- Manages the invoicing.

## Technology Stack
- **Programming Language:** TypeScript
- **Frameworks:** NestJS
- **Database:** MongoDB
- **Messaging:** RabbitMQ
- **Backend/Cloud Services:** None
- **Other:** Docker

## API Endpoints
| Method | Endpoint             | Description                                 |
|--------|----------------------|---------------------------------------------|
| GET    | `api/invoices/{uid}` | Returns all the invoices for the given user |

## Dependencies
- MongoDB, RabbitMQ.
- **Internal:** profile-service.
- **Projects:** None.

## Message Queue Topics/Events
- **Published Events:** `invoice.created`.
- **Subscribed Events:** `payment.successful`.

## Configuration
- **Environment Variables:** `PROFILE_API_URL`, `MONGO_URL`, `RABBITMQ_URL`

## Error Handling
- No error handling is currently in place.
- **Logging:** Basic logging using the NestJS logger.

## Performance Considerations
- Nothing to report.

## Security Considerations
- Expose Https endpoints.

## Testing
- **Unit Tests:** Unit tests included in the same project.
- **Integration Tests:** Plan to add integration tests for end-to-end authentication flow.
- **Other:** None.

## Future Improvements
- It should be possible to run the service in isolation. The service currently depends on 3 environment variables that must be 
all assigned. This can be done externally via .env file or centralise them in the same service. Values can then be set to use localhost as a fallback.
- Improve logging.
- Expose a `health` endpoint so that I can monitor and restart the service if necessary. Consider whether I also need to test MongoDB, RabbitMQ health as well.

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
