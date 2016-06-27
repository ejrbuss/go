//==========================================================================================================================//
// VISUAL FRAMEWORK                                                                                                                  
//==========================================================================================================================//
// This script file manages the visual components of the go299 board. Go to the following sections for implementation 
// details:
//
// - GLOBALS:               global variable definitions
// - COMPONENT:             class used for all display objects
// - COMPONENT FACTORY:     class used to help build Components
// - VIEW CONTROLLER:       load a specific view
// - GAME VIEW CONTROLLER:  control game view
//
//
// To laod a view:
//
// vc = new ViewController( Jquery selector );
// vc.viewName( args );
//
// Add and modify new views from ViewController.
//
//==========================================================================================================================//
// GLOBALS                                                                                                                  
//==========================================================================================================================//
var id_counter  = 0;             // Ensures Components have a unique id
var background1 = '#000000';    // Black background
var background2 = '#FFFFFF';    // White background
var accent      = '#0000FF';    // Blue accent
var select1     = '#C80164';    // Purple select
var select2     = '#00C864';    // Green select
//==========================================================================================================================//
// UTILITY FUNCTIONS                                                                                                        
//==========================================================================================================================//
function getsetter(object, id, value) {
    if (value == undefined) 
        return object[id];
    object[id] = value;
    return object;
}

function expandProperties(object) {
    $.each(object, function(name, val) {
        object['_' + name + '_'] = val;
        object[name] = function(arg) {
            return getsetter(object, '_' + name + '_', arg);  
        }
    });
}

String.prototype.format = function() {
   var content = this;
   for (var i=0; i < arguments.length; i++) 
        content = content.replace('{' + i + '}', arguments[i]);  
   return content;
};
//==========================================================================================================================//
// COMPONENT                                                                                                        
//==========================================================================================================================//
function Component() {
    
    // Component private fields
    
    this.element      = 'div';
    this.attributes   = '';
    this.html         = '';
    this.x            = null;
    this.y            = null;
    this.z            = null;
    this.width        = null;
    this.height       = null;
    this.opacity      = null;
    this.color        = null;
    this.padding      = null;
    this.skew         = null;
    this.rotate       = null;
    this.shadow       = null;
    this.font         = new Font();
    this.classes      = [];
    this.actions      = [];
    
    expandProperties(this);
    
    this._id_         = (id_counter++).toString();
    var component     = this;
    
    this.addAction = function(action) {
        component._actions_.push(action);
        return component;
    }
    
    this.addClass = function(newClass) {
        component._classes_.push(newClass);
        return component;
    }
    
    this.removeClass = function(oldClass) {
        component._classes_.splice(component._classes_.indexOf(oldClass), 1)
        return component;
    }
    
    this.show = function(container) {
        container.append('<{0} {1} class="{2}" id="{3}">{4}</{0}>'.format(
            component.element(),
            component.attributes(),
            component.classes().join(' '),
            component._id_,
            component.html()
        ));
        component.$ = $( '#' + component._id_ );
        component.$.css({
            'position'       : 'absolute',
            'left'           : component.x(),
            'top'            : component.y(),
            'z-index'        : component.z(),
            'width'          : component.width(),
            'height'         : component.height(),
            'opacity'        : component.opacity(),
            'background'     : component.color(), 
            'padding'        : component.padding(),
            'color'          : component.font().color(),
            'font-family'    : component.font().family(),
            'font-size'      : component.font().size(),
            'font-weight'    : component.font().weight(),
            'font-style'     : component.font().style(),
        });
        if (component.skew() != null)
            component.$.css({
                'transform'  : 'skew(' + component.skew() + ')'            
            });
        if (component.rotate() != null) 
            component.$.css({
                'transform' : 'rotate(' + component.rotate() + ')'
            });
        if (component.shadow() != null)
            component.$.css({
                '-webkit-filter' : 'drop-shadow(1vw 1vw 1vw hsla(0, 0%, 0%, ' + component.shadow() + '))',
                'filter'         : 'drop-shadow(1vw 1vw 1vw hsla(0, 0%, 0%, ' + component.shadow() + '))',
            });
    };

    this.ready = function() {
        $.each(component.actions(), function(i, action) {  
            component.$.ready(function() {
                component.$.on(action.trigger(), function() { action.action()(component); } );
            });
        });
    }
}

