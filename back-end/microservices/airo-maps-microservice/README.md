# AIRO Maps

## Overview
Manages event maps.

## Responsibilities
- Expose maps API.

## Technology Stack
- **Programming Language:** C#
- **Frameworks:** ASP.NET Core
- **Database:** CosmosDb
- **Messaging:** None
- **Backend/Cloud Services:** None
- **Other:** Docker

## API Endpoints
| Method | Endpoint      | Description                       |
|--------|---------------|-----------------------------------|
| GET    | `api/maps/`   | Returns all the maps              |
| GET    | `api/maps/id` | Returns the map with the given id |
| POST   | `api/maps`    | Creates a new map                 |
| PUT    | `api/maps/id` | Updates the map with the given id |

## Dependencies
- CosmosDb
- **Internal:** No dependencies.
- **Projects:** No dependencies.

## Message Queue Topics/Events
- Not applicable

## Configuration
- **Environment Variables:** `COSMOSDB_CONNECTION_STRING`, `MAPS_DATABASE_NAME`

## Error Handling
- No error handling is currently in place.
- **Logging:** Logging is in place using Logger.

## Performance Considerations
- Nothing to report.

## Security Considerations
- Expose Https endpoints.

## Testing
- **Unit Tests:** Plan to add unit tests.
- **Integration Tests:** Plan to add integration tests for end-to-end authentication flow.
- **Other:** None.

## Future Improvements
- Expose a `health` endpoint so that I can monitor and restart the service if necessary. Consider whether I also need to test CosmosDb health as well.

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
