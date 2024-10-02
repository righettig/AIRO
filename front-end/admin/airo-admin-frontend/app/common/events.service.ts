import { createApiService } from './api.service';
import { EventBase, EventDto } from '@/app/features/events/types/event';

const BASE_API_URL = process.env.NEXT_PUBLIC_ADMIN_GATEWAY_API_URL!;
const eventsService = createApiService(BASE_API_URL + '/gateway/events');

// Reusable function to fetch event subscriptions
const getEventSubscriptions = async (eventId: string): Promise<string[]> => {
    const response = await createApiService(BASE_API_URL + '/gateway').request(`event-subscription?eventId=${eventId}`, 'GET');
    return response;
};

// Helper function to fetch participants for events
const fetchEventsWithParticipants = async (events: EventBase[]) => {
    return await Promise.all(events.map(async (event: EventBase) => {
        try {
            const participants = await getEventSubscriptions(event.id);
            return { ...event, participants };
        } catch (error) {
            console.error(`Failed to fetch participants for event ${event.id}:`, error);
            return { ...event, participants: null };
        }
    }));
};

// Fetch event details with participants
export const fetchEventWithDetails = async (eventId: string) => {
    try {
        const response = await eventsService.request(`${eventId}`, 'GET');
        const event = await fetchEventsWithParticipants([response]);
        return event[0]; // Since it's a single event
    } catch (error) {
        console.error('Failed to fetch event details:', error);
        throw error;
    }
};

// Fetch all event details with participants
const fetchEventsWithDetails = async () => {
    try {
        const events = await eventsService.request('', 'GET');
        return await fetchEventsWithParticipants(events);
    } catch (error) {
        console.error('Failed to fetch event details:', error);
        throw error;
    }
};

// Fetch events with participant counts
export const fetchEvents = async () => {
    try {
        var events = (await fetchEventsWithDetails()).map(event => ({
            ...event,
            participants: event.participants? event.participants.length : 0
        }));
        return events;
    } catch (error) {
        console.error('Failed to fetch events:', error);
        throw error;
    }
};

// Add a new event
export const addEvent = async (event: EventDto) => {
    try {
        const response = await fetch(BASE_API_URL + '/gateway/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.text(); // gateway returns a string
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

// Update an existing event
export const updateEvent = async (id: string, event: EventDto) => {
    try {
        const response = await fetch(BASE_API_URL + '/gateway/events', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify({ id, ...event }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return {};
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

// Delete an event by ID
export const deleteEvent = (id: string) =>
    eventsService.request(`${id}`, 'DELETE');

// Start an event by ID
export const startEvent = (id: string) =>
    eventsService.request(`${id}`, 'POST');
