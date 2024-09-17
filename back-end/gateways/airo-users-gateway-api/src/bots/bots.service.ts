import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

type BotDto = { id: string, name: string, price: string };
type GetBotsResponse = BotDto[];

@Injectable()
export class BotsService {
    private readonly serviceUrl = process.env.BOTS_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async getByIds(ids: string[]): Promise<GetBotsResponse> {
        if (!ids.length) {
            return [];
        }
        
        const queryString = ids.map(x => `ids=${x}`).join('&');

        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/api/bot?${queryString}`),
        );
        return response.data;
    }

    async getAll(): Promise<GetBotsResponse> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/api/bot`),
        );
        return response.data;
    }
}
