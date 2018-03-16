import * as _ from 'lodash';
import GlobalGameState from '../model/state/global-game-state';
import Unit from '../model/units/units';
import AiGamePlay from './ai-gameplay';
import JsonMap from './json-map';

declare var wade: any;

async function delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
        wade.setTimeout(resolve, milliseconds);
 });
}

const UnitDec = {
    playerUnitsWatch: async () => {
        const global = wade.getSceneObject('global');
        const playerUnits: Unit[] = global.state.getPlayer().getUnits();
        const aiUnits: Unit[] = global.state.getAi().getUnits();
        const worker = new Worker('../js/playerWatch.js');
        worker.onmessage = function(e) {
            const attackInstructions = e.data;
            _.forEach(attackInstructions, (instruction) => {
                AiGamePlay.playerUnitAttack(instruction.attacker, instruction.target);
            });
        };

        while (global && global.isRunning) {
            // Use player and ai arrays to generate correct data
            // for the thread. From player units, we need vision, location,
            // and current activity status of the unit, as well
            // as the id. This is important, and cannot be gotten wrong.
            const playerUnitData = _.map(playerUnits, (unit) => {
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

            const aiUnitData = _.map(aiUnits, (unit) => {
                return {
                    coords: {
                        x: unit.rep.iso.gridCoords.x,
                        z: unit.rep.iso.gridCoords.z,
                    },
                    id: unit.getId(),
                };
            });

            const data = {
                player: playerUnitData,
                ai: aiUnitData,
            };

            worker.postMessage(data);

            await delay(1000);
        }

    },
    aiUnitsWatch: async () => {
        const global = wade.getSceneObject('global');
        const playerUnits: Unit[] = global.state.getPlayer().getUnits();
        const aiUnits: Unit[] = global.state.getAi().getUnits();
        const worker = new Worker('../js/aiWatch.js');
        let workerReady = true;
        worker.onmessage = function(e) {
            const attackInstructions = e.data;
            _.forEach(attackInstructions, (instruction) => {
                AiGamePlay.unitAttack(instruction.attacker, instruction.target);
            });
            workerReady = true;
        };

        while (global && global.isRunning) {
            // Use player and ai arrays to generate correct data
            // for the thread. From ai units, we need vision, location,
            // and current activity status of the unit, as well
            // as the id. This is important, and cannot be gotten wrong.
            const aiUnitData = _.map(aiUnits, (unit) => {
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

            const playerUnitData = _.map(playerUnits, (unit) => {
                return {
                    coords: {
                        x: unit.rep.iso.gridCoords.x,
                        z: unit.rep.iso.gridCoords.z,
                    },
                    id: unit.getId(),
                };
            });

            const data = {
                player: playerUnitData,
                ai: aiUnitData,
            };

            worker.postMessage(data);
            workerReady = false;

            await delay(1000);
        }

    },

};

export default UnitDec;
