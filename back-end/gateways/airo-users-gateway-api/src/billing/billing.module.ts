import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BillingService } from './billing.service';

@Module({
  imports: [HttpModule],
  exports: [BillingService],
  providers: [BillingService]
})
export class BillingModule {}
