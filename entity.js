Game.Entity = function(properties) {
	properties = properties || {};

	Game.Glyph.call(this, properties);

	this._name = properties["name"] || "default";
	this._x = properties["x"] || 0;
	this._y = properties["y"] || 0;

	this._attachedMixins = {};

	var mixins = properties['mixins'] || [];

	for (var i = 0; i < mixins.length; i++) {

		for (var key in mixins[i]) {
			if (key != 'init' && key != 'name' && !this.hasOwnProperty(key)) {
				this[key] = mixins[i][key];
			}
		}

		this._attachedMixins[mixins[i].name] = true;

		if (mixins[i].init) {
			mixins[i].init.call(this, properties);
		}
	}
}

Game.Entity.extend(Game.Glyph);

Game.Entity.prototype.setName = function(name) {
	this._name = name;
}

Game.Entity.prototype.setX = function(x) {
	this._x = x;
}

Game.Entity.prototype.SetY = function(y) {
	this._y = y;
}

Game.Entity.prototype.getName = function() {
	return this._name;
}

Game.Entity.prototype.getX = function() {
	return this._x;
}

Game.Entity.prototype.getY = function() {
	return this._y;
}