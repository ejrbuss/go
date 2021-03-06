/*
* Saves a completed game to the database.
* @param game the completed game object
* @param moves the list of moves played during the game
* @param user player 1's player object
*/
function saveGameToDB(game, moves, user, callback){
	toServer('saveGame', {game:game, moves: moves, user:user}, callback);
}

/*
* Gets all matches played by user.
* @param game the completed game object
* @param moves the list of moves played during the game
* @param user player 1's player object
*/

function getMatchHistory(username, callback){
	toServer('getGames', {name:username}, callback);
}

/*
* Gets the move list for a given game ID.
* @param gameID the completed game identification number in the database
*/

function getMoveList(gameID, callback){
	toServer('getMoves', {id:gameID}, callback);
}

function toServer(url, data, cb) {
    if (dummyServer) {
        dummyServer(url, data, cb);
    } else {
        $.ajax({
            url: 'http://localhost:8080/' + url, 
            type: 'POST', 
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).done(cb);
    }
}
