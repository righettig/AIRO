import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PurchaseService {
    private readonly serviceUrl = process.env.PURCHASE_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async purchase(userId: string, botId: string) {
        const response = await firstValueFrom(
            this.httpService.post(`${this.serviceUrl}/api/purchase`, {
                userId,
                botId
            }),
        );
        return response.data;
    }

    async getAll(userId: string): Promise<string[]> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/api/purchase/${userId}`),
        );
        return response.data;
    }
}
