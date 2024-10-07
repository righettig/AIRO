import { Module } from '@nestjs/common';
import { BotBehavioursModule } from './bot-behaviours/bot-behaviours.module';

@Module({
  imports: [BotBehavioursModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
