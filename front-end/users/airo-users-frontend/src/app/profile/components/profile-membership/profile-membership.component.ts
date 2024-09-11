import { Component } from '@angular/core';
import { InvoicesComponent } from './invoices/components/invoices.component';

@Component({
  selector: 'app-profile-membership',
  standalone: true,
  templateUrl: './profile-membership.component.html',
  styleUrl: './profile-membership.component.scss',
  imports: [InvoicesComponent]
})
export class ProfileMembershipComponent {

}
