import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
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
import { PurchaseService } from 'src/purchase/purchase.service';
import { EventsService } from 'src/events/events.service';
import { GetAllUiNotificationsResponse, UiNotificationsService } from 'src/ui-notifications/ui-notifications.service';
import { EventSimulationService } from 'src/event-simulation/event-simulation.service';
import { EventSubscriptionService } from 'src/event-subscription/event-subscription.service';
import { SubscribeToEventDto } from './models/subscribe-to-event.dto';
import { UnsubscribeFromEventDto } from './models/unsubscribe-from-event.dto';
import { BotBehavioursService } from 'src/bot-behaviours/bot-behaviours.service';
import { BotBehaviourCompilerService, ValidateResult } from 'src/bot-behaviour-compiler/bot-behaviour-compiler.service';
import { CreateBotBehaviourDto } from './models/create-bot-behaviour.dto';
import { UpdateBotBehaviourDto } from './models/update-bot-behaviour.dto';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';
import { UserLeaderboardResponseDto } from './models/leaderboard.response.dto';
import { ValidateBotBehaviourDto } from './models/validate-bot-behaviour.dto';

@Controller('gateway')
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
    private readonly billingService: BillingService,
    private readonly invoiceService: InvoiceService,
    private readonly botsService: BotsService,
    private readonly botBehavioursService: BotBehavioursService,
    private readonly botBehaviourCompilerService: BotBehaviourCompilerService,
    private readonly purchaseService: PurchaseService,
    private readonly eventsService: EventsService,
    private readonly eventSubscriptionService: EventSubscriptionService,
    private readonly eventSimulationservice: EventSimulationService,
    private readonly uiNotificationsService: UiNotificationsService,
    private readonly leaderboardService: LeaderboardService
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

  @Get('events')
  async getAllEvents(@Req() request: Request) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    // TODO: userId could be used in future to get user-specific prices/promotions
    // or it might not be needed! Please cleanup if that's the case!
    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');

    const response = await this.eventsService.getAll();
    return response;
  }

  @Get('store/my-bots')
  async myBots(@Req() request: Request) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');

    const botIds = await this.purchaseService.getAll(uid);
    const bots = await this.botsService.getByIds(botIds);

    return bots;
  }

  @Get('store/bots')
  async getAllBots(@Req() request: Request) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    // TODO: userId could be used in future to get user-specific prices/promotions
    // or it might not be needed! Please cleanup if that's the case!
    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');

    const response = await this.botsService.getAll();
    return response;
  }

  @Get('store/free-bots-count')
  async getFreeBotsAllowance(@Req() request: Request) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');

    const profile = await this.profileService.getProfileByUid(uid);
    const botIds = await this.purchaseService.getAll(uid);

    const freeBotsAllowance = (profile.accountType == 'pro' ? 3 : 1) - botIds.length;
    return freeBotsAllowance;
  }

  @Post('store/bots/:botId')
  async buyBot(@Req() request: Request, @Param('botId') botId) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');

    try {
      await this.purchaseService.purchase(uid, botId);
      return { success: true };
    }
    catch {
      return { success: false };
    }
  }

  @Get('bot-behaviours')
  async getAllBotBehaviours(@Req() request: Request) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    const response = await this.botBehavioursService.getAllByUserId(uid);

    return response;
  }

  @Post('bot-behaviours')
  async createBotBehaviour(@Req() request: Request, @Body() body: CreateBotBehaviourDto) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    const response = await this.botBehavioursService.create(uid, body.name, body.code);
    
    await this.botBehaviourCompilerService.compile(response, body.code);

    return response;
  }

  @Post('bot-behaviours/:botBehaviourId/validate')
  async validateBotBehaviour(
    @Req() request: Request, 
    @Param('botBehaviourId') botBehaviourId, 
    @Body() validateBotBehaviourDto: ValidateBotBehaviourDto): Promise<ValidateResult> {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const response = await this.botBehaviourCompilerService.validate(botBehaviourId, validateBotBehaviourDto.code);

    return response;
  }

  @Put('bot-behaviours/:botBehaviourId')
  async updateBotBehaviour(
    @Req() request: Request, 
    @Param('botBehaviourId') botBehaviourId, 
    @Body() updateBotBehaviourDto: UpdateBotBehaviourDto): Promise<void> {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    
    await this.botBehavioursService.update(uid, botBehaviourId, updateBotBehaviourDto.name, updateBotBehaviourDto.code);
    await this.botBehaviourCompilerService.compile(botBehaviourId, updateBotBehaviourDto.code);
  }

  @Delete('bot-behaviours/:botBehaviourId')
  async deleteBotBehaviour(@Req() request: Request, @Param('botBehaviourId') botBehaviourId: string): Promise<void> {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    await this.botBehavioursService.delete(uid, botBehaviourId);
  }
  
  @Get('ui-notifications')
  async getUiNotifications(@Req() request: Request): Promise<GetAllUiNotificationsResponse> {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    const response = await this.uiNotificationsService.getAll(uid);

    const last5Notifications = response.slice(0, 5);
    return last5Notifications;
  }

  @Get('ui-notifications/all')
  async getAllUiNotifications(@Req() request: Request): Promise<GetAllUiNotificationsResponse> {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    const response = await this.uiNotificationsService.getAll(uid);

    return response;
  }

  @Patch('ui-notifications/:notificationId')
  async markAsRead(@Req() request: Request, @Param('notificationId') notificationId: string): Promise<void> {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    await this.uiNotificationsService.markAsRead(uid, notificationId);
  }

  @Delete('ui-notifications/:notificationId')
  async deleteNotification(@Req() request: Request, @Param('notificationId') notificationId: string): Promise<void> {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    await this.uiNotificationsService.delete(uid, notificationId);
  }

  @Post('event-subscription')
  async subscribeToEvent(@Req() request: Request, @Body() body: SubscribeToEventDto) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    const response = await this.eventSubscriptionService.subscribeToEvent(uid, body.eventId, body.botId, body.botBehaviourId);

    return response;
  }

  @Delete('event-subscription')
  async unsubscribeFromEvent(@Req() request: Request, @Body() body: UnsubscribeFromEventDto) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    const response = await this.eventSubscriptionService.unsubscribeFromEvent(uid, body.eventId);

    return response;
  }

  @Get('event-subscription')
  async getSubscribedEventsByUserId(@Req() request: Request) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    const response = await this.eventSubscriptionService.getSubscribedEventsByUserId(uid);

    return response;
  }

  @Get('simulation/:eventId')
  async getSimulationStatus(@Req() request: Request, @Param('eventId') eventId: string, @Query('skip') skip: number) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const response = await this.eventSimulationservice.getSimulationStatusById(eventId, skip);
    return response;
  }

  @Get('leaderboard')
  async getLeaderboardByUserId(@Req() request: Request) {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const uid = this.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    const response = await this.leaderboardService.getUserLeaderboardByUid(uid);

    return response;
  }

  @Get('leaderboard/top/:n')
  async getLeaderboardTopN(@Req() request: Request, @Param('n') n: number): Promise<UserLeaderboardResponseDto[]> {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }

    const response = await this.leaderboardService.getUserLeaderboardTopN(n);

    const result: UserLeaderboardResponseDto[] = await Promise.all(
      response.map(async x => {
        const profile = await this.profileService.getProfileByUid(x.id);
        const fullName = `${profile.firstName} ${profile.lastName}`;
        return {
          ...x,
          fullName
        };
      })
    );

    return result;
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
