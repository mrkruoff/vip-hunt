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
        wade.moveCamera(destination, wade.app.cameraSpeed, Camera.moveToTop);
        wade.cameraIsMoving = true;
    },
    moveToLeft: () => {
        const destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.x -= (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.cameraSpeed, Camera.moveToLeft);
        wade.cameraIsMoving = true;
    },
    moveToRight: () => {
        const destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.x += (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.cameraSpeed, Camera.moveToRight);
        wade.cameraIsMoving = true;
    },
    moveToBottom: () => {
        const destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.y += (wade.getScreenHeight() / 2);
        wade.moveCamera(destination, wade.app.cameraSpeed, Camera.moveToBottom);
        wade.cameraIsMoving = true;
    },
    moveToNW: () => {
        const destination = wade.getCameraPosition();
        destination.y -= (wade.getScreenHeight() / 2);
        destination.x -= (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.cameraSpeed, Camera.moveToNW);
        wade.cameraIsMoving = true;
    },
    moveToNE: () => {
        const destination = wade.getCameraPosition();
        destination.y -= (wade.getScreenHeight() / 2);
        destination.x += (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.cameraSpeed, Camera.moveToNE);
        wade.cameraIsMoving = true;
    },
    moveToSE: () => {
        const destination = wade.getCameraPosition();
        destination.y += (wade.getScreenHeight() / 2);
        destination.x += (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.cameraSpeed, Camera.moveToSE);
        wade.cameraIsMoving = true;
    },
    moveToSW: () => {
        const destination = wade.getCameraPosition();
        destination.y += (wade.getScreenHeight() / 2);
        destination.x -= (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.app.cameraSpeed, Camera.moveToSW);
        wade.cameraIsMoving = true;
    },
    zoomIn: () => {
        const destination = wade.getCameraPosition();
        destination.z -= 0.1;
        wade.moveCamera(destination, wade.app.zoomSpeed);
        wade.cameraIsMoving = true;
    },
    zoomOut: () => {
        const destination = wade.getCameraPosition();
        destination.z += 0.1;
        wade.moveCamera(destination, wade.app.zoomSpeed);
        wade.cameraIsMoving = true;
    },
    stop: () => {
        wade.moveCamera(wade.getCameraPosition(), 40000);
        wade.cameraIsMoving = false;
    },
    isMoving: () => {
        return wade.cameraIsMoving;
    },
};

export default Camera;
