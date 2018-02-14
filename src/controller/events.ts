import Camera from './camera';
import Mouse from './mouse';

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

const Events = {
    addCamera: () => {
    //Add camera options for mouse and keyboard
        wade.app.onKeyDown = function(event) {
            Camera.keyDown(event);
        };

        wade.app.onKeyUp = function(event) {
            Camera.keyUp(event);
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
    },
    removeCamera: () => {
        wade.app.onKeyDown = null;
        wade.app.onKeyUp = null;
        wade.app.onMouseMove = null;
        wade.app.onMouseWheel = null;
    },
    addSelectedUnit: (selectedUnit) => {
        wade.app.selectedUnit = selectedUnit;
        wade.app.onIsoTerrainMouseDown = (event) => {
            if (event.button === Mouse.left) {
                //Cancel previous destination and send unit to new coordinates
                selectedUnit.getBehavior('IsoCharacter').clearDestinations();
                selectedUnit.getBehavior('IsoCharacter').setDestination(event.gridCoords);
            } else if (event.button === Mouse.right) {

            }
        };

    },
    removeSelectedUnit: () => {
        wade.app.selectedUnit = null;

    },
    getSelectedUnit: () => {
        return wade.app.selectedUnit;
    },

};

export default Events;
