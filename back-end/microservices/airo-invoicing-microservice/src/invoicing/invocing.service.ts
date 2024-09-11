import { Injectable, Logger } from "@nestjs/common";
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { InvoiceRepository } from "./invoice.repository";
import { ProfileService } from "src/profile/profile.service";

export type PaymentSuccessfulMessage = { uid: string, creditCardDetails: string, amount: number };
export type InvoiceCreatedMessage = { uid: string, creditCardDetails: string, amount: number, invoiceId: string, email: string }

@Injectable()
export class InvoiceService {
    private readonly logger = new Logger(InvoiceService.name);

    constructor(
        private readonly profileService: ProfileService,
        private readonly invoiceRepository: InvoiceRepository,
        private readonly amqpConnection: AmqpConnection
    ) { }

    @RabbitSubscribe({
        exchange: 'billing-exchange',
        routingKey: 'payment.successful',
        queue: 'invoice-queue',
    })
    public async createInvoice(data: PaymentSuccessfulMessage) { // TODO: ideally I should keep message types centralised
        this.logger.log(`payment.successful: ${JSON.stringify(data)}`);

        const invoiceId = 
            await this.invoiceRepository.createInvoice(data.uid, data.amount);

        const email = 
            await this.profileService.getUserMailByUid(data.uid);

        const payload: InvoiceCreatedMessage = {
            ...data,
            invoiceId,
            email
        };

        this.amqpConnection.publish(
            'invoice-exchange',
            'invoice.created',
            payload
        );
    }
}