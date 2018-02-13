import Building from "../buildings/buildings";
import Unit from "../units/units";
import TYPES from "../../types";
import { bindDependencies } from "../../bindDependencies";

//Stores player game state. Is updated by player events.
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

PlayerGameState.defaultPlayerGameState = bindDependencies(
                    PlayerGameState.defaultPlayerGameState,
                    [TYPES.defaultVIP, TYPES.defaultTownHall]);

export default PlayerGameState;
