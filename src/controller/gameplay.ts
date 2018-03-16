/* gameplay.ts
 *
 * These modules provide functionality and callbacks
 * directly related to gameplay, like for building, selecting,
 * and moving units.
 */

import * as _ from 'lodash';
import IIdentifiable from '../interfaces/identifiable';
import Building from '../model/buildings/buildings';
import Tile from '../model/map/tile';
import Resource from '../model/resources/resource';
import AiGameState from '../model/state/ai-game-state';
import GlobalGameState from '../model/state/global-game-state';
import PlayerGameState from '../model/state/player-game-state';
import Unit from '../model/units/units';
import AudioMap from './audio-map';
import Construction from './construction';
import Events from './events';
import Fog from './fog';
import Hud from './hud';
import Id from './id';
import ImageMap from './image-map';
import JsonMap from './json-map';
import Minimap from './minimap';
import Mouse from './mouse';
import SceneObjectConstruction from './scene-object-construction';

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

// This function sets up an asynchronouse delay that allows for
// delayed while loops
//Based on https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html which gives an example of the delay function.
async function delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
        wade.setTimeout(resolve, milliseconds);
    });
}

const GamePlay = {
    // This function removes the global selected unit
    // from the game and any events associated with it.
    removeSelected: () => {
        const selectedSprite = wade.app.selected.getSprite(1);
        if (selectedSprite && selectedSprite.isVisible()) {
            selectedSprite.setVisible(false);
        }
        wade.app.selected = null;

        //Get rid of global events specific to selected unit
        wade.app.onIsoTerrainMouseDown = null;

    },
    // This function returns the global selected unit, or null
    // if it does not exit.
    getSelected: () => {
        return wade.app.selected;
    },
    // This function sets up the gameplay for
    // a selected building: showing the units it can build,
    // and the click events it can handle
    // Parameters:
    //  @selected: the building SceneObject that is to be selected.
    //  @displayFn: a function that shows the unit options for the building
    //      AND returns an array of SceneObjects representing those unit options.
    addSelectedBuilding: (selected, displayFn) => {
        wade.app.selected = selected;
        selected.getSprite(1).setVisible(true);

        Hud.showBuildingData(selected);

        // Show the unit options for the selected building,
        // and set up the click event for each.
        const unitOptions = displayFn();
        const setOnClickToBuild = (unit) => {
            const imageName = unit.getSprite(0).getImageName();
            unit.onClick = UnitBuilding.selectAUnitCallback(imageName, unitOptions);
            wade.addEventListener(unit, 'onClick');
        };
        _.forEach(unitOptions, setOnClickToBuild);

        // If empty terrain is clicked, deselect the building.
        wade.app.onIsoTerrainMouseDown = (event) => {
            Hud.showMainPanel();
            Hud.clearBuildingData();
            Hud.clearBarracksPanel();
            Hud.clearStablesPanel();
            Hud.clearTowerPanel();
            Hud.clearTownHallPanel();
            GamePlay.removeSelected();
        };
    },
    addSelectedResource: (selected) => {
        wade.app.selected = selected;

        wade.app.onIsoTerrainMouseDown = (event) => {
            //Clicking on any old unoccupied IsoTerrain leads to
            // deselection.
            Hud.clearResourceData();
            Hud.showMainPanel();

            if (GamePlay.getSelected()) {
                GamePlay.removeSelected();
            }
            wade.app.onIsoTerrainMouseDown = null;
        };

        //However, you do get to display the stats of the resource
        Hud.showResourceData(selected);

    },
    // This function sets up the gameplay for a selected unit:
    // showing its stats and setting up the click events it can handle.
    // Parameters:
    //  @selected: the unit SceneObject to be selected
    addSelectedUnit: (selected) => {
        wade.app.selected = selected;
        selected.getSprite(1).setVisible(true);

        Hud.showUnitData(selected);

        wade.app.onIsoTerrainMouseDown = (event) => {
            // Right-click indicates move or attack
            if (event.button === Mouse.right) {
                const x = event.gridCoords.x;
                const z = event.gridCoords.z;
                //Right click on occupied tile does nothing unless enemy is there.
                if (wade.iso.checkCollisionsAtTile(x, z)) {
                    const objects = wade.iso.getObjectsInTile(x, z);
                    const enemy = _.find(objects, (o) => {
                        const global = wade.getSceneObject('global');
                        const id = o.data.getId();
                        const hasId = (obj: IIdentifiable) => {
                            return obj.getId() === id;
                        };

                        //Check id is an enemy unit's or enemy building's id.
                        const enemyBuildings = global.state.getAi().getBuildings();
                        const enemyUnits = global.state.getAi().getUnits();
                        if (_.some(enemyUnits, hasId) || _.some(enemyBuildings, hasId)) {
                            //Found an enemy!
                            return true;
                        }
                        //Was not an enemy
                        return false;
                    });

                    if (enemy) {
                        //If an enemy was found, attack it.
                        // Clear any previous movements
                        GamePlay.clearPursue(selected);
                        GamePlay.clearGather(selected);

                        // while pursue flag is true, pursue and attack.
                        GamePlay.attack(selected, enemy);

                    } else {
                        //Check if the collision was due to a resource
                        const resource = _.find(objects, (o) => {
                            const global = wade.getSceneObject('global');
                            const id = o.data.getId();
                            const hasId = (obj: IIdentifiable) => {
                                return obj.getId() === id;
                            };

                            //Check if id is a resource
                            const resources = global.state.getResources();
                            if (_.some(resources, hasId)) {
                                return true;
                            }

                            return false;
                        });

                        if (resource) {
                            //If resource was found, go try to gather it.
                            // Clear any previous movements
                            GamePlay.clearPursue(selected);
                            GamePlay.clearGather(selected);

                            selected.getBehavior('IsoCharacter').goToObject(resource);
                            if (GamePlay.distance(selected, resource) < 2 ) {
                                GamePlay.gather(selected, resource, 'Player')(null);
                            } else  {
                                GamePlay.move(selected, resource.iso.gridCoords);
                                selected.onObjectReached = GamePlay.gather(selected, resource, 'Player');
                            }

                        } else {
                            // If no resource (and no enemy building) was there, deselect unit
                            // Unit will continue whatever it was doing, however.
                            GamePlay.removeSelected();
                            Hud.showMainPanel();
                            wade.app.onIsoTerrainMouseMove = null;
                        }
                    }
                //Right click on empty square moves there.
                } else {
                    GamePlay.clearPursue(selected); // stop pursuing enemy
                    GamePlay.clearGather(selected); // stop gathering
                    selected.getBehavior('IsoCharacter').clearDestinations();
                    selected.getBehavior('IsoCharacter').setDestination(event.gridCoords);
                    GamePlay.move(selected, event.gridCoords);
                }
            } else if (event.button === Mouse.left) {
                //Left click always leads to deselection and return
                // to main menu
                Hud.clearUnitData();
                GamePlay.removeSelected();
                Hud.showMainPanel();
                wade.app.onIsoTerrainMouseDown = null;
            }

            return true; //don't propagate
        };
    },
    clearGather: (unit) => {
        //Remove all drivers of gathering behavior.
        unit.shouldGather = false;
        unit.onObjectReached = null;
    },
    clearMove: (unit) => {
        unit.data.isMoving = false;
    },
    // This function tracks an object while it is moving and updates
    // its location on the internal state map with the location on the
    // Visual Map.
    //
    // parameters:
    //  @ unit: The unit SceneObject that is moving
    async move(unit, targetCoords) {
        //Once the move is complete, there is no more reason to
        // keep tracking the location.
        unit.data.isMoving = true;
        const fogLayer = wade.getSceneObject('global').minimap.fogLayer;

        function distanceBetween(sceneObject, coords) {
            const sceneCoords = sceneObject.iso.gridCoords;
            const dx = sceneCoords.x - coords.x;
            const dz = sceneCoords.z - coords.z;
            const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dz, 2));

            return d;
        }
        unit.onMoveComplete = function stopMoving(event) {
            // End the movement when the distance is 0
            if (distanceBetween(unit, targetCoords) < 1) {
                unit.data.isMoving = false;
                const position = fogLayer[unit.iso.gridCoords.x][unit.iso.gridCoords.z].getPosition();
                unit.marker.setPosition(position.x, position.y);
            }

        };
        unit.data.isMoving = true;

        const time = 250;
        while (unit.data.isMoving) {
            await delay(time);

            // Update map location.
            GamePlay.updateUnitMapLocation(unit);
            const position = fogLayer[unit.iso.gridCoords.x][unit.iso.gridCoords.z].getPosition();
            unit.marker.setPosition(position.x, position.y);
        }
    },
    // This function returns a callback function that sets up
    // what happens when a unit is selected (clicked)
    //
    // parameters:
    //  @unit: a unit SceneObject that desires to be selectable.
    onSelectUnit: (unit) => {
        return (event) => {
            Hud.clearBarracksPanel();
            Hud.clearTowerPanel();
            Hud.clearTownHallPanel();
            Hud.clearStablesPanel();
            Hud.clearBuildingsPanel();
            Hud.clearMainPanel();
            Hud.clearResourceData();

            if (event.button === Mouse.left) {
                if (GamePlay.getSelected()) {
                    // Get rid of current selected unit if it
                    // exists already
                    GamePlay.removeSelected();
                }
                GamePlay.addSelectedUnit(unit);

                //When selecting a unit, stop event propagation
                return true;
            } else if (event.button === Mouse.right) {
                // Should anything be done on right-clicking a unit
                // when nothing is selected?
            }
        };
    },
    // This function returns a callback function that sets up
    // what happens when a building is selected (clicked)
    //
    // parameters:
    //  @buildiing: a building SceneObject that desires to be selectable.
    //  @displayFn: a function that displays the units that the building can build
    //          and returns an array of SceneObjects representing those units, so
    //          click events can be set up on them.
    onSelectBuilding: (building, displayFn) => {
        return (event) => {
            // Clear the panels and show the possible units to
            // build.
            Hud.clearBuildingsPanel();
            Hud.clearStablesPanel();
            Hud.clearMainPanel();
            Hud.clearBarracksPanel();
            Hud.clearTowerPanel();
            Hud.clearTownHallPanel();
            Hud.clearResourceData();

            // Left-mouse click counts as selecting the building.
            if (event.button === Mouse.left) {
                if (GamePlay.getSelected()) {
                    GamePlay.removeSelected();
                }
                // Set up callbacks for the new selected building.
                GamePlay.addSelectedBuilding(building, displayFn);

                // When selecting building, stop event propagation.
                return true;
            }
        };
    },
    onSelectResource: (resource) => {
        return (event) => {
            const selected = GamePlay.getSelected();

            if (event.button === Mouse.left) {
                Hud.clearBuildingsPanel();
                Hud.clearMainPanel();
                Hud.clearBarracksPanel();
                Hud.clearTowerPanel();
                Hud.clearTownHallPanel();
                Hud.clearStablesPanel();
                if (GamePlay.getSelected()) {
                    GamePlay.removeSelected();
                }
                // Set up callbacks for the newly selected resource.
                GamePlay.addSelectedResource(resource);

                return true;
            } else if (event.button === Mouse.right && selected ) {
                if ( _.has(selected.data, 'speed' )) {
                    GamePlay.clearUnitActions(selected);
                    selected.getBehavior('IsoCharacter').goToObject(resource);
                    if (GamePlay.distance(selected, resource) < 2 ) {
                        GamePlay.gather(selected, resource, 'Player')(null);
                    } else  {
                        GamePlay.move(selected, resource.iso.gridCoords);
                        selected.onObjectReached = GamePlay.gather(selected, resource, 'Player');
                    }
                    return true;
                }
            }
        };
    },
    // This function takes the costs described in a JSON costs file
    // and subtracts them from the resources of the PlayerGameState.
    //
    // parameters:
    //  @ costsFile: a JSON file that contains an object with 3 numeric properties:
    //      'stone', 'food', and 'wood'.
    applyCostsToPlayer: (costsFile: string) => {
        const cost = wade.getJson(costsFile);
        const player = wade.getSceneObject('global').state.getPlayer();
        if (_.has(cost, 'stone')) {
            player.stone -= cost.stone;
        }
        if (_.has(cost, 'wood')) {
            player.wood -= cost.wood;
        }
        if (_.has(cost, 'food')) {
            player.food -= cost.food;
        }
    },
    // This function tells the attacking SceneObject to follow the target
    // SceneObject and do damage to it until the target's hp is <= 0
    //
    // parameters:
    //  @ attacker: attacking unit SceneObject that contains state in its
    //      'data' property.
    //  @ target: target unit or building SceneObject that contains state in its
    //      'data' property.
    async attack(attacker, target) {
        const fogLayer = wade.getSceneObject('global').minimap.fogLayer;
        const targetData = target.data;
        attacker.isAttacking = false;

        // Set the callback: when the attacker reaches the target, do damage.
        const doDamage = function(event) {
            // Deal damage only in intervals.
            // shouldAttack's value will switch based on the loop below
            if (attacker.shouldAttack && target && targetData) {
                attacker.isAttacking = true;
                const anim = attacker.getSprite(0).getCurrentAnimationName();
                const direction = anim.substr(anim.lastIndexOf('_') + 1);
                attacker.onAnimationEnd = (data) => {
                    if (target.getSprite(3) ) {
                        target.getSprite(3).setVisible(false);
                    }

                    attacker.isAttacking = false;
                    attacker.onAnimationEnd = null;
                    const dir = GamePlay.directionToTarget(attacker, target);
                    attacker.getBehavior('IsoCharacter').setDirection(dir);
                };
                wade.addEventListener(attacker, 'onAnimationEnd');
                attacker.playAnimation('Attack_iso_' + direction, 'forward');
                targetData.takeDamage(attacker.data.getAttack());
                if (target.getSprite(3)) {
                    target.getSprite(3).setVisible(true);
                    target.playAnimation('bleed', 'forward');
                }

                // If the attacked unit is also the player's selected unit, update its
                // display of health
                if (targetData.rep === GamePlay.getSelected() ) {
                    let display;
                    if (_.has(targetData, 'speed')) {
                        display = Hud.showUnitData;
                    } else {
                        display = Hud.showBuildingData;
                    }
                    display(targetData.rep);
                }
            }
        };
        attacker.onObjectReached = doDamage;

        let i = 0; // iteration number
        const attackFreq = 7;
        const time = 250;
        await delay(time);  //initial delay to allow old attack to expire properly
        attacker.shouldPursue = true;
        while (target && attacker.shouldPursue) {
            //Attack will occur every attackFreq * time milliseconds
            attacker.shouldAttack = (i % attackFreq) === 0;
            i++;

            // use attacker.data.range + 1 because the map is square, so
            // diagonal distances are technically longer.
            if (GamePlay.distance(attacker, target) >= attacker.data.range + 1 ) {
                attacker.getBehavior('IsoCharacter').goToObject(target);
            } else if (target && !attacker.isAttacking) {
                // If the target is in range, face the target and damage it.
                const dir = GamePlay.directionToTarget(attacker, target);
                attacker.getBehavior('IsoCharacter').clearDestinations();
                attacker.getBehavior('IsoCharacter').setDirection(dir);
                doDamage(null);
            } else {
                //If we got here, something went wrong.
                await delay(1000);
                attacker.isAttacking = false;
            }
            await delay(time);

            // Calculate whether the attacker should continue pursuing the target
            // If the target is not in a clear square on the map, then clearly
            //      the player cannot see the target, so it should stop chasing.
            //      This case does not apply at all to when the attacker is an
            //      AI unit.
            // ELSE if the target is not within the attacker's vision range, the
            // attacker should stop attacking.
            const targetCoords = target.iso.gridCoords;
            const fogged = wade.iso.getTransitionSprite(targetCoords.x, targetCoords.z).isVisible();
            if ( fogged ) {
                GamePlay.clearUnitActions(attacker);
            } else if ( GamePlay.distance(attacker, target) > attacker.data.vision) {
                GamePlay.clearUnitActions(attacker);
            }

            //Stop pursuing and remove target once it is dead.
            if (targetData.hp <= 0) {
                attacker.isAttacking = false;
                attacker.shouldAttack = false;
                attacker.onObjectReached = null;
                GamePlay.clearPursue(attacker);
                GamePlay.clearUnitActions(target);

                const anim = target.getSprite(0).getCurrentAnimationName();
                const direction = anim.substr(anim.lastIndexOf('_') + 1);
                target.onAnimationEnd = (data) => {
                    //Once the animation is over, delete the object
                    if (_.isEqual(target.data.getClassName(), 'VIP') ) {
                        GamePlay.gameOver(target.data.getId());
                    } else {
                        GamePlay.deleteGameObject(target);
                    }
                };
                wade.addEventListener(target, 'onAnimationEnd');
                target.playAnimation('Death_iso_' + direction);
                attacker.getBehavior('IsoCharacter').setDirection('s');
            }

            // Update the attacking unit's location.
            GamePlay.updateUnitMapLocation(attacker);
            const position = fogLayer[attacker.iso.gridCoords.x][attacker.iso.gridCoords.z].getPosition();
            attacker.marker.setPosition(position.x, position.y);
        }
    },
    gameOver: async (id: number) => {
        const global = wade.getSceneObject('global');
        const state: GlobalGameState = global.state;
        const ai: AiGameState = state.getAi();
        const player: PlayerGameState = state.getPlayer();

        global.isRunning = false;
        await delay(1000);

        if ( _.some(ai.getUnits(), (unit) => {
            return _.isEqual(unit.getId(), id);
        })  ) {
            Hud.showWinPanel();
        } else {
            Hud.showLossPanel();
        }
        wade.pauseSimulation();
        Events.disableAllEvents();
    },
    directionToTarget: (attacker, target) => {
        const hyp = GamePlay.distance(attacker, target);
        const adj = target.iso.gridCoords.x - attacker.iso.gridCoords.x;
        const dz = target.iso.gridCoords.z - attacker.iso.gridCoords.z;

        let theta = ( Math.acos(adj / hyp) );
        if (dz < 0 )  {
            theta = (2 * Math.PI - theta);
        }
        if ( theta <= (Math.PI / 8) || theta >= (15 * Math.PI / 8)  ) {
            return 'ne';
        } else if (theta <= (3 * Math.PI) / 8 ) {
            return 'n';
        } else if (theta <= (5 * Math.PI / 8) ) {
            return 'nw';
        } else if (theta <= ( 7 * Math.PI / 8) ) {
            return 'w';
        } else if (theta <= (9 * Math.PI / 8) ) {
            return 'sw';
        } else if (theta <= (11 * Math.PI / 8) ) {
            return 's';
        } else if (theta <= (13 * Math.PI / 8 ) ) {
            return 'se';
        } else {
            return 'e';
        }
    },
    distance: (sceneObject1, sceneObject2) => {
        //Since both are isometric scene objects, both parameters have
        // a SceneObject.iso.gridCoords property
        const dx = sceneObject1.iso.gridCoords.x - sceneObject2.iso.gridCoords.x;
        const dz = sceneObject1.iso.gridCoords.z - sceneObject2.iso.gridCoords.z;
        const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dz, 2));

        return d;

    },
    gather(gatherer, target, owner: string) {
        return async function(event) {
            const time = 1000;
            const targetData = target.data;
            gatherer.shouldGather = true;
            gatherer.isGathering = false;
            while (gatherer.shouldGather) {
                // If the gatherer isn't currently in the middle
                // of gathering, start gathering resources
                if (! gatherer.isGathering) {
                    targetData.takeGather(gatherer.data.getGather());

                    // If the target is currently also selected, update the resource
                    // panel.
                    if (targetData.rep === GamePlay.getSelected() ) {
                        Hud.showResourceData(targetData.rep);
                    }
                    if (_.isEqual(owner, 'Player') ) {
                        GamePlay.applyGatherToPlayer(gatherer.data.getGather(),
                                                    targetData.getClassName());
                        Hud.updateResourcePanel();
                    } else {
                        GamePlay.applyGatherToAi(gatherer.data.getGather(),
                                                    targetData.getClassName());
                    }
                    gatherer.isGathering = true;
                    const anim = gatherer.getSprite(0).getCurrentAnimationName();
                    const dir = anim.substr(anim.lastIndexOf('_') + 1);
                    gatherer.onAnimationEnd = (data) => {
                        gatherer.isGathering = false;
                        gatherer.onAnimationEnd = null;
                        gatherer.getBehavior('IsoCharacter').setDirection(dir);
                    };
                    wade.addEventListener(gatherer, 'onAnimationEnd');
                    gatherer.playAnimation('Attack_iso_' + dir, 'forward');
                }

                await delay(time); // wait a bit before gathering again.

                if (targetData.amount <= 0) {
                    //Stop the gathering behavior
                    GamePlay.clearUnitActions(gatherer);
                    GamePlay.clearGather(gatherer);
                    GamePlay.deleteGameObject(target);
                    gatherer.getBehavior('IsoCharacter').setDirection('s');
                }

            }
        };
    },
    applyGatherToPlayer: (gather: number, resource: string) => {
        const player = wade.getSceneObject('global').state.getPlayer();
        if (resource === 'Stone') {
            player.stone += gather;
        } else if (resource === 'Wood') {
            player.wood += gather;
        } else if (resource === 'Food') {
            player.food += gather;
        } else {
            console.error('applyGatherToPlayer error!');
        }

    },
    applyGatherToAi: (gather: number, resource: string) => {
        const ai = wade.getSceneObject('global').state.getAi();
        if (resource === 'Stone') {
            ai.stone += gather;
        } else if (resource === 'Wood') {
            ai.wood += gather;
        } else if (resource === 'Food') {
            ai.food += gather;
        } else {
            console.error('applyGatherToAi error!');
        }
    },
    // This function removes the attacking status from
    // a SceneObject
    //
    // parameters:
    //  @attacker: unit SceneObject that will be neutered.
    clearPursue: (attacker) => {
        attacker.shouldPursue = false;  // no more pursuing!
        attacker.onObjectReached = null; // no more damage dealing!
    },
    // This function takes a SceneObject with a 'data' property and
    // removes the 'data' from the global state and the SceneObject itself
    // from the scene.
    //
    // parameters:
    //  @ sceneObject: the sceneObject to be deleted (without memory leaks please)
    deleteGameObject: (sceneObject) => {
        try {
            // Remove data and all references to it from the game state.
            // That means removing it from the arrays and removing it from
            // the map of Tiles.
            const global = wade.getSceneObject('global');

            const id = sceneObject.data.getId();
            const hasId = (obj: IIdentifiable) => {
                return _.isEqual(obj.getId(), id);
            };

            // Remove the unit from its array, whichever one it is.
            const playerUnits = global.state.getPlayer().getUnits();
            const playerBuildings = global.state.getPlayer().getBuildings();
            const aiUnits = global.state.getAi().getUnits();
            const aiBuildings = global.state.getAi().getBuildings();
            if (_.some(playerUnits, hasId)) {
                _.remove(playerUnits, hasId);
            } else if (_.some(playerBuildings, hasId )) {
                _.remove(playerBuildings, hasId);
            } else if (_.some(aiUnits, hasId)) {
                _.remove(aiUnits, hasId);
            } else if (_.some(aiBuildings, hasId)) {
                _.remove(aiBuildings, hasId);
            }

            // Remove the unit from the data map, whichever tile it now is at, since
            // this can't be guaranteed to be accurate to the visual map all the time.
            const map = global.state.getMap();
            _.forEach(map, (row) => {
                _.forEach(row, (tile: Tile) => {
                    if (_.isEqual(tile.getUnitId(), id)) {
                        tile.setUnitId(Tile.EMPTY);
                    }
                    if (_.isEqual(tile.getBuildingId(), id)) {
                        tile.setBuildingId(Tile.EMPTY);
                    }
                    if (_.isEqual(tile.getResourceId(), id )) {
                        tile.setResourceId(Tile.EMPTY);
                    }
                });
            });

            // Eliminate the 'data' property, and then
            // remove the minimap marker and delete the SceneObject itself.
            sceneObject.data.isMoving = false; // end the moving cycle
            delete sceneObject.data;
            if (sceneObject === GamePlay.getSelected() ) {
                GamePlay.removeSelected();
                Hud.showMainPanel();
            }
            if (_.has(sceneObject, 'marker') ) {
                wade.removeSceneObject(sceneObject.marker);
            }
            wade.iso.deleteObject(sceneObject);
        } catch (error) {
            //Do nothing if there's an error. It probably isn't fatal
            console.error(error);
        }
    },
    // This function takes a unit sceneObject and uses its location on the Visual
    // Map to update its location in the State map.
    //
    // parameters:
    //  @ sceneObject: a unit SceneObject whose location will update the
    //         state map's understanding of where it is.
    updateUnitMapLocation: (sceneObject) => {
        const map = wade.getSceneObject('global').state.getMap();

        //Clear old location if it exists
        if (_.has(sceneObject, 'oldZ') && _.has(sceneObject, 'oldY') ) {
            map[sceneObject.oldZ][sceneObject.oldX].unitId = Tile.EMPTY;
        }

        // Update new location
        map[sceneObject.iso.gridCoords.z][sceneObject.iso.gridCoords.x].unitId = sceneObject.data.getId();
        sceneObject.oldZ = sceneObject.iso.gridCoords.z;
        sceneObject.oldX = sceneObject.iso.gridCoords.x;

    },
    // This function takes a building SceneObject and uses its location on the
    // Visual Map to update its location in the internal State Map.
    //
    // parameters:
    //  @ sceneObject: a building SceneObject whose location will update the
    //      state map's understanding of where it is.
    updateBuildingMapLocation: (sceneObject) => {
        const map = wade.getSceneObject('global').state.getMap();

        //Clear old location if it exists
        if (_.has(sceneObject, 'oldZ') && _.has(sceneObject, 'oldY') ) {
            map[sceneObject.oldZ][sceneObject.oldX].buildingId = Tile.EMPTY;
        }

        //update new location.
        map[sceneObject.iso.gridCoords.z][sceneObject.iso.gridCoords.x].buildingId = sceneObject.data.getId();
    },
    updateResourceMapLocation: (sceneObject) => {
        const map = wade.getSceneObject('global').state.getMap();

        //Clear old location if it exists
        if (_.has(sceneObject, 'oldZ') && _.has(sceneObject, 'oldY') ) {
            map[sceneObject.oldZ][sceneObject.oldX].resourceId = Tile.EMPTY;
        }

        //update new location.
        map[sceneObject.iso.gridCoords.z][sceneObject.iso.gridCoords.x].resourceId = sceneObject.data.getId();
    },
    enoughPlayerResources: (costsFile: string): boolean => {
        const player: PlayerGameState = wade.getSceneObject('global').state.getPlayer();

        //Check that each resource in the costs file is greater than the player's actual cost.
        const costs = wade.getJson(costsFile);
        let enough = true;
        if (_.has(costs, 'stone')) {
            enough = (player.stone >= costs.stone) && enough;
        }
        if (_.has(costs, 'wood')) {
            enough = (player.wood >= costs.wood) && enough;
        }
        if (_.has(costs, 'food')) {
            enough = (player.food >= costs.food) && enough;
        }

        return enough;
    },
    clearUnitActions: (unitSceneObject) => {
        GamePlay.clearPursue(unitSceneObject);
        GamePlay.clearGather(unitSceneObject);
        GamePlay.clearMove(unitSceneObject);
        unitSceneObject.getBehavior('IsoCharacter').clearDestinations();
    },
    refreshAiVisibility: async () => {
        const global = wade.getSceneObject('global');
        const ai = global.state.getAi();
        while (global.isRunning) {
            _.forEach(ai.getUnits(), (u) => {
                const unit = u.rep;
                // Check if location is fogged or not. If it is, hide the unit
                const fog = wade.iso.getTransitionSprite(unit.iso.gridCoords.x, unit.iso.gridCoords.z);
                if (fog.isVisible() ) {
                    unit.getSprite(0).setVisible(false);
                    unit.getSprite(1).setVisible(false);
                    unit.getSprite(2).setVisible(false);
                    unit.getSprite(3).setVisible(false);
                    unit.marker.setVisible(false);
                } else {
                    unit.getSprite(0).setVisible(true);
                    unit.getSprite(2).setVisible(true);
                    unit.marker.setVisible(true);
                }
            });

            await delay(750);
        }

    },
    refreshPlayerVision: async () => {
        const global = wade.getSceneObject('global');
        const player = global.state.getPlayer();
        const aiUnitReps = [];
        let playerCollection = [];
        const worker_1 = new Worker('../js/vision.js');
        const worker_2 = new Worker('../js/vision.js');
        const worker_3 = new Worker('../js/vision.js');
        let worker_1_isReady = true;
        let worker_2_isReady = true;
        let worker_3_isReady = true;

        const processVision = function(e) {
            // Paint fog and cleared tiles
            if (e.data.id == 1) {
                worker_1_isReady = true;
            }
            if (e.data.id == 2) {
                worker_2_isReady = true;
            }
            if (e.data.id == 3) {
                worker_3_isReady = true;
            }
            const paintFog = e.data.fog;
            const paintClear = e.data.clear;
            _.forEach(paintFog, (coord) => {
                Fog.setFogVisibility(coord.x, coord.z, true);
            });
            _.forEach(paintClear, (coord) => {
                Fog.setFogVisibility(coord.x, coord.z, false);
            });

            // Use these calculations to update the minimap
            // since we don't want to have to repeat these calculations.
            Minimap.refreshPlayerVision(e.data);
        };

        worker_1.onmessage = processVision;
        worker_2.onmessage = processVision;
        worker_3.onmessage = processVision;
        const numTiles = wade.iso.getNumTiles();

        while (global && global.isRunning) {
            playerCollection = _.concat(player.getUnits(), player.getBuildings() );
            const dataCollection = _.map(playerCollection, (data) => {
                return {
                    coords: data.rep.iso.gridCoords,
                    vision: data.vision,
                };
            });

            const visionData = {
                spotlightArray: dataCollection,
                mapBounds: {
                    minX: 0,
                    maxX: numTiles.x,
                    minZ: 0,
                    maxZ: numTiles.z,
                },
                id: 1,
            };
            if (worker_1_isReady) {
                worker_1.postMessage(visionData);
                worker_1_isReady = false;
            } else if (worker_2_isReady) {
                visionData.id = 2;
                worker_2.postMessage(visionData);
                worker_2_isReady = false;
            } else if (worker_3_isReady) {
                visionData.id = 3;
                worker_3.postMessage(visionData);
                worker_3_isReady = false;
            }

            await delay(1000);
        }
    },
};

