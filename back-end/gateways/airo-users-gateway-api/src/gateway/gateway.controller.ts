import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ProfileService } from 'src/profile/profile.service';
import { LoginDto } from 'src/gateway/models/login.dto';
import { SignupDto } from 'src/gateway/models/signup.dto';
import { SignupResponseDto } from './models/signup.response.dto';
import { LoginResponseDto } from './models/login.response.dto';
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
import { SkipAuth } from 'src/common/skip-auth.decorator';

export interface CustomRequest extends Request { userId: string; email: string }

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
    private readonly leaderboardService: LeaderboardService,
  ) { }

  @Post('signup')
  @SkipAuth() 
  async signup(@Body() signupDto: SignupDto) {
    this.logger.log(`signup: ${JSON.stringify(signupDto)}`);
    const signupResponse = await this.authService.signup(signupDto.email, signupDto.password);

    if (signupDto.accountType === 'pro') {
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
  @SkipAuth() 
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
  @SkipAuth()
  async logout() {
    await this.authService.logout();
  }

  @Post('refresh-token')
  @SkipAuth()
  async refreshToken() {
    const response = await this.authService.refreshToken();
    return response;
  }

  @Get('user')
  async getUser(@Req() request: CustomRequest) {
    const uid = request.userId;
    const userResponse = await this.profileService.getProfileByUid(uid);

    const email = request.email;
    const userRoleResponse = await this.authService.getUserRole(email);

    return {
      ...userResponse,
      ...userRoleResponse
    };
  }

  @Patch('user')
  async updateProfile(@Req() request: CustomRequest, @Body() updateProfileDto: UpdateProfileDto) {
    const uid = request.userId;
    const userResponse = await this.profileService.updateProfileByUid(uid, updateProfileDto.firstName, updateProfileDto.lastName);

    return userResponse;
  }

  @Get('invoices')
  async getAllInvoices(@Req() request: CustomRequest): Promise<InvoiceDto[]> {
    const uid = request.userId;
    const invoicesResponse = await this.invoiceService.getAllInvoicesByUid(uid);

    return invoicesResponse;
  }

  @Get('events')
  async getAllEvents() {
    const response = await this.eventsService.getAll();
    return response;
  }

  @Get('store/my-bots')
  async myBots(@Req() request: CustomRequest) {
    const uid = request.userId;

    const botIds = await this.purchaseService.getAll(uid);
    const bots = await this.botsService.getByIds(botIds);

    return bots;
  }

  @Get('store/bots')
  async getAllBots(@Req() request: CustomRequest) {
    // TODO: userId could be used in future to get user-specific prices/promotions
    // or it might not be needed! Please cleanup if that's the case!
    const uid = request.userId;

    const response = await this.botsService.getAll();
    return response;
  }

  @Get('store/free-bots-count')
  async getFreeBotsAllowance(@Req() request: CustomRequest) {
    const uid = request.userId;

    const profile = await this.profileService.getProfileByUid(uid);
    const botIds = await this.purchaseService.getAll(uid);

    const freeBotsAllowance = (profile.accountType == 'pro' ? 3 : 1) - botIds.length;
    return freeBotsAllowance;
  }

  @Post('store/bots/:botId')
  async buyBot(@Req() request: CustomRequest, @Param('botId') botId: string) {
    const uid = request.userId;

    try {
      await this.purchaseService.purchase(uid, botId);
      return { success: true };
    }
    catch {
      return { success: false };
    }
  }

  @Get('bot-behaviours')
  async getAllBotBehaviours(@Req() request: CustomRequest) {
    const uid = request.userId;
    const response = await this.botBehavioursService.getAllByUserId(uid);

    return response;
  }

  @Post('bot-behaviours')
  async createBotBehaviour(@Req() request: CustomRequest, @Body() body: CreateBotBehaviourDto) {
    const uid = request.userId;
    const response = await this.botBehavioursService.create(uid, body.name, body.code);
    
    await this.botBehaviourCompilerService.compile(response, body.code);

    return response;
  }

  @Post('bot-behaviours/:botBehaviourId/validate')
  async validateBotBehaviour(
    @Param('botBehaviourId') botBehaviourId: string, 
    @Body() validateBotBehaviourDto: ValidateBotBehaviourDto): Promise<ValidateResult> {
    const response = await this.botBehaviourCompilerService.validate(botBehaviourId, validateBotBehaviourDto.code);

    return response;
  }

  @Put('bot-behaviours/:botBehaviourId')
  async updateBotBehaviour(
    @Req() request: CustomRequest, 
    @Param('botBehaviourId') botBehaviourId: string, 
    @Body() updateBotBehaviourDto: UpdateBotBehaviourDto): Promise<void> {
    const uid = request.userId;
    
    await this.botBehavioursService.update(uid, botBehaviourId, updateBotBehaviourDto.name, updateBotBehaviourDto.code);
    await this.botBehaviourCompilerService.compile(botBehaviourId, updateBotBehaviourDto.code);
  }

  @Delete('bot-behaviours/:botBehaviourId')
  async deleteBotBehaviour(@Req() request: CustomRequest, @Param('botBehaviourId') botBehaviourId: string): Promise<void> {
    const uid = request.userId;
    await this.botBehavioursService.delete(uid, botBehaviourId);
  }
  
  @Get('ui-notifications')
  async getUiNotifications(@Req() request: CustomRequest): Promise<GetAllUiNotificationsResponse> {
    const uid = request.userId;
    const response = await this.uiNotificationsService.getAll(uid);

    const last5Notifications = response.slice(0, 5);
    return last5Notifications;
  }

  @Get('ui-notifications/all')
  async getAllUiNotifications(@Req() request: CustomRequest): Promise<GetAllUiNotificationsResponse> {
    const uid = request.userId;
    const response = await this.uiNotificationsService.getAll(uid);

    return response;
  }

  @Patch('ui-notifications/:notificationId')
  async markAsRead(@Req() request: CustomRequest, @Param('notificationId') notificationId: string): Promise<void> {
    const uid = request.userId;
    await this.uiNotificationsService.markAsRead(uid, notificationId);
  }

  @Delete('ui-notifications/:notificationId')
  async deleteNotification(@Req() request: CustomRequest, @Param('notificationId') notificationId: string): Promise<void> {
    const uid = request.userId;
    await this.uiNotificationsService.delete(uid, notificationId);
  }

  @Post('event-subscription')
  async subscribeToEvent(@Req() request: CustomRequest, @Body() body: SubscribeToEventDto) {
    const uid = request.userId;
    const response = await this.eventSubscriptionService.subscribeToEvent(uid, body.eventId, body.botId, body.botBehaviourId);

    return response;
  }

  @Delete('event-subscription')
  async unsubscribeFromEvent(@Req() request: CustomRequest, @Body() body: UnsubscribeFromEventDto) {
    const uid = request.userId;
    const response = await this.eventSubscriptionService.unsubscribeFromEvent(uid, body.eventId);

    return response;
  }

  @Get('event-subscription')
  async getSubscribedEventsByUserId(@Req() request: CustomRequest) {
    const uid = request.userId;
    const response = await this.eventSubscriptionService.getSubscribedEventsByUserId(uid);

    return response;
  }

  @Get('simulation/:eventId')
  async getSimulationStatus(@Param('eventId') eventId: string, @Query('skip') skip: number) {
    const response = await this.eventSimulationservice.getSimulationStatusById(eventId, skip);
    return response;
  }

  @Get('leaderboard')
  async getLeaderboardByUserId(@Req() request: CustomRequest) {
    const uid = request.userId;
    const response = await this.leaderboardService.getUserLeaderboardByUid(uid);

    return response;
  }

  @Get('leaderboard/top/:n')
  async getLeaderboardTopN(@Param('n') n: number): Promise<UserLeaderboardResponseDto[]> {
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
}
