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

var Construction = {
    barracks: (jsonFile) => {
        const objectData = {
            sprites: wade.getJson(jsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2}

        };
        return wade.iso.createObject(objectData);
    
    },
    stables: (jsonFile) => {
        const objectData = {
            sprites: wade.getJson(jsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2}

        };
        return wade.iso.createObject(objectData);
    
    },
    towers: (jsonFile) => {
        const objectData = {
            sprites: wade.getJson(jsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2}

        };
        return wade.iso.createObject(objectData);
    
    },
    townHalls: (jsonFile) => {
        const objectData = {
            sprites: wade.getJson(jsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2}

        };
        return wade.iso.createObject(objectData);
    
    },

};


export default Construction;
