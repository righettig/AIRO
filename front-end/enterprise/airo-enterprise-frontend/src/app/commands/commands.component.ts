import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentService } from '../services/agent.service';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PageHeaderComponent } from '../page-header/page-header.component';

@Component({
  selector: 'app-commands',
  standalone: true,
  imports: [MatButtonModule, MatListModule, MatProgressBarModule, PageHeaderComponent],
  templateUrl: './commands.component.html',
  styleUrl: './commands.component.scss',
})
export class CommandsComponent implements OnInit {
  public agentId!: string | null;
  public isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private agentService: AgentService
  ) { }

  private performAction(action: () => Promise<void>) {
    this.isLoading = true;
    action().finally(() => {
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.agentId = this.route.snapshot.paramMap.get('id');
  }

  shutdown() {
    this.performAction(() => this.agentService.shutdownAgent(this.agentId!));
  }

  recharge() {
    this.performAction(() => this.agentService.rechargeAgent(this.agentId!));
  }

  wakeup() {
    this.performAction(() => this.agentService.wakeupAgent(this.agentId!));
  }

  setManualMode(manualMode: boolean) {
    this.performAction(() =>
      this.agentService.setManualMode(this.agentId!, manualMode)
    );
  }

  thermalInspection() {
    this.performAction(() =>
      this.agentService.thermalInspection(this.agentId!)
    );
  }

  combustibleInspection() {
    this.performAction(() =>
      this.agentService.combustibleInspection(this.agentId!)
    );
  }

  gasInspection() {
    this.performAction(() => this.agentService.gasInspection(this.agentId!));
  }

  acousticMeasure() {
    this.performAction(() => this.agentService.acousticMeasure(this.agentId!));
  }

  moveLeft() {
    this.performAction(() => this.agentService.moveLeft(this.agentId!));
  }

  moveRight() {
    this.performAction(() => this.agentService.moveRight(this.agentId!));
  }

  moveForward() {
    this.performAction(() => this.agentService.moveForward(this.agentId!));
  }

  moveBackward() {
    this.performAction(() => this.agentService.moveBackward(this.agentId!));
  }
}
