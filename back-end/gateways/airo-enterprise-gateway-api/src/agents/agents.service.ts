import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

function isEmptyObject(obj: any) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

@Injectable()
export class AgentsService {
    private readonly serviceUrl = process.env.ANYBOTICS_SERVICE_URL!;

    constructor(private readonly httpService: HttpService) { }

    async getAll() {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/anymal`),
        );
        return response.data;
    }

    async get(agentId: string) {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/anymal?id=${agentId}`),
        );
        return response.data;
    }

    async getCommandsHistoryByAgentId(agentId: string) {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/anymal?id=${agentId}/commands`),
        );
        return response.data;
    }

    async executeCommand(agentId: string, command: string, data?: any) {
        if (isEmptyObject(data)) {
            data = JSON.stringify(agentId)
        }
        
        const response = await firstValueFrom(
            this.httpService.post(`${this.serviceUrl}/anymal/${command}`,
                data,
                { headers: { "Content-Type": "application/json" } }
            ));

        return response.data;
    }
}
