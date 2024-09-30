import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventSimulationService {
    private readonly serviceUrl = process.env.EVENT_SIMULATION_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async startSimulation() {
        const response = await firstValueFrom(
            this.httpService.post(`${this.serviceUrl}/simulate`, {
                foo: 'param1'
            }),
        );
        return response.data;
    }

    async stopSimulation(simulationId: string) {
        const response = await firstValueFrom(
            this.httpService.delete(`${this.serviceUrl}/simulate/${simulationId}`),
        );
        return response.data;
    }
}
