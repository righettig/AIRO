export type NotificationType = "bots" | "events" | "news" | "general";

export type NotificationDto = {
    notificationId: string;
    type: NotificationType;
    message: string;
    createdAt: Date;
    read: boolean;
}