import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-email-input',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatIconModule],
  template: `
    <mat-form-field appearance="outline" style="width: 100%;">
      <mat-label>Email</mat-label>
      <input
        matInput
        placeholder="Enter your email"
        [formControl]="email"
        name="email"
        required
        email
      />
      <mat-icon matSuffix>alternate_email</mat-icon>
      @if (email.invalid && email.touched) {
        <mat-error>
          @if (email.errors?.['required']) { <span>Email is required</span> }
          @if (email.errors?.['email']) { <span>Please enter a valid email address</span> }
        </mat-error>
      }
    </mat-form-field>
  `
})
export class EmailInputComponent {
  @Input() email!: FormControl;
}
