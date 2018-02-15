import * as _ from 'lodash';
import Camera from './camera';
import Construction from './construction';
import Hud from './hud';
import ImageMap from './image-map';
import JsonMap from './json-map';
import Mouse from './mouse';
import IIdentifiable from '../interfaces/identifiable';
import Id from './id';
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

const Events = {
    addCamera: () => {
    //Add camera options for mouse and keyboard
        wade.app.onKeyDown = function(event) {
            Camera.keyDown(event);
        };

        wade.app.onKeyUp = function(event) {
            Camera.keyUp(event);
        };

        //Allow player to move around by mouse. Requires constant
        // observation of mouse, which is costly.
        wade.app.onMouseMove = function(event) {
            Camera.mouseMove(event);
        };

        wade.app.onMouseWheel = function(event) {
            if (event.value > 0) {
                Camera.zoomIn();
            } else if (event. value < 0) {
                Camera.zoomOut();
            }
        };
    },
    removeCamera: () => {
        wade.app.onKeyDown = null;
        wade.app.onKeyUp = null;
        wade.app.onMouseMove = null;
        wade.app.onMouseWheel = null;
    },
    onSelectUnit: (unit) => {
        return (event) => {
            Hud.clearBarracksPanel();
            Hud.clearBuildingsPanel();
            Hud.clearMainPanel();

            if (event.button === Mouse.left) {
                if (Events.getSelected()) {
                    // Get rid of current selected unit if it
                    // exists already
                    Events.removeSelected();
                }
                Events.addSelectedUnit(unit);

                //When selecting a unit, stop event propagation
                return true;
            } else if (event.button === Mouse.right) {
            
            
            }
        };
    },
    onSelectBuilding: (building, displayFn) => {
        return (event) => {
            // Clear the panels and show the possible units to
            // build.
            Hud.clearBuildingsPanel();
            Hud.clearMainPanel();
            Hud.clearBarracksPanel();

            if(event.button === Mouse.left) {
                if(Events.getSelected()) {
                    Events.removeSelected(); 
                }
                Events.addSelectedBuilding(building, displayFn);
                // When selecting building, stop event propagation.
                return true;
            }


        };

    },
    addSelectedBuilding: (selected, displayFn) => {
        wade.app.selected = selected;

        //Show the unit options for the selected building
        const unitOptions = displayFn();
        const setOnClickToBuild = (unit) => {
            const imageName = unit.getSprite(0).getImageName();
            unit.onClick = Events.selectAUnitCallback(imageName, unitOptions);
            wade.addEventListener(unit, 'onClick');
        };
        _.forEach(unitOptions, setOnClickToBuild);
    
    },
    addSelectedUnit: (selected) => {
        wade.app.selected = selected;
        wade.app.onIsoTerrainMouseDown = (event) => {
            console.log(event);
            if (event.button === Mouse.right) {
                let x = event.gridCoords.x;
                let z = event.gridCoords.z;
                if(wade.iso.checkCollisionsAtTile(x, z)) {
                    //Right click on occupied tile does nothing unless enemy is there.
                    console.log("collision!");
                    const objects = wade.iso.getObjectsInTile(x, z);
                    let enemy = _.find(objects, (o) => {
                        let global = wade.getSceneObject('global');
                        let id = o.data.getId(); 
                        let hasId = (obj: IIdentifiable) => {
                            return obj.getId() === id; 
                        }

                        //Check id is an enemy unit's or enemy building's id.
                        let enemyBuildings = global.state.getAi().getBuildings();
                        let enemyUnits = global.state.getAi().getUnits();
                        if(_.some(enemyUnits, hasId) || _.some(enemyBuildings, hasId)) {
                            //Found an enemy! 
                            return true; 
                        }
                        //Was not an enemy
                        return false;
                    });

                    if(enemy) {
                        //If an enemy was found, attack it.
                        console.log("Found enemy!");
                        selected.shouldPursue = true;

                        // while pursue flag is true, pursue and attack.
                        attack(selected, enemy);
                        
                        // when hp = 0, set puseu flag to false.
                        // when new command is issued, set pursue flag to false
                    } else {
                        //If no enemy was there, do nothing.
                        console.log("Found friend :)");
                    }
                
                } else {
                    //Right click on empty square moves there.
                    clearPursue(selected);
                    selected.getBehavior('IsoCharacter').clearDestinations();
                    selected.getBehavior('IsoCharacter').setDestination(event.gridCoords);
                }
            } else if (event.button === Mouse.left) {
                //Left click always leads to deselection.
                Events.removeSelected();
            }
        };

    },
    removeSelected: () => {
        wade.app.selected = null;

        //Get rid of global events specific to selected unit
        wade.app.onIsoTerrainMouseDown = null;

    },
    getSelected: () => {
        return wade.app.selected;
    },
    selectABuildingCallback: (imageName: string, options) => {
        let callback;
        if (imageName === ImageMap.barracks_1) {
            callback = buildingConstruction(options, Construction.barracks,
                        JsonMap.barracks_1, JsonMap.barracks_data, Hud.showBarracksPanel);
        } else if (imageName === ImageMap.stables_1) {
            callback = buildingConstruction(options, Construction.stables,
                        JsonMap.stables_1, JsonMap.stables_data, Hud.showBarracksPanel);
        } else if (imageName === ImageMap.towers_1) {
            callback = buildingConstruction(options, Construction.towers,
                        JsonMap.towers_1, JsonMap.tower_data, Hud.showBarracksPanel);
        } else if (imageName === ImageMap.town_halls_1) {
            callback = buildingConstruction(options, Construction.townHalls,
                        JsonMap.town_halls_1, JsonMap.townhall_data, Hud.showBarracksPanel);
        }

        return callback;
    },
    selectAUnitCallback: (imageName: string, options) => {
        let callback;
        if (imageName === ImageMap.swordsman_1) {
            callback = unitConstruction(options, Construction.swordsman,
                                JsonMap.swordsman_1, JsonMap.swordsman_data);

        } else if (imageName === ImageMap.archer_1) {
            callback = unitConstruction(options, Construction.archer,
                                JsonMap.archer_1, JsonMap.archer_data);

        } else if (imageName === ImageMap.gatherer_1) {
            callback = unitConstruction(options, Construction.gatherer,
                                JsonMap.gatherer_1, JsonMap.gatherer_data);

        } else if (imageName === ImageMap.spear_calvary_1) {
            callback = unitConstruction(options, Construction.spearCalvary,
                                JsonMap.spear_calvary_1, JsonMap.spear_calvary_data);

        } else if (imageName === ImageMap.archer_calvary_1) {
            callback = unitConstruction(options, Construction.archerCalvary,
                                JsonMap.archer_calvary_1, JsonMap.archer_calvary_data);
        } else if (imageName === ImageMap.drummer_boy_1) {
            callback = unitConstruction(options, Construction.drummerBoy,
                                JsonMap.drummer_boy_1, JsonMap.drummer_boy_data);
        }

        return callback;
    },

};

