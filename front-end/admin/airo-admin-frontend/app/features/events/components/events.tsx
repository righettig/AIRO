import { useEffect, useState } from 'react';

import Event from '../types/event';
import EventCreator from './event-creator';
import EventList from './event-list';

import { fetchEvents, addEvent, updateEvent, deleteEvent, startEvent } from '@/app/common/events.service';

const Events = () => {
    const [eventList, setEventList] = useState<Event[]>([]);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getEvents = async () => {
            try {
                const events = await fetchEvents();
                setEventList(events);
            } catch (err) {
                setError('Failed to fetch events.');
            } finally {
                setLoading(false);
            }
        };

        getEvents();
    }, []);

    const handleAddEvent = async ({ name, description }: Event) => {
        try {
            const id = await addEvent({ name, description });
            setEventList([...eventList, { 
                id, 
                name, 
                description, 
                // TODO: these should be set on the server -->
                status: 'NotStarted', 
                createdAt: new Date(), 
                modifiedAt: new Date()
                // <--
            }]);
        } catch (err) {
            setError('Failed to add event.');
        }
    };

    const handleUpdateEvent = async (updatedEvent: Event) => {
        try {
            await updateEvent(updatedEvent.id, updatedEvent);
            setEventList(eventList.map(event =>
                event.id === updatedEvent.id ? updatedEvent : event
            ));
            setEventToEdit(null);
        } catch (err) {
            setError('Failed to update event.');
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvent(id);
                setEventList(eventList.filter(event => event.id !== id));
            } catch (err) {
                setError('Failed to delete event.');
            }
        }
    };

    const handleStartEvent = (event: Event) => {
        const updatedEvent = { ...event, status: 'Running', modifiedAt: new Date() } as Event;

        setEventList(eventList.map(event =>
            event.id === updatedEvent.id ? updatedEvent : event
        ));
    };

    const handleEditEvent = (event: Event) => {
        setEventToEdit(event);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Event Management</h1>
            <EventCreator
                onAdd={handleAddEvent}
                onUpdate={handleUpdateEvent}
                eventToEdit={eventToEdit}
            />
            {error && <div>{error}</div>}
            {!error && <EventList
                events={eventList}
                onDelete={handleDeleteEvent}
                onEdit={handleEditEvent}
                onStart={handleStartEvent}
            />}
        </div>
    );
};

export default Events;
