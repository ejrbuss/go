function dummyServer(url, data, cb) {
    log.info('DUMMY SERVER: ' + url);
    var fn = dummyServer[url];
    fn(data, cb);
}

dummyServer.games = {};

function cleanDictionary(){
    var now = Date.now();
    //deletes any ai's that havent made a move in 5 minutes
    for (var key in dummyServer.games){
        if(dummyServer.games[key].timeLastMove < now - 300000){
            delete dummyServer.games[key];
        }
    }
}

setInterval(cleanDictionary, 300000);



dummyServer.checkDuplicateUsername = function(data, cb) {
    dummyServer.db.checkUsername(data.username, cb);
};

dummyServer.hash = function(data, cb) {
    return cb(sha1(data.password));
};

dummyServer.storeNewAccount = function(data, cb) {
    dummyServer.db.addNewAccount(data, cb);
};

dummyServer.getPlayer = function(data, cb) {
    dummyServer.db.getPlayer(data, cb);
};

dummyServer.checkLogin = function(data, cb) {
    dummyServer.db.checkLogin(data, cb);
};

dummyServer.getGameID = function(data, cb) {
    dummyServer.db.getNextGameId(cb);
};

dummyServer.getStats = function(data, cb) {
    var type = data.type;
    dummyServer.db.getStats(type, cb);
};

dummyServer.aiMove = function(data, cb) {
    log.info('Getting ' + data.ai + ' moves for game ' + data.game.id);
    var game = new Game(data.id, data.game.size);
    game.resetState(data.game);
    try {
        if (!dummyServer.games[game.id] ) {
            switch(data.ai) {
                case('AI1'):
                    dummyServer.games[game.id] = new ais.AI1(game);
                    break;
                case('AI2'):
                    dummyServer.games[game.id] = new ais.AI2(game);
                    break;
                case('AI3'):
                    dummyServer.games[game.id] = new ais.AI3(game);
                    break;
                case('AI4'):
                    dummyServer.games[game.id] = new ais.AI4(game);
                    break;
                default:
                    dummyServer.games[game.id] = new ais.AI4(game);
                    break;
            }
        }
        cb(dummyServer.games[game.id].getMove(game));
    } catch (err) {
        cb(err);
    }
};

dummyServer.saveGame = function(req, cb) {
    log.info('Saving game...');
    var obj = req.game;
    obj.time = Date.now();

    dummyServer.db.saveGame(obj, function(err, data) {
        if(err) {
            cb(null);
        } else {
            //get id for move list
            var id = data._id;
            //delete ai from dictionary
            delete dummyServer.games[data.gameid];
            //prep movelist
            obj = {
                moves: req.moves,
                gameid: id,
            }
            dummyServer.db.addMovesList(obj);
            obj = req.user;
            dummyServer.db.updateStats(obj, cb); 
        }
    });
};

dummyServer.getGames = function(data, cb) {
    dummyServer.db.getGames(data, cb);
};

dummyServer.updateLevels = function(data, cb) {
    dummyServer.db.updateLevels(data);
};

dummyServer.getMoves = function(data, cb) {
    dummyServer.db.getMoveList(data, cb);
};

dummyServer.init = function() {

    class Database {
        
        constructor() {
            this._db       = new StorageDB({
                primaryKey: '_id',
            });
            this._accounts = this._db.get('accounts');
            this._games    = this._db.get('games');
            this._moves    = this._db.get('moves');
        }
        
        // Adds a new user to the database.
        addNewAccount(obj, cb) {
            log.info('DATABASE: Adding new user to the database...');
            this._accounts.insert(obj);
            cb(true);
        }
        
        // Checks a username against the database for duplicates.
        checkUsername(username, cb) {
            log.info('DATABASE: checkPassword...' + username);
            cb(this._accounts.find({ username: username }).length > 0);
        }
        
        // Checks login info.
        checkLogin(obj, cb) {
            log.info('DATABASE: checkLogin...');
            cb(this._accounts.find({ username: obj.username, password: obj.password }).length > 0);
        }
        
        // Returns a player object and their two ranks by username.
        getPlayer(obj, cb) {
            log.info('DATABASE: getting player info');
            var player;
            var array;

            array = this._accounts.find().sort((a, b) => a.totalScore - b.totalScore);
            for (var i = 0; i < array.length; i++) {
                if (array[i].username == obj.username) {
                    player = array[i];
                    player.lrank = i + 1;
                }
            }

            array = this._accounts.find().sort((a, b) => a.highScore - b.highScore);
            for (var i = 0; i < array.length; i++) {
                if (array[i].username == obj.username) {
                    player.hrank = i + 1;
                    break;
                }
            }
            cb(player);
        }

        // Get leaderboard/highscores.
        getStats(type, cb) {
            log.info('DATABASE: getting leadboard/highscore info');
            if (type == 'l') {
                cb(this._accounts.find().sort((a, b) => a.totalScore - b.totalScore));
            } else if (type == 'h') {
                cb(this._accounts.find().sort((a, b) => a.totalScore - b.totalScore));
            } else {
                log.warn('DATABASE: send a correct stats type');
            }
        }

        updateLevels(obj) {
            log.info('DATABASE: updating player levels');
            console.log(obj);
            this._accounts.update({ username: obj.username }, { levels: obj.levels });
        }
    
        //get move list for replay
        //obj in the form {id:gameID}
        getMoveList(obj, cb) {
            log.info('Getting list of moves...' + obj.id);
            var doc = this._moves.findOne({ gameid: obj.id });
            if (doc) {
                cb(doc.moves);
            } else {
                cb([]);
            }
        }

        //save completed game
        saveGame(obj, cb) {
            log.info('DATABASE: saving new completed game to database...');
            cb(null, this._games.insert(obj));
        }

        addMovesList(obj) {
            log.info("DATABASE: adding move list to db...");
            this._moves.insert(obj);
        }
        
        //get games by username
        //obj in the form of {name:username}
        getGames(obj, cb) {
            var games = this._games.find({ player1: obj.name });
            log.info('DATABASE: get games for user ' + obj.name, games);
            cb(games);
        }

        //add new move
        addNewMove(obj, cb) {
            log.info('DATABASE: adding new moves');
            cb(this._moves.insert(obj));
        }

        //add new game (happens at beginning of each game)
        addNewGame(obj, cb) {
            log.info('DATABASE: adding new game to database...');
            cb(this._games.insert(obj));
        }

        //completes the game
        updateGame(obj, res) {
            log.info('DATABASE: updating game...');

            var body = {
                'score1':obj.score1,
                'score2':obj.score2,
                'time':Date.now(),
                'complete':true
            };
            this._games.update({ id: obj.id }, body);
            cb(true);
        }


        //update stats
        updateStats(obj, cb) {
            log.info('Updating user stats');
            var user = this._accounts.findOne({ username: obj.username });
            if (user) {
                log.info('user found');
                log.info(user);

                user.totalScore += obj.score;
                user.piecesWon  += obj.piecestaken;
                user.piecesLost += obj.pieceslost;

                if (user.highScore < obj.score) {
                    user.highScore = obj.score;
                }
                if (obj.win) {
                    user.gamesWon++;
                    user.currentStreak++;
                }
                if (!obj.win) {
                    user.gamesLost--;
                    user.currentStreak = 0;
                }
                if (user.currentStreak > user.longestStreak) {
                    user.longestStreak = user.currentStreak;
                }

                this._accounts.update({ username: obj.username }, user);

                this.getPlayer(obj, cb);
            }
        }

        getNextGameId(cb) {
            cb(this._games.find().length);
        }

    }

    dummyServer.db = new Database();
};