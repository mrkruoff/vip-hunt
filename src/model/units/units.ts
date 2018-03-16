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
    vision: number;
    gathering: number;
    id: number;
    name: string;
    rep: any;

    constructor(
            id: number, hp: number, attack: number, defense: number,
                speed: number, range: number, vision: number, gathering: number) {
        this.id = id;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.speed = speed;
        this.range = range;
        this.vision = vision;
        this.gathering = gathering;
    }

    getClassName(): string {
        return this.name; 
    }

    getGather(): number {
        return this.gathering; 
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
        return this.id;
    }

    getAttack() {
        return this.attack; 
    }

    getHp() {
        return this.hp; 
    }

}

export default Unit;
