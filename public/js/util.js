'use strict'
//==========================================================================================================================//
//       __  ____  _ __
//      / / / / /_(_) /
//     / / / / __/ / / 
//    / /_/ / /_/ / /  
//    \____/\__/_/_/   
//                 
//==========================================================================================================================//
// HELPER FUNCTIONS                                                                                                                  
//==========================================================================================================================//
/**
 * Returns a copy of the string with the first character capitalized.
 */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/**
 * Replaces a search term with replacement everywhere it occurs in a string.
 * @param search      the string to search for
 * @param replacement the replacement string
 */
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

/**
 * Formats a string with the provided args. {#} will be replaced with the # argument.
 * @param arg any number of arguments to format
 */
String.prototype.format = function() {
   var content = this;
   for (var i=0; i < arguments.length; i++) 
        content = content.replaceAll('{' + i + '}', arguments[i]);  
   return content;
};

/**
 * Returns an object in HTML attribute format.
 * @param obj the object to format
 */
function attributize(obj) {
    var content = '';
    $.each(obj, function(key, val) {
        content += key + '="' + val + '" ';
    })
    return content;
}

/**
 * Generates a random integer between 1 and max inclusive.
 * @param max the maximum integer value
 */
Math.randomInt = function(max) {
    return Math.floor((Math.random() * (max - 1))) + 1;
}

/**
 * Preloads images so that they show quickly.
 */
$.preloadImages = function() {
  for (var i = 0; i < arguments.length; i++) {
    $("<img />").attr("src", arguments[i]);
  }
}
//==========================================================================================================================//
// DEBUGGER                                                                                                                  
//==========================================================================================================================//
// Static class for console commands. Add utility functions here.
//==========================================================================================================================//
class debug {
    
    /**
     * Load the login screen.
     */
    static login() {
        vc.login();
    }
    
    /**
     * Load the main menu.
     */
    static mainMenu() {
        vc.mainMenu(new PlayerModel('debug'));
    }
    
    /**
     * Load the level select screen.
     */
    static levelSelect() {
        vc.levelSelect(new PlayerModel('debug'));
    }
    
    /**
     * Load a story screen.
     */
    static story(level=0, scene=0) {
        vc.story(new PlayerModel('debug'), level, scene);
    }
    
    /**
     * Load the pvp/ai selection screen.
     */
    static pvpAi() {
        vc.pvpAi(new PlayerModel('debug'));
    }
    
    /**
     * Load the versus pvp screen.
     */
    static versusPvP() {
        vc.versusPvP(new PlayerModel('debug'));
    }
    
    /**
     * Load the versus ai screen.
     */
    static versusAi() {
        vc.versusAi(new PlayerModel('debug'));
    }
    
    /**
     * Load a game.
     */
    static game(size=9) {
        debug.gc = new GameController(vc, new PlayerModel('debug'), size, null, debug.mainMenu);
    }
    
    /**
     * Make a move in a debug game.
     */
    static move(x, y, pass=false) {
        debug.gc.move(x, y, pass);
    }
    
    /**
     * Load the replay list screen.
     */
    static replayList() {
        vc.replayList(new PlayerModel('debug'));
    }
    
    /**
     * Load the profile screen.
     */
    static profile() {
        vc.profile(new PlayerModel('debug'));
    }
    
    /**
     * Put vectors in debug mode.
     */
    static vectors() {
        ComponentFactory.Vector = function() {
            return new Component()
            .setAttr('preserveAspectRatio', 'none')
            .background('#F00')
            .element('svg')
            .opacity(0.8)
        }
        this.reload();
    }
    
    /**
     * Reload the current UI.
     */
    static reload() {
        vc.reload();    
    }
    
    /**
     * Set a new logging level.
     */
    static log(level=DEBUG) {
        log = new Logger(level);
    }
    
    /**
     * Lists debug functions.
     */
    static help() {
        debug.toString().replace(/\/\**\s+\*\s+.*\s+\**\/\s+static\s+.*\{/g, function(match) {
            var groups = /\/\**\s+\*\s+(.*)\s+\**\/\s+static\s+(.*)\{/.exec(match);
            console.log('%c' + groups[2], 'color:#0000FF');
            console.log(groups[1]);
        }); 
    }
    
}
//==========================================================================================================================//
// LOGGER                                                                                                                  
//==========================================================================================================================//
// The Logger is used to filter and annotate messages from indiGO's system. There are 3 levels. DEBUG should be used for
// temporary messages when programming. INFO should be used for useful pieces of information that would be helpful to log
// but does not always neet to be tracked. WARN should be used in catch blocks or to indicate that error code is running.
// Only logging messages with a higher priority than the current level will be shown. The level priorities go
//
//     WARN > INFO > DEBUG > NONE
//
// To log a message at a specific level call log.level(), where level is either warn, info, or debug. Logging messages will 
// print the logging level, time, and provide a link to the caller. You can log multiple objects at once by providing them 
// all as arguments. As an example
//
//     log.info('Hello', 'World');
//
// will produce 
//
//     INFO : ##:##:## at <class.function>:#:#
//     Hello
//     World
//
// To disable the logging change the line below
//
//     var log = new Logger(DEBUG);
//
// to
//
//     var log = new Logger(NONE);
// 
// or enter on the console everytime you refresh
//
//     log = new Logger(None)
//==========================================================================================================================//
// LOGGING CONSTANTS
//==========================================================================================================================//
var DEBUG = 4
var INFO  = 3
var WARN  = 2
var NONE  = 1

class Logger {
    
    /**
     * Creates a new logger instance.
     * @level the maximum level of logs to show
     */
    constructor(level) {
        this.debug = level >= DEBUG ? this.log('DEBUG', '#0000FF') : function() {};
        this.info  = level >= INFO  ? this.log('INFO',  '#00C864') : function() {};
        this.warn  = level >= WARN  ? this.log('WARN',  '#C80164') : function() {};
    }
    
    /**
     * Returns a function that will properly format the output of the given logging level.
     * @param level the logging level
     * @param color the color of the logging level
     */
    log(level, color) {
        return function() {
            var time = new Date().toLocaleTimeString();
            var caller = new Error().stack.split('\n')[2].trim()
            console.log('%c' + level + ' : ' + time + ' ' + caller, 'color:' + color);
            for(var i = 0; i < arguments.length; i++)
                console.log(arguments[i]);
        }
    }
    
}

var log = new Logger(DEBUG); // logger instance to use