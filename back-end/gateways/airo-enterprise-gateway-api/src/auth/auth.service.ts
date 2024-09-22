import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

type AuthLoginResponse = {  uid: string, token: string };
type AuthRefreshTokenResponse = { token: string };

@Injectable()
export class AuthService {
    private readonly authServiceUrl = process.env.AUTH_API_URL!;

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

    async logout() {
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
