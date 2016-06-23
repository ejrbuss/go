

function makeRandomMoves(Game, numberofmoves){
	if (numberofmoves == null)
		numberofmoves = -1;
	var possiblemoves = findPossibleMoves(Game.Board);
	var invalidmoves = [];

	while (possiblemoves.length != 0 && numberofmoves != 0){
		var n = randomInt(possiblemoves.length);
		try{
			var captures = Game.move(possiblemoves[n].x, possiblemoves[n].y);
		}
		catch(err){
			if (err == "InvalidMoveException" || err == "SuicideException" || err == "ReturnToOldStateException"){
				//console.log(err);
				invalidmoves = invalidmoves.concat(possiblemoves.splice(n, 1));
				continue;
			}
			else{
				throw err;
			}
		}
		possiblemoves.splice(n, 1);
		possiblemoves = possiblemoves.concat(captures);
		captures = [];
		possiblemoves = possiblemoves.concat(invalidmoves);
		invalidmoves = [];
		numberofmoves--;
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
	return possiblemoves;
}

function randomInt(n){
	return Math.floor(Math.random()*n);
}

function filterMoves(moves, num){
	ret = [];
	while (ret.length <= num){
		ret = ret.concat(moves.splice(randomInt(moves.length), 1));
	}
	return ret;
}