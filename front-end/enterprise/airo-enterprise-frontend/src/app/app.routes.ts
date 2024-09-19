import { Routes } from '@angular/router';
import { AgentsComponent } from './agents/agents.component';
import { AgentDetailsComponent } from './agent-details/agent-details.component';
import { CommandsComponent } from './commands/commands.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { MissionsComponent } from './missions/missions.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/agents', pathMatch: 'full' },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'login', component: LoginComponent },
  { path: 'agents', component: AgentsComponent, canActivate: [AuthGuard] },
  { path: 'agents/:id', component: AgentDetailsComponent, canActivate: [AuthGuard] },
  { path: 'commands/:id', component: CommandsComponent, canActivate: [AuthGuard] },
  { path: 'missions/:id', component: MissionsComponent, canActivate: [AuthGuard] },
];
