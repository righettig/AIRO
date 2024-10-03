import { Injectable, Logger } from '@nestjs/common';
import { BotCreatedEventHandler } from './bot-created-event.handler';
import { EventCreatedEventHandler } from './event-created-event.handler';
import { EventSubscribedEventHandler } from './event-subscribed-event.handler';
import { EventUnsubscribedEventHandler } from './event-unsubscribed-event.handler';
import { UINotification } from '../models/ui-notification.interface';
import { ModuleRef } from '@nestjs/core';

export interface IEventHandler {
  handle(payload: any): Promise<UINotification>
}

@Injectable()
export class EventHandlerFactory {
  private readonly logger = new Logger(EventHandlerFactory.name);

  // Map of event types to handler classes
  private handlers: { [eventType: string]: any } = {
    BotCreatedEvent: BotCreatedEventHandler,
    EventCreatedEvent: EventCreatedEventHandler,
    EventSubscribedEvent: EventSubscribedEventHandler,
    EventUnsubscribedEvent: EventUnsubscribedEventHandler,
  };

  constructor(private readonly moduleRef: ModuleRef) { }

  // Get the handler based on event type
  public get(eventType: string): IEventHandler | null {
    const HandlerClass = this.handlers[eventType];
    if (!HandlerClass) {
      this.logger.warn(`No handler found for event type: ${eventType}`);
      return null;
    }

    // Dynamically resolve the handler using NestJS's DI
    const handler = this.moduleRef.get(HandlerClass, { strict: false });

    return handler;
  }
}
