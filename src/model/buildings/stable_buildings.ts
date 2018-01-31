import Building from "./buildings";

import { Container, injectable, inject } from "inversify";

@injectable()
class Stable extends Building {
	method: number;
}

export default Stable;
