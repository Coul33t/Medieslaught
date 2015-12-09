Game.Screen = {}

Game.Screen.startScreen = {
	
	enter: function() { console.log("Entered start screen."); },
	
	exit: function() {console.log("Exited start screen."); },

	render: function(display) {
		display.drawText(1, 1, "%c{yellow}Javascript Roguelike");
		display.drawText(1, 2, "Press [Enter] to begin the hunt !");
	},

	handleInput: function(inputType, inputData) {
		if(inputType === "keydown") {
			if(inputData.keyCode == ROT.VK_RETURN) {
				Game.switchScreen(Game.Screen.playScreen);
			}
		}
	}
}

Game.Screen.playScreen = {
	_map: null,

	enter: function() { 
		console.log("Entered play screen."); 

		var map = [];

		var mapWidth = 200;
		var mapHeight = 50;

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

	        var generator = new ROT.Map.Cellular(80, 24);
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
		

		this._map = new Game.Map(map);

		console.log("Map generated.");

		this._player = new Game.Entity(Game.PlayerTemplate);
		var position = this._map.getRandomFloorPosition();
		this._player.setX(position.x);
		this._player.setY(position.y);
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

		display.draw(this._player.getX() - topLeftX,
					this._player.getY() - topLeftY,
					this._player.getChar(),
					this._player.getForeground(),
					this._player.getBackground()
		);

		/*display.drawText(1, 1, "%c{red}Test 1");
		display.drawText(1, 2, "Press [a] to hunt witches !");
		display.drawText(1, 3, "Witches successfully hunted : " + this._nbPress);*/
	},

	handleInput: function(inputType, inputData) {
		if(inputType === "keydown") {
			if(inputData.keyCode == ROT.VK_NUMPAD8) {
				this.move(0, -1);
			}

			else if(inputData.keyCode == ROT.VK_NUMPAD6) {
				this.move(1, 0);
			}

			else if(inputData.keyCode == ROT.VK_NUMPAD2) {
				this.move(0, 1);
			}

			else if(inputData.keyCode == ROT.VK_NUMPAD4) {
				this.move(-1, 0);
			}
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