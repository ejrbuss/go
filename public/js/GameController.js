'use strict'
//==========================================================================================================================//
//       ______                        ______            __             ____         
//      / ____/___ _____ ___  ___     / ____/___  ____  / /__________  / / /__  _____
//     / / __/ __ `/ __ `__ \/ _ \   / /   / __ \/ __ \/ __/ ___/ __ \/ / / _ \/ ___/      
//    / /_/ / /_/ / / / / / /  __/  / /___/ /_/ / / / / /_/ /  / /_/ / / /  __/ /         
//    \____/\__,_/_/ /_/ /_/\___/   \____/\____/_/ /_/\__/_/   \____/_/_/\___/_/     
//                                                                               
//==========================================================================================================================//
// The GameController manages the UI for playing Go, user input, and ai input. 
//==========================================================================================================================//
class GameController { 
    
    /**
     * Starts a new game instance.
     * @param vc          The ViewController to use as the game display
     * @param playerModel The PlayerModel tracking user data for the current player
     * @param size        The board size as the length of one side
     * @param quit        The function run when quitting the game
     * @param callback    The function run when the game ends
     * @param color       The color of the board
     * @param background  The name of the background file
     */
    constructor(vc, playerModel, size, ai, quit, callback=function(){}, stageID=0) {
        log.info('new game started', arguments);

        this.turn = 1;
        this.size = size;
        this.pass = false;
        this.moveList = [];
        this.stageID = stageID;
        this.playerModel = playerModel;
        this.game = new Game(this.id, this.size);
        this.ai = new aiinterface(ai);
       
        this.player1 = {
            name: playerModel.username(),
            image: 'Player1'
        }
        this.player2 = {
            name: this.ai.name,
            image: this.ai.image
        }

        var gc = this;
        
        this.gvc = new GameViewController(vc, stageID, size, quit, this);
        
        this.gvc.update(this.game.Board);
        this.gvc.gameInput(this.game.Board);
        this.gvc.player1turn();
    } 
    
    /**
     * Performs a move on the game.
     * @param x    the x position to play
     * @param y    the y position to play
     * @param pass boolean indicating whether the move is being passed
     */
    move(x, y, pass) {
        log.info('move made', arguments);
        try {
            this.game.move(x, y, pass);
            if ( this.pass && pass ) {
                this.end();
                return;
            } else {
                this.pass = pass;
            }
            // Success
            this.gvc.update();
            this.moveList.push({'x':x,'y':y,'pass':pass});
            if (this.ai.real) {
                this.gvc.player2turn();
                var gc = this;
                this.ai.getMove(this.game, function(move) {
                    log.debug(move);
                    // check error
                    gc.game.move(move.x, move.y, move.pass);
                    if ( gc.pass && move.pass ) {
                        gc.end();
                        return;
                    } else {
                        gc.pass = move.pass;
                    }
                    gc.moveList.push({'x':move.x,'y':move.y,'pass':move.pass});
                    gc.gvc.update();
                    gc.gvc.gameInput();
                    gc.gvc.player1turn();
                });
            } else {
                if (this.turn == 1) {
                    this.gvc.gameInput();
                    this.gvc.player2turn();
                    this.turn = 2;
                } else {
                    this.gvc.gameInput();
                    this.gvc.player1turn();
                    this.turn = 1;
                }
            }
        } catch(err) {
            log.warn('Move error', err, arguments)
            vc.message(err, select1);
        }
    }
    
    /**
     * TODO implement game end
     */
    end() {
        var scores = endGame(this.game);
        //stats for updating user

        var user = {
            'username': this.player1.name,
            'score': scores.player1score,
            'piecestaken': this.game.player1score,
            'pieceslost': this.game.player2score,
            'win': scores.player1score > scores.player2score,
        };

        this.player1.score = scores.player1score;
        this.player2.score = scores.player2score;
        
        if (scores.player1score > scores.player2score) {
            this.gvc.end('YOU WIN', select2, select1);
        } else {
            this.gvc.end('YOU LOSE', select1, select2);
        }
    	
    	console.log(this.moveList);
    	saveGameToDB({
            'stageID': this.stageID,
    		'player1': this.player1.name, 
    		'player2': this.player2.name, 
    		'score1': scores.player1score, 
    		'score2': scores.player2score, 
    		'size': this.size,
    	}, this.moveList, user, function(res){
    		log.info('Game saved to database.', res);
    	});
    }
    
}
//==========================================================================================================================//
// AIINTERFACE
//==========================================================================================================================//
class aiinterface {
    
    constructor(ai) {
        log.debug(ai);
        if ( ai == undefined ) {
            this.name = 'Player 2';
            this.image = 'Player1';
            this.real = false;
        } else {
            this.name = ['AI1', 'AI2', 'AI3', 'AI4', 'AI5'][ai];
            this.image = ai + 1;
            this.real = true;
        }
        
    }
    
    getMove(game, callback) {
        toServer('aiMove', {game: game.copyState(), ai: this.name}, callback);
    }
    
}
//==========================================================================================================================//