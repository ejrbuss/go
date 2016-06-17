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
		if (this.turn == this.player1){
			if (!pass){
				var captured = this.Board.move(new Move(x, y, this.player1));
				this.player1score += captured.length;
			}
			this.turn = this.player2;
		}
		else{
			if (!pass){
				var captured = this.Board.move(new Move(x, y, this.player2));
				this.player2score += captured.length;
			}
			this.turn = this.player1;
		}
		return captured;
	}

	copyState(){

	}
}

class Board{
	constructor(size){
		this.size = size;
		this.grid = [];
		for (var i = 0; i < size; i++){
			this.grid.push([]);
			for (var j = 0; j < size; j++){
				this.grid[i].push(0);
			}
		}
	}

	move(Move){
		if (!this.isValidMove(Move))
			throw "InvalidMoveException";

		this.grid[Move.x][Move.y] = Move.side;

		var captured = isCapture(this, Move);
		for (var i = 0; i < captured.length; i++){
			this.grid[captured[i].x][captured[i].y] = 0;
		}

		return captured;
	}

	isValidMove(Move){
		if (this.grid[Move.x][Move.y] != 0)
			return false;

		this.grid[Move.x][Move.y] = Move.side;
		if (isSuicide(this, Move)){
			this.grid[Move.x][Move.y] = 0;
			return false;
		}
		return true;
	}

	toString(){
		for (var i = 0; i < this.size; i++){
			console.log(this.grid[i]);
		}
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