import { FC } from 'react';

import { EventListItem } from '../types/event';
import EventItem from './event-item';

import styles from './event-list.module.css';

interface EventListProps {
    events: EventListItem[];
    onDelete: (id: string) => void;
    onEdit: (event: EventListItem) => void;
    onStart: (event: EventListItem) => void;
    onDetails: (id: string) => void;
}

const EventList: FC<EventListProps> = ({ events, onDelete, onEdit, onStart, onDetails }) => {
    return (
        <div className={styles.eventList}>
            <h2>Event List</h2>
            <ul>
                {events.map(event => (
                    <EventItem
                        key={event.id}
                        event={event}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onStart={onStart}
                        onDetails={onDetails}
                    />
                ))}
            </ul>
        </div>
    );
};

export default EventList;
