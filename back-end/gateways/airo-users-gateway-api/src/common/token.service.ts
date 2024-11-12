import { Injectable } from '@nestjs/common';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class TokenService {
  getTokenFromRequest(request: Request): string {
    const token = request.headers['authorization'];
    if (!token) {
      throw new Error('Token is missing');
    }
    return token;
  }

  decodeFromToken<T>(token: string, property: keyof T): T[keyof T] | null {
    try {
      const decodedToken = jwtDecode<T>(token);
      return decodedToken[property] || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
