import Unit from "./units";
import { Container, injectable, inject } from "inversify";

@injectable()
class ArcherCalvary extends Unit {
    constructor(
            id: number, hp: number, attack: number, defense: number,
                speed: number, range: number, vision: number, gathering: number) {
        super(id, hp, attack, defense, speed, range, vision, gathering);

    }


    static fromObject(obj): ArcherCalvary {
        let unit = ArcherCalvary.defaultArcherCalvary();
        if(obj.hp) {
            unit.hp = obj.hp;
        }
        if(obj.attack) {
            unit.attack = obj.attack;
        }
        if(obj.defense) {
            unit.defense = obj.defense;
        }
        if(obj.speed) {
            unit.speed = obj.speed;
        }
        if(obj.range) {
            unit.range = obj.range;
        }
        if(obj.vision) {
            unit.vision = obj.vision;
        }
        if(obj.gathering) {
            unit.gathering = obj.gathering ;
        }
        return unit;


    }
    static defaultArcherCalvary() : ArcherCalvary {
        const id = 0;
        const hp = 50;
        const attack = 20;
        const defense = 70;
        const speed = 70;
        const range = 20;
        const vision = 50;
        const gathering = 0;

        return new ArcherCalvary(id, hp, attack, defense, speed, range, vision, gathering);
    }
}

export default ArcherCalvary; 
