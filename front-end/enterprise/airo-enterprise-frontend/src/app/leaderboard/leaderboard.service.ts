import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '../common/services/config.service';

export type BehaviourLeaderboardEntry = { 
    id: string, 
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
        private configService: ConfigService,
        private http: HttpClient) { }

    async getTopNLeaderboard(n: number): Promise<BehaviourLeaderboardEntry[]> {
        const response = await firstValueFrom(
            this.http.get<BehaviourLeaderboardEntry[]>(`${this.apiUrl}/leaderboard/top/${n}`)
        );

        return response;
    }
}
