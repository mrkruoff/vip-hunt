
/* wood.ts
 *
 *
 *
 */

import * as _ from 'lodash';
import Resource from './resource';

class Wood extends Resource {
    
    constructor(id:number, amount: number) {
        super(id, amount);
        this.name = "Wood"; 
    }

    static fromObject(obj) {
        let resource = Wood.defaultWood(); 

        if(_.has(obj, 'amount')) {
            resource.amount = obj.amount; 
        }
        return resource;
    }

    static defaultWood() {
        const def = new Wood(0, 1000); 
        return def; 
    }
}




export default Wood;
