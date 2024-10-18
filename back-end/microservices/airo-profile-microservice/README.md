# AIRO Profile

## Overview
Provides CRUD endpoints to manage user profiles.

## Responsibilities
- Manages profile by implementing CRUD functionalities.

## Technology Stack
- **Programming Language:** C#
- **Frameworks:** ASP.NET Core
- **Database:** Firestore
- **Messaging:** None
- **Backend/Cloud Services:** Firebase
- **Other:** Docker

## API Endpoints
| Method | Endpoint             | Description                                 |
|--------|----------------------|---------------------------------------------|
| POST   | `/api/profile`       | Creates a user profile                      |
| PATCH  | `/api/profile`       | Updates a given user profile                |
| GET    | `/api/profile/{uid}` | Returns the user profile with the given uid |

## Dependencies
- Firebase and Firestore.
- **Internal:** `airo-common-lib`.

## Message Queue Topics/Events
- Not applicable.

## Configuration
- **Environment Variables:** `FIREBASE_PROJECT_NAME`, `FIREBASE_API_KEY`, `FIREBASE_CONFIG_FILE`, `JWT_AUTHORITY`, `CORS_ALLOWED_ORIGINS`

## Error Handling
- No error handling is currently in place.
- **Logging:** No logging mechanism is in place.

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
- Enforce validation on DTOs: CreateProfileRequest/UpdateProfileRequest. This is currently being done at the gateway level but as best practice I should perform checks on each microservice.
- Improve logging.

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
