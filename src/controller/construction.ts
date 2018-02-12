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

};

export default Construction;
