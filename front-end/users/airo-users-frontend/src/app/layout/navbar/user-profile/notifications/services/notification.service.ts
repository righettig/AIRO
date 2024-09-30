import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { NotificationDto } from '../models/notification-dto';
import { AuthService } from '../../../../../auth/services/auth.service';
import { ConfigService } from '../../../../../common/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  get apiUrl(): string {
    return `${this.configService.config.gatewayApiUrl}/gateway`;
  }

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private http: HttpClient) { }

  async getMostRecent(): Promise<NotificationDto[]> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      Authorization: this.authService.accessToken!
    });

    const response = await firstValueFrom(
      this.http.get<NotificationDto[]>(`${this.apiUrl}/ui-notifications`, { headers: httpHeaders })
    );

    return response;
  }

  async getAll(): Promise<NotificationDto[]> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      Authorization: this.authService.accessToken!
    });

    const response = await firstValueFrom(
      this.http.get<NotificationDto[]>(`${this.apiUrl}/ui-notifications/all`, { headers: httpHeaders })
    );

    return response;
  }

  async markAsRead(notificationId: string): Promise<void> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      Authorization: this.authService.accessToken!
    });

    await firstValueFrom(
      this.http.patch(`${this.apiUrl}/ui-notifications/${notificationId}`, null, { headers: httpHeaders })
    );
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      Authorization: this.authService.accessToken!
    });

    await firstValueFrom(
      this.http.delete(`${this.apiUrl}/ui-notifications/${notificationId}`, { headers: httpHeaders })
    );
  }
}
