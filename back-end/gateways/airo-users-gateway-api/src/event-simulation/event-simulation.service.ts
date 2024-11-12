import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventSimulationService {
    private readonly serviceUrl = process.env.EVENT_SIMULATION_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async getSimulationStatusById(id: string, skip: number) {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/simulate/${id}/status?skip=${skip}`),
        );
        return response.data;
    }
}
