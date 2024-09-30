import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from './services/notification.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { NotificationDto } from './models/notification-dto';
import { TimeAgoPipe } from '../../../../common/pipes/time-ago.pipe';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    DatePipe,
    TimeAgoPipe,
    RouterModule
],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  public notifications: NotificationDto[] = [];

  constructor(
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) { }

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

  public async showAllNotifications() {
    this.router.navigate(['/all-notifications']);
  }

  private async loadNotifications() {
    this.notifications = await this.notificationService.getMostRecent();
  }
}
