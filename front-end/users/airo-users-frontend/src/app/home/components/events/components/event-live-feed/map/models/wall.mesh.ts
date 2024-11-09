import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  Color3,
  StandardMaterial,
} from '@babylonjs/core';
import { IMesh } from './mesh.interface';

export class WallMaterial {
  private readonly _material: StandardMaterial;

  constructor(scene: Scene) {
    this._material = new StandardMaterial(`mat_wall`, scene);
    this._material.diffuseColor = Color3.Gray();
  }

  public get material() {
    return this._material;
  }
}

export class WallMesh implements IMesh {
  private _mesh: Mesh;

  constructor(
    private scene: Scene,       // Babylon.js scene reference
    private x: number,          
    private y: number,          
    private mapSize: number,    // Size of the map to calculate correct position
    private yOffset: number = 0.001, // Offset to avoid z-fighting
    private wallMaterial: WallMaterial
  ) {
    this._mesh = this.createMesh();
  }

  public get mesh() {
    return this._mesh;
  }

  public dispose(): void {
    this._mesh.dispose();
  }

  private createMesh(): Mesh {
    const tileSize = 1;
    const mesh = MeshBuilder.CreateBox(`wall_${this.x}_${this.y}`, { size: tileSize }, this.scene);

    mesh.material = this.wallMaterial.material;

    mesh.position = new Vector3(
      this.x - ((this.mapSize / 2) - 0.5),
      tileSize / 2 + this.yOffset,
      this.y - ((this.mapSize / 2) - 0.5)
    );
    
    return mesh;
  }
}
