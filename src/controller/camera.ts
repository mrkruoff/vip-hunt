/* camera.ts
 *
 *
 * The Camera module contains all the functions that cause the Camera
 * to do something in the game as the user is playing.
 */

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
    // This function sets the bounds for the camera to ensure the
    // player can't move it to the 'infinte darkness' portion of the world.
    setBounds: () => {
        wade.setCameraBounds(-1500, 1500, -1500, 1500, 3, 10);
    },
    // This function moves the camera as far to the top as it can go.
    // it sets the GLOBAL cameraIsMoving property to show that the camera is moving.
    moveToTop: () => {
        const destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.y -= (wade.getScreenHeight() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToTop);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    // This function moves the camera as far to the left as it can go.
    // It sets the GLOBAL cameraIsMoving property to show that the camera is moving.
    moveToLeft: () => {
        const destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.x -= (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToLeft);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    // This function moves the camera as far to the right as it can go.
    // It sets the GLOBAL cameraIsMoving property to show that the camera is moving.
    moveToRight: () => {
        const destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.x += (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToRight);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    // This function moves the camera as far to the bottom as it can go.
    // It sets the GLOBAL cameraIsMoving property to show that the camera is moving.
    moveToBottom: () => {
        const destination = wade.getCameraPosition();
        //Set new destiination relative to current position
        destination.y += (wade.getScreenHeight() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToBottom);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    // This function moves the camera as far to the NW as it can go.
    // It sets the GLOBAL cameraIsMoving property to show that the camera is moving.
    moveToNW: () => {
        const destination = wade.getCameraPosition();
        destination.y -= (wade.getScreenHeight() / 2);
        destination.x -= (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToNW);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    // This function moves the camera as far to the NE as it can go.
    // It sets the GLOBAL cameraIsMoving property to show that the camera is moving.
    moveToNE: () => {
        const destination = wade.getCameraPosition();
        destination.y -= (wade.getScreenHeight() / 2);
        destination.x += (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToNE);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    // This function moves the camera as far to the SE as it can go.
    // It sets the GLOBAL cameraIsMoving property to show that the camera is moving.
    moveToSE: () => {
        const destination = wade.getCameraPosition();
        destination.y += (wade.getScreenHeight() / 2);
        destination.x += (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToSE);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    // This function moves the camera as far to the SW as it can go.
    // It sets the GLOBAL cameraIsMoving property to show that the camera is moving.
    moveToSW: () => {
        const destination = wade.getCameraPosition();
        destination.y += (wade.getScreenHeight() / 2);
        destination.x -= (wade.getScreenWidth() / 2);
        wade.moveCamera(destination, wade.getSceneObject('global').cameraSpeed, Camera.moveToSW);
        wade.getSceneObject('global').cameraIsMoving = true;
    },
    // This function causes the camera to zoom in just a little.
    // It sets the GLOBAL cameraIsMoving property to show that the camera is moving.
    zoomIn: () => {
        const destination = wade.getCameraPosition();
        destination.z -= 0.1;
        wade.moveCamera(destination, wade.getSceneObject('global').zoomSpeed);
    },
    // This function causes the camera to zoom OUT just a little.
    // It sets the GLOBAL cameraIsMoving property to show that the camera is moving.
    zoomOut: () => {
        const destination = wade.getCameraPosition();
        destination.z += 0.1;
        wade.moveCamera(destination, wade.getSceneObject('global').zoomSpeed);
    },
    // This function stops the camera from moving, if it was moving
    stop: () => {
        wade.moveCamera(wade.getCameraPosition(), 40000);
        wade.getSceneObject('global').cameraIsMoving = false;
    },
    // This function checks whether the camera was moving.
    //
    // returns:
    //  @boolean: whether the camera is moving
    isMoving: () => {
        return wade.getSceneObject('global').cameraIsMoving;
    },
    // This function is a callback that sets up how the
    // camera should move in gameplay in response to
    // the mouse moving. Currently the camera moves only
    // when the mouse moves to the edges of the screen.
    //
    // The camera stops moving when the mouse moves out
    // of the edges of the screen.
    //
    // parameters:
    //  @ screenPosition: the screenPosition the mouse was moving at;
    //      Has x and y properties.
    mouseMove: (screenPosition) => {
        const x = screenPosition.x;
        const y = screenPosition.y;

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

        // Only allow the mouse to affect the camera if the keys aren't
        // moving the camera.
        if ( Camera.noKeysPressed() ) {
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
        }

    },
    // This function is a callback that sets the events
    // for when keys are pressed. Currently this consists
    // only of key presses that move the camera.
    //
    // Perhaps this belongs in a KeyShortcuts module
    // in a separate file?
    //
    // parameters:
    //  @ keyCode: the code of a key that the player pressed down
    keyDown: (keyCode: number) => {
        // Stop moving the camera if any opposing movement keys are pressed.
        if(Camera.opposingKeysPressed() ) {
            Camera.stop();
            return;
        }

        // Attempt to take control away from the mouse camera movement. Will this work?
        if (Camera.isMoving() ) {
            Camera.stop();
        }
        
        // Move the camera according to the currently pressed keys
        // Could consider replacing all this with checks to see if any two pairs of keys
        // are currently down. Not sure if it would work though.
        if (keyCode === Keys.up() ) {
            if(wade.isKeyDown(Keys.left() ) ) {
                Camera.moveToNW();
            } else if ( wade.isKeyDown(Keys.right() ) ) {
                Camera.moveToNE();
            } else {
                Camera.moveToTop();
            }
        } else if (keyCode === Keys.down() ) {
            if(wade.isKeyDown(Keys.left() ) ) {
                Camera.moveToSW();
            } else if (wade.isKeyDown(Keys.right() ) ) {
                Camera.moveToSE();
            } else {
                Camera.moveToBottom();
            }
        } else if (keyCode === Keys.left() ) {
            if(wade.isKeyDown(Keys.up()) {
                Camera.moveToNW();
            } else if (wade.isKeyDown(Keys.down()) ) {
                Camera.moveToSW(); 
            } else {
                Camera.moveToLeft();
            }
        } else if (keyCode === Keys.right() ) {
            if(wade.isKeyDown(Keys.up()) {
                Camera.moveToNE();
            } else if (wade.isKeyDown(Keys.down()) ) {
                Camera.moveToSE(); 
            } else {
                Camera.moveToRight();
            }
        }
    },
    // This function is a callback that sets the events for when keys
    // are released. Currently this consists only of key releases that
    // stop the camera form moving.
    //
    // Perhaps this belongs in a KeyShortcuts module
    // in a separate file?
    //
    keyUp: () => {
        // If no camera keys are pressed, stop all movement of camera.
        if ( Camera.noKeysPressed() ) {
            Camera.stop();
            return;
        }
        if (Camera.opposingKeysPressed() ) {
            Camera.stop();
            return;
        }

        // If there are still some Camera keys pressed, then we must continue
        // moving in that specified direction
        if( wade.isKeyDown(Keys.up() ) {
            Camera.moveToTop();
        } else if (wade.isKeyDown(Keys.down() ) {
            Camera.moveToBottom(); 
        } else if (wade.isKeyDown(Keys.left() ) {
            Camera.moveToLeft();
        } else if (wade.isKeyDown(Keys.right() ) {
            Camera.moveToRight();
        } else {
            // If none of the Camera keys are pressed, stop moving
            Camera.stop();
        }
        
    },
    opposingKeysPressed: (): boolean => {
        if(wade.isKeyDown(Keys.left()) && wade.isKeyDown(Keys.right() ) {
            return true;
        }
        if(wade.isKeyDown(Keys.up()) && wade.isKeyDown(Keys.down() ) {
            return true;
        }
    },
    noKeysPressed: (): boolean => {
        return !wade.isKeyDown(Keys.up() ) &&
                !wade.isKeyDown(Keys.down() ) &&
                !wade.isKeyDown(Keys.left() ) &&
                !wade.isKeyDown(Keys.right() );
    }
};

export default Camera;
