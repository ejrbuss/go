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

app.listen(8080, function() {
    console.log('Started!');
});