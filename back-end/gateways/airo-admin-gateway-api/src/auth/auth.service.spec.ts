import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { createMockResponse, createMockHttpService } from 'airo-gateways-common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, 
        createMockHttpService(HttpService)
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return login response', async () => {
      const mockLoginResponse = createMockResponse({ uid: '123', token: 'token123' });

      jest.spyOn(httpService, 'post').mockReturnValue(of(mockLoginResponse));

      const result = await service.login('test@example.com', 'password');
      expect(result).toEqual(mockLoginResponse.data);
      expect(httpService.post).toHaveBeenCalledWith(
        `${process.env.AUTH_API_URL}/api/auth/login`,
        { email: 'test@example.com', password: 'password' }
      );
    });
  });

  describe('logout', () => {
    it('should call the logout endpoint', async () => {
      jest.spyOn(httpService, 'post').mockReturnValue(of(null));

      await service.logout();
      expect(httpService.post).toHaveBeenCalledWith(
        `${process.env.AUTH_API_URL}/api/auth/logout`
      );
    });
  });

  describe('refreshToken', () => {
    it('should return refresh token response', async () => {
      const mockRefreshTokenResponse = createMockResponse({ token: 'newToken123' });

      jest.spyOn(httpService, 'post').mockReturnValue(of(mockRefreshTokenResponse));

      const result = await service.refreshToken();
      expect(result).toEqual(mockRefreshTokenResponse.data);
      expect(httpService.post).toHaveBeenCalledWith(
        `${process.env.AUTH_API_URL}/api/auth/refresh-token`
      );
    });
  });
});
