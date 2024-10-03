import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../models/event.model';
import { MatSelectModule } from '@angular/material/select';
import { BotStoreService } from '../../../bots/services/bot-store.service';
import { Bot } from '../../../bots/models/bot.model';
import { EventSubscriptionService } from '../../services/event-subscription.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  standalone: true,
  imports: [
    MatSelectModule
  ]
})
export class EventListComponent implements OnInit {
  @Input() events: Event[] = [];

  myBots: Bot[] = [];
  selectedBotId: string | undefined = undefined;
  subscribing = false;
  eventId: string | undefined = undefined;

  constructor(
    private readonly botStoreService: BotStoreService,
    private readonly eventSubscriptionService: EventSubscriptionService) {}

  async ngOnInit() {
    this.myBots = await this.botStoreService.getMyBots();
  }

  subscribe(eventId: string) {
    this.eventId = eventId;
    this.subscribing = true;
  }

  onBotChange(botId: string) {
    this.selectedBotId = botId;
  }

  async confirmSubscription() {
    // show confirmation dialog
    await this.eventSubscriptionService.subscribeToEvent(this.eventId!, this.selectedBotId!);
  }

  async unsubscribe(eventId: string) {
    // show confirmation dialog
    await this.eventSubscriptionService.unsubscribeFromEvent(eventId);
  }
}
