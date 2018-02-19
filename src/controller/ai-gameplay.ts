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

        //Put it on the map.
        map[z][x].buildingId = b.getId();

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
    },
    moveUnit: (id: number, x:number, y: number) => {
    
    
    },
    constructUnit: (className: string, x: number, y: number) => {
    
    }


}




export default AiGamePlay;
