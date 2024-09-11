import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './models/payment.persistence';

@Injectable()
export class PaymentsRepository {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) {}

  async createPayment(uid: string, amount: number, creditCardDetails: string, lastPaymentDate: Date): Promise<Payment> {
    const newPayment = new this.paymentModel({ uid, amount, creditCardDetails, lastPaymentDate });
    return newPayment.save();
  }

  async getAllPayments(): Promise<Payment[]> {
    return this.paymentModel.find().exec();
  }

  async getOldPayments(): Promise<Payment[]> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return this.paymentModel.find({
      lastPaymentDate: { $lt: oneMonthAgo },
    }).exec();
  }
}
