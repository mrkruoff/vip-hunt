import Camera from './camera';

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

var Events = {
    addGlobal: () => {
    //Add camera options for mouse and keyboard
        wade.app.onKeyDown = function(event) {
            Camera.keyDown(event);
        };

        wade.app.onKeyUp = function(event) {
            Camera.keyUp(event);
        };

        wade.app.onIsoTerrainMouseDown = function(event) {
            console.log(event);
        };
        wade.app.onClick = function(event) {
            console.log(event);
        };

        //Allow player to move around by mouse. Requires constant
        // observation of mouse, which is costly.
        wade.app.onMouseMove = function(event) {
            Camera.mouseMove(event);
        };

        wade.app.onMouseWheel = function(event) {
            if (event.value > 0) {
                Camera.zoomIn();
            } else if (event. value < 0) {
                Camera.zoomOut();
            }
        };
    }
};


export default Events;
