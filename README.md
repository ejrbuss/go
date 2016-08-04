```
indi __________ 
    / ____/ __ \
   / / __/ / / /
  / /_/ / /_/ / 
  \____/\____/  
```
indiGO is a web application implementation of the traditional Chinese game Go.
It includes a number of features including a story mode, seperate ai opponents,
game replays, and user accounts. 

## Dependencies

To run indiGO you must have [node.js](https://nodejs.org/en/) and 
[mongoDB](https://www.mongodb.com/) installed on your machine.

The game itself is only tested in Chrome and Firefox.

## Running

To run indiGO either clone the project or download the zip into a local directory.
```bash
$ git clone https://github.com/balancededge/go299
```
Prior to running the server you must first start the mongo database, this can
be done using the shell command
```bash
$ mongod
```
This may require you navigate to the mongodb bin folder if you have not included
the mongo binaries in your PATH. 

Once mongo is running the server can be started with either
```bash
$ node server.js
```
or
```
$ npm start
```
from the root go299 direcrtory. The application will now be accessible from 
the url `http://localhost:8080`.

## Credit

This is a currently unlicensed project created by Tal Melamed, Cole Macdonald,
Eric Buss, Torrey Randolph, Trevor Lee, and Tyler Fisher for the Unvieristy of 
Victoria's Software Enginereering 299: Software Architecture course. 

This project was created using 
[Node.js](https://nodejs.org/en/), 
[mongoDB](https://www.mongodb.com/), 
[expressjs](https://expressjs.com/), 
[jQuery](https://jquery.com/), 
[typed.js](https://github.com/mattboldt/typed.js/), 
and visual resources from [jewelsavior](http://www.jewel-s.jp/download/). 

This project is currently unsupported.
