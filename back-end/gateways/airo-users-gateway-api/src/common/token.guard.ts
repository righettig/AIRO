import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH_KEY } from './skip-auth.decorator';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const handler = context.getHandler();
    
    // Check if the route handler has the @SkipAuth decorator
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getClass(),
      handler,
    ]);

    if (skipAuth) {
      return true;  // Skip the guard logic if @SkipAuth is applied
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = this.tokenService.getTokenFromRequest(request);

    const userId = this.tokenService.decodeFromToken<{ user_id?: string }>(token, 'user_id');
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const email = this.tokenService.decodeFromToken<{ email?: string }>(token, 'email');
    if (!email) {
      throw new UnauthorizedException('Invalid token');
    }

    request['userId'] = userId;
    request['email'] = email;

    return true;
  }
}
