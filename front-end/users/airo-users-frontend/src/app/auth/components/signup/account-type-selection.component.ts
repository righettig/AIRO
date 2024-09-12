import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AccountType } from './signup.component';

@Component({
  selector: 'app-account-type-selection',
  standalone: true,
  imports: [MatSelectModule, MatIconModule, FormsModule],
  template: `
    <mat-form-field appearance="outline" style="width: 100%;">
      <mat-label>Select account type</mat-label>
      <mat-select [(ngModel)]="accountType" (ngModelChange)="accountTypeChange.emit(accountType)">
        <mat-option value="free">Free</mat-option>
        <mat-option value="pro">Pro</mat-option>
      </mat-select>
      <mat-icon matSuffix>account_circle</mat-icon>
    </mat-form-field>
  `
})
export class AccountTypeSelectionComponent {
  @Input() accountType: AccountType = 'free';
  @Output() accountTypeChange = new EventEmitter<AccountType>();
}
