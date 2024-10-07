import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BotBehavioursService } from './bot-behaviours.service';

@Module({
  imports: [HttpModule],
  exports: [BotBehavioursService],
  providers: [BotBehavioursService],
})
export class BotBehavioursModule { }
