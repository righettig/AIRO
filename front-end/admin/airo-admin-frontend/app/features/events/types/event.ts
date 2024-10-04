export type EventStatus = 'NotStarted' | 'Started' | 'Completed';

export interface EventDto {
    name: string;
    description: string;
}

export interface EventBase {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
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