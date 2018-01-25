declare var Phaser: any; //Keeps the typescript compiler happy for CDN import


var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update});

function preload() {
    game.load.image('sprite', '../public/sprites/buildings/barracks.png');

}


function create() {
    game.add.sprite(0, 0, 'sprite');

}


function update() {

}
