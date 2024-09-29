import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CosmosClient, Container, Database } from '@azure/cosmos';
import { ConfigService } from './config.service';
import { UINotificationStatus } from '../models/ui-notification-status.interface';

import * as https from 'https';

// Create an HTTPS agent that accepts self-signed certificates, avoiding 'ERROR [ExceptionsHandler] self-signed certificate'
const agent = new https.Agent({ rejectUnauthorized: false });

@Injectable()
export class UiNotificationStatusRepository implements OnModuleInit, OnModuleDestroy {
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
      id: 'notifications-status',
      partitionKey: {
        paths: [
          '/notificationId'
        ]
      }
    });

    this.database = database;
    this.container = container;
  }

  async findByUserId(userId: string): Promise<UINotificationStatus[]> {
    const query = `SELECT * FROM c WHERE c.userId = '${userId}'`;

    const { resources: statuses } = await this.container.items.query(query).fetchAll();

    return statuses;
  }
  
  async markAsNew(userId: string, notificationId: string) {
    const status = await this.findStatusByUserAndNotification(userId, notificationId);

    if (status) {
      // throw error
    } 

    var entity: UINotificationStatus = {
      userId,
      notificationId,
      status: 'new',
      readAt: undefined
    };
    
    await this.container.items.create(entity);
    
    return entity;
  }

  async markAsRead(userId: string, notificationId: string) {
    const status = await this.findStatusByUserAndNotification(userId, notificationId);
  
    if (!status) {
      // throw error
    }

    status.status = 'read';
    status.readAt = new Date();

    await this.container.items.upsert(status);
  }

  async markAsDeleted(userId: string, notificationId: string) {
    const status = await this.findStatusByUserAndNotification(userId, notificationId);

    if (!status) {
      // throw error
    }

    status.status = 'deleted';

    await this.container.items.upsert(status);
  }

  private async findStatusByUserAndNotification(userId: string, notificationId: string): Promise<UINotificationStatus> {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.userId = @userId AND c.notificationId = @notificationId',
      parameters: [
        { name: '@userId', value: userId },
        { name: '@notificationId', value: notificationId },
      ],
    };

    const { resources: statuses } = await this.container.items.query(querySpec).fetchAll();

    return statuses.length > 0 ? statuses[0] : null;
  }

  async onModuleDestroy() {
    this.client.dispose();
  }
}
