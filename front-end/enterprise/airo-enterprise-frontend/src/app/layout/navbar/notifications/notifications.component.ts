import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  public active: boolean = true;

  constructor(private notificationService: NotificationService) {}

  toggleNotifications() {
    this.notificationService.toggleShowSuppressNotifications();
    this.active = !this.active;
  }
}
