import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BotBehaviourCompilerService } from './bot-behaviour-compiler.service';

@Module({
  imports: [HttpModule],
  exports: [BotBehaviourCompilerService],
  providers: [BotBehaviourCompilerService],
})
export class BotBehaviourCompilerModule { }
