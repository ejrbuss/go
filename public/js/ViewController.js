'use strict'
//==========================================================================================================================//
//     _    ___                 ______            __             ____         
//    | |  / (_)__ _      __   / ____/___  ____  / /__________  / / /__  _____
//    | | / / / _ \ | /| / /  / /   / __ \/ __ \/ __/ ___/ __ \/ / / _ \/ ___/     
//    | |/ / /  __/ |/ |/ /  / /___/ /_/ / / / / /_/ /  / /_/ / / /  __/ /         
//    |___/_/\___/|__/|__/   \____/\____/_/ /_/\__/_/   \____/_/_/\___/_/                                                                           
//
//==========================================================================================================================//
// Manages views.
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
        this.reload = function() {};
        
        log.debug('Currently booting straight to the main menu');
        this.login(); // Uncomment this line and remove the following to load normally
        //this.mainMenu(new PlayerModel('debug'));
    }
    
    //======================================================================================================================//
    // UTILITY
    //======================================================================================================================//
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
     * Override the current screen directly with HTML to display.
     * @param html the HTML to display
     */
    override(html) {
        log.info('overriding', arguments);
        this.parent.html(html);
    }

    message(message, background=background1, color=background2) {
        var lock = this.message;
        var vc = this;
        if(lock.blocked == undefined) {
            lock.blocked = true;
            var off = new Action().trigger('animationend').action(function(component) {
                var remove = new Action().trigger('animationend').action(function(component) {
                    component.$.remove();    
                    lock.blocked = undefined;
                });
                component.$.remove();
                vc.add( ComponentFactory.Vector().poly([68,5, 100,7, 100,12, 66,12], background).z(60).addClass('slide-right-off').addAction(remove) );
                vc.add( ComponentFactory.Text(message, color).xyz(68, 7.5, 61).addClass('slide-right-off').addAction(remove) );

                vc.update();
            });
            this.add( ComponentFactory.Vector().poly([68,5, 100,7, 100,12, 66,12], background).z(60).addClass('slide-left').addAction(off) );
            this.add( ComponentFactory.Text(message, color).xyz(68, 7.5, 61).addClass('slide-left').addAction(off) );

            this.update();
        }
    }
    
    //======================================================================================================================//
    // MENUS
    //======================================================================================================================//
    /**
     * Load the login screen.
     */
    login() {
        log.info('loaded login');
        // Reload function
        this.reload = function() {
            this.login();
        }
        // Actions
        var newAccountAction = ComponentFactory.ClickAction(function() { newAccount($('.username').val().toLowerCase(), $('.password').val().toLowerCase()); });
        var loginAction = ComponentFactory.ClickAction(function() { login($('.username').val().toLowerCase(), $('.password').val().toLowerCase()); });
        // Vectors
        this.add( ComponentFactory.Vector()
                 .poly([50,0, 70,0, 20,20], accent)
                 .poly([7,0,  50,0, 0,45, 0,35], background1)
                 .addClass('slide-down') );
        this.add( ComponentFactory.Vector()
                 .poly([35,50, 80,40,  80,50], accent)
                 .poly([50,50, 100,25, 100,50], background1)
                 .addClass('slide-up') );
        // Username/pass entry
        this.add( ComponentFactory.Title('USERNAME').xy(16, 20) );
        this.add( ComponentFactory.Title('PASSWORD').xy(15, 26) );
        this.add( ComponentFactory.Input().xy(32, 20).addClass('username').addAction(ComponentFactory.FocusAction()) );
        this.add( ComponentFactory.Password().xy(31, 26).addClass('password') );
        // Buttons
        this.add( ComponentFactory.TitleButton('NEW ACCOUNT', select1, select1).xyz(43, 31, 51).addAction(newAccountAction) );
        this.add( ComponentFactory.TitleButton('LOGIN', select2, select2).xy(63, 31).addAction(loginAction) );
        // Images
        this.add( ComponentFactory.Resource('/rsc/icons/logo.png').xy(20, -5).width(28).addClass('slide-down') );
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
        // Reload function
        this.reload = function() {
            this.mainMenu(playerModel);
        }
        var vc = this;
        // Actions
        var toStory   = ComponentFactory.ClickAction(function() { vc.levelSelect(playerModel) });
        var toVersus  = ComponentFactory.ClickAction(function() { vc.pvpAi(playerModel) });
        var toReplay  = ComponentFactory.ClickAction(function() { vc.replayList(playerModel) });
        var toProfile = ComponentFactory.ClickAction(function() { vc.profile(playerModel, null, null) });
        var toLogin   = ComponentFactory.ClickAction(function() { vc.login(); });
        // Vectors
        this.add( ComponentFactory.Vector()
                 .poly([0,0, 12,0, 17,30, 0,30], accent)
                 .poly([0,0, 3,0,  35,50, 0,50], background1)
                 .addClass('slide-right') );
        this.add( ComponentFactory.Vector()
                 .poly([68,9, 94,8,  94,14], accent)
                 .poly([65,8, 97,14, 97,20, 60,23], background1)
                 .circle(85.5, 14, 3, '#444')
                 .circle(86, 14.5, 2.5, background1)
                 .addClass('slide-left') );
		// Text
        this.add( ComponentFactory.Text('PLAYING AS').xy(72, 8.5).addClass('slide-left') );
        this.add( ComponentFactory.Text(playerModel.username(), select1).xy(83, 8.5).addClass('slide-left').weight('bold') );
        this.add( ComponentFactory.Text('RANK', '#444').xy(84, 14).size(5).addClass('slide-left') );
        this.add( ComponentFactory.Text(playerModel.lrank(), select2).size(4).xy(80, 16).width(16).addClass('slide-left') );   
        this.add( ComponentFactory.Text('W/L'     ).xy(66,   12  ).size(2).addClass('slide-left') );
        this.add( ComponentFactory.Text('K/D'     ).xy(65.5, 14.5).size(2).addClass('slide-left') );
        this.add( ComponentFactory.Text('PROGRESS').xy(65,   17).size(2).addClass('slide-left') );
        this.add( ComponentFactory.Text(playerModel.winLoss(), select1  ).xy(73.5, 12).size(2).addClass('slide-left') );
        this.add( ComponentFactory.Text(playerModel.killDeath(), select1).xy(73,   14.5).size(2).addClass('slide-left') );
        this.add( ComponentFactory.Text(playerModel.progress(), select1 ).xy(72.6, 17).size(2).addClass('slide-left') );
        // Buttons
        this.add( ComponentFactory.TitleButton('STORY'  ).xy(6,  10).addAction(toStory).addClass('slide-up') );
        this.add( ComponentFactory.TitleButton('VERSUS' ).xy(9,  15).addAction(toVersus).addClass('slide-up') );
        this.add( ComponentFactory.TitleButton('REPLAY' ).xy(12, 20).addAction(toReplay).addClass('slide-up') );
        this.add( ComponentFactory.TitleButton('PROFILE').xy(15, 25).addAction(toProfile).addClass('slide-up') );
        this.add( ComponentFactory.TitleButton('LOGOUT' ).xy(18, 30).addAction(toLogin).addClass('slide-up') );
        // Images
        this.add(ComponentFactory.Background('mainmenu').xy(20, 15).width(70).addClass('slide-up') );
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
        // Reload function
        this.reload = function() {
            this.levelSelect(playerModel);
        }
        var vc = this;
        // Actions
        var levelI   = ComponentFactory.ClickAction(function() { vc.story(playerModel, 0, 0)});
        var levelII  = ComponentFactory.ClickAction(function() { vc.story(playerModel, 1, 0)});
        var levelIII = ComponentFactory.ClickAction(function() { vc.story(playerModel, 2, 0)});
        var levelIV  = ComponentFactory.ClickAction(function() { vc.story(playerModel, 3, 0)});
        var levelV   = ComponentFactory.ClickAction(function() { vc.story(playerModel, 4, 0)});
        var menu     = ComponentFactory.ClickAction(function() { vc.mainMenu(playerModel); });
        // Vectors
        this.add( new Component().width(100).height(50).background(accent) );
        // Black backgrounds
        this.add( ComponentFactory.Vector()
                 .poly([0,50,  10,0,  20,0,  10,50], background1)
                 .poly([20,50, 30,0,  40,0,  30,50], background1)
                 .poly([40,50, 50,0,  60,0,  50,50], background1)
                 .poly([60,50, 70,0,  80,0,  70,50], background1)
                 .poly([80,50, 90,0,  100,0, 90,50], background1)
                 .z(1).addClass('slide-left') );
        // White backgrounds and characters
        this.add( ComponentFactory.Character('level1').xyz(3, 7, 2).width(18).addClass('slide-up') ); 
        var white = ComponentFactory.Vector()
                 .poly([0,50,  5,25,    14.6,27, 10,50], background2)
                 .poly([0,25,  10,50,   0,50], background1)
                 .z(3).addClass('slide-up');
        if (playerModel.levels() > 0) {  
            white.poly([20,50, 24.2,29, 33.8,31, 30,50], background2)
            this.add( ComponentFactory.Character('level2').xyz(21.5, 7, 2).width(18).addClass('slide-up') );
            this.add( ComponentFactory.TitleButton('REPLAY').xy(4, 1).addClass('slide-left').addAction(levelI) );
        } else if (playerModel.levels() == 0) {
            this.add( ComponentFactory.TitleButton('CONTINUE').xy(4, 1).addClass('slide-left').addAction(levelI) );
        }
        if (playerModel.levels() > 1) {
            white.poly([40,50, 43.4,33, 53.0,35, 50,50], background2)
            this.add( ComponentFactory.Character('level3').xyz(40, 14, 2).width(18).addClass('slide-up') );
            this.add( ComponentFactory.TitleButton('REPLAY').xy(24, 1).addClass('slide-left').addAction(levelII) );
        } else if (playerModel.levels() == 1) {
            this.add( ComponentFactory.TitleButton('CONTINUE').xy(24, 1).addClass('slide-left').addAction(levelII) );
        }
        if (playerModel.levels() > 2) {
            white.poly([60,50, 62.6,37, 72.2,39, 70,50], background2)
            this.add( ComponentFactory.Character('level4').xyz(61.5, 16, 2).width(18).addClass('slide-up') );
            this.add( ComponentFactory.TitleButton('REPLAY').xy(44, 1).addClass('slide-left').addAction(levelIII) );   
        } else if (playerModel.levels() == 2) {
            this.add( ComponentFactory.TitleButton('CONTINUE').xy(44, 1).addClass('slide-left').addAction(levelIII) );
        }
        if (playerModel.levels() > 3) { 
            white.poly([80,50, 81.8,41, 91.4,43, 90,50], background2)
            this.add( ComponentFactory.Character('level5').xyz(76, 19, 2).width(18).addClass('slide-up') );
            this.add( ComponentFactory.TitleButton('REPLAY').xy(64, 1).addClass('slide-left').addAction(levelIV) );
        } else if (playerModel.levels() == 3) {
            this.add( ComponentFactory.TitleButton('CONTINUE').xy(64, 1).addClass('slide-left').addAction(levelIV) );
        }
        if (playerModel.levels() > 4) { 
            this.add( ComponentFactory.TitleButton('REPLAY').xy(84, 1).addClass('slide-left').addAction(levelV) );
        } else if (playerModel.levels() == 4) {
            this.add( ComponentFactory.TitleButton('CONTINUE').xy(84, 1).addClass('slide-left').addAction(levelV) );
        }
        this.add( white );
        // Levels
        this.add( ComponentFactory.Text('I',   background1).xy(8,    26).size(8).style('normal').rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( ComponentFactory.Text('II',  background1).xy(26.5, 30).size(8).style('normal').rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( ComponentFactory.Text('III', background1).xy(45,   34).size(8).style('normal').rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( ComponentFactory.Text('IV',  background1).xy(64,   38).size(8).style('normal').rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( ComponentFactory.Text('V',   background1).xy(84,   42).size(8).style('normal').rotate('11.3deg').addClass('slide-up-rotated') );
        // Buttons
        this.add( ComponentFactory.TitleButton('RETURN').xy(1, 40).addClass('slide-right').addAction(menu) );
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
        // Reload function
        this.reload = function() {
            this.story(playerModel, level, scene);
        }
        var vc = this;
        // Actions
        var skip = ComponentFactory.ClickAction(function() { 
            log.debug('Skipping', story[level].game);
            if ( story[level].game ) {
                new GameController(
                    vc, 
                    playerModel, 
                    story[level].game.size, 
                    story[level].game.ai, 
                    function(){ vc.levelSelect(playerModel); },
                    function(){ story[level].next(vc, playerModel); },
                    story[level].game.stageID
                );
            } else {
                story[level].next(vc, playerModel);
            }
        });
        if (story[level].scenes.length <= scene) {
            skip.action()();
            return;
        }
        var next = ComponentFactory.ClickAction(function () {
            vc.story(playerModel, level, scene + 1);    
        });
        var data  = story[level].scenes[scene];
        var quit  = ComponentFactory.ClickAction(function() { vc.levelSelect(playerModel); });
        var typed = new Action().trigger('ready').action(function(component) {
            component.$.typed({
                strings: [data.text],
                typeSpeed: 0
            }); 
        }); 
        // Vectors
        vc.add( ComponentFactory.Vector().poly([0,25, 10,0, 0,0], background1).z(1).addClass('slide-right') );
        vc.add( ComponentFactory.Vector()
            .poly([40,38, 87,35, 88,47], data.color)
            .poly([8,47, 12,34, 90,41, 90,47], background1)
            .z(1).addClass('slide-up') );
        // Images
        if (data.background)
            this.add( ComponentFactory.Background(data.background) );
        if (data.character)
            this.add( ComponentFactory.Character(data.character).xy(65, 9).width(25).addClass('slide-up') );
        // Text
        this.add( ComponentFactory.Text(data.name).size(4).xy(70, 35.5).width(18).addClass('slide-up') ); 
        this.add( ComponentFactory.Text().element('pre').size(2).family('sans-serif').xy(13, 39).addClass('slide-up').addAction(typed) );
        // Buttons
        this.add( ComponentFactory.TitleButton('QUIT').xy(3, 5).addClass('slide-right').addAction(quit) );
        this.add( ComponentFactory.TitleButton('NEXT').xy(72, 44.5).addClass('slide-up').addAction(next) );
        this.add( ComponentFactory.TitleButton('SKIP').xy(80, 44.5).addClass('slide-up').addAction(skip) );
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
        // Reload function
        this.reload = function() {
            this.pvpAi(playerModel);
        }
        var vc = this;
        // Actions
        var menu      = ComponentFactory.ClickAction(function() { vc.mainMenu(playerModel) });
        var versusAi  = ComponentFactory.ClickAction(function() { vc.versusAi(playerModel) });
        var versusPvP = ComponentFactory.ClickAction(function() { vc.versusPvP(playerModel) });
        // Vectors
        this.add( ComponentFactory.Vector().poly([0,0,  55,0,  45,50,  0,50], background1).addClass('slide-right') );
        this.add( ComponentFactory.Vector().poly([55,0, 100,0, 100,50, 45,50], accent).addClass('slide-left') );
        // Buttons
        this.add( ComponentFactory.TitleButton('RETURN').xy(1,  40).addClass('slide-right').addAction(menu) );
        this.add( ComponentFactory.LargeTitleButton('PVP').xy(20, 4 ).addClass('slide-right').addAction(versusPvP) );
        this.add( ComponentFactory.LargeTitleButton('AI' ).xy(70, 37).addClass('slide-left').addAction(versusAi) );
        //Images
        this.add( ComponentFactory.Character('pvp').xy(5,  10).width(30).addClass('slide-right') );
        this.add( ComponentFactory.Character('ai' ).xy(55, 10).width(30).addClass('slide-left') );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load the verus pvp screen.
     * @param playerModel the PlayerModel used for states
     */
    versusPvP(playerModel) {
        log.info('loaded versusPvP', arguments);
        // Reload function
        this.reload = function() { this.versusPvP(playerModel); };
        var size = {
            '9✕9': 9, '13✕13': 13, '19✕19': 19,
            'right': { '9✕9': '13✕13', '13✕13': '19✕19', '19✕19': '9✕9' },
            'left':  { '9✕9': '19✕19', '19✕19': '13✕13', '13✕13': '9✕9' }
        }
        var vc = this;
        var stageID = 1;
        // Actions
        var menu  = ComponentFactory.ClickAction(function() { vc.mainMenu(playerModel); });
        var play  = ComponentFactory.ClickAction(function() { 
            new GameController(
                vc, playerModel, 
                size[$('.size').text()], 
                null, 
                function(){ vc.versusPvP(playerModel); }, 
                undefined, 
                stageID); 
        });
        var stageSelect = ComponentFactory.ClickAction(function(component) {
            stageID = parseInt(component.recieve());
            $( '.stage' ).addClass('unselected');
            component.$.removeClass('unselected');
        });
        var sizeSelect = new Action().trigger('mouseenter').action(function(component) {
            $( '#' + component.id() + ' polygon' ).css('fill', select1);
        })
        var sizeLeave = new Action().trigger('mouseleave').action(function(component) {
            $( '#' + component.id() + ' polygon' ).css('fill', background1);
        });
        var direction = function(direction) {
            return ComponentFactory.ClickAction(function(component) {
                $('.size').text(size[direction][$('.size').text()]); 
                log.info('size: ' + $('.size').text());
            });
        }
        // Vectors
        this.add( ComponentFactory.Vector()
            .poly([0,5, 0,50, 7,50], accent)
            .poly([32,0, 76,0, 66,50, 22,50], background1)
            .poly([0,25,  10,50,   0,50], background1)
            .addClass('slide-right') );
        this.add( ComponentFactory.Vector()
             .poly([83,30, 85,29, 85,31], background1)
             .z(61).addClass('slide-right').addAction(sizeSelect).addAction(sizeLeave).addAction(direction('left')) );
        this.add( ComponentFactory.Vector()
             .poly([93,30, 91,29, 91,31], background1)
             .z(61).addClass('slide-right').addAction(sizeSelect).addAction(sizeLeave).addAction(direction('right')) );
        // Selections
        this.add( ComponentFactory.SelectStage('select1', 0).xy(17, 13).addAction(stageSelect).removeClass('unselected') );
        this.add( ComponentFactory.SelectStage('select2', 1).xy(29, 13).addAction(stageSelect) );
        this.add( ComponentFactory.SelectStage('select3', 2).xy(41, 13).addAction(stageSelect) );
        this.add( ComponentFactory.SelectStage('select4', 3).xy(53, 13).addAction(stageSelect) );
        this.add( ComponentFactory.SelectStage('select5', 4).xy(65, 13).addAction(stageSelect) );
        // Buttons
        this.add( ComponentFactory.LargeTitleButton('PlAY', background1).xy(80, 19).style('normal').addClass('slide-right').addAction(play) );
        this.add( ComponentFactory.Text('9✕9', background1).size(2).xy(83, 28.7).addClass('slide-right size').width(10) );
        this.add( ComponentFactory.TitleButton('RETURN').xy(1,  40).addClass('slide-right').addAction(menu) );
        this.add( new Component().xyz(80, 28, 60).width(15).height(5) );
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
        // Reload function
        this.reload = function() { this.versusAi(playerModel); };
        var size = {
            '9✕9': 9, '13✕13': 13, '19✕19': 19,
            'right': { '9✕9': '13✕13', '13✕13': '19✕19', '19✕19': '9✕9' },
            'left':  { '9✕9': '19✕19', '19✕19': '13✕13', '13✕13': '9✕9' }
        }
        var vc = this;
        var aiID = 0;
        var stageID = 0;
        // Actions
        var menu   = ComponentFactory.ClickAction(function() { vc.mainMenu(playerModel); });
        var play   = ComponentFactory.ClickAction(function() { 
            new GameController(
                vc, playerModel, 
                size[$('.size').text()], 
                aiID, 
                function(){ vc.versusAi(playerModel); }, 
                undefined, 
                stageID); 
        });
        var aiSelect = ComponentFactory.ClickAction(function(component) {
            aiID = component.recieve();
            $( '.ai' ).addClass('unselected');
            component.$.removeClass('unselected')
        });
        var stageSelect = ComponentFactory.ClickAction(function(component) {
            stageID = component.recieve();
            $( '.stage' ).addClass('unselected');
            component.$.removeClass('unselected')
        });
        var sizeSelect = new Action().trigger('mouseenter').action(function(component) {
            $( '#' + component.id() + ' polygon' ).css('fill', select1);
        })
        var sizeLeave = new Action().trigger('mouseleave').action(function(component) {
            $( '#' + component.id() + ' polygon' ).css('fill', background1);
        });
        var direction = function(direction) {
            return ComponentFactory.ClickAction(function(component) {
                $('.size').text(size[direction][$('.size').text()]); 
                log.info('size: ' + $('.size').text());
            });
        }
        // Vectors
        this.add( ComponentFactory.Vector()
            .poly([0,5, 0,50, 7,50], accent)
            .poly([32,0, 76,0, 66,50, 22,50], background1)
            .poly([0,25,  10,50,   0,50], background1)
            .addClass('slide-right') );
        this.add( ComponentFactory.Vector()
             .poly([83,30, 85,29, 85,31], background1)
             .z(61).addClass('slide-right').addAction(sizeSelect).addAction(sizeLeave).addAction(direction('left')) );
        this.add( ComponentFactory.Vector()
             .poly([93,30, 91,29, 91,31], background1)
             .z(61).addClass('slide-right').addAction(sizeSelect).addAction(sizeLeave).addAction(direction('right')) );
        // Selections
        this.add( ComponentFactory.SelectAi('select1', 0).xy(20, 2).addAction(aiSelect).removeClass('unselected') );
        this.add( ComponentFactory.SelectAi('select2', 1).xy(32, 2).addAction(aiSelect) );
        this.add( ComponentFactory.SelectAi('select3', 2).xy(44, 2).addAction(aiSelect) );
        this.add( ComponentFactory.SelectAi('select4', 3).xy(56, 2).addAction(aiSelect) );
        this.add( ComponentFactory.SelectAi('select5', 4).xy(68, 2).addAction(aiSelect) );
        this.add( ComponentFactory.SelectStage('select1', 0).xy(20, 26).addAction(stageSelect).removeClass('unselected') );
        this.add( ComponentFactory.SelectStage('select2', 1).xy(32, 26).addAction(stageSelect) );
        this.add( ComponentFactory.SelectStage('select3', 2).xy(44, 26).addAction(stageSelect) );
        this.add( ComponentFactory.SelectStage('select4', 3).xy(56, 26).addAction(stageSelect) );
        this.add( ComponentFactory.SelectStage('select5', 4).xy(68, 26).addAction(stageSelect) );   
        
        this.add( ComponentFactory.Text('9✕9', background1).size(2).xy(83, 28.7).addClass('slide-right size').width(10) );
        this.add( ComponentFactory.LargeTitleButton('PLAY', background1).xy(80, 19).style('normal').addClass('slide-right').addAction(play) );
        this.add( ComponentFactory.TitleButton('RETURN').xy(1,  40).addClass('slide-right').addAction(menu) );
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
        // Reload function
        this.reload = function() {
            this.replayList(playerModel);
        }
        var vc = this;
        var replayAction = function() {};
        // Actions
        var menu   = ComponentFactory.ClickAction(function() { vc.mainMenu(playerModel); });
        var enter  = ComponentFactory.EnterAction(select1);
        var leave  = ComponentFactory.LeaveAction();
        var replay = ComponentFactory.ClickAction(function() { replayAction() });
        
        // Vectors
        this.add( ComponentFactory.Vector().poly([0,0,     50,0,  35,50,  0,50], background1).z(1).addClass('slide-right') );
        this.add( ComponentFactory.Vector().poly([100,50,  100,25,  90,50], background1).z(2).addClass('slide-left') );
        // Background
        this.add( ComponentFactory.Background(stages[0].background).addClass('match') );
        
        // Helper Functinos
        function setReplay(match) {
            replayAction = function() { vc.replayGame(match, playerModel); };
        }

        function select(match) {
            return ComponentFactory.ClickAction(function(component) {
                setReplay(match);
                $('.match').remove()
                $('.replay').css('background', '');
                component.$.css('background', select2);
                var player2 = {'Player 2': 'player1', 'AI1': 1, 'AI2': 2, 'AI3': 3, 'AI4': 4, 'AI5': 5}[match.player2];
                vc.add( ComponentFactory.Background(stages[match.stageID].background).addClass('match') );
                vc.add( ComponentFactory.Title('VS').size(10).xy(67.5, 30).addClass('slide-up match') );
                vc.add( ComponentFactory.Character('player1').xy(50, 21).height(30).addClass('slide-up match') );
                vc.add( ComponentFactory.Character(player2  ).xy(75, 21).height(30).addClass('slide-up match') );
                vc.update();
            });
        }
        // Replay List
        var rc = new ReplayList(playerModel.username(), function() {
            if(rc.matchList.length > 0) {
                var replayList = ComponentFactory.List().background(background1).xy(15, 3).width(40).height(44).addClass('slide-right');
                $.each(rc.matchList, function(_, match) {
                    log.info(match);
                    replayList.addComponent( ComponentFactory.ListElement('{0} vs. {1} - {2}'.format(
                            match.player1, 
                            match.player2, 
                            new Date(match.time).toLocaleString()
                        )).addAction(enter).addAction(leave).addAction(select(match)).addClass('replay')
                    );
                });     
                vc.add(replayList);
            } else {
                log.debug('No games found in database for replay.');
                var noneFound = ComponentFactory.Text('No games found!');
                vc.add(noneFound.background(background1).xy(15, 3).width(40).height(44).addClass('slide-right'));
            }            
            // Buttons
            vc.add( ComponentFactory.TitleButton('RETURN').xy(1, 40).addClass('slide-right').addAction(enter).addAction(leave).addAction(menu) );
            vc.add( ComponentFactory.TitleButton('REPLAY').xy(88, 40).addClass('slide-left').addAction(enter).addAction(leave).addAction(replay) );
            // Render
            vc.clear();
            vc.update();
            select(rc.matchList[0]).action()(replayList.component()[0]);
        });
    }

   /*
     * Starts a replay of a game, given its gameID.
     * @param match An object containing information about the match to be replayed.
     */

    replayGame(match, playerModel) {
        log.info('loaded replayGame', arguments);
        var vc = this;
        var play = new ReplayController(this, match.player1, match.player2, match._id, match.size, function() {vc.replayList(playerModel)}, match.stageID);
           
    }

    /**
     * Load the profile screen.
     * @param playerModel the PlayerModel used for states
     */
    profile(playerModel) {
        log.info('loaded profile', arguments);
        // Reload function
        this.reload = function() {
            this.profile(playerModel);
        }
        var vc = this;
        // Actions
        var menu  = ComponentFactory.ClickAction(function() { vc.mainMenu(playerModel); });
        // Vectors
        this.add( ComponentFactory.Vector()
            .poly([0,0, 30,0, 20,50, 0,50], background1)
            .addClass('slide-right') );
        this.add( ComponentFactory.TitleButton('RETURN').xy(15, 40).addClass('slide-right').addAction(menu) );
        // Text
        this.add( ComponentFactory.Text(playerModel.username(), select1).size(10).xy(2, 1).addClass('slide-right') );
        this.add( ComponentFactory.Text('Progress').size(2.5).xy(2, 12).addClass('slide-right') );
        this.add( ComponentFactory.Text('Win / Loss').size(2.5).xy(2, 15.5).addClass('slide-right') );
        this.add( ComponentFactory.Text('Kill / Death').size(2.5).xy(2, 19).addClass('slide-right') );
        this.add( ComponentFactory.Text('Current Streak').size(2.5).xy(2, 22.5).addClass('slide-right') );
        this.add( ComponentFactory.Text('Longest Streak').size(2.5).xy(2, 26).addClass('slide-right') );
        
        this.add( ComponentFactory.Text(playerModel.progress(), select1).size(2.5).xy(16, 12).addClass('slide-right') );
        this.add( ComponentFactory.Text(playerModel.winLoss(), select1).size(2.5).xy(16, 15.5).addClass('slide-right') );
        this.add( ComponentFactory.Text(playerModel.killDeath(), select1).size(2.5).xy(16, 19).addClass('slide-right') );
        this.add( ComponentFactory.Text(playerModel.currentStreak(), select1).size(2.5).xy(16, 22.5).addClass('slide-right') );
        this.add( ComponentFactory.Text(playerModel.longestStreak(), select1).size(2.5).xy(16, 26).addClass('slide-right') );
        // Leaderboards
        var totalscores = function(leaderboard) {
            log.info('Loaded total scores leaderboard', leaderboard);
            vc.add( ComponentFactory.Vector()
                .poly([35,0, 65,0, 55,50, 25,50], background1)
                .addClass('slide-left') );
            vc.add( ComponentFactory.Text('TOTALSCORE').size(5).xy(37, 2).addClass('slide-left') );
            var seen = false;
            for(var i = 0; i < 9 && i < leaderboard.length; i++) {
                var y = i * 4 + 8;
                var x = i * -0.8 + 36;
                var c = leaderboard[i].username == playerModel.username() ? select1 : select2;
                seen |= leaderboard[i].username == playerModel.username();
                vc.add( ComponentFactory.Text(i + 1, '#444').xy(x, y).addClass('slide-left') )
                vc.add( ComponentFactory.Text(leaderboard[i].username, c).xy(x + 2, y).addClass('slide-left') );
                vc.add( ComponentFactory.Text(leaderboard[i].totalScore).xy(x + 15, y).addClass('slide-left') );
            }
            if (!seen) {
                vc.add( ComponentFactory.Text(playerModel.lrank(), '#444').xy(27, 44).addClass('slide-left') )
                vc.add( ComponentFactory.Text(playerModel.username(), select1).xy(30.8, 44).addClass('slide-left') );
                vc.add( ComponentFactory.Text(playerModel.totalScore()).xy(43.8, 44).addClass('slide-left') );
            }
            vc.update();
        }
        var highscores = function(leaderboard) {
            log.info('Loaded high scores leaderboard', leaderboard);
            vc.add( ComponentFactory.Vector()
                .poly([70,0, 100,0, 90,50, 60,50], background1)
                .addClass('slide-left') );
            vc.add( ComponentFactory.Text('HIGHSCORE').size(5).xy(72, 2).addClass('slide-left') );
            var seen = false;
            for(var i = 0; i < 9 && i < leaderboard.length; i++) {
                var y = i * 4 + 8;
                var x = i * -0.8 + 71;
                var c = leaderboard[i].username == playerModel.username() ? select1 : select2;
                seen |= leaderboard[i].username == playerModel.username();
                vc.add( ComponentFactory.Text(i + 1, '#444').xy(x, y).addClass('slide-left') )
                vc.add( ComponentFactory.Text(leaderboard[i].username, c).xy(x + 2, y).addClass('slide-left') );
                vc.add( ComponentFactory.Text(leaderboard[i].highscore).xy(x + 15, y).addClass('slide-left') );
            }
            if (!seen) {
                vc.add( ComponentFactory.Text(playerModel.hrank(), '#444').xy(62, 44).addClass('slide-left') )
                vc.add( ComponentFactory.Text(playerModel.username(), select1).xy(65.8, 44).addClass('slide-left') );
                vc.add( ComponentFactory.Text(playerModel.highscore()).xy(78.8, 44).addClass('slide-left') );
            }
            vc.update();
        }
        var callback = function(leaderboard) {
            var leaderboardList = ComponentFactory.List().background(accent).width(40).height(20);
            for(var i = 0; i< leaderboard.length; i++) {
                leaderboardList.addComponent(ComponentFactory.Text(leaderboard[i].username).element('li').position('relative'));
            }
            vc.add(leaderboardList);
            vc.update();
        }
        
        // Render
        this.clear();
        this.update();
        
        playerModel.stats('l', totalscores);
        playerModel.stats('h', highscores);
    }
    
    /**
     * Load the credits.
     * @param playerModel the PlayerModel used for states
     */
    credits(playerModel) {
        log.info('loaded credits', arguments);
        // Reload function
        this.reload = function() {
            this.credits(playerModel);
        }
        // Actions
        var menu  = ComponentFactory.ClickAction(function() { vc.mainMenu(playerModel); });
        // Vectors
        
        // Buttons
        this.add( ComponentFactory.TitleButton('RETURN').xy(1, 40).addClass('slide-right').addAction(menu) );
        
        // Render
        this.clear();
        this.update();
    }
    
}
//==========================================================================================================================//