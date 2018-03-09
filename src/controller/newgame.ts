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
import { ResourceBuilding, UnitBuilding, BuildingBuilding, GamePlay } from './gameplay';
import Global from './global';
import Hud from './hud';
import ImageMap from './image-map';
import JsonMap from './json-map';
import Mouse from './mouse';
import SceneObjectConstruction from './scene-object-construction';
import AiGamePlay from './ai-gameplay';
import Fog from './fog';
import Minimap from './minimap'
import UnitDec from './unit-ai';
import AiDec from '../model/state/ai-dec';


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

        //Set up global settings and sync with scene.
        Global.createGlobalSettings();
        const minimap = Hud.showMinimap(); // minimap must be created before units 
                                           // can be created.

        createPlayerStartingUnits();   // units and buildings must be created before 
        createAiStartingUnits();       // the rest of the HUD can be created

        createHud();                    // Requires all units/buildings to be created
                                        // Actually it just requires a global game state 
                                        // to have been created

        // Once units, buildings, and HUD are created properly,
        // set up the camera for the game.
        setUpCamera();

        // Initiate the fog of war.
        Fog.paintMapDarkness();
        GamePlay.refreshPlayerVision();
       
        // Initiate random generation of resources during the game.
        AiGamePlay.generateRandomResources(); 

        // Start background thread that checks for when player units enter 
        // ai unit vision, and vice versa. This will start conflicts!
        UnitDec.playerUnitsWatch();
        UnitDec.aiUnitsWatch();
        //start AI
        // AiDec.decisions(GlobalGameState,false);
    },
};

function setUpCamera() {
    //Add basic camera settings
    Events.addCamera();
    Camera.setBounds();

    // Once all the player units are in the scene, position the camera to focus on the 
    // Player's VIP.
    wade.app.onCameraMove = (event) => {
        let coords = event.newPosition;
        Minimap.updateCameraZone(coords);
    }
    Camera.focusVIP();

}

function createPlayerStartingUnits() {
    let global = wade.getSceneObject('global');
    global.state = Global.defaultGlobalState();
    addToScene(global.state);
}



function createAiStartingUnits() {
    let AiVip = AiGamePlay.constructUnit("VIP", 15, 5);
    let AiTownHall = AiGamePlay.constructBuilding("TownHall", 10, 1 );
}


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
                let isPlayer = true;
                let building = _.find(state.getPlayer().getBuildings(), (b) => {
                    return b.id === tile.buildingId;
                });
                if ( !building )  {
                    isPlayer = false;
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

                if (isPlayer) {
                    b.marker = Minimap.createBuildingMarker(b.iso.gridCoords.x, b.iso.gridCoords.z, "player");
                    // Give the building an aura to show it is the player's;
                    let aura = new Sprite( {
                        type: 'Sprite',
                        sortPoint: {x: 0, y: -0.9 },
                        layer: 25,
                        size: {x: 500, y: 400},
                        image: ImageMap.player_unit_marker,
                    }); 
                    aura.setVisible(false);
                    let offset = { x: 0, y: 0};
                    b.addSprite(aura, offset);
                } else {
                    b.marker = Minimap.createBuildingMarker(b.iso.gridCoords.x, b.iso.gridCoords.z, "ai");
                }

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

                    // Give the unit an aura to show it is the player's;
                    let aura = new Sprite( {
                        type: 'Sprite',
                        sortPoint: {x: 0, y: -0.9 },
                        layer: 25,
                        size: {x: 250, y: 200},
                        image: ImageMap.player_unit_marker,
                    }); 
                    aura.setVisible(false);
                    let offset = { x: 0, y: 0};
                    u.addSprite(aura, offset);

                    // Finally, add an animation to play when a unit is hit.
                    let hitSprite = new Sprite();
                    hitSprite.setLayer(24);
                    hitSprite.setSortPoint(0, 1);
                    let animData = {
                        type: 'Animation',
                        name: 'bleed',
                        startFrame: 0, 
                        endFrame: 10,
                        numCells: {x: 10, y: 15 },
                        image: ImageMap.unit_hit_marker,
                        speed: 30,
                        looping: false,
                        offset: {x: 0, y: 0}
                    };
                    let hitAnim = new Animation(animData);
                    hitSprite.addAnimation('bleed', hitAnim, true);
                    u.addSprite(hitSprite);
                }

                if (isPlayerUnit) {
                    u.marker = Minimap.createUnitMarker(u.iso.gridCoords.x, u.iso.gridCoords.z, "player");
                } else {
                    u.marker = Minimap.createUnitMarker(u.iso.gridCoords.x, u.iso.gridCoords.z, "ai");
                }

            }

            if (tile.resourceId >= 0) {
                const resource = _.find(state.getResources(), (r) => {
                    return r.getId() === tile.resourceId;
                });

                console.log(resource);

                // Once we have the resource, we can paint it on the appropriate
                // grid position with the correct image

                const r = ResourceBuilding.constructResourceFromModel(resource);
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

function createHud() {
    // Set up WADE layers to display correctly.
    wade.setLayerSorting(9, 'bottomToTop');
    wade.setLayerTransform(8, 0, 0);
    wade.setLayerTransform(9, 0, 0);
    wade.setLayerTransform(10, 0, 0);

    // Create hud elements.
    const resources = Hud.showResourcePanel();
    const scroll = Hud.showBackground();

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

}

export default NewGame;
