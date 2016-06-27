//==========================================================================================================================//
//Global Variables                                                                                                    
//==========================================================================================================================//
var vc = new ViewController('.content');
//==========================================================================================================================//
// Login screen functions                                                                                                        
//==========================================================================================================================//
function newAccount(username, password) {
    
    console.log('newAccount called with username: ' + username + ' password: ' + password);
	
	// used to generate random information for a new user into the database. 
	var highScore = Math.floor((Math.random() * 1000) +1);
	var totalScore = Math.floor((Math.random() * 5000) +1);
	var gamesWon = Math.floor((Math.random() * 100) +1);
	var gamesLost = Math.floor((Math.random() * 100) +1);
	var currentStreak = Math.floor((Math.random() * 10) +1);
	var longestStreak = Math.floor((Math.random() * 10) +1);
	var piecesWon = Math.floor((Math.random() * 100) +1);
	var piecesLost = Math.floor((Math.random() * 100) +1);
	var totalPlayingTime = Math.floor((Math.random() * 100) +1);
	var storyLevelsCompleted = Math.floor((Math.random() * 5) +1);
	
    
    // Check for blank username or password.
    if (username == '') {
        console.log("Please enter a username");
        vc.message('please enter a username');
        return
    }
    if (password == '') {
        console.log("Please enter a password");
        vc.message('please enter a password');
        return
    }
    
    // Check for duplicate username.
    $.ajax({
        url: 'http://localhost:8080/checkDuplicateUsername', 
        type: 'POST', 
        contentType: 'application/json', 
        data: JSON.stringify({username: username})
    }).done(function(isduplicate) {
        if(isduplicate) {
            console.log("Username already taken.");
            vc.message('username already taken');
        } else if (!isValid(password)) {
            console.log("Invalid Password");
            vc.message('Invalid Password');
        } else {
            // Add the user to the database.
            $.ajax({
                url: 'http://localhost:8080/storeNewAccount', 
                type: 'POST', 
                contentType: 'application/json', 
                data: JSON.stringify({username: username, password: password, highScore: highScore, totalScore: totalScore, gamesWon: gamesWon, gamesLost: gamesLost, currentStreak: currentStreak, longestStreak: longestStreak, piecesWon: piecesWon, piecesLost: piecesLost, totalPlayingTime: totalPlayingTime, storyLevelsCompleted: storyLevelsCompleted})
            }).done(function(player) {
                vc.menu(new PlayerManager(player));
            });
        }
    });
    
}

function login(username, password) {
    
    console.log('login called with username: ' + username + ' password: ' + password);
    
    // Check if valid login
    
    var canLogin = false;
    
    // Handle error messages (wrong password, blank username/password, etc.)
    
    if (!canLogin)  {
        vc.message('Wrong password');
        return;
    }
        
    // Get account info
        
    player = null;
    
    playerManager = new PlayerManager(player);
    
    vc.menu(playerManager);
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


//==========================================================================================================================//
// Story Manager                                                                                                        
//==========================================================================================================================//
function StoryManager(level) {
    
}      
//==========================================================================================================================//
// Game Manager                                                                                                        
//==========================================================================================================================//
//function GameManager(ai, stage, size, gvc) {
//    
//}
//==========================================================================================================================//
// ReplayManager                                                                                                        
//==========================================================================================================================//
function ReplayManager(game, gvc) {
    
    // Hook GameViewController replay settings
    
    gvc.playPause = function() {
        
    }
    
    gvc.fastForward = function() {
        
    }
    
    gvc.rewind = function() {
        
    }
    
    gvc.nextMove = function() {
        
    }
    
    gvc.previousMove = function() {
        
    }
    
}
//==========================================================================================================================//
// ProfileHelper                                                                                                       
//==========================================================================================================================//
function PlayerManager(player) {
    
    // returns the username of the logged in player    
	this.get_username = function() {
		return player.username;	
    }
    
    this.get_highscores = function() {
        
    }
    
    this.get_leaderboard = function() {
        
    }
    
    this.get_menu_stats = function() {
        
    }
	
    // returns the highscore of the logged in player
	this.get_highscore = function() {
        return player.highScore;
    }

    // returns the totalscore of the logged in player
	this.get_totalscore = function() {
        return player.totalScore;
    }
	
    // returns the games won of the logged in player
	this.get_gameswon = function() {
        return player.gamesWon;
    }

    // returns the games lost of the logged in player
	this.get_gameslost = function() {
        return player.gamesLost;
    }

    // returns the current steak of the logged in player
	this.get_currentstreak = function() {
        return player.currentStreak;
    }

    // returns the longest steak of the logged in player
	this.get_longeststreak = function() {
        return player.longestStreak;
    }

    // returns the total number of pieces won of the logged in player
	this.get_pieceswon = function() {
        return player.piecesWon;
    }
	
    // returns the total number of pieces lost of the logged in player
	this.get_pieceslost = function() {
        return player.piecesLost;
    }
	
	// returns the total playing time of the logged in player
	this.get_totalplayingtime = function() {
        return player.totalPlayingTime;
    }
	
	// returns the number of storyLevelsCompleted
	this.get_storylevelscompleted = function() {
        return player.storyLevelsCompleted;
    }
	
	// returns the k/d (pieces won / pieces lost )
	this.get_kd = function() {
        return (player.piecesWon / player.piecesLost);
    }
	
}
//==========================================================================================================================//
// Launch                                                                                                        
//==========================================================================================================================//
$(document).ready(function() {
    vc.launch();
});