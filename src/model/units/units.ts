import ILocatable from "../../interfaces/locatable";
import IIdentifiable from "../../interfaces/identifiable"

import { Container, injectable, inject } from "inversify";

@injectable()
class Unit implements IIdentifiable {
	hp: number;
	attack: number;
	defense: number;
	speed: number;
	range: number;
    id: number;

    constructor(
            id: number, hp: number, attack: number, defense: number,
                speed: number, range: number) {
        this.id = id;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.speed = speed;
        this.range = range;
    }

    // Applies damage to the unit instance
	takeDamage(attackPoints: number): number {
        let damage;
        if (attackPoints > this.defense) {
            damage = attackPoints - this.defense;
        }
        else {
            // Ensure that damage is always done, even if defense >= attack
            damage = 1;
        }
        this.hp -= damage;

        if(this.hp <= 0) {
            this.hp = 0;
            return -1; // Let caller know that unit is dead
        }

        return 0; // Let caller know that unit is still alive

	}

    getId() {
        return this.id
    }

    fromJsonFile(filename: string) : Unit {


    }
}

export default Unit;
