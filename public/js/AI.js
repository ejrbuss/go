"use strict"

class AI{
	//class interface
	// make your AI implement this
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
					makeRandomMoves(Game, Math.floor((Game.Board.size*Game.Board.size)*1.25));
					var score = endGame(Game);
					if (score.player2score >= score.player1score)
						movescore[i]++;
					Game.resetState(aftermovestate);
				}
			}
			catch(err){
				if (err == "InvalidMoveException" || err == "SuicideException" || err == "ReturnToOldStateException"){
					movescore[i] = -1;
				}
				else
					throw err;
			}
			finally{
				Game.resetState(gamestate);
			}
		}
		console.log(movescore);
		var max = -1;
		var maxindex = 0;
		for (var k = 0; k < movescore.length; k++){
			if (movescore[k] > max){
				max = movescore[k];
				maxindex = k;
			}
		}
		if (max == -1)
			return {x: 0, y: 0, pass: true};
		else
			return {x: possiblemoves[maxindex].x, y: possiblemoves[maxindex].y};
	}
}