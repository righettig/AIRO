import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email/email.service';

export type InvoiceCreatedMessage = { uid: string, creditCardDetails: string, amount: number, invoiceId: string, email: string }

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(private readonly emailService: EmailService) { }

    @RabbitSubscribe({
        exchange: 'auth-exchange',
        routingKey: 'user.created',
        queue: 'notifications-queue',
    })
    public async userCreated(email: string) {
        this.logger.log(`user.created: ${email}`);

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
        queue: 'notifications-queue',
    })
    public async invoiceCreated(data: InvoiceCreatedMessage) { // TODO: ideally I should keep message types centralised
        this.logger.log(`invoice.created: ${JSON.stringify(data)}`);

        await this.emailService.sendEmail(
            data.email, 
            "AIRO invoice", 
            "Your payment was successful!", 
            `You have been invoiced <strong>100</strong>. Have fun with AIRO!.`
        );
    }
}