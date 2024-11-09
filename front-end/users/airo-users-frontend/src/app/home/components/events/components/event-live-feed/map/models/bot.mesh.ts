import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  Color3,
} from '@babylonjs/core';
import { IMesh } from './mesh.interface';

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

  constructor(
    private scene: Scene,       // Babylon.js scene reference
    private x: number,          
    private y: number,          
    private mapSize: number,    // Size of the map to calculate correct position
    private yOffset: number = 0.001, // Offset to avoid z-fighting
    private botMaterial: BotMaterial, // Shared material instance
  ) {
    this._mesh = this.createMesh();
  }

  public get mesh() {
    return this._mesh;
  }

  public dispose() {
    this._mesh.dispose();
  }

  private createMesh(): Mesh {
    const tileSize = 1;
    const mesh = new Mesh(`bot_${this.x}_${this.y}`, this.scene);

    const headMesh = MeshBuilder.CreateSphere(`bot_${this.x}_${this.y}_head`, { diameter: 0.5 }, this.scene);
    headMesh.material = this.botMaterial.material;

    headMesh.position = new Vector3(
      this.x - ((this.mapSize / 2) - 0.5),
      tileSize / 2 + this.yOffset,
      this.y - ((this.mapSize / 2) - 0.5)
    );

    const bodyMesh = MeshBuilder.CreateCylinder(`bot_${this.x}_${this.y}_body`, {
      height: 0.5,
      diameterTop: 0,
      diameterBottom: 0.8,
      tessellation: 4
    });
    bodyMesh.material = this.botMaterial.material;

    bodyMesh.position = new Vector3(
      this.x - ((this.mapSize / 2) - 0.5),
      this.yOffset + (0.5 / 2),
      this.y - ((this.mapSize / 2) - 0.5)
    );

    mesh.addChild(headMesh);
    mesh.addChild(bodyMesh);

    return mesh;
  }
}
