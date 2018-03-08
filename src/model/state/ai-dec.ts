import AiGamePlay from  "../../controller/ai-gameplay";
import GlobalGameState from "./global-game-state";
import JsonMap from "../../controller/json-map";


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


function resourceCheck(objectname,state,isHard){
	var aiStone=state["stone"];
	var aiWood=state["wood"];
	var aiFood=state["food"];
	if(isHard){
		aiStone=aiStone *2;
		aiWood=aiWood*2;
		aiFood=aiFood*2;
	}
	
	var archeryCal=JsonMap.archer_calvary_cost;
    var archer=JsonMap.archer_cost;
    var drummer=JsonMap.drummer_boy_cost;
    var gather=JsonMap.gatherer_cost;
    var spearCal=JsonMap.spear_calvary_cost;
    var swordsman=JsonMap.swordsman_cost;
    var barracks=JsonMap.barracks_cost;
    var stables=JsonMap.stables_cost;
    var townhall=JsonMap.townhall_cost;
    var tower=JsonMap.tower_cost;
	if(objectname=="ArcherCalvary"){
		if(aiStone>=archeryCal["stone"] && aiWood >=archeryCal["wood"] && aiFood>=archeryCal["food"]){
			return true;
		}
		else{
			return false;
		}
		
	}
	else if(objectname=="SpearCalvary"){
		if(aiStone>=spearCal["stone"] && aiWood >=spearCal["wood"] && aiFood>=spearCal["food"]){
			return true;
		}
		else{
			return false;
		}
		
	}
	else if(objectname=="Swordsman"){
		if(aiStone>=swordsman["stone"] && aiWood >=swordsman["wood"] && aiFood>=swordsman["food"]){
			return true;
		}
		else{
			return false;
		}	
		
	}
	else if(objectname=="Gatherer"){
		if(aiStone>=gather["stone"] && aiWood >=gather["wood"] && aiFood>=gather["food"]){
			return true;
		}
		else{
			return false;
		}		
		
	}
	else if(objectname=="Archer"){
		if(aiStone>=archer["stone"] && aiWood >=archer["wood"] && aiFood>=archer["food"]){
			return true;
		}
		else{
			return false;
		}	
	}
	else if(objectname=="Barracks"){
		if(aiStone>=barracks["stone"] && aiWood >=barracks["wood"] && aiFood>=barracks["food"]){
			return true;
		}
		else{
			return false;
		}	
	}
	else if(objectname=="Stables"){
		if(aiStone>=stables["stone"] && aiWood >=stables["wood"] && aiFood>=stables["food"]){
			return true;
		}
		else{
			return false;
		}		
	}
	else if(objectname=="TownHall"){
		if(aiStone>=townhall["stone"] && aiWood >=townhall["wood"] && aiFood>=townhall["food"]){
			return true;
		}
		else{
			return false;
		}	
	}
	else if(objectname=="Tower"){
		if(aiStone>=tower["stone"] && aiWood >=tower["wood"] && aiFood>=tower["food"]){
			return true;
		}
		else{
			return false;
		}	
	}	
	else{
		console.log("invalid string");
		return false;
	}
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
	 decisions: async (globalState, AiVip, playerVIP,isHardMode) =>{ 
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
		let time: number=2000;
		if(isHardMode){
			time=1000;
		}
		while(true){
			await delay(time);
			if(currentState=="setup"){console.log("Settingup")
				if(step==0){
					  if(resourceCheck("Barracks",aistate,isHardMode)){
						AiGamePlay.constructBuilding("Barracks", 0, 10);
						barracks=true;
						step++;
					  }
					  else{
						  gathering=AiGamePlay.constructUnit("Gatherer",3,1);
						  let resLoc=mapSearch(map,"resource");
						  AiGamePlay.unitGather(gathering.id,resLoc);
						  await delay(4000);
						  
					  }
				}
				else if(step==1){
					if(resourceCheck("Swordsman",aistate,isHardMode)){
						sword=AiGamePlay.constructUnit("Swordsman", 2, 1);
					}
					if(resourceCheck("Gatherer",aistate,isHardMode)){					
						gathering=AiGamePlay.constructUnit("Gatherer",3,1);
						step++;
					}
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
								//starts at 1 to avoid sending vip
								for(var i=1;i<aistate.units.length;i++){
									if(aistate.units.length>4){
									AiGamePlay.unitAttack(aistate.units[i],enemLoc);
									};
								}
							}
							else{
								if(aistate.units.length>4)
								{
									var singleAttack=mapSearch(map,"unit");
									AiGamePlay.unitAttack(aistate.units[4], singleAttack);
								}
							}
						}
					}
					if(aistate.units.length<10){
						//resourcecheck
						var tempUnit=AiGamePlay.constructUnit("SpearCalvary",3,1);
						AiGamePlay.unitMove(tempUnit.id,4,2);
						tempUnit=AiGamePlay.constructUnit("ArcherCalvary",3,1);
						AiGamePlay.unitMove(tempUnit.id,5,3);
						
					}
				}
				console.log("check resources if stable build calvary");
				console.log("move units towards player");
				};
			if(currentState=="defense"){console.log("defending")
				for(i=0;i<aistate.units.length;i++){
						//toDO Get VIP Cordinates
						//AiGamePlay.unitMove(units[j].id,
					}
				};			
		}
		 
	 },
	
	
};

export default AiDec;
