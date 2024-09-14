import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { AuthModule } from 'src/auth/auth.module';
import { BotsModule } from 'src/bots/bots.module';

@Module({
  imports: [
    AuthModule,
    BotsModule
  ],
  controllers: [GatewayController]
})
export class GatewayModule { }
