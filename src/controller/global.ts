/* global.ts
 *
 * The Global module contains functions for creating, setting up, getting,
 * and accessing the global settings stored in the 'global' SceneObject
 *
 */

import TownHall from '../model/buildings/townhall_buildings';
import Tile from '../model/map/tile';
import AiGameState from '../model/state/ai-game-state';
import GlobalGameState from '../model/state/global-game-state';
import PlayerGameState from '../model/state/player-game-state';
import VIP from '../model/units/VIP_unit';
import Id from './id';
import JsonMap from './json-map';

import Food from '../model/resources/food';
import Stone from '../model/resources/stone';
import Wood from '../model/resources/wood';

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
    // This function creates a SceneObject named 'global' that contains global
    // settings and will contain the global game state. It wll also contain
    // references to hud elements so the game can determine whether they've been
    // created or not.
    createGlobalSettings: () => {
        const global = new SceneObject();
        global.setName('global');
        wade.addSceneObject(global);
        global.cameraSpeed = 500;
        global.zoomSpeed = 8;
        global.cameraIsMoving = false;
        global.state = defaultGlobalState();
        global.hud = {
            //empty object to store references to other HUD elements
        };
        global.isRunning = true;

        return global;
    },
};

// This function creates a GlobalGameState object that default to containing
// a 20x20 map and having a single Player and AI, each with one VIP and one
// TownHall each.
function defaultGlobalState() {
    const startingStone = 100000;
    const startingWood = 100000;
    const startingFood = 100000;

    const playerVIP = VIP.fromObject(wade.getJson(JsonMap.vip_data));
    playerVIP.id = Id.getId();
    const playerTownHall = TownHall.fromObject(wade.getJson(JsonMap.townhall_data));
    playerTownHall.id = Id.getId();
    const playerState = new PlayerGameState([playerVIP], [playerTownHall],
                        startingStone, startingWood, startingFood);

    console.log(wade.getJson(JsonMap.vip_data));
    /*
    const aiVIP = VIP.fromObject(wade.getJson(JsonMap.vip_data));
    aiVIP.id = Id.getId();
    const aiTownHall = TownHall.fromObject(wade.getJson(JsonMap.townhall_data));
    aiTownHall.id = Id.getId();
    */
    /*
    const aiState = new AiGameState([aiVIP], [aiTownHall],
                        startingStone, startingWood, startingFood);
    */
    const aiState = new AiGameState([], [], 
                        startingStone, startingWood, startingFood);

    const wood = Wood.fromObject(wade.getJson(JsonMap.wood_data));
    wood.id = Id.getId();
    const stone = Stone.fromObject(wade.getJson(JsonMap.stone_data));
    stone.id = Id.getId();
    const food = Food.fromObject(wade.getJson(JsonMap.food_data));
    food.id = Id.getId();
    const resources = [wood, stone, food];

    const map = [];
    for (let i = 0; i < 20; i++) {
        map[i] = [];
        for (let j = 0; j < 20; j++) {
            map[i][j] = new Tile(Tile.EMPTY, Tile.EMPTY, Tile.EMPTY, true);
            //The tile should know itself what its coordinates are
            map[i][j].y = i;
            map[i][j].x = j;
        }
    }

    //Put the VIP and Townhall on the map
    map[15][15].unitId = playerVIP.id;
    map[1][5].buildingId = playerTownHall.id;
    /*
    map[5][15].unitId = aiVIP.id;
    map[1][10].buildingId = aiTownHall.id;
    */
    map[19][16].resourceId = wood.id;
    map[19][8].resourceId = stone.id;
    map[3][4].resourceId = food.id;

    const state = new GlobalGameState(map, resources, playerState, aiState);

    return state;
}

export default Global;
