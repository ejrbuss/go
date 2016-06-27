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

app.post("/move", function(req, res) {
	console.log("Storing move...");
	console.log(req.body);
	db.addNewMove(req.body);
	res.send(null);
});

app.post("/addGame", function(req, res) {
    console.log("Storing New game");
    console.log(req.body);
    var newGame = db.addNewGame(req.body);
    res.send(newGame);

});

app.post("/updateGame", function(req, res) {
    console.log("Updating Game data...");
    console.log(req.body);
    db.updateGame(req.body);
    res.send(null);
});

app.listen(8080, function() {
    console.log('Started!');
});
