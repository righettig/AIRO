import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventSubscriptionService {
    private readonly serviceUrl = process.env.EVENT_SUBSCRIPTION_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async subscribeToEvent(userId: string, eventId: string, botId: string) {
        const response = await firstValueFrom(
            this.httpService.post(`${this.serviceUrl}`, {
                userId,
                eventId,
                botId
            }),
        );
        return response.data;
    }

    async unsubscribeFromEvent(userId: string, eventId: string) {
        const response = await firstValueFrom(
            this.httpService.delete(`${this.serviceUrl}`, {
                data: {
                    userId,
                    eventId
                }
            }),
        );
        return response.data;
    }
}
