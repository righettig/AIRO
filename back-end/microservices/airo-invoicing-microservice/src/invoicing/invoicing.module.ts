import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { InvoiceService } from './invocing.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './models/invoice.persistence';
import { InvoiceRepository } from './invoice.repository';

@Module({
  imports: [
    InvoicingModule,
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
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
  providers: [InvoiceService, InvoiceRepository],
  controllers: [InvoiceController]
})
export class InvoicingModule {}
