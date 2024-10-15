import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export type BehaviourLeaderboardResponse = {
    id: string,
    wins: number,
    losses: number,
    totalEvents: number
};

@Injectable()
export class LeaderboardService {
    private readonly serviceUrl = process.env.LEADERBOARD_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async getBehaviourLeaderboardTopN(n: number): Promise<BehaviourLeaderboardResponse[]> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/api/leaderboard/behaviors/top/${n}`),
        );
        return response.data;
    }
}
