import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BotsComponent } from './components/bots/components/bots.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [BotsComponent, RouterModule]
})
export class HomeComponent {

}
