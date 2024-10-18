# AIRO - Artificial Intelligence & Robotics Online

## AI-Powered Online Gaming Platform
This project is a scalable, microservices-based online gaming platform allowing users to create, customize, and program AI-driven bots to compete in resource-gathering and survival events within virtual arenas. A leaderboard tracking the most successful users and behaviours is implemented. Enterprise users can leverage the community-created behaviours to train real robots.

### Key Features:
- **User Authentication & Management:** Secure registration and login system with role-based access for free and paid tiers.
- **Profile:** Users can manage their profile.
- **Billing/Invoicing:** Consumer website comes in two tiers: free and paid. Billing and invoicing is implemented.
- **Bot Management:** Create and customize AI bots with a flexible behavior design system supporting multiple programming languages.
- **Arena Management:** Virtual arenas for events, designed and managed by game designers.
- **Event Execution:** Asynchronous, real-time event processing, capable of handling a large number of bots.
Microservices Architecture.
- **Notifications:** UI & Emails.

### Architecture Stack:
- Microservices with gateway APIs. Microservices use CQRS/Event sourcing.

### Tech Stack:
- **Cloud Services:** Azure, Firebase
- **Backend:** Node.js, .NET Core
- **Frontend:** Angular, React
- **Database:** Azure Cosmos DB, Mongo DB, Firestore, Redis, EventStore
- **Messaging:** RabbitMq
- **Other:** Docker
