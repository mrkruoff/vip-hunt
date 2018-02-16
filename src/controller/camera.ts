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
    setBounds: () => {
        wade.setCameraBounds(-1500, 1500, -1500, 1500, 3, 10);
    },
    moveToTop: () => {
        const destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.y -= (wade.getScreenHeight() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToTop);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    moveToLeft: () => {
        const destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.x -= (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToLeft);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    moveToRight: () => {
        const destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.x += (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToRight);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    moveToBottom: () => {
        const destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.y += (wade.getScreenHeight() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToBottom);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    moveToNW: () => {
        const destination = wade.getCameraPosition();
        destination.y -= (wade.getScreenHeight() / 2);
        destination.x -= (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToNW);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    moveToNE: () => {
        const destination = wade.getCameraPosition();
        destination.y -= (wade.getScreenHeight() / 2);
        destination.x += (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToNE);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    moveToSE: () => {
        const destination = wade.getCameraPosition();
        destination.y += (wade.getScreenHeight() / 2);
        destination.x += (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToSE);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    moveToSW: () => {
        const destination = wade.getCameraPosition();
        destination.y += (wade.getScreenHeight() / 2);
        destination.x -= (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToSW);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    zoomIn: () => {
        const destination = wade.getCameraPosition();
        destination.z -= 0.1;
        wade.moveCamera(destination, wade.getSceneObject('global').zoomSpeed);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    zoomOut: () => {
        const destination = wade.getCameraPosition();
        destination.z += 0.1;
        wade.moveCamera(destination, wade.getSceneObject('global').zoomSpeed);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    stop: () => {
        wade.moveCamera(wade.getCameraPosition(), 40000);
        wade.getSceneObject('global').cameraIsMoving = false;
    },
    isMoving: () => {
        return wade.getSceneObject('global').cameraIsMoving;
    },
    mouseMove: (event) => {
        const x = event.screenPosition.x;
        const y = event.screenPosition.y;

        const rightLimit = wade.getScreenWidth() / 2;
        const rightDiff = Math.abs(x - rightLimit);

        const leftLimit = -1 * rightLimit;
        const leftDiff = Math.abs(x - leftLimit);

        const bottomLimit = wade.getScreenHeight() / 2;
        const bottomDiff = Math.abs(y - bottomLimit);

        const topLimit = -1 * bottomLimit;
        const topDiff = Math.abs(y - topLimit);

        const edgeTol = 20;
        const cornerTol = 40;

        //There are bugs here. What if player uses keys to move camera
        // at same time?
        if (topDiff < cornerTol && leftDiff < cornerTol) {
            Camera.moveToNW();
        } else if (topDiff < cornerTol && rightDiff < cornerTol) {
            Camera.moveToNE();
        } else if (bottomDiff < cornerTol && rightDiff < cornerTol) {
            Camera.moveToSE();
        } else if (bottomDiff < cornerTol && leftDiff < cornerTol) {
            Camera.moveToSW();
        } else if (topDiff < edgeTol) {
            Camera.moveToTop();
        } else if (bottomDiff < edgeTol) {
            Camera.moveToBottom();
        } else if (leftDiff < edgeTol) {
            Camera.moveToLeft();
        } else if (rightDiff < edgeTol) {
            Camera.moveToRight();
        } else if (Camera.isMoving()) {
            Camera.stop();
        }

    },
    keyDown: (event) => {
        if (event.keyCode === Keys.up() ) {
            Camera.moveToTop();
        } else if (event.keyCode === Keys.down() ) {
            Camera.moveToBottom();
        } else if (event.keyCode === Keys.left() ) {
            Camera.moveToLeft();
        } else if (event.keyCode === Keys.right() ) {
            Camera.moveToRight();
        }
    },
    keyUp: (event) => {
        //Once player lets go, stop the camera from moving
        if (event.keyCode === Keys.up() ) {
            Camera.stop();
        } else if (event.keyCode === Keys.down() ) {
            Camera.stop();
        } else if (event.keyCode === Keys.left() ) {
            Camera.stop();
        } else if (event.keyCode === Keys.right() ) {
            Camera.stop();
        }
    },
};

export default Camera;