import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventSubscriptionService {
    private readonly serviceUrl = 
        process.env.EVENT_SUBSCRIPTION_API_URL! + "/api/eventsubscriptions";

    constructor(private readonly httpService: HttpService) { }

    async subscribeToEvent(userId: string, eventId: string, botId: string, botBehaviourId: string) {
        const response = await firstValueFrom(
            this.httpService.post(`${this.serviceUrl}`, {
                userId,
                eventId,
                botId,
                botBehaviourId
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

    async getSubscribedEventsByUserId(userId: string) {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/${userId}`)
        );
        return response.data;
    }
}
