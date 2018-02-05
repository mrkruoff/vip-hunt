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

const Camera = {
    moveToTop: () => {
        const destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.y -= (wade.getScreenHeight() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToTop);
    },
    moveToLeft: () => {
        const destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.x -= (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToLeft);
    },
    moveToRight: () => {
        const destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.x += (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToRight);
    },
    moveToBottom: () => {
        const destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.y += (wade.getScreenHeight() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToBottom);
    },
    moveToNW: () => {
        const destination = wade.getCameraPosition();
        destination.y -= (wade.getScreenHeight() / 2);
        destination.x -= (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToNW);
    },
    moveToNE: () => {
        const destination = wade.getCameraPosition();
        destination.y -= (wade.getScreenHeight() / 2);
        destination.x += (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToNE);
    },
    moveToSE: () => {
        const destination = wade.getCameraPosition();
        destination.y += (wade.getScreenHeight() / 2);
        destination.x += (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToSE);
    },
    moveToSW: () => {
        const destination = wade.getCameraPosition();
        destination.y += (wade.getScreenHeight() / 2);
        destination.x -= (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.global.cameraSpeed, Camera.moveToSW);
    },
    zoomIn: () => {
        const destination = wade.getCameraPosition();
        destination.z -= 0.5;
        wade.moveCamera(destination, wade.app.global.zoomSpeed);
    },
    zoomOut: () => {
        const destination = wade.getCameraPosition();
        destination.z += 0.5;
        wade.moveCamera(destination, wade.app.global.zoomSpeed);
    },
};

export default Camera;
