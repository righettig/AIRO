import { FC, useState, useEffect } from 'react';

import { EventListItem } from '../types/event';

import styles from './event-creator.module.css';

interface EventCreatorProps {
    onAdd: (event: EventListItem) => void;
    onUpdate: (event: EventListItem) => void;
    eventToEdit?: EventListItem | null;
}

const EventCreator: FC<EventCreatorProps> = ({ onAdd, onUpdate, eventToEdit }) => {
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventScheduledAt, setEventScheduledAt] = useState(new Date());

    useEffect(() => {
        if (eventToEdit) {
            setEventName(eventToEdit.name);
            setEventDescription(eventToEdit.description);
            setEventScheduledAt(eventToEdit.scheduledAt);
        }
    }, [eventToEdit]);

    const handleSaveEvent = () => {
        if (!eventName || !eventDescription) {
            return;
        }

        const event: EventListItem = {
            id: eventToEdit ? eventToEdit.id : (Math.random() * 1000).toString(),
            name: eventName,
            description: eventDescription,
            createdAt: eventToEdit ? eventToEdit.createdAt : new Date(),
            scheduledAt: eventScheduledAt,
            status: eventToEdit ? eventToEdit.status : 'NotStarted',
            participants: 0
        };

        if (eventToEdit) {
            onUpdate(event);
        } else {
            onAdd(event);
        }

        setEventName('');
        setEventDescription('');
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
        <div className={styles.eventCreator}>
            <h2>{eventToEdit ? 'Edit Event' : 'Create New Event'}</h2>
            <input
                type="text"
                placeholder="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Event Description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
            />
            <input
                type="datetime-local"
                placeholder="Event Scheduled At"
                value={formatDate(eventScheduledAt)}
                onChange={(e) => setEventScheduledAt(new Date(e.target.value))}
            />
            <button onClick={handleSaveEvent} disabled={!eventName || !eventDescription}>
                {eventToEdit ? 'Update Event' : 'Add Event'}
            </button>
        </div>
    );
};

export default EventCreator;
