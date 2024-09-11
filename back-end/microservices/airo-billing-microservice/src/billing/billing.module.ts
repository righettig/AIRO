import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { PaymentModule } from 'src/payment/payment.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { BillingService } from './billing.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'billing-exchange',
          type: 'fanout',
        },
      ],
      uri: process.env.RABBITMQ_URL,
      connectionInitOptions: { wait: false },
    }),
    PaymentModule
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule { }
