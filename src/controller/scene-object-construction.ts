/* scene-object-construction.ts
 *
 * The SceneObjectConstruction module contains functions for building various 
 * SceneObjects for the game.
 *
 */

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

const SceneObjectConstruction = {
    // This function returns a SceneObject for the Barracks.
    // 
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the Barracks SceneObject
    barracks: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        const barracks = wade.iso.createObject(objectData);

        return barracks;

    },
    // This function returns a SceneObject for the Stables.
    // 
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the Stables SceneObject
    stables: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        const stables = wade.iso.createObject(objectData);

        return stables;

    },
    // This function returns a SceneObject for the Tower.
    // 
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the Tower SceneObject
    towers: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        const tower = wade.iso.createObject(objectData);

        return tower;

    },
    // This function returns a SceneObject for the VIP.
    // 
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the VIP SceneObject
    vip: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        const VIP = wade.iso.createObject(objectData);

        return VIP;

    },
    // This function returns a SceneObject for the TownHall.
    // 
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the TownHall SceneObject
    townHalls: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        const townHall = wade.iso.createObject(objectData);

        return townHall;

    },
    // This function returns a SceneObject for the Swordsman.
    // 
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the Swordsman SceneObject
    swordsman: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        const swordsman = wade.iso.createObject(objectData);

        return swordsman;
    },
    // This function returns a SceneObject for the Archer.
    // 
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the Archer SceneObject
    archer: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        const archer = wade.iso.createObject(objectData);

        return archer;
    },
    // This function returns a SceneObject for the ArcherCalvary.
    // 
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the ArcherCalvary SceneObject
    archerCalvary: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        const archerCalvary = wade.iso.createObject(objectData);

        return archerCalvary;
    },
    // This function returns a SceneObject for the SpearCalvary.
    // 
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the SpearCalvary SceneObject
    spearCalvary: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        const spearCalvary = wade.iso.createObject(objectData);

        return spearCalvary;
    },
    // This function returns a SceneObject for the Gatherer.
    // 
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the Gatherer SceneObject
    gatherer: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        const gatherer = wade.iso.createObject(objectData);

        return gatherer;
    },
    // This function returns a SceneObject for the DrummerBoy.
    // 
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the DrummerBoy SceneObject
    drummerBoy: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        const drummerBoy = wade.iso.createObject(objectData);

        return drummerBoy;
    },

};

export default SceneObjectConstruction;
