import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PageHeaderComponent } from "../common/components/page-header/page-header.component";
import { MissionsService } from './missions.service';
import { Mission } from './models/mission.model';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    PageHeaderComponent
],
  templateUrl: './missions.component.html',
  styleUrl: './missions.component.scss',
})
export class MissionsComponent implements OnInit {
  availableCommands: string[] = [];
  selectedCommands: { id: number; command: string }[] = [];

  missions: Mission[] = [];
  missionName: string = '';
  agentId!: string | null;

  isLoading: boolean = false;
  form: FormGroup;

  private commandIdCounter: number = 0; // Counter to generate unique IDs

  constructor(
    private missionsService: MissionsService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      missionName: ['', Validators.required],
      commands: [[], Validators.required],
    });
  }

  async ngOnInit() {
    this.agentId = this.route.snapshot.paramMap.get('id');

    this.isLoading = true;
    await this.loadAvailableCommands();
    await this.loadMissions();
    this.isLoading = false;
  }

  addCommand(command: string, matSelect: MatSelect) {
    const commandObj = { id: this.commandIdCounter++, command };
    this.selectedCommands.push(commandObj);
    this.form
      .get('commands')
      ?.setValue(this.selectedCommands.map((c) => c.command));

    matSelect.value = null; // Clear the selection
  }

  removeCommand(commandId: number) {
    this.selectedCommands = this.selectedCommands.filter(
      (c) => c.id !== commandId
    );
    this.form
      .get('commands')
      ?.setValue(this.selectedCommands.map((c) => c.command));
  }

  async loadAvailableCommands() {
    this.availableCommands = await this.missionsService.getCommands();
  }

  async loadMissions() {
    this.missions = await this.missionsService.getMissions();
  }

  async saveMission() {
    if (this.form.invalid || this.selectedCommands.length === 0) {
      return; // Prevent saving if the form is invalid or no commands are selected
    }

    const mission: Mission = {
      id: '',
      name: this.form.get('missionName')!.value,
      commands: this.selectedCommands.map((c) => c.command),
    };
    const savedMission = await this.missionsService.createMission(mission);

    this.selectedCommands = [];
    this.missionName = '';

    this.missions.push(savedMission);
  }

  async deleteMission(missionId: string) {
    try {
      await this.missionsService.deleteMission(missionId);
      this.missions = this.missions.filter(mission => mission.id !== missionId);
    } catch (error) {
      console.error('Error deleting mission', error); // TODO: add notification
    }
  }

  async executeMission(missionId: string) {
    await this.missionsService.executeMission(this.agentId!, missionId);
  }
}
