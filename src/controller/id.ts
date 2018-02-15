import IIdentifiable from '../interfaces/identifiable';
import * as _ from 'lodash';

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

const Id = {
    getId: () => {
        let id;
        const global = wade.getSceneObject('global');
        if (!global.id) {
            global.id = 0;
        }
        id = global.id;
        global.id += 1;

        return id;
    },
    hasId: (obj: IIdentifiable, id: number) => {
        return _.isEqual(obj.getId(), id); 
    },
};

export default Id;
