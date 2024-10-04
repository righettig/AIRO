import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../auth/services/auth.service';
import { ConfigService } from '../../../../common/services/config.service';

@Injectable({
    providedIn: 'root',
})
export class EventLiveFeedService {
    get apiUrl(): string {
        return `${this.configService.config.gatewayApiUrl}/gateway`;
    }

    constructor(
        private authService: AuthService,
        private configService: ConfigService,
        private http: HttpClient) { }

    async getLiveFeed(eventId: string): Promise<any> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.get(`${this.apiUrl}/simulation/${eventId}`, { headers: httpHeaders })
        );

        return response;
    }
}
