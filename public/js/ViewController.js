'use strict'
//==========================================================================================================================//
//     _    ___                 ______            __             ____         
//    | |  / (_)__ _      __   / ____/___  ____  / /__________  / / /__  _____
//    | | / / / _ \ | /| / /  / /   / __ \/ __ \/ __/ ___/ __ \/ / / _ \/ ___/     
//    | |/ / /  __/ |/ |/ /  / /___/ /_/ / / / / /_/ /  / /_/ / / /  __/ /         
//    |___/_/\___/|__/|__/   \____/\____/_/ /_/\__/_/   \____/_/_/\___/_/                                                                           
//
//==========================================================================================================================//
// Manages game views.
//==========================================================================================================================//
class ViewController {
    
    /**
     * Creates a new ViewController.
     * @param parent the css selector for the parent element that the game will be displayed in
     */
    constructor(parent) {
        log.info('View Controller Created', arguments)
        this.live = [];
        this.last = null;
        this.parent = $( parent );
        this.factory = new ComponentFactory();
        
        log.debug('Currently booting straight to the main menu');
        // this.login(); // Uncomment this line and remove the following to load normally
        this.mainMenu(new PlayerModel('debug'));
    }
    
    /**
     * Adds a component to the list components ready to update.
     * @param comopnent the component to add
     */
    add(component) {
        this.live.push(component);
        this.last = component;
    }
    
    /**
     * Clears the aprent element.
     */
    clear() {
        this.parent.html( '' );
    }
    
    /**
     * Updates all components ready to display.
     */
    update() {
        for(var i = 0; i < this.live.length; i++)
            this.live[i].render(this.parent);
        for(var i = 0; i < this.live.length; i++)
            this.live[i].ready();
        this.live = [];
    }
    
    /**
     * Send a temporary message to the screen.
     * @param message  the text of the message
     * @param color    the background color of the message
     * @param callback a function to run upon the completion of the message
     */
    message(message, color=background1, callback=function(){}) {
        log.info('sent message', arguments);
        // Remove after second animation
        var removeActionCallback = new Action().trigger('animationend').action(function(component) {
            if (component.visited != undefined) {
                component.$. remove();
                callback();
            }
            component.visited = true;                                                
        });
        var removeAction= new Action().trigger('animationend').action(function(component) {
            if (component.visited != undefined) 
                component.$. remove();
            component.visited = true;                                                
        });
        this.add( this.factory.Vector().poly([40,0, 60,0, 60,50, 40,50], color).z('60').addClass('banner-transition').skew('-55deg').addAction(removeAction) );
        this.add( this.factory.Title().text(message).width(100).yz(22, 61).addClass('text-transition').addAction(removeActionCallback).size(5) );
        this.update();
    }
    
