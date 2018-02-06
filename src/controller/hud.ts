
declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

const Hud = {
    initialize: () => {

        //THIS NEEDS REWORKING. For some reason the sprites won't move
        // within the scene object!
        const scrollSprite = new Sprite('../public/sprites/hud/scroll.png', 10);
        scrollSprite.setSize(350, 5000);

        const buildingSprite = new Sprite('../public/sprites/hud/building.png', 9);
        buildingSprite.setSize(50, 50);

        //Add scroll to scene
        const scroll = new SceneObject(scrollSprite);
        scroll.setPosition(0, 400);
        scroll.setRotation(1.5708);
        wade.addSceneObject(scroll);
        wade.setLayerTransform(10, 0, 0);

        //Add building button to scene.
        wade.app.building = new SceneObject(buildingSprite);
        const building = wade.app.building;
        building.setPosition((-1 * wade.getScreenWidth() / 2) + 100, (wade.getScreenHeight() / 2) - 100);
        wade.addSceneObject(building);
        wade.setLayerTransform(9, 0, 0);

        building.onClick = function(event) {
            console.log(event);
        };
        wade.addEventListener(building, 'onClick');
    },
};

export default Hud;
