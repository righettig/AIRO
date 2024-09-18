import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AgentDto } from '../models/agent-dto.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AgentBatteryLevelComponent } from '../agent-battery-level/agent-battery-level.component';
import { AgentStatusComponent } from '../agent-status/agent-status.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Roles } from '../models/roles.enum';

@Component({
  selector: 'app-agent-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    AgentBatteryLevelComponent,
    AgentStatusComponent,
  ],
  templateUrl: './agent-card.component.html',
  styleUrls: ['./agent-card.component.scss'],
})
export class AgentCardComponent implements OnInit, OnDestroy {
  @Input() agent!: AgentDto;

  displayActions: boolean = false;

  private subscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.currentUserRole$.subscribe((role) => {
      this.displayActions = role !== Roles.Guest;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onCommands() {
    this.router.navigate(['/commands', this.agent.id]);
  }

  onMissions() {
    this.router.navigate(['/missions', this.agent.id]);
  }

  copyToClipboard(id: string) {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        console.log(`ID ${id} copied to clipboard`);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  }
}
