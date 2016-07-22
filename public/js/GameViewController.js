'use strict'
//==========================================================================================================================//   
//       ______                   _    ______             ______            __             ____         
//      / ____/___ _____ ___  ___| |  / /  _/__ _      __/ ____/___  ____  / /__________  / / /__  _____
//     / / __/ __ `/ __ `__ \/ _ \ | / // // _ \ | /| / / /   / __ \/ __ \/ __/ ___/ __ \/ / / _ \/ ___/
//    / /_/ / /_/ / / / / / /  __/ |/ // //  __/ |/ |/ / /___/ /_/ / / / / /_/ /  / /_/ / / /  __/ /    
//    \____/\__,_/_/ /_/ /_/\___/|___/___/\___/|__/|__/\____/\____/_/ /_/\__/_/   \____/_/_/\___/_/     
//                                                                                                                                                                   
//==========================================================================================================================//
// Manages game views.
//==========================================================================================================================//
class GameViewController {
    
    /**
     * Creates a new a GameViewController.
     */
    constructor(vc, stageID, size, quit, controller) {
        this.vc = vc;
        this.size = size;
        this.stage = stages[stageID];
        this.controller = controller;
        this.side = (40 / size) - (5 / this.size); // Make tokens less than the distance between two lines
        
        var quitAction = ComponentFactory.ClickAction(function(){
            if(controller.timeout)
                clearTimeout(controller.timeout);
            quit();
        });
        
        vc.add( ComponentFactory.Background(this.stage.background) );
        vc.add( ComponentFactory.Vector().poly([0,25, 10,0, 0,0],background1).addClass('slide-right') );
        vc.add( ComponentFactory.Vector()
            .poly([3,41,  4,46,  20,45, 23,41], background1)
            .poly([97,41, 96,46, 80,45, 77,41], background1)
            .addClass('slide-up') ); 
        vc.add( ComponentFactory.Vector().poly([35,0,  75,0,  65,50, 25,50], background1).z(2).addClass('slide-up game') );
        // Board   
        vc.add( ComponentFactory.Vector().addClass('slide-down game').z(3) );
        var offset = this.side / 2 + 2.5 / this.size;
        for(var y = 0; y < this.size - 1; y++) 
            for(var x = 0; x < size - 1; x++) {
                var x1 = this.getX(x) + offset;
                var x2 = x1 + this.side + 2.5 / this.size;
                var y1 = this.getY(y) + offset;
                var y2 = y1 + this.side + 2.5 / this.size;
                vc.last.poly([x1, y2, x1, y1, x2, y1, x2, y2], this.stage.color);
            }
        // Text
        vc.add( ComponentFactory.Text(controller.player1.name).xy(5, 41.5).addClass('slide-up') );
        this.player1text = vc.last;
        vc.add( ComponentFactory.Text(controller.player2.name).xy(81, 41.5).addClass('slide-up') );
        this.player2text = vc.last;
        // Images
        vc.add( ComponentFactory.Character(controller.player1.image).xyz(3, 13, 2).width(21).height(28).addClass('slide-up') );
        this.player1image = vc.last;
        vc.add( ComponentFactory.Character(controller.player2.image).xyz(76, 13, 2).width(21).height(28).addClass('slide-up') );
        this.player2image = vc.last;
        // Buttons
        vc.add( ComponentFactory.TitleButton('QUIT').xy(3, 5).addClass('slide-right').addAction(quitAction));
        // Render
        vc.clear();
        vc.update();
    }
    
    /**
     * Indicate player 1 turn.
     */
    player1turn() {
        this.player1text.$.css({'color' : select2});
        this.player2text.$.css({'color' : background2});
        //this.player1image.$.css({'opacity' : 1 });
        //this.player2image.$.css({'opacity' : 0.7 });
        //this.vc.message(this.controller.player1.name, this.stage.color);
    }
    
    /**
     * Indicate player 2 turn
     */
    player2turn() {
        this.player1text.$.css({'color' : background2});
        this.player2text.$.css({'color' : select2});
        //this.player1image.$.css({'opacity' : 0.7 });
        //this.player2image.$.css({'opacity' : 1 });
        //this.vc.message(this.controller.player2.name, this.stage.color);
    }
    
