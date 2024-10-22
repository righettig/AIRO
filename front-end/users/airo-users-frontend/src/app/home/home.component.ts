import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BotsComponent } from './components/bots/components/bots.component';
import { MapRendererComponent } from "./components/events/components/event-live-feed/map/map.component";
import { LoadedMapData } from './components/events/components/event-live-feed/map/models/map.models';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [BotsComponent, RouterModule, MapRendererComponent]
})
export class HomeComponent {
  @ViewChild('renderer', { static: false }) renderer!: MapRendererComponent;

  ngAfterViewInit(): void {
    const map = `{ "size": 16, "tiles": [{ "x": 0, "y": 0, "type": "spawn" }, { "x": 15, "y": 0, "type": "spawn" }, { "x": 4, "y": 2, "type": "wall" }, { "x": 5, "y": 2, "type": "wall" }, { "x": 6, "y": 2, "type": "wall" }, { "x": 7, "y": 2, "type": "wall" }, { "x": 8, "y": 2, "type": "wall" }, { "x": 9, "y": 2, "type": "wall" }, { "x": 10, "y": 2, "type": "wall" }, { "x": 11, "y": 2, "type": "wall" }, { "x": 12, "y": 2, "type": "wall" }, { "x": 4, "y": 3, "type": "wall" }, { "x": 5, "y": 3, "type": "wall" }, { "x": 11, "y": 3, "type": "wall" }, { "x": 12, "y": 3, "type": "wall" }, { "x": 4, "y": 4, "type": "wall" }, { "x": 8, "y": 4, "type": "food" }, { "x": 12, "y": 4, "type": "wall" }, { "x": 6, "y": 5, "type": "food" }, { "x": 8, "y": 5, "type": "iron" }, { "x": 9, "y": 5, "type": "water" }, { "x": 4, "y": 6, "type": "wall" }, { "x": 7, "y": 6, "type": "wood" }, { "x": 8, "y": 6, "type": "water" }, { "x": 9, "y": 6, "type": "iron" }, { "x": 10, "y": 6, "type": "food" }, { "x": 12, "y": 6, "type": "wall" }, { "x": 4, "y": 7, "type": "wall" }, { "x": 5, "y": 7, "type": "food" }, { "x": 7, "y": 7, "type": "water" }, { "x": 9, "y": 7, "type": "wood" }, { "x": 12, "y": 7, "type": "wall" }, { "x": 4, "y": 8, "type": "wall" }, { "x": 6, "y": 8, "type": "water" }, { "x": 7, "y": 8, "type": "wood" }, { "x": 8, "y": 8, "type": "food" }, { "x": 9, "y": 8, "type": "water" }, { "x": 11, "y": 8, "type": "food" }, { "x": 12, "y": 8, "type": "wall" }, { "x": 4, "y": 9, "type": "wall" }, { "x": 7, "y": 9, "type": "water" }, { "x": 10, "y": 9, "type": "water" }, { "x": 12, "y": 9, "type": "wall" }, { "x": 6, "y": 10, "type": "food" }, { "x": 8, "y": 10, "type": "iron" }, { "x": 9, "y": 10, "type": "food" }, { "x": 4, "y": 11, "type": "wall" }, { "x": 5, "y": 11, "type": "wall" }, { "x": 6, "y": 11, "type": "wall" }, { "x": 7, "y": 11, "type": "wall" }, { "x": 8, "y": 11, "type": "wall" }, { "x": 9, "y": 11, "type": "wall" }, { "x": 10, "y": 11, "type": "wall" }, { "x": 11, "y": 11, "type": "wall" }, { "x": 12, "y": 11, "type": "wall" }, { "x": 0, "y": 15, "type": "spawn" }, { "x": 15, "y": 15, "type": "spawn" }] }`;
    try {
      const mapData: LoadedMapData = JSON.parse(map);
      // Use the renderer component to display the map
      this.renderer.loadMap(mapData);
    } catch (error) {
      console.error('Error loading map:', error);
    }
  }
}
