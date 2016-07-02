'use strict'
//==========================================================================================================================//
//     _    __________  ___
//    | |  / / ____/  |/  /
//    | | / / /_  / /|_/ /     
//    | |/ / __/ / /  / /        
//    |___/_/   /_/  /_/   
//                    
//==========================================================================================================================//
// GLOBALS                                                                                                                  
//==========================================================================================================================//
var id_counter  = 0;            // Ensures Components have a unique id
var background1 = '#000000';    // Black background
var background2 = '#FFFFFF';    // White background
var accent      = '#0000FF';    // Blue accent
var select1     = '#C80164';    // Purple select
var select2     = '#00C864';    // Green select
//==========================================================================================================================//
// PRELOAD RESOURCES                                                                                                                 
//==========================================================================================================================//
$.preloadImages( 
    // Icons
    'rsc/icons/logo.png',
    // Characters
    'rsc/characters/1.png',
    'rsc/characters/2.png',
    'rsc/characters/3.png',
    'rsc/characters/4.png',
    'rsc/characters/5.png',
    'rsc/characters/level1.png',
    'rsc/characters/level2.png',
    'rsc/characters/level3.png',
    'rsc/characters/level4.png',
    'rsc/characters/level5.png',
    'rsc/characters/select1.png',
    'rsc/characters/select2.png',
    'rsc/characters/select3.png',
    'rsc/characters/select4.png',
    'rsc/characters/select5.png',
    'rsc/characters/ai.png',
    'rsc/characters/pvp.png',
    // Backgrounds
    'rsc/backgrounds/0.png',
    'rsc/backgrounds/1.png',
    'rsc/backgrounds/2.png',
    'rsc/backgrounds/3.png',
    'rsc/backgrounds/4.png',
    'rsc/backgrounds/5.png',
    'rsc/backgrounds/select1.png',
    'rsc/backgrounds/select2.png',
    'rsc/backgrounds/select3.png',
    'rsc/backgrounds/select4.png',
    'rsc/backgrounds/select5.png'
);
//==========================================================================================================================//
// PROPERTY EXPANDER                                                                                                                  
//==========================================================================================================================//
// A utility class which simplifies the creation of contianer classes. Converts different properties into a set of helper
// function. Properties (this.property.name) are given getsetters. A getsetter returns the value if no arguments are passed.
// If value is passed the property is set to that value and the PropertyExpander itself is returned. List Properties 
// (this.listProperty.name) are given getsetters and addName and removeName functions. Map Properties 
// (this.mapProperties.name) are given getsetters and setName functions.
//==========================================================================================================================//
class PropertyExpander {
    
    /**
     * Create a new PropertyExpander.
     */
    constructor() {
        this.property     = {}; // Initialize an empty set of properties
        this.listProperty = {}; // Initialize an empty set of list properties
        this.mapProperty  = {}; // Initialize an empty sef of map properties
    }
    
    /**
     * Convert properties to helper functions.
     */
    expand() {
        var expander = this;
        $.each(this.property, function(name, val) {
            expander[expander.format(name)] = val;
            expander[name] = function(arg) {
                return expander.getSetter(expander.format(name), arg);
            }
        });
        $.each(this.listProperty, function(name, val) {
            expander[expander.format(name)] = val;
            expander[name] = function(arg) {
                return expander.getSetter(expander.format(name), arg);
            }
            expander['add' + name.capitalize()] = function(arg) {
                return expander.adder(expander.format(name), arg);
            }
            expander['remove' + name.capitalize()] = function(arg) {
                return expander.remover(expander.format(name), arg);
            }
        });
        $.each(this.mapProperty, function(name, val) {
            expander[expander.format(name)] = val;
            expander[name] = function(arg) {
                return expander.getSetter(expander.format(name), arg);
            }
            expander['set' + name.capitalize()] = function(key, arg) {
                return expander.mapper(expander.format(name), key, arg);
            }
        });
    }
    
    /**
     * If not value is provided returns the property at id. If a value is provided sets the property and returns this.
     * @param id  the name of the property
     * @param val the value to set the property to
     */
    getSetter(id, val) {
        if (val === undefined) 
            return this[id];
        this[id] = val;
        return this;
    }
    
    /**
     * Adds value to the property at id. Returns this.
     * @param id  the name of the property
     * @param val the value to add to the property to
     */
    adder(id, val) {
        this[id].push(val);
        return this;
    }
    
    /**
     * Removes a value from the property at id. Returns this.
     * @param id  the name of the property
     * @param val the value to remove from the property
     */
    remover(id, val) {
        this[id].splice(this[id].indexOf(val), 1);
        return this;
    }
    
