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
    
}

module.exports = Database;