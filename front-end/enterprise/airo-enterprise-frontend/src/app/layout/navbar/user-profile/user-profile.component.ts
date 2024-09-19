import { Component, inject, Input } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../auth/services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    MatIcon,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    TitleCasePipe
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  @Input() accountType!: string;

  private router = inject(Router);

  constructor(private authService: AuthService) { }

  onProfile() {
    this.router.navigate(['/profile']);
  }

  onLogout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
