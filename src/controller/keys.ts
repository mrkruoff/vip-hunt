
/* keys.ts
 *
 * The Keys module makes it easier to work with key pressing by providing functions that 
 * indicate whether a key press is up, down, left, and right, according to the game
 * settings.
 */

const Keys = {
    up() {
        return this.w;
    },
    down() {
        return this.s;
    },
    left() {
        return this.a;
    },
    right() {
        return this.d;
    },
    a: 65,
    d: 68,
    s: 83,
    w: 87,
};

export default Keys;
