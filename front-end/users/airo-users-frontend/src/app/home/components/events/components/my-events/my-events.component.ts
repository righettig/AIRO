import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Event } from '../../models/event.model';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.scss',
  standalone: true,
  imports: [
    MatCardModule,
    MatButton
  ]
})
export class MyEventsComponent {
  @Input() myEvents: Event[] = [];

  @Output() onEventUnsubscribed = new EventEmitter<string>();

  unsubscribe(eventId: string) {
    if (window.confirm('Are you sure you want to unsubscribe from this event?')) {
      this.onEventUnsubscribed.emit(eventId); 
    }
  }
}
