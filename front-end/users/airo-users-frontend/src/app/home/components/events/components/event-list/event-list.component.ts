import { Component, Input } from '@angular/core';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  standalone: true,
  imports: []
})
export class EventListComponent {
  @Input() events: Event[] = [];
}
