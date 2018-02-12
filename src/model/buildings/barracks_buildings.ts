import Building from "./buildings";

import { Container, injectable, inject } from "inversify";

@injectable()
class Barracks extends Building {

    constructor(id: number, hp: number) {
        super(id, hp);
    }
    fromJsonFile(filename: string) : Building {


    }

    defaultBarracks() : Barracks {
        const id = 0;
        const hp = 500; 

        return new Barracks(id, hp);
    }
}

export default Barracks;
