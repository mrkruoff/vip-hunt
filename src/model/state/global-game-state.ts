import PlayerGameState from "./player-game-state";
import AiGameState from "./ai-game-state";
import Tile from "../map/tile";
import TYPES from "../../types";
import bindDependencies from "../../bindDependencies";


class GlobalGameState {
    map: Tile[][];
    player_state: PlayerGameState;
    ai_state: AiGameState;
    

    //How does this construct the game state? From files from the server? From JSON?
    constructor(map, player_state , ai_state) {
        this.map = map;

        // Set up the player game state.
        this.player_state = player_state;

        //Set up the AI game state.
        this.ai_state = ai_state;
    
    }

    static defaultGameState(playerFac, aiFac, tileFac) : GlobalGameState {
        const player = playerFac();
        const ai = aiFac();
        const map = [];

        for(let i = 0; i < 50; i++) { 
            map[i] = [];
            for(let j = 0; j < 50; j++) {
                map[i][j] = tileFac(); 
            }
        }
        return new GlobalGameState(map, player, ai);
    }
}

GlobalGameState.defaultGameState = bindDependencies(GlobalGameState.defaultGameState,
                            [TYPES.defaultPlayerGameState, TYPES.defaultAiGameState,
                            TYPES.defaultTile]);

export default GlobalGameState;
