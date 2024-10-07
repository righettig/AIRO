import { ChangeDetectionStrategy, Component, EventEmitter, Inject, inject, Input, OnInit, Output } from '@angular/core';
import { Event } from '../../models/event.model';
import { MatSelectModule } from '@angular/material/select';
import { Bot } from '../../../bots/models/bot.model';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { EventItemComponent } from "../event-item/event-item.component";
import { BotBehaviour } from '../../../bots/models/bot-behaviour.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  standalone: true,
  imports: [
    MatSelectModule,
    MatCardModule,
    MatButton,
    EventItemComponent
]
})
export class EventListComponent {
  @Input() events: Event[] = [];
  @Input() myEvents: Event[] = [];
  @Input() myBots: Bot[] = [];
  @Input() botBehaviours: BotBehaviour[] = [];

  @Output() onEventSubscribed = new EventEmitter<{ eventId: string, botId: string, botBehaviourId: string }>();

  private readonly dialog = inject(MatDialog);

  subscribe(eventId: string) {
    const dialogRef = this.dialog.open(EventSubscriptionDialog, {
      data: {
        myBots: this.myBots,
        botBehaviours: this.botBehaviours
      },
    });

    dialogRef.afterClosed().subscribe((data: { botId: string, botBehaviourId: string } | undefined) => {
      if (data) {
        this.onEventSubscribed.emit({ eventId, botId: data.botId, botBehaviourId: data.botBehaviourId });
      }
    });
  }
}

@Component({
  selector: 'event-subscription-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatSelectModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>Event subscription</h2>
    <mat-dialog-content style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        Choose the bot that you would like to enter the event with
        <mat-select (valueChange)="onBotChange($event)" [(ngModel)]="selectedBotId" style="margin-top: 14px">
          @for (bot of myBots; track bot.id) {
            <mat-option [value]="bot.id">{{bot.name}}</mat-option>
          }
        </mat-select>
      </div>
      <div>
        Choose the bot behaviour that you would like to enter the event with
        <mat-select (valueChange)="onBotBehaviourChange($event)" [(ngModel)]="selectedBotBehaviourId" style="margin-top: 14px">
          @for (botBehaviour of botBehaviours; track botBehaviour.id) {
            <mat-option [value]="botBehaviour.id">{{botBehaviour.name}}</mat-option>
          }
        </mat-select>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [disabled]="!selectedBotId" (click)="confirmSubscription()">Confirm</button>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
})
export class EventSubscriptionDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: { myBots: Bot[], botBehaviours: BotBehaviour[] },
    private readonly dialogRef: MatDialogRef<EventSubscriptionDialog>) { }

  myBots: Bot[] = [];
  botBehaviours: BotBehaviour[] = [];
  selectedBotId: string | undefined = undefined;
  selectedBotBehaviourId: string | undefined = undefined;

  ngOnInit(): void {
    this.myBots = this.data.myBots;
    this.botBehaviours = this.data.botBehaviours;
    this.selectedBotId = this.myBots[0].id;
    this.selectedBotBehaviourId = this.botBehaviours[0].id;
  }

  onBotChange(botId: string) {
    this.selectedBotId = botId;
  }

  onBotBehaviourChange(botBehaviourId: string) {
    this.selectedBotBehaviourId = botBehaviourId;
  }

  confirmSubscription() {
    this.dialogRef.close({ 
      botId: this.selectedBotId, 
      botBehaviourId: this.selectedBotBehaviourId 
    });
  }
}