    /**
     * Maps a value to a key in a property at id.
     * @param id  the name of the property
     * @param key the key to map
     * @param val the value to map
     */
    mapper(id, key, val) {
        this[id][key] = val;
        return this;
    }
    
    /**
     * Formats a property name to an id.
     * @param arg the property name
     */
    format(arg) {
        return '_' + arg + '_';
    }
    
}
//==========================================================================================================================//
// COMPONENT                                                                                                                  
//==========================================================================================================================//
// Used to maintain HTML/CSS information prior to rendering.
//==========================================================================================================================//
class Component extends PropertyExpander {
    
    /**
     * Expands a new Component.
     */
    constructor() {
        super();
        // Properties
        this.property.id            = (id_counter++).toString();
        this.property.position      = 'absolute'
        this.property.element       = 'div';                     
        this.property.html          = '';
        this.property.text          = '';
        this.property.x             = null;
        this.property.y             = null;
        this.property.z             = null;
        this.property.width         = null;
        this.property.height        = null;
        this.property.opacity       = null;
        this.property.background    = null;
        this.property.padding       = null;
        this.property.skew          = null;
        this.property.rotate        = null;
        this.property.shadow        = null;
        this.property.foreground    = null;
        this.property.family        = null;
        this.property.size          = null;
        this.property.weight        = null;
        this.property.style         = null;
        // List properties
        this.listProperty.class     = [];
        this.listProperty.action    = [];
        this.listProperty.component = [];
        // Map properties
        this.mapProperty.attribute  = {};
        // Expand propertoes
        super.expand();
    }
    
    /**
     * Creates HTML/CSS object and initializes this.$ to jQuery selection.
     * @param parent the jQuery object to render to
     */
    render(parent) {
         parent.append('<{0} {1} class="{2}" id="{3}">{4}{5}</{0}>'.format(
            this.element(),
            attributize(this.attribute()),
            this.class().join(' '),
            this.id(),
            this.text(),
            this.html()
        ));
        this.$ = $( '#' + this._id_ );
        this.$.css({
            'position'       : this.position(),
            'left'           : this.x() + 'vw',
            'top'            : this.y() + 'vw',
            'z-index'        : this.z(),
            'width'          : this.width() + 'vw',
            'height'         : this.height() + 'vw',
            'opacity'        : this.opacity(),
            'background'     : this.background(), 
            'padding'        : this.padding(),
            'color'          : this.foreground(),
            'font-family'    : this.family(),
            'font-weight'    : this.weight(),
            'font-style'     : this.style(),
        });
        // Test null for optimization
        if (this.size() != null) 
            this.$.css({
               'font-size' : this.size() + 'vw', 
            });
        if (this.skew() != null)
            this.$.css({
                'transform'  : 'skew(' + this.skew() + ')'            
            });
        if (this.rotate() != null) 
            this.$.css({
                'transform' : 'rotate(' + this.rotate() + ')'
            });
        if (this.shadow() != null)
            this.$.css({
                '-webkit-filter' : 'drop-shadow(1vw 1vw 1vw hsla(0, 0%, 0%, ' + this.shadow() + '))',
                'filter'         : 'drop-shadow(1vw 1vw 1vw hsla(0, 0%, 0%, ' + this.shadow() + '))',
            });
        // Render sub components
        for(var i = 0; i < this.component().length; i++)
            this.component()[i].render(this.$);
    }
    
    /**
     * Sets actions for Component once the HTML is ready.
     */
    ready() {
        var component = this;
        $.each(this.action(), function(i, action) {  
            component.$.ready(function() {          // Have to wait until ready to prevent buggy jQuery selection on dynamic elements
                if(action.trigger() == 'ready')
                    action.action()(component);
                else
                    component.$.on(action.trigger(), function() { action.action()(component); } );
            });
        });
        // Ready sub components
        for(var i = 0; i < this.component().length; i++)
            this.component()[i].ready();
    }
    
    /**
     * Helper set of functions for setting coordinates.
     */
    
    xy(x, y) {
        this.x(x);
        this.y(y);
        return this;
    }
    
    xyz(x, y, z) {
        this.x(x);
        this.y(y);
        this.z(z);
        return this;
    }
    
    yz(y, z) {
        this.y(y);
        this.z(z);
        return this;
    }
    
    xz(x, z) {
        this.x(x);
        this.z(z);
    }
    
    /**
     * Appends inner html.
     * @param html the HTML to append
     */
    append(html) {
        this.html(this.html() + html);
        return this;
    }
    
