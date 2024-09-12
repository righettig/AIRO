import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './models/invoice.persistence';

@Injectable()
export class InvoiceRepository {
  constructor(@InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>) {}

  async createInvoice(uid: string, amount: number): Promise<string> {
    const createdInvoice = new this.invoiceModel({
      uid,
      amount,
      createdAt: new Date(),
    });

    const invoice = await createdInvoice.save();
    return invoice._id.toString();
  }

  async getAllInvoices(uid: string): Promise<Invoice[]> {
    return this.invoiceModel.find({ uid }).sort({ createdAt: -1 }).exec();
  }
}
