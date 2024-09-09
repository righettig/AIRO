import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

type AuthSignupResponse = { uid: string, token: string };
type AuthLoginResponse = {  uid: string, token: string };
type AuthRefreshTokenResponse = { token: string };
type AuthGetUserRoleResponse = { role: string };

@Injectable()
export class AuthService {
    private readonly authServiceUrl = process.env.AUTH_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async signup(email: string, password: string): Promise<AuthSignupResponse> {
        const signupResponse = await firstValueFrom(
            this.httpService.post(`${this.authServiceUrl}/api/auth/signup`, {
                email,
                password
            }),
        );

        return signupResponse.data;
    }

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

    async getUserRole(email: string): Promise<AuthGetUserRoleResponse> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.authServiceUrl}/api/auth/user-role`, {
                params: { email },
            }),
        );
        return response.data;
    }
}
