import JsonMap from "./json-map";
import Id from "./id"
import GlobalGameState from "../model/state/global-game-state";
import PlayerGameState from "../model/state/player-game-state";
import AiGameState from "../model/state/ai-game-state";
import VIP from "../model/units/VIP_unit";
import Tile from "../model/map/tile";
import TownHall from "../model/buildings/townhall_buildings";

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

var Global = {
    createGlobalSettings: () => {
        //Create a global object for handling global events that will be saved in the
        // scene (thank god)
        const global = new SceneObject();
        global.setName("global");
        wade.addSceneObject(global);
        global.cameraSpeed = 500;
        global.zoomSpeed = 8;
        global.cameraIsMoving = false;
        global.unitId = 0;
        global.buildId = 0;
        global.state = defaultGlobalState();
        global.hud = {
            //empty object to store references to other HUD elements 
        };

        return global;
    }
}

function defaultGlobalState () {
    const startingStone = 100;
    const startingWood = 100;
    const startingFood = 100;

    let playerVIP = VIP.fromObject(wade.getJson(JsonMap.vip_data));
    playerVIP.id = Id.getUnitId();
    let playerTownHall = TownHall.fromObject(wade.getJson(JsonMap.townhall_data));
    playerTownHall.id = Id.getBuildId();
    const playerState = new PlayerGameState([playerVIP], [playerTownHall],
                        startingStone, startingWood, startingFood);

    let aiVIP = VIP.fromObject(wade.getJson(JsonMap.vip_data));
    aiVIP.id = Id.getUnitId();
    let aiTownHall = TownHall.fromObject(wade.getJson(JsonMap.townhall_data));
    aiTownHall.id = Id.getBuildId();
    const aiState = new AiGameState([aiVIP], [aiTownHall],
                        startingStone, startingWood, startingFood);

    const map = [];
    for(let i = 0; i < 50; i++) {
        map[i] = [];
        for(let j = 0; j < 50; j++) {
            map[i][j] = new Tile(-1, -1, -1, true); 
            //The tile should know itself what its coordinates are
            map[i][j].x = i;
            map[i][j].y = j;
        }
    }

    //Put the VIP and Townhall on the map
    map[0][0].unitId = playerVIP.id;
    map[5][5].buildingId = playerTownHall.id;
    map[25][25].unitId = aiVIP.id;
    map[20][20].buildingId = aiTownHall.id;

    const state = new GlobalGameState(map, playerState, aiState);
    
    return state;
}

export default Global;
