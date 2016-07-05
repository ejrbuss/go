//==========================================================================================================================//
// UTIL FUNCTIONS                                                                                                                
//==========================================================================================================================//
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

String.prototype.format = function() {
   var content = this;
   for (var i=0; i < arguments.length; i++) 
        content = content.replaceAll('{' + i + '}', arguments[i]);  
   return content;
};

global.attributize = function(obj) {
    var content = '';
    $.each(obj, function(key, val) {
        content += key + '="' + val + '" ';
    })
    return content;
}

global.log = {
    debug : function() {},
    info  : function() {},
    warn  : function() {}
}
//==========================================================================================================================//
// MOCK JQUERY                                                                                                                  
//==========================================================================================================================//
var jQuery = function() {
    return jQuery;
}

jQuery.attr = function(key, val) {
    if (val == undefined)
        return jQuery.attr[key];
    jQuery.attr[key] = val;
    return jQuery;
}

jQuery.each = function(obj, fn) {
    for (var property in obj) {
        fn(property, obj[property])
    }
}

jQuery.attr.html = '';

jQuery.html = function(html) {
    if (html == undefined)
        return jQuery.attr.html;
    jQuery.attr.html = html;
    return jQuery;
}

jQuery.append = function(html) {
    return jQuery.html(html);
}

jQuery.preloadImages = function() {}

jQuery.attr.css = {};

jQuery.css = function(key, val) {
    if (val == undefined)
        jQuery.each(key, function(key, val) {
            jQuery.attr.css[key] = val;    
        });
    jQuery.attr.css[key] = val;
    return jQuery;
}

jQuery.ready = function(cb) {
    cb();
}

jQuery.on = function(trigger, cb) {
    if (trigger == 'click')
        cb();
    return jQuery;
}

jQuery.focus = function() {
    jQuery.attr.focus = true;
}
//==========================================================================================================================//
// EXPORTS                                                                                                                  
//==========================================================================================================================//
module.exports = jQuery;
//==========================================================================================================================//