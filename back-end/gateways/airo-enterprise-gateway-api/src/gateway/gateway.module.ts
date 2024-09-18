import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { MissionsModule } from 'src/missions/missions.module';
import { CommandsModule } from 'src/commands/commands.module';
import { AgentsModule } from 'src/agents/agents.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MissionsModule,
    CommandsModule,
    AgentsModule
  ],
  controllers: [GatewayController]
})
export class GatewayModule { }
