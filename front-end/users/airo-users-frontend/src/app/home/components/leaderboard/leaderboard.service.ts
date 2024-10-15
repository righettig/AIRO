import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ConfigService } from '../../../common/services/config.service';

export type UserLeaderboardEntry = { 
    id: string, 
    fullName: string,
    wins: number, 
    losses: number; 
    totalEvents: number 
};

@Injectable({
    providedIn: 'root',
})
export class LeaderboardService {
    get apiUrl(): string {
        return `${this.configService.config.gatewayApiUrl}/gateway`;
    }

    constructor(
        private authService: AuthService,
        private configService: ConfigService,
        private http: HttpClient) { }

    async getTopNLeaderboard(n: number): Promise<UserLeaderboardEntry[]> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.get<UserLeaderboardEntry[]>(`${this.apiUrl}/leaderboard/top/${n}`, { headers: httpHeaders })
        );

        return response;
    }

    async getCurrentUserLeaderboard(): Promise<UserLeaderboardEntry> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.get<UserLeaderboardEntry>(`${this.apiUrl}/leaderboard`, { headers: httpHeaders })
        );

        return response;
    }
}
