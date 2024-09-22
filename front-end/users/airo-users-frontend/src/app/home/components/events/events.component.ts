import { Component, OnInit } from '@angular/core';
import { EventsService } from './services/events.service';
import { Event } from './models/event.model';
import { EventListComponent } from "./components/event-list/event-list.component";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  standalone: true,
  imports: [EventListComponent]
})
export class EventsComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventsService: EventsService) { }

  async ngOnInit() {
    this.events = await this.eventsService.getAllEvents();
  }
}
