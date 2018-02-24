/* main.ts
 *
 *
 * This file contains the App function, which WADE will use to launch the game.
 *
 */

import AudioMap from './audio-map';
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
    // START HERE. This function is called to start the game!
    this.init = function() {
        //Allow diagonal and straight movement in the game
        wade.iso.init({movementDirection: 'both'});

        // Initialize the screen min and max screen height/width to 
        // control screen size appearance
        wade.setMinScreenSize(600, 375);
        wade.setMaxScreenSize(1280, 800)

        // Start the menu.
        Menu.displayWelcome.call(this);
    };

    // This function is called for asynchronous loading of assets. However,
    // the game will not start until all assets are loaded.
    this.load = function() {
        loadImages();
        loadSpriteJson();
        loadDataJson();
        loadCostJson();
//        loadAudio();

    };

};

function loadAudio() {
    wade.loadAudio(AudioMap.menu_music);
}

function loadCostJson() {
    wade.loadJson(JsonMap.barracks_cost);
    wade.loadJson(JsonMap.stables_cost);
    wade.loadJson(JsonMap.townhall_cost);
    wade.loadJson(JsonMap.tower_cost);
    wade.loadJson(JsonMap.archer_cost);
    wade.loadJson(JsonMap.swordsman_cost);
    wade.loadJson(JsonMap.archer_calvary_cost);
    wade.loadJson(JsonMap.spear_calvary_cost);
    wade.loadJson(JsonMap.gatherer_cost);
    wade.loadJson(JsonMap.drummer_boy_cost);

}

function loadDataJson() {
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

    wade.loadJson(JsonMap.stone_data);
    wade.loadJson(JsonMap.wood_data);
    wade.loadJson(JsonMap.food_data);
}

