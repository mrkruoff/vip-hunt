import Events from './events';
import Hud from './hud';

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
            Events.addGlobal();
            Hud.initialize();
            
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
