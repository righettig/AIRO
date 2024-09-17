import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { AuthModule } from 'src/auth/auth.module';
import { BotsModule } from 'src/bots/bots.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    AuthModule,
    BotsModule,
    EventsModule
  ],
  controllers: [GatewayController]
})
export class GatewayModule { }
