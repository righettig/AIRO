import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { MissionsModule } from 'src/missions/missions.module';
import { CommandsModule } from 'src/commands/commands.module';
import { AgentsModule } from 'src/agents/agents.module';
import { AuthModule } from 'src/auth/auth.module';
import { AgentsHubService as AgentsHubService } from 'src/agents/agents-hub.service';

@Module({
  imports: [
    AuthModule,
    MissionsModule,
    CommandsModule,
    AgentsModule
  ],
  controllers: [GatewayController],
  providers: [AgentsHubService]
})
export class GatewayModule { }
