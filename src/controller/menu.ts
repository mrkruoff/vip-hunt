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
    const welcomeText = new TextSprite('Welcome to Potayto-Potahto!', '32px Verdana', color, alignment);
    const welcomeObject = new SceneObject(welcomeText);
    wade.addSceneObject(welcomeObject);
    welcomeObject.setPosition(0, -100);

    const newGameText = new TextSprite('New Game', '20px Verdana', color, alignment);
    const newGameObject = new SceneObject(newGameText);
    wade.addSceneObject(newGameObject);
    newGameObject.setPosition(0, 0);

    const saveGameText = new TextSprite('Load Game', '20px Verdana', color, alignment);
    const saveGameObject = new SceneObject(saveGameText);
    wade.addSceneObject(saveGameObject);
    saveGameObject.setPosition(0, 50);

    const settingsText = new TextSprite('Settings', '20px Verdana', color, alignment);
    const settingsObject = new SceneObject(settingsText);
    wade.addSceneObject(settingsObject);
    settingsObject.setPosition(0, 100);

};

export { displayWelcome };
