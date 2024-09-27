import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor() { }

    @RabbitSubscribe({
        exchange: 'notifications-exchange',
        routingKey: 'notification.created',
        queue: 'ui-notifications-queue',
    })
    public async notificationCreated(data: any, amqpMsg: ConsumeMessage) {
        console.log(`Correlation id: ${JSON.stringify(amqpMsg)}`);
        this.logger.log(`data: ${JSON.stringify(data)}`);
    }
}