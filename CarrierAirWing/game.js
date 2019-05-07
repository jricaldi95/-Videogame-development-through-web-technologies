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
        Q.audio.stop();
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

        //stage.add("viewport").follow(player);
        //stage.viewport.offsetX = -120;
        //stage.viewport.offsetY = 95;
        
    });

     Q.gravityY = 0;

      Q.animations("anim_player", { 
        up: {
            frames: [5,4,3,2,1,0],
            rate: 1 / 8,
            loop: false
        },
        stand: {
            frames: [6],
            rate: 1 / 8,
            loop: false
        },
        down: {
            frames: [7,8,9,10],
            rate: 1 / 8,
            loop: false
        },
        fire: {
            frames: [0,1,2],
            rate: 1/30,
            trigger: "fired"
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
                sprite:"anim_player"
            });

            this.add("animation,tween");
            
             Q.input.on("fire",this,"shoot");
        },
        shoot: function() {
            var p = this.p;
            this.stage.insert(new Q.Bullet({
                sheet:"inicial",
                x: p.x,
                y: p.y - p.w/2,
                vy: -200
            }))
        
         },
    
        step: function(dt) {
            /**
             * Comprar si "LEFT" está siendo pulsado y si el ala derecha del jugador está dentro del canvas.
             */
            if (Q.inputs['left'] && (this.p.x - this.p.w/2) > 0) {
                this.p.vx = -this.p.speed;
                    
            } else if (Q.inputs['right'] && (this.p.x + this.p.w/2) < Q.width) {
                this.p.vx = this.p.speed;
            } else {
                this.p.vx = 0;
            }

            if (Q.inputs['up'] && (this.p.y - this.p.h/2) > 0) {
                 this.p.vy = -this.p.speed;
                 //this.p.sheet = "tomcatUp";
                 this.play("up");
            } else if (Q.inputs['down'] && (this.p.y + this.p.h/2) < Q.height) {
                this.p.vy = this.p.speed;
                //this.p.sheet = "tomcatDown";
                this.play("down");
            } else { 
                this.p.vy = 0;
                //this.p.sheet = "tomcatDown";
                this.play("stand");

            }

            if(Q.inputs['space']){
                this.shoot();
            }
 
            this.p.x  += this.p.vx * dt;
            this.p.y  += this.p.vy * dt;

           // Q.input.on("fire", this, "shoot");
        },
        shoot: function() {
            this.stage.insert(new Q.Bullet({
                x: this.p.x,
                y: this.p.y - this.p.w/2,
                vy: -200
            }))
        }

    });


});