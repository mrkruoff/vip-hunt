/* stone.ts
 *
 *
 *
 */

import * as _ from 'lodash';
import Resource from './resource';

class Stone extends Resource {
    
    constructor(id:number, amount: number) {
        super(id, amount);
        this.name = "Stone"; 
    }

    static fromObject(obj) {
        let resource = Stone.defaultStone(); 

        if(_.has(obj, 'amount')) {
            resource.amount = obj.amount; 
        }
        return resource;
    }

    static defaultStone() {
        const def = new Stone(0, 1000); 
        return def; 
    }
}




export default Stone;
