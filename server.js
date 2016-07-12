var express = require('express');
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());

var database = require("./app/Database");
var db = new database();
db.connect();

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Stores username and password in the database.
app.post("/storeNewAccount", function(req, res) {
    console.log("Storing data...");
    console.log(req.body);
    db.addNewAccount(req.body, res);
});

// Checks username against the database.
app.post("/checkDuplicateUsername", function(req, res) {
    console.log("Checking username " + req.body.username);
    db.checkUsername(req.body.username, res);
});

// Checks login info in accounts database.
app.post("/checkLogin", function(req, res) {
    console.log("Checking username " + req.body);
    db.checkLogin(req.body, res);
});

app.post("/addMove", function(req, res) {
	console.log("Storing move...");
	console.log(req.body);
	db.addNewMove(req.body, res);
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

app.listen(8080, function() {
    console.log('Started!');
});
