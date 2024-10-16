# AIRO Events Scheduler

## Overview
This is the scheduler that triggers event execution based on the event scheduleAt property.

## Responsibilities
- Start events based on schedule.

## Technology Stack
- **Programming Language:** C#
- **Frameworks:** .NET Console Application
- **Database:** None
- **Messaging:** RabbitMq
- **Backend/Cloud Services:** None
- **Other:** Docker, Quartz.Net

## API Endpoints
- This microservice does not expose any endpoints.

## Dependencies
- RabbitMq.
- **Internal:** event-simulation-service.
- **Projects:** No dependencies.

## Message Queue Topics/Events
- **Subscribed Events:** `event.created` (eventId, scheduledAt). `event.deleted` (eventId).

## Configuration
- **Environment Variables:** `RABBITMQ_URL`, `EVENT_SIMULATION_API_URL`

## Error Handling
- No error handling is currently in place.
- **Logging:** Logging is using Console.WriteLine statements.

## Performance Considerations
- Nothing to report.

## Security Considerations
- Nothing to report.

## Testing
- **Unit Tests:** Plan to add unit tests.
- **Integration Tests:** Plan to add integration tests for end-to-end authentication flow.
- **Other:** None.

## Future Improvements
- Make sure this microservice can run in isolation from Visual Studio. This requires all environment variables to be available from appsettings.json.
- Improve logging by replacing Console.WriteLine statements with logger.

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
