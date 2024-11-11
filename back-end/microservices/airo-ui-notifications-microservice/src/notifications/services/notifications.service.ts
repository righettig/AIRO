import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { UINotification } from '../models/ui-notification.interface';
import { EventHandlerFactory } from '../handlers/event-handler-factory';
import { IUiNotificationRepository, UI_NOTIFICATION_REPOSITORY } from './notifications-repository.service';

type UiNotificationCreatedMessage = {
    eventType: string,
    payload: any
}

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        @Inject(UI_NOTIFICATION_REPOSITORY) private readonly repository: IUiNotificationRepository,
        private readonly eventHandlerFactory: EventHandlerFactory,
    ) { }

    @RabbitSubscribe({
        exchange: 'notifications-exchange',
        routingKey: 'ui.notification.created',
        queue: 'ui-notifications-queue',
    })
    public async notificationCreated(data: UiNotificationCreatedMessage, amqpMsg: ConsumeMessage) {
        this.logger.log(`data: ${JSON.stringify(data)}`);

        const notification = await this.handleEvent(data);

        if (notification) {
            await this.repository.createUiNotification(notification);
        }
    }

    private async handleEvent(data: UiNotificationCreatedMessage): Promise<UINotification> | null {
        const handler = this.eventHandlerFactory.get(data.eventType);

        if (!handler) {
            this.logger.warn(`Unknown event type: ${data.eventType}`);
            return null;
        }

        return await handler.handle(data.payload);
    }
}