import PlayerGameState from "./player-game-state";
import Tile from "../map/tile";


class GlobalGameState {
    map: Tile[][];
    player_state: PlayerGameState;
    ai_state: AiGameState;
    

    //How does this construct the game state? From files from the server? From JSON?
    constructor(mapName: string, player_state , ai_state) {
        //Construct the correct map .wsc file.
        // TODO: implement this.

        // Set up the player game state.
        this.player_state = player_state;

        //Set up the AI game state.
        this.ai_state = ai_state;
    
    }

    defaultGameState() : GlobalGameState {
        const player = defaultPlayerGameState();
        const ai = defaultAiGameState();
        const map = defaultMap();

        return new GlobalGameState(map, player, ai);
    }


}

export default GlobalGameState;
