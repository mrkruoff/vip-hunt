
import * as _ from 'lodash';
import Resource from '../model/resources/resource';
import GlobalGameState from '../model/state/global-game-state';
import PlayerGameState from '../model/state/player-game-state';
import AiGameState from '../model/state/ai-game-state';
import Camera from './camera';
import Construction from './construction';
import Events from './events';
import { ResourceBuilding, UnitBuilding, BuildingBuilding, GamePlay } from './gameplay';
import Global from './global';
import Hud from './hud';
import ImageMap from './image-map';
import JsonMap from './json-map';
import Mouse from './mouse';
import SceneObjectConstruction from './scene-object-construction';
import AiGamePlay from './ai-gameplay';
import Fog from './fog';
import UnitDec from './unit-ai';
import AiDec from '../model/state/ai-dec';
import NewGame from './newgame';

import Archer from '../model/units/archer_unit';
import ArcherCalvary from '../model/units/archerCalvary_unit';
import DrummerBoy from '../model/units/drummerBoy_unit';
import Gatherer from '../model/units/gatherer_unit';
import SpearCalvary from '../model/units/spearCalvary_unit';
import Swordsman from '../model/units/swordsman_unit';
import Unit from '../model/units/units';
import VIP from '../model/units/VIP_unit';

import Barracks from '../model/buildings/barracks_buildings';
import Building from '../model/buildings/buildings';
import Stables from '../model/buildings/stable_buildings';
import Tower from '../model/buildings/tower_buildings';
import TownHall from '../model/buildings/townhall_buildings';

import Food from '../model/resources/food';
import Wood from '../model/resources/wood';
import Stone from '../model/resources/stone';

import Minimap from './minimap';
import Tile from '../model/map/tile';



declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;



var SaveGame = {
    initialize: async () => {
        wade.setMinScreenSize(20, 20);
        wade.setMaxScreenSize(1280, 800);

        // Set up the global object to recreate the HUD.
        let global = wade.getSceneObject('global');
        global.hud = {
            //empty object to store references to other HUD elements
        };
        global.minimap = {
        
        };

        // Set up WADE layers to display correctly.
        wade.setLayerSorting(9, 'bottomToTop');
        wade.setLayerTransform(8, 0, 0);
        wade.setLayerTransform(9, 0, 0);
        wade.setLayerTransform(10, 0, 0);

        Hud.showMinimap();      // Show minimap so new units and buildings can 
                                // be created
        setUpFog();
        syncMiniFogToFog();

        // Connect all the isometric objects back to their data representations.
        relinkDataAndIsometricObjects();
        setUpIsometricSpriteVisibility();
        setUpIsometricSpriteMinimapMarkers();
        setUpPlayerSelectClickEvents();
        resetUnitActivity();
        resetUnitSpriteSizes();

        // If all the isometric objects are linked, we can set up the camera and hud.
        NewGame.createHud();
        NewGame.setUpCamera();

        GamePlay.refreshPlayerVision();


        AiGamePlay.generateRandomResources();
        // Start background thread that checks for when player units enter 
        // ai unit vision, and vice versa. This will start conflicts!
        UnitDec.playerUnitsWatch();
        UnitDec.aiUnitsWatch();

        console.log(global);
        console.log(wade.iso.exportMap() ) ;
    }
};

function resetUnitSpriteSizes() {
    let state = wade.getSceneObject('global').state;
    let units = _.concat(state.getAi().getUnits(), state.getPlayer().getUnits());
    _.forEach(units, (datum) => {
        let unitSceneObject = datum.rep; 
        let playerSprite = unitSceneObject.getSprite(1);
        playerSprite.setSize(200, 200);
        unitSceneObject.setSpriteOffset(1, {x: 0, y: 5});
        let enemySprite = unitSceneObject.getSprite(2);
        enemySprite.setSize(750, 750);
        unitSceneObject.setSpriteOffset(2, {x: 0, y: -50});
    });


}

