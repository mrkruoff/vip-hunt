/* ai-gameplay.ts
 *
 *
 * the AiGamePlay module implements versions of the gameplay.ts functions
 * for an AI that only has access to the internal state map.
 */

import * as _ from 'lodash';
import { BuildingBuilding, GamePlay, ResourceBuilding, UnitBuilding } from './gameplay';
import Id from './id';

import Barracks from '../model/buildings/barracks_buildings';
import Building from '../model/buildings/buildings';
import Stables from '../model/buildings/stable_buildings';
import Tower from '../model/buildings/tower_buildings';
import TownHall from '../model/buildings/townhall_buildings';
import Tile from '../model/map/tile';
import Food from '../model/resources/food';
import Resource from '../model/resources/resource';
import Stone from '../model/resources/stone';
import Wood from '../model/resources/wood';
import AiGameState from '../model/state/ai-game-state';
import Archer from '../model/units/archer_unit';
import ArcherCalvary from '../model/units/archerCalvary_unit';
import DrummerBoy from '../model/units/drummerBoy_unit';
import Gatherer from '../model/units/gatherer_unit';
import SpearCalvary from '../model/units/spearCalvary_unit';
import Swordsman from '../model/units/swordsman_unit';
import Unit from '../model/units/units';
import VIP from '../model/units/VIP_unit';
import ImageMap from './image-map';
import JsonMap from './json-map';
import Minimap from './minimap';
import Mouse from './mouse';

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any; declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

async function delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
        wade.setTimeout(resolve, milliseconds);
    });
}

