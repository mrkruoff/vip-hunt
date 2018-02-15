import { injectable } from "inversify";


//Tile class. Holds the state of one of the map's tiles.
@injectable()
class Tile {
    unitId: number;
    buildingId: number;
    resourceId: number;
    walkable: boolean;
    x: number;
    y: number;
    static EMPTY: -1;

    constructor(unit: number, building: number, resource: number, walkable: boolean ) {
        this.unitId = unit;
        this.buildingId = building;
        this.resourceId = resource;
        this.walkable = walkable;
        
        //It's possible that the above are incorrect variables to have,
        //since map access will be determined entirely by clicking for the player.
        //But then the AI will have no data to decide how to click.

        //Check to see that the tile is correctly occupied
        if(this.buildingId > 0) {
            if(this.resourceId > 0 || this.buildingId > 0) {
                throw Error("Tile is occupied by building and something else")
            }

            this.walkable = false; //tile is not walkable if building is on it.
        }

        //Enforce the idea of one unit per tile.
        if(this.unitId > 0) {
            this.walkable = false;
        }
    }
    getUnitId() {
        return this.unitId; 
    }
    getBuildingId() {
        return this.buildingId; 
    }
    getResourceId() {
        return this.resourceId; 
    }

    setUnitId(id: number) {
        this.unitId = id;    
    }
    setBuildingId(id: number) {
        this.buildingId = id;    
    }
    setResourceId(id: number) {
        this.resourceId = id;    
    }

    static defaultTile() : Tile {
        const unit = Tile.EMPTY;
        const building = Tile.EMPTY;
        const resource = Tile.EMPTY;
        const walkable = true;

        return new Tile(unit, building, resource, walkable);
    }
}

export default Tile;
