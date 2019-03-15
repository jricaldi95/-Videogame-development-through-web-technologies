var sprites = {
 frog:{sx: 0, sy: 340, w: 39, h: 46, frames: 1},
 background:{sx: 422, sy: 0, w: 552, h: 625, frames: 1 },
 car_blue: { sx: 0, sy: 0, w: 100, h: 51, frames: 1 },
 car_green: { sx: 105, sy: 0, w: 100, h: 51, frames: 1 },
 car_yellow: { sx: 205, sy: 0, w: 98, h: 51, frames: 1 },
 car_red: { sx: 0, sy: 54, w: 140, h: 58, frames: 1 },
 car_brown: { sx: 140, sy: 55, w: 180, h: 55, frames: 1 },


 enemy_circle: { sx: 158, sy: 0, w: 32, h: 33, frames: 1 },
 explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }
 
};

var OBJECT_FROG = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_CAR = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16;


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
    this.setup('frog', { reloadTime: 0.25});
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
};

Frog.prototype.hit = function(damage) {
  if(this.board.remove(this)) {
    loseGame();
  }
};



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



/// Player Missile


var PlayerMissile = function(x,y) {
  this.setup('missile',{ vy: -700, damage: 10 });
  this.x = x - this.w/2; 
  this.y = y - this.h; 
};

PlayerMissile.prototype = new Sprite();
PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;


PlayerMissile.prototype.step = function(dt)  {
  this.y += this.vy * dt;
  if(this.y < -this.h) { this.board.remove(this); }

  var collision = this.board.collide(this,OBJECT_ENEMY);
    if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if(this.y < -this.h) { 
      this.board.remove(this); 
  }


};


var cars = { //speed > 0 left->right, speed <0  right -> left
    car_blue: {sprite: 'car_blue',speed: 150},
    car_green: {sprite: 'car_green',speed: 400},
    car_yellow: {sprite: 'car_yellow',speed: 200},
    car_red: {sprite: 'car_red', speed: 250 },
    car_brown: {sprite: 'car_brown', speed: -300}
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

//Coches
var count = 0;
var Car = function(sprite,speed) {
  this.setup(sprite);
   count++;
  this.speed = speed;
  this.x = (speed > 0) ? 0 : Game.width;
  console.log(count);
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
    this.board.remove(this);
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

//Enemy
/*var Enemy = function(blueprint,override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
}

Enemy.prototype = new Sprite();
Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0, 
                                   E: 0, F: 0, G: 0, H: 0,
                                   t: 0, health: 20, damage: 10 };


Enemy.prototype.type = OBJECT_ENEMY;

Enemy.prototype.step = function(dt) {
  this.t += dt;
  this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
  this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
  this.x += this.vx * dt;
  this.y += this.vy * dt;
  if(this.y > Game.height ||
     this.x < -this.w ||
     this.x > Game.width) {
       this.board.remove(this);
  }

  var collision = this.board.collide(this,OBJECT_PLAYER);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  }

}

Enemy.prototype.hit = function(damage) {
  this.health -= damage;
  if(this.health <=0) {
    if(this.board.remove(this)) {
      this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
    }
  }

}
*/



/// STAR FIELD

var Starfield = function(speed,opacity,numStars,clear) {

  // Set up the offscreen canvas
  var stars = document.createElement("canvas");
  stars.width = Game.width; 
  stars.height = Game.height;
  var starCtx = stars.getContext("2d");

  var offset = 0;

  // If the clear option is set, 
  // make the background black instead of transparent
  if(clear) {
    starCtx.fillStyle = "#000";
    starCtx.fillRect(0,0,stars.width,stars.height);
  }

  // Now draw a bunch of random 2 pixel
  // rectangles onto the offscreen canvas
  starCtx.fillStyle = "#FFF";
  starCtx.globalAlpha = opacity;
  for(var i=0;i<numStars;i++) {
    starCtx.fillRect(Math.floor(Math.random()*stars.width),
                     Math.floor(Math.random()*stars.height),
                     2,
                     2);
  }

  // This method is called every frame
  // to draw the starfield onto the canvas
  this.draw = function(ctx) {
    var intOffset = Math.floor(offset);
    var remaining = stars.height - intOffset;

    // Draw the top half of the starfield
    if(intOffset > 0) {
      ctx.drawImage(stars,
                0, remaining,
                stars.width, intOffset,
                0, 0,
                stars.width, intOffset);
    }

    // Draw the bottom half of the starfield
    if(remaining > 0) {
      ctx.drawImage(stars,
              0, 0,
              stars.width, remaining,
              0, intOffset,
              stars.width, remaining);
    }
  }

  // This method is called to update
  // the starfield
  this.step = function(dt) {
    offset += dt * speed;
    offset = offset % stars.height;
  }
}

