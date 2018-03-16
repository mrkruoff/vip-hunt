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
import JsonMap from './json-map';

const idleNames = ['Idle_iso_n', 'Idle_iso_s', 'Idle_iso_e', 'Idle_iso_w',
            'Idle_iso_nw', 'Idle_iso_ne', 'Idle_iso_sw', 'Idle_iso_se',
];
const walkNames = ['Walk_iso_n', 'Walk_iso_s', 'Walk_iso_e', 'Walk_iso_w',
            'Walk_iso_nw', 'Walk_iso_ne', 'Walk_iso_sw', 'Walk_iso_se',
];
const attackNames = ['Attack_iso_n', 'Attack_iso_s', 'Attack_iso_e', 'Attack_iso_w',
            'Attack_iso_nw', 'Attack_iso_ne', 'Attack_iso_sw', 'Attack_iso_se',
];
const deathNames = ['Death_iso_n', 'Death_iso_s', 'Death_iso_e', 'Death_iso_w',
            'Death_iso_nw', 'Death_iso_ne', 'Death_iso_sw', 'Death_iso_se',
];

function addAnims(sceneObject, animsArray, namesArray, xCells, yCells, speed, looping, start, end, offset) {
    for ( let i = 0; i < animsArray.length; i++) {
        // let anim = new Animation(animsArray[i], xCells, yCells, speed, looping,
         //                       start, end);
        const anim = new Animation({
            type: 'Animation',
            startFrame: start,
            endFrame: end,
            numCells: {x: xCells, y: yCells},
            image: animsArray[i],
            speed,
            looping,
            offset,
            autoResize: false,
        });
        sceneObject.getSprite(0).addAnimation(namesArray[i], anim);
    }

}

