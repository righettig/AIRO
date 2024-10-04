import { Component, Input } from '@angular/core';
import { Event } from '../../models/event.model';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrl: './event-item.component.scss',
  standalone: true,
  imports: [
    MatCardModule,
    MatButton,
    NgClass
  ]
})
export class EventItemComponent {
  @Input() event!: Event;
}
