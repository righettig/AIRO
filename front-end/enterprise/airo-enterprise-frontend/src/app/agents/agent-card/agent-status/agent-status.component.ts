import { Component, Input, SimpleChanges } from '@angular/core';
import { Status, getStatusString } from '../../models/status.enum';

@Component({
  selector: 'app-agent-status',
  standalone: true,
  imports: [],
  templateUrl: './agent-status.component.html',
  styleUrl: './agent-status.component.scss',
})
export class AgentStatusComponent {
  @Input() status!: Status;
  statusString!: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status']) {
      this.statusString = getStatusString(this.status);
    }
  }
}
