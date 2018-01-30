
class Buildings implements IIdentifiable, ILocatable {
	hp: number;

	takeDamage(attackPoints:number):number {
		return hp - attackPoints;
	}
}
