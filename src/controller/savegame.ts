
import * as _ from 'lodash';
import Resource from '../model/resources/resource';
import AiDec from '../model/state/ai-dec';
import AiGameState from '../model/state/ai-game-state';
import GlobalGameState from '../model/state/global-game-state';
import PlayerGameState from '../model/state/player-game-state';
import AiGamePlay from './ai-gameplay';
import Camera from './camera';
import Construction from './construction';
import Events from './events';
import Fog from './fog';
import { BuildingBuilding, GamePlay, ResourceBuilding, UnitBuilding } from './gameplay';
import Global from './global';
import Hud from './hud';
import ImageMap from './image-map';
import JsonMap from './json-map';
import Mouse from './mouse';
import NewGame from './newgame';
import SceneObjectConstruction from './scene-object-construction';
import UnitDec from './unit-ai';

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
import AudioMap from './audio-map';

import Food from '../model/resources/food';
import Stone from '../model/resources/stone';
import Wood from '../model/resources/wood';

import Tile from '../model/map/tile';
import Minimap from './minimap';

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

async function delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
        wade.setTimeout(resolve, milliseconds);
    });
}

// Got some nice callback hell for the gameplay music! Yeeaaaah.
function playGameMusic() {
    wade.playAudio(AudioMap.surreptitious, false, async () => {
        wade.setTimeout(() => {
            wade.playAudio(AudioMap.haunting, false, async () => {
                wade.setTimeout(() => {
                    wade.playAudio(AudioMap.menu_music, false, async () => {
                        wade.setTimeout(() => {
                            wade.playAudio(AudioMap.from_here, false, async () => {
                                wade.playAudio(AudioMap.retribution, false, async () => {
                                    wade.setTimeout(() => {
                                        playGameMusic();
                                    }, 10000);
                                });
                            });

                        }, 30000);
                    });
                }, 30000);
            });
        }, 30000);
    });
}

const SaveGame = {
    initialize: async () => {
        playGameMusic();
        wade.setMinScreenSize(20, 20);
        wade.setMaxScreenSize(1280, 800);

        // Set up the global object to recreate the HUD.
        const global = wade.getSceneObject('global');
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
        GamePlay.refreshAiVisibility();

        AiGamePlay.generateRandomResources();
        // Start background thread that checks for when player units enter
        // ai unit vision, and vice versa. This will start conflicts!
        UnitDec.playerUnitsWatch();
        UnitDec.aiUnitsWatch();

        console.log(global);
        console.log(wade.iso.exportMap() ) ;

        AiDec.decisions(global.state, global.aiIsHard);
    },
};

function resetUnitSpriteSizes() {
    const state = wade.getSceneObject('global').state;
    const units = _.concat(state.getAi().getUnits(), state.getPlayer().getUnits());
    _.forEach(units, (datum) => {
        const unitSceneObject = datum.rep;
        const playerSprite = unitSceneObject.getSprite(1);
        playerSprite.setSize(200, 200);
        unitSceneObject.setSpriteOffset(1, {x: 0, y: 5});
        const enemySprite = unitSceneObject.getSprite(2);
        enemySprite.setSize(750, 750);
        unitSceneObject.setSpriteOffset(2, {x: 0, y: -50});
    });
}

function resetUnitActivity() {
    const state = wade.getSceneObject('global').state;
    const units = _.concat(state.getAi().getUnits(), state.getPlayer().getUnits());
    _.forEach(units, (datum) => {
        const unitSceneObject = datum.rep;
        unitSceneObject.active = false;
        unitSceneObject.shouldPursue = false;
        unitSceneObject.isAttacking = false;
        unitSceneObject.shouldGather = false;
        unitSceneObject.isGathering = false;
        datum.isMoving = false;
    });

}

function setUpPlayerSelectClickEvents() {
    const state = wade.getSceneObject('global').state;
    _.forEach(state.getPlayer().getUnits(), (unit) => {
        const sceneobject = unit.rep;
        sceneobject.onMouseDown = GamePlay.onSelectUnit(sceneobject);
        wade.addEventListener(sceneobject, 'onMouseDown');
    });

    _.forEach(state.getPlayer().getBuildings(), (building) => {
        const sceneobject = building.rep;
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
            throw new Error('Unrecognized building image in setUpPlayerSelectClickEvents');
        }
        sceneobject.onMouseDown = GamePlay.onSelectBuilding(sceneobject, displayFn);
        wade.addEventListener(sceneobject, 'onMouseDown');
    });
}

