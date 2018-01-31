import { Container } from "inversify";
import "reflect-metadata";

import Archer from "./model/units/archer_unit";
import ArcherCalvary from "./model/units/archerCalvary_unit";
import VIP from "./model/units/VIP_unit";
import SpearCalvary from "./model/units/spearCalvary_unit";
import Swordsman from "./model/units/swordsman_unit";
import Gatherer from "./model/units/gatherer_unit";
import DrummerBoy from "./model/units/drummerBoy_unit";

import Stable from "./model/buildings/stable_buildings";
import TownHall from "./model/buildings/townhall_buildings";
import Barracks from "./model/buildings/barracks_buildings";

import Tile from "./model/map/tile";

import PlayerGameState from "./model/state/player-game-state";
import GlobalGameState from "./model/state/global-game-state";


var container = new Container();

container.bind<Tile>(Tile).toSelf(); // bind the class constructor to the container

container.bind<VIP>(VIP).toSelf();
container.bind<SpearCalvary>(SpearCalvary).toSelf();
container.bind<Archer>(Archer).toSelf();
container.bind<ArcherCalvary>(ArcherCalvary).toSelf();
container.bind<Swordsman>(Swordsman).toSelf();
container.bind<Gatherer>(Gatherer).toSelf();
container.bind<DrummerBoy>(DrummerBoy).toSelf();

container.bind<Stable>(Stable).toSelf();
container.bind<TownHall>(TownHall).toSelf();
container.bind<Barracks>(Barracks).toSelf();

container.bind<GlobalGameState>(GlobalGameState).toSelf();
container.bind<PlayerGameState>(PlayerGameState).toSelf();




export default container; // Make all these dependencies available everywhere else
