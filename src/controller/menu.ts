import Camera from './camera';
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

const displayWelcome = function() {
    const color = 'white';
    const alignment = 'center';

    //Create the welcome text
    const welcomeText = new TextSprite('Welcome to Potayto-Potahto!', '32px Verdana', color, alignment);
    this.welcomeObject = new SceneObject(welcomeText);
    wade.addSceneObject(this.welcomeObject);
    this.welcomeObject.setPosition(0, -100);

    //Create the new game text
    const newGameText = new TextSprite('New Game', '20px Verdana', color, alignment);
    this.newGameObject = new SceneObject(newGameText);
    wade.addSceneObject(this.newGameObject);
    setupNewGame.call(this);

    // Create the Load Game text
    const loadGameText = new TextSprite('Load Game', '20px Verdana', color, alignment);
    this.loadGameObject = new SceneObject(loadGameText);
    wade.addSceneObject(this.loadGameObject);
    setupSaveGame.call(this);

    // Create the settings text
    const settingsText = new TextSprite('Settings', '20px Verdana', color, alignment);
    this.settingsObject = new SceneObject(settingsText);
    wade.addSceneObject(this.settingsObject);
    setupSettings.call(this);

};

function setupSettings() {
    this.settingsObject.setPosition(0, 100);
    setMouseInOut(this.settingsObject);

    // this.settingsObject.onClick = settings.call(this);
    // wade.addEventListener(this.loadGameObject, 'onClick');

}

function setupSaveGame() {
    this.loadGameObject.setPosition(0, 50);

    setMouseInOut(this.loadGameObject);

    // this.loadGameObject.onClick = loadGame.call(this);
    // wade.addEventListener(this.loadGameObject, 'onClick');

}

function setupNewGame() {
    this.newGameObject.setPosition(0, 0);

    setMouseInOut(this.newGameObject);

    this.newGameObject.onClick = function() {
        const clearscene = true;
        // load the map
        wade.loadScene('../public/grass_map.wsc', null, function() {
            //Add camera options for mouse and keyboard
            wade.app.onKeyDown = function(event) {
                if (event.keyCode === Keys.up() ) {
                    Camera.moveToTop();
                } else if (event.keyCode === Keys.down() ) {
                    Camera.moveToBottom();
                } else if (event.keyCode === Keys.left() ) {
                    Camera.moveToLeft();
                } else if (event.keyCode === Keys.right() ) {
                    Camera.moveToRight();
                }
            };

            wade.app.onKeyUp = function(event) {
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

            };

            wade.app.onMouseWheel = function(event) {
                if (event.value > 0) {
                    Camera.zoomIn();
                } else if (event. value < 0) {
                    Camera.zoomOut();
                }
            };

        }, clearscene);
    };
    wade.addEventListener(this.newGameObject, 'onClick');
}

// Helper function that returns a function that will change a textObject's
// color
function changeColor(textObject: any, color: string) {
    return function(event: any) {
        textObject.getSprite(0).setColor(color);
    };
}

// Helper function that adds color changes to a textObject on the
// mouseIn and MouseOut events
function setMouseInOut(textObject: any) {
    textObject.onMouseIn = changeColor(textObject, 'red');
    wade.addEventListener(textObject, 'onMouseIn');

    textObject.onMouseOut = changeColor(textObject, 'white');
    wade.addEventListener(textObject, 'onMouseOut');
}

export { displayWelcome };