    /**
     * Load the login screen.
     */
    login() {
        log.info('loaded login');
        // Actions
        var newAccountAction = this.factory.ClickAction(function() {
            newAccount($('.username').val().toLowerCase(), $('.password').val().toLowerCase());
        });
        var loginAction = this.factory.ClickAction(function() {
            login($('.username').val().toLowerCase(), $('.password').val().toLowerCase());
        });
        var focusAction = this.factory.FocusAction();
        // Vectors
        this.add( this.factory.Vector()
                 .poly([50,0, 70,0, 20,20], accent)
                 .poly([7,0,  50,0, 0,45, 0,35], background1)
                 .addClass('slide-down') );
        this.add( this.factory.Vector()
                 .poly([35,50, 80,40,  80,50], accent)
                 .poly([50,50, 100,25, 100,50], background1)
                 .addClass('slide-up') );
        // Username/pass entry
        this.add( this.factory.Title('USERNAME').xy(16, 20) );
        this.add( this.factory.Title('PASSWORD').xy(15, 26) );
        this.add( this.factory.Input().xy(32, 20).addClass('username').addAction(focusAction) );
        this.add( this.factory.Password().xy(31, 26).addClass('password') );
        // Buttons
        this.add( this.factory.TitleButton('NEW ACCOUNT', select1).xyz(43, 31, 51).addAction(newAccountAction) );
        this.add( this.factory.TitleButton('LOGIN', select2).xy(63, 31).addAction(loginAction) );
        // Images
        this.add( this.factory.Resource('/rsc/icons/logo.png').xy(20, -5).width(28).height(28).addClass('slide-down') );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load the main menu.
     * @param playerModel the PlayerModel used for states
     */
    mainMenu(playerModel) {
        log.info('loaded mainMenu', arguments);
        var vc = this;
        // Actions
        var toStory   = this.factory.ClickAction(function() { vc.levelSelect(playerModel) });
        var toVersus  = this.factory.ClickAction(function() { vc.pvpAi(playerModel) });
        var toReplay  = this.factory.ClickAction(function() { vc.replayList(playerModel) });
        var toProfile = this.factory.ClickAction(function() { vc.profile(playerModel) });
        var toLogin   = this.factory.ClickAction(function() { vc.login(); });
        var enter     = this.factory.EnterAction();
        var leave     = this.factory.LeaveAction();
        // Vectors
        this.add( this.factory.Vector()
                 .poly([0,0, 12,0, 17,30, 0,30], accent)
                 .poly([0,0, 3,0,  35,50, 0,50], background1)
                 .addClass('slide-right') );
        this.add( this.factory.Vector()
                 .poly([68,9, 94,8,  94,14], accent)
                 .poly([65,8, 97,14, 97,20, 60,25], background1)
                 .circle(85.5, 14, 3, '#444')
                 .circle(86, 14.5, 2.5, background1)
                 .addClass('slide-left') );
		// Text
        this.add( this.factory.Text('PLAYING AS').xy(72, 8.5).addClass('slide-left') );
        this.add( this.factory.Text(playerModel.username(), select1).xy(83, 8.5).addClass('slide-left').weight('bold') );
        this.add( this.factory.Text('RANK', '#444').xy(84, 14).size(5).addClass('slide-left') );
        this.add( this.factory.Text(playerModel.rank(), select2).xy(85, 16).size(4).addClass('slide-left') );   
        this.add( this.factory.Text('W/L'     ).xy(66,   12  ).size(2).addClass('slide-left') );
        this.add( this.factory.Text('K/D'     ).xy(65.5, 14.5).size(2).addClass('slide-left') );
        this.add( this.factory.Text('TIME'    ).xy(65,   17  ).size(2).addClass('slide-left') );
        this.add( this.factory.Text('PROGRESS').xy(64.5, 19.5).size(2).addClass('slide-left') );
        this.add( this.factory.Text(playerModel.winLoss(), select1  ).xy(73.5, 12  ).size(2).addClass('slide-left') );
        this.add( this.factory.Text(playerModel.killDeath(), select1).xy(73,   14.5).size(2).addClass('slide-left') );
        this.add( this.factory.Text(playerModel.playtime(), select1 ).xy(72.5, 17  ).size(2).addClass('slide-left') );
        this.add( this.factory.Text(playerModel.progress(), select1 ).xy(72,   19.5).size(2).addClass('slide-left') );
        // Buttons
        this.add( this.factory.TitleButton('STORY'  ).xy(6, 10).addAction(enter).addAction(leave).addAction(toStory).addClass('slide-up') );
        this.add( this.factory.TitleButton('VERSUS' ).xy(9, 15).addAction(enter).addAction(leave).addAction(toVersus).addClass('slide-up') );
        this.add( this.factory.TitleButton('REPLAY' ).xy(12, 20).addAction(enter).addAction(leave).addAction(toReplay).addClass('slide-up') );
        this.add( this.factory.TitleButton('PROFILE').xy(15, 25).addAction(enter).addAction(leave).addAction(toProfile).addClass('slide-up') );
        this.add( this.factory.TitleButton('LOGOUT' ).xy(18, 30).addAction(enter).addAction(leave).addAction(toLogin).addClass('slide-up') );
        // Images
        this.add(this.factory.Resource('rsc/backgrounds/mainmenu.png').xy(20, 15).width(70).height(35).addClass('slide-up') );
        // Render
        this.clear();
        this.update();
    }
 
    /**
     * Load the level select screen.
     * @param playerModel the PlayerModel used for states
     */
    levelSelect(playerModel) {
        log.info('loaded levelSelect', arguments);
        var vc = this;
        // Actions
        var levelI   = this.factory.ClickAction(function() { vc.story(playerModel, 0, 0)});
        var levelII  = this.factory.ClickAction(function() { vc.story(playerModel, 1, 0)});
        var levelIII = this.factory.ClickAction(function() { vc.story(playerModel, 2, 0)});
        var levelIV  = this.factory.ClickAction(function() { vc.story(playerModel, 3, 0)});
        var levelV   = this.factory.ClickAction(function() { vc.story(playerModel, 4, 0)});
        var menu     = this.factory.ClickAction(function() { vc.mainMenu(playerModel); });
        var enter    = this.factory.EnterAction();
        var leave    = this.factory.LeaveAction();
        // Vectors
        this.add( new Component().width(100).height(50).background(accent) );
        // Black backgrounds
        this.add( this.factory.Vector()
                 .poly([0,50,  10,0,  20,0,  10,50], background1)
                 .poly([20,50, 30,0,  40,0,  30,50], background1)
                 .poly([40,50, 50,0,  60,0,  50,50], background1)
                 .poly([60,50, 70,0,  80,0,  70,50], background1)
                 .poly([80,50, 90,0,  100,0, 90,50], background1)
                 .z(1).addClass('slide-left') );
        // White backgrounds and characters
        this.add( this.factory.Resource('rsc/characters/level1.png').xyz(3,    7,  2).width(18).height(24).addClass('slide-up') ); 
        var white = this.factory.Vector()
                 .poly([0,50,  5,25,    14.6,27, 10,50], background2)
                 .poly([0,25,  10,50,   0,50], background1)
                 .z(3).addClass('slide-up');
        if (playerModel.levels() > 0) {  
            white.poly([20,50, 24.2,29, 33.8,31, 30,50], background2)
            this.add( this.factory.Resource('rsc/characters/level2.png').xyz(21.5, 7,  2).width(18).height(24).addClass('slide-up') );
            this.add( this.factory.TitleButton('REPLAY').xy(4, 1).addClass('slide-left').addAction(enter).addAction(leave).addAction(levelI) );
        } else if (playerModel.levels() == 0) {
            this.add( this.factory.TitleButton('CONTINUE').xy(4, 1).addClass('slide-left').addAction(enter).addAction(leave).addAction(levelI) );
        }
        if (playerModel.levels() > 1) {
            white.poly([40,50, 43.4,33, 53.0,35, 50,50], background2)
            this.add( this.factory.Resource('rsc/characters/level3.png').xyz(40,   14, 2).width(18).height(24).addClass('slide-up') );
            this.add( this.factory.TitleButton('REPLAY').xy(24, 1).addClass('slide-left').addAction(enter).addAction(leave).addAction(levelII) );
        } else if (playerModel.levels() == 1) {
            this.add( this.factory.TitleButton('CONTINUE').xy(24, 1).addClass('slide-left').addAction(enter).addAction(leave).addAction(levelII) );
        }
        if (playerModel.levels() > 2) {
            white.poly([60,50, 62.6,37, 72.2,39, 70,50], background2)
            this.add( this.factory.Resource('rsc/characters/level4.png').xyz(61.5, 16, 2).width(18).height(24).addClass('slide-up') );
            this.add( this.factory.TitleButton('REPLAY').xy(44, 1).addClass('slide-left').addAction(enter).addAction(leave).addAction(levelIII) );   
        } else if (playerModel.levels() == 2) {
            this.add( this.factory.TitleButton('CONTINUE').xy(44, 1).addClass('slide-left').addAction(enter).addAction(leave).addAction(levelIII) );
        }
        if (playerModel.levels() > 3) { 
            white.poly([80,50, 81.8,41, 91.4,43, 90,50], background2)
            this.add( this.factory.Resource('rsc/characters/level5.png').xyz(76,   19, 2).width(18).height(24).addClass('slide-up') );
            this.add( this.factory.TitleButton('REPLAY').xy(64, 1).addClass('slide-left').addAction(enter).addAction(leave).addAction(levelIV) );
        } else if (playerModel.levels() == 3) {
            this.add( this.factory.TitleButton('CONTINUE').xy(64, 1).addClass('slide-left').addAction(enter).addAction(leave).addAction(levelIV) );
        }
        if (playerModel.levels() > 4) { 
            this.add( this.factory.TitleButton('REPLAY').xy(84, 1).addClass('slide-left').addAction(enter).addAction(leave).addAction(levelV) );
        } else if (playerModel.levels() == 4) {
            this.add( this.factory.TitleButton('CONTINUE').xy(84, 1).addClass('slide-left').addAction(enter).addAction(leave).addAction(levelV) );
        }
        this.add( white );
        // Levels
        this.add( this.factory.Text('I',   background1).xy(8,    26).size(8).rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( this.factory.Text('II',  background1).xy(26.5, 30).size(8).rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( this.factory.Text('III', background1).xy(45,   34).size(8).rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( this.factory.Text('IV',  background1).xy(64,   38).size(8).rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( this.factory.Text('V',   background1).xy(84,   42).size(8).rotate('11.3deg').addClass('slide-up-rotated') );
        // Buttons
        this.add( this.factory.TitleButton('RETURN'  ).xy(1, 40).addClass('slide-right').addAction(enter).addAction(leave).addAction(menu) );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load a story screen.
     * @param playerModel the PlayerModel used for states
     * @param level       the story level to load
     * @param scene       the level scene to load
     */
    story(playerModel, level, scene) {
        log.info('loaded story', arguments);
        var data = story[level].data[scene];
        var vc = this;
        // Actions
        var quit  = this.factory.ClickAction(function() { vc.levelSelect(playerModel); });
        var enter = this.factory.EnterAction();
        var leave = this.factory.LeaveAction();
        var typed = new Action().trigger('ready').action(function(component) {
            component.$.typed({
                strings: [data.text],
                typeSpeed: 0
            }); 
        }); 
        var next = this.factory.ClickAction(function () {
            vc.story(playerModel, level, scene + 1);    
        });
        // Vectors
        vc.add( vc.factory.Vector().poly([0,25, 10,0, 0,0], background1).z(1).addClass('slide-right') );
        vc.add( vc.factory.Vector()
            .poly([40,38, 87,35, 88,47], data.color)
            .poly([8,47, 12,34, 90,41, 90,47], background1)
            .z(1).addClass('slide-up') );
        // Images
        if (data.background)
            this.add( this.factory.Resource('rsc/backgrounds/' + data.background + '.png').width(100) );
        if (data.character)
            this.add( this.factory.Resource('rsc/characters/' + data.character + '.png').xy(65, 9).width(25).addClass('slide-up') );
        // Text
        this.add( this.factory.Text(data.name).size(4).xy(71, 35.5).addClass('slide-up') ); 
        this.add( this.factory.Text().element('pre').size(2).family('sans-serif').xy(13, 39).addClass('slide-up').addAction(typed) );
        // Buttons
        this.add( this.factory.TitleButton('QUIT').xy(3, 5).addClass('slide-right').addAction(enter).addAction(leave).addAction(quit) );
        this.add( this.factory.TitleButton('NEXT').xy(72, 44.5).addClass('slide-up').addAction(enter).addAction(leave).addAction(next) );
        this.add( this.factory.TitleButton('SKIP').xy(80, 44.5).addClass('slide-up').addAction(enter).addAction(leave) );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load the pvp/ai selection screen.
     * @param playerModel the PlayerModel used for states
     */
    pvpAi(playerModel) {
        log.info('loaded pvpAi', arguments);
        var vc = this;
        // Actions
        var menu      = this.factory.ClickAction(function() { vc.mainMenu(playerModel) });
        var versusAi  = this.factory.ClickAction(function() { vc.versusAi(playerModel) });
        var versusPvP = this.factory.ClickAction(function() { vc.versusPvP(playerModel) });
        var enter     = this.factory.EnterAction();
        var leave     = this.factory.LeaveAction();
        // Vectors
        this.add( this.factory.Vector().poly([0,0,  55,0,  45,50,  0,50], background1).addClass('slide-right') );
        this.add( this.factory.Vector().poly([55,0, 100,0, 100,50, 45,50], accent).addClass('slide-left') );
        // Buttons
        this.add( this.factory.TitleButton('RETURN').xy(1,  40).addClass('slide-right').addAction(enter).addAction(leave).addAction(menu) );
        this.add( this.factory.TitleButton('PVP'   ).xy(20, 4 ).size(10).class(['large-rotate', 'unselectable', 'slide-right']).addAction(versusAi) );
        this.add( this.factory.TitleButton('AI'    ).xy(70, 37).size(10).class(['large-rotate', 'unselectable', 'slide-right']).addAction(versusPvP) );
        //Images
        this.add( this.factory.Resource('rsc/characters/ai.png' ).xy(55, 10).width(30).height(40).addClass('slide-left') );
        this.add( this.factory.Resource('rsc/characters/pvp.png').xy(5,  10).width(30).height(40).addClass('slide-right') );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load the versus ai screen.
     * @param playerModel the PlayerModel used for states
     */
    versusAi(playerModel) {
        log.info('loaded versusAi', arguments);
        var vc = this;
        // Actions
        var menu  = this.factory.ClickAction(function() { vc.mainMenu(playerModel); });
        var play  = this.factory.ClickAction(function() { new GameController(vc, playerModel, 9); });
        var enter = this.factory.EnterAction();
        var leave = this.factory.LeaveAction();
        // Vectors
        
        // Buttons
        this.add( this.factory.TitleButton('PlAY'  ).xy(40, 40).addClass('slide-right').addAction(enter).addAction(leave).addAction(play) );
        this.add( this.factory.TitleButton('RETURN').xy(1,  40).addClass('slide-right').addAction(enter).addAction(leave).addAction(menu) );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load the verus pvp screen.
     * @param playerModel the PlayerModel used for states
     */
    versusPvP(playerModel) {
        log.info('loaded versusAi', arguments);
        var vc = this;
        // Actions
        var menu  = this.factory.ClickAction(function() { vc.mainMenu(playerModel); });
        var play  = this.factory.ClickAction(function() { new GameController(vc, playerModel, 9, 'AI1'); });
        var enter = this.factory.EnterAction();
        var leave = this.factory.LeaveAction();
        // Vectors
        
        // Buttons
        this.add( this.factory.TitleButton('PlAY'  ).xy(40, 40).addClass('slide-right').addAction(enter).addAction(leave).addAction(play) );
        this.add( this.factory.TitleButton('RETURN').xy(1,  40).addClass('slide-right').addAction(enter).addAction(leave).addAction(menu) );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load the replay list screen.
     * @param playerModel the PlayerModel used for states
     */
    replayList(playerModel) {
        log.info('loaded replayList', arguments);
        // Actions
        var menu  = this.factory.ClickAction(function() { vc.mainMenu(playerModel); });
        var enter = this.factory.EnterAction();
        var leave = this.factory.LeaveAction();
        // Vectors
        
        // Buttons
        this.add( this.factory.TitleButton('RETURN').xy(1, 40).addClass('slide-right').addAction(enter).addAction(leave).addAction(menu) );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load the profile screen.
     * @param playerModel the PlayerModel used for states
     */
    profile(playerModel) {
        log.info('loaded profile', arguments);
        // Actions
        var menu  = this.factory.ClickAction(function() { vc.mainMenu(playerModel); });
        var enter = this.factory.EnterAction();
        var leave = this.factory.LeaveAction();
        // Vectors
        
        // Buttons
        this.add( this.factory.TitleButton('RETURN').xy(1, 40).addClass('slide-right').addAction(enter).addAction(leave).addAction(menu) );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load the credits.
     * @param playerModel the PlayerModel used for states
     */
    credits(playerModel) {
        log.info('loaded credits', arguments);
        // Actions
        var menu  = this.factory.ClickAction(function() { vc.mainMenu(playerModel); });
        var enter = this.factory.EnterAction();
        var leave = this.factory.LeaveAction();
        // Vectors
        
        // Buttons
        this.add( this.factory.TitleButton('RETURN').xy(1, 40).addClass('slide-right').addAction(enter).addAction(leave).addAction(menu) );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Override the current screen directly with HTML to display.
     * @param html the HTML to display
     */
    override(html) {
        log.info('overriding', arguments);
        this.parent.html(html);
    }
    
}
//==========================================================================================================================//