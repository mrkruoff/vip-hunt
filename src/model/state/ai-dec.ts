import AiGamePlay from  "../../controller/ai-gameplay"
import GlobalGameState from "./global-game-state"


declare var wade: any;

function mapSearch(map, aString){
	for(var i=0; i<map.length;i++){
		var row=map[i];
		for(var j=0; i<row.length;j++){
			if(aString=="resource"){
			if (row[j].resourceId>0){
				return row[j].resourceId;
			}
			}
			else if(aString=="unit"){
				if(row[j].unitId>0){
					return row[j].unitId;
				}
			}
		}
	}
	return 0;
};


// This function sets up an asynchronouse delay that allows for
// delayed while loops
//Based on https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html which gives an example of the delay function.
 async function delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
        wade.setTimeout(resolve, milliseconds);
 });
} 

const AiDec = {
	 decisions: async (globalState, AiVip, playerVIP) =>{ 
		let aistate=globalState.getAi();
		let currentState="setup";
		let step=0;
		let map=globalState.getMap();
		let townhouse: boolean=true;
		let barracks: boolean=false;
		let stable: boolean=false;
		let tower: boolean=false;
		let sword: any;
		let gathering: any;
		while(true){
			await delay(1500);
			if(currentState=="setup"){console.log("Settingup")
				if(step==0){
						AiGamePlay.constructBuilding("Barracks", 0, 10);
						barracks=true;
						step++;
				}
				else if(step==1){
						sword=AiGamePlay.constructUnit("Swordsman", 2, 1);
						gathering=AiGamePlay.constructUnit("Gatherer",3,1);
						step++;
				}
				else{
					AiGamePlay.unitMove(sword.id,1,2);
					AiGamePlay.unitMove(AiVip.id,0,2);
					var resLoc=mapSearch(map,"resource");
					if (resLoc!=0){
						AiGamePlay.unitGather(gathering.id,resLoc);
					}
					currentState="offense";}
				};
			if(currentState=="offense"){console.log("Attacking");
				if(stable=false){
				AiGamePlay.constructBuilding("Stable", 0, 5);
				stable=true;
				}
				else if(tower=false){
					AiGamePlay.constructBuilding("Tower", 3, 0);
					stable=true;
				}
				else{
					var enemLoc=mapSearch(map,"unit");
					if(enemLoc!=0){
						if(!(enemLoc in aistate.units)){
							if(enemLoc==playerVIP.id){
								for(var i=0;i<aistate.units.length;i++){
									AiGamePlay.unitAttack(aistate.units[i],enemLoc);
								}
							}
						}
					
					}
				}
				console.log("Checkresrouces, build watchtower");
				console.log("check resources if stable build calvary");
				console.log("move units towards player");
				};
			if(currentState=="defense"){console.log("defending")
				console.log("Move Avaiable units back to VIP");
				};			
		}
		 
	 },
	
	
};

export default AiDec;
