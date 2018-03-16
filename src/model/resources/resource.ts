/* resource.ts
 *
 * This module contains the base class Resource.
 *
 */

import IIdentifiable from '../../interfaces/identifiable';

class Resource implements IIdentifiable {
    amount: number;
    id: number;
    name: string;
    rep: any;

    constructor( id: number, amount: number) {
        this.amount = amount;
        this.id = id;
        this.name = "Resource"; 
    }

    getClassName() {
        return this.name; 
    }

    getId() {
        return this.id; 
    }

    getAmount() {
        return this.amount;
    }

    takeGather(gather: number) {
        this.amount -= gather; 

        if(this.amount <= 0) {
            this.amount = 0;
            return -1; //let caller know resource is empty 
        }

        return 0; //Let caller know resource still has more
    
    }

}






export default Resource;
