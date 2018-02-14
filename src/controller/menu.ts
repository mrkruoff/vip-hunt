import * as _ from "lodash";

import Events from './events';
import Hud from './hud';
import TYPES from '../types';
import GlobalGameState from "../model/state/global-game-state";
import PlayerGameState from "../model/state/player-game-state";
import AiGameState from "../model/state/ai-game-state";
import VIP from "../model/units/VIP_unit";
import Tile from "../model/map/tile";
import TownHall from "../model/buildings/townhall_buildings";
import JsonMap from "./json-map";
import Id from "./id"

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

const displayWelcome = function() {
    const color = 'white';
    const alignment = 'center';

    //Create the welcome text
    const welcomeText = new TextSprite('Welcome to Potayto-Potahto!', '32px Verdana', color, alignment);
    this.welcomeObject = new SceneObject(welcomeText);
    wade.addSceneObject(this.welcomeObject);
    this.welcomeObject.setPosition(0, -100);

    //Create the new game text
    const newGameText = new TextSprite('New Game', '20px Verdana', color, alignment);
    this.newGameObject = new SceneObject(newGameText);
    wade.addSceneObject(this.newGameObject);
    setupNewGame.call(this);

    // Create the Load Game text
    const loadGameText = new TextSprite('Load Game', '20px Verdana', color, alignment);
    this.loadGameObject = new SceneObject(loadGameText);
    wade.addSceneObject(this.loadGameObject);
    setupSaveGame.call(this);

    // Create the settings text
    const settingsText = new TextSprite('Settings', '20px Verdana', color, alignment);
    this.settingsObject = new SceneObject(settingsText);
    wade.addSceneObject(this.settingsObject);
    setupSettings.call(this);

};

function setupSettings() {
    this.settingsObject.setPosition(0, 100);
    setMouseInOut(this.settingsObject);

    // this.settingsObject.onClick = settings.call(this);
    // wade.addEventListener(this.loadGameObject, 'onClick');

}

function setupSaveGame() {
    this.loadGameObject.setPosition(0, 50);

    setMouseInOut(this.loadGameObject);

    // this.loadGameObject.onClick = loadGame.call(this);
    // wade.addEventListener(this.loadGameObject, 'onClick');

}

var setupNewGame = function () {
    this.newGameObject.setPosition(0, 0);

    setMouseInOut(this.newGameObject);

    this.newGameObject.onClick = function() {
        const clearscene = true;
        // load the map
        wade.loadScene('../public/grass_map.wsc', null, function() {
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

            addToScene(global.state);
            
            console.log(global.state);

            //Limit camera movement
            wade.setCameraBounds(-1500, 1500, -1500, 1500, 3, 10);
            Events.addGlobal();
            Hud.initialize();

        }, clearscene);
    };
    wade.addEventListener(this.newGameObject, 'onClick');
}

// Helper function that returns a function that will change a textObject's
// color
function changeColor(textObject: any, color: string) {
    return function(event: any) {
        textObject.getSprite(0).setColor(color);
    };
}

// Helper function that adds color changes to a textObject on the
// mouseIn and MouseOut events
function setMouseInOut(textObject: any) {
    textObject.onMouseIn = changeColor(textObject, 'red');
    wade.addEventListener(textObject, 'onMouseIn');

    textObject.onMouseOut = changeColor(textObject, 'white');
    wade.addEventListener(textObject, 'onMouseOut');
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

function addToScene(state: GlobalGameState) {
    _.forEach(state.map, (innerArray) => {
        _.forEach(innerArray, (tile) => {
            if(tile.buildingId >= 0) {
                let building = _.find(state.getPlayer().getBuildings(), (b) => {
                    return b.id === tile.buildingId;
                });
                if( !building )  {
                    //Otherwise the building is an ai building
                    building = _.find(state.getAi().getBuildings(), (b) => {
                        return b.id === tile.buildingId; 
                    });
                }

                // Once we have the building, we can paint it on the appropriate
                // grid position with the appropriate image
                tile.x;
                tile.y;
            
            }
            if(tile.unitId >= 0) {
                let unit = _.find(state.getPlayer().getBuildings(), (b) => {
                    return b.id === tile.unitId;
                });
                if( !unit )  {
                    //Otherwise the unit is an ai unit
                    unit = _.find(state.getAi().getBuildings(), (b) => {
                        return b.id === tile.unitId; 
                    });
                }

                // Once we have the unit, we can paint it on the appropriate
                // grid position with the appropriate image
                tile.x;
                tile.y;
            }
        });
    });

}

export { displayWelcome };
