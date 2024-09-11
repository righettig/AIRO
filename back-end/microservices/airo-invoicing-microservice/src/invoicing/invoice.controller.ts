import { Controller, Get, Query } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { InvoiceRepository } from './invoice.repository';
import { Invoice } from './models/invoice.persistence';

@Controller('api/invoices')
export class InvoiceController {
  private readonly logger = new Logger(InvoiceController.name);

  constructor(private readonly invoiceRepository: InvoiceRepository) { }

  @Get()
  async getInvoicesByUid(@Query('uid') uid: string): Promise<Invoice[]> {
    return this.invoiceRepository.getAllInvoices(uid);
  }
}
