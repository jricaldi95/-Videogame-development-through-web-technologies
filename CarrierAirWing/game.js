window.addEventListener("load", function() {

    var Q = window.Q = Quintus({
            audioSupported: ["ogg", "mp3"]
        }).include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        .enableSound()
        .setup({
            width: 720, // width of created canvas
            height: 480, // height of created canvas
            scaleToFit: false
        }).touch().controls();

    //Q.load(["coin.ogg", "music_die.ogg", "music_level_comp lete.ogg", "music_main.ogg"], function() { });

    //Q.loadTMX("level.tmx", function() {
        Q.load("level1.png, planes.png, planes.json, enemies.png, enemies.json, mainTitle.png", function() {
            Q.compileSheets("planes.png", "planes.json");
            Q.compileSheets("enemies.png", "enemies.json");
            Q.stageScene("mainTitle");
        });


    //});

     var StartLevel1 = function() {
        Q.clearStages();
        //Q.audio.stop();
        Q.stageScene("background", 0);
        Q.stageScene("level", 1);
    };

    Q.scene("mainTitle", function(stage) {
        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2
        }));

        //Button
        var button = container.insert(new Q.UI.Button({
            x: 0,
            y: 0,
            fill: "#CCCCCC",
            asset: "mainTitle.png"
        }))

        button.on("click", function() {
            StartLevel1();
        });

        Q.input.on("confirm", this, function() {
            StartLevel1();
        });

    });

     Q.scene("level1", function(stage) {
        //Q.stageTMX("level.tmx", stage);
        var player = stage.insert(new Q.Player());
        
        /*stage.insert(new Q.Enemy1({
            x: Q.width,
            y : 200

        }));

        stage.insert(new Q.Enemy2({
            x: Q.width,
            y : 100

        }));
        
        

        stage.insert(new Q.Enemy3({
            x: 300,
            y : 0

        }));

        stage.insert(new Q.Enemy4({
            x: 200,
            y : Q.height-20,
            abajo: true

        }));*/


           stage.insert(new Q.Enemy5({
            x: Q.width-100,
            y : Q.height-20,
            direction: false

        }));
           stage.insert(new Q.Enemy5({
            x: Q.width-100,
            y : 20,
            direction: true

        }));
       
    });

     var level1 = [//21600
        // Start,   End, Gap,  Type,   Override
        [1000, 2000, 300, 'Enemy1', {  x: Q.width,y :200 }],
        [3000, 4000, 300, 'Enemy1', { x:  Q.width, y: 350 }],
        [5000, 6500, 300,  'Enemy2', {  x: Q.width,y : 300 }],
        [7200, 8200, 250, 'Enemy2', { x:  Q.width, y: 150 }],
        [7200, 8200, 250, 'Enemy1', {  x: Q.width,y : 360 }],
        //[10000, 12000, 350, 'Enemy4', { x: 350, y : Q.height-20}],
        [11500, 13000, 12000, 'Enemy5', {  x: Q.width-100,y: Q.height-20}],
        /*[19000, 22000, 20000, 'Enemy5', {  x: Q.width-100,y: 20,direction: true}],
        [22500, 22800, 22300, 'Enemy5', {  x: Q.width-100,y: Q.height-20}],*/
        /*[15000, 16050, 250, 'Enemy3', {  x: 300, y : 0}],
        [15000, 16050, 250, 'Enemy4', {  x: 350, y : Q.height-20}],
        [17200, 18050, 250, 'Enemy3', {  x: 0, y : 0}],
       /* [18200, 20000, 500, 'Enemy3', { x: 350, y: 0 }],
        [22000, 25000, 400, 'Enemy3', { x: 250, y: 0 }],
        //[29000, 29500, 500, 'Boss', { x: 0, y: 200 }]*/
    ];

    Q.scene("level", function(stage) {
        this.levelData = [];
        for (var i = 0; i < level1.length; i++) {
            this.levelData.push(Object.create(level1[i]));
        }
        this.t = 0;
        //this.callback = callback;
        stage.on("step", this, function(dt) {
            var idx = 0,
                remove = [],
                currentWave = null;

            // Update the current time offset
            this.t += dt * 1000;

            //   Start, End,  Gap, Type,   Override
            // [ 0,     4000, 500, 'Enemy3', { x: 0, y: 0 } ]
            while ((currentWave = this.levelData[idx]) &&
                (currentWave[0] < this.t + 2000)) {
                // Check if we've passed the end time
                if (this.t > currentWave[1]) {
                    remove.push(currentWave);
                } else if (currentWave[0] < this.t) {
                    // Add an enemy from the current wave
                    /*if(currentWave[3] === "Boss"){
                        Q.audio.stop();
                        Q.audio.play("music_boss.mp3");
                    }*/
                    stage.loadAssets([
                        [currentWave[3], currentWave[4]]
                    ]);
                    // Increment the start time by the gap
                    currentWave[0] += currentWave[2];
                }
                idx++;
            }

            // Remove any objects from the levelData that have passed
            for (var i = 0, len = remove.length; i < len; i++) {
                var remIdx = this.levelData.indexOf(remove[i]);
                if (remIdx != -1) this.levelData.splice(remIdx, 1);
            }

            // If there are no more enemies on the board or in
            // levelData, this level is done
            /*if(this.levelData.length === 0 && this.board.cnt[OBJECT_ENEMY] === 0) {
                if(this.callback) this.callback();
            }*/


        });

        
        stage.insert(new Q.Player(this));
    });

    Q.scene("background", function(stage) {
        stage.insert(new Q.Background(this));
    });

    Q.gravityY = 0;
    Q.gravityX = 0;

    Q.SPRITE_BULLET = 0;
    Q.SPRITE_PLAYER = 1;
    Q.SPRITE_ENEMY = 2;
    Q.SPRITE_BULLET_ENEMY = 3;


    /********** Background **********/
    Q.Sprite.extend("Background", {
        init: function(p) {

            this._super(p, {
                asset: "level1.png",
                x: 10800,
                y: 480,
                vy: 55,
                vx: 420
            });
        },
        step: function(dt) {
            //console.log(this.p.x);
            if(this.p.x > -10076)
                this.p.x -= this.p.vx * dt;
            if((this.p.x < 2750) && this.p.y > 0)
                this.p.y -= this.p.vy * dt;
        }
    });

     /********** Player **********/

    Q.animations("anim_player", { 
        up: {
            frames: [5,4,3,2,1,0],
            rate: 1 / 9,
            loop: false
        },
        up_back: {
            frames: [0,1,2,3,4,5,6],
            rate: 1 / 11,
            loop: false
        },
        down: {
            frames: [7,8,9,10],
            rate: 1 / 9,
            loop: false
        },
        down_back: {
            frames: [10,9,8,7,6],
            rate: 1 / 11,
            loop: false
        }

    });

    Q.Sprite.extend("Player",{

        init:function(p){
            this._super(p,{
                sheet:"tomcat",
                frame: 6,
                x: 57,
                y: 200,
               /* type:SPRITE_PLAYER,
                collisionMask:SPRITE_ENEMY,*/
                speed: 275,
                pressedRight: false,
                pressedLeft: false,
                pressedUp: false,
                pressedDown: false,
                blocked_UD: false,
                blocked_RL: false,
                sprite:"anim_player"
            });

            this.add("animation");
            
            Q.input.on("fire",this,"shoot");
        },
        step: function(dt) {

            this.p.vx = 0;


            /**************** DERECHA *****************/
            if (Q.inputs['right'] && (this.p.x + this.p.w/2) < Q.width){
                
               // console.log("DERECHA");

                if(!this.p.blocked_RL){

                    if(this.p.pressedLeft){
                       this.p.vx = 0;
                       this.p.blocked_RL = true;
                       this.p.pressedLeft = false;
                    }
                    else{
                        // 2- Si no estaba pulsando abajo
                        this.p.pressedRight = true;
                        this.p.vx = this.p.speed;
                    }
                }
                else{
                    this.p.pressedRight = false;
                }
               
               // console.log(this.p.vx);
            }


            /**************** IZQUIERDA *****************/
            if (Q.inputs['left'] && (this.p.x - this.p.w/2) > 0){
               
               //console.log("IZQUIERDA");

               if(!this.p.blocked_RL){

                    if(this.p.pressedRight){
                       this.p.vx = 0;
                       this.p.blocked_RL = true;
                       this.p.pressedRight = false;
                    }
                    else{
                         this.p.vx = -this.p.speed;
                         this.p.pressedLeft = true;
                    }
                }
                else{
                    this.p.pressedLeft = false;
                }
            }


            /**************** BLOQUEO RIGHT-LEFT *****************/
            if(this.p.blocked_RL &&((!Q.inputs['left'] && Q.inputs['right']) || (Q.inputs['left'] && !Q.inputs['right']))) 
               this.p.blocked_RL = false;
                


            /**************** ARRIBA *****************/
            if (Q.inputs['up'] && (this.p.y - this.p.h/2) > 0){

                //console.log("ARRIBA");

                if(!this.p.blocked_UD){
                    // 1- Si estaba pulsando antes la flecha hacia abajo
                    if(this.p.pressedDown){
                        this.p.vy = 0; // No muevo la nave
                        this.p.blocked_UD = true;
                        this.p.pressedDown = false;
                        this.play("down_back");
                    }
                    else{
                        // 2- Si no estaba pulsando abajo
                        this.p.vy = -this.p.speed; // muevo la nave hacia arriba

                        // 3- Si no estaba ya estaba pulsando arriba
                        if(!this.p.pressedUp){
                            this.p.pressedUp = true;
                            this.play("up");
                        }
                    }
                }
            }




            /**************** ABAJO ***********************/
            if (Q.inputs['down'] && (this.p.y + this.p.h/2) < Q.height) {

               // console.log("ABAJO");

                if(!this.p.blocked_UD){
                    if(this.p.pressedUp){ //Si estaba pulsando arriba y le he dado hacia abajo
                        this.p.vy = 0;
                        this.p.blocked_UD = true;
                        this.p.pressedUp = false;
                        this.play("up_back");
                    }
                    else{
                        this.p.vy = this.p.speed;

                        if(!this.p.pressedDown){
                            this.p.pressedDown = true;
                            this.play("down");
                        }
                    }
                }
            }

            /**************** BOLQUEO UP-DOWN *****************/
            if(this.p.blocked_UD && ((Q.inputs['down'] && !Q.inputs['up']) || (!Q.inputs['down'] && Q.inputs['up']) ))
                this.p.blocked_UD = false;



            if(!Q.inputs['up'] && !Q.inputs['down']) { 
                this.p.vy = 0;
                this.p.blocked_UD = false;

                if(this.p.pressedUp)
                    this.play("up_back");

                this.p.pressedUp = false;

                if(this.p.pressedDown)
                    this.play("down_back");

                this.p.pressedDown = false;
            }
 
            this.p.x  += this.p.vx * dt;
            this.p.y  += this.p.vy * dt;


            if (this.p.y > (Q.height - this.p.h/2))
                this.p.y = Q.height - this.p.h/2;
            else if(this.p.y <  this.p.h/2)
                this.p.y = this.p.h/2;


        },
        shoot: function() {
            this.stage.insert(new Q.Bullet({
                x: this.p.x + this.p.w/2,
                y: this.p.y,
                vx: 1000
            }))
        }

    });

      /********** Bullet **********/

    Q.animations("anim_bullet", { 
        fire: {
            frames: [0],
            rate: 1 / 8,
            loop: false
        }
    });

     Q.Sprite.extend("Bullet", {
                init: function(p) {
                    this._super(p, {
                        sheet: "bullet",
                        frame: 0,
                        sprite: "anim_bullet",
                        type: Q.SPRITE_BULLET,
                        collisionMask: Q.SPRITE_ENEMY,
                        sensor: true
                    });

                    this.add("2d");
                    this.on("hit", function(collision) {
                         this.destroy();
                    });
                },
                step: function(dt) {
                    if (this.p.x >  Q.width) {
                        this.destroy();
                    }
                }
     });

    Q.animations("anim_bullet_enemy", { 
        fire: {
            frames: [3,2,1,0],
            rate: 1 / 3,
            loop: false
        }
    });
     Q.Sprite.extend("Bullet_Enemy", {
        init: function(p) {
            this._super(p, {
                sheet: "bullet_enemy",
                sprite: "anim_bullet_enemy",
                gravity: 0,
                type: Q.SPRITE_BULLET_ENEMY,
                collisionMask: Q.SPRITE_PLAYER,
                sensor: true
            });
              this.add("2d");

              this.on("hit", function(collision) {
                if (collision.obj.isA("Player")) {
                    //animacion de muerte
                     this.destroy();
                     collision.obj.destroy();
                 }
            });
        },

        step: function(dt) {
            this.p.vx -= 3;
            this.p.x += this.p.vx * dt;

            if (this.p.y > Q.height || this.p.y < 0 || this.p.x > Q.width || this.p.x < 0) {
                this.destroy();
            }
        }
    });



     /********** Enemies **********/

    Q.animations("anim_enemies", { 
       begin:{
            frames: [0],
            rate: 1 / 2,
            loop: false
       },

       turn:{
            frames: [0,1,2,3,4,5,6],
            rate: 1 / 14,
            loop: false
       },

       go:{
            frames: [0,1,2,3,4,5,6,7,8],
            rate: 1 / 25,
            loop: true
       }
    });

    
    Q.Sprite.extend("Enemy1",{

        init:function(p){
            this._super(p,{
                sheet:"medium_green_begin",
                frame: 0,
                type:Q.SPRITE_ENEMY,
                collisionMask:Q.SPRITE_PLAYER|Q.SPRITE_BULLET,
                vx:-300,
                vy:-20,
                back: false,
                sprite:"anim_enemies",
                skipCollide: true //evita parar cuando colisiona uno con otro 
            });

            this.add("2d,animation");
           
            this.on("hit", function(collision) {
                if (collision.obj.isA("Player")) {
                    //animacion de muerte
                     collision.obj.destroy();
                 }
                 else if (collision.obj.isA("Bullet")){
                    //animacion de muerte
                     this.destroy();
                 }
            });
        },
        step:function(dt){


           if ((this.p.x + this.p.w/2)  < Q.width/2 && !this.p.back) {
                 this.p.sheet = "medium_green_turn";
                 this.play("turn");
                 this.p.back = true;
                 //this.p.vx = 200;
                 this.p.vx = -45;
                 
                    
            }
            
            if((this.p.x + this.p.w/2)  < ((Q.width/2) - 17))
                this.p.vx = 250;


            if(this.p.x > 384 && this.p.back){
                 this.p.vx = 300;
                 this.p.sheet = "medium_green_go";
                 this.play("go");
            }
           this.p.y  += this.p.vy * dt;

           if (this.p.x > Q.width ) {
                this.destroy();
            }
        }

    });


    Q.Sprite.extend("Enemy2",{

        init:function(p){
            this._super(p,{
                sheet:"medium_orange_begin",
                frame: 0,
                type:Q.SPRITE_ENEMY,
                collisionMask:Q.SPRITE_PLAYER|Q.SPRITE_BULLET,
                vx:-300,
                vy:20,
                back: false,
                sprite:"anim_enemies",
               // vy: 20,
                skipCollide: true //evita parar cuando colisiona uno con otro 
            });

            this.add("2d,animation");
           
            this.on("hit", function(collision) {
                if (collision.obj.isA("Player")) {
                    //animacion de muerte
                     collision.obj.destroy();
                 }
                 else if (collision.obj.isA("Bullet")){
                    //animacion de muerte
                     this.destroy();
                 }
            });
        },
        step:function(dt){ 

            if ((this.p.x + this.p.w/2)  < Q.width/2 && !this.p.back) {
                 this.p.sheet = "medium_orange_turn";
                 this.play("turn");
                 this.p.back = true;
                 //this.p.vx = 200;
                 this.p.vx = -45;
                 
                    
            }
            
            if((this.p.x + this.p.w/2)  < ((Q.width/2) - 17))
                this.p.vx = 250;


            if(this.p.x > 384 && this.p.back){
                 this.p.vx = 300;
                 this.p.sheet = "medium_orange_go";
                 this.play("go");
            }
           this.p.y  += this.p.vy * dt;

           if (this.p.x > Q.width ) {
                this.destroy();
            }
          
        }

    });


    Q.animations("anim_enemies_small", { 
      
       down:{
            frames: [0,1,2,3,4,5,6,7,8],
            rate: 1 / 6,
            loop: false
       },

        up:{
            frames: [8,7,6,5,4,3,2,1,0],
            rate: 1 / 6,
            loop: false
       },

       stand:{
            frames: [8],
            rate: 1 / 5,
            loop: false
       },

       stand_big:{
             frames: [0],
        }
    });

    Q.Sprite.extend("Enemy3",{

        init:function(p){
            this._super(p,{
                sheet:"small_green",
                frame: 9,
                type:Q.SPRITE_ENEMY,
                collisionMask:Q.SPRITE_PLAYER|Q.SPRITE_BULLET,
                vy: 220,
                vx: 18,
                subiendo: false,
                sprite:"anim_enemies_small",
                skipCollide: true //evita parar cuando colisiona uno con otro 
            });

            this.add("2d,animation,tween");
           
            this.on("hit", function(collision) {
                if (collision.obj.isA("Player")) {
                    //animacion de muerte
                    collision.obj.destroy();
                 }
                 else if (collision.obj.isA("Bullet")){
                    //animacion de muerte
                     this.destroy();
                 }
            });
        },
        step:function(dt){


              if(this.p.y < 350 && !this.subiendo){
                
                    this.play("down");
              }
              else if (this.p.y > 350 ){
                   
                   this.play("up");
                   this.p.vy = -220;

                   this.subiendo = true;
               
              }
           this.p.x += this.p.vx * dt;

            if (this.p.y > Q.height || this.p.y < 0 || this.p.x > Q.width || this.p.x < 0) {
                this.destroy();
            }
        }

    });

    Q.Sprite.extend("Enemy4",{

        init:function(p){
            this._super(p,{
                sheet:"small_orange",
                frame: 9,
                type:Q.SPRITE_ENEMY,
                collisionMask:Q.SPRITE_PLAYER|Q.SPRITE_BULLET,
                vy: -200,
                vx: 18,
                bajando: false,
                sprite:"anim_enemies_small",
                skipCollide: true //evita parar cuando colisiona uno con otro 
            });

            this.add("2d,animation");
           
            this.on("hit", function(collision) {
                if (collision.obj.isA("Player")) {
                    //animacion de muerte
                     collision.obj.destroy();
                 }
                 else if (collision.obj.isA("Bullet")){
                    //animacion de muerte
                     this.destroy();
                 }
            });
        },
        step:function(dt){

         if(this.p.y > 150 && !this.bajando){
                
                    this.play("up");
              }
              else if (this.p.y < 150 ){
                   
                   this.play("down");
                   this.p.vy = 200;
                   this.bajando = true;
               
              }
             this.p.x += this.p.vx * dt;
          if (this.p.y > Q.height || this.p.y < 0 || this.p.x > Q.width || this.p.x < 0) {
                this.destroy();
            }
        }

    });

    Q.Sprite.extend("Enemy5",{

        init:function(p){
            this._super(p,{
                sheet:"big_green",
                frame: 1,
                type:Q.SPRITE_ENEMY,
                collisionMask:Q.SPRITE_PLAYER|Q.SPRITE_BULLET,
                sprite:"anim_enemies_small",
                direction: false,
                life: 5500,
                time: 0,
                skipCollide: true //evita parar cuando colisiona uno con otro 
            });

            this.add("2d,animation");
           
            this.on("hit", function(collision) {
                if (collision.obj.isA("Player")) {
                    //animacion de muerte
                     collision.obj.destroy();
                 }
                 else if (collision.obj.isA("Bullet")){
                    //animacion de muerte
                    this.p.life = this.p.life - 250;
                    if(this.p.life <= 0){

                     this.destroy();
                    }
                 }
            });
        },
        step:function(dt){

            this.p.time += dt; 
            //console.log( this.p.time);

            if(this.p.direction == true){ //sale desde arriba
                if(this.p.y < 180){
                    this.p.vy = 50;
                    this.p.vx = -20;
                }
                else if( this.p.y > 180){
                     this.p.vy = 0;
                this.p.vx = 0;

                 //this.p.time += dt; 

                if(this.p.time > 5){
                    this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y - this.p.w / 4, vx: -100 }));
                    this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y, vx: -100 }));
                    this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y + this.p.w / 4, vx: -100 }));
                    this.p.time = 0;
                }
                }

            }else{ // sale desde abajo

                if (this.p.y > 300){
                    this.p.vy = -50;
                    this.p.vx = -20;

                }
                else if (this.p.y < 300) {
                    this.p.vy = 0;
                    this.p.vx = 0;

                     //this.p.time += dt; 

                    if(this.p.time > 5){
                        this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y - this.p.w / 4, vx: -100 }));
                        this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y, vx: -100 }));
                        this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y + this.p.w / 4, vx: -100 }));
                        this.p.time = 0;
                    }
                    
                }
            }
          this.play("stand_big");
        if (this.p.y > Q.height || this.p.y < 0 || this.p.x > Q.width || this.p.x < 0) {
                this.destroy();
            }
        }


    });

     Q.Sprite.extend("Boss",{

        init:function(p){
            this._super(p,{
                sheet:"big_green",
                frame: 1,
                type:Q.SPRITE_ENEMY,
                collisionMask:Q.SPRITE_PLAYER|Q.SPRITE_BULLET,
                sprite:"anim_enemies_small",
                skipCollide: true //evita parar cuando colisiona uno con otro 
            });

            this.add("2d,animation");
           
            this.on("hit", function(collision) {
                if (collision.obj.isA("Player")) {
                    //animacion de muerte
                     this.destroy();
                 }
                 else if (collision.obj.isA("Bullet")){
                    //animacion de muerte
                     this.destroy();
                 }
            });
        },
        step:function(dt){

          if (this.p.y > 300){
                this.p.vy = -50;
                this.p.vx = -20;

          }
          else if (this.p.y < 300) {
                this.p.vy = 0;
                this.p.vx = 0;
          }
          this.play("stand_big");
        
        }

    });
});