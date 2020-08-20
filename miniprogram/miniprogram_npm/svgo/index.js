module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1597942295319, function(require, module, exports) {


/**
 * SVGO is a Nodejs-based tool for optimizing SVG vector graphics files.
 *
 * @see https://github.com/svg/svgo
 *
 * @author Kir Belevich <kir@soulshine.in> (https://github.com/deepsweet)
 * @copyright © 2012 Kir Belevich
 * @license MIT https://raw.githubusercontent.com/svg/svgo/master/LICENSE
 */

var CONFIG = require('./svgo/config.js'),
    SVG2JS = require('./svgo/svg2js.js'),
    PLUGINS = require('./svgo/plugins.js'),
    JSAPI = require('./svgo/jsAPI.js'),
    encodeSVGDatauri = require('./svgo/tools.js').encodeSVGDatauri,
    JS2SVG = require('./svgo/js2svg.js');

var SVGO = function(config) {
    this.config = CONFIG(config);
};

SVGO.prototype.optimize = function(svgstr, info) {
    info = info || {};
    return new Promise((resolve, reject) => {
        if (this.config.error) {
            reject(this.config.error);
            return;
        }

        var config = this.config,
            maxPassCount = config.multipass ? 10 : 1,
            counter = 0,
            prevResultSize = Number.POSITIVE_INFINITY,
            optimizeOnceCallback = (svgjs) => {
                if (svgjs.error) {
                    reject(svgjs.error);
                    return;
                }

                info.multipassCount = counter;
                if (++counter < maxPassCount && svgjs.data.length < prevResultSize) {
                    prevResultSize = svgjs.data.length;
                    this._optimizeOnce(svgjs.data, info, optimizeOnceCallback);
                } else {
                    if (config.datauri) {
                        svgjs.data = encodeSVGDatauri(svgjs.data, config.datauri);
                    }
                    if (info && info.path) {
                        svgjs.path = info.path;
                    }
                    resolve(svgjs);
                }
            };

        this._optimizeOnce(svgstr, info, optimizeOnceCallback);
    });
};

SVGO.prototype._optimizeOnce = function(svgstr, info, callback) {
    var config = this.config;

    SVG2JS(svgstr, function(svgjs) {
        if (svgjs.error) {
            callback(svgjs);
            return;
        }

        svgjs = PLUGINS(svgjs, info, config.plugins);

        callback(JS2SVG(svgjs, config.js2svg));
    });
};

/**
 * The factory that creates a content item with the helper methods.
 *
 * @param {Object} data which passed to jsAPI constructor
 * @returns {JSAPI} content item
 */
SVGO.prototype.createContentItem = function(data) {
    return new JSAPI(data);
};

SVGO.Config = CONFIG;

module.exports = SVGO;
// Offer ES module interop compatibility.
module.exports.default = SVGO;

}, function(modId) {var map = {"./svgo/config.js":1597942295320,"./svgo/svg2js.js":1597942295321,"./svgo/plugins.js":1597942295327,"./svgo/jsAPI.js":1597942295322,"./svgo/tools.js":1597942295328,"./svgo/js2svg.js":1597942295329}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295320, function(require, module, exports) {


var FS = require('fs');
var PATH = require('path');
var yaml = require('js-yaml');

/**
 * Read and/or extend/replace default config file,
 * prepare and optimize plugins array.
 *
 * @param {Object} [config] input config
 * @return {Object} output config
 */
module.exports = function(config) {

    var defaults;
    config = typeof config == 'object' && config || {};

    if (config.plugins && !Array.isArray(config.plugins)) {
        return { error: 'Error: Invalid plugins list. Provided \'plugins\' in config should be an array.' };
    }

    if (config.full) {
        defaults = config;

        if (Array.isArray(defaults.plugins)) {
            defaults.plugins = preparePluginsArray(config, defaults.plugins);
        }
    } else {
        defaults = Object.assign({}, yaml.safeLoad(FS.readFileSync(__dirname + '/../../.svgo.yml', 'utf8')));
        defaults.plugins = preparePluginsArray(config, defaults.plugins || []);
        defaults = extendConfig(defaults, config);
    }

    if ('floatPrecision' in config && Array.isArray(defaults.plugins)) {
        defaults.plugins.forEach(function(plugin) {
            if (plugin.params && ('floatPrecision' in plugin.params)) {
                // Don't touch default plugin params
                plugin.params = Object.assign({}, plugin.params, { floatPrecision: config.floatPrecision });
            }
        });
    }

    if ('datauri' in config) {
        defaults.datauri = config.datauri;
    }

    if (Array.isArray(defaults.plugins)) {
        defaults.plugins = optimizePluginsArray(defaults.plugins);
    }

    return defaults;

};

/**
 * Require() all plugins in array.
 *
 * @param {Object} config
 * @param {Array} plugins input plugins array
 * @return {Array} input plugins array of arrays
 */
function preparePluginsArray(config, plugins) {

    var plugin,
        key;

    return plugins.map(function(item) {

        // {}
        if (typeof item === 'object') {

            key = Object.keys(item)[0];

            // custom
            if (typeof item[key] === 'object' && item[key].fn && typeof item[key].fn === 'function') {
                plugin = setupCustomPlugin(key, item[key]);

            } else {

                plugin = setPluginActiveState(
                    loadPlugin(config, key, item[key].path),
                    item,
                    key
                );
                plugin.name = key;
            }

        // name
        } else {

            plugin = loadPlugin(config, item);
            plugin.name = item;
            if (typeof plugin.params === 'object') {
                plugin.params = Object.assign({}, plugin.params);
            }

        }

        return plugin;

    });

}

/**
 * Extend plugins with the custom config object.
 *
 * @param {Array} plugins input plugins
 * @param {Object} config config
 * @return {Array} output plugins
 */
function extendConfig(defaults, config) {

    var key;

    // plugins
    if (config.plugins) {

        config.plugins.forEach(function(item) {

            // {}
            if (typeof item === 'object') {

                key = Object.keys(item)[0];

                if (item[key] == null) {
                    console.error(`Error: '${key}' plugin is misconfigured! Have you padded its content in YML properly?\n`);
                }

                // custom
                if (typeof item[key] === 'object' && item[key].fn && typeof item[key].fn === 'function') {
                    defaults.plugins.push(setupCustomPlugin(key, item[key]));

                // plugin defined via path
                } else if (typeof item[key] === 'object' && item[key].path) {
                    defaults.plugins.push(setPluginActiveState(loadPlugin(config, undefined, item[key].path), item, key));

                } else {
                    defaults.plugins.forEach(function(plugin) {

                        if (plugin.name === key) {
                            plugin = setPluginActiveState(plugin, item, key);
                        }
                    });
                }

            }

        });

    }

    defaults.multipass = config.multipass;

    // svg2js
    if (config.svg2js) {
        defaults.svg2js = config.svg2js;
    }

    // js2svg
    if (config.js2svg) {
        defaults.js2svg = config.js2svg;
    }

    return defaults;

}

/**
 * Setup and enable a custom plugin
 *
 * @param {String} plugin name
 * @param {Object} custom plugin
 * @return {Array} enabled plugin
 */
function setupCustomPlugin(name, plugin) {
    plugin.active = true;
    plugin.params = Object.assign({}, plugin.params || {});
    plugin.name = name;

    return plugin;
}

/**
 * Try to group sequential elements of plugins array.
 *
 * @param {Object} plugins input plugins
 * @return {Array} output plugins
 */
function optimizePluginsArray(plugins) {

    var prev;

    return plugins.reduce(function(plugins, item) {
        if (prev && item.type == prev[0].type) {
            prev.push(item);
        } else {
            plugins.push(prev = [item]);
        }
        return plugins;
    }, []);

}

/**
 * Sets plugin to active or inactive state.
 *
 * @param {Object} plugin
 * @param {Object} item
 * @param {Object} key
 * @return {Object} plugin
 */
function setPluginActiveState(plugin, item, key) {
    // name: {}
    if (typeof item[key] === 'object') {
        plugin.params = Object.assign({}, plugin.params || {}, item[key]);
        plugin.active = true;

    // name: false
    } else if (item[key] === false) {
        plugin.active = false;

    // name: true
    } else if (item[key] === true) {
        plugin.active = true;
    }

    return plugin;
}

/**
 * Loads default plugin using name or custom plugin defined via path in config.
 *
 * @param {Object} config
 * @param {Object} name
 * @param {Object} path
 * @return {Object} plugin
 */
function loadPlugin(config, name, path) {
    var plugin;

    if (!path) {
        plugin = require('../../plugins/' + name);
    } else {
        plugin = require(PATH.resolve(config.__DIR, path));
    }

    return Object.assign({}, plugin);
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295321, function(require, module, exports) {


var SAX = require('sax'),
    JSAPI = require('./jsAPI.js'),
    CSSClassList = require('./css-class-list'),
    CSSStyleDeclaration = require('./css-style-declaration'),
    entityDeclaration = /<!ENTITY\s+(\S+)\s+(?:'([^\']+)'|"([^\"]+)")\s*>/g;

var config = {
    strict: true,
    trim: false,
    normalize: true,
    lowercase: true,
    xmlns: true,
    position: true
};

/**
 * Convert SVG (XML) string to SVG-as-JS object.
 *
 * @param {String} data input data
 * @param {Function} callback
 */
module.exports = function(data, callback) {

    var sax = SAX.parser(config.strict, config),
        root = new JSAPI({ elem: '#document', content: [] }),
        current = root,
        stack = [root],
        textContext = null,
        parsingError = false;

    function pushToContent(content) {

        content = new JSAPI(content, current);

        (current.content = current.content || []).push(content);

        return content;

    }

    sax.ondoctype = function(doctype) {

        pushToContent({
            doctype: doctype
        });

        var subsetStart = doctype.indexOf('['),
            entityMatch;

        if (subsetStart >= 0) {
            entityDeclaration.lastIndex = subsetStart;

            while ((entityMatch = entityDeclaration.exec(data)) != null) {
                sax.ENTITIES[entityMatch[1]] = entityMatch[2] || entityMatch[3];
            }
        }
    };

    sax.onprocessinginstruction = function(data) {

        pushToContent({
            processinginstruction: data
        });

    };

    sax.oncomment = function(comment) {

        pushToContent({
            comment: comment.trim()
        });

    };

    sax.oncdata = function(cdata) {

        pushToContent({
            cdata: cdata
        });

    };

    sax.onopentag = function(data) {

        var elem = {
            elem: data.name,
            prefix: data.prefix,
            local: data.local,
            attrs: {}
        };

        elem.class = new CSSClassList(elem);
        elem.style = new CSSStyleDeclaration(elem);

        if (Object.keys(data.attributes).length) {
            for (var name in data.attributes) {

                if (name === 'class') { // has class attribute
                    elem.class.hasClass();
                }

                if (name === 'style') { // has style attribute
                    elem.style.hasStyle();
                }

                elem.attrs[name] = {
                    name: name,
                    value: data.attributes[name].value,
                    prefix: data.attributes[name].prefix,
                    local: data.attributes[name].local
                };
            }
        }

        elem = pushToContent(elem);
        current = elem;

        // Save info about <text> tag to prevent trimming of meaningful whitespace
        if (data.name == 'text' && !data.prefix) {
            textContext = current;
        }

        stack.push(elem);

    };

    sax.ontext = function(text) {

        if (/\S/.test(text) || textContext) {

            if (!textContext)
                text = text.trim();

            pushToContent({
                text: text
            });

        }

    };

    sax.onclosetag = function() {

        var last = stack.pop();

        // Trim text inside <text> tag.
        if (last == textContext) {
            trim(textContext);
            textContext = null;
        }
        current = stack[stack.length - 1];

    };

    sax.onerror = function(e) {

        e.message = 'Error in parsing SVG: ' + e.message;
        if (e.message.indexOf('Unexpected end') < 0) {
            throw e;
        }

    };

    sax.onend = function() {

        if (!this.error) {
            callback(root);
        } else {
            callback({ error: this.error.message });
        }

    };

    try {
        sax.write(data);
    } catch (e) {
        callback({ error: e.message });
        parsingError = true;
    }
    if (!parsingError) sax.close();

    function trim(elem) {
        if (!elem.content) return elem;

        var start = elem.content[0],
            end = elem.content[elem.content.length - 1];

        while (start && start.content && !start.text) start = start.content[0];
        if (start && start.text) start.text = start.text.replace(/^\s+/, '');

        while (end && end.content && !end.text) end = end.content[end.content.length - 1];
        if (end && end.text) end.text = end.text.replace(/\s+$/, '');

        return elem;

    }

};

}, function(modId) { var map = {"./jsAPI.js":1597942295322,"./css-class-list":1597942295324,"./css-style-declaration":1597942295325}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295322, function(require, module, exports) {


var cssSelect = require('css-select');

var svgoCssSelectAdapter = require('./css-select-adapter');
var cssSelectOpts = {
  xmlMode: true,
  adapter: svgoCssSelectAdapter
};

var JSAPI = module.exports = function(data, parentNode) {
    Object.assign(this, data);
    if (parentNode) {
        Object.defineProperty(this, 'parentNode', {
            writable: true,
            value: parentNode
        });
    }
};

/**
 * Perform a deep clone of this node.
 *
 * @return {Object} element
 */
JSAPI.prototype.clone = function() {
    var node = this;
    var nodeData = {};

    Object.keys(node).forEach(function(key) {
        if (key !== 'class' && key !== 'style' && key !== 'content') {
            nodeData[key] = node[key];
        }
    });

    // Deep-clone node data.
    nodeData = JSON.parse(JSON.stringify(nodeData));

    // parentNode gets set to a proper object by the parent clone,
    // but it needs to be true/false now to do the right thing
    // in the constructor.
    var clonedNode = new JSAPI(nodeData, !!node.parentNode);

    if (node.class) {
        clonedNode.class = node.class.clone(clonedNode);
    }
    if (node.style) {
        clonedNode.style = node.style.clone(clonedNode);
    }
    if (node.content) {
        clonedNode.content = node.content.map(function(childNode) {
            var clonedChild = childNode.clone();
            clonedChild.parentNode = clonedNode;
            return clonedChild;
        });
    }

    return clonedNode;
};

/**
 * Determine if item is an element
 * (any, with a specific name or in a names array).
 *
 * @param {String|Array} [param] element name or names arrays
 * @return {Boolean}
 */
JSAPI.prototype.isElem = function(param) {

    if (!param) return !!this.elem;

    if (Array.isArray(param)) return !!this.elem && (param.indexOf(this.elem) > -1);

    return !!this.elem && this.elem === param;

};

/**
 * Renames an element
 *
 * @param {String} name new element name
 * @return {Object} element
 */
JSAPI.prototype.renameElem = function(name) {

    if (name && typeof name === 'string')
        this.elem = this.local = name;

    return this;

};

/**
 * Determine if element is empty.
 *
 * @return {Boolean}
 */
 JSAPI.prototype.isEmpty = function() {

    return !this.content || !this.content.length;

};

/**
 * Find the closest ancestor of the current element.
 * @param elemName
 *
 * @return {?Object}
 */
 JSAPI.prototype.closestElem = function(elemName) {
    var elem = this;

    while ((elem = elem.parentNode) && !elem.isElem(elemName));

    return elem;
};

/**
 * Changes content by removing elements and/or adding new elements.
 *
 * @param {Number} start Index at which to start changing the content.
 * @param {Number} n Number of elements to remove.
 * @param {Array|Object} [insertion] Elements to add to the content.
 * @return {Array} Removed elements.
 */
 JSAPI.prototype.spliceContent = function(start, n, insertion) {

    if (arguments.length < 2) return [];

    if (!Array.isArray(insertion))
        insertion = Array.apply(null, arguments).slice(2);

    insertion.forEach(function(inner) { inner.parentNode = this }, this);

    return this.content.splice.apply(this.content, [start, n].concat(insertion));


};

/**
 * Determine if element has an attribute
 * (any, or by name or by name + value).
 *
 * @param {String} [name] attribute name
 * @param {String} [val] attribute value (will be toString()'ed)
 * @return {Boolean}
 */
 JSAPI.prototype.hasAttr = function(name, val) {

    if (!this.attrs || !Object.keys(this.attrs).length) return false;

    if (!arguments.length) return !!this.attrs;

    if (val !== undefined) return !!this.attrs[name] && this.attrs[name].value === val.toString();

    return !!this.attrs[name];

};

/**
 * Determine if element has an attribute by local name
 * (any, or by name or by name + value).
 *
 * @param {String} [localName] local attribute name
 * @param {Number|String|RegExp|Function} [val] attribute value (will be toString()'ed or executed, otherwise ignored)
 * @return {Boolean}
 */
 JSAPI.prototype.hasAttrLocal = function(localName, val) {

    if (!this.attrs || !Object.keys(this.attrs).length) return false;

    if (!arguments.length) return !!this.attrs;

    var callback;

    switch (val != null && val.constructor && val.constructor.name) {
        case 'Number':   // same as String
        case 'String':   callback = stringValueTest; break;
        case 'RegExp':   callback = regexpValueTest; break;
        case 'Function': callback = funcValueTest; break;
        default:         callback = nameTest;
    }
    return this.someAttr(callback);

    function nameTest(attr) {
        return attr.local === localName;
    }

    function stringValueTest(attr) {
        return attr.local === localName && val == attr.value;
    }

    function regexpValueTest(attr) {
        return attr.local === localName && val.test(attr.value);
    }

    function funcValueTest(attr) {
        return attr.local === localName && val(attr.value);
    }

};

/**
 * Get a specific attribute from an element
 * (by name or name + value).
 *
 * @param {String} name attribute name
 * @param {String} [val] attribute value (will be toString()'ed)
 * @return {Object|Undefined}
 */
 JSAPI.prototype.attr = function(name, val) {

    if (!this.hasAttr() || !arguments.length) return undefined;

    if (val !== undefined) return this.hasAttr(name, val) ? this.attrs[name] : undefined;

    return this.attrs[name];

};

/**
 * Get computed attribute value from an element
 *
 * @param {String} name attribute name
 * @return {Object|Undefined}
 */
 JSAPI.prototype.computedAttr = function(name, val) {
    /* jshint eqnull: true */
    if (!arguments.length) return;

    for (var elem = this; elem && (!elem.hasAttr(name) || !elem.attr(name).value); elem = elem.parentNode);

    if (val != null) {
        return elem ? elem.hasAttr(name, val) : false;
    } else if (elem && elem.hasAttr(name)) {
        return elem.attrs[name].value;
    }

};

/**
 * Remove a specific attribute.
 *
 * @param {String|Array} name attribute name
 * @param {String} [val] attribute value
 * @return {Boolean}
 */
 JSAPI.prototype.removeAttr = function(name, val, recursive) {

    if (!arguments.length) return false;

    if (Array.isArray(name)) {
        name.forEach(this.removeAttr, this);
        return false;
    }

    if (!this.hasAttr(name)) return false;

    if (!recursive && val && this.attrs[name].value !== val) return false;

    delete this.attrs[name];

    if (!Object.keys(this.attrs).length) delete this.attrs;

    return true;

};

/**
 * Add attribute.
 *
 * @param {Object} [attr={}] attribute object
 * @return {Object|Boolean} created attribute or false if no attr was passed in
 */
 JSAPI.prototype.addAttr = function(attr) {
    attr = attr || {};

    if (attr.name === undefined ||
        attr.prefix === undefined ||
        attr.local === undefined
    ) return false;

    this.attrs = this.attrs || {};
    this.attrs[attr.name] = attr;

    if(attr.name === 'class') { // newly added class attribute
        this.class.hasClass();
    }

    if(attr.name === 'style') { // newly added style attribute
        this.style.hasStyle();
    }

    return this.attrs[attr.name];

};

/**
 * Iterates over all attributes.
 *
 * @param {Function} callback callback
 * @param {Object} [context] callback context
 * @return {Boolean} false if there are no any attributes
 */
 JSAPI.prototype.eachAttr = function(callback, context) {

    if (!this.hasAttr()) return false;

    for (var name in this.attrs) {
        callback.call(context, this.attrs[name]);
    }

    return true;

};

/**
 * Tests whether some attribute passes the test.
 *
 * @param {Function} callback callback
 * @param {Object} [context] callback context
 * @return {Boolean} false if there are no any attributes
 */
 JSAPI.prototype.someAttr = function(callback, context) {

    if (!this.hasAttr()) return false;

    for (var name in this.attrs) {
        if (callback.call(context, this.attrs[name])) return true;
    }

    return false;

};

/**
 * Evaluate a string of CSS selectors against the element and returns matched elements.
 *
 * @param {String} selectors CSS selector(s) string
 * @return {Array} null if no elements matched
 */
 JSAPI.prototype.querySelectorAll = function(selectors) {

   var matchedEls = cssSelect(selectors, this, cssSelectOpts);

   return matchedEls.length > 0 ? matchedEls : null;

};

/**
 * Evaluate a string of CSS selectors against the element and returns only the first matched element.
 *
 * @param {String} selectors CSS selector(s) string
 * @return {Array} null if no element matched
 */
 JSAPI.prototype.querySelector = function(selectors) {

   return cssSelect.selectOne(selectors, this, cssSelectOpts);

};

/**
 * Test if a selector matches a given element.
 *
 * @param {String} selector CSS selector string
 * @return {Boolean} true if element would be selected by selector string, false if it does not
 */
 JSAPI.prototype.matches = function(selector) {

   return cssSelect.is(this, selector, cssSelectOpts);

};

}, function(modId) { var map = {"./css-select-adapter":1597942295323}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295323, function(require, module, exports) {


var baseCssAdapter = require('css-select-base-adapter');

/**
 * DOMUtils API for SVGO AST (used by css-select)
 */
var svgoCssSelectAdapterMin = {

    // is the node a tag?
    // isTag: ( node:Node ) => isTag:Boolean
    isTag: function(node) {
        return node.isElem();
    },

    // get the parent of the node
    // getParent: ( node:Node ) => parentNode:Node
    // returns null when no parent exists
    getParent: function(node) {
        return node.parentNode || null;
    },

    // get the node's children
    // getChildren: ( node:Node ) => children:[Node]
    getChildren: function(node) {
        return node.content || [];
    },

    // get the name of the tag
    // getName: ( elem:ElementNode ) => tagName:String
    getName: function(elemAst) {
        return elemAst.elem;
    },

    // get the text content of the node, and its children if it has any
    // getText: ( node:Node ) => text:String
    // returns empty string when there is no text
    getText: function(node) {
        return node.content[0].text || node.content[0].cdata || '';
    },

    // get the attribute value
    // getAttributeValue: ( elem:ElementNode, name:String ) => value:String
    // returns null when attribute doesn't exist
    getAttributeValue: function(elem, name) {
        return elem.hasAttr(name) ? elem.attr(name).value : null;
    }
};

// use base adapter for default implementation
var svgoCssSelectAdapter = baseCssAdapter(svgoCssSelectAdapterMin);

module.exports = svgoCssSelectAdapter;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295324, function(require, module, exports) {


var values = require('object.values');
if (!Object.values) {
    values.shim();
}


var CSSClassList = function(node) {
    this.parentNode = node;
    this.classNames = new Set();
    this.classAttr = null;
    //this.classValue = null;
};

/**
 * Performs a deep clone of this object.
 *
 * @param parentNode the parentNode to assign to the cloned result
 */
CSSClassList.prototype.clone = function(parentNode) {
    var node = this;
    var nodeData = {};

    Object.keys(node).forEach(function(key) {
        if (key !== 'parentNode') {
            nodeData[key] = node[key];
        }
    });

    // Deep-clone node data.
    nodeData = JSON.parse(JSON.stringify(nodeData));

    var clone = new CSSClassList(parentNode);
   Object.assign(clone, nodeData);
    return clone;
};

CSSClassList.prototype.hasClass = function() {
    this.classAttr = { // empty class attr
        'name': 'class',
        'value': null
    };

    this.addClassHandler();
};


// attr.class

CSSClassList.prototype.addClassHandler = function() {

    Object.defineProperty(this.parentNode.attrs, 'class', {
        get: this.getClassAttr.bind(this),
        set: this.setClassAttr.bind(this),
        enumerable: true,
        configurable: true
    });

    this.addClassValueHandler();
};

// attr.class.value

CSSClassList.prototype.addClassValueHandler = function() {

    Object.defineProperty(this.classAttr, 'value', {
        get: this.getClassValue.bind(this),
        set: this.setClassValue.bind(this),
        enumerable: true,
        configurable: true
    });
};

CSSClassList.prototype.getClassAttr = function() {
    return this.classAttr;
};

CSSClassList.prototype.setClassAttr = function(newClassAttr) {
    this.setClassValue(newClassAttr.value); // must before applying value handler!

    this.classAttr = newClassAttr;
    this.addClassValueHandler();
};

CSSClassList.prototype.getClassValue = function() {
    var arrClassNames = Array.from(this.classNames);
    return arrClassNames.join(' ');
};

CSSClassList.prototype.setClassValue = function(newValue) {
    if(typeof newValue === 'undefined') {
      this.classNames.clear();
      return;
    }
    var arrClassNames = newValue.split(' ');
    this.classNames = new Set(arrClassNames);
};


CSSClassList.prototype.add = function(/* variadic */) {
    this.hasClass();
    Object.values(arguments).forEach(this._addSingle.bind(this));
};

CSSClassList.prototype._addSingle = function(className) {
    this.classNames.add(className);
};


CSSClassList.prototype.remove = function(/* variadic */) {
    this.hasClass();
    Object.values(arguments).forEach(this._removeSingle.bind(this));
};

CSSClassList.prototype._removeSingle = function(className) {
    this.classNames.delete(className);
};


CSSClassList.prototype.item = function(index) {
    var arrClassNames = Array.from(this.classNames);
    return arrClassNames[index];
};

CSSClassList.prototype.toggle = function(className, force) {
    if(this.contains(className) || force === false) {
        this.classNames.delete(className);
    }
    this.classNames.add(className);
};

CSSClassList.prototype.contains = function(className) {
    return this.classNames.has(className);
};


module.exports = CSSClassList;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295325, function(require, module, exports) {


var csstree = require('css-tree'),
    csstools = require('../css-tools');


var CSSStyleDeclaration = function(node) {
    this.parentNode = node;

    this.properties = new Map();
    this.hasSynced = false;

    this.styleAttr = null;
    this.styleValue = null;

    this.parseError = false;
};

/**
 * Performs a deep clone of this object.
 *
 * @param parentNode the parentNode to assign to the cloned result
 */
CSSStyleDeclaration.prototype.clone = function(parentNode) {
    var node = this;
    var nodeData = {};

    Object.keys(node).forEach(function(key) {
        if (key !== 'parentNode') {
            nodeData[key] = node[key];
        }
    });

    // Deep-clone node data.
    nodeData = JSON.parse(JSON.stringify(nodeData));

    var clone = new CSSStyleDeclaration(parentNode);
    Object.assign(clone, nodeData);
    return clone;
};

CSSStyleDeclaration.prototype.hasStyle = function() {
    this.addStyleHandler();
};




// attr.style

CSSStyleDeclaration.prototype.addStyleHandler = function() {

    this.styleAttr = { // empty style attr
        'name': 'style',
        'value': null
    };

    Object.defineProperty(this.parentNode.attrs, 'style', {
        get: this.getStyleAttr.bind(this),
        set: this.setStyleAttr.bind(this),
        enumerable: true,
        configurable: true
    });

    this.addStyleValueHandler();
};

// attr.style.value

CSSStyleDeclaration.prototype.addStyleValueHandler = function() {

    Object.defineProperty(this.styleAttr, 'value', {
        get: this.getStyleValue.bind(this),
        set: this.setStyleValue.bind(this),
        enumerable: true,
        configurable: true
    });
};

CSSStyleDeclaration.prototype.getStyleAttr = function() {
    return this.styleAttr;
};

CSSStyleDeclaration.prototype.setStyleAttr = function(newStyleAttr) {
    this.setStyleValue(newStyleAttr.value); // must before applying value handler!

    this.styleAttr = newStyleAttr;
    this.addStyleValueHandler();
    this.hasSynced = false; // raw css changed
};

CSSStyleDeclaration.prototype.getStyleValue = function() {
    return this.getCssText();
};

CSSStyleDeclaration.prototype.setStyleValue = function(newValue) {
    this.properties.clear(); // reset all existing properties
    this.styleValue = newValue;
    this.hasSynced = false; // raw css changed
};




CSSStyleDeclaration.prototype._loadCssText = function() {
    if (this.hasSynced) {
        return;
    }
    this.hasSynced = true; // must be set here to prevent loop in setProperty(...)

    if (!this.styleValue || this.styleValue.length === 0) {
        return;
    }
    var inlineCssStr = this.styleValue;

    var declarations = {};
    try {
        declarations = csstree.parse(inlineCssStr, {
            context: 'declarationList',
            parseValue: false
        });
    } catch (parseError) {
        this.parseError = parseError;
        return;
    }
    this.parseError = false;

    var self = this;
    declarations.children.each(function(declaration) {
        try {
          var styleDeclaration = csstools.csstreeToStyleDeclaration(declaration);
          self.setProperty(styleDeclaration.name, styleDeclaration.value, styleDeclaration.priority);
        } catch(styleError) {
            if(styleError.message !== 'Unknown node type: undefined') {
                self.parseError = styleError;
            }
        }
    });
};


// only reads from properties

/**
 * Get the textual representation of the declaration block (equivalent to .cssText attribute).
 *
 * @return {String} Textual representation of the declaration block (empty string for no properties)
 */
CSSStyleDeclaration.prototype.getCssText = function() {
    var properties = this.getProperties();

    if (this.parseError) {
        // in case of a parse error, pass through original styles
        return this.styleValue;
    }

    var cssText = [];
    properties.forEach(function(property, propertyName) {
        var strImportant = property.priority === 'important' ? '!important' : '';
        cssText.push(propertyName.trim() + ':' + property.value.trim() + strImportant);
    });
    return cssText.join(';');
};

CSSStyleDeclaration.prototype._handleParseError = function() {
    if (this.parseError) {
        console.warn('Warning: Parse error when parsing inline styles, style properties of this element cannot be used. The raw styles can still be get/set using .attr(\'style\').value. Error details: ' + this.parseError);
    }
};


CSSStyleDeclaration.prototype._getProperty = function(propertyName) {
    if(typeof propertyName === 'undefined') {
        throw Error('1 argument required, but only 0 present.');
    }

    var properties = this.getProperties();
    this._handleParseError();

    var property = properties.get(propertyName.trim());
    return property;
};

/**
 * Return the optional priority, "important".
 *
 * @param {String} propertyName representing the property name to be checked.
 * @return {String} priority that represents the priority (e.g. "important") if one exists. If none exists, returns the empty string.
 */
CSSStyleDeclaration.prototype.getPropertyPriority = function(propertyName) {
    var property = this._getProperty(propertyName);
    return property ? property.priority : '';
};

/**
 * Return the property value given a property name.
 *
 * @param {String} propertyName representing the property name to be checked.
 * @return {String} value containing the value of the property. If not set, returns the empty string.
 */
CSSStyleDeclaration.prototype.getPropertyValue = function(propertyName) {
    var property = this._getProperty(propertyName);
    return property ? property.value : null;
};

/**
 * Return a property name.
 *
 * @param {Number} index of the node to be fetched. The index is zero-based.
 * @return {String} propertyName that is the name of the CSS property at the specified index.
 */
CSSStyleDeclaration.prototype.item = function(index) {
    if(typeof index === 'undefined') {
        throw Error('1 argument required, but only 0 present.');
    }

    var properties = this.getProperties();
    this._handleParseError();

    return Array.from(properties.keys())[index];
};

/**
 * Return all properties of the node.
 *
 * @return {Map} properties that is a Map with propertyName as key and property (propertyValue + propertyPriority) as value.
 */
CSSStyleDeclaration.prototype.getProperties = function() {
    this._loadCssText();
    return this.properties;
};


// writes to properties

/**
 * Remove a property from the CSS declaration block.
 *
 * @param {String} propertyName representing the property name to be removed.
 * @return {String} oldValue equal to the value of the CSS property before it was removed.
 */
CSSStyleDeclaration.prototype.removeProperty = function(propertyName) {
    if(typeof propertyName === 'undefined') {
        throw Error('1 argument required, but only 0 present.');
    }

    this.hasStyle();

    var properties = this.getProperties();
    this._handleParseError();

    var oldValue = this.getPropertyValue(propertyName);
    properties.delete(propertyName.trim());
    return oldValue;
};

/**
 * Modify an existing CSS property or creates a new CSS property in the declaration block.
 *
 * @param {String} propertyName representing the CSS property name to be modified.
 * @param {String} [value] containing the new property value. If not specified, treated as the empty string. value must not contain "!important" -- that should be set using the priority parameter.
 * @param {String} [priority] allowing the "important" CSS priority to be set. If not specified, treated as the empty string.
 * @return {undefined}
 */
CSSStyleDeclaration.prototype.setProperty = function(propertyName, value, priority) {
    if(typeof propertyName === 'undefined') {
        throw Error('propertyName argument required, but only not present.');
    }

    this.hasStyle();

    var properties = this.getProperties();
    this._handleParseError();

    var property = {
        value: value.trim(),
        priority: priority.trim()
    };
    properties.set(propertyName.trim(), property);

    return property;
};


module.exports = CSSStyleDeclaration;

}, function(modId) { var map = {"../css-tools":1597942295326}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295326, function(require, module, exports) {


var csstree     = require('css-tree'),
    List        = csstree.List,
    stable      = require('stable'),
    specificity = require('csso/lib/restructure/prepare/specificity');


/**
 * Flatten a CSS AST to a selectors list.
 *
 * @param {Object} cssAst css-tree AST to flatten
 * @return {Array} selectors
 */
function flattenToSelectors(cssAst) {
    var selectors = [];

    csstree.walk(cssAst, {visit: 'Rule', enter: function(node) {
        if (node.type !== 'Rule') {
            return;
        }

        var atrule = this.atrule;
        var rule = node;

        node.prelude.children.each(function(selectorNode, selectorItem) {
            var selector = {
                item: selectorItem,
                atrule: atrule,
                rule: rule,
                pseudos: []
            };

            selectorNode.children.each(function(selectorChildNode, selectorChildItem, selectorChildList) {
                if (selectorChildNode.type === 'PseudoClassSelector' ||
                    selectorChildNode.type === 'PseudoElementSelector') {
                    selector.pseudos.push({
                        item: selectorChildItem,
                        list: selectorChildList
                    });
                }
            });

            selectors.push(selector);
        });
    }});

    return selectors;
}

/**
 * Filter selectors by Media Query.
 *
 * @param {Array} selectors to filter
 * @param {Array} useMqs Array with strings of media queries that should pass (<name> <expression>)
 * @return {Array} Filtered selectors that match the passed media queries
 */
function filterByMqs(selectors, useMqs) {
    return selectors.filter(function(selector) {
        if (selector.atrule === null) {
            return ~useMqs.indexOf('');
        }

        var mqName = selector.atrule.name;
        var mqStr = mqName;
        if (selector.atrule.expression &&
            selector.atrule.expression.children.first().type === 'MediaQueryList') {
            var mqExpr = csstree.generate(selector.atrule.expression);
            mqStr = [mqName, mqExpr].join(' ');
        }

        return ~useMqs.indexOf(mqStr);
    });
}

/**
 * Filter selectors by the pseudo-elements and/or -classes they contain.
 *
 * @param {Array} selectors to filter
 * @param {Array} usePseudos Array with strings of single or sequence of pseudo-elements and/or -classes that should pass
 * @return {Array} Filtered selectors that match the passed pseudo-elements and/or -classes
 */
function filterByPseudos(selectors, usePseudos) {
    return selectors.filter(function(selector) {
        var pseudoSelectorsStr = csstree.generate({
            type: 'Selector',
            children: new List().fromArray(selector.pseudos.map(function(pseudo) {
                return pseudo.item.data;
            }))
        });
        return ~usePseudos.indexOf(pseudoSelectorsStr);
    });
}

/**
 * Remove pseudo-elements and/or -classes from the selectors for proper matching.
 *
 * @param {Array} selectors to clean
 * @return {Array} Selectors without pseudo-elements and/or -classes
 */
function cleanPseudos(selectors) {
    selectors.forEach(function(selector) {
        selector.pseudos.forEach(function(pseudo) {
            pseudo.list.remove(pseudo.item);
        });
    });
}


/**
 * Compares two selector specificities.
 * extracted from https://github.com/keeganstreet/specificity/blob/master/specificity.js#L211
 *
 * @param {Array} aSpecificity Specificity of selector A
 * @param {Array} bSpecificity Specificity of selector B
 * @return {Number} Score of selector specificity A compared to selector specificity B
 */
function compareSpecificity(aSpecificity, bSpecificity) {
    for (var i = 0; i < 4; i += 1) {
        if (aSpecificity[i] < bSpecificity[i]) {
            return -1;
        } else if (aSpecificity[i] > bSpecificity[i]) {
            return 1;
        }
    }

    return 0;
}


/**
 * Compare two simple selectors.
 *
 * @param {Object} aSimpleSelectorNode Simple selector A
 * @param {Object} bSimpleSelectorNode Simple selector B
 * @return {Number} Score of selector A compared to selector B
 */
function compareSimpleSelectorNode(aSimpleSelectorNode, bSimpleSelectorNode) {
    var aSpecificity = specificity(aSimpleSelectorNode),
        bSpecificity = specificity(bSimpleSelectorNode);
    return compareSpecificity(aSpecificity, bSpecificity);
}

function _bySelectorSpecificity(selectorA, selectorB) {
    return compareSimpleSelectorNode(selectorA.item.data, selectorB.item.data);
}


/**
 * Sort selectors stably by their specificity.
 *
 * @param {Array} selectors to be sorted
 * @return {Array} Stable sorted selectors
 */
function sortSelectors(selectors) {
    return stable(selectors, _bySelectorSpecificity);
}


/**
 * Convert a css-tree AST style declaration to CSSStyleDeclaration property.
 *
 * @param {Object} declaration css-tree style declaration
 * @return {Object} CSSStyleDeclaration property
 */
function csstreeToStyleDeclaration(declaration) {
    var propertyName = declaration.property,
        propertyValue = csstree.generate(declaration.value),
        propertyPriority = (declaration.important ? 'important' : '');
    return {
        name: propertyName,
        value: propertyValue,
        priority: propertyPriority
    };
}


/**
 * Gets the CSS string of a style element
 *
 * @param {Object} element style element
 * @return {String|Array} CSS string or empty array if no styles are set
 */
function getCssStr(elem) {
    return elem.content[0].text || elem.content[0].cdata || [];
}

/**
 * Sets the CSS string of a style element
 *
 * @param {Object} element style element
 * @param {String} CSS string to be set
 * @return {Object} reference to field with CSS
 */
function setCssStr(elem, css) {
    // in case of cdata field
    if(elem.content[0].cdata) {
        elem.content[0].cdata = css;
        return elem.content[0].cdata;
    }

    // in case of text field + if nothing was set yet
    elem.content[0].text  = css;
    return elem.content[0].text;
}


module.exports.flattenToSelectors = flattenToSelectors;

module.exports.filterByMqs = filterByMqs;
module.exports.filterByPseudos = filterByPseudos;
module.exports.cleanPseudos = cleanPseudos;

module.exports.compareSpecificity = compareSpecificity;
module.exports.compareSimpleSelectorNode = compareSimpleSelectorNode;

module.exports.sortSelectors = sortSelectors;

module.exports.csstreeToStyleDeclaration = csstreeToStyleDeclaration;

module.exports.getCssStr = getCssStr;
module.exports.setCssStr = setCssStr;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295327, function(require, module, exports) {


/**
 * Plugins engine.
 *
 * @module plugins
 *
 * @param {Object} data input data
 * @param {Object} info extra information
 * @param {Object} plugins plugins object from config
 * @return {Object} output data
 */
module.exports = function(data, info, plugins) {

    plugins.forEach(function(group) {

        switch(group[0].type) {
            case 'perItem':
                data = perItem(data, info, group);
                break;
            case 'perItemReverse':
                data = perItem(data, info, group, true);
                break;
            case 'full':
                data = full(data, info, group);
                break;
        }

    });

    return data;

};

/**
 * Direct or reverse per-item loop.
 *
 * @param {Object} data input data
 * @param {Object} info extra information
 * @param {Array} plugins plugins list to process
 * @param {Boolean} [reverse] reverse pass?
 * @return {Object} output data
 */
function perItem(data, info, plugins, reverse) {

    function monkeys(items) {

        items.content = items.content.filter(function(item) {

            // reverse pass
            if (reverse && item.content) {
                monkeys(item);
            }

            // main filter
            var filter = true;

            for (var i = 0; filter && i < plugins.length; i++) {
                var plugin = plugins[i];

                if (plugin.active && plugin.fn(item, plugin.params, info) === false) {
                    filter = false;
                }
            }

            // direct pass
            if (!reverse && item.content) {
                monkeys(item);
            }

            return filter;

        });

        return items;

    }

    return monkeys(data);

}

/**
 * "Full" plugins.
 *
 * @param {Object} data input data
 * @param {Object} info extra information
 * @param {Array} plugins plugins list to process
 * @return {Object} output data
 */
function full(data, info, plugins) {

    plugins.forEach(function(plugin) {
        if (plugin.active) {
            data = plugin.fn(data, plugin.params, info);
        }
    });

    return data;

}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295328, function(require, module, exports) {


var FS = require('fs');

/**
 * Encode plain SVG data string into Data URI string.
 *
 * @param {String} str input string
 * @param {String} type Data URI type
 * @return {String} output string
 */
exports.encodeSVGDatauri = function(str, type) {
    var prefix = 'data:image/svg+xml';
    if (!type || type === 'base64') {
        // base64
        prefix += ';base64,';
        if (Buffer.from) {
            str = prefix + Buffer.from(str).toString('base64');
        } else {
            str = prefix + new Buffer(str).toString('base64');
        }
    } else if (type === 'enc') {
        // URI encoded
        str = prefix + ',' + encodeURIComponent(str);
    } else if (type === 'unenc') {
        // unencoded
        str = prefix + ',' + str;
    }
    return str;
};

/**
 * Decode SVG Data URI string into plain SVG string.
 *
 * @param {string} str input string
 * @return {String} output string
 */
exports.decodeSVGDatauri = function(str) {
    var regexp = /data:image\/svg\+xml(;charset=[^;,]*)?(;base64)?,(.*)/;
    var match = regexp.exec(str);

    // plain string
    if (!match) return str;

    var data = match[3];

    if (match[2]) {
        // base64
        str = new Buffer(data, 'base64').toString('utf8');
    } else if (data.charAt(0) === '%') {
        // URI encoded
        str = decodeURIComponent(data);
    } else if (data.charAt(0) === '<') {
        // unencoded
        str = data;
    }
    return str;
};

exports.intersectArrays = function(a, b) {
    return a.filter(function(n) {
        return b.indexOf(n) > -1;
    });
};

/**
 * Convert a row of numbers to an optimized string view.
 *
 * @example
 * [0, -1, .5, .5] → "0-1 .5.5"
 *
 * @param {number[]} data
 * @param {Object} params
 * @param {string?} command path data instruction
 * @return {string}
 */
exports.cleanupOutData = function(data, params, command) {
    var str = '',
        delimiter,
        prev;

    data.forEach(function(item, i) {
        // space delimiter by default
        delimiter = ' ';

        // no extra space in front of first number
        if (i == 0) delimiter = '';

        // no extra space after 'arcto' command flags
        if (params.noSpaceAfterFlags && (command == 'A' || command == 'a')) {
            var pos = i % 7;
            if (pos == 4 || pos == 5) delimiter = '';
        }

        // remove floating-point numbers leading zeros
        // 0.5 → .5
        // -0.5 → -.5
        if (params.leadingZero) {
            item = removeLeadingZero(item);
        }

        // no extra space in front of negative number or
        // in front of a floating number if a previous number is floating too
        if (
            params.negativeExtraSpace &&
            delimiter != '' &&
            (item < 0 ||
                (String(item).charCodeAt(0) == 46 && prev % 1 !== 0)
            )
        ) {
            delimiter = '';
        }
        // save prev item value
        prev = item;
        str += delimiter + item;
    });
    return str;
};

/**
 * Remove floating-point numbers leading zero.
 *
 * @example
 * 0.5 → .5
 *
 * @example
 * -0.5 → -.5
 *
 * @param {Float} num input number
 *
 * @return {String} output number as string
 */
var removeLeadingZero = exports.removeLeadingZero = function(num) {
    var strNum = num.toString();

    if (0 < num && num < 1 && strNum.charCodeAt(0) == 48) {
        strNum = strNum.slice(1);
    } else if (-1 < num && num < 0 && strNum.charCodeAt(1) == 48) {
        strNum = strNum.charAt(0) + strNum.slice(2);
    }
    return strNum;
};


/**
 * Synchronously check if path is a directory. Tolerant to errors like ENOENT.
 * @param {string} path
 */
exports.checkIsDir = function(path) {
    try {
        return FS.lstatSync(path).isDirectory();
    } catch(e) {
        return false;
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295329, function(require, module, exports) {


var EOL = require('os').EOL,
    textElem = require('../../plugins/_collections.js').elemsGroups.textContent.concat('title');

var defaults = {
    doctypeStart: '<!DOCTYPE',
    doctypeEnd: '>',
    procInstStart: '<?',
    procInstEnd: '?>',
    tagOpenStart: '<',
    tagOpenEnd: '>',
    tagCloseStart: '</',
    tagCloseEnd: '>',
    tagShortStart: '<',
    tagShortEnd: '/>',
    attrStart: '="',
    attrEnd: '"',
    commentStart: '<!--',
    commentEnd: '-->',
    cdataStart: '<![CDATA[',
    cdataEnd: ']]>',
    textStart: '',
    textEnd: '',
    indent: 4,
    regEntities: /[&'"<>]/g,
    regValEntities: /[&"<>]/g,
    encodeEntity: encodeEntity,
    pretty: false,
    useShortTags: true
};

var entities = {
      '&': '&amp;',
      '\'': '&apos;',
      '"': '&quot;',
      '>': '&gt;',
      '<': '&lt;',
    };

/**
 * Convert SVG-as-JS object to SVG (XML) string.
 *
 * @param {Object} data input data
 * @param {Object} config config
 *
 * @return {Object} output data
 */
module.exports = function(data, config) {

    return new JS2SVG(config).convert(data);

};

function JS2SVG(config) {

    if (config) {
        this.config = Object.assign({}, defaults, config);
    } else {
        this.config = Object.assign({}, defaults);
    }

    var indent = this.config.indent;
    if (typeof indent == 'number' && !isNaN(indent)) {
        this.config.indent = (indent < 0) ? '\t' : ' '.repeat(indent);
    } else if (typeof indent != 'string') {
        this.config.indent = '    ';
    }

    if (this.config.pretty) {
        this.config.doctypeEnd += EOL;
        this.config.procInstEnd += EOL;
        this.config.commentEnd += EOL;
        this.config.cdataEnd += EOL;
        this.config.tagShortEnd += EOL;
        this.config.tagOpenEnd += EOL;
        this.config.tagCloseEnd += EOL;
        this.config.textEnd += EOL;
    }

    this.indentLevel = 0;
    this.textContext = null;

}

function encodeEntity(char) {
    return entities[char];
}

/**
 * Start conversion.
 *
 * @param {Object} data input data
 *
 * @return {String}
 */
JS2SVG.prototype.convert = function(data) {

    var svg = '';

    if (data.content) {

        this.indentLevel++;

        data.content.forEach(function(item) {

            if (item.elem) {
               svg += this.createElem(item);
            } else if (item.text) {
               svg += this.createText(item.text);
            } else if (item.doctype) {
                svg += this.createDoctype(item.doctype);
            } else if (item.processinginstruction) {
                svg += this.createProcInst(item.processinginstruction);
            } else if (item.comment) {
                svg += this.createComment(item.comment);
            } else if (item.cdata) {
                svg += this.createCDATA(item.cdata);
            }

        }, this);

    }

    this.indentLevel--;

    return {
        data: svg,
        info: {
            width: this.width,
            height: this.height
        }
    };

};

/**
 * Create indent string in accordance with the current node level.
 *
 * @return {String}
 */
JS2SVG.prototype.createIndent = function() {

    var indent = '';

    if (this.config.pretty && !this.textContext) {
        indent = this.config.indent.repeat(this.indentLevel - 1);
    }

    return indent;

};

/**
 * Create doctype tag.
 *
 * @param {String} doctype doctype body string
 *
 * @return {String}
 */
JS2SVG.prototype.createDoctype = function(doctype) {

    return  this.config.doctypeStart +
            doctype +
            this.config.doctypeEnd;

};

/**
 * Create XML Processing Instruction tag.
 *
 * @param {Object} instruction instruction object
 *
 * @return {String}
 */
JS2SVG.prototype.createProcInst = function(instruction) {

    return  this.config.procInstStart +
            instruction.name +
            ' ' +
            instruction.body +
            this.config.procInstEnd;

};

/**
 * Create comment tag.
 *
 * @param {String} comment comment body
 *
 * @return {String}
 */
JS2SVG.prototype.createComment = function(comment) {

    return  this.config.commentStart +
            comment +
            this.config.commentEnd;

};

/**
 * Create CDATA section.
 *
 * @param {String} cdata CDATA body
 *
 * @return {String}
 */
JS2SVG.prototype.createCDATA = function(cdata) {

    return  this.createIndent() +
            this.config.cdataStart +
            cdata +
            this.config.cdataEnd;

};

/**
 * Create element tag.
 *
 * @param {Object} data element object
 *
 * @return {String}
 */
JS2SVG.prototype.createElem = function(data) {

    // beautiful injection for obtaining SVG information :)
    if (
        data.isElem('svg') &&
        data.hasAttr('width') &&
        data.hasAttr('height')
    ) {
        this.width = data.attr('width').value;
        this.height = data.attr('height').value;
    }

    // empty element and short tag
    if (data.isEmpty()) {
        if (this.config.useShortTags) {
            return this.createIndent() +
                   this.config.tagShortStart +
                   data.elem +
                   this.createAttrs(data) +
                   this.config.tagShortEnd;
        } else {
            return this.createIndent() +
                   this.config.tagShortStart +
                   data.elem +
                   this.createAttrs(data) +
                   this.config.tagOpenEnd +
                   this.config.tagCloseStart +
                   data.elem +
                   this.config.tagCloseEnd;
        }
    // non-empty element
    } else {
        var tagOpenStart = this.config.tagOpenStart,
            tagOpenEnd = this.config.tagOpenEnd,
            tagCloseStart = this.config.tagCloseStart,
            tagCloseEnd = this.config.tagCloseEnd,
            openIndent = this.createIndent(),
            textIndent = '',
            processedData = '',
            dataEnd = '';

        if (this.textContext) {
            tagOpenStart = defaults.tagOpenStart;
            tagOpenEnd = defaults.tagOpenEnd;
            tagCloseStart = defaults.tagCloseStart;
            tagCloseEnd = defaults.tagCloseEnd;
            openIndent = '';
        } else if (data.isElem(textElem)) {
            if (this.config.pretty) {
                textIndent += openIndent + this.config.indent;
            }
            this.textContext = data;
        }

        processedData += this.convert(data).data;

        if (this.textContext == data) {
            this.textContext = null;
            if (this.config.pretty) dataEnd = EOL;
        }

        return  openIndent +
                tagOpenStart +
                data.elem +
                this.createAttrs(data) +
                tagOpenEnd +
                textIndent +
                processedData +
                dataEnd +
                this.createIndent() +
                tagCloseStart +
                data.elem +
                tagCloseEnd;

    }

};

/**
 * Create element attributes.
 *
 * @param {Object} elem attributes object
 *
 * @return {String}
 */
JS2SVG.prototype.createAttrs = function(elem) {

    var attrs = '';

    elem.eachAttr(function(attr) {

        if (attr.value !== undefined) {
            attrs +=    ' ' +
                        attr.name +
                        this.config.attrStart +
                        String(attr.value).replace(this.config.regValEntities, this.config.encodeEntity) +
                        this.config.attrEnd;
        }
        else {
            attrs +=    ' ' +
                        attr.name;
        }


    }, this);

    return attrs;

};

/**
 * Create text node.
 *
 * @param {String} text text
 *
 * @return {String}
 */
JS2SVG.prototype.createText = function(text) {

    return  this.createIndent() +
            this.config.textStart +
            text.replace(this.config.regEntities, this.config.encodeEntity) +
            (this.textContext ? '' : this.config.textEnd);

};

}, function(modId) { var map = {"../../plugins/_collections.js":1597942295330}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295330, function(require, module, exports) {


// http://www.w3.org/TR/SVG11/intro.html#Definitions
exports.elemsGroups = {
    animation: ['animate', 'animateColor', 'animateMotion', 'animateTransform', 'set'],
    descriptive: ['desc', 'metadata', 'title'],
    shape: ['circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect'],
    structural: ['defs', 'g', 'svg', 'symbol', 'use'],
    paintServer: ['solidColor', 'linearGradient', 'radialGradient', 'meshGradient', 'pattern', 'hatch'],
    nonRendering: ['linearGradient', 'radialGradient', 'pattern', 'clipPath', 'mask', 'marker', 'symbol', 'filter', 'solidColor'],
    container: ['a', 'defs', 'g', 'marker', 'mask', 'missing-glyph', 'pattern', 'svg', 'switch', 'symbol', 'foreignObject'],
    textContent: ['altGlyph', 'altGlyphDef', 'altGlyphItem', 'glyph', 'glyphRef', 'textPath', 'text', 'tref', 'tspan'],
    textContentChild: ['altGlyph', 'textPath', 'tref', 'tspan'],
    lightSource: ['feDiffuseLighting', 'feSpecularLighting', 'feDistantLight', 'fePointLight', 'feSpotLight'],
    filterPrimitive: ['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence']
};

exports.pathElems = ['path', 'glyph', 'missing-glyph'];

// http://www.w3.org/TR/SVG11/intro.html#Definitions
exports.attrsGroups = {
    animationAddition: ['additive', 'accumulate'],
    animationAttributeTarget: ['attributeType', 'attributeName'],
    animationEvent: ['onbegin', 'onend', 'onrepeat', 'onload'],
    animationTiming: ['begin', 'dur', 'end', 'min', 'max', 'restart', 'repeatCount', 'repeatDur', 'fill'],
    animationValue: ['calcMode', 'values', 'keyTimes', 'keySplines', 'from', 'to', 'by'],
    conditionalProcessing: ['requiredFeatures', 'requiredExtensions', 'systemLanguage'],
    core: ['id', 'tabindex', 'xml:base', 'xml:lang', 'xml:space'],
    graphicalEvent: ['onfocusin', 'onfocusout', 'onactivate', 'onclick', 'onmousedown', 'onmouseup', 'onmouseover', 'onmousemove', 'onmouseout', 'onload'],
    presentation: [
        'alignment-baseline',
        'baseline-shift',
        'clip',
        'clip-path',
        'clip-rule',
        'color',
        'color-interpolation',
        'color-interpolation-filters',
        'color-profile',
        'color-rendering',
        'cursor',
        'direction',
        'display',
        'dominant-baseline',
        'enable-background',
        'fill',
        'fill-opacity',
        'fill-rule',
        'filter',
        'flood-color',
        'flood-opacity',
        'font-family',
        'font-size',
        'font-size-adjust',
        'font-stretch',
        'font-style',
        'font-variant',
        'font-weight',
        'glyph-orientation-horizontal',
        'glyph-orientation-vertical',
        'image-rendering',
        'letter-spacing',
        'lighting-color',
        'marker-end',
        'marker-mid',
        'marker-start',
        'mask',
        'opacity',
        'overflow',
        'paint-order',
        'pointer-events',
        'shape-rendering',
        'stop-color',
        'stop-opacity',
        'stroke',
        'stroke-dasharray',
        'stroke-dashoffset',
        'stroke-linecap',
        'stroke-linejoin',
        'stroke-miterlimit',
        'stroke-opacity',
        'stroke-width',
        'text-anchor',
        'text-decoration',
        'text-overflow',
        'text-rendering',
        'transform',
        'unicode-bidi',
        'vector-effect',
        'visibility',
        'word-spacing',
        'writing-mode'
    ],
    xlink: ['xlink:href', 'xlink:show', 'xlink:actuate', 'xlink:type', 'xlink:role', 'xlink:arcrole', 'xlink:title'],
    documentEvent: ['onunload', 'onabort', 'onerror', 'onresize', 'onscroll', 'onzoom'],
    filterPrimitive: ['x', 'y', 'width', 'height', 'result'],
    transferFunction: ['type', 'tableValues', 'slope', 'intercept', 'amplitude', 'exponent', 'offset']
};

exports.attrsGroupsDefaults = {
    core: {'xml:space': 'preserve'},
    filterPrimitive: {x: '0', y: '0', width: '100%', height: '100%'},
    presentation: {
        clip: 'auto',
        'clip-path': 'none',
        'clip-rule': 'nonzero',
        mask: 'none',
        opacity: '1',
        'stop-color': '#000',
        'stop-opacity': '1',
        'fill-opacity': '1',
        'fill-rule': 'nonzero',
        fill: '#000',
        stroke: 'none',
        'stroke-width': '1',
        'stroke-linecap': 'butt',
        'stroke-linejoin': 'miter',
        'stroke-miterlimit': '4',
        'stroke-dasharray': 'none',
        'stroke-dashoffset': '0',
        'stroke-opacity': '1',
        'paint-order': 'normal',
        'vector-effect': 'none',
        display: 'inline',
        visibility: 'visible',
        'marker-start': 'none',
        'marker-mid': 'none',
        'marker-end': 'none',
        'color-interpolation': 'sRGB',
        'color-interpolation-filters': 'linearRGB',
        'color-rendering': 'auto',
        'shape-rendering': 'auto',
        'text-rendering': 'auto',
        'image-rendering': 'auto',
        'font-style': 'normal',
        'font-variant': 'normal',
        'font-weight': 'normal',
        'font-stretch': 'normal',
        'font-size': 'medium',
        'font-size-adjust': 'none',
        kerning: 'auto',
        'letter-spacing': 'normal',
        'word-spacing': 'normal',
        'text-decoration': 'none',
        'text-anchor': 'start',
        'text-overflow': 'clip',
        'writing-mode': 'lr-tb',
        'glyph-orientation-vertical': 'auto',
        'glyph-orientation-horizontal': '0deg',
        direction: 'ltr',
        'unicode-bidi': 'normal',
        'dominant-baseline': 'auto',
        'alignment-baseline': 'baseline',
        'baseline-shift': 'baseline'
    },
    transferFunction: {slope: '1', intercept: '0', amplitude: '1', exponent: '1', offset: '0'}
};

// http://www.w3.org/TR/SVG11/eltindex.html
exports.elems = {
    a: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'target'
        ],
        defaults: {
            target: '_self'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    altGlyph: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'x',
            'y',
            'dx',
            'dy',
            'glyphRef',
            'format',
            'rotate'
        ]
    },
    altGlyphDef: {
        attrsGroups: [
            'core'
        ],
        content: [
            'glyphRef'
        ]
    },
    altGlyphItem: {
        attrsGroups: [
            'core'
        ],
        content: [
            'glyphRef',
            'altGlyphItem'
        ]
    },
    animate: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'animationAddition',
            'animationAttributeTarget',
            'animationEvent',
            'animationTiming',
            'animationValue',
            'presentation',
            'xlink'
        ],
        attrs: [
            'externalResourcesRequired'
        ],
        contentGroups: [
            'descriptive'
        ]
    },
    animateColor: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'animationEvent',
            'xlink',
            'animationAttributeTarget',
            'animationTiming',
            'animationValue',
            'animationAddition',
            'presentation'
        ],
        attrs: [
            'externalResourcesRequired'
        ],
        contentGroups: [
            'descriptive'
        ]
    },
    animateMotion: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'animationEvent',
            'xlink',
            'animationTiming',
            'animationValue',
            'animationAddition'
        ],
        attrs: [
            'externalResourcesRequired',
            'path',
            'keyPoints',
            'rotate',
            'origin'
        ],
        defaults: {
            'rotate': '0'
        },
        contentGroups: [
            'descriptive'
        ],
        content: [
            'mpath'
        ]
    },
    animateTransform: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'animationEvent',
            'xlink',
            'animationAttributeTarget',
            'animationTiming',
            'animationValue',
            'animationAddition'
        ],
        attrs: [
            'externalResourcesRequired',
            'type'
        ],
        contentGroups: [
            'descriptive'
        ]
    },
    circle: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'cx',
            'cy',
            'r'
        ],
        defaults: {
            cx: '0',
            cy: '0'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    clipPath: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'clipPathUnits'
        ],
        defaults: {
            clipPathUnits: 'userSpaceOnUse'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'shape'
        ],
        content: [
            'text',
            'use'
        ]
    },
    'color-profile': {
        attrsGroups: [
            'core',
            'xlink'
        ],
        attrs: [
            'local',
            'name',
            'rendering-intent'
        ],
        defaults: {
            name: 'sRGB',
            'rendering-intent': 'auto'
        },
        contentGroups: [
            'descriptive'
        ]
    },
    cursor: {
        attrsGroups: [
            'core',
            'conditionalProcessing',
            'xlink'
        ],
        attrs: [
            'externalResourcesRequired',
            'x',
            'y'
        ],
        defaults: {
            x: '0',
            y: '0'
        },
        contentGroups: [
            'descriptive'
        ]
    },
    defs: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform'
        ],
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    desc: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'class',
            'style'
        ]
    },
    ellipse: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'cx',
            'cy',
            'rx',
            'ry'
        ],
        defaults: {
            cx: '0',
            cy: '0'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    feBlend: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            // TODO: in - 'If no value is provided and this is the first filter primitive,
            // then this filter primitive will use SourceGraphic as its input'
            'in',
            'in2',
            'mode'
        ],
        defaults: {
            mode: 'normal'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feColorMatrix: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'type',
            'values'
        ],
        defaults: {
            type: 'matrix'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feComponentTransfer: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in'
        ],
        content: [
            'feFuncA',
            'feFuncB',
            'feFuncG',
            'feFuncR'
        ]
    },
    feComposite: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'in2',
            'operator',
            'k1',
            'k2',
            'k3',
            'k4'
        ],
        defaults: {
            operator: 'over',
            k1: '0',
            k2: '0',
            k3: '0',
            k4: '0'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feConvolveMatrix: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'order',
            'kernelMatrix',
            // TODO: divisor - 'The default value is the sum of all values in kernelMatrix,
            // with the exception that if the sum is zero, then the divisor is set to 1'
            'divisor',
            'bias',
            // TODO: targetX - 'By default, the convolution matrix is centered in X over each
            // pixel of the input image (i.e., targetX = floor ( orderX / 2 ))'
            'targetX',
            'targetY',
            'edgeMode',
            // TODO: kernelUnitLength - 'The first number is the <dx> value. The second number
            // is the <dy> value. If the <dy> value is not specified, it defaults to the same value as <dx>'
            'kernelUnitLength',
            'preserveAlpha'
        ],
        defaults: {
            order: '3',
            bias: '0',
            edgeMode: 'duplicate',
            preserveAlpha: 'false'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feDiffuseLighting: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'surfaceScale',
            'diffuseConstant',
            'kernelUnitLength'
        ],
        defaults: {
            surfaceScale: '1',
            diffuseConstant: '1'
        },
        contentGroups: [
            'descriptive'
        ],
        content: [
            // TODO: 'exactly one light source element, in any order'
            'feDistantLight',
            'fePointLight',
            'feSpotLight'
        ]
    },
    feDisplacementMap: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'in2',
            'scale',
            'xChannelSelector',
            'yChannelSelector'
        ],
        defaults: {
            scale: '0',
            xChannelSelector: 'A',
            yChannelSelector: 'A'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feDistantLight: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'azimuth',
            'elevation'
        ],
        defaults: {
            azimuth: '0',
            elevation: '0'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feFlood: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style'
        ],
        content: [
            'animate',
            'animateColor',
            'set'
        ]
    },
    feFuncA: {
        attrsGroups: [
            'core',
            'transferFunction'
        ],
        content: [
            'set',
            'animate'
        ]
    },
    feFuncB: {
        attrsGroups: [
            'core',
            'transferFunction'
        ],
        content: [
            'set',
            'animate'
        ]
    },
    feFuncG: {
        attrsGroups: [
            'core',
            'transferFunction'
        ],
        content: [
            'set',
            'animate'
        ]
    },
    feFuncR: {
        attrsGroups: [
            'core',
            'transferFunction'
        ],
        content: [
            'set',
            'animate'
        ]
    },
    feGaussianBlur: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'stdDeviation'
        ],
        defaults: {
            stdDeviation: '0'
        },
        content: [
            'set',
            'animate'
        ]
    },
    feImage: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'preserveAspectRatio',
            'href',
            'xlink:href'
        ],
        defaults: {
            preserveAspectRatio: 'xMidYMid meet'
        },
        content: [
            'animate',
            'animateTransform',
            'set'
        ]
    },
    feMerge: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style'
        ],
        content: [
            'feMergeNode'
        ]
    },
    feMergeNode: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'in'
        ],
        content: [
            'animate',
            'set'
        ]
    },
    feMorphology: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'operator',
            'radius'
        ],
        defaults: {
            operator: 'erode',
            radius: '0'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feOffset: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'dx',
            'dy'
        ],
        defaults: {
            dx: '0',
            dy: '0'
        },
        content: [
            'animate',
            'set'
        ]
    },
    fePointLight: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'x',
            'y',
            'z'
        ],
        defaults: {
            x: '0',
            y: '0',
            z: '0'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feSpecularLighting: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'surfaceScale',
            'specularConstant',
            'specularExponent',
            'kernelUnitLength'
        ],
        defaults: {
            surfaceScale: '1',
            specularConstant: '1',
            specularExponent: '1'
        },
        contentGroups: [
            'descriptive',
            // TODO: exactly one 'light source element'
            'lightSource'
        ]
    },
    feSpotLight: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'x',
            'y',
            'z',
            'pointsAtX',
            'pointsAtY',
            'pointsAtZ',
            'specularExponent',
            'limitingConeAngle'
        ],
        defaults: {
            x: '0',
            y: '0',
            z: '0',
            pointsAtX: '0',
            pointsAtY: '0',
            pointsAtZ: '0',
            specularExponent: '1'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feTile: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in'
        ],
        content: [
            'animate',
            'set'
        ]
    },
    feTurbulence: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'baseFrequency',
            'numOctaves',
            'seed',
            'stitchTiles',
            'type'
        ],
        defaults: {
            baseFrequency: '0',
            numOctaves: '1',
            seed: '0',
            stitchTiles: 'noStitch',
            type: 'turbulence'
        },
        content: [
            'animate',
            'set'
        ]
    },
    filter: {
        attrsGroups: [
            'core',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'x',
            'y',
            'width',
            'height',
            'filterRes',
            'filterUnits',
            'primitiveUnits',
            'href',
            'xlink:href'
        ],
        defaults: {
            primitiveUnits: 'userSpaceOnUse',
            x: '-10%',
            y: '-10%',
            width: '120%',
            height: '120%'
        },
        contentGroups: [
            'descriptive',
            'filterPrimitive'
        ],
        content: [
            'animate',
            'set'
        ]
    },
    font: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'horiz-origin-x',
            'horiz-origin-y',
            'horiz-adv-x',
            'vert-origin-x',
            'vert-origin-y',
            'vert-adv-y'
        ],
        defaults: {
            'horiz-origin-x': '0',
            'horiz-origin-y': '0'
        },
        contentGroups: [
            'descriptive'
        ],
        content: [
            'font-face',
            'glyph',
            'hkern',
            'missing-glyph',
            'vkern'
        ]
    },
    'font-face': {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'font-family',
            'font-style',
            'font-variant',
            'font-weight',
            'font-stretch',
            'font-size',
            'unicode-range',
            'units-per-em',
            'panose-1',
            'stemv',
            'stemh',
            'slope',
            'cap-height',
            'x-height',
            'accent-height',
            'ascent',
            'descent',
            'widths',
            'bbox',
            'ideographic',
            'alphabetic',
            'mathematical',
            'hanging',
            'v-ideographic',
            'v-alphabetic',
            'v-mathematical',
            'v-hanging',
            'underline-position',
            'underline-thickness',
            'strikethrough-position',
            'strikethrough-thickness',
            'overline-position',
            'overline-thickness'
        ],
        defaults: {
            'font-style': 'all',
            'font-variant': 'normal',
            'font-weight': 'all',
            'font-stretch': 'normal',
            'unicode-range': 'U+0-10FFFF',
            'units-per-em': '1000',
            'panose-1': '0 0 0 0 0 0 0 0 0 0',
            'slope': '0'
        },
        contentGroups: [
            'descriptive'
        ],
        content: [
            // TODO: "at most one 'font-face-src' element"
            'font-face-src'
        ]
    },
    // TODO: empty content
    'font-face-format': {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'string'
        ]
    },
    'font-face-name': {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'name'
        ]
    },
    'font-face-src': {
        attrsGroups: [
            'core'
        ],
        content: [
            'font-face-name',
            'font-face-uri'
        ]
    },
    'font-face-uri': {
        attrsGroups: [
            'core',
            'xlink'
        ],
        attrs: [
            'href',
            'xlink:href'
        ],
        content: [
            'font-face-format'
        ]
    },
    foreignObject: {
        attrsGroups: [
            'core',
            'conditionalProcessing',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'x',
            'y',
            'width',
            'height'
        ],
        defaults: {
            x: 0,
            y: 0
        }
    },
    g: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform'
        ],
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    glyph: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'd',
            'horiz-adv-x',
            'vert-origin-x',
            'vert-origin-y',
            'vert-adv-y',
            'unicode',
            'glyph-name',
            'orientation',
            'arabic-form',
            'lang'
        ],
        defaults: {
            'arabic-form': 'initial'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ],
    },
    glyphRef: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'd',
            'horiz-adv-x',
            'vert-origin-x',
            'vert-origin-y',
            'vert-adv-y'
        ],
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    hatch: {
        attrsGroups: [
            'core',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'x',
            'y',
            'pitch',
            'rotate',
            'hatchUnits',
            'hatchContentUnits',
            'transform'
        ],
        defaults: {
            hatchUnits: 'objectBoundingBox',
            hatchContentUnits: 'userSpaceOnUse',
            x: '0',
            y: '0',
            pitch: '0',
            rotate: '0'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ],
        content: [
            'hatchPath'
        ]
    },
    hatchPath: {
        attrsGroups: [
            'core',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'd',
            'offset'
        ],
        defaults: {
            offset: '0'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    hkern: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'u1',
            'g1',
            'u2',
            'g2',
            'k'
        ]
    },
    image: {
        attrsGroups: [
            'core',
            'conditionalProcessing',
            'graphicalEvent',
            'xlink',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'preserveAspectRatio',
            'transform',
            'x',
            'y',
            'width',
            'height',
            'href',
            'xlink:href'
        ],
        defaults: {
            x: '0',
            y: '0',
            preserveAspectRatio: 'xMidYMid meet'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    line: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'x1',
            'y1',
            'x2',
            'y2'
        ],
        defaults: {
            x1: '0',
            y1: '0',
            x2: '0',
            y2: '0'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    linearGradient: {
        attrsGroups: [
            'core',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'x1',
            'y1',
            'x2',
            'y2',
            'gradientUnits',
            'gradientTransform',
            'spreadMethod',
            'href',
            'xlink:href'
        ],
        defaults: {
            x1: '0',
            y1: '0',
            x2: '100%',
            y2: '0',
            spreadMethod: 'pad'
        },
        contentGroups: [
            'descriptive'
        ],
        content: [
            'animate',
            'animateTransform',
            'set',
            'stop'
        ]
    },
    marker: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'viewBox',
            'preserveAspectRatio',
            'refX',
            'refY',
            'markerUnits',
            'markerWidth',
            'markerHeight',
            'orient'
        ],
        defaults: {
            markerUnits: 'strokeWidth',
            refX: '0',
            refY: '0',
            markerWidth: '3',
            markerHeight: '3'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    mask: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'x',
            'y',
            'width',
            'height',
            'maskUnits',
            'maskContentUnits'
        ],
        defaults: {
            maskUnits: 'objectBoundingBox',
            maskContentUnits: 'userSpaceOnUse',
            x: '-10%',
            y: '-10%',
            width: '120%',
            height: '120%'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    metadata: {
        attrsGroups: [
            'core'
        ]
    },
    'missing-glyph': {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'd',
            'horiz-adv-x',
            'vert-origin-x',
            'vert-origin-y',
            'vert-adv-y'
        ],
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    mpath: {
        attrsGroups: [
            'core',
            'xlink'
        ],
        attrs: [
            'externalResourcesRequired',
            'href',
            'xlink:href'
        ],
        contentGroups: [
            'descriptive'
        ]
    },
    path: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'd',
            'pathLength'
        ],
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    pattern: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'viewBox',
            'preserveAspectRatio',
            'x',
            'y',
            'width',
            'height',
            'patternUnits',
            'patternContentUnits',
            'patternTransform',
            'href',
            'xlink:href'
        ],
        defaults: {
            patternUnits: 'objectBoundingBox',
            patternContentUnits: 'userSpaceOnUse',
            x: '0',
            y: '0',
            width: '0',
            height: '0',
            preserveAspectRatio: 'xMidYMid meet'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'paintServer',
            'shape',
            'structural'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    polygon: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'points'
        ],
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    polyline: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'points'
        ],
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    radialGradient: {
        attrsGroups: [
            'core',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'cx',
            'cy',
            'r',
            'fx',
            'fy',
            'fr',
            'gradientUnits',
            'gradientTransform',
            'spreadMethod',
            'href',
            'xlink:href'
        ],
        defaults: {
            gradientUnits: 'objectBoundingBox',
            cx: '50%',
            cy: '50%',
            r: '50%'
        },
        contentGroups: [
            'descriptive'
        ],
        content: [
            'animate',
            'animateTransform',
            'set',
            'stop'
        ]
    },
    meshGradient: {
        attrsGroups: [
            'core',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'x',
            'y',
            'gradientUnits',
            'transform'
        ],
        contentGroups: [
            'descriptive',
            'paintServer',
            'animation',
        ],
        content: [
            'meshRow'
        ]
    },
    meshRow: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style'
        ],
        contentGroups: [
            'descriptive'
        ],
        content: [
            'meshPatch'
        ]
    },
    meshPatch: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style'
        ],
        contentGroups: [
            'descriptive'
        ],
        content: [
            'stop'
        ]
    },
    rect: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'x',
            'y',
            'width',
            'height',
            'rx',
            'ry'
        ],
        defaults: {
            x: '0',
            y: '0'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    script: {
        attrsGroups: [
            'core',
            'xlink'
        ],
        attrs: [
            'externalResourcesRequired',
            'type',
            'href',
            'xlink:href'
        ]
    },
    set: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'animation',
            'xlink',
            'animationAttributeTarget',
            'animationTiming',
        ],
        attrs: [
            'externalResourcesRequired',
            'to'
        ],
        contentGroups: [
            'descriptive'
        ]
    },
    solidColor: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style'
        ],
        contentGroups: [
            'paintServer'
        ]
    },
    stop: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'offset',
            'path'
        ],
        content: [
            'animate',
            'animateColor',
            'set'
        ]
    },
    style: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'type',
            'media',
            'title'
        ],
        defaults: {
            type: 'text/css'
        }
    },
    svg: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'documentEvent',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'x',
            'y',
            'width',
            'height',
            'viewBox',
            'preserveAspectRatio',
            'zoomAndPan',
            'version',
            'baseProfile',
            'contentScriptType',
            'contentStyleType'
        ],
        defaults: {
            x: '0',
            y: '0',
            width: '100%',
            height: '100%',
            preserveAspectRatio: 'xMidYMid meet',
            zoomAndPan: 'magnify',
            version: '1.1',
            baseProfile: 'none',
            contentScriptType: 'application/ecmascript',
            contentStyleType: 'text/css'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    switch: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform'
        ],
        contentGroups: [
            'animation',
            'descriptive',
            'shape'
        ],
        content: [
            'a',
            'foreignObject',
            'g',
            'image',
            'svg',
            'switch',
            'text',
            'use'
        ]
    },
    symbol: {
        attrsGroups: [
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'preserveAspectRatio',
            'viewBox',
            'refX',
            'refY'
        ],
        defaults: {
            refX: 0,
            refY: 0
        },
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    text: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'lengthAdjust',
            'x',
            'y',
            'dx',
            'dy',
            'rotate',
            'textLength'
        ],
        defaults: {
            x: '0',
            y: '0',
            lengthAdjust: 'spacing'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'textContentChild'
        ],
        content: [
            'a'
        ]
    },
    textPath: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'href',
            'xlink:href',
            'startOffset',
            'method',
            'spacing',
            'd'
        ],
        defaults: {
            startOffset: '0',
            method: 'align',
            spacing: 'exact'
        },
        contentGroups: [
            'descriptive'
        ],
        content: [
            'a',
            'altGlyph',
            'animate',
            'animateColor',
            'set',
            'tref',
            'tspan'
        ]
    },
    title: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'class',
            'style'
        ]
    },
    tref: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'href',
            'xlink:href'
        ],
        contentGroups: [
            'descriptive'
        ],
        content: [
            'animate',
            'animateColor',
            'set'
        ]
    },
    tspan: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'x',
            'y',
            'dx',
            'dy',
            'rotate',
            'textLength',
            'lengthAdjust'
        ],
        contentGroups: [
            'descriptive'
        ],
        content: [
            'a',
            'altGlyph',
            'animate',
            'animateColor',
            'set',
            'tref',
            'tspan'
        ]
    },
    use: {
        attrsGroups: [
            'core',
            'conditionalProcessing',
            'graphicalEvent',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'x',
            'y',
            'width',
            'height',
            'href',
            'xlink:href'
        ],
        defaults: {
            x: '0',
            y: '0'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    view: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'externalResourcesRequired',
            'viewBox',
            'preserveAspectRatio',
            'zoomAndPan',
            'viewTarget'
        ],
        contentGroups: [
            'descriptive'
        ]
    },
    vkern: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'u1',
            'g1',
            'u2',
            'g2',
            'k'
        ]
    }
};

