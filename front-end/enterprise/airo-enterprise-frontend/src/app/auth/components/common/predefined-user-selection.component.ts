import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-predefined-user-selection',
  standalone: true,
  imports: [MatSelectModule, MatIconModule],
  template: `
    <mat-form-field appearance="outline" style="width: 100%;">
      <mat-label>Select predefined user</mat-label>
      <mat-select (valueChange)="onUserChange($event)">
        @for (user of users; track user.email) {
          <mat-option [value]="user">{{user.email}}</mat-option>
        }
      </mat-select>
      <mat-icon matSuffix>account_circle</mat-icon>
    </mat-form-field>
  `
})
export class PredefinedUserSelectionComponent {
  @Input() users: { email: string; password: string }[] = [];
  @Output() userSelected = new EventEmitter<{ email: string; password: string }>();

  onUserChange(user: { email: string; password: string }) {
    this.userSelected.emit(user);
  }
}
