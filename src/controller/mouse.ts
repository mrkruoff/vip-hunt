/* mouse.ts
 *
 * The Mouse module contains functions and properties to make it easier to
 * work with the mouse.
 */

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

const Mouse = {
    left: 0,
    middle: 1,
    right: 2,
    // This function causes the isoSceneObject to track the
    // mouse position while the mouse is over the isometric map.
    // The isoSceneObject will only be positioned at non-colliding positions,
    // however.
    //
    // parameters:
    //  @ isoSceneObject: the isometric SceneObject that will track the mouse
    trackIsoTerrainGridMove: (isoSceneObject: any) => {
        wade.app.onIsoTerrainMouseMove = (event) => {
            const wasMoved = wade.iso.moveObjectToTile(isoSceneObject,
                event.gridCoords.x, event.gridCoords.z);
        };
    },
};

export default Mouse;
