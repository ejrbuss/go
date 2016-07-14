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
    constructor(vc, playerModel, size, ai, quit, callback, color=accent, background='0') {
        log.info('new game started', arguments);
        this.vc = vc;
        this.size = size;
        this.moveList = [];
        this.side = (40 / size) - (5 / this.size); // Make tokens less than the distance between two lines
        this.turn = 1;
        this.game = new Game(this.id, this.size);
        this.ai = assembleAI(ai, this.game);
        this.pass = false;
        this.playerModel = playerModel;

        var gc = this;
        // Actions
        var quit = ComponentFactory.ClickAction(quit);
        var pass = ComponentFactory.ClickAction(function() { gc.move(0, 0, true); });
        // Vectors
        vc.add( ComponentFactory.Background(background) );
        vc.add( ComponentFactory.Vector().poly([0,25, 10,0, 0,0], background1).addClass('slide-right') );
        vc.add( ComponentFactory.Vector()
                 .poly([35,0,  75,0,  65,50, 25,50], background1)
                 .poly([3,41,  4,46,  20,45, 23,41], background1)
                 .poly([97,41, 96,46, 80,45, 77,41], background1)
                 .z(2).addClass('slide-up') 
        );
        // Board   
        vc.add( ComponentFactory.Vector().addClass('slide-down').z(3) );
        var offset = this.side / 2 + 2.5 / this.size;
        for(var y = 0; y < this.size - 1; y++) 
            for(var x = 0; x < size - 1; x++) {
                var x1 = this.getX(x) + offset;
                var x2 = x1 + this.side + 2.5 / this.size;
                var y1 = this.getY(y) + offset;
                var y2 = y1 + this.side + 2.5 / this.size;
                vc.last.poly([x1, y2, x1, y1, x2, y1, x2, y2], color);
            }
        // Text
        vc.add( ComponentFactory.Text(playerModel.username()).xy(5, 41.5).addClass('slide-up') );
        this.player1 = vc.last;
        vc.add( ComponentFactory.Text(this.ai ? this.ai.name : 'PLAYER 2').xy(81, 41.5).addClass('slide-up') );
        this.player2 = vc.last;
        // Images
        vc.add( ComponentFactory.Character('player1').xyz(3, 15, 2).width(21).height(28).addClass('slide-up') )
        if (!ai)
            vc.add( ComponentFactory.Character('player2').xyz(76, 15, 2).width(21).height(28).addClass('slide-up') )
        // else 
        //    vc.add( ComponentFactory.Resource('rsc/characters/' + this.ai.name + '.png').xyz(3, 15, 2).width(21).height(28).addClass('slide-up') )
        // Buttons
        vc.add( ComponentFactory.TitleButton('QUIT').xy(3, 5).addClass('slide-right').addAction(quit) );
        vc.add( ComponentFactory.TitleButton('PASS', background2, select2).xy(62, 45).addClass('slide-right').addAction(pass) );
        // Render
        vc.clear();
        vc.update();
        // Update
        vc.message(playerModel.username() + ' START', select1, function() { // Run update after start message is shown
            gc.update();
        });
        this.player1.$.css({'color' : select2});
    } 
    
    /**
     * Returns the actual x position of a token.
     * @param x the x coordinate on the board grid
     */
    getX(x) {
        return 30 + ( x * 40 / (this.size - 1)) - this.side / 2;
    }
    
    /**
     * Returns the actual y position of a token.
     * @param y the y coordinate on the board grid
     */
    getY(y) {
        return 3 + ( y * 40 / (this.size  - 1)) - this.side / 2;
    }
    
    /**
     * Returns an action specific to the given x, y coordinates
     * @param x the x coordinate on the board grid
     * @param y the y coordinate on the board grid
     */
    getMoveAction(x, y) {
        var gc = this;
        return ComponentFactory.ClickAction(function() {
           gc.move(x, y, false); 
        });
    }
    
    /**
     * Updates the visualization of the board to match the board state. Also updates input tokens.
     */
    update() {
        log.info('Board update', this.game.Board.toString());
        var tokenEnter = ComponentFactory.EnterAction(select1, 'background');
        var tokenLeave = ComponentFactory.LeaveAction('', 'background');
        var size = this.size;
        var side = this.side;
        $('.token').remove();
        var played = ComponentFactory.Vector().z(4).addClass('token');
        for(var y = 0; y < size; y++)
            for(var x = 0; x < size; x++) {
                if ( this.game.Board.grid[x][y] == 1 ) {
                    played.circle(this.getX(x), this.getY(y), this.side / 2, background1);
                } else if ( this.game.Board.grid[x][y] == 2 ) {
                    played.circle(this.getX(x), this.getY(y), this.side / 2, background2);
                } else {
                    this.vc.add( new Component().xyz(this.getX(x), this.getY(y), 5).width(side).height(side)
                    .addAction(this.getMoveAction(x, y)).addAction(tokenEnter).addAction(tokenLeave).addClass('circle').addClass('token') );
                }
            }
        this.vc.add(played);
        this.vc.update();
    }
    
    /**
     * Performs a move on the game.
     * @param x    the x position to play
     * @param y    the y position to play
     * @param pass boolean indicating whether the move is being passed
     */
    move(x, y, pass) {
        log.info('move made', arguments);
        var gm = this;
        try {
            this.game.move(x, y, pass);
            if ( this.pass && pass ) {
                this.end();
                return;
            } else {
                this.pass = pass;
            }
            // Success
            this.update();
            if (this.ai) {
                this.player1.$.css({'color' : background2});
                this.player2.$.css({'color' : select2});
                this.moveList.push({'x':x,'y':y,'pass':pass});

                log.debug(this.moveList);

                vc.message(this.ai.name + ' TURN', select1, function() {
                    var move = gm.ai.getMove(gm.game);
                    gm.game.move(move.x, move.y, move.pass);
                    if ( this.pass && move.pass ) {
                        this.end();
                        return;
                    } else {
                        this.pass = move.pass;
                    }
                    gm.moveList.push({'x':move.x,'y':move.y,'pass':move.pass});
                    gm.update();
                    vc.message(gm.playerModel.username() + ' TURN', select1);
                    gm.player1.$.css({'color' : select2});
                    gm.player2.$.css({'color' : background2});
                });
            } else {
                if (this.turn == 1) {
                    vc.message('PLAYER 2 TURN', select1);
                    this.player1.$.css({'color' : background2});
                    this.player2.$.css({'color' : select2});
                    this.turn = 2
                } else {
                    vc.message(this.playerModel.username() + ' TURN', select1);
                    this.player1.$.css({'color' : select2});
                    this.player2.$.css({'color' : background2});
                    this.turn = 1
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
        vc.add( ComponentFactory.Text('YOU WIN', select2).size(10).xy(20, 2).addClass('slide-up') );
        vc.add( ComponentFactory.Vector()
             .poly([35,0,  75,0,  65,50, 25,50], background2)
             .z(6).addClass('slide-up') 
        );
        vc.update();
    	var scores = endGame(this.game);
    	console.log(this.moveList);
    	saveGameToDB({
    		'player1': this.playerModel.username(), 
    		'player2': this.ai ? this.ai.name : 'PLAYER 2', 
    		'score1': scores.player1score, 
    		'score2': scores.player2score, 
    		'size': this.size,
    	}, this.moveList, function(res){
    		log.info('Game saved to database.', res);
    	});
        //console.log(endGame(this.Game.Board));
		// server/database call for stats storage can go here.
		// UI call can go here
    }
    
}
//==========================================================================================================================//