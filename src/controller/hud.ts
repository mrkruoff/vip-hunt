

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

var Hud = {
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
    clearBarracksPanel: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.barracks) {
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

}

export default Hud;
