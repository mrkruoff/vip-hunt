/* events.ts
 *
 * This module is for setting up general events that are not
 * intricately tied up in the gameplay. These are generally one-off events,
 * like setting up camera responses or basic keyboard shortcuts.
 */

import * as _ from 'lodash';
import Camera from './camera';
import Mouse from './mouse';

declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;

const Events = {
    // Adds camera scrolling and zooming in response
    // to Mouse and Keyboard input
    addCamera: () => {
        wade.app.onKeyDown = function(event) {
            Camera.keyDown(event.keyCode);
        };

        wade.app.onKeyUp = function(event) {
            Camera.keyUp();
        };

        wade.app.onMouseMove = function(event) {
            Camera.mouseMove(event.screenPosition);
        };

        wade.app.onMouseWheel = function(event) {
            if (event.value > 0) {
                Camera.zoomIn();
            } else if (event. value < 0) {
                Camera.zoomOut();
            }
        };
    },
    // Removes all the camera responses that were set up
    // in Events.addCamera()
    removeCamera: () => {
        wade.app.onKeyDown = null;
        wade.app.onKeyUp = null;
        wade.app.onMouseMove = null;
        wade.app.onMouseWheel = null;
    },
};

export default Events;