function Font() {
    
    this.color  = null;
    this.family = null;
    this.size   = null;
    this.weight = null;
    this.style  = null;
    
    expandProperties(this);
}

function Action() {
    
    this.trigger = 'ready';
    this.action = function() {};
    
    expandProperties(this);
}
//==========================================================================================================================//
// COMPONENT FACTORY                                                                                                        
//==========================================================================================================================//
function ComponentFactory() {
    
    this.vector = function() {
        var component = new Component()
            .element('svg')
            .attributes('viewBox="0 0 100 50" preserveAspectRatio="none"')
            .width('100%')
            .height('100%')
            .shadow('0.2');
        var old = component.show;
        component.poly = function(points, color) {
            component.html(component.html() + '<polygon points="' + points + '" style="fill:' + color + '"/>');
            return component;
        } 
        return component;
    }
    
    this.text = function(text) {
        var component = new Component()
            .z('10')
            .html(text)
            .addClass('unselectable')
            .font(new Font()
                 .color('#FFFFFF')
                 .size('3vw')
                 .style('italic')
            )
        component.color = function(arg) {
            component.font().color(arg);            
            if ( arg == undefined )
                return component._color_;
            return component;
        }
        return component; 
    }
    
    this.title = function(text) {
        return this.text(text)
            .shadow('0.1')
            .addClass('stroke')
            .font(new Font()
                 .color('#FFFFFF')
                 .size('4vw')
                 .style('italic')
            )
    }
    
    this.title_button = function(text, color='#f00', onclick) {
        var component = this.title(text).shadow('0');
        var old = component.show;
        component.show = function(id) {
            old(id);
            component.$.addClass('rotate');
        }
        return component;
    }   
    
    this.input = function() {
        return new Component()
            .z('10')
            .element('input')
            .width('40vw')
            .color('#000000')
            .skew('-10deg')
            .padding('0.3vw')
            .shadow('0.2')
            .font(new Font()
                .size('3vw')
                .color('#FFFFFF')
            );
    }
    
    this.resource = function(path) {
        return new Component()
            .element('img')
            .attributes(' src="' + path + '" ');
    }
    
}
//==========================================================================================================================//
// ViewController                                                                                                        
//==========================================================================================================================//
function ViewController(container) {
    
    var vc         = this;                   // Callback refernce
    this.factory   = new ComponentFactory(); // Component factory
    this.container = container;              // Rendering container
    this.live      = [];                     // Components to render
    this.last      = new Component();
    
    // Render all live components
    this.render = function() {
        this.container.html( '' );
        this.update(this.live);
        this.live = [];
    };
    
    // On the fly add new components
    this.update = function(components) {
        var l = components.length;
        for(var i = 0; i < l; i++)
            components[i].show(this.container);
        for(var i = 0; i < l; i++)
            components[i].ready();
    };
    
    this.add = function(component) {
        this.live.push(component);
        this.last = component;
    }
    
    this.message = function(message, color=background1) {
        // Remove after second animation
        var removeAction = new Action().trigger('animationend').action(function(component) {
            if (component.visited != undefined) 
                component.$. remove();
            component.visited = true;                                                
        });
        var components = [];
        components.push(this.factory.vector().poly('40,0 60,0 60,50 40,50', color).z('60').addClass('banner-transition').skew('-55deg').addAction(removeAction));
        components.push(this.factory.title(message).width('100vw').y('22.5vw').z('61').addClass('text-transition').addAction(removeAction));
        components[1].font().size('5vw');
        this.update(components);
    }
    
    this.login = function() {
        // Actions
        var newAccountAction = new Action().trigger('click').action(function() {
            newAccount($('.username').val().toLowerCase(), $('.password').val().toLowerCase());
        });
        var loginAction = new Action().trigger('click').action(function() {
            login($('.username').val().toLowerCase(), $('.password').val().toLowerCase());
        });
        var focusAction = new Action().action(function(component) {
            component.$.focus();
        });
        // Vectors
        this.add( this.factory.vector()
                 .poly('50,0 70,0 20,20', accent)
                 .poly('7,0 50,0 0,45 0,35', background1)
                 .addClass('slide-down') );
        this.add( this.factory.vector()
                 .poly('35,50 80,40, 80,50', accent)
                 .poly('50,50 100,25 100,50', background1)
                 .addClass('slide-up') );
        // Username/pass entry
        this.add( this.factory.title('USERNAME').x('16vw').y('20vw') );
        this.add( this.factory.title('PASSWORD').x('15vw').y('26vw') );
        this.add( this.factory.input().x('32vw').y('20vw').addClass('username').addAction(focusAction) );
        this.add( this.factory.input().x('31vw').y('26vw').attributes('type="password"').addClass('password') );
        // Buttons
        this.add( this.factory.title_button('NEW ACCOUNT').color(select1).x('43vw').y('31vw').z('51').addAction(newAccountAction) );
        this.add( this.factory.title_button('LOGIN').color(select2).x('63vw').y('31vw').addAction(loginAction) );       
        // Render
        this.render();
    };

    this.menu = function(playerManager) {
        // Actions
        var toStory = new Action().trigger('click').action(function() { vc.levelSelect(playerManager) });
        var toVersus = new Action().trigger('click').action(function() { vc.hotseatAi(playerManager) });
        var toReplay = new Action().trigger('click').action(function() { vc.replay(playerManager) });
        var toProfile = new Action().trigger('click').action(function() { vc.profile(playerManager) });
        var toLogin = new Action().trigger('click').action(function() { vc.login(); });
        var enter = new Action().trigger('mouseenter').action(function(c) { c.$.css({'color' : '#C80164'})});
        var leave = new Action().trigger('mouseleave').action(function(c) { c.$.css({'color' : '#FFFFFF'})});
        // Vectors
        this.add( this.factory.vector()
                 .poly('0,0 12,0, 17,30 0,30', accent)
                 .poly('0,0 3,0 35,50 0,50', background1)
                 .addClass('slide-right') );
        this.add( this.factory.vector()
                 .poly('68,9 94,8 94,14', accent)
                 .poly('65,8 97,14 97,20 60,25', background1)
                 .addClass('slide-left') );
        // Statistics
        this.add( this.factory.text(playerManager.get_username()).color(select1) );
        // TODO parameterize menu items
        this.add( this.factory.title_button('STORY').x('6vw').y('10vw').addAction(enter).addAction(leave).addAction(toStory).addClass('slide-up') );
        this.add( this.factory.title_button('VERSUS').x('9vw').y('15vw').addAction(enter).addAction(leave).addAction(toVersus).addClass('slide-up') );
        this.add( this.factory.title_button('REPLAY').x('12vw').y('20vw').addAction(enter).addAction(leave).addAction(toReplay).addClass('slide-up') );
        this.add( this.factory.title_button('PROFILE').x('15vw').y('25vw').addAction(enter).addAction(leave).addAction(toProfile).addClass('slide-up') );
        this.add( this.factory.title_button('LOGOUT').x('18vw').y('30vw').addAction(enter).addAction(leave).addAction(toLogin).addClass('slide-up') );
        // Render
        this.render();
    };

    this.levelSelect = function(playerManager) {
        var num = new Font() 
            .size('8vw');
        // Actions
        var levelI = new Action().trigger('click').action(function() { vc.story(); });
        var levelII = new Action().trigger('click').action(function() { vc.story(); });
        var levelIII = new Action().trigger('click').action(function() { vc.story(); });
        var levelIV = new Action().trigger('click').action(function() { vc.story(); });
        var levelV = new Action().trigger('click').action(function() { vc.story(); });
        var menu = new Action().trigger('click').action(function() { vc.menu(playerManager); });
        var enter = new Action().trigger('mouseenter').action(function(c) { c.$.css({'color' : '#C80164'})});
        var leave = new Action().trigger('mouseleave').action(function(c) { c.$.css({'color' : '#FFFFFF'})});
        // Vectors
        this.add( new Component().width('100vw').height('50vw').color(accent) );
        // Black backgrounds
        this.add( this.factory.vector()
                 .poly('0,50 10,0  20,0 10,50', background1)
                 .poly('20,50 30,0  40,0 30,50', background1)
                 .poly('40,50 50,0  60,0 50,50', background1)
                 .poly('60,50 70,0  80,0 70,50', background1)
                 .poly('80,50 90,0 100,0 90,50', background1)
                 .z(1).addClass('slide-left') );
        // White backgrounds
        this.add( this.factory.vector()
                 .poly( '0,50    5,25 14.6,27 10,50', background2)
                 .poly('20,50 24.2,29 33.8,31 30,50', background2)
                 .poly('40,50 43.4,33 53.0,35 50,50', background2)
                 .poly('60,50 62.6,37 72.2,39 70,50', background2)
                 .poly('80,50 81.8,41 91.4,43 90,50', background2)
                 .poly('0,25 10,50, 0,50', background1)
                 .z(2).addClass('slide-up') );
        // Levels
        this.add( this.factory.text('I').x('8vw').y('26vw').font(num).color(background1).rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( this.factory.text('II').x('26.5vw').y('30vw').font(num).color(background1).rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( this.factory.text('III').x('45vw').y('34vw').font(num).color(background1).rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( this.factory.text('IV').x('64vw').y('38vw').font(num).color(background1).rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( this.factory.text('V').x('84vw').y('42vw').font(num).color(background1).rotate('11.3deg').addClass('slide-up-rotated') );
        // Buttons
        this.add( this.factory.title_button('REPLAY').x('4vw').y('1vw').addClass('slide-left').addAction(enter).addAction(leave).addAction(levelI) );
        this.add( this.factory.title_button('REPLAY').x('24vw').y('1vw').addClass('slide-left').addAction(enter).addAction(leave).addAction(levelII) );
        this.add( this.factory.title_button('REPLAY').x('44vw').y('1vw').addClass('slide-left').addAction(enter).addAction(leave).addAction(levelIII) );
        this.add( this.factory.title_button('REPLAY').x('64vw').y('1vw').addClass('slide-left').addAction(enter).addAction(leave).addAction(levelIV) );
        this.add( this.factory.title_button('CONTINUE').x('84vw').y('1vw').addClass('slide-left').addAction(enter).addAction(leave).addAction(levelV) );
        this.add( this.factory.title_button('RETURN').x('1vw').y('40vw').addClass('slide-right').addAction(enter).addAction(leave).addAction(menu) );
        // Render
        this.render();
    };

    this.story = function(args) {
    }
        
    this.hotseatAi = function(playerManager) {
        // Actions
        var enter = new Action().trigger('mouseenter').action(function(c) { c.$.css({'color' : '#C80164'})});
        var leave = new Action().trigger('mouseleave').action(function(c) { c.$.css({'color' : '#FFFFFF'})});
        var menu = new Action().trigger('click').action(function() { vc.menu(playerManager); });
        var versusAi = new Action().trigger('click').action(function() { vc.versus(playerManager); });
        var versusPvP = new Action().trigger('click').action(function() { vc.versus(playerManager); });
        // Vectors
        this.add( this.factory.vector().poly('0,0 55,0 45,50 0,50', background1).addClass('slide-right') );
        this.add( this.factory.vector().poly('55,0 100,0, 100,50 45,50', accent).addClass('slide-left') );
        // Buttons
        this.add( this.factory.title_button('RETURN').x('1vw').y('40vw').addClass('slide-right').addAction(enter).addAction(leave).addAction(menu) );
        this.add( this.factory.title_button('PVP').x('20vw').y('4vw').classes(['large-rotate', 'unselectable', 'slide-right']).addAction(versusAi) );
        this.last.font().size('10vw');
        this.add( this.factory.title_button('AI').x('70vw').y('37vw').classes(['large-rotate', 'unselectable', 'slide-right']).addAction(versusPvP) );
        this.last.font().size('10vw');
        // Render
        this.render(); 
    }

    this.versus = function(playerManager) {
        // Actions
        var menu = new Action().trigger('click').action(function() { vc.menu(playerManager); });
        var play = new Action().trigger('click').action(function() { vc.game(playerManager, 9, accent); });
        var enter = new Action().trigger('mouseenter').action(function(c) { c.$.css({'color' : '#C80164'})});
        var leave = new Action().trigger('mouseleave').action(function(c) { c.$.css({'color' : '#FFFFFF'})});
        // Vectors
        
        // Buttons
        this.add( this.factory.title_button('PlAY').x('40vw').y('40vw').addClass('slide-right').addAction(enter).addAction(leave).addAction(play) );
         this.add( this.factory.title_button('RETURN').x('1vw').y('40vw').addClass('slide-right').addAction(enter).addAction(leave).addAction(menu) );
        // Render
        this.render();
    }
    
    this.game = function(playerManager, size, color, background) {
        // Actions
        var quit = new Action().trigger('click').action(function() { vc.versus(playerManager); });
        var enter = new Action().trigger('mouseenter').action(function(c) { c.$.css({'color' : select1})});
        var enter2 = new Action().trigger('mouseenter').action(function(c) { c.$.css({'color' : select2})});
        var leave = new Action().trigger('mouseleave').action(function(c) { c.$.css({'color' : background2})});
        // Vectors
        this.add( this.factory.vector().poly('0,25 10,0, 0,0', background1).addClass('slide-right') );
        this.add( this.factory.vector()
                 .poly('35,0, 75,0 65,50 25,50', background1)
                 .poly('3,41 4,46 20,45, 23,41', background1)
                 .poly('97,41 96,46 80,45 77,41', background1)
                 .z(2).addClass('slide-up') 
        );
        // Board
        size -= 1;
        var side = (40 / size) - (5 / size);
        this.add( this.factory.vector().addClass('slide-up').x('30vw').y('5vw').z(3) );
        for(var y = 0; y < 40; y += 40 / size) 
            for(var x = 0; x < 40; x += 40 / size) 
                    this.last.poly(x + ',' + (y + side) + ' ' + x + ',' + y + ' ' + (x + side) + ',' + y + ' ' + (x + side) + ',' + (y + side), color)
        // Text
        this.add( this.factory.text('PLAYER 1').x('5vw').y('41.5vw').addClass('slide-up') );
        this.add( this.factory.text('PLAYER 2').x('81vw').y('41.5vw').addClass('slide-up') );
        // Buttons
        this.add( this.factory.title_button('QUIT').x('3vw').y('5vw').addClass('slide-right').addAction(enter).addAction(leave).addAction(quit) );
        this.add( this.factory.title_button('PASS').x('62vw').y('45vw').addClass('slide-right').addAction(enter2).addAction(leave) );
        // Render
        this.render();
        // Start Game Manager
        new GameManager(new GameViewController(this, size), 9, 'AI5');
    }
    
    this.listReplays = function(args) {
        
    }

    this.replay = function(args) {

    }
    
    this.profile = function(playerManager) {
        // Actions
        var enter = new Action().trigger('mouseenter').action(function(c) { c.$.css({'color' : '#C80164'})});
        var leave = new Action().trigger('mouseleave').action(function(c) { c.$.css({'color' : '#FFFFFF'})});
        var menu = new Action().trigger('click').action(function() { vc.menu(playerManager); });
        // Vectors
        // Buttons
        this.add( this.factory.title_button('RETURN').x('1vw').y('40vw').addClass('slide-right').addAction(enter).addAction(leave).addAction(menu) );
        // Render
        this.render();
    }
    
    this.override = function(html) {
        this.container.html(html);
    }
    
    this.launch = function() {
        this.container = $( this.container );
        vc.login();
    }

}
//==========================================================================================================================//
// ViewController                                                                                                        
//==========================================================================================================================//
function GameViewController(vc, size) {
    
    this.turn = function(player, turn) {
        
    }
    
    this.illegal = function(move) {
        
    }
    
    this.capture = function(move) {
        
    }
    
    this.victory = function() {
        
    }
    
    this.lose = function() {
        
    }
     
}