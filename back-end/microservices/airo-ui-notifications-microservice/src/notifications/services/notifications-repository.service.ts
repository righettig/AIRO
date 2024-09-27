import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CosmosClient, Container, Database } from '@azure/cosmos';
import { ConfigService } from './config.service';
import { UINotification } from '../models/ui-notification.interface';

import * as https from 'https';

// Create an HTTPS agent that accepts self-signed certificates, avoiding 'ERROR [ExceptionsHandler] self-signed certificate'
const agent = new https.Agent({ rejectUnauthorized: false });

@Injectable()
export class UiNotificationRepository implements OnModuleInit, OnModuleDestroy {
  private client: CosmosClient;
  private database: Database;
  private container: Container;

  constructor(private configService: ConfigService) {
    this.client = new CosmosClient({
      endpoint: this.configService.cosmosDbEndpoint,
      key: this.configService.cosmosDbKey,
      agent
    });
  }

  async onModuleInit() {
    const { database } = await this.client.databases.createIfNotExists({
      id: this.configService.databaseId,
      throughput: 400
    });

    const { container } = await database.containers.createIfNotExists({
      id: this.configService.containerId,
      partitionKey: {
        paths: [
          '/notificationId'
        ]
      }
    });

    this.database = database;
    this.container = container;
  }

  async createUiNotification(notification: UINotification) {
    const { resource } = await this.container.items.create(notification);
    return resource;
  }

  async listNotifications(): Promise<UINotification[]> {
    const { resources } = await this.container.items.query('SELECT * FROM c').fetchAll();
    return resources;
  }

  async onModuleDestroy() {
    this.client.dispose();
  }
}
