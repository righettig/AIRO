import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  Color3,
} from '@babylonjs/core';
import { IMesh } from './mesh.interface';
import { MeshOptions } from './mesh-options';

export class BotMaterial {
  private readonly _material: StandardMaterial;

  constructor(scene: Scene, color: Color3) {
    this._material = new StandardMaterial(`mat_bot`, scene);
    this._material.diffuseColor = color;
  }

  public get material() {
    return this._material;
  }
}

export class BotMesh implements IMesh {
  private _mesh: Mesh;

  constructor(options: MeshOptions, private botMaterial: BotMaterial) {
    this._mesh = this.createMesh(options);
  }

  public get mesh() {
    return this._mesh;
  }

  public dispose() {
    this._mesh.dispose();
  }

  private createMesh({ scene, x, y, mapSize, yOffset }: MeshOptions): Mesh {
    const tileSize = 1;
    const mesh = new Mesh(`bot_${x}_${y}`, scene);

    const headMesh = MeshBuilder.CreateSphere(`bot_${x}_${y}_head`, { diameter: 0.5 }, scene);
    headMesh.material = this.botMaterial.material;

    headMesh.position = new Vector3(
      x - ((mapSize / 2) - 0.5),
      tileSize / 2 + yOffset,
      y - ((mapSize / 2) - 0.5)
    );

    const bodyMesh = MeshBuilder.CreateCylinder(`bot_${x}_${y}_body`, {
      height: 0.5,
      diameterTop: 0,
      diameterBottom: 0.8,
      tessellation: 4
    });
    bodyMesh.material = this.botMaterial.material;

    bodyMesh.position = new Vector3(
      x - ((mapSize / 2) - 0.5),
      yOffset + (0.5 / 2),
      y - ((mapSize / 2) - 0.5)
    );

    mesh.addChild(headMesh);
    mesh.addChild(bodyMesh);

    return mesh;
  }
}
