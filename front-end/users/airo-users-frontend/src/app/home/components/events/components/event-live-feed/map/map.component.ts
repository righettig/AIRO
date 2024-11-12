import { Component, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
} from '@babylonjs/core';
import { LoadedMapData } from './models/map.models';
import { GroundMesh } from './models/ground.mesh';
import { IMesh } from './models/mesh.interface';
import { Camera } from './models/camera';
import { Compass } from './models/compass.ui';
import { MeshMaterials } from './models/mesh-materials';
import { MeshFactory } from './models/mesh-factory';
import { ColorDictionary } from './models/color-dictionary';
import { FullscreenButton } from './models/fullscreen.ui';

@Component({
  selector: 'app-map-renderer',
  template: '<canvas #mapCanvas></canvas>',
  styles: ['canvas { width: 100%; height: 100%; display: block }'],
  standalone: true
})
export class MapRendererComponent implements AfterViewInit {
  @ViewChild('mapCanvas', { static: true }) mapCanvas!: ElementRef<HTMLCanvasElement>;
  private engine!: Engine;

  @Output() onToggleFullscreen = new EventEmitter();

  private scene!: Scene;
  private camera!: Camera;

  private meshes: IMesh[] = [];
  private mapSize: number = 0;

  private readonly yOffset: number = 0.001; // Offset to avoid z-fighting between tiles and ground

  private materials!: MeshMaterials;
  private meshFactory!:  MeshFactory;

  ngAfterViewInit(): void {
    this.initializeEngineAndScene();
    this.createLight();
    this.createCompass();

    window.addEventListener('resize', () => this.engine.resize());
    this.engine.runRenderLoop(() => this.scene.render());
  }

  initMap(mapData: LoadedMapData, botColors: ColorDictionary) {
    this.mapSize = mapData.size;
    this.camera.upperRadiusLimit = mapData.size * 3; // Set upper radius limit based on the map size
    this.materials = new MeshMaterials(this.scene, botColors);
    this.meshFactory = new MeshFactory(this.materials);
    this.createUI();
  }

  // Load map data and render tiles as Babylon.js objects
  updateMap(mapData: LoadedMapData) {
    this.clearPreviousMeshes();
    this.meshes = this.createMeshesFromMapData(mapData);
  }

  private initializeEngineAndScene(): void {
    const canvas = this.mapCanvas.nativeElement;
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);
    this.camera = new Camera(this.scene, canvas);
  }

  private createLight() {
    new HemisphericLight('light', new Vector3(50, 100, 50), this.scene);
  }

  private createCompass() {
    new Compass(this.camera);
    new FullscreenButton(() => {
      this.onToggleFullscreen.emit();
      setTimeout(() => {
        this.engine.resize();
      }, 1);
    });
  }

  private createUI() {
    new GroundMesh(this.scene, this.mapSize, this.materials.ground);
  }

  private clearPreviousMeshes(): void {
    this.meshes.forEach(mesh => mesh.dispose());
    this.meshes = [];
  }

  private createMeshesFromMapData(mapData: LoadedMapData): IMesh[] {
    return mapData.tiles
      .filter(tile => tile.type !== 'empty')
      .map(tile => this.createMeshForTile(tile));
  }

  private createMeshForTile(tile: any): IMesh {
    const meshOptions = {
      scene: this.scene,
      x: tile.x,
      y: tile.y,
      mapSize: this.mapSize,
      yOffset: this.yOffset,
    };

    return this.meshFactory.create(meshOptions, tile);
  }
}
