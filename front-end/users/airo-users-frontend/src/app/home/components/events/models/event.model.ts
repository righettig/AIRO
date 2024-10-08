export interface Event {
    id: string;
    name: string;
    description: string;
    status: 'NotStarted' | 'Started' | 'Completed'
    scheduledAt: Date;
}