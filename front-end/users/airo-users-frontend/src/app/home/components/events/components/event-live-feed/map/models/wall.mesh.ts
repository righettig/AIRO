import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  Color3,
  StandardMaterial,
} from '@babylonjs/core';
import { IMesh } from './mesh.interface';
import { MeshOptions } from './mesh-options';

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

  constructor(options: MeshOptions, private wallMaterial: WallMaterial) {
    this._mesh = this.createMesh(options);
  }

  public get mesh() {
    return this._mesh;
  }

  public dispose(): void {
    this._mesh.dispose();
  }

  private createMesh({ scene, x, y, mapSize, yOffset }: MeshOptions): Mesh {
    const tileSize = 1;

    const mesh = MeshBuilder.CreateBox(`wall_${x}_${y}`, { size: tileSize }, scene);

    mesh.material = this.wallMaterial.material;

    mesh.position = new Vector3(
      x - ((mapSize / 2) - 0.5),
      tileSize / 2 + yOffset,
      y - ((mapSize / 2) - 0.5)
    );
    
    return mesh;
  }
}
