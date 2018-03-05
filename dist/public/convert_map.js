/*
 * This script uses info from http://stackabuse.com/reading-and-writing-json-files-with-node-js/
 * to read in the wsc file, parse it as json, and then write out a new .wsc
 * file with the correct attributes
 *
 */


'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('base_grass_map.wsc');
let map_object = JSON.parse(rawdata);

let terrain = map_object.modules.iso.terrain;
terrain.numTilesX = 100;
terrain.numTilesZ = 100;
terrain.tileData[0].texture = "../public/tilesets/basic_flat_terrain.png";

let tileDataIds = [];
for(let i = 0; i < terrain.numTilesZ; i++) {
    tileDataIds.push([]);
    for(let j = 0; j < terrain.numTilesX; j++) {
        tileDataIds[i][j] = 0; 
    }
}
terrain.tileDataIds = tileDataIds;

let transitionDataIds = [];
for(let i = 0; i < terrain.numTilesZ; i++) {
    transitionDataIds.push([]);
    for(let j = 0; j < terrain.numTilesX; j++) {
        transitionDataIds[i][j] = -1; 
    }
}
terrain.transitionDataIds = transitionDataIds;

let detailDataIds = [];
for(let i = 0; i < terrain.numTilesZ; i++) {
    detailDataIds.push([]);
    for(let j = 0; j < terrain.numTilesX; j++) {
        detailDataIds[i][j] = -1; 
    }
}
terrain.detailDataIds = detailDataIds;


let new_data = JSON.stringify(map_object, null, 2);
fs.writeFileSync('largest_grass_map.wsc', new_data);
