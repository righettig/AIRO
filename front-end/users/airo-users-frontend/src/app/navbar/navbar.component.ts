import { Component, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { LogoComponent } from '../logo/logo.component';
import { AuthService } from '../services/auth.service';

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
  accountType: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (status) => (this.isLoggedIn = status)
    );

    this.authService.user$.subscribe(
      (user) => {
        if (user) {
          this.accountType = user?.accountType;

        } else {
          this.accountType = '';
        }
      }
    );
  }
}
