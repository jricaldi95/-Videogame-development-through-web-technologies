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

    Q.load(["Intro.ogg", "Mission1.ogg", "Boss1.ogg", "MissionCompleted.ogg", "GameOver.ogg"], function() { });

    Q.load("level1.png, planes.png, planes.json, enemies.png, enemies.json, boss1.png, boss1.json, mainTitle.png, victory.png, defeat.png, bullets.png, items.json, explosion.png, explosion.json", function() {
        Q.compileSheets("planes.png", "planes.json");
        Q.compileSheets("enemies.png", "enemies.json");
        Q.compileSheets("bullets.png", "items.json");
        Q.compileSheets("explosion.png", "explosion.json");
        Q.compileSheets("boss1.png", "boss1.json");
        Q.stageScene("mainTitle");
    });

    var StartLevel1 = function() {
        Q.clearStages();
        Q.audio.stop();
        Q.stageScene("background", 0);
        Q.stageScene("level", 1);
        Q.stageScene("HUD", 2);
        Q.audio.play("Mission1.ogg", {
            loop: true
        });
    };

    Q.scene("mainTitle", function(stage) {


        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2
        }));

        Q.state.set("score", 0);
        Q.state.set("lifes", 3);

        //Button
        var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", asset: "mainTitle.png"}))

        button.on("click", function() {
            Q.audio.play("Intro.ogg");
            setTimeout(function() {
                  StartLevel1();          
            }, 3500);
            
        });

        Q.input.on("confirm", this, function() {
            Q.audio.play("Intro.ogg");
            setTimeout(function() {
                  StartLevel1();          
            }, 3500);
        });

        container.fit(20);

    });


    Q.scene("winGame", function(stage) {

        Q.audio.stop();
        Q.audio.play("MissionCompleted.ogg");

        var container = stage.insert(new Q.UI.Container({ x: Q.width, y: Q.height }));
        var button = container.insert(new Q.UI.Button({ x: -Q.width / 2, y: -Q.height / 2, fill: "#CCCCCC", asset: "victory.png" }));
        var gameOverLabel = stage.insert(new Q.UI.Text({ x: Q.width / 2, y: 15, label: "YOU  WIN!", size: 40, color: "white", family: "ARCADECLASSIC"}));

        Q.state.set("score", 0);
        Q.state.set("lifes", 3);

        button.on("click", function() {
            StartLevel1();
        });


        Q.input.on("confirm", this, function() {
            StartLevel1();
        });

        container.fit(50);

    });

    Q.scene("loseGame", function(stage) {

        Q.audio.stop();
        Q.audio.play("GameOver.ogg");

        var container = stage.insert(new Q.UI.Container({ x: Q.width, y: Q.height }));
        var button = container.insert(new Q.UI.Button({ x: -Q.width / 2, y: -Q.height / 2, fill: "#CCCCCC", asset: "defeat.png" }));
        var gameOverLabel = stage.insert(new Q.UI.Text({ x: Q.width / 2, y: 15, label: "GAME OVER", size: 40, color: "white", family: "ARCADECLASSIC"}));

        Q.state.set("score", 0);
        Q.state.set("lifes", 3);

        button.on("click", function() {
           StartLevel1();

        });

         Q.input.on("confirm", this, function() {
            StartLevel1();
        });

        container.fit(50);
    });

     var level1 = [//21600
        // Start,   End, Gap,  Type,   Override
        [1000, 2000, 300, 'Enemy1', {  x: Q.width,y :200 }],
        [3000, 4000, 300, 'Enemy1', { x:  Q.width, y: 350 }],
        [5000, 6500, 300,  'Enemy2', {  x: Q.width,y : 300 }],
        [7200, 8200, 250, 'Enemy2', { x:  Q.width, y: 150 }],
        [7200, 8200, 250, 'Enemy1', {  x: Q.width,y : 360 }],
        [10000, 12000, 350, 'Enemy4', { x: 350, y : Q.height-20}],
        [11500, 13000, 13000, 'Enemy5', {  x: Q.width-100,y: Q.height-20,direction: false}],
        [19000, 24000, 24000, 'Enemy5', {  x: Q.width-100,y: 20,direction: true}],
        [21600, 23500, 250, 'Enemy3', {  x: 300, y :  Q.height-20}],
        [28500, 29050, 250, 'Enemy4', {  x: 350, y : 0}],
        [29800, 31000, 200, 'Enemy3', {  x: 0, y : 0}],
        [29800, 31000, 200, 'Enemy4', { x: 350, y: 0 }],
        [32000, 35000, 35000, 'Boss1', { x: 300, y: 20 }]
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
            while ((currentWave = this.levelData[idx]) ) {
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

    Q.scene("HUD", function(stage) {
        var container = stage.insert(new Q.UI.Container({
            x: 5,
            y: 5
        }));
        var score = container.insert(new Q.Score());
        var lifes = container.insert(new Q.Lifes())

    });

    /* UI */

    Q.UI.Text.extend("Score", {
        init: function(p) {
            this._super({
                label: "Score: " + Q.state.p.score,
                color: "white",
                align: 'left',
                size: 30,
                family: "ARCADECLASSIC",
                x: 7,
                y: 0
            });

            Q.state.on("change.score", this, "score");
        },
        score: function(score) {
            this.p.label = "Score: " + score;
        }
    });

    Q.UI.Text.extend("Lifes", {
        init: function(p) {
            this._super({
                label: "Lifes: " + Q.state.p.lifes,
                align: 'right',
                x: Q.width - 15,
                y: 0,
                size: 30,
                family: "ARCADECLASSIC",
                color: "white",
            });


            Q.state.on("change.lifes", this, "lifes");
        },

        lifes: function(lifes) {
            this.p.label = "Lifes: " + lifes;
        }
    });

    Q.gravityY = 0;

    Q.SPRITE_BULLET = 0;
    Q.SPRITE_PLAYER = 1;
    Q.SPRITE_ENEMY = 2;
    Q.SPRITE_BULLET_ENEMY = 3;
    Q.SPRITE_ITEM_= 4;


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
                type:Q.SPRITE_PLAYER,
                collisionMask:Q.SPRITE_ENEMY|Q.SPRITE_ITEM|Q.SPRITE_BULLET_ENEMY,
                speed: 275,
                pressedRight: false,
                pressedLeft: false,
                pressedUp: false,
                pressedDown: false,
                blocked_UD: false,
                blocked_RL: false,
                sprite:"anim_player",
                item:0,
            });

            this.add("animation");
            
            Q.input.on("fire",this,"shoot");
            this.on("hit", function(collision) {
                if(collision.obj.isA("Item_weapon"))
                    this.p.item++;
                else if (collision.obj.isA("Item_score")){
                    Q.state.inc("score", 200);
                }

                else
                    this.stage.insert(new Q.Explosion({ x: this.p.x, y: this.p.y - this.p.w / 2 }));
            });
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
            console.log(this.p.item);
            if (this.p.item < 1) {
                this.stage.insert(new Q.Bullet({
                      x: this.p.x + this.p.w/2,
                    y: this.p.y,
                    vx: 1000
                }))
            } else {
                this.stage.insert(new Q.Bullet_max({
                      x: this.p.x + this.p.w/2,
                    y: this.p.y,
                    vx: 1000
                }))
            }
            
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

      Q.animations("anim_bullet_max", { 
        fire: {
            frames: [7],
            rate: 1 / 6,
            loop: false
        }
    });

    Q.Sprite.extend("Bullet_max", {
            init: function(p) {
                this._super(p, {
                    sheet: "bullet_max",
                    frame: 0,
                    sprite: "anim_bullet_max",
                    type: Q.SPRITE_BULLET,
                    collisionMask: Q.SPRITE_ENEMY,
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
                type: Q.SPRITE_BULLET_ENEMY|Q.SPRITE_ENEMY,
                collisionMask: Q.SPRITE_PLAYER,
                skipCollide:true
            });
              this.add("2d");

              this.on("hit", function(collision) {
                if (collision.obj.isA("Player")) {
                    //animacion de muerte
                    setTimeout(function() {
                            if (Q.state.get("lifes") > 0) {
                                Q.state.inc("lifes", -1);
                                Q.state.set("score", 0);
                                StartLevel1();
                            } else {
                                Q.clearStages();
                                //Q.audio.stop();
                                Q.stageScene("loseGame", 0);
                            }
                        }, 1700);
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
                    setTimeout(function() {
                            if (Q.state.get("lifes") > 1) {
                                Q.state.inc("lifes", -1);
                                Q.state.set("score", 0);
                                StartLevel1();
                            } else {
                                Q.clearStages();
                                //Q.audio.stop();
                                Q.stageScene("loseGame", 0);
                            }
                        }, 1700);
                     collision.obj.destroy();
                 }
                 else if (collision.obj.isA("Bullet") || collision.obj.isA("Bullet_max")){
                    Q.state.inc("score", 50);
                    this.stage.insert(new Q.Explosion_enemy({ x: this.p.x, y: this.p.y + this.p.w / 4 }));
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

    var item = false;
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
                
                skipCollide: true //evita parar cuando colisiona uno con otro 
            });

            this.add("2d,animation");
           
            this.on("hit", function(collision) {
                if (collision.obj.isA("Player")) {
                    //animacion de muerte
                    setTimeout(function() {
                            if (Q.state.get("lifes") > 1) {
                                Q.state.inc("lifes", -1);
                                Q.state.set("score", 0);
                                StartLevel1();
                            } else {
                                Q.clearStages();
                                //Q.audio.stop();
                                Q.stageScene("loseGame", 0);
                            }
                        }, 1700);
                     collision.obj.destroy();
                 }
                 else if (collision.obj.isA("Bullet")||collision.obj.isA("Bullet_max")){
                    Q.state.inc("score", 50);
                    this.stage.insert(new Q.Explosion_enemy({ x: this.p.x, y: this.p.y + this.p.w / 4 }));
                    this.destroy();
                    if (Q.state.get("score") >= 400 && !item) {
                        this.stage.insert(new Q.Item_weapon({ x: this.p.x, y: this.p.y - this.p.w / 2}));
                        item = true;
                    }
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
                vx: 22,
                subiendo: false,
                sprite:"anim_enemies_small",
                skipCollide: true //evita parar cuando colisiona uno con otro 
            });

            this.add("2d,animation,tween");
           
            this.on("hit", function(collision) {
                if (collision.obj.isA("Player")) {
                    //animacion de muerte
                    setTimeout(function() {
                            if (Q.state.get("lifes") > 1) {
                                Q.state.inc("lifes", -1);
                                Q.state.set("score", 0);
                                StartLevel1();
                            } else {
                                Q.clearStages();
                                //Q.audio.stop();
                                Q.stageScene("loseGame", 0);
                            }
                        }, 1700);
                    collision.obj.destroy();
                 }
                else if (collision.obj.isA("Bullet")||collision.obj.isA("Bullet_max")){
                    Q.state.inc("score", 50);
                    this.stage.insert(new Q.Explosion_enemy({ x: this.p.x, y: this.p.y + this.p.w / 4 }));
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
                vx: 22,
                bajando: false,
                sprite:"anim_enemies_small",
                skipCollide: true //evita parar cuando colisiona uno con otro 
            });

            this.add("2d,animation");
           
            this.on("hit", function(collision) {
                if (collision.obj.isA("Player")) {
                    //animacion de muerte
                    setTimeout(function() {
                            if (Q.state.get("lifes") > 1) {
                                Q.state.inc("lifes", -1);
                                Q.state.set("score", 0);
                                StartLevel1();
                            } else {
                                Q.clearStages();
                                //Q.audio.stop();
                                Q.stageScene("loseGame", 0);
                            }
                        }, 1700);
                     collision.obj.destroy();
                 }
                else if (collision.obj.isA("Bullet")||collision.obj.isA("Bullet_max")){
                    Q.state.inc("score", 50);
                    this.stage.insert(new Q.Explosion_enemy({ x: this.p.x, y: this.p.y + this.p.w / 2 }));
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
                bullet_time: 0,
                life_time: 0,
                skipCollide: true //evita parar cuando colisiona uno con otro 
            });

            this.add("2d,animation");
           
            this.on("hit", function(collision) {
                if (collision.obj.isA("Player")) {
                    //animacion de muerte
                    setTimeout(function() {
                            if (Q.state.get("lifes") > 1) {
                                Q.state.inc("lifes", -1);
                                Q.state.set("score", 0);
                                StartLevel1();
                            } else {
                                Q.clearStages();
                                //Q.audio.stop();
                                Q.stageScene("loseGame", 0);
                            }
                        }, 1700);
                     collision.obj.destroy();
                 }
                 else if (collision.obj.isA("Bullet")||collision.obj.isA("Bullet_max")){
                    
                    this.p.life = this.p.life - 250;
                    if(this.p.life <= 0){
                        Q.state.inc("score", 100);
                        this.die();
                        this.destroy();

                        this.stage.insert(new Q.Item_score({ 
                            x: this.p.x ,
                            y: this.p.y + this.p.w / 4
                        }));
 
                    }
                 }
            });
        },
        step:function(dt){

            this.p.bullet_time += dt;
            this.p.life_time += dt;
            //console.log( this.p.time);

            if(this.p.life_time < 11){

                if(this.p.direction == true){ //sale desde arriba
                    if(this.p.y < 180){
                        this.p.vy = 50;
                        this.p.vx = -20;
                    }
                    else if( this.p.y > 180){
                        this.p.vy = 0;
                        this.p.vx = 0;

                     //this.p.time += dt; 

                    if(this.p.bullet_time > 5){
                        this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y - this.p.w / 4, vx: -100 }));
                        this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y, vx: -100 }));
                        this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y + this.p.w / 4, vx: -100 }));
                        this.p.bullet_time = 0;
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

                        if(this.p.bullet_time > 5){
                            this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y - this.p.w / 4, vx: -100 }));
                            this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y, vx: -100 }));
                            this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y + this.p.w / 4, vx: -100 }));
                            this.p.bullet_time = 0;
                        }
                        
                    }
                }
            }
            else{
                this.p.vx = 250;
            }

            this.play("stand_big");
            if (this.p.x > Q.width) {
                this.destroy();
            }
        },
        die:function(){
            this.stage.insert(new Q.Explosion_enemy({ x: this.p.x + 20, y: this.p.y + this.p.w / 8 }));
            this.stage.insert(new Q.Explosion_enemy({ x: this.p.x - 120, y: this.p.y + this.p.w / 6 }));
            this.stage.insert(new Q.Explosion_enemy({ x: this.p.x - 50, y: this.p.y + this.p.w / 4 }));
        }
    });


    Q.Sprite.extend("Boss1",{

        init:function(p){
            this._super(p,{
                sheet:"boss1",
                frame: 0,
                life : 10500,
                bullet_time: 0,
                life_time: 0,
                move_time: 0,
                ini : true,
                direction: false,
                type:Q.SPRITE_ENEMY,
                collisionMask:Q.SPRITE_PLAYER|Q.SPRITE_BULLET,
                skipCollide: true //evita parar cuando colisiona uno con otro 
            });

            this.add("2d,animation");
           
            this.on("hit", function(collision) {
                if (collision.obj.isA("Player")) {
                    //animacion de muerte
                    setTimeout(function() {
                            if (Q.state.get("lifes") > 1) {
                                Q.state.inc("lifes", -1);
                                Q.state.set("score", 0);
                                StartLevel1();
                            } else {
                                Q.clearStages();
                                Q.stageScene("loseGame", 0);
                            }
                        }, 1700);
                     collision.obj.destroy();
                 }
                 else if (collision.obj.isA("Bullet")||collision.obj.isA("Bullet_max")){
                    //animacion de muerte
                    this.p.life = this.p.life - 250;

                    if(this.p.life == 7000){
                        console.log("Motores fuera!!");
                        this.p.frame = 1;
                    }
                    else if (this.p.life == 3500){
                        console.log("Alas fuera!!");
                        this.p.frame = 2;
                    }
                    else if(this.p.life == 500){
                        console.log("A punto!!");
                        this.p.frame = 3;
                    }

                    if(this.p.life <= 0){
                        Q.state.inc("score", 500);
                        this.destroy();
                        setTimeout(function() {
                            Q.clearStages();
                            Q.stageScene("winGame");
                        }, 1700);
                        this.die();
                    }
                 }
            });

            Q.audio.stop();
            Q.audio.play("Boss1.ogg");
        },
        step:function(dt){

            this.p.bullet_time += dt;
            this.p.life_time += dt;

            if(this.p.life_time < 23){

                if(this.p.ini){
                    if(this.p.y < 235){
                        this.p.vy = 75;
                        this.p.vx = 65;
                    }
                    else if( this.p.y > 235){
                        this.p.vy = 0;
                        this.p.vx = 0;
                        this.p.move_time += dt;
                        if(this.p.move_time >= 1){
                            this.p.ini = false;
                            this.p.move_time = 0;
                        }
                    }
                }
                else{

                    if(this.p.bullet_time > 6){
                        this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y - this.p.w / 4, vx: -100 }));
                        this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y, vx: -100 }));
                        this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y + this.p.w / 4, vx: -100 }));

                        this.p.bullet_time = 0;
                    }

                    //trngo que bajar
                    if(!this.p.direction){ // hacia abajo
                        if(this.p.y <= Q.height - 100){
                            this.p.vy = 50;
                        }
                        else{ // Si he llegado abajo me paro y espero dos segundos
                            this.p.move_time += dt;
                            this.p.vy = 0;
                            if(this.p.move_time >= 1){
                                this.p.direction = true; // Ahora hay que ir hacia arriba
                                this.p.move_time = 0;
                            }
                        }
                    }
                    else{ // Hacia arriba
                        if(this.p.y >= 100){
                            this.p.vy = -50;
                        }
                        else{ // Si he llegado a arriba me paro y espero dos segundos
                            this.p.move_time += dt;
                            this.p.vy = 0;
                            if(this.p.move_time >= 1){
                                this.p.direction = false; // Ahora hay que ir hacia abajo
                                this.p.move_time = 0;
                            }
                        }
                    }
                }
            }
            else{
                this.p.vx = 250;
            }

            if( this.p.vx > Q.width)
                this.destroy();
        
        },
        die:function(){
            this.stage.insert(new Q.Explosion_enemy({ x: this.p.x + 20, y: this.p.y + this.p.w / 8 }));
            this.stage.insert(new Q.Explosion_enemy({ x: this.p.x - 120, y: this.p.y + this.p.w / 6 }));
            this.stage.insert(new Q.Explosion_enemy({ x: this.p.x - 50, y: this.p.y + this.p.w / 4 }));
            this.stage.insert(new Q.Explosion_enemy({ x: this.p.x , y: this.p.y - 50}));
            this.stage.insert(new Q.Explosion_enemy({ x: this.p.x , y: this.p.y - 20 }));
            this.stage.insert(new Q.Explosion_enemy({ x: this.p.x + 50 , y: this.p.y - 50}));
            this.stage.insert(new Q.Explosion_enemy({ x: this.p.x + 100 , y: this.p.y }));
            this.stage.insert(new Q.Explosion_enemy({ x: this.p.x - 150 , y: this.p.y - 20 }));
            this.stage.insert(new Q.Explosion_enemy({ x: this.p.x - 150 , y: this.p.y + 20 }));
            this.stage.insert(new Q.Explosion_enemy({ x: this.p.x + 200 , y: this.p.y  }));
            this.stage.insert(new Q.Explosion_enemy({ x: this.p.x - 250 , y: this.p.y + 20 }));
        }

    });

     /************Item************/
    Q.animations("anim_items", {  
       show:{
            frames: [0,1,2,3,],
            rate: 1 / 4,
            loop: false
       }
    });

    Q.Sprite.extend("Item_weapon", {
       init: function(p) {
            this._super(p, {
                sheet: "weapon",
                frame:0,
                sprite: "anim_items",
                type:Q.SPRITE_ITEM,
                collisionMask: Q.SPRITE_PLAYER, 
                gravity: 0,
                life_time: 0
            });

            this.add("2d,animation");
            
            this.on("hit", function(collision) {
                if(collision.obj.isA("Player"))
                    this.destroy();
            });
        },
        step: function(dt) {
            this.p.life_time += dt;
            if(this.p.life_time < 12){
                this.play("show");
            }else{
                this.destroy();
            }
           
        }
    });

    Q.Sprite.extend("Item_score", {
        init: function(p) {
            this._super(p, {
                sheet: "score",
                frame:0,
                sprite: "anim_items",
                type:Q.SPRITE_ITEM|Q.SPRITE_BULLET,
                collisionMask: Q.SPRITE_PLAYER, 
                gravity: 0,
                life_time: 0
            });

            this.add("2d,animation");
            
            this.on("hit", function(collision) {
                if(collision.obj.isA("Player"))
                    this.destroy();
            });
        },
        step: function(dt) {
            this.p.life_time += dt;
            if(this.p.life_time < 12){
                this.play("show");
            }else{
                this.destroy();
            }
           
        }
    });

     /*************EXPLOSION**************/
    Q.animations("anim_explosion", {
        "explosion": { 
            frames: [0, 1, 2, 3, 4, 5,6],
            rate: 1 / 15, 
            loop: false,
            trigger: "exploted" 
        }
    });

    Q.Sprite.extend("Explosion", {
        init: function(p) {
            this._super(p, {
                sheet: "explosion",
                sprite: "anim_explosion",
                type:Q.SPRITE_ENEMY,
                skipCollide: true
            });

            //this.add("2d, animation");
            this.add("animation");
            this.play("explosion");
            this.on("exploted", this, function() {
                this.destroy();
            });

        },
        step: function(dt) {

        }
    });


    Q.animations("anim_explosion_enemy", {
        "explosion": { 
            frames: [0, 1, 2, 3, 4, 5,6,7,8,9,10,11,12],
            rate: 1 / 17, 
            loop: false,
            trigger: "exploted" 
        }
    });

    Q.Sprite.extend("Explosion_enemy", {
        init: function(p) {
            this._super(p, {
                sheet: "explosion_enemy",
                sprite: "anim_explosion_enemy",
                type:Q.SPRITE_ENEMY,
                skipCollide: true
            });

            //this.add("2d, animation");
            this.add("animation");
            this.play("explosion");
            this.on("exploted", this, function() {
                this.destroy();
            });

        },
        step: function(dt) {

        }
    });

});