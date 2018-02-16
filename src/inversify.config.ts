import "reflect-metadata";
import { Container, interfaces } from "inversify";
import TYPES from "./types";

import Archer from "./model/units/archer_unit";
import ArcherCalvary from "./model/units/archerCalvary_unit";
import VIP from "./model/units/VIP_unit";
import SpearCalvary from "./model/units/spearCalvary_unit";
import Swordsman from "./model/units/swordsman_unit";
import Gatherer from "./model/units/gatherer_unit";
import DrummerBoy from "./model/units/drummerBoy_unit";
import Unit from "./model/units/units";

import Stables from "./model/buildings/stable_buildings";
import TownHall from "./model/buildings/townhall_buildings";
import Barracks from "./model/buildings/barracks_buildings";
import Tower from "./model/buildings/tower_buildings";
import Building from "./model/buildings/buildings";

import Tile from "./model/map/tile";

import PlayerGameState from "./model/state/player-game-state";
import GlobalGameState from "./model/state/global-game-state";
import AiGameState from "./model/state/ai-game-state";


var container = new Container();

//Class bindings to the container
container.bind<Tile>(Tile).toSelf(); // bind the class constructor to the container
container.bind<Unit>(Unit).toSelf();
container.bind<VIP>(VIP).toSelf();
container.bind<SpearCalvary>(SpearCalvary).toSelf();
container.bind<Archer>(Archer).toSelf();
container.bind<ArcherCalvary>(ArcherCalvary).toSelf();
container.bind<Swordsman>(Swordsman).toSelf();
container.bind<Gatherer>(Gatherer).toSelf();
container.bind<DrummerBoy>(DrummerBoy).toSelf();
container.bind<Stables>(Stables).toSelf();
container.bind<Tower>(Tower).toSelf();
container.bind<TownHall>(TownHall).toSelf();
container.bind<Barracks>(Barracks).toSelf();
container.bind<Building>(Building).toSelf();
container.bind<GlobalGameState>(GlobalGameState).toSelf();
container.bind<PlayerGameState>(PlayerGameState).toSelf();
container.bind<AiGameState>(AiGameState).toSelf();

//Class constructor bindings to container




// from-object factory bindings to the container
container.bind<interfaces.Factory<Barracks>>(TYPES.fromObjectBarracks).toFactory<Barracks>((context: interfaces.Context) => {
    return Barracks.fromObject; 
});
container.bind<interfaces.Factory<Stables>>(TYPES.fromObjectStables).toFactory<Stables>((context: interfaces.Context) => {
    return Stables.fromObject; 
});
container.bind<interfaces.Factory<TownHall>>(TYPES.fromObjectTownHall).toFactory<TownHall>((context: interfaces.Context) => {
    return TownHall.fromObject; 
});
container.bind<interfaces.Factory<Tower>>(TYPES.fromObjectTower).toFactory<Tower>((context: interfaces.Context) => {
    return Tower.fromObject; 
});
container.bind<interfaces.Factory<Swordsman>>(TYPES.fromObjectSwordsman).toFactory<Swordsman>((context: interfaces.Context) => {
    return Swordsman.fromObject; 
});
container.bind<interfaces.Factory<Gatherer>>(TYPES.fromObjectGatherer).toFactory<Gatherer>((context: interfaces.Context) => {
    return Gatherer.fromObject; 
});
container.bind<interfaces.Factory<DrummerBoy>>(TYPES.fromObjectDrummerBoy).toFactory<DrummerBoy>((context: interfaces.Context) => {
    return DrummerBoy.fromObject; 
});
container.bind<interfaces.Factory<Archer>>(TYPES.fromObjectArcher).toFactory<Archer>((context: interfaces.Context) => {
    return Archer.fromObject; 
});
container.bind<interfaces.Factory<VIP>>(TYPES.fromObjectVIP).toFactory<VIP>((context: interfaces.Context) => {
    return VIP.fromObject; 
});
container.bind<interfaces.Factory<SpearCalvary>>(TYPES.fromObjectSpearCalvary).toFactory<SpearCalvary>((context: interfaces.Context) => {
    return SpearCalvary.fromObject; 
});
container.bind<interfaces.Factory<ArcherCalvary>>(TYPES.fromObjectArcherCalvary).toFactory<ArcherCalvary>((context: interfaces.Context) => {
    return ArcherCalvary.fromObject; 
});

// default factory bindings to the container
container.bind<interfaces.Factory<Barracks>>(TYPES.defaultBarracks).toFactory<Barracks>((context: interfaces.Context) => {
    return Barracks.defaultBarracks; 
});
container.bind<interfaces.Factory<Stables>>(TYPES.defaultStables).toFactory<Stables>((context: interfaces.Context) => {
    return Stables.defaultStables; 
});
container.bind<interfaces.Factory<TownHall>>(TYPES.defaultTownHall).toFactory<TownHall>((context: interfaces.Context) => {
    return TownHall.defaultTownHall; 
});
container.bind<interfaces.Factory<Tower>>(TYPES.defaultTower).toFactory<Tower>((context: interfaces.Context) => {
    return Tower.defaultTower; 
});
container.bind<interfaces.Factory<Swordsman>>(TYPES.defaultSwordsman).toFactory<Swordsman>((context: interfaces.Context) => {
    return Swordsman.defaultSwordsman; 
});
container.bind<interfaces.Factory<Archer>>(TYPES.defaultArcher).toFactory<Archer>((context: interfaces.Context) => {
    return Archer.defaultArcher; 
});
container.bind<interfaces.Factory<Gatherer>>(TYPES.defaultGatherer).toFactory<Gatherer>((context: interfaces.Context) => {
    return Gatherer.defaultGatherer; 
});
container.bind<interfaces.Factory<DrummerBoy>>(TYPES.defaultDrummerBoy).toFactory<DrummerBoy>((context: interfaces.Context) => {
    return DrummerBoy.defaultDrummerBoy; 
});
container.bind<interfaces.Factory<SpearCalvary>>(TYPES.defaultSpearCalvary).toFactory<SpearCalvary>((context: interfaces.Context) => {
    return SpearCalvary.defaultSpearCalvary; 
});
container.bind<interfaces.Factory<ArcherCalvary>>(TYPES.defaultArcherCalvary).toFactory<ArcherCalvary>((context: interfaces.Context) => {
    return ArcherCalvary.defaultArcherCalvary; 
});
container.bind<interfaces.Factory<VIP>>(TYPES.defaultVIP).toFactory<VIP>((context: interfaces.Context) => {
    return VIP.defaultVIP; 
});
container.bind<interfaces.Factory<GlobalGameState>>(TYPES.defaultGlobalGameState).toFactory<GlobalGameState>((context: interfaces.Context) => {
    return GlobalGameState.defaultGameState;
})
container.bind<interfaces.Factory<PlayerGameState>>(TYPES.defaultPlayerGameState).toFactory<PlayerGameState>((context: interfaces.Context) => {
    return PlayerGameState.defaultPlayerGameState;
})
container.bind<interfaces.Factory<AiGameState>>(TYPES.defaultAiGameState).toFactory<AiGameState>((context: interfaces.Context) => {
    return AiGameState.defaultAiGameState;
})
container.bind<interfaces.Factory<Tile>>(TYPES.defaultTile).toFactory<Tile>((context: interfaces.Context) => {
    return Tile.defaultTile;
})




function bindDependencies (func, dependencies) {
    let injections = dependencies.map((dependency) => {
        return container.get(dependency); 
    
    });
    return func.bind(func, ...injections);
}

export default container; // Make all these dependencies available everywhere else
export { container, bindDependencies };
