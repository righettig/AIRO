import { Component } from '@angular/core';
import { BotsComponent } from "./bots/components/bots.component";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [BotsComponent]
})
export class HomeComponent {

}
