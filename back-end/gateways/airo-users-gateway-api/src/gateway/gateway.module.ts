import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileModule } from 'src/profile/profile.module';
import { BillingModule } from 'src/billing/billing.module';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { BotsModule } from 'src/bots/bots.module';
import { PurchaseModule } from 'src/purchase/purchase.module';
import { EventsModule } from 'src/events/events.module';
import { UiNotificationsModule } from 'src/ui-notifications/ui-notifications.module';
import { EventSimulationModule } from 'src/event-simulation/event-simulation.module';

@Module({
  imports: [
    AuthModule,
    ProfileModule,
    BillingModule,
    InvoiceModule,
    BotsModule,
    PurchaseModule,
    EventsModule,
    EventSimulationModule,
    UiNotificationsModule
  ],
  controllers: [GatewayController]
})
export class GatewayModule { }
