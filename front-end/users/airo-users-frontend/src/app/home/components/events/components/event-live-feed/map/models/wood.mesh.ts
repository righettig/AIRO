import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  Color3,
  StandardMaterial,
} from '@babylonjs/core';

export class WoodMaterial{
  private readonly _trunkMaterial: StandardMaterial;
  private readonly _foliageMaterial: StandardMaterial;

  constructor(scene: Scene) {
    this._trunkMaterial = new StandardMaterial('woodMat', scene);
    this._trunkMaterial.diffuseColor = new Color3(0.55, 0.27, 0.07); // Wood color

    this._foliageMaterial = new StandardMaterial('greenMat', scene);
    this._foliageMaterial.diffuseColor = new Color3(0, 1, 0); // Green color for foliage
  }

  public get trunkMaterial() {
    return this._trunkMaterial;
  }

  public get foliageMaterial() {
    return this._foliageMaterial;
  }
}

export class WoodMesh {
  private _mesh: Mesh;

  constructor(
    private scene: Scene,       // Babylon.js scene reference
    private x: number,
    private y: number,
    private mapSize: number,    // Size of the map to calculate correct position
    private yOffset: number = 0.001,
    private woodMaterial: WoodMaterial
  ) {
    this._mesh = this.createMesh();
  }

  public get mesh() {
    return this._mesh;
  }

  private createMesh(): Mesh {
    // Procedurally generate trunk height between a minimum and maximum range
    //const trunkHeight = Math.random() * (2.2 - 1) + 0.7; // Random height between 1 and 2.5
    const trunkHeight = 1.5;
    const trunkDiameter = 0.2;
    const foliageDiameter = 1;

    // Randomly choose between a cone or sphere for the foliage
    //const isCone = Math.random() > 0.5; // 50% chance for either shape
    const isCone = true;

    let foliage: Mesh;

    if (isCone) {
      // Create the foliage as a cone
      foliage = MeshBuilder.CreateCylinder(`foliage_${this.x}_${this.y}`, {
        diameterTop: 0,
        height: 1,
        tessellation: 96
      }, this.scene);
    } else {
      // Create the foliage as a sphere
      foliage = MeshBuilder.CreateSphere(`foliage_${this.x}_${this.y}`, {
        diameter: foliageDiameter,
        segments: 16
      }, this.scene);
    }

    // Create the trunk using a cylinder
    const trunk = MeshBuilder.CreateCylinder(`trunk_${this.x}_${this.y}`, {
      height: trunkHeight,
      diameterTop: trunkDiameter,
      diameterBottom: trunkDiameter,
      tessellation: 16
    }, this.scene);

    // Position the trunk and foliage to resemble a tree
    trunk.position = new Vector3(
      this.x - ((this.mapSize / 2) - 0.5),
      trunkHeight / 2 + this.yOffset, // Center the trunk height
      this.y - ((this.mapSize / 2) - 0.5)
    );

    foliage.position = new Vector3(
      this.x - ((this.mapSize / 2) - 0.5),
      trunkHeight + foliageDiameter / 2 + this.yOffset, // Position foliage above the trunk
      this.y - ((this.mapSize / 2) - 0.5)
    );

    // Combine both the trunk and foliage to form the tree mesh
    const treeMesh = new Mesh(`wood_${this.x}_${this.y}`, this.scene);
    trunk.parent = treeMesh;
    foliage.parent = treeMesh;

    // Apply a wood-like material to the trunk and a green material to the foliage
    trunk.material = this.woodMaterial.trunkMaterial;
    foliage.material = this.woodMaterial.foliageMaterial;

    return treeMesh;
  }
}