function resetUnitActivity() {
    let state = wade.getSceneObject('global').state;
    let units = _.concat(state.getAi().getUnits(), state.getPlayer().getUnits());
    _.forEach(units, (datum) => {
        let unitSceneObject = datum.rep; 
        unitSceneObject.active = false;
        unitSceneObject.shouldPursue = false;
        unitSceneObject.isAttacking = false;
        unitSceneObject.shouldGather = false;
        unitSceneObject.isGathering = false;
        datum.isMoving = false;
    })

}

function setUpPlayerSelectClickEvents() {
    let state = wade.getSceneObject('global').state;
    _.forEach(state.getPlayer().getUnits(), (unit) => {
        let sceneobject = unit.rep; 
        sceneobject.onMouseDown = GamePlay.onSelectUnit(sceneobject);
        wade.addEventListener(sceneobject, 'onMouseDown');
    });

    _.forEach(state.getPlayer().getBuildings(), (building) => {
        let sceneobject = building.rep;
        const imageName = sceneobject.getSprite(0).getImageName();
        let displayFn;
        if (imageName === ImageMap.barracks_1) {
            displayFn = Hud.showBarracksPanel;
        } else if (imageName === ImageMap.stables_1) {
            displayFn = Hud.showStablesPanel;
        } else if (imageName === ImageMap.towers_1) {
            displayFn = Hud.showTowerPanel;
        } else if (imageName === ImageMap.town_halls_1) {
            displayFn = Hud.showTownHallPanel;
        } else {
            throw new Error("Unrecognized building image in setUpPlayerSelectClickEvents"); 
        }
        sceneobject.onMouseDown = GamePlay.onSelectBuilding(sceneobject, displayFn);
        wade.addEventListener(sceneobject, 'onMouseDown');
    });
}

function setUpIsometricSpriteMinimapMarkers() {
    let state = wade.getSceneObject('global').state;

    // Restore unit markers
    _.forEach(state.getPlayer().getUnits(), (unit) => {
        let sceneobject = unit.rep;
        let coords = sceneobject.iso.gridCoords;
        sceneobject.marker = Minimap.createUnitMarker(coords.x, coords.z, "player");
    });
    _.forEach(state.getAi().getUnits(), (unit) => {
        let sceneobject = unit.rep;
        let coords = sceneobject.iso.gridCoords;
        sceneobject.marker = Minimap.createUnitMarker(coords.x, coords.z, "ai");
    });

    // Restore building markers
    _.forEach(state.getPlayer().getBuildings(), (building) => {
        let sceneobject = building.rep;
        let coords = sceneobject.iso.gridCoords;
        sceneobject.marker = Minimap.createBuildingMarker(coords.x, coords.z, "player");
    
    });
    _.forEach(state.getAi().getBuildings(), (building) => {
        let sceneobject = building.rep;
        let coords = sceneobject.iso.gridCoords;
        sceneobject.marker = Minimap.createBuildingMarker(coords.x, coords.z, "ai");
    
    });

}

function setUpFog() {
    let numTiles = wade.iso.getNumTiles();
    for(let x = 0; x < numTiles.x; x++) {
        for(let z = 0; z < numTiles.z; z++) {
            let sprite = wade.iso.getTransitionSprite(x, z);
            sprite.setLayer(22);
            if(sprite.getImageName() === ImageMap.fog) {
                sprite.discovered = true; 
            }
            else if (sprite.getImageName() === ImageMap.darkness) {
                sprite.discovered = false; 
            }
            else {
                throw new Error("Unexpected transition sprite in map fog!"); 
            }
        }
    }
}

