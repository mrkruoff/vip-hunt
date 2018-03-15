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
				if (row[j].getUnitId() >=0){
					var playerUnits=playerState.getUnits();
				
					for(var k=0;k<playerUnits.length;k++)
					{	
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


function findStart(map,state){
	var buildings=state.getBuildings();
	var thall=buildings[0];
	for(var i=0;i<map.length;i++){
		var row=map[i];
		for(var j=0; j<row.length;j++){
			if(row[j].getBuildingId()==thall.getId()){
				return [i,j];
			}
		}
	}
}




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
			if(isHard){
			 state["stone"]=state["stone"]-archeryCal["stone"]/2;
			 state["wood"]=state["wood"]-archeryCal["wood"]/2;
			 state["food"]=state["food"]-archeryCal["food"]/2;
			 return true;
			}
			else{
			 state["stone"]=state["stone"]-archeryCal["stone"]; 
			 state["wood"]=state["wood"]-archeryCal["wood"] ;
			 state["food"]=state["food"]-archeryCal["food"] ;
			return true;
			}
		}
		else{
			return false;
		}
		
	}
	else if(objectname=="SpearCalvary"){
		if(aiStone>=spearCal["stone"] && aiWood >=spearCal["wood"] && aiFood>=spearCal["food"]){
			if(isHard){
			 state["stone"]=state["stone"]-spearCal["stone"] /2;
			 state["wood"]=state["wood"]- spearCal["wood"]/2;
			 state["food"]=state["food"]- spearCal["food"]/2;
			 return true;
			}
			else{
			 state["stone"]=state["stone"]-spearCal["stone"] ;
			 state["wood"]=state["wood"]-spearCal["wood"];
			 state["food"]=state["food"]- spearCal["food"];
			return true;
			}
		}
		else{
			return false;
		}
		
	}
	else if(objectname=="Swordsman"){
		if(aiStone>=swordsman["stone"] && aiWood >=swordsman["wood"] && aiFood>=swordsman["food"]){
			if(isHard){
			 state["stone"]=state["stone"]- swordsman["stone"]/2;
			 state["wood"]=state["wood"]- swordsman["wood"]/2;
			 state["food"]=state["food"]- swordsman["food"]/2;
			 return true;
			}
			else{
			 state["stone"]=state["stone"]-swordsman["stone"] ;
			 state["wood"]=state["wood"]- swordsman["wood"];
			 state["food"]=state["food"]- swordsman["food"];
			return true;
			}
		}
		else{
			return false;
		}	
		
	}
	else if(objectname=="Gatherer"){
		if(aiStone>=gather["stone"] && aiWood >=gather["wood"] && aiFood>=gather["food"]){
			if(isHard){
			 state["stone"]=state["stone"]- gather["stone"]/2;
			 state["wood"]=state["wood"]- gather["wood"]/2;
			 state["food"]=state["food"]- gather["food"]/2;
			 return true;
			}
			else{
			 state["stone"]=state["stone"]-gather["stone"] ;
			 state["wood"]=state["wood"]-gather["wood"] ;
			 state["food"]=state["food"]-gather["food"] ;
			return true;
			}
		}
		else{
			return false;
		}		
		
	}
	else if(objectname=="Archer"){
		if(aiStone>=archer["stone"] && aiWood >=archer["wood"] && aiFood>=archer["food"]){
			if(isHard){
			 state["stone"]=state["stone"]- archer["stone"]/2;
			 state["wood"]=state["wood"]- archer["wood"]/2;
			 state["food"]=state["food"]- archer["food"]/2;
			 return true;
			}
			else{
			 state["stone"]=state["stone"]-archer["stone"] ;
			 state["wood"]=state["wood"]- archer["wood"];
			 state["food"]=state["food"]- archer["food"];
			return true;
			}
		}
		else{
			return false;
		}	
	}
	else if(objectname=="Barracks"){
		if(aiStone>=barracks["stone"] && aiWood >=barracks["wood"] && aiFood>=barracks["food"]){
			if(isHard){
			 state["stone"]=state["stone"]- barracks["stone"]/2;
			 state["wood"]=state["wood"]-barracks["wood"]/2;
			 state["food"]=state["food"]- barracks["food"]/2;
			 return true;
			}
			else{
			 state["stone"]=state["stone"]- barracks["stone"];
			 state["wood"]=state["wood"]- barracks["wood"];
			 state["food"]=state["food"]-barracks["food"] ;
			return true;
			}
		}
		else{
			return false;
		}	
	}
	else if(objectname=="Stables"){
		if(aiStone>=stables["stone"] && aiWood >=stables["wood"] && aiFood>=stables["food"]){
			if(isHard){
			 state["stone"]=state["stone"]- stables["stone"]/2;
			 state["wood"]=state["wood"]- stables["wood"]/2;
			 state["food"]=state["food"]- stables["food"]/2;
			 return true;
			}
			else{
			 state["stone"]=state["stone"]- stables["stone"];
			 state["wood"]=state["wood"]- stables["wood"];
			 state["food"]=state["food"]-stables["food"];
			return true;
			}
		}
		else{
			return false;
		}		
	}
	else if(objectname=="TownHall"){
		if(aiStone>=townhall["stone"] && aiWood >=townhall["wood"] && aiFood>=townhall["food"]){
			if(isHard){
			 state["stone"]=state["stone"]- townhall["stone"]/2;
			 state["wood"]=state["wood"]- townhall["wood"]/2;
			 state["food"]=state["food"]- townhall["food"]/2;
			 return true;
			}
			else{
			 state["stone"]=state["stone"]- townhall["stone"];
			 state["wood"]=state["wood"]- townhall["wood"];
			 state["food"]=state["food"]-townhall["food"] ;
			return true;
			}
		}
		else{
			return false;
		}	
	}
	else if(objectname=="Tower"){
		if(aiStone>=tower["stone"] && aiWood >=tower["wood"] && aiFood>=tower["food"]){
			 if(isHard){
			 state["stone"]=state["stone"]-tower["stone"]/2;
			 state["wood"]=state["stone"]- tower["wood"]/2;
			 state["food"]=state["stone"]- tower["food"]/2;
			 return true;
			}
			else{
			 state["stone"]=state["stone"]- tower["stone"];
			 state["wood"]=state["stone"]- tower["wood"];
			 state["food"]=state["stone"]- tower["food"];
			return true;
			}
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
        if(isHardMode) {
            console.log("HARD MOOOODDDE"); 
        }
        else {
            console.log("easy mode"); 
        }
		let aistate=globalState.getAi();
		let playerState=globalState.getPlayer();
		let AiVip=chooseUnit("VIP",aistate);
		console.log("AiVIP:"+AiVip);
		let playerVIP=chooseUnit("VIP",playerState);
		console.log("PlayerVIP:"+playerVIP);
		let step=0;
		let stable=false;
		let tower=false;
		let map=globalState.getMap();
		console.log(findStart(map, aistate));
		let startCord=findStart(map,aistate);
		let xcord=startCord[0];
		let zcord=startCord[1];
		if(xcord==46){
			xcord=34;
		}
		if(zcord==46){
			zcord=34;	
		}
		let sword: any;
		let gathering: any;
		let time: number=4000;
		if(isHardMode){
			time=2000;
		}
		while(true){
			await delay(time);
			if(aistate.getActionState()=="setup"){
				console.log("Settingup step")
				if(chooseBuilding("Barracks",aistate)==false){
						AiGamePlay.constructBuilding("Barracks",startCord[1],xcord+3);
						console.log("Barracks Built");
				}
				else if(chooseUnit("Swordsman",aistate)==false || chooseUnit("Gatherer",aistate)==false){
					if(chooseUnit("Swordsman",aistate)==false){
					if(resourceCheck("Swordsman",aistate,isHardMode)){
						sword=AiGamePlay.constructUnit("Swordsman", startCord[1],xcord+4 );
					}
					}
					else if(chooseUnit("Gatherer",aistate)==false){
					 if(resourceCheck("Gatherer",aistate,isHardMode)){					
						gathering=AiGamePlay.constructUnit("Gatherer",startCord[1],xcord+1);
					}
					}
				}
				else{
					AiGamePlay.unitMove(sword.id,startCord[1],xcord);
					AiGamePlay.unitMove(AiVip,startCord[1],xcord);
					var resLoc=mapSearch(map,"resource",playerState);
					if (resLoc!=0){
						AiGamePlay.unitGather(gathering.id,resLoc);
					}
					aistate["actionState"]="offense";
					console.log(aistate);
					console.log(globalState["ai_state"]);}
				};
			if(aistate.getActionState()=="offense"){
				console.log("Attacking");
				if(chooseBuilding("Stables",aistate)==false){
				if(resourceCheck("Stables",aistate,isHardMode)==false){
					aistate["actionState"]="gather";
				}
				else{
				console.log("stable");
				AiGamePlay.constructBuilding("Stables", startCord[1],xcord+6);}
				}
				else if(chooseBuilding("Tower",aistate)==false){
				if(resourceCheck("Tower",aistate, isHardMode)==false){
					aistate["actionState"]="gather";
					
				}
				else{
					console.log("tower")
				AiGamePlay.constructBuilding("Tower", startCord[1],xcord+9);
				await delay(5000)
				}
				}
				else if(chooseBuilding("Barracks",aistate)==false){
					if(resourceCheck("Barracks",aistate,isHardMode)==false){
						aistate["actionState"]="gather";
					}
					else{
					console.log("Barracks")
					AiGamePlay.constructBuilding("Barracks", startCord[1], xcord+3);
					}
				}
				else if(chooseBuilding("TownHall",aistate)==false){
					if(resourceCheck("TownHall",aistate,isHardMode)==false){
						aistate["actionState"]="gather";
					}
					else{
					console.log("TownHall")
					AiGamePlay.constructBuilding("TownHall", startCord[1], xcord);
					}
				}
				else{
					console.log("Finding Enemy");
					var enemLoc=mapSearch(map,"unit",playerState);
					console.log("enem Location id:"+enemLoc);
					var units=aistate.getUnits();
					if(units.length<4){
						console.log("Need MOre Units");
						if(resourceCheck("Archer",aistate,isHardMode)==false){
						aistate["actionState"]="gather";
						}
						else{
							var archer=AiGamePlay.constructUnit("Archer", startCord[1], xcord+1);
							AiGamePlay.unitMove(archer.getId(), startCord[1],xcord);
						}

					}
					else if(enemLoc>=0){
						console.log("Enemy Found");
						if(isHardMode){
							console.log("Hard Mode");
							if(enemLoc==playerVIP){
								for(var i=0;i<units.length;i++){
									if(units[i].getId()!=chooseUnit("VIP",aistate)&&units[i].getId()!=chooseUnit("Archer",aistate)){
									if(units.length>8){
									console.log("Unit ID:"+units[i].getId());
									AiGamePlay.unitAttack(units[i].getId(),enemLoc);
									console.log("Attacking VIP");
									}
									else{
										if(resourceCheck("ArcherCalvary",aistate,isHardMode)==false){
										aistate["actionState"]="gather";
										}
										else{
										var archerCal=AiGamePlay.constructUnit("ArcherCalvary", startCord[1], xcord+7);
										
										}	
										if(resourceCheck("SpearCalvary",aistate,isHardMode)==false){
										aistate["actionState"]="gather";
										}
										else{
										var spearCal=AiGamePlay.constructUnit("SpearCalvary", startCord[1],xcord+8)		
										}	

								
									}
									}
								}
							}
							else{
								if(units.length>=4)
								{
									if(chooseUnit("ArcherCalvary",aistate)==false){
										console.log("Building ArcherCal");
										if(resourceCheck("ArcherCalvary",aistate,isHardMode)==false){
										aistate["actionState"]="gather";
										}
										else{
										console.log("ArcherCalvary");
										AiGamePlay.constructUnit("ArcherCalvary", startCord[1], xcord+7 );}
									}
									else if(chooseUnit("SpearCalvary",aistate)==false){
										console.log("Building SpearCal");
										if(resourceCheck("SpearCalvary",aistate, isHardMode)==false){
										aistate["actionState"]="gather";		
										}
										else{
										console.log("SpearCalvary");
										AiGamePlay.constructUnit("SpearCalvary", startCord[1], xcord+8);}
									}
									else{
									console.log("Lets Attack");
									var singleAttack=mapSearch(map,"unit",playerState);
									console.log(singleAttack);
									var unittosend=Math.floor(Math.random() * (units.length - 1) + 1);
									console.log(units[unittosend].getId());
									if(singleAttack>=0){
									console.log("sendingAttack");
									AiGamePlay.unitAttack(units[unittosend].getId(), singleAttack);
									if(resourceCheck("ArcherCalvary",aistate,isHardMode)==false){
									aistate["actionState"]="gather";
									}
									else{
									console.log("ArcherCalvary");
									AiGamePlay.constructUnit("ArcherCalvary", startCord[1], xcord+7 );}
									if(resourceCheck("SpearCalvary",aistate, isHardMode)==false){
									aistate["actionState"]="gather";		
									}
									else{
									console.log("SpearCalvary");
									AiGamePlay.constructUnit("SpearCalvary", startCord[1], xcord+8);}
									await delay(1500);
										}
									}
							}
								else{
									if(resourceCheck("Swordsman",aistate,isHardMode)==false){
										aistate["actionState"]="gather";
										}
										else{
										var spearCal=AiGamePlay.constructUnit("Swordsman", startCord[1],xcord+4)		
										}	
									
									
									
								}
								}
							}
						else{
							console.log("Easy Mode");
								if(units.length>=4)
								{
									if(chooseUnit("ArcherCalvary",aistate)==false){
										console.log("Building ArcherCal");
										if(resourceCheck("ArcherCalvary",aistate,isHardMode)==false){
										aistate["actionState"]="gather";
										}
										else{
										console.log("ArcherCalvary");
										AiGamePlay.constructUnit("ArcherCalvary", startCord[1], xcord+7 );}
									}
									else if(chooseUnit("SpearCalvary",aistate)==false){
										console.log("Building SpearCal");
										if(resourceCheck("SpearCalvary",aistate, isHardMode)==false){
										aistate["actionState"]="gather";		
										}
										else{
										console.log("SpearCalvary");
										AiGamePlay.constructUnit("SpearCalvary", startCord[1], xcord+8);}
									}
									else{
									console.log("Lets Attack");
									var singleAttack=mapSearch(map,"unit",playerState);
									console.log(singleAttack);
									var unittosend=Math.floor(Math.random() * (units.length - 1) + 1);
									console.log(units[unittosend].getId());
									if(singleAttack>=0){
									console.log("sendingAttack");
									AiGamePlay.unitAttack(units[unittosend].getId(), singleAttack);
									await delay(4000);
										}
									}
							}
								else{
									if(resourceCheck("Swordsman",aistate,isHardMode)==false){
										aistate["actionState"]="gather";
										}
										else{
										var spearCal=AiGamePlay.constructUnit("Swordsman", startCord[1],xcord+4)		
										}	
									
									
									
								}

								}
							}
						
					}

				};
			 
			if(aistate.getActionState()=="gather"){
				console.log("Gather");
				var resLoc=mapSearch(map,"resource",playerState);
				var gatherUnit=chooseUnit("Gatherer", aistate);
				if (gatherUnit==false){					
				 gatherUnit=AiGamePlay.constructUnit("Gatherer", startCord[1],xcord+1);
				 	if (resLoc!=0){
					AiGamePlay.unitGather(gatherUnit.getId(),resLoc);
					aistate["stone"]+=250;
					aistate["wood"]+=250;
					aistate["food"]+=250;
					await delay(10000);
					
				}
				}
				else{
					AiGamePlay.unitGather(gatherUnit,resLoc);
					aistate["stone"]+=250;
					aistate["wood"]+=250;
					aistate["food"]+=250;
					await delay(10000);
				}
				aistate["actionState"]="offense";
			}; 
				
			};
		
		},
	
};

export default AiDec;
