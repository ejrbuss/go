//saveGameData.js

function saveMove(move, gameID, callback){
	var xmlhr = new XMLHttpRequest();
	var obj = {
		'gameid':gameID,
		'player':move.c,
		'x':move.x,
		'y':move.y,
		'time':Date.now()
	};

	xmlhr.onreadystatechange = function() {
		if(xmlhr.readyState == 4 && xmlhr.status == 200) {
			//handle response
			callback(xmlhr.responseText);
		}
	};

	xmlhr.open('POST','/addMove',true);
	xmlhr.setRequestHeader("content-type", "application/json");
	xmlhr.send(JSON.stringify(obj));

}

function updateGame(game, callback){
	var xmlhr = new XMLHttpRequest();
	var obj = {
		'id':game.id,
		'score1':game.player1score,
		'score2':game.player2score,
	};

	xmlhr.onreadystatechange = function() {
		if(xmlhr.readyState == 4 && xmlhr.status == 200) {
			//handle response
			callback(xmlhr.responseText);
		}
	};

	xmlhr.open('POST','/updateGame',true);
	xmlhr.setRequestHeader("content-type", "application/json");
	xmlhr.send(JSON.stringify(obj));
}

function saveNewGame(player1, player2, size, callback){
	var xmlhr = new XMLHttpRequest();
	var obj = {
		'player1':player1,
		'player2':player2,
		'score1':0,
		'score2':0,
		'size':size,
		'time':null,
		'complete':false
	};

	xmlhr.onreadystatechange = function() {
		if(xmlhr.readyState == 4 && xmlhr.status == 200) {
			//handle response
			callback(xmlhr.responseText);
		}
	};

	xmlhr.open('POST','/newGame',true);
	xmlhr.setRequestHeader("content-type", "application/json");
	xmlhr.send(JSON.stringify(obj));

}

function getMatchHistory(username, callback){
	var xmlhr = new XMLHttpRequest();
	var obj = {name:username};
	xmlhr.onreadystatechange = function() {
		if(xmlhr.readyState == 4 && xmlhr.status == 200) {
			//handle response
			callback(xmlhr.responseText);
		}
	}

	xmlhr.open('POST', '/getGames', true);
	xmlhr.setRequestHeader("content-type", "application/json");
	xmlhr.send(JSON.stringify(obj));

}

function getMoveList(gameID, callback){
	var xmlhr = new XMLHttpRequest();
	var obj = {id:gameID};

	xmlhr.onreadystatechange = function(){
		if(xmlhr.readyState == 4 && xmlhr.status == 200){
			//handle response
			callback(xmlhr.responseText);
		}
	}

	xmlhr.open('POST','/getMoves', true);
	xmlhr.setRequestHeader("content-type", "application/json");
	xmlhr.send(JSON.stringify(obj));
}

/*
var xmlhr = new XMLHttpRequest();
var obj = {'username':username, 'password':password};
xmlhr.open("POST", "/storeNewAccount", true);
xmlhr.setRequestHeader("content-type", "application/json");
xmlhr.send(JSON.stringify(obj));
//$.post('localhost:8080/storeNewAccount', {username: username, password: password}, function(data) {});
*/