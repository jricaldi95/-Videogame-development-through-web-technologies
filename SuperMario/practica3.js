window.addEventListener("load", function() {

    var Q = window.Q = Quintus({
            audioSupported: ["ogg", "mp3"]
        }).include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        .enableSound()
        .setup({
            width: 320, // width of created canvas
            height: 480, // height of created canvas
            scaleToFit: false
        }).touch().controls();

    Q.load(["coin.ogg", "music_die.ogg", "music_level_complete.ogg", "music_main.ogg"], function() {

    });

    Q.loadTMX("level.tmx", function() {
        Q.load("mario_small.png, mario_small.json, goomba.png, goomba.json, bloopa.png, bloopa.json, princess.png, mainTitle.png, coin.png, coin.json", function() {
            Q.compileSheets("mario_small.png", "mario_small.json");
            Q.compileSheets("goomba.png", "goomba.json");
            Q.compileSheets("bloopa.png", "bloopa.json");
            Q.compileSheets("coin.png", "coin.json");
            Q.stageScene("mainTitle");
        });


    });
    var StartLevel1 = function() {
        Q.clearStages();
        Q.audio.stop();
        Q.stageScene("level1");
        Q.audio.play("music_main.ogg", {
            loop: true
        });
    };

    var RestartLevel1 = function() {

        Q.clearStages();
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

    Q.scene("endGame", function(stage) {
        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2,
            fill: "rgba(0,0,0,0.5)"
        }));

        var button = container.insert(new Q.UI.Button({
            x: 0,
            y: 0,
            fill: "#CCCCCC",
            label: "Play Again"
        }));

        var label = container.insert(new Q.UI.Text({
            x: 10,
            y: -10 - button.p.h,
            label: stage.options.label
        }));

        button.on("click", function() {
            StartLevel1();
        });

        Q.input.on("confirm", this, function() {
            StartLevel1();
        });

        container.fit(20);

    });


    Q.scene("winGame", function(stage) {

        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2,
            fill: "rgba(0,0,0,0.5)"
        }));

        var button = container.insert(new Q.UI.Button({
            x: 0,
            y: 0,
            fill: "#CCCCCC",
            label: "Play Again"
        }));

        var label = container.insert(new Q.UI.Text({
            x: 10,
            y: -10 - button.p.h,
            label: stage.options.label
        }));

        button.on("click", function() {
            StartLevel1();
        });

        container.fit(20);
    });


    Q.scene("level1", function(stage) {
        Q.stageTMX("level.tmx", stage);
        var mario = stage.insert(new Q.Mario());

        stage.add("viewport").follow(mario);
        stage.viewport.offsetX = -120;
        stage.viewport.offsetY = 152;

        stage.insert(new Q.Princess({
            x: 1990,
            y: 380
        }));

        stage.insert(new Q.Coin({
            x: 350,
            y: 450
        }));

        stage.insert(new Q.Goomba({
            x: 1600,
            y: 380
        }));

        stage.insert(new Q.Bloopa({
            x: 450,
            y: 475
        }));
        
    });


    //MARIO

    // Mario animations
    Q.animations("anim_mario", { 
        run: {
            frames: [0, 1, 2],
            rate: 1 / 10
        },
        stand: {
            frames: [0],
            rate: 1 / 50
        },
        jump: {
            frames: [0],
            rate: 1 / 50,
            loop: false
        }
    });

    Q.Sprite.extend("Mario", {
        init: function(p) {
            this._super(p, {
                sheet: "marioR",
                frame: 0,
                x: 150,
                y: 380,
                jumpSpeed: -410,
                sprite: "anim_mario"
            });

            this.add("2d, platformerControls, animation, tween");

        },
        step: function(dt) {
            if (this.p.vx > 0) { // derecha
                if (this.p.landed > 0) {
                    this.p.sheet = "marioR";
                    this.play("run");
                } 
                else {
                    this.p.sheet = "marioJumpR";
                    this.play("jump");
                }
                this.p.direction = "right";
            } 
            else if (this.p.vx < 0) { // izquierda
                if (this.p.landed > 0) {
                    this.p.sheet = "marioL";
                    this.play("run");
                } 
                else {
                    this.p.sheet = "marioJumpL";
                    this.play("jump");
                }
                this.p.direction = "left";
            } 
            else {
                if (this.p.direction == "right") {
                    this.p.sheet = "marioR";
                    this.play("stand");
                } 
                else {
                    this.p.sheet = "marioL";
                    this.play("stand");
                }
            }

            if (this.p.vy != 0) {
                if (this.p.direction == "right") {
                    this.p.sheet = "marioJumpR";
                    this.play("jump");
                } 
                else {
                    this.p.sheet = "marioJumpL";
                    this.play("jump");
                }
            }

            if (this.p.y > 700) {
                this.destroy();
                Q.stageScene("endGame", 1, { label: "You died" });
                //RestartLevel1();
            }
        }

    });


    // Princess

    Q.Sprite.extend("Princess", {
        init: function(p) {
            this._super(p, {
                asset: "princess.png"
            });

            this.add("2d");

            this.on("hit", function(collision) {
                if (collision.obj.isA("Mario")) {
                    this.trigger("win");
                }
            });

            this.on("win", function() {
                Q.stageScene("winGame", 1, {
                    label: "You win!"
                });
            });
        }
    });



    // Coin

    // Coin animations
    Q.animations("anim_coin", { 
        move: {
            frames: [0, 1, 2],
            rate: 1 / 6
        }
    });

    Q.Sprite.extend("Coin", {
        init: function(p) {
            this._super(p, {
                sheet: "coin",
                sprite: "anim_coin",
                z: 0,
                hit: false,
                angle: 0,
                sensor: true,
                frame: 0
            });

            this.add("tween, animation");

            this.on("hit", function(collision) {
                if (collision.obj.isA("Mario") && !this.p.hit) {
                    this.p.hit = true;
                    Q.audio.play("coin.ogg");
                    this.animate({
                        y: this.p.y - 50,
                        angle: 0
                    }, 0.3, Q.Easing.Linear, {
                        callback: function() {
                            this.destroy();
                        }
                    });
                }
            });
        },
        step: function(dt){
            this.play("move");
        }
    });

    // Goomba

    // Goomba animations
    Q.animations("anim_goomba", { 
        move: {
            frames: [0, 1],
            rate: 1 / 6
        },
        die: {
            frames: [2],
            rate: 1 / 10,
            loop: false,
            trigger: "death_event"
        }
    });

    Q.Sprite.extend("Goomba",{
        init: function(p) {
            this._super(p, { 
                sheet: 'goomba',
                sprite: "anim_goomba",
                frame: 0,
                vx: 200 });
          
            this.add('2d, aiBounce, animation, defaultEnemy');

        }  
        
    });


    // Bloopa

    // Bloopa animations
    Q.animations("anim_bloopa", { 
        move: {
            frames: [0, 1],
            rate: 1 / 6
        },
        die: {
            frames: [2],
            rate: 1 / 10,
            loop: false,
            trigger: "death_event"
        }

    });

    Q.Sprite.extend("Bloopa",{
        init: function(p) {
            this._super(p, { 
                sheet: 'bloopa',
                sprite: "anim_bloopa",
                frame: 0});
          
            this.add('2d, animation, defaultEnemy');

            this.on("hit", function(collision) {
                //Si no colisiona con mario
                if (!collision.obj.isA("Mario")) {
                    this.p.vy = -350;
                }
            });

            // If the enemy gets hit on the top, destroy it
            // and give the user a "hop"
            this.on("bump.top",function(collision) {

                if(collision.obj.isA("Mario")) {
                     this.play("die");
                     collision.obj.p.vy = -200;

                 }
            });
        }
          
    });

    Q.component("defaultEnemy", {
        added: function() {
            this.entity.play("move");

            this.entity.on("bump.top", function(collision) {
                if (collision.obj.isA("Mario")) {
                    this.play("die");
                     //move enemy
                    this.p.vy = -300;
                    //collision.obj.p.vy = -200;
                }
            });

            this.entity.on("bump.left, bump.right, bump.bottom", function(collision) {
                if (collision.obj.isA("Mario")) {
                    Q.stageScene("endGame",1, { label: "You Died" });
                    collision.obj.destroy();
                }
            });

            this.entity.on("death_event", this, function() {
                this.entity.destroy();
            });
        }
    });


});