
importScripts( './lodash.js', './calculations.js');



onmessage = function(e) {

    let playerUnits = e.data.player;
    let aiUnits = e.data.ai;

    let result = [];
    // For each player unit, check if any ai unit is in its vision. If so,
    // add an entry for that player unit to attack.
    _.forEach(aiUnits, (au) => {
        if(!au.active) {
            for (let i = 0; i < playerUnits.length; i++) {
                let pu = playerUnits[i];
                if (Calculation.attackerSeesTarget(au, pu) ) {
                    result.push({attacker: au.id, target: pu.id }); 
                    break;
                }
            }
        }
    });

    // Send the results back to the main thread.
    postMessage(result);
}