// http://wiki.inkscape.org/wiki/index.php/Inkscape-specific_XML_attributes
exports.editorNamespaces = [
    'http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd',
    'http://inkscape.sourceforge.net/DTD/sodipodi-0.dtd',
    'http://www.inkscape.org/namespaces/inkscape',
    'http://www.bohemiancoding.com/sketch/ns',
    'http://ns.adobe.com/AdobeIllustrator/10.0/',
    'http://ns.adobe.com/Graphs/1.0/',
    'http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/',
    'http://ns.adobe.com/Variables/1.0/',
    'http://ns.adobe.com/SaveForWeb/1.0/',
    'http://ns.adobe.com/Extensibility/1.0/',
    'http://ns.adobe.com/Flows/1.0/',
    'http://ns.adobe.com/ImageReplacement/1.0/',
    'http://ns.adobe.com/GenericCustomNamespace/1.0/',
    'http://ns.adobe.com/XPath/1.0/',
    'http://schemas.microsoft.com/visio/2003/SVGExtensions/',
    'http://taptrix.com/vectorillustrator/svg_extensions',
    'http://www.figma.com/figma/ns',
    'http://purl.org/dc/elements/1.1/',
    'http://creativecommons.org/ns#',
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'http://www.serif.com/',
    'http://www.vector.evaxdesign.sk'
];

