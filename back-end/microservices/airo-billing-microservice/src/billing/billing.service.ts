import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { PaymentSuccessfulMessage } from './billing.controller';

@Injectable()
export class BillingService {
    private readonly logger = new Logger(BillingService.name);

    @RabbitSubscribe({
        exchange: 'billing-exchange',
        routingKey: 'payment.successful',
        queue: 'billing-queue',
    })
    public async paymentSuccessful(data: PaymentSuccessfulMessage) {
        // TODO: use PaymentService, in-memory-repository
        this.logger.log(
            `Creating payments record: <uid, amount, lastPaymentDate = now>: ${JSON.stringify(data)}`);
    }
}