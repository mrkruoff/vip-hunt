/* newgame.ts
 *
 * This file contains functions for setting up a New Game.
 *
 */

import * as _ from 'lodash';
import Building from '../model/buildings/buildings';
import Resource from '../model/resources/resource';
import GlobalGameState from '../model/state/global-game-state';
import Unit from '../model/units/units';
import Camera from './camera';
import Construction from './construction';
import Events from './events';
import { UnitBuilding, BuildingBuilding, GamePlay } from './gameplay';
import Global from './global';
import Hud from './hud';
import ImageMap from './image-map';
import JsonMap from './json-map';
import Mouse from './mouse';
import SceneObjectConstruction from './scene-object-construction';
import AiGamePlay from './ai-gameplay';
import Fog from './fog';

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

const NewGame = {
    // Initializes a new game
    initialize: async () => {
        wade.setMinScreenSize(20, 20);
        wade.setMaxScreenSize(1280, 800);

        Fog.paintMapFog();

        //Set up global settings and sync with scene.
        const global = Global.createGlobalSettings();
        addToScene(global.state);

        //Add basic camera settings
        Events.addCamera();
        Camera.setBounds();

        //show errors on a fixed layer 8.
        wade.setLayerTransform(8, 0, 0);

        //Show user resources on a fixed Layer 9
        wade.setLayerTransform(9, 0, 0);
        const resources = Hud.showResourcePanel();

        //Add background on a fixed layer 10
        const scroll = Hud.showBackground();
        wade.setLayerTransform(10, 0, 0);

        let AiB = AiGamePlay.constructBuilding("Barracks", 17, 17);
        let AiU = AiGamePlay.constructUnit("Swordsman", 10, 10);
        AiGamePlay.constructUnit("Archer", 13, 11);
        AiGamePlay.constructUnit("Gatherer", 15, 13);
        AiGamePlay.constructUnit("DrummerBoy", 7, 8);
        AiGamePlay.constructUnit("ArcherCalvary", 17, 9);
        AiGamePlay.constructUnit("SpearCalvary", 3, 3);
        console.log(AiU);
        AiU.rep.playAnimation('run', 'forward');
        let AiVip = AiGamePlay.constructUnit("VIP", 15, 5);
        let AiTownHall = AiGamePlay.constructBuilding("TownHall", 10, 1 );
        AiGamePlay.unitMove(AiVip.getId(), 7, 7);

        // Test the attack and the resource functions
        let state = wade.getSceneObject('global').state;
        let playerUnits = state.getPlayer().getUnits();
        let re = state.getResources();
        console.log(playerUnits);
        AiGamePlay.unitGather(AiVip.getId(), re[2].getId() );

        // Add building button for building units.
        // Set up callbacks for building a unit using the underlying menu.
        const main = Hud.showMainPanel();
        main[0].onClick = function(event) {
            //Make the clicked building disappear
            Hud.clearMainPanel();

            //Show the player new buttons for making buildings on map
            const options = Hud.showBuildingsPanel();

            // Function that takes a buildingIcon and sets its click event
            // to build a matching building in the game world.
            const setOnClickToBuild = (b) => {
                const imageName = b.getSprite(0).getImageName();
                b.onClick = BuildingBuilding.selectABuildingCallback(imageName, options);
                wade.addEventListener(b, 'onClick');
            };

            //Process each icon to have correct events
            _.forEach(options, setOnClickToBuild);
        };
        wade.addEventListener(main[0], 'onClick');
    },
};

// This funcion takes a GlobalGameState and attempts to add every Unit, Building,
// and Resource in its map, to the WADE Scene. This should only be used with a
// WADE scene that has an EMPTY map, to avoid collisions.
//
// parameters:
//  @ state: The Global Game State that needs to be added to the WADE map.
function addToScene(state: GlobalGameState) {
    _.forEach(state.map, (row) => {
        _.forEach(row, (tile) => {
            if (tile.buildingId >= 0) {
                let building = _.find(state.getPlayer().getBuildings(), (b) => {
                    return b.id === tile.buildingId;
                });
                if ( !building )  {
                    //Otherwise the building is an ai building
                    building = _.find(state.getAi().getBuildings(), (b) => {
                        return b.id === tile.buildingId;
                    });
                }
                console.log(building);

                // Once we have the building, we can paint it on the appropriate
                // grid position with the appropriate image
                const b = BuildingBuilding.constructBuildingFromModel(building);
                console.log(b);
                b.data = building;
                building.rep = b; // circular reference
                wade.iso.moveObjectToTile(b, tile.x, tile.y);
                GamePlay.updateBuildingMapLocation(b);

                //Then we attach the appropriate callbacks for a constructed building
                let displayFn;
                const c = building.getClassName();
                if (c === 'Barracks') {
                    displayFn = Hud.showBarracksPanel;
                } else if (c === 'Stables') {
                    displayFn = Hud.showStablesPanel;
                } else if (c === 'TownHall') {
                    displayFn = Hud.showTownHallPanel;
                } else if (c === 'Tower') {
                    displayFn = Hud.showTowerPanel;
                }
                b.onMouseDown = GamePlay.onSelectBuilding(b, displayFn);
                wade.addEventListener(b, 'onMouseDown');

            }
            if (tile.unitId >= 0) {
                let isPlayerUnit = true;
                let unit = _.find(state.getPlayer().getUnits(), (u) => {
                    return u.id === tile.unitId;
                });
                if ( !unit )  {
                    //Otherwise the unit is an ai unit
                    unit = _.find(state.getAi().getUnits(), (u) => {
                        return u.id === tile.unitId;
                    });
                    isPlayerUnit = false;
                }

                console.log(unit);

                // Once we have the unit, we can paint it on the appropriate
                // grid position with the appropriate image
                const u = UnitBuilding.constructUnitFromModel(unit);
                u.data = unit;
                unit.rep = u; //circular reference
                u.getBehavior('IsoCharacter').movementSpeed = u.data.speed;
                u.getBehavior('IsoCharacter').setDirection('s');
                wade.iso.moveObjectToTile(u, tile.x, tile.y);
                GamePlay.updateUnitMapLocation(u);

                //Then we attach the appropriate callbacks for a constructed unit.
                // But ONLY if it is a player unit
                if(isPlayerUnit) {
                    u.onMouseDown = GamePlay.onSelectUnit(u);
                    wade.addEventListener(u, 'onMouseDown');
                }

            }

            if (tile.resourceId >= 0) {
                const resource = _.find(state.getResources(), (r) => {
                    return r.getId() === tile.resourceId;
                });

                console.log(resource);

                // Once we have the resource, we can paint it on the appropriate
                // grid position with the correct image

                const r = constructResourceFromModel(resource);
                r.data = resource;
                resource.rep = r; //circular reference
                wade.iso.moveObjectToTile(r, tile.x, tile.y);
                GamePlay.updateResourceMapLocation(r);

                //Then we attach the appropriate callbacks for a constructed resource
                r.onMouseDown = GamePlay.onSelectResource(r);
                wade.addEventListener(r, 'onMouseDown');

            }

        });
    });

}

function constructResourceFromModel(resource: Resource) {
    let r;
    console.log('Constructing resource');

    if (resource.getClassName() === 'Stone') {
        r = SceneObjectConstruction.stone(JsonMap.stone);
    } else if (resource.getClassName() === 'Wood') {
        r = SceneObjectConstruction.wood(JsonMap.wood);
    } else if (resource.getClassName() === 'Food') {
        r = SceneObjectConstruction.food(JsonMap.food);
    } else {
        console.log('Error in constructResourceFromModel') ;
    }

    return r;
}



export default NewGame;
