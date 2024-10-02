import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { UiNotificationRepository } from './notifications-repository.service';
import { UINotification } from '../models/ui-notification.interface';
import { EventHandlerFactory } from '../handlers/event-handler-factory';

type UiNotificationCreatedMessage = {
    eventType: string,
    payload: any
}

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        private readonly repository: UiNotificationRepository,
        private readonly eventHandlerFactory: EventHandlerFactory,
    ) { }

    @RabbitSubscribe({
        exchange: 'notifications-exchange',
        routingKey: 'ui.notification.created',
        queue: 'ui-notifications-queue',
    })
    public async notificationCreated(data: UiNotificationCreatedMessage, amqpMsg: ConsumeMessage) {
        this.logger.log(`data: ${JSON.stringify(data)}`);

        const notification = this.handleEvent(data);

        if (notification) {
            await this.repository.createUiNotification(notification);
        }
    }

    private handleEvent(data: UiNotificationCreatedMessage): UINotification | null {
        const handler = this.eventHandlerFactory.get(data.eventType);

        if (!handler) {
            this.logger.warn(`Unknown event type: ${data.eventType}`);
            return null;
        }

        return handler.handle(data.payload);
    }
}