import AiGamePlay from  "../../controller/ai-gameplay";
import GlobalGameState from "./global-game-state";
import JsonMap from "../../controller/json-map";


declare var wade: any;

function mapSearch(map, aString){
	for(var i=0; i<map.length;i++){
		var row=map[i];
		for(var j=0; j<row.length;j++){
		if(row[j]!=null){
			if(aString=="resource"){
			if (row[j].getResourceId()>0){
				console.log(i,j);
				console.log(row[j]);
				return row[j].getResourceId();
				
			}
			}
			else if(aString=="unit"){
				console.log("Searching for unit");
				console.log(i, j);
				if (row[j].getUnitId() >0){
					console.log(row[j]);
					return row[j].getUnitId() ;
				
				}
			}
			}
		}
	}
	return 0;
};

function chooseUnit(name, state){
	var units=state.getUnits();
	for(var i=0;i<units.length;i++){
	if(units[i].getClassName()==name && units[i]["hp"]>0){
			return units[i].getId();
		}
	}
	
	return false; 
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
	console.log("Stone:"+aiStone+"Wood:"+aiWood+"aiFood:"+aiFood);
	var archeryCal=wade.getJson(JsonMap.archer_calvary_cost);
    var archer=wade.getJson(JsonMap.archer_cost);
    var drummer=wade.getJson(JsonMap.drummer_boy_cost);
    var gather=wade.getJson(JsonMap.gatherer_cost);
    var spearCal=wade.getJson(JsonMap.spear_calvary_cost);
    var swordsman=wade.getJson(JsonMap.swordsman_cost);
    var barracks=wade.getJson(JsonMap.barracks_cost);
    var stables=wade.getJson(JsonMap.stables_cost);
    var townhall=wade.getJson(JsonMap.townhall_cost);
    var tower=wade.getJson(JsonMap.tower_cost);
	console.log(barracks["stone"]);
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
	 decisions: async (globalState,isHardMode) =>{ 
		let aistate=globalState.getAi();
		let playerState=globalState.getPlayer();
		let AiVip=aistate.units[0];
		let playerVIP=playerState.units[0];
		let currentState="setup";
		console.log(currentState);
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
			if(aistate.getActionState()=="setup")
				{console.log("Settingup step:"+step)
				if(step==0){
					  if(resourceCheck("Barracks",aistate,isHardMode)){
						AiGamePlay.constructBuilding("Barracks", 0, 10);
						barracks=true;
						console.log("Barracks Built");
						step++;
					  }
					  else{
						  gathering=AiGamePlay.constructUnit("Gatherer",3,1);
						  var resource=mapSearch(map,"resource");
						  AiGamePlay.unitGather(gathering.id,resource);
						  console.log("Gathering, waiting");
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
					aistate["actionState"]="offense";}
				};
			if(aistate.getActionState()=="offense"){console.log("Attacking");
				if(stable=false){
				console.log("stable");
				AiGamePlay.constructBuilding("Stable", 0, 15);
				stable=true;
				}
				else if(tower=false){
					console.log("tower")
					AiGamePlay.constructBuilding("Tower", 0, 20);
					stable=true;
				}
				else{
					console.log("Finding Enemy");
					var enemLoc=mapSearch(map,"unit");
					console.log(enemLoc);
					if(enemLoc>0){
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
		
		}
		 
	 },
	
	
};

export default AiDec;