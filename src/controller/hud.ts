/* hud.ts
 *
 * The Hud module consists of functions for displaying and hiding 
 * HUD elements at any given time. Most utilize the 'global' SceneObject
 * to check whether or not a particular HUD element has been created.
 * If it has not been created, this module relies on the BuildHud 
 * module to construct said element.
 *
 */

import * as _ from 'lodash';
import BuildHud from './build-hud';
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

    // This function clears the Buildings Panel, which contains 
    // the possible buildings a player can build.
    clearBuildingsPanel: () => {
        const global = wade.getSceneObject('global');
        if (global.hud.buildings) {
            wade.getSceneObject(Names.barracksIcon).setVisible(false);
            wade.getSceneObject(Names.stablesIcon).setVisible(false);
            wade.getSceneObject(Names.towersIcon).setVisible(false);
            wade.getSceneObject(Names.townHallsIcon).setVisible(false);
        }
    },
    // This function clears the Main Panel, which contains things like 
    // Save icon, Pause game icon, Menu icon, and Build Buildings icon.
    clearMainPanel: () => {
        const global = wade.getSceneObject('global');
        if (global.hud.main) {
            wade.getSceneObject(Names.buildingIcon).setVisible(false);
        }
    },
    // This function clears the Barracks Panel, which cotntains 
    // the possible units a Barracks can build.
    clearBarracksPanel: () => {
        const global = wade.getSceneObject('global');
        if (global.hud.barracks) {
            wade.getSceneObject(Names.swordsmanIcon).setVisible(false);
        }

    },
    // This function clears the Resource panel, which shows the amount 
    // of Wood, Stone, and Food a player currently has.
    clearResourcePanel: () => {
        const global = wade.getSceneObject('global');
        if (global.hud.resources) {
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
    // This function shows and returns a reference to the Background SceneObject
    //
    // returns:
    //  reference to the Background SceneObject.
    showBackground: () => {
        const global = wade.getSceneObject('global');
        if (global.hud.background) {
            wade.getSceneObject(Names.hudBackground).setVisible(true);
        } else {
            global.hud.background = BuildHud.background(10);
        }
        return global.hud.background;
    },
    // This function shows and returns a reference to the the Buildings Panel
    // SceneObjects
    //
    // returns:
    //  reference to an array containing the Panel's various ScneneObjects
    showBuildingsPanel: () => {
        const global = wade.getSceneObject('global');
        if (global.hud.buildings) {
            wade.getSceneObject(Names.barracksIcon).setVisible(true);
            wade.getSceneObject(Names.stablesIcon).setVisible(true);
            wade.getSceneObject(Names.towersIcon).setVisible(true);
            wade.getSceneObject(Names.townHallsIcon).setVisible(true);
        } else {
            global.hud.buildings = BuildHud.buildingsPanel(9);
        }
        return global.hud.buildings;
    },
    // This function shows and returns a reference to the Main Panel SceneObjects.
    //
    // returns:
    //  reference to an array containing the Panel's various 
    //      SceneObjects.
    showMainPanel: () => {
        const global = wade.getSceneObject('global');
        if (global.hud.main) {
            wade.getSceneObject(Names.buildingIcon).setVisible(true);
        } else {
            global.hud.main = BuildHud.mainPanel(9);
        }

        return global.hud.main;
    },
    // This function shows and returns a reference to the Barracks Panel SceneObjects.
    //
    // returns:
    //  reference to an array containing the Panel's various SceneObjects
    showBarracksPanel: () => {
        const global = wade.getSceneObject('global');
        if (global.hud.barracks) {
            wade.getSceneObject(Names.swordsmanIcon).setVisible(true);
        } else {
            global.hud.barracks = BuildHud.barracksPanel(9);
        }

        return global.hud.barracks;
    },
    // This function shows and returns a reference to the Resource Panel SceneObjects
    //
    // returns:
    //  reference to an array containing the Panel's various SceneObjects
    showResourcePanel: () => {
        const global = wade.getSceneObject('global');
        if (global.hud.resources) {
            //if the resources have already been constructed, just show them.
            wade.getSceneObject(Names.stoneIcon).setVisible(true);
            wade.getSceneObject(Names.stoneCount).setVisible(true);
            wade.getSceneObject(Names.woodIcon).setVisible(true);
            wade.getSceneObject(Names.woodCount).setVisible(true);
            wade.getSceneObject(Names.foodIcon).setVisible(true);
            wade.getSceneObject(Names.foodCount).setVisible(true);
        } else {
            global.hud.resources = BuildHud.resourcePanel(9);
        }

        return global.hud.resources;
    },
    // This function updates the Resource Panel SceneObjects to reflect 
    // the Player's amounts of stone, wood, and food.
    //
    // pre:
    //  The ResourcePanel must be shown (must exist) before calling this 
    //      function. Call Hud.showResourcePanel() to do this.
    updateResourcePanel: () => {
        const player = wade.getSceneObject('global').state.getPlayer();
        console.log(wade.getSceneObject(Names.stoneCount));
        let stoneCount = wade.getSceneObject(Names.stoneCount).getSprite(0);  
        stoneCount.setText(player.stone.toString());
        let woodCount = wade.getSceneObject(Names.woodCount).getSprite(0);  
        woodCount.setText(player.wood.toString());
        let foodCount = wade.getSceneObject(Names.foodCount).getSprite(0);  
        foodCount.setText(player.food.toString());
    },
    showResourceData: (resource) => {
        const global = wade.getSceneObject('global');
        if(global.hud.stats) {
            // If the global hud is already showing stats, clear it away (destroy it).
            _.forEach(global.hud.stats, (icon) => {
                wade.removeSceneObject(icon); 
            });
            global.hud.stats = null;
        }
        global.hud.stats = BuildHud.resourceStats(resource, 9);
    },
    clearResourceData: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.stats) {
            // If the global hud is already showing stats, clear it away (destroy it).
            _.forEach(global.hud.stats, (icon) => {
                wade.removeSceneObject(icon); 
            });
            global.hud.stats = null;
        } 
    
    },

};

export default Hud;
