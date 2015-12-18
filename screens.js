Game.Screen = {};

Game.Screen.startScreen = {
	
	enter: function() { console.log("Entered start screen."); },
	
	exit: function() {console.log("Exited start screen."); },

	render: function(display) {
		display.drawText(1, 1, "%c{yellow}Kill the Witches");
		display.drawText(1, 4, "Press [Enter] to begin the hunt !");
	},

	handleInput: function(inputType, inputData) {
		if(inputType === "keydown") {
			if(inputData.keyCode === ROT.VK_RETURN) {
				Game.switchScreen(Game.Screen.playScreen);
			}
		}
	}
}

Game.Screen.playScreen = {
	_map: null,
	_player: null,

	enter: function() { 
		console.log("Entered play screen."); 

		var map = [];

		var mapWidth = 100;
		var mapHeight = 48;

		for (var x = 0; x < mapWidth; x++) {
			
			map.push([]);

			for (var y = 0; y < mapHeight; y++) {
				map[x].push(Game.Tile.nullTile);
			}
		}

		// A chance to create a dungeon, or a cave
		// Dungeon
		if(ROT.RNG.getUniform() > 0.5) {
			
			var generator = new ROT.Map.Uniform(mapWidth, mapHeight, {timeLimit: 5000});

			generator.create(function(x, y, v) {
				if(v === 0) {
					map[x][y] = Game.Tile.floorTile;
				}

				else {
					map[x][y] = Game.Tile.wallTile;
				}
			});

		}

		// Cave
		else {

	        var generator = new ROT.Map.Cellular(mapWidth, mapHeight);
	        generator.randomize(0.5);
	        var iterNumber = 3;
	        // Iteratively smoothen the map
	        for (var i = 0; i < iterNumber - 1; i++) {
	            generator.create();
	        }
	        // Smoothen it one last time and then update our map
	        generator.create(function(x,y,v) {
	            if (v === 1) {
	                map[x][y] = Game.Tile.floorTile;
	            } else {
	                map[x][y] = Game.Tile.wallTile;
	            }
	        });

		}

		console.log("Map generated.");

		this._player = new Game.Entity(Game.PlayerTemplate);
		this._map = new Game.Map(map, this._player);
		
		this._map.getEngine().start();
	},
	
	exit: function() {console.log("Exited play screen."); },

	render: function(display) {
		
		var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();

		var topLeftX = Math.max(0, this._player.getX() - (screenWidth / 2));
		topLeftX = Math.min(topLeftX, this._map.getWidth() - screenWidth);

		var topLeftY = Math.max(0, this._player.getY() - (screenHeight / 2));
		topLeftY = Math.min(topLeftY, this._map.getHeight() - screenHeight);

		for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
			for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
				var tile = this._map.getTile(x, y);
				display.draw(x - topLeftX,
							y - topLeftY,
							tile.getChar(),
							tile.getForeground(),
							tile.getBackground());
			}
		}

		var entities = this._map.getEntities();

		for (var i = 0; i < entities.length; i++) {
			var entity = entities[i];
			if (entity.getX() >= topLeftX && entity.getY() >= topLeftY &&
                entity.getX() < topLeftX + screenWidth &&
                entity.getY() < topLeftY + screenHeight) {
					display.draw(
						entity.getX() - topLeftX,
						entity.getY() - topLeftY,
						entity.getChar(),
						entity.getForeground(),
						entity.getBackground());
			}
		}

		var messages = this._player.getMessages();
		var messageY = 0;

		for(var i = 0; i < messages.length; i++) {
			messageY += display.drawText(0, messageY, '%c{white}%b{black}' + messages[i]);
		}

		var stats = '%c{white}%b{black}';
		stats += vsprintf('HP: %d%d ', [this._player.getHp(), this._player.getMaxHp()]);
	},

	handleInput: function(inputType, inputData) {
		if(inputType === "keydown") {
			if(inputData.keyCode === ROT.VK_NUMPAD8) {
				this.move(0, -1);
			}

			else if(inputData.keyCode === ROT.VK_NUMPAD9) {
				this.move(1, -1);
			}

			else if(inputData.keyCode === ROT.VK_NUMPAD6) {
				this.move(1, 0);
			}

			else if(inputData.keyCode === ROT.VK_NUMPAD3) {
				this.move(1, 1);
			}

			else if(inputData.keyCode === ROT.VK_NUMPAD2) {
				this.move(0, 1);
			}

			else if(inputData.keyCode === ROT.VK_NUMPAD1) {
				this.move(-1, 1);
			}

			else if(inputData.keyCode === ROT.VK_NUMPAD4) {
				this.move(-1, 0);
			}

			else if(inputData.keyCode === ROT.VK_NUMPAD7) {
				this.move(-1, -1);
			}

			else {

			}

			this._map.getEngine().unlock();
		}
	},

	move: function(dX, dY) {
		// max between 0 AND (min between map_size AND future coordinates). CLEVER
		/*this._centerX = Math.max(0, Math.min(this._map.getWidth() - 1, this._centerX + dX));
		this._centerY = Math.max(0, Math.min(this._map.getHeight() - 1, this._centerY + dY));*/

		var newX = this._player.getX() + dX;
		var newY = this._player.getY() + dY;

		this._player.tryMove(newX, newY, this._map);
	}
}