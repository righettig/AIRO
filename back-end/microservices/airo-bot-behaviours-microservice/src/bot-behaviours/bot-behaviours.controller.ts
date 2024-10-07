import { Controller, Get, Logger, Param } from '@nestjs/common';
import { BotBehaviour, BotBehavioursRepository } from './bot-behaviours.service';

@Controller('api/bot-behaviours')
export class BotBehavioursController {
  private readonly logger = new Logger(BotBehavioursController.name);

  constructor(private readonly botBehavioursRepository: BotBehavioursRepository) { }

  @Get()
  async getAllBehaviours(): Promise<BotBehaviour[]> {
    return this.botBehavioursRepository.getAllBehaviours();
  }

  @Get(':botBehaviourId')
  async getBehaviour(@Param('botBehaviourId') botBehaviourId: string): Promise<BotBehaviour> {
    return this.botBehavioursRepository.getById(botBehaviourId);
  }
}
