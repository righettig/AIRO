import { Component, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { LogoComponent } from '../logo/logo.component';
import { AuthService } from '../services/auth.service';
import { SearchComponent } from '../search/search.component';
import { SortingComponent } from '../sorting/sorting.component';
import { NotificationsComponent } from "../notifications/notifications.component";

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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (status) => (this.isLoggedIn = status)
    );
  }
}
