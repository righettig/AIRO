import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  Color3,
  StandardMaterial,
} from '@babylonjs/core';

export class WaterMaterial{
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

export class WaterMesh {
  private _mesh: Mesh;

  constructor(
    private scene: Scene,       // Babylon.js scene reference
    private x: number,          
    private y: number,          
    private mapSize: number,    // Size of the map to calculate correct position
    private yOffset: number = 0.001, // Offset to avoid z-fighting
    private waterMaterial: WaterMaterial
  ) {
    this._mesh = this.createMesh();
  }

  public get mesh() {
    return this._mesh;
  }

  private createMesh(): Mesh {
    // Create a plane for water tiles, fill the ground without creating a box
    const tileHeight = this.yOffset;
    const mesh = MeshBuilder.CreateGround(`water_${this.x}_${this.y}`, { width: 1, height: 1 }, this.scene);

    mesh.material = this.waterMaterial.material;

    mesh.position = new Vector3(
      this.x - ((this.mapSize / 2) - 0.5),
      tileHeight / 2 + this.yOffset,
      this.y - ((this.mapSize / 2) - 0.5)
    );

    return mesh;
  }
}
