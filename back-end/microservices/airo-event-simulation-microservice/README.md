# AIRO Event Simulation

## Overview
This microservice is responsible to execute event simulations and retrieve the simulation status.

## Responsibilities
Retrieves all information necessary to carry out such task, like getting the list of participants (including bot behaviours).
Marks an event as `Started` when the simulation starts and `Completed` when it ends.
Each simulation is run independently from the others. 
Behaviours are executed in a sandbox exposing the simulation state.
Each behaviour has a maximum time to completion. If it takes longer than that a timeout is raised.

## Technology Stack
- **Programming Language:** C#
- **Frameworks:** ASP.NET Core
- **Database:** None
- **Messaging:** None
- **Backend/Cloud Services:** None
- **Other:** Docker

## API Endpoints
| Method | Endpoint                     | Description                                                     |
|--------|------------------------------|-----------------------------------------------------------------|
| POST   | `/simulate/{eventId}`        | Starts the simulation for the event with the given id           |
| DELETE | `/simulate/{eventId}`        | Stops the simulation for the event with the given id            |
| GET    | `/simulate/{eventId}/status` | Retrieves the simulation status for the event with the given id |

## Dependencies
- No external dependencies.
- **Internal:** events-service, event-subscription-service, bot-behaviours-service.
- **Projects:** `airo-event-simulation-domain`, `airo-event-simulation-engine`, `airo-event-simulation-infrastructure`.

## Message Queue Topics/Events
- Not applicable.

## Configuration
- **Environment Variables:** `EVENTS_API_URL`, `EVENT_SUBSCRIPTION_API_URL`, `BOT_BEHAVIOURS_API_URL`

## Error Handling
- Basic error handling.
- Uses both ILogger<> for internal logs and `ISimulationStatusTracker` to track simulation updates to users.

## Performance Considerations
- C# bot behaviours scripts are executed using `CSharpScript.EvaluateAsync`. Worth considering alternatives.
- It is important that different event simulation do not interfere with each other.

## Security Considerations
- A timeout is in place to avoid any behaviours blocking the simulation engine. 
- A limited subset of resources are exposes to the behaviours scripts.

## Testing
- **Unit Tests:** Plan to add unit tests for critical authentication logic using xUnit.
- **Integration Tests:** Plan to add integration tests for end-to-end authentication flow.
- **Other:** None.

## Future Improvements
- Expose an interface for bot behaviours to use to return moves.
- Simulation state should be updated according to each bot behaviour's move at the end of the simulation turn.
- Introduce simulation logic (rules, etc.).

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
