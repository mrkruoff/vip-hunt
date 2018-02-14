
declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

var Id = {
    getUnitId: () => {
        let id;
        const global = wade.getSceneObject('global');
        if(!global.playerUnitId) {
            global.playerUnitId = 0; 
        }
        id = global.playerUnitId;
        global.playerUnitId += 1;

        return id;
    
    },
    getBuildId: () => {
        let id;
        const global = wade.getSceneObject('global');
        if(!global.playerBuildId) {
            global.playerBuildId = 0; 
        }
        id = global.playerBuildId;
        global.playerBuildId += 1;

        return id;
    
    },

}


export default Id;
