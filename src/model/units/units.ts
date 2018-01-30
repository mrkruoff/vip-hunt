class Units implemenets IIdentifiable, ILocatable{
	hp: number;
	attack: number;
	defense: number;
	speed: number;
	range: number;

		takeDamage(attackPoints:number):number{
		return hp - attackPoints;
	}
}