function setUpIsometricSpriteMinimapMarkers() {
    const state = wade.getSceneObject('global').state;

    // Restore unit markers
    _.forEach(state.getPlayer().getUnits(), (unit) => {
        const sceneobject = unit.rep;
        const coords = sceneobject.iso.gridCoords;
        sceneobject.marker = Minimap.createUnitMarker(coords.x, coords.z, 'player');
    });
    _.forEach(state.getAi().getUnits(), (unit) => {
        const sceneobject = unit.rep;
        const coords = sceneobject.iso.gridCoords;
        sceneobject.marker = Minimap.createUnitMarker(coords.x, coords.z, 'ai');
    });

    // Restore building markers
    _.forEach(state.getPlayer().getBuildings(), (building) => {
        const sceneobject = building.rep;
        const coords = sceneobject.iso.gridCoords;
        sceneobject.marker = Minimap.createBuildingMarker(coords.x, coords.z, 'player');

    });
    _.forEach(state.getAi().getBuildings(), (building) => {
        const sceneobject = building.rep;
        const coords = sceneobject.iso.gridCoords;
        sceneobject.marker = Minimap.createBuildingMarker(coords.x, coords.z, 'ai');

    });

}

function setUpFog() {
    const numTiles = wade.iso.getNumTiles();
    for (let x = 0; x < numTiles.x; x++) {
        for (let z = 0; z < numTiles.z; z++) {
            const sprite = wade.iso.getTransitionSprite(x, z);
            sprite.setLayer(22);
            if (sprite.getImageName() === ImageMap.fog) {
                sprite.discovered = true;
            } else if (sprite.getImageName() === ImageMap.darkness) {
                sprite.discovered = false;
            } else {
                throw new Error('Unexpected transition sprite in map fog!');
            }
        }
    }
}

function syncMiniFogToFog() {
    const miniFog = wade.getSceneObject('global').minimap.fogLayer;
    const numTiles = wade.iso.getNumTiles();

    for (let x = 0; x < numTiles.x; x++ ) {
        for (let z = 0; z < numTiles.z; z++) {
            const sprite = wade.iso.getTransitionSprite(x, z);
            if (sprite.getImageName() === ImageMap.fog) {
                miniFog[x][z].getSprite(0).setVisible(false);
                miniFog[x][z].getSprite(1).setVisible(true);
            } else if (sprite.getImageName() === ImageMap.darkness) {
                miniFog[x][z].getSprite(0).setVisible(true);
                miniFog[x][z].getSprite(1).setVisible(false);
            } else {
                throw new Error('Unexpected transition sprite in map fog!');
            }
        }
    }

}

function setUpIsometricSpriteVisibility() {
    const global = wade.getSceneObject('global');
    const ai = global.state.getAi();

    // Reset Ai Units/Buildings to display their markers
    const aiObjects = _.concat(ai.getUnits(), ai.getBuildings());
    _.forEach(aiObjects, (obj) => {
        obj.rep.getSprite(2).setVisible(true);
    });
}

