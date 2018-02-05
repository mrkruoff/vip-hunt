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
            // observation of mouse, though.
            wade.app.onMouseMove = function(event) {
                console.log(event); 
                let rightLimit = wade.getScreenWidth() / 2;
                let leftLimit = -1 * rightLimit;
                let bottomLimit = wade.getScreenHeight() / 2;
                let topLimit = -1 * bottomLimit;
                let x = event.screenPosition.x;
                let y = event.screenPosition.y;

                //There are bugs here. What if player uses keys to move camera
                // at same time?
                if(Math.abs(y - topLimit) < 10) {
                    Camera.moveToTop(); 
                } else if (Math.abs(y - bottomLimit) < 10) {
                    Camera.moveToBottom(); 
                } else if (Math.abs(x - leftLimit) < 10) {
                    Camera.moveToLeft(); 
                } else if (Math.abs(x - rightLimit) < 10) {
                    Camera.moveToRight(); 
                } else if (Camera.isMoving()) {
                    Camera.stop()
                }

            }


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
