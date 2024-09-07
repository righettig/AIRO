import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
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

  showOrHidePassword = signal(true);

  async login() {
    await this.authService.login(this.email, this.password);
    this.router.navigate(['/home']);
  }

  onUserSelect(user: { email: string; password: string }) {
    this.email = user.email;
    this.password = user.password;
  }

  clickEvent(event: MouseEvent) {
    this.showOrHidePassword.set(!this.showOrHidePassword());
    event.stopPropagation();
  }
}
