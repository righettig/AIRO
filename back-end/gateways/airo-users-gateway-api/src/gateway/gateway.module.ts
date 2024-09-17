import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileModule } from 'src/profile/profile.module';
import { BillingModule } from 'src/billing/billing.module';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { BotsModule } from 'src/bots/bots.module';
import { PurchaseModule } from 'src/purchase/purchase.module';

@Module({
  imports: [
    AuthModule,
    ProfileModule,
    BillingModule,
    InvoiceModule,
    BotsModule,
    PurchaseModule
  ],
  controllers: [GatewayController]
})
export class GatewayModule { }
