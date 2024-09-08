import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccountTypeSelectionComponent } from './account-type-selection.component';
import { ProgressBarComponent } from '../../../common/components/progress-bar/progress-bar.component';
import { EmailInputComponent } from '../common/email-input.component';
import { PasswordInputComponent } from '../common/password-input.component';
import { ErrorMessageComponent } from '../common/error-message';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    AccountTypeSelectionComponent,
    EmailInputComponent,
    PasswordInputComponent,
    ProgressBarComponent,
    ErrorMessageComponent
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup;
  email: FormControl;
  password: FormControl;
  accountType = 'free';

  error = '';
  signingUp = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: '',
      password: ''
    });

    this.email = this.form.get('email') as FormControl;
    this.password = this.form.get('password') as FormControl;
  }

  async signup() {
    if (this.form.invalid) return;

    this.signingUp = true;
    this.error = '';

    try {
      await this.authService.signup(this.email.value, this.password.value, this.accountType);
      this.router.navigate(['/home']);
    }
    catch (error) {
      this.error = 'Error signing up. Try again!';
    }
    finally {
      this.signingUp = false;
    }
  }
}
