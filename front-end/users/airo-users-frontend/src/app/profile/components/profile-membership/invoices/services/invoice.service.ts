import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../../auth/services/auth.service';
import { ConfigService } from '../../../../../common/services/config.service';
import { InvoiceDto } from '../models/invoice.dto';

@Injectable({
    providedIn: 'root',
})
export class InvoiceService {
    get apiUrl(): string {
        return `${this.configService.config.gatewayApiUrl}/gateway`;
    }

    constructor(
        private authService: AuthService,
        private configService: ConfigService,
        private http: HttpClient) { }

    async getAllInvoices(): Promise<InvoiceDto[]> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.get<InvoiceDto[]>(`${this.apiUrl}/invoices`, {
                headers: httpHeaders
            })
        );

        return response;
    }
}
