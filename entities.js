Game.Mixins = {};

Game.Mixins.Moveable = {
	name: 'Moveable',
	tryMove: function(x, y, map) {
		var tile = map.getTile(x, y);
		var target = map.getEntityAt(x, y);

		if(target) {
			if(target.hasMixin('Destructible')) {
				this.attack(target);
				return true;
			}

			else {
				return false;
			}
		}

		else if (tile.isWalkable()) {
			this._x = x;
			this._y = y;
			return true;
		}

		else if (tile.isDiggable()) {
			map.dig(x, y);
			return true;
		}

		return false;
	}
}


Game.Mixins.Destructible = {
	name: 'Destructible',
	
	init: function(template) {
		this._maxHp = template['maxHp'] || 10;
		this._hp = template['hp'] || this._maxHp;
		this._defenseValue =  template['defenseValue'] || 0;
	},

	getHp: function() {
		return this._hp;
	},

	getMaxHp: function() {
		return this._maxHp;
	},

	getDefenseValue: function() {
		return this._defenseValue;
	},

	takeDamage: function(attacker, damage) {
		this._hp -= damage;
		if(this._hp <= 0) {
			Game.sendMessage(attacker, 'You kill the %s!', [this.getName()]);
			Game.sendMessage(this, 'You die!');
			this.getMap().removeEntity(this);
		}
	}
}


Game.Mixins.Attacker = {
	name: 'Attacker',
	groupName: 'Attacker',

	init: function(template) {
		this._attackValue = template['attackValue'] || 1;
	},

	getAttackValue: function() {
		return this._attackValue;
	},

	attack: function(target) {
		if(target.hasMixin('Destructible')) {
			var attack = this.getAttackValue();
			var defense = target.getDefenseValue();
			var max = Math.max(0, attack - defense);
			var damage = 1 + Math.floor(Math.random() * max);

			Game.sendMessage(this, 'You strike the %s for %d damage!', [target.getName(), damage]);
			Game.sendMessage(target, 'The %s strikes you for %d damage!', [this.getName(), damage]);

			target.takeDamage(this, damage);
		}
	}
}


Game.Mixins.MessageRecipient = {
	name: 'MessageRecipient',

	init: function(template) {
		this._messages = [];
	},

	receiveMessage: function(message) {
		this._messages.push(message);
	},

	getMessages: function() {
		return this._messages;
	},

	clearMessages: function() {
		this._messages = [];
	}
}


Game.sendMessage = function(recipient, message, args) {
	if(recipient.hasMixin(Game.Mixins.MessageRecipient)){
		if(args) {
			message = vsprintf(message, args);
		}

		recipient.receiveMessage(message);
	}
}


Game.sendMessageNearby = function(map, x, y, message, args) {
	if(args) {
		message = vsprintf(message, args);
	}

	entities = map.getEntitiesWithinRadius(x, y, 5);

	for(var i = 0; i < entities.length; i++) {
		if(entities[i].hasMixin(Game.Mixins.MessageRecipient)) {
			entities[i].receiveMessage(message);
		}
	}
}


Game.Mixins.PlayerActor = {
	name: 'PlayerActor',
	groupName: 'Actor',
	act: function() {
		Game.refresh();

		this.getMap().getEngine().lock();

		this.clearMessages();
	}
}

Game.Mixins.FungusActor = {
	name: 'FungusActor',
	groupName: 'Actor',

	init: function() {
		this._growthsRemaining = 5;
	},

	act: function() {
		if(this._growthsRemaining > 0) {
			if(Math.random() <= 0.1) {
				if(this.getMap().hasFreeNeighbor(this.getX(), this.getY())) {
					do {
						xOffset = Math.floor(Math.random() * 3) - 1;
						yOffset = Math.floor(Math.random() * 3) - 1;
					} while((xOffset == 0 && yOffset == 0) || !this.getMap().isEmptyFloor(this.getX() + xOffset, this.getY() + yOffset));

					var entity = new Game.Entity(Game.FungusTemplate);
					entity.setX(this.getX() + xOffset);
					entity.setY(this.getY() + yOffset);
					this.getMap().addEntity(entity);
					this._growthsRemaining--;

					Game.sendMessageNearby(this.getMap(), entity.getX(), entity.getY(), 'The fungus is spreading!');
				}	
			}
		}
	}
}


Game.PlayerTemplate = {
	character: '@',
	foreground: 'white',
	background: 'black',
	maxHp: 40,
	attackValue: 10,
	mixins: [Game.Mixins.PlayerActor, Game.Mixins.Moveable, Game.Mixins.Attacker, Game.Mixins.Destructible, Game.Mixins.MessageRecipient]
}

Game.FungusTemplate = {
	character: 'F',
	name: 'Fungus',
	foreground: 'green',
	maxHp: 10,
	mixins: [Game.Mixins.FungusActor, Game.Mixins.Destructible]
}
