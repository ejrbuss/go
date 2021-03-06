"use strict";
var MongoClient = require("mongodb").MongoClient;
var mongodb = require("mongodb");
var ObjectID = require("mongodb").ObjectID;

class Database {
    
    constructor() {
        this._db = null;
    }

    connect() {
        var that = this;
        
        MongoClient.connect(
            "mongodb://localhost:27017/project",
            function (err, db) {
                if (err) {
                    console.log("ERROR: Could not connect to database.");
                    that._db = null;
                } else {
                    console.log("INFO: Connected to database.");
                    that._db = db;
                    db.createCollection('accounts', {strict:true}, function(err, collection) {});
                    db.createCollection('games',    {strict:true}, function(err, collection) {});
                    db.createCollection('moves',    {strict:true}, function(err, collection) {});
                }
            }
        );

    }
    
    // Adds a new user to the database.
    addNewAccount(obj, res) {
        console.log("DATABASE: Adding new user to the database...")
        if (this._db == null) res.send(false);
        
        this._db.collection('accounts').insert(obj, function(err, docs) {
            if (err)
                res.send(false);
            else {
                res.send(true);
            }
        });
    }
    
    // Checks a username against the database for duplicates.
    checkUsername(username, res) {
        console.log("DATABASE: checkPassword..." + username);
        if (this._db == null) res.send(null);
        
        this._db.collection('accounts').count({username: username}, function(err, count) {
            if (err) res.send(null);
            if (count == 0) {
                res.send(false);
            } else {
                res.send(true);
            }
        });
    }
    
    // Checks login info.
    checkLogin(obj, res) {
        console.log("DATABASE: checkLogin...");
        if (this._db == null) res.send(null);
        
        this._db.collection('accounts').count({username: obj.username, password: obj.password}, function(err, count) {
            if (err) res.send(null);
            if (count == 0) {
                res.send(false);
            } else {
                res.send(true);
            }
        });
    }
    
    // Returns a player object and their two ranks by username.
    getPlayer(obj, res) {
        console.log("DATABASE: getting player info");
        if (this._db == null) res.send(null);
        
        var db = this._db;
        this._db.collection('accounts').find().sort({totalScore: -1}).toArray(function(err, array) {
            if (err) res.send(null);
            
            // iterate through array and find the index of the username
            // add it as the property 'lrank'
            for (var i = 0; i < array.length; i ++) {
                if (array[i].username == obj.username) {
                    var player = array[i];
                    player.lrank = i + 1;
                }
            }
            
            db.collection('accounts').find().sort({highscore: -1}).toArray(function(err, array) {
                if (err) res.send(null);
                
                // iterate through array and find the index of the username
                // add it as the property 'hrank'
                for (var i = 0; i < array.length; i ++) {
                    if (array[i].username == obj.username) {
                        player.hrank = i + 1;
                        res.send(player);
                    }
                }
            });
        });
    }



    
    // Get leaderboard/highscores.
    getStats(type, username, res) {
        if (this._db == null) res.send(null);
        
        if (type == 'l') {
            this._db.collection('accounts').find().sort({totalScore: -1}).limit(10).toArray(function(err, array) {
                if (err) res.send(null);
                res.send(array);
            });
        } else if (type == 'h') {
            this._db.collection('accounts').find().sort({highscore: -1}).limit(10).toArray(function(err, array) {
                if (err) res.send(null);
                res.send(array);
            });
        } else {
            console.log('DEBUG: send a correct stats type');
            res.send(null);
        }
    }


    updateLevels(obj, res) {
        var username = obj.username;
        var collection = this._db.collection('accounts');

        collection.updateOne({username:username}, {$set: {levels:obj.levels}});
    }

   
    //get move list for replay
    //obj in the form {id:gameID}
    getMoveList(obj, res) {
        //console.log("Getting list of moves...");
        var gameID = new ObjectID(obj.id);
        //var gameID = obj.id;
        console.log("Getting list of moves..." + gameID);
        var collection = this._db.collection('moves');
        collection.findOne({gameid: gameID}, function(err, docs){
            if(err || !docs){
                res.send([]);
            } else {
                console.log(docs);
                res.send(docs.moves);
            }
        }); 
    }
    
    //add new move
    addNewMove(obj, res) {
        console.log("Adding new move to database...");
        var collection = this._db.collection('moves');
        collection.findOne({'_id': gameID}, function(err, docs){
            if(err){
                res.status(500).send(null);
                console.log('get moves failed');
            } else {
                console.log(docs.moves);
                res.status(200).send(docs.moves);
            }
        });
    }

