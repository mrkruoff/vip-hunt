import * as _ from 'lodash';
import ImageMap from './image-map';

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
        //THIS NEEDS REWORKING. For some reason the sprites won't move
        // within the scene object!

        //Add scroll to background
        const scroll = Hud.displayScroll(10);
        wade.app.scroll = scroll;

        const building = Hud.displayBuilding(9);
        wade.app.building = building;

        //Add building button to scene.

        building.onClick = function(event) {
            //Make the clicked building disappear
            this.setVisible(false);

            //Show the player new buttons for making buildings on map
            const options = Hud.displayBuildingOptions(9);

            //For each building, add an event listener that
            //will construct the correct building

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
        wade.setLayerTransform(layer, 0, 0);
        return scroll;
    },
    displayBuilding: (layer: number) => {
        const buildingSprite = new Sprite(ImageMap.buildingIcon, 9);
        buildingSprite.setSize(50, 50);

        //Add building icon to screen.
        const building = new SceneObject(buildingSprite);
        building.setPosition((-1 * wade.getScreenWidth() / 2) + 100, (wade.getScreenHeight() / 2) - 100);
        wade.addSceneObject(building);
        wade.setLayerTransform(9, 0, 0);

        return building;
    },

    // Returns an array of SceneObjects, added to the
    // scene, the show the options the player has for building.
    displayBuildingOptions: (layer: number) => {
        console.log('HI');
        // Show the buildings that can be built
        const barracksSprite = new Sprite(ImageMap.barracks1, 9);
        barracksSprite.setSize(50, 50);
        const barracks = new SceneObject(barracksSprite);
        barracks.setPosition((-1 * wade.getScreenWidth() / 2) + 100, (wade.getScreenHeight() / 2) - 100);
        wade.addSceneObject(barracks);

        return [barracks];

    },
};

export default Hud;
