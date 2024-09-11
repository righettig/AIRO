import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Controller()
export class InvoiceController {
  private readonly logger = new Logger(InvoiceController.name);

  @Get()
  async getInvoicesByUid(uid: string) {
    this.logger.log('getInvoicesByUid: ' + uid);
    return ['invoice_1.pdf', 'invoice_2.pdf'];
  }
}
