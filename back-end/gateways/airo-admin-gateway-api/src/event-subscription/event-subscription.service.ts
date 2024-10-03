import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventSubscriptionService {
    private readonly serviceUrl = process.env.EVENT_SUBSCRIPTION_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async getParticipants(eventId: string): Promise<string[]> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/api/eventsubscriptions?eventId=${eventId}`),
        );
        return response.data;
    }
}
