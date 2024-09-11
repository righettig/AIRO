import { Component } from '@angular/core';
import { ProfileGeneralComponent } from "./profile-general/profile-general.component";
import { ProfileMembershipComponent } from './profile-membership/profile-membership.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  imports: [
    MatCardModule,
    ProfileGeneralComponent, 
    ProfileMembershipComponent
  ]
})
export class ProfileComponent {

}
