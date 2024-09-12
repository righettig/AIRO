import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProgressBarComponent } from '../../../common/components/progress-bar/progress-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-profile-general',
  standalone: true,
  templateUrl: './profile-general.component.html',
  styleUrl: './profile-general.component.scss',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    ProgressBarComponent
  ]
})
export class ProfileGeneralComponent implements OnInit {
  form: FormGroup;
  firstName: FormControl;
  lastName: FormControl;

  saving: boolean = false;

  constructor(private fb: FormBuilder, private readonly profileService: ProfileService) {
    this.form = this.fb.group({
      firstName: '',
      lastName: ''
    });
  
    this.firstName = this.form.get('firstName') as FormControl;
    this.lastName = this.form.get('lastName') as FormControl;
  }  

  async ngOnInit() {
    const profile = await this.profileService.getProfile();

    this.firstName.setValue(profile.firstName);
    this.lastName.setValue(profile.lastName);
  }

  async updateProfile() {
    if (this.form.invalid) return;

    this.saving = true;

    try {
      await this.profileService.updateProfile(this.firstName.value, this.lastName.value);
    }
    finally 
    {
      this.saving = false;
    }
  }
}
