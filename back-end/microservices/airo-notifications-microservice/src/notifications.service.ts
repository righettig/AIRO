import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { ConsumeMessage } from 'amqplib';
import { EventsService } from './events/events.service';
import { ProfileService } from './profile/profile.service';

export type InvoiceCreatedMessage = { uid: string, creditCardDetails: string, amount: number, invoiceId: string, email: string }
export type EventSubscriptionMessage = { userId: string, eventId: string }

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        private readonly emailService: EmailService,
        private readonly profileService: ProfileService,
        private readonly eventsService: EventsService,
    ) { }

    @RabbitSubscribe({
        exchange: 'auth-exchange',
        routingKey: 'user.created',

        // Ideally I'd like to have the same 'notifications-queue' across handlers but it seems like this causes confusion
        // when routing messages. In fact there was a time when a 'user.created' message was routed to the other handler and
        // vice-versa
        queue: 'user-created-notifications-queue',
    })
    public async userCreated(email: string, amqpMsg: ConsumeMessage) {
        console.log(`Correlation id: ${JSON.stringify(amqpMsg)}`);
        this.logger.log(`user.created: ${JSON.stringify(email)}`);

        await this.emailService.sendEmail(
            email,
            "AIRO new account",
            "Welcome to AIRO!",
            `Welcome to AIRO <strong>${email}</strong>. Head over to <a href="www.airo.ai">AIRO</a> and complete your profile.`
        );
    }

    @RabbitSubscribe({
        exchange: 'invoice-exchange',
        routingKey: 'invoice.created',
        queue: 'invoice-created-notifications-queue',
    })
    public async invoiceCreated(data: InvoiceCreatedMessage, amqpMsg: ConsumeMessage) { // TODO: ideally I should keep message types centralised
        console.log(`Correlation id: ${JSON.stringify(amqpMsg)}`);
        this.logger.log(`invoice.created: ${JSON.stringify(data)}`);

        await this.emailService.sendEmail(
            data.email, 
            "AIRO invoice", 
            "Your payment was successful!", 
            `You have been invoiced <strong>100</strong>. Have fun with AIRO!.`
        );
    }

    @RabbitSubscribe({
        exchange: 'event-subscriptions-exchange',
        routingKey: 'event.subscribed',
        queue: 'event-subscribed-notifications-queue',
    })
    public async eventSubscribed(data: EventSubscriptionMessage, amqpMsg: ConsumeMessage) { // TODO: ideally I should keep message types centralised
        console.log(`Correlation id: ${JSON.stringify(amqpMsg)}`);
        this.logger.log(`event.subscribed: ${JSON.stringify(data)}`);

        const userEmail = await this.profileService.getUserEmail(data.userId);
        const eventName = await this.eventsService.getEventName(data.eventId);

        const message = `You have successfully subscribed to the event '${eventName}'`;

        await this.emailService.sendEmail(
            userEmail,
            "AIRO event subscription", 
            message, 
            message
        );
    }

    @RabbitSubscribe({
        exchange: 'event-subscriptions-exchange',
        routingKey: 'event.unsubscribed',
        queue: 'event-subscribed-notifications-queue',
    })
    public async eventUnsubscribed(data: EventSubscriptionMessage, amqpMsg: ConsumeMessage) { // TODO: ideally I should keep message types centralised
        console.log(`Correlation id: ${JSON.stringify(amqpMsg)}`);
        this.logger.log(`event.unsubscribed: ${JSON.stringify(data)}`);

        const userEmail = await this.profileService.getUserEmail(data.userId);
        const eventName = await this.eventsService.getEventName(data.eventId);

        const message = `You have successfully unsubscribed from the event '${eventName}'`;

        await this.emailService.sendEmail(
            userEmail,
            "AIRO event unsubscription", 
            message, 
            message
        );
    }
}