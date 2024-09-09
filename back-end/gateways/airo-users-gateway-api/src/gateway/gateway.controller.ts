import { Body, Controller, Get, Logger, Post, Query, Req } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ProfileService } from 'src/profile/profile.service';
import { LoginDto } from 'src/gateway/models/login.dto';
import { SignupDto } from 'src/gateway/models/signup.dto';
import { SignupResponseDto } from './models/signup.response.dto';
import { LoginResponseDto } from './models/login.response.dto';
import { jwtDecode } from 'jwt-decode';

@Controller('gateway')
export class GatewayController {
  private logger = new Logger("GatewayController");

  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
  ) { }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    this.logger.log(`signup: ${signupDto.email}, ${signupDto.password}`);
    const signupResponse = await this.authService.signup(signupDto.email, signupDto.password);

    this.logger.log(`createProfile: ${signupResponse.uid}, ${signupDto.accountType}`);
    await this.profileService.createProfile(signupResponse.uid, signupDto.accountType);

    const response: SignupResponseDto = {
      uid: signupResponse.uid,
      token: signupResponse.token,
      firstName: '',
      lastName: '',
      accountType: signupDto.accountType
    }

    this.logger.log(`sending response: ${JSON.stringify(response)}`);
    return response;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const loginResponse = await this.authService.login(loginDto.email, loginDto.password);

    const profileResponse = await this.profileService.getProfileByUid(loginResponse.uid);

    const response: LoginResponseDto = {
      uid: loginResponse.uid,
      token: loginResponse.token,
      firstName: profileResponse.firstName,
      lastName: profileResponse.firstName,
      accountType: profileResponse.accountType
    }

    this.logger.log(`sending response: ${JSON.stringify(response)}`);
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

  @Get('user')
  async getUser(@Req() request: Request) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }
  
    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    const userResponse = await this.profileService.getProfileByUid(uid);

    const email = this.decodeFromToken<{ email?: string }>(token, 'email');
    const userRoleResponse = await this.authService.getUserRole(email);

    return {
      ...userResponse,
      ...userRoleResponse
    };
  }

  private decodeFromToken<T>(token: string, property: keyof T): T[keyof T] | null {
    try {
      const decodedToken = jwtDecode<T>(token);
      return decodedToken[property] || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}