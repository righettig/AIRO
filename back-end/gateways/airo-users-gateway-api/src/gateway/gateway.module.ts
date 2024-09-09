import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [AuthModule, ProfileModule],
  controllers: [GatewayController]
})
export class GatewayModule { }
