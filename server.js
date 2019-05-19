"use strict"

var express    = require("express");
var bodyParser = require("body-parser");
var sha1       = require("sha1");
var Game       = require('./app/model')
var database   = require("./app/Database");
var ais        = require("./app/ai");

/**
 * TODO someone needs to delete games (ais) once games finish
 */

var games = {};
var gameIDcounter = 0;

var app = express();
app.use(bodyParser.json());

var db = new database();
db.connect();

// app.use(express.static('public'));
app.use(express.static('docs'));


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Get game id
app.post('/getGameID', function(req, res) {
    gameIDcounter++
    res.send(gameIDcounter.toString());
});

// Hashes a string.
app.post("/hash", function(req, res) {
    console.log("SERVER: Hashing password " + req.body.password);
    res.send(sha1(req.body.password));
});

// Stores username and password in the database.
app.post("/storeNewAccount", function(req, res) {
    console.log("SERVER: Storing data...");
    console.log(req.body);
    db.addNewAccount(req.body, res);
});

// Checks username against the database.
app.post("/checkDuplicateUsername", function(req, res) {
    console.log("SERVER: Checking username " + req.body.username);
    db.checkUsername(req.body.username, res);
});

// Checks login info in accounts database.
app.post("/checkLogin", function(req, res) {
    console.log("SERVER: Checking login info");
    console.log(req.body);
    db.checkLogin(req.body, res);
});

// Gets a player object with ranks.
app.post("/getPlayer", function(req, res) {
    console.log("SERVER: Retrieving player");
    db.getPlayer(req.body, res);
});

// Get leaderboard or high scores board.
app.post("/getStats", function(req, res) {
    var type = req.body.type;
    console.log(req.body);
    if (type == 'l') {
        console.log("SERVER: Getting leaderboard");
    } else if (type == 'h') {
        console.log("SERVER: Getting high scores");
    } else console.log('incorrect type');
    db.getStats(type, req.body, res);
});

app.post("/saveGame", function(req, res) {
    console.log("Saving game...");
    console.log(req.body);
    var obj = req.body.game;
    obj.time = Date.now();

    db.saveGame(obj, function(err, data) {
        if(err)
            res.status(500).send();
        else {
            //get id for move list
            var id = data._id;
            //delete ai from dictionary
            delete games[data.gameid];
            //prep movelist
            obj = {
                moves: req.body.moves,
                gameid: id,
            }
            db.addMovesList(obj);
            //prep user
            obj = req.body.user;
            //console.log(obj);
            db.updateStats(obj,res); 

            		
            //res.sendStatus(200);
        }
    });
});

app.post("/addMove", function(req, res) {
	console.log("Storing move...");
	console.log(req.body);
	db.addNewMove(req.body, res);
});

app.post("/aiMove", function(req, res) {
    console.log("Getting " + req.body.ai + ' moves for game ' + req.body.game.id);
    var game = new Game(req.body.game.id, req.body.game.size);
    game.resetState(req.body.game);
    try {
        if (!games[game.id] ) {
            switch(req.body.ai) {
                case('AI1'):
                    games[game.id] = new ais.AI1(game);
                    break;
                case('AI2'):
                    games[game.id] = new ais.AI2(game);
                    break;
                case('AI3'):
                    games[game.id] = new ais.AI3(game);
                    break;
                case('AI4'):
                    games[game.id] = new ais.AI4(game);
                    break;
                default:
                    games[game.id] = new ais.AI5(game);
                    break;
            }
        }
        var move;
        if(req.body.ai == 'AI4'){
            games[game.id].getMove(game, function(newmove){
                console.log(newmove);
                res.send(newmove);
            });
        } else {
            move = games[game.id].getMove(game);
        }
        
    } catch(err) {
        console.log(err);
        move = err;
    }

    if(req.body.ai != 'AI4'){
        console.log(move);
        res.send(move);
    }
});

app.post("/newGame", function(req, res) {
    console.log("Storing New game");
    console.log(req.body);
    db.addNewGame(req.body, res);
});

app.post("/updateGame", function(req, res) {
    console.log("Updating Game data...");
    console.log(req.body);
    db.updateGame(req.body, res);
});

app.post("/getGames", function(req, res) {
    console.log("Getting match history...");
    console.log(req.body);
    db.getGames(req.body, res);
});

app.post("/getMoves", function(req, res) {
    console.log("Getting match history...");
    console.log(req.body);
    db.getMoveList(req.body, res);
});

// updating stats in accounts
app.post("/updateStats", function(req, res) {
    console.log("updating Stats");
    console.log(req.body);
    db.updateStats(req.body);
});

app.post("/updateLevels", function(req, res) {
    console.log("Updating levels...");
    console.log(req.body);
    db.updateLevels(req.body);
});

app.listen(8080, function() {
    console.log('Started!');
});


//==========================================================================================================================//
//call every 10 minutes
setInterval(cleanDictionary, 600000);

function cleanDictionary(){
    var now = Date.now();
    //deletes any ai's that havent made a move in 10 minutes
    for(var key in games){
        if(games[key].timeLastMove < now - 600000){
            delete games[key];
        }
    }
}

//==========================================================================================================================//
var DEBUG = 4
var INFO  = 3
var WARN  = 2
var NONE  = 1

class Logger {
    
    /**
     * Creates a new logger instance.
     * @level the maximum level of logs to show
     */
    constructor(level) {
        this.debug = level >= DEBUG ? this.log('DEBUG', '#0000FF') : function() {};
        this.info  = level >= INFO  ? this.log('INFO',  '#00C864') : function() {};
        this.warn  = level >= WARN  ? this.log('WARN',  '#C80164') : function() {};
    }
    
    /**
     * Returns a function that will properly format the output of the given logging level.
     * @param level the logging level
     * @param color the color of the logging level
     */
    log(level, color) {
        return function() {
            var time = new Date().toLocaleTimeString();
            var caller = new Error().stack.split('\n')[2].trim()
            console.log(level + ' : ' + time + ' ' + caller);
            for(var i = 0; i < arguments.length; i++)x
                console.log(arguments[i]);
        }
    }
    
}

global.log = new Logger(DEBUG); // logger instance to use