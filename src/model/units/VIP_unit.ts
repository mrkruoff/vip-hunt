import Unit from "./units";
import { Container, injectable, inject } from "inversify";

@injectable()
class VIP extends Unit {
	method: number;
}

export default VIP;
