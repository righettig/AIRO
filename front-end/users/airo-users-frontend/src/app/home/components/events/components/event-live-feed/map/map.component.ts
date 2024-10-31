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

  private materials: Record<TileType, StandardMaterial> = {} as Record<TileType, StandardMaterial>;
  private meshes: Mesh[] = [];

  private readonly yOffset: number = 0.001; // Offset to avoid z-fighting between tiles and ground

  ngAfterViewInit(): void {
    this.initializeBabylon();
  }

  initializeBabylon() {
    const canvas = this.mapCanvas.nativeElement;
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);

    // Create a camera and light for the scene
    const camera = new ArcRotateCamera('Camera', Math.PI, Math.PI / 5, 15, new Vector3(0, -2.5, 0), this.scene);
    camera.attachControl(canvas, true);

    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);

    // Preload materials based on tile colors
    this.initializeMaterials();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  // Initialize materials for each tile type based on tileColors
  private initializeMaterials() {
    for (const type of TILE_TYPES) {
      const material = new StandardMaterial(`mat_${type}`, this.scene);
      material.diffuseColor = this.getTileColor(type);
      this.materials[type] = material;
    }
  }

  initMap(mapData: LoadedMapData) {
    this.createGround(mapData.size);
  }

  // Load map data and render tiles as Babylon.js objects
  updateMap(mapData: LoadedMapData) {
    const mapSize = mapData.size;

    this.meshes.forEach(mesh => mesh.dispose());
    mapData.tiles.filter(tile => tile.type !== 'empty').forEach(tile => { // Skip empty tile rendering
      const tileMesh = MeshBuilder.CreateBox(`tile_${tile.x}_${tile.y}`, { size: 1 }, this.scene);
      tileMesh.position = new Vector3(
        tile.x - ((mapSize / 2) - 0.5),
        0.5 + this.yOffset,
        tile.y - ((mapSize / 2) - 0.5)
      );
      tileMesh.material = this.materials[tile.type]; // Use preloaded material
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
