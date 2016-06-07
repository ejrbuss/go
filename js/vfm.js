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
//==========================================================================================================================//
// GLOBALS                                                                                                                  
//==========================================================================================================================//
var id_counter = 0; // Ensures Components have a unique id
//==========================================================================================================================//
// UTILITY FUNCTIONS                                                                                                        
//==========================================================================================================================//
function getsetter(object, id, value) {
    if ( value == undefined ) 
        return object[id];
    object[id] = value;
    return object;
}
//==========================================================================================================================//
// COMPONENT                                                                                                        
//==========================================================================================================================//
function Component() {
    
    var component = this;
    
    // Component private fields
    
    this._id_           = (id_counter++).toString();
    this._element_      = 'div';
    this._types_        = '';
    this._x_            = 'auto';
    this._y_            = 'auto';
    this._width_        = 'auto';
    this._height_       = 'auto';
    this._opacity_      = '1';
    this._color_        = '#0000FF';
    this._html_         = '';
    this._padding_      = '0';
    
    // Component public fields
    
    this.$ = '#' + this._id_;
    
    // Access functions
    
    this.element = function(element) { 
        return getsetter(this, '_element_', element); 
    };
    
    this.types = function(types) { 
        return getsetter(this, '_types_', types); 
    };
    
    this.x = function(x) { 
        return getsetter(this, '_x_', x); 
    };
    
    this.y = function(y) { 
        return getsetter(this, '_y_', y); 
    };
    
    this.z = function(z) { 
        return getsetter(this, '_z_', z); 
    };
    
    this.width = function(width) { 
        return getsetter(this, '_width_', width); 
    };
    
    this.height = function(height) { 
        return getsetter(this, '_height_', height); 
    };
    
    this.opacity = function(opacity) { 
        return getsetter(this, '_opacity_', opacity); 
    };
    
    this.color = function(color) { 
        return getsetter(this, '_color_', color); 
    };
    
    this.html = function(html) {
        return getsetter(this, '_html_', html); 
    };
    
    this.padding = function(padding) { 
        return getsetter(this, '_padding_', padding); 
    };
    
    this.show = function(id) {
        $( id ).html($( id ).html() 
            + '<' + component.element() + ' ' + component.types()
            + ' id="' + component._id_ + '">' 
            + component.html() 
            + '</' + component.element() + '>');
        $( component.$ ).css({
            'position'      : 'absolute',
            'left'          : component.x(),
            'top'           : component.y(),
            'z-index'       : component.z(),
            'width'         : component.width(),
            'height'        : component.height(),
            'opacity'       : component.opacity(),
            'background'    : component.color(), 
            'padding'       : copmonent.padding()
        });
    }
    
}

function Font() {
    // TODO font Object
}

function Animation() {
    // TODO animatation OBject
}
//==========================================================================================================================//
// COMPONENT FACTORY                                                                                                        
//==========================================================================================================================//
function ComponentFactory() {
    
    this.titleFont = new Font(); // TODO
    
    this.standardFont = new Font(); // TODO
    
    this.vector = function(points) {
        var component = new Component()
            .element('svg')
            .types('viewBox="0 0 100 50" preserveAspectRatio="none"')
            .x('0')
            .y('0')
            .width('100%')
            .height('100%');
        var old = component.show;
        component.show = function(id) {
            component.html('<polygon points="' + points + '"/>');
            old(id);
            $( component.$ ).css({
                'background' : '',
                'fill'       : component.color()
            });
        }
        return component;
    }
    
    this.text = function(text) {
        var component = new Component();
        // TODO text factory function
        return component;
    }
    
    this.text_button = function(text, onclick) {
        var component = this.text(text);
        // TODO text button factory function
        return component;
    }
    
    this.input = function() {
        var component = new Component();
        // TODO input factory function
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
    
    this.factory = new ComponentFactory();
    
    this.container = container;
    
    this.live = [];
    
    this.update =  function() {
        $( container ).html( '' );
        $.each(this.live, function( i, component ) {
            component.show( container );
        });
        console.log( $( container ).html() );
        this.live = [];
    };

    this.login = function() {
        this.live.push(
            this.factory.vector('7,0 50,0 0,45 0,35')
                .color('#000')
                .z(1)
        );
        this.live.push(
            this.factory.vector('50,0 70,0 20,20')
                .color('#00F')
        );
        this.live.push(
            this.factory.vector('50,50 100,25 100,50')
                .color('#000')
                .z(1)
        );
        this.live.push(
            this.factory.vector('35,50 80,40, 80,50')
                .color('#00F')
        );
        this.live.push( 
            new Component()
            .x('30vw')
            .y('30vw')
            .width('10vw')
            .html('Username:')
        );
        this.live.push( new Component()
            .x('43vw')
            .y('30vw')
            .width('20vw')
            .element('input')
            .z(2)
        );
        this.live.push( 
            new Component()
            .x('30vw')
            .y('35vw')
            .width('10vw')
            .html('Password:')
        );
        this.live.push( 
            new Component()
            .x('43vw')
            .y('35vw')
            .width('20vw')
            .element('input')
            .z(2)
        );
        this.live.push( 
            new Component()
            .x('44vw')
            .y('40vw')
            .element('button')
            .html('Create an Account')
        );
        this.live.push( 
            new Component()
            .x('56vw')
            .y('40vw')
            .element('button')
            .html('Login')
        );
        this.update();
    };

    this.menu = function(args) {
        this.live.push( 
            new Component()
            .x('10vw')
            .y('10vw')
            .element('button')
            .html('story')
        );
        this.live.push(
            new Component()
            .x('10vw')
            .y('15vw')
            .element('button')
            .html('versus')
        );
        this.live.push(
            new Component()
            .x('10vw')
            .y('20vw')
            .element('button')
            .html('stats')
        );
        this.live.push(
            new Component()
            .x('10vw')
            .y('25vw')
            .element('button')
            .html('replay')
        );
        this.live.push(
            new Component()
            .x('10vw')
            .y('30vw')
            .element('button')
            .html('logout')
        );
        this.update();
    };

    this.levelSelect = function(args) {
        this.live.push( 
            new Component()
            .x('10vw')
            .y('60vw')
            .element('button')
            .html('I')
        );
        this.live.push(
            new Component()
            .x('20vw')
            .y('60vw')
            .element('button')
            .html('II')
        );
        this.live.push(
            new Component()
            .x('30vw')
            .y('60vw')
            .element('button')
            .html('III')
        );
        this.live.push(
            new Component()
            .x('40vw')
            .y('60vw')
            .element('button')
            .html('IV')
        );
        this.live.push(
            new Component()
            .x('50vw')
            .y('60vw')
            .element('button')
            .html('V')
        );
        this.update();
    };

    this.story = function(args) {

    }

    this.hotseatAi = function(args) {

    }

    this.versus = function(args) {

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

}