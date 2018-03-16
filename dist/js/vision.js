importScripts( './lodash.js', './calculations.js');


onmessage = function(e) {

    var spotlights = e.data.spotlightArray;
    var mapBounds = e.data.mapBounds;
    var paintFog = [];
    var paintClear = [];

    _.forEach(spotlights, (spotlight) => { 
        var paintArrays = Calculation.calculatePaintVision(spotlight.coords, spotlight.vision,
                mapBounds);
        paintFog = _.concat(paintFog, paintArrays.fog);
        paintClear = _.concat(paintClear, paintArrays.clear);
    });
    // paintFog = _.differenceWith(paintFog, paintClear, _.isEqual);

    var aiCoords = e.data.aiCoords;


    var result = {
        fog: paintFog,
        clear: paintClear,
        id: e.data.id,
    };

    postMessage(result);
    
}
