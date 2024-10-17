# AIRO Notifications (mailer)

## Overview
Manages all email notifications.

## Responsibilities
- Send email notifications by reacting to RabbitMQ messages.

## Technology Stack
- **Programming Language:** TypeScript
- **Frameworks:** NestJS
- **Database:** None
- **Messaging:** RabbitMQ
- **Backend/Cloud Services:** None
- **Other:** Docker, SendGrid

## API Endpoints
- The microservice does not expose any API endpoints.

## Dependencies
- RabbitMQ, SendGrid.
- **Internal:** profile-service, events-service.
- **Projects:** None.

## Message Queue Topics/Events
- **Subscribed Events:** `user.created`, `invoice.created`, `event.subscribed`, `event.unsubscribed`.

## Configuration
- **Environment Variables:** `RABBITMQ_URL`, `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `PROFILE_API_URL`, `EVENTS_API_URL`

## Error Handling
- Exception handling in the services.
- **Logging:** Logging via console.log statements.

## Performance Considerations
- Nothing to report.

## Security Considerations
- Nothing to report.

## Testing
- **Unit Tests:** Plan to add unit tests.
- **Integration Tests:** Plan to add integration tests for end-to-end authentication flow.
- **Other:** None.

## Future Improvements
- It should be possible to run the service in isolation. The service currently depends on 3 environment variables that must be 
all assigned. This can be done externally via .env file or centralise them in the same service. Values can then be set to use localhost as a fallback.
- Improve logging.
- Expose a `health` endpoint so that I can monitor and restart the service if necessary. Consider whether I also need to test RabbitMQ, SendGrid health as well.

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
