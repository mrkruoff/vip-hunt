import { Container } from "inversify";
import "reflect-metadata";

import { Tile } from "./model/map/tile"

var container = new Container();

container.bind<Tile>(Tile).toSelf(); //binds the class to the container
