import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invocing.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'notificationService',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL],
                    queue: 'invoice.created',
                },
            },
        ])
    ],
    providers: [InvoiceService],
    controllers: [InvoiceController]
})
export class InvoicingModule { }
