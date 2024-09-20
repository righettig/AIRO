import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  import { Request } from 'express';
  import { HttpService } from '@nestjs/axios';
  
  @Injectable()
  export class TokenInterceptor implements NestInterceptor {
    constructor(private readonly httpService: HttpService) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest<Request>();
  
      // Extract the token from the Authorization header
      const authToken = request.headers['authorization'];
  
      if (authToken) {
        // Add Authorization header to the HttpService (used in gateway)
        this.httpService.axiosRef.defaults.headers.common['Authorization'] = authToken;
      }
  
      return next.handle();
    }
  }
  