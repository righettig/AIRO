import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Color3,
} from '@babylonjs/core';
import { LoadedMapData } from './models/map.models';
import { AdvancedDynamicTexture, Control, Rectangle, TextBlock } from '@babylonjs/gui/2D';
import { FoodMaterial, FoodMesh } from './models/food.mesh';
import { WaterMaterial, WaterMesh } from './models/water.mesh';
import { WoodMaterial, WoodMesh } from './models/wood.mesh';
import { IronMaterial, IronMesh } from './models/iron.mesh';
import { BotMaterial, BotMesh } from './models/bot.mesh';
import { WallMaterial, WallMesh } from './models/wall.mesh';
import { GroundMaterial, GroundMesh } from './models/ground.mesh';
import { IMesh } from './models/mesh.interface';

@Component({
  selector: 'app-map-renderer',
  template: '<canvas #mapCanvas></canvas>',
  styles: ['canvas { width: 100%; height: 100%; display: block }'],
  standalone: true,
  imports: []
})
export class MapRendererComponent implements AfterViewInit {
  @ViewChild('mapCanvas', { static: true }) mapCanvas!: ElementRef<HTMLCanvasElement>;
  private engine!: Engine;
  
  private scene!: Scene;
  private camera!: ArcRotateCamera;
  private compassBackground!: Rectangle;
  private meshes: IMesh[] = [];
  private mapSize: number = 0;

  private readonly yOffset: number = 0.001; // Offset to avoid z-fighting between tiles and ground

  private initialCameraAlpha!: number;
  private initialCameraBeta!: number;
  private initialCameraPosition!: Vector3;

  private botMaterial!: BotMaterial;
  private foodMaterial!: FoodMaterial;
  private ironMaterial!: IronMaterial;
  private wallMaterial!: WallMaterial;
  private waterMaterial!: WaterMaterial;
  private woodMaterial!: WoodMaterial;

  ngAfterViewInit(): void {
    const canvas = this.mapCanvas.nativeElement;
    
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);

    this.createCamera(canvas);

    this.createLight();

    // Add the compass UI overlay
    this.createCompass();

    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  private createCamera(canvas: HTMLCanvasElement) {
    const minBeta = 0;  // Minimum angle (45 degrees)
    const maxBeta = Math.PI / 2.25; // Maximum angle (120 degrees)
    const minZoomDistance = 15; // Minimum zoom-in distance

    // Store initial camera orientation and position
    this.initialCameraAlpha = 0;
    this.initialCameraBeta = (maxBeta + minBeta) / 2;
    this.initialCameraPosition = new Vector3(0, -2.5, 0);

    // Create a camera and light for the scene
    this.camera = new ArcRotateCamera(
      'Camera',
      this.initialCameraAlpha,
      this.initialCameraBeta,
      0,
      this.createCenterVector(),
      this.scene
    );
    this.camera.attachControl(canvas, true);

    this.camera.lowerBetaLimit = minBeta;
    this.camera.upperBetaLimit = maxBeta;
    this.camera.lowerRadiusLimit = minZoomDistance; // Set zoom limits
  }

  private createLight() {
    new HemisphericLight('light', new Vector3(50, 100, 50), this.scene);
  }

