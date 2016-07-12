"use strict";
var MongoClient = require("mongodb").MongoClient;
var mongodb = require("mongodb");

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
                    db.createCollection('games', {strict:true}, function(err, collection) {});
                    db.createCollection('moves', {strict:true}, function(err, collection) {});
                }

            }
        );

    }
    
    // Adds a new user to the database.
    addNewAccount(obj, res) {
        console.log("Adding new user to the database...")
        this._db.collection('accounts').insert(obj, function(err, docs) {
            res.send(docs.ops[0])
        });
    }
    
    // Checks a username against the database for duplicates.
    checkUsername(obj, res) {
        console.log("in checkPassword..." + obj);
        this._db.collection('accounts').count({username: obj}).then(function(count) {
            if (count == 0) {
                console.log('fine');
                res.send(false);
            } else {
                console.log('duplicate');
                res.send(true);
            }
        });
    }
    
    // Checks login info.
    checkLogin(obj, res) {
        console.log("in checkUsername..." + obj);
        this._db.collection('accounts').count({username: obj.username, password: obj.password}).then(function(count) {
            if (count == 0) {
                res.send(false);
            } else {
                res.send(true);
            }
        });
    }
   

    //get move list for replay
    //obj in the form {id:gameID}
    getMoveList(obj, res) {
        var gameID = obj.id;
        console.log("Getting list of moves...");
        var collection = this._db.collection('moves');
        collection.find({gameid:gameID}, function(err, docs){
            if(err){
                res.send(null);
            } else {
                res.send(docs.moves);
            }
        });
        /*.toArray(function(err, docs){
            if(err)
                res.send(null);
            else {
                console.log(docs);
                res.send(docs);
            }
        })*/
    }

    //save completed game
    saveGame(obj, callback) {
        console.log("Saving new completed game to database...");
        var collection = this._db.collection('games');

        var body = obj.game;
        body.time = Date.now();

        collection.insert(body, function(err, docs) {
                if(err)
                    callback(err, null);
                else
                    callback(null, docs.ops[0]);
        });
    }

    addMovesList(obj, res) {
        console.log("Adding move list to db...");
        var collection = this._db.collection('games');
        collection.insert(obj, function(err, docs) {
            if(err)
                res.send(null);
            else {
                res.send(docs.ops[0]);
            }
        });
    }
    //get games by username
    //obj in the form of {name:username}
    getGames(obj, res){
        var username = obj.name;
        console.log(username);
        var collection = this._db.collection('games');
        collection.find({$or: [{player1: username}, {player2: username}]}).toArray(function(err, docs){
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


    
}

module.exports = Database;
