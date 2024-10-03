import { Component, OnInit } from '@angular/core';
import { EventsService } from './services/events.service';
import { Event } from './models/event.model';
import { EventListComponent } from "./components/event-list/event-list.component";
import { MyEventsComponent } from "./components/my-events/my-events.component";
import { EventSubscriptionService } from './services/event-subscription.service';
import { BotStoreService } from '../bots/services/bot-store.service';
import { Bot } from '../bots/models/bot.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  standalone: true,
  imports: [EventListComponent, MyEventsComponent]
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  myEvents: Event[] = [];
  myBots: Bot[] = [];

  constructor(
    private readonly eventsService: EventsService,
    private readonly botStoreService: BotStoreService,
    private readonly eventSubscriptionService: EventSubscriptionService) { }

  async ngOnInit() {
    this.events = await this.eventsService.getAllEvents();
    this.myBots = await this.botStoreService.getMyBots();
    
    const myEventIds = await this.eventSubscriptionService.getSubscribedEvents();
    this.myEvents = this.events.filter(x => myEventIds.includes(x.id));
  }

  async onEventSubscribed({ eventId, botId }: { eventId: string, botId: string}) {
    await this.eventSubscriptionService.subscribeToEvent(eventId, botId);

    const subscribedEvent = this.events.find(x => x.id == eventId);
    this.myEvents.push(subscribedEvent!);
  }

  async onEventUnsubscribed(eventId: string) {
    await this.eventSubscriptionService.unsubscribeFromEvent(eventId);

    const unsubscribedEventIndex = this.myEvents.findIndex(x => x.id == eventId);
    this.myEvents.splice(unsubscribedEventIndex, 1);
  }
}
