import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountTypeSelectionComponent } from './account-type-selection.component';
import { ProgressBarComponent } from '../../../common/components/progress-bar/progress-bar.component';
import { EmailInputComponent } from '../common/email-input.component';
import { PasswordInputComponent } from '../common/password-input.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    AccountTypeSelectionComponent,
    EmailInputComponent,
    PasswordInputComponent,
    ProgressBarComponent
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  accountType = 'free';

  signingUp = false;

  async signup(form: NgForm) {
    if (form.valid) {
      this.signingUp = true;
      await this.authService.signup(this.email, this.password, this.accountType);
      this.signingUp = false;

      this.router.navigate(['/home']);
    }
  }
}
