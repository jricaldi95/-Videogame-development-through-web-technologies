var sprites = {
 frog:{sx: 0, sy: 340, w: 38, h: 46, frames: 1},
 background:{sx: 422, sy: 0, w: 552, h: 625, frames: 1 },
 car_blue: { sx: 0, sy: 0, w: 100, h: 51, frames: 1 },
 car_green: { sx: 105, sy: 0, w: 100, h: 51, frames: 1 },
 car_yellow: { sx: 205, sy: 0, w: 98, h: 51, frames: 1 },
 car_red: { sx: 0, sy: 54, w: 140, h: 58, frames: 1 },
 car_brown: { sx: 140, sy: 55, w: 180, h: 55, frames: 1 },
 trunk1:{sx: 260, sy: 170, w: 140, h: 55, frames: 1},
 trunk2:{sx: 0, sy: 115, w: 200, h: 55, frames: 1},
 trunk3:{sx: 0, sy: 163, w: 270, h: 55, frames: 1},
 turtle:{sx: 0, sy: 284, w: 54, h: 60, frames: 1}

 
};

var OBJECT_FROG = 1,
    OBJECT_TRUNK = 2,
    OBJECT_CAR = 4,
    OBJECT_TURTLE = 8,
    OBJECT_WATER = 16;


/// CLASE PADRE SPRITE
var Sprite = function()  
 { }

Sprite.prototype.setup = function(sprite,props) {
  this.sprite = sprite;
  this.merge(props);
  this.frame = this.frame || 0;
  this.w =  SpriteSheet.map[sprite].w;
  this.h =  SpriteSheet.map[sprite].h;
}

Sprite.prototype.merge = function(props) {
  if(props) {
    for (var prop in props) {
      this[prop] = props[prop];
    }
  }
}
Sprite.prototype.draw = function(ctx) {
  SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
}

Sprite.prototype.hit = function(damage) {
  this.board.remove(this);
}


// BACKGROUND

var Background = function(){

   this.setup('background');
   this.x = 0;
   this.y =0;
 }

Background.prototype = new Sprite();

Background.prototype.step = function() {}

//FROG

var Frog = function() {
    this.setup('frog', {vx: 0, reloadTime: 0.25});
    this.reload = this.reloadTime;
    this.x = Game.width / 2 - this.w / 2;
    this.y = Game.height - this.h;
}

Frog.prototype = new Sprite();
Frog.prototype.type = OBJECT_FROG;

Frog.prototype.step = function(dt) {

    // Restamos el tiempo trancurrido
    this.reload -= dt;

    if (this.reload <= 0) {

        this.x += this.vx * dt;

        if (Game.keys['up']) {
            this.reload = this.reloadTime;
            this.y -= this.h;
        } else if (Game.keys['down']) {
            this.reload = this.reloadTime;
            this.y += this.h;
        } else if (Game.keys['right'] && this.x + this.w <= Game.width - this.w) {
            this.reload = this.reloadTime;
            this.x += this.w;
        } else if (Game.keys['left'] && this.x - this.w >= 0) {
            this.reload = this.reloadTime;
            this.x -= this.w;
        }


        if (this.y < 0) this.y = 0;
        else if (this.y > Game.height - this.h) this.y = Game.height - this.h;
        if (this.x < 0) this.x = 0;
        else if (this.x > Game.width - this.w) this.x = Game.width - this.w;
    }
    this.vx = 0;
};

Frog.prototype.hit = function(damage) {
  if(this.board.remove(this)) {
    loseGame();
  }
};

Frog.prototype.onTrunk = function(vTrunk) {
  this.vx = vTrunk;
}



///// EXPLOSION

