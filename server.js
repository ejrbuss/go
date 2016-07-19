var express = require('express');
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());

var database = require("./app/Database");
var db = new database();
db.connect();

var ais = require("./app/ai");


var ai = null;

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
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
            var id = data._id;
            obj = {
                moves: req.body.moves,
                gameid: id,
            }
            db.addMovesList(obj);

            obj = req.body.user;
            console.log(obj);
            db.updateStats(obj);
            res.sendStatus(200);
        }
    });
});

app.post("/addMove", function(req, res) {
	console.log("Storing move...");
	console.log(req.body);
	db.addNewMove(req.body, res);
});

app.post("/aiMove", function(req, res) {
    console.log("Getting ai move...");
    console.log(req.body);
    if(!ai){
        switch(req.body.ai.toUpperCase()){
            case("AI1"):
                ai = new ais.AI1(req.body.Game);
            case("AI2"):
                ai = new ais.AI2(req.body.Game);
            case("AI3"):
                ai = new ais.AI3(req.body.Game);
            case("AI4"):
                ai = new ais.AI4(req.body.Game);
            case("AI5"):
                ai = new ais.AI5(req.body.Game);
        }
    }
    var move = ai.getMove(req.body.Game);

    res.status(200).json(move);
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
    db.updateStats(req.body, res);
});

app.listen(8080, function() {
    console.log('Started!');
});