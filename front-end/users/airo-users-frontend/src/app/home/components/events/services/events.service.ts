import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Event } from '../models/event.model';
import { AuthService } from '../../../../auth/services/auth.service';
import { ConfigService } from '../../../../common/services/config.service';

@Injectable({
    providedIn: 'root',
})
export class EventsService {
    get apiUrl(): string {
        return `${this.configService.config.gatewayApiUrl}/gateway`;
    }

    constructor(
        private authService: AuthService,
        private configService: ConfigService,
        private http: HttpClient) { }

    async getAllEvents(): Promise<Event[]> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.get<Event[]>(`${this.apiUrl}/events`, { headers: httpHeaders })
        );

        return response;
    }
}
