import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

type BotBehaviour = { id: string, name: string, code: string };

@Injectable()
export class BotBehavioursService {
    private readonly serviceUrl = process.env.BOT_BEHAVIOURS_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async getAll(): Promise<BotBehaviour[]> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/api/bot-behaviours`),
        );
        return response.data;
    }
}
