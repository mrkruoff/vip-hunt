import * as _ from 'lodash';
import Unit from "./units";
import { Container, injectable, inject } from "inversify";

@injectable()
class DrummerBoy extends Unit {
    constructor(
            id: number, hp: number, attack: number, defense: number,
                speed: number, range: number, vision: number, gathering: number) {
        super(id, hp, attack, defense, speed, range, vision, gathering);
        this.name = "DrummerBoy";

    }


    static fromObject(obj): DrummerBoy {
        let unit = DrummerBoy.defaultDrummerBoy();
        if(_.has(obj, 'hp')) {
            unit.hp = obj.hp;
        }
        if(_.has(obj, 'attack')) {
            unit.attack = obj.attack;
        }
        if(_.has(obj, 'defense')) {
            unit.defense = obj.defense;
        }
        if(_.has(obj, 'speed')) {
            unit.speed = obj.speed;
        }
        if(_.has(obj, 'range')) {
            unit.range = obj.range;
        }
        if(_.has(obj, 'vision')) {
            unit.vision = obj.vision;
        }
        if(_.has(obj, 'gathering')) {
            unit.gathering = obj.gathering; 
        }
        return unit;
        


    }
    static defaultDrummerBoy() : DrummerBoy {
        const id = 0;
        const hp = 50;
        const attack = 20;
        const defense = 10;
        const speed = 70;
        const range = 20;
        const vision = 70;
        const gathering = 30;

        return new DrummerBoy(id, hp, attack, defense, speed, range, vision, gathering);
    }
}

export default DrummerBoy;
