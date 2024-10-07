import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Bot } from '../models/bot.model';
import { AuthService } from '../../../../auth/services/auth.service';
import { ConfigService } from '../../../../common/services/config.service';
import { BotBehaviour } from '../models/bot-behaviour.model';

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
}
