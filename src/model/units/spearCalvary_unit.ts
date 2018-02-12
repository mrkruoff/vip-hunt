
import Unit from "./units";
import { Container, injectable, inject } from "inversify";

@injectable()
class SpearCalvary extends Unit {
    constructor(
            id: number, hp: number, attack: number, defense: number,
                speed: number, range: number) {
        super(id, hp, attack, defense, speed, range);

    }


    fromJsonFile(filename: string): SpearCalvary {


    }
    defaultSpearCalvary() : SpearCalvary {
        const id = 0;
        const hp: 50;
        const attack: 20;
        const defense: number;
        const speed: 70;
        const range: 20;

        return new SpearCalvary(id, hp, attack, defense, speed, range);
    }
}
export default SpearCalvary;
