/* ai-gameplay.ts
 *
 *
 * the AiGamePlay module implements versions of the gameplay.ts functions 
 * for an AI that only has access to the internal state map.
 */


import { GamePlay, BuildingBuilding, UnitBuilding } from './gameplay';
import Id from './id';
import * as _ from 'lodash';

import Barracks from '../model/buildings/barracks_buildings';
import Building from '../model/buildings/buildings';
import Stables from '../model/buildings/stable_buildings';
import Tower from '../model/buildings/tower_buildings';
import TownHall from '../model/buildings/townhall_buildings';
import JsonMap from './json-map';
import Tile from '../model/map/tile';
import AiGameState from '../model/state/ai-game-state';
import Archer from '../model/units/archer_unit';
import ArcherCalvary from '../model/units/archerCalvary_unit';
import DrummerBoy from '../model/units/drummerBoy_unit';
import Gatherer from '../model/units/gatherer_unit';
import SpearCalvary from '../model/units/spearCalvary_unit';
import Swordsman from '../model/units/swordsman_unit';
import Unit from '../model/units/units';
import VIP from '../model/units/VIP_unit';

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

var AiGamePlay = {
    constructBuilding: (className: string, x: number, z: number) => {
        let state = wade.getSceneObject('global').state;
        let ai: AiGameState = state.getAi();
        let map: Array<Tile[]> = state.getMap();

        let b: Building;

        //Build the correct Building model
        if(_.isEqual(className, "Barracks")) {
            b = Barracks.fromObject(wade.getJson(JsonMap.barracks_data));
        } else if (_.isEqual(className, "Stables")) {
            b = Stables.fromObject(wade.getJson(JsonMap.stables_data));
        } else if (_.isEqual(className, "TownHall")) {
            b = TownHall.fromObject(wade.getJson(JsonMap.townhall_data));
        } else if (_.isEqual(className, "Tower")) {
            b = Tower.fromObject(wade.getJson(JsonMap.tower_data));
        } else {
            console.error("Invalid class name used in constructBuilding."); 
        }
        //Give it an id.
        b.id = Id.getId();

        //Put it on the map and in the AI's state.
        map[z][x].buildingId = b.getId();
        ai.getBuildings().push(b);

        // Use that model to build an associated sprite. 
        // IF THIS FAILS IT WAS BECAUSE OF A COLLISION at 0, 0, which is a BUG.
        let sceneBuilding = BuildingBuilding.constructBuildingFromModel(b);
        //Save the location it should be at, in case it changes.
        sceneBuilding.oldX = x;
        sceneBuilding.oldZ = z;

        //Link the two.
        sceneBuilding.data = b;
        b.rep = sceneBuilding;

        // Place the building where it was indicated.
        // IF THIS FAILS IT WAS BECAUSE OF A COLLISION.
        let wasMoved = false;
        let sideLength = map[0].length;
        while(!wasMoved) {  
            //Randomly shift x and z until it is placed properly.
            let changeX = Math.floor(Math.random() * 2);
            let shouldIncrease = Math.floor(Math.random() * 3); //more likely to increase
            let step = Math.floor(Math.floor(Math.random() * 3)) + 1;
            if(!shouldIncrease) {
                step = -1 * step; 
            }
            if(changeX) {
                x = (x + step) % sideLength; 
                if(x < 0) { 
                    x += sideLength; 
                }
            } else {
                z = (z + step) % sideLength; 
                if(z < 0) {
                    z += sideLength; 
                }
            }

            wasMoved = wade.iso.moveObjectToTile(sceneBuilding, x, z);
        }
        //Once the sprite is properly moved, update its map location in the state.
        // and clear its old tile
        GamePlay.updateResourceMapLocation(sceneBuilding);

        return b;
    },
    unitMove: (id: number, x:number, z: number) => {
        console.log(id);
        let state = wade.getSceneObject('global').state;
        let ai = state.getAi();
        let map = state.getMap();

        console.log(ai.getUnits());
        let unitData = _.find(ai.getUnits(), (u) => {
            return u.getId() === id; 
        });

        let unitSceneObject = unitData.rep;
        unitSceneObject.getBehavior('IsoCharacter').clearDestinations();
        if(wade.iso.checkCollisionsAtTile(x, z)) {
            //If something is there, get as close as possible to it.
            const objects = wade.iso.getObjectsInTile(x, z);
            unitSceneObject.getBehavior('IsoCharacter').goToObject(objects[0]);
        } else {
            // If nothing is there, move ther directly. 
            unitSceneObject.getBehavior('IsoCharacter').setDestination({x: x, z: z});
        }
        //Keep track of the movements in the internal game state.
        GamePlay.move(unitSceneObject);
    
    },
    constructUnit: (className: string, x: number, z: number) => {
        let state = wade.getSceneObject('global').state; 
        let ai: AiGameState = state.getAi();
        let map: Array<Tile[]> = state.getMap();

        let u: Unit;

        //Build the correct Unit model
        if(_.isEqual(className, "Archer")) {
            u = Archer.fromObject(wade.getJson(JsonMap.archer_data)); 
        } else if (_.isEqual(className, "ArcherCalvary")) {
            u = ArcherCalvary.fromObject(wade.getJson(JsonMap.archer_calvary_data)); 
        } else if (_.isEqual(className, "SpearCalvary")) {
            u = SpearCalvary.fromObject(wade.getJson(JsonMap.spear_calvary_data)); 
        } else if (_.isEqual(className, "Swordsman")) {
            u = Swordsman.fromObject(wade.getJson(JsonMap.swordsman_data)); 
        } else if (_.isEqual(className, "Gatherer")) {
            u = Gatherer.fromObject(wade.getJson(JsonMap.gatherer_data)); 
        } else if (_.isEqual(className, "DrummerBoy")) {
            u = DrummerBoy.fromObject(wade.getJson(JsonMap.drummer_boy_data)); 
        } else if (_.isEqual(className, "VIP")) {
            u = VIP.fromObject(wade.getJson(JsonMap.vip_data)); 
        }
        else {
            console.error("Incorrect class name in AiGamePlay.constructUnit!"); 
        }
        //Give it an id.
        u.id = Id.getId();
        //Put it on the map and in the Ai's state.
        map[z][x].unitId = u.getId();
        ai.getUnits().push(u);

        //Use the Unit model to build an associated sprite
        // This may FAIL due to a BUG: collision at 0, 0
        let sceneUnit = UnitBuilding.constructUnitFromModel(u);
        sceneUnit.oldX = x;
        sceneUnit.oldZ = z;

        //Link the data and the representation
        sceneUnit.data = u;
        u.rep = sceneUnit;
        
        //Place the unit where indicated. IF THIS FAILS IT WAS BECAUSE OF A COLLISION.
        let wasMoved = false;
        let sideLength = map[0].length;
        while(!wasMoved) {  
            //Randomly shift x and z until it is placed properly.
            let changeX = Math.floor(Math.random() * 2);
            let shouldIncrease = Math.floor(Math.random() * 3); //more likely to increase
            let step = Math.floor(Math.floor(Math.random() * 3)) + 1;
            if(!shouldIncrease) {
                step = -1 * step; 
            }
            if(changeX) {
                x = (x + step) % sideLength; 
                if(x < 0) { 
                    x += sideLength; 
                }
            } else {
                z = (z + step) % sideLength; 
                if(z < 0) {
                    z += sideLength; 
                }
            }

            wasMoved = wade.iso.moveObjectToTile(sceneUnit, x, z);
        }
        
        //Once the sprite is properly moved, update its map location in the state.
        // and clear its old tile
        GamePlay.updateUnitMapLocation(sceneUnit);

        console.log(u);

        return u;
    }


}




export default AiGamePlay;
