'use strict'

class PlayerModel extends PropertyExpander {
    
    constructor(player) {
        super();
        
        debug.pm = this;
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
        if (this.gamesLost() == 0) return this.gamesWon();
        else return ( this.gamesWon() / this.gamesLost() ).toFixed(2);
    }
    
    killDeath() {
        if (this.piecesLost() == 0) return this.piecesWon();
        else return ( this.piecesWon() / this.piecesLost() ).toFixed(2);
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
    
    // Check for blank username/password.
    if (username == '') {
        vc.message('please enter a username');
        return
    }
    if (password == '') {
        vc.message('please enter a password');
        return
    }
    
    // Check for duplicate username.
    toServer('checkDuplicateUsername', {username: username}, function(isduplicate) {
        if (isduplicate === '') {
            log.info('Could not check username with database. Loading as debug.');
            vc.mainMenu(new PlayerModel('debug'));
        } else if(isduplicate) {
            vc.message('username already taken');
        } else if(!isValidUsername(username)) {
            vc.message('max 8 char username')
        } else if (!isValid(password)) {
            vc.message('invalid password');
        } else {
            log.info('Creating account...')
            // Add the user to the database.
            toServer('hash', {password: password}, function(password) {
                toServer('storeNewAccount', {
                    username: username, 
                    password: password, 
                    highscore: 0, 
                    totalScore: 0, 
                    gamesWon: 0, 
                    gamesLost: 0, 
                    currentStreak: 0, 
                    longestStreak: 0, 
                    piecesWon: 0, 
                    piecesLost: 0, 
                    playtime: 0, 
                    levels: 0
                }, function(success) {
                    if (success) {
                        // Retrieve player info.
                        toServer('getPlayer', {username: username}, function(player) {
                            vc.mainMenu(new PlayerModel(player));
                        });                    
                    } else {
                        log.info('Could not add new user to database. Loading as debug.');
                        vc.mainMenu(new PlayerModel('debug'));
                    }
                });
            });
        }
    });
}

/*
 * Checks player login info.
 */
function login(username, password) {
    // Check if valid login.
    toServer('hash', {password: password}, function(password) {
        toServer('checkLogin', {username: username, password: password}, function(isCorrect) {
            if (isCorrect === '') {
                log.info('Could not check login info with database. Loading as debug.');
                vc.mainMenu(new PlayerModel('debug'));
            } else if (isCorrect == false) {
                vc.message('wrong username/password');
            } else {
                // Retrieve player info.
                toServer('getPlayer', {username: username}, function(player) {
                    vc.mainMenu(new PlayerModel(player));
                });
            }
        });
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
 *  Check for invalid username (over 8 characters).
 */
function isValidUsername(username) {
    if (username.length > 8) return false;
    else return true;
}

/*
 *  Utility function for making a request to the server.
 */
function toServer(url, data, cb=function(){}) {
    $.ajax({
        url: 'http://localhost:8080/' + url, 
        type: 'POST', 
        contentType: 'application/json',
        data: JSON.stringify(data)
    }).done(cb);
}