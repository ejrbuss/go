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
    constructor(vc, player1, player2, gameID, size, quit, stageID) {
        log.info('new replay started', arguments);
        this.timeout = null;
        this.turn = 1;
        this.id = gameID;
        this.game = new Game(this.id, size);
        this.player1 = {
            name: player1,
            image: 'Player1'
        }
        this.player2 = {
            name: player2,
            image: 'Player1'
        }
        this.iterator = new ReplayIterator(gameID, size);
        this.gvc = new GameViewController(vc, 0, size, quit, this);
        // Update
        this.gvc.update();
        this.gvc.player1turn();
        var rc = this;
        setTimeout(function(){rc.next()}, 1000);        
    }

    /*
    * Moves the board onto the next move and adds that move to the board displayed by the UI.
    */
    next() {
        clearTimeout(this.timeout);

        if(this.iterator.hasNext()) {
        	if (!this.iterator.hasBoard()) {
            	this.iterator.boardList.push(this.game.Board.gridCopy(this.game.Board.grid));
        	}
            var move = this.iterator.next();
            var rc = this;

            try {
           		this.game.move(move.x,move.y,move.pass);
            } catch (err) {
            	log.warn(err);
            }
            this.gvc.update();
            if (this.iterator.hasNext()) {
                this.timeout = setTimeout(function(){rc.next()}, 1000);
            } else {
            	var end = ComponentFactory.ClickAction(function() {
            		clearTimeout(rc.timeout);
            		log.debug('running end');
            		rc.quit();
            	});
            	$('.next').remove();
            	vc.add(ComponentFactory.TitleButton('END').xy(62, 45).addAction(end).addClass('end'));
            	
            }

            if(this.iterator.hasPrev() && $('.prev').length === 0) {
            	var prev = ComponentFactory.ClickAction(function () {rc.prev()});
            	vc.add(ComponentFactory.TitleButton('PREVIOUS').xy(48,45).addAction(prev).addClass('prev'));
            }

            vc.update();

        } else {
            log.info('Game finished - game should end here once it is implemented properly.')
            this.quit();
        }
    }

    /*
    * Reverts one move back to previous board state -> might not be in final version
    */
    prev() {
        clearTimeout(this.timeout);
        var end = $('.end');
        if(end.length > 0){
        	end.remove();
        	var next = ComponentFactory.ClickAction(function () {rc.next()});
        	vc.add(ComponentFactory.TitleButton('NEXT').xy(62, 45).addAction(next).addClass('next'));

        }

        if(this.iterator.hasPrev()) {
        	var board = this.iterator.prev();
        	//log.info(board);
        	var rc = this;

        	this.game.Board.grid = this.game.Board.gridCopy(board);


        	//switch turns around when going back one move

        	if(this.game.turn === this.game.player1)
        		this.game.turn = this.game.player2;
        	else
        		this.game.turn = this.game.player1;

        	if(this.iterator.hasPrev())
        		this.game.Board.oldGrid = this.game.Board.gridCopy(this.iterator.peekPrev());
        	else 
        		this.game.Board.grid = this.game.Board.gridCopy(board);

        	this.gvc.update();

        	var prev = $('.prev');
        	if(prev.length > 0 && !this.iterator.hasPrev()) {
        		prev.remove();
        	}

        }

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

    constructor(id, size) {
        var rc = this;
        var gm = new Game(0, size);
        this.boardList = [];
        this.current = 0;
        
        getMoveList(id, function (response) {
        	log.debug(response);
            rc.moveList = JSON.parse(response);            
        });
        
    }

    /*
    * Returns the next move; will increment iterator by one move.
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
    * Returns the previous move; will decrement iterator by one move.
    */

    prev() {
        if (this.hasPrev()) {
            return this.boardList[--this.current];
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
    * Returns the previous move in the list, but does not decrement the iterator.
    */
    peekPrev() {
        if(this.hasNext()) {
            return this.boardList[this.current - 1];
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

    hasBoard() {
    	return !!this.boardList[this.current];
    }

}
//==========================================================================================================================//