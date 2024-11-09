import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  Color3,
} from '@babylonjs/core';
import { LoadedMapData } from './models/map.models';
import { FoodMaterial, FoodMesh } from './models/food.mesh';
import { WaterMaterial, WaterMesh } from './models/water.mesh';
import { WoodMaterial, WoodMesh } from './models/wood.mesh';
import { IronMaterial, IronMesh } from './models/iron.mesh';
import { BotMaterial, BotMesh } from './models/bot.mesh';
import { WallMaterial, WallMesh } from './models/wall.mesh';
import { GroundMaterial, GroundMesh } from './models/ground.mesh';
import { IMesh } from './models/mesh.interface';
import { Camera } from './models/camera';
import { Compass } from './models/compass.ui';

@Component({
  selector: 'app-map-renderer',
  template: '<canvas #mapCanvas></canvas>',
  styles: ['canvas { width: 100%; height: 100%; display: block }'],
  standalone: true
})
export class MapRendererComponent implements AfterViewInit {
  @ViewChild('mapCanvas', { static: true }) mapCanvas!: ElementRef<HTMLCanvasElement>;
  private engine!: Engine;

  private scene!: Scene;
  private camera!: Camera;

  private meshes: IMesh[] = [];
  private mapSize: number = 0;

  private readonly yOffset: number = 0.001; // Offset to avoid z-fighting between tiles and ground

  private materials = {
    bot: undefined as BotMaterial | undefined,
    food: undefined as FoodMaterial | undefined,
    iron: undefined as IronMaterial | undefined,
    wall: undefined as WallMaterial | undefined,
    water: undefined as WaterMaterial | undefined,
    wood: undefined as WoodMaterial | undefined,
    ground: undefined as GroundMaterial | undefined,
  };

  ngAfterViewInit(): void {
    this.initializeEngineAndScene();
    this.createLight();
    this.createCompass();

    window.addEventListener('resize', () => this.engine.resize());
    this.engine.runRenderLoop(() => this.scene.render());
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
  }

  initMap(mapData: LoadedMapData) {
    this.mapSize = mapData.size;

    this.camera.upperRadiusLimit = mapData.size * 3; // Set upper radius limit based on the map size

    this.materials = {
      bot: new BotMaterial(this.scene, Color3.Green()), // TODO: customise for each bot
      ground: new GroundMaterial(this.scene),
      food: new FoodMaterial(this.scene),
      iron: new IronMaterial(this.scene),
      wall: new WallMaterial(this.scene),
      water: new WaterMaterial(this.scene),
      wood: new WoodMaterial(this.scene),
    };

    new GroundMesh(this.scene, mapData.size, this.materials.ground!);
  }

  // Load map data and render tiles as Babylon.js objects
  updateMap(mapData: LoadedMapData) {
    this.clearPreviousMeshes();
    this.meshes = this.createMeshesFromMapData(mapData);
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

    switch (tile.type) {
      case 'food':
        return new FoodMesh(meshOptions, this.materials.food!);
      case 'water':
        return new WaterMesh(meshOptions, this.materials.water!);
      case 'wood':
        return new WoodMesh(meshOptions, this.materials.wood!);
      case 'iron':
        return new IronMesh(meshOptions, this.materials.iron!);
      case 'wall':
        return new WallMesh(meshOptions, this.materials.wall!);
      case 'bot':
        return new BotMesh(meshOptions, this.materials.bot!);
      default:
        throw new Error(`Unknown tile type: ${tile.type}`);
    }
  }
}
