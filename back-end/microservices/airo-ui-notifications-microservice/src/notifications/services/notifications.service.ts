import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { UiNotificationRepository } from './notifications-repository.service';
import { UINotification, UINotificationType } from '../models/ui-notification.interface';

type UiNotificationCreatedMessage = {
    eventType: string,
    payload: any
}

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(private readonly repository: UiNotificationRepository) { }

    @RabbitSubscribe({
        exchange: 'notifications-exchange',
        routingKey: 'ui.notification.created',
        queue: 'ui-notifications-queue',
    })
    public async notificationCreated(data: UiNotificationCreatedMessage, amqpMsg: ConsumeMessage) {
        this.logger.log(`data: ${JSON.stringify(data)}`);

        // TODO: refactor creating EventProcessor(s): IEvent -> UINotification
        var message = '';
        var type: UINotificationType  = 'general';
        var targetAudience = 'all';

        switch (data.eventType) {
            case 'BotCreatedEvent':
                var { Name } = data.payload;
                message = `There is a a new bot available '${Name}'`;
                type = 'bots';
                break;

            case 'EventCreatedEvent':
                var { Name } = data.payload;
                message = `There is a new event available '${Name}'`;
                type = 'events';
                break;

            case 'EventSubscribedEvent':
                var { UserId, EventId } = data.payload;
                message = `You have entered the event '${EventId}'`;
                type = 'events';
                targetAudience = UserId; 
                break;

            case 'EventUnsubscribedEvent':
                var { UserId, EventId } = data.payload;
                message = `You have left the event '${EventId}'`;
                type = 'events';
                targetAudience = UserId; 
                break;

            default: 
                this.logger.log("Unknown event: " + data.eventType);
                break;
        }

        var notification: UINotification = {
            message,
            createdAt: new Date(), // TODO: create common service ITimeProvider
            targetAudience,
            type,
        }

        this.repository.createUiNotification(notification);
    }
}