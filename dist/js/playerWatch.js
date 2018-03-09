
importScripts( './lodash.js', './calculations.js');


onmessage = function(e) {

    console.log(e.data);
    let playerUnits = e.data.player;
    let aiUnits = e.data.ai;

    let result = [];
    // For each player unit, check if any ai unit is in its vision. If so,
    // add an entry for that player unit to attack.
    _.forEach(playerUnits, (pu) => {
        if(!pu.active) {
            for (let i = 0; i < aiUnits.length; i++) {
                let au = aiUnits[i];
                if (Calculation.attackerSeesTarget(pu, au) ) {
                    result.push({attacker: pu.id, target: au.id }); 
                    break;
                }
            }
        }
    });

    // Send the results back to the main thread.
    postMessage(result);
}