// http://www.w3.org/TR/SVG11/linking.html#processingIRI
exports.referencesProps = [
    'clip-path',
    'color-profile',
    'fill',
    'filter',
    'marker-start',
    'marker-mid',
    'marker-end',
    'mask',
    'stroke',
    'style'
];

// http://www.w3.org/TR/SVG11/propidx.html
exports.inheritableAttrs = [
    'clip-rule',
    'color',
    'color-interpolation',
    'color-interpolation-filters',
    'color-profile',
    'color-rendering',
    'cursor',
    'direction',
    'dominant-baseline',
    'fill',
    'fill-opacity',
    'fill-rule',
    'font',
    'font-family',
    'font-size',
    'font-size-adjust',
    'font-stretch',
    'font-style',
    'font-variant',
    'font-weight',
    'glyph-orientation-horizontal',
    'glyph-orientation-vertical',
    'image-rendering',
    'letter-spacing',
    'marker',
    'marker-end',
    'marker-mid',
    'marker-start',
    'paint-order',
    'pointer-events',
    'shape-rendering',
    'stroke',
    'stroke-dasharray',
    'stroke-dashoffset',
    'stroke-linecap',
    'stroke-linejoin',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-width',
    'text-anchor',
    'text-rendering',
    'transform',
    'visibility',
    'word-spacing',
    'writing-mode'
];

