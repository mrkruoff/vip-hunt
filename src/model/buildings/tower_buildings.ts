
import Building from "./buildings";

import { Container, injectable, inject } from "inversify";

@injectable()
class Tower extends Building {
    constructor(id: number, hp: number, vision: number) {
        super(id, hp, vision);
        this.name = "Tower";
    }
    static fromObject(obj) : Tower {
        let building = Tower.defaultTower();
        if(obj.hp) {
            building.hp = obj.hp;
        }
        if(obj.vision) {
            building.vision = obj.vision ;
        }

        return building;


    }
    static defaultTower() : Tower {
        const id = 0;
        const hp = 200; 
        const vision = 1000;

        return new Tower(id, hp, vision);
    }
}

export default Tower;
