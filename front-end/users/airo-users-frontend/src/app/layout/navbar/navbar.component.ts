import { Component, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { AuthService } from '../../auth/services/auth.service';
import { LogoComponent } from './logo/logo.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbar,
    UserProfileComponent,
    LogoComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  nickname: string = '';
  accountType: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (status) => (this.isLoggedIn = status)
    );

    this.authService.user$.subscribe(
      (user) => {
        if (user) {
          this.nickname = user.nickname;
          this.accountType = user.accountType;

        } else {
          this.nickname = '';
          this.accountType = '';
        }
      }
    );
  }
}
