"use strict"

class AI{
	//class interface
	// make your AI implement this
	constructor(Game){
        this.name = 'placeholder';
	}  

	getMove(Game){
		return {x: 0, y: 0};
	}
}

class AI2{
	constructor(Game){
        this.name = 'placeholder';
		var i = Math.floor(Game.Board.size / 2);
		var j = i;
		this.blobmoves = [{x: i, y: j}, {x: i+1, y: j}]
	}
	getMove(Game){
		var pass = "pass";
		while (this.blobmoves.length > 0){
			var i = randomInt(this.blobmoves.length);
			try{
				var x = this.blobmoves[i].x;
				var y = this.blobmoves[i].y;
				Game.Board.move(new Move(x, y, Game.player2));
				this.blobmoves.push({x: x+1, y: y});
				this.blobmoves.push({x: x-1, y: y});
				this.blobmoves.push({x: x, y: y+1});
				this.blobmoves.push({x: x, y: y-1});
				Game.Board.grid[x][y] = 0;
				pass = null;
				break;
			}
			catch(err){
				if (err == "InvalidMoveException" || err == "SuicideException" || err == "ReturnToOldStateException"){
					console.log("Blob no Move");
				}
				else
					throw err;
			}
			finally{
				this.blobmoves.splice(i, 1);
			}
		}
		return {x: x, y: y, pass};
	}
}

class AI5{
    
	constructor(Game){
        this.name = 'placeholder';
		this.SIMULATIONS = Math.floor(Math.pow(0.016*Game.Board.size, -2.9));
		this.MAXMOVES = 90;
	}

	getMove(Game){
		var possiblemoves = findPossibleMoves(Game.Board);
		if (possiblemoves.length > this.MAXMOVES){
			possiblemoves = filterMoves(possiblemoves, this.MAXMOVES);
		}
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