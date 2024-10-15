import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { LoadedMapData, TileType } from './models/map.models';

import * as BABYLON from 'babylonjs';

@Component({
  selector: 'app-map-renderer',
  template: '<canvas #mapCanvas></canvas>',
  styles: ['canvas { width: 100%; height: 100%; display: block }'],
  standalone: true,
  imports: []
})
export class MapRendererComponent implements AfterViewInit {
  @ViewChild('mapCanvas', { static: true }) mapCanvas!: ElementRef<HTMLCanvasElement>;
  private engine!: BABYLON.Engine;
  private scene!: BABYLON.Scene;

  ngAfterViewInit(): void {
    this.initializeBabylon();
  }

  initializeBabylon() {
    const canvas = this.mapCanvas.nativeElement;
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = new BABYLON.Scene(this.engine);

    // Create a camera and light for the scene
    const camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
    camera.attachControl(canvas, true);
    
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  // Load map data and render tiles as Babylon.js objects
  loadMap(mapData: LoadedMapData) {
    const tileSize = 1; // Define the size of each tile
    mapData.tiles.forEach(tile => {
      const tileMesh = BABYLON.MeshBuilder.CreateBox(`tile_${tile.x}_${tile.y}`, { size: tileSize }, this.scene);
      tileMesh.position = new BABYLON.Vector3(tile.x * tileSize, 0, tile.y * tileSize);

      const tileMaterial = new BABYLON.StandardMaterial(`mat_${tile.type}`, this.scene);
      tileMaterial.diffuseColor = this.getTileColor(tile.type);
      tileMesh.material = tileMaterial;
    });
  }

  // Map TileType to Babylon.js Colors
  private getTileColor(type: TileType): BABYLON.Color3 {
    switch (type) {
      case 'empty': return BABYLON.Color3.White();
      case 'spawn': return BABYLON.Color3.Green();
      case 'food': return BABYLON.Color3.FromHexString('FFA500');
      case 'water': return BABYLON.Color3.Blue();
      case 'wood': return BABYLON.Color3.FromHexString('#A52A2A');
      case 'iron': return BABYLON.Color3.Red();
      case 'wall': return BABYLON.Color3.Gray();
      default: return BABYLON.Color3.White();
    }
  }
}
