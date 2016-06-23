"use strict"
/*
maybe doesnt need to be a class...
*/

class GameManager{
	constructor(size, AItype){
		// would call server for game id at this point
		var id = 1;
		this.Game = new Game(id, size); //get AI object from AI class
		this.player2 = assembleAI(AItype, this.Game);
	}

	userMove(x, y, pass){
		try{
		this.Game.move(x, y, pass);
		}
		catch(err){
			console.log(err);
			// here you can put some error try again UI call
			return "Try Again";
		}
		// It would be nice to put some delay, so that the AI move is not instant.
		if (this.player2){
			var move = this.player2.getMove(this.Game);
			this.Game.move(move.x, move.y, move.pass);
		}
		this.Game.Board.toString(); // This would turn into a UI change
		console.log("Player1: " + this.Game.player1score);
		console.log("Player2: " + this.Game.player2score);
	}

	end(){
		console.log(endGame(this.Game.Board));
		// server/database call for stats storage can go here.
		// UI call can go here
	}
}