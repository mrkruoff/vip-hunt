
import Unit from "./units";
import { Container, injectable, inject } from "inversify";

@injectable()
class DrummerBoy extends Unit {
	method: number;
}

export default DrummerBoy;
