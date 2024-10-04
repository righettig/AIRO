import { EventListItem } from '../types/event';

const mockEvents: EventListItem[] = [
    {
        id: '1',
        name: 'Event 1',
        description: 'Description for Event 1',
        createdAt: new Date('2024-08-01T12:00:00Z'),
        status: 'NotStarted',
        participants: 2
    },
    {
        id: '2',
        name: 'Event 2',
        description: 'Description for Event 2',
        createdAt: new Date('2024-08-15T15:00:00Z'),
        status: 'Started',
        participants: 1
    },
];

export default mockEvents;
