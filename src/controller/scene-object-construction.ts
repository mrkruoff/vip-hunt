
declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;


var SceneObjectConstruction = {
    barracks: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        let barracks = wade.iso.createObject(objectData);

        return barracks;

    },
    stables: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        let stables = wade.iso.createObject(objectData);

        return stables;

    },
    towers: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        let tower = wade.iso.createObject(objectData);

        return tower;

    },
    vip: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        } 
        let VIP = wade.iso.createObject(objectData);

        return VIP;
    
    },
    townHalls: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        let townHall = wade.iso.createObject(objectData);

        return townHall;

    },
    swordsman: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        let swordsman = wade.iso.createObject(objectData);

        return swordsman;
    },
    archer: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        let archer = wade.iso.createObject(objectData);

        return archer;
    },
    archerCalvary: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        let archerCalvary = wade.iso.createObject(objectData);

        return archerCalvary;
    },
    spearCalvary: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        let spearCalvary = wade.iso.createObject(objectData);

        return spearCalvary;
    },
    gatherer: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        let gatherer = wade.iso.createObject(objectData);

        return gatherer;
    },
    drummerBoy: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        let drummerBoy = wade.iso.createObject(objectData);

        return drummerBoy;
    },


};

export default SceneObjectConstruction;
