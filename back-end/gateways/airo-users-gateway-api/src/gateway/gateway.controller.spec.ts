import { Test, TestingModule } from '@nestjs/testing';
import { CustomRequest, GatewayController } from './gateway.controller';
import { ProfileGetProfileByUidResponse, ProfileService } from '../profile/profile.service';
import { BillingService } from '../billing/billing.service';
import { InvoiceService } from '../invoice/invoice.service';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './models/login.dto';
import { SignupDto } from './models/signup.dto';
import { UpdateProfileDto } from 'src/profile/models/update-profile-dto';
import { BotsService } from 'src/bots/bots.service';
import { PurchaseService } from 'src/purchase/purchase.service';
import { EventsService } from 'src/events/events.service';
import { BotBehaviourCompilerService } from 'src/bot-behaviour-compiler/bot-behaviour-compiler.service';
import { BotBehavioursService } from 'src/bot-behaviours/bot-behaviours.service';
import { EventSimulationService } from 'src/event-simulation/event-simulation.service';
import { EventSubscriptionService } from 'src/event-subscription/event-subscription.service';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';
import { UiNotificationsService } from 'src/ui-notifications/ui-notifications.service';
import { CreateBotBehaviourDto } from './models/create-bot-behaviour.dto';
import { ValidateBotBehaviourDto } from './models/validate-bot-behaviour.dto';
import { UpdateBotBehaviourDto } from './models/update-bot-behaviour.dto';
import { SubscribeToEventDto } from './models/subscribe-to-event.dto';
import { UnsubscribeFromEventDto } from './models/unsubscribe-from-event.dto';

