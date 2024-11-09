import { BotMesh } from "./bot.mesh";
import { FoodMesh } from "./food.mesh";
import { IronMesh } from "./iron.mesh";
import { TileType } from "./map.models";
import { MeshMaterials } from "./mesh-materials";
import { MeshOptions } from "./mesh-options";
import { WallMesh } from "./wall.mesh";
import { WaterMesh } from "./water.mesh";
import { WoodMesh } from "./wood.mesh";

export class MeshFactory {
    constructor(private materials: MeshMaterials) { }

    create(options: MeshOptions, type: TileType) {
        switch (type) {
            case 'food':
                return new FoodMesh(options, this.materials.food);
            case 'water':
                return new WaterMesh(options, this.materials.water);
            case 'wood':
                return new WoodMesh(options, this.materials.wood);
            case 'iron':
                return new IronMesh(options, this.materials.iron);
            case 'wall':
                return new WallMesh(options, this.materials.wall);
            case 'bot':
                return new BotMesh(options, this.materials.bot);
            default:
                throw new Error(`Unknown tile type: ${type}`);
        }
    }
}