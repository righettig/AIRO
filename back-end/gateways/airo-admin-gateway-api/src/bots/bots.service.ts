import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GetBotResponse, GetBotsResponse } from './models/bots.models';

@Injectable()
export class BotsService {
    private readonly serviceUrl = process.env.BOTS_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async create(name: string, price: number, health: number, attack: number, defense: number): Promise<string> {
        const response = await firstValueFrom(
            this.httpService.post(`${this.serviceUrl}/api/bot`, {
                name,
                price,
                health,
                attack,
                defense
            }),
        );
        return response.data;
    }

    async update(id: string, name: string, price: number, health: number, attack: number, defense: number): Promise<void> {
        const response = await firstValueFrom(
            this.httpService.put(`${this.serviceUrl}/api/bot`, {
                id,
                name,
                price,
                health,
                attack,
                defense
            }),
        );
        return response.data;
    }

    async delete(id: string): Promise<void> {
        const response = await firstValueFrom(
            this.httpService.delete(`${this.serviceUrl}/api/bot/${id}`),
        );
        return response.data;
    }

    async getById(id: string): Promise<GetBotResponse> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/api/bot?ids=${id}`),
        );
        return response.data;
    }

    async getByIds(ids: string[]): Promise<GetBotsResponse> {
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