describe('GatewayController', () => {
  let controller: GatewayController;

  let authService: AuthService;
  let profileService: ProfileService;
  let billingService: BillingService;
  let invoiceService: InvoiceService;
  let botsService: BotsService;
  let purchaseService: PurchaseService;
  let eventsService: EventsService;
  let botBehavioursService: BotBehavioursService;
  let botBehaviourCompilerService: BotBehaviourCompilerService;
  let eventSubscriptionService: EventSubscriptionService;
  let eventSimulationservice: EventSimulationService;
  let uiNotificationsService: UiNotificationsService;
  let leaderboardService: LeaderboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            refreshToken: jest.fn(),
            getUserRole: jest.fn(),
          },
        },
        {
          provide: ProfileService,
          useValue: {
            createProfile: jest.fn(),
            getProfileByUid: jest.fn(),
            updateProfileByUid: jest.fn(),
          },
        },
        {
          provide: BillingService,
          useValue: {
            processPayment: jest.fn(),
          },
        },
        {
          provide: InvoiceService,
          useValue: {
            getAllInvoicesByUid: jest.fn(),
          },
        },
        {
          provide: BotsService,
          useValue: {
            getByIds: jest.fn(),
            getAll: jest.fn(),
          },
        },
        {
          provide: PurchaseService,
          useValue: {
            getAll: jest.fn(),
            purchase: jest.fn()
          },
        },
        {
          provide: EventsService,
          useValue: {
            getAll: jest.fn(),
            getById: jest.fn()
          },
        },
        {
          provide: BotBehavioursService,
          useValue: {
            getAllByUserId: jest.fn(),
          },
        },
        {
          provide: BotBehaviourCompilerService,
          useValue: {
          },
        },
        {
          provide: EventSubscriptionService,
          useValue: {
          },
        },
        {
          provide: EventSimulationService,
          useValue: {
          },
        },
        {
          provide: UiNotificationsService,
          useValue: {
          },
        },
        {
          provide: LeaderboardService,
          useValue: {
          },
        },
      ],
    }).compile();

    controller = module.get<GatewayController>(GatewayController);
    authService = module.get<AuthService>(AuthService);
    profileService = module.get<ProfileService>(ProfileService);
    billingService = module.get<BillingService>(BillingService);
    invoiceService = module.get<InvoiceService>(InvoiceService);
    botsService = module.get<BotsService>(BotsService);
    purchaseService = module.get<PurchaseService>(PurchaseService);
    eventsService = module.get<EventsService>(EventsService);
    botBehavioursService = module.get<BotBehavioursService>(BotBehavioursService);
    botBehaviourCompilerService = module.get<BotBehaviourCompilerService>(BotBehaviourCompilerService);
    eventSubscriptionService = module.get<EventSubscriptionService>(EventSubscriptionService);
    eventSimulationservice = module.get<EventSimulationService>(EventSimulationService);
    uiNotificationsService = module.get<UiNotificationsService>(UiNotificationsService);
    leaderboardService = module.get<LeaderboardService>(LeaderboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup and profileService.createProfile', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'password',
        accountType: 'free',
        creditCardDetails: '1234-5678-9101',
      };
      const signupResponse = { uid: '123', token: 'jwt-token' };
      jest.spyOn(authService, 'signup').mockResolvedValue(signupResponse);
      jest.spyOn(profileService, 'createProfile').mockResolvedValue(undefined);

      const result = await controller.signup(signupDto);

      expect(authService.signup).toHaveBeenCalledWith(signupDto.email, signupDto.password);
      expect(profileService.createProfile).toHaveBeenCalledWith(signupResponse.uid, signupDto.accountType, signupDto.email);
      expect(result).toEqual({
        uid: signupResponse.uid,
        token: signupResponse.token,
        firstName: '',
        lastName: '',
        accountType: signupDto.accountType,
      });
    });

    it('should call billingService.processPayment for pro accounts', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'password',
        accountType: 'pro',
        creditCardDetails: '1234-5678-9101',
      };
      const signupResponse = { uid: '123', token: 'jwt-token' };
      const paymentResponse = { success: true };
      jest.spyOn(authService, 'signup').mockResolvedValue(signupResponse);
      jest.spyOn(billingService, 'processPayment').mockResolvedValue(paymentResponse);

      const result = await controller.signup(signupDto);

      expect(billingService.processPayment).toHaveBeenCalledWith(signupResponse.uid, signupDto.creditCardDetails);
      expect(result).toEqual({
        uid: signupResponse.uid,
        token: signupResponse.token,
        firstName: '',
        lastName: '',
        accountType: signupDto.accountType,
      });
    });

    it('should throw an error if payment fails for pro accounts', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'password',
        accountType: 'pro',
        creditCardDetails: '1234-5678-9101',
      };
      const signupResponse = { uid: '123', token: 'jwt-token' };
      const paymentResponse = { success: false };
      jest.spyOn(authService, 'signup').mockResolvedValue(signupResponse);
      jest.spyOn(billingService, 'processPayment').mockResolvedValue(paymentResponse);

      await expect(controller.signup(signupDto)).rejects.toThrow('Signup failed: subscription payment failed.');
    });
  });

  describe('login', () => {
    it('should call authService.login and profileService.getProfileByUid', async () => {
      const loginResponse = { 
        uid: '123', 
        token: 'jwt-token' 
      };

      const profileResponse: ProfileGetProfileByUidResponse = {
        uid: '123', 
        firstName: 'John', 
        lastName: 'Doe', 
        accountType: 'free' 
      };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse);
      jest.spyOn(profileService, 'getProfileByUid').mockResolvedValue(profileResponse);

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(profileService.getProfileByUid).toHaveBeenCalledWith(loginResponse.uid);
      expect(result).toEqual({
        uid: loginResponse.uid,
        token: loginResponse.token,
        firstName: profileResponse.firstName,
        lastName: profileResponse.firstName,
        accountType: profileResponse.accountType,
      });
    });
  });

  describe('logout', () => {
    it('should call authService.logout', async () => {
      jest.spyOn(authService, 'logout').mockResolvedValue(undefined);

      await controller.logout();

      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshToken', async () => {
      const refreshTokenResponse = { token: 'new-jwt-token' };
      jest.spyOn(authService, 'refreshToken').mockResolvedValue(refreshTokenResponse);

      const result = await controller.refreshToken();

      expect(authService.refreshToken).toHaveBeenCalled();
      expect(result).toEqual(refreshTokenResponse);
    });
  });

  describe('getUser', () => {
    it('should return user data from token and services', async () => {
      const mockRequest = { userId: '123', email: 'user@mail.com' } as CustomRequest;

      const userResponse: ProfileGetProfileByUidResponse = { 
        uid: '123', 
        firstName: 'John', 
        lastName: 'Doe', 
        accountType: 'free'
      };

      const userRoleResponse = { role: 'admin' };

      jest.spyOn(profileService, 'getProfileByUid').mockResolvedValue(userResponse);
      jest.spyOn(authService, 'getUserRole').mockResolvedValue(userRoleResponse);

      const result = await controller.getUser(mockRequest);

      expect(profileService.getProfileByUid).toHaveBeenCalledWith(mockRequest.userId);
      expect(authService.getUserRole).toHaveBeenCalledWith(mockRequest.email);
      expect(result).toEqual({ ...userResponse, ...userRoleResponse });
    });
  });

  describe('updateProfile', () => {
    it('should update the user profile successfully', async () => {
      const uid = '123';
      const mockRequest = { userId: uid } as any;

      const updateProfileDto: UpdateProfileDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      
      const userResponse: ProfileGetProfileByUidResponse = { uid, firstName: 'John', lastName: 'Doe', accountType: 'free' };
  
      jest.spyOn(profileService, 'updateProfileByUid').mockResolvedValue(userResponse);
  
      const result = await controller.updateProfile(mockRequest, updateProfileDto);
  
      expect(profileService.updateProfileByUid).toHaveBeenCalledWith(uid, updateProfileDto.firstName, updateProfileDto.lastName);
      expect(result).toEqual(userResponse);
    });
  }); 

  describe('getAllInvoices', () => {
    it('should return all invoices for the user', async () => {
      const mockRequest = { userId: '123' } as CustomRequest;

      const invoicesResponse = [
        { uid: 'invoice1', amount: 100, createdAt: new Date() }, 
        { uid: 'invoice2', amount: 200, createdAt: new Date() }
      ];

      jest.spyOn(invoiceService, 'getAllInvoicesByUid').mockResolvedValue(invoicesResponse);

      const result = await controller.getAllInvoices(mockRequest);

      expect(invoiceService.getAllInvoicesByUid).toHaveBeenCalledWith(mockRequest.userId);
      expect(result).toEqual(invoicesResponse);
    });
  });

  describe('getAllEvents', () => {
    it('should return all events', async () => {
      const response = [
        { id: 'event1', name: "event 1", description: "this is the first event" }, 
      ];

      jest.spyOn(eventsService, 'getAll').mockResolvedValue(response);

      const result = await controller.getAllEvents();

      expect(eventsService.getAll).toHaveBeenCalled();
      expect(result).toEqual(response);
    });
  });

  describe('myBots', () => {
    it('should return the bots owned by the user', async () => {
      const mockRequest = { userId: '123'} as CustomRequest;

      const botIds = ['1', '2'];
      const bots = [
        { id: '1', name: 'Bot1', price: '100' }, 
        { id: '2', name: 'Bot2', price: '200' }
      ];
      
      jest.spyOn(purchaseService, 'getAll').mockResolvedValue(botIds);
      jest.spyOn(botsService, 'getByIds').mockResolvedValue(bots);

      const result = await controller.myBots(mockRequest);

      expect(purchaseService.getAll).toHaveBeenCalledWith(mockRequest.userId);
      expect(botsService.getByIds).toHaveBeenCalledWith(botIds);
      expect(result).toEqual(bots);
    });
  });

  describe('getAllBots', () => {
    it('should return all available bots', async () => {
      const mockRequest = { } as CustomRequest;
      
      const bots = [
        { id: '1', name: 'Bot1', price: '100' }, 
        { id: '2', name: 'Bot2', price: '200' }
      ];
      
      jest.spyOn(botsService, 'getAll').mockResolvedValue(bots);
      const result = await controller.getAllBots(mockRequest);

      expect(botsService.getAll).toHaveBeenCalled();
      expect(result).toEqual(bots);
    });
  });

  describe('getFreeBotsAllowance', () => {
    const mockRequest = { } as CustomRequest;

    it('should return the remaining free bots allowance when account is pro', async () => {
      const mockProfile = { accountType: 'pro' } as ProfileGetProfileByUidResponse;
      const botIds = ['1'];
      
      jest.spyOn(profileService, 'getProfileByUid').mockResolvedValue(mockProfile);
      jest.spyOn(purchaseService, 'getAll').mockResolvedValue(botIds);

      const result = await controller.getFreeBotsAllowance(mockRequest);

      expect(result).toEqual(2); // pro account type allows 3 bots, user owns 1
    });

    it('should return the remaining free bots allowance when account is free', async () => {
      const mockProfile = { accountType: 'free' } as ProfileGetProfileByUidResponse;
      const botIds = [];
      
      jest.spyOn(profileService, 'getProfileByUid').mockResolvedValue(mockProfile);
      jest.spyOn(purchaseService, 'getAll').mockResolvedValue(botIds);

      const result = await controller.getFreeBotsAllowance(mockRequest);

      expect(result).toEqual(1); // pro account type allows 1 bots, user owns 0
    });
  });

  describe('buyBot', () => {
    const mockRequest = { } as CustomRequest;

    it('should successfully buy a bot', async () => {
      jest.spyOn(purchaseService, 'purchase').mockResolvedValue(true);
      
      const botId = 'bot-123';
      const result = await controller.buyBot(mockRequest, botId);

      expect(result).toEqual({ success: true });
    });

    it('should fail to buy a bot', async () => {
      jest.spyOn(purchaseService, 'purchase').mockRejectedValue(new Error('Purchase failed'));
      
      const botId = 'bot-123';
      const result = await controller.buyBot(mockRequest, botId);

      expect(result).toEqual({ success: false });
    });
  });

  describe('getAllBotBehaviours', () => {
    const mockRequest = { } as CustomRequest;

    it('should return all bot behaviors', async () => {
      const botBehavioursResponse = [
        { id: 'behaviour1', name: 'Aggressive', code: 'behaviourCode1' },
        { id: 'behaviour2', name: 'Defensive', code: 'behaviourCode2' },
      ];
  
      jest.spyOn(botBehavioursService, 'getAllByUserId').mockResolvedValue(botBehavioursResponse);
  
      const result = await controller.getAllBotBehaviours(mockRequest);
  
      expect(botBehavioursService.getAllByUserId).toHaveBeenCalled();
      expect(result).toEqual(botBehavioursResponse);
    });
  
    it('should throw an error if there is an issue retrieving bot behaviors', async () => {
      jest.spyOn(botBehavioursService, 'getAllByUserId').mockRejectedValue(new Error('Unable to retrieve bot behaviors'));
  
      await expect(controller.getAllBotBehaviours(mockRequest)).rejects.toThrow('Unable to retrieve bot behaviors');
      expect(botBehavioursService.getAllByUserId).toHaveBeenCalled();
    });
  });

  describe('createBotBehaviour', () => {
  });
  
  describe('validateBotBehaviour', () => {
  });
  
  describe('updateBotBehaviour', () => {
  });
  
  describe('deleteBotBehaviour', () => {
  });
  
  describe('getUiNotifications', () => {
  });
  
  describe('getAllUiNotifications', () => {
  });

  describe('markAsRead', () => {
  });

  describe('deleteNotification', () => {
  });

  describe('subscribeToEvent', () => {
  });

  describe('unsubscribeFromEvent', () => {
  });

  describe('getSubscribedEventsByUserId', () => {
  });

  describe('getSimulationStatus', () => {
  });

  describe('getLeaderboardByUserId', () => {
  });

  describe('getLeaderboardTopN', () => {
  });
});
