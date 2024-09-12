import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {
  @Prop({ required: true })
  uid: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  creditCardDetails: string;

  @Prop({ required: true })
  lastPaymentDate: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
