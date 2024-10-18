# AIRO Billing

## Overview
The microservice checks which accounts are due for payment and processes the payments.

## Responsibilities
- Checks for accounts that due for payment.
- Processes payments.

## Technology Stack
- **Programming Language:** TypeScript
- **Frameworks:** NestJS
- **Database:** MongoDB
- **Messaging:** RabbitMQ
- **Backend/Cloud Services:** None
- **Other:** Docker

## API Endpoints
| Method | Endpoint       | Description                 |
|--------|----------------|-----------------------------|
| POST   | `/api/billing` | Processes a payment request |

## Dependencies
- MongoDB, RabbitMQ.
- **Internal:** None.
- **Projects:** None.

## Message Queue Topics/Events
- **Published Events:** `payment.successful` (uid).
- **Subscribed Events:** `payment.successful`.

## Configuration
- **Environment Variables:** `MONGO_URL`, `RABBITMQ_URL`
- **Other Configurations:** None.

## Error Handling
- Basic exception handling via try/catch in `handlePaymentProcessing`.
- All logs are handled by the NestJS Logger class.

## Performance Considerations
- Nothing to report.
- No rate limiting, nor caching being applied.

## Security Considerations
- Payment is stubbed. Nothing to report for now. Obviously a new assesment must be done should a real payment system be used for production.

## Testing
- **Unit Tests:** BillingService/BillingController are unit tested using Jest (@nestjs/testing).
- **Integration Tests:** Plan to add integration tests.
- **Other:** None.

## Future Improvements
- Switch to a real payment processing system.

## Maintainers
- **Primary Contact:** Giacomo Righetti, righettig@outlook.com
- **Contributors:** None.
