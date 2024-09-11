import { Module } from '@nestjs/common';
import { InvoicingModule } from './invoicing/invoicing.module';

@Module({
  imports: [InvoicingModule],
})
export class AppModule { }