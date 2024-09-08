import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { ProgressBarComponent } from '../common/components/progress-bar/progress-bar.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    ProgressBarComponent
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  email = '';
  password = '';
  accountType = 'free';

  showOrHidePassword = signal(true);

  signingUp = false;

  async signup() {
    this.signingUp = true;
    await this.authService.signup(this.email, this.password, this.accountType);
    this.signingUp = false;
    
    this.router.navigate(['/home']);
  }

  clickEvent(event: MouseEvent) {
    this.showOrHidePassword.set(!this.showOrHidePassword());
    event.stopPropagation();
  }
}
