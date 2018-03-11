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
import Events from './events';
import * as Menu from './menu';
import ImageMap from './image-map';
import Minimap from './minimap';

declare var window: any;
declare var location: any;
declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

function cleanScene() {
    let sceneObjects = wade.getSceneObjects(false);

    _.forEach(sceneObjects, (obj) => {
        //Clean up all circular references.
        if(_.has(obj, 'data') ) {
            obj.data.rep = null; 
            delete obj.data;
        }
    });
}

async function delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
        wade.setTimeout(resolve, milliseconds);
    });
}

const Hud = {
    showMinimap: () => {
        // paint the minimap terrain layer
        let background = Minimap.createBackground();

        // Paint the minimap initial fog
        let fogLayer = Minimap.createDarknessLayer();

        // Player and Ai Unit/Building icons will be build with the units/buildings 
        // and updated when they move or are deleted.

        let cameraZone = Minimap.createCameraZone();


        let global = wade.getSceneObject('global');
        global.minimap.background = background;
        global.minimap.fogLayer = fogLayer;
        global.minimap.cameraZone = cameraZone;

    },
    showMinimap2: () => {
        // while(true) {
        let transparent = new Sprite();
        transparent.setDrawFunction(function() {});
        transparent.setSize(5000, 5000);
        transparent.drawToImage('test.png', true);

        let worldArea = {
            minX: -5000,
            maxX: 5000,
            minY: -5000,
            maxY: 10
        }
        let terrainSprites = wade.getSpritesInArea(worldArea, 30, true);

        let new_index = 0;
        let chunkSize = 50;
        function paintSomeTerrain(spriteIndex) {
            let transform = {
                horizontalScale: 1,
                horizontalSkew: 0,
                verticalSkew: 0,
                verticalScale: 1,
                horizontalTranslate: 0,
                verticalTranslate: 0
            }
            let end = spriteIndex + chunkSize;
            if (end > terrainSprites.length) {
                end = terrainSprites.length; 
            }
            for(let index = spriteIndex; index < end; index++) {
                let sprite = terrainSprites[index]; 
                let position = sprite.getPosition();
                position.x /= 1;
                position.y /= 1;
                sprite.drawToImage('test.png', false, position,
                                   transform, null, null); 
            }
            spriteIndex = end;
            if (spriteIndex < terrainSprites.length - 1) {
                let paint = function(i) {
                    return function () {
                        paintSomeTerrain(i);
                    }
                }
                wade.setTimeout(paint(spriteIndex), 20); 
            }
            else {
                console.log("WE ARE DONE"); 
                let mapSprite = new Sprite('test.png', 20);
                let minimap = new SceneObject(mapSprite);
                wade.addSceneObject(minimap);
                minimap.setPosition(0, 0);
            }
        };
        paintSomeTerrain(new_index);
        /*
           _.forEach(terrainSprites, (sprite) => {
           let position = sprite.getPosition();
           position.x *= 20.1;
           position.y *= 20.1;
           sprite.drawToImage('test' + i.toString() + '.png', false, position,
           transform, null, null); 
           });

           let fogSprites = wade.getSpritesInArea(worldArea, 22, true);
           _.forEach(fogSprites, (sprite) => {
           let position = sprite.getPosition();
           position.x *= 20.1;
           position.y *= 20.1;
           sprite.drawToImage('test' + i.toString() + '.png', false, position,
           transform, null, null); 
           });

           let mapSprite = new Sprite('test' + i.toString() + '.png', 9);
           let minimap = new SceneObject(mapSprite);
           wade.addSceneObject(minimap);
         */
        // await delay(10000);
        // wade.removeSceneObject(minimap);
        //}
    },
    showWinPanel: () => {
        let options = BuildHud.winPanel(9);

        let menu = options[1];
        menu.onClick = (data) => {
            cleanScene();
            wade.clearScene();
            wade.resumeSimulation();
            window.location.reload();

            return true; 
        }
        wade.addEventListener(menu, 'onClick');
        menu.onMouseIn = (event) => {
            menu.getSprite(0).setFont("20px Verdana"); 
        }
        wade.addEventListener(menu, 'onMouseIn');
        menu.onMouseOut = (event) => {
            menu.getSprite(0).setFont("16px Verdana"); 
        }
        wade.addEventListener(menu, 'onMouseOut');


        let background = BuildHud.menuBackground(10);

    },
    showLossPanel: () => {
        let options = BuildHud.lossPanel(9);

        let menu = options[1];
        menu.onClick = (data) => {
            cleanScene();
            wade.clearScene();
            wade.resumeSimulation();
            window.location.reload();

            return true; 
        }
        wade.addEventListener(menu, 'onClick');
        menu.onMouseIn = (event) => {
            menu.getSprite(0).setFont("20px Verdana"); 
        }
        wade.addEventListener(menu, 'onMouseIn');
        menu.onMouseOut = (event) => {
            menu.getSprite(0).setFont("16px Verdana"); 
        }
        wade.addEventListener(menu, 'onMouseOut');

        let background = BuildHud.menuBackground(10);
    },
    clearMenuPanel: () => {
        const global = wade.getSceneObject('global'); 
        if (global.hud.menu) {
            wade.getSceneObject(Names.menu_background).setVisible(false); 
            wade.getSceneObject(Names.menu_save).setVisible(false);
            wade.getSceneObject(Names.menu_resume).setVisible(false);
            wade.getSceneObject(Names.menu_quit).setVisible(false);
        }
    },
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
            wade.getSceneObject(Names.menuIcon).setVisible(false);
        }
    },
    // This function clears the Barracks Panel, which cotntains
    // the possible units a Barracks can build.
    clearBarracksPanel: () => {
        const global = wade.getSceneObject('global');
        if (global.hud.barracks) {
            _.forEach(global.hud.barracks, (icon) => {
                icon.setVisible(false); 
            }); 


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
            wade.getSceneObject(Names.menuIcon).setVisible(true);
        } else {
            global.hud.main = BuildHud.mainPanel(9);
            let menu = global.hud.main[1];
            menu.onMouseIn = (event) => {
                menu.getSprite(0).setFont("20px Verdana"); 
            }
            wade.addEventListener(menu, 'onMouseIn');

            menu.onMouseOut = (event) => {
                menu.getSprite(0).setFont("16px Verdana"); 
            }
            wade.addEventListener(menu, 'onMouseOut');

            // Set up menu button click event: pause and show menu
            menu.onClick = (event) => {
                menu.getSprite(0).setFont("16px Verdana");
                wade.pauseSimulation(null); 
                Hud.clearMainPanel();
                Hud.showMenuPanel();
            }
            wade.addEventListener(menu, 'onClick');
        }

        return global.hud.main;
    },
    showMenuPanel: () => {
        const global = wade.getSceneObject('global'); 
        if(global.hud.menu) {
            wade.getSceneObject(Names.menu_background).setVisible(true); 
            wade.getSceneObject(Names.menu_save).setVisible(true);
            wade.getSceneObject(Names.menu_resume).setVisible(true);
            wade.getSceneObject(Names.menu_quit).setVisible(true);
        } else {

            global.hud.menu = BuildHud.menuPanel(9);

            let save = global.hud.menu[0];

            let resume_1 = global.hud.menu[1];
            let quit = global.hud.menu[2];

            resume_1.onMouseIn = (event)=> {
                resume_1.getSprite(0).setFont("20px Verdana");
            }

            save.onMouseIn = (event)=>{
                save.getSprite(0).setFont("20px Verdana");
            };

            quit.onMouseIn = (event)=>{
                quit.getSprite(0).setFont("20px Verdana");
            };

            wade.addEventListener(resume_1, 'onMouseIn');
            resume_1.onMouseOut =  (event)=> {
                resume_1.getSprite(0).setFont("16px Verdana");
            };
            wade.addEventListener(resume_1, 'onMouseOut');
            resume_1.onClick =  (event)=> {
                resume_1.getSprite(0).setFont("16px Verdana");
                wade.resumeSimulation(null);
                Hud.showMainPanel();
                Hud.clearMenuPanel();
            };

            wade.addEventListener(save, 'onMouseIn');
            save.onMouseOut = (event)=> {
                save.getSprite(0).setFont("16px Verdana");
            };
            wade.addEventListener(save, 'onMouseOut');
            save.onClick = (event) =>
            {
                save.getSprite(0).setFont("16px Verdana");

                // Unhook all the circular dependencies.
                let global = wade.getSceneObject('global').state;
            
                let data = _.concat(global.getResources(),
                                    global.getAi().getUnits(),
                global.getAi().getBuildings(),
                global.getPlayer().getUnits(),
                global.getPlayer().getBuildings());
                _.forEach(data, (datum) => {
                    datum.rep = null; 
                });


                //export and store the scene use local 
                let exportedScence = wade.exportScene();
                /* 
                   exportedScence.sceneObjects = [];
                 */

                exportedScence.sceneObjects = _.filter(exportedScence.sceneObjects, (obj) => {
                    return ! (_.has(obj.properties, 'iso') || _.has(obj.properties, 'dontSave') ); 
                });

                exportedScence.modules = {
                    iso: wade.iso.exportMap() 
                }
                wade.storeLocalObject('save_game', JSON.stringify(exportedScence));

                // Now step through all scene objects with the data property,
                // and use them to reconnect the isometric SceneObjects with their data
                let sceneObjects = wade.getSceneObjects('data');

                _.forEach(sceneObjects, (sceneObject) => {
                    sceneObject.data.rep = sceneObject;
                });

            };

            wade.addEventListener(quit, 'onMouseIn');
            quit.onMouseOut = (event)=> {
                quit.getSprite(0).setFont("16px Verdana");
            };
            wade.addEventListener(save, 'onMouseOut');
            quit.onClick = (event)=>
            {
                quit.getSprite(0).setFont("16px Verdana");
                location.reload();
            };

            wade.addEventListener(resume_1, 'onClick');
            wade.addEventListener(save, 'onClick');
            wade.addEventListener(quit, 'onClick');

            let background = BuildHud.menuBackground(10);
            global.hud.menu.push(background);
        }

    },
    // This function shows and returns a reference to the Barracks Panel SceneObjects.
    //
    // returns:
    //  reference to an array containing the Panel's various SceneObjects
    showBarracksPanel: () => {
        const global = wade.getSceneObject('global');
        if (global.hud.barracks) {
            _.forEach(global.hud.barracks, (icon) => {
                icon.setVisible(true); 
            });
        } else {
            global.hud.barracks = BuildHud.barracksPanel(9);
        }

        return global.hud.barracks;
    },
    showStablesPanel: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.stables) {
            _.forEach(global.hud.stables, (icon) => {
                icon.setVisible(true); 
            });
        } else {
            global.hud.stables = BuildHud.stablesPanel(9); 
        }
        return global.hud.stables;

    },
    clearStablesPanel: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.stables) {
            _.forEach(global.hud.stables, (icon) => {
                icon.setVisible(false); 
            });
        }

    },
    showTownHallPanel: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.townhall) {
            _.forEach(global.hud.townhall, (icon) => {
                icon.setVisible(true); 
            });    
        } else {
            global.hud.townhall = BuildHud.townHallPanel(9); 
        }
        return global.hud.townhall;
    },
    clearTownHallPanel: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.townhall) {
            _.forEach(global.hud.townhall, (icon) => {
                icon.setVisible(false); 
            });
        }
    },
    showTowerPanel: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.tower) {
            _.forEach(global.hud.tower, (icon) => {
                icon.setVisible(true); 
            });
        } else {
            global.hud.tower = BuildHud.towerPanel(9); 
        }
        return global.hud.tower;
    },
    clearTowerPanel: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.tower) {
            _.forEach(global.hud.tower, (icon) => {
                icon.setVisible(false); 
            });
        }

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
        const stoneCount = wade.getSceneObject(Names.stoneCount).getSprite(0);
        stoneCount.setText(player.stone.toString());
        const woodCount = wade.getSceneObject(Names.woodCount).getSprite(0);
        woodCount.setText(player.wood.toString());
        const foodCount = wade.getSceneObject(Names.foodCount).getSprite(0);
        foodCount.setText(player.food.toString());
    },
    showResourceData: (resource) => {
        const global = wade.getSceneObject('global');
        if (global.hud.stats) {
            // If the global hud is already showing stats, clear it away (destroy it).
            _.forEach(global.hud.stats, (icon) => {
                wade.removeSceneObject(icon);
            });
            global.hud.stats = null;
        }
        global.hud.stats = BuildHud.resourceStats(resource, 9);
    },
    showResourceError: () => {
        const global = wade.getSceneObject('global');
        if(global.hud.resource_error) {
            // If global hud is already showing resource error, clear it. 
            _.forEach(global.hud.resource_error, (icon) => {
                wade.removeSceneObject(icon); 
            } )
            global.hud.resource_error = null;
        }

        const layer = 8;
        const seconds = 3;
        const callback = null;
        global.hud.resource_error = BuildHud.resourceError(layer);

        //Fade the error out over time.
        wade.fadeOutLayer(layer, seconds, callback);
    },
    clearResourceData: () => {
        const global = wade.getSceneObject('global');
        if (global.hud.stats) {
            // If the global hud is already showing stats, clear it away (destroy it).
            _.forEach(global.hud.stats, (icon) => {
                wade.removeSceneObject(icon);
            });
            global.hud.stats = null;
        }
    },

};

export default Hud;
