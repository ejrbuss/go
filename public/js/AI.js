"use strict"

class AI{
	constructor(){

	}

	getMove(Game){
		return {x: 0, y: 0};
	}
}

class AI5{
	constructor(simulations){
		this.SIMULATIONS = simulations;
	}

	getMove(Game){
		var possiblemoves = findPossibleMoves(Game.Board);
		var movescore = [];
		for (var i = 0; i < possiblemoves.length; i++){
			movescore.push(0);
		}
		for (var i = 0; i < possiblemoves.length; i++){
			var gamestate = Game.copyState();
			try{
				Game.move(possiblemoves[i].x, possiblemoves[i].y); // will except if fails
				var aftermovestate = Game.copyState();
				for (var sims = 0; sims < this.SIMULATIONS; sims++){
					makeRandomMoves(Game);
					var score = endGame(Game);
					if (score.player2score > score.player1score)
						movescore[i]++;
					Game.resetState(aftermovestate);
				}
			}
			catch(err){
				if (err == "InvalidMoveException"){
					movescore[i] = -1;
				}
			}
			finally{
				game.resetState(gamestate);
			}
		}
	}
}