function loadImages() {
    // load images
    wade.loadImage(ImageMap.scroll);
    wade.loadImage(ImageMap.buildingIcon);
    wade.loadImage(ImageMap.barracks_1);
    wade.loadImage(ImageMap.stables_1);
    wade.loadImage(ImageMap.towers_1);
    wade.loadImage(ImageMap.town_halls_1);
    wade.loadImage(ImageMap.swordsman_1);
    wade.loadImage(ImageMap.stoneIcon);
    wade.loadImage(ImageMap.woodIcon);
    wade.loadImage(ImageMap.foodIcon);
    wade.loadImage(ImageMap.vip_1);
    wade.loadImage(ImageMap.archer_1);
    wade.loadImage(ImageMap.archer_calvary_1);
    wade.loadImage(ImageMap.spear_calvary_1);

    wade.loadImage(ImageMap.food);
    wade.loadImage(ImageMap.wood);
    wade.loadImage(ImageMap.stone);

    let swordsman_animations = [
        ImageMap.swordsman_N_idle,
        ImageMap.swordsman_S_idle,
        ImageMap.swordsman_E_idle,
        ImageMap.swordsman_W_idle,
        ImageMap.swordsman_NE_idle,
        ImageMap.swordsman_NW_idle,
        ImageMap.swordsman_SE_idle,
        ImageMap.swordsman_SW_idle,
        ImageMap.swordsman_N_walk,
        ImageMap.swordsman_S_walk,
        ImageMap.swordsman_E_walk,
        ImageMap.swordsman_W_walk,
        ImageMap.swordsman_NE_walk,
        ImageMap.swordsman_NW_walk,
        ImageMap.swordsman_SE_walk,
        ImageMap.swordsman_SW_walk,
        ImageMap.swordsman_N_attack,
        ImageMap.swordsman_S_attack,
        ImageMap.swordsman_E_attack,
        ImageMap.swordsman_W_attack,
        ImageMap.swordsman_NE_attack,
        ImageMap.swordsman_NW_attack,
        ImageMap.swordsman_SE_attack,
        ImageMap.swordsman_SW_attack,
        ImageMap.swordsman_N_death,
        ImageMap.swordsman_S_death,
        ImageMap.swordsman_E_death,
        ImageMap.swordsman_W_death,
        ImageMap.swordsman_NE_death,
        ImageMap.swordsman_NW_death,
        ImageMap.swordsman_SE_death,
        ImageMap.swordsman_SW_death,
    ];
    wade.loadImages(swordsman_animations);
    
    let archer_animations = [
        ImageMap.archer_N_idle,
        ImageMap.archer_S_idle,
        ImageMap.archer_E_idle,
        ImageMap.archer_W_idle,
        ImageMap.archer_NE_idle,
        ImageMap.archer_NW_idle,
        ImageMap.archer_SE_idle,
        ImageMap.archer_SW_idle,
        ImageMap.archer_N_walk,
        ImageMap.archer_S_walk,
        ImageMap.archer_E_walk,
        ImageMap.archer_W_walk,
        ImageMap.archer_NE_walk,
        ImageMap.archer_NW_walk,
        ImageMap.archer_SE_walk,
        ImageMap.archer_SW_walk,
        ImageMap.archer_N_attack,
        ImageMap.archer_S_attack,
        ImageMap.archer_E_attack,
        ImageMap.archer_W_attack,
        ImageMap.archer_NE_attack,
        ImageMap.archer_NW_attack,
        ImageMap.archer_SE_attack,
        ImageMap.archer_SW_attack,
        ImageMap.archer_N_death,
        ImageMap.archer_S_death,
        ImageMap.archer_E_death,
        ImageMap.archer_W_death,
        ImageMap.archer_NE_death,
        ImageMap.archer_NW_death,
        ImageMap.archer_SE_death,
        ImageMap.archer_SW_death,
    ];
    wade.loadImages(archer_animations);


    let archerCalvary_animations = [
        ImageMap.archerCalvary_N_idle,
        ImageMap.archerCalvary_S_idle,
        ImageMap.archerCalvary_E_idle,
        ImageMap.archerCalvary_W_idle,
        ImageMap.archerCalvary_NE_idle,
        ImageMap.archerCalvary_NW_idle,
        ImageMap.archerCalvary_SE_idle,
        ImageMap.archerCalvary_SW_idle,
        ImageMap.archerCalvary_N_walk,
        ImageMap.archerCalvary_S_walk,
        ImageMap.archerCalvary_E_walk,
        ImageMap.archerCalvary_W_walk,
        ImageMap.archerCalvary_NE_walk,
        ImageMap.archerCalvary_NW_walk,
        ImageMap.archerCalvary_SE_walk,
        ImageMap.archerCalvary_SW_walk,
        ImageMap.archerCalvary_N_attack,
        ImageMap.archerCalvary_S_attack,
        ImageMap.archerCalvary_E_attack,
        ImageMap.archerCalvary_W_attack,
        ImageMap.archerCalvary_NE_attack,
        ImageMap.archerCalvary_NW_attack,
        ImageMap.archerCalvary_SE_attack,
        ImageMap.archerCalvary_SW_attack,
        ImageMap.archerCalvary_N_death,
        ImageMap.archerCalvary_S_death,
        ImageMap.archerCalvary_E_death,
        ImageMap.archerCalvary_W_death,
        ImageMap.archerCalvary_NE_death,
        ImageMap.archerCalvary_NW_death,
        ImageMap.archerCalvary_SE_death,
        ImageMap.archerCalvary_SW_death,
    ];
    wade.loadImages(archerCalvary_animations);


    let spearCalvary_animations = [
        ImageMap.spearCalvary_N_idle,
        ImageMap.spearCalvary_S_idle,
        ImageMap.spearCalvary_E_idle,
        ImageMap.spearCalvary_W_idle,
        ImageMap.spearCalvary_NE_idle,
        ImageMap.spearCalvary_NW_idle,
        ImageMap.spearCalvary_SE_idle,
        ImageMap.spearCalvary_SW_idle,
        ImageMap.spearCalvary_N_walk,
        ImageMap.spearCalvary_S_walk,
        ImageMap.spearCalvary_E_walk,
        ImageMap.spearCalvary_W_walk,
        ImageMap.spearCalvary_NE_walk,
        ImageMap.spearCalvary_NW_walk,
        ImageMap.spearCalvary_SE_walk,
        ImageMap.spearCalvary_SW_walk,
        ImageMap.spearCalvary_N_attack,
        ImageMap.spearCalvary_S_attack,
        ImageMap.spearCalvary_E_attack,
        ImageMap.spearCalvary_W_attack,
        ImageMap.spearCalvary_NE_attack,
        ImageMap.spearCalvary_NW_attack,
        ImageMap.spearCalvary_SE_attack,
        ImageMap.spearCalvary_SW_attack,
        ImageMap.spearCalvary_N_death,
        ImageMap.spearCalvary_S_death,
        ImageMap.spearCalvary_E_death,
        ImageMap.spearCalvary_W_death,
        ImageMap.spearCalvary_NE_death,
        ImageMap.spearCalvary_NW_death,
        ImageMap.spearCalvary_SE_death,
        ImageMap.spearCalvary_SW_death,
    ];
    wade.loadImages(spearCalvary_animations);
}

function loadSpriteJson() {
    // load json files for sprite construction
    wade.loadJson(JsonMap.barracks_1);
    wade.loadJson(JsonMap.stables_1);
    wade.loadJson(JsonMap.towers_1);
    wade.loadJson(JsonMap.town_halls_1);
    wade.loadJson(JsonMap.swordsman_1);
    wade.loadJson(JsonMap.vip_1);
    wade.loadJson(JsonMap.wood);
    wade.loadJson(JsonMap.food);
    wade.loadJson(JsonMap.stone);
    wade.loadJson(JsonMap.archer_1);
    wade.loadJson(JsonMap.archer_calvary_1);
    wade.loadJson(JsonMap.spear_calvary_1);
}
