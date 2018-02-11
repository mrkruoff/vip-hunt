import PlayerGameState from "./player-game-state";
import Tile from "../map/tile";


class GlobalGameState {
    map: Tile[][];
    player_state: PlayerGameState;
    ai_state: AiGameState;
    

    //How does this construct the game state? From files from the server? From JSON?
    constructor(mapName: string) {
        //Construct the correct map .wsc file.
        // TODO: implement this.

        // Set up the player game state.
        this.player_state = container.get("PlayerGameState");

        //Set up the AI game state.
        this.ai_state = container.get("AiGameState");
    
    }

    defaultGameState() : GlobalGameState {


    }


}

export default GlobalGameState;
