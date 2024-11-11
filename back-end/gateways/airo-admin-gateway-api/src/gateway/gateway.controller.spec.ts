import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { BotsService } from 'src/bots/bots.service';
import { EventsService } from 'src/events/events.service';
import { LoginDto } from '../auth/models/login.dto';
import { GatewayController } from './gateway.controller';
import { MapsService } from '@maps/maps.service';
import { EventSimulationService } from 'src/event-simulation/event-simulation.service';
import { EventSubscriptionService } from 'src/event-subscription/event-subscription.service';

describe('GatewayController', () => {
  let controller: GatewayController;
  let authService: AuthService;
  let botsService: BotsService;
  let eventsService: EventsService;
  let eventSubscriptionService: EventSubscriptionService;
  let eventSimulationService: EventSimulationService;
  let mapService: MapsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [
        {
          provide: BotsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getById: jest.fn(),
            getAll: jest.fn(),
          },
        },
        {
          provide: EventsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getById: jest.fn(),
            getAll: jest.fn(),
          },
        },
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
          provide: MapsService,
          useValue: {
          },
        },
      ],
    }).compile();

    controller = module.get<GatewayController>(GatewayController);
    authService = module.get<AuthService>(AuthService);
    botsService = module.get<BotsService>(BotsService);
    eventsService = module.get<EventsService>(EventsService);
    eventSubscriptionService = module.get<EventSubscriptionService>(EventSubscriptionService);
    eventSimulationService = module.get<EventSimulationService>(EventSimulationService);
    mapService = module.get<MapsService>(MapsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('auth', () => {
    describe('login', () => {
      it('should call authService.login and profileService.getProfileByUid', async () => {
        const loginDto: LoginDto = {
          email: 'test@example.com',
          password: 'password',
        };
        const loginResponse = { uid: '123', token: 'jwt-token' };

        jest.spyOn(authService, 'login').mockResolvedValue(loginResponse);

        const result = await controller.login(loginDto);

        expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
        expect(result).toEqual({
          uid: loginResponse.uid,
          token: loginResponse.token,
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
  });

  describe('bots', () => {
    describe('createBot', () => {
      it('should call botsService.create and return the created bot ID', async () => {
        const createBotDto = { name: 'TestBot', price: 100 };
        const createdBotId = 'bot-123';

        jest.spyOn(botsService, 'create').mockResolvedValue(createdBotId);

        const result = await controller.createBot(createBotDto);

        expect(botsService.create).toHaveBeenCalledWith(createBotDto.name, createBotDto.price);
        expect(result).toEqual(createdBotId);
      });
    });

    describe('updateBot', () => {
      it('should call botsService.update with correct data', async () => {
        const updateBotDto = { id: 'bot-123', name: 'UpdatedBot', price: 150 };

        jest.spyOn(botsService, 'update').mockResolvedValue(undefined);

        const result = await controller.updateBot(updateBotDto);

        expect(botsService.update).toHaveBeenCalledWith(updateBotDto.id, updateBotDto.name, updateBotDto.price);
        expect(result).toBeUndefined();
      });
    });

    describe('deleteBot', () => {
      it('should call botsService.delete and return undefined', async () => {
        const botId = 'bot-123';

        jest.spyOn(botsService, 'delete').mockResolvedValue(undefined);

        const result = await controller.deleteBot(botId);

        expect(botsService.delete).toHaveBeenCalledWith(botId);
        expect(result).toBeUndefined();
      });
    });

    describe('getBot', () => {
      it('should call botsService.getById and return the bot data', async () => {
        const botId = 'bot-123';
        const bot = { id: botId, name: 'TestBot', price: '100' };

        jest.spyOn(botsService, 'getById').mockResolvedValue(bot);

        const result = await controller.getBot(botId);

        expect(botsService.getById).toHaveBeenCalledWith(botId);
        expect(result).toEqual(bot);
      });
    });

    describe('getAllBots', () => {
      it('should call botsService.getAll and return the list of bots', async () => {
        const bots = [{ id: 'bot-123', name: 'Bot1', price: '100' }];

        jest.spyOn(botsService, 'getAll').mockResolvedValue(bots);

        const result = await controller.getAllBots();

        expect(botsService.getAll).toHaveBeenCalled();
        expect(result).toEqual(bots);
      });
    });
  });

  describe('events', () => {
    describe('createEvent', () => {
      it('should call eventsService.create and return the created event ID', async () => {
        const createEventDto = { 
          name: 'TestEvent', 
          description: "description", 
          mapId: 'map123', 
          scheduledAt: new Date() 
        };
        const createdEventId = 'event-123';

        jest.spyOn(eventsService, 'create').mockResolvedValue(createdEventId);

        const result = await controller.createEvent(createEventDto);

        expect(eventsService.create).toHaveBeenCalledWith(
          createEventDto.name, 
          createEventDto.description, 
          createEventDto.scheduledAt, 
          createEventDto.mapId
        );
        
        expect(result).toEqual(createdEventId);
      });
    });

    describe('updateEvent', () => {
      it('should call eventsService.update with correct data', async () => {
        const updateEventDto = { 
          id: 'event-123', 
          name: 'UpdatedEvent', 
          description: "blabla",          
          mapId: 'map123', 
          scheduledAt: new Date()
        };

        jest.spyOn(eventsService, 'update').mockResolvedValue(undefined);

        const result = await controller.updateEvent(updateEventDto);

        expect(eventsService.update).toHaveBeenCalledWith(
          updateEventDto.id, 
          updateEventDto.name, 
          updateEventDto.description, 
          updateEventDto.scheduledAt, 
          updateEventDto.mapId
        );
        
        expect(result).toBeUndefined();
      });
    });

    describe('deleteEvent', () => {
      it('should call eventsService.delete and return undefined', async () => {
        const eventId = 'event-123';

        jest.spyOn(eventsService, 'delete').mockResolvedValue(undefined);

        const result = await controller.deleteEvent(eventId);

        expect(eventsService.delete).toHaveBeenCalledWith(eventId);
        expect(result).toBeUndefined();
      });
    });

    describe('getEvent', () => {
      it('should call eventsService.getById and return the bot data', async () => {
        const eventId = 'event-123';
        const event = { id: eventId, name: 'TestBot', description: 'foo bar', scheduledAt: new Date() };

        jest.spyOn(eventsService, 'getById').mockResolvedValue(event);

        const result = await controller.getEvent(eventId);

        expect(eventsService.getById).toHaveBeenCalledWith(eventId);
        expect(result).toEqual(event);
      });
    });

    describe('getAllEvents', () => {
      it('should call eventsService.getAll and return the list of events', async () => {
        const events = [{ id: 'event-123', name: 'Event1', description: 'foobar', scheduledAt: new Date() }];

        jest.spyOn(eventsService, 'getAll').mockResolvedValue(events);

        const result = await controller.getAllEvents();

        expect(eventsService.getAll).toHaveBeenCalled();
        expect(result).toEqual(events);
      });
    });
  });
});
