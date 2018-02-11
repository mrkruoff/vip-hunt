
import Unit from "./units";
import { Container, injectable, inject } from "inversify";

@injectable()
class Gatherer extends Unit {
    constructor(
            id: number, hp: number, attack: number, defense: number,
                speed: number, range: number) {
        super(id, hp, attack, defense, speed, range);

    }


    fromJsonFile(filename: string): Gatherer {


    }
}
export default Gatherer;
