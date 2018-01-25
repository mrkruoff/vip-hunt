
//Stores player game state. Is updated by player events.
class PlayerGameState {
    stone: number;
    wood: number;
    food: number;
    units: Unit[];
    buildings: Building[];
    //total units: number  -- not needed, as it is the length property of the this.units
}
