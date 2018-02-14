import Building from "../buildings/buildings";
import Unit from "../units/units";
import TYPES from "../../types";
import { inject, injectable } from "inversify";

//Stores player game state. Is updated by player events.
@injectable()
class PlayerGameState {
    stone: number;
    wood: number;
    food: number;
    units: Unit[];
    buildings: Building[];

    constructor(units, buildings, stone, wood, food) {
        this.stone = stone;
        this.wood = wood;
        this.food = food;
        this.units = units;
        this.buildings = buildings;
    }

    getUnits() {
        return this.units; 
    }
    getBuildings() {
        return this.buildings; 
    }


    static defaultPlayerGameState(vipFac, townhallFac) : PlayerGameState {
        const stone = 500;
        const wood = 400;
        const food = 0;

        const units = [ vipFac() ];

        // Notice that this part of the game state doesn't know
        // where the townhall or vip actually are. Is that a flaw?
        const buildings = [ townhallFac() ];

        return new PlayerGameState(units, buildings, stone, wood, food);
    }
}


export default PlayerGameState;
