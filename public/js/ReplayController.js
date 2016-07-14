'use strict'
//==========================================================================================================================//
//        ____             __               ______            __             ____         
//       / __ \___  ____  / /___ ___  __   / ____/___  ____  / /__________  / / /__  _____
//      / /_/ / _ \/ __ \/ / __ `/ / / /  / /   / __ \/ __ \/ __/ ___/ __ \/ / / _ \/ ___/
//     / _, _/  __/ /_/ / / /_/ / /_/ /  / /___/ /_/ / / / / /_/ /  / /_/ / / /  __/ /    
//    /_/ |_|\___/ .___/_/\__,_/\__, /   \____/\____/_/ /_/\__/_/   \____/_/_/\___/_/     
//              /_/            /____/                                                     
//==========================================================================================================================//
class ReplayController {
    constructor(vc, player1, player2, gameID, size, quit, color=accent, background = '0') {
        var rc = this;
        this.vc = vc;
        this.timeout = null;
        this.id = 0;
        this.size = size;
        this.side = (40 / size) - (5 / this.size); // Make tokens less than the distance between two lines
        this.turn = 1;
        this.game = new Game(this.id, this.size);
        this.player1 = player1;
        this.player2 = player2;
        this.quit = quit;
        var gc = this;
        this.iterator = new ReplayIterator(gameID);


        // Actions
        var quit = ComponentFactory.ClickAction(function(){
            clearTimeout(gc.timeout);
            rc.quit();
        });
        var next = ComponentFactory.ClickAction(function () {rc.next()});
        var prev = ComponentFactory.ClickAction(function () {rc.prev()});
        var enter = ComponentFactory.EnterAction();
        var leave = ComponentFactory.LeaveAction();
        // Vectors
        vc.add(ComponentFactory.Resource('rsc/backgrounds/' + background + '.png').width(100));
        vc.add(ComponentFactory.Vector().poly([0, 25, 10, 0, 0, 0], background1).addClass('slide-right'));
        vc.add(ComponentFactory.Vector()
                 .poly([35, 0, 75, 0, 65, 50, 25, 50], background1)
                 .poly([3, 41, 4, 46, 20, 45, 23, 41], background1)
                 .poly([97, 41, 96, 46, 80, 45, 77, 41], background1)
                 .z(2).addClass('slide-up')
        );
        // Board   
        vc.add(ComponentFactory.Vector().addClass('slide-down').z(3));
        var offset = this.side / 2 + 2.5 / this.size;
        for (var y = 0; y < this.size - 1; y++)
            for (var x = 0; x < this.size - 1; x++) {
                var x1 = this.getX(x) + offset;
                var x2 = x1 + this.side + 2.5 / this.size;
                var y1 = this.getY(y) + offset;
                var y2 = y1 + this.side + 2.5 / this.size;
                vc.last.poly([x1, y2, x1, y1, x2, y1, x2, y2], color);
            }
        
        // Text
        vc.add(ComponentFactory.Text(player1).xy(5, 41.5).addClass('slide-up'));
        this.player1 = vc.last;
        vc.add(ComponentFactory.Text(player2).xy(81, 41.5).addClass('slide-up'));
        this.player2 = vc.last;
        // Images
        vc.add(ComponentFactory.Resource('rsc/characters/player1.png').xyz(3, 15, 2).width(21).height(28).addClass('slide-up'))
        vc.add(ComponentFactory.Resource('rsc/characters/player2.png').xyz(76, 15, 2).width(21).height(28).addClass('slide-up'))

        vc.add(ComponentFactory.TitleButton('QUIT').xy(3, 5).addClass('slide-right').addAction(enter).addAction(leave).addAction(quit));
        vc.add(ComponentFactory.TitleButton('NEXT').xy(62, 45).addClass('slide-right').addAction(next));
        vc.add(ComponentFactory.TitleButton('PREVIOUS').xy(48,45).addClass('slide-right').addAction(prev));
        // Render
        vc.clear();
        vc.update();
        // Update
        gc.update();
        this.player1.$.css({ 'color': select2 });
        setTimeout(function(){rc.next()}, 3000);
        
    }

    /*
    * Moves the board onto the next move and adds that move to the board displayed by the UI.
    */

    next() {
        if(!this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        if(this.iterator.hasNext()) {
            var move = this.iterator.next();
            var rc = this;

            this.game.move(move.x,move.y,move.pass);
            this.update();
            if(this.iterator.hasNext()) {
                this.timeout = setTimeout(function(){rc.next()}, 3000);
            }

        } else {
            log.info('Game finished - game should end here once it is implemented properly.')
            this.quit();
        }
    }

    // unimplemented: Reverts one move back to previous board state -> might not be in final version
    prev() {

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


    update() {
        log.info('Board update', this.game.Board.toString());
        var size = this.size;
        var side = this.side;
        var played = ComponentFactory.Vector().z(4).addClass('token');
        for(var y = 0; y < size; y++)
            for(var x = 0; x < size; x++) {
                if ( this.game.Board.grid[x][y] == 1 ) {
                    played.circle(this.getX(x), this.getY(y), this.side / 2, background1);
                } else if ( this.game.Board.grid[x][y] == 2 ) {
                    played.circle(this.getX(x), this.getY(y), this.side / 2, background2);
                } 
            }
        this.vc.add(played);
        this.vc.update();
    }

}

// Might take this class out to simplify things since it's only used once.
class ReplayList {
    
    /*
    * When the constructor is called, the replay constructor will load all replay data associated with the given user_id.
    * @param username A string that represents the username for the player that is being loaded.
    * @param cb Callback function to call once the match history has been loaded.
    */

    constructor(username, cb) {
        var rc = this;
        getMatchHistory(username, function (response) {
            rc.matchList = JSON.parse(response);
            cb();
        });
    }

}

class ReplayIterator {

    /*
    * The constructor loads the game data for the given match id.
    * @param id The game id for the game to be loaded and played.
    */

    constructor(id) {
        var rc = this;
        this.current = 0;
        
        getMoveList(id, function (response) {
        	log.debug(response);
            rc.moveList = JSON.parse(response);
        });
        
    }

    /*
    * Returns the next move, will increase iterator up by one move.
    */

    next() {
        if (this.hasNext()) {
            return this.moveList[this.current++];
        } else {
            log.warn('Attempting to load from next() when there are no more elements.');
            return null;
        }

    }

    /*
    * Returns the previous move, will decrement iterator by one move.
    */

    prev() {
        if (this.hasPrev()) {
            return this.moveList[--this.current];
        } else {
            log.warn('Attempting to load from prev() when there are no more elements.');
            return null;
        }
    }

    /*
    * Returns the next move in the list, but does not increment the iterator.
    */

    peek() {
        if(this.hasNext()) {
            return this.moveList[this.current];
        } else {
            return null;
        }
    }

    /*
    * Returns true if there are more elements in the list to be returned by next(), false otherwise.
    */

    hasNext() {
        return this.current < this.moveList.length;
    }

    /*
    * Returns true if there are more elements in the list to be returned by prev(), false otherwise.
    */

    hasPrev() {
        return this.current > 0;
    }

}
//==========================================================================================================================//