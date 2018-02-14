import * as _ from 'lodash';
import Construction from './construction';
import Events from './events';
import ImageMap from './image-map';
import JsonMap from './json-map';
import Mouse from './mouse';
import Hud from './hud'

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

const NewGame = {
    initialize: () => {
        wade.setLayerTransform(9, 0, 0);
        const resources = Hud.showResourcePanel();

        //Add scroll to background
        const scroll = Hud.showBackground();
        wade.setLayerTransform(10, 0, 0);

        // Add building button for building units.
        // Set up callbacks for building a unit using the underlying menu.
        const building = Hud.showMainPanel();
        building.onClick = function(event) {
            //Make the clicked building disappear
            Hud.clearMainPanel();

            //Show the player new buttons for making buildings on map
            const options = Hud.showBuildingsPanel();

            // Function that takes a buildingIcon and sets its click event
            // to build a matching building in the game world.
            var setOnClickToBuild = (b) => {
                const imageName = b.getSprite(0).getImageName();
                b.onClick = selectABuildingCallback(imageName, options);
                wade.addEventListener(b, 'onClick');
            };

            //Process each icon to have correct events
            _.forEach(options, setOnClickToBuild);
        };
        wade.addEventListener(building, 'onClick');
    },
    buildingConstruction: (optionsPanel, constructionFn, jsonFile, displayFn) => {
        return function(event) {
            if (event.button === Mouse.left) {
                if (optionsPanel.icon) {
                    //If the buildings Panel is constructing already, delete current one and
                    // replace it with the other
                    wade.iso.deleteObject(optionsPanel.icon);
                    optionsPanel.icon = null;
                }
                //Build the indicated building and track it on the map.
                optionsPanel.icon = constructionFn(jsonFile);
                Mouse.trackIsoTerrainGridMove(optionsPanel.icon);

                // When click on map, finalize the building
                wade.app.onIsoTerrainMouseDown = finalizeBuilding(optionsPanel, displayFn);
            }
        };
    },
    unitConstruction: (optionsPanel, constructionFn, jsonFile: string) => {
        return function(event) {
            if (event.button === Mouse.left) {
                if (optionsPanel.icon) {
                    // If the panel has an icon already, delete the current one and
                    // replace it with the other.
                    wade.iso.deleteObject(optionsPanel.icon);
                    optionsPanel.icon = null;
                }
                optionsPanel.icon = constructionFn(jsonFile);
                Mouse.trackIsoTerrainGridMove(optionsPanel.icon);

                wade.app.onIsoTerrainMouseDown = finalizeUnit(optionsPanel);
            }
        };
    },
};

function selectABuildingCallback(imageName: string, options) {
    let callback;
    if (imageName === ImageMap.barracks_1) {
        callback = NewGame.buildingConstruction(options,
            Construction.barracks, JsonMap.barracks_1, Hud.showBarracksPanel);
    } else if (imageName === ImageMap.stables_1) {
        callback = NewGame.buildingConstruction(options,
            Construction.stables, JsonMap.stables_1, Hud.showBarracksPanel);
    } else if (imageName === ImageMap.towers_1) {
        callback = NewGame.buildingConstruction(options,
            Construction.towers, JsonMap.towers_1, Hud.showBarracksPanel);
    } else if (imageName === ImageMap.town_halls_1) {
        callback = NewGame.buildingConstruction(options,
            Construction.townHalls, JsonMap.town_halls_1, Hud.showBarracksPanel);
    }

    return callback;
}

function selectAUnitCallback(imageName: string, options) {
    let callback;
    if (imageName === ImageMap.swordsman_1) {
        callback = NewGame.unitConstruction(options, Construction.swordsman, JsonMap.swordsman_1);

    } else if (imageName === ImageMap.archer_1) {
        callback = NewGame.unitConstruction(options, Construction.archer, JsonMap.archer_1);

    } else if (imageName === ImageMap.gatherer_1) {
        callback = NewGame.unitConstruction(options, Construction.gatherer, JsonMap.gatherer_1);

    } else if (imageName === ImageMap.spear_calvary_1) {
        callback = NewGame.unitConstruction(options, Construction.spearCalvary, JsonMap.spear_calvary_1);

    } else if (imageName === ImageMap.archer_calvary_1) {
        callback = NewGame.unitConstruction(options, Construction.archerCalvary, JsonMap.archer_calvary_1);
    } else if (imageName === ImageMap.drummer_boy_1) {
        callback = NewGame.unitConstruction(options, Construction.drummerBoy, JsonMap.drummer_boy_1);
    }

    return callback;
}

function finalizeBuilding( optionsPanel, displayFn ) {
    return (e) => {
        const building = optionsPanel.icon;

        //Make room to construct another buildiing through the options panel
        wade.app.onIsoTerrainMouseMove = null;
        optionsPanel.icon = null;
        //Remove this very event listener
        wade.app.onIsoTerrainMouseDown = null;

        // Set the new building up for gameplay callbacks
        building.onMouseDown = (event) => {
            // Clear the panels and show the possible units to
            // build.
            Hud.clearBuildingsPanel();
            const unitOptions = displayFn();

            var setOnClickToBuild = (unit) => {
                const imageName = unit.getSprite(0).getImageName();
                unit.onClick = selectAUnitCallback(imageName, unitOptions);
                wade.addEventListener(unit, 'onClick');
            };

            //Show the units to be constructed
            _.forEach(unitOptions, setOnClickToBuild);
        };
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
        unit.onMouseDown = (event) => {
            Hud.clearUnitsPanel();
            Hud.clearBuildingsPanel();
            Hud.showMainPanel();

            // Set up the callbacks for clicking on the icon once it is
            // built, but not before then.
            console.log('Hi, you clicked me!');
            if (event.button === Mouse.left) {
                if (Events.getSelectedUnit()) {
                    // Get rid of current selected unit if it
                    // exists already
                    Events.removeSelectedUnit();
                }
                Events.addSelectedUnit(unit);
            }

        };
        wade.addEventListener(unit, 'onMouseDown');
    }
}

export default NewGame;
