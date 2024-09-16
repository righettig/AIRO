import { Body, Controller, Get, Logger, Param, Patch, Post, Req } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ProfileService } from 'src/profile/profile.service';
import { LoginDto } from 'src/gateway/models/login.dto';
import { SignupDto } from 'src/gateway/models/signup.dto';
import { SignupResponseDto } from './models/signup.response.dto';
import { LoginResponseDto } from './models/login.response.dto';
import { jwtDecode } from 'jwt-decode';
import { BillingService } from 'src/billing/billing.service';
import { InvoiceService } from 'src/invoice/invoice.service';
import { InvoiceDto } from 'src/invoice/models/invoice.dto';
import { UpdateProfileDto } from 'src/profile/models/update-profile-dto';
import { BotsService } from 'src/bots/bots.service';

@Controller('gateway')
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
    private readonly billingService: BillingService,
    private readonly invoiceService: InvoiceService,
    private readonly botsService: BotsService,
  ) { }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    this.logger.log(`signup: ${JSON.stringify(signupDto)}`);
    const signupResponse = await this.authService.signup(signupDto.email, signupDto.password);

    if (signupDto.accountType === 'pro') { // <-- define type for accountType
      const paymentResponse = await this.billingService.processPayment(signupResponse.uid, signupDto.creditCardDetails);
      if (!paymentResponse.success) {
        throw new Error('Signup failed: subscription payment failed.');
      }
    }

    this.logger.log(`createProfile: ${signupResponse.uid}, ${signupDto.email}, ${signupDto.accountType}`);
    await this.profileService.createProfile(signupResponse.uid, signupDto.accountType, signupDto.email);

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

  @Patch('user')
  async updateProfile(@Req() request: Request, @Body() updateProfileDto: UpdateProfileDto) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    const userResponse = await this.profileService.updateProfileByUid(uid, updateProfileDto.firstName, updateProfileDto.lastName);

    return userResponse;
  }

  @Get('invoices')
  async getAllInvoices(@Req() request: Request): Promise<InvoiceDto[]> {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    const invoicesResponse = await this.invoiceService.getAllInvoicesByUid(uid);

    return invoicesResponse;
  }

  // OBSOLETE, to be replaced by "store" API --->
  // @Get('bot/:botId')
  // async getBot(@Param('botId') botId: string) {
  //   const response = await this.botsService.getById(botId);
  //   return response;
  // }

  // @Get('bot')
  // async getAllBots() {
  //   const response = await this.botsService.getAll();
  //   return response;
  // }
  // <-------------------------------------------

  @Get('store/my-bots')
  async myBots(@Req() request: Request) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');

    const response = [
      { id: '1', name: 'mybot1' },
      { id: '2', name: 'mybot2' },
      { id: '3', name: 'mybot3' }
    ]
    return response;
  }

  @Get('store/bots')
  async getAllBots(@Req() request: Request) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');

    const response = [
      { id: '11', name: 'mybot11' },
      { id: '22', name: 'mybot22' },
      { id: '33', name: 'mybot33' }
    ]
    return response;
  }

  @Get('store/free-bots-count')
  async getFreeBotsAllowance(@Req() request: Request) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');

    // 1) GET profile, to get 'AccountType'
    // 2) GET store/my-bots/:userId // retrieve bot purchased by a given user
    // 3) Implement logic on gateway
    return 2;
  }

  @Post('store/bots/:botId')
  async buyBot(@Req() request: Request, @Param('botId') botId) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');

    return {
      success: true
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
