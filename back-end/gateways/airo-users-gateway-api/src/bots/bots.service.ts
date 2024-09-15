import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

type BotDto = { id: string, name: string, price: string };
type GetBotResponse = BotDto;
type GetAllBotsResponse = BotDto[];

@Injectable()
export class BotsService {
    private readonly authServiceUrl = process.env.BOTS_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async getById(id: string): Promise<GetBotResponse> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.authServiceUrl}/api/bot/${id}`),
        );
        return response.data;
    }

    async getAll(): Promise<GetAllBotsResponse> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.authServiceUrl}/api/bot`),
        );
        return response.data;
    }
}
