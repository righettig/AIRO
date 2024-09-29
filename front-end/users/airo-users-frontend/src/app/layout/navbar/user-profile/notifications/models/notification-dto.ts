export type NotificationDto = {
    notificationId: string;
    // type: bot | event | news
    message: string;
    createdAt: Date;
    read: boolean;
}