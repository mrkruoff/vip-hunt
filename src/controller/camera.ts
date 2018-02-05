import Keys from './keys';

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

var Camera = {
    moveToTop: () => {
        let destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.y -= (wade.getScreenHeight() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToTop);
    },
    moveToLeft: () => {
        let destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.x -= (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToLeft);
    },
    moveToRight: () => {
        let destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.x += (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToRight);
    },
    moveToBottom: () => {
        let destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.y += (wade.getScreenHeight() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToBottom);
    },
    moveToNW: () => {
        let destination = wade.getCameraPosition(); 
        destination.y -= (wade.getScreenHeight() / 2);
        destination.x -= (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToNW);
    },
    moveToNE: () => {
        let destination = wade.getCameraPosition(); 
        destination.y -= (wade.getScreenHeight() / 2);
        destination.x += (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToNE);
    },
    moveToSE: () => {
        let destination = wade.getCameraPosition(); 
        destination.y += (wade.getScreenHeight() / 2);
        destination.x += (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToSE);
    },
    moveToSW: () => {
        let destination = wade.getCameraPosition(); 
        destination.y += (wade.getScreenHeight() / 2);
        destination.x -= (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToSW);
    }
}


export default Camera;
