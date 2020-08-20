module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1597781799300, function(require, module, exports) {


module.exports = CSSselect;

var DomUtils = require("domutils");
var falseFunc = require("boolbase").falseFunc;
var compileRaw = require("./lib/compile.js");

function wrapCompile(func) {
    return function addAdapter(selector, options, context) {
        options = options || {};
        options.adapter = options.adapter || DomUtils;

        return func(selector, options, context);
    };
}

var compile = wrapCompile(compileRaw);
var compileUnsafe = wrapCompile(compileRaw.compileUnsafe);

function getSelectorFunc(searchFunc) {
    return function select(query, elems, options) {
        options = options || {};
        options.adapter = options.adapter || DomUtils;

        if (typeof query !== "function") {
            query = compileUnsafe(query, options, elems);
        }
        if (query.shouldTestNextSiblings) {
            elems = appendNextSiblings((options && options.context) || elems, options.adapter);
        }
        if (!Array.isArray(elems)) elems = options.adapter.getChildren(elems);
        else elems = options.adapter.removeSubsets(elems);
        return searchFunc(query, elems, options);
    };
}

function getNextSiblings(elem, adapter) {
    var siblings = adapter.getSiblings(elem);
    if (!Array.isArray(siblings)) return [];
    siblings = siblings.slice(0);
    while (siblings.shift() !== elem);
    return siblings;
}

function appendNextSiblings(elems, adapter) {
    // Order matters because jQuery seems to check the children before the siblings
    if (!Array.isArray(elems)) elems = [elems];
    var newElems = elems.slice(0);

    for (var i = 0, len = elems.length; i < len; i++) {
        var nextSiblings = getNextSiblings(newElems[i], adapter);
        newElems.push.apply(newElems, nextSiblings);
    }
    return newElems;
}

var selectAll = getSelectorFunc(function selectAll(query, elems, options) {
    return query === falseFunc || !elems || elems.length === 0 ? [] : options.adapter.findAll(query, elems);
});

var selectOne = getSelectorFunc(function selectOne(query, elems, options) {
    return query === falseFunc || !elems || elems.length === 0 ? null : options.adapter.findOne(query, elems);
});

function is(elem, query, options) {
    options = options || {};
    options.adapter = options.adapter || DomUtils;
    return (typeof query === "function" ? query : compile(query, options))(elem);
}

/*
	the exported interface
*/
function CSSselect(query, elems, options) {
    return selectAll(query, elems, options);
}

CSSselect.compile = compile;
CSSselect.filters = compileRaw.Pseudos.filters;
CSSselect.pseudos = compileRaw.Pseudos.pseudos;

CSSselect.selectAll = selectAll;
CSSselect.selectOne = selectOne;

CSSselect.is = is;

//legacy methods (might be removed)
CSSselect.parse = compile;
CSSselect.iterate = selectAll;

//hooks
CSSselect._compileUnsafe = compileUnsafe;
CSSselect._compileToken = compileRaw.compileToken;

}, function(modId) {var map = {"./lib/compile.js":1597781799301}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781799301, function(require, module, exports) {
/*
	compiles a selector to an executable function
*/

module.exports = compile;

var parse = require("css-what").parse;
var BaseFuncs = require("boolbase");
var sortRules = require("./sort.js");
var procedure = require("./procedure.json");
var Rules = require("./general.js");
var Pseudos = require("./pseudos.js");
var trueFunc = BaseFuncs.trueFunc;
var falseFunc = BaseFuncs.falseFunc;

var filters = Pseudos.filters;

function compile(selector, options, context) {
    var next = compileUnsafe(selector, options, context);
    return wrap(next, options);
}

function wrap(next, options) {
    var adapter = options.adapter;

    return function base(elem) {
        return adapter.isTag(elem) && next(elem);
    };
}

function compileUnsafe(selector, options, context) {
    var token = parse(selector, options);
    return compileToken(token, options, context);
}

function includesScopePseudo(t) {
    return (
        t.type === "pseudo" &&
        (t.name === "scope" ||
            (Array.isArray(t.data) &&
                t.data.some(function(data) {
                    return data.some(includesScopePseudo);
                })))
    );
}

var DESCENDANT_TOKEN = { type: "descendant" };
var FLEXIBLE_DESCENDANT_TOKEN = { type: "_flexibleDescendant" };
var SCOPE_TOKEN = { type: "pseudo", name: "scope" };
var PLACEHOLDER_ELEMENT = {};

//CSS 4 Spec (Draft): 3.3.1. Absolutizing a Scope-relative Selector
//http://www.w3.org/TR/selectors4/#absolutizing
function absolutize(token, options, context) {
    var adapter = options.adapter;

    //TODO better check if context is document
    var hasContext =
        !!context &&
        !!context.length &&
        context.every(function(e) {
            return e === PLACEHOLDER_ELEMENT || !!adapter.getParent(e);
        });

    token.forEach(function(t) {
        if (t.length > 0 && isTraversal(t[0]) && t[0].type !== "descendant") {
            //don't return in else branch
        } else if (hasContext && !(Array.isArray(t) ? t.some(includesScopePseudo) : includesScopePseudo(t))) {
            t.unshift(DESCENDANT_TOKEN);
        } else {
            return;
        }

        t.unshift(SCOPE_TOKEN);
    });
}

function compileToken(token, options, context) {
    token = token.filter(function(t) {
        return t.length > 0;
    });

    token.forEach(sortRules);

    var isArrayContext = Array.isArray(context);

    context = (options && options.context) || context;

    if (context && !isArrayContext) context = [context];

    absolutize(token, options, context);

    var shouldTestNextSiblings = false;

    var query = token
        .map(function(rules) {
            if (rules[0] && rules[1] && rules[0].name === "scope") {
                var ruleType = rules[1].type;
                if (isArrayContext && ruleType === "descendant") {
                    rules[1] = FLEXIBLE_DESCENDANT_TOKEN;
                } else if (ruleType === "adjacent" || ruleType === "sibling") {
                    shouldTestNextSiblings = true;
                }
            }
            return compileRules(rules, options, context);
        })
        .reduce(reduceRules, falseFunc);

    query.shouldTestNextSiblings = shouldTestNextSiblings;

    return query;
}

function isTraversal(t) {
    return procedure[t.type] < 0;
}

function compileRules(rules, options, context) {
    return rules.reduce(function(func, rule) {
        if (func === falseFunc) return func;

        if (!(rule.type in Rules)) {
            throw new Error("Rule type " + rule.type + " is not supported by css-select");
        }

        return Rules[rule.type](func, rule, options, context);
    }, (options && options.rootFunc) || trueFunc);
}

function reduceRules(a, b) {
    if (b === falseFunc || a === trueFunc) {
        return a;
    }
    if (a === falseFunc || b === trueFunc) {
        return b;
    }

    return function combine(elem) {
        return a(elem) || b(elem);
    };
}

function containsTraversal(t) {
    return t.some(isTraversal);
}

//:not, :has and :matches have to compile selectors
//doing this in lib/pseudos.js would lead to circular dependencies,
//so we add them here
filters.not = function(next, token, options, context) {
    var opts = {
        xmlMode: !!(options && options.xmlMode),
        strict: !!(options && options.strict),
        adapter: options.adapter
    };

    if (opts.strict) {
        if (token.length > 1 || token.some(containsTraversal)) {
            throw new Error("complex selectors in :not aren't allowed in strict mode");
        }
    }

    var func = compileToken(token, opts, context);

    if (func === falseFunc) return next;
    if (func === trueFunc) return falseFunc;

    return function not(elem) {
        return !func(elem) && next(elem);
    };
};

filters.has = function(next, token, options) {
    var adapter = options.adapter;
    var opts = {
        xmlMode: !!(options && options.xmlMode),
        strict: !!(options && options.strict),
        adapter: adapter
    };

    //FIXME: Uses an array as a pointer to the current element (side effects)
    var context = token.some(containsTraversal) ? [PLACEHOLDER_ELEMENT] : null;

    var func = compileToken(token, opts, context);

    if (func === falseFunc) return falseFunc;
    if (func === trueFunc) {
        return function hasChild(elem) {
            return adapter.getChildren(elem).some(adapter.isTag) && next(elem);
        };
    }

    func = wrap(func, options);

    if (context) {
        return function has(elem) {
            return next(elem) && ((context[0] = elem), adapter.existsOne(func, adapter.getChildren(elem)));
        };
    }

    return function has(elem) {
        return next(elem) && adapter.existsOne(func, adapter.getChildren(elem));
    };
};

filters.matches = function(next, token, options, context) {
    var opts = {
        xmlMode: !!(options && options.xmlMode),
        strict: !!(options && options.strict),
        rootFunc: next,
        adapter: options.adapter
    };

    return compileToken(token, opts, context);
};

compile.compileToken = compileToken;
compile.compileUnsafe = compileUnsafe;
compile.Pseudos = Pseudos;

}, function(modId) { var map = {"./sort.js":1597781799302,"./procedure.json":1597781799303,"./general.js":1597781799304,"./pseudos.js":1597781799306}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781799302, function(require, module, exports) {
module.exports = sortByProcedure;

/*
	sort the parts of the passed selector,
	as there is potential for optimization
	(some types of selectors are faster than others)
*/

var procedure = require("./procedure.json");

var attributes = {
    __proto__: null,
    exists: 10,
    equals: 8,
    not: 7,
    start: 6,
    end: 6,
    any: 5,
    hyphen: 4,
    element: 4
};

function sortByProcedure(arr) {
    var procs = arr.map(getProcedure);
    for (var i = 1; i < arr.length; i++) {
        var procNew = procs[i];

        if (procNew < 0) continue;

        for (var j = i - 1; j >= 0 && procNew < procs[j]; j--) {
            var token = arr[j + 1];
            arr[j + 1] = arr[j];
            arr[j] = token;
            procs[j + 1] = procs[j];
            procs[j] = procNew;
        }
    }
}

function getProcedure(token) {
    var proc = procedure[token.type];

    if (proc === procedure.attribute) {
        proc = attributes[token.action];

        if (proc === attributes.equals && token.name === "id") {
            //prefer ID selectors (eg. #ID)
            proc = 9;
        }

        if (token.ignoreCase) {
            //ignoreCase adds some overhead, prefer "normal" token
            //this is a binary operation, to ensure it's still an int
            proc >>= 1;
        }
    } else if (proc === procedure.pseudo) {
        if (!token.data) {
            proc = 3;
        } else if (token.name === "has" || token.name === "contains") {
            proc = 0; //expensive in any case
        } else if (token.name === "matches" || token.name === "not") {
            proc = 0;
            for (var i = 0; i < token.data.length; i++) {
                //TODO better handling of complex selectors
                if (token.data[i].length !== 1) continue;
                var cur = getProcedure(token.data[i][0]);
                //avoid executing :has or :contains
                if (cur === 0) {
                    proc = 0;
                    break;
                }
                if (cur > proc) proc = cur;
            }
            if (token.data.length > 1 && proc > 0) proc -= 1;
        } else {
            proc = 1;
        }
    }
    return proc;
}

}, function(modId) { var map = {"./procedure.json":1597781799303}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781799303, function(require, module, exports) {
module.exports = {
	"universal": 50,
	"tag": 30,
	"attribute": 1,
	"pseudo": 0,
	"descendant": -1,
	"child": -1,
	"parent": -1,
	"sibling": -1,
	"adjacent": -1
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781799304, function(require, module, exports) {
var attributes = require("./attributes.js");
var Pseudos = require("./pseudos");

/*
	all available rules
*/
module.exports = {
    __proto__: null,

    attribute: attributes.compile,
    pseudo: Pseudos.compile,

    //tags
    tag: function(next, data, options) {
        var name = data.name;
        var adapter = options.adapter;

        return function tag(elem) {
            return adapter.getName(elem) === name && next(elem);
        };
    },

    //traversal
    descendant: function(next, data, options) {
        // eslint-disable-next-line no-undef
        var isFalseCache = typeof WeakSet !== "undefined" ? new WeakSet() : null;
        var adapter = options.adapter;

        return function descendant(elem) {
            var found = false;

            while (!found && (elem = adapter.getParent(elem))) {
                if (!isFalseCache || !isFalseCache.has(elem)) {
                    found = next(elem);
                    if (!found && isFalseCache) {
                        isFalseCache.add(elem);
                    }
                }
            }

            return found;
        };
    },
    _flexibleDescendant: function(next, data, options) {
        var adapter = options.adapter;

        // Include element itself, only used while querying an array
        return function descendant(elem) {
            var found = next(elem);

            while (!found && (elem = adapter.getParent(elem))) {
                found = next(elem);
            }

            return found;
        };
    },
    parent: function(next, data, options) {
        if (options && options.strict) {
            throw new Error("Parent selector isn't part of CSS3");
        }

        var adapter = options.adapter;

        return function parent(elem) {
            return adapter.getChildren(elem).some(test);
        };

        function test(elem) {
            return adapter.isTag(elem) && next(elem);
        }
    },
    child: function(next, data, options) {
        var adapter = options.adapter;

        return function child(elem) {
            var parent = adapter.getParent(elem);
            return !!parent && next(parent);
        };
    },
    sibling: function(next, data, options) {
        var adapter = options.adapter;

        return function sibling(elem) {
            var siblings = adapter.getSiblings(elem);

            for (var i = 0; i < siblings.length; i++) {
                if (adapter.isTag(siblings[i])) {
                    if (siblings[i] === elem) break;
                    if (next(siblings[i])) return true;
                }
            }

            return false;
        };
    },
    adjacent: function(next, data, options) {
        var adapter = options.adapter;

        return function adjacent(elem) {
            var siblings = adapter.getSiblings(elem),
                lastElement;

            for (var i = 0; i < siblings.length; i++) {
                if (adapter.isTag(siblings[i])) {
                    if (siblings[i] === elem) break;
                    lastElement = siblings[i];
                }
            }

            return !!lastElement && next(lastElement);
        };
    },
    universal: function(next) {
        return next;
    }
};

}, function(modId) { var map = {"./attributes.js":1597781799305,"./pseudos":1597781799306}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781799305, function(require, module, exports) {
var falseFunc = require("boolbase").falseFunc;

//https://github.com/slevithan/XRegExp/blob/master/src/xregexp.js#L469
var reChars = /[-[\]{}()*+?.,\\^$|#\s]/g;

/*
	attribute selectors
*/
var attributeRules = {
    __proto__: null,
    equals: function(next, data, options) {
        var name = data.name;
        var value = data.value;
        var adapter = options.adapter;

        if (data.ignoreCase) {
            value = value.toLowerCase();

            return function equalsIC(elem) {
                var attr = adapter.getAttributeValue(elem, name);
                return attr != null && attr.toLowerCase() === value && next(elem);
            };
        }

        return function equals(elem) {
            return adapter.getAttributeValue(elem, name) === value && next(elem);
        };
    },
    hyphen: function(next, data, options) {
        var name = data.name;
        var value = data.value;
        var len = value.length;
        var adapter = options.adapter;

        if (data.ignoreCase) {
            value = value.toLowerCase();

            return function hyphenIC(elem) {
                var attr = adapter.getAttributeValue(elem, name);
                return (
                    attr != null &&
                    (attr.length === len || attr.charAt(len) === "-") &&
                    attr.substr(0, len).toLowerCase() === value &&
                    next(elem)
                );
            };
        }

        return function hyphen(elem) {
            var attr = adapter.getAttributeValue(elem, name);
            return (
                attr != null &&
                attr.substr(0, len) === value &&
                (attr.length === len || attr.charAt(len) === "-") &&
                next(elem)
            );
        };
    },
    element: function(next, data, options) {
        var name = data.name;
        var value = data.value;
        var adapter = options.adapter;

        if (/\s/.test(value)) {
            return falseFunc;
        }

        value = value.replace(reChars, "\\$&");

        var pattern = "(?:^|\\s)" + value + "(?:$|\\s)",
            flags = data.ignoreCase ? "i" : "",
            regex = new RegExp(pattern, flags);

        return function element(elem) {
            var attr = adapter.getAttributeValue(elem, name);
            return attr != null && regex.test(attr) && next(elem);
        };
    },
    exists: function(next, data, options) {
        var name = data.name;
        var adapter = options.adapter;

        return function exists(elem) {
            return adapter.hasAttrib(elem, name) && next(elem);
        };
    },
    start: function(next, data, options) {
        var name = data.name;
        var value = data.value;
        var len = value.length;
        var adapter = options.adapter;

        if (len === 0) {
            return falseFunc;
        }

        if (data.ignoreCase) {
            value = value.toLowerCase();

            return function startIC(elem) {
                var attr = adapter.getAttributeValue(elem, name);
                return attr != null && attr.substr(0, len).toLowerCase() === value && next(elem);
            };
        }

        return function start(elem) {
            var attr = adapter.getAttributeValue(elem, name);
            return attr != null && attr.substr(0, len) === value && next(elem);
        };
    },
    end: function(next, data, options) {
        var name = data.name;
        var value = data.value;
        var len = -value.length;
        var adapter = options.adapter;

        if (len === 0) {
            return falseFunc;
        }

        if (data.ignoreCase) {
            value = value.toLowerCase();

            return function endIC(elem) {
                var attr = adapter.getAttributeValue(elem, name);
                return attr != null && attr.substr(len).toLowerCase() === value && next(elem);
            };
        }

        return function end(elem) {
            var attr = adapter.getAttributeValue(elem, name);
            return attr != null && attr.substr(len) === value && next(elem);
        };
    },
    any: function(next, data, options) {
        var name = data.name;
        var value = data.value;
        var adapter = options.adapter;

        if (value === "") {
            return falseFunc;
        }

        if (data.ignoreCase) {
            var regex = new RegExp(value.replace(reChars, "\\$&"), "i");

            return function anyIC(elem) {
                var attr = adapter.getAttributeValue(elem, name);
                return attr != null && regex.test(attr) && next(elem);
            };
        }

        return function any(elem) {
            var attr = adapter.getAttributeValue(elem, name);
            return attr != null && attr.indexOf(value) >= 0 && next(elem);
        };
    },
    not: function(next, data, options) {
        var name = data.name;
        var value = data.value;
        var adapter = options.adapter;

        if (value === "") {
            return function notEmpty(elem) {
                return !!adapter.getAttributeValue(elem, name) && next(elem);
            };
        } else if (data.ignoreCase) {
            value = value.toLowerCase();

            return function notIC(elem) {
                var attr = adapter.getAttributeValue(elem, name);
                return attr != null && attr.toLowerCase() !== value && next(elem);
            };
        }

        return function not(elem) {
            return adapter.getAttributeValue(elem, name) !== value && next(elem);
        };
    }
};

module.exports = {
    compile: function(next, data, options) {
        if (options && options.strict && (data.ignoreCase || data.action === "not")) {
            throw new Error("Unsupported attribute selector");
        }
        return attributeRules[data.action](next, data, options);
    },
    rules: attributeRules
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781799306, function(require, module, exports) {
/*
	pseudo selectors

	---

	they are available in two forms:
	* filters called when the selector
	  is compiled and return a function
	  that needs to return next()
	* pseudos get called on execution
	  they need to return a boolean
*/

var getNCheck = require("nth-check");
var BaseFuncs = require("boolbase");
var attributes = require("./attributes.js");
var trueFunc = BaseFuncs.trueFunc;
var falseFunc = BaseFuncs.falseFunc;

var checkAttrib = attributes.rules.equals;

function getAttribFunc(name, value) {
    var data = { name: name, value: value };
    return function attribFunc(next, rule, options) {
        return checkAttrib(next, data, options);
    };
}

function getChildFunc(next, adapter) {
    return function(elem) {
        return !!adapter.getParent(elem) && next(elem);
    };
}

var filters = {
    contains: function(next, text, options) {
        var adapter = options.adapter;

        return function contains(elem) {
            return next(elem) && adapter.getText(elem).indexOf(text) >= 0;
        };
    },
    icontains: function(next, text, options) {
        var itext = text.toLowerCase();
        var adapter = options.adapter;

        return function icontains(elem) {
            return (
                next(elem) &&
                adapter
                    .getText(elem)
                    .toLowerCase()
                    .indexOf(itext) >= 0
            );
        };
    },

    //location specific methods
    "nth-child": function(next, rule, options) {
        var func = getNCheck(rule);
        var adapter = options.adapter;

        if (func === falseFunc) return func;
        if (func === trueFunc) return getChildFunc(next, adapter);

        return function nthChild(elem) {
            var siblings = adapter.getSiblings(elem);

            for (var i = 0, pos = 0; i < siblings.length; i++) {
                if (adapter.isTag(siblings[i])) {
                    if (siblings[i] === elem) break;
                    else pos++;
                }
            }

            return func(pos) && next(elem);
        };
    },
    "nth-last-child": function(next, rule, options) {
        var func = getNCheck(rule);
        var adapter = options.adapter;

        if (func === falseFunc) return func;
        if (func === trueFunc) return getChildFunc(next, adapter);

        return function nthLastChild(elem) {
            var siblings = adapter.getSiblings(elem);

            for (var pos = 0, i = siblings.length - 1; i >= 0; i--) {
                if (adapter.isTag(siblings[i])) {
                    if (siblings[i] === elem) break;
                    else pos++;
                }
            }

            return func(pos) && next(elem);
        };
    },
    "nth-of-type": function(next, rule, options) {
        var func = getNCheck(rule);
        var adapter = options.adapter;

        if (func === falseFunc) return func;
        if (func === trueFunc) return getChildFunc(next, adapter);

        return function nthOfType(elem) {
            var siblings = adapter.getSiblings(elem);

            for (var pos = 0, i = 0; i < siblings.length; i++) {
                if (adapter.isTag(siblings[i])) {
                    if (siblings[i] === elem) break;
                    if (adapter.getName(siblings[i]) === adapter.getName(elem)) pos++;
                }
            }

            return func(pos) && next(elem);
        };
    },
    "nth-last-of-type": function(next, rule, options) {
        var func = getNCheck(rule);
        var adapter = options.adapter;

        if (func === falseFunc) return func;
        if (func === trueFunc) return getChildFunc(next, adapter);

        return function nthLastOfType(elem) {
            var siblings = adapter.getSiblings(elem);

            for (var pos = 0, i = siblings.length - 1; i >= 0; i--) {
                if (adapter.isTag(siblings[i])) {
                    if (siblings[i] === elem) break;
                    if (adapter.getName(siblings[i]) === adapter.getName(elem)) pos++;
                }
            }

            return func(pos) && next(elem);
        };
    },

    //TODO determine the actual root element
    root: function(next, rule, options) {
        var adapter = options.adapter;

        return function(elem) {
            return !adapter.getParent(elem) && next(elem);
        };
    },

    scope: function(next, rule, options, context) {
        var adapter = options.adapter;

        if (!context || context.length === 0) {
            //equivalent to :root
            return filters.root(next, rule, options);
        }

        function equals(a, b) {
            if (typeof adapter.equals === "function") return adapter.equals(a, b);

            return a === b;
        }

        if (context.length === 1) {
            //NOTE: can't be unpacked, as :has uses this for side-effects
            return function(elem) {
                return equals(context[0], elem) && next(elem);
            };
        }

        return function(elem) {
            return context.indexOf(elem) >= 0 && next(elem);
        };
    },

    //jQuery extensions (others follow as pseudos)
    checkbox: getAttribFunc("type", "checkbox"),
    file: getAttribFunc("type", "file"),
    password: getAttribFunc("type", "password"),
    radio: getAttribFunc("type", "radio"),
    reset: getAttribFunc("type", "reset"),
    image: getAttribFunc("type", "image"),
    submit: getAttribFunc("type", "submit"),

    //dynamic state pseudos. These depend on optional Adapter methods.
    hover: function(next, rule, options) {
        var adapter = options.adapter;

        if (typeof adapter.isHovered === 'function') {
            return function hover(elem) {
                return next(elem) && adapter.isHovered(elem);
            };
        }

        return falseFunc;
    },
    visited: function(next, rule, options) {
        var adapter = options.adapter;

        if (typeof adapter.isVisited === 'function') {
            return function visited(elem) {
                return next(elem) && adapter.isVisited(elem);
            };
        }

        return falseFunc;
    },
    active: function(next, rule, options) {
        var adapter = options.adapter;

        if (typeof adapter.isActive === 'function') {
            return function active(elem) {
                return next(elem) && adapter.isActive(elem);
            };
        }

        return falseFunc;
    }
};

//helper methods
function getFirstElement(elems, adapter) {
    for (var i = 0; elems && i < elems.length; i++) {
        if (adapter.isTag(elems[i])) return elems[i];
    }
}

//while filters are precompiled, pseudos get called when they are needed
var pseudos = {
    empty: function(elem, adapter) {
        return !adapter.getChildren(elem).some(function(elem) {
            return adapter.isTag(elem) || elem.type === "text";
        });
    },

    "first-child": function(elem, adapter) {
        return getFirstElement(adapter.getSiblings(elem), adapter) === elem;
    },
    "last-child": function(elem, adapter) {
        var siblings = adapter.getSiblings(elem);

        for (var i = siblings.length - 1; i >= 0; i--) {
            if (siblings[i] === elem) return true;
            if (adapter.isTag(siblings[i])) break;
        }

        return false;
    },
    "first-of-type": function(elem, adapter) {
        var siblings = adapter.getSiblings(elem);

        for (var i = 0; i < siblings.length; i++) {
            if (adapter.isTag(siblings[i])) {
                if (siblings[i] === elem) return true;
                if (adapter.getName(siblings[i]) === adapter.getName(elem)) break;
            }
        }

        return false;
    },
    "last-of-type": function(elem, adapter) {
        var siblings = adapter.getSiblings(elem);

        for (var i = siblings.length - 1; i >= 0; i--) {
            if (adapter.isTag(siblings[i])) {
                if (siblings[i] === elem) return true;
                if (adapter.getName(siblings[i]) === adapter.getName(elem)) break;
            }
        }

        return false;
    },
    "only-of-type": function(elem, adapter) {
        var siblings = adapter.getSiblings(elem);

        for (var i = 0, j = siblings.length; i < j; i++) {
            if (adapter.isTag(siblings[i])) {
                if (siblings[i] === elem) continue;
                if (adapter.getName(siblings[i]) === adapter.getName(elem)) {
                    return false;
                }
            }
        }

        return true;
    },
    "only-child": function(elem, adapter) {
        var siblings = adapter.getSiblings(elem);

        for (var i = 0; i < siblings.length; i++) {
            if (adapter.isTag(siblings[i]) && siblings[i] !== elem) return false;
        }

        return true;
    },

    //:matches(a, area, link)[href]
    link: function(elem, adapter) {
        return adapter.hasAttrib(elem, "href");
    },
    //TODO: :any-link once the name is finalized (as an alias of :link)

    //forms
    //to consider: :target

    //:matches([selected], select:not([multiple]):not(> option[selected]) > option:first-of-type)
    selected: function(elem, adapter) {
        if (adapter.hasAttrib(elem, "selected")) return true;
        else if (adapter.getName(elem) !== "option") return false;

        //the first <option> in a <select> is also selected
        var parent = adapter.getParent(elem);

        if (!parent || adapter.getName(parent) !== "select" || adapter.hasAttrib(parent, "multiple")) {
            return false;
        }

        var siblings = adapter.getChildren(parent);
        var sawElem = false;

        for (var i = 0; i < siblings.length; i++) {
            if (adapter.isTag(siblings[i])) {
                if (siblings[i] === elem) {
                    sawElem = true;
                } else if (!sawElem) {
                    return false;
                } else if (adapter.hasAttrib(siblings[i], "selected")) {
                    return false;
                }
            }
        }

        return sawElem;
    },
    //https://html.spec.whatwg.org/multipage/scripting.html#disabled-elements
    //:matches(
    //  :matches(button, input, select, textarea, menuitem, optgroup, option)[disabled],
    //  optgroup[disabled] > option),
    // fieldset[disabled] * //TODO not child of first <legend>
    //)
    disabled: function(elem, adapter) {
        return adapter.hasAttrib(elem, "disabled");
    },
    enabled: function(elem, adapter) {
        return !adapter.hasAttrib(elem, "disabled");
    },
    //:matches(:matches(:radio, :checkbox)[checked], :selected) (TODO menuitem)
    checked: function(elem, adapter) {
        return adapter.hasAttrib(elem, "checked") || pseudos.selected(elem, adapter);
    },
    //:matches(input, select, textarea)[required]
    required: function(elem, adapter) {
        return adapter.hasAttrib(elem, "required");
    },
    //:matches(input, select, textarea):not([required])
    optional: function(elem, adapter) {
        return !adapter.hasAttrib(elem, "required");
    },

    //jQuery extensions

    //:not(:empty)
    parent: function(elem, adapter) {
        return !pseudos.empty(elem, adapter);
    },
    //:matches(h1, h2, h3, h4, h5, h6)
    header: namePseudo(["h1", "h2", "h3", "h4", "h5", "h6"]),

    //:matches(button, input[type=button])
    button: function(elem, adapter) {
        var name = adapter.getName(elem);
        return (
            name === "button" || (name === "input" && adapter.getAttributeValue(elem, "type") === "button")
        );
    },
    //:matches(input, textarea, select, button)
    input: namePseudo(["input", "textarea", "select", "button"]),
    //input:matches(:not([type!='']), [type='text' i])
    text: function(elem, adapter) {
        var attr;
        return (
            adapter.getName(elem) === "input" &&
            (!(attr = adapter.getAttributeValue(elem, "type")) || attr.toLowerCase() === "text")
        );
    }
};

function namePseudo(names) {
    if (typeof Set !== "undefined") {
        // eslint-disable-next-line no-undef
        var nameSet = new Set(names);

        return function(elem, adapter) {
            return nameSet.has(adapter.getName(elem));
        };
    }

    return function(elem, adapter) {
        return names.indexOf(adapter.getName(elem)) >= 0;
    };
}

function verifyArgs(func, name, subselect) {
    if (subselect === null) {
        if (func.length > 2 && name !== "scope") {
            throw new Error("pseudo-selector :" + name + " requires an argument");
        }
    } else {
        if (func.length === 2) {
            throw new Error("pseudo-selector :" + name + " doesn't have any arguments");
        }
    }
}

//FIXME this feels hacky
var re_CSS3 = /^(?:(?:nth|last|first|only)-(?:child|of-type)|root|empty|(?:en|dis)abled|checked|not)$/;

module.exports = {
    compile: function(next, data, options, context) {
        var name = data.name;
        var subselect = data.data;
        var adapter = options.adapter;

        if (options && options.strict && !re_CSS3.test(name)) {
            throw new Error(":" + name + " isn't part of CSS3");
        }

        if (typeof filters[name] === "function") {
            return filters[name](next, subselect, options, context);
        } else if (typeof pseudos[name] === "function") {
            var func = pseudos[name];

            verifyArgs(func, name, subselect);

            if (func === falseFunc) {
                return func;
            }

            if (next === trueFunc) {
                return function pseudoRoot(elem) {
                    return func(elem, adapter, subselect);
                };
            }

            return function pseudoArgs(elem) {
                return func(elem, adapter, subselect) && next(elem);
            };
        } else {
            throw new Error("unmatched pseudo-class :" + name);
        }
    },
    filters: filters,
    pseudos: pseudos
};

}, function(modId) { var map = {"./attributes.js":1597781799305}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1597781799300);
})()
//# sourceMappingURL=index.js.map