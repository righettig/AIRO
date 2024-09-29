import { Controller, Get, Param, Patch, Delete, Body } from '@nestjs/common';
import { UiNotificationRepository } from '../services/notifications-repository.service';
import { UiNotificationStatusRepository } from '../services/notifications-status.repository.service';
import { UINotificationDto } from '../models/ui-notification.dto';

@Controller('api/ui-notifications')
export class UiNotificationController {
    constructor(
        private readonly uiNotificationRepo: UiNotificationRepository,
        private readonly uiNotificationStatusRepo: UiNotificationStatusRepository,
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

        // Map notifications and statuses while avoiding the need for a final filter
        return Promise.all(
            sortedNotifications
                .filter(notification => {
                    // Find status for the current notification
                    const notificationStatus = statuses.find(s => s.notificationId === notification.id);

                    // Exclude notifications if their status is 'deleted'
                    return !(notificationStatus && notificationStatus.status === 'deleted');
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
