/* newgame.ts
 *
 * This file contains functions for setting up a New Game.
 *
 */

import * as _ from 'lodash';
import Building from '../model/buildings/buildings';
import Resource from '../model/resources/resource';
import AiDec from '../model/state/ai-dec';
import GlobalGameState from '../model/state/global-game-state';
import Unit from '../model/units/units';
import AiGamePlay from './ai-gameplay';
import AudioMap from './audio-map';
import Camera from './camera';
import Construction from './construction';
import Events from './events';
import Fog from './fog';
import { BuildingBuilding, GamePlay, ResourceBuilding, UnitBuilding } from './gameplay';
import Global from './global';
import Hud from './hud';
import ImageMap from './image-map';
import JsonMap from './json-map';
import Minimap from './minimap';
import Mouse from './mouse';
import SceneObjectConstruction from './scene-object-construction';
import UnitDec from './unit-ai';

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

const NewGame = {
    // Initializes a new game
    initialize: async (cameraSpeed: number, aiIsHard: boolean) => {
        playGameMusic();
        wade.setMinScreenSize(20, 20);
        wade.setMaxScreenSize(1280, 800);

        //Set up global settings and sync with scene.
        Global.createGlobalSettings(cameraSpeed, aiIsHard);
        const minimap = Hud.showMinimap(); // minimap must be created before units
                                           // can be created.

        createPlayerStartingUnits();   // units and buildings must be created before
        createAiStartingUnits();       // the rest of the HUD can be created

        // Set up WADE layers to display correctly.
        wade.setLayerSorting(9, 'bottomToTop');
        wade.setLayerTransform(8, 0, 0);
        wade.setLayerTransform(9, 0, 0);
        wade.setLayerTransform(10, 0, 0);
        NewGame.createHud();            // Requires all units/buildings to be created
                                        // Actually it just requires a global game state
                                        // to have been created

        // Once units, buildings, and HUD are created properly,
        // set up the camera for the game.
        NewGame.setUpCamera();

        // Initiate the fog of war.
        Fog.paintMapDarkness();
        GamePlay.refreshPlayerVision();
        GamePlay.refreshAiVisibility();

        // Initiate random generation of resources during the game.
        AiGamePlay.generateRandomResources();

        // Start background thread that checks for when player units enter
        // ai unit vision, and vice versa. This will start conflicts!
        UnitDec.playerUnitsWatch();
        UnitDec.aiUnitsWatch();
        //start AI
        AiDec.decisions(wade.getSceneObject('global').state, aiIsHard);
    },
    setUpCamera: function setUpCamera() {
        //Add basic camera settings
        Events.addCamera();
        Camera.setBounds();

        // Once all the player units are in the scene, position the camera to focus on the
        // Player's VIP.
        wade.app.onCameraMove = (event) => {
            const coords = event.newPosition;
            Minimap.updateCameraZone(coords);
        };
        Camera.focusVIP();
    },
    createHud: function createHud() {
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

            wade.app.onIsoTerrainMouseDown = (event) => {
                wade.app.onIsoTerrainMouseDown = null;
                Hud.clearBuildingsPanel();
                Hud.showMainPanel();
            };

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

function createPlayerStartingUnits() {
    const global = wade.getSceneObject('global');
    global.state = Global.defaultGlobalState();
    addToScene(global.state);
}

function createAiStartingUnits() {
    const numTiles = wade.iso.getNumTiles();
    const corner = Math.floor( Math.random() * 4 );
    let x;
    let z;
    const offset = 7;
    switch (corner) {
        case 0:
            x = numTiles.x - offset;
            z = numTiles.z - offset;
            break;
        case 1:
            x = numTiles.x - offset;
            z = offset;
            break;

        case 2:
            x = offset;
            z = numTiles.z - offset;
            break;

        case 3:
            x = offset;
            z = offset;
            break;

        default:
            console.error(corner + ' is an invalid corner in createAiStartingUnits!');
    }

    const AiVip = AiGamePlay.constructUnit('VIP', x, z);
    const AiTownHall = AiGamePlay.constructBuilding('TownHall', x + 2, z + 3 );
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

                // Once we have the building, we can paint it on the appropriate
                // grid position with the appropriate image
                const b = BuildingBuilding.constructBuildingFromModel(building);
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
                    b.marker = Minimap.createBuildingMarker(b.iso.gridCoords.x, b.iso.gridCoords.z, 'player');
                } else {
                    b.marker = Minimap.createBuildingMarker(b.iso.gridCoords.x, b.iso.gridCoords.z, 'ai');
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
                if (isPlayerUnit) {
                    u.onMouseDown = GamePlay.onSelectUnit(u);
                    wade.addEventListener(u, 'onMouseDown');
                }

                if (isPlayerUnit) {
                    u.marker = Minimap.createUnitMarker(u.iso.gridCoords.x, u.iso.gridCoords.z, 'player');
                } else {
                    u.marker = Minimap.createUnitMarker(u.iso.gridCoords.x, u.iso.gridCoords.z, 'ai');
                }

            }

            if (tile.resourceId >= 0) {
                const resource = _.find(state.getResources(), (r) => {
                    return r.getId() === tile.resourceId;
                });

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

export default NewGame;
