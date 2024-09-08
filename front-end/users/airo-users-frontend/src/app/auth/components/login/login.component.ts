import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
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
    RouterModule,
    FormsModule,
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
    { email: 'giacomo@airo.com', password: 'q1w2e3' },
    { email: 'test1@airo.com', password: 'q1w2e3' },
    { email: 'test2@airo.com', password: 'q1w2e3' },
  ];

  email = '';
  password = '';
  error = '';
  loggingIn = false;

  async login(form: NgForm) {
    if (form.valid) {
      this.loggingIn = true;
      this.error = '';
      
      try {
        await this.authService.login(this.email, this.password);
        this.router.navigate(['/home']);
      }
      catch (error) {
        this.error = 'Error logging in. Try again!';
      }
      finally {
        this.loggingIn = false;
      }
    }
  }

  onUserSelected(user: { email: string; password: string }) {
    this.email = user.email;
    this.password = user.password;
  }
}
