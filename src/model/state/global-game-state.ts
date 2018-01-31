import PlayerGameState from "./player-game-state";
import Tile from "../map/tile";


class GlobalGameState {
    map: Tile[][];
    player_stae: PlayerGameState;
    

    //How does this construct the game stae? From files from the server? From JSON?
    constructor() {
    
    }

}

export default GlobalGameState;
