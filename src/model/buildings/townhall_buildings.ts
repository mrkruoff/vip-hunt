import Building from "./buildings";

import { Container, injectable, inject } from "inversify";

@injectable()
class TownHall extends Building {
	method: number;
}

export default TownHall;
