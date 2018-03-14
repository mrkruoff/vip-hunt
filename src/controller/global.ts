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
        global.hud = {
            //empty object to store references to other HUD elements
        };
        global.minimap = {
        
        };
        global.isRunning = true;

        return global;
    },
    // This function creates a GlobalGameState object that default to containing
    // a 20x20 map and having a single Player and AI, each with one VIP and one
    // TownHall each.
    defaultGlobalState: () => {
        const startingStone = 1000;
        const startingWood = 1000;
        const startingFood = 1000;

        const playerVIP = VIP.fromObject(wade.getJson(JsonMap.vip_data));
        playerVIP.id = Id.getId();
        const playerTownHall = TownHall.fromObject(wade.getJson(JsonMap.townhall_data));
        playerTownHall.id = Id.getId();
        const playerState = new PlayerGameState([playerVIP], [playerTownHall],
                            startingStone, startingWood, startingFood);

        const aiState = new AiGameState([], [], 
                            1000, 1000, 1000, "setup");

        const resources = [];

        let numTiles = wade.iso.getNumTiles();
        const map = [];
        for (let i = 0; i < numTiles.x; i++) {
            map[i] = [];
            for (let j = 0; j < numTiles.z; j++) {
                map[i][j] = new Tile(Tile.EMPTY, Tile.EMPTY, Tile.EMPTY, true);
                //The tile should know itself what its coordinates are
                map[i][j].y = i;
                map[i][j].x = j;
            }
        }

        //Put the VIP and Townhall in the middle of the map
        let x = Math.floor(numTiles.x / 2 );
        let z = Math.floor(numTiles.z / 2 );
        map[x][z].unitId = playerVIP.id;
        map[x + 3][z + 3].buildingId = playerTownHall.id;

        const state = new GlobalGameState(map, resources, playerState, aiState);

        return state;
    },
};



export default Global;
