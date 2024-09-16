import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './models/login.dto';
import { BotsService } from 'src/bots/bots.service';

describe('GatewayController', () => {
  let controller: GatewayController;
  let authService: AuthService;
  let botsService: BotsService;

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
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            refreshToken: jest.fn(),
            getUserRole: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GatewayController>(GatewayController);
    authService = module.get<AuthService>(AuthService);
    botsService = module.get<BotsService>(BotsService);
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
});
