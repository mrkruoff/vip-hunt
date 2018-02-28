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


var Fog = {
    // Paint entirety of map, including on the invisible tiles
    // on the edges of the map in the darkness.
    paintMap: (textureName: string, scale: number, layer: number, visible: boolean) => {
        let numTiles = wade.iso.getNumTiles();
        for(let i = -1; i < numTiles.x + 1; i++) {
            for(let j = -1; j < numTiles.z + 1; j++) {
                Fog.paintTile(i, j, textureName, scale, layer, visisble);
                /*
                let data = {
                    texture: textureName, 
                    scale: scale,
                };
                wade.iso.setTransition(i, j, data);
                let sprite = wade.iso.getTransitionSprite(i, j);
                sprite.setLayer(layer);
                sprite.setVisible(visible);
                */
            } 
        }
    
    },
    paintMapFog: () => {
        Fog.paintMap(ImageMap.fog, 0.97, 22, true);
    },

    paintMapDarkness: () => {
        Fog.paintMap(ImageMap.darkness, 1, 21, true); 
    },

    paintTile: (x: number, z: number, textureName: string, scale: number, layer: number, visible: boolean) => {
            let data = {
                texture: textureName, 
                scale: scale,
            };
            wade.iso.setTransition(x, z, data);
            let sprite = wade.iso.getTransitionSprite(x, z);
            sprite.setLayer(layer);
            sprite.setVisible(visible);

    },
    setFogVisibility(x: number, z: number, visible: boolean) {
        let fogSprite = wade.iso.getTransitionSprite(x, z);
        if ( !_.isNull(fogSprite) ) {
            fogSprite.setVisible(visible);
        }
        else {
            paintTile(x, z, ImageMap.fog, 0.97, 22, visible);
        }
    },


};


export default Fog;