var Explosion = function(centerX,centerY) {
  this.setup('explosion', { frame: 0 });
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
  this.subFrame = 0;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function(dt) {
  this.frame = Math.floor(this.subFrame++ / 3);
  if(this.subFrame >= 36) {
    this.board.remove(this);
  }
};



var objects = { //speed > 0 left->right, speed <0  right -> left
    car_blue: {sprite: 'car_blue',speed: 150},
    car_green: {sprite: 'car_green',speed: 400},
    car_yellow: {sprite: 'car_yellow',speed: 200},
    car_red: {sprite: 'car_red', speed: 250 },
    car_brown: {sprite: 'car_brown', speed: -300},
    trunk1:{sprite: 'trunk1',speed: -50},
    trunk2:{sprite: 'trunk2',speed: 50},
    trunk3:{sprite: 'trunk3',speed: -50},
    turtle:{sprite: 'turtle',speed: 100}
};

var Spawner = function(data) {
    this.gap = data[0];
    this.obj = data[1];
    this.t = 0;
}
Spawner.prototype = new Sprite();
Spawner.prototype.draw = function() {};
Spawner.prototype.step = function(dt) {
    this.t += dt;
    if (this.t >= this.gap) {
        this.board.add(Object.create(this.obj));
        this.t -= this.gap;
    }
};

///CAR
var count = 0;
var Car = function(sprite,speed) {
  this.setup(sprite);
   count++;
  this.speed = speed;
  this.x = (speed > 0) ? 0 : Game.width;
  this.y = Game.height - 48 - (count * 50);
  if (count == 5){
    count = 0;
  }
}

Car.prototype = new Sprite();
Car.prototype.type = OBJECT_CAR;

Car.prototype.step = function(dt) {
  this.t += dt;
  this.x += this.speed * dt;

  if(this.x < -this.w ||this.x > Game.width) {
       this.board.remove(this);
  }

  var collision = this.board.collide(this,OBJECT_FROG);
  if(collision) {
    collision.hit();
  }

}

Car.prototype.hit = function(damage) {
  this.health -= damage;
  if(this.health <=0) {
    if(this.board.remove(this)) {
      this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
    }
  }

}

//TRUNK
var row = 0;
var Trunk = function(sprite,speed) {
  this.setup(sprite);
  this.speed = speed;
  this.x = (speed > 0) ? 0 : Game.width;
  this.y = Game.height - (48*7) - ((2 * row + 1) * 48);
    row++;
  if (row > 2){
    row = 0;
  }
}

Trunk.prototype = new Sprite();
Trunk.prototype.type = OBJECT_TRUNK;

Trunk.prototype.step = function(dt) {
  this.t += dt;
  this.x += this.speed * dt;

  if(this.x < -this.w ||this.x > Game.width) {
       this.board.remove(this);
  }

  var collision = this.board.collide(this,OBJECT_FROG);
  if(collision) {
    collision.onTrunk(this.speed);
  }

}

Trunk.prototype.hit = function(damage) {
  this.health -= damage;
  if(this.health <=0) {
    if(this.board.remove(this)) {
      this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
    }
  }

}


//TURTLE
var row_t = 1;
var Turtle = function(sprite,speed) {
  this.setup(sprite);
  this.speed = speed;
  this.x = (speed > 0) ? 0 : Game.width;
  this.y = Game.height - (48*7) - ((2 * row_t) * 48);
    row_t++;
  if (row_t > 2){
    row_t = 0;
  }
}

Turtle.prototype = new Sprite();
Turtle.prototype.type = OBJECT_TURTLE;
Turtle.prototype.step = function(dt) {
  this.t += dt;
  this.x += this.speed * dt;

  if(this.x < -this.w ||this.x > Game.width) {
       this.board.remove(this);
  }

  var collision = this.board.collide(this,OBJECT_FROG);
  if(collision) {
    
  }

}

Turtle.prototype.hit = function(damage) {
  this.health -= damage;
  if(this.health <=0) {
    if(this.board.remove(this)) {
      this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
    }
  }

}


//WATER

var Water = function() {
  this.w = Game.width;
  this.h = 48 * 5;
  this.x = 0;
  this.y =  Game.height - (48*8);
}

Water.prototype = new Sprite();
Water.prototype.draw = function(){};
Water.prototype.type = OBJECT_WATER;

Water.prototype.step = function(dt) {

  var collision = this.board.collide(this,OBJECT_FROG);
  if(collision) {
    collision.hit();
  }

}


