'use strict'
//==========================================================================================================================//
// REQUIRES                                                                                                                 
//==========================================================================================================================//
var jQuery = require('../test/mock-jquery');
var vfm    = require('../public/js/vfm');
var assert = require('assert');

assert.stringyEqual = function() {
    var f = assert.equal.bind(assert);
    for(var i = 0; i < arguments.length; i++)
        f = f.bind(JSON.stringify(arguments[i]));
    return f();
}
//==========================================================================================================================//
// PROPERTYEXPANDER TESTS                                                                                                           
//==========================================================================================================================//
describe('PropertyExpander', function() {
    
    describe('constructor()', function() {
        it('should initialize empty property types', function() {
            var pe = new vfm.PropertyExpander();
            assert.stringyEqual(pe.property,     {});
            assert.stringyEqual(pe.listProperty, {});
            assert.stringyEqual(pe.mapProperty,  {});    
        });
    });
    
    describe('expand()', function() {
        var pe = new vfm.PropertyExpander();
        it('should expand properties', function() {
            pe.property.test = 0;
            pe.expand();
            assert.equal(pe._test_, 0);
            assert.equal(pe.test(), 0);
            pe.test(1);
            assert.equal(pe._test_, 1);
            assert.equal(pe.test(), 1);
            
        });
        it('should expand list properties', function() {
            var val = [Math.random(), Math.random(), Math.random()];
            pe.listProperty.test = [];
            pe.expand();
            assert.stringyEqual(pe._test_, []);
            assert.stringyEqual(pe.test(), []);
            pe.addTest(val[0]).addTest(val[1]).addTest(val[2]);
            assert.stringyEqual(pe._test_, val);
            assert.stringyEqual(pe.test(), val);
            pe.removeTest(val[0]);
            pe.removeTest(val[1]);
            assert.stringyEqual(pe.test(), [val[2]]);
        });
        it('should expand map properties', function() {
            var val = {0: Math.random(), 1: Math.random(), 2: Math.random()};
            pe.mapProperty.test = {};
            pe.expand();
            assert.stringyEqual(pe._test_, {});
            assert.stringyEqual(pe.test(), {});
            pe.setTest(0, val[0]).setTest(1, val[1]).setTest(2, val[2]);
            assert.stringyEqual(pe._test_, val);
            assert.stringyEqual(pe.test(), val);
        });
    });
    
    describe('getSetter()', function() {
        var pe = new vfm.PropertyExpander();
        it('should function as a getter', function() {
            var val = Math.random();
            pe.test = val;
            assert.equal(pe.getSetter('test'), val);
        });
        it('should funaction as a setter', function() {
            var val = Math.random();
            pe.getSetter('test', val);
            assert.equal(pe.test, val);
        });
        it('should chain a get on a set', function() {
            var val = Math.random();
            assert.equal(pe.getSetter('test', val).getSetter('test'), val);
        })
    });
    
    describe('adder()', function() {
        var pe = new vfm.PropertyExpander();
        pe.test = [];
        it('should add an item', function() {
            var val = Math.random();
            pe.adder('test', val);
            assert.stringyEqual(pe.test, [val])
        });
        it('should chain', function() {
            var val = [Math.random(), Math.random(), Math.random()];
            pe.adder('test', val[0]).adder('test', val[1]).adder('test', val[2]);
            assert.stringyEqual(pe.test, val);
        });
    });
    
    describe('remover()', function() {
        var pe = new vfm.PropertyExpander();
        it('should remove an item', function() {
            var val = Math.random();
            pe.test = [val];
            pe.remover('test', val);
            assert.stringyEqual(pe.test, []);
        });
        it('should chain', function() {
            var val = [Math.random(), Math.random(), Math.random()];
            pe.test = val;
            pe.remover('test', val[0]).remover('test', val[1]);
            assert.stringyEqual(pe.test, [val[2]]);
        });
    });
    
    describe('mapper()', function() {
        var pe = new vfm.PropertyExpander();
        pe.test = {};
        it('should map a value to a key', function() {
            var val = Math.random();
            pe.mapper('test', 'key', val);
            assert.equal(pe.test.key, val);
        });
        it('should chain', function() {
            var val = {0: Math.random(), 1: Math.random(), 2: Math.random()};
            pe.mapper('test', 0, val[0]).mapper('test', 1, val[1]).mapper('test', 2, val[2]);
            assert.stringyEqual(pe.test, val);
        });
    });
    
    describe('format()', function() {
        it('should return the privatized key', function() {
            var pe = new vfm.PropertyExpander();
            assert.equal(pe.format('key'),      '_key_');
            assert.equal(pe.format('property'), '_property_');
        });
    });
    
});
//==========================================================================================================================//
// COMPONENT TESTS                                                                                                              
//==========================================================================================================================//
describe('Component', function() {

    describe('constructor()', function() {
        it('should expand the appropriate properties', function() {
            var c = new vfm.Component();
            assert.equal(c.background(), null);
        });
        it('should assign a unique id', function() {
            var c1 = new vfm.Component();
            var c2 = new vfm.Component();
            assert.notEqual(c1.id(), c2.id()); 
        });
    });
    
    describe('render()', function() {
        it('should initialize the HTML', function() {
            var c = new vfm.Component().element('test-element').addClass('test-class').setAttr('test', 0).html('test');
            c.render(jQuery);
            assert.equal(jQuery.html(), '<test-element test="0"  class="test-class" id="' + c.id() + '">test</test-element>');
        });
        it('should apply css', function() {
            var c = new vfm.Component().background('#F00').x(12);
            c.render(jQuery);
            assert.equal(jQuery.attr.css['background'], '#F00');
            assert.equal(jQuery.attr.css['left'], '12vw');
        });
        it('should apply special css for null elements', function() {
            var c = new vfm.Component().size(4).skew('20deg').rotate('15deg').shadow(0.2);
            c.render(jQuery);
            assert.equal(jQuery.attr.css['font-size'], '4vw');
            assert.equal(jQuery.attr.css['transform'], 'rotate(15deg)');
            assert.equal(jQuery.attr.css['filter'],    'drop-shadow(1vw 1vw 1vw hsla(0, 0%, 0%, 0.2))');
        })
        it('should render subcomponents', function() {
            var c = new vfm.Component();
            var child = new vfm.Component();
            c.addComponent(child);
            c.render(jQuery);
            assert.equal(child.$, jQuery);
        });
    });
    
    describe('ready()', function() {
        it('should run Actions immediately after load', function() {
            var touch = false;
            var c = new vfm.Component().addAction(new vfm.Action().action(function() {
                touch = true;
            }));
            c.render(jQuery);
            c.ready();
            assert.equal(touch, true);
        });
        it('should pass the component', function() {
            var c = new vfm.Component().addAction(new vfm.Action().action(function(component) {
                assert.equal(component, c);
            }));
            c.render(jQuery);
            c.ready();
        });
        it('should set triggers', function() {
            var touch = false;
            var c = new vfm.Component().addAction(new vfm.Action().trigger('').action(function() {
                touch = true;
            }));
            c.render(jQuery);
            c.ready();
            assert.equal(touch, false);
            var c = new vfm.Component().addAction(new vfm.Action().trigger('click').action(function() {
                touch = true;
            }));
            c.render(jQuery);
            c.ready();
            assert.equal(touch, true);
        });
        it('should run Actions of sub components', function() {
            var c = new vfm.Component();
            var touch = false;
            var child = new vfm.Component().addAction(new vfm.Action().action(function() {
                touch = true;
            }));
            c.addComponent(child);
            c.render(jQuery);
            c.ready();
            assert.equal(touch, true);
        });
    });
    
    describe('xy()', function() {
        it('should set x, y', function() {
            var x = Math.random();
            var y = Math.random();
            var c = new vfm.Component().xy(x, y);
            assert.equal(c.x(), x);
            assert.equal(c.y(), y);
        });        
    });
    
    describe('xyz()', function() {
        it('should set x, y, z', function() {
            var x = Math.random();
            var y = Math.random();
            var z = Math.random();
            var c = new vfm.Component().xyz(x, y, z);
            assert.equal(c.x(), x);
            assert.equal(c.y(), y);
            assert.equal(c.z(), z);
        });
    });
    
    describe('yz()', function() {
        it('should set y, z', function() {
            var y = Math.random();
            var z = Math.random();
            var c = new vfm.Component().yz(y, z);
            assert.equal(c.y(), y);
            assert.equal(c.z(), z);
        });
    });
    
    describe('xz()', function() {
        it('should set x, z', function() {
            var x = Math.random();
            var z = Math.random();
            var c = new vfm.Component().xz(x, z);
            assert.equal(c.x(), x);
            assert.equal(c.z(), z);
        });
    });
    
    describe('send()', function() {
        it('should send a message', function() {
            var c = new vfm.Component();
            c.send('test');
            c.render(jQuery);
            assert.equal(jQuery.attr.html, '<div data=""test""  class="" id="' + c.id() + '"></div>');
        });
    });
    
    describe('recieve()', function() {
        it('should recieve a message', function() {
            var c = new vfm.Component();
            c.render(jQuery);
            jQuery.attr('data', JSON.stringify('test'));
            assert.equal(c.recieve(), 'test');
        });
    });
    
    describe('append()', function() {
        it('should add HTML', function() {
            var c = new vfm.Component();
            c.append('test')
            assert.equal(c.html(), 'test');    
        });
        it('should append HTML', function() {
            var c = new vfm.Component().html('pre');
            c.append('test')
            assert.equal(c.html(), 'pretest');    
        });
    });
    
    describe('poly()', function() {
        var c = new vfm.Component();
        it('should fit and append a polygon to the html', function() {
            c.poly([7,8, 12,56, 7,99], '#F00');
            assert.equal(c.x(), 7);
            assert.equal(c.y(), 8);
            assert.equal(c.width(),  5);
            assert.equal(c.height(), 91);
            assert.equal(c.html(), '<polygon points="7,8,12,56,7,99" style="fill:#F00"/>');
        });
        
    });
    
    describe('cricle()', function() {
        var c = new vfm.Component();
        it('should fit and append a circle to the html', function() {
            c.circle(12, 5, 3, '#F00');
            assert.equal()
            assert.equal(c.x(), 12);
            assert.equal(c.y(), 5);
            assert.equal(c.width(),  6);
            assert.equal(c.height(), 6);
            assert.equal(c.html(), '<circle cx="15" cy="8" r="3" style="fill:#F00"/>');
        });
    });
    
    describe('fit()', function() {  
        it('should set the appropriate x, y, width, and height', function() {
            var c = new vfm.Component();
            var bounds = [90,56, 40,32, 2,33, 65,18];
            c.fit(bounds);
            assert.equal(c.x(), 2);
            assert.equal(c.y(), 18);
            assert.equal(c.width(),  88);
            assert.equal(c.height(), 38);
        });
        it('should set the appropriate x, y, width, and height for multiple fits', function() {
            var c = new vfm.Component();
            var bounds1 = [12,5, 16,3];
            c.fit(bounds1);
            assert.equal(c.x(), 12);
            assert.equal(c.y(), 3);
            assert.equal(c.width(),  4);
            assert.equal(c.height(), 2);
            var bounds1 = [3,7, 15,12];
            c.fit(bounds1);
            assert.equal(c.x(), 3);
            assert.equal(c.y(), 3);
            assert.equal(c.width(),  13);
            assert.equal(c.height(), 9);
        })
    });
    
});
//==========================================================================================================================//
// ACTION TESTS                                                                                                           
//==========================================================================================================================//
describe('Action', function() {
    describe('constructor()', function() {
        it('should initialize a ready action', function() {
            var a = new vfm.Action();
            assert.equal(a.trigger(), 'ready');
            assert.equal(a.action()(), null);
            assert.stringyEqual(a.action, function(){})
        })    
    });
})
//==========================================================================================================================//
// COMPONENT FACTORY TESTS                                                                                                              
//==========================================================================================================================//
describe('ComponentFactory', function() {
    
    describe('Vector()', function() {
        it('should return a Vector', function() {
            var c = vfm.ComponentFactory.Vector();
            assert(c instanceof vfm.Component);
            assert.equal(c.element(), 'svg');
        });
    });
    
    describe('Text()', function() {
        it('should return Text', function() {
            var c = vfm.ComponentFactory.Text('test');
            assert(c instanceof vfm.Component);
            assert.equal(c.text(), 'test');
        });
    });
    
    describe('Title()', function() {
        it('should return a Title', function() {
            var c = vfm.ComponentFactory.Title('test');
            assert(c instanceof vfm.Component);
            assert.equal(c.text(), 'test');
        });
    });
    
    describe('TitleButton()', function() {
        it('should return a TitleButton', function() {
            var c = vfm.ComponentFactory.TitleButton('test');
            assert(c instanceof vfm.Component);
            assert.equal(c.text(), 'test');
        });
    });
    
    describe('LargeTitleButton()', function() {
        it('should return a LargeTitleButton', function() {
            var c = vfm.ComponentFactory.LargeTitleButton('test');
            assert(c instanceof vfm.Component);
            assert.equal(c.text(), 'test');
        });
    });
    
    describe('Input()', function() {
        it('should return an Input', function() {
            var c = vfm.ComponentFactory.Input();
            assert(c instanceof vfm.Component);
            assert.equal(c.element(), 'input');
        });
    });
    
    describe('List()', function() {
        it('should return a List', function() {
            var c = vfm.ComponentFactory.List();
            assert(c instanceof vfm.Component);
            assert.equal(c.element(), 'ul');
        });
    });
    
    describe('Password()', function() {
        it('should return a Password', function() {
            var c = vfm.ComponentFactory.Password();
            assert(c instanceof vfm.Component);
            assert.equal(c.element(), 'input');
        });
    });
    
    describe('Resource()', function() {
        it('should return a Resource', function() {
            var c = vfm.ComponentFactory.Resource();
            assert(c instanceof vfm.Component);
            assert.equal(c.element(), 'img');
        });
    });
    
    describe('Character()', function() {
        it('should return a Character', function() {
            var c = vfm.ComponentFactory.Character();
            assert(c instanceof vfm.Component);
            assert.equal(c.element(), 'img');
        });
    });
    
    describe('Background()', function() {
        it('should return a Background', function() {
            var c = vfm.ComponentFactory.Background();
            assert(c instanceof vfm.Component);
            assert.equal(c.element(), 'img');
        });
    });
    
    describe('SelectStage()', function() {
        it('should return a SelecStage', function() {
            var c = vfm.ComponentFactory.SelectStage();
            assert(c instanceof vfm.Component);
            assert.equal(c.element(), 'img');
        });
    });
    
    describe('SelectAi()', function() {
        it('should return a SelectStage', function() {
            var c = vfm.ComponentFactory.SelectAi();
            assert(c instanceof vfm.Component);
            assert.equal(c.element(), 'img');
        });
    });
    
    describe('FocusAction()', function() {
        it('should return a FocusAction', function() {
            var a = vfm.ComponentFactory.FocusAction();
            a.action()({$: jQuery});
            assert(jQuery.attr.focus);
            assert(a instanceof vfm.Action);
            assert.equal(a.trigger(), 'ready');
        });
    });
    
    describe('ClickAction', function() {
        it('should return a ClickAction', function() {
            var a = vfm.ComponentFactory.ClickAction();
            assert(a instanceof vfm.Action);
            assert.equal(a.trigger(), 'click');
        });
    });
    
    describe('EnterAction()', function() {
        it('should return an EnterAction', function() {
            var a = vfm.ComponentFactory.EnterAction();
            a.action()({$: jQuery});
            assert(a instanceof vfm.Action);
            assert.equal(jQuery.attr.css['color'], '#C80164');
            assert.equal(a.trigger(), 'mouseenter');
        });
    });
    
    describe('LeaveAction()', function() {
        it('should return a LeaveAction', function() {
            var a = vfm.ComponentFactory.LeaveAction();
            a.action()({$: jQuery});
            assert(a instanceof vfm.Action);
            assert.equal(jQuery.attr.css['color'], '#FFFFFF');
            assert.equal(a.trigger(), 'mouseleave');
        });
    });
    
});
//==========================================================================================================================//