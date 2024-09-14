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

    async create(name: string, price: number): Promise<string> {
        const response = await firstValueFrom(
            this.httpService.post(`${this.authServiceUrl}/api/bot`, {
                name,
                price
            }),
        );
        return response.data;
    }

    async update(id: string, name: string, price: number): Promise<void> {
        const response = await firstValueFrom(
            this.httpService.put(`${this.authServiceUrl}/api/bot`, {
                id,
                name,
                price
            }),
        );
        return response.data;
    }

    async delete(id: string): Promise<void> {
        const response = await firstValueFrom(
            this.httpService.delete(`${this.authServiceUrl}/api/bot/${id}`),
        );
        return response.data;
    }

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
