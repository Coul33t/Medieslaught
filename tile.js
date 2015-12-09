Game.Tile = function(properties) {
	properties = properties || {};

	Game.Glyph.call(this, properties);

	this._isWalkable = properties["isWalkable"] || false;
	this._isDiggable = properties["isDiggable"] || false;
};

Game.Tile.extend(Game.Glyph);

Game.Tile.prototype.isWalkable = function() {
	return this._isWalkable;
}

Game.Tile.prototype.isDiggable = function() {
	return this._isDiggable;
}

Game.Tile.nullTile = new Game.Tile({});

Game.Tile.floorTile = new Game.Tile({
	character: ".",
	foreground: ROT.Color.toRGB([67, 76, 86]),
	isWalkable: true
});

Game.Tile.wallTile = new Game.Tile({
	character: "#",
	foreground: ROT.Color.toRGB([90, 46, 12]),
	isWalkable: false,
	isDiggable: true
});