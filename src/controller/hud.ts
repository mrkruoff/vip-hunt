import * as _ from 'lodash';
import Construction from './construction';
import Events from './events';
import ImageMap from './image-map';
import JsonMap from './json-map';
import Mouse from './mouse';
import Names from './names';
import BuildHud from './build-hud';

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

const Hud = {
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

            //Process each icon to have correct events
            _.forEach(options, (b) => {
                const imageName = b.getSprite(0).getImageName();
                let callback;
                if (imageName === ImageMap.barracks_1) {
                    callback = Hud.buildingConstruction(options,
                        Construction.barracks, JsonMap.barracks_1, Hud.showBarracksPanel);
                } else if (imageName === ImageMap.stables_1) {
                    callback = Hud.buildingConstruction(options,
                        Construction.stables, JsonMap.stables_1, Hud.showBarracksPanel);
                } else if (imageName === ImageMap.towers_1) {
                    callback = Hud.buildingConstruction(options,
                        Construction.towers, JsonMap.towers_1, Hud.showBarracksPanel);
                } else if (imageName === ImageMap.town_halls_1) {
                    callback = Hud.buildingConstruction(options,
                        Construction.townHalls, JsonMap.town_halls_1, Hud.showBarracksPanel);
                }
                b.onClick = callback;
                wade.addEventListener(b, 'onClick');
            });
        };
        wade.addEventListener(building, 'onClick');
    },
    buildingConstruction: (optionsPanel, constructionFn, jsonFile, displayFn) => {
        return function(event) {
            if (event.button === Mouse.left) {
                if (optionsPanel.icon) {
                    //If the building has an icon, delete current one and
                    // replace it with the other
                    wade.iso.deleteObject(optionsPanel.icon);
                    optionsPanel.icon = null;
                }
                optionsPanel.icon = constructionFn(jsonFile);
                Mouse.trackIsoTerrainGridMove(optionsPanel.icon);

                wade.app.onIsoTerrainMouseDown = (e) => {
                    // Add standard click events for the building
                    const building = optionsPanel.icon;
                    building.onMouseDown = (event) => {
                        //Clear the panels and show the building.
                        Hud.clearBuildingsPanel();

                        //Show the units to be constructed
                        const options = displayFn();
                        _.forEach(options, (unit) => {
                            const imageName = unit.getSprite(0).getImageName();
                            let callback;
                            if (imageName === ImageMap.swordsman_1) {
                                callback = Hud.unitConstruction(options, Construction.swordsman, JsonMap.swordsman_1);

                            } else if (imageName === ImageMap.archer_1) {
                                callback = Hud.unitConstruction(options, Construction.archer, JsonMap.archer_1);

                            } else if (imageName === ImageMap.gatherer_1) {
                                callback = Hud.unitConstruction(options, Construction.gatherer, JsonMap.gatherer_1);

                            } else if (imageName === ImageMap.spear_calvary_1) {
                                callback = Hud.unitConstruction(options, Construction.spearCalvary, JsonMap.spear_calvary_1);

                            } else if (imageName === ImageMap.archer_calvary_1) {
                                callback = Hud.unitConstruction(options, Construction.archerCalvary, JsonMap.archer_calvary_1);
                            } else if (imageName === ImageMap.drummer_boy_1) {
                                callback = Hud.unitConstruction(options, Construction.drummerBoy, JsonMap.drummer_boy_1);
                            }
                            unit.onClick = callback;
                            wade.addEventListener(unit, 'onClick');
                        });
                    };
                    wade.addEventListener(building, 'onMouseDown');
                    //Make room to construct another buildiing
                    wade.app.onIsoTerrainMouseMove = null;
                    optionsPanel.icon = null;
                    //Remove this same event listener
                    wade.app.onIsoTerrainMouseDown = null;
                };
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

                wade.app.onIsoTerrainMouseDown = (e) => {
                    const unit = optionsPanel.icon;
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

                    // Set up to construct another unit.
                    wade.app.onIsoTerrainMouseMove = null;
                    optionsPanel.icon = null;
                    //Remove this event listener.
                    wade.app.onIsoTerrainMouseDown = null;
                };

            }

        };
    },
    clearBuildingsPanel: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.buildings) {
            wade.getSceneObject(Names.barracksIcon).setVisible(false);
            wade.getSceneObject(Names.stablesIcon).setVisible(false);
            wade.getSceneObject(Names.towersIcon).setVisible(false);
            wade.getSceneObject(Names.townHallsIcon).setVisible(false);
        }
    },
    clearMainPanel: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.main) {
            wade.getSceneObject(Names.buildingIcon).setVisible(false);
        }
    },
    clearUnitsPanel: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.units) {
            wade.getSceneObject(Names.swordsmanIcon).setVisible(false);
        }

    },
    clearResourcePanel: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.resources) {
            //if the resources have already been constructed, just show them. 
            wade.getSceneObject(Names.stoneIcon).setVisible(false);
            wade.getSceneObject(Names.stoneCount).setVisible(false);
            wade.getSceneObject(Names.woodIcon).setVisible(false);
            wade.getSceneObject(Names.woodCount).setVisible(false);
            wade.getSceneObject(Names.foodIcon).setVisible(false);
            wade.getSceneObject(Names.foodCount).setVisible(false);
        } 

        //If they don't exist, do nothing
    },
    showBackground: () => {
        const global = wade.getSceneObject('global'); 
        if(global.hud.background) {
            wade.getSceneObject(Names.hudBackground).setVisible(true); 
        }
        else {
            global.hud.background = BuildHud.background(10); 
        }
        return global.hud.background;
    },
    showBuildingsPanel: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.buildings) {
            wade.getSceneObject(Names.barracksIcon).setVisible(true);
            wade.getSceneObject(Names.stablesIcon).setVisible(true);
            wade.getSceneObject(Names.towersIcon).setVisible(true);
            wade.getSceneObject(Names.townHallsIcon).setVisible(true);
        }
        else {
            global.hud.buildings = BuildHud.buildingsPanel(9);
        }
        return global.hud.buildings;
    },
    showMainPanel: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.main) {
            wade.getSceneObject(Names.buildingIcon).setVisible(true);
        } else {
            global.hud.main = BuildHud.mainPanel(9); 
        }

        return global.hud.main;
    },
    showBarracksPanel: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.barracks) {
            wade.getSceneObject(Names.swordsmanIcon).setVisible(true);
        } else {
            global.hud.barracks = BuildHud.barracksPanel(9); 
        }

        return global.hud.barracks;
    },
    showResourcePanel: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.resources) {
            //if the resources have already been constructed, just show them. 
            wade.getSceneObject(Names.stoneIcon).setVisible(true);
            wade.getSceneObject(Names.stoneCount).setVisible(true);
            wade.getSceneObject(Names.woodIcon).setVisible(true);
            wade.getSceneObject(Names.woodCount).setVisible(true);
            wade.getSceneObject(Names.foodIcon).setVisible(true);
            wade.getSceneObject(Names.foodCount).setVisible(true);
        } 
        else {
            global.hud.resources = BuildHud.resourcePanel(9); 
        }

        return global.hud.resources;
    }
};


export default Hud;
