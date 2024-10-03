import { FC } from 'react';

import { EventListItem } from '../types/event';

import styles from './event-item.module.css';

interface EventItemProps {
    event: EventListItem;
    onDelete: (id: string) => void;
    onEdit: (event: EventListItem) => void;
    onStart: (event: EventListItem) => void;
    onDetails: (id: string) => void;
}

const EventItem: FC<EventItemProps> = ({ event, onDelete, onEdit, onStart, onDetails }) => {
    return (
        <li className={styles.eventItem}>
            <div className={styles.eventDetails}>
                <strong>{event.name}</strong>
                <p>{event.description}</p>
            </div>
            <div className={styles.eventMeta}>
                <p>Status: {event.status}</p>
                <p>Created At: {new Date(event.createdAt).toLocaleString()}</p>
                <p>Participants: {event.participants}</p>
            </div>
            <div className={styles.eventActions}>
                {event.status === 'NotStarted' && (
                    <button onClick={() => onStart(event)}>Start</button>
                )}
                <button onClick={() => onEdit(event)}>Edit</button>
                <button onClick={() => onDelete(event.id)}>Delete</button>
                <button onClick={() => onDetails(event.id)}>Details</button>
            </div>
        </li>
    );
};

export default EventItem;
