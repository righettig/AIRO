export type Status = 'new' | 'read' | 'deleted';

export interface UINotificationStatus {
    userId: string;
    notificationId: string;
    status: Status;
    readAt: Date;
}
