import { Scene, Color3 } from "@babylonjs/core";
import { BotMaterial } from "./bot.mesh";
import { FoodMaterial } from "./food.mesh";
import { GroundMaterial } from "./ground.mesh";
import { IronMaterial } from "./iron.mesh";
import { WallMaterial } from "./wall.mesh";
import { WaterMaterial } from "./water.mesh";
import { WoodMaterial } from "./wood.mesh";

export class MeshMaterials {
    _bot?: BotMaterial;
    _food?: FoodMaterial;
    _iron?: IronMaterial;
    _wall?: WallMaterial;
    _water?: WaterMaterial;
    _wood?: WoodMaterial;
    _ground?: GroundMaterial;

    constructor(private scene: Scene, private botColors: Color3[]) { }

    get bot(): BotMaterial {
        return (this._bot ??= new BotMaterial(this.scene, this.botColors[0]));
    }

    get food(): FoodMaterial {
        return (this._food ??= new FoodMaterial(this.scene));
    }

    get iron(): IronMaterial {
        return (this._iron ??= new IronMaterial(this.scene));
    }

    get wall(): WallMaterial {
        return (this._wall ??= new WallMaterial(this.scene));
    }

    get water(): WaterMaterial {
        return (this._water ??= new WaterMaterial(this.scene));
    }

    get wood(): WoodMaterial {
        return (this._wood ??= new WoodMaterial(this.scene));
    }

    get ground(): GroundMaterial {
        return (this._ground ??= new GroundMaterial(this.scene));
    }
}
