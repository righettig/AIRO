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
  private mapSize: number = 0;

  private readonly yOffset: number = 0.001; // Offset to avoid z-fighting between tiles and ground

  private initialCameraAlpha!: number;
  private initialCameraBeta!: number;
  private initialCameraPosition!: Vector3;

  ngAfterViewInit(): void {
    const canvas = this.mapCanvas.nativeElement;
    
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);

    this.createCamera(canvas);

    this.createLight();

    // Preload materials based on tile colors
    this.initializeMaterials();

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

  // Initialize materials for each tile type based on tileColors
  private initializeMaterials() {
    for (const type of TILE_TYPES) {
      const material = new StandardMaterial(`mat_${type}`, this.scene);
      material.diffuseColor = this.getTileColor(type);
      this.materials[type] = material;

      if (type === "water") {
        material.alpha = 0.75; // Semi-transparent for water effect

      } else if (type === "iron") {
        material.diffuseColor = new Color3(0.8, 0.6, 0.4);
        material.specularColor = new Color3(0.3, 0.3, 0.3);
      }
    }
  }

  initMap(mapData: LoadedMapData) {
    this.mapSize = mapData.size;
    this.camera.upperRadiusLimit = mapData.size * 3; // Set upper radius limit based on the map size
    this.camera.radius = this.camera.upperRadiusLimit / 1.5;
    this.createGround(mapData.size);
  }

  // Load map data and render tiles as Babylon.js objects
  updateMap(mapData: LoadedMapData) {
    this.meshes.forEach(mesh => mesh.dispose());
    this.meshes = [];

    mapData.tiles.filter(tile => tile.type !== 'empty').forEach(tile => { // Skip empty tile rendering
      if (tile.type === 'food') {
        this.createFoodTile(tile.x, tile.y);
      } else if (tile.type === 'water') {
        this.createWaterTile(tile.x, tile.y);
      } else if (tile.type === 'wood') {
        this.createWoodTile(tile.x, tile.y);
      } else if (tile.type === "iron") {
        this.createIronTile(tile.x, tile.y);
      } else if (tile.type === "wall") {
        this.createWallTile(tile.x, tile.y);
      } else if (tile.type === "bot") {
        this.createBotTile(tile.x, tile.y);
      }
    });
  }

  private createBotTile(x: number, y: number) {
    const tileSize = 1;
    const tileMesh = new Mesh(`bot_${x}_${y}`, this.scene);

    const headMesh = MeshBuilder.CreateSphere(`bot_${x}_${y}_head`, { diameter: 0.5 }, this.scene);
    headMesh.material = this.materials['bot'];

    headMesh.position = new Vector3(
      x - ((this.mapSize / 2) - 0.5),
      tileSize / 2 + this.yOffset,
      y - ((this.mapSize / 2) - 0.5)
    );
    
    const bodyMesh = MeshBuilder.CreateCylinder(`bot_${x}_${y}_body`, {
      height: 0.5,
      diameterTop: 0,
      diameterBottom: 0.8,
      tessellation: 4
    });
    bodyMesh.material = this.materials['bot'];

    bodyMesh.position = new Vector3(
      x - ((this.mapSize / 2) - 0.5),
      this.yOffset + (0.5/2),
      y - ((this.mapSize / 2) - 0.5)
    );

    tileMesh.addChild(headMesh);
    tileMesh.addChild(bodyMesh);

    this.meshes.push(tileMesh);
  }

  private createWallTile(x: number, y: number) {
    const tileSize = 1;
    const tileMesh = MeshBuilder.CreateBox(`wall_${x}_${y}`, { size: tileSize }, this.scene);

    tileMesh.material = this.materials['wall'];

    tileMesh.position = new Vector3(
      x - ((this.mapSize / 2) - 0.5),
      tileSize / 2 + this.yOffset,
      y - ((this.mapSize / 2) - 0.5)
    );
    
    this.meshes.push(tileMesh);
  }

  private createWoodTile(x: number, y: number) {
    // Procedurally generate trunk height between a minimum and maximum range
    //const trunkHeight = Math.random() * (2.2 - 1) + 0.7; // Random height between 1 and 2.5
    const trunkHeight = 1.5;
    const trunkDiameter = 0.2;
    const foliageDiameter = 1;

    // Randomly choose between a cone or sphere for the foliage
    //const isCone = Math.random() > 0.5; // 50% chance for either shape
    const isCone = true;
    
    let foliage: Mesh;

    if (isCone) {
      // Create the foliage as a cone
      foliage = MeshBuilder.CreateCylinder(`foliage_${x}_${y}`, {
        diameterTop: 0, 
        height: 1, 
        tessellation: 96
      }, this.scene);
    } else {
      // Create the foliage as a sphere
      foliage = MeshBuilder.CreateSphere(`foliage_${x}_${y}`, {
        diameter: foliageDiameter,
        segments: 16
      }, this.scene);
    }

    // Create the trunk using a cylinder
    const trunk = MeshBuilder.CreateCylinder(`trunk_${x}_${y}`, {
      height: trunkHeight,
      diameterTop: trunkDiameter,
      diameterBottom: trunkDiameter,
      tessellation: 16
    }, this.scene);

    // Position the trunk and foliage to resemble a tree
    trunk.position = new Vector3(
      x - ((this.mapSize / 2) - 0.5),
      trunkHeight / 2 + this.yOffset, // Center the trunk height
      y - ((this.mapSize / 2) - 0.5)
    );

    foliage.position = new Vector3(
      x - ((this.mapSize / 2) - 0.5),
      trunkHeight + foliageDiameter / 2 + this.yOffset, // Position foliage above the trunk
      y - ((this.mapSize / 2) - 0.5)
    );

    // Combine both the trunk and foliage to form the tree mesh
    const treeMesh = new Mesh(`wood_${x}_${y}`, this.scene);
    trunk.parent = treeMesh;
    foliage.parent = treeMesh;

    // Apply a wood-like material to the trunk and a green material to the foliage
    const trunkMaterial = new StandardMaterial('woodMat', this.scene);
    trunkMaterial.diffuseColor = new Color3(0.55, 0.27, 0.07); // Wood color
    trunk.material = trunkMaterial;

    const foliageMaterial = new StandardMaterial('greenMat', this.scene);
    foliageMaterial.diffuseColor = new Color3(0, 1, 0); // Green color for foliage
    foliage.material = foliageMaterial;

    // Add the tree mesh to the list of meshes
    this.meshes.push(treeMesh); // TODO: either use tileMesh or skip adding tileMesh
  }

  private createIronTile(x: number, y: number) {
    const ironMesh = new Mesh(`iron_${x}_${y}`, this.scene);

    // Create three pyramids of different heights
    const pyramid1 = MeshBuilder.CreateCylinder("pyramid1", {
      height: 0.4,
      diameterTop: 0,
      diameterBottom: 0.6,
      tessellation: 4
    });
    
    const pyramid2 = MeshBuilder.CreateCylinder("pyramid2", {
      height: 0.3,
      diameterTop: 0,
      diameterBottom: 0.3,
      tessellation: 4
    });
    
    const pyramid3 = MeshBuilder.CreateCylinder("pyramid3", {
      height: 0.5,
      diameterTop: 0,
      diameterBottom: 0.4,
      tessellation: 4
    });
    
    // Position the pyramids next to each other
    pyramid1.position = new Vector3(
      x - ((this.mapSize / 2) - 0.7),
      (0.4/2) + this.yOffset,
      y - ((this.mapSize / 2) - 0.6)
    );

    pyramid2.position = new Vector3(
      x - ((this.mapSize / 2) - 0.5),
      (0.3/2) + this.yOffset,
      y - ((this.mapSize / 2) + -0.25)
    );
    
    pyramid3.position = new Vector3(
      x - ((this.mapSize / 2) - 0.3),
      (0.5/2) + this.yOffset,
      y - ((this.mapSize / 2) + -0.75)
    );

    // Apply the material to all pyramids
    pyramid1.material = pyramid2.material = pyramid3.material = this.materials["iron"];
    
    ironMesh.addChild(pyramid1);
    ironMesh.addChild(pyramid2);
    ironMesh.addChild(pyramid3);

    this.meshes.push(ironMesh);
  };

  private createFoodTile(x: number, y: number) {
    const tileSize = 0.5; // Halve the size for food tiles
    const tileMesh = MeshBuilder.CreateBox(`food_${x}_${y}`, { size: tileSize }, this.scene);

    tileMesh.material = this.materials['food'];

    tileMesh.position = new Vector3(
      x - ((this.mapSize / 2) - 0.5),
      tileSize / 2 + this.yOffset,
      y - ((this.mapSize / 2) - 0.5)
    );
    
    this.meshes.push(tileMesh);
  }

  private createWaterTile(x: number, y: number) {
    // Create a plane for water tiles, fill the ground without creating a box
    const tileHeight = this.yOffset;
    const tileMesh = MeshBuilder.CreateGround(`water_${x}_${y}`, { width: 1, height: 1 }, this.scene);

    tileMesh.material = this.materials['water'];

    tileMesh.position = new Vector3(
      x - ((this.mapSize / 2) - 0.5),
      tileHeight / 2 + this.yOffset,
      y - ((this.mapSize / 2) - 0.5)
    );
    
    this.meshes.push(tileMesh);
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
