import { Test, TestingModule } from '@nestjs/testing';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { TokenInterceptor } from './token.interceptor';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('TokenInterceptor', () => {
  let interceptor: TokenInterceptor;
  let httpService: HttpService;
  let executionContext: ExecutionContext;
  let callHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenInterceptor,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              defaults: {
                headers: {
                  common: {},
                },
              },
            },
          },
        },
      ],
    }).compile();

    interceptor = module.get<TokenInterceptor>(TokenInterceptor);
    httpService = module.get<HttpService>(HttpService);

    // Mock the execution context and call handler
    executionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
      }),
    } as unknown as ExecutionContext;

    callHandler = {
      handle: jest.fn().mockReturnValue(of('response')), // Mock response stream
    };
  });

  it('should set Authorization header when present', () => {
    const authToken = 'Bearer test-token';
    const mockRequest = {
      headers: {
        authorization: authToken,
      },
    };

    // Mock getRequest() to return the mock request with the Authorization header
    (executionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(mockRequest);

    // Execute the interceptor
    interceptor.intercept(executionContext, callHandler);

    // Verify the Authorization header is set in HttpService
    expect(httpService.axiosRef.defaults.headers.common['Authorization']).toBe(authToken);
    expect(callHandler.handle).toHaveBeenCalled(); // Ensure the next handler is called
  });

  it('should not set Authorization header when not present', () => {
    const mockRequest = {
      headers: {},
    };

    // Mock getRequest() to return the mock request without the Authorization header
    (executionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(mockRequest);

    // Execute the interceptor
    interceptor.intercept(executionContext, callHandler);

    // Verify the Authorization header is not set in HttpService
    expect(httpService.axiosRef.defaults.headers.common['Authorization']).toBeUndefined();
    expect(callHandler.handle).toHaveBeenCalled(); // Ensure the next handler is called
  });

  it('should call next.handle()', () => {
    const mockRequest = {
      headers: {},
    };

    // Mock getRequest() to return the mock request
    (executionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(mockRequest);

    // Execute the interceptor
    interceptor.intercept(executionContext, callHandler);

    // Ensure the next handler in the chain is called
    expect(callHandler.handle).toHaveBeenCalled();
  });
});
