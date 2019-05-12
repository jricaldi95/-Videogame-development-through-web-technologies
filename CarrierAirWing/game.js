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

    Q.loadTMX("level.tmx", function() {
        Q.load("planes.png, planes.json, enemies.png, enemies.json, mainTitle.png", function() {
            Q.compileSheets("planes.png", "planes.json");
            Q.compileSheets("enemies.png", "enemies.json");
            Q.stageScene("mainTitle");
        });


    });

     var StartLevel1 = function() {
        Q.clearStages();
        //Q.audio.stop();
        Q.stageScene("level1");
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
        Q.stageTMX("level.tmx", stage);
        var player = stage.insert(new Q.Player());
        
    });

     Q.gravityY = 0;
     Q.gravityX = 0;

     /********** Player **********/

    Q.animations("anim_player", { 
        up: {
            frames: [5,4,3,2,1,0],
            rate: 1 / 8,
            loop: false
        },
        up_back: {
            frames: [0,1,2,3,4,5,6],
            rate: 1 / 10,
            loop: false
        },
        down: {
            frames: [7,8,9,10],
            rate: 1 / 8,
            loop: false
        },
        down_back: {
            frames: [10,9,8,7,6],
            rate: 1 / 10,
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
                speed:200,
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
                        sprite: "anim_bullet"
                        //type: SPRITE_BULLET,
                        //collisionMask: SPRITE_ENEMY,
                        //sensor: true
                    });

                    this.add("2d");
                },
                step: function(dt) {
                    if (this.p.x >  Q.width) {
                        this.destroy();
                    }
                }
            })


});