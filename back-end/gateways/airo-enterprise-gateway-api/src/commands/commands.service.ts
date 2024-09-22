import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CommandsService {
    private readonly serviceUrl = process.env.ANYBOTICS_SERVICE_URL!;

    constructor(private readonly httpService: HttpService) { }

    async getAll() {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/commands`),
        );
        return response.data;
    }
}
