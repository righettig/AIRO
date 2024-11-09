import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  Material,
} from '@babylonjs/core';

export class IronMesh {
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
    const mesh = new Mesh(`iron_${this.x}_${this.y}`, this.scene);

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
      this.x - ((this.mapSize / 2) - 0.7),
      (0.4/2) + this.yOffset,
      this.y - ((this.mapSize / 2) - 0.6)
    );

    pyramid2.position = new Vector3(
      this.x - ((this.mapSize / 2) - 0.5),
      (0.3/2) + this.yOffset,
      this.y - ((this.mapSize / 2) + -0.25)
    );
    
    pyramid3.position = new Vector3(
      this.x - ((this.mapSize / 2) - 0.3),
      (0.5/2) + this.yOffset,
      this.y - ((this.mapSize / 2) + -0.75)
    );

    // Apply the material to all pyramids
    pyramid1.material = pyramid2.material = pyramid3.material = this.material;
    
    mesh.addChild(pyramid1);
    mesh.addChild(pyramid2);
    mesh.addChild(pyramid3);

    return mesh;
  }
}
