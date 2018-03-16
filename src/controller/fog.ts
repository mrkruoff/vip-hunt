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

const Fog = {
    // Paint entirety of map, including on the invisible tiles
    // on the edges of the map in the darkness.
    paintMap: (textureName: string, scale: number, layer: number, visible: boolean) => {
        const numTiles = wade.iso.getNumTiles();
        for (let i = 0; i < numTiles.x ; i++) {
            for (let j = 0; j < numTiles.z ; j++) {
                Fog.paintTile(i, j, textureName, scale, layer, visible);
            }
        }

    },
    paintMapFog: () => {
        Fog.paintMap(ImageMap.fog, 0.97, 22, true);
    },

    paintMapDarkness: () => {
        Fog.paintMap(ImageMap.darkness, 1, 22, true);
    },

    paintTile: (x: number, z: number, textureName: string, scale: number, layer: number, visible: boolean) => {
            const data = {
                texture: textureName,
                scale,
            };
            wade.iso.setTransition(x, z, data);
            const sprite = wade.iso.getTransitionSprite(x, z);
            sprite.setLayer(layer);
            sprite.setVisible(visible);

            if (textureName === ImageMap.fog) {
                sprite.discovered = true;
            }
            if (textureName === ImageMap.darkness) {
                sprite.discovered = false;
            }
    },
    setFogVisibility: (x: number, z: number, visible: boolean) => {
        const sprite = wade.iso.getTransitionSprite(x, z);

        if (sprite) {
            if (sprite.discovered) {
                // Then the sprite is an ImageMap.fog sprite. We can
                // set the visibility as we desire
                sprite.setVisible(visible);
            } else {
                // Then the sprite is an ImageMap.darkness sprite. We are only
                // allowed to make it invisible.
                if (!visible) {
                    Fog.paintTile(x, z, ImageMap.fog, 0.97, 22, visible);
                }
            }
        }

    },
    // This function returns an object that contains in one property
    // the coordinates to paint with fog, and in one property
    // the coordinates to paint with NO fog.
    calculatePaintVision: (sceneObject) => {
        const dist = (coords1, coords2) => {
            const dx = coords1.x - coords2.x;
            const dz = coords1.z - coords2.z;
            const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dz, 2) );
            return d;
        };
        const inMapBounds = (coords) => {
            const numTiles = wade.iso.getNumTiles();
            if (coords.x < 0 || coords.z < 0 ) {
                return false;
            }

            if (coords.x >= numTiles.x || coords.z >= numTiles.z) {
                    return false;
            }
            return true;
        };

        const start = sceneObject.iso.gridCoords;
        const paintArrays = {
            clear: [start],
            fog: [],
        };

        // In a spiral pattern around the scene object, go through
        // the tiles and save which coordinates are to be painted clear
        // and which are to be painted fog.
        const coords = {
            x: start.x,
            z: start.z,
        };
        let addX = true;
        let addZ = true;
        let stepSize = 1;

        // We're getting slightly more than the tiles that the sceneObject can see.
        // We want to repaint some of the tiles with fog in case the sceneObject
        // is moving
        const clearDistance = sceneObject.data.vision;
        const angle = Math.cos(Math.PI / 4);
        const radius = clearDistance / angle;
        while ( dist(coords, start) <= radius + 3 ) {
            for (let i = 0; i < stepSize; i++) {
                let increment = 1;
                if ( !addX ) {
                    increment *= -1;
                }
                coords.x += increment;

                if ( inMapBounds(coords) ) {
                    const new_coords = _.cloneDeep(coords);
                    if (dist(coords, start) <= clearDistance) {
                        paintArrays.clear.push(new_coords);
                    } else {
                        paintArrays.fog.push(new_coords);
                    }
                }
            }
            addX = !addX;

            for (let i = 0; i < stepSize; i++) {
                let increment = 1;
                if ( !addZ ) {
                    increment *= -1;
                }
                coords.z += increment;

                if ( inMapBounds(coords) ) {
                    const new_coords = _.cloneDeep(coords);
                    if (dist(coords, start) <= clearDistance) {
                        paintArrays.clear.push(new_coords);
                    } else {
                        paintArrays.fog.push(new_coords);
                    }
                }
            }
            addZ = !addZ;

            stepSize++;
        }

        return paintArrays;
    },

};

export default Fog;
