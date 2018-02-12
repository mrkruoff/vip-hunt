import * as _ from 'lodash';
import Construction from './construction';
import Events from './events';
import ImageMap from './image-map';
import JsonMap from './json-map';
import Mouse from './mouse';
import Names from './names';

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

        //Add scroll to background
        const scroll = Hud.displayScroll(10);

        //Add building button
        const building = Hud.displayBuilding(9);

        building.onClick = function(event) {
            //Make the clicked building disappear
            Hud.clearMainPanel();

            //Show the player new buttons for making buildings on map
            const options = Hud.displayBuildingOptions(9);

            //Process each icon to have correct events
            _.forEach(options, (b) => {
                const imageName = b.getSprite(0).getImageName();
                let callback;
                if (imageName === ImageMap.barracks_1) {
                    callback = Hud.buildingConstruction(options,
                        Construction.barracks, JsonMap.barracks_1, displayBarracksOptions);
                } else if (imageName === ImageMap.stables_1) {
                    callback = Hud.buildingConstruction(options,
                        Construction.stables, JsonMap.stables_1, displayBarracksOptions);
                } else if (imageName === ImageMap.towers_1) {
                    callback = Hud.buildingConstruction(options,
                        Construction.towers, JsonMap.towers_1, displayBarracksOptions);
                } else if (imageName === ImageMap.town_halls_1) {
                    callback = Hud.buildingConstruction(options,
                        Construction.townHalls, JsonMap.town_halls_1, displayBarracksOptions);
                }
                b.onClick = callback;
                wade.addEventListener(b, 'onClick');

            });

        };
        wade.addEventListener(building, 'onClick');
    },
    displayScroll: (layer: number) => {
        const scrollSprite = new Sprite(ImageMap.scroll, layer);
        scrollSprite.setSize(350, 5000);

        //Add scroll to scene
        const scroll = new SceneObject(scrollSprite);
        scroll.setPosition(0, 400);
        scroll.setRotation(1.5708);
        wade.addSceneObject(scroll);
        scroll.setName(Names.hudBackground);
        wade.setLayerTransform(layer, 0, 0);
        return scroll;
    },
    displayBuilding: (layer: number) => {
        const buildingSprite = new Sprite(ImageMap.buildingIcon, layer);
        buildingSprite.setSize(50, 50);

        //Add building icon to screen.
        const building = new SceneObject(buildingSprite);
        building.setPosition((-1 * wade.getScreenWidth() / 2) + 100, (wade.getScreenHeight() / 2) - 100);
        wade.addSceneObject(building);
        building.setName(Names.buildingIcon);
        wade.setLayerTransform(layer, 0, 0);

        return building;
    },

    // Returns an array of SceneObjects, added to the
    // scene, the show the options the player has for building.
    displayBuildingOptions: (layer: number) => {
        const buttonWidth = 50;
        const buttonHeight = 50;

        let x = (-1 * wade.getScreenWidth() / 2) + 100;
        let y = (wade.getScreenHeight() / 2) - 100;
        const barracks = Button.build(ImageMap.barracks_1, buttonWidth, buttonHeight,
                x, y, layer);
        barracks.setName(Names.barracksIcon);

        x = (-1 * wade.getScreenWidth() / 2) + 200;
        y = (wade.getScreenHeight() / 2) - 100;
        const stables = Button.build(ImageMap.stables_1, buttonWidth, buttonHeight,
                x, y, layer);
        stables.setName(Names.stablesIcon);

        x = (-1 * wade.getScreenWidth() / 2) + 200;
        y = (wade.getScreenHeight() / 2) - 200;
        const towers = Button.build(ImageMap.towers_1, buttonWidth, buttonHeight,
                x, y, layer);
        towers.setName(Names.towersIcon);

        x = (-1 * wade.getScreenWidth() / 2) + 100;
        y = (wade.getScreenHeight() / 2) - 200;
        const town_halls = Button.build(ImageMap.town_halls_1, buttonWidth,
                buttonHeight, x, y, layer);
        town_halls.setName(Names.townHallsIcon);

        return [barracks, stables, towers, town_halls];

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
                        const options = displayFn(9);
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
        wade.getSceneObject(Names.barracksIcon).setVisible(false);
        wade.getSceneObject(Names.stablesIcon).setVisible(false);
        wade.getSceneObject(Names.towersIcon).setVisible(false);
        wade.getSceneObject(Names.townHallsIcon).setVisible(false);
    },
    clearMainPanel: () => {
        wade.getSceneObject(Names.buildingIcon).setVisible(false);
    },
    clearUnitsPanel: () => {
        wade.getSceneObject(Names.swordsmanIcon).setVisible(false);

    },
    showBuildingsPanel: () => {
        wade.getSceneObject(Names.barracksIcon).setVisible(true);
        wade.getSceneObject(Names.stablesIcon).setVisible(true);
        wade.getSceneObject(Names.towersIcon).setVisible(true);
        wade.getSceneObject(Names.townHallsIcon).setVisible(true);
    },
    showMainPanel: () => {
        wade.getSceneObject(Names.buildingIcon).setVisible(true);
    },
    showUnitsPanel: () => {
        wade.getSceneObject(Names.swordsmanIcon).setVisible(true);
    },
};

const displayBarracksOptions = (layer: number) => {
    const y = (wade.getScreenHeight() / 2) - 200;
    const x = 50;
    const swordsman = Button.build(ImageMap.swordsman_1, 35, 65, x, y, layer);
    swordsman.setName(Names.swordsmanIcon);

    return [swordsman];
};

const Button = {
    build: (imgStr: string, width: number, height: number,
            x: number, y: number, layer: number) => {
        const sprite = new Sprite(imgStr, layer);
        sprite.setSize(width, height);
        const sceneObj = new SceneObject(sprite);
        sceneObj.setPosition(x, y);
        wade.addSceneObject(sceneObj);

        return sceneObj;

    },

};

export default Hud;
