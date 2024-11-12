import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-nickname-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <mat-form-field appearance="outline" style="width: 100%;">
      <mat-label>Nickname</mat-label>
      <input
        matInput
        [type]="'text'"
        placeholder="Enter your nickname"
        [formControl]="nickname"
        name="nickname"
        required
        minlength="3"
      />
      <button type="button" mat-icon-button matSuffix style="margin-right: 4px;">
        <mat-icon>account_circle</mat-icon>
      </button>
      @if (nickname.invalid && nickname.touched) {
        <mat-error>
          @if (nickname.errors?.['required']) { <span>Nickname is required</span> }
          @if (nickname.errors?.['minlength']) { <span>Nickname must be at least 3 characters long. </span> }
          @if (nickname.errors?.['maxlength']) { <span>Nickname cannot exceed 32 characters. </span> }
          @if (nickname.errors?.['pattern']) { <span>Nickname can only contain letters, numbers, hyphens, underscores, and periods</span> }
        </mat-error>
      }
    </mat-form-field>
  `
})
export class NicknameInputComponent {
  @Input() nickname!: FormControl;
}
