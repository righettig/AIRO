import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { ConfigService } from '../../common/services/config.service';
import { Profile } from '../models/profile';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    get apiUrl(): string {
        return `${this.configService.config.gatewayApiUrl}/gateway`;
    }

    constructor(
        private authService: AuthService,
        private configService: ConfigService,
        private http: HttpClient) { }

    async getProfile(): Promise<Profile> {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.get<Profile>(`${this.apiUrl}/user`, { headers: httpHeaders })
        );

        return response;
    }

    async updateProfile(firstName: string, lastName: string) {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            Authorization: this.authService.accessToken!
        });

        const response = await firstValueFrom(
            this.http.patch(`${this.apiUrl}/user`, { firstName, lastName }, { headers: httpHeaders })
        );

        return response;
    }
}
