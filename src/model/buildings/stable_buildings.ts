import Building from "./buildings";

import { Container, injectable, inject } from "inversify";

@injectable()
class Stables extends Building {
    constructor(id: number, hp: number, vision: number) {
        super(id, hp, vision);
        this.name = "Stables";
    }
    static fromObject(obj) : Stables {
        let building = Stables.defaultStables();
        if(obj.hp) {
            building.hp = obj.hp;
        }
        if(obj.vision) {
            building.vision = obj.vision ;
        }

        return building;


    }
    static defaultStables() : Stables {
        const id = 0;
        const hp = 500; 
        const vision = 300;

        return new Stables(id, hp, vision);
    }
}

export default Stables;
