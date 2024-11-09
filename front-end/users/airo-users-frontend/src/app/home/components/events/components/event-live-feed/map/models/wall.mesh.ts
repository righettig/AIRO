import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  Material,
} from '@babylonjs/core';

export class WallMesh {
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
    const mesh = MeshBuilder.CreateBox(`wall_${this.x}_${this.y}`, { size: tileSize }, this.scene);

    mesh.material = this.material;

    mesh.position = new Vector3(
      this.x - ((this.mapSize / 2) - 0.5),
      tileSize / 2 + this.yOffset,
      this.y - ((this.mapSize / 2) - 0.5)
    );
    
    return mesh;
  }
}
