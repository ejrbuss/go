"use strict";
var MongoClient = require("mongodb").MongoClient;
var mongodb = require("mongodb");

class Database {
    
    constructor() {
        this._db = null;
    }

    connect () {
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
    
    /*
     *  Adds an object to the database.
     */
    addData(obj) {
        console.log("Adding data to the database...")
        var collection = this._db.collection('accounts');
        collection.insert(obj);
    }
    
    /*
     *  Update's a user's data in the database.
     */
    updateData(username, password) {
        var collection = this._db.collection('accounts');
        collection.update({'username': username}, {'username': username, 'password': password});
    }
    
}

module.exports = Database;