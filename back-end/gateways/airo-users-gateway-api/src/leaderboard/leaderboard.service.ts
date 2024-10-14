import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export type UserLeaderboardResponse = {
    id: string,
    wins: number,
    losses: number,
    totalEvents: number
};

@Injectable()
export class LeaderboardService {
    private readonly serviceUrl = process.env.LEADERBOARD_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async getUserLeaderboardByUid(uid: string): Promise<UserLeaderboardResponse> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/api/leaderboard/users/${uid}`),
        );
        return response.data;
    }

    async getUserLeaderboardTopN(n: number): Promise<UserLeaderboardResponse[]> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/api/leaderboard/users/top/${n}`),
        );
        return response.data;
    }
}
