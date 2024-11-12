import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CosmosClient, Container, Database } from '@azure/cosmos';
import { ConfigService } from './config.service';
import { UINotificationStatus } from '../models/ui-notification-status.interface';

import * as https from 'https';

// Create an HTTPS agent that accepts self-signed certificates, avoiding 'ERROR [ExceptionsHandler] self-signed certificate'
const agent = new https.Agent({ rejectUnauthorized: false });

export const UI_NOTIFICATION_STATUS_REPOSITORY = 'UI_NOTIFICATION_STATUS_REPOSITORY';

export interface IUiNotificationStatusRepository {
  findByUserId(userId: string): Promise<UINotificationStatus[]>;
  markAsNew(userId: string, notificationId: string): Promise<UINotificationStatus>;
  markAsRead(userId: string, notificationId: string): Promise<void>;
  markAsDeleted(userId: string, notificationId: string): Promise<void>;
}

@Injectable()
export class InMemoryUiNotificationStatusRepository implements IUiNotificationStatusRepository
{
  private statuses: UINotificationStatus[] = [];

  async findByUserId(userId: string): Promise<UINotificationStatus[]> {
    return this.statuses.filter(status => status.userId === userId);
  }

  async markAsNew(userId: string, notificationId: string): Promise<UINotificationStatus> {
    if (this.statuses.some(status => status.userId === userId && status.notificationId === notificationId)) {
      throw new Error('Notification already exists as new');
    }

    const newStatus: UINotificationStatus = {
      userId,
      notificationId,
      status: 'new',
      readAt: null,
    };

    this.statuses.push(newStatus);
    return newStatus;
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const status = this.statuses.find(
      s => s.userId === userId && s.notificationId === notificationId,
    );

    if (!status) throw new Error('Notification not found');
    status.status = 'read';
    status.readAt = new Date();
  }

  async markAsDeleted(userId: string, notificationId: string): Promise<void> {
    const status = this.statuses.find(
      s => s.userId === userId && s.notificationId === notificationId,
    );

    if (!status) throw new Error('Notification not found');
    status.status = 'deleted';
  }
}

@Injectable()
export class UiNotificationStatusRepository implements IUiNotificationStatusRepository, OnModuleInit, OnModuleDestroy {
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