  private createCompass() {
    // Create a full-screen 2D UI for compass overlay
    const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Create a small rectangle for the compass background
    this.compassBackground = new Rectangle();
    this.compassBackground.width = "80px";
    this.compassBackground.height = "80px";
    this.compassBackground.cornerRadius = 10;
    this.compassBackground.color = "white";
    this.compassBackground.thickness = 2;
    this.compassBackground.background = "black";
    this.compassBackground.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.compassBackground.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.compassBackground.top = "10px";
    this.compassBackground.left = "-10px";
    ui.addControl(this.compassBackground);

    // Add "N" for North
    const northText = new TextBlock();
    northText.text = "N";
    northText.color = "red";
    northText.fontSize = 24;
    northText.top = "-25px";
    this.compassBackground.addControl(northText);

    // Add "E" for East
    const eastText = new TextBlock();
    eastText.text = "E";
    eastText.color = "white";
    eastText.fontSize = 24;
    eastText.left = "25px";
    this.compassBackground.addControl(eastText);

    // Add "S" for South
    const southText = new TextBlock();
    southText.text = "S";
    southText.color = "white";
    southText.fontSize = 24;
    southText.top = "25px";
    this.compassBackground.addControl(southText);

    // Add "W" for West
    const westText = new TextBlock();
    westText.text = "W";
    westText.color = "white";
    westText.fontSize = 24;
    westText.left = "-25px";
    this.compassBackground.addControl(westText);

    // Add double-click event listener to reset camera position
    this.compassBackground.onPointerClickObservable.add(() => {
      this.resetCameraPosition();
    });

    // Update compass orientation whenever the camera rotates
    this.camera.onViewMatrixChangedObservable.add(() => {
      this.updateCompass();
    });
  }

  private updateCompass() {
    // Rotate the compass according to the camera's Y-axis rotation (alpha)
    const rotationAngle = this.camera.alpha;
    this.compassBackground.rotation = rotationAngle;
  }

  private createCenterVector() : Vector3 {
    return new Vector3(
      this.initialCameraPosition.x, 
      this.initialCameraPosition.y, 
      this.initialCameraPosition.z);
  }

  private resetCameraPosition() {
    // Reset the camera's target (the center of the scene)
    this.camera.setTarget(this.createCenterVector());

    // Reset the camera's alpha and beta to the initial settings
    this.camera.alpha = this.initialCameraAlpha;
    this.camera.beta = this.initialCameraBeta;
  }

  initMap(mapData: LoadedMapData) {
    this.mapSize = mapData.size;
    
    this.camera.upperRadiusLimit = mapData.size * 3; // Set upper radius limit based on the map size
    this.camera.radius = this.camera.upperRadiusLimit / 1.5;
    
    new GroundMesh(this.scene, mapData.size, new GroundMaterial(this.scene));

    // TODO: customise for each bot
    this.botMaterial = new BotMaterial(this.scene, Color3.Green());

    this.foodMaterial = new FoodMaterial(this.scene);
    this.ironMaterial = new IronMaterial(this.scene);
    this.wallMaterial = new WallMaterial(this.scene);
    this.waterMaterial = new WaterMaterial(this.scene);
    this.woodMaterial = new WoodMaterial(this.scene);
  }

  // Load map data and render tiles as Babylon.js objects
  updateMap(mapData: LoadedMapData) {
    this.meshes.forEach(mesh => mesh.dispose());
    
    this.meshes = mapData.tiles.filter(tile => tile.type !== 'empty').map(tile => { // Skip empty tile rendering
      if (tile.type === 'food') {
        return new FoodMesh(this.scene, tile.x, tile.y, this.mapSize, this.yOffset, this.foodMaterial);

      } else if (tile.type === 'water') {
        return new WaterMesh(this.scene, tile.x, tile.y, this.mapSize, this.yOffset, this.waterMaterial);

      } else if (tile.type === 'wood') {
        return new WoodMesh(this.scene, tile.x, tile.y, this.mapSize, this.yOffset, this.woodMaterial);

      } else if (tile.type === "iron") {
        return new IronMesh(this.scene, tile.x, tile.y, this.mapSize, this.yOffset, this.ironMaterial);

      } else if (tile.type === "wall") {
        return new WallMesh(this.scene, tile.x, tile.y, this.mapSize, this.yOffset, this.wallMaterial);

      } else if (tile.type === "bot") {
        return new BotMesh(this.scene, tile.x, tile.y, this.mapSize, this.yOffset, this.botMaterial);

      } else {
        throw new Error('Unknown mesh');
      }
    });
  }
}