function addAnimData(spriteData, animsArray, namesArray, xCells, yCells, speed, looping, start, end, offset) {
    for ( let i = 0; i < animsArray.length; i++) {
        const animData = {
            type: 'Animation',
            startFrame: start,
            endFrame: end,
            numCells: {x: xCells, y: yCells},
            image: animsArray[i],
            speed,
            looping,
            offset,
            name: namesArray[i],
            autoResize: false,
        };

        spriteData.animations[namesArray[i]] = animData;
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
            sprites: [wade.getJson(imageJsonFile)],
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        objectData.sprites.push(wade.getJson(JsonMap.selected_marker));
        objectData.sprites[1].image = ImageMap.player_unit_marker;
        objectData.sprites[1].size = {x: 700, y: 700};
        objectData.sprites[1].offset = { x: 0, y: -100 };
        objectData.sprites.push(wade.getJson(JsonMap.enemy_marker));
        objectData.sprites[2].image = ImageMap.enemy_unit_marker;
        objectData.sprites[2].size = {x: 3000, y: 3000};
        objectData.sprites[2].offset = {x: 0, y: -300};
        const barracks = wade.iso.createObject(objectData, {x: 5, z: -2} );

        return barracks;

    },
    // This function returns a SceneObject for the Stables.
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the Stables SceneObject
    stables: (imageJsonFile: string) => {
        const objectData = {
            sprites: [wade.getJson(imageJsonFile)],
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        objectData.sprites.push(wade.getJson(JsonMap.selected_marker));
        objectData.sprites[1].image = ImageMap.player_unit_marker;
        objectData.sprites[1].size = {x: 700, y: 700};
        objectData.sprites[1].offset = { x: 0, y: -100 };
        objectData.sprites.push(wade.getJson(JsonMap.enemy_marker));
        objectData.sprites[2].image = ImageMap.enemy_unit_marker;
        objectData.sprites[2].size = {x: 3000, y: 3000};
        objectData.sprites[2].offset = {x: 0, y: -300};
        const stables = wade.iso.createObject(objectData, {x: 5, z: -2} );

        return stables;

    },
    // This function returns a SceneObject for the Tower.
    //
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the Tower SceneObject
    towers: (imageJsonFile: string) => {
        const objectData = {
            sprites: [wade.getJson(imageJsonFile)],
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},

        };
        objectData.sprites.push(wade.getJson(JsonMap.selected_marker));
        objectData.sprites[1].image = ImageMap.player_unit_marker;
        objectData.sprites[1].size = {x: 700, y: 700};
        objectData.sprites[1].offset = { x: 0, y: -100 };
        objectData.sprites.push(wade.getJson(JsonMap.enemy_marker));
        objectData.sprites[2].image = ImageMap.enemy_unit_marker;
        objectData.sprites[2].size = {x: 3000, y: 3000};
        objectData.sprites[2].offset = {x: 0, y: -300};
        const tower = wade.iso.createObject(objectData, {x: 5, z: -2} );

        return tower;

    },
    // This function returns a SceneObject for the VIP.
    //
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the VIP SceneObject
    vip: (imageJsonFile: string) => {
        const objectData = {
            sprites: [wade.getJson(imageJsonFile)],
            gridSize: {x: 1, z: 1},
            // collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        const offset = {x: 0, y: -90};
        objectData.sprites[0].size = {x: 500, y: 500};

        const idleAnims = [
            ImageMap.vip_N_idle, ImageMap.vip_S_idle, ImageMap.vip_E_idle,
            ImageMap.vip_W_idle, ImageMap.vip_NW_idle, ImageMap.vip_NE_idle,
            ImageMap.vip_SW_idle, ImageMap.vip_SE_idle,
        ];
        let startFrame = 0;
        let endFrame = 8;
        let xCells = 3;
        let yCells = 3;
        let speed = 7;
        let looping = true;
        addAnimData(objectData.sprites[0], idleAnims, idleNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const walkAnims = [
            ImageMap.vip_N_walk, ImageMap.vip_S_walk,
            ImageMap.vip_E_walk, ImageMap.vip_W_walk,
            ImageMap.vip_NW_walk, ImageMap.vip_NE_walk,
            ImageMap.vip_SW_walk, ImageMap.vip_SE_walk,
        ];
        startFrame = 0;
        endFrame = 7;
        xCells = 3;
        yCells = 3;
        speed = 15;
        looping = true;
        addAnimData(objectData.sprites[0], walkAnims, walkNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const attackAnims = [
            ImageMap.vip_N_attack, ImageMap.vip_S_attack,
            ImageMap.vip_E_attack, ImageMap.vip_W_attack,
            ImageMap.vip_NW_attack, ImageMap.vip_NE_attack,
            ImageMap.vip_SW_attack, ImageMap.vip_SE_attack,
        ];
        startFrame = 0;
        endFrame = 4;
        xCells = 5;
        yCells = 1;
        speed = 10;
        looping = false;
        addAnimData(objectData.sprites[0], attackAnims, attackNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const deathAnims = [
            ImageMap.vip_N_death, ImageMap.vip_S_death,
            ImageMap.vip_E_death, ImageMap.vip_W_death,
            ImageMap.vip_NW_death, ImageMap.vip_NE_death,
            ImageMap.vip_SW_death, ImageMap.vip_SE_death,
        ];
        startFrame = 0;
        endFrame = 4;
        xCells = 5;
        yCells = 1;
        speed = 10;
        looping = false;
        addAnimData(objectData.sprites[0], deathAnims, deathNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        objectData.sprites[0].currentAnimation = idleNames[1];
        objectData.sprites.push(wade.getJson(JsonMap.selected_marker));
        objectData.sprites[1].image = ImageMap.player_unit_marker;
        objectData.sprites[1].size = {x: 200, y: 200};
        objectData.sprites[1].offset = {x: 0, y: 5 };
        objectData.sprites.push(wade.getJson(JsonMap.enemy_marker));
        objectData.sprites[2].image = ImageMap.enemy_unit_marker;
        objectData.sprites[2].size = {x: 750, y: 750};
        objectData.sprites[2].offset = {x: 0, y: -50 };
        objectData.sprites.push(wade.getJson(JsonMap.bleed_marker));
        const vip = wade.iso.createObject(objectData);
        return vip;

    },
    // This function returns a SceneObject for the TownHall.
    //
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the TownHall SceneObject
    townHalls: (imageJsonFile: string) => {
        const objectData = {
            sprites: [wade.getJson(imageJsonFile)],
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},
        };
        objectData.sprites.push(wade.getJson(JsonMap.selected_marker));
        objectData.sprites[1].image = ImageMap.player_unit_marker;
        objectData.sprites[1].size = {x: 700, y: 700};
        objectData.sprites[1].offset = { x: 0, y: -100 };
        objectData.sprites.push(wade.getJson(JsonMap.enemy_marker));
        objectData.sprites[2].image = ImageMap.enemy_unit_marker;
        objectData.sprites[2].size = {x: 3000, y: 3000};
        objectData.sprites[2].offset = {x: 0, y: -300};
        const townHall = wade.iso.createObject(objectData, {x: 5, z: -2} );

        return townHall;

    },
    // This function returns a SceneObject for the Swordsman.
    //
    // parameters
    //  @ imageJsonFile: filepath to the JSON file that will be used
    //      to construct the Swordsman SceneObject
    swordsman: (imageJsonFile: string) => {
        const run = new Animation('../js/../public/sprites/units/test_spritesheet.png',
                6, 3, 20, true, 0, 15);
        const sprite = wade.getJson(imageJsonFile);
        const objectData = {
            sprites: [wade.getJson(imageJsonFile)],
            gridSize: {x: 1, z: 1},
            // collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        const offset = {x: 0, y: -50};
        objectData.sprites[0].size = {x: 400, y: 400};

        const idleAnims = [
            ImageMap.swordsman_N_idle, ImageMap.swordsman_S_idle, ImageMap.swordsman_E_idle,
            ImageMap.swordsman_W_idle, ImageMap.swordsman_NW_idle, ImageMap.swordsman_NE_idle,
            ImageMap.swordsman_SW_idle, ImageMap.swordsman_SE_idle,
        ];
        let startFrame = 0;
        let endFrame = 14;
        let xCells = 15;
        let yCells = 1;
        let speed = 10;
        let looping = true;
        addAnimData(objectData.sprites[0], idleAnims, idleNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const walkAnims = [
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
        addAnimData(objectData.sprites[0], walkAnims, walkNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const attackAnims = [
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
        addAnimData(objectData.sprites[0], attackAnims, attackNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const deathAnims = [
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
        addAnimData(objectData.sprites[0], deathAnims, deathNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        objectData.sprites[0].currentAnimation = idleNames[1];
        objectData.sprites.push(wade.getJson(JsonMap.selected_marker));
        objectData.sprites[1].image = ImageMap.player_unit_marker;
        objectData.sprites[1].size = {x: 200, y: 200};
        objectData.sprites[1].offset = {x: 0, y: 5 };
        objectData.sprites.push(wade.getJson(JsonMap.enemy_marker));
        objectData.sprites[2].image = ImageMap.enemy_unit_marker;
        objectData.sprites[2].size = {x: 750, y: 750};
        objectData.sprites[2].offset = {x: 0, y: -50 };
        objectData.sprites.push(wade.getJson(JsonMap.bleed_marker));
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
            sprites: [wade.getJson(imageJsonFile)],
            gridSize: {x: 1, z: 1},
            // collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        const offset = {x: 0, y: -50};
        objectData.sprites[0].size = {x: 400, y: 400};

        const idleAnims = [
            ImageMap.archer_N_idle, ImageMap.archer_S_idle, ImageMap.archer_E_idle,
            ImageMap.archer_W_idle, ImageMap.archer_NW_idle, ImageMap.archer_NE_idle,
            ImageMap.archer_SW_idle, ImageMap.archer_SE_idle,
        ];
        let startFrame = 0;
        let endFrame = 14;
        let xCells = 15;
        let yCells = 1;
        let speed = 10;
        let looping = true;
        addAnimData(objectData.sprites[0], idleAnims, idleNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const walkAnims = [
            ImageMap.archer_N_walk, ImageMap.archer_S_walk,
            ImageMap.archer_E_walk, ImageMap.archer_W_walk,
            ImageMap.archer_NW_walk, ImageMap.archer_NE_walk,
            ImageMap.archer_SW_walk, ImageMap.archer_SE_walk,
        ];
        startFrame = 0;
        endFrame = 15;
        xCells = 3;
        yCells = 6;
        speed = 30;
        looping = true;
        addAnimData(objectData.sprites[0], walkAnims, walkNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const attackAnims = [
            ImageMap.archer_N_attack, ImageMap.archer_S_attack,
            ImageMap.archer_E_attack, ImageMap.archer_W_attack,
            ImageMap.archer_NW_attack, ImageMap.archer_NE_attack,
            ImageMap.archer_SW_attack, ImageMap.archer_SE_attack,
        ];
        startFrame = 0;
        endFrame = 14;
        xCells = 15;
        yCells = 1;
        speed = 15;
        looping = false;
        addAnimData(objectData.sprites[0], attackAnims, attackNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const deathAnims = [
            ImageMap.archer_N_death, ImageMap.archer_S_death,
            ImageMap.archer_E_death, ImageMap.archer_W_death,
            ImageMap.archer_NW_death, ImageMap.archer_NE_death,
            ImageMap.archer_SW_death, ImageMap.archer_SE_death,
        ];
        startFrame = 0;
        endFrame = 13;
        xCells = 14;
        yCells = 1;
        speed = 15;
        looping = false;
        addAnimData(objectData.sprites[0], deathAnims, deathNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        objectData.sprites[0].currentAnimation = idleNames[1];
        objectData.sprites.push(wade.getJson(JsonMap.selected_marker));
        objectData.sprites[1].image = ImageMap.player_unit_marker;
        objectData.sprites[1].size = {x: 200, y: 200};
        objectData.sprites[1].offset = {x: 0, y: 5 };
        objectData.sprites.push(wade.getJson(JsonMap.enemy_marker));
        objectData.sprites[2].image = ImageMap.enemy_unit_marker;
        objectData.sprites[2].size = {x: 750, y: 750};
        objectData.sprites[2].offset = {x: 0, y: -50 };
        objectData.sprites.push(wade.getJson(JsonMap.bleed_marker));
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
            sprites: [wade.getJson(imageJsonFile)],
            gridSize: {x: 1, z: 1},
            // collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        const offset = {x: 0, y: -100};
        objectData.sprites[0].size = {x: 500, y: 500};

        const idleAnims = [
            ImageMap.archerCalvary_N_idle, ImageMap.archerCalvary_S_idle, ImageMap.archerCalvary_E_idle,
            ImageMap.archerCalvary_W_idle, ImageMap.archerCalvary_NW_idle, ImageMap.archerCalvary_NE_idle,
            ImageMap.archerCalvary_SW_idle, ImageMap.archerCalvary_SE_idle,
        ];
        let startFrame = 0;
        let endFrame = 14;
        let xCells = 15;
        let yCells = 1;
        let speed = 10;
        let looping = true;
        addAnimData(objectData.sprites[0], idleAnims, idleNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const walkAnims = [
            ImageMap.archerCalvary_N_walk, ImageMap.archerCalvary_S_walk,
            ImageMap.archerCalvary_E_walk, ImageMap.archerCalvary_W_walk,
            ImageMap.archerCalvary_NW_walk, ImageMap.archerCalvary_NE_walk,
            ImageMap.archerCalvary_SW_walk, ImageMap.archerCalvary_SE_walk,
        ];
        startFrame = 0;
        endFrame = 15;
        xCells = 3;
        yCells = 6;
        speed = 30;
        looping = true;
        addAnimData(objectData.sprites[0], walkAnims, walkNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const attackAnims = [
            ImageMap.archerCalvary_N_attack, ImageMap.archerCalvary_S_attack,
            ImageMap.archerCalvary_E_attack, ImageMap.archerCalvary_W_attack,
            ImageMap.archerCalvary_NW_attack, ImageMap.archerCalvary_NE_attack,
            ImageMap.archerCalvary_SW_attack, ImageMap.archerCalvary_SE_attack,
        ];
        startFrame = 0;
        endFrame = 15;
        xCells = 3;
        yCells = 6;
        speed = 15;
        looping = false;
        addAnimData(objectData.sprites[0], attackAnims, attackNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const deathAnims = [
            ImageMap.archerCalvary_N_death, ImageMap.archerCalvary_S_death,
            ImageMap.archerCalvary_E_death, ImageMap.archerCalvary_W_death,
            ImageMap.archerCalvary_NW_death, ImageMap.archerCalvary_NE_death,
            ImageMap.archerCalvary_SW_death, ImageMap.archerCalvary_SE_death,
        ];
        startFrame = 0;
        endFrame = 13;
        xCells = 14;
        yCells = 1;
        speed = 15;
        looping = false;
        addAnimData(objectData.sprites[0], deathAnims, deathNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        objectData.sprites[0].currentAnimation = idleNames[1];
        objectData.sprites.push(wade.getJson(JsonMap.selected_marker));
        objectData.sprites[1].image = ImageMap.player_unit_marker;
        objectData.sprites[1].size = {x: 200, y: 200};
        objectData.sprites[1].offset = {x: 0, y: 5 };
        objectData.sprites.push(wade.getJson(JsonMap.enemy_marker));
        objectData.sprites[2].image = ImageMap.enemy_unit_marker;
        objectData.sprites[2].size = {x: 750, y: 750};
        objectData.sprites[2].offset = {x: 0, y: -50 };
        objectData.sprites.push(wade.getJson(JsonMap.bleed_marker));
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
            sprites: [wade.getJson(imageJsonFile)],
            gridSize: {x: 1, z: 1},
            // collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        const offset = {x: 0, y: -100};
        objectData.sprites[0].size = {x: 500, y: 500};

        const idleAnims = [
            ImageMap.spearCalvary_N_idle, ImageMap.spearCalvary_S_idle, ImageMap.spearCalvary_E_idle,
            ImageMap.spearCalvary_W_idle, ImageMap.spearCalvary_NW_idle, ImageMap.spearCalvary_NE_idle,
            ImageMap.spearCalvary_SW_idle, ImageMap.spearCalvary_SE_idle,
        ];
        let startFrame = 0;
        let endFrame = 14;
        let xCells = 15;
        let yCells = 1;
        let speed = 10;
        let looping = true;
        addAnimData(objectData.sprites[0], idleAnims, idleNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const walkAnims = [
            ImageMap.spearCalvary_N_walk, ImageMap.spearCalvary_S_walk,
            ImageMap.spearCalvary_E_walk, ImageMap.spearCalvary_W_walk,
            ImageMap.spearCalvary_NW_walk, ImageMap.spearCalvary_NE_walk,
            ImageMap.spearCalvary_SW_walk, ImageMap.spearCalvary_SE_walk,
        ];
        startFrame = 0;
        endFrame = 15;
        xCells = 3;
        yCells = 6;
        speed = 30;
        looping = true;
        addAnimData(objectData.sprites[0], walkAnims, walkNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const attackAnims = [
            ImageMap.spearCalvary_N_attack, ImageMap.spearCalvary_S_attack,
            ImageMap.spearCalvary_E_attack, ImageMap.spearCalvary_W_attack,
            ImageMap.spearCalvary_NW_attack, ImageMap.spearCalvary_NE_attack,
            ImageMap.spearCalvary_SW_attack, ImageMap.spearCalvary_SE_attack,
        ];
        startFrame = 0;
        endFrame = 16;
        xCells = 3;
        yCells = 6;
        speed = 15;
        looping = false;
        addAnimData(objectData.sprites[0], attackAnims, attackNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const deathAnims = [
            ImageMap.spearCalvary_N_death, ImageMap.spearCalvary_S_death,
            ImageMap.spearCalvary_E_death, ImageMap.spearCalvary_W_death,
            ImageMap.spearCalvary_NW_death, ImageMap.spearCalvary_NE_death,
            ImageMap.spearCalvary_SW_death, ImageMap.spearCalvary_SE_death,
        ];
        startFrame = 0;
        endFrame = 13;
        xCells = 14;
        yCells = 1;
        speed = 15;
        looping = false;
        addAnimData(objectData.sprites[0], deathAnims, deathNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        objectData.sprites[0].currentAnimation = idleNames[1];
        objectData.sprites.push(wade.getJson(JsonMap.selected_marker));
        objectData.sprites[1].image = ImageMap.player_unit_marker;
        objectData.sprites[1].size = {x: 200, y: 200};
        objectData.sprites[1].offset = {x: 0, y: 5 };
        objectData.sprites.push(wade.getJson(JsonMap.enemy_marker));
        objectData.sprites[2].image = ImageMap.enemy_unit_marker;
        objectData.sprites[2].size = {x: 750, y: 750};
        objectData.sprites[2].offset = {x: 0, y: -50 };
        objectData.sprites.push(wade.getJson(JsonMap.bleed_marker));
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
            sprites: [wade.getJson(imageJsonFile)],
            gridSize: {x: 1, z: 1},
            // collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        const offset = {x: 0, y: -30};
        objectData.sprites[0].size = {x: 400, y: 400};

        const idleAnims = [
            ImageMap.gatherer_N_idle, ImageMap.gatherer_S_idle, ImageMap.gatherer_E_idle,
            ImageMap.gatherer_W_idle, ImageMap.gatherer_NW_idle, ImageMap.gatherer_NE_idle,
            ImageMap.gatherer_SW_idle, ImageMap.gatherer_SE_idle,
        ];
        let startFrame = 0;
        let endFrame = 60;
        let xCells = 16;
        let yCells = 4;
        let speed = 10;
        let looping = true;
        addAnimData(objectData.sprites[0], idleAnims, idleNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const walkAnims = [
            ImageMap.gatherer_N_walk, ImageMap.gatherer_S_walk,
            ImageMap.gatherer_E_walk, ImageMap.gatherer_W_walk,
            ImageMap.gatherer_NW_walk, ImageMap.gatherer_NE_walk,
            ImageMap.gatherer_SW_walk, ImageMap.gatherer_SE_walk,
        ];
        startFrame = 0;
        endFrame = 24;
        xCells = 4;
        yCells = 7;
        speed = 30;
        looping = true;
        addAnimData(objectData.sprites[0], walkAnims, walkNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const attackAnims = [
            ImageMap.gatherer_N_attack, ImageMap.gatherer_S_attack,
            ImageMap.gatherer_E_attack, ImageMap.gatherer_W_attack,
            ImageMap.gatherer_NW_attack, ImageMap.gatherer_NE_attack,
            ImageMap.gatherer_SW_attack, ImageMap.gatherer_SE_attack,
        ];
        startFrame = 0;
        endFrame = 44;
        xCells = 15;
        yCells = 3;
        speed = 15;
        looping = false;
        addAnimData(objectData.sprites[0], attackAnims, attackNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const deathAnims = [
            ImageMap.gatherer_N_death, ImageMap.gatherer_S_death,
            ImageMap.gatherer_E_death, ImageMap.gatherer_W_death,
            ImageMap.gatherer_NW_death, ImageMap.gatherer_NE_death,
            ImageMap.gatherer_SW_death, ImageMap.gatherer_SE_death,
        ];
        startFrame = 0;
        endFrame = 108;
        xCells = 16;
        yCells = 7;
        speed = 15;
        looping = false;
        addAnimData(objectData.sprites[0], deathAnims, deathNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        objectData.sprites[0].currentAnimation = idleNames[1];
        objectData.sprites.push(wade.getJson(JsonMap.selected_marker));
        objectData.sprites[1].image = ImageMap.player_unit_marker;
        objectData.sprites[1].size = {x: 200, y: 200};
        objectData.sprites[1].offset = {x: 0, y: 5 };
        objectData.sprites.push(wade.getJson(JsonMap.enemy_marker));
        objectData.sprites[2].image = ImageMap.enemy_unit_marker;
        objectData.sprites[2].size = {x: 750, y: 750};
        objectData.sprites[2].offset = {x: 0, y: -50 };
        objectData.sprites.push(wade.getJson(JsonMap.bleed_marker));
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
            sprites: [wade.getJson(imageJsonFile)],
            gridSize: {x: 1, z: 1},
            // collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        const offset = {x: 0, y: -100};
        objectData.sprites[0].size = {x: 400, y: 400};

        const idleAnims = [
            ImageMap.drummerBoy_N_idle, ImageMap.drummerBoy_S_idle, ImageMap.drummerBoy_E_idle,
            ImageMap.drummerBoy_W_idle, ImageMap.drummerBoy_NW_idle, ImageMap.drummerBoy_NE_idle,
            ImageMap.drummerBoy_SW_idle, ImageMap.drummerBoy_SE_idle,
        ];
        let startFrame = 0;
        let endFrame = 14;
        let xCells = 15;
        let yCells = 1;
        let speed = 10;
        let looping = true;
        addAnimData(objectData.sprites[0], idleAnims, idleNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const walkAnims = [
            ImageMap.drummerBoy_N_walk, ImageMap.drummerBoy_S_walk,
            ImageMap.drummerBoy_E_walk, ImageMap.drummerBoy_W_walk,
            ImageMap.drummerBoy_NW_walk, ImageMap.drummerBoy_NE_walk,
            ImageMap.drummerBoy_SW_walk, ImageMap.drummerBoy_SE_walk,
        ];
        startFrame = 0;
        endFrame = 15;
        xCells = 3;
        yCells = 6;
        speed = 30;
        looping = true;
        addAnimData(objectData.sprites[0], walkAnims, walkNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const attackAnims = [
            ImageMap.drummerBoy_N_attack, ImageMap.drummerBoy_S_attack,
            ImageMap.drummerBoy_E_attack, ImageMap.drummerBoy_W_attack,
            ImageMap.drummerBoy_NW_attack, ImageMap.drummerBoy_NE_attack,
            ImageMap.drummerBoy_SW_attack, ImageMap.drummerBoy_SE_attack,
        ];
        startFrame = 0;
        endFrame = 16;
        xCells = 3;
        yCells = 6;
        speed = 15;
        looping = false;
        addAnimData(objectData.sprites[0], attackAnims, attackNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        const deathAnims = [
            ImageMap.drummerBoy_N_death, ImageMap.drummerBoy_S_death,
            ImageMap.drummerBoy_E_death, ImageMap.drummerBoy_W_death,
            ImageMap.drummerBoy_NW_death, ImageMap.drummerBoy_NE_death,
            ImageMap.drummerBoy_SW_death, ImageMap.drummerBoy_SE_death,
        ];
        startFrame = 0;
        endFrame = 13;
        xCells = 14;
        yCells = 1;
        speed = 15;
        looping = false;
        addAnimData(objectData.sprites[0], deathAnims, deathNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        objectData.sprites[0].currentAnimation = idleNames[1];
        objectData.sprites.push(wade.getJson(JsonMap.selected_marker));
        objectData.sprites[1].image = ImageMap.player_unit_marker;
        objectData.sprites[1].size = {x: 200, y: 200};
        objectData.sprites[1].offset = {x: 0, y: 5 };
        objectData.sprites.push(wade.getJson(JsonMap.enemy_marker));
        objectData.sprites[2].image = ImageMap.enemy_unit_marker;
        objectData.sprites[2].size = {x: 750, y: 750};
        objectData.sprites[2].offset = {x: 0, y: -50 };
        objectData.sprites.push(wade.getJson(JsonMap.bleed_marker));
        const drummerBoy = wade.iso.createObject(objectData);
        return drummerBoy;
    },
    stone: (imageJsonFile: string) => {
        const objectData = {
            sprites: [wade.getJson(imageJsonFile)],
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        };
        objectData.sprites[0].size = {x: 100, y: 150};
        objectData.sprites[0].offset = {x: 0, y: -50 };
        objectData.sprites[0].sortPoint = {x: 0, y: 0.25 };
        const stone = wade.iso.createObject(objectData, {x: -2, z: 5} );

        return stone;
    },
    wood: (imageJsonFile: string) => {
        const objectData = {
            sprites: [wade.getJson(imageJsonFile)],
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        };
        objectData.sprites[0].size = {x: 250, y: 400};
        objectData.sprites[0].offset = {x: 0, y: -170 };
        objectData.sprites[0].sortPoint = {x: 0, y: 0.25 };
        const wood = wade.iso.createObject(objectData, {x: -2, z: 5} );

        return wood;
    },
    food: (imageJsonFile: string) => {
        const objectData = {
            sprites: [wade.getJson(imageJsonFile)],
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        };
        objectData.sprites[0].size = {x: 120, y: 120};

        let grazeAnims = [
            ImageMap.sheep_SW_graze,
            ImageMap.sheep_SE_graze,
        ];
        let grazeNames = [
            'Graze_iso_SW', 'Graze_iso_SE',
        ];
        let offset = {x: 0, y: -40};
        let startFrame = 0;
        let endFrame = 47;
        let xCells = 6;
        let yCells = 8;
        let speed = 8;
        let looping = true;
        addAnimData(objectData.sprites[0], grazeAnims, grazeNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        grazeAnims = [
            ImageMap.sheep_NE_graze,
            ImageMap.sheep_NW_graze,
        ];
        grazeNames = [
            'Graze_iso_NW', 'Graze_iso_NE',
        ];
        offset = {x: 0, y: -40};
        startFrame = 0;
        endFrame = 47;
        xCells = 8;
        yCells = 6;
        speed = 8;
        looping = true;
        addAnimData(objectData.sprites[0], grazeAnims, grazeNames, xCells, yCells, speed, looping, startFrame, endFrame, offset);

        grazeNames = [
            'Graze_iso_SW', 'Graze_iso_SE',
            'Graze_iso_NW', 'Graze_iso_NE',
        ];
        const startingIndex = Math.floor( Math.random() * 4 );
        objectData.sprites[0].currentAnimation = grazeNames[startingIndex];
        const food = wade.iso.createObject(objectData, {x: -2, z: 5} );

        return food;
    },

};

export default SceneObjectConstruction;
