module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1597781799420, function(require, module, exports) {

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./parse"), exports);
var parse_1 = require("./parse");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return parse_1.default; } });
var stringify_1 = require("./stringify");
Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return stringify_1.default; } });

}, function(modId) {var map = {"./parse":1597781799421,"./stringify":1597781799422}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781799421, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parse;
var reName = /^[^\\]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/;
var reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi;
//modified version of https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L87
var reAttr = /^\s*((?:\\.|[\w\u00b0-\uFFFF-])+)\s*(?:(\S?)=\s*(?:(['"])([^]*?)\3|(#?(?:\\.|[\w\u00b0-\uFFFF-])*)|)|)\s*(i)?\]/;
var actionTypes = {
    undefined: "exists",
    "": "equals",
    "~": "element",
    "^": "start",
    $: "end",
    "*": "any",
    "!": "not",
    "|": "hyphen",
};
var Traversals = {
    ">": "child",
    "<": "parent",
    "~": "sibling",
    "+": "adjacent",
};
var attribSelectors = {
    "#": ["id", "equals"],
    ".": ["class", "element"],
};
//pseudos, whose data-property is parsed as well
var unpackPseudos = new Set(["has", "not", "matches"]);
var stripQuotesFromPseudos = new Set(["contains", "icontains"]);
var quotes = new Set(['"', "'"]);
//unescape function taken from https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L152
function funescape(_, escaped, escapedWhitespace) {
    var high = parseInt(escaped, 16) - 0x10000;
    // NaN means non-codepoint
    return high !== high || escapedWhitespace
        ? escaped
        : high < 0
            ? // BMP codepoint
                String.fromCharCode(high + 0x10000)
            : // Supplemental Plane codepoint (surrogate pair)
                String.fromCharCode((high >> 10) | 0xd800, (high & 0x3ff) | 0xdc00);
}
function unescapeCSS(str) {
    return str.replace(reEscape, funescape);
}
function isWhitespace(c) {
    return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
}
function parse(selector, options) {
    var subselects = [];
    selector = parseSelector(subselects, "" + selector, options);
    if (selector !== "") {
        throw new Error("Unmatched selector: " + selector);
    }
    return subselects;
}
function parseSelector(subselects, selector, options) {
    var tokens = [];
    var sawWS = false;
    function getName() {
        var match = selector.match(reName);
        if (!match) {
            throw new Error("Expected name, found " + selector);
        }
        var sub = match[0];
        selector = selector.substr(sub.length);
        return unescapeCSS(sub);
    }
    function stripWhitespace(start) {
        while (isWhitespace(selector.charAt(start)))
            start++;
        selector = selector.substr(start);
    }
    function isEscaped(pos) {
        var slashCount = 0;
        while (selector.charAt(--pos) === "\\")
            slashCount++;
        return (slashCount & 1) === 1;
    }
    stripWhitespace(0);
    while (selector !== "") {
        var firstChar = selector.charAt(0);
        if (isWhitespace(firstChar)) {
            sawWS = true;
            stripWhitespace(1);
        }
        else if (firstChar in Traversals) {
            tokens.push({ type: Traversals[firstChar] });
            sawWS = false;
            stripWhitespace(1);
        }
        else if (firstChar === ",") {
            if (tokens.length === 0) {
                throw new Error("Empty sub-selector");
            }
            subselects.push(tokens);
            tokens = [];
            sawWS = false;
            stripWhitespace(1);
        }
        else {
            if (sawWS) {
                if (tokens.length > 0) {
                    tokens.push({ type: "descendant" });
                }
                sawWS = false;
            }
            if (firstChar === "*") {
                selector = selector.substr(1);
                tokens.push({ type: "universal" });
            }
            else if (firstChar in attribSelectors) {
                var _a = attribSelectors[firstChar], name_1 = _a[0], action = _a[1];
                selector = selector.substr(1);
                tokens.push({
                    type: "attribute",
                    name: name_1,
                    action: action,
                    value: getName(),
                    ignoreCase: false,
                });
            }
            else if (firstChar === "[") {
                selector = selector.substr(1);
                var data = selector.match(reAttr);
                if (!data) {
                    throw new Error("Malformed attribute selector: " + selector);
                }
                selector = selector.substr(data[0].length);
                var name_2 = unescapeCSS(data[1]);
                if (!options ||
                    ("lowerCaseAttributeNames" in options
                        ? options.lowerCaseAttributeNames
                        : !options.xmlMode)) {
                    name_2 = name_2.toLowerCase();
                }
                tokens.push({
                    type: "attribute",
                    name: name_2,
                    action: actionTypes[data[2]],
                    value: unescapeCSS(data[4] || data[5] || ""),
                    ignoreCase: !!data[6],
                });
            }
            else if (firstChar === ":") {
                if (selector.charAt(1) === ":") {
                    selector = selector.substr(2);
                    tokens.push({
                        type: "pseudo-element",
                        name: getName().toLowerCase(),
                    });
                    continue;
                }
                selector = selector.substr(1);
                var name_3 = getName().toLowerCase();
                var data = null;
                if (selector.charAt(0) === "(") {
                    if (unpackPseudos.has(name_3)) {
                        var quot = selector.charAt(1);
                        var quoted = quotes.has(quot);
                        selector = selector.substr(quoted ? 2 : 1);
                        data = [];
                        selector = parseSelector(data, selector, options);
                        if (quoted) {
                            if (selector.charAt(0) !== quot) {
                                throw new Error("Unmatched quotes in :" + name_3);
                            }
                            else {
                                selector = selector.substr(1);
                            }
                        }
                        if (selector.charAt(0) !== ")") {
                            throw new Error("Missing closing parenthesis in :" + name_3 + " (" + selector + ")");
                        }
                        selector = selector.substr(1);
                    }
                    else {
                        var pos = 1;
                        var counter = 1;
                        for (; counter > 0 && pos < selector.length; pos++) {
                            if (selector.charAt(pos) === "(" && !isEscaped(pos))
                                counter++;
                            else if (selector.charAt(pos) === ")" &&
                                !isEscaped(pos))
                                counter--;
                        }
                        if (counter) {
                            throw new Error("Parenthesis not matched");
                        }
                        data = selector.substr(1, pos - 2);
                        selector = selector.substr(pos);
                        if (stripQuotesFromPseudos.has(name_3)) {
                            var quot = data.charAt(0);
                            if (quot === data.slice(-1) && quotes.has(quot)) {
                                data = data.slice(1, -1);
                            }
                            data = unescapeCSS(data);
                        }
                    }
                }
                tokens.push({ type: "pseudo", name: name_3, data: data });
            }
            else if (reName.test(selector)) {
                var name_4 = getName();
                if (!options ||
                    ("lowerCaseTags" in options
                        ? options.lowerCaseTags
                        : !options.xmlMode)) {
                    name_4 = name_4.toLowerCase();
                }
                tokens.push({ type: "tag", name: name_4 });
            }
            else {
                if (tokens.length &&
                    tokens[tokens.length - 1].type === "descendant") {
                    tokens.pop();
                }
                addToken(subselects, tokens);
                return selector;
            }
        }
    }
    addToken(subselects, tokens);
    return selector;
}
function addToken(subselects, tokens) {
    if (subselects.length > 0 && tokens.length === 0) {
        throw new Error("Empty sub-selector");
    }
    subselects.push(tokens);
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781799422, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var actionTypes = {
    equals: "",
    element: "~",
    start: "^",
    end: "$",
    any: "*",
    not: "!",
    hyphen: "|",
};
function stringify(token) {
    return token.map(stringifySubselector).join(", ");
}
exports.default = stringify;
function stringifySubselector(token) {
    return token.map(stringifyToken).join("");
}
function stringifyToken(token) {
    switch (token.type) {
        // Simple types
        case "child":
            return " > ";
        case "parent":
            return " < ";
        case "sibling":
            return " ~ ";
        case "adjacent":
            return " + ";
        case "descendant":
            return " ";
        case "universal":
            return "*";
        case "tag":
            return escapeName(token.name);
        case "pseudo-element":
            return "::" + escapeName(token.name);
        case "pseudo":
            if (token.data === null)
                return ":" + escapeName(token.name);
            if (typeof token.data === "string") {
                return ":" + escapeName(token.name) + "(" + token.data + ")";
            }
            return ":" + escapeName(token.name) + "(" + stringify(token.data) + ")";
        case "attribute":
            if (token.action === "exists") {
                return "[" + escapeName(token.name) + "]";
            }
            if (token.name === "id" &&
                token.action === "equals" &&
                !token.ignoreCase) {
                return "#" + escapeName(token.value);
            }
            if (token.name === "class" &&
                token.action === "element" &&
                !token.ignoreCase) {
                return "." + escapeName(token.value);
            }
            return "[" + escapeName(token.name) + actionTypes[token.action] + "='" + escapeName(token.value) + "'" + (token.ignoreCase ? "i" : "") + "]";
        default:
            throw new Error("Unknown type");
    }
}
function escapeName(str) {
    //TODO
    return str;
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1597781799420);
})()
//# sourceMappingURL=index.js.map