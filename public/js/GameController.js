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
     * @param color       The color of the board
     * @param background  The name of the background file
     */
    constructor(vc, playerModel, size, ai, color=accent, background='testing') {
        log.info('new game started', arguments);
        this.vc = vc;
        this.id = 0;
        this.size = size;
        this.side = (40 / size) - (5 / this.size); // Make tokens less than the distance between two lines
        this.turn = 1;
        this.game = new Game(this.id, this.size);
        this.ai = assembleAI(ai, this.game);
        this.playerModel = playerModel;
        var gc = this;
        // Actions
        var quit       = vc.factory.ClickAction(function() { vc.mainMenu(playerModel); });
        var pass       = vc.factory.ClickAction(function() { gc.move(0, 0, true); });
        var enter      = vc.factory.EnterAction();
        var passEnter  = vc.factory.EnterAction(select2);
        var leave      = vc.factory.LeaveAction();
        // Vectors
        vc.add( vc.factory.Resource('rsc/backgrounds/' + background + '.png').width(100) );
        vc.add( vc.factory.Vector().poly([0,25, 10,0, 0,0], background1).addClass('slide-right') );
        vc.add( vc.factory.Vector()
                 .poly([35,0,  75,0,  65,50, 25,50], background1)
                 .poly([3,41,  4,46,  20,45, 23,41], background1)
                 .poly([97,41, 96,46, 80,45, 77,41], background1)
                 .z(2).addClass('slide-up') 
        );
        // Board   
        vc.add( vc.factory.Vector().addClass('slide-down').z(3) );
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
        vc.add( vc.factory.Text(playerModel.username()).xy(5, 41.5).addClass('slide-up') );
        this.player1 = vc.last;
        vc.add( vc.factory.Text('PLAYER 2').xy(81, 41.5).addClass('slide-up') );
        this.player2 = vc.last;
        // Images
        vc.add( vc.factory.Resource('rsc/characters/player1.png').xyz(3, 15, 2).width(21).height(28).addClass('slide-up') )
        if (!ai)
            vc.add( vc.factory.Resource('rsc/characters/player2.png').xyz(76, 15, 2).width(21).height(28).addClass('slide-up') )
        // else 
        //    vc.add( vc.factory.Resource('rsc/characters/' + this.ai.name + '.png').xyz(3, 15, 2).width(21).height(28).addClass('slide-up') )
        // Buttons
        vc.add( vc.factory.TitleButton('QUIT').xy(3, 5).addClass('slide-right').addAction(enter).addAction(leave).addAction(quit) );
        vc.add( vc.factory.TitleButton('PASS').xy(62, 45).addClass('slide-right').addAction(passEnter).addAction(leave).addAction(pass) );
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
        return vc.factory.ClickAction(function() {
           gc.move(x, y, false); 
        });
    }
    
    /**
     * Updates the visualization of the board to match the board state. Also updates input tokens.
     */
    update() {
        log.info('Board update', this.game.Board.toString());
        var tokenEnter = this.vc.factory.EnterAction(select1, 'background');
        var tokenLeave = this.vc.factory.LeaveAction('', 'background');
        var size = this.size;
        var side = this.side;
        $('.token').remove();
        var played = this.vc.factory.Vector().z(4).addClass('token');
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
            // Succes
            this.update();
            if (this.ai) {
                this.player1.$.css({'color' : background2});
                this.player2.$.css({'color' : select2});
                vc.message(this.ai.name + ' TURN', select1, function() {
                    var move = gm.ai.getMove(gm.game);
                    gm.game.move(move.x, move.y, move.pass);
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
        console.log(endGame(this.Game.Board));
		// server/database call for stats storage can go here.
		// UI call can go here
    }
    
}
//==========================================================================================================================//