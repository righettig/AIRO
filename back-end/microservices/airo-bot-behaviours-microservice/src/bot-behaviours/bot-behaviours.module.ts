import { Module } from '@nestjs/common';
import { BotBehavioursController } from './bot-behaviours.controller';
import { BotBehavioursRepository } from './bot-behaviours.service';

@Module({
  imports: [],
  controllers: [BotBehavioursController],
  providers: [BotBehavioursRepository],
  exports: [BotBehavioursRepository]
})
export class BotBehavioursModule { }
