import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [
    FormsModule,
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
        [(ngModel)]="password"
        name="password"
        required
        minlength="6"
        #passwordCtrl="ngModel"
        (ngModelChange)="passwordChange.emit(password)"
      />
      <button type="button" mat-icon-button matSuffix (click)="togglePasswordVisibility()" style="margin-right: 4px;">
        <mat-icon>{{ showOrHidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
      </button>
      @if (passwordCtrl.invalid && passwordCtrl.touched) {
        <mat-error>
          @if (passwordCtrl.errors?.['required']) { <span>Password is required</span> }
          @if (passwordCtrl.errors?.['minlength']) { <span>Password must be at least 6 characters long</span> }
        </mat-error>
      }
    </mat-form-field>
  `
})
export class PasswordInputComponent {
  @Input() password = '';
  @Output() passwordChange = new EventEmitter<string>();

  showOrHidePassword = signal(true);

  togglePasswordVisibility() {
    this.showOrHidePassword.set(!this.showOrHidePassword());
  }
}
