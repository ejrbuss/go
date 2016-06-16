//==========================================================================================================================//
//Global Variables                                                                                                    
//==========================================================================================================================//
var vc = new ViewController('.content');
//==========================================================================================================================//
// Login screen functions                                                                                                        
//==========================================================================================================================//
function newAccount(username, password, message) {
    
    console.log('newAccount called with username: ' + username + ' password: ' + password);
    
    // Check new account with server
    
    var canCreateAccount = true; 
    
    // Handle error messages (account already in use, blank username/password, etc.)
    if(!isValid(password)) {
        console.log("Invalid Password");
        message('Invalid Password');
    } else {
        var xmlhr = new XMLHttpRequest();
        var obj = {'username':username, 'password':password};
        xmlhr.open("POST", "/storeNewAccount", true);
        xmlhr.setRequestHeader("content-type", "application/json");
        xmlhr.send(JSON.stringify(obj));
        //$.post('localhost:8080/storeNewAccount', {username: username, password: password}, function(data) {});
    }
    
    if (!canCreateAccount) {
        vc.banner('This user account is already taken');
        return;
    }
    
    // Get new account info 
    
    player = null;
    
    playerManager = new PlayerManager(player);
    
    vc.menu(playerManager);
}

function login(username, password, message) {
    
    console.log('login called with username: ' + username + ' password: ' + password);
    
    // Check if valid login
    
    var canLogin = false;
    
    // Handle error messages (wrong password, blank username/password, etc.)
    
    if (!canLogin)  {
        vc.banner('Wrong password')
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
    
}
//==========================================================================================================================//
// Launch                                                                                                        
//==========================================================================================================================//
$(document).ready(function() {
    vc.launch();
});