import { Body, Controller, Delete, Get, Put } from '@nestjs/common';
import { UiNotificationRepository } from '../services/notifications-repository.service';
import { UINotification } from '../models/ui-notification.interface';

export type MarkAsReadRequest = { userId: string; notificationId: string; }

export type DeleteNotificationRequest = { userId: string; notificationId: string; }

@Controller('ui-notifications')
export class UiNotificationsController {
    constructor(private readonly repository: UiNotificationRepository) { }

    @Get()
    async getAll(): Promise<UINotification[]> {
        // write to a different collection called "readStatus"
        //     <userId,notificationId,status,readAt> // 
    
        // return ONLY those entries where the corresponding readAt entry is NOT "deleted"
        return this.repository.listNotifications();
    }

    @Put()
    async markAsRead(@Body() request: MarkAsReadRequest): Promise<void> {
        //all entries with userId are set with "status" read
    }
  
    @Delete()
    async deleteNotificationForUser(@Body() request: DeleteNotificationRequest): Promise<void> {
        //set "statuses" as deleted for <userId,notificationId>
    }
}
