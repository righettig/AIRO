import Event from '../types/event';

const mockEvents: Event[] = [
    {
        id: '1',
        name: 'Event 1',
        description: 'Description for Event 1',
        createdAt: new Date('2024-08-01T12:00:00Z'),
        modifiedAt: new Date(),
        status: 'NotStarted',
    },
    {
        id: '2',
        name: 'Event 2',
        description: 'Description for Event 2',
        createdAt: new Date('2024-08-15T15:00:00Z'),
        modifiedAt: new Date(),
        status: 'Running',
    },
];

export default mockEvents;
