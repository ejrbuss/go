//==========================================================================================================================//
//Global Variables                                                                                                    
//==========================================================================================================================//
var vc = new ViewController('.content');
//==========================================================================================================================//
// Login screen functions                                                                                                        
//==========================================================================================================================//
function newAccount(username, password) {
    
    console.log('newAccount called with username: ' + username + ' password: ' + password);
    
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
                data: JSON.stringify({username: username, password: password})
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
    
    this.get_username = function() {
        return player.username;
    }
    
    this.get_highscores = function() {
        
    }
    
    this.get_leaderboard = function() {
        
    }
    
    this.get_menu_stats = function() {
        
    }
    
}
//==========================================================================================================================//
// Launch                                                                                                        
//==========================================================================================================================//
$(document).ready(function() {
    vc.launch();
});