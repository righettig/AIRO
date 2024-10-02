import { Injectable } from '@nestjs/common';
import { UINotification } from '../models/ui-notification.interface';
import { IEventHandler } from './event-handler-factory';

@Injectable()
export class BotCreatedEventHandler implements IEventHandler {
    async handle({ Name }): Promise<UINotification> {
        return {
            message: `There is a new bot available '${Name}'`,
            createdAt: new Date(),
            targetAudience: 'all',
            type: 'bots',
        };
    }
}
