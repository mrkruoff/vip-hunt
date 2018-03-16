/* names.ts
 *
 * The Names enum provides a compiler-backed way of using
 * wade's Named Scene Objects. Once a SceneObject is named, it is
 * easy to get a reference to it using wade.getSceneObject(<name_string>).
 *
 */

const Names = {
    hudBackground: 'hudBackground',
    buildingIcon: 'buildingIcon',
    menuIcon: 'menuIcon',
    barracksIcon: 'barracksIcon',
    stablesIcon: 'stablesIcon',
    towersIcon: 'towersIcon',
    townHallsIcon: 'townHallsIcon',
    swordsmanIcon: 'swordsmanIcon',

    stoneIcon: 'stoneIcon',
    foodIcon: 'foodIcon',
    woodIcon: 'woodIcon',
    stoneCount: 'stoneCount',
    foodCount: 'foodCount',
    woodCount: 'woodCount',

    menu_background: 'menu_background',
    menu_save: 'menu_save',
    menu_resume: 'menu_resume',
    menu_quit: 'menu_quit',

};

export default Names;
