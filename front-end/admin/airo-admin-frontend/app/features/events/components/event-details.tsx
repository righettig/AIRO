'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchEventWithDetails } from '@/app/common/events.service';

const EventDetails = () => {
    const { eventId } = useParams<{ eventId: string }>()
    const [event, setEvent] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (eventId) {
            const getEventDetails = async () => {
                try {
                    const eventData = await fetchEventWithDetails(eventId);
                    setEvent(eventData);
                } catch (err) {
                    setError('Failed to fetch event details.');
                } finally {
                    setLoading(false);
                }
            };

            getEventDetails();
        }
    }, [eventId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!event) return <div>No event found</div>;

    return (
        <div>
            <h1>Event Details</h1>
            <p><strong>ID:</strong> {event.id}</p>
            <p><strong>Name:</strong> {event.name}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Participants: </strong>
                {event.participants.length > 0 ? (
                    <ul>
                        {event.participants.map((userId: string) => (
                            <li key={userId}>{userId}</li>
                        ))}
                    </ul>
                ) : (
                    <span>No participants yet</span>
                )}
            </p>
            <p><strong>Status:</strong> {event.status}</p>
            <p><strong>Created At:</strong> {new Date(event.createdAt).toLocaleString()}</p>
            <p><strong>Scheduled At:</strong> {new Date(event.scheduledAt).toLocaleString()}</p>
        </div>
    );
};

export default EventDetails;