exports.presentationNonInheritableGroupAttrs = [
    'display',
    'clip-path',
    'filter',
    'mask',
    'opacity',
    'text-decoration',
    'transform',
    'unicode-bidi',
    'visibility'
];

// http://www.w3.org/TR/SVG11/single-page.html#types-ColorKeywords
exports.colorsNames = {
    'aliceblue': '#f0f8ff',
    'antiquewhite': '#faebd7',
    'aqua': '#0ff',
    'aquamarine': '#7fffd4',
    'azure': '#f0ffff',
    'beige': '#f5f5dc',
    'bisque': '#ffe4c4',
    'black': '#000',
    'blanchedalmond': '#ffebcd',
    'blue': '#00f',
    'blueviolet': '#8a2be2',
    'brown': '#a52a2a',
    'burlywood': '#deb887',
    'cadetblue': '#5f9ea0',
    'chartreuse': '#7fff00',
    'chocolate': '#d2691e',
    'coral': '#ff7f50',
    'cornflowerblue': '#6495ed',
    'cornsilk': '#fff8dc',
    'crimson': '#dc143c',
    'cyan': '#0ff',
    'darkblue': '#00008b',
    'darkcyan': '#008b8b',
    'darkgoldenrod': '#b8860b',
    'darkgray': '#a9a9a9',
    'darkgreen': '#006400',
    'darkgrey': '#a9a9a9',
    'darkkhaki': '#bdb76b',
    'darkmagenta': '#8b008b',
    'darkolivegreen': '#556b2f',
    'darkorange': '#ff8c00',
    'darkorchid': '#9932cc',
    'darkred': '#8b0000',
    'darksalmon': '#e9967a',
    'darkseagreen': '#8fbc8f',
    'darkslateblue': '#483d8b',
    'darkslategray': '#2f4f4f',
    'darkslategrey': '#2f4f4f',
    'darkturquoise': '#00ced1',
    'darkviolet': '#9400d3',
    'deeppink': '#ff1493',
    'deepskyblue': '#00bfff',
    'dimgray': '#696969',
    'dimgrey': '#696969',
    'dodgerblue': '#1e90ff',
    'firebrick': '#b22222',
    'floralwhite': '#fffaf0',
    'forestgreen': '#228b22',
    'fuchsia': '#f0f',
    'gainsboro': '#dcdcdc',
    'ghostwhite': '#f8f8ff',
    'gold': '#ffd700',
    'goldenrod': '#daa520',
    'gray': '#808080',
    'green': '#008000',
    'greenyellow': '#adff2f',
    'grey': '#808080',
    'honeydew': '#f0fff0',
    'hotpink': '#ff69b4',
    'indianred': '#cd5c5c',
    'indigo': '#4b0082',
    'ivory': '#fffff0',
    'khaki': '#f0e68c',
    'lavender': '#e6e6fa',
    'lavenderblush': '#fff0f5',
    'lawngreen': '#7cfc00',
    'lemonchiffon': '#fffacd',
    'lightblue': '#add8e6',
    'lightcoral': '#f08080',
    'lightcyan': '#e0ffff',
    'lightgoldenrodyellow': '#fafad2',
    'lightgray': '#d3d3d3',
    'lightgreen': '#90ee90',
    'lightgrey': '#d3d3d3',
    'lightpink': '#ffb6c1',
    'lightsalmon': '#ffa07a',
    'lightseagreen': '#20b2aa',
    'lightskyblue': '#87cefa',
    'lightslategray': '#789',
    'lightslategrey': '#789',
    'lightsteelblue': '#b0c4de',
    'lightyellow': '#ffffe0',
    'lime': '#0f0',
    'limegreen': '#32cd32',
    'linen': '#faf0e6',
    'magenta': '#f0f',
    'maroon': '#800000',
    'mediumaquamarine': '#66cdaa',
    'mediumblue': '#0000cd',
    'mediumorchid': '#ba55d3',
    'mediumpurple': '#9370db',
    'mediumseagreen': '#3cb371',
    'mediumslateblue': '#7b68ee',
    'mediumspringgreen': '#00fa9a',
    'mediumturquoise': '#48d1cc',
    'mediumvioletred': '#c71585',
    'midnightblue': '#191970',
    'mintcream': '#f5fffa',
    'mistyrose': '#ffe4e1',
    'moccasin': '#ffe4b5',
    'navajowhite': '#ffdead',
    'navy': '#000080',
    'oldlace': '#fdf5e6',
    'olive': '#808000',
    'olivedrab': '#6b8e23',
    'orange': '#ffa500',
    'orangered': '#ff4500',
    'orchid': '#da70d6',
    'palegoldenrod': '#eee8aa',
    'palegreen': '#98fb98',
    'paleturquoise': '#afeeee',
    'palevioletred': '#db7093',
    'papayawhip': '#ffefd5',
    'peachpuff': '#ffdab9',
    'peru': '#cd853f',
    'pink': '#ffc0cb',
    'plum': '#dda0dd',
    'powderblue': '#b0e0e6',
    'purple': '#800080',
    'rebeccapurple': '#639',
    'red': '#f00',
    'rosybrown': '#bc8f8f',
    'royalblue': '#4169e1',
    'saddlebrown': '#8b4513',
    'salmon': '#fa8072',
    'sandybrown': '#f4a460',
    'seagreen': '#2e8b57',
    'seashell': '#fff5ee',
    'sienna': '#a0522d',
    'silver': '#c0c0c0',
    'skyblue': '#87ceeb',
    'slateblue': '#6a5acd',
    'slategray': '#708090',
    'slategrey': '#708090',
    'snow': '#fffafa',
    'springgreen': '#00ff7f',
    'steelblue': '#4682b4',
    'tan': '#d2b48c',
    'teal': '#008080',
    'thistle': '#d8bfd8',
    'tomato': '#ff6347',
    'turquoise': '#40e0d0',
    'violet': '#ee82ee',
    'wheat': '#f5deb3',
    'white': '#fff',
    'whitesmoke': '#f5f5f5',
    'yellow': '#ff0',
    'yellowgreen': '#9acd32'
};

