import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

type EventDto = { id: string, name: string, description: string };
type GetEventResponse = EventDto;
type GetAllEventsResponse = EventDto[];

@Injectable()
export class EventsService {
    private readonly serviceUrl = process.env.EVENTS_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async getById(id: string): Promise<GetEventResponse> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/api/events/${id}`),
        );
        return response.data;
    }

    async getAll(): Promise<GetAllEventsResponse> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/api/events`),
        );
        return response.data;
    }
}
