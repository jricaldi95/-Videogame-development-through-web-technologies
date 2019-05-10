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

     /********** Player **********/

    Q.animations("anim_player", { 
        up: {
            frames: [5,4,3,2,1,0],
            rate: 1 / 8,
            loop: false
        },
        up_back: {
            frames: [0,1,2,3,4,5],
            rate: 1 / 5,
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
        down_back: {
            frames: [10,9,8,7],
            rate: 1 / 5,
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
                pressed: false,
                sprite:"anim_player"
            });

            this.add("animation");
            
            Q.input.on("fire",this,"shoot");
        },
        step: function(dt) {

            //var pressed = false;

            if (Q.inputs['left'] && (this.p.x - this.p.w/2) > 0) {
                this.p.vx = -this.p.speed;
                    
            } else if (Q.inputs['right'] && (this.p.x + this.p.w/2) < Q.width) {
                this.p.vx = this.p.speed;
            } else {
                this.p.vx = 0;
            }

            if (Q.inputs['up'] && (this.p.y - this.p.h / 2) > 0) {
                this.p.vy = -this.p.speed;
                if(!this.p.pressed){
                    this.play("up");
                    this.p.pressed = true;
                }

            } else if (Q.inputs['down'] && (this.p.y + this.p.h / 2) < Q.height) {
                this.p.vy = this.p.speed;
                if(!this.p.pressed){
                    this.play("down");
                    this.p.pressed = true;
                }
            } else { 
                this.p.vy = 0;
                this.p.pressed = false;
                this.play("stand");
            }
 
            this.p.x  += this.p.vx * dt;
            this.p.y  += this.p.vy * dt;

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