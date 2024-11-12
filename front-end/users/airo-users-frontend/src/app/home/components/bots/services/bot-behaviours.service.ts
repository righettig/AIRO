import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../auth/services/auth.service';
import { ConfigService } from '../../../../common/services/config.service';
import { BotBehaviour } from '../models/bot-behaviour.model';

export type BotValidationResponse = {
    success: boolean;
    errors: string[];
}

@Injectable({
    providedIn: 'root',
})
export class BotBehavioursService {
    get apiUrl(): string {
        return `${this.configService.config.gatewayApiUrl}/gateway/bot-behaviours`;
    }

    constructor(
        private authService: AuthService,
        private configService: ConfigService,
        private http: HttpClient) { }

    async getAllBehaviours(): Promise<BotBehaviour[]> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.get<BotBehaviour[]>(`${this.apiUrl}`, { headers: httpHeaders })
        );

        return response;
    }

    async createBotBehaviour(name: string, code: string): Promise<string> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.post<string>(`${this.apiUrl}`, {
                name,
                code,
            }, 
            { headers: httpHeaders })
        );

        return response;
    }

    async validateBotBehaviour(id: string, code: string): Promise<BotValidationResponse> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.post<BotValidationResponse>(`${this.apiUrl}/${id}/validate`, {
                code,
            }, 
            { headers: httpHeaders })
        );

        return response;
    }

    async updateBotBehaviour(id: string, name: string, code: string): Promise<void> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        await firstValueFrom(
            this.http.put(`${this.apiUrl}/${id}`, {
                name,
                code,
            }, 
            { headers: httpHeaders })
        );
    }

    async deleteBotBehaviour(id: string): Promise<void> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        await firstValueFrom(
            this.http.delete(`${this.apiUrl}/${id}`, { headers: httpHeaders })
        );
    }
}
