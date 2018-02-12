import JsonMap from './json-map';

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

const Construction = {
    barracks: (jsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(jsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        let barracks = wade.iso.createObject(objectData);

        return barracks;

    },
    stables: (jsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(jsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        return wade.iso.createObject(objectData);

    },
    towers: (jsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(jsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        return wade.iso.createObject(objectData);

    },
    townHalls: (jsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(jsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        return wade.iso.createObject(objectData);

    },
    swordsman: (jsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(jsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        }; 
        return wade.iso.createObject(objectData);
    },
    archer: (jsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(jsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        }; 
        return wade.iso.createObject(objectData);
    },
    archerCalvary: (jsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(jsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        }; 
        return wade.iso.createObject(objectData);
    },
    spearCalvary: (jsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(jsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        }; 
        return wade.iso.createObject(objectData);
    },
    gatherer: (jsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(jsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        }; 
        return wade.iso.createObject(objectData);
    },
    drummerBoy: (jsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(jsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        }; 
        return wade.iso.createObject(objectData);
    },
    

};

export default Construction;
