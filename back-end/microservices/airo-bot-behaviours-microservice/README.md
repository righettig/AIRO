# AIRO Bot Behaviours

## Overview
Stores and retrieves bot behaviours.

## Responsibilities
- Stores and retrieves bot behaviours.
- [TODO] Validate bot behaviours.

## Technology Stack
- **Programming Language:** TypeScript
- **Frameworks:** NestJS
- **Database:** InMemory
- **Messaging:** None
- **Backend/Cloud Services:** None
- **Other:** Docker

## API Endpoints
| Method | Endpoint                                        | Description                                                          |
|--------|-------------------------------------------------|----------------------------------------------------------------------|
| POST   | `/api/bot-behaviours`                           | Create a new bot behaviour                                           |
| GET    | `/api/bot-behaviours/{userId}`                  | Retrieves all bot behaviours for bots that belongs to the given user |
| GET    | `/api/bot-behaviours/{userId}/{botBehaviourId}` | Retrieves a specific bot behaviour                                   |
| PUT    | `/api/bot-behaviours/{userId}/{botBehaviourId}` | Update a bot behaviour                                               |
| DELETE | `/api/bot-behaviours/{userId}/{botBehaviourId}` | Delete a bot behaviour                                               |

## Dependencies
- None.
- **Internal:** None.
- **Projects:** None.

## Message Queue Topics/Events
- Not relevant.

## Configuration
- **Environment Variables:** None.
- **Other Configurations:** None.

## Error Handling
- No error handling.
- No loggging.

## Performance Considerations
- Nothing to report.
- No rate limiting, nor caching being applied.

## Security Considerations
- Nothing to report.

## Testing
- **Unit Tests:** Plan to add unit tests.
- **Integration Tests:** Plan to add integration tests.
- **Other:** None.

## Future Improvements
- Store bot behaviours in a database.
- Add bot behaviour validation (how to validate C#, Typescript and multi-language support?).
- Consider adopting a cache for faster retrievals.

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
