import * as _ from 'lodash';
import BuildHud from './build-hud';
import Names from './names';
import Events from './events';
import * as Menu from './menu';
import ImageMap from './image-map';

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
            y: (wade.getScreenHeight()/2) - 100 + (Math.sqrt(2)*50) - 4.2,
        }
        let layer = []
        for(let x = 0; x < numTiles.x; x++) {
            layer.push([]);
            for(let z = 0; z < numTiles.z; z++) {
                let darkSprite = new Sprite(ImageMap.minimap_darkness, 9);
                darkSprite.setSortPoint(0, 1);
                darkSprite.setSize(xLength, zLength);
                darkSprite.setVisible(true);
                let fogSprite = new Sprite(ImageMap.minimap_fog, 9);
                fogSprite.setSortPoint(0, 1);
                fogSprite.setSize(xLength, zLength);
                fogSprite.setVisible(false);

                let darkness = new SceneObject([darkSprite, fogSprite]);
                darkness.setRotation(Math.PI / 4);
                darkness.setPosition(origin.x - (z*xOffset), origin.y - (z*xOffset));
                darkness.setAlignment('right', 'bottom');

                wade.addSceneObject(darkness);
                layer[x].push(darkness);
            } 
            origin.x += xOffset;
            origin.y -= xOffset
        }

        return layer;
    }



};


export default Minimap;
