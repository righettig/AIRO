import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CosmosClient, Container, Database } from '@azure/cosmos';
import { ConfigService } from './config.service';
import { UINotification } from '../models/ui-notification.interface';

import * as https from 'https';

// Create an HTTPS agent that accepts self-signed certificates, avoiding 'ERROR [ExceptionsHandler] self-signed certificate'
const agent = new https.Agent({ rejectUnauthorized: false });

export const UI_NOTIFICATION_REPOSITORY = 'UI_NOTIFICATION_REPOSITORY';

export interface IUiNotificationRepository {
  createUiNotification(notification: UINotification): Promise<UINotification>;
  findAll(): Promise<UINotification[]>
}

@Injectable()
export class InMemoryUiNotificationRepository implements IUiNotificationRepository
{
  private notifications: UINotification[] = [];

  async createUiNotification(notification: UINotification): Promise<UINotification> {
    this.notifications.push(notification);
    return notification;
  }

  async findAll(): Promise<UINotification[]> {
    return this.notifications;
  }
}

@Injectable()
export class UiNotificationRepository implements IUiNotificationRepository, OnModuleInit, OnModuleDestroy {
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
      id: 'airo',
      throughput: 400
    });

    const { container } = await database.containers.createIfNotExists({
      id: 'notifications',
      partitionKey: {
        paths: [
          '/id'
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

  async findAll(): Promise<UINotification[]> {
    const { resources } = await this.container.items.query('SELECT * FROM c').fetchAll();
    return resources;
  }

  async onModuleDestroy() {
    this.client.dispose();
  }
}
