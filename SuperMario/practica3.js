window.addEventListener("load", function() {

    var Q = window.Q = Quintus({
            audioSupported: ["ogg", "mp3"]
        }).include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        .enableSound()
        .setup({
            width: 320, // width of created canvas
            height: 480, // height of created canvas
            maximize: false // set to true to maximize to screen, "touch" to maximize on touch devices
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

        stage.add("viewport");
        stage.viewport.offsetX = 150;
        stage.viewport.offsetY = 380;
        
    });

});