    //save completed game
    saveGame(obj, cb) {
        console.log("Saving new completed game to database...");
        var collection = this._db.collection('games');
        console.log(obj);
        collection.insert(obj, function(err, docs) {
            if(err)
                cb(err,null);
            else
                cb(null,docs.ops[0]);
        });
    }

    addMovesList(obj, res) {
        console.log("Adding move list to db...");
        var collection = this._db.collection('moves');
        collection.insert(obj);
    }
    
    //get games by username
    //obj in the form of {name:username}
    getGames(obj, res){
        var username = obj.name;
        console.log(username);
        var collection = this._db.collection('games');
        collection.find({player1: username}).toArray(function(err, docs){
            if(err){
                res.send(null);
            } else {
                console.log(docs);
                res.send(docs);
            }
        });
    }

    //add new move
    addNewMove(obj, res) {
        console.log("Adding new move to database...");
        var collection = this._db.collection('moves');
        collection.insert(obj, function(err, docs) {
            if(err)
                res.send(null);
            else{
                console.log(docs);
                res.send(docs.ops[0]);
            }
        });
    }

    //add new game (happens at beginning of each game)
    addNewGame(obj, res) {
        console.log("Adding new game to database...");
        var collection = this._db.collection('games');
        collection.insert(obj, function(err, docs) {
            if(err) 
                res.send(null);
            else {
                res.send(docs.ops[0]);
            }    
        });
    }

    //completes the game
    updateGame(obj, res) {
        console.log("Updating game...");

        var id = obj.id;
        var body = {
            'score1':obj.score1,
            'score2':obj.score2,
            'time':Date.now(),
            'complete':true
        };

        var collection = this._db.collection('games');
        collection.updateOne({id:id},body);
        res.send(true);
    }


    //update stats
    updateStats(obj,res) {
        var userName = obj.username;
          var that = this;


        var collection = this._db.collection('accounts');
        collection.findOne({username:userName}, function(err, docs) {
            if(err){
                res.send(null);
            } else {
                console.log("doc found");
                console.log(docs);

                //var userName = obj.username;
                var userName = obj.username;
                var highScore = obj.score;
                var totalScore = obj.score;
                var gamesWon = docs.gamesWon;
                var gamesLost = docs.gamesLost;
                var currentStreak = docs.currentStreak;
                var longestStreak = docs.longestStreak;
                var piecesWon = docs.piecesWon;
                var piecesLost = docs.piecesLost;
                //var storyLevelsComplete = obj.storyLevelsComplete 
           
                /* Testing stuff
                var userName = 'aaa';
                var highScore = 100;
                var totalScore = 100;
                var gamesWon = docs.gamesWon;
                var gamesLost = docs.gamesLost;
                var currentStreak = docs.currentStreak;
                var longestStreak = docs.longestStreak;
                var piecesWon = docs.piecesWon;
                var piecesLost = docs.piecesLost;
                var totalPlayingTime;
                var storyLevelsComplete;
                */

                //high score condition
                console.log(docs.highScore);
                if(docs.highScore > highScore){
                    highScore = docs.highScore;
                }

                // total score condition
                totalScore = totalScore + docs.totalScore;
                console.log('docs' + docs.totalScore);
                console.log('re' + totalScore);

                // games won 
                if(obj.win == true) {
                    gamesWon = gamesWon + 1;
                    currentStreak = currentStreak + 1;
                }
                
                // games lost        
                if(obj.win == false) {
                    gamesLost = gamesLost + 1;
                    currentStreak = 0;
                }

                // currentStreak check    
                if (currentStreak > longestStreak) {
                        longestStreak = currentStreak;
                }
                
                // number of pieces won   
                piecesWon = docs.piecesWon + obj.piecestaken;

                // number of pieces lost
                piecesLost = docs.piecesLost + obj.pieceslost;
                
                console.log('docs' + docs.piecesWon);
                console.log('obj' + obj.piecestaken);
                
                // TODO Implement this!!!  
                //storyLevelsComplete = //Eric's Code; */

                
                var body = { 
                    'highscore':highScore,
                    'totalScore':totalScore,
                    'gamesWon':gamesWon,
                    'gamesLost':gamesLost,
                    'currentStreak':currentStreak,
                    'longestStreak':longestStreak,
                    'piecesWon':piecesWon,
                    'piecesLost':piecesLost,
                };

              
                collection.updateOne({username:userName},{$set:body},function() {
                    console.log(that);
                    that.getPlayer({username:userName},res);

                }

                    );
            }
        });
    }
    
}

module.exports = Database;