const buildingConstruction = (optionsPanel, constructionFn, jsonFile: string, dataFile: string, displayFn) => {
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
            wade.app.onIsoTerrainMouseDown = finalizeBuilding(optionsPanel, displayFn);
        }
    };
};
const unitConstruction = (optionsPanel, constructionFn, jsonFile: string, dataFile: string) => {
    return function(event) {
        if (event.button === Mouse.left) {
            if (optionsPanel.icon) {
                // If the panel has an icon already, delete the current one and
                // replace it with the other.
                wade.iso.deleteObject(optionsPanel.icon);
                optionsPanel.icon = null;
            }
            optionsPanel.icon = constructionFn(jsonFile, dataFile);
            Mouse.trackIsoTerrainGridMove(optionsPanel.icon);

            wade.app.onIsoTerrainMouseDown = finalizeUnit(optionsPanel);
        }
    };
};

function finalizeBuilding( optionsPanel, displayFn ) {
    return (e) => {
        const building = optionsPanel.icon;

        //Make room to construct another buildiing through the options panel
        wade.app.onIsoTerrainMouseMove = null;
        optionsPanel.icon = null;
        //Remove this very event listener
        wade.app.onIsoTerrainMouseDown = null;

        // Set the new building up for gameplay callbacks
        building.onMouseDown = Events.onSelectBuilding(building, displayFn);
        wade.addEventListener(building, 'onMouseDown');
    };
}
function finalizeUnit(optionsPanel) {
    return (e) => {
        const unit = optionsPanel.icon;

        // Set up to construct another unit from the options panel.
        wade.app.onIsoTerrainMouseMove = null;
        optionsPanel.icon = null;
        //Remove this very event listener from the global scope
        wade.app.onIsoTerrainMouseDown = null;

        //Set up the newly constructed unit for gameplay
        unit.onMouseDown = Events.onSelectUnit(unit);
        wade.addEventListener(unit, 'onMouseDown');
    };
}

