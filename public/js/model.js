"use strict"
/*
The game model
TODO add Token class to help with liberties counting
*/

class Game{
	constructor(id, size, player1, player2){
		this.Board = new Board(size);
		this.Player1 = new Player(player1);
		this.Player2 = new Player(player2);
		this.id = id;
	}

	makeMove(Player){
		this.Board.move(Player.getMove());
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
		if (this.grid[Move.x][Move.y] != 0)
			throw "SpotTakenException";
		this.grid[Move.x][Move.y] = Move.side;
	}

	toString(){
		for (var i = 0; i < this.size; i++){
			console.log(this.grid[i]);
		}
	}
}

class Player{
	constructor(side){
		this.side = side;
	}

	getMove(){
		
	}
}

class Move{
	constructor(x, y, side){
		this.x = x;
		this.y = y;
		this.side = side;
	}
}