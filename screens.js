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
	_nbPress: 0,

	enter: function() { console.log("Entered play screen."); },
	
	exit: function() {console.log("Exited play screen."); },

	render: function(display) {
		display.drawText(1, 1, "%c{red}Test 1");
		display.drawText(1, 2, "Press [a] to hunt witches !");
		display.drawText(1, 3, "Witches successfully hunted : " + this._nbPress);
	},

	handleInput: function(inputType, inputData) {
		if(inputType === "keydown") {
			if(inputData.keyCode == ROT.VK_A) {
				this._nbPress = this._nbPress + 1;
			}
		}
	}
}