import * as _ from 'lodash';
import BuildHud from './build-hud';
import Names from './names';
import Events from './events';
import * as Menu from './menu';
import ImageMap from './image-map';
import Mouse from './mouse';
import AiGamePlay from './ai-gameplay';

declare var window: any;
declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;


let Minimap = {
    createBackground: () => {
        let sprite = new Sprite(ImageMap.minimap_background, 9);
        sprite.setSize(100, 100);
        sprite.setSortPoint(0, -1);
        let minimap = new SceneObject(sprite);
        minimap.setRotation(Math.PI / 4);
        minimap.setPosition( (wade.getScreenWidth() / 2) - 150, (wade.getScreenHeight()/2) - 100);
        minimap.setAlignment('right', 'bottom');
        wade.addSceneObject(minimap);
        minimap.dontSave = true;
        return minimap;
    },
    createDarknessLayer: () => {
        let numTiles = wade.iso.getNumTiles();
        let xLength = 100 / numTiles.x;
        let zLength = 100 / numTiles.z;
        let xOffset = xLength / Math.sqrt(2);
        let zOffset = zLength / Math.sqrt(2);
        let origin = {
            x: (wade.getScreenWidth() / 2) - 150,
            y: (wade.getScreenHeight()/2) - 100 + (Math.sqrt(2)*50) - 2,
        }
        let layer = []
        for(let x = 0; x < numTiles.x; x++) {
            layer.push([]);
            for(let z = 0; z < numTiles.z; z++) {
                let greenSprite = new Sprite(ImageMap.minimap_background, 9);
                greenSprite.setSortPoint(0, -0.5);
                greenSprite.setSize(xLength, zLength);
                greenSprite.setVisible(true);
                let darkSprite = new Sprite(ImageMap.minimap_darkness, 9);
                darkSprite.setSortPoint(0, 0.5);
                darkSprite.setSize(xLength, zLength);
                darkSprite.setVisible(true);
                let fogSprite = new Sprite(ImageMap.minimap_fog, 9);
                fogSprite.setSortPoint(0, 0.5);
                fogSprite.setSize(xLength, zLength);
                fogSprite.setVisible(false);

                let darkness = new SceneObject([darkSprite, fogSprite, greenSprite]);
                darkness.setRotation(Math.PI / 4);
                darkness.setPosition(origin.x - (z*xOffset), origin.y - (z*xOffset));
                darkness.setAlignment('right', 'bottom');

                wade.addSceneObject(darkness);
                darkness.dontSave = true;
                layer[x].push(darkness);

                // The darkness scene object should know what its tile location is.
                darkness.x = x;
                darkness.z = z;

                darkness.onClick = (event) => {
                    console.log(event);
                    console.log(darkness);
                    if(event.button === Mouse.left) {
                        let position = wade.iso.getFlatWorldCoordinates(darkness.x, darkness.z);
                        position.z = wade.getCameraPosition().z;
                        wade.setCameraPosition(position);
                        return true;
                    }
                    
                    if(event.button === Mouse.right) {
                        if (wade.app.selected) {
                            // If there is a selected player object 
                            if(_.has(wade.app.selected.data, 'speed')) {
                                // If that object's data has a speed (can move) 
                                // then it is a unit
                                AiGamePlay.unitMove(wade.app.selected.data.getId(), darkness.x, darkness.z);
                            }
                            
                        }

                    
                        return true;
                    }
                }
                wade.addEventListener(darkness, 'onClick');
            } 
            origin.x += xOffset;
            origin.y -= xOffset
        }

        return layer;
    },
    createCameraZone: () => {
        let sprite = new Sprite(ImageMap.minimap_white_outline, 9);
        sprite.setSortPoint(0, 1);
        sprite.setSize(50, 50);
        let zone = new SceneObject(sprite);
        zone.setAlignment('right', 'bottom');
        let origin = {
            x: (wade.getScreenWidth() / 2) - 150,
            y: (wade.getScreenHeight()/2) - 100 + (Math.sqrt(2)*50) - 4.2,
        }
        zone.setPosition(origin.x, origin.y);
        wade.addSceneObject(zone);
        zone.dontSave = true;

        return zone;
    
    },
    updateCameraZone: (coords) => {
        let minimap = wade.getSceneObject('global').minimap;
        let cameraZone = minimap.cameraZone;
        let fogLayer = minimap.fogLayer;
        let gridCoords = wade.iso.getFlatTileCoordinates(coords.x, coords.y);
        if(gridCoords.valid) {
            let position = fogLayer[gridCoords.x][gridCoords.z].getPosition(); 
            cameraZone.setPosition(position.x, position.y);
        }
    },
    refreshPlayerVision: (visionData) => {
        let paintFog = visionData.fog;      
        let paintClear = visionData.clear;
        _.forEach(paintFog, (coord) => {
            Minimap.setFogVisibility(coord.x, coord.z, true);
        });

        _.forEach(paintClear, (coord) => {
            Minimap.setFogVisibility(coord.x, coord.z, false); 
        });
    
    },
    setFogVisibility: (x: number, z: number, visible: boolean) => {
        let sprite = wade.iso.getTransitionSprite(x, z);
        let fogLayer = wade.getSceneObject('global').minimap.fogLayer;

        if(sprite) {
            if(sprite.discovered) {
                // Then the sprite is an ImageMap.minimap_fog sprite. We can 
                // set the visibility as we desire
                fogLayer[x][z].getSprite(1).setVisible(visible);
                fogLayer[x][z].getSprite(0).setVisible(false);
            }
            else {
                // Then the sprite is an ImageMap.minimap_darkness sprite. We are only
                // allowed to make it invisible.
                if(!visible) {
                    fogLayer[x][z].getSprite(0).setVisible(visible);
                }
            }
        }
    
    },
    createBuildingMarker: (x: number, z: number, owner: string) => {
        let numTiles = wade.iso.getNumTiles();
        let sprite;
        if(owner === "ai") {
            sprite = new Sprite(ImageMap.minimap_red_square, 9);
        }
        else if (owner === "player") {
            sprite = new Sprite(ImageMap.minimap_blue_square, 9);
        }
        sprite.setSize(100/20, 100/20);
        sprite.setSortPoint(0, 0);

        let fogLayer = wade.getSceneObject('global').minimap.fogLayer;
        let building = new SceneObject(sprite);
        building.setAlignment('right', 'bottom');
        let position = fogLayer[x][z].getPosition();
        building.setPosition(position);

        wade.addSceneObject(building);
        building.dontSave = true;

        return building;
    },
    createUnitMarker: (x: number, z: number, owner: string) => {
        let numTiles = wade.iso.getNumTiles();
        let sprite;
        if(owner === "ai") {
            sprite = new Sprite(ImageMap.minimap_red_circle, 9);
        }
        else if (owner === "player") {
            sprite = new Sprite(ImageMap.minimap_blue_circle, 9);
        }
        sprite.setSize(100/20, 100/20);
        sprite.setSortPoint(0, 0);
        let fogLayer = wade.getSceneObject('global').minimap.fogLayer;
        let unit = new SceneObject(sprite);
        unit.setAlignment('right', 'bottom');
        let position = fogLayer[x][z].getPosition();
        unit.setPosition(position);

        wade.addSceneObject(unit);
        unit.dontSave = true;

        return unit;
    },
};


export default Minimap;