    /**
     * Adds a polygon to the HTML of this component.
     * @param points a list of polygon points
     * @param color  the fill color of the polygon
     */
    poly(points, color) {
        return this.append('<polygon points=' + this.formatPoints(points) + ' style="fill:' + color + '"/>');
    }
    
    /**
     * Returns a formatted a list of points.
     * @param a list of polygon points.
     */
    formatPoints(points) {
        var content = points[0];
        for(var i = 1; i < points.length; i++) 
            content += (i % 2 == 0 ? ' ' : ',') + points[i];
        return '"' + content + '"';
    }
    
    /**
     * Adds a circle to the HTML of this component.
     * @param x     the x coordiante of the circle
     * @param y     the y coordinate of the circle
     * @param r     the radius of the circle
     * @param color the fill color of the circle
     */
    circle(x, y, r, color) {
        return this.append('<circle cx="{0}" cy="{1}" r="{2}"  style="fill:{3}"/>'.format(x + r, y + r, r, color));
    }
    
}
//==========================================================================================================================//
// ACTION                                                                                                                
//==========================================================================================================================//
// Defines an action that can be performed on a component after differnt triggers. By default actions will be performed as
// soon as their parent Component is loaded (ready).
//==========================================================================================================================//
class Action extends PropertyExpander {
    
    /**
     * Expands a new action.
     */
    constructor() {
        super();
        // Properties
        this.property.trigger = 'ready';
        this.property.action  = function() {};
        // Expand properties
        super.expand();
    }

}
//==========================================================================================================================//
// COMPONENT FACTORY                                                                                                                  
//==========================================================================================================================//
// Utility class for generating common Components.
//==========================================================================================================================//
class ComponentFactory {
    
    /**
     * Returns a new Component ready to have shapes added to it.
     */
    Vector() {
        return new Component()
            .setAttribute('preserveAspectRatio', 'none')
            .setAttribute('viewBox', '0 0 100 50')
            .element('svg')
            .shadow(0.2)
            .width(100)
            .height(50);
    }
    
    /**
     * Returns a new Component that displays text.
     * @param text  the text to show
     * @param color the color of the text
     */
    Text(text='', color=background2) {
        return new Component()
            .addClass('unselectable')
            .foreground(color)
            .style('italic')
            .text(text)
            .size(3)
            .z(10);
    }
    
    /**
     * Returns a new Component that displays larger, bordered text.
     * @param text  the text to show
     * @param color the color of the text
     */
    Title(text='', color=background2) {
        return this.Text(text, color)
            .addClass('stroke')
            .shadow(0.1)
            .size(4)
    }
    
    /**
     * Returns a new Component that acts as a clickable title.
     * @param text  the text to show
     * @param color the color of the text
     */
    TitleButton(text='', color=background2) {
        return this.Title(text, color)
            .addClass('rotate')
            .shadow(0)
    }
    
    /**
     * Returns a new Component that acts as a text field.
     */
    Input() {
        return new Component()
            .element('input')
            .background(background1)
            .foreground(background2)
            .padding('0.3vw')
            .skew('-10deg')
            .shadow(0.2)
            .width('40')
            .size(3)
            .z(10);
    }
    
    List() {
        return new Component()
            .element('ul');
    }
    
    /**
     * Returns a new Component that acts ass a password field.
     */
    Password() {
        return this.Input()
            .setAttribute('type', 'password');
    }
    
    /** 
     * Returns a new Component that loads a resource (image) from a file.
     * @param src the path to the file to load
     */
    Resource(src='') {
        return new Component()
            .setAttribute('src', src)
            .element('img');
    }
    
    /**
     * Gives focus to the component this is added to.
     */
    FocusAction() {
        return new Action()
            .action(function(component) {
                component.$.focus();
            });
    }
    
    /**
     * Returns a new Action that is triggered by clicking.
     * @param action the function to run when the Component this is added to is clicked
     */
    ClickAction(action) {
        return new Action()
            .trigger('click')
            .action(action);
    }
    
    /**
     * Returns a new Action that is triggered by mouse entry. Triggers a css change.
     * @param val the css value 
     * @param val the css key
     */
    EnterAction(val=select1, key='color') {
        return new Action()
            .trigger('mouseenter')
            .action(function(component) { 
                var obj = {};
                obj[key] = val;
                component.$.css(obj)
            });
    }
    
    /**
     * Returns a new Action that is triggered by mouse exit. Triggers a css change.
     * @param val the css value 
     * @param val the css key
     */
    LeaveAction(val=background2, key='color') {
        return new Action()
            .trigger('mouseleave')
            .action(function(component) {
                var obj = {};
                obj[key] = val;
                component.$.css(obj)}
            );
    }
    
}
//==========================================================================================================================//