import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PaymentDto } from './models/payment.dto';
import { PaymentService } from 'src/payment/payment.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentsRepository } from 'src/payment/payments.repository';

export type PaymentSuccessfulMessage = PaymentDto & { amount: number };

type BillingPaymentResponse = { success: boolean };

@Controller('api/billing')
export class BillingController {
  private readonly logger = new Logger(BillingController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly paymentRepository: PaymentsRepository,
    private readonly amqpConnection: AmqpConnection
  ) { }

  @Post()
  async processPayment(@Body() paymentDto: PaymentDto): Promise<BillingPaymentResponse> {
    this.logger.log(`Received request for processPayment: ${JSON.stringify(paymentDto)}`);
    return this.handlePaymentProcessing(paymentDto);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async getAccountsDueForBilling() {
    this.logger.debug('Checking for accounts due for billing');

    const dueForBilling = await this.paymentRepository.getOldPayments();

    for (const paymentDto of dueForBilling) {
      await this.handlePaymentProcessing(paymentDto);
    }
  }

  private async handlePaymentProcessing(paymentDto: PaymentDto): Promise<BillingPaymentResponse> {
    try {
      const success = await this.paymentService.process(paymentDto.creditCardDetails);

      if (!success) {
        this.logger.warn(`Payment processing failed for account: ${paymentDto.uid}`);
        return { success: false };
      }

      const payload: PaymentSuccessfulMessage = {
        ...paymentDto,
        amount: 100, // Customize amount as needed, this should be retrieve from an API, or service
      };

      this.publishSuccessfulPayment(payload);

      return { success: true };
    } catch (error) {
      this.logger.error(`Error processing payment for account: ${paymentDto.uid}`, error.stack);
      return { success: false };
    }
  }

  private publishSuccessfulPayment(payload: PaymentSuccessfulMessage) {
    this.amqpConnection.publish(
      'billing-exchange',
      'payment.successful',
      payload
    );
    this.logger.log(`Published payment successful event for account: ${payload.uid}`);
  }
}
