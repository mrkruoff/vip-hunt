import Unit from "./units";
import { Container, injectable, inject } from "inversify";

@injectable()
class ArcherCalvary extends Unit {
	method: number;
}

export default ArcherCalvary; 
