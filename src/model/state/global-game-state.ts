import PlayerGameState from "./player-game-state";
import AiGameState from "./ai-game-state";
import Tile from "../map/tile";
import Resource from "../resources/resource";
import { inject, injectable } from "inversify";

@injectable()
class GlobalGameState {
    map: Tile[][];
    player_state: PlayerGameState;
    ai_state: AiGameState;
    resources: Resource[];
    

    //How does this construct the game state? From files from the server? From JSON?
    constructor(map: Tile[][], resources: Resource[], player_state: PlayerGameState ,
                ai_state: AiGameState) {
        this.map = map;

        // Set up the player game state.
        this.player_state = player_state;

        //Set up the AI game state.
        this.ai_state = ai_state;

        this.resources = resources;
    }

    getPlayer() {
        return this.player_state; 
    }

    getAi() {
        return this.ai_state; 
    }

    getMap() {
        return this.map; 
    }

    getResources() {
        return this.resources; 
    }

}

export default GlobalGameState;
