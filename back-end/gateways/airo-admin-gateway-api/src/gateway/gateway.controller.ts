import { Body, Controller, Delete, Get, Logger, Param, Post, Put } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/gateway/models/login.dto';
import { LoginResponseDto } from './models/login.response.dto';
import { BotsService } from 'src/bots/bots.service';
import { CreateBotDto } from './models/create-bot.dto';
import { UpdateBotDto } from './models/update-bot.dto';
import { CreateEventDto } from './models/create-event.dto';
import { EventsService } from 'src/events/events.service';
import { UpdateEVentDto } from './models/update-event.dto';

@Controller('gateway')
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly botsService: BotsService,
    private readonly eventsService: EventsService,
  ) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const loginResponse = await this.authService.login(loginDto.email, loginDto.password);

    const response: LoginResponseDto = {
      uid: loginResponse.uid,
      token: loginResponse.token,
    }

    return response;
  }

  @Post('logout')
  async logout() {
    await this.authService.logout();
  }

  @Post('refresh-token')
  async refreshToken() {
    const response = await this.authService.refreshToken();
    return response;
  }

  @Post('bot')
  async createBot(@Body() createBotDto: CreateBotDto) {
    const response = await this.botsService.create(createBotDto.name, createBotDto.price);
    return response;
  }

  @Put('bot')
  async updateBot(@Body() updateDtoBot: UpdateBotDto) {
    const response = await this.botsService.update(updateDtoBot.id, updateDtoBot.name, updateDtoBot.price);
    return response;
  }

  @Delete('bot/:botId')
  async deleteBot(@Param('botId') botId: string) {
    const response = await this.botsService.delete(botId);
    return response;
  }

  @Get('bot/:botId')
  async getBot(@Param('botId') botId: string) {;
    const response = await this.botsService.getById(botId);
    return response;
  }

  @Get('bot')
  async getAllBots() {
    const response = await this.botsService.getAll();
    return response;
  }

  @Post('events')
  async createEvent(@Body() createEventDto: CreateEventDto) {
    const response = await this.eventsService.create(createEventDto.name, createEventDto.description);
    return response;
  }

  @Put('events')
  async updateEvent(@Body() updateEventDto: UpdateEVentDto) {
    const response = await this.eventsService.update(updateEventDto.id, updateEventDto.name, updateEventDto.description);
    return response;
  }

  @Delete('events/:eventId')
  async deleteEvent(@Param('eventId') eventId: string) {
    const response = await this.eventsService.delete(eventId);
    return response;
  }

  @Get('events/:eventId')
  async getEvent(@Param('eventId') eventId: string) {;
    const response = await this.eventsService.getById(eventId);
    return response;
  }

  @Get('events')
  async getAllEvents() {
    const response = await this.eventsService.getAll();
    return response;
  }
}
