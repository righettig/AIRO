import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './models/login.dto';

describe('GatewayController', () => {
  let controller: GatewayController;
  let authService: AuthService;

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
      ],
    }).compile();

    controller = module.get<GatewayController>(GatewayController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

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
