import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { createMockResponse, HttpServiceMock } from 'test/test-utils';

describe('AuthService', () => {
  let service: AuthService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, 
        HttpServiceMock
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should return signup response', async () => {
      const mockSignupResponse = createMockResponse({ uid: '123', token: 'token123' });

      jest.spyOn(httpService, 'post').mockReturnValue(of(mockSignupResponse));

      const result = await service.signup('test@example.com', 'password');
      expect(result).toEqual(mockSignupResponse.data);
      expect(httpService.post).toHaveBeenCalledWith(
        `${process.env.AUTH_API_URL}/api/auth/signup`,
        { email: 'test@example.com', password: 'password' }
      );
    });
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

  describe('getUserRole', () => {
    it('should return user role response', async () => {
      const mockGetUserRoleResponse = createMockResponse({ role: 'admin' });

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockGetUserRoleResponse));

      const result = await service.getUserRole('test@example.com');
      expect(result).toEqual(mockGetUserRoleResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(
        `${process.env.AUTH_API_URL}/api/auth/user-role`,
        { params: { email: 'test@example.com' } }
      );
    });
  });
});
