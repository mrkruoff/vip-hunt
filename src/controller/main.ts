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



        //display a welcome screen with menu choices.
        Menu.displayWelcome.call(this);

    };

    // Initial loading of assets from server to client
    this.load = function() {
        // load images
        wade.loadImage(ImageMap.scroll);
        wade.loadImage(ImageMap.buildingIcon);
        wade.loadImage(ImageMap.barracks_1);
        wade.loadImage(ImageMap.stables_1);
        wade.loadImage(ImageMap.towers_1);
        wade.loadImage(ImageMap.town_halls_1);
        wade.loadImage(ImageMap.swordsman_1);

        // load json files for sprite construction
        wade.loadJson(JsonMap.barracks_1);
        wade.loadJson(JsonMap.stables_1);
        wade.loadJson(JsonMap.towers_1);
        wade.loadJson(JsonMap.town_halls_1);
        wade.loadJson(JsonMap.swordsman_1);

        //load json files for game data
        wade.loadJson(JsonMap.barracks_data);
        wade.loadJson(JsonMap.stables_data);
        wade.loadJson(JsonMap.townhall_data);
        wade.loadJson(JsonMap.tower_data);
        wade.loadJson(JsonMap.archer_calvary_data);
        wade.loadJson(JsonMap.archer_data);
        wade.loadJson(JsonMap.drummer_boy_data);
        wade.loadJson(JsonMap.gatherer_data);
        wade.loadJson(JsonMap.spear_calvary_data);
        wade.loadJson(JsonMap.swordsman_data);
        wade.loadJson(JsonMap.vip_data);

    };

};
