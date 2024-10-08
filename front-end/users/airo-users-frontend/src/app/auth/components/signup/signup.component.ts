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
import { CreditCardInputComponent } from './credit-card-input.component';

export type AccountType = 'free' | 'pro';

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
    ErrorMessageComponent,
    CreditCardInputComponent
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
  creditCard: FormControl;
  accountType: AccountType = 'free';

  error = '';
  signingUp = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: '',
      password: '',
      creditCard: '4012 8888 8888 1881',
    });

    this.email = this.form.get('email') as FormControl;
    this.password = this.form.get('password') as FormControl;
    this.creditCard = this.form.get('creditCard') as FormControl;
  }

  async signup() {
    if (this.form.invalid) return;

    this.signingUp = true;
    this.error = '';

    try {
      await this.authService.signup(
        this.email.value, 
        this.password.value, 
        this.accountType, 
        this.accountType === 'pro' ? this.creditCard.value : undefined
      );

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
