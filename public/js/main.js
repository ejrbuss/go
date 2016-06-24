//==========================================================================================================================//
//Global Variables                                                                                                    
//==========================================================================================================================//
var vc = new ViewController('.content');
//==========================================================================================================================//
// Login screen functions                                                                                                        
//==========================================================================================================================//
function newAccount(username, password) {
    
    console.log('newAccount called with username: ' + username + ' password: ' + password);
    
    // Check new account with server
    
    var canCreateAccount = true; 
	
	// used to generate random information for a new user. 
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
	
	
    
    // Handle error messages (account already in use, blank username/password, etc.)
    if(!isValid(password)) {
        console.log("Invalid Password");
        message('Invalid Password');
    } else {
        $.ajax({
            url: 'http://localhost:8080/storeNewAccount', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify({username: username, password: password, highScore: highScore, totalScore: totalScore, gamesWon: gamesWon, gamesLost: gamesLost, currentStreak: currentStreak, longestStreak: longestStreak, piecesWon: piecesWon, piecesLost: piecesLost, totalPlayingTime: totalPlayingTime, storyLevelsCompleted: storyLevelsCompleted})
        }).done(function(player) {
            vc.menu(new PlayerManager(player));
        });
    }
    
    if (!canCreateAccount) {
        vc.message('This user account is already taken');
        return;
    }
}

function login(username, password) {
    
    console.log('login called with username: ' + username + ' password: ' + password);
    
    // Check if valid login
    
    var canLogin = false;
    
    // Handle error messages (wrong password, blank username/password, etc.)
    
    if (!canLogin)  {
        vc.message('Wrong password')
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
    
    this.get_username = function() {
        return player.username;
    }
    
}
//==========================================================================================================================//
// Launch                                                                                                        
//==========================================================================================================================//
$(document).ready(function() {
    vc.launch();
});