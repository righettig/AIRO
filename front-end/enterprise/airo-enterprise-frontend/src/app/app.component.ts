import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgentsComponent } from './agents/agents.component';
import { LayoutComponent } from "./layout/layout.component";
import { AgentService } from './agents/agent.service';
import { NotificationService } from './layout/navbar/notifications/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AgentsComponent, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private agentService: AgentService,
    private notificationService: NotificationService) {
      this.agentService.anomalyDetected$.subscribe(message => {
        this.notificationService.showNotification(message);
      });

      this.agentService.hardwareFailure$.subscribe(message => {
        this.notificationService.showNotification(message);
      });
    }
}
