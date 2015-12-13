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
	
	init: function() {
		this._hp = 1;
	},

	takeDamage: function(attacker, damage) {
		this._hp -= damage;
		if(this._hp <= 0) {
			this.getMap().removeEntity(this);
		}
	}
}


Game.Mixins.SimpleAttacker = {
	name: 'SimpleAttacker',
	groupName: 'Attacker',

	attack: function(target) {
		if(target.hasMixin('Destructible')) {
			target.takeDamage(this, 1);
		}
	}
}


Game.Mixins.PlayerActor = {
	name: 'PlayerActor',
	groupName: 'Actor',
	act: function() {
		Game.refresh();

		this.getMap().getEngine().lock();
	}
}

Game.Mixins.FungusActor = {
	name: 'FungusActor',
	groupeName: 'Actor',

	init: function() {
		this._growthsRemaining = 5;
	},

	act: function() {
		if(this._growthsRemaining > 0) {
			if(Math.random() <= 0.02) {
				do {
					xOffset = Math.floor(Math.random() * 3) - 1;
					yOffset = Math.floor(Math.random() * 3) - 1;
				} while((xOffset == 0 && yOffset == 0) || !this.getMap().isEmptyFloor(this.getX() + xOffset, this.getY() + yOffset));

				var entity = new Game.Entity(Game.FungusTemplate);
				entity.setX(this.getX() + xOffset);
				entity.setY(this.getY() + yOffset);
				this.getMap().addEntity(entity);
				this._growthsRemaining--;
			}
		}
	}
}


Game.PlayerTemplate = {
	character: '@',
	foreground: 'white',
	background: 'black',
	mixins: [Game.Mixins.Moveable, Game.Mixins.PlayerActor, Game.Mixins.SimpleAttacker, Game.Mixins.Destructible]
}

Game.FungusTemplate = {
	character: 'f',
	foreground: 'green',
	mixins: [Game.Mixins.FungusActor, Game.Mixins.Destructible]
}
