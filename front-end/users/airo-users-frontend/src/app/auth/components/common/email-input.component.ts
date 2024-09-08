import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-email-input',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatIconModule],
  template: `
    <mat-form-field appearance="outline" style="width: 100%;">
      <mat-label>Email</mat-label>
      <input
        matInput
        placeholder="Enter your email"
        [(ngModel)]="email"
        name="email"
        required
        email
        #emailCtrl="ngModel"
        (ngModelChange)="emailChange.emit(email)"
      />
      <mat-icon matSuffix>alternate_email</mat-icon>
      @if (emailCtrl.invalid && emailCtrl.touched) {
        <mat-error>
          @if (emailCtrl.errors?.['required']) { <span>Email is required</span> }
          @if (emailCtrl.errors?.['email']) { <span>Please enter a valid email address</span> }
        </mat-error>
      }
    </mat-form-field>
  `
})
export class EmailInputComponent {
  @Input() email = '';
  @Output() emailChange = new EventEmitter<string>();
}
