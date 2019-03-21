
var Level = function(levelData) {
    this.levelData = levelData;
    this.t = 0;
}

Level.prototype = new Sprite();

Level.prototype.draw = function(ctx) { }

Level.prototype.step = function(dt) {
    if (this.t == 0) {
        for (var i = 0; i < this.levelData.length; i++) {
            this.board.add(new Spawner(this.levelData[i]));
        }
        this.t++;
    }
}