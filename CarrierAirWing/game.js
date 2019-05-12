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
        Q.load("level1.png, planes.png, planes.json, enemies_prueba.png, enemies_prueba.json, mainTitle.png", function() {
            Q.compileSheets("planes.png", "planes.json");
            Q.compileSheets("enemies_prueba.png", "enemies_prueba.json");
            Q.stageScene("mainTitle");
        });


    //});

     var StartLevel1 = function() {
        Q.clearStages();
        //Q.audio.stop();
        Q.stageScene("background", 0);
        Q.stageScene("level1", 1);
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
        
        stage.insert(new Q.Enemie1({
            x: Q.width,
            y : 200

        }));
        
        stage.insert(new Q.Enemie3({
            x: 300,
            y : 0

        }));

        stage.insert(new Q.Enemie3({
            x: 300,
            y :Q.height-20

        }));

        stage.insert(new Q.Enemie5({
            x: 300,
            y : 100

        }));
    });

    Q.scene("background", function(stage) {
        stage.insert(new Q.Background(this));
    });

    Q.gravityY = 0;
    Q.gravityX = 0;

    Q.SPRITE_BULLET = 0;
    Q.SPRITE_PLAYER = 1;
    Q.SPRITE_ENEMY = 2;


    /********** Background **********/
    Q.Sprite.extend("Background", {
        init: function(p) {

            this._super(p, {
                asset: "level1.png",
                x: 3240,
                y: 480,
                vx: 250
            });
        },
        step: function(dt) {
            console.log(this.p.x);
            if(this.p.x > 0)
                this.p.x -= this.p.vx * dt;
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
                
                console.log("DERECHA");

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
               
               console.log("IZQUIERDA");

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

                console.log("ARRIBA");

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

                console.log("ABAJO");

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
                        //sensor: true
                    });

                    this.add("2d");
                },
                step: function(dt) {
                    if (this.p.x >  Q.width) {
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
            rate: 1 / 5,
            loop: false
       },

       go:{
            frames: [0,1,2,3,4,5,6,7,8],
            rate: 1 / 8,
            loop: true
       }
    });

    
    Q.Sprite.extend("Enemie1",{

        init:function(p){
            this._super(p,{
                sheet:"medium_green_begin",
                frame: 0,
                type:Q.SPRITE_ENEMY,
                collisionMask:Q.SPRITE_PLAYER|Q.SPRITE_BULLET,
                vx:-200,
                sprite:"anim_enemies",
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

           

            if((this.p.x + this.p.w/2) >  Q.width/2){
                //this.play("begin");
            }else if ((this.p.x + this.p.w/2)  < Q.width/2) {
                 this.p.sheet = "medium_green_turn";
                 this.play("turn");
                 this.p.vx = 200;
                 this.p.y = this.p.y - 5;
                 //this.p.sheet = "medium_green_go";
                 //this.play("go");
                    
            }
           this.p.y  += this.p.vy * dt;
        }

    });


    Q.Sprite.extend("Enemie2",{

        init:function(p){
            this._super(p,{
                sheet:"medium_orange_begin",
                frame: 3,
                type:Q.SPRITE_ENEMY,
                collisionMask:Q.SPRITE_PLAYER|Q.SPRITE_BULLET,
                speed:-200,
                sprite:"anim_enemies",
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

           

            if((this.p.x + this.p.w/2) >  Q.width/2){
                this.play("begin");
            }else if ((this.p.x + this.p.w/2)  < Q.width/2) {
                 this.p.sheet = "medium_orange_turn";
                 this.play("turn");
                 this.p.vx = 50;
                 this.p.y = this.p.y - 10;
                 this.p.sheet = "medium_orange_go";
                 this.play("go");
                    
            }
          
        }

    });


    Q.animations("anim_enemies_small", { 
      
       up:{
            frames: [0,1,2,3,4,5,6,7,8],
            rate: 1 / 10,
            loop: false
       },

        down:{
            frames: [8,7,6,5,4,3,2,1,0],
            rate: 1 / 10,
            loop: false
       },

       stand:{
            frames: [8],
            rate: 1 / 5,
            loop: false
       },
    });

    Q.Sprite.extend("Enemie3",{

        init:function(p){
            this._super(p,{
                sheet:"small_green",
                frame: 9,
                type:Q.SPRITE_ENEMY,
                collisionMask:Q.SPRITE_PLAYER|Q.SPRITE_BULLET,
                speed:-10,
                vy: 50,
                vx:10,
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

          if(this.p.y < Q.height/2 ){
                this.play("down");
          }else if (this.p.y > Q.height/2 ){
                this.p.vy = -50;
                this.play("up");
          }
          else {
                this.p.vy = 0;
                this.p.vx = 0;
                this.play("stand");
          }
        }

    });

    Q.Sprite.extend("Enemie4",{

        init:function(p){
            this._super(p,{
                sheet:"small_orange",
                frame: 9,
                type:Q.SPRITE_ENEMY,
                collisionMask:Q.SPRITE_PLAYER|Q.SPRITE_BULLET,
                speed:-10,
                vy: 50,
                vx:10,
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

          if(this.p.y < Q.height/2){
                this.play("down");
          }else{
                this.p.vy = 0;
                this.p.vx = 0;
                this.play("stand");
          }
        }

    });

    Q.Sprite.extend("Enemie5",{

        init:function(p){
            this._super(p,{
                sheet:"big_green",
                frame: 1,
                type:Q.SPRITE_ENEMY,
                collisionMask:Q.SPRITE_PLAYER|Q.SPRITE_BULLET,
                speed:40,
                vy:-50,
                vx:-20,
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


          }
         /* else if (this.p.y == 300) {
                this.p.vy = 0;
                this.p.vx = 0;
          }*/
          this.play("stand");
          //console.log(this.p.y);


        }

    });
});