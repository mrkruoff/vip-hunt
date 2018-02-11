import Building from "../buildings/buildings";
import Unit from "../units/units";

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
        this.units = units;
        this.buildings = buildings;
    }

    defaultPlayerGameState() : PlayerGameState {


    }
}

export default PlayerGameState;
