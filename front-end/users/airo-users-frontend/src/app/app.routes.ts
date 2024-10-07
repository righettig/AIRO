import { Routes } from '@angular/router';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { LoginComponent } from './auth/components/login/login.component';
import { ProfileComponent } from './profile/components/profile.component';
import { EventsComponent } from './home/components/events/events.component';
import { AllNotificationsComponent } from './all-notifications/all-notifications.component';
import { EventLiveFeedComponent } from './home/components/events/components/event-live-feed/event-live-feed.component';
import { BotDetailsComponent } from './home/components/bots/components/bot-details/bot-details.component';
import { BotBehavioursResolver } from './home/components/bots/resolvers/bot-behaviours.resolver';
import { BotResolver } from './home/components/bots/resolvers/bot.resolver';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'events', component: EventsComponent, canActivate: [AuthGuard] },
  { path: 'event-live-feed/:eventId', component: EventLiveFeedComponent, canActivate: [AuthGuard] },
  { path: 'bots/:botId', 
    component: BotDetailsComponent, 
    canActivate: [AuthGuard],
    resolve: {
      botBehaviours: BotBehavioursResolver,
      bot: BotResolver
    },
  },
  { path: 'all-notifications', component: AllNotificationsComponent, canActivate: [AuthGuard] },
];
