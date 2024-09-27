import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

type GetAllUiNotificationsResponse = {
    notificationId: string;
    message: string;
    read: boolean;
} [];

@Injectable()
export class UiNotificationsService {
    private readonly serviceUrl = process.env.UI_NOTIFICATIONS_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async getAll(userId: string): Promise<GetAllUiNotificationsResponse> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.serviceUrl}/api/ui-notifications/${userId}`),
        );
        return response.data;
    }

    async markAsRead(userId: string, notificationId: string): Promise<void> {
        const response = await firstValueFrom(
            this.httpService.patch(`${this.serviceUrl}/api/ui-notifications/${userId}/read`, { notificationId }),
        );
        return response.data;
    }

    async delete(userId: string, notificationId: string): Promise<void> {
        const response = await firstValueFrom(
            this.httpService.delete(`${this.serviceUrl}/api/ui-notifications/${userId}/${notificationId}`),
        );
        return response.data;
    }
}
