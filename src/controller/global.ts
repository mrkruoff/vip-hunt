import TownHall from '../model/buildings/townhall_buildings';
import Tile from '../model/map/tile';
import AiGameState from '../model/state/ai-game-state';
import GlobalGameState from '../model/state/global-game-state';
import PlayerGameState from '../model/state/player-game-state';
import VIP from '../model/units/VIP_unit';
import Id from './id';
import JsonMap from './json-map';

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

const Global = {
    createGlobalSettings: () => {
        //Create a global object for handling global events that will be saved in the
        // scene (thank god)
        const global = new SceneObject();
        global.setName('global');
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
    },
};

function defaultGlobalState() {
    const startingStone = 100;
    const startingWood = 100;
    const startingFood = 100;

    const playerVIP = VIP.fromObject(wade.getJson(JsonMap.vip_data));
    playerVIP.id = Id.getId();
    const playerTownHall = TownHall.fromObject(wade.getJson(JsonMap.townhall_data));
    playerTownHall.id = Id.getId();
    const playerState = new PlayerGameState([playerVIP], [playerTownHall],
                        startingStone, startingWood, startingFood);

    const aiVIP = VIP.fromObject(wade.getJson(JsonMap.vip_data));
    aiVIP.id = Id.getId();
    const aiTownHall = TownHall.fromObject(wade.getJson(JsonMap.townhall_data));
    aiTownHall.id = Id.getId();
    const aiState = new AiGameState([aiVIP], [aiTownHall],
                        startingStone, startingWood, startingFood);

    const map = [];
    for (let i = 0; i < 20; i++) {
        map[i] = [];
        for (let j = 0; j < 20; j++) {
            map[i][j] = new Tile(-1, -1, -1, true);
            //The tile should know itself what its coordinates are
            map[i][j].y = i;
            map[i][j].x = j;
        }
    }

    //Put the VIP and Townhall on the map
    map[15][15].unitId = playerVIP.id;
    map[1][5].buildingId = playerTownHall.id;
    map[5][15].unitId = aiVIP.id;
    map[1][10].buildingId = aiTownHall.id;

    const state = new GlobalGameState(map, playerState, aiState);

    return state;
}

export default Global;
