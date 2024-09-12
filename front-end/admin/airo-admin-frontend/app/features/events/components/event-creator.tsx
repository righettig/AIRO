import { FC, useState, useEffect } from 'react';

import Event from '../types/event';

import styles from './event-creator.module.css';

interface EventCreatorProps {
    onAdd: (event: Event) => void;
    onUpdate: (event: Event) => void;
    eventToEdit?: Event | null;
}

const EventCreator: FC<EventCreatorProps> = ({ onAdd, onUpdate, eventToEdit }) => {
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');

    useEffect(() => {
        if (eventToEdit) {
            setEventName(eventToEdit.name);
            setEventDescription(eventToEdit.description);
        }
    }, [eventToEdit]);

    const handleSaveEvent = () => {
        if (!eventName || !eventDescription) {
            return;
        }

        const event: Event = {
            id: eventToEdit ? eventToEdit.id : (Math.random() * 1000).toString(),
            name: eventName,
            description: eventDescription,
            createdAt: eventToEdit ? eventToEdit.createdAt : new Date(),
            modifiedAt: new Date(),
            status: eventToEdit ? eventToEdit.status : 'NotStarted',
        };

        if (eventToEdit) {
            onUpdate(event);
        } else {
            onAdd(event);
        }

        setEventName('');
        setEventDescription('');
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
            <button onClick={handleSaveEvent} disabled={!eventName || !eventDescription}>
                {eventToEdit ? 'Update Event' : 'Add Event'}
            </button>
        </div>
    );
};

export default EventCreator;
