import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventLiveFeedService } from '../../services/event-live-feed.service';

@Component({
  selector: 'app-event-live-feed',
  templateUrl: './event-live-feed.component.html',
  styleUrl: './event-live-feed.component.scss',
  standalone: true,
  imports: []
})
export class EventLiveFeedComponent {
  eventId: string | null = null;
  eventLiveFeed: any; // TODO: add type

  eventName!: string;
  eventDescription!: string;

  constructor(
    private route: ActivatedRoute,
    private readonly eventLiveFeedService: EventLiveFeedService) { }

  async ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    
    this.eventName = history.state.eventName;
    this.eventDescription = history.state.eventDescription;

    this.eventLiveFeed = await this.eventLiveFeedService.getLiveFeed(this.eventId!);

    // TODO: use signalR
    setInterval(async () => {
      this.eventLiveFeed = await this.eventLiveFeedService.getLiveFeed(this.eventId!);
    }, 5000);
  }
}
