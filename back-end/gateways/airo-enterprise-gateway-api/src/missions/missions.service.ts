import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MissionsService {
    private readonly serviceUrl = process.env.ANYBOTICS_SERVICE_URL!;

    constructor(private readonly httpService: HttpService) { }

    async getAll() {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/missions`),
        );
        return response.data;
    }

    async delete(id: string): Promise<void> {
        const response = await firstValueFrom(
            this.httpService.delete(`${this.serviceUrl}/missions?missionId=${id}`),
        );
        return response.data;
    }

    async create(name: string, commands: string[]): Promise<string> {
        const response = await firstValueFrom(
            this.httpService.post(`${this.serviceUrl}/missions/create`, {
                id: '',
                name,
                commands
            }),
        );
        return response.data;
    }

    async execute(agentId: string, missionId: string): Promise<void> {
        const response = await firstValueFrom(
            this.httpService.post(`${this.serviceUrl}/missions/execute`, {
                agentId,
                missionId
            }),
        );
        return response.data;
    }
}
