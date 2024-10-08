import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Event } from '../../models/event.model';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EventItemComponent } from "../event-item/event-item.component";
import { Router } from '@angular/router';
import { CountdownComponent } from '../../../../../common/components/countdown/countdown.component';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.scss',
  standalone: true,
  imports: [
    MatCardModule,
    MatButton,
    EventItemComponent,
    CountdownComponent
]
})
export class MyEventsComponent {
  router = inject(Router);

  @Input() myEvents: Event[] = [];

  @Output() onEventUnsubscribed = new EventEmitter<string>();

  unsubscribe(eventId: string) {
    if (window.confirm('Are you sure you want to unsubscribe from this event?')) {
      this.onEventUnsubscribed.emit(eventId); 
    }
  }

  gotoLiveFeed(event: Event) {
    this.router.navigate(
      [`/event-live-feed/${event.id}`],
      { 
        state: { 
          eventName: event.name,
          eventDescription: event.description
        } 
      }
    );
  }
}
