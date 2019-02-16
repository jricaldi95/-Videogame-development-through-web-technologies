/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {
	this.gs = gs; // Servidor grafico
	this.cards = ['8-ball', 'potato', 'dinosaur', 'kronos', 'rocket', 'unicorn', 'guy', 'zeppelin']; //Cartas
	
	this.gameCards = []; // Cartas de la partida actual
	this.totalCards = 0; // Total de cartas encontradas(Total 16)

	this.cardId1;
	this.cardId2;
	this.numCards = 0; // Par de cartas seleccionadas

	this.gameState = 'play'; // Estado del juego
	this.msg = 'Memory Game'; // Mensaje del banner

	this.initGame = function(){

		// Creando las cartas
		for (var i = 0; i < 8; i++) {
			this.gameCards[2 * i] = new MemoryGameCard(this.cards[i]); //Relleno las posiciones pares
			this.gameCards[2 * i + 1] = new MemoryGameCard(this.cards[i]); //Relleno las posiciones impares
		}

		// Desordenando el array
		this.gameCards = this.gameCards.sort(function() {return Math.random() - 0.5});

		// Llamando a loop
		this.loop();
		

	};

	this.loop = function(){

		// Llama al metodo draw cada 16ms, esto es equivalente unos 60 fps
		window.setInterval(this.draw(), 16);
	};

	this.draw = function(){ // Esta funcion aun no esta terminada

		// Escribe el mensaje con el estado actual del juego
		this.gs.drawMessage(this.msg);

		// Llama al metodo draw de todas las cartas del juego
		for (var i = 0; i < 16; i++) {
			this.gameCards[i].draw(this.gs, i);

		}
	};

	this.onClick = function(cardId){

		console.log(this.gameCards[cardId].card);
		console.log('Estado inicial: '+this.gameCards[cardId].state);
		// Aseguramos que se elija una carta que este en su estado back
		if (this.gameCards[cardId].state == 'back'){
			// Si es la primera carta escogida
			if (this.numCards == 0){
				this.cardId1 = cardId; // Guardamos el indice de la  primera carta
				this.gameCards[this.cardId1].flip(); // Cmbiamos su estado a flip
				console.log('Estado tras jugada: '+this.gameCards[this.cardId1].state);
				this.numCards++; //Incrementamos el numero de cartas volteadas en la jugada
				console.log('Cartas seleccionadas(0|1): '+this.numCards);
			}
			else{
				this.cardId2 = cardId; // Guardamos el indice de la segunda carta
				this.gameCards[this.cardId2].flip(); // Cambiamos su estado a flip
				console.log('Estado tras jugada: '+this.gameCards[this.cardId2].state);
				// Comparamos las dos cartas actuales de la jugada
				if (this.gameCards[this.cardId2].compareTo(this.gameCards[this.cardId1].card)){ // Si son pareja
					
					console.log('¡¡¡¡Las cartas son iguales!!!!');
					// Marcamos las cartas como encontradas
					this.gameCards[this.cardId1].found();
					this.gameCards[this.cardId2].found();

					console.log('Estado tras jugada: '+this.gameCards[this.cardId1].state);
					console.log('Estado tras jugada: '+this.gameCards[this.cardId2].state);

					// Actualizamos el numero de cartas volteadas de la jugada
					this.numCards--;
					console.log('Cartas seleccionadas(0|1): '+this.numCards);
					//Actualizamos el total de cartas encontradas
					this.totalCards += 2;
					console.log('Total de cartas encontradas: '+this.totalCards);
					if(this.totalCards == 16) // Ha ganado
						this.msg = 'You Win!!';
					else // Sigue la partida
						this.msg = 'Match Found!!';
				}
				else{ // No son pareja

					console.log('Oooohhhh, no son iguales...')
					// Damos la vuelta a las dos cartas afectadas
					//setTimeout({}, 1000);
					this.gameCards[this.cardId1].back();
					this.gameCards[this.cardId2].back();

					console.log('Estado tras jugada: '+this.gameCards[this.cardId1].state);
					console.log('Estado tras jugada: '+this.gameCards[this.cardId2].state);

					// Actualizamos el numero de cartas volteadas de la jugada
					this.numCards--;
					console.log('Cartas seleccionadas(0|1): '+this.numCards);
					//Tiene que intentarlo de nuevo
					this.msg = 'Try again';
				}
			}
		}
	};
};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {

	this.card = id;
	this.state = 'back';

	this.flip = function(){
		this.state = 'flip';
	};

	this.back = function(){
		this.state = 'back';
	}

	this.found = function(){
		this.state = 'found';
	};

	this.compareTo = function(otherCard){
		return this.card == otherCard;
	};

	this.draw = function(gs, pos){

		if(this.state == 'back')
			gs.draw(this.state, pos);
		else
			gs.draw(this.card, pos);
	};
};
