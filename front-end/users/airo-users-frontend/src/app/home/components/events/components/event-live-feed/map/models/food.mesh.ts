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

export class FoodMaterial {
  private readonly _material: StandardMaterial;

  constructor(scene: Scene) {
    this._material = new StandardMaterial(`mat_food`, scene);
    this._material.diffuseColor = Color3.FromHexString('#FFA500');
  }

  public get material() {
    return this._material;
  }
}

export class FoodMesh implements IMesh {
  private _mesh: Mesh;

  constructor(options: MeshOptions, private foodMaterial: FoodMaterial) {
    this._mesh = this.createMesh(options);
  }

  public get mesh() {
    return this._mesh;
  }

  public dispose() {
    this._mesh.dispose();
  }

  private createMesh({ scene, x, y, mapSize, yOffset }: MeshOptions): Mesh {
    const tileSize = 0.5; // Halve the size for food tiles

    const mesh = MeshBuilder.CreateBox(`food_${x}_${y}`, { size: tileSize }, scene);

    mesh.material = this.foodMaterial.material;

    mesh.position = new Vector3(
      x - ((mapSize / 2) - 0.5),
      tileSize / 2 + yOffset,
      y - ((mapSize / 2) - 0.5)
    );

    return mesh;
  }
}
