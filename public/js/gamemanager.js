"use strict"
/*
maybe doesnt need to be a class...
*/

class GameManager{
	constructor(size, player1type, player2type){
		this.Game = new Game(1, size, player1type, player2type);
		this.player1 = player1type;
		this.player2 = player2type;
		this.turn = this.player1;
	}

	move(x, y){
		if (this.turn == this.player1){
			try{
			this.Game.Board.move(new Move(x, y, this.player1));
			this.turn = this.player2;
			}
			catch(err){
				console.log(err);
			}
		}
		else{
			try{
			this.Game.Board.move(new Move(x, y, this.player2));
			this.turn = this.player1;
			}
			catch(err){
				console.log(err);
			}
		}
		this.Game.Board.toString();
	}

	end(){
		console.log(endGame(this.Game.Board));
	}
}