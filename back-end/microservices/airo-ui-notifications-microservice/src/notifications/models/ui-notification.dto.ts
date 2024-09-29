import { UINotificationType } from "./ui-notification.interface";

export interface UINotificationDto {
    notificationId: string;
    type: UINotificationType;
    message: string;
    createdAt: Date;
    read: boolean;
}
