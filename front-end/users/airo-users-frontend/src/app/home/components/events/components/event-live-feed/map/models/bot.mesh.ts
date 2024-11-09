import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  Material,
} from '@babylonjs/core';

export class BotMesh {
  private _mesh: Mesh;

  constructor(
    private scene: Scene,       // Babylon.js scene reference
    private x: number,          
    private y: number,          
    private mapSize: number,    // Size of the map to calculate correct position
    private yOffset: number = 0.001, // Offset to avoid z-fighting
    private material: Material
  ) {
    this._mesh = this.createMesh();
  }

  public get mesh() {
    return this._mesh;
  }

  private createMesh(): Mesh {
    const tileSize = 1;
    const mesh = new Mesh(`bot_${this.x}_${this.y}`, this.scene);

    const headMesh = MeshBuilder.CreateSphere(`bot_${this.x}_${this.y}_head`, { diameter: 0.5 }, this.scene);
    headMesh.material = this.material;

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
    bodyMesh.material = this.material;

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
