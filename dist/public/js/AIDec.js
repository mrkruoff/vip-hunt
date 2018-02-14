//todo low resource actions
//todo build actions
//todo move actions
//Initial Actions:
//Create 2 of current avaiable 

function buildingCheck(){};
function getUnit(){};
function unitAction(){};
function resourceCheck(){};
function buildUnit(unittype){};
function buildBuilding(buildingtype){};



test=0
while(test<6){
	if(AIBrain.is("setup"))
	{
		AIBrain.looking();
		if(AIState['buildingcount']['TownHouse']==1)
	{
	console.log("Townhouse exists")
	if(	AIState['food']==0 || AIState['stone']==0||AIstate['wood']==0)
	{
	console.log("need resources")
	if(AIState['unitcount']['Gatherer']<3){
		//buildGather
		console.log("Building Gatherer")
	}
	else{
		console.log("Sending Gather for resources")
	}
	}
	}
	else
	{
	console.log("Building TownHouse")
	//todo build
	}

	if(AIState['buildingcount']['Barracks']==0)
	{
	//Get resrouces amount needed
	//if below trigger gatherers to get more
	//if enough
	//else()Build Barracks
	}
	else{
	//test if missing infantry
	//build necessary
	//Need to start with 2 swords men, 1 archery to set up defense of VIP
	}
	}
	else if(AIBrain.is("search"))
	{
		if(AIState['units'].length<=3)
		{
		//build units//run additional checks on what units needed
		}
		else
		{
			//make sure VIP has 3 defense
			//send groups out searching
		}
	}
	else if(AIBrain.is("defense"))
	{
		//Move units back to defensd,
		//Once player outside of region of VIP, resume search or attack
	}
	else if(AIBrain.is("offense"))
	{
		//move units into player terriotry, attack enemy units, while searching for player VIP
	}
	else if(AIBrain.is("finish"))
	{
		//win player vip in view and in attack move AI characters towards VIP
	}
	test++;
}





