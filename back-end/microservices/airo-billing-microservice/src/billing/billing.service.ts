import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { PaymentSuccessfulMessage } from './billing.controller';
import { PaymentsRepository } from '../payment/payments.repository';

@Injectable()
export class BillingService {
    private readonly logger = new Logger(BillingService.name);

    constructor(private readonly paymentRepository: PaymentsRepository) { }

    @RabbitSubscribe({
        exchange: 'billing-exchange',
        routingKey: 'payment.successful',
        queue: 'billing-queue',
    })
    public async paymentSuccessful(data: PaymentSuccessfulMessage) {
        this.logger.log(`Creating payments record for: ${JSON.stringify(data)}`);

        this.paymentRepository.createPayment(data.uid, data.amount, data.creditCardDetails, new Date());
    }
}