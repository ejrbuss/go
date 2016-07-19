'use strict'

class PlayerModel extends PropertyExpander {
    
    constructor(player) {
        super();
        
        if (player == 'debug') {
            player = {
                username:            'debug',
                highscore:            Math.randomInt(1000),
                totalScore:           Math.randomInt(5000),
                gamesWon:             Math.randomInt(100),
                gamesLost:            Math.randomInt(100),
                currentStreak:        Math.randomInt(10),
                longestStreak:        Math.randomInt(10),
                piecesWon:            Math.randomInt(100),
                piecesLost:           Math.randomInt(100),
                playtime:             Math.randomInt(100),
                levels:               4,
                lrank:                Math.randomInt(1000),
                hrank:                Math.randomInt(1000)
            }
        }
        
        this.property = player;
        
        super.expand();
    }
    
    username() {
        return this.username;
    }
    
    winLoss() {
        return ( this.gamesWon() / this.gamesLost() ).toFixed(2);
    }
    
    killDeath() {
        return ( this.piecesWon() / this.piecesLost() ).toFixed(2);
    }
    
    progress() {
        return this.levels() + ' / 5';
    }
    
    stats(type, cb) {
        toServer('getStats', {
            type: type, 
            username: this.username()
        }, function(leaderboard) {
            cb(leaderboard);
        });
    }
    
}

/*
 *  Creates a new entry in the 'accounts' database.
 */
function newAccount(username, password) {
    
    //log.info('newAccount called with username: ' + username + ' password: ' + password);
	
	// used to generate random information for a new user into the database. 
	var highscore = Math.floor((Math.random() * 1000) +1);
	var totalScore = Math.floor((Math.random() * 5000) +1);
	var gamesWon = Math.floor((Math.random() * 100) +1);
	var gamesLost = Math.floor((Math.random() * 100) +1);
	var currentStreak = Math.floor((Math.random() * 10) +1);
	var longestStreak = Math.floor((Math.random() * 10) +1);
	var piecesWon = Math.floor((Math.random() * 100) +1);
	var piecesLost = Math.floor((Math.random() * 100) +1);
	var playtime = Math.floor((Math.random() * 100) +1);
	var levels = Math.floor((Math.random() * 5) +1);
    
    // Check for blank username/password.
    if (username == '') {
        //log.info("Please enter a username");
        vc.message('please enter a username');
        return
    }
    if (password == '') {
        //log.info("Please enter a password");
        vc.message('please enter a password');
        return
    }
    
    // Check for duplicate username.
    toServer('checkDuplicateUsername', {username: username}, function(isduplicate) {
        if(isduplicate) {
            //log.info("Username already taken.");
            vc.message('username already taken');
        } else if (!isValid(password)) {
            //log.info("Invalid Password");
            vc.message('Invalid Password');
        } else {
            log.info('Creating account...')
            // Add the user to the database.
            toServer('storeNewAccount', {
                username: username, 
                password: password, 
                highscore: highscore, 
                totalScore: totalScore, 
                gamesWon: gamesWon, 
                gamesLost: gamesLost, 
                currentStreak: currentStreak, 
                longestStreak: longestStreak, 
                piecesWon: piecesWon, 
                piecesLost: piecesLost, 
                playtime: playtime, 
                levels: levels
            }, function(success) {
                if (success) {
                    toServer('getPlayer', {username: username}, function(player) {
                        // this player will also have the two ranks.
                        vc.mainMenu(new PlayerModel(player));
                    });                    
                } else {
                    log.info('Could not add new user to database. Loading as debug.');
                    vc.mainMenu(new PlayerModel('debug'));
                }
            });
        }
    });
}

/*
 * Checks player login info.
 */
function login(username, password) {
    toServer('checkLogin', {username: username, password: password}, function(isCorrect) {
        if (!isCorrect) {
            vc.message('wrong username/password');
        } else {
            toServer('getPlayer', {username: username}, function(player) {
                // this player will also have the two ranks.
                vc.mainMenu(new PlayerModel(player));
            });
        }
    });
}

/*
 *  Checks for invalid characters in the user's password.
 *  Allows the following characters: A-Za-z0-9_
 */
function isValid(password) {
    var pattern = /\W/;
    var result = pattern.test(password);
    return !result;
}

/*
 *  Utility function for making a request to the server.
 */
function toServer(url, data, cb) {
    $.ajax({
        url: 'http://localhost:8080/' + url, 
        type: 'POST', 
        contentType: 'application/json',
        data: JSON.stringify(data)
    }).done(cb);
}