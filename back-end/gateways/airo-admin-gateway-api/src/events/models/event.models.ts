export type EventDto = { id: string, name: string, description: string, scheduledAt: Date };
export type GetEventResponse = EventDto;
export type GetAllEventsResponse = EventDto[];