import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { PaymentModule } from 'src/payment/payment.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'invoiceService',
        transport: Transport.RMQ,
        options: {       
          urls: ['amqp://rabbitmq:5672'],
          queue: 'payment.successful',
        },
      },
    ]),
    PaymentModule
  ],
  controllers: [BillingController]
})
export class BillingModule { }