const AiGamePlay = {
    generateRandomResources: async () => {
        const resources: Resource[] = wade.getSceneObject('global').state.getResources();
        const map = wade.getSceneObject('global').state.getMap();
        const numTiles = wade.iso.getNumTiles();
        const tiles = numTiles.x * numTiles.z;
        const fraction = 0.025;
        while (true) {
            if (!resources) {
                break;
            }
            // Construct up to 15 new resources.
            let i = 0;
            while (resources.length < Math.floor(fraction * tiles) && i < 15 ) {
                i++;
                const resource_type = Math.floor((Math.random() * 3));

                // Find a random location for the resource
                const numTiles = wade.iso.getNumTiles();
                const x = Math.floor(Math.random() * numTiles.x);
                const z = Math.floor(Math.random() * numTiles.z);

                // If the location has no unit or building, you can build on it.
                const occupied = wade.iso.checkCollisionsAtTile(x, z) ||
                                ( !map[z][x].isEmpty() );
                if ( !occupied) {
                    // Create a resource at or around that location.
                    let resource;
                    if (resource_type === 0) {
                        resource = AiGamePlay.constructResource('Stone', x, z);
                    } else if (resource_type === 1) {
                        resource = AiGamePlay.constructResource('Wood', x, z);
                    } else if (resource_type === 2) {
                        resource = AiGamePlay.constructResource('Food', x, z);
                    } else {
                        console.log('ERROR in generating random resource!');
                    }
                    resource.rep.onMouseDown = GamePlay.onSelectResource(resource.rep);
                    wade.addEventListener(resource.rep, 'onMouseDown');
                }
            }
            await delay(500);
        }

    },
    constructResource: (className: string, x: number, z: number) => {
        const state = wade.getSceneObject('global').state;
        const resources = state.getResources();
        const map: Tile[][] = state.getMap();

        let r: Resource;
        // build the correct Resource model
        if (_.isEqual(className, 'Food')) {
            r = Food.fromObject(wade.getJson(JsonMap.food_data));
        } else if (_.isEqual(className, 'Wood')) {
            r = Wood.fromObject(wade.getJson(JsonMap.wood_data));
        } else if (_.isEqual(className, 'Stone')) {
            r = Stone.fromObject(wade.getJson(JsonMap.stone_data));
        } else {
            console.error('Invalid class name used in constructResource');
        }
        r.id = Id.getId();

        // Put the resource in the resource array.
        resources.push(r);

        const sceneResource = ResourceBuilding.constructResourceFromModel(r);
        sceneResource.oldX = x;
        sceneResource.oldZ = z;

        // Link the data and the resource.
        sceneResource.data = r;
        r.rep = sceneResource;

        // Try to place the building on the Visual Map where indicated.
        let wasMoved = false;
        const sideLength = map[0].length;
        while (!wasMoved) {
            wasMoved = wade.iso.moveObjectToTile(sceneResource, x, z);
            //Randomly shift x and z until it is placed properly.
            const changeX = Math.floor(Math.random() * 2);
            const shouldIncrease = Math.floor(Math.random() * 3); //more likely to increase
            let step = Math.floor(Math.floor(Math.random() * 3)) + 1;
            if (!shouldIncrease) {
                step = -1 * step;
            }
            if (changeX) {
                x = (x + step) % sideLength;
                if (x < 0) {
                    x += sideLength;
                }
            } else {
                z = (z + step) % sideLength;
                if (z < 0) {
                    z += sideLength;
                }
            }
        }

        // Once the resource has been properly placed, update its map location in the state.
        GamePlay.updateResourceMapLocation(sceneResource);

        return r;
    },

    // This function constructs a Building GameObject and returns its
    // data portion to the caller.
    //
    // If the desired tile is already occupied, the function will
    // search for a nearby available tile to construct the building on.
    //
    // parameters:
    //  className: the class of Building to construct.
    //  x: the x-coordinate to construct it on.
    //  z: the z-coordinate to construct it on.
    constructBuilding: (className: string, x: number, z: number) => {
        const state = wade.getSceneObject('global').state;
        const ai: AiGameState = state.getAi();
        const map: Tile[][] = state.getMap();

        let b: Building;

        //Build the correct Building model
        if (_.isEqual(className, 'Barracks')) {
            b = Barracks.fromObject(wade.getJson(JsonMap.barracks_data));
        } else if (_.isEqual(className, 'Stables')) {
            b = Stables.fromObject(wade.getJson(JsonMap.stables_data));
        } else if (_.isEqual(className, 'TownHall')) {
            b = TownHall.fromObject(wade.getJson(JsonMap.townhall_data));
        } else if (_.isEqual(className, 'Tower')) {
            b = Tower.fromObject(wade.getJson(JsonMap.tower_data));
        } else {
            console.error('Invalid class name used in constructBuilding.');
        }
        //Give it an id.
        b.id = Id.getId();

        //Put it on the map and in the AI's state.
        map[z][x].buildingId = b.getId();
        ai.getBuildings().push(b);

        // Use that model to build an associated sprite.
        // IF THIS FAILS IT WAS BECAUSE OF A COLLISION at 0, 0, which is a BUG.
        const sceneBuilding = BuildingBuilding.constructBuildingFromModel(b);
        //Save the location it should be at, in case it changes.
        sceneBuilding.oldX = x;
        sceneBuilding.oldZ = z;

        //Link the two.
        sceneBuilding.data = b;
        b.rep = sceneBuilding;

        // Place the building where it was indicated.
        // IF THIS FAILS IT WAS BECAUSE OF A COLLISION.
        let wasMoved = false;
        const sideLength = map[0].length;
        let occupied = wade.iso.checkCollisionsAtTile(x, z) ||
                        ( !map[z][x].isEmpty() );
        while (!wasMoved || occupied) {
            occupied = wade.iso.checkCollisionsAtTile(x, z) ||
                        ( !map[z][x].isEmpty() );
            wasMoved = wade.iso.moveObjectToTile(sceneBuilding, x, z);
            //Randomly shift x and z until it is placed properly.
            const changeX = Math.floor(Math.random() * 2);
            const shouldIncrease = Math.floor(Math.random() * 3); //more likely to increase
            let step = Math.floor(Math.floor(Math.random() * 3)) + 1;
            if (!shouldIncrease) {
                step = -1 * step;
            }
            if (changeX) {
                x = (x + step) % sideLength;
                if (x < 0) {
                    x += sideLength;
                }
            } else {
                z = (z + step) % sideLength;
                if (z < 0) {
                    z += sideLength;
                }
            }

        }
        sceneBuilding.getSprite(2).setVisible(true);
        // Make sure right-clicking scene building will lead to an attack.
        sceneBuilding.onMouseDown = (event) => {
            const selected = GamePlay.getSelected();
            if (event.button === Mouse.right && selected ) {
                if ( _.has(selected.data, 'speed' )) {
                    GamePlay.clearUnitActions(selected);
                    GamePlay.attack(selected, sceneBuilding);
                    return true;
                }
            }
        };
        wade.addEventListener(sceneBuilding, 'onMouseDown');

        //Once the sprite is properly moved, update its map location in the state.
        // and clear its old tile
        GamePlay.updateBuildingMapLocation(sceneBuilding);
        sceneBuilding.marker = Minimap.createBuildingMarker(sceneBuilding.iso.gridCoords.x,
                                            sceneBuilding.iso.gridCoords.z, 'ai');

        return b;
    },
    // This function moves a unit with the given id as close to the
    // specified target coordinates as possible.
    //
    // parameters:
    //  @ id: the id of an existing AI unit.
    //  @ x: the x-coordinate of the tile to move to.
    //  @ y: the y-coordinate of the tile to move to.
    unitMove: (id: number, x: number, z: number) => {
        const state = wade.getSceneObject('global').state;
        const ai = state.getAi();
        const map = state.getMap();

        let unitData = _.find(ai.getUnits(), (u) => {
            return u.getId() === id;
        });
        if (!unitData) {
            // Then it was a player unit
            unitData = _.find(state.getPlayer().getUnits(), (u) => {
                return u.getId() === id;
            });
        }

        // Stop whatever the unit was currently doing and then go to
        // the new destination
        const unitSceneObject = unitData.rep;
        //Clear previous movement actions
        GamePlay.clearPursue(unitSceneObject);
        GamePlay.clearGather(unitSceneObject);
        GamePlay.clearMove(unitSceneObject);
        unitSceneObject.getBehavior('IsoCharacter').clearDestinations();
        if (wade.iso.checkCollisionsAtTile(x, z)) {
            //If something is there, get as close as possible to it.
            const objects = wade.iso.getObjectsInTile(x, z);
            unitSceneObject.getBehavior('IsoCharacter').goToObject(objects[0]);
            GamePlay.move(unitSceneObject, {x, z});
        } else {
            // If nothing is there, move there directly.
            unitSceneObject.getBehavior('IsoCharacter').setDestination({x, z});
            //Keep track of the movements in the internal game state.
            GamePlay.move(unitSceneObject, {x, z});
        }

    },
    // This function sends the unit with a given id to the resource
    // and gathers from this resource
    unitGather: (gatherId: number, resourceId: number) => {
        const state = wade.getSceneObject('global').state;
        const ai = state.getAi();

        const gatherData = _.find(ai.getUnits(), (u) => {
            return u.getId() === gatherId;
        });
        const resourceData = _.find(state.getResources(), (r) => {
            return r.getId() === resourceId;
        });

        // Stop whatever the unit is doing and send it to gather the resource
        const gatherer = gatherData.rep;
        const resource = resourceData.rep;
        //Clear previous movement actions
        GamePlay.clearPursue(gatherer);
        GamePlay.clearGather(gatherer);
        GamePlay.clearMove(gatherer);

        gatherer.getBehavior('IsoCharacter').clearDestinations();
        gatherer.getBehavior('IsoCharacter').goToObject(resource);
        GamePlay.move(gatherer, resource.iso.gridCoords);

        gatherer.onObjectReached = GamePlay.gather(gatherer, resource, 'Ai');

    },
    // This function sends the unit with the given id to the
    // target and attacks the target WHILE following it.
    unitAttack: (attackId: number, targetId: number) => {

        const state = wade.getSceneObject('global').state;
        const ai = state.getAi();
        const player = state.getPlayer();

        const attackData = _.find(ai.getUnits(), (u) => {
            return u.getId() === attackId;
        });
        let targetData = _.find(player.getUnits(), (u) => {
            return u.getId() === targetId;
        });

        // If target was not a unit, check if it was a building.
        if ( _.isNull(targetData) ) {
            targetData = _.find(player.getBuildings(), (b) => {
                return b.getId() === targetId;
            }) ;
        }

        // Regardless of whether it is a building or unit, pursue
        // and attack it.
        const attacker = attackData.rep;

        const target = targetData.rep;
        //Clear previous movement actions
        attacker.getBehavior('IsoCharacter').clearDestinations();
        GamePlay.clearPursue(attacker);
        GamePlay.clearGather(attacker);
        GamePlay.clearMove(attacker);

        GamePlay.attack(attacker, target);

    },
    playerUnitAttack: (attackId: number, targetId: number) => {
        const state = wade.getSceneObject('global').state;
        const ai = state.getAi();
        const player = state.getPlayer();
        const attackData = _.find(player.getUnits(), (u) => {
            return u.getId() === attackId;
        });
        let targetData = _.find(ai.getUnits(), (u) => {
            return u.getId() === targetId;
        });
        // If target was not a unit, check if it was a building.
        if ( _.isNull(targetData) ) {
            targetData = _.find(ai.getBuildings(), (b) => {
                return b.getId() === targetId;
            }) ;
        }
        // Regardless of whether it is a building or unit, pursue
        // and attack it.
        const attacker = attackData.rep;
        const target = targetData.rep;
        //Clear previous movement actions
        attacker.getBehavior('IsoCharacter').clearDestinations();
        GamePlay.clearPursue(attacker);
        GamePlay.clearGather(attacker);
        GamePlay.clearMove(attacker);

        GamePlay.attack(attacker, target);

    },
    // This function constructs a Unit GameObject and returns its
    // data portion to the caller.
    //
    // If the desired tile is already occupied, the function will
    // search for a nearby available tile to construct the unit on.
    //
    // parameters:
    //  className: the class of Unit to construct.
    //  x: the x-coordinate to construct it on.
    //  z: the z-coordinate to construct it on.
    constructUnit: (className: string, x: number, z: number) => {
        const state = wade.getSceneObject('global').state;
        const ai: AiGameState = state.getAi();
        const map: Tile[][] = state.getMap();

        let u: Unit;

        //Build the correct Unit model
        if (_.isEqual(className, 'Archer')) {
            u = Archer.fromObject(wade.getJson(JsonMap.archer_data));
        } else if (_.isEqual(className, 'ArcherCalvary')) {
            u = ArcherCalvary.fromObject(wade.getJson(JsonMap.archer_calvary_data));
        } else if (_.isEqual(className, 'SpearCalvary')) {
            u = SpearCalvary.fromObject(wade.getJson(JsonMap.spear_calvary_data));
        } else if (_.isEqual(className, 'Swordsman')) {
            u = Swordsman.fromObject(wade.getJson(JsonMap.swordsman_data));
        } else if (_.isEqual(className, 'Gatherer')) {
            u = Gatherer.fromObject(wade.getJson(JsonMap.gatherer_data));
        } else if (_.isEqual(className, 'DrummerBoy')) {
            u = DrummerBoy.fromObject(wade.getJson(JsonMap.drummer_boy_data));
        } else if (_.isEqual(className, 'VIP')) {
            u = VIP.fromObject(wade.getJson(JsonMap.vip_data));
        } else {
            console.error('Incorrect class name in AiGamePlay.constructUnit!');
        }
        //Give it an id.
        u.id = Id.getId();
        //Put it on the map and in the Ai's state.
        map[z][x].unitId = u.getId();
        ai.getUnits().push(u);

        //Use the Unit model to build an associated sprite
        // This may FAIL due to a BUG: collision at 0, 0
        const sceneUnit = UnitBuilding.constructUnitFromModel(u);
        sceneUnit.oldX = x;
        sceneUnit.oldZ = z;

        //Link the data and the representation
        sceneUnit.data = u;
        u.rep = sceneUnit;
        sceneUnit.getBehavior('IsoCharacter').movementSpeed = sceneUnit.data.speed;
        sceneUnit.getBehavior('IsoCharacter').setDirection('s');

        //Place the unit where indicated. IF THIS FAILS IT WAS BECAUSE OF A COLLISION.
        let wasMoved = false;
        const sideLength = map[0].length;
        let occupied = wade.iso.checkCollisionsAtTile(x, z) ||
                        ( !map[z][x].isEmpty() );
        while (!wasMoved || occupied) {
            occupied = wade.iso.checkCollisionsAtTile(x, z) ||
                        ( !map[z][x].isEmpty() );
            wasMoved = wade.iso.moveObjectToTile(sceneUnit, x, z);
            //Randomly shift x and z until it is placed properly.
            const changeX = Math.floor(Math.random() * 2);
            const shouldIncrease = Math.floor(Math.random() * 3); //more likely to increase
            let step = Math.floor(Math.floor(Math.random() * 3)) + 1;
            if (!shouldIncrease) {
                step = -1 * step;
            }
            if (changeX) {
                x = (x + step) % sideLength;
                if (x < 0) {
                    x += sideLength;
                }
            } else {
                z = (z + step) % sideLength;
                if (z < 0) {
                    z += sideLength;
                }
            }
        }
        sceneUnit.getSprite(2).setVisible(true);

        //Once the sprite is properly moved, update its map location in the state.
        // and clear its old tile
        GamePlay.updateUnitMapLocation(sceneUnit);
        sceneUnit.marker = Minimap.createUnitMarker(sceneUnit.iso.gridCoords.x,
                                        sceneUnit.iso.gridCoords.z, 'ai');

        // Make sure right-clicking scene unit will lead to an attack.
        sceneUnit.onMouseDown = (event) => {
            const selected = GamePlay.getSelected();
            if (event.button === Mouse.right && selected ) {
                if ( _.has(selected.data, 'speed')) {
                    GamePlay.clearUnitActions(selected);
                    GamePlay.attack(selected, sceneUnit);
                    return true;
                }
            }
        };
        wade.addEventListener(sceneUnit, 'onMouseDown');

        return u;
    },

};

export default AiGamePlay;
