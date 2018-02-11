import Building from "./buildings";

import { Container, injectable, inject } from "inversify";

@injectable()
class Barracks extends Building {

    constructor(id: number, hp: number) {
        super(id, hp);
    }
    fromJsonFile(filename: string) : Building {


    }
}

export default Barracks;
