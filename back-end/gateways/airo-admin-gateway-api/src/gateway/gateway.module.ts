import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { AuthModule } from 'src/auth/auth.module';
import { BotsModule } from 'src/bots/bots.module';
import { EventsModule } from 'src/events/events.module';
import { EventSimulationModule } from 'src/event-simulation/event-simulation.module';
import { EventSubscriptionModule } from 'src/event-subscription/event-subscription.module';
import { MapsModule } from 'src/maps/maps.module';

@Module({
  imports: [
    AuthModule,
    BotsModule,
    EventsModule,
    EventSubscriptionModule,
    EventSimulationModule,
    MapsModule
  ],
  controllers: [GatewayController]
})
export class GatewayModule { }
