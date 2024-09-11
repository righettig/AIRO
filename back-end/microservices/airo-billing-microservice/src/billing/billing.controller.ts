import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PaymentDto } from './models/payment.dto';
import { PaymentService } from 'src/payment/payment.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

export type PaymentSuccessfulMessage = PaymentDto & { amount: number };

type BillingPaymentResponse = { success: boolean };

@Controller('api/billing')
export class BillingController {
  private readonly logger = new Logger(BillingController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly amqpConnection: AmqpConnection
  ) { }

  @Post()
  async processPayment(@Body() paymentDto: PaymentDto): Promise<BillingPaymentResponse> {
    this.logger.log(`Received request for processPayment: ${JSON.stringify(paymentDto)}`);

    try {
      const success = await this.paymentService.process(paymentDto.creditCardDetails);
      
      if (!success) return { success: false };

      const payload: PaymentSuccessfulMessage = {
        ...paymentDto,
        amount: 100,
      };

      this.amqpConnection.publish(
        'billing-exchange', 
        'payment.successful',
        payload
      );
    }
    catch {
      return { success: false }
    }

    return { success: true }
  }
}
