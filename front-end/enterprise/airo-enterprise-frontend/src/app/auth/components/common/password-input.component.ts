import { Component, Input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <mat-form-field appearance="outline" style="width: 100%;">
      <mat-label>Password</mat-label>
      <input
        matInput
        [type]="showOrHidePassword() ? 'password' : 'text'"
        placeholder="Enter your password"
        [formControl]="password"
        name="password"
        required
        minlength="6"
      />
      <button type="button" mat-icon-button matSuffix (click)="togglePasswordVisibility()" style="margin-right: 4px;">
        <mat-icon>{{ showOrHidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
      </button>
      @if (password.invalid && password.touched) {
        <mat-error>
          @if (password.errors?.['required']) { <span>Password is required</span> }
          @if (password.errors?.['minlength']) { <span>Password must be at least 6 characters long</span> }
        </mat-error>
      }
    </mat-form-field>
  `
})
export class PasswordInputComponent {
  @Input() password!: FormControl;

  showOrHidePassword = signal(true);

  togglePasswordVisibility() {
    this.showOrHidePassword.set(!this.showOrHidePassword());
  }
}
