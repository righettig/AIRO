import { Component, Input } from '@angular/core';
import { AgentDto } from '../models/agent-dto.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AgentBatteryLevelComponent } from './agent-battery-level/agent-battery-level.component';
import { AgentStatusComponent } from './agent-status/agent-status.component';
import { Router, RouterModule } from '@angular/router';

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
export class AgentCardComponent {
  @Input() agent!: AgentDto;

  constructor(private router: Router) {}

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
