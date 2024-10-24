import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GetEventResponse, GetAllEventsResponse } from './models/event.models';

@Injectable()
export class EventsService {
    private readonly serviceUrl = process.env.EVENTS_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async create(name: string, description: string, scheduledAt: Date, mapId: string): Promise<string> {
        const response = await firstValueFrom(
            this.httpService.post(`${this.serviceUrl}/api/events`, {
                name,
                description,
                scheduledAt,
                mapId
            }),
        );
        return response.data;
    }

    async update(id: string, name: string, description: string, mapId: string): Promise<void> {
        const response = await firstValueFrom(
            this.httpService.put(`${this.serviceUrl}/api/events`, {
                id,
                name,
                description,
                mapId
            }),
        );
        return response.data;
    }

    async delete(id: string): Promise<void> {
        const response = await firstValueFrom(
            this.httpService.delete(`${this.serviceUrl}/api/events/${id}`),
        );
        return response.data;
    }

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
