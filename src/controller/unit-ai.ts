import GlobalGameState from "../model/state/global-game-state"
import JsonMap from './json-map';
import * as _ from 'lodash';
import Unit from '../model/units/units';
import AiGamePlay from './ai-gameplay';


declare var wade: any;

async function delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
        wade.setTimeout(resolve, milliseconds);
 });
} 


const UnitDec = {
    playerUnitsWatch: async () => {
        let global = wade.getSceneObject('global');
        let playerUnits: Unit[] = global.state.getPlayer().getUnits();
        let aiUnits: Unit[] = global.state.getAi().getUnits();
        let worker = new Worker('../js/playerWatch.js');
        worker.onmessage = function(e) {
            console.log(e.data); 
            let attackInstructions = e.data;
            _.forEach(attackInstructions, (instruction) => {
                AiGamePlay.playerUnitAttack(instruction.attacker, instruction.target); 
            });
        };

        while(global && global.isRunning) {
            // Use player and ai arrays to generate correct data 
            // for the thread. From player units, we need vision, location,
            // and current activity status of the unit, as well
            // as the id. This is important, and cannot be gotten wrong.
            let playerUnitData = _.map(playerUnits, (unit) => {
                return {
                    coords: {
                        x: unit.rep.iso.gridCoords.x,
                        z: unit.rep.iso.gridCoords.z,
                    },
                    vision: unit.vision,
                    active: unit.rep.shouldPursue || unit.rep.isAttacking || 
                            unit.rep.shouldGather || unit.rep.isGathering ||
                            unit.rep.data.isMoving,
                    id: unit.getId(),
                };
            });
        
            let aiUnitData = _.map(aiUnits, (unit) => {
                return {
                    coords: {
                        x: unit.rep.iso.gridCoords.x,
                        z: unit.rep.iso.gridCoords.z,
                    },
                    id: unit.getId(),
                };
            });

            let data = {
                player: playerUnitData,
                ai: aiUnitData,
            }

            worker.postMessage(data);
        
        
            await delay(1000);
        }
    
    
    },
    aiUnitsWatch: async () => {
        let global = wade.getSceneObject('global');
        let playerUnits: Unit[] = global.state.getPlayer().getUnits();
        let aiUnits: Unit[] = global.state.getAi().getUnits();
        let worker = new Worker('../js/aiWatch.js');
        worker.onmessage = function(e) {
            console.log(e.data); 
            let attackInstructions = e.data;
            _.forEach(attackInstructions, (instruction) => {
                AiGamePlay.unitAttack(instruction.attacker, instruction.target); 
            });
        };

        while(global && global.isRunning) {
            // Use player and ai arrays to generate correct data 
            // for the thread. From ai units, we need vision, location,
            // and current activity status of the unit, as well
            // as the id. This is important, and cannot be gotten wrong.
            let aiUnitData = _.map(aiUnits, (unit) => {
                return {
                    coords: {
                        x: unit.rep.iso.gridCoords.x,
                        z: unit.rep.iso.gridCoords.z,
                    },
                    vision: unit.vision,
                    active: unit.rep.shouldPursue || unit.rep.isAttacking || 
                            unit.rep.shouldGather || unit.rep.isGathering ||
                            unit.rep.data.isMoving,
                    id: unit.getId(),
                };
            });
        
            let playerUnitData = _.map(playerUnits, (unit) => {
                return {
                    coords: {
                        x: unit.rep.iso.gridCoords.x,
                        z: unit.rep.iso.gridCoords.z,
                    },
                    id: unit.getId(),
                };
            });

            let data = {
                player: playerUnitData,
                ai: aiUnitData,
            }

            worker.postMessage(data);
        
        
            await delay(1000);
        }
    
    }
	
}; 



export default UnitDec;
