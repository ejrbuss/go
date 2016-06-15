/*
The score function library used by both the game manager and the AI.
TODO implement disputed? checking.
TODO implement captured? function.
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