import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    get cosmosDbEndpoint(): string {
        return process.env.COSMOSDB_ENDPOINT;
    }

    get cosmosDbKey(): string {
        return process.env.COSMOSDB_KEY;
    }

    get databaseId(): string {
        return process.env.COSMOSDB_DATABASE_ID;
    }

    get containerId(): string {
        return process.env.COSMOSDB_UI_NOTIFICATIONS_CONTAINER_ID;
    }
}
