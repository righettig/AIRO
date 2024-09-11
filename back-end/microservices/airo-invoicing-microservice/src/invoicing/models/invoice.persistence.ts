import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema()
export class Invoice {
  @Prop({ required: true })
  uid: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  createdAt: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