function syncMiniFogToFog() {
    let miniFog = wade.getSceneObject('global').minimap.fogLayer;
    let numTiles = wade.iso.getNumTiles();

    for(let x = 0; x < numTiles.x; x++ ) {
        for(let z = 0; z < numTiles.z; z++) {
            let sprite = wade.iso.getTransitionSprite(x, z);
            if(sprite.getImageName() === ImageMap.fog) {
                miniFog[x][z].getSprite(0).setVisible(false);
                miniFog[x][z].getSprite(1).setVisible(true);
            }
            else if (sprite.getImageName() === ImageMap.darkness) {
                miniFog[x][z].getSprite(0).setVisible(true);
                miniFog[x][z].getSprite(1).setVisible(false);
            }
            else {
                throw new Error("Unexpected transition sprite in map fog!"); 
            }
        }
    }


}

function setUpIsometricSpriteVisibility() {
    let global = wade.getSceneObject('global');
    let ai = global.state.getAi();

    // Reset Ai Units/Buildings to display their markers
    let aiObjects = _.concat(ai.getUnits(), ai.getBuildings());
    _.forEach(aiObjects, (obj) => {
        obj.rep.getSprite(2).setVisible(true);
    });
}

function relinkDataAndIsometricObjects() {
    // Reinitialize the global game state so that we have access to its functions.
    let global = wade.getSceneObject('global');
    let globalstate: GlobalGameState = global.state;

    let map: Tile[][] = reconstructMap(globalstate.map);
    let resources: Resource[] = reconstructResources(globalstate.resources);
    let player: PlayerGameState = reconstructPlayerGameState(globalstate.player_state);
    let ai: AiGameState = reconstructAiGameState(globalstate.ai_state);

    let newGlobalState = new GlobalGameState(map, resources, player, ai);
    global.state = newGlobalState;
    console.log(newGlobalState);

    // Now step through all scene objects with the data property,
    // and use them to reconnect the isometric SceneObjects with their data
    let sceneObjects = wade.getSceneObjects('data');
    console.log(sceneObjects);

    _.forEach(sceneObjects, (sceneObject) => {
        let data;
        if(_.has(sceneObject.data, 'amount')) {
            // Then the sceneObject represents a Resource
            data = global.state.getResources();
        
        } else if (_.has(sceneObject.data, 'speed')) {
            // Then the sceneObject represents a Unit
            data = _.concat(global.state.getAi().getUnits(),
                                global.state.getPlayer().getUnits());
        }
        else {
            // Otherwise the sceneObject must be a building.
            data = _.concat(global.state.getAi().getBuildings(),
                           global.state.getPlayer().getBuildings());
        }
        // Connect the sceneObject to its data!
        for(let i = 0; i < data.length; i++) {
            if(sceneObject.data.id === data[i].id) {
                sceneObject.data = data[i];
                data[i].rep = sceneObject;
                break;
            }
        }
    });
    console.log(sceneObjects);
    console.log(global.state);
}

function reconstructAiGameState(ai): AiGameState {
    let units: Unit[] = reconstructUnits(ai.units);
    let buildings: Building[] = reconstructBuildings(ai.buildings);

    let newAi = new AiGameState(units, buildings, ai.stone,
                                       ai.wood, ai.food);

    return newAi;
}

function reconstructPlayerGameState(player): PlayerGameState {
    let units: Unit[] = reconstructUnits(player.units);
    let buildings: Building[] = reconstructBuildings(player.buildings);

    let newPlayer = new PlayerGameState(units, buildings, player.stone,
                                       player.wood, player.food);

    return newPlayer;
}

function reconstructBuildings(buildings): Building[] {
    let newbuildings = [];
    for(let i = 0; i < buildings.length; i++) {
        let newBuilding;
        let oldBuilding = buildings[i];
        if(oldBuilding.name === "Barracks") {
            newBuilding = new Barracks(oldBuilding.id, oldBuilding.hp, oldBuilding.vision);
        } else if (oldBuilding.name === "Stables") {
            newBuilding = new Stables(oldBuilding.id, oldBuilding.hp, oldBuilding.vision);
        
        } else if (oldBuilding.name === "TownHall") {
            newBuilding = new TownHall(oldBuilding.id, oldBuilding.hp, oldBuilding.vision);
        
        } else if (oldBuilding.name === "Tower") {
            newBuilding = new Tower(oldBuilding.id, oldBuilding.hp, oldBuilding.vision);
        
        }
        else {
            throw new Error ("Unrecognized building name!"); 
        }
        newbuildings[i] = newBuilding; 
    }
    return newbuildings;
}

