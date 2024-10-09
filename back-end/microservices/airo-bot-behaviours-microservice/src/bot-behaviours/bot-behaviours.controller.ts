import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put } from '@nestjs/common';
import { BotBehaviour, BotBehavioursRepository } from './bot-behaviours.service';
import { CreateBehaviourDto } from './models/create-behaviour.dto';
import { UpdateBehaviourDto } from './models/update-behaviour.dto';

@Controller('api/bot-behaviours')
export class BotBehavioursController {
  private readonly logger = new Logger(BotBehavioursController.name);

  constructor(private readonly botBehavioursRepository: BotBehavioursRepository) { }

  @Get('/:userId')
  async getBehavioursByUserId(@Param('userId') userId: string): Promise<BotBehaviour[]> {
    return this.botBehavioursRepository.getByUserId(userId);
  }

  @Get('/:userId/:botBehaviourId')
  async getBehaviour(@Param('userId') userId: string, @Param('botBehaviourId') botBehaviourId: string): Promise<BotBehaviour | null> {
    const botBehaviour = await this.botBehavioursRepository.getById(botBehaviourId);
    if (botBehaviour.userId && botBehaviour.userId !== userId) { // user does not own the bot behaviour
      return null;
    }
    return botBehaviour;
  }

  @Post()
  async createBehaviour(@Body() createBehaviourDto: CreateBehaviourDto): Promise<string> {
    return await this.botBehavioursRepository.create(createBehaviourDto.userId, createBehaviourDto.name, createBehaviourDto.code);
  }

  @Put('/:userId/:botBehaviourId')
  async updateBehaviour(
    @Param('userId') userId: string,
    @Param('botBehaviourId') botBehaviourId: string,
    @Body() updateBehaviourDto: UpdateBehaviourDto): Promise<void> {
    const botBehaviour = await this.botBehavioursRepository.getById(botBehaviourId);

    if (!botBehaviour) {
      throw new HttpException(
        'Bot behaviour not found', HttpStatus.NOT_FOUND);
    }

    if (!botBehaviour.userId || botBehaviour.userId !== userId) {
      throw new HttpException(
        'User does not own the bot behaviour or trying to update a predefined behaviour', HttpStatus.FORBIDDEN);
    }
    return await this.botBehavioursRepository.update(botBehaviourId, updateBehaviourDto.name, updateBehaviourDto.code);
  }

  @Delete('/:userId/:botBehaviourId')
  async deleteBehaviour(
    @Param('userId') userId: string,
    @Param('botBehaviourId') botBehaviourId: string): Promise<void> {
    const botBehaviour = await this.botBehavioursRepository.getById(botBehaviourId);

    if (!botBehaviour) {
      throw new HttpException(
        'Bot behaviour not found', HttpStatus.NOT_FOUND);
    }

    if (!botBehaviour.userId || botBehaviour.userId !== userId) {
      throw new HttpException(
        'User does not own the bot behaviour or trying to update a predefined behaviour', HttpStatus.FORBIDDEN);
    }
    return await this.botBehavioursRepository.delete(botBehaviourId);
  }
}
