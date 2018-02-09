
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
    trackIsoTerrainGridMove: (isoSceneObject: any) => {
        wade.app.onIsoTerrainMouseMove = (event) => {
            wade.iso.moveObjectToTile(isoSceneObject,
                event.gridCoords.x, event.gridCoords.z);
        };
    },
};

export default Mouse;
