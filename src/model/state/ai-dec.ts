import AiGamePlay from  "../../controller/ai-gameplay";
import GlobalGameState from "./global-game-state";
import JsonMap from "../../controller/json-map";


declare var wade: any;

function mapSearch(map, aString,playerState){
	for(var i=0; i<map.length;i++){
		var row=map[i];
		for(var j=0; j<row.length;j++){
		if(row[j]!=null){
			if(aString=="resource"){
			if (row[j].getResourceId()>0){
				return row[j].getResourceId();
				
			}
			}
			else if(aString=="unit"){
				console.log("Searching for unit");
				if (row[j].getUnitId() >=0){
					var playerUnits=playerState.getUnits();
					console.log(playerUnits);
					for(var k=0;k<playerUnits.length;k++)
					{	console.log(playerUnits[k].getId()+" " +row[j].getUnitId());
						if(playerUnits[k].getId()==row[j].getUnitId()){
							return row[j].getUnitId()
							} ;
					}
					
				}
			}
			}
		}
	}
	return false;
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

function chooseBuilding(name, state){
	var buildings=state.getBuildings();
	for(var i=0;i<buildings.length;i++){
	if(buildings[i].getClassName()==name && buildings[i]["hp"]>0){
			return buildings[i].getId();
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
		let AiVip=chooseUnit("VIP",aistate);
		console.log("AiVIP:"+AiVip);
		let playerVIP=chooseUnit("VIP",playerState);
		console.log("PlayerVIP:"+playerVIP);
		let currentState="setup";
		console.log(currentState);
		let step=0;
		let stable=false;
		let tower=false;
		let map=globalState.getMap();
		let sword: any;
		let gathering: any;
		let time: number=2000;
		if(isHardMode){
			time=1000;
		}
		while(true){
			await delay(time);
			if(aistate.getActionState()=="setup")
				{console.log("Settingup step")
				if(chooseBuilding("Barracks",aistate)==false){
						AiGamePlay.constructBuilding("Barracks", 0, 10);
						console.log("Barracks Built");
				}
				else if(chooseUnit("Swordsman",aistate)==false || chooseUnit("Gatherer",aistate)==false){
					if(resourceCheck("Swordsman",aistate,isHardMode)){
						sword=AiGamePlay.constructUnit("Swordsman", 2, 1);
					}
					if(resourceCheck("Gatherer",aistate,isHardMode)){					
						gathering=AiGamePlay.constructUnit("Gatherer",3,1);
					}
				}
				else{
					AiGamePlay.unitMove(sword.id,1,2);
					AiGamePlay.unitMove(AiVip,0,2);
					var resLoc=mapSearch(map,"resource",playerState);
					if (resLoc!=0){
						AiGamePlay.unitGather(gathering.id,resLoc);
					}
					aistate["actionState"]="offense";}
				};
			if(aistate.getActionState()=="offense"){console.log("Attacking");
				if(stable==false){
				console.log("stable");
				AiGamePlay.constructBuilding("Stables", 0, 15);
				stable=true;
				}
				else if(tower==false){
					console.log("tower")
					AiGamePlay.constructBuilding("Tower", 0, 20);
					tower=true;
				}
				else{
					console.log("Finding Enemy");
					var enemLoc=mapSearch(map,"unit",playerState);
					console.log("enem Location id:"+enemLoc);
					var units=aistate.getUnits();
					if(enemLoc>=0){
							if(enemLoc==playerVIP){
								//starts at 1 to avoid sending vip
								for(var i=0;i<units.length;i++){
									if(units[i].getId()!=chooseUnit("VIP",aistate)){
									if(units.length>4){
									console.log("Unit ID:"+units[i].getId());
									AiGamePlay.unitAttack(units[i].getId(),enemLoc);
									console.log("Attacking VIP");
									}
									}
								}
							}
							else{
								if(aistate.units.length>4)
								{
									var singleAttack=mapSearch(map,"unit",playerState);
									var swordsman=chooseUnit("Swordsman",aistate);
									if(swordsman!=false){
									console.log(swordsman,singleAttack);
									if(singleAttack!=false){
									AiGamePlay.unitAttack(swordsman, singleAttack);}
									console.log("Attacking Non-Vip");
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