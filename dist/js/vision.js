importScripts( './lodash.js', './calculations.js');


onmessage = function(e) {
    console.log('Message received!');
    console.log(e.data);    
    console.log(_);
    console.log(Calculation);
    console.log

    var spotlights = e.data.spotlightArray;
    var mapBounds = e.data.mapBounds;
    var paintFog = [];
    var paintClear = [];

    _.forEach(spotlights, (spotlight) => { 
        console.log("calculating...");
        var paintArrays = Calculation.calculatePaintVision(spotlight.coords, spotlight.vision,
                mapBounds);
        console.log(paintArrays);
        console.log("done calculating");
        paintFog = _.unionWith(paintFog, paintArrays.fog, _.isEqual);
        paintClear = _.unionWith(paintClear, paintArrays.clear, _.isEqual);
    });
    paintFog = _.differenceWith(paintFog, paintClear, _.isEqual);

    var aiCoords = e.data.aiCoords;
    console.log("AICOORDS");
    console.log(aiCoords);

    // Determine which ai units are in fog or in the clear
    var aiUnitsInFog = _.map(aiCoords, (coord) => {
        if(_.some(paintFog, (fogCoord) => {
            return _.isEqual(coord, fogCoord) 
        }) )
            return true;
        else {
            return false;
        }
    });
    var aiUnitsInClear = _.map(aiCoords, (coord) => {
        if(_.some(paintClear, (clearCoord) => {
            return _.isEqual(coord, clearCoord) 
        }) )
            return true;
        else {
            return false;
        }
    });

    var result = {
        fog: paintFog,
        clear: paintClear,
        aiFog: aiUnitsInFog,
        aiClear: aiUnitsInClear,
    };
    console.log(result);

    postMessage(result);
    
}
