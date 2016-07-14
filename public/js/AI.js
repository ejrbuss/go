"use strict"

class AI{
	//class interface
	// make your AI implement this
	constructor(Game) {
        this.name = 'placeholder';
	}

	getMove(Game){
		return {x: 0, y: 0};
	}
}

class AI2 {
	constructor(Game) {
		this.name = "AI2";
		this.size = Game.Board.size;
		var i = Math.floor(this.size / 2);
		this.move = {x: i, y: i};
		this.direction = "up";
		this.spirallength = 1;
		this.spiralcount = 1;
	}

	getMove(Game){
		var pass = true;
		while(this.move != null){
			try{
				var movetomake = new Move(this.move.x, this.move.y, Game.player2)
				Game.Board.move(movetomake);
				Game.Board.rollbackBoard(Game.Board.diff.Move, Game.Board.diff.captured, Game.Board.grid);
				pass = null;
				break;
			}
			catch(err){
				if (err == "InvalidMoveException" || err == "SuicideException" || err == "ReturnToOldStateException"){
				}
				else
					throw err;
			}
			finally{
				this.swirl();
			}
		}
		if (pass){
			return {x: 0, y: 0, pass: true}
		}
		else{
			return {x: movetomake.x, y: movetomake.y};
		}
	}

	swirl(){
		if (this.move.x < 0 || this.move.y < 0 || this.move.x >= this.size || this.move.y >= this.size){
			this.move = null;
			return;
		}
		if (this.direction == "up"){
			this.move = {x: this.move.x, y: this.move.y-1};
			this.spiralcount--;
			if (this.spiralcount == 0){
				this.spirallength++;
				this.spiralcount = this.spirallength;
				this.direction = "left";
			}
		}
		else if (this.direction == "left"){
			this.move = {x: this.move.x-1, y: this.move.y};
			this.spiralcount--;
			if (this.spiralcount == 0){
				this.spirallength++;
				this.spiralcount = this.spirallength;
				this.direction = "down";
			}
		}
		else if (this.direction == "down"){
			this.move = {x: this.move.x, y: this.move.y+1};
			this.spiralcount--;
			if (this.spiralcount == 0){
				this.spirallength++;
				this.spiralcount = this.spirallength;
				this.direction = "right";
			}
		}
		else if (this.direction == "right"){
			this.move = {x: this.move.x+1, y: this.move.y};
			this.spiralcount--;
			if (this.spiralcount == 0){
				this.spirallength++;
				this.spiralcount = this.spirallength;
				this.direction = "up";
			}
		}
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

			var spaces = this.getSpaces(Game.Board, 2);

			var i = 0;

			while(spaces[i].n > spaces[i].spaces.length && i < spaces.length)
				i++;

			possiblemoves = spaces[i].spaces;
			//console.log(possiblemoves);

			var oppSpaces = this.getSpaces(Game.Board, 1);
			var j = 0;

			while(oppSpaces[j].n > spaces[j].spaces.length && j < spaces.length)
				j++;

			if(j > 0)
				possiblemoves = possiblemoves.concat(oppSpaces[j].spaces);

			if(i > 0)
				possiblemoves = this.subtractSpaces(possiblemoves, spaces[0].spaces);

			console.log(possiblemoves);
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
					s1.push({x: i, y: j});
			}
		}
		//q2 = top right
		for(var i = 0; i < (n-1)/2; i++){
			for(var j = (n+1)/2; j < n; j++){
				if(grid[i][j] == player)
					q2++;
				else if(grid[i][j] == 0)
					s2.push({x: i, y: j});
				
			}
		}
		//q3 = bottom left
		for(var i = (n+1)/2; i < n; i++){
			for(var j = 0; j < (n-1)/2; j++){
				if(grid[i][j] == player)
					q3++;
				else if(grid[i][j] == 0)
					s3.push({x: i, y: j});
				
			}
		}
		//q4 = bottom right
		for(var i = (n+1)/2; i < n; i++){
			for(var j = (n+1)/2; i < n; i++){
				if(grid[i][j] == player)
					q4++;
				else if(grid[i][j] == 0)
					s4.push({x: i, y: j});
			}
		}


		var returnVal = [{n:q1, spaces:s1}, {n:q2, spaces:s2}, {n:q3, spaces:s3}, {n:q4, spaces:s4}];

		return returnVal;
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
					st.push({x: i, y: j});
			}
		}
		//l
		for(var j = 0; j < (n-1)/2; j++){
			for(var i = j; i < n - j; i++){
				if(grid[i][j] == player)
					l++;
				else if(grid[i][j] == 0)
					sl.push({x: i, y: j});
			}
		}
		//r
		for(var j = n-1; j > (n-1)/2; j--){
			for(var i = j; i > n - 1 - j; i--){
				if(grid[i][j] == player)
					r++;
				else if(grid[i][j] == 0)
					sr.push({x: i, y: j});
			}
		}
		//b
		for(var i = n - 1; i > (n+1)/2; i--){
			for(var j = i; j > n - 1 - i; j--){
				if(grid[i][j] == player)
					b++;
				else if(grid[i][j] == 0)
					sb.push({x: i, y: j});
			}
		}

		var returnVal = [{n:t, spaces:st}, {n:l, spaces:sl}, {n:r, spaces:sr}, {n:b, spaces:sb}];

		return returnVal;
	}
}



