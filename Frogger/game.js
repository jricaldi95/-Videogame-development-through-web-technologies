


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
  board.add(new Frog());

  board.add(new Car(cars.car_yellow.sprite, cars.car_yellow.speed));
  board.add(new Car(cars.car_brown.sprite, cars.car_brown.speed));
  board.add(new Car(cars.car_blue.sprite, cars.car_blue.speed));
  board.add(new Car(cars.car_green.sprite, cars.car_green.speed));
  board.add(new Car(cars.car_red.sprite, cars.car_red.speed));
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
