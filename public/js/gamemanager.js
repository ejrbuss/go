"use strict"
/*
maybe doesnt need to be a class...
*/

class GameManager{
	constructor(size, player2type){
		this.Game = new Game(1, size); //get AI object from AI class
		this.player2 = assembleAI(player2type);
	}

	userMove(x, y){
		try{
		this.Game.move(x, y);
		}
		catch(err){
			console.log(err);
			return "Try Again";
		}
		if (this.player2){
			var move = this.player2.getMove();
			this.game.move(move.x, move.y);
		}
		this.Game.Board.toString();
		console.log("Player1: " + this.Game.player1score);
		console.log("Player2: " + this.Game.player2score);
	}

	end(){
		console.log(endGame(this.Game.Board));
	}
}