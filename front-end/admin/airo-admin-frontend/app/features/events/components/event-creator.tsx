import { FC, useState, useEffect } from 'react';

import { EventListItem } from '../types/event';
import { fetchMaps } from '@/app/common/maps.service';

import Map from "../../maps/types/map";

interface EventCreatorProps {
    onAdd: (event: EventListItem) => void;
    onUpdate: (event: EventListItem) => void;
    eventToEdit?: EventListItem | null;
}

const EventCreator: FC<EventCreatorProps> = ({ onAdd, onUpdate, eventToEdit }) => {
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventScheduledAt, setEventScheduledAt] = useState(new Date());
    const [maps, setMaps] = useState<Map[]>([]);
    const [selectedMapId, setSelectedMapId] = useState<string>('');

    useEffect(() => {
        if (eventToEdit) {
            setEventName(eventToEdit.name);
            setEventDescription(eventToEdit.description);
            setEventScheduledAt(new Date(eventToEdit.scheduledAt));
            setSelectedMapId(eventToEdit.mapId || '');
        }
    }, [eventToEdit]);

    // Fetch available maps when component mounts
    useEffect(() => {
        const loadMaps = async () => {
            const fetchedMaps = await fetchMaps();
            setMaps(fetchedMaps || []);
        };
        loadMaps();
    }, []);

    const handleSaveEvent = () => {
        if (!eventName || !eventDescription || !selectedMapId) return;

        const event: EventListItem = {
            id: eventToEdit ? eventToEdit.id : (Math.random() * 1000).toString(),
            name: eventName,
            description: eventDescription,
            mapId: selectedMapId,
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
        setSelectedMapId('');
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
        <div style={{ display: 'flex', flexDirection: 'column', width: '20%', minWidth: '280px' }}>
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
            <select
                value={selectedMapId}
                onChange={(e) => setSelectedMapId(e.target.value)}
            >
                <option value="" disabled>Select Map</option>
                {maps.map((map) => (
                    <option key={map.id} value={map.id!}>
                        {map.name}
                    </option>
                ))}
            </select>
            <div>
                <button onClick={handleSaveEvent} disabled={!eventName || !eventDescription || !selectedMapId}>
                    {eventToEdit ? 'Update Event' : 'Add Event'}
                </button>
            </div>
        </div>
    );
};

export default EventCreator;
