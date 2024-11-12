import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenGuard } from './token.guard';
import { TokenService } from './token.service';
import { SKIP_AUTH_KEY } from './skip-auth.decorator';

describe('TokenGuard', () => {
  let guard: TokenGuard;
  let reflector: Reflector;
  let tokenService: TokenService;

  // Mock execution context creation helper
  const createMockExecutionContext = (
    isSkipAuth: boolean = false,
    handler: Function = jest.fn(),
    classRef: Function = jest.fn()
  ): ExecutionContext => ({
    getHandler: () => handler,
    getClass: () => classRef,
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          authorization: 'Bearer mock.token.123'
        }
      })
    })
  } as unknown as ExecutionContext);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn()
          }
        },
        {
          provide: TokenService,
          useValue: {
            getTokenFromRequest: jest.fn(),
            decodeFromToken: jest.fn()
          }
        }
      ]
    }).compile();

    guard = module.get<TokenGuard>(TokenGuard);
    reflector = module.get<Reflector>(Reflector);
    tokenService = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true when @SkipAuth decorator is present', async () => {
      const context = createMockExecutionContext();
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(SKIP_AUTH_KEY, [
        expect.any(Function),
        expect.any(Function)
      ]);
      expect(tokenService.getTokenFromRequest).not.toHaveBeenCalled();
    });

    // it('should process token and return true for valid token with user_id and email', async () => {
    //   const mockRequest = {
    //     headers: {
    //       authorization: 'Bearer valid.token'
    //     }
    //   };
    //   const context = createMockExecutionContext();
    //   context.switchToHttp().getRequest = () => mockRequest;

    //   jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    //   jest.spyOn(tokenService, 'getTokenFromRequest').mockReturnValue('Bearer valid.token');
    //   jest.spyOn(tokenService, 'decodeFromToken')
    //     .mockReturnValueOnce('user123') // For user_id
    //     .mockReturnValueOnce('test@example.com'); // For email

    //   const result = await guard.canActivate(context);

    //   expect(result).toBe(true);
    //   expect(mockRequest['userId']).toBe('user123');
    //   expect(mockRequest['email']).toBe('test@example.com');
    //   expect(tokenService.getTokenFromRequest).toHaveBeenCalledWith(mockRequest);
    //   expect(tokenService.decodeFromToken).toHaveBeenCalledTimes(2);
    // });

    // it('should throw UnauthorizedException when user_id is missing', async () => {
    //   const context = createMockExecutionContext();
      
    //   jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    //   jest.spyOn(tokenService, 'getTokenFromRequest').mockReturnValue('Bearer invalid.token');
    //   jest.spyOn(tokenService, 'decodeFromToken').mockReturnValue(null);

    //   await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    //   expect(tokenService.decodeFromToken).toHaveBeenCalledWith('Bearer invalid.token', 'user_id');
    // });

    // it('should throw UnauthorizedException when email is missing', async () => {
    //   const context = createMockExecutionContext();
      
    //   jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    //   jest.spyOn(tokenService, 'getTokenFromRequest').mockReturnValue('Bearer invalid.token');
    //   jest.spyOn(tokenService, 'decodeFromToken')
    //     .mockReturnValueOnce('user123') // Return valid user_id
    //     .mockReturnValueOnce(null); // Return null for email

    //   await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    //   expect(tokenService.decodeFromToken).toHaveBeenCalledWith('Bearer invalid.token', 'email');
    // });

    // it('should handle token service errors appropriately', async () => {
    //   const context = createMockExecutionContext();
      
    //   jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    //   jest.spyOn(tokenService, 'getTokenFromRequest').mockImplementation(() => {
    //     throw new Error('Token service error');
    //   });

    //   await expect(guard.canActivate(context)).rejects.toThrow();
    // });

    // it('should check both class and handler level decorators', async () => {
    //   const mockHandler = jest.fn();
    //   const mockClass = jest.fn();
    //   const context = createMockExecutionContext(false, mockHandler, mockClass);
      
    //   jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    //   await guard.canActivate(context);

    //   expect(reflector.getAllAndOverride).toHaveBeenCalledWith(SKIP_AUTH_KEY, [
    //     mockClass,
    //     mockHandler
    //   ]);
    // });

    // it('should handle different token formats', async () => {
    //   const mockRequest = {
    //     headers: {
    //       authorization: 'CustomPrefix valid.token'
    //     }
    //   };
    //   const context = createMockExecutionContext();
    //   context.switchToHttp().getRequest = () => mockRequest;

    //   jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    //   jest.spyOn(tokenService, 'getTokenFromRequest').mockReturnValue('CustomPrefix valid.token');
    //   jest.spyOn(tokenService, 'decodeFromToken')
    //     .mockReturnValueOnce('user123')
    //     .mockReturnValueOnce('test@example.com');

    //   const result = await guard.canActivate(context);

    //   expect(result).toBe(true);
    //   expect(tokenService.getTokenFromRequest).toHaveBeenCalledWith(mockRequest);
    // });
  });
});