const BuildingBuilding = {
    // This function uses the name of an image to select the correct
    // SceneObject Building to create.
    //
    // parameters:
    //  @ imageName: a string representing the name of the image.
    //  @ options: a dummy object to store the temp SceneObject while it
    //      it is being constructed.
    selectABuildingCallback: (imageName: string, options) => {
        let callback;
        if (imageName === ImageMap.barracks_1) {
            callback = BuildingBuilding.buildingConstruction(options, Construction.barracks,
                        JsonMap.barracks_1, JsonMap.barracks_data, JsonMap.barracks_cost, Hud.showBarracksPanel);
        } else if (imageName === ImageMap.stables_1) {
            callback = BuildingBuilding.buildingConstruction(options, Construction.stables,
                        JsonMap.stables_1, JsonMap.stables_data, JsonMap.stables_cost, Hud.showStablesPanel);
        } else if (imageName === ImageMap.towers_1) {
            callback = BuildingBuilding.buildingConstruction(options, Construction.towers,
                        JsonMap.towers_1, JsonMap.tower_data, JsonMap.tower_cost, Hud.showTowerPanel);
        } else if (imageName === ImageMap.town_halls_1) {
            callback = BuildingBuilding.buildingConstruction(options, Construction.townHalls,
                        JsonMap.town_halls_1, JsonMap.townhall_data, JsonMap.townhall_cost, Hud.showTownHallPanel);
        }

        return callback;
    },
    // This function returns a callback that, when called, carries out the
    // construction process for a building. This includes having the building icon
    // track the mouse while over the map.
    //
    // paramters:
    //  @ optionsPanel: dummy variable to store the temp SceneObject while it is being
    //      constructed.
    //  @ constructionFn: A function that returns the correct SceneObject to be
    //      constructed.
    //  @ jsonFile: file containing details for what image and settings should be
    //      used to construct the SceneObject.
    //  @ dataFile: file containing details for constructing the internal Building object
    //      contained in the 'data' property of the SceneObject.
    //  @ costsFile: file containing the cost of constructing this SceneObject.
    //  @ displayFn: function that will return an array of SceneObjects representing
    //      the units that this Building can build.
    buildingConstruction: (optionsPanel, constructionFn, jsonFile: string, dataFile: string, costsFile: string, displayFn) => {
        return function(event) {
            if (event.button === Mouse.left) {
                if (optionsPanel.icon) {
                    //If the buildings Panel is constructing already, delete current one and
                    // replace it with the other
                    wade.iso.deleteObject(optionsPanel.icon);
                    optionsPanel.icon = null;
                }
                //Build the indicated building and track it on the map.
                optionsPanel.icon = constructionFn(jsonFile, dataFile);
                Mouse.trackIsoTerrainGridMove(optionsPanel.icon);

                // When click on map, finalize the building
                wade.app.onIsoTerrainMouseDown = BuildingBuilding.finalizeBuilding(optionsPanel, costsFile, displayFn);
            }
        };
    },
    // This function returns a callback that will set a newly constructed building
    // up for gameplay. This newly constructed building is contained withing the
    // optionsPanel parameter.
    //
    // parameters:
    //  @ optionsPanel: dummy variable to store the constructed building.
    //  @ costsFile: file containing costs of constructing the building.
    //  @ displayFn: function that returns an array of SceneObjects that
    //          represent the units this Building can build.
    finalizeBuilding: ( optionsPanel, costsFile, displayFn ) => {
        return (e) => {
            const building = optionsPanel.icon;

            //Make room to construct another buildiing through the options panel
            wade.app.onIsoTerrainMouseMove = null;
            optionsPanel.icon = null;
            //Remove this very event listener
            wade.app.onIsoTerrainMouseDown = (event) => {
                Hud.showMainPanel();
                Hud.clearBuildingsPanel();
            };

            if ( GamePlay.enoughPlayerResources(costsFile)) {
                // Set the new building up for gameplay callbacks
                building.onMouseDown = GamePlay.onSelectBuilding(building, displayFn);
                wade.addEventListener(building, 'onMouseDown');

                // apply the cost of the building to the state.
                GamePlay.applyCostsToPlayer(costsFile);
                Hud.updateResourcePanel();

                //Add the building's state to the game state (i.e., the map and Player);
                building.data.id = Id.getId();
                wade.getSceneObject('global').state.getPlayer().getBuildings().push(building.data);
                GamePlay.updateBuildingMapLocation(building);

                building.marker = Minimap.createBuildingMarker(building.iso.gridCoords.x,
                                            building.iso.gridCoords.z, 'player');

                const music_id = wade.playAudio(AudioMap.building_construction_sound, false);
                wade.setTimeout( () => {
                    wade.stopAudio(music_id);
                }, 2000);
            } else {
                // Remove the building from existence and display an error message to player
                building.data.rep = null; // remove circular reference
                delete building.data;
                wade.iso.deleteObject(building); //remove object from game

                Hud.showResourceError();
            }
        };
    },
    // This function takes a Building and returns the correct
    // SceneObject for that Building.
    constructBuildingFromModel: (building: Building) => {
        let b;
        if (building.getClassName() === 'Barracks') {
            b = SceneObjectConstruction.barracks(JsonMap.barracks_1);
        } else if (building.getClassName() === 'Stables') {
            b = SceneObjectConstruction.stables(JsonMap.stables_1);
        } else if (building.getClassName() === 'TownHall') {
            b = SceneObjectConstruction.townHalls(JsonMap.town_halls_1);
        } else if (building.getClassName() === 'Tower') {
            b = SceneObjectConstruction.towers(JsonMap.towers_1);
        }
        return b;
    },

};

