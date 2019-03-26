window.addEventListener("load", function() {

    var Q = window.Q = Quintus({
            audioSupported: ["ogg", "mp3"]
        }).include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        .enableSound()
        .setup({
            width: 320, // width of created canvas
            height: 480, // height of created canvas
            maximize: true // set to true to maximize to screen, "touch" to maximize on touch devices
        }).controls().touch();

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
            y: 500
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

    Q.Sprite.extend("Coin", {
        init: function(p) {
            this._super(p, {
                sheet: "coin",
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
        }
    });


});