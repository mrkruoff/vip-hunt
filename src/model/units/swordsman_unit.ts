
import Unit from "./units";
import { Container, injectable, inject } from "inversify";

@injectable()
class Swordsman extends Unit {
	method: number;
}
export default Swordsman;
