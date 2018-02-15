
declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

const Id = {
    getUnitId: () => {
        let id;
        const global = wade.getSceneObject('global');
        if (!global.unitId) {
            global.unitId = 0;
        }
        id = global.unitId;
        global.unitId += 1;

        return id;

    },
    getBuildId: () => {
        let id;
        const global = wade.getSceneObject('global');
        if (!global.buildId) {
            global.buildId = 0;
        }
        id = global.buildId;
        global.buildId += 1;

        return id;

    },

};

export default Id;
