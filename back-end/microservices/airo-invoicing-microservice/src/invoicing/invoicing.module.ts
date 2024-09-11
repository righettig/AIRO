import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { InvoiceService } from './invocing.service';
import { InvoiceController } from './invoice.controller';

@Module({
  imports: [
    InvoicingModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'invoice-exchange',
          type: 'direct',
        },
        {
          name: 'billing-exchange',
          type: 'fanout',
        },
      ],
      uri: process.env.RABBITMQ_URL,
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [InvoiceService],
  controllers: [InvoiceController]
})
export class InvoicingModule {}
