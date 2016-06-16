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
    addNewAccount(obj) {
        console.log("Adding new user to the database...")
        var collection = this._db.collection('accounts');
        collection.insert(obj);
    }
    
}

module.exports = Database;