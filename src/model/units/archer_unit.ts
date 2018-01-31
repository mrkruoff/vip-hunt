
import Unit from "./units";
import { Container, injectable, inject } from "inversify";

@injectable()
class Archer extends Unit {
	method: number;
}

export default Archer; 
