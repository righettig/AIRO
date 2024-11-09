import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  Color3,
  StandardMaterial,
} from '@babylonjs/core';

export class FoodMaterial{
  private readonly _material: StandardMaterial;

  constructor(scene: Scene) {
    this._material = new StandardMaterial(`mat_food`, scene);
    this._material.diffuseColor = Color3.FromHexString('#FFA500');
  }

  public get material() {
    return this._material;
  }
}

export class FoodMesh {
  private _mesh: Mesh;

  constructor(
    private scene: Scene,       // Babylon.js scene reference
    private x: number,          
    private y: number,          
    private mapSize: number,    // Size of the map to calculate correct position
    private yOffset: number = 0.001, // Offset to avoid z-fighting
    private foodMaterial: FoodMaterial
  ) {
    this._mesh = this.createMesh();
  }

  public get mesh() {
    return this._mesh;
  }

  private createMesh(): Mesh {
    const tileSize = 0.5; // Halve the size for food tiles
    const mesh = MeshBuilder.CreateBox(`food_${this.x}_${this.y}`, { size: tileSize }, this.scene);

    mesh.material = this.foodMaterial.material;

    mesh.position = new Vector3(
      this.x - ((this.mapSize / 2) - 0.5),
      tileSize / 2 + this.yOffset,
      this.y - ((this.mapSize / 2) - 0.5)
    );

    return mesh;
  }
}
