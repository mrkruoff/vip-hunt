import Building from "./buildings";

import { Container, injectable, inject } from "inversify";

@injectable()
class TownHall extends Building {
    constructor(id: number, hp: number) {
        super(id, hp);
    }
    fromJsonFile(filename: string) : TownHall {


    }
    defaultTownHall() : TownHall {
        const id = 0;
        const hp = 500; 

        return new TownHall(id, hp);
    }
}

export default TownHall;
