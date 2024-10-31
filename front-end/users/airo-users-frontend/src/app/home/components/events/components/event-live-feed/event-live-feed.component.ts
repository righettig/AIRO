import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventLiveFeedService, GetLiveFeedResponse, TileInfoDto } from '../../services/event-live-feed.service';
import { MapRendererComponent } from './map/map.component';
import { LoadedMapData, TileType } from './map/models/map.models';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-event-live-feed',
  templateUrl: './event-live-feed.component.html',
  styleUrl: './event-live-feed.component.scss',
  standalone: true,
  imports: [MapRendererComponent, ScrollingModule]
})
export class EventLiveFeedComponent {
  @ViewChild('renderer', { static: false }) renderer!: MapRendererComponent;

  ngAfterViewInit(): void {
    try {
      if (this.eventLiveFeed) {
        this.loadMap(this.eventLiveFeed.simulationState.tiles);
      }

    } catch (error) {
      console.error('Error loading map:', error);
    }
  }

  eventId: string | null = null;
  eventLiveFeed: GetLiveFeedResponse | null = null;

  eventName!: string;
  eventDescription!: string;
  
  mapInitialized: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private readonly eventLiveFeedService: EventLiveFeedService) { }

  async ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    
    this.eventName = history.state.eventName;
    this.eventDescription = history.state.eventDescription;

    this.eventLiveFeed = await this.getLiveFeed();
    
    // TODO: use signalR
    setInterval(async () => {
      this.eventLiveFeed = await this.getLiveFeed();
    }, 5000);
  }

  private async getLiveFeed() {
    var response = await this.eventLiveFeedService.getLiveFeed(this.eventId!);
    //console.log(JSON.stringify(response));

    this.loadMap(response.simulationState.tiles);

    return response;
  }

  private loadMap(tiles: TileInfoDto[][]) {
    let mapData: LoadedMapData = {
      size: tiles.length,
      tiles: tiles.flatMap((row, y) => {
        return row.map((cell, x) => { 
          let type: TileType = 'empty';
          switch (cell.type) {
            case 0: type = 'bot'; break;
            case 2: type = 'empty'; break;
            case 3: type = 'food'; break;
            case 4: type = 'wall'; break;
            case 5: type = 'water'; break;
            case 6: type = 'iron'; break;
            case 7: type = 'wood'; break;
          }
          return { x, y, type };
        });
      })
    };

    if (this.renderer) {
      if (!this.mapInitialized) {
        this.renderer.initMap(mapData);
        this.mapInitialized = true;
      }
      this.renderer.updateMap(mapData);
    }
  }
}