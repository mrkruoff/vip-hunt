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
        this.food = food;
        this.units = units;
        this.buildings = buildings;
    }

    defaultPlayerGameState() : PlayerGameState {
        const stone = 500;
        const wood = 400;
        const food = 0;

        const units = [ defaultVIP() ];

        // Notice that this part of the game state doesn't know
        // where the townhall or vip actually are. Is that a flaw?
        const buildings = [ defaultTownHall() ];

        return new PlayerGameState(units, buildings, stone, wood, food);


    }
}

export default PlayerGameState;