    /**
     * Returns an action specific to the given x, y coordinates
     * @param x the x coordinate on the board grid
     * @param y the y coordinate on the board grid
     */
    getMoveAction(x, y) {
        var gc = this.controller;
        return ComponentFactory.ClickAction(function() {
           gc.move(x, y, false); 
        });
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
     * Updates the game board.
     */
    update() {
        log.info('Board update');
        var size = this.size;
        var side = this.side;
        var board = this.controller.game.Board;
        $('.pass, .token').remove();
        var played = ComponentFactory.Vector().z(4).addClass('token');
        for(var y = 0; y < size; y++)
            for(var x = 0; x < size; x++) {
                if ( board.grid[x][y] == 1 ) {
                    played.circle(this.getX(x), this.getY(y), this.side / 2, background1);
                } else if ( board.grid[x][y] == 2 ) {
                    played.circle(this.getX(x), this.getY(y), this.side / 2, background2);
                } 
            }
        this.vc.add(played);
        this.vc.update();
    }
    
    /**
     * Updates the player input.
     */
    gameInput() {
        log.info('Input update');
        var size = this.size;
        var side = this.side;
        var controller = this.controller;
        var board = this.controller.game.Board;
        var tokenEnter = ComponentFactory.EnterAction(this.stage.select, 'background');
        var tokenLeave = ComponentFactory.LeaveAction('', 'background');
        // Actions
        var pass = ComponentFactory.ClickAction(function() { controller.move(0, 0, true); });
        // Load input tokens
        for(var y = 0; y < size; y++)
            for(var x = 0; x < size; x++) {
                if( board.grid[x][y] == 0 ) {
                    this.vc.add( 
                        new Component().xyz(this.getX(x), this.getY(y), 5).width(side).height(side)
                            .addAction(this.getMoveAction(x, y)).addAction(tokenEnter).addAction(tokenLeave)
                            .addClass('circle').addClass('token') );
                }
            }
        // Add pass
        this.vc.add( ComponentFactory.TitleButton('PASS', background2, select2).xy(62, 44).addClass('slide-up pass').addAction(pass) );
        // Render
        this.vc.update();
    }
    
    /**
     *
     */
    replayInput() {
        log.debug('Replay Input update');
        
        var gvc = this;
        var enter = new Action().trigger('mouseenter').action(function(component) {
            $( '#' + component.id() + ' polygon' ).css('fill', select1);
        })
        var leave = new Action().trigger('mouseleave').action(function(component) {
            $( '#' + component.id() + ' polygon' ).css('fill', background2);
        });
        
        var prevAction = ComponentFactory.ClickAction(function() { gvc.controller.prev() }); 
        var nextAction = ComponentFactory.ClickAction(function() { gvc.controller.next() }); 
        
        // Vectors
        var prev = ComponentFactory.Vector()
            .poly([44.5,44.5, 41.5,46, 44.5,47.5], background2)
            .poly([41.5,44.5, 42,44.5, 42,47.5, 41.5,47.5], background2)
            .z(50).addAction(enter).addAction(leave).addAction(prevAction).addClass('slide-up');
        this.vc.add( prev );        
        var next = ComponentFactory.Vector()
            .poly([55.5,44.5, 58.5,46, 55.5,47.5], background2)
            .poly([58.5,44.5, 58,44.5, 58,47.5, 58.5,47.5], background2) 
            .z(50).addAction(enter).addAction(leave).addAction(nextAction).addClass('slide-up');
        this.vc.add( next );
        this.pause(true);
    }
    
    play() {
        $('.pause, .play').remove();
        var gvc = this;
        var enter = new Action().trigger('mouseenter').action(function(component) {
            $( '#' + component.id() + ' polygon' ).css('fill', select1);
        })
        var leave = new Action().trigger('mouseleave').action(function(component) {
            $( '#' + component.id() + ' polygon' ).css('fill', background2);
        }); 
        
        var action = ComponentFactory.ClickAction(function() { gvc.controller.play() }); 
        
        var play = ComponentFactory.Vector()
            .poly([48.5,44.5, 51.5,46, 48.5,47.5], background2)  
            .z(50).addAction(enter).addAction(leave).addAction(action).addClass('play');
        this.vc.add( play );
        // Render
        this.vc.update();
    }
    
    pause(first=false) {
        $('.pause, .play').remove();
        var gvc = this;
        var enter = new Action().trigger('mouseenter').action(function(component) {
            $( '#' + component.id() + ' polygon' ).css('fill', select1);
        })
        var leave = new Action().trigger('mouseleave').action(function(component) {
            $( '#' + component.id() + ' polygon' ).css('fill', background2);
        });
        
        var action = ComponentFactory.ClickAction(function() { gvc.controller.pause() }); 
        var pause = ComponentFactory.Vector()
            .poly([51.5,44.5, 50.5,44.5, 50.5,47.5, 51.5,47.5], background2) 
            .poly([48.5,44.5, 49.5,44.5, 49.5,47.5, 48.5,47.5], background2) 
            .z(50).addAction(enter).addAction(leave).addAction(action).addClass('pause');
        if(first)
            pause.addClass('slide-up');
        this.vc.add( pause );
        // Render
        this.vc.update();
    }
    
    /**
     * End game message.
     * @param text  the text to display
     * @param front the color of the front of the message
     * @param back  the color of the back of the message
     */
    end(text, front=select1, back=select2, callback) {
        var callback = ComponentFactory.ClickAction(callback);
        var countup = new Action().action(function(component) {
            component.$.countup();    
        });
        $('.game').remove();
        this.player1text.$.css({'color' : background2});
        this.player2text.$.css({'color' : background2});
        this.player1image.$.css({'opacity' : 1 });
        this.player2image.$.css({'opacity' : 1 });
        
        this.vc.add( ComponentFactory.Vector().poly([35,0,  75,0,  65,50, 25,50], background1).z(2).addClass('game') );
        this.vc.add( ComponentFactory.Vector()
            .poly([34,14, 65,13, 67,20], accent)
            .poly([28,28, 32,13, 70,18, 70,23], background1)
            .addClass('slide-down') );
        this.vc.add( ComponentFactory.Text(text, back).size(10).xy(36.3, 8.3).addClass('slide-down') );
        this.vc.add( ComponentFactory.Text(text, front).size(10).xy(36, 8).addClass('slide-down') );
        this.vc.add( ComponentFactory.Text(this.controller.player1.name).xy(34, 18).addClass('slide-down') );
        this.vc.add( ComponentFactory.Text(this.controller.player1.score).xy(44, 18).addClass('slide-down') );
        this.vc.add( ComponentFactory.Text(this.controller.player2.name).xy(33, 22).addClass('slide-down') );
        this.vc.add( ComponentFactory.Text(this.controller.player2.score).xy(43, 22).addClass('slide-down') );
        this.vc.add( ComponentFactory.TitleButton('CONTINUE', background2, select2).xy(52, 22).addClass('slide-down').addAction(callback) );
        
        this.vc.update();
        
        $('.game, .pass, .token').addClass('slide-down-off').on('animationend', function() {
            $('.game, .pass, .token').remove();
        });
    }
    
}
//==========================================================================================================================//