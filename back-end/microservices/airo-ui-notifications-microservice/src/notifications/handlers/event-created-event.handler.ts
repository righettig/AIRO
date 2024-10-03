import { Injectable } from '@nestjs/common';
import { UINotification } from '../models/ui-notification.interface';
import { IEventHandler } from './event-handler-factory';

@Injectable()
export class EventCreatedEventHandler implements IEventHandler  {
    async handle({ Name }): Promise<UINotification> {
        return {
            message: `There is a new event available '${Name}'`,
            createdAt: new Date(),
            targetAudience: 'all',
            type: 'events',
        };
    }
}