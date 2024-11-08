import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Mesh,
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials/grid/gridMaterial';
import { LoadedMapData, TILE_TYPES, TileType } from './models/map.models';
import { AdvancedDynamicTexture, Control, Rectangle, TextBlock } from '@babylonjs/gui/2D';

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
  private materials: Record<TileType, StandardMaterial> = {} as Record<TileType, StandardMaterial>;
  private meshes: Mesh[] = [];

  private readonly yOffset: number = 0.001; // Offset to avoid z-fighting between tiles and ground

  private initialCameraAlpha!: number;
  private initialCameraBeta!: number;
  private initialCameraPosition!: Vector3;

  ngAfterViewInit(): void {
    this.initializeBabylon();
  }

  initializeBabylon() {
    const canvas = this.mapCanvas.nativeElement;
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);

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

    const light = new HemisphericLight('light1', new Vector3(50, 100, 50), this.scene);

    // Preload materials based on tile colors
    this.initializeMaterials();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    // Add the compass UI overlay
    this.createCompass();

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
  }

  private createCenterVector() : Vector3 {
    return new Vector3(this.initialCameraPosition.x, this.initialCameraPosition.y, this.initialCameraPosition.z);
  }

  private resetCameraPosition() {
    // Reset the camera's target (the center of the scene)
    this.camera.setTarget(this.createCenterVector());

    // Reset the camera's alpha and beta to the initial settings
    this.camera.alpha = this.initialCameraAlpha;
    this.camera.beta = this.initialCameraBeta;
  }

  // Initialize materials for each tile type based on tileColors
  private initializeMaterials() {
    for (const type of TILE_TYPES) {
      const material = new StandardMaterial(`mat_${type}`, this.scene);
      material.diffuseColor = this.getTileColor(type);
      this.materials[type] = material;

      if (type === "water") {
        material.alpha = 0.75; // Semi-transparent for water effect
      }
    }
  }

  initMap(mapData: LoadedMapData) {
    this.camera.upperRadiusLimit = mapData.size * 3; // Set upper radius limit based on the map size
    this.camera.radius = this.camera.upperRadiusLimit / 1.5;
    this.createGround(mapData.size);
  }

  // Load map data and render tiles as Babylon.js objects
  updateMap(mapData: LoadedMapData) {
    const mapSize = mapData.size;

    this.meshes.forEach(mesh => mesh.dispose());
    mapData.tiles.filter(tile => tile.type !== 'empty').forEach(tile => { // Skip empty tile rendering
      let tileSize = 1; // Default size for other tiles
      let tileMesh: Mesh;

      if (tile.type === 'food') {
        tileSize = 0.5; // Halve the size for food tiles
        tileMesh = MeshBuilder.CreateBox(`tile_${tile.x}_${tile.y}`, { size: tileSize }, this.scene);
      } else if (tile.type === 'water') {
        // Create a plane for water tiles, fill the ground without creating a box
        tileSize = this.yOffset;
        tileMesh = MeshBuilder.CreateGround(`tile_${tile.x}_${tile.y}`, { width: 1, height: 1 }, this.scene);
      } else {
        tileMesh = MeshBuilder.CreateBox(`tile_${tile.x}_${tile.y}`, { size: tileSize }, this.scene);
      }

      tileMesh.material = this.materials[tile.type]; // Use preloaded material

      tileMesh.position = new Vector3(
        tile.x - ((mapSize / 2) - 0.5),
        tileSize / 2 + this.yOffset,
        tile.y - ((mapSize / 2) - 0.5)
      );
      
      this.meshes.push(tileMesh);
    });
  }

  // Map TileType to Babylon.js Colors
  private getTileColor(type: TileType): Color3 {
    switch (type) {
      case 'bot': return Color3.Green();
      case 'food': return Color3.FromHexString('#FFA500');
      case 'water': return Color3.Blue();
      case 'wood': return Color3.FromHexString('#A52A2A');
      case 'iron': return Color3.Red();
      case 'wall': return Color3.Gray();
      default: return Color3.White();
    }
  }

  private createGround(size: number): void {
    const gridMaterial = new GridMaterial('grid', this.scene);
    gridMaterial.gridRatio = 1;
    gridMaterial.majorUnitFrequency = 1;
    gridMaterial.minorUnitVisibility = 0.45;
    gridMaterial.backFaceCulling = false;
    gridMaterial.mainColor = new Color3(1, 1, 1);
    gridMaterial.lineColor = new Color3(0.5, 0.5, 0.5);

    const ground = MeshBuilder.CreateGround(
      'ground',
      { width: size, height: size, subdivisions: size },
      this.scene
    );
    ground.material = gridMaterial;
  }
}
