import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AuthLoginResponse, AuthRefreshTokenResponse } from './models/auth.models';

@Injectable()
export class AuthService {
    private readonly authServiceUrl = process.env.ADMIN_AUTH_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async login(email: string, password: string): Promise<AuthLoginResponse> {
        const response = await firstValueFrom(
            this.httpService.post(`${this.authServiceUrl}/api/auth/login`, {
                email,
                password
            }),
        );
        return response.data;
    }

    async logout(): Promise<void> {
        await firstValueFrom(
            this.httpService.post(`${this.authServiceUrl}/api/auth/logout`),
        );
    }

    async refreshToken(): Promise<AuthRefreshTokenResponse> {
        const response = await firstValueFrom(
            this.httpService.post(`${this.authServiceUrl}/api/auth/refresh-token`),
        );
        return response.data;
    }
}
