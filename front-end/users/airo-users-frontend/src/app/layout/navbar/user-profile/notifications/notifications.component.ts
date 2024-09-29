import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from './services/notification.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { NotificationDto } from './models/notification-dto';
import { TimeAgoPipe } from '../../../../common/pipes/time-ago.pipe';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    DatePipe,
    TimeAgoPipe
],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  public notifications: NotificationDto[] = [];

  constructor(private notificationService: NotificationService) { }

  async ngOnInit() {
    this.loadNotifications();
    
    setInterval(async () => {
      this.loadNotifications();
    }, 10 * 1000);
  }

  public async deleteNotification(notificationId: string, event: Event) {
    await this.notificationService.deleteNotification(notificationId);
    event.stopPropagation();
  }

  public async readNotification(notificationId: string, event: Event) {
    await this.notificationService.markAsRead(notificationId);
    event.stopPropagation();
  }

  private async loadNotifications() {
    this.notifications = await this.notificationService.getAll();
  }
}
