import { Component, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { AuthService } from '../../auth/services/auth.service';
import { LogoComponent } from './logo/logo.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SearchComponent } from './search/search.component';
import { SortingComponent } from './sorting/sorting.component';
import { NotificationsComponent } from './notifications/notifications.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbar,
    UserProfileComponent,
    LogoComponent,
    SearchComponent,
    SortingComponent,
    NotificationsComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  accountType: string = 'Enterprise';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (status) => (this.isLoggedIn = status)
    );
  }
}
