import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventLiveFeedService, GetLiveFeedResponse, TileInfoDto } from '../../services/event-live-feed.service';
import { MapRendererComponent } from './map/map.component';
import { LoadedMapData, TileInfo, TileType } from './map/models/map.models';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-event-live-feed',
  templateUrl: './event-live-feed.component.html',
  styleUrl: './event-live-feed.component.scss',
  standalone: true,
  imports: [MapRendererComponent, ScrollingModule]
})
export class EventLiveFeedComponent {
  @ViewChild('renderer', { static: false }) renderer!: MapRendererComponent;
  @ViewChild('viewport', { static: false }) viewport!: CdkVirtualScrollViewport;

  ngAfterViewInit(): void {
    this.scrollToBottom();

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

  autoScroll: boolean = true;

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
    setInterval(() => this.fetchLiveFeed(), 1000);
  }

  onScroll(viewport: CdkVirtualScrollViewport) {
    // Check if the user is at the bottom
    //const offset = viewport.getOffsetToIndex(viewport.getDataLength() - 1);
    const offset = viewport.getOffsetToRenderedContentStart();
    this.autoScroll = offset === 0; // Set autoScroll to false if not at the bottom
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

    if (this.autoScroll) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom() {
    if (this.viewport && this.autoScroll) {
      // Scroll to the last item
      this.viewport.scrollToIndex(this.logs.length - 1);
    }
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

  private flattenTiles(tiles: TileInfoDto[][]): TileInfo[] {
    return tiles.flatMap((row, y) => {
      return row.map((cell, x) => this.mapTileType(cell, x, y));
    });
  }

  private mapTileType(cell: TileInfoDto, x: number, y: number): TileInfo {
    const typeMapping: { [key: number]: TileType } = {
      0: 'bot',
      2: 'empty',
      3: 'food',
      4: 'wall',
      5: 'water',
      6: 'iron',
      7: 'wood',
    };

    const type = typeMapping[cell.type] || 'empty'; // Default to 'empty' if typeId is not found

    return { x, y, type, botId: cell.botId };
  }
}