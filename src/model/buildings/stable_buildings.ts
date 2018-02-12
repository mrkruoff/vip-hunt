import Building from "./buildings";

import { Container, injectable, inject } from "inversify";

@injectable()
class Stable extends Building {
    constructor(id: number, hp: number) {
        super(id, hp);
    }
    fromJsonFile(filename: string) : Stable {


    }
    defaultStable() : Stable {
        const id = 0;
        const hp = 500; 

        return new Stable(id, hp);
    }
}

export default Stable;
