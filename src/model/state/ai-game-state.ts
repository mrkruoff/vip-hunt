import bindDependencies from "../../bindDependencies";
import TYPES from "../../types";
import Building from "../buildings/buildings";
import Unit from "../units/units";

//Stores player game state. Is updated by player events.
class AiGameState {
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

    static defaultAiGameState(vipFac, townhallFac) : AiGameState {
        const stone = 500;
        const wood = 400;
        const food = 0;

        const units = [ vipFac() ];

        // Notice that this part of the game state doesn't know
        // where the townhall or vip actually are. Is that a flaw?
        const buildings = [ townhallFac() ];

        return new AiGameState(units, buildings, stone, wood, food);


    }
}

AiGameState.defaultAiGameState = bindDependencies(AiGameState.defaultAiGameState, 
                                    [TYPES.defaultVIP, TYPES.defaultTownHall]);

export default AiGameState;
