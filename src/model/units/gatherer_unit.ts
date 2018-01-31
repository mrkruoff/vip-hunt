
import Unit from "./units";
import { Container, injectable, inject } from "inversify";

@injectable()
class Gatherer extends Unit {
	method: number;
}
export default Gatherer;