// Attack function. Atacker will follow target and, having reached the target
// execute an attack
async function attack(attacker, target) {
    attacker.onObjectReached = function doDamage(event) {
        console.log(event); 
        console.log(target.data.hp);

        // Deal damage only in intervals.
        // shouldAttack's value will switch based on the loop below
        if(attacker.shouldAttack) {
            target.data.takeDamage(attacker.data.getAttack());
        }
    };

    let i = 0;
    let attackFreq = 1;
    let time = 250;
    while(attacker.shouldPursue) {
        //Attack will occur every attackFreq * time milliseconds
        i++;
        attacker.shouldAttack = (i % attackFreq) === 0;

        attacker.getBehavior('IsoCharacter').goToObject(target);
        await delay(time); 
        if(target.data.hp <= 0) {
            //Stop pursueing and remove target once it is dead.
            clearPursue(attacker);
            deleteGameObject(target);
        }
    }
}

//Deletes a unit or building from the scene and GlobalGameState.
function deleteGameObject(sceneObject) {
    // Remove data and all references to it from the game state.
    // That means removing it from the arrays and removing it from 
    // the map of Tiles.
    let global = wade.getSceneObject('global');
    
    let id = sceneObject.data.getId();
    const hasId = (obj: IIdentifiable) => {
        return _.isEqual(obj.getId(), id);
    }

    // Remove the unit from its array, whichever one it is.
    let playerUnits = global.state.getPlayer().getUnits();
    let playerBuildings = global.state.getPlayer().getBuildings();
    let aiUnits = global.state.getAi().getUnits();
    let aiBuildings = global.state.getAi().getBuildings();
    if(_.some(playerUnits, hasId)) {
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
    let map = global.state.getMap();
    _.forEach(map, (row) => {
        _.forEach(row, (tile: Tile) => {
            if(_.isEqual(tile.getUnitId(), id)) {
                tile.setUnitId(Tile.EMPTY);
            }
            if(_.isEqual(tile.getBuildingId(), id)) {
                tile.setBuildingId(Tile.EMPTY); 
            }
            if(_.isEqual(tile.getResourceId(), id )) {
                tile.setResourceId(Tile.EMPTY); 
            }
        });
    });

    //Delete the SceneObject itself.
    wade.iso.deleteObject(sceneObject);
    console.log(global.state);
}

function clearPursue(attacker) {
    attacker.shouldPursue = false;
    attacker.onObjectReached = null;
}


//Based on https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html which gives an example of the delay function.
async function delay(milliseconds: number) {
    return new Promise<void>(resolve => {
        setTimeout(resolve, milliseconds); 
    });
}



export default Events;
