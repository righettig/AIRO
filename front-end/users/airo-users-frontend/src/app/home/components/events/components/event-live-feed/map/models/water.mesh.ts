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

export class WaterMaterial {
  private readonly _material: StandardMaterial;

  constructor(scene: Scene) {
    this._material = new StandardMaterial(`mat_water`, scene);
    this._material.diffuseColor = Color3.Blue();
    this._material.alpha = 0.75; // Semi-transparent for water effect
  }

  public get material() {
    return this._material;
  }
}

export class WaterMesh implements IMesh {
  private _mesh: Mesh;

  constructor(options: MeshOptions, private waterMaterial: WaterMaterial) {
    this._mesh = this.createMesh(options);
  }

  public get mesh() {
    return this._mesh;
  }

  public dispose(): void {
    this._mesh.dispose();
  }

  private createMesh({ scene, x, y, mapSize, yOffset }: MeshOptions): Mesh {
    // Create a plane for water tiles, fill the ground without creating a box
    const tileHeight = yOffset;
    const mesh = MeshBuilder.CreateGround(`water_${x}_${y}`, { width: 1, height: 1 }, scene);

    mesh.material = this.waterMaterial.material;

    mesh.position = new Vector3(
      x - ((mapSize / 2) - 0.5),
      tileHeight / 2 + yOffset,
      y - ((mapSize / 2) - 0.5)
    );

    return mesh;
  }
}