const UnitBuilding = {
    // This function takes the name of an image, and based on that name,
    // returns a callback that, when clicked, will build the correct unit.
    //
    // parameters:
    //  @ imageName: a string representing the unit to build.
    //  @ options: an array of SceneObjects representing all the
    //      possible units that ocould be built.
    selectAUnitCallback: (imageName: string, options) => {
        let callback;
        if (imageName === ImageMap.sword) {
            callback = UnitBuilding.unitConstruction(options, Construction.swordsman,
                                JsonMap.swordsman_1, JsonMap.swordsman_data, JsonMap.swordsman_cost);

        } else if (imageName === ImageMap.bow2) {
            callback = UnitBuilding.unitConstruction(options, Construction.archer,
                                JsonMap.archer_1, JsonMap.archer_data, JsonMap.archer_cost);

        } else if (imageName === ImageMap.fist) {
            callback = UnitBuilding.unitConstruction(options, Construction.gatherer,
                                JsonMap.gatherer_1, JsonMap.gatherer_data, JsonMap.gatherer_cost);

        } else if (imageName === ImageMap.axe) {
            callback = UnitBuilding.unitConstruction(options, Construction.spearCalvary,
                                JsonMap.spear_calvary_1, JsonMap.spear_calvary_data, JsonMap.spear_calvary_cost);

        } else if (imageName === ImageMap.bow) {
            callback = UnitBuilding.unitConstruction(options, Construction.archerCalvary,
                                JsonMap.archer_calvary_1, JsonMap.archer_calvary_data, JsonMap.archer_calvary_cost);
        } else if (imageName === ImageMap.hammer) {
            callback = UnitBuilding.unitConstruction(options, Construction.drummerBoy,
                                JsonMap.drummer_boy_1, JsonMap.drummer_boy_data, JsonMap.drummer_boy_cost);
        }

        return callback;
    },
    // This function returns a callback tha carries out the process of unit construction.
    //
    // parameters:
    //  @ optionsPanel: an array of SceneObjects representing the options available to
    //      build.
    //  @ constructionFn: A function that returns the SceneObject of the desired unit,
    //      and builds it on the map.
    //  @ jsonFile: the file to details about how to build the SceneObject.
    //  @ dataFile: the file to get details about the SceneObject's unit 'data'
    //  @ costsFile: the file to get how much the new Unit will cost.
    unitConstruction: (optionsPanel, constructionFn, jsonFile: string, dataFile: string, costsFile: string) => {
        return function(event) {
            if (event.button === Mouse.left) {
                if (optionsPanel.icon) {
                    // If the panel has an icon already, delete the current one and
                    // replace it with the other.
                    wade.iso.deleteObject(optionsPanel.icon);
                    optionsPanel.icon = null;
                }
                optionsPanel.icon = constructionFn(jsonFile, dataFile);
                optionsPanel.icon.getBehavior('IsoCharacter').setDirection('s');

                //Make the icon track the mouse when the mouse is over the map
                Mouse.trackIsoTerrainGridMove(optionsPanel.icon);

                // When the mouse is clicked on the map, add the SceneObject to the
                // game.
                wade.app.onIsoTerrainMouseDown = UnitBuilding.finalizeUnit(optionsPanel, costsFile);
            }
        };
    },

    // This function returns a callback that sets up the newly constructed unit
    // in the game, by adding it to the game state map and giving it the proper
    // callbacks for gameply. It also sets the game up to build another unit.
    //
    // parameters:
    //  @ optionsPanel: an array of SceneObjects representing possible units to build.
    //  @ costsFile: a JSON file containing the costs of the Unit.
    finalizeUnit: (optionsPanel, costsFile: string) => {
        return (e) => {
            const unit = optionsPanel.icon;

            // Set up to construct another unit from the options panel.
            wade.app.onIsoTerrainMouseMove = null; //stop tracking the mouse
            optionsPanel.icon = null;

            //Remove this very event listener from the global scope
            wade.app.onIsoTerrainMouseDown = (event) => {
                Hud.clearStablesPanel();
                Hud.clearTowerPanel();
                Hud.clearTownHallPanel();
                Hud.clearBarracksPanel();
                Hud.clearBuildingData();
                Hud.showMainPanel();
                if (GamePlay.getSelected() ) {
                    GamePlay.removeSelected();
                }
            };

            if (GamePlay.enoughPlayerResources(costsFile) ) {
                //Set up the newly constructed unit for gameplay
                unit.onMouseDown = GamePlay.onSelectUnit(unit);
                wade.addEventListener(unit, 'onMouseDown');

                //apply the cost of the unit to the state.
                GamePlay.applyCostsToPlayer(costsFile);
                Hud.updateResourcePanel();

                //Add the unit's state to the game state.
                unit.data.id = Id.getId();
                wade.getSceneObject('global').state.getPlayer().getUnits().push(unit.data);

                //Add the unit's location to the game state map and the minimap.
                GamePlay.updateUnitMapLocation(unit);
                unit.marker = Minimap.createUnitMarker(unit.iso.gridCoords.x,
                                                unit.iso.gridCoords.z, 'player');

                const music_id = wade.playAudio(AudioMap.unit_construction_sound, false);
                wade.setTimeout(() => {
                    wade.stopAudio(music_id);
                }, 1500);
            } else {
                // Remove the unit from the game.

                //Get rid of circular reference and then delete the SceneObject
                unit.data.rep = null;
                delete unit.data;
                wade.iso.deleteObject(unit);

                // Show the player an error.
                Hud.showResourceError();
            }
        };
    },
    // This function takes a Unit and returns the correct
    // SceneObject for that Unit
    constructUnitFromModel: (unit: Unit) => {
        let u;
        if (unit.getClassName() === 'VIP') {
            u = SceneObjectConstruction.vip(JsonMap.vip_1);
        } else if (unit.getClassName() === 'Archer') {
            u = SceneObjectConstruction.archer(JsonMap.archer_1);
        } else if (unit.getClassName() === 'Swordsman') {
            u = SceneObjectConstruction.swordsman(JsonMap.swordsman_1);
        } else if (unit.getClassName() === 'Gatherer') {
            u = SceneObjectConstruction.gatherer(JsonMap.gatherer_1);
        } else if (unit.getClassName() === 'DrummerBoy') {
            u = SceneObjectConstruction.drummerBoy(JsonMap.drummer_boy_1);
        } else if (unit.getClassName() === 'SpearCalvary') {
            u = SceneObjectConstruction.spearCalvary(JsonMap.spear_calvary_1);
        } else if (unit.getClassName() === 'ArcherCalvary') {
            u = SceneObjectConstruction.archerCalvary(JsonMap.archer_calvary_1);
        }
        return u;
    },
};

const ResourceBuilding = {

    constructResourceFromModel: (resource: Resource) => {
        let r;

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
    },

};

export { GamePlay, UnitBuilding, BuildingBuilding, ResourceBuilding };
