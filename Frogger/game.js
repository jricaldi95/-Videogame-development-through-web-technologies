


// Especifica lo que se debe pintar al cargar el juego
var startGame = function() {
  Game.setBoard(0,new TitleScreen("Frogger", 
                                  "Press space to start playing",
                                  playGame));
}



var playGame = function() {

  Game.setBoard(0,new Background());
 // Game.setBoard(1,new Level(level1));
 // Game.setBoard(1,new Frog());
  //Game.setBoard(2,new Starfield(100,1.0,50));

  var board = new GameBoard();

  board.add(new Car(objects.car_yellow.sprite, objects.car_yellow.speed));
  board.add(new Car(objects.car_brown.sprite, objects.car_brown.speed));
  board.add(new Car(objects.car_blue.sprite, objects.car_blue.speed));
  board.add(new Car(objects.car_green.sprite, objects.car_green.speed));
  board.add(new Car(objects.car_red.sprite, objects.car_red.speed));
 
  board.add(new Turtle(objects.turtle.sprite, objects.turtle.speed));
  board.add(new Turtle(objects.turtle.sprite, objects.turtle.speed));

  board.add(new Trunk(objects.trunk2.sprite, objects.trunk2.speed));
  board.add(new Trunk(objects.trunk3.sprite, objects.trunk3.speed));
  board.add(new Trunk(objects.trunk1.sprite, objects.trunk1.speed));

  

  board.add(new Frog());
  board.add(new Water());
 //board.add(new Background());
  //board.add(new Level(level1,winGame));
  Game.setBoard(1,board);
}

var winGame = function() {
  Game.setBoard(3,new TitleScreen("You win!", 
                                  "Press space to play again",
                                  playGame));
};



var loseGame = function() {
  Game.setBoard(3,new TitleScreen("You lose!", 
                                  "Press space to play again",
                                  playGame));
};


// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
  Game.initialize("game",sprites,playGame);
});
