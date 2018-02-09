import * as _ from 'lodash';
import ImageMap from './image-map';
import Mouse from './mouse';
import JsonMap from './json-map';
import Construction from './construction';
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
            this.setVisible(false);

            //Show the player new buttons for making buildings on map
            const options = Hud.displayBuildingOptions(9);

            //Process each icon to have correct events
            _.forEach(options, (b) => {
                const imageName = b.getSprite(0).getImageName();
                let callback;
                if (imageName === ImageMap.barracks_1) {
                    callback = Hud.buildingConstruction(options,
                        Construction.barracks, JsonMap.barracks_1);
                } else if (imageName === ImageMap.stables_1) {
                    callback = Hud.buildingConstruction(options,
                        Construction.stables, JsonMap.stables_1);
                } else if (imageName === ImageMap.towers_1) {
                    callback = Hud.buildingConstruction(options,
                        Construction.towers, JsonMap.towers_1);
                } else if (imageName === ImageMap.town_halls_1) {
                    callback = Hud.buildingConstruction(options,
                        Construction.townHalls, JsonMap.town_halls_1);
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
    buildingConstruction: (optionsPanel, constructionFn, jsonFile) => {
        return function(event) {
            if (event.button === Mouse.left) {
                if(optionsPanel.icon) {
                    //If the building has an icon,
                    //don't create another
                } else {
                    optionsPanel.icon = constructionFn(jsonFile);
                    Mouse.trackIsoTerrainGridMove(optionsPanel.icon);

                    wade.app.onIsoTerrainMouseDown = (e) => {
                        //Make room to construct another buildiing
                        optionsPanel.icon = null;
                        wade.app.onIsoTerrainMouseMove = null;
                    }
                }
            }
        }
    }
};

var Button = {
    build: (imgStr: string, width: number, height: number,
                x: number, y: number, layer: number) => {
        const sprite = new Sprite(imgStr, layer);
        sprite.setSize(width, height);
        const sceneObj = new SceneObject(sprite);
        sceneObj.setPosition(x, y);
        wade.addSceneObject(sceneObj);
    
        return sceneObj;
    
    }

}

export default Hud;