function reconstructUnits(units): Unit[] {
    let newunits = [];
    for(let i = 0; i < units.length; i++) {
        let newUnit;
        let oldUnit = units[i];
        if(oldUnit.name === "ArcherCalvary") {
            newUnit = new ArcherCalvary(oldUnit.id, oldUnit.hp, oldUnit.attack,
                                        oldUnit.defense, oldUnit.speed, oldUnit.range,
                                        oldUnit.vision, oldUnit.gathering); 
        } else if (oldUnit.name === "Archer") {
            newUnit = new Archer(oldUnit.id, oldUnit.hp, oldUnit.attack,
                                        oldUnit.defense, oldUnit.speed, oldUnit.range,
                                        oldUnit.vision, oldUnit.gathering); 
        
        } else if (oldUnit.name === "DrummerBoy") {
            newUnit = new DrummerBoy(oldUnit.id, oldUnit.hp, oldUnit.attack,
                                        oldUnit.defense, oldUnit.speed, oldUnit.range,
                                        oldUnit.vision, oldUnit.gathering); 
        
        } else if (oldUnit.name === "Gatherer") {
            newUnit = new Gatherer(oldUnit.id, oldUnit.hp, oldUnit.attack,
                                        oldUnit.defense, oldUnit.speed, oldUnit.range,
                                        oldUnit.vision, oldUnit.gathering); 
        
        } else if (oldUnit.name === "SpearCalvary") {
            newUnit = new SpearCalvary(oldUnit.id, oldUnit.hp, oldUnit.attack,
                                        oldUnit.defense, oldUnit.speed, oldUnit.range,
                                        oldUnit.vision, oldUnit.gathering); 
        
        } else if (oldUnit.name === "Swordsman") {
            newUnit = new Swordsman(oldUnit.id, oldUnit.hp, oldUnit.attack,
                                        oldUnit.defense, oldUnit.speed, oldUnit.range,
                                        oldUnit.vision, oldUnit.gathering); 
        
        } else if (oldUnit.name === "VIP") {
            newUnit = new VIP(oldUnit.id, oldUnit.hp, oldUnit.attack,
                                        oldUnit.defense, oldUnit.speed, oldUnit.range,
                                        oldUnit.vision, oldUnit.gathering); 
        } else {
            throw new Error("Unrecognized unit name!");
        }
        newunits[i] = newUnit;
    }

    return newunits;
}

function reconstructResources(resources): Resource[] {
    let newResources = [];

    for(let i = 0; i < resources.length; i++) {
        let newResource;
        let oldResource = resources[i];
        if(oldResource.name === "Food") {
            newResource = new Food(oldResource.id, oldResource.amount); 
        } else if (oldResource.name === "Wood") {
            newResource = new Wood(oldResource.id, oldResource.amount); 
        } else if (oldResource.name === "Stone") {
            newResource = new Stone(oldResource.id, oldResource.amount); 
        }
        else {
            throw Error("Unexpected resource name!"); 
        }
        newResources[i] = newResource;
    }
    console.log(newResources);

    return newResources;
}

function reconstructMap(map): Tile[][] {
    let newMap = [];
    let numTiles = wade.iso.getNumTiles();

    for(let i = 0; i < numTiles.x; i++) {
        newMap[i] = [];
        for(let j = 0; j < numTiles.z; j++) {
            console.log(map[i][j]);
            newMap[i][j] = new Tile(map[i][j].unitId, map[i][j].buildingId,
                                   map[i][j].resourceId, map[i][j].walkable);
            newMap[i][j].y = map[i][j].y;
            newMap[i][j].x = map[i][j].x;
        }
    }
    return newMap;
}


export default SaveGame;
