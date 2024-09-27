export type TargetAudience = "all";

export type UINotificationType = "bots" | "events" | "news" | "general";

export interface UINotification {
    id?: string;
    message: string;
    createdAt: Date;
    targetAudience: TargetAudience;
    type: UINotificationType;
}
