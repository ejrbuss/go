/*
The score function library used by both the game manager and the AI.

*/

function endGame(Board){
	alreadychecked = [];
	player1score = 0;
	player2score = 0;
	for (var i = 0; i < Board.grid.length; i++){
		for (var j = 0; j < Board.grid[0].length; j++){
			var pleasecontinue = false;

			for (var k = 0; k < alreadychecked.length; k++){
				if (i == alreadychecked[k].x && j == alreadychecked[k].y){
					pleasecontinue = true;
					break;
				}
			}

			if (pleasecontinue)
				continue;

			if (Board.grid[i][j] == 1){
				player1score++;
				alreadychecked.push({x: i, y: j});
			}
			else if (Board.grid[i][j] == 2){
				player2score++;
				alreadychecked.push({x: i, y: j});
			}
			else{
				var territory = getTerritory(Board, i, j, []);
				console.log("found territory!");
				console.log(territory);
				alreadychecked = alreadychecked.concat(territory.locations);
				if (territory.owner == 1)
					player1score += territory.locations.length;
				else if (territory.owner == 2)
					player2score += territory.locations.length;
			}
		
		}
	}
	return {player1score: player1score, player2score: player2score};
}

function getTerritory(Board, i, j, checked){
	console.log(i, j);
	if (i < 0 || j < 0 || i >= Board.grid.length || j>= Board.grid[0].length)
		return {locations: [], isterritory: true, owner: null};

	if (Board.grid[i][j] != 0)
		return {locations: [], isterritory: true, owner: Board.grid[i][j]}

	for (var k = 0; k < checked.length; k++){
		if (i == checked[k].x && j == checked[k].y)
			return {locations: [], isterritory: true, owner: null};
	}
	checked.push({x: i, y: j});
	var isterritory = true;
	var owner = null;

	var back1 = getTerritory(Board, i+1, j, checked);
	var back2 = getTerritory(Board, i, j+1, checked);
	var back3 = getTerritory(Board, i-1, j, checked);
	var back4 = getTerritory(Board, i, j-1, checked);

	if (bothPlayersIn(back1.owner, back2.owner, back3.owner, back4.owner))
		isterritory = false;

	if (!isterritory || !back1.isterritory || !back2.isterritory || !back3.isterritory || !back4.isterritory){
		isterritory = false;
		owner = null;
	}
	else{
		owner = getOwnerOf(back1.owner, back2.owner, back3.owner, back4.owner);
	}

	return {locations: checked, isterritory: isterritory, owner: owner};
}

function bothPlayersIn(back1, back2, back3, back4){
	backlist = [back1, back2, back3, back4];
	owner = null;
	for (var i = 0; i < backlist.length; i++){
		if (backlist[i] != null){
			if (owner == null){
				owner = backlist[i];
			}
			else if (backlist[i] != owner){
				return true;
			}
		}
	}
	return false;
}

function getOwnerOf(back1, back2, back3, back4){
	backlist = [back1, back2, back3, back4];
	for (var i = 0; i < backlist.length; i++){
		if (backlist[i] != null){
			return backlist[i];
		}
	}
	return null;
}

function isSuicide(Board, Move){
	var m = "hello";
	return !hasLiberties(Board, Move.x, Move.y, [], Move.side).hasLiberties;
}

function isCapture(Board, Move){
	var captured = [];
	var side = 1;
	if (Move.side == 1){
		side = 2;
	}
	captured = captured.concat(hasLiberties(Board, Move.x+1, Move.y, [], side).group);
	captured = captured.concat(hasLiberties(Board, Move.x, Move.y+1, [], side).group);
	captured = captured.concat(hasLiberties(Board, Move.x-1, Move.y, [], side).group);
	captured = captured.concat(hasLiberties(Board, Move.x, Move.y-1, [], side).group);
	console.log("tokens captured: " + captured);
	return captured;
}

function hasLiberties(Board, i, j, checked, side){
	console.log(i, j);
	if (i < 0 || j < 0 || i >= Board.grid.length || j>= Board.grid[0].length)
		return {group: [], hasLiberties: false};

	if (Board.grid[i][j] == 0)
		return {group: [], hasLiberties: true};

	if (Board.grid[i][j] != side)
		return {group: [], hasLiberties: false};

	for (var k = 0; k < checked.length; k++){
		if (i == checked[k].x && j == checked[k].y)
			return {group: [], hasLiberties: false};
	}
	checked.push({x: i, y: j});

	var back1 = hasLiberties(Board, i+1, j, checked, side);
	if (back1.hasLiberties)
		return {group: [], hasLiberties: true};
	var back2 = hasLiberties(Board, i, j+1, checked, side);
	if (back2.hasLiberties)
		return {group: [], hasLiberties: true};
	var back3 = hasLiberties(Board, i-1, j, checked, side);
	if (back3.hasLiberties)
		return {group: [], hasLiberties: true};
	var back4 = hasLiberties(Board, i, j-1, checked, side);
	if (back4.hasLiberties)
		return {group: [], hasLiberties: true};

	return {group: checked, hasLiberties: false};
}