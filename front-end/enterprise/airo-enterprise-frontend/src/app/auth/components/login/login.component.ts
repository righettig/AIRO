import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ProgressBarComponent } from '../../../common/components/progress-bar/progress-bar.component';
import { EmailInputComponent } from '../common/email-input.component';
import { PasswordInputComponent } from '../common/password-input.component';
import { PredefinedUserSelectionComponent } from '../common/predefined-user-selection.component';
import { MatError } from '@angular/material/form-field';
import { ErrorMessageComponent } from '../common/error-message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    PredefinedUserSelectionComponent,
    EmailInputComponent,
    PasswordInputComponent,
    ProgressBarComponent,
    MatError,
    ErrorMessageComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Predefined users for quick selection
  users = [
    { email: 'enterprise@airo.com', password: 'q1w2e3' },
  ];

  form: FormGroup;
  email: FormControl;
  password: FormControl;

  error = '';
  loggingIn = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: '',
      password: ''
    });

    this.email = this.form.get('email') as FormControl;
    this.password = this.form.get('password') as FormControl;
  }  

  async login() {
    if (this.form.invalid) return;

    this.loggingIn = true;
    this.error = '';
    
    try {
      await this.authService.login(this.email.value, this.password.value);
      this.router.navigate(['/agents']);
    }
    catch {
      this.error = 'Error logging in. Try again!';
    }
    finally {
      this.loggingIn = false;
    }
  }

  onUserSelected(user: { email: string; password: string }) {
    this.form.patchValue(user);
  }
}
