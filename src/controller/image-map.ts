
// The root directory is the html folder. But because the Javascript is in the  /js folder, we must prepend ../js/ to all the image URLs.
const ImageMap = {
    scroll: '../js/../public/sprites/hud/scroll.png',
    buildingIcon: '../js/../public/sprites/hud/building.png',
    barracks_1: '../js/../public/sprites/buildings/barracks_1.png',
    stables_1: '../js/../public/sprites/buildings/stables_1.png',
    towers_1: '../js/../public/sprites/buildings/towers_1.png',
    town_halls_1: '../js/../public/sprites/buildings/town_halls_1.png',
    swordsman_1: '../js/../public/tilesets/characters/swordsman/swordsman_1_Idle_iso_se.png',
    archer_1: 'default',
    gatherer_1: 'default',
    spear_calvary_1: 'default',
    archer_calvary_1: 'default',

};

export default ImageMap;
