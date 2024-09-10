import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { PaymentDto } from './models/payment.dto';
import { PaymentService } from 'src/payment/payment.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';

type BillingPaymentResponse = { success: boolean };

@Controller('api/billing')
export class BillingController {
  private readonly logger = new Logger(BillingController.name);

  constructor(
    private readonly paymentService: PaymentService,
    @Inject('invoiceService') private invoiceService: ClientProxy,
  ) { }

  @Post()
  async processPayment(@Body() paymentDto: PaymentDto): Promise<BillingPaymentResponse> {
    try {
      const success = await this.paymentService.process(paymentDto.creditCardDetails);
      if (!success) return { success: false };

      const pattern = 'payment.successful';
      const payload = {
        ...paymentDto,
        amount: 100
      };

      this.invoiceService.emit(pattern, payload);
    }
    catch {
      return { success: false }
    }

    return { success: true }
  }

  @EventPattern('payment.successful')
  async handlePaymentSuccessful(data: { uid: string, amount: number }) {
    // use PaymentService, in-memory-repository
    this.logger.log(
      'handlePaymentSuccessful: create record in payments: <uid, amount, lastPaymentDate = now>', data);
  }
}
