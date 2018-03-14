import { Container, inject, injectable } from "inversify";
import Unit from "../units/units";
import Building from "../buildings/buildings";
import TYPES from "../../types";

//Stores player game state. Is updated by player events.
@injectable()
class AiGameState {
    stone: number;
    wood: number;
    food: number;
	actionState: string;
    units: Unit[];
    buildings: Building[];

    constructor( units: Unit[], buildings: Building[], stone, wood, food, actionState) {
        this.stone = stone;
        this.wood = wood;
        this.food = food;
        this.units = units;
		this.actionState=actionState;
        this.buildings = buildings;
    }

    getBuildings() {
        return this.buildings; 
    }

    getUnits() {
        return this.units;
    }
	
	getActionState(){
		
		return this.actionState;
	}

    static defaultAiGameState(vipFac, townhallFac) : AiGameState {
        const stone = 500;
        const wood = 400;
        const food = 0;
		const actionState="setup";

        const units = [ vipFac() ];

        // Notice that this part of the game state doesn't know
        // where the townhall or vip actually are. Is that a flaw?
        const buildings = [ townhallFac() ];

        return new AiGameState(units, buildings, stone, wood, food, actionState);


    }
}


export default AiGameState;
