//==========================================================================================================================//
// VISUAL FRAMEWORK                                                                                                                  
//==========================================================================================================================//
// This script file manages the visual components of the go299 board. Go to the following sections for implementation 
// details:
//
// - GLOBALS:           global variable definitions
// - COMPONENT:         class used for all display objects
// - COMPONENT FACTORY: class used to help build Components
// - VIEW CONTROLLER:   load a specific view
//
// To laod a view:
//
// vc = new ViewController( Jquery selector );
// vc.viewName( args );
//
// Add and modify new views from ViewController.
//
//
//==========================================================================================================================//
// GLOBALS                                                                                                                  
//==========================================================================================================================//
var id_counter = 0; // Ensures Components have a unique id
var background1 = '#000000';
var background2 = '#FFFFFF';
var accent      = '#0000FF';
var select1     = '#C80164';
var select2     = '#00C864';
//==========================================================================================================================//
// UTILITY FUNCTIONS                                                                                                        
//==========================================================================================================================//
function getsetter(object, id, value) {
    if ( value == undefined ) 
        return object[id];
    object[id] = value;
    return object;
}

function expandProperties(object) {
    $.each(object, function(name, val) {
        object['_' + name + '_'] = val;
        object[name] = function(arg) {
            return getsetter(object, '_' + name + '_', arg);  
        };
    });
}

String.prototype.format = function() {
   var content = this;
   for (var i=0; i < arguments.length; i++) {
        var replacement = '{' + i + '}';
        content = content.replace(replacement, arguments[i]);  
   }
   return content;
};
//==========================================================================================================================//
// COMPONENT                                                                                                        
//==========================================================================================================================//
function Component() {
    
    // Component private fields
    
    this.element      = 'div';
    this.attributes   = '';
    this.x            = '0';
    this.y            = '0';
    this.z            = '0';
    this.width        = '';
    this.height       = '';
    this.opacity      = '1';
    this.color        = '';
    this.html         = '';
    this.padding      = '0';
    this.skew         = '0deg';
    this.shadow       = '0';
    this.font         = null;
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
    
    this.show = function(container) {
        container.append('<{0} {1} class="{2}" id="{3}">{4}</{0}>'.format(
            component.element(),
            component.attributes(),
            component.classes(),
            component._id_,
            component.html()
        ));
        component.$ = $( '#' + component._id_ );
        component.$.css({
            'position'          : 'absolute',
            'left'              : component.x(),
            'top'               : component.y(),
            'z-index'           : component.z(),
            'width'             : component.width(),
            'height'            : component.height(),
            'opacity'           : component.opacity(),
            'background'        : component.color(), 
            'padding'           : component.padding(),
            'transform'         : 'skew(' + component.skew() + ')',
            '-webkit-filter'    : 'drop-shadow(1vw 1vw 1vw hsla(0, 0%, 0%, ' + component.shadow() + '))',
            'filter'            : 'drop-shadow(1vw 1vw 1vw hsla(0, 0%, 0%, ' + component.shadow() + '))'
        });
        if ( component.font() ) {
            component.$.css({
                'color'         : component.font().color(),
                'font-family'   : component.font().family(),
                'font-size'     : component.font().size(),
                'font-weight'   : component.font().weight(),
                'font-style'    : component.font().style()
            });
        }
    };

    this.ready = function() {
        $.each(component.actions(), function(i, action) {  
            component.$.ready(function() {
                component.$ = $('#' + component._id_); // Have to reselect JQuery object or else on events will not trigger
                if ( action.trigger() == null )
                    action.action()(component);
                else 
                    component.$.on(action.trigger(), function() { action.action()(component); } );
            });
        });
    }
}

function Font() {
    
    this.color  = 'auto';
    this.family = 'BebasNeue';
    this.size   = 'auto';
    this.weight = 'normal';
    this.style  = '';
    
    expandProperties(this);
    
}

