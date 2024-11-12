import {
    Scene,
    MeshBuilder,
    Mesh,
    Color3,
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials/grid/gridMaterial';
import { IMesh } from './mesh.interface';

export class GroundMaterial {
    private readonly _material: GridMaterial;

    constructor(scene: Scene) {
        this._material = new GridMaterial('grid', scene);
        this._material.gridRatio = 1;
        this._material.majorUnitFrequency = 1;
        this._material.minorUnitVisibility = 0.45;
        this._material.backFaceCulling = false;
        this._material.mainColor = new Color3(1, 1, 1);
        this._material.lineColor = new Color3(0.5, 0.5, 0.5);
    }

    public get material() {
        return this._material;
    }
}

export class GroundMesh implements IMesh {
    private _mesh: Mesh;

    constructor(
        private scene: Scene,       // Babylon.js scene reference
        private mapSize: number,    // Size of the map to calculate correct position
        private groundMaterial: GroundMaterial, // Shared material instance
    ) {
        this._mesh = this.createMesh();
    }

    public get mesh() {
        return this._mesh;
    }

    public dispose(): void {
        this._mesh.dispose();
    }

    private createMesh(): Mesh {
        const mesh = MeshBuilder.CreateGround(
            'ground',
            { width: this.mapSize, height: this.mapSize, subdivisions: this.mapSize },
            this.scene
        );
        mesh.material = this.groundMaterial.material;

        return mesh;
    }
}
