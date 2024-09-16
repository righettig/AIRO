import { Body, Controller, Delete, Get, Logger, Param, Post, Put } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/gateway/models/login.dto';
import { LoginResponseDto } from './models/login.response.dto';
import { BotsService } from 'src/bots/bots.service';
import { CreateBotDto } from './models/create-bot.dto';
import { UpdateBotDto } from './models/update-bot.dto';

@Controller('gateway')
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly botsService: BotsService,
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
}
