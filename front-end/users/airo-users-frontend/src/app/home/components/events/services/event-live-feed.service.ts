import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../auth/services/auth.service';
import { ConfigService } from '../../../../common/services/config.service';

export type Participant = {
    userId: string;
    botId: string;
    health: number;
}

export type TileInfoDto = {
    type: number;
    botId?: string;
}

export type GetLiveFeedResponse = {
    eventId: string;
    logs: string[];
    simulationState: {
        participants: Participant[];
        tiles: TileInfoDto[][];
    },
}

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

    async getLiveFeed(eventId: string, skip: number): Promise<GetLiveFeedResponse> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.get<GetLiveFeedResponse>(`${this.apiUrl}/simulation/${eventId}?skip=${skip}`, { headers: httpHeaders })
        );

        return response;
    }
}
