import GlobalGameState from "../model/state/global-game-state"
import JsonMap from './json-map';


declare var wade: any;

async function delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
        wade.setTimeout(resolve, milliseconds);
 });
} 


const unitDec = {
	 loop: async (globalState, unit) =>{ 
		while(true){
			await delay(1500);
			let aistate=globalState.getAi();
			let playerstate=globalState.getPlayer();
			//if unit is a player unit
			if(!(unit in aistate.units)){
				
			}
			//if unit is an ai unit
			else{
				
			}
		}
		 
	 },
	
	
}; 



export default unitDec;