class AI1{
	constructor(Game){
        this.name = 'AI1';
		var i = Math.floor(Game.Board.size / 2);
		var j = i;
		var moves = findPossibleMoves(Game.Board);
		this.blobmoves = [moves[randomInt(moves.length)]];
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
		this.SIMULATIONS = Math.floor(0.25*Math.pow(0.016*Game.Board.size, -2.9));
		this.MAXMOVES = 30;
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
				Game.move(possiblemoves[i].x, possiblemoves[i].y, possiblemoves[i].pass); // will except if fails
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

		var max = -1;
		var maxindex = 0;
		for (var k = 0; k < movescore.length; k++){
			if (movescore[k] > max){
				max = movescore[k];
				maxindex = k;
			}
		}
		log.debug(movescore[maxindex] + "/" + this.SIMULATIONS);
		var score = endGame(Game);
		if (max == -1 || max < Math.floor(0.25*this.SIMULATIONS) || (score.player2score >= score.player1score && max > Math.floor(0.75*this.SIMULATIONS)))
			return {x: 0, y: 0, pass: true};
		else
			return {x: possiblemoves[maxindex].x, y: possiblemoves[maxindex].y, pass: possiblemoves[maxindex].pass};
	}
}

class AIX{

	constructor(Game){
		this.name = 'AIX';
	}

	getMove(Game){
		var options;
		if(Game.player1score > Game.player2score){
			options = {
				host:'roberts.seng.uvic.ca',
				path:'/ai/formEyes',
				port:30000,
				method:'POST',
				headers: {
					'Content-Type':'application/json'
				}
			};
		} else {
			options = {
				host:'roberts.seng.uvic.ca',
				path:'/ai/attackEnemy',
				port:30000,
				method:'POST',
				headers: {
					'Content-Type':'application/json'
				}
			};
		}

		var callback = function(res){
			var str = '';
			console.log(res.statusCode);

		    res.on('data', function(chunk){
		    	console.log(chunk.toString());
		    	str += chunk.toString();
		    });

		    res.on('end', function(){
		    	console.log('final data: ' + str);
		    	var move = JSON.parse(str);
		    	var newMove = {
		    		x:move.x,
		    		y:move.y,
		    		side:move.c,
		    		pass:move.pass
		    	};

		    	return newMove;
		    });
		};

	    var req = http.request(options, callback);

	    req.on('error', function(e){
	    	console.log('problem with request: ' + e.message);
	    	return {x:0, y:0, pass:true};
	    });

	    var pass = (Game.Board.diff.move.side == 2);

	    var postData = JSON.stringify({
	    	'size': Game.Board.size,
	    	'board': Game.Board.grid,
	    	'last': {x:Game.Board.diff.move.x, y:Game.Board.diff.move.y, c:1, pass:pass}
	    });

	    req.write(postData);

	    req.end();
	}
}