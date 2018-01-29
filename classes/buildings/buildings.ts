class Buildings implemenets IIdentifiable, ILocatable{
	hp: number;

	takeDamage(attackPoints:number):number{
		return hp - attackPoints;
	}
}