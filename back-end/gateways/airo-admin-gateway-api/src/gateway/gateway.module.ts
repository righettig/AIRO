import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [GatewayController]
})
export class GatewayModule { }
