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

class AI3 {

	constructor(Game) {
		this.name = 'AI3';
		this.boardSize = Game.Board.size - 1;
		this.SIMULATIONS = 90;
		this.moves = 0;
		this.lastMove = null;
		this.potentialMoves = [{x:this.boardSize/2, y:this.boardSize/2},{x:(this.boardSize/2)-1,y:(this.boardSize/2)-1}];
		for(var i = this.boardSize/2 -2; i < this.boardSize/2 + 2; i++){
			for(var j = this.boardSize/2 -2; j < this.boardSize/2 + 2; j++){
				this.potentialMoves.push({x:i, y:j});
			}
		}
	}

	getMove(Game){
		log.debug('getting move');
		this.moves += 1;
		var x = -1;
		var y = -1;
		var possiblemoves = this.potentialMoves;
		var grid = Game.Board.grid;
		var n = grid.size;

		if(this.moves > 3){
			//needs a lot of work
			//play in main territory until own 50% then move right
			//var quad = this.getQuadrants(Game.Board, 2);
			//var side = this.getSides(Game.Board, 2);

			var spaces = this.getSpaces(Game.Board, 2);

			var i = 0;

			while(spaces[i].n > spaces[i].spaces.length)
				i++;

			possiblemoves = spaces[i].spaces;
			console.log(possiblemoves);

			/*while(i > 0){
				i--;
				possiblemoves = this.subtractSpaces(possiblemoves, spaces[i].spaces);
			}*/
			if(i > 0)
				possiblemoves = this.subtractSpaces(possiblemoves, spaces[0].spaces);

			console.log(possiblemoves);

			//var oppquad = this.getQuadrants(Game.Board, 1);
			//var oppside = this.getSides(Game.Board, 2);

			/*if (quad[0].n >= side[0].n && quad[0].n < quad[0].spaces.length){
				possiblemoves = quad[0].spaces;
			} else if (side[0].n >= quad[0].n && side[0].n < side[0].spaces.length) {
				possiblemoves = side.spaces;
			} else if (quad[0].n >= side[0].n) {
				possiblemoves = side[0].spaces;
			} else {
				possiblemoves = quad[0].spaces;
			}*/

			
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
						movescore[i] += 1;
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
		//console.log(movescore);
		var max = 0;
		var maxindex = 0;
		for (var k = 0; k < movescore.length; k++){
			if (movescore[k] > max){
				max = movescore[k];
				maxindex = k;
			}
		}

		
		
		if (max == 0)
			return {x: 0, y: 0, pass: true};
		else
			return {x: possiblemoves[maxindex].x, y: possiblemoves[maxindex].y};
	
	}

	subtractSpaces(source, removal){
		var src = source;
		var rmv = removal;
		var returnVal = [];

		var remove = false;

		for(var i = 0; i < src.length; i++){
			for(var j = 0; j < rmv.length; j++){
				if(src[i].x == rmv[j].x && src[i].y == rmv[j].y){
					remove = true;
				}
			}
			if(!remove){
				returnVal.push(src[i]);
			}
			remove = false;
		}

		return returnVal;
	}

	getSpaces(board, player){
		var quads = this.getQuadrants(board, player);
		var sides = this.getSides(board, player);

		var returnVal = quads.concat(sides);
		returnVal.sort(function(a,b) {
			return a.n < b.n
		});

		return returnVal;
	}

	getQuadrants(board, player){
		var grid = board.gridCopy(board.grid);
		var n = grid.length;
		var q1 = 0;
		var q2 = 0;
		var q3 = 0;
		var q4 = 0;
		var s1 = [];
		var s2 = [];
		var s3 = [];
		var s4 = [];

		//QUADRANTS
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


		var returnVal = [{n:q1, spaces:s1}, {n:q2, spaces:s2}, {n:q3, spaces:s3}, {n:q4, spaces:s4}];

		return returnVal;
		/*if(q1 >= q2 && q1 >= q3 && q1 >= q4)
			return {q:1, n:q1, spaces:s1}
		else if(q2 >= q1 && q2 >= q3 && q2 >= q4)
			return {q:2, n:q2, spaces:s2}
		else if(q3 >= q1 && q3 >= q2 && q2 >= q4)
			return {q:3, n:q3, spaces:s3}
		else
			return {q:4, n:q4, spaces:s4}*/

	}

	getSides(board, player){
		var grid = board.gridCopy(board.grid);
		var n = grid.length ;
		var l = 0;
		var t = 0;
		var r = 0;
		var b = 0;
		var st = [];
		var sl = [];
		var sr = [];
		var sb = [];
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
		for(var i = n - 1; i > (n+1)/2; i--){
			for(var j = i; j > n - 1 - i; j--){
				if(grid[i][j] == player)
					b++;
				else if(grid[i][j] == 0)
					sb.push({x: i, y: j})
			}
		}

		var returnVal = [{n:t, spaces:st}, {n:l, spaces:sl}, {n:r, spaces:sr}, {n:b, spaces:sb}]

		return returnVal;

		/*if(t >= l && t >= r && t >= b)
			return {s:1, n:t, spaces:st}
		if(l >= t && l >= r && l >= b)
			return {s:2, n:l, spaces:sl}
		if(r >= l && r >= t && r >= b)
			return {s:3, n:r, spaces:sr}
		else
			return {s:4, n:b, spaces:sb}*/
	}


}


class AI2{
	constructor(Game){
        this.name = 'AI2';
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
					log.debug("Blob no Move");
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
        this.name = 'AI5';
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
		log.debug(movescore);
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