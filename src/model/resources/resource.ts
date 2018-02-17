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

}






export default Resource;
