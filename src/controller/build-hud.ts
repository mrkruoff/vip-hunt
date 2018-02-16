/* build-hud.ts
 *
 * The BuildHud module provides various functions that utilize wade 
 * to build HUD elements when they did not exist previously.
 */

import ImageMap from './image-map';
import Names from './names';

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

const BuildHud = {
    // This function builds a resource panel consisting of stone, wood, and food 
    // icons and associated text that list the amount stored in the GLOBAL object.
    // Currently it constructs each icon at a fixed location. To change those locations,
    // you change the constants in this function.
    //
    // parameters:
    //  @ layerId: an integer that indicates which WADE layer to draw on. Recall that 
    //      a smaller number (down to 1) means the resourcePanel will be drawn on
    //      TOP of other elements on layers with larger numbers.
    resourcePanel: (layerId: number) => {
        const global = wade.getSceneObject('global');
        const font = '10px Verdana';
        const color = 'black';
        const alignment = 'center';

        const width = 20;
        const height = 20;

        let y = (wade.getScreenHeight() / 2) - 210;
        let x = (wade.getScreenWidth() / 2) - 50;
        const stone = BuildHud.buildIcon(ImageMap.stoneIcon, width, height, x, y, layerId);
        stone.setName(Names.stoneIcon);
        let y2 = y;
        let x2 = x + 15;
        const stoneCount = BuildHud.buildText(global.state.getPlayer().stone.toString(),
                                font, color, alignment, x2, y2, layerId);
        stoneCount.setName(Names.stoneCount);

        y = y;
        x = x - 100;
        const wood = BuildHud.buildIcon(ImageMap.woodIcon, width, height, x, y, layerId);
        wood.setName(Names.woodIcon);
        y2 = y;
        x2 = x + 20;
        const woodCount = BuildHud.buildText(global.state.getPlayer().wood.toString(),
                                font, color, alignment, x2, y2, layerId);
        woodCount.setName(Names.woodCount);

        y = y;
        x = x - 100;
        const food = BuildHud.buildIcon(ImageMap.foodIcon, width, height, x, y, layerId);
        food.setName(Names.foodIcon);
        y2 = y;
        x2 = x + 15;
        const foodCount = BuildHud.buildText(global.state.getPlayer().food.toString(),
                                font, color, alignment, x2, y2, layerId);
        foodCount.setName(Names.foodCount);

        return [stone, wood, food, stoneCount, woodCount, foodCount];

    },
    // This function constructs a building icon for the HUD.
    //
    // parameters:
    //  @ imgStr: name of image file to use.
    //  @ width: worldspace width of resulting icon.
    //  @ height: worldspace height of resulting icon.
    //  @ x: worldspace x-coordinate to place icon.
    //  @ y: worldspace y-coordinate to place icon.
    //  @ layer: The WADE layer to put the icon on.
    buildIcon: (imgStr: string, width: number, height: number,
                x: number, y: number, layer: number) => {
        const sprite = new Sprite(imgStr, layer);
        sprite.setSize(width, height);
        const sceneObj = new SceneObject(sprite);
        sceneObj.setPosition(x, y);
        wade.addSceneObject(sceneObj);

        return sceneObj;
    },
    // This function builds a text icon.
    //
    // parameters:
    //  @ text: the text to display
    //  @ font: the font to use.
    //  @ color: the color of the text to display.
    //  @ alignment: 'left', 'center', or 'right'
    //  @ x: the worldspace x-coordinate to place icon.
    //  @ y: the worldspace y-coordinate to place icon.
    //  @ layer: the WADE layer to put the icon on.
    buildText: (text: string, font: string, color: string, alignment: string, x: number, y: number, layerId: number) => {
        const sprite = new TextSprite(text, font, color, alignment, layerId);
        const sceneObj = new SceneObject(sprite);
        sceneObj.setPosition(x, y);
        wade.addSceneObject(sceneObj);
        return sceneObj;
    },
    // This function builds the main panel, consisting of icons for
    // things like building building,
    // file saving, seeing the main menu, pausing the game, etc.
    //
    // parameters:
    //  @ layer: the WADE layer to draw the panel on.
    mainPanel: (layer: number) => {
        const buildingSprite = new Sprite(ImageMap.buildingIcon, layer);
        buildingSprite.setSize(50, 50);

        //Add building icon to screen.
        const building = new SceneObject(buildingSprite);
        building.setPosition((-1 * wade.getScreenWidth() / 2) + 100, (wade.getScreenHeight() / 2) - 100);
        wade.addSceneObject(building);
        building.setName(Names.buildingIcon);

        return building;
    },
    // This function builds the buildings Panel, consisting of the possible buildings that 
    // the player can build in the game. Currently this consists of a barracks, stables,
    // towers, and town hall
    //
    // parameters: 
    //  @ layer: the WADE layer to draw the panel on.
    buildingsPanel: (layer: number) => {
        const buttonWidth = 50;
        const buttonHeight = 50;

        let x = (-1 * wade.getScreenWidth() / 2) + 100;
        let y = (wade.getScreenHeight() / 2) - 100;
        const barracks = BuildHud.buildIcon(ImageMap.barracks_1, buttonWidth, buttonHeight,
                x, y, layer);
        barracks.setName(Names.barracksIcon);

        x = (-1 * wade.getScreenWidth() / 2) + 200;
        y = (wade.getScreenHeight() / 2) - 100;
        const stables = BuildHud.buildIcon(ImageMap.stables_1, buttonWidth, buttonHeight,
                x, y, layer);
        stables.setName(Names.stablesIcon);

        x = (-1 * wade.getScreenWidth() / 2) + 200;
        y = (wade.getScreenHeight() / 2) - 200;
        const towers = BuildHud.buildIcon(ImageMap.towers_1, buttonWidth, buttonHeight,
                x, y, layer);
        towers.setName(Names.towersIcon);

        x = (-1 * wade.getScreenWidth() / 2) + 100;
        y = (wade.getScreenHeight() / 2) - 200;
        const townHalls = BuildHud.buildIcon(ImageMap.town_halls_1, buttonWidth,
                buttonHeight, x, y, layer);
        townHalls.setName(Names.townHallsIcon);

        return [barracks, stables, towers, townHalls];
    },
    // This function builds the barracks panel, consisting of the possible units
    // the player can build from the barracks. Currently this consists of a 
    // swordsman.
    //
    // parameters: 
    //  @ layer: the WADE layer on which to draw the panel.
    barracksPanel: (layer: number) => {
        const y = (wade.getScreenHeight() / 2) - 200;
        const x = 50;
        const swordsman = BuildHud.buildIcon(ImageMap.swordsman_1, 35, 65, x, y, layer);
        swordsman.setName(Names.swordsmanIcon);

        return [swordsman];
    },

    // This function builds the background panel, which is the background for the HUD
    // in general. Currently this consists of a single sretched scroll image, but this
    // could be expanded to look better.
    //
    // parameters:
    //  @ layer: the WADE layer on which to draw the panel.
    background: (layer: number) => {
        const scroll = BuildHud.buildIcon(ImageMap.scroll, 350, 5000, 0, 400, layer);
        scroll.setRotation(1.5708);
        scroll.setName(Names.hudBackground);
        return scroll;

    },

};

export default BuildHud;
