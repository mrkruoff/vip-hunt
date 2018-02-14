var AIState={
	stone: 0,
	wood: 0,
	food: 0,
	unitcount: {'VIP':1, 'Gatherer':0, 'Swordsman':0,'Archer':0,
					'SpearCalvary':0,'ArcherCalvery':0,'Drummer':0},
	units:['VIP002'],
	buildingcount:{'TownHouse':1, 'Barracks':0, 'Stable':0, 'Watchtower':0},
	buildings:['TH002'],
	playerInView: false,
	pVIPinView:false,
	underAttack:false
}; 

var AIBrain = new StateMachine({
    init: 'setup',
    transitions: [
      { name: 'looking',  from: 'setup',  to: 'search' },
      { name: 'looking',  from: 'defense', to: 'search' },
	  { name: 'looking',  from: 'offense', to: 'search'},
      { name: 'rebuild',  from: 'defense', to: 'setup'  },
	  { name: 'attack', from: 'setup', to: 'offense'},
	  { name: 'defend',   from:  'search', to: 'defense'},
	  { name:  'defend',   from:  'offense', to: 'defense'},
      { name: 'close',    from: 'offense',    to: 'finish'},
	  { name: 'attack', from: 'finish', to: 'offense'},
	  { name: 'defense', from: 'finish', to: 'defense'},
	  { name: 'attack',   from: 'search', to: 'offense'  },
      { name: 'attack',   from: 'defense', to: 'offense' },
    ],
	methods: {
		onLooking:  function(){console.log("Searching")},
		onDefend:   function(){console.log("defending")},
	    onAttack:   function(){console.log("attacking")},
		onClose:	function(){console.log("finishing")}
	}
});

