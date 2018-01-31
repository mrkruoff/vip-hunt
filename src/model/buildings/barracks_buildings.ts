import Building from "./buildings";

import { Container, injectable, inject } from "inversify";

@injectable()
class Barracks extends Building {
	method: number;
}

export default Barracks;
