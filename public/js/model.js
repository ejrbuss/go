"use strict"
/*
The game model
*/

class Game{
    
	constructor(id, size){
		this.Board = new Board(size);
		this.player1 = 1;
		this.player2 = 2;
		this.player1score = 0;
		this.player2score = 0;
		this.id = id;
		this.turn = this.player1;
	}

	move(x, y, pass){
		var captured = []
		if (this.turn == this.player1){
			if (!pass){
				captured = this.Board.move(new Move(x, y, this.player1));
				this.player1score += captured.length;
			}
			this.turn = this.player2;
		} else {
			if (!pass){
				captured = this.Board.move(new Move(x, y, this.player2));
				this.player2score += captured.length;
			}
			this.turn = this.player1;
		}
		return captured;
	}

	copyState() { 
		return {player1score: this.player1score,
				player2score: this.player2score,
				turn: this.turn,
				board: this.Board.gridCopy(this.Board.grid),
				diff: this.Board.diff,
				oldGrid: this.Board.oldGrid};
	}

	resetState(gamestate) {
		this.player1score = gamestate.player1score;
		this.player2score = gamestate.player2score;
		this.turn = gamestate.turn;
		for (var i = 0; i < gamestate.board.length; i++){
			for (var j = 0; j < gamestate.board.length; j++){
				this.Board.grid[i][j] = gamestate.board[i][j];
			}
		}
		for (var i = 0; i < gamestate.board.length; i++){
			for (var j = 0; j < gamestate.board.length; j++){
				this.Board.oldGrid[i][j] = gamestate.oldGrid[i][j];
			}
		}
		this.Board.diff = gamestate.diff;
	}
}

class Board 
{
	constructor(size) {
		this.size = size;
		this.grid = [];
		this.oldGrid = [];
		this.diff = {Move: null, captured: null};
		for (var i = 0; i < size; i++){
			this.grid.push([]);
			for (var j = 0; j < size; j++){
				this.grid[i].push(0);
			}
		}
		this.oldGrid = this.gridCopy(this.grid);
	}

	move(Move){
		if (!this.isValidMove(Move))
			throw "InvalidMoveException";

		this.grid[Move.x][Move.y] = Move.side;

		var captured = isCapture(this, Move);
		if (captured.length == 0){
			if (isSuicide(this, Move)){
				this.grid[Move.x][Move.y] = 0;
				throw "SuicideException";
			}
		}
		this.updateBoard(Move, captured, this.grid);

		if(this.gridCompare(this.grid,this.oldGrid)){
			this.rollbackBoard(Move, captured, this.grid);
			throw "ReturnToOldStateException";
		}

		this.updateBoard(this.diff.Move, this.diff.captured, this.oldGrid);
		this.diff = {Move: Move, captured: captured};
		return captured;
	}

	isValidMove(Move){
		if (Move.x < 0 || Move.y < 0 || Move.x >= this.grid.length || Move.y >= this.grid[0].length || this.grid[Move.x][Move.y] != 0)
			return false;
		return true;
	}

	gridCopy(grid){
		var newGrid =[];

		for (var i = 0; i < grid.length; i++){
			newGrid.push([]);
			for (var j = 0; j < grid.length; j++){
				newGrid[i].push(grid[i][j]);
			}
		}

		return newGrid;
	}

	gridCompare(grid1, grid2){

		//console.log(grid1,grid2);

		if(grid1 == [] || grid2 == [])
			return false;

		for(var i = 0; i < grid1.length; i++){
			for(var j = 0; j < grid1.length; j++){
				if(grid1[i][j] != grid2[i][j])
					return false;
			}
		}
		return true;
	}

	updateBoard(Move, captured, grid){
		if (Move == null)
			return;
		grid[Move.x][Move.y] = Move.side;
		for (var i = 0; i < captured.length; i++){
			grid[captured[i].x][captured[i].y] = 0;
		}
	}

	rollbackBoard(Move, captured, grid){
		var capside;
		if (Move.side == 1)
			capside = 2;
		else
			capside = 1;

		grid[Move.x][Move.y] = 0;
		for (var i = 0; i < captured.length; i++){
			grid[captured[i].x][captured[i].y] = capside;
		}
	}


	

	toString() {
        var content = this.grid[0].join(' ');
        for(var i = 1; i < this.grid.length; i++)
            content += '\n' + this.grid[i].join(' ');
        return content;
	}
}

class Player{
	
}

class Move{
	constructor(x, y, side){
		this.x = x;
		this.y = y;
		this.side = side;
	}
}