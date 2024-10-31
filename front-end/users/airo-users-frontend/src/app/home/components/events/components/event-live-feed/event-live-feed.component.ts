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

  logs: string[] = [];

  private lastReceived = 0;
  
  constructor(
    private route: ActivatedRoute,
    private readonly eventLiveFeedService: EventLiveFeedService) { }

  async ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    
    this.eventName = history.state.eventName;
    this.eventDescription = history.state.eventDescription;

    await this.fetchLiveFeed();

    // TODO: use signalR
    setInterval(() => this.fetchLiveFeed(), 5000);
  }

  private async fetchLiveFeed() {
    try {
      this.eventLiveFeed = await this.getLiveFeed(this.lastReceived);
      if (this.eventLiveFeed) {
        this.updateLogs(this.eventLiveFeed.logs);
        this.loadMap(this.eventLiveFeed.simulationState.tiles);
      }
    } catch (error) {
      console.error('Error fetching live feed:', error);
    }
  }

  private async getLiveFeed(skip: number) {
    return this.eventLiveFeedService.getLiveFeed(this.eventId!, skip);
  }

  private updateLogs(newLogs: string[]) {
    this.logs = [...this.logs, ...newLogs];
    this.lastReceived += newLogs.length;
  }

  private loadMap(tiles: TileInfoDto[][]) {
    const mapData: LoadedMapData = {
      size: tiles.length,
      tiles: this.flattenTiles(tiles),
    };

    if (this.renderer) {
      if (!this.mapInitialized) {
        this.renderer.initMap(mapData);
        this.mapInitialized = true;
      }
      this.renderer.updateMap(mapData);
    }
  }

  private flattenTiles(tiles: TileInfoDto[][]): { x: number; y: number; type: TileType }[] {
    return tiles.flatMap((row, y) => {
      return row.map((cell, x) => this.mapTileType(cell.type, x, y));
    });
  }

  private mapTileType(typeId: number, x: number, y: number): { x: number; y: number; type: TileType } {
    const typeMapping: { [key: number]: TileType } = {
      0: 'bot',
      2: 'empty',
      3: 'food',
      4: 'wall',
      5: 'water',
      6: 'iron',
      7: 'wood',
    };

    const type = typeMapping[typeId] || 'empty'; // Default to 'empty' if typeId is not found

    return { x, y, type };
  }
}