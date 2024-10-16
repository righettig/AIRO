# AIRO Auth

## Overview
Provides authentication for the AIRO Consumer Front-end web application.

## Responsibilities
- Signup, login, logout and token refresh.

## Technology Stack
- **Programming Language:** C#
- **Frameworks:** ASP.NET Core
- **Database:** Firestore
- **Messaging:** RabbitMq
- **Backend/Cloud Services:** Firebase
- **Other:** Docker

## API Endpoints
| Method | Endpoint                  | Description                                         |
|--------|---------------------------|-----------------------------------------------------|
| POST   | `/api/auth/signup`        | Signs the user up returning the auth token          |
| POST   | `/api/auth/login`         | Authenticates the user returning the auth token     |
| POST   | `/api/auth/logout`        | Signs the user out                                  |
| POST   | `/api/auth/refresh-token` | Refreshes the currently logged in user's auth token |
| GET    | `/api/auth/user-role`     | Retrieves the user role                             |

## Dependencies
- Google Firebase API, Google Firestore API.
- **Internal:** No dependencies.
- **Projects:** `airo-common-lib` (C# class library for shared utilities and common functionality).

## Message Queue Topics/Events
- **Published Events:** `user.created` (passing the user email).

## Configuration
- **Environment Variables:** `FIREBASE_PROJECT_NAME`, `FIREBASE_API_KEY`, `FIREBASE_CONFIG_FILE`, `JWT_AUTHORITY`, `CORS_ALLOWED_ORIGINS`, `RABBITMQ_URL`
- **Other Configurations:** None.

## Error Handling
- **Authentication Failures:** Returns `401 Unauthorized` for invalid signup/login credentials.
- **Token Expiration:** TODO: verify which error code is being returned should an invalid token be used.
- **Logging:** No logging mechanism is in place. Plan to introduce logging to capture authentication and system errors.

## Performance Considerations
- Nothing to report.

## Security Considerations
- Consider adopting 2FA or some other way to improve security.
- Expose Https endpoints.

## Testing
- **Unit Tests:** Plan to add unit tests for critical authentication logic using xUnit.
- **Integration Tests:** Plan to add integration tests for end-to-end authentication flow.
- **Other:** None.

## Future Improvements
- Make sure this microservice can run in isolation from Visual Studio. This requires all environment variables to be available from appsettings.json.
- SignupRequest/LoginRequest should enforce validation on Email, Password. This is currently being done at the gateway level but as best practice I should perform checks on each microservice.
- Improve logging.
- Add unit test coverage (AuthController, FirebaseAuthService). FirebaseAuthService should rely on interfaces rather than concrete classes, hence consider using IFirebaseAuthClient instead of FirebaseAuthClient. For the same reason introduce a wrapper for FirestoreDb.
- Consider whether I also need to test RabbitMq health as well as part of the health check.

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
