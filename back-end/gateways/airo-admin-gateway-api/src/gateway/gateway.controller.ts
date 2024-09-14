import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/gateway/models/login.dto';
import { LoginResponseDto } from './models/login.response.dto';
import { BotsService } from 'src/bots/bots.service';
import { CreateBotDto } from './models/create-bot.dto';

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

  @Post('createBot')
  async createBot(@Body() createBotDto: CreateBotDto) {
    const response = await this.botsService.create(createBotDto.name, createBotDto.price);
    return response;
  }
}
