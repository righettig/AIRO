import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NotificationService } from '../layout/navbar/user-profile/notifications/services/notification.service';
import { NotificationDto } from '../layout/navbar/user-profile/notifications/models/notification-dto';
import { TimeAgoPipe } from "../common/pipes/time-ago.pipe";

@Component({
  selector: 'app-all-notifications',
  templateUrl: './all-notifications.component.html',
  styleUrl: './all-notifications.component.scss',
  standalone: true,
  imports: [
    MatCardModule,
    TimeAgoPipe
]
})
export class AllNotificationsComponent implements OnInit {
  public notifications: NotificationDto[] = [];

  constructor(private readonly notificationService: NotificationService) {}
  
  async ngOnInit() {
    this.loadNotifications();
    
    setInterval(async () => {
      this.loadNotifications();
    }, 10 * 1000);
  }

  private async loadNotifications() {
    this.notifications = await this.notificationService.getAll();
  }
}
