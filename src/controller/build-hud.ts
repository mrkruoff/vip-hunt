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
    buildIcon: (imgStr: string, width: number, height: number,
                x: number, y: number, layer: number) => {
        const sprite = new Sprite(imgStr, layer);
        sprite.setSize(width, height);
        const sceneObj = new SceneObject(sprite);
        sceneObj.setPosition(x, y);
        wade.addSceneObject(sceneObj);

        return sceneObj;
    },
    buildText: (text: string, font: string, color: string, alignment: string, x, y, layerId: number) => {
        const sprite = new TextSprite(text, font, color, alignment, layerId);
        const sceneObj = new SceneObject(sprite);
        sceneObj.setPosition(x, y);
        wade.addSceneObject(sceneObj);
        return sceneObj;
    },
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
    barracksPanel: (layer: number) => {
        const y = (wade.getScreenHeight() / 2) - 200;
        const x = 50;
        const swordsman = BuildHud.buildIcon(ImageMap.swordsman_1, 35, 65, x, y, layer);
        swordsman.setName(Names.swordsmanIcon);

        return [swordsman];
    },
    background: (layer: number) => {
        const scroll = BuildHud.buildIcon(ImageMap.scroll, 350, 5000, 0, 400, layer);
        scroll.setRotation(1.5708);
        scroll.setName(Names.hudBackground);
        return scroll;

    },

};

export default BuildHud;
