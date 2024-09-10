import { Module } from '@nestjs/common';
import { BillingModule } from './billing/billing.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    BillingModule, 
    ScheduleModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
