import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-agent-battery-level',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './agent-battery-level.component.html',
  styleUrl: './agent-battery-level.component.scss',
})
export class AgentBatteryLevelComponent {
  @Input() batteryLevel!: number;
}
