declare var Phaser: any; //Keeps the typescript compiler happy for CDN import

let game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload, create, update});

//main game object

function preload() {
    game.plugins.add(new Phaser.Plugin.Isometric(game));

    game.load.image('sprite', '../public/sprites/buildings/barracks.png');

//load images here and enter in keys for the images
            //this.load.image(enter in key name here!!, path to image)

            //load the json as text file
/*
            //units
    this.load.text('vipUnit', '/json/units/vip_unit.json');
    this.load.text('gatheringUnit', '/json/units/gathering_unit.json');
    this.load.text('swordsmanUnit', '/json/units/swordsman_unit.json');
    this.load.text('archerUnit', '/json/units/archer_unit.json');
    this.load.text('spearCalvaryUnit', '/json/units/spear_calvary_unit.json');
    this.load.text('archerCalvaryUnit', '/json/units/archer_calvary_unit.json');
    this.load.text('drummerBoyUnit', '/json/units/drummer_boy_unit.json');

            //buildings
    this.load.text('townhallBuilding', '/json/buildings/townhall_building.json');
    this.load.text('barracksBuilding', '/json/buildings/barracks_building.json');
    this.load.text('stableBuilding', '/json/buildings/stable_building.json');
    this.load.text('watchtowerBuilding', '/json/buildings/watchtower_building.json');
*/
}

function create() {
    game.add.sprite(0, 0, 'sprite');

                //create sprites here with screen locations
            //and anchors as needed
/*
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
*/
}

function update() {

}
