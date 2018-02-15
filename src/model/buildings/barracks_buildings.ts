import * as _ from 'lodash';
import Building from "./buildings";

import { Container, injectable, inject } from "inversify";

@injectable()
class Barracks extends Building {

    constructor(id: number, hp: number, vision: number) {
        super(id, hp, vision);
        this.name = "Barracks";
    }
    static fromObject(obj) : Building {
        let building = Barracks.defaultBarracks();
        if(_.has(obj, 'hp')) {
            building.hp = obj.hp;
        }
        if(_.has(obj, 'vision')) {
            building.vision = obj.vision ;
        }

        return building;
    }

    static defaultBarracks() : Barracks {
        const id = 0;
        const hp = 500; 
        const vision = 20;

        return new Barracks(id, hp, vision);
    }
}

export default Barracks;
