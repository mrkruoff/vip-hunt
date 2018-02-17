

/* food.ts
 *
 *
 *
 */

import * as _ from 'lodash';
import Resource from './resource';

class Food extends Resource {
    
    constructor(id:number, amount: number) {
        super(id, amount);
        this.name = "Food"; 
    }

    static fromObject(obj) {
        let resource = Food.defaultFood(); 

        if(_.has(obj, 'amount')) {
            resource.amount = obj.amount; 
        }
        return resource;
    }

    static defaultFood() {
        const def = new Food(0, 1000); 
        return def; 
    }
}




export default Food;
