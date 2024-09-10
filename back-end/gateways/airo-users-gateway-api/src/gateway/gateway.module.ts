import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileModule } from 'src/profile/profile.module';
import { BillingModule } from 'src/billing/billing.module';

@Module({
  imports: [AuthModule, ProfileModule, BillingModule],
  controllers: [GatewayController]
})
export class GatewayModule { }
