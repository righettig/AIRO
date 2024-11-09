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

export class WoodMaterial {
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

export class WoodMesh implements IMesh {
  private _mesh: Mesh;

  constructor(options: MeshOptions, private woodMaterial: WoodMaterial) {
    this._mesh = this.createMesh(options);
  }

  public get mesh() {
    return this._mesh;
  }

  public dispose() {
    this._mesh.dispose();
  }

  private createMesh({ scene, x, y, mapSize, yOffset }: MeshOptions): Mesh {
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
      foliage = MeshBuilder.CreateCylinder(`foliage_${x}_${y}`, {
        diameterTop: 0,
        height: 1,
        tessellation: 96
      }, scene);
    } else {
      // Create the foliage as a sphere
      foliage = MeshBuilder.CreateSphere(`foliage_${x}_${y}`, {
        diameter: foliageDiameter,
        segments: 16
      }, scene);
    }

    // Create the trunk using a cylinder
    const trunk = MeshBuilder.CreateCylinder(`trunk_${x}_${y}`, {
      height: trunkHeight,
      diameterTop: trunkDiameter,
      diameterBottom: trunkDiameter,
      tessellation: 16
    }, scene);

    // Position the trunk and foliage to resemble a tree
    trunk.position = new Vector3(
      x - ((mapSize / 2) - 0.5),
      trunkHeight / 2 + yOffset, // Center the trunk height
      y - ((mapSize / 2) - 0.5)
    );

    foliage.position = new Vector3(
      x - ((mapSize / 2) - 0.5),
      trunkHeight + foliageDiameter / 2 + yOffset, // Position foliage above the trunk
      y - ((mapSize / 2) - 0.5)
    );

    // Combine both the trunk and foliage to form the tree mesh
    const treeMesh = new Mesh(`wood_${x}_${y}`, scene);
    trunk.parent = treeMesh;
    foliage.parent = treeMesh;

    // Apply a wood-like material to the trunk and a green material to the foliage
    trunk.material = this.woodMaterial.trunkMaterial;
    foliage.material = this.woodMaterial.foliageMaterial;

    return treeMesh;
  }
}
