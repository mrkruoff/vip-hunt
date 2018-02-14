import JsonMap from './json-map';

import Archer from "../model/units/archer_unit";
import ArcherCalvary from "../model/units/archerCalvary_unit";
import VIP from "../model/units/VIP_unit";
import SpearCalvary from "../model/units/spearCalvary_unit";
import Swordsman from "../model/units/swordsman_unit";
import Gatherer from "../model/units/gatherer_unit";
import DrummerBoy from "../model/units/drummerBoy_unit";
import Unit from "../model/units/units";

import Stables from "../model/buildings/stable_buildings";
import TownHall from "../model/buildings/townhall_buildings";
import Barracks from "../model/buildings/barracks_buildings";
import Tower from "../model/buildings/tower_buildings";
import Building from "../model/buildings/buildings";

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
    barracks: (imageJsonFile: string, dataJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        let barracks = wade.iso.createObject(objectData);
        // Attach a new instance to sprite.
        // This new instance will have to be added to the global object as well.
        barracks.data = Barracks.fromObject(wade.getJson(dataJsonFile));

        return barracks;

    },
    stables: (imageJsonFile: string, dataJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        let stables = wade.iso.createObject(objectData);
        stables.data = Stables.fromObject(wade.getJson(dataJsonFile));

        return stables;

    },
    towers: (imageJsonFile: string, dataJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        let tower = wade.iso.createObject(objectData);
        tower.data = Tower.fromObject(wade.getJson(dataJsonFile));

        return tower;

    },
    VIP: (imageJsonFile: string, dataJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        } 
        let VIP = wade.iso.createobject(objectData);
        VIP.data = VIP.fromObject(wade.getJson(dataJsonFile));

        return VIP;
    
    },
    townHalls: (imageJsonFile: string, dataJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 2, z: 2},
            collisionSize: {x: 2, z: 2},

        };
        let townHall = wade.iso.createObject(objectData);
        townHall.data = TownHall.fromObject(wade.getJson(dataJsonFile));

        return townHall;

    },
    swordsman: (imageJsonFile: string, dataJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
            behaviors: [IsoCharacter],
        };
        let swordsman = wade.iso.createObject(objectData);
        swordsman.data = Swordsman.fromObject(wade.getJson(dataJsonFile));

        return swordsman;
    },
    archer: (imageJsonFile: string, dataJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        };
        let archer = wade.iso.createObject(objectData);
        archer.data = Archer.fromObject(wade.getJson(dataJsonFile));

        return archer;
    },
    archerCalvary: (imageJsonFile: string, dataJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        };
        let archerCalvary = wade.iso.createObject(objectData);
        archerCalvary.data = ArcherCalvary.fromObject(wade.getJson(dataJsonFile));

        return archerCalvary;
    },
    spearCalvary: (imageJsonFile: string, dataJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        };
        let spearCalvary = wade.iso.createObject(objectData);
        spearCalvary.data = SpearCalvary.fromObject(wade.getJson(dataJsonFile));

        return spearCalvary;
    },
    gatherer: (imageJsonFile: string, dataJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        };
        let gatherer = wade.iso.createObject(objectData);
        gatherer.data = Gatherer.fromObject(wade.getJson(dataJsonFile));

        return gatherer;
    },
    drummerBoy: (imageJsonFile: string, dataJsonFile: string) => {
        const objectData = {
            sprites: wade.getJson(imageJsonFile),
            gridSize: {x: 1, z: 1},
            collisionSize: {x: 1, z: 1},
        };
        let drummerBoy = wade.iso.createObject(objectData);
        drummerBoy.data = DrummerBoy.fromObject(wade.getJson(dataJsonFile));

        return drummerBoy;
    },

};

export default Construction;
