import { Controller, Get, Param, Patch, Delete, Body, Inject } from '@nestjs/common';
import { IUiNotificationRepository, UI_NOTIFICATION_REPOSITORY } from '../services/notifications-repository.service';
import { IUiNotificationStatusRepository, UI_NOTIFICATION_STATUS_REPOSITORY } from '../services/notifications-status.repository.service';
import { UINotificationDto } from '../models/ui-notification.dto';

@Controller('api/ui-notifications')
export class UiNotificationController {
    constructor(
        @Inject(UI_NOTIFICATION_REPOSITORY) private readonly uiNotificationRepo: IUiNotificationRepository,
        @Inject(UI_NOTIFICATION_STATUS_REPOSITORY) private readonly uiNotificationStatusRepo: IUiNotificationStatusRepository,
    ) { }

    // Get all notifications for a user and ensure "new" notifications have a status
    @Get(':userId')
    async getUserNotifications(@Param('userId') userId: string): Promise<UINotificationDto[]> {
        // Fetch all notifications and user-specific statuses in parallel
        const [notifications, statuses] = await Promise.all([
            this.uiNotificationRepo.findAll(),
            this.uiNotificationStatusRepo.findByUserId(userId),
        ]);
    
        // Sort notifications by descending 'createdAt' timestamp,
        const sortedNotifications = notifications.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
        });
    
        // Map notifications and statuses while filtering based on targetAudience
        return Promise.all(
            sortedNotifications
                .filter(notification => {
                    // Check if the notification is meant for 'all' or for the specific user
                    if (notification.targetAudience === 'all' || notification.targetAudience === userId) {
                        // Find status for the current notification
                        const notificationStatus = statuses.find(s => s.notificationId === notification.id);
    
                        // Exclude notifications if their status is 'deleted'
                        return !(notificationStatus && notificationStatus.status === 'deleted');
                    }
    
                    // Exclude if the user is not the target audience
                    return false;
                })
                .map(async (notification) => {
                    let notificationStatus = statuses.find(s => s.notificationId === notification.id);
    
                    // If no status exists, create a "new" (unread) status
                    if (!notificationStatus) {
                        notificationStatus = await this.uiNotificationStatusRepo.markAsNew(userId, notification.id);
                    }
    
                    return {
                        notificationId: notification.id,
                        type: notification.type,
                        message: notification.message,
                        createdAt: notification.createdAt,
                        read: notificationStatus.status === 'read',
                    };
                })
        );
    }    

    @Patch(':userId/read')
    async markAsRead(
        @Param('userId') userId: string,
        @Body('notificationId') notificationId: string
    ) {
        await this.uiNotificationStatusRepo.markAsRead(userId, notificationId);
        return { message: 'Notification marked as read' };
    }

    @Delete(':userId/:notificationId')
    async deleteNotification(
        @Param('userId') userId: string,
        @Param('notificationId') notificationId: string
    ) {
        await this.uiNotificationStatusRepo.markAsDeleted(userId, notificationId);
        return { message: 'Notification deleted' };
    }
}
