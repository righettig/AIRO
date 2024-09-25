import { createApiService } from './api.service';

import { EventDto } from '@/app/features/events/types/event';

const EVENTS_API_URL = process.env.NEXT_PUBLIC_ADMIN_GATEWAY_API_URL!;

const eventsService = createApiService(EVENTS_API_URL + '/gateway/events');

export const fetchEvents = () =>
    eventsService.request('', 'GET');

export const addEvent = async (event: EventDto) => {
    try {
        const response = await fetch(EVENTS_API_URL + '/gateway/events', {
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

        // gateway returns a string so I cannot use .json()
        return await response.text();
        
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

export const updateEvent = async (id: string, event: EventDto) => {
    try {
        const response = await fetch(EVENTS_API_URL + '/gateway/events', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify({
                id, 
                ...event
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return {};
        
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

export const deleteEvent = (id: string) =>
    eventsService.request(`${id}`, 'DELETE');

export const startEvent = (id: string) =>
    eventsService.request(`${id}`, 'POST');
