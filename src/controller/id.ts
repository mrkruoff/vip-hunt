/* id.ts
 *
 * The Id module contains functions for getting a new Game Object Id
 * for a newly created Game Object (Unit, Building, or Resource).
 *
 */

import * as _ from 'lodash';
import IIdentifiable from '../interfaces/identifiable';

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
    // This function gets a new, unique Id for a newly created
    // Unit, Building, or Resource. It relies on the 'global'
    // SceneObject's id property.
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
    // This function determines whether an IIdentifiable object
    // has a certain id.
    //
    // parameters:
    //  @ obj: A IIdentifiable object (Unit, Resource, Building)
    //  @ id: the id in question.
    hasId: (obj: IIdentifiable, id: number) => {
        return _.isEqual(obj.getId(), id);
    },
};

export default Id;
