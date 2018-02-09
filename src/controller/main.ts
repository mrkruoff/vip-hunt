import ImageMap from './image-map';
import JsonMap from './json-map';
import * as Menu from './menu';

declare var App: any;
declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

App = function() {
    // Sets up initial variables for the game
    this.init = function() {
        //Create a global object for handling global events.
        this.cameraSpeed = 500;
        this.zoomSpeed = 8;
        this.cameraIsMoving = false;

        //display a welcome screen with menu choices.
        Menu.displayWelcome.call(this);

    };

    // Initial loading of assets from server to client
    this.load = function() {
        wade.loadImage(ImageMap.scroll);
        wade.loadImage(ImageMap.buildingIcon);
        wade.loadImage(ImageMap.barracks_1);
        wade.loadImage(ImageMap.stables_1);
        wade.loadImage(ImageMap.towers_1);
        wade.loadImage(ImageMap.town_halls_1);

        wade.loadJson(JsonMap.barracks_1);
    };

};
