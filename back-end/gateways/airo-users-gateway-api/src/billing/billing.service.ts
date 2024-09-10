import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

type BillingPaymentResponse = { success: boolean };

@Injectable()
export class BillingService {
    private readonly billingServiceUrl = process.env.BILLING_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async processPayment(uid: string, creditCardDetails: string): Promise<BillingPaymentResponse> {
        const response = await firstValueFrom(
            this.httpService.post(`${this.billingServiceUrl}/api/billing`, {
                uid,
                creditCardDetails,
            }),
        );

        return response.data;
    }
}
