/* construction.ts
 *
 * The Construction module contains the functions that construct
 * the game objects (SceneObject plus any related data ).
 *
 */

import Archer from '../model/units/archer_unit';
import ArcherCalvary from '../model/units/archerCalvary_unit';
import DrummerBoy from '../model/units/drummerBoy_unit';
import Gatherer from '../model/units/gatherer_unit';
import SpearCalvary from '../model/units/spearCalvary_unit';
import Swordsman from '../model/units/swordsman_unit';
import Unit from '../model/units/units';
import VIP from '../model/units/VIP_unit';
import JsonMap from './json-map';
import SceneObjectConstruction from './scene-object-construction';

import Barracks from '../model/buildings/barracks_buildings';
import Building from '../model/buildings/buildings';
import Stables from '../model/buildings/stable_buildings';
import Tower from '../model/buildings/tower_buildings';
import TownHall from '../model/buildings/townhall_buildings';

import Minimap from './minimap';

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
    // This function constructs a barracks SceneObject that contains
    // an instance of the Barracks class.
    //
    // parameters:
    //  @ imageJsonFile: name of the file storing the info WADE needs
    //      to build the SceneObject image.
    //  @ dataJsonFile: name of the file storing the info needed to
    //      construct the instance of the Barracks class.
    barracks: (imageJsonFile: string, dataJsonFile: string) => {
        const barracks = SceneObjectConstruction.barracks(imageJsonFile);
        // Attach a new instance to sprite.
        // This new instance will have to be added to the global object as well.
        barracks.data = Barracks.fromObject(wade.getJson(dataJsonFile));
        barracks.data.rep = barracks;

        return barracks;

    },
    // This function constructs a Stables SceneObject that contains
    // an instance of the Stables class.
    //
    // parameters:
    //  @ imageJsonFile: name of the file storing the info WADE needs
    //      to build the SceneObject image.
    //  @ dataJsonFile: name of the file storing the info needed to
    //      construct the instance of the Stables class.
    stables: (imageJsonFile: string, dataJsonFile: string) => {
        const stables = SceneObjectConstruction.stables(imageJsonFile);
        stables.data = Stables.fromObject(wade.getJson(dataJsonFile));
        stables.data.rep = stables;

        return stables;

    },
    // This function constructs a Tower SceneObject that contains
    // an instance of the Tower class.
    //
    // parameters:
    //  @ imageJsonFile: name of the file storing the info WADE needs
    //      to build the SceneObject image.
    //  @ dataJsonFile: name of the file storing the info needed to
    //      construct the instance of the Tower class.
    towers: (imageJsonFile: string, dataJsonFile: string) => {
        const tower = SceneObjectConstruction.towers(imageJsonFile);
        tower.data = Tower.fromObject(wade.getJson(dataJsonFile));
        tower.data.rep = tower;

        return tower;

    },
    // This function constructs a VIP SceneObject that contains
    // an instance of the VIP class.
    //
    // parameters:
    //  @ imageJsonFile: name of the file storing the info WADE needs
    //      to build the SceneObject image.
    //  @ dataJsonFile: name of the file storing the info needed to
    //      construct the instance of the VIP class.
    vip: (imageJsonFile: string, dataJsonFile: string) => {
        const v = SceneObjectConstruction.vip(imageJsonFile);
        v.data = VIP.fromObject(wade.getJson(dataJsonFile));
        v.data.rep = v;
        v.getBehavior('IsoCharacter').movementSpeed = v.data.speed;

        return v;

    },
    // This function constructs a TownHall SceneObject that contains
    // an instance of the TownHall class.
    //
    // parameters:
    //  @ imageJsonFile: name of the file storing the info WADE needs
    //      to build the SceneObject image.
    //  @ dataJsonFile: name of the file storing the info needed to
    //      construct the instance of the TownHall class.
    townHalls: (imageJsonFile: string, dataJsonFile: string) => {
        const townHall = SceneObjectConstruction.townHalls(imageJsonFile);
        townHall.data = TownHall.fromObject(wade.getJson(dataJsonFile));
        townHall.data.rep = townHall;

        return townHall;

    },
    // This function constructs a Swordsman SceneObject that contains
    // an instance of the Swordsman class.
    //
    // parameters:
    //  @ imageJsonFile: name of the file storing the info WADE needs
    //      to build the SceneObject image.
    //  @ dataJsonFile: name of the file storing the info needed to
    //      construct the instance of the Swordsman class.
    swordsman: (imageJsonFile: string, dataJsonFile: string) => {
        const swordsman = SceneObjectConstruction.swordsman(imageJsonFile);
        swordsman.data = Swordsman.fromObject(wade.getJson(dataJsonFile));
        swordsman.data.rep = swordsman;
        swordsman.getBehavior('IsoCharacter').movementSpeed = swordsman.data.speed;

        return swordsman;
    },
    // This function constructs a Archer SceneObject that contains
    // an instance of the Archer class.
    //
    // parameters:
    //  @ imageJsonFile: name of the file storing the info WADE needs
    //      to build the SceneObject image.
    //  @ dataJsonFile: name of the file storing the info needed to
    //      construct the instance of the Archer class.
    archer: (imageJsonFile: string, dataJsonFile: string) => {
        const archer = SceneObjectConstruction.archer(imageJsonFile);
        archer.data = Archer.fromObject(wade.getJson(dataJsonFile));
        archer.data.rep = archer;
        archer.getBehavior('IsoCharacter').movementSpeed = archer.data.speed;

        return archer;
    },
    // This function constructs a ArcherCalvary SceneObject that contains
    // an instance of the ArcherCalvary class.
    //
    // parameters:
    //  @ imageJsonFile: name of the file storing the info WADE needs
    //      to build the SceneObject image.
    //  @ dataJsonFile: name of the file storing the info needed to
    //      construct the instance of the ArcherCalvary class.
    archerCalvary: (imageJsonFile: string, dataJsonFile: string) => {
        const archerCalvary = SceneObjectConstruction.archerCalvary(imageJsonFile);
        archerCalvary.data = ArcherCalvary.fromObject(wade.getJson(dataJsonFile));
        archerCalvary.data.rep = archerCalvary;
        archerCalvary.getBehavior('IsoCharacter').movementSpeed = archerCalvary.data.speed;

        return archerCalvary;
    },
    // This function constructs a SpearCalvary SceneObject that contains
    // an instance of the SpearCalvary class.
    //
    // parameters:
    //  @ imageJsonFile: name of the file storing the info WADE needs
    //      to build the SceneObject image.
    //  @ dataJsonFile: name of the file storing the info needed to
    //      construct the instance of the SpearCalvary class.
    spearCalvary: (imageJsonFile: string, dataJsonFile: string) => {
        const spearCalvary = SceneObjectConstruction.spearCalvary(imageJsonFile);
        spearCalvary.data = SpearCalvary.fromObject(wade.getJson(dataJsonFile));
        spearCalvary.data.rep = spearCalvary;
        spearCalvary.getBehavior('IsoCharacter').movementSpeed = spearCalvary.data.speed;

        return spearCalvary;
    },
    // This function constructs a Gatherer SceneObject that contains
    // an instance of the Gatherer class.
    //
    // parameters:
    //  @ imageJsonFile: name of the file storing the info WADE needs
    //      to build the SceneObject image.
    //  @ dataJsonFile: name of the file storing the info needed to
    //      construct the instance of the Gatherer class.
    gatherer: (imageJsonFile: string, dataJsonFile: string) => {
        const gatherer = SceneObjectConstruction.gatherer(imageJsonFile);
        gatherer.data = Gatherer.fromObject(wade.getJson(dataJsonFile));
        gatherer.data.rep = gatherer;
        gatherer.getBehavior('IsoCharacter').movementSpeed = gatherer.data.speed;

        return gatherer;
    },
    // This function constructs a DrummerBoy SceneObject that contains
    // an instance of the DrummerBoy class.
    //
    // parameters:
    //  @ imageJsonFile: name of the file storing the info WADE needs
    //      to build the SceneObject image.
    //  @ dataJsonFile: name of the file storing the info needed to
    //      construct the instance of the DrummerBoy class.
    drummerBoy: (imageJsonFile: string, dataJsonFile: string) => {
        const drummerBoy = SceneObjectConstruction.drummerBoy(imageJsonFile);
        drummerBoy.data = DrummerBoy.fromObject(wade.getJson(dataJsonFile));
        drummerBoy.data.rep = drummerBoy;
        drummerBoy.getBehavior('IsoCharacter').movementSpeed = drummerBoy.data.speed;

        return drummerBoy;
    },

};

export default Construction;
