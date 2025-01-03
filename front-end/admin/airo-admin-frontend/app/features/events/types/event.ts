export type EventStatus = 'NotStarted' | 'Started' | 'Completed';

export interface EventDto {
    name: string;
    description: string;
    scheduledAt: Date;
    mapId: string;
}

export interface EventBase {
    id: string;
    name: string;
    description: string;
    mapId: string;
    createdAt: Date;
    scheduledAt: Date;
    status: EventStatus;
}

export interface EventListItem extends EventBase {
    participants: number;
}

export interface ParticipantDetails {
    uid: string;
    botId: string;
}

export interface EventDetailsItem extends EventBase {
    participants: ParticipantDetails[];
}