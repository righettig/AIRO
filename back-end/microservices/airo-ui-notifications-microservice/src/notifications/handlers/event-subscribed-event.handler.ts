import { Injectable } from '@nestjs/common';
import { UINotification } from '../models/ui-notification.interface';
import { IEventHandler } from './event-handler-factory';

@Injectable()
export class EventSubscribedEventHandler implements IEventHandler  {
    handle({ UserId, EventId }): UINotification {
        return {
            message: `You have entered the event '${EventId}'`,
            createdAt: new Date(),
            targetAudience: UserId,
            type: 'events',
        };
    }
}
