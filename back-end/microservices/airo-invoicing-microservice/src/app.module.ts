import { Module } from '@nestjs/common';
import { InvoicingModule } from './invoicing/invoicing.module';

@Module({
  imports: [InvoicingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
