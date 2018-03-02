

var Calculation = {
    calculatePaintVision: (sceneObject) => {
        let dist = (coords1, coords2) => {
            let dx = coords1.x - coords2.x;
            let dz = coords1.z - coords2.z;
            let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dz, 2) );
            return d;
        };
        let inMapBounds = (coords) => {
            let numTiles = wade.iso.getNumTiles();
            if(coords.x < 0 || coords.z < 0 ) {
                return false; 
            }

            if(coords.x >= numTiles.x || coords.z >= numTiles.z) {
                    return false;
            }
            return true;
        }

        let start = sceneObject.iso.gridCoords;
        let paintArrays = {
            clear: [start],
            fog: [],
        }

        // In a spiral pattern around the scene object, go through
        // the tiles and save which coordinates are to be painted clear 
        // and which are to be painted fog.
        let coords = {
            x: start.x,
            z: start.z, 
        };
        let addX = true;
        let addZ = true;
        let stepSize = 1;

        // We're getting slightly more than the tiles that the sceneObject can see.
        // We want to repaint some of the tiles with fog in case the sceneObject 
        // is moving
        let clearDistance = sceneObject.data.vision;
        let angle = Math.cos(Math.PI / 4);
        let radius = clearDistance / angle;
        while( dist(coords, start) <= radius + 3 ) {
            for(let i = 0; i < stepSize; i++) {
                let increment = 1;
                if( !addX ) {
                    increment *= -1;
                }
                coords.x += increment;

                if( inMapBounds(coords) ) {
                    let new_coords = _.cloneDeep(coords);
                    if(dist(coords, start) <= clearDistance) {
                        paintArrays.clear.push(new_coords);
                    }
                    else {
                        paintArrays.fog.push(new_coords);
                    }
                }
            }
            addX = !addX;

            for(let i = 0; i < stepSize; i++) {
                let increment = 1;
                if( !addZ ) {
                    increment *= -1;
                }
                coords.z += increment;

                if( inMapBounds(coords) ) {
                    let new_coords = _.cloneDeep(coords);
                    if(dist(coords, start) <= clearDistance) {
                        paintArrays.clear.push(new_coords);
                    }
                    else {
                        paintArrays.fog.push(new_coords);
                    }
                }
            }
            addZ = !addZ;

            stepSize++;
        }

        return paintArrays;
    }
}
