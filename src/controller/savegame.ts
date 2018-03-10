
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

        console.log(wade.getSceneObject('global'));

        // Connect all the isometric objects back to their data representations.
        relinkDataAndIsometricObjects();

        //Add basic camera settings
        Events.addCamera();
        Camera.setBounds();

        // Set up WADE layers to display correctly.
        wade.setLayerSorting(9, 'bottomToTop');
        wade.setLayerTransform(8, 0, 0);
        wade.setLayerTransform(9, 0, 0);
        wade.setLayerTransform(10, 0, 0);
    
        console.log(wade.iso.exportMap() ) ;
    }
};

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

    // Now step through all scene objects with the data property,
    // and use them to reconnect the isometric SceneObjects with their data


}

function reconstructAiGameState(ai): AiGameState {
    let units: Units[] = reconstructUnits(ai.units);
    let buildings: Buildings[] = reconstructBuildings(ai.buildings);

    let newAi = new AiGameState(units, buildings, ai.stone,
                                       ai.wood, ai.food);

    return newAi;
}

function reconstructPlayerGameState(player): PlayerGameState {
    let units: Units[] = reconstructUnits(player.units);
    let buildings: Buildings[] = reconstructBuildings(player.buildings);

    let newPlayer = new PlayerGameState(units, buildings, player.stone,
                                       player.wood, player.food);

    return newPlayer;
}

function reconstructBuildings(buildings): Buildings[] {
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

function reconstructUnits(units): Units[] {
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
