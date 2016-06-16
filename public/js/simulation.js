

function makeRandomMoves(GameManager, numberofmoves){
	var possiblemoves = findPossibleMoves()
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