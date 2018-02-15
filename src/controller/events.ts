import * as _ from 'lodash';
import Camera from './camera';
import Construction from './construction';
import Hud from './hud';
import ImageMap from './image-map';
import JsonMap from './json-map';
import Mouse from './mouse';

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
                Events.addSelected(unit);
            }
            return true;
        };
    },
    onSelectBuilding: (building, displayFn) => {
        return (event) => {
            // Clear the panels and show the possible units to
            // build.
            Hud.clearBuildingsPanel();
            Hud.clearMainPanel();
            Hud.clearBarracksPanel();
            const unitOptions = displayFn();

            const setOnClickToBuild = (unit) => {
                const imageName = unit.getSprite(0).getImageName();
                unit.onClick = Events.selectAUnitCallback(imageName, unitOptions);
                wade.addEventListener(unit, 'onClick');
            };

            //Show the units to be constructed
            _.forEach(unitOptions, setOnClickToBuild);

            return true;
        };

    },
    addSelected: (selected) => {
        wade.app.selected = selected;
        wade.app.onIsoTerrainMouseDown = (event) => {
            if (event.button === Mouse.left) {
                //Cancel previous destination and send unit to new coordinates
                selected.getBehavior('IsoCharacter').clearDestinations();
                selected.getBehavior('IsoCharacter').setDestination(event.gridCoords);
            } else if (event.button === Mouse.right) {

            }
        };

    },
    removeSelected: () => {
        wade.app.selected = null;

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

export default Events;
