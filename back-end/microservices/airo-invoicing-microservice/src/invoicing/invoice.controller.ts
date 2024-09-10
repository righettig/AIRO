import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

@Controller()
export class InvoiceController {
  private readonly logger = new Logger(InvoiceController.name);

  constructor(@Inject('notificationService') private notificationService: ClientProxy) { }

  @EventPattern('payment.successful')
  createInvoice(data: { uid: string, creditCardDetails: string, amount: number }) {
    this.logger.log('payment.successful: ', data);

    // invoices service to handle "payment.successful" message
    // define invoice schema
    // store invoice in mongodb
    // retrieve invoiceId if OK

    const invoiceId = "invoice-123-456";

    const pattern = "invoice.created";
    const payload = {
      ...data,
      invoiceId,
      email: '' // TODO: where do I get the email?!
    };

    this.notificationService.emit(pattern, payload);
  }

  @Get()
  async getInvoicesByUid(uid: string) {
    this.logger.log('getInvoicesByUid: ' + uid);
    return ['invoice_1.pdf', 'invoice_2.pdf'];
  }
}
