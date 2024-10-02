import { Injectable } from '@nestjs/common';
import { UINotification } from '../models/ui-notification.interface';
import { IEventHandler } from './event-handler-factory';
import { EventsService } from '../services/events.service';

@Injectable()
export class EventSubscribedEventHandler implements IEventHandler {
  constructor(private readonly eventsService: EventsService) { }

  async handle({ UserId, EventId }): Promise<UINotification> {
    const eventName = await this.eventsService.getEventName(EventId);

    return {
      message: `You have entered the event '${eventName}'`,
      createdAt: new Date(),
      targetAudience: UserId,
      type: 'events',
    };
  }
}
