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

import ImageMap from './image-map';

var idleNames = ['Idle_iso_n', 'Idle_iso_s', 'Idle_iso_e', 'Idle_iso_w', 
            'Idle_iso_nw', 'Idle_iso_ne', 'Idle_iso_sw', 'Idle_iso_se'
];
var walkNames = ['Walk_iso_n', 'Walk_iso_s', 'Walk_iso_e', 'Walk_iso_w',
            'Walk_iso_nw', 'Walk_iso_ne', 'Walk_iso_sw', 'Walk_iso_se'
];
var attackNames = ['Attack_iso_n', 'Attack_iso_s', 'Attack_iso_e', 'Attack_iso_w',
            'Attack_iso_nw', 'Attack_iso_ne', 'Attack_iso_sw', 'Attack_iso_se'
];
var deathNames = ['Death_iso_n', 'Death_iso_s', 'Death_iso_e', 'Death_iso_w',
            'Death_iso_nw', 'Death_iso_ne', 'Death_iso_sw', 'Death_iso_se'
];


function addAnims(sceneObject, animsArray, namesArray, xCells, yCells, speed, looping, start, end) {
    for( let i = 0; i < animsArray.length; i++) {
        let anim = new Animation(animsArray[i], xCells, yCells, speed, looping,
                                start, end);
        sceneObject.getSprite(0).addAnimation(namesArray[i], anim);
    }

}

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
        var run = new Animation("../js/../public/sprites/units/test_spritesheet.png",
                6, 3, 20, true, 0, 15);
        var sprite = wade.getJson(imageJsonFile);
        const objectData = {
            sprites: sprite,
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        const swordsman = wade.iso.createObject(objectData);

        let idleAnims = [
            ImageMap.swordsman_N_idle, ImageMap.swordsman_S_idle, ImageMap.swordsman_E_idle,
            ImageMap.swordsman_W_idle, ImageMap.swordsman_NW_idle, ImageMap.swordsman_NE_idle,
            ImageMap.swordsman_SW_idle, ImageMap.swordsman_SE_idle
        ];
        let startFrame = 0;
        let endFrame = 14;
        let xCells = 15;
        let yCells = 1;
        let speed = 10;
        let looping = true;
        addAnims(swordsman, idleAnims, idleNames, xCells, yCells,
                 speed, looping, startFrame, endFrame);


        let walkAnims = [
            ImageMap.swordsman_N_walk, ImageMap.swordsman_S_walk,
            ImageMap.swordsman_E_walk, ImageMap.swordsman_W_walk,
            ImageMap.swordsman_NW_walk, ImageMap.swordsman_NE_walk,
            ImageMap.swordsman_SW_walk, ImageMap.swordsman_SE_walk,
        ];
        startFrame = 0;
        endFrame = 15;
        xCells = 3;
        yCells = 6;
        speed = 30;
        looping = true;
        addAnims(swordsman, walkAnims, walkNames, xCells, yCells,
                speed, looping, startFrame, endFrame);

        let attackAnims = [
            ImageMap.swordsman_N_attack, ImageMap.swordsman_S_attack,
            ImageMap.swordsman_E_attack, ImageMap.swordsman_W_attack,
            ImageMap.swordsman_NW_attack, ImageMap.swordsman_NE_attack,
            ImageMap.swordsman_SW_attack, ImageMap.swordsman_SE_attack,
        ];
        startFrame = 0;
        endFrame = 15;
        xCells = 3;
        yCells = 6;
        speed = 15;
        looping = false;
        addAnims(swordsman, attackAnims, attackNames, xCells, yCells,
                speed, looping, startFrame, endFrame);

        let deathAnims = [
            ImageMap.swordsman_N_death, ImageMap.swordsman_S_death,
            ImageMap.swordsman_E_death, ImageMap.swordsman_W_death,
            ImageMap.swordsman_NW_death, ImageMap.swordsman_NE_death,
            ImageMap.swordsman_SW_death, ImageMap.swordsman_SE_death,
        ];
        startFrame = 0;
        endFrame = 13;
        xCells = 14;
        yCells = 1;
        speed = 15;
        looping = false;
        addAnims(swordsman, deathAnims, deathNames, xCells, yCells,
                speed, looping, startFrame, endFrame);


        swordsman.getSprite(0).setSize(30, 80);


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
    stone: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        };
        const stone = wade.iso.createObject(objectData);

        return stone;
    },
    wood: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        };
        const wood = wade.iso.createObject(objectData);

        return wood;
    },
    food: (imageJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        };
        const food = wade.iso.createObject(objectData);

        return food;
    },

};

export default SceneObjectConstruction;
