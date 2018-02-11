import Unit from "./units";
import { Container, injectable, inject } from "inversify";

@injectable()
class VIP extends Unit {
    constructor(
            id: number, hp: number, attack: number, defense: number,
                speed: number, range: number) {
        super(id, hp, attack, defense, speed, range);

    }


    fromJsonFile(filename: string): VIP {


    }

}

export default VIP;
