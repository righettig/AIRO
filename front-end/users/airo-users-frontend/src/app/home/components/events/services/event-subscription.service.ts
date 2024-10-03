import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../auth/services/auth.service';
import { ConfigService } from '../../../../common/services/config.service';

@Injectable({
    providedIn: 'root',
})
export class EventSubscriptionService {
    get apiUrl(): string {
        return `${this.configService.config.gatewayApiUrl}/gateway`;
    }

    constructor(
        private authService: AuthService,
        private configService: ConfigService,
        private http: HttpClient) { }


    async subscribeToEvent(eventId: string, botId: string): Promise<void> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        await firstValueFrom(
            this.http.post(`${this.apiUrl}/event-subscription`, {
                eventId,
                botId
            }, 
            { headers: httpHeaders }),
        );
    }

    async unsubscribeFromEvent(eventId: string): Promise<void> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        await firstValueFrom(
            this.http.delete(`${this.apiUrl}/event-subscription`, { 
                headers: httpHeaders,
                body: { eventId }
            }),
        );
    }

    async getSubscribedEvents(): Promise<string[]> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.get<string[]>(`${this.apiUrl}/event-subscription`, { 
                headers: httpHeaders
            }),
        );

        return response;
    }
}
