import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { BotsService } from 'src/bots/bots.service';
import { EventsService } from 'src/events/events.service';
import { EventSubscriptionService } from 'src/event-subscription/event-subscription.service';
import { EventSimulationService } from 'src/event-simulation/event-simulation.service';
import { MapsService } from 'src/maps/maps.service';

import { LoginDto, AuthLoginResponse, LoginResponseDto, AuthRefreshTokenResponse } from '@auth/models';
import { CreateBotDto, UpdateBotDto, GetBotResponse, GetBotsResponse } from '@bots/models';
import { CreateEventDto, UpdateEventDto, GetEventResponse, GetAllEventsResponse } from '@events/models';
import { CreateMapDto, GetAllMapsResponse, GetMapResponse, UpdateMapDto } from '@maps/models';

@Controller('gateway')
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly botsService: BotsService,
    private readonly eventsService: EventsService,
    private readonly eventSubscriptionService: EventSubscriptionService,
    private readonly eventSimulationService: EventSimulationService,
    private readonly mapService: MapsService
  ) { }

  // Auth
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthLoginResponse> {
    const loginResponse = await this.authService.login(loginDto.email, loginDto.password);

    const response: LoginResponseDto = {
      uid: loginResponse.uid,
      token: loginResponse.token,
    }

    return response;
  }

  @Post('logout')
  async logout(): Promise<void> {
    await this.authService.logout();
  }

  @Post('refresh-token')
  async refreshToken(): Promise<AuthRefreshTokenResponse> {
    return await this.authService.refreshToken();
  }

  // Bots
  @Post('bot')
  async createBot(@Body() createBotDto: CreateBotDto): Promise<string> {
    return await this.botsService.create(createBotDto.name, createBotDto.price);
  }

  @Put('bot')
  async updateBot(@Body() updateBotDto: UpdateBotDto): Promise<void> {
    return await this.botsService.update(updateBotDto.id, updateBotDto.name, updateBotDto.price);
  }

  @Delete('bot/:botId')
  async deleteBot(@Param('botId') botId: string): Promise<void> {
    return await this.botsService.delete(botId);
  }

  @Get('bot/:botId')
  async getBot(@Param('botId') botId: string): Promise<GetBotResponse> {
    return await this.botsService.getById(botId);
  }

  @Get('bot')
  async getAllBots(): Promise<GetBotsResponse> {
    return await this.botsService.getAll();
  }

  // Events
  @Post('events')
  async createEvent(@Body() createEventDto: CreateEventDto): Promise<string> {
    return await this.eventsService.create(
      createEventDto.name, 
      createEventDto.description, 
      createEventDto.scheduledAt, 
      createEventDto.mapId
    );
  }

  @Put('events')
  async updateEvent(@Body() updateEventDto: UpdateEventDto): Promise<void> {
    return await this.eventsService.update(
      updateEventDto.id, 
      updateEventDto.name, 
      updateEventDto.description,
      updateEventDto.mapId
    );
  }

  @Delete('events/:eventId')
  async deleteEvent(@Param('eventId') eventId: string): Promise<void> {
    return await this.eventsService.delete(eventId);
  }

  @Get('events/:eventId')
  async getEvent(@Param('eventId') eventId: string): Promise<GetEventResponse> {
    return await this.eventsService.getById(eventId);
  }

  @Get('events')
  async getAllEvents(): Promise<GetAllEventsResponse> {
    return await this.eventsService.getAll();
  }

  // Event Subscription
  @Get('event-subscription')
  async getParticipants(@Query('eventId') eventId: string) {
    const response = await this.eventSubscriptionService.getParticipants(eventId);
    return response;
  }

  // Event Simulation
  @Post('simulation/:eventId')
  async startSimulation(@Param('eventId') eventId: string) {
    return await this.eventSimulationService.startSimulation(eventId);
  }

  @Delete('simulation/:eventId')
  async stopSimulation(@Param('eventId') eventId: string) {
    return await this.eventSimulationService.stopSimulation(eventId);
  }

  // Maps
  @Post('maps')
  async createMap(@Body() createMapDto: CreateMapDto): Promise<string> {
    return await this.mapService.create(createMapDto.mapData);
  }

  @Put('maps')
  async updateMap(@Body() updateMapDto: UpdateMapDto): Promise<void> {
    return await this.mapService.update(updateMapDto.id, updateMapDto.mapData);
  }

  @Delete('maps/:mapId')
  async deleteMap(@Param('mapId') mapId: string): Promise<void> {
    return await this.mapService.delete(mapId);
  }

  @Get('maps/:mapId')
  async getMap(@Param('mapId') mapId: string): Promise<GetMapResponse> {
    return await this.mapService.getById(mapId);
  }

  @Get('maps')
  async getAllMaps(): Promise<GetAllMapsResponse> {
    return await this.mapService.getAll();
  }  
}
