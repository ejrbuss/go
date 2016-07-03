//ai.js

/*
	AI Goals:
		start of game prioritize center of the map
		try to build to a corner or a side
		secure large territory on the corner / side

		generally play next to own pieces except when CHANGING PRIORITIZED AREA


	To Do:
		define each area for return in getQuadrant() and getSide()
			- Sides: top,left,right,bottom		-		Quadrants: tl,tr,bl,br
		where to play in determined area
			- Use simulation
*/

Class GoAI {

	constructor(Game){
		this.boardSize = Game.Board.size - 1;
		this.moves = 0;
		this.lastMove = null;
		this.potentialMoves = [{x:this.boardSize/2, y:this.boardSize/2},{x:(this.boardSize/2)-1,y:(this.boardSize/2)-1}];
		for(var i = this.boardSize/2 -2; i < this.boardSize/2 + 2; i++){
			for(var j = this.boardSize/2 -2; j < this.boardSize/2 + 2; j++){
				this.potentialMoves.push({x:i, y:j});
		}
	}

	getMove(Game){
		this.moves += 1;
		var x = -1;
		var y = -1;
		var possiblemoves = [];
		var grid = gridCopy(Game.grid);
		var n = grid.size;

		if(move > 6){
			//needs a lot of work
			//play in main territory until own 50% then move right
			var quad = getQuadrant(Game.board, 2);
			var side = getSide(Game.board, 2);

			if (quad.n >= side.n && quad.n < quad.spaces.length){
				possiblemoves = quad.spaces;
			} else if (side.n >= quad.n && side.n < side.spaces.length) {
				possiblemoves = side.spaces;
			} else if (quad.n >= side.n) {
				possiblemoves = side.spaces;
			} else {
				possiblemoves = quad.spaces;
			}
		}

		//set possible moves to empty locations in area


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

	playMiddle(Game){
		var grid = Game.board;
		var n = grid.size;

		if(grid[(n+1)/2 - 1][(n+1)/2 - 1] == 0)
			return new Move((n+1)/2 - 1, (n+1)/2 -1);


	}

	getQuadrant(board, player){
		var grid = gridCopy(board.grid);
		var n = grid.size;
		var q1,q2,q3,q4 = 0;
		var s1,s2,s3,s4 = []
		
		//q1 = top left
		for(var i = 0; i < (n-1)/2; i++){
			for(var j = 0; j < (n-1)/2; j++){
				if(grid[i][j] == player)
					q1++;
				else if(grid[i][j] == 0)
					s1.push({x: i, y: j})
			}
		}
		//q2 = top right
		for(var i = 0; i < (n-1)/2; i++){
			for(var j = (n+1)/2; j < n; j++){
				if(grid[i][j] == player)
					q2++;
				else if(grid[i][j] == 0)
					s2.push({x: i, y: j})
				
			}
		}
		//q3 = bottom left
		for(var i = (n+1)/2; i < n; i++){
			for(var j = 0; j < (n-1)/2; j++){
				if(grid[i][j] == player)
					q3++;
				else if(grid[i][j] == 0)
					s3.push({x: i, y: j})
				
			}
		}
		//q4 = bottom right
		for(var i = (n+1)/2; i < n; i++){
			for(var j = (n+1)/2; i < n; i++){
				if(grid[i][j] == player)
					q4++;
				else if(grid[i][j] == 0)
					s4.push({x: i, y: j})
			}
		}

		if(q1 >= q2 && q1 >= q3 && q1 >= q4)
			return {q:1, n:q1, spaces:s1}
		else if(q2 >= q1 && q2 >= q3 && q2 >= q4)
			return {q:2, n:q2, spaces:s2}
		else if(q3 >= q1 && q3 >= q2 && q2 >= q4)
			return {q:3, n:q3, spaces:s3}
		else
			return {q:4, n:q4, spaces:s4}

	}

	getSide(board, player){
		var grid = gridCopy(board.grid);
		var n = grid.size;
		var l,t,r,b = 0;
		var st,sl,sr,sb = [];
		//t
		for(var i = 0; i < (n-1)/2; i++){
			for(var j = i; j < n - i; j++){
				if(grid[i][j] == player)
					t++;
				else if(grid[i][j] == 0)
					st.push({x: i, y: j})
			}
		}
		//l
		for(var j = 0; j < (n-1)/2; j++){
			for(var i = j; i < n - j; i++){
				if(grid[i][j] == player)
					l++;
				else if(grid[i][j] == 0)
					sl.push({x: i, y: j})
			}
		}
		//r
		for(var j = n-1; j > (n-1)/2; j--){
			for(var i = j; i > n - 1 - j; i--){
				if(grid[i][j] == player)
					r++;
				else if(grid[i][j] == 0)
					sr.push({x: i, y: j})
			}
		}
		//b
		for(var i = n; i > (n+1)/2; i--){
			for(var j = i; j > n - 1 - i; j--){
				if(grid[i][j] == player)
					b++;
				else if(grid[i][j] == 0)
					sb.push({x: i, y: j})
			}
		}

		if(t >= l && t >= r && t >= b)
			return {s:1, n:t, spaces:st}
		if(l >= t && l >= r && l >= b)
			return {s:2, n:l, spaces:sl}
		if(r >= l && r >= t && r >= b)
			return {s:3, n:r, spaces:sr}
		else
			return {s:4, n:b, spaces:sb}
	}


}

function makeRandomMoves(GameManager, numberofmoves, locations){
	var possiblemoves = locations;
	var moves = [];
	for (var i = 0; i < numberofmoves; i++){
		var n = randomInt(possiblemoves.length);
		moves.push(possiblemoves[n]);
	}
}

function findPossibleMoves(Board){
	var possiblemoves = [];
	for (var i = 0; i < Board.size; i++){
		for (var j = 0; j < Board.size; j++){
			if (Board.grid[i][j] == 0)
				possiblemoves.push({x: i, y: j});
		}
	}
}

function randomInt(n){
	return Math.floor(Math.random()*n);
}

