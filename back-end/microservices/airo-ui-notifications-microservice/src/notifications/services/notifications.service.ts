import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { UiNotificationRepository } from './notifications-repository.service';
import { UINotification, UINotificationType } from '../models/ui-notification.interface';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(private readonly repository: UiNotificationRepository) { }

    @RabbitSubscribe({
        exchange: 'notifications-exchange',
        routingKey: 'ui.notification.created',
        queue: 'ui-notifications-queue',
    })
    public async notificationCreated(data: string, amqpMsg: ConsumeMessage) {
        //console.log(`Correlation id: ${JSON.stringify(amqpMsg)}`);
        this.logger.log(`data: ${JSON.stringify(data)}`);

        var tokens = data.split(',');
        var eventType = tokens[0];
        var payload = tokens[1];

        var message = '';
        var type: UINotificationType  = 'general';

        switch (eventType) {
            case 'BotCreatedEvent': 
                message = `There is a a new bot available '${payload}'`;
                type = 'bots';
                break;

            case 'EventCreatedEvent':
                message = `There is a new event available '${payload}'`;
                type = 'events';
                break;

            default: 
                this.logger.log("Unknown event: " + eventType);
                break;
        }

        var notification: UINotification = {
            notificationId: '',
            message,
            createdAt: new Date(), // TODO: create common service ITimeProvider
            targetAudience: 'all',
            type,
        }

        this.repository.createUiNotification(notification);
    }
}