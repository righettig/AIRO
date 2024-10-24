import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GetAllMapsResponse, GetMapResponse } from './models';

@Injectable()
export class MapsService {
    private readonly serviceUrl = process.env.MAPS_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async create(mapData: string): Promise<string> {
        const response = await firstValueFrom(
            this.httpService.post(`${this.serviceUrl}/api/maps`, {
                mapData
            }),
        );
        return response.data;
    }

    async update(id: string, mapData: string): Promise<void> {
        const response = await firstValueFrom(
            this.httpService.put(`${this.serviceUrl}/api/maps/${id}`, {
                mapData
            }),
        );
        return response.data;
    }

    async delete(id: string): Promise<void> {
        const response = await firstValueFrom(
            this.httpService.delete(`${this.serviceUrl}/api/maps/${id}`),
        );
        return response.data;
    }

    async getById(id: string): Promise<GetMapResponse> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/api/maps/${id}`),
        );
        return response.data;
    }

    async getAll(): Promise<GetAllMapsResponse> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/api/maps`),
        );
        return response.data;
    }
}
