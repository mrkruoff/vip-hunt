declare var Phaser: any; //Keeps the typescript compiler happy for CDN import


var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update});

//main game object
var mainState={

function preload() {
    game.load.image('sprite', '../public/sprites/buildings/barracks.png');

//load images here and enter in keys for the images
			//this.load.image(enter in key name here!!, path to image)


			//load the json as text file

			//units 
			this.load.text('vipUnit', 'assets/data/units/vip_unit.json');
			this.load.text('gatheringUnit', 'assets/data/units/gathering_unit.json');
			this.load.text('swordsmanUnit', 'assets/data/units/swordsman_unit.json');
			this.load.text('archerUnit', 'assets/data/units/archer_unit.json');
			this.load.text('spearCalvaryUnit', 'assets/data/units/spear_calvary_unit.json');
			this.load.text('archerCalvaryUnit', 'assets/data/units/archer_calvary_unit.json');
			this.load.text('drummerBoyUnit', 'assets/data/units/drummer_boy_unit.json');

			//buildings
			this.load.text('townhallBuilding', 'assets/data/buildings/townhall_building.json');
			this.load.text('barracksBuilding', 'assets/data/buildings/barracks_building.json');
			this.load.text('stableBuilding', 'assets/data/buildings/stable_building.json');
			this.load.text('watchtowerBuilding', 'assets/data/buildings/watchtower_building.json');




}


function create() {
    game.add.sprite(0, 0, 'sprite');



    			//create sprites here with screen locations
			//and anchors as needed



			//parse the json data files for units and buildings
			//parse this as a json file to treat as object

			//units
			vipUnitData = JSON.parse(this.game.cache.getText('vipUnit'));
			gatheringUnitData = JSON.parse(this.game.cache.getText('gatheringUnit'));
			swordsmanUnitData = JSON.parse(this.game.cache.getText('swordsmanUnit'));
			archerUnitData = JSON.parse(this.game.cache.getText('archerUnit'));
			spearCalvaryUnitData = JSON.parse(this.game.cache.getText('spearCalvaryUnit'));
			archerCalvaryUnitData = JSON.parse(this.game.cache.getText('archerCalvaryUnit'));
			drummerBoyUnitData = JSON.parse(this.game.cache.getText('drummerBoyUnit'));

			//buildings
			townhallBuildingData = JSON.parse(this.game.cache.getText('townhallBuilding'));
			barracksBuildingData = JSON.parse(this.game.cache.getText('barracksBuilding'));
			stableBuildingData = JSON.parse(this.game.cache.getText('stableBuilding'));
			watchtowerBuildingData = JSON.parse(this.game.cache.getText('watchtowerBuilding'));

}


function update() {

}

}