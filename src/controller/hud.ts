
declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;


var Hud = {
    initialize: () => {
        let base = new Sprite('../public/sprites/hud/scroll.png', 10);
        base.setSize(350, 5000);
        let scroll = new SceneObject(base);
        scroll.setPosition(0, 400);
        scroll.setRotation(1.5708);
        wade.addSceneObject(scroll);
        wade.setLayerTransform(10, 0, 0);
    }
}

export default Hud;