function relinkDataAndIsometricObjects() {
    // Reinitialize the global game state so that we have access to its functions.
    const global = wade.getSceneObject('global');
    const globalstate: GlobalGameState = global.state;

    const map: Tile[][] = reconstructMap(globalstate.map);
    const resources: Resource[] = reconstructResources(globalstate.resources);
    const player: PlayerGameState = reconstructPlayerGameState(globalstate.player_state);
    const ai: AiGameState = reconstructAiGameState(globalstate.ai_state);

    const newGlobalState = new GlobalGameState(map, resources, player, ai);
    global.state = newGlobalState;
    console.log(newGlobalState);

    // Now step through all scene objects with the data property,
    // and use them to reconnect the isometric SceneObjects with their data
    const sceneObjects = wade.getSceneObjects('data');
    console.log(sceneObjects);

    _.forEach(sceneObjects, (sceneObject) => {
        let data;
        if (_.has(sceneObject.data, 'amount')) {
            // Then the sceneObject represents a Resource
            data = global.state.getResources();

        } else if (_.has(sceneObject.data, 'speed')) {
            // Then the sceneObject represents a Unit
            data = _.concat(global.state.getAi().getUnits(),
                                global.state.getPlayer().getUnits());
        } else {
            // Otherwise the sceneObject must be a building.
            data = _.concat(global.state.getAi().getBuildings(),
                           global.state.getPlayer().getBuildings());
        }
        // Connect the sceneObject to its data!
        for (let i = 0; i < data.length; i++) {
            if (sceneObject.data.id === data[i].id) {
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
    const units: Unit[] = reconstructUnits(ai.units);
    const buildings: Building[] = reconstructBuildings(ai.buildings);

    const newAi = new AiGameState(units, buildings, ai.stone,
                                       ai.wood, ai.food, ai.actionState);

    return newAi;
}

function reconstructPlayerGameState(player): PlayerGameState {
    const units: Unit[] = reconstructUnits(player.units);
    const buildings: Building[] = reconstructBuildings(player.buildings);

    const newPlayer = new PlayerGameState(units, buildings, player.stone,
                                       player.wood, player.food);

    return newPlayer;
}

function reconstructBuildings(buildings): Building[] {
    const newbuildings = [];
    for (let i = 0; i < buildings.length; i++) {
        let newBuilding;
        const oldBuilding = buildings[i];
        if (oldBuilding.name === 'Barracks') {
            newBuilding = new Barracks(oldBuilding.id, oldBuilding.hp, oldBuilding.vision);
        } else if (oldBuilding.name === 'Stables') {
            newBuilding = new Stables(oldBuilding.id, oldBuilding.hp, oldBuilding.vision);

        } else if (oldBuilding.name === 'TownHall') {
            newBuilding = new TownHall(oldBuilding.id, oldBuilding.hp, oldBuilding.vision);

        } else if (oldBuilding.name === 'Tower') {
            newBuilding = new Tower(oldBuilding.id, oldBuilding.hp, oldBuilding.vision);

        } else {
            throw new Error ('Unrecognized building name!');
        }
        newbuildings[i] = newBuilding;
    }
    return newbuildings;
}

function reconstructUnits(units): Unit[] {
    const newunits = [];
    for (let i = 0; i < units.length; i++) {
        let newUnit;
        const oldUnit = units[i];
        if (oldUnit.name === 'ArcherCalvary') {
            newUnit = new ArcherCalvary(oldUnit.id, oldUnit.hp, oldUnit.attack,
                                        oldUnit.defense, oldUnit.speed, oldUnit.range,
                                        oldUnit.vision, oldUnit.gathering);
        } else if (oldUnit.name === 'Archer') {
            newUnit = new Archer(oldUnit.id, oldUnit.hp, oldUnit.attack,
                                        oldUnit.defense, oldUnit.speed, oldUnit.range,
                                        oldUnit.vision, oldUnit.gathering);

        } else if (oldUnit.name === 'DrummerBoy') {
            newUnit = new DrummerBoy(oldUnit.id, oldUnit.hp, oldUnit.attack,
                                        oldUnit.defense, oldUnit.speed, oldUnit.range,
                                        oldUnit.vision, oldUnit.gathering);

        } else if (oldUnit.name === 'Gatherer') {
            newUnit = new Gatherer(oldUnit.id, oldUnit.hp, oldUnit.attack,
                                        oldUnit.defense, oldUnit.speed, oldUnit.range,
                                        oldUnit.vision, oldUnit.gathering);

        } else if (oldUnit.name === 'SpearCalvary') {
            newUnit = new SpearCalvary(oldUnit.id, oldUnit.hp, oldUnit.attack,
                                        oldUnit.defense, oldUnit.speed, oldUnit.range,
                                        oldUnit.vision, oldUnit.gathering);

        } else if (oldUnit.name === 'Swordsman') {
            newUnit = new Swordsman(oldUnit.id, oldUnit.hp, oldUnit.attack,
                                        oldUnit.defense, oldUnit.speed, oldUnit.range,
                                        oldUnit.vision, oldUnit.gathering);

        } else if (oldUnit.name === 'VIP') {
            newUnit = new VIP(oldUnit.id, oldUnit.hp, oldUnit.attack,
                                        oldUnit.defense, oldUnit.speed, oldUnit.range,
                                        oldUnit.vision, oldUnit.gathering);
        } else {
            throw new Error('Unrecognized unit name!');
        }
        newunits[i] = newUnit;
    }

    return newunits;
}

function reconstructResources(resources): Resource[] {
    const newResources = [];

    for (let i = 0; i < resources.length; i++) {
        let newResource;
        const oldResource = resources[i];
        if (oldResource.name === 'Food') {
            newResource = new Food(oldResource.id, oldResource.amount);
        } else if (oldResource.name === 'Wood') {
            newResource = new Wood(oldResource.id, oldResource.amount);
        } else if (oldResource.name === 'Stone') {
            newResource = new Stone(oldResource.id, oldResource.amount);
        } else {
            throw Error('Unexpected resource name!');
        }
        newResources[i] = newResource;
    }
    console.log(newResources);

    return newResources;
}

function reconstructMap(map): Tile[][] {
    const newMap = [];
    const numTiles = wade.iso.getNumTiles();

    for (let i = 0; i < numTiles.x; i++) {
        newMap[i] = [];
        for (let j = 0; j < numTiles.z; j++) {
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
