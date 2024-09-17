import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ConfigService } from '../../../common/services/config.service';
import { Bot } from '../models/bot.model';

export type BotPurchaseResponse = { success: boolean };

@Injectable({
    providedIn: 'root',
})
export class BotStoreService {
    get apiUrl(): string {
        return `${this.configService.config.gatewayApiUrl}/gateway/store`;
    }

    constructor(
        private authService: AuthService,
        private configService: ConfigService,
        private http: HttpClient) { }

    async getAllBots(): Promise<Bot[]> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.get<Bot[]>(`${this.apiUrl}/bots`, { headers: httpHeaders })
        );

        return response;
    }

    async getMyBots(): Promise<Bot[]> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.get<Bot[]>(`${this.apiUrl}/my-bots`, { headers: httpHeaders })
        );

        return response;
    }

    async getFreeBotsCount(): Promise<number> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.get<number>(`${this.apiUrl}/free-bots-count`, { headers: httpHeaders })
        );

        return response;
    }

    async purchaseBot(botId: string): Promise<BotPurchaseResponse> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.post<BotPurchaseResponse>(`${this.apiUrl}/bots/${botId}`, {}, { headers: httpHeaders })
        );

        return response;
    }
}
