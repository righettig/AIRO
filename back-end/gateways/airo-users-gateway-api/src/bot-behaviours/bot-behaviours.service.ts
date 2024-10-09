import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

type BotBehaviour = { id: string, name: string, code: string };

@Injectable()
export class BotBehavioursService {
    private readonly serviceUrl = process.env.BOT_BEHAVIOURS_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async getAllByUserId(userId: string): Promise<BotBehaviour[]> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/api/bot-behaviours/${userId}`),
        );
        return response.data;
    }

    async create(userId: string, name: string, code: string): Promise<string> {
        const response = await firstValueFrom(
            this.httpService.post(`${this.serviceUrl}/api/bot-behaviours`, {
                userId,
                name,
                code
            }),
        );
        return response.data;
    }

    async update(userId: string, botBehaviourId: string, name: string, code: string): Promise<void> {
        const response = await firstValueFrom(
            this.httpService.put(`${this.serviceUrl}/api/bot-behaviours/${userId}/${botBehaviourId}`, {
                name,
                code
            }),
        );
        return response.data;
    }

    async delete(userId: string, botBehaviourId: string): Promise<void> {
        const response = await firstValueFrom(
            this.httpService.delete(`${this.serviceUrl}/api/bot-behaviours/${userId}/${botBehaviourId}`),
        );
        return response.data;
    }
}
