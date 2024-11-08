# AIRO Bot Behaviour Compiler

## Overview
This microservice is responsible to compile and validate bot behaviours.

## Responsibilities
Validate and compile bot behaviours. 
Post a message to RabbitMQ when a bot behaviour is updated notifying other microservices.

## Technology Stack
- **Programming Language:** C#
- **Frameworks:** ASP.NET Core
- **Database:** Azure Blob Storage
- **Messaging:** RabbitMQ
- **Backend/Cloud Services:** None
- **Other:** Docker

## API Endpoints
| Method | Endpoint                                    | Description                                                    |
|--------|---------------------------------------------|----------------------------------------------------------------|
| POST   | `/bot-behaviours/{botBehaviourId}/validate` | Validates the bot behaviour                                    |
| POST   | `/bot-behaviours/{botBehaviourId}/compile`  | Compiles the bot behaviour and stores it in Azure Blob storage |

## Dependencies
- No external dependencies.
- **Internal:** None.
- **Projects:** `airo-event-simulation-domain`, `airo-common-lib`.

## Message Queue Topics/Events
- **Published Events:** `bot-behaviour.updated` (BehaviorId, BlobUri, Timestamp).

## Configuration
- **Environment Variables:** `RABBITMQ_URL`, `AZURITE_CONNECTION_STRING`.

## Error Handling

## Performance Considerations

## Security Considerations

## Testing

## Future Improvements
- Support multiple bot behaviour languages by implementing additional IBehaviourCompiler(s)

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
