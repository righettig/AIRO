import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentsRepository } from './payments.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './models/payment.persistence';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  ],
  providers: [PaymentService, PaymentsRepository],
  exports: [PaymentService, PaymentsRepository]
})
export class PaymentModule { }