function Action() {
    
    this.trigger = null;
    this.action = function() {};
    
    expandProperties(this);
}
//==========================================================================================================================//
// COMPONENT FACTORY                                                                                                        
//==========================================================================================================================//
function ComponentFactory() {
    
    this.vector = function(points) {
        var component = new Component()
            .element('svg')
            .attributes('viewBox="0 0 100 50" preserveAspectRatio="none"')
            .x('0')
            .y('0')
            .width('100%')
            .height('100%')
            .shadow('0.2');
        var old = component.show;
        component.show = function(id) {
            component.html('<polygon points="' + points + '"/>');
            old(id);
            component.$.css({
                'background' : '',
                'fill'       : component.color()
            });
        };
        return component;
    }
    
    this.text = function(text) {
        var component = new Component()
            .z('10')
            .html(text)
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
        var old = component.show;
        component.show = function(id) {
            old(id);
            component.$.css({
                'overflow'              : 'visible',
                '-webkit-user-select'   : 'none',
                '-khtml-user-select'    : 'none',
                '-moz-user-select'      : 'none',
                '-ms-user-select'       : 'none',
                '-o-user-select'        : 'none',
                'user-select'           : 'none',
                'cursor'                : 'default',
                'text-align'            : 'center'
            });

        };
        return component; 
    }
    
    this.title = function(text) {
        var component = new Component()
            .z('10')
            .html(text)
            .shadow('0.1')
            .font(new Font()
                 .color('#FFFFFF')
                 .size('4vw')
                 .style('italic')
            )
        component.color = function(arg) {
            component.font().color(arg);            
            if ( arg == undefined )
                return component._color_;
            return component;
        }
        var old = component.show;
        component.show = function(id) {
            old(id);
            component.$
                .addClass('stroke')
                .css({
                    'overflow'              : 'visible',
                    '-webkit-user-select'   : 'none',
                    '-khtml-user-select'    : 'none',
                    '-moz-user-select'      : 'none',
                    '-ms-user-select'       : 'none',
                    '-o-user-select'        : 'none',
                    'user-select'           : 'none',
                    'cursor'                : 'default',
                    'text-align'            : 'center'
                });

        };
        return component;
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
    
    this.text_button = function(text, onclick) {
        var component = this.text(text);
        // TODO text button factory function
        return component;
    }
    
    this.input = function() {
        var component = new Component()
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
        return component;
    }
    
    this.resource = function(path) {
        var component = new Component()
            .element('img');
        // TODO resources factory function
        return component;
    }
    
}
//==========================================================================================================================//
// ViewController                                                                                                        
//==========================================================================================================================//
function ViewController(container) {
    
    var vc = this;
    
    this.factory = new ComponentFactory();
    
    this.container = container;
    
    this.live = [];
    
    this.render = function() {
        this.container.html( '' );
        var l = this.live.length;
        for(var i = 0; i < l; i++)
            this.live[i].show(this.container);
        for(var i = 0; i < l; i++)
            this.live[i].ready();
        this.live = [];
    };
    
    this.update = function(components) {
        var l = components.length;
        for(var i = 0; i < l; i++)
            components[i].show(this.container);
        for(var i = 0; i < l; i++)
            components[i].ready();
    };
    
    this.add = function(component) {
        this.live.push(component);
    }
    
    this.message = function(message, color) {
        var e1 = false;
        var components = [];
        components.push(this.factory.vector('40,0 60,0 60,50 40,50').color(background1).z('60').addClass('banner-transition').skew('-55deg').addAction(
            new Action().trigger('animationend').action(function(component) { 
            if (e1) 
                component.$. remove()
            e1 = true;
        })));
        var e2 = false
        components.push(this.factory.title(message).width('100vw').y('22.5vw').z('61').addClass('text-transition').addAction(
            new Action().trigger('animationend').action(function(component) { 
            if (e2) 
                component.$. remove()
            e2 = true;
        })));
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
        // Vecotrs
        this.add( this.factory.vector('7,0 50,0 0,45 0,35').color(background1).z(1).addClass('slide-down') );
        this.add( this.factory.vector('50,0 70,0 20,20').color(accent).addClass('slide-down') );
        this.add( this.factory.vector('50,50 100,25 100,50').color(background1).z(1).addClass('slide-up') );
        this.add( this.factory.vector('35,50 80,40, 80,50').color(accent).addClass('slide-up') );
        // Username/pass entry
        this.add( this.factory.title('USERNAME').x('16vw').y('20vw') );
        this.add( this.factory.title('PASSWORD').x('15vw').y('26vw') );
        this.add( this.factory.input().x('32vw').y('20vw').addClass('username').addAction(focusAction) );
        this.add( this.factory.input().x('31vw').y('26vw').attributes('type="password"').addClass('password') );
        // Buttons
        this.add( this.factory.title_button('NEW ACCOUNT').color(select1).x('43vw').y('31vw').z('51').addAction(newAccountAction) );
        this.add( this.factory.title_button('LOGIN').color(select2).x('63vw').y('31vw').addAction(loginAction) );       
        // Update
        this.render();
    };

    this.menu = function(args) {
        // Actions
        var toStory = new Action().trigger('click').action(function() { vc.levelSelect() });
        var toVersus = new Action().trigger('click').action(function() { vc.versus() });
        var toReplay = new Action().trigger('click').action(function() { vc.replay() });
        var toProfile = new Action().trigger('click').action(function() { vc.profile() });
        var toLogin = new Action().trigger('click').action(function() { vc.login(); });
        var enter = new Action().trigger('mouseenter').action(function(c) { c.$.css({'color' : '#C80164'})});
        var leave = new Action().trigger('mouseleave').action(function(c) { c.$.css({'color' : '#FFFFFF'})});
        // Vectors
        this.add( this.factory.vector('0,0 3,0 35,50 0,50').color('#000').z(1).addClass('slide-right') );
        this.add( this.factory.vector('0,0 12,0, 17,30 0,30').color('#00F').addClass('slide-right') );
        this.add( this.factory.vector('65,8 97,14 97,20 60,25').color('#000').z(1) );
        this.add( this.factory.vector('68,9 94,8 94,14').color('#00F').addClass('slide-up-slight') );
        // TODO parameterize menu items
        this.add( this.factory.title_button('STORY').x('6vw').y('10vw').addAction(enter).addAction(leave).addAction(toStory).addClass('slide-up') );
        this.add( this.factory.title_button('VERSUS').x('9vw').y('15vw').addAction(enter).addAction(leave).addAction(toVersus).addClass('slide-up') );
        this.add( this.factory.title_button('REPLAY').x('12vw').y('20vw').addAction(enter).addAction(leave).addAction(toReplay).addClass('slide-up') );
        this.add( this.factory.title_button('PROFILE').x('15vw').y('25vw').addAction(enter).addAction(leave).addAction(toProfile).addClass('slide-up') );
        this.add( this.factory.title_button('LOGOUT').x('18vw').y('30vw').addAction(enter).addAction(leave).addAction(toLogin).addClass('slide-up') );
        // Update
        this.render();
    };

    this.levelSelect = function(args) {
        // Vectors
        this.add( this.factory.vector('0,0 100,0, 100,50, 0,50').color('#00F') );
        this.add( this.factory.vector('17,0, 27,0 13,50, 3,50').color('#000').z(1) );
        this.add( this.factory.vector('17,0, 27,0 13,50, 3,50').color('#000').z(1).x('18vw') );
        this.add( this.factory.vector('17,0, 27,0 13,50, 3,50').color('#000').z(1).x('36vw') );
        this.add( this.factory.vector('17,0, 27,0 13,50, 3,50').color('#000').z(1).x('54vw') );
        this.add( this.factory.vector('17,0, 27,0 13,50, 3,50').color('#000').z(1).x('72vw') );
        this.add( this.factory.vector('9,28 18,32 13,50 3,50').color('#FFF').z(2) );
        this.add( this.factory.vector('9,28 18,32 13,50 3,50').color('#FFF').z(2).x('16vw').y('7vw') );
        this.add( this.factory.vector('9,28 18,32 13,50 3,50').color('#FFF').z(2).x('32vw').y('14vw') );
        this.add( this.factory.vector('9,28 18,32 13,50 3,50').color('#FFF').z(2).x('54vw').y('15vw') );
        this.add( this.factory.vector('9,28 18,32 13,50 3,50').color('#FFF').z(2).x('72vw').y('20vw') );
        // Update
        this.render();
    };

    this.story = function(args) {

    }
        
    this.hotseatAi = function(args) {

    }

    this.versus = function(args) {

    }
    
    this.listReplays = function(args) {
        
    }

    this.replay = function(args) {

    }

    this.board = function(args) {

    }

    this.pause = function(args) {

    }

    this.victory = function(args) {

    }

    this.lose = function(args) {

    }
    
    this.override = function(html) {
        this.container.html(html);
    }
    
    this.launch = function() {
        this.container = $( this.container );
        vc.login();
    }

}