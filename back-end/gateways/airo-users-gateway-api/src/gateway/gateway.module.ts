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
import { BotBehavioursModule } from 'src/bot-behaviours/bot-behaviours.module';
import { BotBehaviourCompilerModule } from 'src/bot-behaviour-compiler/bot-behaviour-compiler.module';
import { LeaderboardModule } from 'src/leaderboard/leaderboard.module';
import { TokenService } from 'src/common/token.service';
import { TokenGuard } from 'src/common/token.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    ProfileModule,
    BillingModule,
    InvoiceModule,
    BotsModule,
    BotBehavioursModule,
    BotBehaviourCompilerModule,
    PurchaseModule,
    EventsModule,
    EventSubscriptionModule,
    EventSimulationModule,
    UiNotificationsModule,
    LeaderboardModule
  ],
  controllers: [GatewayController],
  providers: [
    TokenService, 
    {
      provide: APP_GUARD,
      useClass: TokenGuard, // Apply TokenGuard globally
    },
  ], 

})
export class GatewayModule { }
