/*var level1 = [

    [3, new Car(spawnObjects.car_blue.sprite, spawnObjects.car_blue.speed)],
    [2.5, new Car(spawnObjects.car_red.sprite, spawnObjects.car_red.speed)],
    [3.5, new Car(spawnObjects.car_brown.sprite, spawnObjects.car_brown.speed)],
    [4, new Car(spawnObjects.car_yellow.sprite, spawnObjects.car_yellow.speed)],
    [3, new Car(spawnObjects.car_green.sprite, spawnObjects.car_green.speed)]

];*/

var Level = function(levelData,callback) {
    this.levelData = [];
    for (var i = 0; i < levelData.length; i++) {
        this.levelData.push(Object.create(levelData[i]));
    }
    this.t = 0;
    this.callback = callback;
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


  /*var idx = 0, remove = [], curShip = null;
 
 // Update the current time offset
  this.t += dt * 1000;

  //  Example levelData 
  //   Start, End,  Gap, Type,   Override
  // [[ 0,     4000, 500, 'step', { x: 100 } ]
  while((curShip = this.levelData[idx]) && 
        (curShip[0] < this.t + 2000)) {
    // Check if past the end time 
    if(this.t > curShip[1]) {
      // If so, remove the entry
      remove.push(curShip);
    } else if(curShip[0] < this.t) {
      // Get the enemy definition blueprint
      var enemy = enemies[curShip[3]],
          override = curShip[4];

      // Add a new enemy with the blueprint and override
      this.board.add(new Enemy(enemy,override));

      // Increment the start time by the gap
      curShip[0] += curShip[2];
    }
    idx++;
  }
  // Remove any objects from the levelData that have passed
  for(var i = 0, len = remove.length; i < len; i++) {
    var idx = this.levelData.indexOf(remove[i]);
    if(idx != -1) this.levelData.splice(idx,1);
  }

  // If there are no more enemies on the board or in 
  // levelData, this level is done
  if(this.levelData.length == 0 && this.board.cnt[OBJECT_ENEMY] == 0) {
    if(this.callback) this.callback();
  }*/
}