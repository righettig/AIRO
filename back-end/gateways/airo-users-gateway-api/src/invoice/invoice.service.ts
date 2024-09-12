import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { InvoiceDto } from './models/invoice.dto';

@Injectable()
export class InvoiceService {
    private readonly invoiceServiceUrl = process.env.INVOICE_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async getAllInvoicesByUid(uid: string): Promise<InvoiceDto[]> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.invoiceServiceUrl}/api/invoices?uid=${uid}`),
        );

        return response.data;
    }
}
