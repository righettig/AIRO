import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [HttpModule],
  exports: [InvoiceService],
  providers: [InvoiceService]
})
export class InvoiceModule {}
