import { Routes } from '@angular/router';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { LoginComponent } from './auth/components/login/login.component';
import { ProfileComponent } from './profile/components/profile.component';
import { EventsComponent } from './home/components/events/events.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'events', component: EventsComponent, canActivate: [AuthGuard] },
];
