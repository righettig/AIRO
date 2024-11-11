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
import { BotBehaviourCompilerService, ValidateResult } from 'src/bot-behaviour-compiler/bot-behaviour-compiler.service';
import { BotBehavioursService } from 'src/bot-behaviours/bot-behaviours.service';
import { EventSimulationService } from 'src/event-simulation/event-simulation.service';
import { EventSubscriptionService } from 'src/event-subscription/event-subscription.service';
import { LeaderboardService, UserLeaderboardResponse } from 'src/leaderboard/leaderboard.service';
import { GetAllUiNotificationsResponse, UiNotificationsService } from 'src/ui-notifications/ui-notifications.service';
import { CreateBotBehaviourDto } from './models/create-bot-behaviour.dto';
import { ValidateBotBehaviourDto } from './models/validate-bot-behaviour.dto';
import { UpdateBotBehaviourDto } from './models/update-bot-behaviour.dto';
import { SubscribeToEventDto } from './models/subscribe-to-event.dto';
import { UnsubscribeFromEventDto } from './models/unsubscribe-from-event.dto';
import { UserLeaderboardResponseDto } from './models/leaderboard.response.dto';

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
  let eventSimulationService: EventSimulationService;
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
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: BotBehaviourCompilerService,
          useValue: {
            compile: jest.fn(),
            validate: jest.fn(),
          },
        },
        {
          provide: EventSubscriptionService,
          useValue: {
            subscribeToEvent: jest.fn(),
            unsubscribeFromEvent: jest.fn(),
            getSubscribedEventsByUserId: jest.fn(),
          },
        },
        {
          provide: EventSimulationService,
          useValue: {
            getSimulationStatusById: jest.fn(),
          },
        },
        {
          provide: UiNotificationsService,
          useValue: {
            getAll: jest.fn(),
            markAsRead: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: LeaderboardService,
          useValue: {
            getUserLeaderboardByUid: jest.fn(),
            getUserLeaderboardTopN: jest.fn(),
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
    eventSimulationService = module.get<EventSimulationService>(EventSimulationService);
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
        { id: '1', name: 'Bot1', price: 100, health: 111, attack: 11, defense: 1 }, 
        { id: '2', name: 'Bot2', price: 200, health: 111, attack: 11, defense: 1 },
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
        { id: '1', name: 'Bot1', price: 100, health: 111, attack: 11, defense: 1 },
        { id: '2', name: 'Bot2', price: 200, health: 111, attack: 11, defense: 1 },
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
    it('should create a bot behaviour and compile it', async () => {
      // Arrange
      const mockResponse = 'abc-123-456';
      
      jest.spyOn(botBehavioursService, 'create').mockResolvedValue(mockResponse);
      jest.spyOn(botBehaviourCompilerService, 'compile').mockResolvedValue(undefined);
  
      // Act
      const uid = 'user123';
      const mockRequest = { userId: uid } as CustomRequest;
      const createBotBehaviourDto: CreateBotBehaviourDto = { name: 'Test Bot', code: 'console.log("Hello World")' };

      const response = await controller.createBotBehaviour(mockRequest, createBotBehaviourDto);
  
      // Assert
      expect(botBehavioursService.create).toHaveBeenCalledWith(uid, createBotBehaviourDto.name, createBotBehaviourDto.code);
      expect(botBehaviourCompilerService.compile).toHaveBeenCalledWith(mockResponse, createBotBehaviourDto.code);
      expect(response).toEqual(mockResponse);
    });

    it('should throw an error if bot creation fails', async () => {
      // Arrange
      const uid = 'user123';
      const createBotBehaviourDto: CreateBotBehaviourDto = { name: 'Test Bot', code: 'console.log("Hello World")' };
      const mockRequest = { userId: uid } as CustomRequest;
  
      jest.spyOn(botBehavioursService, 'create').mockRejectedValue(new Error('Creation failed'));
  
      // Act & Assert
      await expect(controller.createBotBehaviour(mockRequest, createBotBehaviourDto)).rejects.toThrow('Creation failed');
      expect(botBehavioursService.create).toHaveBeenCalledWith(uid, createBotBehaviourDto.name, createBotBehaviourDto.code);
      expect(botBehaviourCompilerService.compile).not.toHaveBeenCalled();
    });

    it('should throw an error if compilation fails', async () => {
      // Arrange
      const uid = 'user123';
      const createBotBehaviourDto: CreateBotBehaviourDto = { name: 'Test Bot', code: 'console.log("Hello World")' };
      const mockRequest = { userId: uid } as CustomRequest;
      const mockResponse = 'abc-123-456';
  
      jest.spyOn(botBehavioursService, 'create').mockResolvedValue(mockResponse);
      jest.spyOn(botBehaviourCompilerService, 'compile').mockRejectedValue(new Error('Compilation failed'));
  
      // Act & Assert
      await expect(controller.createBotBehaviour(mockRequest, createBotBehaviourDto)).rejects.toThrow('Compilation failed');
      expect(botBehavioursService.create).toHaveBeenCalledWith(uid, createBotBehaviourDto.name, createBotBehaviourDto.code);
      expect(botBehaviourCompilerService.compile).toHaveBeenCalledWith(mockResponse, createBotBehaviourDto.code);
    });
  });
  
  describe('validateBotBehaviour', () => {
    it('should return validation result when validation is successful', async () => {
      // Arrange
      const botBehaviourId = '123';
      const validateBotBehaviourDto: ValidateBotBehaviourDto = { code: 'some bot code' };
      const expectedResponse: ValidateResult = { success: true, errors: [] };
      jest.spyOn(botBehaviourCompilerService, 'validate').mockResolvedValue(expectedResponse);
  
      // Act
      const result = await controller.validateBotBehaviour(botBehaviourId, validateBotBehaviourDto);
  
      // Assert
      expect(botBehaviourCompilerService.validate).toHaveBeenCalledWith(botBehaviourId, validateBotBehaviourDto.code);
      expect(result).toEqual(expectedResponse);
    });
  });
  
  describe('updateBotBehaviour', () => {
    it('should update bot behaviour and compile successfully', async () => {
      // Arrange
      const botBehaviourId = '123';
      const uid = 'testUserId';
      const updateBotBehaviourDto: UpdateBotBehaviourDto = { name: 'New Bot Name', code: 'updated code' };
      
      const request = { userId: uid } as CustomRequest;
  
      // Act
      await controller.updateBotBehaviour(request, botBehaviourId, updateBotBehaviourDto);
  
      // Assert
      expect(botBehavioursService.update).toHaveBeenCalledWith(uid, botBehaviourId, updateBotBehaviourDto.name, updateBotBehaviourDto.code);
      expect(botBehaviourCompilerService.compile).toHaveBeenCalledWith(botBehaviourId, updateBotBehaviourDto.code);
    });
  });
  
  describe('deleteBotBehaviour', () => {
    it('should delete bot behaviour successfully', async () => {
      // Arrange
      const botBehaviourId = '123';
      const uid = 'testUserId';
  
      const request = { userId: uid } as CustomRequest;
  
      // Act
      await controller.deleteBotBehaviour(request, botBehaviourId);
  
      // Assert
      expect(botBehavioursService.delete).toHaveBeenCalledWith(uid, botBehaviourId);
    });
  });
  
  describe('getUiNotifications', () => {
  });
  
  describe('getAllUiNotifications', () => {
    it('should retrieve all UI notifications successfully', async () => {
      // Arrange
      const uid = 'testUserId';
      const mockNotifications = [
        { 
          notificationId: '1',
          type: 'general',
          message: 'Test notification',
          createdAt: new Date(),
          read: false,
        } 
      ] as GetAllUiNotificationsResponse;

      // Mock the service's getAll method
      jest.spyOn(uiNotificationsService, 'getAll').mockResolvedValue(mockNotifications);
  
      // Mock the request object with a userId property
      const request = { userId: uid } as CustomRequest;
  
      // Act
      const result = await controller.getAllUiNotifications(request);
  
      // Assert
      expect(uiNotificationsService.getAll).toHaveBeenCalledWith(uid);
      expect(result).toEqual(mockNotifications);
    });

    it('should throw an error if uiNotificationsService.getAll fails', async () => {
      // Arrange
      const uid = 'testUserId';
      const request = { userId: uid } as CustomRequest;
  
      jest.spyOn(uiNotificationsService, 'getAll').mockRejectedValue(new Error('Service failed'));
  
      // Act & Assert
      await expect(controller.getAllUiNotifications(request)).rejects.toThrow('Service failed');
      expect(uiNotificationsService.getAll).toHaveBeenCalledWith(uid);
    });
  });

  describe('markAsRead', () => {
    it('should mark the notification as read successfully', async () => {
      // Arrange
      const uid = 'testUserId';
      const notificationId = 'notification123';
      const request = { userId: uid } as CustomRequest;
  
      // Act
      await controller.markAsRead(request, notificationId);
  
      // Assert
      expect(uiNotificationsService.markAsRead).toHaveBeenCalledWith(uid, notificationId);
    });
  
    it('should throw an error if uiNotificationsService.markAsRead fails', async () => {
      // Arrange
      const uid = 'testUserId';
      const notificationId = 'notification123';
      const request = { userId: uid } as CustomRequest;
  
      // Mock markAsRead to throw an error
      jest.spyOn(uiNotificationsService, 'markAsRead').mockRejectedValue(new Error('Service failed'));
  
      // Act & Assert
      await expect(controller.markAsRead(request, notificationId)).rejects.toThrow('Service failed');
      expect(uiNotificationsService.markAsRead).toHaveBeenCalledWith(uid, notificationId);
    });
  });

  describe('deleteNotification', () => {
    it('should delete the notification successfully', async () => {
      // Arrange
      const uid = 'testUserId';
      const notificationId = 'notification123';
      const request = { userId: uid } as CustomRequest;
  
      // Act
      await controller.deleteNotification(request, notificationId);
  
      // Assert
      expect(uiNotificationsService.delete).toHaveBeenCalledWith(uid, notificationId);
    });
  
    it('should throw an error if uiNotificationsService.delete fails', async () => {
      // Arrange
      const uid = 'testUserId';
      const notificationId = 'notification123';
      const request = { userId: uid } as CustomRequest;
  
      // Mock delete to throw an error
      jest.spyOn(uiNotificationsService, 'delete').mockRejectedValue(new Error('Service failed'));
  
      // Act & Assert
      await expect(controller.deleteNotification(request, notificationId)).rejects.toThrow('Service failed');
      expect(uiNotificationsService.delete).toHaveBeenCalledWith(uid, notificationId);
    });
  });

  describe('subscribeToEvent', () => {
    it('should subscribe to an event successfully', async () => {
      // Arrange
      const uid = 'testUserId';
      const subscribeToEventDto: SubscribeToEventDto = {
        eventId: 'event123',
        botId: 'bot456',
        botBehaviourId: 'behaviour789',
      };
      const request = { userId: uid } as CustomRequest;
      const expectedResponse = { success: true };
  
      jest.spyOn(eventSubscriptionService, 'subscribeToEvent').mockResolvedValue(expectedResponse);
  
      // Act
      const result = await controller.subscribeToEvent(request, subscribeToEventDto);
  
      // Assert
      expect(eventSubscriptionService.subscribeToEvent).toHaveBeenCalledWith(
        uid,
        subscribeToEventDto.eventId,
        subscribeToEventDto.botId,
        subscribeToEventDto.botBehaviourId
      );
      expect(result).toBe(expectedResponse);
    });
  
    it('should throw an error if eventSubscriptionService.subscribeToEvent fails', async () => {
      // Arrange
      const uid = 'testUserId';
      const subscribeToEventDto: SubscribeToEventDto = {
        eventId: 'event123',
        botId: 'bot456',
        botBehaviourId: 'behaviour789',
      };
      const request = { userId: uid } as CustomRequest;
  
      // Mock subscribeToEvent to throw an error
      jest.spyOn(eventSubscriptionService, 'subscribeToEvent').mockRejectedValue(new Error('Service failed'));
  
      // Act & Assert
      await expect(controller.subscribeToEvent(request, subscribeToEventDto)).rejects.toThrow('Service failed');
      expect(eventSubscriptionService.subscribeToEvent).toHaveBeenCalledWith(
        uid,
        subscribeToEventDto.eventId,
        subscribeToEventDto.botId,
        subscribeToEventDto.botBehaviourId
      );
    });
  });

  describe('unsubscribeFromEvent', () => {
    it('should unsubscribe from an event successfully', async () => {
      // Arrange
      const uid = 'testUserId';
      const unsubscribeFromEventDto: UnsubscribeFromEventDto = {
        eventId: 'event123',
      };
      const request = { userId: uid } as CustomRequest;
      const expectedResponse = { success: true };
  
      jest.spyOn(eventSubscriptionService, 'unsubscribeFromEvent').mockResolvedValue(expectedResponse);
  
      // Act
      const result = await controller.unsubscribeFromEvent(request, unsubscribeFromEventDto);
  
      // Assert
      expect(eventSubscriptionService.unsubscribeFromEvent).toHaveBeenCalledWith(
        uid,
        unsubscribeFromEventDto.eventId
      );
      expect(result).toBe(expectedResponse);
    });
  
    it('should throw an error if eventSubscriptionService.unsubscribeFromEvent fails', async () => {
      // Arrange
      const uid = 'testUserId';
      const unsubscribeFromEventDto: UnsubscribeFromEventDto = {
        eventId: 'event123',
      };
      const request = { userId: uid } as CustomRequest;
  
      jest.spyOn(eventSubscriptionService, 'unsubscribeFromEvent').mockRejectedValue(new Error('Service failed'));
  
      // Act & Assert
      await expect(controller.unsubscribeFromEvent(request, unsubscribeFromEventDto)).rejects.toThrow('Service failed');
      expect(eventSubscriptionService.unsubscribeFromEvent).toHaveBeenCalledWith(
        uid,
        unsubscribeFromEventDto.eventId
      );
    });
  });

  describe('getSubscribedEventsByUserId', () => {
    it('should return subscribed events by user ID', async () => {
      const uid = 'testUserId';
      const request = { userId: uid } as CustomRequest;
      const expectedResponse = [{ eventId: 'event123' }];
  
      jest.spyOn(eventSubscriptionService, 'getSubscribedEventsByUserId').mockResolvedValue(expectedResponse);
  
      const result = await controller.getSubscribedEventsByUserId(request);
  
      expect(eventSubscriptionService.getSubscribedEventsByUserId).toHaveBeenCalledWith(uid);
      expect(result).toBe(expectedResponse);
    });
  
    it('should throw an error if eventSubscriptionService.getSubscribedEventsByUserId fails', async () => {
      const uid = 'testUserId';
      const request = { userId: uid } as CustomRequest;
  
      jest.spyOn(eventSubscriptionService, 'getSubscribedEventsByUserId').mockRejectedValue(new Error('Service failed'));
  
      await expect(controller.getSubscribedEventsByUserId(request)).rejects.toThrow('Service failed');
    });
  });

  describe('getSimulationStatus', () => {
    it('should return simulation status by event ID and skip value', async () => {
      const eventId = 'event123';
      const skip = 5;
      const expectedResponse = { status: 'running' };
  
      jest.spyOn(eventSimulationService, 'getSimulationStatusById').mockResolvedValue(expectedResponse);
  
      const result = await controller.getSimulationStatus(eventId, skip);
  
      expect(eventSimulationService.getSimulationStatusById).toHaveBeenCalledWith(eventId, skip);
      expect(result).toBe(expectedResponse);
    });
  
    it('should throw an error if eventSimulationService.getSimulationStatusById fails', async () => {
      const eventId = 'event123';
      const skip = 5;
  
      jest.spyOn(eventSimulationService, 'getSimulationStatusById').mockRejectedValue(new Error('Service failed'));
  
      await expect(controller.getSimulationStatus(eventId, skip)).rejects.toThrow('Service failed');
    });
  });

  describe('getLeaderboardByUserId', () => {
    it('should return leaderboard data by user ID', async () => {
      const uid = 'testUserId';
      const request = { userId: uid } as CustomRequest;
      const expectedResponse = {
        id: uid,
        wins: 3,
        losses: 1,
        totalEvents: 4
      };
  
      jest.spyOn(leaderboardService, 'getUserLeaderboardByUid').mockResolvedValue(expectedResponse);
  
      const result = await controller.getLeaderboardByUserId(request);
  
      expect(leaderboardService.getUserLeaderboardByUid).toHaveBeenCalledWith(uid);
      expect(result).toBe(expectedResponse);
    });
  
    it('should throw an error if leaderboardService.getUserLeaderboardByUid fails', async () => {
      const uid = 'testUserId';
      const request = { userId: uid } as CustomRequest;
  
      jest.spyOn(leaderboardService, 'getUserLeaderboardByUid').mockRejectedValue(new Error('Service failed'));
  
      await expect(controller.getLeaderboardByUserId(request)).rejects.toThrow('Service failed');
    });
  });

  describe('getLeaderboardTopN', () => {
    it('should return top N leaderboard data with full names', async () => {
      const n = 3;
      const leaderboardEntries = [
        {
          id: 'user1',
          wins: 3,
          losses: 1,
          totalEvents: 4
        },
        { 
          id: 'user2',
          wins: 1,
          losses: 3,
          totalEvents: 4
        },
      ];
      const expectedResponse: UserLeaderboardResponseDto[] = [
        {
          id: 'user1',
          fullName: 'firstName1 lastName1',
          wins: 3,
          losses: 1,
          totalEvents: 4
        },
        { 
          id: 'user2',
          fullName: 'firstName2 lastName2',
          wins: 1,
          losses: 3,
          totalEvents: 4
        },
      ];
  
      jest.spyOn(leaderboardService, 'getUserLeaderboardTopN').mockResolvedValue(leaderboardEntries);
      jest
        .spyOn(profileService, 'getProfileByUid')
        .mockImplementation((uid: string) =>
          Promise.resolve(
            uid === 'user1' ? { 
              uid: 'user1',
              firstName: 'firstName1', 
              lastName: 'lastName1',
              accountType: 'free',
            } : 
            { 
              uid: 'user2',
              firstName: 'firstName2', 
              lastName: 'lastName2',
              accountType: 'free',
            }
          )
        );
  
      const result = await controller.getLeaderboardTopN(n);
  
      expect(leaderboardService.getUserLeaderboardTopN).toHaveBeenCalledWith(n);
      expect(profileService.getProfileByUid).toHaveBeenCalledTimes(2);
      expect(result).toEqual(expectedResponse);
    });
  
    it('should throw an error if leaderboardService.getUserLeaderboardTopN fails', async () => {
      const n = 3;
  
      jest.spyOn(leaderboardService, 'getUserLeaderboardTopN').mockRejectedValue(new Error('Service failed'));
  
      await expect(controller.getLeaderboardTopN(n)).rejects.toThrow('Service failed');
    });
  });
});
