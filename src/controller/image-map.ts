/* image-map.ts
 *
 *
 * The ImageMap module contains an enum for the filepaths of the various
 * image files that will be used in the game.
 */

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
    drummer_boy_1: ' ',
    vip_1: '../js/../public/sprites/units/vip_1.png',
    stone: '../js/../public/sprites/resources/stone.png',
    food: '../js/../public/sprites/resources/food.png',
    wood: '../js/../public/sprites/resources/wood.png',

    stoneIcon: '../js/../public/sprites/resources/stone.png',
    woodIcon: '../js/../public/sprites/resources/wood.png',
    foodIcon: '../js/../public/sprites/resources/food.png',

    swordsman_N_idle: '../js/../public/sprites/units/results_warrior_1/idleN.png',
    swordsman_S_idle: '../js/../public/sprites/units/results_warrior_1/idleS.png',
    swordsman_E_idle: '../js/../public/sprites/units/results_warrior_1/idleE.png',
    swordsman_W_idle: '../js/../public/sprites/units/results_warrior_1/idleW.png',
    swordsman_NE_idle: '../js/../public/sprites/units/results_warrior_1/idleNE.png',
    swordsman_NW_idle: '../js/../public/sprites/units/results_warrior_1/idleNW.png',
    swordsman_SE_idle: '../js/../public/sprites/units/results_warrior_1/idleSE.png',
    swordsman_SW_idle: '../js/../public/sprites/units/results_warrior_1/idleSW.png',
    swordsman_N_walk: '../js/../public/sprites/units/results_warrior_1/runN.png',
    swordsman_S_walk: '../js/../public/sprites/units/results_warrior_1/runS.png',
    swordsman_E_walk: '../js/../public/sprites/units/results_warrior_1/runE.png',
    swordsman_W_walk: '../js/../public/sprites/units/results_warrior_1/runW.png',
    swordsman_NE_walk: '../js/../public/sprites/units/results_warrior_1/runNE.png',
    swordsman_NW_walk: '../js/../public/sprites/units/results_warrior_1/runNW.png',
    swordsman_SE_walk: '../js/../public/sprites/units/results_warrior_1/runSE.png',
    swordsman_SW_walk: '../js/../public/sprites/units/results_warrior_1/runSW.png',
    swordsman_N_attack: '../js/../public/sprites/units/results_warrior_1/attack_01N.png',
    swordsman_S_attack: '../js/../public/sprites/units/results_warrior_1/attack_01S.png',
    swordsman_E_attack: '../js/../public/sprites/units/results_warrior_1/attack_01E.png',
    swordsman_W_attack: '../js/../public/sprites/units/results_warrior_1/attack_01W.png',
    swordsman_NE_attack: '../js/../public/sprites/units/results_warrior_1/attack_01NE.png',
    swordsman_NW_attack: '../js/../public/sprites/units/results_warrior_1/attack_01NW.png',
    swordsman_SE_attack: '../js/../public/sprites/units/results_warrior_1/attack_01SE.png',
    swordsman_SW_attack: '../js/../public/sprites/units/results_warrior_1/attack_01SW.png',
    swordsman_N_death: '../js/../public/sprites/units/results_warrior_1/deathN.png',
    swordsman_S_death: '../js/../public/sprites/units/results_warrior_1/deathS.png',
    swordsman_E_death: '../js/../public/sprites/units/results_warrior_1/deathE.png',
    swordsman_W_death: '../js/../public/sprites/units/results_warrior_1/deathW.png',
    swordsman_NE_death: '../js/../public/sprites/units/results_warrior_1/deathNE.png',
    swordsman_NW_death: '../js/../public/sprites/units/results_warrior_1/deathNW.png',
    swordsman_SE_death: '../js/../public/sprites/units/results_warrior_1/deathSE.png',
    swordsman_SW_death: '../js/../public/sprites/units/results_warrior_1/deathSW.png',

};

export default ImageMap;
