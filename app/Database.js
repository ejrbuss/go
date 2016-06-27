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
        console.log("in checkUsername..." + obj);
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
     
    //add new move
    addNewMove(obj) {
        console.log("Adding new move to database...");
        var collection = this._db.collection('moves');
        collection.insert(obj, function(err, docs) {
            console.log(docs);
            res.send(docs);
        });
    }

    //add new game (happens at beginning of each game)
    addNewGame(obj) {
        console.log("Adding new game to database...");
        var collection = this._db.collection('games');
        collection.insert(obj, function(err, docs) {
            console.log(docs);
            res.send(docs);
        });
    }

    //completes the game
    updateGame(obj) {
        console.log("Updating game...");

        var id = obj.id;
        var body = {
            'score1':obj.score1,
            'score2':obj,score2,
            'time':Date.now(),
            'complete':true
        };

        var collection = this._db.collection('games');
        return collection.updateOne({'_id':id},body);
    }
    
}

module.exports = Database;
