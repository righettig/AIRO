import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { EventListItem } from '../types/event';

import EventCreator from './event-creator';
import EventList from './event-list';

import { fetchEvents, addEvent, updateEvent, deleteEvent, startEvent } from '@/app/common/events.service';

const Events = () => {
    const [eventList, setEventList] = useState<EventListItem[]>([]);
    const [eventToEdit, setEventToEdit] = useState<EventListItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

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

    const handleAddEvent = async ({ name, description, scheduledAt }: EventListItem) => {
        try {
            const id = await addEvent({ name, description, scheduledAt });
            setEventList([...eventList, {
                id,
                name,
                description,
                scheduledAt,
                // TODO: these should be set on the server -->
                participants: 0,
                status: 'NotStarted',
                createdAt: new Date(),
                // <--
            }]);
        } catch (err) {
            setError('Failed to add event.');
        }
    };

    const handleUpdateEvent = async (updatedEvent: EventListItem) => {
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

    const handleStartEvent = async (event: EventListItem) => {
        if (window.confirm('Are you sure you want to start this event?')) {
            try {
                await startEvent(event.id);
                const updatedEvent = { ...event, status: 'Started', modifiedAt: new Date() } as EventListItem;

                setEventList(eventList.map(event =>
                    event.id === updatedEvent.id ? updatedEvent : event
                ));
            } catch (err) {
                setError('Failed to start event.');
            }
        }
    };

    const handleEditEvent = (event: EventListItem) => {
        setEventToEdit(event);
    };

    const handleDetailsEvent = (id: string) => {
        router.push(`/event-details/${id}`);
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
                onDetails={handleDetailsEvent}
            />}
        </div>
    );
};

export default Events;
