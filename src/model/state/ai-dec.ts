
const AiDec = {
	 decisions: (globalState) =>{
		var aistate=globalState.getAi();
		var currentState="setup";
		while(true){
			if(currentState=="setup"){console.log("Settingup")
				if(aistate.getBuildings().length==1){console.log("Build Barracks")}
				else if(aistate.getUnits().length<5){console.log("build swordsman")}
				else{console.log("move units to defend and move units to search");
					currentState="offense";}
				};
			if(currentState=="offense"){console.log("Attacking");
				console.log("Check Resources, build stable");
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