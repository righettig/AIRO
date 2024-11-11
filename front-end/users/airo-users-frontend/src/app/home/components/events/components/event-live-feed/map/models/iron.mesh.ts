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

export class IronMaterial {
  private readonly _material: StandardMaterial;

  constructor(scene: Scene) {
    this._material = new StandardMaterial(`mat_iron`, scene);
    this._material.diffuseColor = Color3.Red();
    this._material.diffuseColor = new Color3(0.8, 0.6, 0.4);
    this._material.specularColor = new Color3(0.3, 0.3, 0.3);
  }

  public get material() {
    return this._material;
  }
}

export class IronMesh implements IMesh {
  private _mesh: Mesh;

  constructor(options: MeshOptions, private ironMaterial: IronMaterial) {
    this._mesh = this.createMesh(options);
  }

  public get mesh() {
    return this._mesh;
  }

  public dispose(): void {
    this._mesh.dispose();
  }

  private createMesh({ scene, x, y, mapSize, yOffset }: MeshOptions): Mesh {
    const mesh = new Mesh(`iron_${x}_${y}`, scene);

    // Create three pyramids of different heights
    const pyramid1 = MeshBuilder.CreateCylinder("pyramid1", {
      height: 0.4,
      diameterTop: 0,
      diameterBottom: 0.6,
      tessellation: 4
    });

    const pyramid2 = MeshBuilder.CreateCylinder("pyramid2", {
      height: 0.3,
      diameterTop: 0,
      diameterBottom: 0.3,
      tessellation: 4
    });

    const pyramid3 = MeshBuilder.CreateCylinder("pyramid3", {
      height: 0.5,
      diameterTop: 0,
      diameterBottom: 0.4,
      tessellation: 4
    });

    // Position the pyramids next to each other
    pyramid1.position = new Vector3(
      x - ((mapSize / 2) - 0.7),
      (0.4 / 2) + yOffset,
      y - ((mapSize / 2) - 0.6)
    );

    pyramid2.position = new Vector3(
      x - ((mapSize / 2) - 0.5),
      (0.3 / 2) + yOffset,
      y - ((mapSize / 2) + -0.25)
    );

    pyramid3.position = new Vector3(
      x - ((mapSize / 2) - 0.3),
      (0.5 / 2) + yOffset,
      y - ((mapSize / 2) + -0.75)
    );

    // Apply the material to all pyramids
    pyramid1.material = pyramid2.material = pyramid3.material = this.ironMaterial.material;

    mesh.addChild(pyramid1);
    mesh.addChild(pyramid2);
    mesh.addChild(pyramid3);

    return mesh;
  }
}
