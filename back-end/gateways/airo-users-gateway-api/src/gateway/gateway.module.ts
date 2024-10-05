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
import { EventSubscriptionModule } from 'src/event-subscription/event-subscription.module';
import { EventSimulationHubService } from 'src/event-simulation/event-simulation-hub.service';

@Module({
  imports: [
    AuthModule,
    ProfileModule,
    BillingModule,
    InvoiceModule,
    BotsModule,
    PurchaseModule,
    EventsModule,
    EventSubscriptionModule,
    EventSimulationModule,
    UiNotificationsModule
  ],
  controllers: [GatewayController],
  providers: [EventSimulationHubService]
})
export class GatewayModule { }