exports.colorsShortNames = {
  '#f0ffff': 'azure',
  '#f5f5dc': 'beige',
  '#ffe4c4': 'bisque',
  '#a52a2a': 'brown',
  '#ff7f50': 'coral',
  '#ffd700': 'gold',
  '#808080': 'gray',
  '#008000': 'green',
  '#4b0082': 'indigo',
  '#fffff0': 'ivory',
  '#f0e68c': 'khaki',
  '#faf0e6': 'linen',
  '#800000': 'maroon',
  '#000080': 'navy',
  '#808000': 'olive',
  '#ffa500': 'orange',
  '#da70d6': 'orchid',
  '#cd853f': 'peru',
  '#ffc0cb': 'pink',
  '#dda0dd': 'plum',
  '#800080': 'purple',
  '#f00': 'red',
  '#ff0000': 'red',
  '#fa8072': 'salmon',
  '#a0522d': 'sienna',
  '#c0c0c0': 'silver',
  '#fffafa': 'snow',
  '#d2b48c': 'tan',
  '#008080': 'teal',
  '#ff6347': 'tomato',
  '#ee82ee': 'violet',
  '#f5deb3': 'wheat'
};

// http://www.w3.org/TR/SVG11/single-page.html#types-DataTypeColor
exports.colorsProps = [
    'color', 'fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color'
];

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1597942295319);
})()
//# sourceMappingURL=index.js.map