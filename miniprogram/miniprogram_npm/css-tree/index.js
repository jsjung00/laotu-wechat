module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1597942294271, function(require, module, exports) {
module.exports = require('./syntax');

}, function(modId) {var map = {"./syntax":1597942294272}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294272, function(require, module, exports) {
function merge() {
    var dest = {};

    for (var i = 0; i < arguments.length; i++) {
        var src = arguments[i];
        for (var key in src) {
            dest[key] = src[key];
        }
    }

    return dest;
}

module.exports = require('./create').create(
    merge(
        require('./config/lexer'),
        require('./config/parser'),
        require('./config/walker')
    )
);

}, function(modId) { var map = {"./create":1597942294273,"./config/lexer":1597942294310,"./config/parser":1597942294354,"./config/walker":1597942294383}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294273, function(require, module, exports) {
var List = require('../common/List');
var SyntaxError = require('../common/SyntaxError');
var TokenStream = require('../common/TokenStream');
var Lexer = require('../lexer/Lexer');
var definitionSyntax = require('../definition-syntax');
var tokenize = require('../tokenizer');
var createParser = require('../parser/create');
var createGenerator = require('../generator/create');
var createConvertor = require('../convertor/create');
var createWalker = require('../walker/create');
var clone = require('../utils/clone');
var names = require('../utils/names');
var mix = require('./config/mix');

function assign(dest, src) {
    for (var key in src) {
        dest[key] = src[key];
    }

    return dest;
}

function createSyntax(config) {
    var parse = createParser(config);
    var walk = createWalker(config);
    var generate = createGenerator(config);
    var convert = createConvertor(walk);

    var syntax = {
        List: List,
        SyntaxError: SyntaxError,
        TokenStream: TokenStream,
        Lexer: Lexer,

        vendorPrefix: names.vendorPrefix,
        keyword: names.keyword,
        property: names.property,
        isCustomProperty: names.isCustomProperty,

        definitionSyntax: definitionSyntax,
        lexer: null,
        createLexer: function(config) {
            return new Lexer(config, syntax, syntax.lexer.structure);
        },

        tokenize: tokenize,
        parse: parse,
        walk: walk,
        generate: generate,

        find: walk.find,
        findLast: walk.findLast,
        findAll: walk.findAll,

        clone: clone,
        fromPlainObject: convert.fromPlainObject,
        toPlainObject: convert.toPlainObject,

        createSyntax: function(config) {
            return createSyntax(mix({}, config));
        },
        fork: function(extension) {
            var base = mix({}, config); // copy of config
            return createSyntax(
                typeof extension === 'function'
                    ? extension(base, assign)
                    : mix(base, extension)
            );
        }
    };

    syntax.lexer = new Lexer({
        generic: true,
        types: config.types,
        properties: config.properties,
        node: config.node
    }, syntax);

    return syntax;
};

exports.create = function(config) {
    return createSyntax(mix({}, config));
};

}, function(modId) { var map = {"../common/List":1597942294274,"../common/SyntaxError":1597942294275,"../common/TokenStream":1597942294277,"../lexer/Lexer":1597942294281,"../definition-syntax":1597942294300,"../tokenizer":1597942294286,"../parser/create":1597942294301,"../generator/create":1597942294304,"../convertor/create":1597942294306,"../walker/create":1597942294307,"../utils/clone":1597942294308,"../utils/names":1597942294284,"./config/mix":1597942294309}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294274, function(require, module, exports) {
//
//                              list
//                            ┌──────┐
//             ┌──────────────┼─head │
//             │              │ tail─┼──────────────┐
//             │              └──────┘              │
//             ▼                                    ▼
//            item        item        item        item
//          ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐
//  null ◀──┼─prev │◀───┼─prev │◀───┼─prev │◀───┼─prev │
//          │ next─┼───▶│ next─┼───▶│ next─┼───▶│ next─┼──▶ null
//          ├──────┤    ├──────┤    ├──────┤    ├──────┤
//          │ data │    │ data │    │ data │    │ data │
//          └──────┘    └──────┘    └──────┘    └──────┘
//

function createItem(data) {
    return {
        prev: null,
        next: null,
        data: data
    };
}

function allocateCursor(node, prev, next) {
    var cursor;

    if (cursors !== null) {
        cursor = cursors;
        cursors = cursors.cursor;
        cursor.prev = prev;
        cursor.next = next;
        cursor.cursor = node.cursor;
    } else {
        cursor = {
            prev: prev,
            next: next,
            cursor: node.cursor
        };
    }

    node.cursor = cursor;

    return cursor;
}

function releaseCursor(node) {
    var cursor = node.cursor;

    node.cursor = cursor.cursor;
    cursor.prev = null;
    cursor.next = null;
    cursor.cursor = cursors;
    cursors = cursor;
}

var cursors = null;
var List = function() {
    this.cursor = null;
    this.head = null;
    this.tail = null;
};

List.createItem = createItem;
List.prototype.createItem = createItem;

List.prototype.updateCursors = function(prevOld, prevNew, nextOld, nextNew) {
    var cursor = this.cursor;

    while (cursor !== null) {
        if (cursor.prev === prevOld) {
            cursor.prev = prevNew;
        }

        if (cursor.next === nextOld) {
            cursor.next = nextNew;
        }

        cursor = cursor.cursor;
    }
};

List.prototype.getSize = function() {
    var size = 0;
    var cursor = this.head;

    while (cursor) {
        size++;
        cursor = cursor.next;
    }

    return size;
};

List.prototype.fromArray = function(array) {
    var cursor = null;

    this.head = null;

    for (var i = 0; i < array.length; i++) {
        var item = createItem(array[i]);

        if (cursor !== null) {
            cursor.next = item;
        } else {
            this.head = item;
        }

        item.prev = cursor;
        cursor = item;
    }

    this.tail = cursor;

    return this;
};

List.prototype.toArray = function() {
    var cursor = this.head;
    var result = [];

    while (cursor) {
        result.push(cursor.data);
        cursor = cursor.next;
    }

    return result;
};

List.prototype.toJSON = List.prototype.toArray;

List.prototype.isEmpty = function() {
    return this.head === null;
};

List.prototype.first = function() {
    return this.head && this.head.data;
};

List.prototype.last = function() {
    return this.tail && this.tail.data;
};

List.prototype.each = function(fn, context) {
    var item;

    if (context === undefined) {
        context = this;
    }

    // push cursor
    var cursor = allocateCursor(this, null, this.head);

    while (cursor.next !== null) {
        item = cursor.next;
        cursor.next = item.next;

        fn.call(context, item.data, item, this);
    }

    // pop cursor
    releaseCursor(this);
};

List.prototype.forEach = List.prototype.each;

List.prototype.eachRight = function(fn, context) {
    var item;

    if (context === undefined) {
        context = this;
    }

    // push cursor
    var cursor = allocateCursor(this, this.tail, null);

    while (cursor.prev !== null) {
        item = cursor.prev;
        cursor.prev = item.prev;

        fn.call(context, item.data, item, this);
    }

    // pop cursor
    releaseCursor(this);
};

List.prototype.forEachRight = List.prototype.eachRight;

List.prototype.nextUntil = function(start, fn, context) {
    if (start === null) {
        return;
    }

    var item;

    if (context === undefined) {
        context = this;
    }

    // push cursor
    var cursor = allocateCursor(this, null, start);

    while (cursor.next !== null) {
        item = cursor.next;
        cursor.next = item.next;

        if (fn.call(context, item.data, item, this)) {
            break;
        }
    }

    // pop cursor
    releaseCursor(this);
};

List.prototype.prevUntil = function(start, fn, context) {
    if (start === null) {
        return;
    }

    var item;

    if (context === undefined) {
        context = this;
    }

    // push cursor
    var cursor = allocateCursor(this, start, null);

    while (cursor.prev !== null) {
        item = cursor.prev;
        cursor.prev = item.prev;

        if (fn.call(context, item.data, item, this)) {
            break;
        }
    }

    // pop cursor
    releaseCursor(this);
};

List.prototype.some = function(fn, context) {
    var cursor = this.head;

    if (context === undefined) {
        context = this;
    }

    while (cursor !== null) {
        if (fn.call(context, cursor.data, cursor, this)) {
            return true;
        }

        cursor = cursor.next;
    }

    return false;
};

List.prototype.map = function(fn, context) {
    var result = new List();
    var cursor = this.head;

    if (context === undefined) {
        context = this;
    }

    while (cursor !== null) {
        result.appendData(fn.call(context, cursor.data, cursor, this));
        cursor = cursor.next;
    }

    return result;
};

List.prototype.filter = function(fn, context) {
    var result = new List();
    var cursor = this.head;

    if (context === undefined) {
        context = this;
    }

    while (cursor !== null) {
        if (fn.call(context, cursor.data, cursor, this)) {
            result.appendData(cursor.data);
        }
        cursor = cursor.next;
    }

    return result;
};

List.prototype.clear = function() {
    this.head = null;
    this.tail = null;
};

List.prototype.copy = function() {
    var result = new List();
    var cursor = this.head;

    while (cursor !== null) {
        result.insert(createItem(cursor.data));
        cursor = cursor.next;
    }

    return result;
};

List.prototype.prepend = function(item) {
    //      head
    //    ^
    // item
    this.updateCursors(null, item, this.head, item);

    // insert to the beginning of the list
    if (this.head !== null) {
        // new item <- first item
        this.head.prev = item;

        // new item -> first item
        item.next = this.head;
    } else {
        // if list has no head, then it also has no tail
        // in this case tail points to the new item
        this.tail = item;
    }

    // head always points to new item
    this.head = item;

    return this;
};

List.prototype.prependData = function(data) {
    return this.prepend(createItem(data));
};

List.prototype.append = function(item) {
    return this.insert(item);
};

List.prototype.appendData = function(data) {
    return this.insert(createItem(data));
};

List.prototype.insert = function(item, before) {
    if (before !== undefined && before !== null) {
        // prev   before
        //      ^
        //     item
        this.updateCursors(before.prev, item, before, item);

        if (before.prev === null) {
            // insert to the beginning of list
            if (this.head !== before) {
                throw new Error('before doesn\'t belong to list');
            }

            // since head points to before therefore list doesn't empty
            // no need to check tail
            this.head = item;
            before.prev = item;
            item.next = before;

            this.updateCursors(null, item);
        } else {

            // insert between two items
            before.prev.next = item;
            item.prev = before.prev;

            before.prev = item;
            item.next = before;
        }
    } else {
        // tail
        //      ^
        //      item
        this.updateCursors(this.tail, item, null, item);

        // insert to the ending of the list
        if (this.tail !== null) {
            // last item -> new item
            this.tail.next = item;

            // last item <- new item
            item.prev = this.tail;
        } else {
            // if list has no tail, then it also has no head
            // in this case head points to new item
            this.head = item;
        }

        // tail always points to new item
        this.tail = item;
    }

    return this;
};

List.prototype.insertData = function(data, before) {
    return this.insert(createItem(data), before);
};

List.prototype.remove = function(item) {
    //      item
    //       ^
    // prev     next
    this.updateCursors(item, item.prev, item, item.next);

    if (item.prev !== null) {
        item.prev.next = item.next;
    } else {
        if (this.head !== item) {
            throw new Error('item doesn\'t belong to list');
        }

        this.head = item.next;
    }

    if (item.next !== null) {
        item.next.prev = item.prev;
    } else {
        if (this.tail !== item) {
            throw new Error('item doesn\'t belong to list');
        }

        this.tail = item.prev;
    }

    item.prev = null;
    item.next = null;

    return item;
};

List.prototype.push = function(data) {
    this.insert(createItem(data));
};

List.prototype.pop = function() {
    if (this.tail !== null) {
        return this.remove(this.tail);
    }
};

List.prototype.unshift = function(data) {
    this.prepend(createItem(data));
};

List.prototype.shift = function() {
    if (this.head !== null) {
        return this.remove(this.head);
    }
};

List.prototype.prependList = function(list) {
    return this.insertList(list, this.head);
};

List.prototype.appendList = function(list) {
    return this.insertList(list);
};

List.prototype.insertList = function(list, before) {
    // ignore empty lists
    if (list.head === null) {
        return this;
    }

    if (before !== undefined && before !== null) {
        this.updateCursors(before.prev, list.tail, before, list.head);

        // insert in the middle of dist list
        if (before.prev !== null) {
            // before.prev <-> list.head
            before.prev.next = list.head;
            list.head.prev = before.prev;
        } else {
            this.head = list.head;
        }

        before.prev = list.tail;
        list.tail.next = before;
    } else {
        this.updateCursors(this.tail, list.tail, null, list.head);

        // insert to end of the list
        if (this.tail !== null) {
            // if destination list has a tail, then it also has a head,
            // but head doesn't change

            // dest tail -> source head
            this.tail.next = list.head;

            // dest tail <- source head
            list.head.prev = this.tail;
        } else {
            // if list has no a tail, then it also has no a head
            // in this case points head to new item
            this.head = list.head;
        }

        // tail always start point to new item
        this.tail = list.tail;
    }

    list.head = null;
    list.tail = null;

    return this;
};

List.prototype.replace = function(oldItem, newItemOrList) {
    if ('head' in newItemOrList) {
        this.insertList(newItemOrList, oldItem);
    } else {
        this.insert(newItemOrList, oldItem);
    }

    this.remove(oldItem);
};

module.exports = List;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294275, function(require, module, exports) {
var createCustomError = require('../utils/createCustomError');
var MAX_LINE_LENGTH = 100;
var OFFSET_CORRECTION = 60;
var TAB_REPLACEMENT = '    ';

function sourceFragment(error, extraLines) {
    function processLines(start, end) {
        return lines.slice(start, end).map(function(line, idx) {
            var num = String(start + idx + 1);

            while (num.length < maxNumLength) {
                num = ' ' + num;
            }

            return num + ' |' + line;
        }).join('\n');
    }

    var lines = error.source.split(/\r\n?|\n|\f/);
    var line = error.line;
    var column = error.column;
    var startLine = Math.max(1, line - extraLines) - 1;
    var endLine = Math.min(line + extraLines, lines.length + 1);
    var maxNumLength = Math.max(4, String(endLine).length) + 1;
    var cutLeft = 0;

    // column correction according to replaced tab before column
    column += (TAB_REPLACEMENT.length - 1) * (lines[line - 1].substr(0, column - 1).match(/\t/g) || []).length;

    if (column > MAX_LINE_LENGTH) {
        cutLeft = column - OFFSET_CORRECTION + 3;
        column = OFFSET_CORRECTION - 2;
    }

    for (var i = startLine; i <= endLine; i++) {
        if (i >= 0 && i < lines.length) {
            lines[i] = lines[i].replace(/\t/g, TAB_REPLACEMENT);
            lines[i] =
                (cutLeft > 0 && lines[i].length > cutLeft ? '\u2026' : '') +
                lines[i].substr(cutLeft, MAX_LINE_LENGTH - 2) +
                (lines[i].length > cutLeft + MAX_LINE_LENGTH - 1 ? '\u2026' : '');
        }
    }

    return [
        processLines(startLine, line),
        new Array(column + maxNumLength + 2).join('-') + '^',
        processLines(line, endLine)
    ].filter(Boolean).join('\n');
}

var SyntaxError = function(message, source, offset, line, column) {
    var error = createCustomError('SyntaxError', message);

    error.source = source;
    error.offset = offset;
    error.line = line;
    error.column = column;

    error.sourceFragment = function(extraLines) {
        return sourceFragment(error, isNaN(extraLines) ? 0 : extraLines);
    };
    Object.defineProperty(error, 'formattedMessage', {
        get: function() {
            return (
                'Parse error: ' + error.message + '\n' +
                sourceFragment(error, 2)
            );
        }
    });

    // for backward capability
    error.parseError = {
        offset: offset,
        line: line,
        column: column
    };

    return error;
};

module.exports = SyntaxError;

}, function(modId) { var map = {"../utils/createCustomError":1597942294276}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294276, function(require, module, exports) {
module.exports = function createCustomError(name, message) {
    // use Object.create(), because some VMs prevent setting line/column otherwise
    // (iOS Safari 10 even throws an exception)
    var error = Object.create(SyntaxError.prototype);
    var errorStack = new Error();

    error.name = name;
    error.message = message;

    Object.defineProperty(error, 'stack', {
        get: function() {
            return (errorStack.stack || '').replace(/^(.+\n){1,3}/, name + ': ' + message + '\n');
        }
    });

    return error;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294277, function(require, module, exports) {
var constants = require('../tokenizer/const');
var TYPE = constants.TYPE;
var NAME = constants.NAME;

var utils = require('../tokenizer/utils');
var cmpStr = utils.cmpStr;

var EOF = TYPE.EOF;
var WHITESPACE = TYPE.WhiteSpace;
var COMMENT = TYPE.Comment;

var OFFSET_MASK = 0x00FFFFFF;
var TYPE_SHIFT = 24;

var TokenStream = function() {
    this.offsetAndType = null;
    this.balance = null;

    this.reset();
};

TokenStream.prototype = {
    reset: function() {
        this.eof = false;
        this.tokenIndex = -1;
        this.tokenType = 0;
        this.tokenStart = this.firstCharOffset;
        this.tokenEnd = this.firstCharOffset;
    },

    lookupType: function(offset) {
        offset += this.tokenIndex;

        if (offset < this.tokenCount) {
            return this.offsetAndType[offset] >> TYPE_SHIFT;
        }

        return EOF;
    },
    lookupOffset: function(offset) {
        offset += this.tokenIndex;

        if (offset < this.tokenCount) {
            return this.offsetAndType[offset - 1] & OFFSET_MASK;
        }

        return this.source.length;
    },
    lookupValue: function(offset, referenceStr) {
        offset += this.tokenIndex;

        if (offset < this.tokenCount) {
            return cmpStr(
                this.source,
                this.offsetAndType[offset - 1] & OFFSET_MASK,
                this.offsetAndType[offset] & OFFSET_MASK,
                referenceStr
            );
        }

        return false;
    },
    getTokenStart: function(tokenIndex) {
        if (tokenIndex === this.tokenIndex) {
            return this.tokenStart;
        }

        if (tokenIndex > 0) {
            return tokenIndex < this.tokenCount
                ? this.offsetAndType[tokenIndex - 1] & OFFSET_MASK
                : this.offsetAndType[this.tokenCount] & OFFSET_MASK;
        }

        return this.firstCharOffset;
    },

    // TODO: -> skipUntilBalanced
    getRawLength: function(startToken, mode) {
        var cursor = startToken;
        var balanceEnd;
        var offset = this.offsetAndType[Math.max(cursor - 1, 0)] & OFFSET_MASK;
        var type;

        loop:
        for (; cursor < this.tokenCount; cursor++) {
            balanceEnd = this.balance[cursor];

            // stop scanning on balance edge that points to offset before start token
            if (balanceEnd < startToken) {
                break loop;
            }

            type = this.offsetAndType[cursor] >> TYPE_SHIFT;

            // check token is stop type
            switch (mode(type, this.source, offset)) {
                case 1:
                    break loop;

                case 2:
                    cursor++;
                    break loop;

                default:
                    offset = this.offsetAndType[cursor] & OFFSET_MASK;

                    // fast forward to the end of balanced block
                    if (this.balance[balanceEnd] === cursor) {
                        cursor = balanceEnd;
                    }
            }
        }

        return cursor - this.tokenIndex;
    },
    isBalanceEdge: function(pos) {
        return this.balance[this.tokenIndex] < pos;
    },
    isDelim: function(code, offset) {
        if (offset) {
            return (
                this.lookupType(offset) === TYPE.Delim &&
                this.source.charCodeAt(this.lookupOffset(offset)) === code
            );
        }

        return (
            this.tokenType === TYPE.Delim &&
            this.source.charCodeAt(this.tokenStart) === code
        );
    },

    getTokenValue: function() {
        return this.source.substring(this.tokenStart, this.tokenEnd);
    },
    getTokenLength: function() {
        return this.tokenEnd - this.tokenStart;
    },
    substrToCursor: function(start) {
        return this.source.substring(start, this.tokenStart);
    },

    skipWS: function() {
        for (var i = this.tokenIndex, skipTokenCount = 0; i < this.tokenCount; i++, skipTokenCount++) {
            if ((this.offsetAndType[i] >> TYPE_SHIFT) !== WHITESPACE) {
                break;
            }
        }

        if (skipTokenCount > 0) {
            this.skip(skipTokenCount);
        }
    },
    skipSC: function() {
        while (this.tokenType === WHITESPACE || this.tokenType === COMMENT) {
            this.next();
        }
    },
    skip: function(tokenCount) {
        var next = this.tokenIndex + tokenCount;

        if (next < this.tokenCount) {
            this.tokenIndex = next;
            this.tokenStart = this.offsetAndType[next - 1] & OFFSET_MASK;
            next = this.offsetAndType[next];
            this.tokenType = next >> TYPE_SHIFT;
            this.tokenEnd = next & OFFSET_MASK;
        } else {
            this.tokenIndex = this.tokenCount;
            this.next();
        }
    },
    next: function() {
        var next = this.tokenIndex + 1;

        if (next < this.tokenCount) {
            this.tokenIndex = next;
            this.tokenStart = this.tokenEnd;
            next = this.offsetAndType[next];
            this.tokenType = next >> TYPE_SHIFT;
            this.tokenEnd = next & OFFSET_MASK;
        } else {
            this.tokenIndex = this.tokenCount;
            this.eof = true;
            this.tokenType = EOF;
            this.tokenStart = this.tokenEnd = this.source.length;
        }
    },

    dump: function() {
        var offset = this.firstCharOffset;

        return Array.prototype.slice.call(this.offsetAndType, 0, this.tokenCount).map(function(item, idx) {
            var start = offset;
            var end = item & OFFSET_MASK;

            offset = end;

            return {
                idx: idx,
                type: NAME[item >> TYPE_SHIFT],
                chunk: this.source.substring(start, end),
                balance: this.balance[idx]
            };
        }, this);
    }
};

module.exports = TokenStream;

}, function(modId) { var map = {"../tokenizer/const":1597942294278,"../tokenizer/utils":1597942294279}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294278, function(require, module, exports) {
// CSS Syntax Module Level 3
// https://www.w3.org/TR/css-syntax-3/
var TYPE = {
    EOF: 0,                 // <EOF-token>
    Ident: 1,               // <ident-token>
    Function: 2,            // <function-token>
    AtKeyword: 3,           // <at-keyword-token>
    Hash: 4,                // <hash-token>
    String: 5,              // <string-token>
    BadString: 6,           // <bad-string-token>
    Url: 7,                 // <url-token>
    BadUrl: 8,              // <bad-url-token>
    Delim: 9,               // <delim-token>
    Number: 10,             // <number-token>
    Percentage: 11,         // <percentage-token>
    Dimension: 12,          // <dimension-token>
    WhiteSpace: 13,         // <whitespace-token>
    CDO: 14,                // <CDO-token>
    CDC: 15,                // <CDC-token>
    Colon: 16,              // <colon-token>     :
    Semicolon: 17,          // <semicolon-token> ;
    Comma: 18,              // <comma-token>     ,
    LeftSquareBracket: 19,  // <[-token>
    RightSquareBracket: 20, // <]-token>
    LeftParenthesis: 21,    // <(-token>
    RightParenthesis: 22,   // <)-token>
    LeftCurlyBracket: 23,   // <{-token>
    RightCurlyBracket: 24,  // <}-token>
    Comment: 25
};

var NAME = Object.keys(TYPE).reduce(function(result, key) {
    result[TYPE[key]] = key;
    return result;
}, {});

module.exports = {
    TYPE: TYPE,
    NAME: NAME
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294279, function(require, module, exports) {
var charCodeDef = require('./char-code-definitions');
var isDigit = charCodeDef.isDigit;
var isHexDigit = charCodeDef.isHexDigit;
var isUppercaseLetter = charCodeDef.isUppercaseLetter;
var isName = charCodeDef.isName;
var isWhiteSpace = charCodeDef.isWhiteSpace;
var isValidEscape = charCodeDef.isValidEscape;

function getCharCode(source, offset) {
    return offset < source.length ? source.charCodeAt(offset) : 0;
}

function getNewlineLength(source, offset, code) {
    if (code === 13 /* \r */ && getCharCode(source, offset + 1) === 10 /* \n */) {
        return 2;
    }

    return 1;
}

function cmpChar(testStr, offset, referenceCode) {
    var code = testStr.charCodeAt(offset);

    // code.toLowerCase() for A..Z
    if (isUppercaseLetter(code)) {
        code = code | 32;
    }

    return code === referenceCode;
}

function cmpStr(testStr, start, end, referenceStr) {
    if (end - start !== referenceStr.length) {
        return false;
    }

    if (start < 0 || end > testStr.length) {
        return false;
    }

    for (var i = start; i < end; i++) {
        var testCode = testStr.charCodeAt(i);
        var referenceCode = referenceStr.charCodeAt(i - start);

        // testCode.toLowerCase() for A..Z
        if (isUppercaseLetter(testCode)) {
            testCode = testCode | 32;
        }

        if (testCode !== referenceCode) {
            return false;
        }
    }

    return true;
}

function findWhiteSpaceStart(source, offset) {
    for (; offset >= 0; offset--) {
        if (!isWhiteSpace(source.charCodeAt(offset))) {
            break;
        }
    }

    return offset + 1;
}

function findWhiteSpaceEnd(source, offset) {
    for (; offset < source.length; offset++) {
        if (!isWhiteSpace(source.charCodeAt(offset))) {
            break;
        }
    }

    return offset;
}

function findDecimalNumberEnd(source, offset) {
    for (; offset < source.length; offset++) {
        if (!isDigit(source.charCodeAt(offset))) {
            break;
        }
    }

    return offset;
}

// § 4.3.7. Consume an escaped code point
function consumeEscaped(source, offset) {
    // It assumes that the U+005C REVERSE SOLIDUS (\) has already been consumed and
    // that the next input code point has already been verified to be part of a valid escape.
    offset += 2;

    // hex digit
    if (isHexDigit(getCharCode(source, offset - 1))) {
        // Consume as many hex digits as possible, but no more than 5.
        // Note that this means 1-6 hex digits have been consumed in total.
        for (var maxOffset = Math.min(source.length, offset + 5); offset < maxOffset; offset++) {
            if (!isHexDigit(getCharCode(source, offset))) {
                break;
            }
        }

        // If the next input code point is whitespace, consume it as well.
        var code = getCharCode(source, offset);
        if (isWhiteSpace(code)) {
            offset += getNewlineLength(source, offset, code);
        }
    }

    return offset;
}

// §4.3.11. Consume a name
// Note: This algorithm does not do the verification of the first few code points that are necessary
// to ensure the returned code points would constitute an <ident-token>. If that is the intended use,
// ensure that the stream starts with an identifier before calling this algorithm.
function consumeName(source, offset) {
    // Let result initially be an empty string.
    // Repeatedly consume the next input code point from the stream:
    for (; offset < source.length; offset++) {
        var code = source.charCodeAt(offset);

        // name code point
        if (isName(code)) {
            // Append the code point to result.
            continue;
        }

        // the stream starts with a valid escape
        if (isValidEscape(code, getCharCode(source, offset + 1))) {
            // Consume an escaped code point. Append the returned code point to result.
            offset = consumeEscaped(source, offset) - 1;
            continue;
        }

        // anything else
        // Reconsume the current input code point. Return result.
        break;
    }

    return offset;
}

// §4.3.12. Consume a number
function consumeNumber(source, offset) {
    var code = source.charCodeAt(offset);

    // 2. If the next input code point is U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-),
    // consume it and append it to repr.
    if (code === 0x002B || code === 0x002D) {
        code = source.charCodeAt(offset += 1);
    }

    // 3. While the next input code point is a digit, consume it and append it to repr.
    if (isDigit(code)) {
        offset = findDecimalNumberEnd(source, offset + 1);
        code = source.charCodeAt(offset);
    }

    // 4. If the next 2 input code points are U+002E FULL STOP (.) followed by a digit, then:
    if (code === 0x002E && isDigit(source.charCodeAt(offset + 1))) {
        // 4.1 Consume them.
        // 4.2 Append them to repr.
        code = source.charCodeAt(offset += 2);

        // 4.3 Set type to "number".
        // TODO

        // 4.4 While the next input code point is a digit, consume it and append it to repr.

        offset = findDecimalNumberEnd(source, offset);
    }

    // 5. If the next 2 or 3 input code points are U+0045 LATIN CAPITAL LETTER E (E)
    // or U+0065 LATIN SMALL LETTER E (e), ... , followed by a digit, then:
    if (cmpChar(source, offset, 101 /* e */)) {
        var sign = 0;
        code = source.charCodeAt(offset + 1);

        // ... optionally followed by U+002D HYPHEN-MINUS (-) or U+002B PLUS SIGN (+) ...
        if (code === 0x002D || code === 0x002B) {
            sign = 1;
            code = source.charCodeAt(offset + 2);
        }

        // ... followed by a digit
        if (isDigit(code)) {
            // 5.1 Consume them.
            // 5.2 Append them to repr.

            // 5.3 Set type to "number".
            // TODO

            // 5.4 While the next input code point is a digit, consume it and append it to repr.
            offset = findDecimalNumberEnd(source, offset + 1 + sign + 1);
        }
    }

    return offset;
}

// § 4.3.14. Consume the remnants of a bad url
// ... its sole use is to consume enough of the input stream to reach a recovery point
// where normal tokenizing can resume.
function consumeBadUrlRemnants(source, offset) {
    // Repeatedly consume the next input code point from the stream:
    for (; offset < source.length; offset++) {
        var code = source.charCodeAt(offset);

        // U+0029 RIGHT PARENTHESIS ())
        // EOF
        if (code === 0x0029) {
            // Return.
            offset++;
            break;
        }

        if (isValidEscape(code, getCharCode(source, offset + 1))) {
            // Consume an escaped code point.
            // Note: This allows an escaped right parenthesis ("\)") to be encountered
            // without ending the <bad-url-token>. This is otherwise identical to
            // the "anything else" clause.
            offset = consumeEscaped(source, offset);
        }
    }

    return offset;
}

module.exports = {
    consumeEscaped: consumeEscaped,
    consumeName: consumeName,
    consumeNumber: consumeNumber,
    consumeBadUrlRemnants: consumeBadUrlRemnants,

    cmpChar: cmpChar,
    cmpStr: cmpStr,

    getNewlineLength: getNewlineLength,
    findWhiteSpaceStart: findWhiteSpaceStart,
    findWhiteSpaceEnd: findWhiteSpaceEnd
};

}, function(modId) { var map = {"./char-code-definitions":1597942294280}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294280, function(require, module, exports) {
var EOF = 0;

// https://drafts.csswg.org/css-syntax-3/
// § 4.2. Definitions

// digit
// A code point between U+0030 DIGIT ZERO (0) and U+0039 DIGIT NINE (9).
function isDigit(code) {
    return code >= 0x0030 && code <= 0x0039;
}

// hex digit
// A digit, or a code point between U+0041 LATIN CAPITAL LETTER A (A) and U+0046 LATIN CAPITAL LETTER F (F),
// or a code point between U+0061 LATIN SMALL LETTER A (a) and U+0066 LATIN SMALL LETTER F (f).
function isHexDigit(code) {
    return (
        isDigit(code) || // 0 .. 9
        (code >= 0x0041 && code <= 0x0046) || // A .. F
        (code >= 0x0061 && code <= 0x0066)    // a .. f
    );
}

// uppercase letter
// A code point between U+0041 LATIN CAPITAL LETTER A (A) and U+005A LATIN CAPITAL LETTER Z (Z).
function isUppercaseLetter(code) {
    return code >= 0x0041 && code <= 0x005A;
}

// lowercase letter
// A code point between U+0061 LATIN SMALL LETTER A (a) and U+007A LATIN SMALL LETTER Z (z).
function isLowercaseLetter(code) {
    return code >= 0x0061 && code <= 0x007A;
}

// letter
// An uppercase letter or a lowercase letter.
function isLetter(code) {
    return isUppercaseLetter(code) || isLowercaseLetter(code);
}

// non-ASCII code point
// A code point with a value equal to or greater than U+0080 <control>.
function isNonAscii(code) {
    return code >= 0x0080;
}

// name-start code point
// A letter, a non-ASCII code point, or U+005F LOW LINE (_).
function isNameStart(code) {
    return isLetter(code) || isNonAscii(code) || code === 0x005F;
}

// name code point
// A name-start code point, a digit, or U+002D HYPHEN-MINUS (-).
function isName(code) {
    return isNameStart(code) || isDigit(code) || code === 0x002D;
}

// non-printable code point
// A code point between U+0000 NULL and U+0008 BACKSPACE, or U+000B LINE TABULATION,
// or a code point between U+000E SHIFT OUT and U+001F INFORMATION SEPARATOR ONE, or U+007F DELETE.
function isNonPrintable(code) {
    return (
        (code >= 0x0000 && code <= 0x0008) ||
        (code === 0x000B) ||
        (code >= 0x000E && code <= 0x001F) ||
        (code === 0x007F)
    );
}

// newline
// U+000A LINE FEED. Note that U+000D CARRIAGE RETURN and U+000C FORM FEED are not included in this definition,
// as they are converted to U+000A LINE FEED during preprocessing.
// TODO: we doesn't do a preprocessing, so check a code point for U+000D CARRIAGE RETURN and U+000C FORM FEED
function isNewline(code) {
    return code === 0x000A || code === 0x000D || code === 0x000C;
}

// whitespace
// A newline, U+0009 CHARACTER TABULATION, or U+0020 SPACE.
function isWhiteSpace(code) {
    return isNewline(code) || code === 0x0020 || code === 0x0009;
}

// § 4.3.8. Check if two code points are a valid escape
function isValidEscape(first, second) {
    // If the first code point is not U+005C REVERSE SOLIDUS (\), return false.
    if (first !== 0x005C) {
        return false;
    }

    // Otherwise, if the second code point is a newline or EOF, return false.
    if (isNewline(second) || second === EOF) {
        return false;
    }

    // Otherwise, return true.
    return true;
}

// § 4.3.9. Check if three code points would start an identifier
function isIdentifierStart(first, second, third) {
    // Look at the first code point:

    // U+002D HYPHEN-MINUS
    if (first === 0x002D) {
        // If the second code point is a name-start code point or a U+002D HYPHEN-MINUS,
        // or the second and third code points are a valid escape, return true. Otherwise, return false.
        return (
            isNameStart(second) ||
            second === 0x002D ||
            isValidEscape(second, third)
        );
    }

    // name-start code point
    if (isNameStart(first)) {
        // Return true.
        return true;
    }

    // U+005C REVERSE SOLIDUS (\)
    if (first === 0x005C) {
        // If the first and second code points are a valid escape, return true. Otherwise, return false.
        return isValidEscape(first, second);
    }

    // anything else
    // Return false.
    return false;
}

// § 4.3.10. Check if three code points would start a number
function isNumberStart(first, second, third) {
    // Look at the first code point:

    // U+002B PLUS SIGN (+)
    // U+002D HYPHEN-MINUS (-)
    if (first === 0x002B || first === 0x002D) {
        // If the second code point is a digit, return true.
        if (isDigit(second)) {
            return 2;
        }

        // Otherwise, if the second code point is a U+002E FULL STOP (.)
        // and the third code point is a digit, return true.
        // Otherwise, return false.
        return second === 0x002E && isDigit(third) ? 3 : 0;
    }

    // U+002E FULL STOP (.)
    if (first === 0x002E) {
        // If the second code point is a digit, return true. Otherwise, return false.
        return isDigit(second) ? 2 : 0;
    }

    // digit
    if (isDigit(first)) {
        // Return true.
        return 1;
    }

    // anything else
    // Return false.
    return 0;
}

//
// Misc
//

// detect BOM (https://en.wikipedia.org/wiki/Byte_order_mark)
function isBOM(code) {
    // UTF-16BE
    if (code === 0xFEFF) {
        return 1;
    }

    // UTF-16LE
    if (code === 0xFFFE) {
        return 1;
    }

    return 0;
}

// Fast code category
//
// https://drafts.csswg.org/css-syntax/#tokenizer-definitions
// > non-ASCII code point
// >   A code point with a value equal to or greater than U+0080 <control>
// > name-start code point
// >   A letter, a non-ASCII code point, or U+005F LOW LINE (_).
// > name code point
// >   A name-start code point, a digit, or U+002D HYPHEN-MINUS (-)
// That means only ASCII code points has a special meaning and we define a maps for 0..127 codes only
var CATEGORY = new Array(0x80);
charCodeCategory.Eof = 0x80;
charCodeCategory.WhiteSpace = 0x82;
charCodeCategory.Digit = 0x83;
charCodeCategory.NameStart = 0x84;
charCodeCategory.NonPrintable = 0x85;

for (var i = 0; i < CATEGORY.length; i++) {
    switch (true) {
        case isWhiteSpace(i):
            CATEGORY[i] = charCodeCategory.WhiteSpace;
            break;

        case isDigit(i):
            CATEGORY[i] = charCodeCategory.Digit;
            break;

        case isNameStart(i):
            CATEGORY[i] = charCodeCategory.NameStart;
            break;

        case isNonPrintable(i):
            CATEGORY[i] = charCodeCategory.NonPrintable;
            break;

        default:
            CATEGORY[i] = i || charCodeCategory.Eof;
    }
}

function charCodeCategory(code) {
    return code < 0x80 ? CATEGORY[code] : charCodeCategory.NameStart;
};

module.exports = {
    isDigit: isDigit,
    isHexDigit: isHexDigit,
    isUppercaseLetter: isUppercaseLetter,
    isLowercaseLetter: isLowercaseLetter,
    isLetter: isLetter,
    isNonAscii: isNonAscii,
    isNameStart: isNameStart,
    isName: isName,
    isNonPrintable: isNonPrintable,
    isNewline: isNewline,
    isWhiteSpace: isWhiteSpace,
    isValidEscape: isValidEscape,
    isIdentifierStart: isIdentifierStart,
    isNumberStart: isNumberStart,

    isBOM: isBOM,
    charCodeCategory: charCodeCategory
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294281, function(require, module, exports) {
var SyntaxReferenceError = require('./error').SyntaxReferenceError;
var MatchError = require('./error').MatchError;
var names = require('../utils/names');
var generic = require('./generic');
var parse = require('../definition-syntax/parse');
var generate = require('../definition-syntax/generate');
var walk = require('../definition-syntax/walk');
var prepareTokens = require('./prepare-tokens');
var buildMatchGraph = require('./match-graph').buildMatchGraph;
var matchAsTree = require('./match').matchAsTree;
var trace = require('./trace');
var search = require('./search');
var getStructureFromConfig = require('./structure').getStructureFromConfig;
var cssWideKeywords = buildMatchGraph('inherit | initial | unset');
var cssWideKeywordsWithExpression = buildMatchGraph('inherit | initial | unset | <-ms-legacy-expression>');

function dumpMapSyntax(map, compact, syntaxAsAst) {
    var result = {};

    for (var name in map) {
        if (map[name].syntax) {
            result[name] = syntaxAsAst
                ? map[name].syntax
                : generate(map[name].syntax, { compact: compact });
        }
    }

    return result;
}

function valueHasVar(tokens) {
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].value.toLowerCase() === 'var(') {
            return true;
        }
    }

    return false;
}

function buildMatchResult(match, error, iterations) {
    return {
        matched: match,
        iterations: iterations,
        error: error,
        getTrace: trace.getTrace,
        isType: trace.isType,
        isProperty: trace.isProperty,
        isKeyword: trace.isKeyword
    };
}

function matchSyntax(lexer, syntax, value, useCommon) {
    var tokens = prepareTokens(value, lexer.syntax);
    var result;

    if (valueHasVar(tokens)) {
        return buildMatchResult(null, new Error('Matching for a tree with var() is not supported'));
    }

    if (useCommon) {
        result = matchAsTree(tokens, lexer.valueCommonSyntax, lexer);
    }

    if (!useCommon || !result.match) {
        result = matchAsTree(tokens, syntax.match, lexer);
        if (!result.match) {
            return buildMatchResult(
                null,
                new MatchError(result.reason, syntax.syntax, value, result),
                result.iterations
            );
        }
    }

    return buildMatchResult(result.match, null, result.iterations);
}

var Lexer = function(config, syntax, structure) {
    this.valueCommonSyntax = cssWideKeywords;
    this.syntax = syntax;
    this.generic = false;
    this.properties = {};
    this.types = {};
    this.structure = structure || getStructureFromConfig(config);

    if (config) {
        if (config.types) {
            for (var name in config.types) {
                this.addType_(name, config.types[name]);
            }
        }

        if (config.generic) {
            this.generic = true;
            for (var name in generic) {
                this.addType_(name, generic[name]);
            }
        }

        if (config.properties) {
            for (var name in config.properties) {
                this.addProperty_(name, config.properties[name]);
            }
        }
    }
};

Lexer.prototype = {
    structure: {},
    checkStructure: function(ast) {
        function collectWarning(node, message) {
            warns.push({
                node: node,
                message: message
            });
        }

        var structure = this.structure;
        var warns = [];

        this.syntax.walk(ast, function(node) {
            if (structure.hasOwnProperty(node.type)) {
                structure[node.type].check(node, collectWarning);
            } else {
                collectWarning(node, 'Unknown node type `' + node.type + '`');
            }
        });

        return warns.length ? warns : false;
    },

    createDescriptor: function(syntax, type, name) {
        var ref = {
            type: type,
            name: name
        };
        var descriptor = {
            type: type,
            name: name,
            syntax: null,
            match: null
        };

        if (typeof syntax === 'function') {
            descriptor.match = buildMatchGraph(syntax, ref);
        } else {
            if (typeof syntax === 'string') {
                // lazy parsing on first access
                Object.defineProperty(descriptor, 'syntax', {
                    get: function() {
                        Object.defineProperty(descriptor, 'syntax', {
                            value: parse(syntax)
                        });

                        return descriptor.syntax;
                    }
                });
            } else {
                descriptor.syntax = syntax;
            }

            // lazy graph build on first access
            Object.defineProperty(descriptor, 'match', {
                get: function() {
                    Object.defineProperty(descriptor, 'match', {
                        value: buildMatchGraph(descriptor.syntax, ref)
                    });

                    return descriptor.match;
                }
            });
        }

        return descriptor;
    },
    addProperty_: function(name, syntax) {
        this.properties[name] = this.createDescriptor(syntax, 'Property', name);
    },
    addType_: function(name, syntax) {
        this.types[name] = this.createDescriptor(syntax, 'Type', name);

        if (syntax === generic['-ms-legacy-expression']) {
            this.valueCommonSyntax = cssWideKeywordsWithExpression;
        }
    },

    matchDeclaration: function(node) {
        if (node.type !== 'Declaration') {
            return buildMatchResult(null, new Error('Not a Declaration node'));
        }

        return this.matchProperty(node.property, node.value);
    },
    matchProperty: function(propertyName, value) {
        var property = names.property(propertyName);

        // don't match syntax for a custom property
        if (property.custom) {
            return buildMatchResult(null, new Error('Lexer matching doesn\'t applicable for custom properties'));
        }

        var propertySyntax = property.vendor
            ? this.getProperty(property.name) || this.getProperty(property.basename)
            : this.getProperty(property.name);

        if (!propertySyntax) {
            return buildMatchResult(null, new SyntaxReferenceError('Unknown property', propertyName));
        }

        return matchSyntax(this, propertySyntax, value, true);
    },
    matchType: function(typeName, value) {
        var typeSyntax = this.getType(typeName);

        if (!typeSyntax) {
            return buildMatchResult(null, new SyntaxReferenceError('Unknown type', typeName));
        }

        return matchSyntax(this, typeSyntax, value, false);
    },
    match: function(syntax, value) {
        if (typeof syntax !== 'string' && (!syntax || !syntax.type)) {
            return buildMatchResult(null, new SyntaxReferenceError('Bad syntax'));
        }

        if (typeof syntax === 'string' || !syntax.match) {
            syntax = this.createDescriptor(syntax, 'Type', 'anonymous');
        }

        return matchSyntax(this, syntax, value, false);
    },

    findValueFragments: function(propertyName, value, type, name) {
        return search.matchFragments(this, value, this.matchProperty(propertyName, value), type, name);
    },
    findDeclarationValueFragments: function(declaration, type, name) {
        return search.matchFragments(this, declaration.value, this.matchDeclaration(declaration), type, name);
    },
    findAllFragments: function(ast, type, name) {
        var result = [];

        this.syntax.walk(ast, {
            visit: 'Declaration',
            enter: function(declaration) {
                result.push.apply(result, this.findDeclarationValueFragments(declaration, type, name));
            }.bind(this)
        });

        return result;
    },

    getProperty: function(name) {
        return this.properties.hasOwnProperty(name) ? this.properties[name] : null;
    },
    getType: function(name) {
        return this.types.hasOwnProperty(name) ? this.types[name] : null;
    },

    validate: function() {
        function validate(syntax, name, broken, descriptor) {
            if (broken.hasOwnProperty(name)) {
                return broken[name];
            }

            broken[name] = false;
            if (descriptor.syntax !== null) {
                walk(descriptor.syntax, function(node) {
                    if (node.type !== 'Type' && node.type !== 'Property') {
                        return;
                    }

                    var map = node.type === 'Type' ? syntax.types : syntax.properties;
                    var brokenMap = node.type === 'Type' ? brokenTypes : brokenProperties;

                    if (!map.hasOwnProperty(node.name) || validate(syntax, node.name, brokenMap, map[node.name])) {
                        broken[name] = true;
                    }
                }, this);
            }
        }

        var brokenTypes = {};
        var brokenProperties = {};

        for (var key in this.types) {
            validate(this, key, brokenTypes, this.types[key]);
        }

        for (var key in this.properties) {
            validate(this, key, brokenProperties, this.properties[key]);
        }

        brokenTypes = Object.keys(brokenTypes).filter(function(name) {
            return brokenTypes[name];
        });
        brokenProperties = Object.keys(brokenProperties).filter(function(name) {
            return brokenProperties[name];
        });

        if (brokenTypes.length || brokenProperties.length) {
            return {
                types: brokenTypes,
                properties: brokenProperties
            };
        }

        return null;
    },
    dump: function(syntaxAsAst, pretty) {
        return {
            generic: this.generic,
            types: dumpMapSyntax(this.types, !pretty, syntaxAsAst),
            properties: dumpMapSyntax(this.properties, !pretty, syntaxAsAst)
        };
    },
    toString: function() {
        return JSON.stringify(this.dump());
    }
};

module.exports = Lexer;

}, function(modId) { var map = {"./error":1597942294282,"../utils/names":1597942294284,"./generic":1597942294285,"../definition-syntax/parse":1597942294290,"../definition-syntax/generate":1597942294283,"../definition-syntax/walk":1597942294293,"./prepare-tokens":1597942294294,"./match-graph":1597942294295,"./match":1597942294296,"./trace":1597942294297,"./search":1597942294298,"./structure":1597942294299}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294282, function(require, module, exports) {
var createCustomError = require('../utils/createCustomError');
var generate = require('../definition-syntax/generate');

function fromMatchResult(matchResult) {
    var tokens = matchResult.tokens;
    var longestMatch = matchResult.longestMatch;
    var node = longestMatch < tokens.length ? tokens[longestMatch].node : null;
    var mismatchOffset = -1;
    var entries = 0;
    var css = '';

    for (var i = 0; i < tokens.length; i++) {
        if (i === longestMatch) {
            mismatchOffset = css.length;
        }

        if (node !== null && tokens[i].node === node) {
            if (i <= longestMatch) {
                entries++;
            } else {
                entries = 0;
            }
        }

        css += tokens[i].value;
    }

    return {
        node: node,
        css: css,
        mismatchOffset: mismatchOffset === -1 ? css.length : mismatchOffset,
        last: node === null || entries > 1
    };
}

function getLocation(node, point) {
    var loc = node && node.loc && node.loc[point];

    if (loc) {
        return {
            offset: loc.offset,
            line: loc.line,
            column: loc.column
        };
    }

    return null;
}

var SyntaxReferenceError = function(type, referenceName) {
    var error = createCustomError(
        'SyntaxReferenceError',
        type + (referenceName ? ' `' + referenceName + '`' : '')
    );

    error.reference = referenceName;

    return error;
};

var MatchError = function(message, syntax, node, matchResult) {
    var error = createCustomError('SyntaxMatchError', message);
    var details = fromMatchResult(matchResult);
    var mismatchOffset = details.mismatchOffset || 0;
    var badNode = details.node || node;
    var end = getLocation(badNode, 'end');
    var start = details.last ? end : getLocation(badNode, 'start');
    var css = details.css;

    error.rawMessage = message;
    error.syntax = syntax ? generate(syntax) : '<generic>';
    error.css = css;
    error.mismatchOffset = mismatchOffset;
    error.loc = {
        source: (badNode && badNode.loc && badNode.loc.source) || '<unknown>',
        start: start,
        end: end
    };
    error.line = start ? start.line : undefined;
    error.column = start ? start.column : undefined;
    error.offset = start ? start.offset : undefined;
    error.message = message + '\n' +
        '  syntax: ' + error.syntax + '\n' +
        '   value: ' + (error.css || '<empty string>') + '\n' +
        '  --------' + new Array(error.mismatchOffset + 1).join('-') + '^';

    return error;
};

module.exports = {
    SyntaxReferenceError: SyntaxReferenceError,
    MatchError: MatchError
};

}, function(modId) { var map = {"../utils/createCustomError":1597942294276,"../definition-syntax/generate":1597942294283}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294283, function(require, module, exports) {
function noop(value) {
    return value;
}

function generateMultiplier(multiplier) {
    if (multiplier.min === 0 && multiplier.max === 0) {
        return '*';
    }

    if (multiplier.min === 0 && multiplier.max === 1) {
        return '?';
    }

    if (multiplier.min === 1 && multiplier.max === 0) {
        return multiplier.comma ? '#' : '+';
    }

    if (multiplier.min === 1 && multiplier.max === 1) {
        return '';
    }

    return (
        (multiplier.comma ? '#' : '') +
        (multiplier.min === multiplier.max
            ? '{' + multiplier.min + '}'
            : '{' + multiplier.min + ',' + (multiplier.max !== 0 ? multiplier.max : '') + '}'
        )
    );
}

function generateTypeOpts(node) {
    switch (node.type) {
        case 'Range':
            return (
                ' [' +
                (node.min === null ? '-∞' : node.min) +
                ',' +
                (node.max === null ? '∞' : node.max) +
                ']'
            );

        default:
            throw new Error('Unknown node type `' + node.type + '`');
    }
}

function generateSequence(node, decorate, forceBraces, compact) {
    var combinator = node.combinator === ' ' || compact ? node.combinator : ' ' + node.combinator + ' ';
    var result = node.terms.map(function(term) {
        return generate(term, decorate, forceBraces, compact);
    }).join(combinator);

    if (node.explicit || forceBraces) {
        result = (compact || result[0] === ',' ? '[' : '[ ') + result + (compact ? ']' : ' ]');
    }

    return result;
}

function generate(node, decorate, forceBraces, compact) {
    var result;

    switch (node.type) {
        case 'Group':
            result =
                generateSequence(node, decorate, forceBraces, compact) +
                (node.disallowEmpty ? '!' : '');
            break;

        case 'Multiplier':
            // return since node is a composition
            return (
                generate(node.term, decorate, forceBraces, compact) +
                decorate(generateMultiplier(node), node)
            );

        case 'Type':
            result = '<' + node.name + (node.opts ? decorate(generateTypeOpts(node.opts), node.opts) : '') + '>';
            break;

        case 'Property':
            result = '<\'' + node.name + '\'>';
            break;

        case 'Keyword':
            result = node.name;
            break;

        case 'AtKeyword':
            result = '@' + node.name;
            break;

        case 'Function':
            result = node.name + '(';
            break;

        case 'String':
        case 'Token':
            result = node.value;
            break;

        case 'Comma':
            result = ',';
            break;

        default:
            throw new Error('Unknown node type `' + node.type + '`');
    }

    return decorate(result, node);
}

module.exports = function(node, options) {
    var decorate = noop;
    var forceBraces = false;
    var compact = false;

    if (typeof options === 'function') {
        decorate = options;
    } else if (options) {
        forceBraces = Boolean(options.forceBraces);
        compact = Boolean(options.compact);
        if (typeof options.decorate === 'function') {
            decorate = options.decorate;
        }
    }

    return generate(node, decorate, forceBraces, compact);
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294284, function(require, module, exports) {
var hasOwnProperty = Object.prototype.hasOwnProperty;
var keywords = Object.create(null);
var properties = Object.create(null);
var HYPHENMINUS = 45; // '-'.charCodeAt()

function isCustomProperty(str, offset) {
    offset = offset || 0;

    return str.length - offset >= 2 &&
           str.charCodeAt(offset) === HYPHENMINUS &&
           str.charCodeAt(offset + 1) === HYPHENMINUS;
}

function getVendorPrefix(str, offset) {
    offset = offset || 0;

    // verdor prefix should be at least 3 chars length
    if (str.length - offset >= 3) {
        // vendor prefix starts with hyper minus following non-hyper minus
        if (str.charCodeAt(offset) === HYPHENMINUS &&
            str.charCodeAt(offset + 1) !== HYPHENMINUS) {
            // vendor prefix should contain a hyper minus at the ending
            var secondDashIndex = str.indexOf('-', offset + 2);

            if (secondDashIndex !== -1) {
                return str.substring(offset, secondDashIndex + 1);
            }
        }
    }

    return '';
}

function getKeywordDescriptor(keyword) {
    if (hasOwnProperty.call(keywords, keyword)) {
        return keywords[keyword];
    }

    var name = keyword.toLowerCase();

    if (hasOwnProperty.call(keywords, name)) {
        return keywords[keyword] = keywords[name];
    }

    var custom = isCustomProperty(name, 0);
    var vendor = !custom ? getVendorPrefix(name, 0) : '';

    return keywords[keyword] = Object.freeze({
        basename: name.substr(vendor.length),
        name: name,
        vendor: vendor,
        prefix: vendor,
        custom: custom
    });
}

function getPropertyDescriptor(property) {
    if (hasOwnProperty.call(properties, property)) {
        return properties[property];
    }

    var name = property;
    var hack = property[0];

    if (hack === '/') {
        hack = property[1] === '/' ? '//' : '/';
    } else if (hack !== '_' &&
               hack !== '*' &&
               hack !== '$' &&
               hack !== '#' &&
               hack !== '+' &&
               hack !== '&') {
        hack = '';
    }

    var custom = isCustomProperty(name, hack.length);

    // re-use result when possible (the same as for lower case)
    if (!custom) {
        name = name.toLowerCase();
        if (hasOwnProperty.call(properties, name)) {
            return properties[property] = properties[name];
        }
    }

    var vendor = !custom ? getVendorPrefix(name, hack.length) : '';
    var prefix = name.substr(0, hack.length + vendor.length);

    return properties[property] = Object.freeze({
        basename: name.substr(prefix.length),
        name: name.substr(hack.length),
        hack: hack,
        vendor: vendor,
        prefix: prefix,
        custom: custom
    });
}

module.exports = {
    keyword: getKeywordDescriptor,
    property: getPropertyDescriptor,
    isCustomProperty: isCustomProperty,
    vendorPrefix: getVendorPrefix
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294285, function(require, module, exports) {
var tokenizer = require('../tokenizer');
var isIdentifierStart = tokenizer.isIdentifierStart;
var isHexDigit = tokenizer.isHexDigit;
var isDigit = tokenizer.isDigit;
var cmpStr = tokenizer.cmpStr;
var consumeNumber = tokenizer.consumeNumber;
var TYPE = tokenizer.TYPE;
var anPlusB = require('./generic-an-plus-b');
var urange = require('./generic-urange');

var cssWideKeywords = ['unset', 'initial', 'inherit'];
var calcFunctionNames = ['calc(', '-moz-calc(', '-webkit-calc('];

// https://www.w3.org/TR/css-values-3/#lengths
var LENGTH = {
    // absolute length units
    'px': true,
    'mm': true,
    'cm': true,
    'in': true,
    'pt': true,
    'pc': true,
    'q': true,

    // relative length units
    'em': true,
    'ex': true,
    'ch': true,
    'rem': true,

    // viewport-percentage lengths
    'vh': true,
    'vw': true,
    'vmin': true,
    'vmax': true,
    'vm': true
};

var ANGLE = {
    'deg': true,
    'grad': true,
    'rad': true,
    'turn': true
};

var TIME = {
    's': true,
    'ms': true
};

var FREQUENCY = {
    'hz': true,
    'khz': true
};

// https://www.w3.org/TR/css-values-3/#resolution (https://drafts.csswg.org/css-values/#resolution)
var RESOLUTION = {
    'dpi': true,
    'dpcm': true,
    'dppx': true,
    'x': true      // https://github.com/w3c/csswg-drafts/issues/461
};

// https://drafts.csswg.org/css-grid/#fr-unit
var FLEX = {
    'fr': true
};

// https://www.w3.org/TR/css3-speech/#mixing-props-voice-volume
var DECIBEL = {
    'db': true
};

// https://www.w3.org/TR/css3-speech/#voice-props-voice-pitch
var SEMITONES = {
    'st': true
};

// safe char code getter
function charCode(str, index) {
    return index < str.length ? str.charCodeAt(index) : 0;
}

function eqStr(actual, expected) {
    return cmpStr(actual, 0, actual.length, expected);
}

function eqStrAny(actual, expected) {
    for (var i = 0; i < expected.length; i++) {
        if (eqStr(actual, expected[i])) {
            return true;
        }
    }

    return false;
}

// IE postfix hack, i.e. 123\0 or 123px\9
function isPostfixIeHack(str, offset) {
    if (offset !== str.length - 2) {
        return false;
    }

    return (
        str.charCodeAt(offset) === 0x005C &&  // U+005C REVERSE SOLIDUS (\)
        isDigit(str.charCodeAt(offset + 1))
    );
}

function outOfRange(opts, value, numEnd) {
    if (opts && opts.type === 'Range') {
        var num = Number(
            numEnd !== undefined && numEnd !== value.length
                ? value.substr(0, numEnd)
                : value
        );

        if (isNaN(num)) {
            return true;
        }

        if (opts.min !== null && num < opts.min) {
            return true;
        }

        if (opts.max !== null && num > opts.max) {
            return true;
        }
    }

    return false;
}

function consumeFunction(token, getNextToken) {
    var startIdx = token.index;
    var length = 0;

    // balanced token consuming
    do {
        length++;

        if (token.balance <= startIdx) {
            break;
        }
    } while (token = getNextToken(length));

    return length;
}

// TODO: implement
// can be used wherever <length>, <frequency>, <angle>, <time>, <percentage>, <number>, or <integer> values are allowed
// https://drafts.csswg.org/css-values/#calc-notation
function calc(next) {
    return function(token, getNextToken, opts) {
        if (token === null) {
            return 0;
        }

        if (token.type === TYPE.Function && eqStrAny(token.value, calcFunctionNames)) {
            return consumeFunction(token, getNextToken);
        }

        return next(token, getNextToken, opts);
    };
}

function tokenType(expectedTokenType) {
    return function(token) {
        if (token === null || token.type !== expectedTokenType) {
            return 0;
        }

        return 1;
    };
}

function func(name) {
    name = name + '(';

    return function(token, getNextToken) {
        if (token !== null && eqStr(token.value, name)) {
            return consumeFunction(token, getNextToken);
        }

        return 0;
    };
}

// =========================
// Complex types
//

// https://drafts.csswg.org/css-values-4/#custom-idents
// 4.2. Author-defined Identifiers: the <custom-ident> type
// Some properties accept arbitrary author-defined identifiers as a component value.
// This generic data type is denoted by <custom-ident>, and represents any valid CSS identifier
// that would not be misinterpreted as a pre-defined keyword in that property’s value definition.
//
// See also: https://developer.mozilla.org/en-US/docs/Web/CSS/custom-ident
function customIdent(token) {
    if (token === null || token.type !== TYPE.Ident) {
        return 0;
    }

    var name = token.value.toLowerCase();

    // The CSS-wide keywords are not valid <custom-ident>s
    if (eqStrAny(name, cssWideKeywords)) {
        return 0;
    }

    // The default keyword is reserved and is also not a valid <custom-ident>
    if (eqStr(name, 'default')) {
        return 0;
    }

    // TODO: ignore property specific keywords (as described https://developer.mozilla.org/en-US/docs/Web/CSS/custom-ident)
    // Specifications using <custom-ident> must specify clearly what other keywords
    // are excluded from <custom-ident>, if any—for example by saying that any pre-defined keywords
    // in that property’s value definition are excluded. Excluded keywords are excluded
    // in all ASCII case permutations.

    return 1;
}

// https://drafts.csswg.org/css-variables/#typedef-custom-property-name
// A custom property is any property whose name starts with two dashes (U+002D HYPHEN-MINUS), like --foo.
// The <custom-property-name> production corresponds to this: it’s defined as any valid identifier
// that starts with two dashes, except -- itself, which is reserved for future use by CSS.
// NOTE: Current implementation treat `--` as a valid name since most (all?) major browsers treat it as valid.
function customPropertyName(token) {
    // ... defined as any valid identifier
    if (token === null || token.type !== TYPE.Ident) {
        return 0;
    }

    // ... that starts with two dashes (U+002D HYPHEN-MINUS)
    if (charCode(token.value, 0) !== 0x002D || charCode(token.value, 1) !== 0x002D) {
        return 0;
    }

    return 1;
}

// https://drafts.csswg.org/css-color-4/#hex-notation
// The syntax of a <hex-color> is a <hash-token> token whose value consists of 3, 4, 6, or 8 hexadecimal digits.
// In other words, a hex color is written as a hash character, "#", followed by some number of digits 0-9 or
// letters a-f (the case of the letters doesn’t matter - #00ff00 is identical to #00FF00).
function hexColor(token) {
    if (token === null || token.type !== TYPE.Hash) {
        return 0;
    }

    var length = token.value.length;

    // valid values (length): #rgb (4), #rgba (5), #rrggbb (7), #rrggbbaa (9)
    if (length !== 4 && length !== 5 && length !== 7 && length !== 9) {
        return 0;
    }

    for (var i = 1; i < length; i++) {
        if (!isHexDigit(token.value.charCodeAt(i))) {
            return 0;
        }
    }

    return 1;
}

function idSelector(token) {
    if (token === null || token.type !== TYPE.Hash) {
        return 0;
    }

    if (!isIdentifierStart(charCode(token.value, 1), charCode(token.value, 2), charCode(token.value, 3))) {
        return 0;
    }

    return 1;
}

// https://drafts.csswg.org/css-syntax/#any-value
// It represents the entirety of what a valid declaration can have as its value.
function declarationValue(token, getNextToken) {
    if (!token) {
        return 0;
    }

    var length = 0;
    var level = 0;
    var startIdx = token.index;

    // The <declaration-value> production matches any sequence of one or more tokens,
    // so long as the sequence ...
    scan:
    do {
        switch (token.type) {
            // ... does not contain <bad-string-token>, <bad-url-token>,
            case TYPE.BadString:
            case TYPE.BadUrl:
                break scan;

            // ... unmatched <)-token>, <]-token>, or <}-token>,
            case TYPE.RightCurlyBracket:
            case TYPE.RightParenthesis:
            case TYPE.RightSquareBracket:
                if (token.balance > token.index || token.balance < startIdx) {
                    break scan;
                }

                level--;
                break;

            // ... or top-level <semicolon-token> tokens
            case TYPE.Semicolon:
                if (level === 0) {
                    break scan;
                }

                break;

            // ... or <delim-token> tokens with a value of "!"
            case TYPE.Delim:
                if (token.value === '!' && level === 0) {
                    break scan;
                }

                break;

            case TYPE.Function:
            case TYPE.LeftParenthesis:
            case TYPE.LeftSquareBracket:
            case TYPE.LeftCurlyBracket:
                level++;
                break;
        }

        length++;

        // until balance closing
        if (token.balance <= startIdx) {
            break;
        }
    } while (token = getNextToken(length));

    return length;
}

// https://drafts.csswg.org/css-syntax/#any-value
// The <any-value> production is identical to <declaration-value>, but also
// allows top-level <semicolon-token> tokens and <delim-token> tokens
// with a value of "!". It represents the entirety of what valid CSS can be in any context.
function anyValue(token, getNextToken) {
    if (!token) {
        return 0;
    }

    var startIdx = token.index;
    var length = 0;

    // The <any-value> production matches any sequence of one or more tokens,
    // so long as the sequence ...
    scan:
    do {
        switch (token.type) {
            // ... does not contain <bad-string-token>, <bad-url-token>,
            case TYPE.BadString:
            case TYPE.BadUrl:
                break scan;

            // ... unmatched <)-token>, <]-token>, or <}-token>,
            case TYPE.RightCurlyBracket:
            case TYPE.RightParenthesis:
            case TYPE.RightSquareBracket:
                if (token.balance > token.index || token.balance < startIdx) {
                    break scan;
                }

                break;
        }

        length++;

        // until balance closing
        if (token.balance <= startIdx) {
            break;
        }
    } while (token = getNextToken(length));

    return length;
}

// =========================
// Dimensions
//

function dimension(type) {
    return function(token, getNextToken, opts) {
        if (token === null || token.type !== TYPE.Dimension) {
            return 0;
        }

        var numberEnd = consumeNumber(token.value, 0);

        // check unit
        if (type !== null) {
            // check for IE postfix hack, i.e. 123px\0 or 123px\9
            var reverseSolidusOffset = token.value.indexOf('\\', numberEnd);
            var unit = reverseSolidusOffset === -1 || !isPostfixIeHack(token.value, reverseSolidusOffset)
                ? token.value.substr(numberEnd)
                : token.value.substring(numberEnd, reverseSolidusOffset);

            if (type.hasOwnProperty(unit.toLowerCase()) === false) {
                return 0;
            }
        }

        // check range if specified
        if (outOfRange(opts, token.value, numberEnd)) {
            return 0;
        }

        return 1;
    };
}

// =========================
// Percentage
//

// §5.5. Percentages: the <percentage> type
// https://drafts.csswg.org/css-values-4/#percentages
function percentage(token, getNextToken, opts) {
    // ... corresponds to the <percentage-token> production
    if (token === null || token.type !== TYPE.Percentage) {
        return 0;
    }

    // check range if specified
    if (outOfRange(opts, token.value, token.value.length - 1)) {
        return 0;
    }

    return 1;
}

// =========================
// Numeric
//

// https://drafts.csswg.org/css-values-4/#numbers
// The value <zero> represents a literal number with the value 0. Expressions that merely
// evaluate to a <number> with the value 0 (for example, calc(0)) do not match <zero>;
// only literal <number-token>s do.
function zero(next) {
    if (typeof next !== 'function') {
        next = function() {
            return 0;
        };
    }

    return function(token, getNextToken, opts) {
        if (token !== null && token.type === TYPE.Number) {
            if (Number(token.value) === 0) {
                return 1;
            }
        }

        return next(token, getNextToken, opts);
    };
}

// § 5.3. Real Numbers: the <number> type
// https://drafts.csswg.org/css-values-4/#numbers
// Number values are denoted by <number>, and represent real numbers, possibly with a fractional component.
// ... It corresponds to the <number-token> production
function number(token, getNextToken, opts) {
    if (token === null) {
        return 0;
    }

    var numberEnd = consumeNumber(token.value, 0);
    var isNumber = numberEnd === token.value.length;
    if (!isNumber && !isPostfixIeHack(token.value, numberEnd)) {
        return 0;
    }

    // check range if specified
    if (outOfRange(opts, token.value, numberEnd)) {
        return 0;
    }

    return 1;
}

// §5.2. Integers: the <integer> type
// https://drafts.csswg.org/css-values-4/#integers
function integer(token, getNextToken, opts) {
    // ... corresponds to a subset of the <number-token> production
    if (token === null || token.type !== TYPE.Number) {
        return 0;
    }

    // The first digit of an integer may be immediately preceded by `-` or `+` to indicate the integer’s sign.
    var i = token.value.charCodeAt(0) === 0x002B ||       // U+002B PLUS SIGN (+)
            token.value.charCodeAt(0) === 0x002D ? 1 : 0; // U+002D HYPHEN-MINUS (-)

    // When written literally, an integer is one or more decimal digits 0 through 9 ...
    for (; i < token.value.length; i++) {
        if (!isDigit(token.value.charCodeAt(i))) {
            return 0;
        }
    }

    // check range if specified
    if (outOfRange(opts, token.value, i)) {
        return 0;
    }

    return 1;
}

module.exports = {
    // token types
    'ident-token': tokenType(TYPE.Ident),
    'function-token': tokenType(TYPE.Function),
    'at-keyword-token': tokenType(TYPE.AtKeyword),
    'hash-token': tokenType(TYPE.Hash),
    'string-token': tokenType(TYPE.String),
    'bad-string-token': tokenType(TYPE.BadString),
    'url-token': tokenType(TYPE.Url),
    'bad-url-token': tokenType(TYPE.BadUrl),
    'delim-token': tokenType(TYPE.Delim),
    'number-token': tokenType(TYPE.Number),
    'percentage-token': tokenType(TYPE.Percentage),
    'dimension-token': tokenType(TYPE.Dimension),
    'whitespace-token': tokenType(TYPE.WhiteSpace),
    'CDO-token': tokenType(TYPE.CDO),
    'CDC-token': tokenType(TYPE.CDC),
    'colon-token': tokenType(TYPE.Colon),
    'semicolon-token': tokenType(TYPE.Semicolon),
    'comma-token': tokenType(TYPE.Comma),
    '[-token': tokenType(TYPE.LeftSquareBracket),
    ']-token': tokenType(TYPE.RightSquareBracket),
    '(-token': tokenType(TYPE.LeftParenthesis),
    ')-token': tokenType(TYPE.RightParenthesis),
    '{-token': tokenType(TYPE.LeftCurlyBracket),
    '}-token': tokenType(TYPE.RightCurlyBracket),

    // token type aliases
    'string': tokenType(TYPE.String),
    'ident': tokenType(TYPE.Ident),

    // complex types
    'custom-ident': customIdent,
    'custom-property-name': customPropertyName,
    'hex-color': hexColor,
    'id-selector': idSelector, // element( <id-selector> )
    'an-plus-b': anPlusB,
    'urange': urange,
    'declaration-value': declarationValue,
    'any-value': anyValue,

    // dimensions
    'dimension': calc(dimension(null)),
    'angle': calc(dimension(ANGLE)),
    'decibel': calc(dimension(DECIBEL)),
    'frequency': calc(dimension(FREQUENCY)),
    'flex': calc(dimension(FLEX)),
    'length': calc(zero(dimension(LENGTH))),
    'resolution': calc(dimension(RESOLUTION)),
    'semitones': calc(dimension(SEMITONES)),
    'time': calc(dimension(TIME)),

    // percentage
    'percentage': calc(percentage),

    // numeric
    'zero': zero(),
    'number': calc(number),
    'integer': calc(integer),

    // old IE stuff
    '-ms-legacy-expression': func('expression')
};

}, function(modId) { var map = {"../tokenizer":1597942294286,"./generic-an-plus-b":1597942294288,"./generic-urange":1597942294289}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294286, function(require, module, exports) {
var TokenStream = require('../common/TokenStream');
var adoptBuffer = require('../common/adopt-buffer');

var constants = require('./const');
var TYPE = constants.TYPE;

var charCodeDefinitions = require('./char-code-definitions');
var isNewline = charCodeDefinitions.isNewline;
var isName = charCodeDefinitions.isName;
var isValidEscape = charCodeDefinitions.isValidEscape;
var isNumberStart = charCodeDefinitions.isNumberStart;
var isIdentifierStart = charCodeDefinitions.isIdentifierStart;
var charCodeCategory = charCodeDefinitions.charCodeCategory;
var isBOM = charCodeDefinitions.isBOM;

var utils = require('./utils');
var cmpStr = utils.cmpStr;
var getNewlineLength = utils.getNewlineLength;
var findWhiteSpaceEnd = utils.findWhiteSpaceEnd;
var consumeEscaped = utils.consumeEscaped;
var consumeName = utils.consumeName;
var consumeNumber = utils.consumeNumber;
var consumeBadUrlRemnants = utils.consumeBadUrlRemnants;

var OFFSET_MASK = 0x00FFFFFF;
var TYPE_SHIFT = 24;

function tokenize(source, stream) {
    function getCharCode(offset) {
        return offset < sourceLength ? source.charCodeAt(offset) : 0;
    }

    // § 4.3.3. Consume a numeric token
    function consumeNumericToken() {
        // Consume a number and let number be the result.
        offset = consumeNumber(source, offset);

        // If the next 3 input code points would start an identifier, then:
        if (isIdentifierStart(getCharCode(offset), getCharCode(offset + 1), getCharCode(offset + 2))) {
            // Create a <dimension-token> with the same value and type flag as number, and a unit set initially to the empty string.
            // Consume a name. Set the <dimension-token>’s unit to the returned value.
            // Return the <dimension-token>.
            type = TYPE.Dimension;
            offset = consumeName(source, offset);
            return;
        }

        // Otherwise, if the next input code point is U+0025 PERCENTAGE SIGN (%), consume it.
        if (getCharCode(offset) === 0x0025) {
            // Create a <percentage-token> with the same value as number, and return it.
            type = TYPE.Percentage;
            offset++;
            return;
        }

        // Otherwise, create a <number-token> with the same value and type flag as number, and return it.
        type = TYPE.Number;
    }

    // § 4.3.4. Consume an ident-like token
    function consumeIdentLikeToken() {
        const nameStartOffset = offset;

        // Consume a name, and let string be the result.
        offset = consumeName(source, offset);

        // If string’s value is an ASCII case-insensitive match for "url",
        // and the next input code point is U+0028 LEFT PARENTHESIS ((), consume it.
        if (cmpStr(source, nameStartOffset, offset, 'url') && getCharCode(offset) === 0x0028) {
            // While the next two input code points are whitespace, consume the next input code point.
            offset = findWhiteSpaceEnd(source, offset + 1);

            // If the next one or two input code points are U+0022 QUOTATION MARK ("), U+0027 APOSTROPHE ('),
            // or whitespace followed by U+0022 QUOTATION MARK (") or U+0027 APOSTROPHE ('),
            // then create a <function-token> with its value set to string and return it.
            if (getCharCode(offset) === 0x0022 ||
                getCharCode(offset) === 0x0027) {
                type = TYPE.Function;
                offset = nameStartOffset + 4;
                return;
            }

            // Otherwise, consume a url token, and return it.
            consumeUrlToken();
            return;
        }

        // Otherwise, if the next input code point is U+0028 LEFT PARENTHESIS ((), consume it.
        // Create a <function-token> with its value set to string and return it.
        if (getCharCode(offset) === 0x0028) {
            type = TYPE.Function;
            offset++;
            return;
        }

        // Otherwise, create an <ident-token> with its value set to string and return it.
        type = TYPE.Ident;
    }

    // § 4.3.5. Consume a string token
    function consumeStringToken(endingCodePoint) {
        // This algorithm may be called with an ending code point, which denotes the code point
        // that ends the string. If an ending code point is not specified,
        // the current input code point is used.
        if (!endingCodePoint) {
            endingCodePoint = getCharCode(offset++);
        }

        // Initially create a <string-token> with its value set to the empty string.
        type = TYPE.String;

        // Repeatedly consume the next input code point from the stream:
        for (; offset < source.length; offset++) {
            var code = source.charCodeAt(offset);

            switch (charCodeCategory(code)) {
                // ending code point
                case endingCodePoint:
                    // Return the <string-token>.
                    offset++;
                    return;

                // EOF
                case charCodeCategory.Eof:
                    // This is a parse error. Return the <string-token>.
                    return;

                // newline
                case charCodeCategory.WhiteSpace:
                    if (isNewline(code)) {
                        // This is a parse error. Reconsume the current input code point,
                        // create a <bad-string-token>, and return it.
                        offset += getNewlineLength(source, offset, code);
                        type = TYPE.BadString;
                        return;
                    }
                    break;

                // U+005C REVERSE SOLIDUS (\)
                case 0x005C:
                    // If the next input code point is EOF, do nothing.
                    if (offset === source.length - 1) {
                        break;
                    }

                    var nextCode = getCharCode(offset + 1);

                    // Otherwise, if the next input code point is a newline, consume it.
                    if (isNewline(nextCode)) {
                        offset += getNewlineLength(source, offset + 1, nextCode);
                    } else if (isValidEscape(code, nextCode)) {
                        // Otherwise, (the stream starts with a valid escape) consume
                        // an escaped code point and append the returned code point to
                        // the <string-token>’s value.
                        offset = consumeEscaped(source, offset) - 1;
                    }
                    break;

                // anything else
                // Append the current input code point to the <string-token>’s value.
            }
        }
    }

    // § 4.3.6. Consume a url token
    // Note: This algorithm assumes that the initial "url(" has already been consumed.
    // This algorithm also assumes that it’s being called to consume an "unquoted" value, like url(foo).
    // A quoted value, like url("foo"), is parsed as a <function-token>. Consume an ident-like token
    // automatically handles this distinction; this algorithm shouldn’t be called directly otherwise.
    function consumeUrlToken() {
        // Initially create a <url-token> with its value set to the empty string.
        type = TYPE.Url;

        // Consume as much whitespace as possible.
        offset = findWhiteSpaceEnd(source, offset);

        // Repeatedly consume the next input code point from the stream:
        for (; offset < source.length; offset++) {
            var code = source.charCodeAt(offset);

            switch (charCodeCategory(code)) {
                // U+0029 RIGHT PARENTHESIS ())
                case 0x0029:
                    // Return the <url-token>.
                    offset++;
                    return;

                // EOF
                case charCodeCategory.Eof:
                    // This is a parse error. Return the <url-token>.
                    return;

                // whitespace
                case charCodeCategory.WhiteSpace:
                    // Consume as much whitespace as possible.
                    offset = findWhiteSpaceEnd(source, offset);

                    // If the next input code point is U+0029 RIGHT PARENTHESIS ()) or EOF,
                    // consume it and return the <url-token>
                    // (if EOF was encountered, this is a parse error);
                    if (getCharCode(offset) === 0x0029 || offset >= source.length) {
                        if (offset < source.length) {
                            offset++;
                        }
                        return;
                    }

                    // otherwise, consume the remnants of a bad url, create a <bad-url-token>,
                    // and return it.
                    offset = consumeBadUrlRemnants(source, offset);
                    type = TYPE.BadUrl;
                    return;

                // U+0022 QUOTATION MARK (")
                // U+0027 APOSTROPHE (')
                // U+0028 LEFT PARENTHESIS (()
                // non-printable code point
                case 0x0022:
                case 0x0027:
                case 0x0028:
                case charCodeCategory.NonPrintable:
                    // This is a parse error. Consume the remnants of a bad url,
                    // create a <bad-url-token>, and return it.
                    offset = consumeBadUrlRemnants(source, offset);
                    type = TYPE.BadUrl;
                    return;

                // U+005C REVERSE SOLIDUS (\)
                case 0x005C:
                    // If the stream starts with a valid escape, consume an escaped code point and
                    // append the returned code point to the <url-token>’s value.
                    if (isValidEscape(code, getCharCode(offset + 1))) {
                        offset = consumeEscaped(source, offset) - 1;
                        break;
                    }

                    // Otherwise, this is a parse error. Consume the remnants of a bad url,
                    // create a <bad-url-token>, and return it.
                    offset = consumeBadUrlRemnants(source, offset);
                    type = TYPE.BadUrl;
                    return;

                // anything else
                // Append the current input code point to the <url-token>’s value.
            }
        }
    }

    if (!stream) {
        stream = new TokenStream();
    }

    // ensure source is a string
    source = String(source || '');

    var sourceLength = source.length;
    var offsetAndType = adoptBuffer(stream.offsetAndType, sourceLength + 1); // +1 because of eof-token
    var balance = adoptBuffer(stream.balance, sourceLength + 1);
    var tokenCount = 0;
    var start = isBOM(getCharCode(0));
    var offset = start;
    var balanceCloseType = 0;
    var balanceStart = 0;
    var balancePrev = 0;

    // https://drafts.csswg.org/css-syntax-3/#consume-token
    // § 4.3.1. Consume a token
    while (offset < sourceLength) {
        var code = source.charCodeAt(offset);
        var type = 0;

        balance[tokenCount] = sourceLength;

        switch (charCodeCategory(code)) {
            // whitespace
            case charCodeCategory.WhiteSpace:
                // Consume as much whitespace as possible. Return a <whitespace-token>.
                type = TYPE.WhiteSpace;
                offset = findWhiteSpaceEnd(source, offset + 1);
                break;

            // U+0022 QUOTATION MARK (")
            case 0x0022:
                // Consume a string token and return it.
                consumeStringToken();
                break;

            // U+0023 NUMBER SIGN (#)
            case 0x0023:
                // If the next input code point is a name code point or the next two input code points are a valid escape, then:
                if (isName(getCharCode(offset + 1)) || isValidEscape(getCharCode(offset + 1), getCharCode(offset + 2))) {
                    // Create a <hash-token>.
                    type = TYPE.Hash;

                    // If the next 3 input code points would start an identifier, set the <hash-token>’s type flag to "id".
                    // if (isIdentifierStart(getCharCode(offset + 1), getCharCode(offset + 2), getCharCode(offset + 3))) {
                    //     // TODO: set id flag
                    // }

                    // Consume a name, and set the <hash-token>’s value to the returned string.
                    offset = consumeName(source, offset + 1);

                    // Return the <hash-token>.
                } else {
                    // Otherwise, return a <delim-token> with its value set to the current input code point.
                    type = TYPE.Delim;
                    offset++;
                }

                break;

            // U+0027 APOSTROPHE (')
            case 0x0027:
                // Consume a string token and return it.
                consumeStringToken();
                break;

            // U+0028 LEFT PARENTHESIS (()
            case 0x0028:
                // Return a <(-token>.
                type = TYPE.LeftParenthesis;
                offset++;
                break;

            // U+0029 RIGHT PARENTHESIS ())
            case 0x0029:
                // Return a <)-token>.
                type = TYPE.RightParenthesis;
                offset++;
                break;

            // U+002B PLUS SIGN (+)
            case 0x002B:
                // If the input stream starts with a number, ...
                if (isNumberStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
                    // ... reconsume the current input code point, consume a numeric token, and return it.
                    consumeNumericToken();
                } else {
                    // Otherwise, return a <delim-token> with its value set to the current input code point.
                    type = TYPE.Delim;
                    offset++;
                }
                break;

            // U+002C COMMA (,)
            case 0x002C:
                // Return a <comma-token>.
                type = TYPE.Comma;
                offset++;
                break;

            // U+002D HYPHEN-MINUS (-)
            case 0x002D:
                // If the input stream starts with a number, reconsume the current input code point, consume a numeric token, and return it.
                if (isNumberStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
                    consumeNumericToken();
                } else {
                    // Otherwise, if the next 2 input code points are U+002D HYPHEN-MINUS U+003E GREATER-THAN SIGN (->), consume them and return a <CDC-token>.
                    if (getCharCode(offset + 1) === 0x002D &&
                        getCharCode(offset + 2) === 0x003E) {
                        type = TYPE.CDC;
                        offset = offset + 3;
                    } else {
                        // Otherwise, if the input stream starts with an identifier, ...
                        if (isIdentifierStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
                            // ... reconsume the current input code point, consume an ident-like token, and return it.
                            consumeIdentLikeToken();
                        } else {
                            // Otherwise, return a <delim-token> with its value set to the current input code point.
                            type = TYPE.Delim;
                            offset++;
                        }
                    }
                }
                break;

            // U+002E FULL STOP (.)
            case 0x002E:
                // If the input stream starts with a number, ...
                if (isNumberStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
                    // ... reconsume the current input code point, consume a numeric token, and return it.
                    consumeNumericToken();
                } else {
                    // Otherwise, return a <delim-token> with its value set to the current input code point.
                    type = TYPE.Delim;
                    offset++;
                }

                break;

            // U+002F SOLIDUS (/)
            case 0x002F:
                // If the next two input code point are U+002F SOLIDUS (/) followed by a U+002A ASTERISK (*),
                if (getCharCode(offset + 1) === 0x002A) {
                    // ... consume them and all following code points up to and including the first U+002A ASTERISK (*)
                    // followed by a U+002F SOLIDUS (/), or up to an EOF code point.
                    type = TYPE.Comment;
                    offset = source.indexOf('*/', offset + 2) + 2;
                    if (offset === 1) {
                        offset = source.length;
                    }
                } else {
                    type = TYPE.Delim;
                    offset++;
                }
                break;

            // U+003A COLON (:)
            case 0x003A:
                // Return a <colon-token>.
                type = TYPE.Colon;
                offset++;
                break;

            // U+003B SEMICOLON (;)
            case 0x003B:
                // Return a <semicolon-token>.
                type = TYPE.Semicolon;
                offset++;
                break;

            // U+003C LESS-THAN SIGN (<)
            case 0x003C:
                // If the next 3 input code points are U+0021 EXCLAMATION MARK U+002D HYPHEN-MINUS U+002D HYPHEN-MINUS (!--), ...
                if (getCharCode(offset + 1) === 0x0021 &&
                    getCharCode(offset + 2) === 0x002D &&
                    getCharCode(offset + 3) === 0x002D) {
                    // ... consume them and return a <CDO-token>.
                    type = TYPE.CDO;
                    offset = offset + 4;
                } else {
                    // Otherwise, return a <delim-token> with its value set to the current input code point.
                    type = TYPE.Delim;
                    offset++;
                }

                break;

            // U+0040 COMMERCIAL AT (@)
            case 0x0040:
                // If the next 3 input code points would start an identifier, ...
                if (isIdentifierStart(getCharCode(offset + 1), getCharCode(offset + 2), getCharCode(offset + 3))) {
                    // ... consume a name, create an <at-keyword-token> with its value set to the returned value, and return it.
                    type = TYPE.AtKeyword;
                    offset = consumeName(source, offset + 1);
                } else {
                    // Otherwise, return a <delim-token> with its value set to the current input code point.
                    type = TYPE.Delim;
                    offset++;
                }

                break;

            // U+005B LEFT SQUARE BRACKET ([)
            case 0x005B:
                // Return a <[-token>.
                type = TYPE.LeftSquareBracket;
                offset++;
                break;

            // U+005C REVERSE SOLIDUS (\)
            case 0x005C:
                // If the input stream starts with a valid escape, ...
                if (isValidEscape(code, getCharCode(offset + 1))) {
                    // ... reconsume the current input code point, consume an ident-like token, and return it.
                    consumeIdentLikeToken();
                } else {
                    // Otherwise, this is a parse error. Return a <delim-token> with its value set to the current input code point.
                    type = TYPE.Delim;
                    offset++;
                }
                break;

            // U+005D RIGHT SQUARE BRACKET (])
            case 0x005D:
                // Return a <]-token>.
                type = TYPE.RightSquareBracket;
                offset++;
                break;

            // U+007B LEFT CURLY BRACKET ({)
            case 0x007B:
                // Return a <{-token>.
                type = TYPE.LeftCurlyBracket;
                offset++;
                break;

            // U+007D RIGHT CURLY BRACKET (})
            case 0x007D:
                // Return a <}-token>.
                type = TYPE.RightCurlyBracket;
                offset++;
                break;

            // digit
            case charCodeCategory.Digit:
                // Reconsume the current input code point, consume a numeric token, and return it.
                consumeNumericToken();
                break;

            // name-start code point
            case charCodeCategory.NameStart:
                // Reconsume the current input code point, consume an ident-like token, and return it.
                consumeIdentLikeToken();
                break;

            // EOF
            case charCodeCategory.Eof:
                // Return an <EOF-token>.
                break;

            // anything else
            default:
                // Return a <delim-token> with its value set to the current input code point.
                type = TYPE.Delim;
                offset++;
        }

        switch (type) {
            case balanceCloseType:
                balancePrev = balanceStart & OFFSET_MASK;
                balanceStart = balance[balancePrev];
                balanceCloseType = balanceStart >> TYPE_SHIFT;
                balance[tokenCount] = balancePrev;
                balance[balancePrev++] = tokenCount;
                for (; balancePrev < tokenCount; balancePrev++) {
                    if (balance[balancePrev] === sourceLength) {
                        balance[balancePrev] = tokenCount;
                    }
                }
                break;

            case TYPE.LeftParenthesis:
            case TYPE.Function:
                balance[tokenCount] = balanceStart;
                balanceCloseType = TYPE.RightParenthesis;
                balanceStart = (balanceCloseType << TYPE_SHIFT) | tokenCount;
                break;

            case TYPE.LeftSquareBracket:
                balance[tokenCount] = balanceStart;
                balanceCloseType = TYPE.RightSquareBracket;
                balanceStart = (balanceCloseType << TYPE_SHIFT) | tokenCount;
                break;

            case TYPE.LeftCurlyBracket:
                balance[tokenCount] = balanceStart;
                balanceCloseType = TYPE.RightCurlyBracket;
                balanceStart = (balanceCloseType << TYPE_SHIFT) | tokenCount;
                break;
        }

        offsetAndType[tokenCount++] = (type << TYPE_SHIFT) | offset;
    }

    // finalize buffers
    offsetAndType[tokenCount] = (TYPE.EOF << TYPE_SHIFT) | offset; // <EOF-token>
    balance[tokenCount] = sourceLength;
    balance[sourceLength] = sourceLength; // prevents false positive balance match with any token
    while (balanceStart !== 0) {
        balancePrev = balanceStart & OFFSET_MASK;
        balanceStart = balance[balancePrev];
        balance[balancePrev] = sourceLength;
    }

    // update stream
    stream.source = source;
    stream.firstCharOffset = start;
    stream.offsetAndType = offsetAndType;
    stream.tokenCount = tokenCount;
    stream.balance = balance;
    stream.reset();
    stream.next();

    return stream;
}

// extend tokenizer with constants
Object.keys(constants).forEach(function(key) {
    tokenize[key] = constants[key];
});

// extend tokenizer with static methods from utils
Object.keys(charCodeDefinitions).forEach(function(key) {
    tokenize[key] = charCodeDefinitions[key];
});
Object.keys(utils).forEach(function(key) {
    tokenize[key] = utils[key];
});

module.exports = tokenize;

}, function(modId) { var map = {"../common/TokenStream":1597942294277,"../common/adopt-buffer":1597942294287,"./const":1597942294278,"./char-code-definitions":1597942294280,"./utils":1597942294279}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294287, function(require, module, exports) {
var MIN_SIZE = 16 * 1024;
var SafeUint32Array = typeof Uint32Array !== 'undefined' ? Uint32Array : Array; // fallback on Array when TypedArray is not supported

module.exports = function adoptBuffer(buffer, size) {
    if (buffer === null || buffer.length < size) {
        return new SafeUint32Array(Math.max(size + 1024, MIN_SIZE));
    }

    return buffer;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294288, function(require, module, exports) {
var isDigit = require('../tokenizer').isDigit;
var cmpChar = require('../tokenizer').cmpChar;
var TYPE = require('../tokenizer').TYPE;

var DELIM = TYPE.Delim;
var WHITESPACE = TYPE.WhiteSpace;
var COMMENT = TYPE.Comment;
var IDENT = TYPE.Ident;
var NUMBER = TYPE.Number;
var DIMENSION = TYPE.Dimension;
var PLUSSIGN = 0x002B;    // U+002B PLUS SIGN (+)
var HYPHENMINUS = 0x002D; // U+002D HYPHEN-MINUS (-)
var N = 0x006E;           // U+006E LATIN SMALL LETTER N (n)
var DISALLOW_SIGN = true;
var ALLOW_SIGN = false;

function isDelim(token, code) {
    return token !== null && token.type === DELIM && token.value.charCodeAt(0) === code;
}

function skipSC(token, offset, getNextToken) {
    while (token !== null && (token.type === WHITESPACE || token.type === COMMENT)) {
        token = getNextToken(++offset);
    }

    return offset;
}

function checkInteger(token, valueOffset, disallowSign, offset) {
    if (!token) {
        return 0;
    }

    var code = token.value.charCodeAt(valueOffset);

    if (code === PLUSSIGN || code === HYPHENMINUS) {
        if (disallowSign) {
            // Number sign is not allowed
            return 0;
        }
        valueOffset++;
    }

    for (; valueOffset < token.value.length; valueOffset++) {
        if (!isDigit(token.value.charCodeAt(valueOffset))) {
            // Integer is expected
            return 0;
        }
    }

    return offset + 1;
}

// ... <signed-integer>
// ... ['+' | '-'] <signless-integer>
function consumeB(token, offset_, getNextToken) {
    var sign = false;
    var offset = skipSC(token, offset_, getNextToken);

    token = getNextToken(offset);

    if (token === null) {
        return offset_;
    }

    if (token.type !== NUMBER) {
        if (isDelim(token, PLUSSIGN) || isDelim(token, HYPHENMINUS)) {
            sign = true;
            offset = skipSC(getNextToken(++offset), offset, getNextToken);
            token = getNextToken(offset);

            if (token === null && token.type !== NUMBER) {
                return 0;
            }
        } else {
            return offset_;
        }
    }

    if (!sign) {
        var code = token.value.charCodeAt(0);
        if (code !== PLUSSIGN && code !== HYPHENMINUS) {
            // Number sign is expected
            return 0;
        }
    }

    return checkInteger(token, sign ? 0 : 1, sign, offset);
}

// An+B microsyntax https://www.w3.org/TR/css-syntax-3/#anb
module.exports = function anPlusB(token, getNextToken) {
    /* eslint-disable brace-style*/
    var offset = 0;

    if (!token) {
        return 0;
    }

    // <integer>
    if (token.type === NUMBER) {
        return checkInteger(token, 0, ALLOW_SIGN, offset); // b
    }

    // -n
    // -n <signed-integer>
    // -n ['+' | '-'] <signless-integer>
    // -n- <signless-integer>
    // <dashndashdigit-ident>
    else if (token.type === IDENT && token.value.charCodeAt(0) === HYPHENMINUS) {
        // expect 1st char is N
        if (!cmpChar(token.value, 1, N)) {
            return 0;
        }

        switch (token.value.length) {
            // -n
            // -n <signed-integer>
            // -n ['+' | '-'] <signless-integer>
            case 2:
                return consumeB(getNextToken(++offset), offset, getNextToken);

            // -n- <signless-integer>
            case 3:
                if (token.value.charCodeAt(2) !== HYPHENMINUS) {
                    return 0;
                }

                offset = skipSC(getNextToken(++offset), offset, getNextToken);
                token = getNextToken(offset);

                return checkInteger(token, 0, DISALLOW_SIGN, offset);

            // <dashndashdigit-ident>
            default:
                if (token.value.charCodeAt(2) !== HYPHENMINUS) {
                    return 0;
                }

                return checkInteger(token, 3, DISALLOW_SIGN, offset);
        }
    }

    // '+'? n
    // '+'? n <signed-integer>
    // '+'? n ['+' | '-'] <signless-integer>
    // '+'? n- <signless-integer>
    // '+'? <ndashdigit-ident>
    else if (token.type === IDENT || (isDelim(token, PLUSSIGN) && getNextToken(offset + 1).type === IDENT)) {
        // just ignore a plus
        if (token.type !== IDENT) {
            token = getNextToken(++offset);
        }

        if (token === null || !cmpChar(token.value, 0, N)) {
            return 0;
        }

        switch (token.value.length) {
            // '+'? n
            // '+'? n <signed-integer>
            // '+'? n ['+' | '-'] <signless-integer>
            case 1:
                return consumeB(getNextToken(++offset), offset, getNextToken);

            // '+'? n- <signless-integer>
            case 2:
                if (token.value.charCodeAt(1) !== HYPHENMINUS) {
                    return 0;
                }

                offset = skipSC(getNextToken(++offset), offset, getNextToken);
                token = getNextToken(offset);

                return checkInteger(token, 0, DISALLOW_SIGN, offset);

            // '+'? <ndashdigit-ident>
            default:
                if (token.value.charCodeAt(1) !== HYPHENMINUS) {
                    return 0;
                }

                return checkInteger(token, 2, DISALLOW_SIGN, offset);
        }
    }

    // <ndashdigit-dimension>
    // <ndash-dimension> <signless-integer>
    // <n-dimension>
    // <n-dimension> <signed-integer>
    // <n-dimension> ['+' | '-'] <signless-integer>
    else if (token.type === DIMENSION) {
        var code = token.value.charCodeAt(0);
        var sign = code === PLUSSIGN || code === HYPHENMINUS ? 1 : 0;

        for (var i = sign; i < token.value.length; i++) {
            if (!isDigit(token.value.charCodeAt(i))) {
                break;
            }
        }

        if (i === sign) {
            // Integer is expected
            return 0;
        }

        if (!cmpChar(token.value, i, N)) {
            return 0;
        }

        // <n-dimension>
        // <n-dimension> <signed-integer>
        // <n-dimension> ['+' | '-'] <signless-integer>
        if (i + 1 === token.value.length) {
            return consumeB(getNextToken(++offset), offset, getNextToken);
        } else {
            if (token.value.charCodeAt(i + 1) !== HYPHENMINUS) {
                return 0;
            }

            // <ndash-dimension> <signless-integer>
            if (i + 2 === token.value.length) {
                offset = skipSC(getNextToken(++offset), offset, getNextToken);
                token = getNextToken(offset);

                return checkInteger(token, 0, DISALLOW_SIGN, offset);
            }
            // <ndashdigit-dimension>
            else {
                return checkInteger(token, i + 2, DISALLOW_SIGN, offset);
            }
        }
    }

    return 0;
};

}, function(modId) { var map = {"../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294289, function(require, module, exports) {
var isHexDigit = require('../tokenizer').isHexDigit;
var cmpChar = require('../tokenizer').cmpChar;
var TYPE = require('../tokenizer').TYPE;

var IDENT = TYPE.Ident;
var DELIM = TYPE.Delim;
var NUMBER = TYPE.Number;
var DIMENSION = TYPE.Dimension;
var PLUSSIGN = 0x002B;     // U+002B PLUS SIGN (+)
var HYPHENMINUS = 0x002D;  // U+002D HYPHEN-MINUS (-)
var QUESTIONMARK = 0x003F; // U+003F QUESTION MARK (?)
var U = 0x0075;            // U+0075 LATIN SMALL LETTER U (u)

function isDelim(token, code) {
    return token !== null && token.type === DELIM && token.value.charCodeAt(0) === code;
}

function startsWith(token, code) {
    return token.value.charCodeAt(0) === code;
}

function hexSequence(token, offset, allowDash) {
    for (var pos = offset, hexlen = 0; pos < token.value.length; pos++) {
        var code = token.value.charCodeAt(pos);

        if (code === HYPHENMINUS && allowDash && hexlen !== 0) {
            if (hexSequence(token, offset + hexlen + 1, false) > 0) {
                return 6; // dissallow following question marks
            }

            return 0; // dash at the ending of a hex sequence is not allowed
        }

        if (!isHexDigit(code)) {
            return 0; // not a hex digit
        }

        if (++hexlen > 6) {
            return 0; // too many hex digits
        };
    }

    return hexlen;
}

function withQuestionMarkSequence(consumed, length, getNextToken) {
    if (!consumed) {
        return 0; // nothing consumed
    }

    while (isDelim(getNextToken(length), QUESTIONMARK)) {
        if (++consumed > 6) {
            return 0; // too many question marks
        }

        length++;
    }

    return length;
}

// https://drafts.csswg.org/css-syntax/#urange
// Informally, the <urange> production has three forms:
// U+0001
//      Defines a range consisting of a single code point, in this case the code point "1".
// U+0001-00ff
//      Defines a range of codepoints between the first and the second value, in this case
//      the range between "1" and "ff" (255 in decimal) inclusive.
// U+00??
//      Defines a range of codepoints where the "?" characters range over all hex digits,
//      in this case defining the same as the value U+0000-00ff.
// In each form, a maximum of 6 digits is allowed for each hexadecimal number (if you treat "?" as a hexadecimal digit).
//
// <urange> =
//   u '+' <ident-token> '?'* |
//   u <dimension-token> '?'* |
//   u <number-token> '?'* |
//   u <number-token> <dimension-token> |
//   u <number-token> <number-token> |
//   u '+' '?'+
module.exports = function urange(token, getNextToken) {
    var length = 0;

    // should start with `u` or `U`
    if (token === null || token.type !== IDENT || !cmpChar(token.value, 0, U)) {
        return 0;
    }

    token = getNextToken(++length);
    if (token === null) {
        return 0;
    }

    // u '+' <ident-token> '?'*
    // u '+' '?'+
    if (isDelim(token, PLUSSIGN)) {
        token = getNextToken(++length);
        if (token === null) {
            return 0;
        }

        if (token.type === IDENT) {
            // u '+' <ident-token> '?'*
            return withQuestionMarkSequence(hexSequence(token, 0, true), ++length, getNextToken);
        }

        if (isDelim(token, QUESTIONMARK)) {
            // u '+' '?'+
            return withQuestionMarkSequence(1, ++length, getNextToken);
        }

        // Hex digit or question mark is expected
        return 0;
    }

    // u <number-token> '?'*
    // u <number-token> <dimension-token>
    // u <number-token> <number-token>
    if (token.type === NUMBER) {
        if (!startsWith(token, PLUSSIGN)) {
            return 0;
        }

        var consumedHexLength = hexSequence(token, 1, true);
        if (consumedHexLength === 0) {
            return 0;
        }

        token = getNextToken(++length);
        if (token === null) {
            // u <number-token> <eof>
            return length;
        }

        if (token.type === DIMENSION || token.type === NUMBER) {
            // u <number-token> <dimension-token>
            // u <number-token> <number-token>
            if (!startsWith(token, HYPHENMINUS) || !hexSequence(token, 1, false)) {
                return 0;
            }

            return length + 1;
        }

        // u <number-token> '?'*
        return withQuestionMarkSequence(consumedHexLength, length, getNextToken);
    }

    // u <dimension-token> '?'*
    if (token.type === DIMENSION) {
        if (!startsWith(token, PLUSSIGN)) {
            return 0;
        }

        return withQuestionMarkSequence(hexSequence(token, 1, true), ++length, getNextToken);
    }

    return 0;
};

}, function(modId) { var map = {"../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294290, function(require, module, exports) {
var Tokenizer = require('./tokenizer');
var TAB = 9;
var N = 10;
var F = 12;
var R = 13;
var SPACE = 32;
var EXCLAMATIONMARK = 33;    // !
var NUMBERSIGN = 35;         // #
var AMPERSAND = 38;          // &
var APOSTROPHE = 39;         // '
var LEFTPARENTHESIS = 40;    // (
var RIGHTPARENTHESIS = 41;   // )
var ASTERISK = 42;           // *
var PLUSSIGN = 43;           // +
var COMMA = 44;              // ,
var HYPERMINUS = 45;         // -
var LESSTHANSIGN = 60;       // <
var GREATERTHANSIGN = 62;    // >
var QUESTIONMARK = 63;       // ?
var COMMERCIALAT = 64;       // @
var LEFTSQUAREBRACKET = 91;  // [
var RIGHTSQUAREBRACKET = 93; // ]
var LEFTCURLYBRACKET = 123;  // {
var VERTICALLINE = 124;      // |
var RIGHTCURLYBRACKET = 125; // }
var INFINITY = 8734;         // ∞
var NAME_CHAR = createCharMap(function(ch) {
    return /[a-zA-Z0-9\-]/.test(ch);
});
var COMBINATOR_PRECEDENCE = {
    ' ': 1,
    '&&': 2,
    '||': 3,
    '|': 4
};

function createCharMap(fn) {
    var array = typeof Uint32Array === 'function' ? new Uint32Array(128) : new Array(128);
    for (var i = 0; i < 128; i++) {
        array[i] = fn(String.fromCharCode(i)) ? 1 : 0;
    }
    return array;
}

function scanSpaces(tokenizer) {
    return tokenizer.substringToPos(
        tokenizer.findWsEnd(tokenizer.pos)
    );
}

function scanWord(tokenizer) {
    var end = tokenizer.pos;

    for (; end < tokenizer.str.length; end++) {
        var code = tokenizer.str.charCodeAt(end);
        if (code >= 128 || NAME_CHAR[code] === 0) {
            break;
        }
    }

    if (tokenizer.pos === end) {
        tokenizer.error('Expect a keyword');
    }

    return tokenizer.substringToPos(end);
}

function scanNumber(tokenizer) {
    var end = tokenizer.pos;

    for (; end < tokenizer.str.length; end++) {
        var code = tokenizer.str.charCodeAt(end);
        if (code < 48 || code > 57) {
            break;
        }
    }

    if (tokenizer.pos === end) {
        tokenizer.error('Expect a number');
    }

    return tokenizer.substringToPos(end);
}

function scanString(tokenizer) {
    var end = tokenizer.str.indexOf('\'', tokenizer.pos + 1);

    if (end === -1) {
        tokenizer.pos = tokenizer.str.length;
        tokenizer.error('Expect an apostrophe');
    }

    return tokenizer.substringToPos(end + 1);
}

function readMultiplierRange(tokenizer) {
    var min = null;
    var max = null;

    tokenizer.eat(LEFTCURLYBRACKET);

    min = scanNumber(tokenizer);

    if (tokenizer.charCode() === COMMA) {
        tokenizer.pos++;
        if (tokenizer.charCode() !== RIGHTCURLYBRACKET) {
            max = scanNumber(tokenizer);
        }
    } else {
        max = min;
    }

    tokenizer.eat(RIGHTCURLYBRACKET);

    return {
        min: Number(min),
        max: max ? Number(max) : 0
    };
}

function readMultiplier(tokenizer) {
    var range = null;
    var comma = false;

    switch (tokenizer.charCode()) {
        case ASTERISK:
            tokenizer.pos++;

            range = {
                min: 0,
                max: 0
            };

            break;

        case PLUSSIGN:
            tokenizer.pos++;

            range = {
                min: 1,
                max: 0
            };

            break;

        case QUESTIONMARK:
            tokenizer.pos++;

            range = {
                min: 0,
                max: 1
            };

            break;

        case NUMBERSIGN:
            tokenizer.pos++;

            comma = true;

            if (tokenizer.charCode() === LEFTCURLYBRACKET) {
                range = readMultiplierRange(tokenizer);
            } else {
                range = {
                    min: 1,
                    max: 0
                };
            }

            break;

        case LEFTCURLYBRACKET:
            range = readMultiplierRange(tokenizer);
            break;

        default:
            return null;
    }

    return {
        type: 'Multiplier',
        comma: comma,
        min: range.min,
        max: range.max,
        term: null
    };
}

function maybeMultiplied(tokenizer, node) {
    var multiplier = readMultiplier(tokenizer);

    if (multiplier !== null) {
        multiplier.term = node;
        return multiplier;
    }

    return node;
}

function maybeToken(tokenizer) {
    var ch = tokenizer.peek();

    if (ch === '') {
        return null;
    }

    return {
        type: 'Token',
        value: ch
    };
}

function readProperty(tokenizer) {
    var name;

    tokenizer.eat(LESSTHANSIGN);
    tokenizer.eat(APOSTROPHE);

    name = scanWord(tokenizer);

    tokenizer.eat(APOSTROPHE);
    tokenizer.eat(GREATERTHANSIGN);

    return maybeMultiplied(tokenizer, {
        type: 'Property',
        name: name
    });
}

// https://drafts.csswg.org/css-values-3/#numeric-ranges
// 4.1. Range Restrictions and Range Definition Notation
//
// Range restrictions can be annotated in the numeric type notation using CSS bracketed
// range notation—[min,max]—within the angle brackets, after the identifying keyword,
// indicating a closed range between (and including) min and max.
// For example, <integer [0, 10]> indicates an integer between 0 and 10, inclusive.
function readTypeRange(tokenizer) {
    // use null for Infinity to make AST format JSON serializable/deserializable
    var min = null; // -Infinity
    var max = null; // Infinity
    var sign = 1;

    tokenizer.eat(LEFTSQUAREBRACKET);

    if (tokenizer.charCode() === HYPERMINUS) {
        tokenizer.peek();
        sign = -1;
    }

    if (sign == -1 && tokenizer.charCode() === INFINITY) {
        tokenizer.peek();
    } else {
        min = sign * Number(scanNumber(tokenizer));
    }

    scanSpaces(tokenizer);
    tokenizer.eat(COMMA);
    scanSpaces(tokenizer);

    if (tokenizer.charCode() === INFINITY) {
        tokenizer.peek();
    } else {
        sign = 1;

        if (tokenizer.charCode() === HYPERMINUS) {
            tokenizer.peek();
            sign = -1;
        }

        max = sign * Number(scanNumber(tokenizer));
    }

    tokenizer.eat(RIGHTSQUAREBRACKET);

    // If no range is indicated, either by using the bracketed range notation
    // or in the property description, then [−∞,∞] is assumed.
    if (min === null && max === null) {
        return null;
    }

    return {
        type: 'Range',
        min: min,
        max: max
    };
}

function readType(tokenizer) {
    var name;
    var opts = null;

    tokenizer.eat(LESSTHANSIGN);
    name = scanWord(tokenizer);

    if (tokenizer.charCode() === LEFTPARENTHESIS &&
        tokenizer.nextCharCode() === RIGHTPARENTHESIS) {
        tokenizer.pos += 2;
        name += '()';
    }

    if (tokenizer.charCodeAt(tokenizer.findWsEnd(tokenizer.pos)) === LEFTSQUAREBRACKET) {
        scanSpaces(tokenizer);
        opts = readTypeRange(tokenizer);
    }

    tokenizer.eat(GREATERTHANSIGN);

    return maybeMultiplied(tokenizer, {
        type: 'Type',
        name: name,
        opts: opts
    });
}

function readKeywordOrFunction(tokenizer) {
    var name;

    name = scanWord(tokenizer);

    if (tokenizer.charCode() === LEFTPARENTHESIS) {
        tokenizer.pos++;

        return {
            type: 'Function',
            name: name
        };
    }

    return maybeMultiplied(tokenizer, {
        type: 'Keyword',
        name: name
    });
}

function regroupTerms(terms, combinators) {
    function createGroup(terms, combinator) {
        return {
            type: 'Group',
            terms: terms,
            combinator: combinator,
            disallowEmpty: false,
            explicit: false
        };
    }

    combinators = Object.keys(combinators).sort(function(a, b) {
        return COMBINATOR_PRECEDENCE[a] - COMBINATOR_PRECEDENCE[b];
    });

    while (combinators.length > 0) {
        var combinator = combinators.shift();
        for (var i = 0, subgroupStart = 0; i < terms.length; i++) {
            var term = terms[i];
            if (term.type === 'Combinator') {
                if (term.value === combinator) {
                    if (subgroupStart === -1) {
                        subgroupStart = i - 1;
                    }
                    terms.splice(i, 1);
                    i--;
                } else {
                    if (subgroupStart !== -1 && i - subgroupStart > 1) {
                        terms.splice(
                            subgroupStart,
                            i - subgroupStart,
                            createGroup(terms.slice(subgroupStart, i), combinator)
                        );
                        i = subgroupStart + 1;
                    }
                    subgroupStart = -1;
                }
            }
        }

        if (subgroupStart !== -1 && combinators.length) {
            terms.splice(
                subgroupStart,
                i - subgroupStart,
                createGroup(terms.slice(subgroupStart, i), combinator)
            );
        }
    }

    return combinator;
}

function readImplicitGroup(tokenizer) {
    var terms = [];
    var combinators = {};
    var token;
    var prevToken = null;
    var prevTokenPos = tokenizer.pos;

    while (token = peek(tokenizer)) {
        if (token.type !== 'Spaces') {
            if (token.type === 'Combinator') {
                // check for combinator in group beginning and double combinator sequence
                if (prevToken === null || prevToken.type === 'Combinator') {
                    tokenizer.pos = prevTokenPos;
                    tokenizer.error('Unexpected combinator');
                }

                combinators[token.value] = true;
            } else if (prevToken !== null && prevToken.type !== 'Combinator') {
                combinators[' '] = true;  // a b
                terms.push({
                    type: 'Combinator',
                    value: ' '
                });
            }

            terms.push(token);
            prevToken = token;
            prevTokenPos = tokenizer.pos;
        }
    }

    // check for combinator in group ending
    if (prevToken !== null && prevToken.type === 'Combinator') {
        tokenizer.pos -= prevTokenPos;
        tokenizer.error('Unexpected combinator');
    }

    return {
        type: 'Group',
        terms: terms,
        combinator: regroupTerms(terms, combinators) || ' ',
        disallowEmpty: false,
        explicit: false
    };
}

function readGroup(tokenizer) {
    var result;

    tokenizer.eat(LEFTSQUAREBRACKET);
    result = readImplicitGroup(tokenizer);
    tokenizer.eat(RIGHTSQUAREBRACKET);

    result.explicit = true;

    if (tokenizer.charCode() === EXCLAMATIONMARK) {
        tokenizer.pos++;
        result.disallowEmpty = true;
    }

    return result;
}

function peek(tokenizer) {
    var code = tokenizer.charCode();

    if (code < 128 && NAME_CHAR[code] === 1) {
        return readKeywordOrFunction(tokenizer);
    }

    switch (code) {
        case RIGHTSQUAREBRACKET:
            // don't eat, stop scan a group
            break;

        case LEFTSQUAREBRACKET:
            return maybeMultiplied(tokenizer, readGroup(tokenizer));

        case LESSTHANSIGN:
            return tokenizer.nextCharCode() === APOSTROPHE
                ? readProperty(tokenizer)
                : readType(tokenizer);

        case VERTICALLINE:
            return {
                type: 'Combinator',
                value: tokenizer.substringToPos(
                    tokenizer.nextCharCode() === VERTICALLINE
                        ? tokenizer.pos + 2
                        : tokenizer.pos + 1
                )
            };

        case AMPERSAND:
            tokenizer.pos++;
            tokenizer.eat(AMPERSAND);

            return {
                type: 'Combinator',
                value: '&&'
            };

        case COMMA:
            tokenizer.pos++;
            return {
                type: 'Comma'
            };

        case APOSTROPHE:
            return maybeMultiplied(tokenizer, {
                type: 'String',
                value: scanString(tokenizer)
            });

        case SPACE:
        case TAB:
        case N:
        case R:
        case F:
            return {
                type: 'Spaces',
                value: scanSpaces(tokenizer)
            };

        case COMMERCIALAT:
            code = tokenizer.nextCharCode();

            if (code < 128 && NAME_CHAR[code] === 1) {
                tokenizer.pos++;
                return {
                    type: 'AtKeyword',
                    name: scanWord(tokenizer)
                };
            }

            return maybeToken(tokenizer);

        case ASTERISK:
        case PLUSSIGN:
        case QUESTIONMARK:
        case NUMBERSIGN:
        case EXCLAMATIONMARK:
            // prohibited tokens (used as a multiplier start)
            break;

        case LEFTCURLYBRACKET:
            // LEFTCURLYBRACKET is allowed since mdn/data uses it w/o quoting
            // check next char isn't a number, because it's likely a disjoined multiplier
            code = tokenizer.nextCharCode();

            if (code < 48 || code > 57) {
                return maybeToken(tokenizer);
            }

            break;

        default:
            return maybeToken(tokenizer);
    }
}

function parse(source) {
    var tokenizer = new Tokenizer(source);
    var result = readImplicitGroup(tokenizer);

    if (tokenizer.pos !== source.length) {
        tokenizer.error('Unexpected input');
    }

    // reduce redundant groups with single group term
    if (result.terms.length === 1 && result.terms[0].type === 'Group') {
        result = result.terms[0];
    }

    return result;
}

// warm up parse to elimitate code branches that never execute
// fix soft deoptimizations (insufficient type feedback)
parse('[a&&<b>#|<\'c\'>*||e() f{2} /,(% g#{1,2} h{2,})]!');

module.exports = parse;

}, function(modId) { var map = {"./tokenizer":1597942294291}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294291, function(require, module, exports) {
var SyntaxError = require('./SyntaxError');

var TAB = 9;
var N = 10;
var F = 12;
var R = 13;
var SPACE = 32;

var Tokenizer = function(str) {
    this.str = str;
    this.pos = 0;
};

Tokenizer.prototype = {
    charCodeAt: function(pos) {
        return pos < this.str.length ? this.str.charCodeAt(pos) : 0;
    },
    charCode: function() {
        return this.charCodeAt(this.pos);
    },
    nextCharCode: function() {
        return this.charCodeAt(this.pos + 1);
    },
    nextNonWsCode: function(pos) {
        return this.charCodeAt(this.findWsEnd(pos));
    },
    findWsEnd: function(pos) {
        for (; pos < this.str.length; pos++) {
            var code = this.str.charCodeAt(pos);
            if (code !== R && code !== N && code !== F && code !== SPACE && code !== TAB) {
                break;
            }
        }

        return pos;
    },
    substringToPos: function(end) {
        return this.str.substring(this.pos, this.pos = end);
    },
    eat: function(code) {
        if (this.charCode() !== code) {
            this.error('Expect `' + String.fromCharCode(code) + '`');
        }

        this.pos++;
    },
    peek: function() {
        return this.pos < this.str.length ? this.str.charAt(this.pos++) : '';
    },
    error: function(message) {
        throw new SyntaxError(message, this.str, this.pos);
    }
};

module.exports = Tokenizer;

}, function(modId) { var map = {"./SyntaxError":1597942294292}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294292, function(require, module, exports) {
var createCustomError = require('../utils/createCustomError');

module.exports = function SyntaxError(message, input, offset) {
    var error = createCustomError('SyntaxError', message);

    error.input = input;
    error.offset = offset;
    error.rawMessage = message;
    error.message = error.rawMessage + '\n' +
        '  ' + error.input + '\n' +
        '--' + new Array((error.offset || error.input.length) + 1).join('-') + '^';

    return error;
};

}, function(modId) { var map = {"../utils/createCustomError":1597942294276}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294293, function(require, module, exports) {
var noop = function() {};

function ensureFunction(value) {
    return typeof value === 'function' ? value : noop;
}

module.exports = function(node, options, context) {
    function walk(node) {
        enter.call(context, node);

        switch (node.type) {
            case 'Group':
                node.terms.forEach(walk);
                break;

            case 'Multiplier':
                walk(node.term);
                break;

            case 'Type':
            case 'Property':
            case 'Keyword':
            case 'AtKeyword':
            case 'Function':
            case 'String':
            case 'Token':
            case 'Comma':
                break;

            default:
                throw new Error('Unknown type: ' + node.type);
        }

        leave.call(context, node);
    }

    var enter = noop;
    var leave = noop;

    if (typeof options === 'function') {
        enter = options;
    } else if (options) {
        enter = ensureFunction(options.enter);
        leave = ensureFunction(options.leave);
    }

    if (enter === noop && leave === noop) {
        throw new Error('Neither `enter` nor `leave` walker handler is set or both aren\'t a function');
    }

    walk(node, context);
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294294, function(require, module, exports) {
var tokenize = require('../tokenizer');
var TokenStream = require('../common/TokenStream');
var tokenStream = new TokenStream();
var astToTokens = {
    decorator: function(handlers) {
        var curNode = null;
        var prev = { len: 0, node: null };
        var nodes = [prev];
        var buffer = '';

        return {
            children: handlers.children,
            node: function(node) {
                var tmp = curNode;
                curNode = node;
                handlers.node.call(this, node);
                curNode = tmp;
            },
            chunk: function(chunk) {
                buffer += chunk;
                if (prev.node !== curNode) {
                    nodes.push({
                        len: chunk.length,
                        node: curNode
                    });
                } else {
                    prev.len += chunk.length;
                }
            },
            result: function() {
                return prepareTokens(buffer, nodes);
            }
        };
    }
};

function prepareTokens(str, nodes) {
    var tokens = [];
    var nodesOffset = 0;
    var nodesIndex = 0;
    var currentNode = nodes ? nodes[nodesIndex].node : null;

    tokenize(str, tokenStream);

    while (!tokenStream.eof) {
        if (nodes) {
            while (nodesIndex < nodes.length && nodesOffset + nodes[nodesIndex].len <= tokenStream.tokenStart) {
                nodesOffset += nodes[nodesIndex++].len;
                currentNode = nodes[nodesIndex].node;
            }
        }

        tokens.push({
            type: tokenStream.tokenType,
            value: tokenStream.getTokenValue(),
            index: tokenStream.tokenIndex, // TODO: remove it, temporary solution
            balance: tokenStream.balance[tokenStream.tokenIndex], // TODO: remove it, temporary solution
            node: currentNode
        });
        tokenStream.next();
        // console.log({ ...tokens[tokens.length - 1], node: undefined });
    }

    return tokens;
}

module.exports = function(value, syntax) {
    if (typeof value === 'string') {
        return prepareTokens(value, null);
    }

    return syntax.generate(value, astToTokens);
};

}, function(modId) { var map = {"../tokenizer":1597942294286,"../common/TokenStream":1597942294277}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294295, function(require, module, exports) {
var parse = require('../definition-syntax/parse');

var MATCH = { type: 'Match' };
var MISMATCH = { type: 'Mismatch' };
var DISALLOW_EMPTY = { type: 'DisallowEmpty' };
var LEFTPARENTHESIS = 40;  // (
var RIGHTPARENTHESIS = 41; // )

function createCondition(match, thenBranch, elseBranch) {
    // reduce node count
    if (thenBranch === MATCH && elseBranch === MISMATCH) {
        return match;
    }

    if (match === MATCH && thenBranch === MATCH && elseBranch === MATCH) {
        return match;
    }

    if (match.type === 'If' && match.else === MISMATCH && thenBranch === MATCH) {
        thenBranch = match.then;
        match = match.match;
    }

    return {
        type: 'If',
        match: match,
        then: thenBranch,
        else: elseBranch
    };
}

function isFunctionType(name) {
    return (
        name.length > 2 &&
        name.charCodeAt(name.length - 2) === LEFTPARENTHESIS &&
        name.charCodeAt(name.length - 1) === RIGHTPARENTHESIS
    );
}

function isEnumCapatible(term) {
    return (
        term.type === 'Keyword' ||
        term.type === 'AtKeyword' ||
        term.type === 'Function' ||
        term.type === 'Type' && isFunctionType(term.name)
    );
}

function buildGroupMatchGraph(combinator, terms, atLeastOneTermMatched) {
    switch (combinator) {
        case ' ':
            // Juxtaposing components means that all of them must occur, in the given order.
            //
            // a b c
            // =
            // match a
            //   then match b
            //     then match c
            //       then MATCH
            //       else MISMATCH
            //     else MISMATCH
            //   else MISMATCH
            var result = MATCH;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];

                result = createCondition(
                    term,
                    result,
                    MISMATCH
                );
            };

            return result;

        case '|':
            // A bar (|) separates two or more alternatives: exactly one of them must occur.
            //
            // a | b | c
            // =
            // match a
            //   then MATCH
            //   else match b
            //     then MATCH
            //     else match c
            //       then MATCH
            //       else MISMATCH

            var result = MISMATCH;
            var map = null;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];

                // reduce sequence of keywords into a Enum
                if (isEnumCapatible(term)) {
                    if (map === null && i > 0 && isEnumCapatible(terms[i - 1])) {
                        map = Object.create(null);
                        result = createCondition(
                            {
                                type: 'Enum',
                                map: map
                            },
                            MATCH,
                            result
                        );
                    }

                    if (map !== null) {
                        var key = (isFunctionType(term.name) ? term.name.slice(0, -1) : term.name).toLowerCase();
                        if (key in map === false) {
                            map[key] = term;
                            continue;
                        }
                    }
                }

                map = null;

                // create a new conditonal node
                result = createCondition(
                    term,
                    MATCH,
                    result
                );
            };

            return result;

        case '&&':
            // A double ampersand (&&) separates two or more components,
            // all of which must occur, in any order.

            // Use MatchOnce for groups with a large number of terms,
            // since &&-groups produces at least N!-node trees
            if (terms.length > 5) {
                return {
                    type: 'MatchOnce',
                    terms: terms,
                    all: true
                };
            }

            // Use a combination tree for groups with small number of terms
            //
            // a && b && c
            // =
            // match a
            //   then [b && c]
            //   else match b
            //     then [a && c]
            //     else match c
            //       then [a && b]
            //       else MISMATCH
            //
            // a && b
            // =
            // match a
            //   then match b
            //     then MATCH
            //     else MISMATCH
            //   else match b
            //     then match a
            //       then MATCH
            //       else MISMATCH
            //     else MISMATCH
            var result = MISMATCH;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];
                var thenClause;

                if (terms.length > 1) {
                    thenClause = buildGroupMatchGraph(
                        combinator,
                        terms.filter(function(newGroupTerm) {
                            return newGroupTerm !== term;
                        }),
                        false
                    );
                } else {
                    thenClause = MATCH;
                }

                result = createCondition(
                    term,
                    thenClause,
                    result
                );
            };

            return result;

        case '||':
            // A double bar (||) separates two or more options:
            // one or more of them must occur, in any order.

            // Use MatchOnce for groups with a large number of terms,
            // since ||-groups produces at least N!-node trees
            if (terms.length > 5) {
                return {
                    type: 'MatchOnce',
                    terms: terms,
                    all: false
                };
            }

            // Use a combination tree for groups with small number of terms
            //
            // a || b || c
            // =
            // match a
            //   then [b || c]
            //   else match b
            //     then [a || c]
            //     else match c
            //       then [a || b]
            //       else MISMATCH
            //
            // a || b
            // =
            // match a
            //   then match b
            //     then MATCH
            //     else MATCH
            //   else match b
            //     then match a
            //       then MATCH
            //       else MATCH
            //     else MISMATCH
            var result = atLeastOneTermMatched ? MATCH : MISMATCH;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];
                var thenClause;

                if (terms.length > 1) {
                    thenClause = buildGroupMatchGraph(
                        combinator,
                        terms.filter(function(newGroupTerm) {
                            return newGroupTerm !== term;
                        }),
                        true
                    );
                } else {
                    thenClause = MATCH;
                }

                result = createCondition(
                    term,
                    thenClause,
                    result
                );
            };

            return result;
    }
}

function buildMultiplierMatchGraph(node) {
    var result = MATCH;
    var matchTerm = buildMatchGraph(node.term);

    if (node.max === 0) {
        // disable repeating of empty match to prevent infinite loop
        matchTerm = createCondition(
            matchTerm,
            DISALLOW_EMPTY,
            MISMATCH
        );

        // an occurrence count is not limited, make a cycle;
        // to collect more terms on each following matching mismatch
        result = createCondition(
            matchTerm,
            null, // will be a loop
            MISMATCH
        );

        result.then = createCondition(
            MATCH,
            MATCH,
            result // make a loop
        );

        if (node.comma) {
            result.then.else = createCondition(
                { type: 'Comma', syntax: node },
                result,
                MISMATCH
            );
        }
    } else {
        // create a match node chain for [min .. max] interval with optional matches
        for (var i = node.min || 1; i <= node.max; i++) {
            if (node.comma && result !== MATCH) {
                result = createCondition(
                    { type: 'Comma', syntax: node },
                    result,
                    MISMATCH
                );
            }

            result = createCondition(
                matchTerm,
                createCondition(
                    MATCH,
                    MATCH,
                    result
                ),
                MISMATCH
            );
        }
    }

    if (node.min === 0) {
        // allow zero match
        result = createCondition(
            MATCH,
            MATCH,
            result
        );
    } else {
        // create a match node chain to collect [0 ... min - 1] required matches
        for (var i = 0; i < node.min - 1; i++) {
            if (node.comma && result !== MATCH) {
                result = createCondition(
                    { type: 'Comma', syntax: node },
                    result,
                    MISMATCH
                );
            }

            result = createCondition(
                matchTerm,
                result,
                MISMATCH
            );
        }
    }

    return result;
}

function buildMatchGraph(node) {
    if (typeof node === 'function') {
        return {
            type: 'Generic',
            fn: node
        };
    }

    switch (node.type) {
        case 'Group':
            var result = buildGroupMatchGraph(
                node.combinator,
                node.terms.map(buildMatchGraph),
                false
            );

            if (node.disallowEmpty) {
                result = createCondition(
                    result,
                    DISALLOW_EMPTY,
                    MISMATCH
                );
            }

            return result;

        case 'Multiplier':
            return buildMultiplierMatchGraph(node);

        case 'Type':
        case 'Property':
            return {
                type: node.type,
                name: node.name,
                syntax: node
            };

        case 'Keyword':
            return {
                type: node.type,
                name: node.name.toLowerCase(),
                syntax: node
            };

        case 'AtKeyword':
            return {
                type: node.type,
                name: '@' + node.name.toLowerCase(),
                syntax: node
            };

        case 'Function':
            return {
                type: node.type,
                name: node.name.toLowerCase() + '(',
                syntax: node
            };

        case 'String':
            // convert a one char length String to a Token
            if (node.value.length === 3) {
                return {
                    type: 'Token',
                    value: node.value.charAt(1),
                    syntax: node
                };
            }

            // otherwise use it as is
            return {
                type: node.type,
                value: node.value.substr(1, node.value.length - 2).replace(/\\'/g, '\''),
                syntax: node
            };

        case 'Token':
            return {
                type: node.type,
                value: node.value,
                syntax: node
            };

        case 'Comma':
            return {
                type: node.type,
                syntax: node
            };

        default:
            throw new Error('Unknown node type:', node.type);
    }
}

module.exports = {
    MATCH: MATCH,
    MISMATCH: MISMATCH,
    DISALLOW_EMPTY: DISALLOW_EMPTY,
    buildMatchGraph: function(syntaxTree, ref) {
        if (typeof syntaxTree === 'string') {
            syntaxTree = parse(syntaxTree);
        }

        return {
            type: 'MatchGraph',
            match: buildMatchGraph(syntaxTree),
            syntax: ref || null,
            source: syntaxTree
        };
    }
};

}, function(modId) { var map = {"../definition-syntax/parse":1597942294290}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294296, function(require, module, exports) {
var hasOwnProperty = Object.prototype.hasOwnProperty;
var matchGraph = require('./match-graph');
var MATCH = matchGraph.MATCH;
var MISMATCH = matchGraph.MISMATCH;
var DISALLOW_EMPTY = matchGraph.DISALLOW_EMPTY;
var TYPE = require('../tokenizer/const').TYPE;

var STUB = 0;
var TOKEN = 1;
var OPEN_SYNTAX = 2;
var CLOSE_SYNTAX = 3;

var EXIT_REASON_MATCH = 'Match';
var EXIT_REASON_MISMATCH = 'Mismatch';
var EXIT_REASON_ITERATION_LIMIT = 'Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)';

var ITERATION_LIMIT = 15000;
var totalIterationCount = 0;

function reverseList(list) {
    var prev = null;
    var next = null;
    var item = list;

    while (item !== null) {
        next = item.prev;
        item.prev = prev;
        prev = item;
        item = next;
    }

    return prev;
}

function areStringsEqualCaseInsensitive(testStr, referenceStr) {
    if (testStr.length !== referenceStr.length) {
        return false;
    }

    for (var i = 0; i < testStr.length; i++) {
        var testCode = testStr.charCodeAt(i);
        var referenceCode = referenceStr.charCodeAt(i);

        // testCode.toLowerCase() for U+0041 LATIN CAPITAL LETTER A (A) .. U+005A LATIN CAPITAL LETTER Z (Z).
        if (testCode >= 0x0041 && testCode <= 0x005A) {
            testCode = testCode | 32;
        }

        if (testCode !== referenceCode) {
            return false;
        }
    }

    return true;
}

function isCommaContextStart(token) {
    if (token === null) {
        return true;
    }

    return (
        token.type === TYPE.Comma ||
        token.type === TYPE.Function ||
        token.type === TYPE.LeftParenthesis ||
        token.type === TYPE.LeftSquareBracket ||
        token.type === TYPE.LeftCurlyBracket ||
        token.type === TYPE.Delim
    );
}

function isCommaContextEnd(token) {
    if (token === null) {
        return true;
    }

    return (
        token.type === TYPE.RightParenthesis ||
        token.type === TYPE.RightSquareBracket ||
        token.type === TYPE.RightCurlyBracket ||
        token.type === TYPE.Delim
    );
}

function internalMatch(tokens, state, syntaxes) {
    function moveToNextToken() {
        do {
            tokenIndex++;
            token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;
        } while (token !== null && (token.type === TYPE.WhiteSpace || token.type === TYPE.Comment));
    }

    function getNextToken(offset) {
        var nextIndex = tokenIndex + offset;

        return nextIndex < tokens.length ? tokens[nextIndex] : null;
    }

    function stateSnapshotFromSyntax(nextState, prev) {
        return {
            nextState: nextState,
            matchStack: matchStack,
            syntaxStack: syntaxStack,
            thenStack: thenStack,
            tokenIndex: tokenIndex,
            prev: prev
        };
    }

    function pushThenStack(nextState) {
        thenStack = {
            nextState: nextState,
            matchStack: matchStack,
            syntaxStack: syntaxStack,
            prev: thenStack
        };
    }

    function pushElseStack(nextState) {
        elseStack = stateSnapshotFromSyntax(nextState, elseStack);
    }

    function addTokenToMatch() {
        matchStack = {
            type: TOKEN,
            syntax: state.syntax,
            token: token,
            prev: matchStack
        };

        moveToNextToken();
        syntaxStash = null;

        if (tokenIndex > longestMatch) {
            longestMatch = tokenIndex;
        }
    }

    function openSyntax() {
        syntaxStack = {
            syntax: state.syntax,
            opts: state.syntax.opts || (syntaxStack !== null && syntaxStack.opts) || null,
            prev: syntaxStack
        };

        matchStack = {
            type: OPEN_SYNTAX,
            syntax: state.syntax,
            token: matchStack.token,
            prev: matchStack
        };
    }

    function closeSyntax() {
        if (matchStack.type === OPEN_SYNTAX) {
            matchStack = matchStack.prev;
        } else {
            matchStack = {
                type: CLOSE_SYNTAX,
                syntax: syntaxStack.syntax,
                token: matchStack.token,
                prev: matchStack
            };
        }

        syntaxStack = syntaxStack.prev;
    }

    var syntaxStack = null;
    var thenStack = null;
    var elseStack = null;

    // null – stashing allowed, nothing stashed
    // false – stashing disabled, nothing stashed
    // anithing else – fail stashable syntaxes, some syntax stashed
    var syntaxStash = null;

    var iterationCount = 0; // count iterations and prevent infinite loop
    var exitReason = null;

    var token = null;
    var tokenIndex = -1;
    var longestMatch = 0;
    var matchStack = {
        type: STUB,
        syntax: null,
        token: null,
        prev: null
    };

    moveToNextToken();

    while (exitReason === null && ++iterationCount < ITERATION_LIMIT) {
        // function mapList(list, fn) {
        //     var result = [];
        //     while (list) {
        //         result.unshift(fn(list));
        //         list = list.prev;
        //     }
        //     return result;
        // }
        // console.log('--\n',
        //     '#' + iterationCount,
        //     require('util').inspect({
        //         match: mapList(matchStack, x => x.type === TOKEN ? x.token && x.token.value : x.syntax ? ({ [OPEN_SYNTAX]: '<', [CLOSE_SYNTAX]: '</' }[x.type] || x.type) + '!' + x.syntax.name : null),
        //         token: token && token.value,
        //         tokenIndex,
        //         syntax: syntax.type + (syntax.id ? ' #' + syntax.id : '')
        //     }, { depth: null })
        // );
        switch (state.type) {
            case 'Match':
                if (thenStack === null) {
                    // turn to MISMATCH when some tokens left unmatched
                    if (token !== null) {
                        // doesn't mismatch if just one token left and it's an IE hack
                        if (tokenIndex !== tokens.length - 1 || (token.value !== '\\0' && token.value !== '\\9')) {
                            state = MISMATCH;
                            break;
                        }
                    }

                    // break the main loop, return a result - MATCH
                    exitReason = EXIT_REASON_MATCH;
                    break;
                }

                // go to next syntax (`then` branch)
                state = thenStack.nextState;

                // check match is not empty
                if (state === DISALLOW_EMPTY) {
                    if (thenStack.matchStack === matchStack) {
                        state = MISMATCH;
                        break;
                    } else {
                        state = MATCH;
                    }
                }

                // close syntax if needed
                while (thenStack.syntaxStack !== syntaxStack) {
                    closeSyntax();
                }

                // pop stack
                thenStack = thenStack.prev;
                break;

            case 'Mismatch':
                // when some syntax is stashed
                if (syntaxStash !== null && syntaxStash !== false) {
                    // there is no else branches or a branch reduce match stack
                    if (elseStack === null || tokenIndex > elseStack.tokenIndex) {
                        // restore state from the stash
                        elseStack = syntaxStash;
                        syntaxStash = false; // disable stashing
                    }
                } else if (elseStack === null) {
                    // no else branches -> break the main loop
                    // return a result - MISMATCH
                    exitReason = EXIT_REASON_MISMATCH;
                    break;
                }

                // go to next syntax (`else` branch)
                state = elseStack.nextState;

                // restore all the rest stack states
                thenStack = elseStack.thenStack;
                syntaxStack = elseStack.syntaxStack;
                matchStack = elseStack.matchStack;
                tokenIndex = elseStack.tokenIndex;
                token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;

                // pop stack
                elseStack = elseStack.prev;
                break;

            case 'MatchGraph':
                state = state.match;
                break;

            case 'If':
                // IMPORTANT: else stack push must go first,
                // since it stores the state of thenStack before changes
                if (state.else !== MISMATCH) {
                    pushElseStack(state.else);
                }

                if (state.then !== MATCH) {
                    pushThenStack(state.then);
                }

                state = state.match;
                break;

            case 'MatchOnce':
                state = {
                    type: 'MatchOnceBuffer',
                    syntax: state,
                    index: 0,
                    mask: 0
                };
                break;

            case 'MatchOnceBuffer':
                var terms = state.syntax.terms;

                if (state.index === terms.length) {
                    // no matches at all or it's required all terms to be matched
                    if (state.mask === 0 || state.syntax.all) {
                        state = MISMATCH;
                        break;
                    }

                    // a partial match is ok
                    state = MATCH;
                    break;
                }

                // all terms are matched
                if (state.mask === (1 << terms.length) - 1) {
                    state = MATCH;
                    break;
                }

                for (; state.index < terms.length; state.index++) {
                    var matchFlag = 1 << state.index;

                    if ((state.mask & matchFlag) === 0) {
                        // IMPORTANT: else stack push must go first,
                        // since it stores the state of thenStack before changes
                        pushElseStack(state);
                        pushThenStack({
                            type: 'AddMatchOnce',
                            syntax: state.syntax,
                            mask: state.mask | matchFlag
                        });

                        // match
                        state = terms[state.index++];
                        break;
                    }
                }
                break;

            case 'AddMatchOnce':
                state = {
                    type: 'MatchOnceBuffer',
                    syntax: state.syntax,
                    index: 0,
                    mask: state.mask
                };
                break;

            case 'Enum':
                if (token !== null) {
                    var name = token.value.toLowerCase();

                    // drop \0 and \9 hack from keyword name
                    if (name.indexOf('\\') !== -1) {
                        name = name.replace(/\\[09].*$/, '');
                    }

                    if (hasOwnProperty.call(state.map, name)) {
                        state = state.map[name];
                        break;
                    }
                }

                state = MISMATCH;
                break;

            case 'Generic':
                var opts = syntaxStack !== null ? syntaxStack.opts : null;
                var lastTokenIndex = tokenIndex + Math.floor(state.fn(token, getNextToken, opts));

                if (!isNaN(lastTokenIndex) && lastTokenIndex > tokenIndex) {
                    while (tokenIndex < lastTokenIndex) {
                        addTokenToMatch();
                    }

                    state = MATCH;
                } else {
                    state = MISMATCH;
                }

                break;

            case 'Type':
            case 'Property':
                var syntaxDict = state.type === 'Type' ? 'types' : 'properties';
                var dictSyntax = hasOwnProperty.call(syntaxes, syntaxDict) ? syntaxes[syntaxDict][state.name] : null;

                if (!dictSyntax || !dictSyntax.match) {
                    throw new Error(
                        'Bad syntax reference: ' +
                        (state.type === 'Type'
                            ? '<' + state.name + '>'
                            : '<\'' + state.name + '\'>')
                    );
                }

                // stash a syntax for types with low priority
                if (syntaxStash !== false && token !== null && state.type === 'Type') {
                    var lowPriorityMatching =
                        // https://drafts.csswg.org/css-values-4/#custom-idents
                        // When parsing positionally-ambiguous keywords in a property value, a <custom-ident> production
                        // can only claim the keyword if no other unfulfilled production can claim it.
                        (state.name === 'custom-ident' && token.type === TYPE.Ident) ||

                        // https://drafts.csswg.org/css-values-4/#lengths
                        // ... if a `0` could be parsed as either a <number> or a <length> in a property (such as line-height),
                        // it must parse as a <number>
                        (state.name === 'length' && token.value === '0');

                    if (lowPriorityMatching) {
                        if (syntaxStash === null) {
                            syntaxStash = stateSnapshotFromSyntax(state, elseStack);
                        }

                        state = MISMATCH;
                        break;
                    }
                }

                openSyntax();
                state = dictSyntax.match;
                break;

            case 'Keyword':
                var name = state.name;

                if (token !== null) {
                    var keywordName = token.value;

                    // drop \0 and \9 hack from keyword name
                    if (keywordName.indexOf('\\') !== -1) {
                        keywordName = keywordName.replace(/\\[09].*$/, '');
                    }

                    if (areStringsEqualCaseInsensitive(keywordName, name)) {
                        addTokenToMatch();
                        state = MATCH;
                        break;
                    }
                }

                state = MISMATCH;
                break;

            case 'AtKeyword':
            case 'Function':
                if (token !== null && areStringsEqualCaseInsensitive(token.value, state.name)) {
                    addTokenToMatch();
                    state = MATCH;
                    break;
                }

                state = MISMATCH;
                break;

            case 'Token':
                if (token !== null && token.value === state.value) {
                    addTokenToMatch();
                    state = MATCH;
                    break;
                }

                state = MISMATCH;
                break;

            case 'Comma':
                if (token !== null && token.type === TYPE.Comma) {
                    if (isCommaContextStart(matchStack.token)) {
                        state = MISMATCH;
                    } else {
                        addTokenToMatch();
                        state = isCommaContextEnd(token) ? MISMATCH : MATCH;
                    }
                } else {
                    state = isCommaContextStart(matchStack.token) || isCommaContextEnd(token) ? MATCH : MISMATCH;
                }

                break;

            case 'String':
                var string = '';

                for (var lastTokenIndex = tokenIndex; lastTokenIndex < tokens.length && string.length < state.value.length; lastTokenIndex++) {
                    string += tokens[lastTokenIndex].value;
                }

                if (areStringsEqualCaseInsensitive(string, state.value)) {
                    while (tokenIndex < lastTokenIndex) {
                        addTokenToMatch();
                    }

                    state = MATCH;
                } else {
                    state = MISMATCH;
                }

                break;

            default:
                throw new Error('Unknown node type: ' + state.type);
        }
    }

    totalIterationCount += iterationCount;

    switch (exitReason) {
        case null:
            console.warn('[csstree-match] BREAK after ' + ITERATION_LIMIT + ' iterations');
            exitReason = EXIT_REASON_ITERATION_LIMIT;
            matchStack = null;
            break;

        case EXIT_REASON_MATCH:
            while (syntaxStack !== null) {
                closeSyntax();
            }
            break;

        default:
            matchStack = null;
    }

    return {
        tokens: tokens,
        reason: exitReason,
        iterations: iterationCount,
        match: matchStack,
        longestMatch: longestMatch
    };
}

function matchAsList(tokens, matchGraph, syntaxes) {
    var matchResult = internalMatch(tokens, matchGraph, syntaxes || {});

    if (matchResult.match !== null) {
        var item = reverseList(matchResult.match).prev;

        matchResult.match = [];

        while (item !== null) {
            switch (item.type) {
                case STUB:
                    break;

                case OPEN_SYNTAX:
                case CLOSE_SYNTAX:
                    matchResult.match.push({
                        type: item.type,
                        syntax: item.syntax
                    });
                    break;

                default:
                    matchResult.match.push({
                        token: item.token.value,
                        node: item.token.node
                    });
                    break;
            }

            item = item.prev;
        }
    }

    return matchResult;
}

function matchAsTree(tokens, matchGraph, syntaxes) {
    var matchResult = internalMatch(tokens, matchGraph, syntaxes || {});

    if (matchResult.match === null) {
        return matchResult;
    }

    var item = matchResult.match;
    var host = matchResult.match = {
        syntax: matchGraph.syntax || null,
        match: []
    };
    var hostStack = [host];

    // revert a list and start with 2nd item since 1st is a stub item
    item = reverseList(item).prev;

    // build a tree
    while (item !== null) {
        switch (item.type) {
            case OPEN_SYNTAX:
                host.match.push(host = {
                    syntax: item.syntax,
                    match: []
                });
                hostStack.push(host);
                break;

            case CLOSE_SYNTAX:
                hostStack.pop();
                host = hostStack[hostStack.length - 1];
                break;

            default:
                host.match.push({
                    syntax: item.syntax || null,
                    token: item.token.value,
                    node: item.token.node
                });
        }

        item = item.prev;
    }

    return matchResult;
}

module.exports = {
    matchAsList: matchAsList,
    matchAsTree: matchAsTree,
    getTotalIterationCount: function() {
        return totalIterationCount;
    }
};

}, function(modId) { var map = {"./match-graph":1597942294295,"../tokenizer/const":1597942294278}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294297, function(require, module, exports) {
function getTrace(node) {
    function shouldPutToTrace(syntax) {
        if (syntax === null) {
            return false;
        }

        return (
            syntax.type === 'Type' ||
            syntax.type === 'Property' ||
            syntax.type === 'Keyword'
        );
    }

    function hasMatch(matchNode) {
        if (Array.isArray(matchNode.match)) {
            // use for-loop for better perfomance
            for (var i = 0; i < matchNode.match.length; i++) {
                if (hasMatch(matchNode.match[i])) {
                    if (shouldPutToTrace(matchNode.syntax)) {
                        result.unshift(matchNode.syntax);
                    }

                    return true;
                }
            }
        } else if (matchNode.node === node) {
            result = shouldPutToTrace(matchNode.syntax)
                ? [matchNode.syntax]
                : [];

            return true;
        }

        return false;
    }

    var result = null;

    if (this.matched !== null) {
        hasMatch(this.matched);
    }

    return result;
}

function testNode(match, node, fn) {
    var trace = getTrace.call(match, node);

    if (trace === null) {
        return false;
    }

    return trace.some(fn);
}

function isType(node, type) {
    return testNode(this, node, function(matchNode) {
        return matchNode.type === 'Type' && matchNode.name === type;
    });
}

function isProperty(node, property) {
    return testNode(this, node, function(matchNode) {
        return matchNode.type === 'Property' && matchNode.name === property;
    });
}

function isKeyword(node) {
    return testNode(this, node, function(matchNode) {
        return matchNode.type === 'Keyword';
    });
}

module.exports = {
    getTrace: getTrace,
    isType: isType,
    isProperty: isProperty,
    isKeyword: isKeyword
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294298, function(require, module, exports) {
var List = require('../common/List');

function getFirstMatchNode(matchNode) {
    if ('node' in matchNode) {
        return matchNode.node;
    }

    return getFirstMatchNode(matchNode.match[0]);
}

function getLastMatchNode(matchNode) {
    if ('node' in matchNode) {
        return matchNode.node;
    }

    return getLastMatchNode(matchNode.match[matchNode.match.length - 1]);
}

function matchFragments(lexer, ast, match, type, name) {
    function findFragments(matchNode) {
        if (matchNode.syntax !== null &&
            matchNode.syntax.type === type &&
            matchNode.syntax.name === name) {
            var start = getFirstMatchNode(matchNode);
            var end = getLastMatchNode(matchNode);

            lexer.syntax.walk(ast, function(node, item, list) {
                if (node === start) {
                    var nodes = new List();

                    do {
                        nodes.appendData(item.data);

                        if (item.data === end) {
                            break;
                        }

                        item = item.next;
                    } while (item !== null);

                    fragments.push({
                        parent: list,
                        nodes: nodes
                    });
                }
            });
        }

        if (Array.isArray(matchNode.match)) {
            matchNode.match.forEach(findFragments);
        }
    }

    var fragments = [];

    if (match.matched !== null) {
        findFragments(match.matched);
    }

    return fragments;
}

module.exports = {
    matchFragments: matchFragments
};

}, function(modId) { var map = {"../common/List":1597942294274}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294299, function(require, module, exports) {
var List = require('../common/List');
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isValidNumber(value) {
    // Number.isInteger(value) && value >= 0
    return (
        typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value &&
        value >= 0
    );
}

function isValidLocation(loc) {
    return (
        Boolean(loc) &&
        isValidNumber(loc.offset) &&
        isValidNumber(loc.line) &&
        isValidNumber(loc.column)
    );
}

function createNodeStructureChecker(type, fields) {
    return function checkNode(node, warn) {
        if (!node || node.constructor !== Object) {
            return warn(node, 'Type of node should be an Object');
        }

        for (var key in node) {
            var valid = true;

            if (hasOwnProperty.call(node, key) === false) {
                continue;
            }

            if (key === 'type') {
                if (node.type !== type) {
                    warn(node, 'Wrong node type `' + node.type + '`, expected `' + type + '`');
                }
            } else if (key === 'loc') {
                if (node.loc === null) {
                    continue;
                } else if (node.loc && node.loc.constructor === Object) {
                    if (typeof node.loc.source !== 'string') {
                        key += '.source';
                    } else if (!isValidLocation(node.loc.start)) {
                        key += '.start';
                    } else if (!isValidLocation(node.loc.end)) {
                        key += '.end';
                    } else {
                        continue;
                    }
                }

                valid = false;
            } else if (fields.hasOwnProperty(key)) {
                for (var i = 0, valid = false; !valid && i < fields[key].length; i++) {
                    var fieldType = fields[key][i];

                    switch (fieldType) {
                        case String:
                            valid = typeof node[key] === 'string';
                            break;

                        case Boolean:
                            valid = typeof node[key] === 'boolean';
                            break;

                        case null:
                            valid = node[key] === null;
                            break;

                        default:
                            if (typeof fieldType === 'string') {
                                valid = node[key] && node[key].type === fieldType;
                            } else if (Array.isArray(fieldType)) {
                                valid = node[key] instanceof List;
                            }
                    }
                }
            } else {
                warn(node, 'Unknown field `' + key + '` for ' + type + ' node type');
            }

            if (!valid) {
                warn(node, 'Bad value for `' + type + '.' + key + '`');
            }
        }

        for (var key in fields) {
            if (hasOwnProperty.call(fields, key) &&
                hasOwnProperty.call(node, key) === false) {
                warn(node, 'Field `' + type + '.' + key + '` is missed');
            }
        }
    };
}

function processStructure(name, nodeType) {
    var structure = nodeType.structure;
    var fields = {
        type: String,
        loc: true
    };
    var docs = {
        type: '"' + name + '"'
    };

    for (var key in structure) {
        if (hasOwnProperty.call(structure, key) === false) {
            continue;
        }

        var docsTypes = [];
        var fieldTypes = fields[key] = Array.isArray(structure[key])
            ? structure[key].slice()
            : [structure[key]];

        for (var i = 0; i < fieldTypes.length; i++) {
            var fieldType = fieldTypes[i];
            if (fieldType === String || fieldType === Boolean) {
                docsTypes.push(fieldType.name);
            } else if (fieldType === null) {
                docsTypes.push('null');
            } else if (typeof fieldType === 'string') {
                docsTypes.push('<' + fieldType + '>');
            } else if (Array.isArray(fieldType)) {
                docsTypes.push('List'); // TODO: use type enum
            } else {
                throw new Error('Wrong value `' + fieldType + '` in `' + name + '.' + key + '` structure definition');
            }
        }

        docs[key] = docsTypes.join(' | ');
    }

    return {
        docs: docs,
        check: createNodeStructureChecker(name, fields)
    };
}

module.exports = {
    getStructureFromConfig: function(config) {
        var structure = {};

        if (config.node) {
            for (var name in config.node) {
                if (hasOwnProperty.call(config.node, name)) {
                    var nodeType = config.node[name];

                    if (nodeType.structure) {
                        structure[name] = processStructure(name, nodeType);
                    } else {
                        throw new Error('Missed `structure` field in `' + name + '` node type definition');
                    }
                }
            }
        }

        return structure;
    }
};

}, function(modId) { var map = {"../common/List":1597942294274}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294300, function(require, module, exports) {
module.exports = {
    SyntaxError: require('./SyntaxError'),
    parse: require('./parse'),
    generate: require('./generate'),
    walk: require('./walk')
};

}, function(modId) { var map = {"./SyntaxError":1597942294292,"./parse":1597942294290,"./generate":1597942294283,"./walk":1597942294293}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294301, function(require, module, exports) {
var OffsetToLocation = require('../common/OffsetToLocation');
var SyntaxError = require('../common/SyntaxError');
var TokenStream = require('../common/TokenStream');
var List = require('../common/List');
var tokenize = require('../tokenizer');
var constants = require('../tokenizer/const');
var findWhiteSpaceStart = require('../tokenizer/utils').findWhiteSpaceStart;
var sequence = require('./sequence');
var noop = function() {};

var TYPE = constants.TYPE;
var NAME = constants.NAME;
var WHITESPACE = TYPE.WhiteSpace;
var IDENT = TYPE.Ident;
var FUNCTION = TYPE.Function;
var URL = TYPE.Url;
var HASH = TYPE.Hash;
var PERCENTAGE = TYPE.Percentage;
var NUMBER = TYPE.Number;
var NUMBERSIGN = 0x0023; // U+0023 NUMBER SIGN (#)
var NULL = 0;

function createParseContext(name) {
    return function() {
        return this[name]();
    };
}

function processConfig(config) {
    var parserConfig = {
        context: {},
        scope: {},
        atrule: {},
        pseudo: {}
    };

    if (config.parseContext) {
        for (var name in config.parseContext) {
            switch (typeof config.parseContext[name]) {
                case 'function':
                    parserConfig.context[name] = config.parseContext[name];
                    break;

                case 'string':
                    parserConfig.context[name] = createParseContext(config.parseContext[name]);
                    break;
            }
        }
    }

    if (config.scope) {
        for (var name in config.scope) {
            parserConfig.scope[name] = config.scope[name];
        }
    }

    if (config.atrule) {
        for (var name in config.atrule) {
            var atrule = config.atrule[name];

            if (atrule.parse) {
                parserConfig.atrule[name] = atrule.parse;
            }
        }
    }

    if (config.pseudo) {
        for (var name in config.pseudo) {
            var pseudo = config.pseudo[name];

            if (pseudo.parse) {
                parserConfig.pseudo[name] = pseudo.parse;
            }
        }
    }

    if (config.node) {
        for (var name in config.node) {
            parserConfig[name] = config.node[name].parse;
        }
    }

    return parserConfig;
}

module.exports = function createParser(config) {
    var parser = {
        scanner: new TokenStream(),
        locationMap: new OffsetToLocation(),

        filename: '<unknown>',
        needPositions: false,
        onParseError: noop,
        onParseErrorThrow: false,
        parseAtrulePrelude: true,
        parseRulePrelude: true,
        parseValue: true,
        parseCustomProperty: false,

        readSequence: sequence,

        createList: function() {
            return new List();
        },
        createSingleNodeList: function(node) {
            return new List().appendData(node);
        },
        getFirstListNode: function(list) {
            return list && list.first();
        },
        getLastListNode: function(list) {
            return list.last();
        },

        parseWithFallback: function(consumer, fallback) {
            var startToken = this.scanner.tokenIndex;

            try {
                return consumer.call(this);
            } catch (e) {
                if (this.onParseErrorThrow) {
                    throw e;
                }

                var fallbackNode = fallback.call(this, startToken);

                this.onParseErrorThrow = true;
                this.onParseError(e, fallbackNode);
                this.onParseErrorThrow = false;

                return fallbackNode;
            }
        },

        lookupNonWSType: function(offset) {
            do {
                var type = this.scanner.lookupType(offset++);
                if (type !== WHITESPACE) {
                    return type;
                }
            } while (type !== NULL);

            return NULL;
        },

        eat: function(tokenType) {
            if (this.scanner.tokenType !== tokenType) {
                var offset = this.scanner.tokenStart;
                var message = NAME[tokenType] + ' is expected';

                // tweak message and offset
                switch (tokenType) {
                    case IDENT:
                        // when identifier is expected but there is a function or url
                        if (this.scanner.tokenType === FUNCTION || this.scanner.tokenType === URL) {
                            offset = this.scanner.tokenEnd - 1;
                            message = 'Identifier is expected but function found';
                        } else {
                            message = 'Identifier is expected';
                        }
                        break;

                    case HASH:
                        if (this.scanner.isDelim(NUMBERSIGN)) {
                            this.scanner.next();
                            offset++;
                            message = 'Name is expected';
                        }
                        break;

                    case PERCENTAGE:
                        if (this.scanner.tokenType === NUMBER) {
                            offset = this.scanner.tokenEnd;
                            message = 'Percent sign is expected';
                        }
                        break;

                    default:
                        // when test type is part of another token show error for current position + 1
                        // e.g. eat(HYPHENMINUS) will fail on "-foo", but pointing on "-" is odd
                        if (this.scanner.source.charCodeAt(this.scanner.tokenStart) === tokenType) {
                            offset = offset + 1;
                        }
                }

                this.error(message, offset);
            }

            this.scanner.next();
        },

        consume: function(tokenType) {
            var value = this.scanner.getTokenValue();

            this.eat(tokenType);

            return value;
        },
        consumeFunctionName: function() {
            var name = this.scanner.source.substring(this.scanner.tokenStart, this.scanner.tokenEnd - 1);

            this.eat(FUNCTION);

            return name;
        },

        getLocation: function(start, end) {
            if (this.needPositions) {
                return this.locationMap.getLocationRange(
                    start,
                    end,
                    this.filename
                );
            }

            return null;
        },
        getLocationFromList: function(list) {
            if (this.needPositions) {
                var head = this.getFirstListNode(list);
                var tail = this.getLastListNode(list);
                return this.locationMap.getLocationRange(
                    head !== null ? head.loc.start.offset - this.locationMap.startOffset : this.scanner.tokenStart,
                    tail !== null ? tail.loc.end.offset - this.locationMap.startOffset : this.scanner.tokenStart,
                    this.filename
                );
            }

            return null;
        },

        error: function(message, offset) {
            var location = typeof offset !== 'undefined' && offset < this.scanner.source.length
                ? this.locationMap.getLocation(offset)
                : this.scanner.eof
                    ? this.locationMap.getLocation(findWhiteSpaceStart(this.scanner.source, this.scanner.source.length - 1))
                    : this.locationMap.getLocation(this.scanner.tokenStart);

            throw new SyntaxError(
                message || 'Unexpected input',
                this.scanner.source,
                location.offset,
                location.line,
                location.column
            );
        }
    };

    config = processConfig(config || {});
    for (var key in config) {
        parser[key] = config[key];
    }

    return function(source, options) {
        options = options || {};

        var context = options.context || 'default';
        var ast;

        tokenize(source, parser.scanner);
        parser.locationMap.setSource(
            source,
            options.offset,
            options.line,
            options.column
        );

        parser.filename = options.filename || '<unknown>';
        parser.needPositions = Boolean(options.positions);
        parser.onParseError = typeof options.onParseError === 'function' ? options.onParseError : noop;
        parser.onParseErrorThrow = false;
        parser.parseAtrulePrelude = 'parseAtrulePrelude' in options ? Boolean(options.parseAtrulePrelude) : true;
        parser.parseRulePrelude = 'parseRulePrelude' in options ? Boolean(options.parseRulePrelude) : true;
        parser.parseValue = 'parseValue' in options ? Boolean(options.parseValue) : true;
        parser.parseCustomProperty = 'parseCustomProperty' in options ? Boolean(options.parseCustomProperty) : false;

        if (!parser.context.hasOwnProperty(context)) {
            throw new Error('Unknown context `' + context + '`');
        }

        ast = parser.context[context].call(parser, options);

        if (!parser.scanner.eof) {
            parser.error();
        }

        return ast;
    };
};

}, function(modId) { var map = {"../common/OffsetToLocation":1597942294302,"../common/SyntaxError":1597942294275,"../common/TokenStream":1597942294277,"../common/List":1597942294274,"../tokenizer":1597942294286,"../tokenizer/const":1597942294278,"../tokenizer/utils":1597942294279,"./sequence":1597942294303}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294302, function(require, module, exports) {
var adoptBuffer = require('./adopt-buffer');
var isBOM = require('../tokenizer').isBOM;

var N = 10;
var F = 12;
var R = 13;

function computeLinesAndColumns(host, source) {
    var sourceLength = source.length;
    var lines = adoptBuffer(host.lines, sourceLength); // +1
    var line = host.startLine;
    var columns = adoptBuffer(host.columns, sourceLength);
    var column = host.startColumn;
    var startOffset = source.length > 0 ? isBOM(source.charCodeAt(0)) : 0;

    for (var i = startOffset; i < sourceLength; i++) { // -1
        var code = source.charCodeAt(i);

        lines[i] = line;
        columns[i] = column++;

        if (code === N || code === R || code === F) {
            if (code === R && i + 1 < sourceLength && source.charCodeAt(i + 1) === N) {
                i++;
                lines[i] = line;
                columns[i] = column;
            }

            line++;
            column = 1;
        }
    }

    lines[i] = line;
    columns[i] = column;

    host.lines = lines;
    host.columns = columns;
}

var OffsetToLocation = function() {
    this.lines = null;
    this.columns = null;
    this.linesAndColumnsComputed = false;
};

OffsetToLocation.prototype = {
    setSource: function(source, startOffset, startLine, startColumn) {
        this.source = source;
        this.startOffset = typeof startOffset === 'undefined' ? 0 : startOffset;
        this.startLine = typeof startLine === 'undefined' ? 1 : startLine;
        this.startColumn = typeof startColumn === 'undefined' ? 1 : startColumn;
        this.linesAndColumnsComputed = false;
    },

    ensureLinesAndColumnsComputed: function() {
        if (!this.linesAndColumnsComputed) {
            computeLinesAndColumns(this, this.source);
            this.linesAndColumnsComputed = true;
        }
    },
    getLocation: function(offset, filename) {
        this.ensureLinesAndColumnsComputed();

        return {
            source: filename,
            offset: this.startOffset + offset,
            line: this.lines[offset],
            column: this.columns[offset]
        };
    },
    getLocationRange: function(start, end, filename) {
        this.ensureLinesAndColumnsComputed();

        return {
            source: filename,
            start: {
                offset: this.startOffset + start,
                line: this.lines[start],
                column: this.columns[start]
            },
            end: {
                offset: this.startOffset + end,
                line: this.lines[end],
                column: this.columns[end]
            }
        };
    }
};

module.exports = OffsetToLocation;

}, function(modId) { var map = {"./adopt-buffer":1597942294287,"../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294303, function(require, module, exports) {
var TYPE = require('../tokenizer').TYPE;
var WHITESPACE = TYPE.WhiteSpace;
var COMMENT = TYPE.Comment;

module.exports = function readSequence(recognizer) {
    var children = this.createList();
    var child = null;
    var context = {
        recognizer: recognizer,
        space: null,
        ignoreWS: false,
        ignoreWSAfter: false
    };

    this.scanner.skipSC();

    while (!this.scanner.eof) {
        switch (this.scanner.tokenType) {
            case COMMENT:
                this.scanner.next();
                continue;

            case WHITESPACE:
                if (context.ignoreWS) {
                    this.scanner.next();
                } else {
                    context.space = this.WhiteSpace();
                }
                continue;
        }

        child = recognizer.getNode.call(this, context);

        if (child === undefined) {
            break;
        }

        if (context.space !== null) {
            children.push(context.space);
            context.space = null;
        }

        children.push(child);

        if (context.ignoreWSAfter) {
            context.ignoreWSAfter = false;
            context.ignoreWS = true;
        } else {
            context.ignoreWS = false;
        }
    }

    return children;
};

}, function(modId) { var map = {"../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294304, function(require, module, exports) {
var sourceMap = require('./sourceMap');
var hasOwnProperty = Object.prototype.hasOwnProperty;

function processChildren(node, delimeter) {
    var list = node.children;
    var prev = null;

    if (typeof delimeter !== 'function') {
        list.forEach(this.node, this);
    } else {
        list.forEach(function(node) {
            if (prev !== null) {
                delimeter.call(this, prev);
            }

            this.node(node);
            prev = node;
        }, this);
    }
}

module.exports = function createGenerator(config) {
    function processNode(node) {
        if (hasOwnProperty.call(types, node.type)) {
            types[node.type].call(this, node);
        } else {
            throw new Error('Unknown node type: ' + node.type);
        }
    }

    var types = {};

    if (config.node) {
        for (var name in config.node) {
            types[name] = config.node[name].generate;
        }
    }

    return function(node, options) {
        var buffer = '';
        var handlers = {
            children: processChildren,
            node: processNode,
            chunk: function(chunk) {
                buffer += chunk;
            },
            result: function() {
                return buffer;
            }
        };

        if (options) {
            if (typeof options.decorator === 'function') {
                handlers = options.decorator(handlers);
            }

            if (options.sourceMap) {
                handlers = sourceMap(handlers);
            }
        }

        handlers.node(node);

        return handlers.result();
    };
};

}, function(modId) { var map = {"./sourceMap":1597942294305}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294305, function(require, module, exports) {
var SourceMapGenerator = require('source-map/lib/source-map-generator').SourceMapGenerator;
var trackNodes = {
    Atrule: true,
    Selector: true,
    Declaration: true
};

module.exports = function generateSourceMap(handlers) {
    var map = new SourceMapGenerator();
    var line = 1;
    var column = 0;
    var generated = {
        line: 1,
        column: 0
    };
    var original = {
        line: 0, // should be zero to add first mapping
        column: 0
    };
    var sourceMappingActive = false;
    var activatedGenerated = {
        line: 1,
        column: 0
    };
    var activatedMapping = {
        generated: activatedGenerated
    };

    var handlersNode = handlers.node;
    handlers.node = function(node) {
        if (node.loc && node.loc.start && trackNodes.hasOwnProperty(node.type)) {
            var nodeLine = node.loc.start.line;
            var nodeColumn = node.loc.start.column - 1;

            if (original.line !== nodeLine ||
                original.column !== nodeColumn) {
                original.line = nodeLine;
                original.column = nodeColumn;

                generated.line = line;
                generated.column = column;

                if (sourceMappingActive) {
                    sourceMappingActive = false;
                    if (generated.line !== activatedGenerated.line ||
                        generated.column !== activatedGenerated.column) {
                        map.addMapping(activatedMapping);
                    }
                }

                sourceMappingActive = true;
                map.addMapping({
                    source: node.loc.source,
                    original: original,
                    generated: generated
                });
            }
        }

        handlersNode.call(this, node);

        if (sourceMappingActive && trackNodes.hasOwnProperty(node.type)) {
            activatedGenerated.line = line;
            activatedGenerated.column = column;
        }
    };

    var handlersChunk = handlers.chunk;
    handlers.chunk = function(chunk) {
        for (var i = 0; i < chunk.length; i++) {
            if (chunk.charCodeAt(i) === 10) { // \n
                line++;
                column = 0;
            } else {
                column++;
            }
        }

        handlersChunk(chunk);
    };

    var handlersResult = handlers.result;
    handlers.result = function() {
        if (sourceMappingActive) {
            map.addMapping(activatedMapping);
        }

        return {
            css: handlersResult(),
            map: map
        };
    };

    return handlers;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294306, function(require, module, exports) {
var List = require('../common/List');

module.exports = function createConvertors(walk) {
    return {
        fromPlainObject: function(ast) {
            walk(ast, {
                enter: function(node) {
                    if (node.children && node.children instanceof List === false) {
                        node.children = new List().fromArray(node.children);
                    }
                }
            });

            return ast;
        },
        toPlainObject: function(ast) {
            walk(ast, {
                leave: function(node) {
                    if (node.children && node.children instanceof List) {
                        node.children = node.children.toArray();
                    }
                }
            });

            return ast;
        }
    };
};

}, function(modId) { var map = {"../common/List":1597942294274}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294307, function(require, module, exports) {
var hasOwnProperty = Object.prototype.hasOwnProperty;
var noop = function() {};

function ensureFunction(value) {
    return typeof value === 'function' ? value : noop;
}

function invokeForType(fn, type) {
    return function(node, item, list) {
        if (node.type === type) {
            fn.call(this, node, item, list);
        }
    };
}

function getWalkersFromStructure(name, nodeType) {
    var structure = nodeType.structure;
    var walkers = [];

    for (var key in structure) {
        if (hasOwnProperty.call(structure, key) === false) {
            continue;
        }

        var fieldTypes = structure[key];
        var walker = {
            name: key,
            type: false,
            nullable: false
        };

        if (!Array.isArray(structure[key])) {
            fieldTypes = [structure[key]];
        }

        for (var i = 0; i < fieldTypes.length; i++) {
            var fieldType = fieldTypes[i];
            if (fieldType === null) {
                walker.nullable = true;
            } else if (typeof fieldType === 'string') {
                walker.type = 'node';
            } else if (Array.isArray(fieldType)) {
                walker.type = 'list';
            }
        }

        if (walker.type) {
            walkers.push(walker);
        }
    }

    if (walkers.length) {
        return {
            context: nodeType.walkContext,
            fields: walkers
        };
    }

    return null;
}

function getTypesFromConfig(config) {
    var types = {};

    for (var name in config.node) {
        if (hasOwnProperty.call(config.node, name)) {
            var nodeType = config.node[name];

            if (!nodeType.structure) {
                throw new Error('Missed `structure` field in `' + name + '` node type definition');
            }

            types[name] = getWalkersFromStructure(name, nodeType);
        }
    }

    return types;
}

function createTypeIterator(config, reverse) {
    var fields = config.fields.slice();
    var contextName = config.context;
    var useContext = typeof contextName === 'string';

    if (reverse) {
        fields.reverse();
    }

    return function(node, context, walk) {
        var prevContextValue;

        if (useContext) {
            prevContextValue = context[contextName];
            context[contextName] = node;
        }

        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var ref = node[field.name];

            if (!field.nullable || ref) {
                if (field.type === 'list') {
                    if (reverse) {
                        ref.forEachRight(walk);
                    } else {
                        ref.forEach(walk);
                    }
                } else {
                    walk(ref);
                }
            }
        }

        if (useContext) {
            context[contextName] = prevContextValue;
        }
    };
}

function createFastTraveralMap(iterators) {
    return {
        Atrule: {
            StyleSheet: iterators.StyleSheet,
            Atrule: iterators.Atrule,
            Rule: iterators.Rule,
            Block: iterators.Block
        },
        Rule: {
            StyleSheet: iterators.StyleSheet,
            Atrule: iterators.Atrule,
            Rule: iterators.Rule,
            Block: iterators.Block
        },
        Declaration: {
            StyleSheet: iterators.StyleSheet,
            Atrule: iterators.Atrule,
            Rule: iterators.Rule,
            Block: iterators.Block
        }
    };
}

module.exports = function createWalker(config) {
    var types = getTypesFromConfig(config);
    var iteratorsNatural = {};
    var iteratorsReverse = {};

    for (var name in types) {
        if (hasOwnProperty.call(types, name) && types[name] !== null) {
            iteratorsNatural[name] = createTypeIterator(types[name], false);
            iteratorsReverse[name] = createTypeIterator(types[name], true);
        }
    }

    var fastTraversalIteratorsNatural = createFastTraveralMap(iteratorsNatural);
    var fastTraversalIteratorsReverse = createFastTraveralMap(iteratorsReverse);

    var walk = function(root, options) {
        function walkNode(node, item, list) {
            enter.call(context, node, item, list);

            if (iterators.hasOwnProperty(node.type)) {
                iterators[node.type](node, context, walkNode);
            }

            leave.call(context, node, item, list);
        }

        var enter = noop;
        var leave = noop;
        var iterators = iteratorsNatural;
        var context = {
            root: root,
            stylesheet: null,
            atrule: null,
            atrulePrelude: null,
            rule: null,
            selector: null,
            block: null,
            declaration: null,
            function: null
        };

        if (typeof options === 'function') {
            enter = options;
        } else if (options) {
            enter = ensureFunction(options.enter);
            leave = ensureFunction(options.leave);

            if (options.reverse) {
                iterators = iteratorsReverse;
            }

            if (options.visit) {
                if (fastTraversalIteratorsNatural.hasOwnProperty(options.visit)) {
                    iterators = options.reverse
                        ? fastTraversalIteratorsReverse[options.visit]
                        : fastTraversalIteratorsNatural[options.visit];
                } else if (!types.hasOwnProperty(options.visit)) {
                    throw new Error('Bad value `' + options.visit + '` for `visit` option (should be: ' + Object.keys(types).join(', ') + ')');
                }

                enter = invokeForType(enter, options.visit);
                leave = invokeForType(leave, options.visit);
            }
        }

        if (enter === noop && leave === noop) {
            throw new Error('Neither `enter` nor `leave` walker handler is set or both aren\'t a function');
        }

        // swap handlers in reverse mode to invert visit order
        if (options.reverse) {
            var tmp = enter;
            enter = leave;
            leave = tmp;
        }

        walkNode(root);
    };

    walk.find = function(ast, fn) {
        var found = null;

        walk(ast, function(node, item, list) {
            if (found === null && fn.call(this, node, item, list)) {
                found = node;
            }
        });

        return found;
    };

    walk.findLast = function(ast, fn) {
        var found = null;

        walk(ast, {
            reverse: true,
            enter: function(node, item, list) {
                if (found === null && fn.call(this, node, item, list)) {
                    found = node;
                }
            }
        });

        return found;
    };

    walk.findAll = function(ast, fn) {
        var found = [];

        walk(ast, function(node, item, list) {
            if (fn.call(this, node, item, list)) {
                found.push(node);
            }
        });

        return found;
    };

    return walk;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294308, function(require, module, exports) {
var List = require('../common/List');

module.exports = function clone(node) {
    var result = {};

    for (var key in node) {
        var value = node[key];

        if (value) {
            if (Array.isArray(value) || value instanceof List) {
                value = value.map(clone);
            } else if (value.constructor === Object) {
                value = clone(value);
            }
        }

        result[key] = value;
    }

    return result;
};

}, function(modId) { var map = {"../common/List":1597942294274}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294309, function(require, module, exports) {
var hasOwnProperty = Object.prototype.hasOwnProperty;
var shape = {
    generic: true,
    types: {},
    properties: {},
    parseContext: {},
    scope: {},
    atrule: ['parse'],
    pseudo: ['parse'],
    node: ['name', 'structure', 'parse', 'generate', 'walkContext']
};

function isObject(value) {
    return value && value.constructor === Object;
}

function copy(value) {
    if (isObject(value)) {
        var res = {};
        for (var key in value) {
            if (hasOwnProperty.call(value, key)) {
                res[key] = value[key];
            }
        }
        return res;
    } else {
        return value;
    }
}

function extend(dest, src) {
    for (var key in src) {
        if (hasOwnProperty.call(src, key)) {
            if (isObject(dest[key])) {
                extend(dest[key], copy(src[key]));
            } else {
                dest[key] = copy(src[key]);
            }
        }
    }
}

function mix(dest, src, shape) {
    for (var key in shape) {
        if (hasOwnProperty.call(shape, key) === false) {
            continue;
        }

        if (shape[key] === true) {
            if (key in src) {
                if (hasOwnProperty.call(src, key)) {
                    dest[key] = copy(src[key]);
                }
            }
        } else if (shape[key]) {
            if (isObject(shape[key])) {
                var res = {};
                extend(res, dest[key]);
                extend(res, src[key]);
                dest[key] = res;
            } else if (Array.isArray(shape[key])) {
                var res = {};
                var innerShape = shape[key].reduce(function(s, k) {
                    s[k] = true;
                    return s;
                }, {});
                for (var name in dest[key]) {
                    if (hasOwnProperty.call(dest[key], name)) {
                        res[name] = {};
                        if (dest[key] && dest[key][name]) {
                            mix(res[name], dest[key][name], innerShape);
                        }
                    }
                }
                for (var name in src[key]) {
                    if (hasOwnProperty.call(src[key], name)) {
                        if (!res[name]) {
                            res[name] = {};
                        }
                        if (src[key] && src[key][name]) {
                            mix(res[name], src[key][name], innerShape);
                        }
                    }
                }
                dest[key] = res;
            }
        }
    }
    return dest;
}

module.exports = function(dest, src) {
    return mix(dest, src, shape);
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294310, function(require, module, exports) {
var data = require('../../../data');

module.exports = {
    generic: true,
    types: data.types,
    properties: data.properties,
    node: require('../node')
};

}, function(modId) { var map = {"../../../data":1597942294311,"../node":1597942294313}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294311, function(require, module, exports) {
var mdnProperties = require('mdn-data/css/properties.json');
var mdnSyntaxes = require('mdn-data/css/syntaxes.json');
var patch = require('./patch.json');

function buildDictionary(dict, patchDict) {
    var result = {};

    // copy all syntaxes for an original dict
    for (var key in dict) {
        result[key] = dict[key].syntax;
    }

    // apply a patch
    for (var key in patchDict) {
        if (key in dict) {
            if (patchDict[key].syntax) {
                result[key] = patchDict[key].syntax;
            } else {
                delete result[key];
            }
        } else {
            if (patchDict[key].syntax) {
                result[key] = patchDict[key].syntax;
            }
        }
    }

    return result;
}

module.exports = {
    properties: buildDictionary(mdnProperties, patch.properties),
    types: buildDictionary(mdnSyntaxes, patch.syntaxes)
};

}, function(modId) { var map = {"./patch.json":1597942294312}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294312, function(require, module, exports) {
module.exports = {
  "properties": {
    "-moz-background-clip": {
      "comment": "deprecated syntax in old Firefox, https://developer.mozilla.org/en/docs/Web/CSS/background-clip",
      "syntax": "padding | border"
    },
    "-moz-border-radius-bottomleft": {
      "comment": "https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-left-radius",
      "syntax": "<'border-bottom-left-radius'>"
    },
    "-moz-border-radius-bottomright": {
      "comment": "https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-right-radius",
      "syntax": "<'border-bottom-right-radius'>"
    },
    "-moz-border-radius-topleft": {
      "comment": "https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-left-radius",
      "syntax": "<'border-top-left-radius'>"
    },
    "-moz-border-radius-topright": {
      "comment": "https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-right-radius",
      "syntax": "<'border-bottom-right-radius'>"
    },
    "-moz-osx-font-smoothing": {
      "comment": "misssed old syntax https://developer.mozilla.org/en-US/docs/Web/CSS/font-smooth",
      "syntax": "auto | grayscale"
    },
    "-moz-user-select": {
      "comment": "https://developer.mozilla.org/en-US/docs/Web/CSS/user-select",
      "syntax": "none | text | all | -moz-none"
    },
    "-ms-flex-align": {
      "comment": "misssed old syntax implemented in IE, https://www.w3.org/TR/2012/WD-css3-flexbox-20120322/#flex-align",
      "syntax": "start | end | center | baseline | stretch"
    },
    "-ms-flex-item-align": {
      "comment": "misssed old syntax implemented in IE, https://www.w3.org/TR/2012/WD-css3-flexbox-20120322/#flex-align",
      "syntax": "auto | start | end | center | baseline | stretch"
    },
    "-ms-flex-line-pack": {
      "comment": "misssed old syntax implemented in IE, https://www.w3.org/TR/2012/WD-css3-flexbox-20120322/#flex-line-pack",
      "syntax": "start | end | center | justify | distribute | stretch"
    },
    "-ms-flex-negative": {
      "comment": "misssed old syntax implemented in IE; TODO: find references for comfirmation",
      "syntax": "<'flex-shrink'>"
    },
    "-ms-flex-pack": {
      "comment": "misssed old syntax implemented in IE, https://www.w3.org/TR/2012/WD-css3-flexbox-20120322/#flex-pack",
      "syntax": "start | end | center | justify | distribute"
    },
    "-ms-flex-order": {
      "comment": "misssed old syntax implemented in IE; https://msdn.microsoft.com/en-us/library/jj127303(v=vs.85).aspx",
      "syntax": "<integer>"
    },
    "-ms-flex-positive": {
      "comment": "misssed old syntax implemented in IE; TODO: find references for comfirmation",
      "syntax": "<'flex-grow'>"
    },
    "-ms-flex-preferred-size": {
      "comment": "misssed old syntax implemented in IE; TODO: find references for comfirmation",
      "syntax": "<'flex-basis'>"
    },
    "-ms-interpolation-mode": {
      "comment": "https://msdn.microsoft.com/en-us/library/ff521095(v=vs.85).aspx",
      "syntax": "nearest-neighbor | bicubic"
    },
    "-ms-grid-column-align": {
      "comment": "add this property first since it uses as fallback for flexbox, https://msdn.microsoft.com/en-us/library/windows/apps/hh466338.aspx",
      "syntax": "start | end | center | stretch"
    },
    "-ms-grid-row-align": {
      "comment": "add this property first since it uses as fallback for flexbox, https://msdn.microsoft.com/en-us/library/windows/apps/hh466348.aspx",
      "syntax": "start | end | center | stretch"
    },
    "-webkit-appearance": {
      "comment": "webkit specific keywords",
      "references": [
        "http://css-infos.net/property/-webkit-appearance"
      ],
      "syntax": "none | button | button-bevel | caps-lock-indicator | caret | checkbox | default-button | listbox | listitem | media-fullscreen-button | media-mute-button | media-play-button | media-seek-back-button | media-seek-forward-button | media-slider | media-sliderthumb | menulist | menulist-button | menulist-text | menulist-textfield | push-button | radio | scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbargripper-horizontal | scrollbargripper-vertical | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical | searchfield | searchfield-cancel-button | searchfield-decoration | searchfield-results-button | searchfield-results-decoration | slider-horizontal | slider-vertical | sliderthumb-horizontal | sliderthumb-vertical | square-button | textarea | textfield"
    },
    "-webkit-background-clip": {
      "comment": "https://developer.mozilla.org/en/docs/Web/CSS/background-clip",
      "syntax": "[ <box> | border | padding | content | text ]#"
    },
    "-webkit-column-break-after": {
      "comment": "added, http://help.dottoro.com/lcrthhhv.php",
      "syntax": "always | auto | avoid"
    },
    "-webkit-column-break-before": {
      "comment": "added, http://help.dottoro.com/lcxquvkf.php",
      "syntax": "always | auto | avoid"
    },
    "-webkit-column-break-inside": {
      "comment": "added, http://help.dottoro.com/lclhnthl.php",
      "syntax": "always | auto | avoid"
    },
    "-webkit-font-smoothing": {
      "comment": "https://developer.mozilla.org/en-US/docs/Web/CSS/font-smooth",
      "syntax": "auto | none | antialiased | subpixel-antialiased"
    },
    "-webkit-mask-box-image": {
      "comment": "missed; https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-mask-box-image",
      "syntax": "[ <url> | <gradient> | none ] [ <length-percentage>{4} <-webkit-mask-box-repeat>{2} ]?"
    },
    "-webkit-print-color-adjust": {
      "comment": "missed",
      "references": [
        "https://developer.mozilla.org/en/docs/Web/CSS/-webkit-print-color-adjust"
      ],
      "syntax": "economy | exact"
    },
    "-webkit-text-security": {
      "comment": "missed; http://help.dottoro.com/lcbkewgt.php",
      "syntax": "none | circle | disc | square"
    },
    "-webkit-user-drag": {
      "comment": "missed; http://help.dottoro.com/lcbixvwm.php",
      "syntax": "none | element | auto"
    },
    "-webkit-user-select": {
      "comment": "auto is supported by old webkit, https://developer.mozilla.org/en-US/docs/Web/CSS/user-select",
      "syntax": "auto | none | text | all"
    },
    "alignment-baseline": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/text.html#AlignmentBaselineProperty"
      ],
      "syntax": "auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical"
    },
    "baseline-shift": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/text.html#BaselineShiftProperty"
      ],
      "syntax": "baseline | sub | super | <svg-length>"
    },
    "behavior": {
      "comment": "added old IE property https://msdn.microsoft.com/en-us/library/ms530723(v=vs.85).aspx",
      "syntax": "<url>+"
    },
    "clip-rule": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/masking.html#ClipRuleProperty"
      ],
      "syntax": "nonzero | evenodd"
    },
    "cue": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "<'cue-before'> <'cue-after'>?"
    },
    "cue-after": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "<url> <decibel>? | none"
    },
    "cue-before": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "<url> <decibel>? | none"
    },
    "cursor": {
      "comment": "added legacy keywords: hand, -webkit-grab. -webkit-grabbing, -webkit-zoom-in, -webkit-zoom-out, -moz-grab, -moz-grabbing, -moz-zoom-in, -moz-zoom-out",
      "references": [
        "https://www.sitepoint.com/css3-cursor-styles/"
      ],
      "syntax": "[ [ <url> [ <x> <y> ]? , ]* [ auto | default | none | context-menu | help | pointer | progress | wait | cell | crosshair | text | vertical-text | alias | copy | move | no-drop | not-allowed | e-resize | n-resize | ne-resize | nw-resize | s-resize | se-resize | sw-resize | w-resize | ew-resize | ns-resize | nesw-resize | nwse-resize | col-resize | row-resize | all-scroll | zoom-in | zoom-out | grab | grabbing | hand | -webkit-grab | -webkit-grabbing | -webkit-zoom-in | -webkit-zoom-out | -moz-grab | -moz-grabbing | -moz-zoom-in | -moz-zoom-out ] ]"
    },
    "display": {
      "comment": "extended with -ms-flexbox",
      "syntax": "none | inline | block | list-item | inline-list-item | inline-block | inline-table | table | table-cell | table-column | table-column-group | table-footer-group | table-header-group | table-row | table-row-group | flex | inline-flex | grid | inline-grid | run-in | ruby | ruby-base | ruby-text | ruby-base-container | ruby-text-container | contents | -ms-flexbox | -ms-inline-flexbox | -ms-grid | -ms-inline-grid | -webkit-flex | -webkit-inline-flex | -webkit-box | -webkit-inline-box | -moz-inline-stack | -moz-box | -moz-inline-box"
    },
    "position": {
      "comment": "extended with -webkit-sticky",
      "syntax": "static | relative | absolute | sticky | fixed | -webkit-sticky"
    },
    "dominant-baseline": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/text.html#DominantBaselineProperty"
      ],
      "syntax": "auto | use-script | no-change | reset-size | ideographic | alphabetic | hanging | mathematical | central | middle | text-after-edge | text-before-edge"
    },
    "image-rendering": {
      "comment": "extended with <-non-standard-image-rendering>, added SVG keywords optimizeSpeed and optimizeQuality",
      "references": [
        "https://developer.mozilla.org/en/docs/Web/CSS/image-rendering",
        "https://www.w3.org/TR/SVG/painting.html#ImageRenderingProperty"
      ],
      "syntax": "auto | crisp-edges | pixelated | optimizeSpeed | optimizeQuality | <-non-standard-image-rendering>"
    },
    "fill": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#FillProperty"
      ],
      "syntax": "<paint>"
    },
    "fill-opacity": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#FillProperty"
      ],
      "syntax": "<number-zero-one>"
    },
    "fill-rule": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#FillProperty"
      ],
      "syntax": "nonzero | evenodd"
    },
    "filter": {
      "comment": "extend with IE legacy syntaxes",
      "syntax": "none | <filter-function-list> | <-ms-filter-function-list>"
    },
    "glyph-orientation-horizontal": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/text.html#GlyphOrientationHorizontalProperty"
      ],
      "syntax": "<angle>"
    },
    "glyph-orientation-vertical": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/text.html#GlyphOrientationVerticalProperty"
      ],
      "syntax": "<angle>"
    },
    "kerning": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/text.html#KerningProperty"
      ],
      "syntax": "auto | <svg-length>"
    },
    "letter-spacing": {
      "comment": "fix syntax <length> -> <length-percentage>",
      "references": [
        "https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/letter-spacing"
      ],
      "syntax": "normal | <length-percentage>"
    },
    "marker": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#MarkerProperties"
      ],
      "syntax": "none | <url>"
    },
    "marker-end": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#MarkerProperties"
      ],
      "syntax": "none | <url>"
    },
    "marker-mid": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#MarkerProperties"
      ],
      "syntax": "none | <url>"
    },
    "marker-start": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#MarkerProperties"
      ],
      "syntax": "none | <url>"
    },
    "max-width": {
      "comment": "extend by non-standard width keywords https://developer.mozilla.org/en-US/docs/Web/CSS/max-width",
      "syntax": "<length> | <percentage> | none | max-content | min-content | fit-content | fill-available | <-non-standard-width>"
    },
    "min-width": {
      "comment": "extend by non-standard width keywords https://developer.mozilla.org/en-US/docs/Web/CSS/width",
      "syntax": "<length> | <percentage> | auto | max-content | min-content | fit-content | fill-available | <-non-standard-width>"
    },
    "opacity": {
      "comment": "strict to 0..1 <number> -> <number-zero-one>",
      "syntax": "<number-zero-one>"
    },
    "overflow": {
      "comment": "extend by vendor keywords https://developer.mozilla.org/en-US/docs/Web/CSS/overflow",
      "syntax": "[ visible | hidden | clip | scroll | auto ]{1,2} | <-non-standard-overflow>"
    },
    "pause": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "<'pause-before'> <'pause-after'>?"
    },
    "pause-after": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "<time> | none | x-weak | weak | medium | strong | x-strong"
    },
    "pause-before": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "<time> | none | x-weak | weak | medium | strong | x-strong"
    },
    "rest": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "<'rest-before'> <'rest-after'>?"
    },
    "rest-after": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "<time> | none | x-weak | weak | medium | strong | x-strong"
    },
    "rest-before": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "<time> | none | x-weak | weak | medium | strong | x-strong"
    },
    "shape-rendering": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#ShapeRenderingPropert"
      ],
      "syntax": "auto | optimizeSpeed | crispEdges | geometricPrecision"
    },
    "src": {
      "comment": "added @font-face's src property https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src",
      "syntax": "[ <url> [ format( <string># ) ]? | local( <family-name> ) ]#"
    },
    "speak": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "auto | none | normal"
    },
    "speak-as": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "normal | spell-out || digits || [ literal-punctuation | no-punctuation ]"
    },
    "stroke": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
      ],
      "syntax": "<paint>"
    },
    "stroke-dasharray": {
      "comment": "added SVG property; a list of comma and/or white space separated <length>s and <percentage>s",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
      ],
      "syntax": "none | [ <svg-length>+ ]#"
    },
    "stroke-dashoffset": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
      ],
      "syntax": "<svg-length>"
    },
    "stroke-linecap": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
      ],
      "syntax": "butt | round | square"
    },
    "stroke-linejoin": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
      ],
      "syntax": "miter | round | bevel"
    },
    "stroke-miterlimit": {
      "comment": "added SVG property (<miterlimit> = <number-one-or-greater>) ",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
      ],
      "syntax": "<number-one-or-greater>"
    },
    "stroke-opacity": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
      ],
      "syntax": "<number-zero-one>"
    },
    "stroke-width": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
      ],
      "syntax": "<svg-length>"
    },
    "text-anchor": {
      "comment": "added SVG property",
      "references": [
        "https://www.w3.org/TR/SVG/text.html#TextAlignmentProperties"
      ],
      "syntax": "start | middle | end"
    },
    "unicode-bidi": {
      "comment": "added prefixed keywords https://developer.mozilla.org/en-US/docs/Web/CSS/unicode-bidi",
      "syntax": "normal | embed | isolate | bidi-override | isolate-override | plaintext | -moz-isolate | -moz-isolate-override | -moz-plaintext | -webkit-isolate"
    },
    "unicode-range": {
      "comment": "added missed property https://developer.mozilla.org/en-US/docs/Web/CSS/%40font-face/unicode-range",
      "syntax": "<urange>#"
    },
    "voice-balance": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "<number> | left | center | right | leftwards | rightwards"
    },
    "voice-duration": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "auto | <time>"
    },
    "voice-family": {
      "comment": "<name> -> <family-name>, https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "[ [ <family-name> | <generic-voice> ] , ]* [ <family-name> | <generic-voice> ] | preserve"
    },
    "voice-pitch": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "<frequency> && absolute | [ [ x-low | low | medium | high | x-high ] || [ <frequency> | <semitones> | <percentage> ] ]"
    },
    "voice-range": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "<frequency> && absolute | [ [ x-low | low | medium | high | x-high ] || [ <frequency> | <semitones> | <percentage> ] ]"
    },
    "voice-rate": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "[ normal | x-slow | slow | medium | fast | x-fast ] || <percentage>"
    },
    "voice-stress": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "normal | strong | moderate | none | reduced"
    },
    "voice-volume": {
      "comment": "https://www.w3.org/TR/css3-speech/#property-index",
      "syntax": "silent | [ [ x-soft | soft | medium | loud | x-loud ] || <decibel> ]"
    },
    "writing-mode": {
      "comment": "extend with SVG keywords",
      "syntax": "horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr | <svg-writing-mode>"
    }
  },
  "syntaxes": {
    "-legacy-gradient": {
      "comment": "added collection of legacy gradient syntaxes",
      "syntax": "<-webkit-gradient()> | <-legacy-linear-gradient> | <-legacy-repeating-linear-gradient> | <-legacy-radial-gradient> | <-legacy-repeating-radial-gradient>"
    },
    "-legacy-linear-gradient": {
      "comment": "like standard syntax but w/o `to` keyword https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient",
      "syntax": "-moz-linear-gradient( <-legacy-linear-gradient-arguments> ) | -webkit-linear-gradient( <-legacy-linear-gradient-arguments> ) | -o-linear-gradient( <-legacy-linear-gradient-arguments> )"
    },
    "-legacy-repeating-linear-gradient": {
      "comment": "like standard syntax but w/o `to` keyword https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient",
      "syntax": "-moz-repeating-linear-gradient( <-legacy-linear-gradient-arguments> ) | -webkit-repeating-linear-gradient( <-legacy-linear-gradient-arguments> ) | -o-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )"
    },
    "-legacy-linear-gradient-arguments": {
      "comment": "like standard syntax but w/o `to` keyword https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient",
      "syntax": "[ <angle> | <side-or-corner> ]? , <color-stop-list>"
    },
    "-legacy-radial-gradient": {
      "comment": "deprecated syntax that implemented by some browsers https://www.w3.org/TR/2011/WD-css3-images-20110908/#radial-gradients",
      "syntax": "-moz-radial-gradient( <-legacy-radial-gradient-arguments> ) | -webkit-radial-gradient( <-legacy-radial-gradient-arguments> ) | -o-radial-gradient( <-legacy-radial-gradient-arguments> )"
    },
    "-legacy-repeating-radial-gradient": {
      "comment": "deprecated syntax that implemented by some browsers https://www.w3.org/TR/2011/WD-css3-images-20110908/#radial-gradients",
      "syntax": "-moz-repeating-radial-gradient( <-legacy-radial-gradient-arguments> ) | -webkit-repeating-radial-gradient( <-legacy-radial-gradient-arguments> ) | -o-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )"
    },
    "-legacy-radial-gradient-arguments": {
      "comment": "deprecated syntax that implemented by some browsers https://www.w3.org/TR/2011/WD-css3-images-20110908/#radial-gradients",
      "syntax": "[ <position> , ]? [ [ [ <-legacy-radial-gradient-shape> || <-legacy-radial-gradient-size> ] | [ <length> | <percentage> ]{2} ] , ]? <color-stop-list>"
    },
    "-legacy-radial-gradient-size": {
      "comment": "before a standard it contains 2 extra keywords (`contain` and `cover`) https://www.w3.org/TR/2011/WD-css3-images-20110908/#ltsize",
      "syntax": "closest-side | closest-corner | farthest-side | farthest-corner | contain | cover"
    },
    "-legacy-radial-gradient-shape": {
      "comment": "define to double sure it doesn't extends in future https://www.w3.org/TR/2011/WD-css3-images-20110908/#ltshape",
      "syntax": "circle | ellipse"
    },
    "-non-standard-font": {
      "comment": "non standard fonts",
      "references": [
        "https://webkit.org/blog/3709/using-the-system-font-in-web-content/"
      ],
      "syntax": "-apple-system-body | -apple-system-headline | -apple-system-subheadline | -apple-system-caption1 | -apple-system-caption2 | -apple-system-footnote | -apple-system-short-body | -apple-system-short-headline | -apple-system-short-subheadline | -apple-system-short-caption1 | -apple-system-short-footnote | -apple-system-tall-body"
    },
    "-non-standard-color": {
      "comment": "non standard colors",
      "references": [
        "http://cssdot.ru/%D0%A1%D0%BF%D1%80%D0%B0%D0%B2%D0%BE%D1%87%D0%BD%D0%B8%D0%BA_CSS/color-i305.html",
        "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Mozilla_Color_Preference_Extensions"
      ],
      "syntax": "-moz-ButtonDefault | -moz-ButtonHoverFace | -moz-ButtonHoverText | -moz-CellHighlight | -moz-CellHighlightText | -moz-Combobox | -moz-ComboboxText | -moz-Dialog | -moz-DialogText | -moz-dragtargetzone | -moz-EvenTreeRow | -moz-Field | -moz-FieldText | -moz-html-CellHighlight | -moz-html-CellHighlightText | -moz-mac-accentdarkestshadow | -moz-mac-accentdarkshadow | -moz-mac-accentface | -moz-mac-accentlightesthighlight | -moz-mac-accentlightshadow | -moz-mac-accentregularhighlight | -moz-mac-accentregularshadow | -moz-mac-chrome-active | -moz-mac-chrome-inactive | -moz-mac-focusring | -moz-mac-menuselect | -moz-mac-menushadow | -moz-mac-menutextselect | -moz-MenuHover | -moz-MenuHoverText | -moz-MenuBarText | -moz-MenuBarHoverText | -moz-nativehyperlinktext | -moz-OddTreeRow | -moz-win-communicationstext | -moz-win-mediatext | -moz-activehyperlinktext | -moz-default-background-color | -moz-default-color | -moz-hyperlinktext | -moz-visitedhyperlinktext | -webkit-activelink | -webkit-focus-ring-color | -webkit-link | -webkit-text"
    },
    "-non-standard-image-rendering": {
      "comment": "non-standard keywords http://phrogz.net/tmp/canvas_image_zoom.html",
      "syntax": "optimize-contrast | -moz-crisp-edges | -o-crisp-edges | -webkit-optimize-contrast"
    },
    "-non-standard-overflow": {
      "comment": "non-standard keywords https://developer.mozilla.org/en-US/docs/Web/CSS/overflow",
      "syntax": "-moz-scrollbars-none | -moz-scrollbars-horizontal | -moz-scrollbars-vertical | -moz-hidden-unscrollable"
    },
    "-non-standard-width": {
      "comment": "non-standard keywords https://developer.mozilla.org/en-US/docs/Web/CSS/width",
      "syntax": "min-intrinsic | intrinsic | -moz-min-content | -moz-max-content | -webkit-min-content | -webkit-max-content"
    },
    "-webkit-gradient()": {
      "comment": "first Apple proposal gradient syntax https://webkit.org/blog/175/introducing-css-gradients/ - TODO: simplify when after match algorithm improvement ( [, point, radius | , point] -> [, radius]? , point )",
      "syntax": "-webkit-gradient( <-webkit-gradient-type>, <-webkit-gradient-point> [, <-webkit-gradient-point> | , <-webkit-gradient-radius>, <-webkit-gradient-point> ] [, <-webkit-gradient-radius>]? [, <-webkit-gradient-color-stop>]* )"
    },
    "-webkit-gradient-color-stop": {
      "comment": "first Apple proposal gradient syntax https://webkit.org/blog/175/introducing-css-gradients/",
      "syntax": "from( <color> ) | color-stop( [ <number-zero-one> | <percentage> ] , <color> ) | to( <color> )"
    },
    "-webkit-gradient-point": {
      "comment": "first Apple proposal gradient syntax https://webkit.org/blog/175/introducing-css-gradients/",
      "syntax": "[ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ]"
    },
    "-webkit-gradient-radius": {
      "comment": "first Apple proposal gradient syntax https://webkit.org/blog/175/introducing-css-gradients/",
      "syntax": "<length> | <percentage>"
    },
    "-webkit-gradient-type": {
      "comment": "first Apple proposal gradient syntax https://webkit.org/blog/175/introducing-css-gradients/",
      "syntax": "linear | radial"
    },
    "-webkit-mask-box-repeat": {
      "comment": "missed; https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-mask-box-image",
      "syntax": "repeat | stretch | round"
    },
    "-webkit-mask-clip-style": {
      "comment": "missed; there is no enough information about `-webkit-mask-clip` property, but looks like all those keywords are working",
      "syntax": "border | border-box | padding | padding-box | content | content-box | text"
    },
    "-ms-filter-function-list": {
      "comment": "https://developer.mozilla.org/en-US/docs/Web/CSS/-ms-filter",
      "syntax": "<-ms-filter-function>+"
    },
    "-ms-filter-function": {
      "comment": "https://developer.mozilla.org/en-US/docs/Web/CSS/-ms-filter",
      "syntax": "<-ms-filter-function-progid> | <-ms-filter-function-legacy>"
    },
    "-ms-filter-function-progid": {
      "comment": "https://developer.mozilla.org/en-US/docs/Web/CSS/-ms-filter",
      "syntax": "'progid:' [ <ident-token> '.' ]* [ <ident-token> | <function-token> <any-value>? ) ]"
    },
    "-ms-filter-function-legacy": {
      "comment": "https://developer.mozilla.org/en-US/docs/Web/CSS/-ms-filter",
      "syntax": "<ident-token> | <function-token> <any-value>? )"
    },
    "-ms-filter": {
      "syntax": "<string>"
    },
    "age": {
      "comment": "https://www.w3.org/TR/css3-speech/#voice-family",
      "syntax": "child | young | old"
    },
    "attr-name": {
      "syntax": "<wq-name>"
    },
    "attr-fallback": {
      "syntax": "<any-value>"
    },
    "border-radius": {
      "comment": "missed, https://drafts.csswg.org/css-backgrounds-3/#the-border-radius",
      "syntax": "<length-percentage>{1,2}"
    },
    "bottom": {
      "comment": "missed; not sure we should add it, but no others except `shape` is using it so it's ok for now; https://drafts.fxtf.org/css-masking-1/#funcdef-clip-rect",
      "syntax": "<length> | auto"
    },
    "content-list": {
      "comment": "missed -> https://drafts.csswg.org/css-content/#typedef-content-list (document-url, <target> and leader() is omitted util stabilization)",
      "syntax": "[ <string> | contents | <url> | <quote> | <attr()> | counter( <ident>, <'list-style-type'>? ) ]+"
    },
    "generic-voice": {
      "comment": "https://www.w3.org/TR/css3-speech/#voice-family",
      "syntax": "[ <age>? <gender> <integer>? ]"
    },
    "gender": {
      "comment": "https://www.w3.org/TR/css3-speech/#voice-family",
      "syntax": "male | female | neutral"
    },
    "generic-family": {
      "comment": "added -apple-system",
      "references": [
        "https://webkit.org/blog/3709/using-the-system-font-in-web-content/"
      ],
      "syntax": "serif | sans-serif | cursive | fantasy | monospace | -apple-system"
    },
    "gradient": {
      "comment": "added legacy syntaxes support",
      "syntax": "<linear-gradient()> | <repeating-linear-gradient()> | <radial-gradient()> | <repeating-radial-gradient()> | <conic-gradient()> | <-legacy-gradient>"
    },
    "left": {
      "comment": "missed; not sure we should add it, but no others except `shape` is using it so it's ok for now; https://drafts.fxtf.org/css-masking-1/#funcdef-clip-rect",
      "syntax": "<length> | auto"
    },
    "mask-image": {
      "comment": "missed; https://drafts.fxtf.org/css-masking-1/#the-mask-image",
      "syntax": "<mask-reference>#"
    },
    "name-repeat": {
      "comment": "missed, and looks like obsolete, keep it as is since other property syntaxes should be changed too; https://www.w3.org/TR/2015/WD-css-grid-1-20150917/#typedef-name-repeat",
      "syntax": "repeat( [ <positive-integer> | auto-fill ], <line-names>+)"
    },
    "named-color": {
      "comment": "added non standard color names",
      "syntax": "transparent | aliceblue | antiquewhite | aqua | aquamarine | azure | beige | bisque | black | blanchedalmond | blue | blueviolet | brown | burlywood | cadetblue | chartreuse | chocolate | coral | cornflowerblue | cornsilk | crimson | cyan | darkblue | darkcyan | darkgoldenrod | darkgray | darkgreen | darkgrey | darkkhaki | darkmagenta | darkolivegreen | darkorange | darkorchid | darkred | darksalmon | darkseagreen | darkslateblue | darkslategray | darkslategrey | darkturquoise | darkviolet | deeppink | deepskyblue | dimgray | dimgrey | dodgerblue | firebrick | floralwhite | forestgreen | fuchsia | gainsboro | ghostwhite | gold | goldenrod | gray | green | greenyellow | grey | honeydew | hotpink | indianred | indigo | ivory | khaki | lavender | lavenderblush | lawngreen | lemonchiffon | lightblue | lightcoral | lightcyan | lightgoldenrodyellow | lightgray | lightgreen | lightgrey | lightpink | lightsalmon | lightseagreen | lightskyblue | lightslategray | lightslategrey | lightsteelblue | lightyellow | lime | limegreen | linen | magenta | maroon | mediumaquamarine | mediumblue | mediumorchid | mediumpurple | mediumseagreen | mediumslateblue | mediumspringgreen | mediumturquoise | mediumvioletred | midnightblue | mintcream | mistyrose | moccasin | navajowhite | navy | oldlace | olive | olivedrab | orange | orangered | orchid | palegoldenrod | palegreen | paleturquoise | palevioletred | papayawhip | peachpuff | peru | pink | plum | powderblue | purple | rebeccapurple | red | rosybrown | royalblue | saddlebrown | salmon | sandybrown | seagreen | seashell | sienna | silver | skyblue | slateblue | slategray | slategrey | snow | springgreen | steelblue | tan | teal | thistle | tomato | turquoise | violet | wheat | white | whitesmoke | yellow | yellowgreen | <-non-standard-color>"
    },
    "paint": {
      "comment": "used by SVG https://www.w3.org/TR/SVG/painting.html#SpecifyingPaint",
      "syntax": "none | <color> | <url> [ none | <color> ]? | context-fill | context-stroke"
    },
    "path()": {
      "comment": "missed, `motion` property was renamed, but left it as is for now; path() syntax was get from last draft https://drafts.fxtf.org/motion-1/#funcdef-offset-path-path",
      "syntax": "path( <string> )"
    },
    "ratio": {
      "comment": "missed, https://drafts.csswg.org/mediaqueries-4/#typedef-ratio",
      "syntax": "<integer> / <integer>"
    },
    "right": {
      "comment": "missed; not sure we should add it, but no others except `shape` is using it so it's ok for now; https://drafts.fxtf.org/css-masking-1/#funcdef-clip-rect",
      "syntax": "<length> | auto"
    },
    "shape": {
      "comment": "missed spaces in function body and add backwards compatible syntax",
      "syntax": "rect( <top>, <right>, <bottom>, <left> ) | rect( <top> <right> <bottom> <left> )"
    },
    "svg-length": {
      "comment": "All coordinates and lengths in SVG can be specified with or without a unit identifier",
      "references": [
        "https://www.w3.org/TR/SVG11/coords.html#Units"
      ],
      "syntax": "<percentage> | <length> | <number>"
    },
    "svg-writing-mode": {
      "comment": "SVG specific keywords (deprecated for CSS)",
      "references": [
        "https://developer.mozilla.org/en/docs/Web/CSS/writing-mode",
        "https://www.w3.org/TR/SVG/text.html#WritingModeProperty"
      ],
      "syntax": "lr-tb | rl-tb | tb-rl | lr | rl | tb"
    },
    "top": {
      "comment": "missed; not sure we should add it, but no others except `shape` is using it so it's ok for now; https://drafts.fxtf.org/css-masking-1/#funcdef-clip-rect",
      "syntax": "<length> | auto"
    },
    "x": {
      "comment": "missed; not sure we should add it, but no others except `cursor` is using it so it's ok for now; https://drafts.csswg.org/css-ui-3/#cursor",
      "syntax": "<number>"
    },
    "y": {
      "comment": "missed; not sure we should add it, but no others except `cursor` is using so it's ok for now; https://drafts.csswg.org/css-ui-3/#cursor",
      "syntax": "<number>"
    },
    "declaration": {
      "comment": "missed, restored by https://drafts.csswg.org/css-syntax",
      "syntax": "<ident-token> : <declaration-value>? [ '!' important ]?"
    },
    "declaration-list": {
      "comment": "missed, restored by https://drafts.csswg.org/css-syntax",
      "syntax": "[ <declaration>? ';' ]* <declaration>?"
    },
    "url": {
      "comment": "https://drafts.csswg.org/css-values-4/#urls",
      "syntax": "url( <string> <url-modifier>* ) | <url-token>"
    },
    "url-modifier": {
      "comment": "https://drafts.csswg.org/css-values-4/#typedef-url-modifier",
      "syntax": "<ident> | <function-token> <any-value> )"
    },
    "number-zero-one": {
      "syntax": "<number [0,1]>"
    },
    "number-one-or-greater": {
      "syntax": "<number [1,∞]>"
    },
    "positive-integer": {
      "syntax": "<integer [0,∞]>"
    }
  }
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294313, function(require, module, exports) {
module.exports = {
    AnPlusB: require('./AnPlusB'),
    Atrule: require('./Atrule'),
    AtrulePrelude: require('./AtrulePrelude'),
    AttributeSelector: require('./AttributeSelector'),
    Block: require('./Block'),
    Brackets: require('./Brackets'),
    CDC: require('./CDC'),
    CDO: require('./CDO'),
    ClassSelector: require('./ClassSelector'),
    Combinator: require('./Combinator'),
    Comment: require('./Comment'),
    Declaration: require('./Declaration'),
    DeclarationList: require('./DeclarationList'),
    Dimension: require('./Dimension'),
    Function: require('./Function'),
    HexColor: require('./HexColor'),
    Identifier: require('./Identifier'),
    IdSelector: require('./IdSelector'),
    MediaFeature: require('./MediaFeature'),
    MediaQuery: require('./MediaQuery'),
    MediaQueryList: require('./MediaQueryList'),
    Nth: require('./Nth'),
    Number: require('./Number'),
    Operator: require('./Operator'),
    Parentheses: require('./Parentheses'),
    Percentage: require('./Percentage'),
    PseudoClassSelector: require('./PseudoClassSelector'),
    PseudoElementSelector: require('./PseudoElementSelector'),
    Ratio: require('./Ratio'),
    Raw: require('./Raw'),
    Rule: require('./Rule'),
    Selector: require('./Selector'),
    SelectorList: require('./SelectorList'),
    String: require('./String'),
    StyleSheet: require('./StyleSheet'),
    TypeSelector: require('./TypeSelector'),
    UnicodeRange: require('./UnicodeRange'),
    Url: require('./Url'),
    Value: require('./Value'),
    WhiteSpace: require('./WhiteSpace')
};

}, function(modId) { var map = {"./AnPlusB":1597942294314,"./Atrule":1597942294315,"./AtrulePrelude":1597942294317,"./AttributeSelector":1597942294318,"./Block":1597942294319,"./Brackets":1597942294320,"./CDC":1597942294321,"./CDO":1597942294322,"./ClassSelector":1597942294323,"./Combinator":1597942294324,"./Comment":1597942294325,"./Declaration":1597942294326,"./DeclarationList":1597942294327,"./Dimension":1597942294328,"./Function":1597942294329,"./HexColor":1597942294330,"./Identifier":1597942294331,"./IdSelector":1597942294332,"./MediaFeature":1597942294333,"./MediaQuery":1597942294334,"./MediaQueryList":1597942294335,"./Nth":1597942294336,"./Number":1597942294337,"./Operator":1597942294338,"./Parentheses":1597942294339,"./Percentage":1597942294340,"./PseudoClassSelector":1597942294341,"./PseudoElementSelector":1597942294342,"./Ratio":1597942294343,"./Raw":1597942294316,"./Rule":1597942294344,"./Selector":1597942294345,"./SelectorList":1597942294346,"./String":1597942294347,"./StyleSheet":1597942294348,"./TypeSelector":1597942294349,"./UnicodeRange":1597942294350,"./Url":1597942294351,"./Value":1597942294352,"./WhiteSpace":1597942294353}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294314, function(require, module, exports) {
var cmpChar = require('../../tokenizer').cmpChar;
var isDigit = require('../../tokenizer').isDigit;
var TYPE = require('../../tokenizer').TYPE;

var WHITESPACE = TYPE.WhiteSpace;
var COMMENT = TYPE.Comment;
var IDENT = TYPE.Ident;
var NUMBER = TYPE.Number;
var DIMENSION = TYPE.Dimension;
var PLUSSIGN = 0x002B;    // U+002B PLUS SIGN (+)
var HYPHENMINUS = 0x002D; // U+002D HYPHEN-MINUS (-)
var N = 0x006E;           // U+006E LATIN SMALL LETTER N (n)
var DISALLOW_SIGN = true;
var ALLOW_SIGN = false;

function checkInteger(offset, disallowSign) {
    var pos = this.scanner.tokenStart + offset;
    var code = this.scanner.source.charCodeAt(pos);

    if (code === PLUSSIGN || code === HYPHENMINUS) {
        if (disallowSign) {
            this.error('Number sign is not allowed');
        }
        pos++;
    }

    for (; pos < this.scanner.tokenEnd; pos++) {
        if (!isDigit(this.scanner.source.charCodeAt(pos))) {
            this.error('Integer is expected', pos);
        }
    }
}

function checkTokenIsInteger(disallowSign) {
    return checkInteger.call(this, 0, disallowSign);
}

function expectCharCode(offset, code) {
    if (!cmpChar(this.scanner.source, this.scanner.tokenStart + offset, code)) {
        var msg = '';

        switch (code) {
            case N:
                msg = 'N is expected';
                break;
            case HYPHENMINUS:
                msg = 'HyphenMinus is expected';
                break;
        }

        this.error(msg, this.scanner.tokenStart + offset);
    }
}

// ... <signed-integer>
// ... ['+' | '-'] <signless-integer>
function consumeB() {
    var offset = 0;
    var sign = 0;
    var type = this.scanner.tokenType;

    while (type === WHITESPACE || type === COMMENT) {
        type = this.scanner.lookupType(++offset);
    }

    if (type !== NUMBER) {
        if (this.scanner.isDelim(PLUSSIGN, offset) ||
            this.scanner.isDelim(HYPHENMINUS, offset)) {
            sign = this.scanner.isDelim(PLUSSIGN, offset) ? PLUSSIGN : HYPHENMINUS;

            do {
                type = this.scanner.lookupType(++offset);
            } while (type === WHITESPACE || type === COMMENT);

            if (type !== NUMBER) {
                this.scanner.skip(offset);
                checkTokenIsInteger.call(this, DISALLOW_SIGN);
            }
        } else {
            return null;
        }
    }

    if (offset > 0) {
        this.scanner.skip(offset);
    }

    if (sign === 0) {
        type = this.scanner.source.charCodeAt(this.scanner.tokenStart);
        if (type !== PLUSSIGN && type !== HYPHENMINUS) {
            this.error('Number sign is expected');
        }
    }

    checkTokenIsInteger.call(this, sign !== 0);
    return sign === HYPHENMINUS ? '-' + this.consume(NUMBER) : this.consume(NUMBER);
}

// An+B microsyntax https://www.w3.org/TR/css-syntax-3/#anb
module.exports = {
    name: 'AnPlusB',
    structure: {
        a: [String, null],
        b: [String, null]
    },
    parse: function() {
        /* eslint-disable brace-style*/
        var start = this.scanner.tokenStart;
        var a = null;
        var b = null;

        // <integer>
        if (this.scanner.tokenType === NUMBER) {
            checkTokenIsInteger.call(this, ALLOW_SIGN);
            b = this.consume(NUMBER);
        }

        // -n
        // -n <signed-integer>
        // -n ['+' | '-'] <signless-integer>
        // -n- <signless-integer>
        // <dashndashdigit-ident>
        else if (this.scanner.tokenType === IDENT && cmpChar(this.scanner.source, this.scanner.tokenStart, HYPHENMINUS)) {
            a = '-1';

            expectCharCode.call(this, 1, N);

            switch (this.scanner.getTokenLength()) {
                // -n
                // -n <signed-integer>
                // -n ['+' | '-'] <signless-integer>
                case 2:
                    this.scanner.next();
                    b = consumeB.call(this);
                    break;

                // -n- <signless-integer>
                case 3:
                    expectCharCode.call(this, 2, HYPHENMINUS);

                    this.scanner.next();
                    this.scanner.skipSC();

                    checkTokenIsInteger.call(this, DISALLOW_SIGN);

                    b = '-' + this.consume(NUMBER);
                    break;

                // <dashndashdigit-ident>
                default:
                    expectCharCode.call(this, 2, HYPHENMINUS);
                    checkInteger.call(this, 3, DISALLOW_SIGN);
                    this.scanner.next();

                    b = this.scanner.substrToCursor(start + 2);
            }
        }

        // '+'? n
        // '+'? n <signed-integer>
        // '+'? n ['+' | '-'] <signless-integer>
        // '+'? n- <signless-integer>
        // '+'? <ndashdigit-ident>
        else if (this.scanner.tokenType === IDENT || (this.scanner.isDelim(PLUSSIGN) && this.scanner.lookupType(1) === IDENT)) {
            var sign = 0;
            a = '1';

            // just ignore a plus
            if (this.scanner.isDelim(PLUSSIGN)) {
                sign = 1;
                this.scanner.next();
            }

            expectCharCode.call(this, 0, N);

            switch (this.scanner.getTokenLength()) {
                // '+'? n
                // '+'? n <signed-integer>
                // '+'? n ['+' | '-'] <signless-integer>
                case 1:
                    this.scanner.next();
                    b = consumeB.call(this);
                    break;

                // '+'? n- <signless-integer>
                case 2:
                    expectCharCode.call(this, 1, HYPHENMINUS);

                    this.scanner.next();
                    this.scanner.skipSC();

                    checkTokenIsInteger.call(this, DISALLOW_SIGN);

                    b = '-' + this.consume(NUMBER);
                    break;

                // '+'? <ndashdigit-ident>
                default:
                    expectCharCode.call(this, 1, HYPHENMINUS);
                    checkInteger.call(this, 2, DISALLOW_SIGN);
                    this.scanner.next();

                    b = this.scanner.substrToCursor(start + sign + 1);
            }
        }

        // <ndashdigit-dimension>
        // <ndash-dimension> <signless-integer>
        // <n-dimension>
        // <n-dimension> <signed-integer>
        // <n-dimension> ['+' | '-'] <signless-integer>
        else if (this.scanner.tokenType === DIMENSION) {
            var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
            var sign = code === PLUSSIGN || code === HYPHENMINUS;

            for (var i = this.scanner.tokenStart + sign; i < this.scanner.tokenEnd; i++) {
                if (!isDigit(this.scanner.source.charCodeAt(i))) {
                    break;
                }
            }

            if (i === this.scanner.tokenStart + sign) {
                this.error('Integer is expected', this.scanner.tokenStart + sign);
            }

            expectCharCode.call(this, i - this.scanner.tokenStart, N);
            a = this.scanner.source.substring(start, i);

            // <n-dimension>
            // <n-dimension> <signed-integer>
            // <n-dimension> ['+' | '-'] <signless-integer>
            if (i + 1 === this.scanner.tokenEnd) {
                this.scanner.next();
                b = consumeB.call(this);
            } else {
                expectCharCode.call(this, i - this.scanner.tokenStart + 1, HYPHENMINUS);

                // <ndash-dimension> <signless-integer>
                if (i + 2 === this.scanner.tokenEnd) {
                    this.scanner.next();
                    this.scanner.skipSC();
                    checkTokenIsInteger.call(this, DISALLOW_SIGN);
                    b = '-' + this.consume(NUMBER);
                }
                // <ndashdigit-dimension>
                else {
                    checkInteger.call(this, i - this.scanner.tokenStart + 2, DISALLOW_SIGN);
                    this.scanner.next();
                    b = this.scanner.substrToCursor(i + 1);
                }
            }
        } else {
            this.error();
        }

        if (a !== null && a.charCodeAt(0) === PLUSSIGN) {
            a = a.substr(1);
        }

        if (b !== null && b.charCodeAt(0) === PLUSSIGN) {
            b = b.substr(1);
        }

        return {
            type: 'AnPlusB',
            loc: this.getLocation(start, this.scanner.tokenStart),
            a: a,
            b: b
        };
    },
    generate: function(node) {
        var a = node.a !== null && node.a !== undefined;
        var b = node.b !== null && node.b !== undefined;

        if (a) {
            this.chunk(
                node.a === '+1' ? '+n' : // eslint-disable-line operator-linebreak, indent
                node.a ===  '1' ?  'n' : // eslint-disable-line operator-linebreak, indent
                node.a === '-1' ? '-n' : // eslint-disable-line operator-linebreak, indent
                node.a + 'n'             // eslint-disable-line operator-linebreak, indent
            );

            if (b) {
                b = String(node.b);
                if (b.charAt(0) === '-' || b.charAt(0) === '+') {
                    this.chunk(b.charAt(0));
                    this.chunk(b.substr(1));
                } else {
                    this.chunk('+');
                    this.chunk(b);
                }
            }
        } else {
            this.chunk(String(node.b));
        }
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294315, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;
var rawMode = require('./Raw').mode;

var ATKEYWORD = TYPE.AtKeyword;
var SEMICOLON = TYPE.Semicolon;
var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;
var RIGHTCURLYBRACKET = TYPE.RightCurlyBracket;

function consumeRaw(startToken) {
    return this.Raw(startToken, rawMode.leftCurlyBracketOrSemicolon, true);
}

function isDeclarationBlockAtrule() {
    for (var offset = 1, type; type = this.scanner.lookupType(offset); offset++) {
        if (type === RIGHTCURLYBRACKET) {
            return true;
        }

        if (type === LEFTCURLYBRACKET ||
            type === ATKEYWORD) {
            return false;
        }
    }

    return false;
}

module.exports = {
    name: 'Atrule',
    structure: {
        name: String,
        prelude: ['AtrulePrelude', 'Raw', null],
        block: ['Block', null]
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var name;
        var nameLowerCase;
        var prelude = null;
        var block = null;

        this.eat(ATKEYWORD);

        name = this.scanner.substrToCursor(start + 1);
        nameLowerCase = name.toLowerCase();
        this.scanner.skipSC();

        // parse prelude
        if (this.scanner.eof === false &&
            this.scanner.tokenType !== LEFTCURLYBRACKET &&
            this.scanner.tokenType !== SEMICOLON) {
            if (this.parseAtrulePrelude) {
                prelude = this.parseWithFallback(this.AtrulePrelude.bind(this, name), consumeRaw);

                // turn empty AtrulePrelude into null
                if (prelude.type === 'AtrulePrelude' && prelude.children.head === null) {
                    prelude = null;
                }
            } else {
                prelude = consumeRaw.call(this, this.scanner.tokenIndex);
            }

            this.scanner.skipSC();
        }

        switch (this.scanner.tokenType) {
            case SEMICOLON:
                this.scanner.next();
                break;

            case LEFTCURLYBRACKET:
                if (this.atrule.hasOwnProperty(nameLowerCase) &&
                    typeof this.atrule[nameLowerCase].block === 'function') {
                    block = this.atrule[nameLowerCase].block.call(this);
                } else {
                    // TODO: should consume block content as Raw?
                    block = this.Block(isDeclarationBlockAtrule.call(this));
                }

                break;
        }

        return {
            type: 'Atrule',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            prelude: prelude,
            block: block
        };
    },
    generate: function(node) {
        this.chunk('@');
        this.chunk(node.name);

        if (node.prelude !== null) {
            this.chunk(' ');
            this.node(node.prelude);
        }

        if (node.block) {
            this.node(node.block);
        } else {
            this.chunk(';');
        }
    },
    walkContext: 'atrule'
};

}, function(modId) { var map = {"../../tokenizer":1597942294286,"./Raw":1597942294316}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294316, function(require, module, exports) {
var tokenizer = require('../../tokenizer');
var TYPE = tokenizer.TYPE;

var WhiteSpace = TYPE.WhiteSpace;
var Semicolon = TYPE.Semicolon;
var LeftCurlyBracket = TYPE.LeftCurlyBracket;
var Delim = TYPE.Delim;
var EXCLAMATIONMARK = 0x0021; // U+0021 EXCLAMATION MARK (!)

function getOffsetExcludeWS() {
    if (this.scanner.tokenIndex > 0) {
        if (this.scanner.lookupType(-1) === WhiteSpace) {
            return this.scanner.tokenIndex > 1
                ? this.scanner.getTokenStart(this.scanner.tokenIndex - 1)
                : this.scanner.firstCharOffset;
        }
    }

    return this.scanner.tokenStart;
}

// 0, 0, false
function balanceEnd() {
    return 0;
}

// LEFTCURLYBRACKET, 0, false
function leftCurlyBracket(tokenType) {
    return tokenType === LeftCurlyBracket ? 1 : 0;
}

// LEFTCURLYBRACKET, SEMICOLON, false
function leftCurlyBracketOrSemicolon(tokenType) {
    return tokenType === LeftCurlyBracket || tokenType === Semicolon ? 1 : 0;
}

// EXCLAMATIONMARK, SEMICOLON, false
function exclamationMarkOrSemicolon(tokenType, source, offset) {
    if (tokenType === Delim && source.charCodeAt(offset) === EXCLAMATIONMARK) {
        return 1;
    }

    return tokenType === Semicolon ? 1 : 0;
}

// 0, SEMICOLON, true
function semicolonIncluded(tokenType) {
    return tokenType === Semicolon ? 2 : 0;
}

module.exports = {
    name: 'Raw',
    structure: {
        value: String
    },
    parse: function(startToken, mode, excludeWhiteSpace) {
        var startOffset = this.scanner.getTokenStart(startToken);
        var endOffset;

        this.scanner.skip(
            this.scanner.getRawLength(startToken, mode || balanceEnd)
        );

        if (excludeWhiteSpace && this.scanner.tokenStart > startOffset) {
            endOffset = getOffsetExcludeWS.call(this);
        } else {
            endOffset = this.scanner.tokenStart;
        }

        return {
            type: 'Raw',
            loc: this.getLocation(startOffset, endOffset),
            value: this.scanner.source.substring(startOffset, endOffset)
        };
    },
    generate: function(node) {
        this.chunk(node.value);
    },

    mode: {
        default: balanceEnd,
        leftCurlyBracket: leftCurlyBracket,
        leftCurlyBracketOrSemicolon: leftCurlyBracketOrSemicolon,
        exclamationMarkOrSemicolon: exclamationMarkOrSemicolon,
        semicolonIncluded: semicolonIncluded
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294317, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var SEMICOLON = TYPE.Semicolon;
var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;

module.exports = {
    name: 'AtrulePrelude',
    structure: {
        children: [[]]
    },
    parse: function(name) {
        var children = null;

        if (name !== null) {
            name = name.toLowerCase();
        }

        this.scanner.skipSC();

        if (this.atrule.hasOwnProperty(name) &&
            typeof this.atrule[name].prelude === 'function') {
            // custom consumer
            children = this.atrule[name].prelude.call(this);
        } else {
            // default consumer
            children = this.readSequence(this.scope.AtrulePrelude);
        }

        this.scanner.skipSC();

        if (this.scanner.eof !== true &&
            this.scanner.tokenType !== LEFTCURLYBRACKET &&
            this.scanner.tokenType !== SEMICOLON) {
            this.error('Semicolon or block is expected');
        }

        if (children === null) {
            children = this.createList();
        }

        return {
            type: 'AtrulePrelude',
            loc: this.getLocationFromList(children),
            children: children
        };
    },
    generate: function(node) {
        this.children(node);
    },
    walkContext: 'atrulePrelude'
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294318, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var IDENT = TYPE.Ident;
var STRING = TYPE.String;
var COLON = TYPE.Colon;
var LEFTSQUAREBRACKET = TYPE.LeftSquareBracket;
var RIGHTSQUAREBRACKET = TYPE.RightSquareBracket;
var DOLLARSIGN = 0x0024;       // U+0024 DOLLAR SIGN ($)
var ASTERISK = 0x002A;         // U+002A ASTERISK (*)
var EQUALSSIGN = 0x003D;       // U+003D EQUALS SIGN (=)
var CIRCUMFLEXACCENT = 0x005E; // U+005E (^)
var VERTICALLINE = 0x007C;     // U+007C VERTICAL LINE (|)
var TILDE = 0x007E;            // U+007E TILDE (~)

function getAttributeName() {
    if (this.scanner.eof) {
        this.error('Unexpected end of input');
    }

    var start = this.scanner.tokenStart;
    var expectIdent = false;
    var checkColon = true;

    if (this.scanner.isDelim(ASTERISK)) {
        expectIdent = true;
        checkColon = false;
        this.scanner.next();
    } else if (!this.scanner.isDelim(VERTICALLINE)) {
        this.eat(IDENT);
    }

    if (this.scanner.isDelim(VERTICALLINE)) {
        if (this.scanner.source.charCodeAt(this.scanner.tokenStart + 1) !== EQUALSSIGN) {
            this.scanner.next();
            this.eat(IDENT);
        } else if (expectIdent) {
            this.error('Identifier is expected', this.scanner.tokenEnd);
        }
    } else if (expectIdent) {
        this.error('Vertical line is expected');
    }

    if (checkColon && this.scanner.tokenType === COLON) {
        this.scanner.next();
        this.eat(IDENT);
    }

    return {
        type: 'Identifier',
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: this.scanner.substrToCursor(start)
    };
}

function getOperator() {
    var start = this.scanner.tokenStart;
    var code = this.scanner.source.charCodeAt(start);

    if (code !== EQUALSSIGN &&        // =
        code !== TILDE &&             // ~=
        code !== CIRCUMFLEXACCENT &&  // ^=
        code !== DOLLARSIGN &&        // $=
        code !== ASTERISK &&          // *=
        code !== VERTICALLINE         // |=
    ) {
        this.error('Attribute selector (=, ~=, ^=, $=, *=, |=) is expected');
    }

    this.scanner.next();

    if (code !== EQUALSSIGN) {
        if (!this.scanner.isDelim(EQUALSSIGN)) {
            this.error('Equal sign is expected');
        }

        this.scanner.next();
    }

    return this.scanner.substrToCursor(start);
}

// '[' <wq-name> ']'
// '[' <wq-name> <attr-matcher> [ <string-token> | <ident-token> ] <attr-modifier>? ']'
module.exports = {
    name: 'AttributeSelector',
    structure: {
        name: 'Identifier',
        matcher: [String, null],
        value: ['String', 'Identifier', null],
        flags: [String, null]
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var name;
        var matcher = null;
        var value = null;
        var flags = null;

        this.eat(LEFTSQUAREBRACKET);
        this.scanner.skipSC();

        name = getAttributeName.call(this);
        this.scanner.skipSC();

        if (this.scanner.tokenType !== RIGHTSQUAREBRACKET) {
            // avoid case `[name i]`
            if (this.scanner.tokenType !== IDENT) {
                matcher = getOperator.call(this);

                this.scanner.skipSC();

                value = this.scanner.tokenType === STRING
                    ? this.String()
                    : this.Identifier();

                this.scanner.skipSC();
            }

            // attribute flags
            if (this.scanner.tokenType === IDENT) {
                flags = this.scanner.getTokenValue();
                this.scanner.next();

                this.scanner.skipSC();
            }
        }

        this.eat(RIGHTSQUAREBRACKET);

        return {
            type: 'AttributeSelector',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            matcher: matcher,
            value: value,
            flags: flags
        };
    },
    generate: function(node) {
        var flagsPrefix = ' ';

        this.chunk('[');
        this.node(node.name);

        if (node.matcher !== null) {
            this.chunk(node.matcher);

            if (node.value !== null) {
                this.node(node.value);

                // space between string and flags is not required
                if (node.value.type === 'String') {
                    flagsPrefix = '';
                }
            }
        }

        if (node.flags !== null) {
            this.chunk(flagsPrefix);
            this.chunk(node.flags);
        }

        this.chunk(']');
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294319, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;
var rawMode = require('./Raw').mode;

var WHITESPACE = TYPE.WhiteSpace;
var COMMENT = TYPE.Comment;
var SEMICOLON = TYPE.Semicolon;
var ATKEYWORD = TYPE.AtKeyword;
var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;
var RIGHTCURLYBRACKET = TYPE.RightCurlyBracket;

function consumeRaw(startToken) {
    return this.Raw(startToken, null, true);
}
function consumeRule() {
    return this.parseWithFallback(this.Rule, consumeRaw);
}
function consumeRawDeclaration(startToken) {
    return this.Raw(startToken, rawMode.semicolonIncluded, true);
}
function consumeDeclaration() {
    if (this.scanner.tokenType === SEMICOLON) {
        return consumeRawDeclaration.call(this, this.scanner.tokenIndex);
    }

    var node = this.parseWithFallback(this.Declaration, consumeRawDeclaration);

    if (this.scanner.tokenType === SEMICOLON) {
        this.scanner.next();
    }

    return node;
}

module.exports = {
    name: 'Block',
    structure: {
        children: [[
            'Atrule',
            'Rule',
            'Declaration'
        ]]
    },
    parse: function(isDeclaration) {
        var consumer = isDeclaration ? consumeDeclaration : consumeRule;

        var start = this.scanner.tokenStart;
        var children = this.createList();

        this.eat(LEFTCURLYBRACKET);

        scan:
        while (!this.scanner.eof) {
            switch (this.scanner.tokenType) {
                case RIGHTCURLYBRACKET:
                    break scan;

                case WHITESPACE:
                case COMMENT:
                    this.scanner.next();
                    break;

                case ATKEYWORD:
                    children.push(this.parseWithFallback(this.Atrule, consumeRaw));
                    break;

                default:
                    children.push(consumer.call(this));
            }
        }

        if (!this.scanner.eof) {
            this.eat(RIGHTCURLYBRACKET);
        }

        return {
            type: 'Block',
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
        };
    },
    generate: function(node) {
        this.chunk('{');
        this.children(node, function(prev) {
            if (prev.type === 'Declaration') {
                this.chunk(';');
            }
        });
        this.chunk('}');
    },
    walkContext: 'block'
};

}, function(modId) { var map = {"../../tokenizer":1597942294286,"./Raw":1597942294316}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294320, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var LEFTSQUAREBRACKET = TYPE.LeftSquareBracket;
var RIGHTSQUAREBRACKET = TYPE.RightSquareBracket;

module.exports = {
    name: 'Brackets',
    structure: {
        children: [[]]
    },
    parse: function(readSequence, recognizer) {
        var start = this.scanner.tokenStart;
        var children = null;

        this.eat(LEFTSQUAREBRACKET);

        children = readSequence.call(this, recognizer);

        if (!this.scanner.eof) {
            this.eat(RIGHTSQUAREBRACKET);
        }

        return {
            type: 'Brackets',
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
        };
    },
    generate: function(node) {
        this.chunk('[');
        this.children(node);
        this.chunk(']');
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294321, function(require, module, exports) {
var CDC = require('../../tokenizer').TYPE.CDC;

module.exports = {
    name: 'CDC',
    structure: [],
    parse: function() {
        var start = this.scanner.tokenStart;

        this.eat(CDC); // -->

        return {
            type: 'CDC',
            loc: this.getLocation(start, this.scanner.tokenStart)
        };
    },
    generate: function() {
        this.chunk('-->');
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294322, function(require, module, exports) {
var CDO = require('../../tokenizer').TYPE.CDO;

module.exports = {
    name: 'CDO',
    structure: [],
    parse: function() {
        var start = this.scanner.tokenStart;

        this.eat(CDO); // <!--

        return {
            type: 'CDO',
            loc: this.getLocation(start, this.scanner.tokenStart)
        };
    },
    generate: function() {
        this.chunk('<!--');
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294323, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var IDENT = TYPE.Ident;
var FULLSTOP = 0x002E; // U+002E FULL STOP (.)

// '.' ident
module.exports = {
    name: 'ClassSelector',
    structure: {
        name: String
    },
    parse: function() {
        if (!this.scanner.isDelim(FULLSTOP)) {
            this.error('Full stop is expected');
        }

        this.scanner.next();

        return {
            type: 'ClassSelector',
            loc: this.getLocation(this.scanner.tokenStart - 1, this.scanner.tokenEnd),
            name: this.consume(IDENT)
        };
    },
    generate: function(node) {
        this.chunk('.');
        this.chunk(node.name);
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294324, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var IDENT = TYPE.Ident;
var PLUSSIGN = 0x002B;        // U+002B PLUS SIGN (+)
var SOLIDUS = 0x002F;         // U+002F SOLIDUS (/)
var GREATERTHANSIGN = 0x003E; // U+003E GREATER-THAN SIGN (>)
var TILDE = 0x007E;           // U+007E TILDE (~)

// + | > | ~ | /deep/
module.exports = {
    name: 'Combinator',
    structure: {
        name: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);

        switch (code) {
            case GREATERTHANSIGN:
            case PLUSSIGN:
            case TILDE:
                this.scanner.next();
                break;

            case SOLIDUS:
                this.scanner.next();

                if (this.scanner.tokenType !== IDENT || this.scanner.lookupValue(0, 'deep') === false) {
                    this.error('Identifier `deep` is expected');
                }

                this.scanner.next();

                if (!this.scanner.isDelim(SOLIDUS)) {
                    this.error('Solidus is expected');
                }

                this.scanner.next();
                break;

            default:
                this.error('Combinator is expected');
        }

        return {
            type: 'Combinator',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: this.scanner.substrToCursor(start)
        };
    },
    generate: function(node) {
        this.chunk(node.name);
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294325, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var COMMENT = TYPE.Comment;
var ASTERISK = 0x002A;        // U+002A ASTERISK (*)
var SOLIDUS = 0x002F;         // U+002F SOLIDUS (/)

// '/*' .* '*/'
module.exports = {
    name: 'Comment',
    structure: {
        value: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var end = this.scanner.tokenEnd;

        this.eat(COMMENT);

        if ((end - start + 2) >= 2 &&
            this.scanner.source.charCodeAt(end - 2) === ASTERISK &&
            this.scanner.source.charCodeAt(end - 1) === SOLIDUS) {
            end -= 2;
        }

        return {
            type: 'Comment',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.source.substring(start + 2, end)
        };
    },
    generate: function(node) {
        this.chunk('/*');
        this.chunk(node.value);
        this.chunk('*/');
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294326, function(require, module, exports) {
var isCustomProperty = require('../../utils/names').isCustomProperty;
var TYPE = require('../../tokenizer').TYPE;
var rawMode = require('./Raw').mode;

var IDENT = TYPE.Ident;
var HASH = TYPE.Hash;
var COLON = TYPE.Colon;
var SEMICOLON = TYPE.Semicolon;
var DELIM = TYPE.Delim;
var EXCLAMATIONMARK = 0x0021; // U+0021 EXCLAMATION MARK (!)
var NUMBERSIGN = 0x0023;      // U+0023 NUMBER SIGN (#)
var DOLLARSIGN = 0x0024;      // U+0024 DOLLAR SIGN ($)
var AMPERSAND = 0x0026;       // U+0026 ANPERSAND (&)
var ASTERISK = 0x002A;        // U+002A ASTERISK (*)
var PLUSSIGN = 0x002B;        // U+002B PLUS SIGN (+)
var SOLIDUS = 0x002F;         // U+002F SOLIDUS (/)

function consumeValueRaw(startToken) {
    return this.Raw(startToken, rawMode.exclamationMarkOrSemicolon, true);
}

function consumeCustomPropertyRaw(startToken) {
    return this.Raw(startToken, rawMode.exclamationMarkOrSemicolon, false);
}

function consumeValue() {
    var startValueToken = this.scanner.tokenIndex;
    var value = this.Value();

    if (value.type !== 'Raw' &&
        this.scanner.eof === false &&
        this.scanner.tokenType !== SEMICOLON &&
        this.scanner.isDelim(EXCLAMATIONMARK) === false &&
        this.scanner.isBalanceEdge(startValueToken) === false) {
        this.error();
    }

    return value;
}

module.exports = {
    name: 'Declaration',
    structure: {
        important: [Boolean, String],
        property: String,
        value: ['Value', 'Raw']
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var startToken = this.scanner.tokenIndex;
        var property = readProperty.call(this);
        var customProperty = isCustomProperty(property);
        var parseValue = customProperty ? this.parseCustomProperty : this.parseValue;
        var consumeRaw = customProperty ? consumeCustomPropertyRaw : consumeValueRaw;
        var important = false;
        var value;

        this.scanner.skipSC();
        this.eat(COLON);

        if (!customProperty) {
            this.scanner.skipSC();
        }

        if (parseValue) {
            value = this.parseWithFallback(consumeValue, consumeRaw);
        } else {
            value = consumeRaw.call(this, this.scanner.tokenIndex);
        }

        if (this.scanner.isDelim(EXCLAMATIONMARK)) {
            important = getImportant.call(this);
            this.scanner.skipSC();
        }

        // Do not include semicolon to range per spec
        // https://drafts.csswg.org/css-syntax/#declaration-diagram

        if (this.scanner.eof === false &&
            this.scanner.tokenType !== SEMICOLON &&
            this.scanner.isBalanceEdge(startToken) === false) {
            this.error();
        }

        return {
            type: 'Declaration',
            loc: this.getLocation(start, this.scanner.tokenStart),
            important: important,
            property: property,
            value: value
        };
    },
    generate: function(node) {
        this.chunk(node.property);
        this.chunk(':');
        this.node(node.value);

        if (node.important) {
            this.chunk(node.important === true ? '!important' : '!' + node.important);
        }
    },
    walkContext: 'declaration'
};

function readProperty() {
    var start = this.scanner.tokenStart;
    var prefix = 0;

    // hacks
    if (this.scanner.tokenType === DELIM) {
        switch (this.scanner.source.charCodeAt(this.scanner.tokenStart)) {
            case ASTERISK:
            case DOLLARSIGN:
            case PLUSSIGN:
            case NUMBERSIGN:
            case AMPERSAND:
                this.scanner.next();
                break;

            // TODO: not sure we should support this hack
            case SOLIDUS:
                this.scanner.next();
                if (this.scanner.isDelim(SOLIDUS)) {
                    this.scanner.next();
                }
                break;
        }
    }

    if (prefix) {
        this.scanner.skip(prefix);
    }

    if (this.scanner.tokenType === HASH) {
        this.eat(HASH);
    } else {
        this.eat(IDENT);
    }

    return this.scanner.substrToCursor(start);
}

// ! ws* important
function getImportant() {
    this.eat(DELIM);
    this.scanner.skipSC();

    var important = this.consume(IDENT);

    // store original value in case it differ from `important`
    // for better original source restoring and hacks like `!ie` support
    return important === 'important' ? true : important;
}

}, function(modId) { var map = {"../../utils/names":1597942294284,"../../tokenizer":1597942294286,"./Raw":1597942294316}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294327, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;
var rawMode = require('./Raw').mode;

var WHITESPACE = TYPE.WhiteSpace;
var COMMENT = TYPE.Comment;
var SEMICOLON = TYPE.Semicolon;

function consumeRaw(startToken) {
    return this.Raw(startToken, rawMode.semicolonIncluded, true);
}

module.exports = {
    name: 'DeclarationList',
    structure: {
        children: [[
            'Declaration'
        ]]
    },
    parse: function() {
        var children = this.createList();

        scan:
        while (!this.scanner.eof) {
            switch (this.scanner.tokenType) {
                case WHITESPACE:
                case COMMENT:
                case SEMICOLON:
                    this.scanner.next();
                    break;

                default:
                    children.push(this.parseWithFallback(this.Declaration, consumeRaw));
            }
        }

        return {
            type: 'DeclarationList',
            loc: this.getLocationFromList(children),
            children: children
        };
    },
    generate: function(node) {
        this.children(node, function(prev) {
            if (prev.type === 'Declaration') {
                this.chunk(';');
            }
        });
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286,"./Raw":1597942294316}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294328, function(require, module, exports) {
var consumeNumber = require('../../tokenizer/utils').consumeNumber;
var TYPE = require('../../tokenizer').TYPE;

var DIMENSION = TYPE.Dimension;

module.exports = {
    name: 'Dimension',
    structure: {
        value: String,
        unit: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var numberEnd = consumeNumber(this.scanner.source, start);

        this.eat(DIMENSION);

        return {
            type: 'Dimension',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.source.substring(start, numberEnd),
            unit: this.scanner.source.substring(numberEnd, this.scanner.tokenStart)
        };
    },
    generate: function(node) {
        this.chunk(node.value);
        this.chunk(node.unit);
    }
};

}, function(modId) { var map = {"../../tokenizer/utils":1597942294279,"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294329, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var RIGHTPARENTHESIS = TYPE.RightParenthesis;

// <function-token> <sequence> )
module.exports = {
    name: 'Function',
    structure: {
        name: String,
        children: [[]]
    },
    parse: function(readSequence, recognizer) {
        var start = this.scanner.tokenStart;
        var name = this.consumeFunctionName();
        var nameLowerCase = name.toLowerCase();
        var children;

        children = recognizer.hasOwnProperty(nameLowerCase)
            ? recognizer[nameLowerCase].call(this, recognizer)
            : readSequence.call(this, recognizer);

        if (!this.scanner.eof) {
            this.eat(RIGHTPARENTHESIS);
        }

        return {
            type: 'Function',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            children: children
        };
    },
    generate: function(node) {
        this.chunk(node.name);
        this.chunk('(');
        this.children(node);
        this.chunk(')');
    },
    walkContext: 'function'
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294330, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var HASH = TYPE.Hash;

// '#' ident
module.exports = {
    name: 'HexColor',
    structure: {
        value: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;

        this.eat(HASH);

        return {
            type: 'HexColor',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.substrToCursor(start + 1)
        };
    },
    generate: function(node) {
        this.chunk('#');
        this.chunk(node.value);
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294331, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var IDENT = TYPE.Ident;

module.exports = {
    name: 'Identifier',
    structure: {
        name: String
    },
    parse: function() {
        return {
            type: 'Identifier',
            loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
            name: this.consume(IDENT)
        };
    },
    generate: function(node) {
        this.chunk(node.name);
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294332, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var HASH = TYPE.Hash;

// <hash-token>
module.exports = {
    name: 'IdSelector',
    structure: {
        name: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;

        // TODO: check value is an ident
        this.eat(HASH);

        return {
            type: 'IdSelector',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: this.scanner.substrToCursor(start + 1)
        };
    },
    generate: function(node) {
        this.chunk('#');
        this.chunk(node.name);
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294333, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var IDENT = TYPE.Ident;
var NUMBER = TYPE.Number;
var DIMENSION = TYPE.Dimension;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;
var RIGHTPARENTHESIS = TYPE.RightParenthesis;
var COLON = TYPE.Colon;
var DELIM = TYPE.Delim;

module.exports = {
    name: 'MediaFeature',
    structure: {
        name: String,
        value: ['Identifier', 'Number', 'Dimension', 'Ratio', null]
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var name;
        var value = null;

        this.eat(LEFTPARENTHESIS);
        this.scanner.skipSC();

        name = this.consume(IDENT);
        this.scanner.skipSC();

        if (this.scanner.tokenType !== RIGHTPARENTHESIS) {
            this.eat(COLON);
            this.scanner.skipSC();

            switch (this.scanner.tokenType) {
                case NUMBER:
                    if (this.lookupNonWSType(1) === DELIM) {
                        value = this.Ratio();
                    } else {
                        value = this.Number();
                    }

                    break;

                case DIMENSION:
                    value = this.Dimension();
                    break;

                case IDENT:
                    value = this.Identifier();

                    break;

                default:
                    this.error('Number, dimension, ratio or identifier is expected');
            }

            this.scanner.skipSC();
        }

        this.eat(RIGHTPARENTHESIS);

        return {
            type: 'MediaFeature',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            value: value
        };
    },
    generate: function(node) {
        this.chunk('(');
        this.chunk(node.name);
        if (node.value !== null) {
            this.chunk(':');
            this.node(node.value);
        }
        this.chunk(')');
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294334, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var WHITESPACE = TYPE.WhiteSpace;
var COMMENT = TYPE.Comment;
var IDENT = TYPE.Ident;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;

module.exports = {
    name: 'MediaQuery',
    structure: {
        children: [[
            'Identifier',
            'MediaFeature',
            'WhiteSpace'
        ]]
    },
    parse: function() {
        this.scanner.skipSC();

        var children = this.createList();
        var child = null;
        var space = null;

        scan:
        while (!this.scanner.eof) {
            switch (this.scanner.tokenType) {
                case COMMENT:
                    this.scanner.next();
                    continue;

                case WHITESPACE:
                    space = this.WhiteSpace();
                    continue;

                case IDENT:
                    child = this.Identifier();
                    break;

                case LEFTPARENTHESIS:
                    child = this.MediaFeature();
                    break;

                default:
                    break scan;
            }

            if (space !== null) {
                children.push(space);
                space = null;
            }

            children.push(child);
        }

        if (child === null) {
            this.error('Identifier or parenthesis is expected');
        }

        return {
            type: 'MediaQuery',
            loc: this.getLocationFromList(children),
            children: children
        };
    },
    generate: function(node) {
        this.children(node);
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294335, function(require, module, exports) {
var COMMA = require('../../tokenizer').TYPE.Comma;

module.exports = {
    name: 'MediaQueryList',
    structure: {
        children: [[
            'MediaQuery'
        ]]
    },
    parse: function(relative) {
        var children = this.createList();

        this.scanner.skipSC();

        while (!this.scanner.eof) {
            children.push(this.MediaQuery(relative));

            if (this.scanner.tokenType !== COMMA) {
                break;
            }

            this.scanner.next();
        }

        return {
            type: 'MediaQueryList',
            loc: this.getLocationFromList(children),
            children: children
        };
    },
    generate: function(node) {
        this.children(node, function() {
            this.chunk(',');
        });
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294336, function(require, module, exports) {
module.exports = {
    name: 'Nth',
    structure: {
        nth: ['AnPlusB', 'Identifier'],
        selector: ['SelectorList', null]
    },
    parse: function(allowOfClause) {
        this.scanner.skipSC();

        var start = this.scanner.tokenStart;
        var end = start;
        var selector = null;
        var query;

        if (this.scanner.lookupValue(0, 'odd') || this.scanner.lookupValue(0, 'even')) {
            query = this.Identifier();
        } else {
            query = this.AnPlusB();
        }

        this.scanner.skipSC();

        if (allowOfClause && this.scanner.lookupValue(0, 'of')) {
            this.scanner.next();

            selector = this.SelectorList();

            if (this.needPositions) {
                end = this.getLastListNode(selector.children).loc.end.offset;
            }
        } else {
            if (this.needPositions) {
                end = query.loc.end.offset;
            }
        }

        return {
            type: 'Nth',
            loc: this.getLocation(start, end),
            nth: query,
            selector: selector
        };
    },
    generate: function(node) {
        this.node(node.nth);
        if (node.selector !== null) {
            this.chunk(' of ');
            this.node(node.selector);
        }
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294337, function(require, module, exports) {
var NUMBER = require('../../tokenizer').TYPE.Number;

module.exports = {
    name: 'Number',
    structure: {
        value: String
    },
    parse: function() {
        return {
            type: 'Number',
            loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
            value: this.consume(NUMBER)
        };
    },
    generate: function(node) {
        this.chunk(node.value);
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294338, function(require, module, exports) {
// '/' | '*' | ',' | ':' | '+' | '-'
module.exports = {
    name: 'Operator',
    structure: {
        value: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;

        this.scanner.next();

        return {
            type: 'Operator',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.substrToCursor(start)
        };
    },
    generate: function(node) {
        this.chunk(node.value);
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294339, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var LEFTPARENTHESIS = TYPE.LeftParenthesis;
var RIGHTPARENTHESIS = TYPE.RightParenthesis;

module.exports = {
    name: 'Parentheses',
    structure: {
        children: [[]]
    },
    parse: function(readSequence, recognizer) {
        var start = this.scanner.tokenStart;
        var children = null;

        this.eat(LEFTPARENTHESIS);

        children = readSequence.call(this, recognizer);

        if (!this.scanner.eof) {
            this.eat(RIGHTPARENTHESIS);
        }

        return {
            type: 'Parentheses',
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
        };
    },
    generate: function(node) {
        this.chunk('(');
        this.children(node);
        this.chunk(')');
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294340, function(require, module, exports) {
var consumeNumber = require('../../tokenizer/utils').consumeNumber;
var TYPE = require('../../tokenizer').TYPE;

var PERCENTAGE = TYPE.Percentage;

module.exports = {
    name: 'Percentage',
    structure: {
        value: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var numberEnd = consumeNumber(this.scanner.source, start);

        this.eat(PERCENTAGE);

        return {
            type: 'Percentage',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.source.substring(start, numberEnd)
        };
    },
    generate: function(node) {
        this.chunk(node.value);
        this.chunk('%');
    }
};

}, function(modId) { var map = {"../../tokenizer/utils":1597942294279,"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294341, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var IDENT = TYPE.Ident;
var FUNCTION = TYPE.Function;
var COLON = TYPE.Colon;
var RIGHTPARENTHESIS = TYPE.RightParenthesis;

// : [ <ident> | <function-token> <any-value>? ) ]
module.exports = {
    name: 'PseudoClassSelector',
    structure: {
        name: String,
        children: [['Raw'], null]
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var children = null;
        var name;
        var nameLowerCase;

        this.eat(COLON);

        if (this.scanner.tokenType === FUNCTION) {
            name = this.consumeFunctionName();
            nameLowerCase = name.toLowerCase();

            if (this.pseudo.hasOwnProperty(nameLowerCase)) {
                this.scanner.skipSC();
                children = this.pseudo[nameLowerCase].call(this);
                this.scanner.skipSC();
            } else {
                children = this.createList();
                children.push(
                    this.Raw(this.scanner.tokenIndex, null, false)
                );
            }

            this.eat(RIGHTPARENTHESIS);
        } else {
            name = this.consume(IDENT);
        }

        return {
            type: 'PseudoClassSelector',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            children: children
        };
    },
    generate: function(node) {
        this.chunk(':');
        this.chunk(node.name);

        if (node.children !== null) {
            this.chunk('(');
            this.children(node);
            this.chunk(')');
        }
    },
    walkContext: 'function'
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294342, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var IDENT = TYPE.Ident;
var FUNCTION = TYPE.Function;
var COLON = TYPE.Colon;
var RIGHTPARENTHESIS = TYPE.RightParenthesis;

// :: [ <ident> | <function-token> <any-value>? ) ]
module.exports = {
    name: 'PseudoElementSelector',
    structure: {
        name: String,
        children: [['Raw'], null]
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var children = null;
        var name;
        var nameLowerCase;

        this.eat(COLON);
        this.eat(COLON);

        if (this.scanner.tokenType === FUNCTION) {
            name = this.consumeFunctionName();
            nameLowerCase = name.toLowerCase();

            if (this.pseudo.hasOwnProperty(nameLowerCase)) {
                this.scanner.skipSC();
                children = this.pseudo[nameLowerCase].call(this);
                this.scanner.skipSC();
            } else {
                children = this.createList();
                children.push(
                    this.Raw(this.scanner.tokenIndex, null, false)
                );
            }

            this.eat(RIGHTPARENTHESIS);
        } else {
            name = this.consume(IDENT);
        }

        return {
            type: 'PseudoElementSelector',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            children: children
        };
    },
    generate: function(node) {
        this.chunk('::');
        this.chunk(node.name);

        if (node.children !== null) {
            this.chunk('(');
            this.children(node);
            this.chunk(')');
        }
    },
    walkContext: 'function'
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294343, function(require, module, exports) {
var isDigit = require('../../tokenizer').isDigit;
var TYPE = require('../../tokenizer').TYPE;

var NUMBER = TYPE.Number;
var DELIM = TYPE.Delim;
var SOLIDUS = 0x002F;  // U+002F SOLIDUS (/)
var FULLSTOP = 0x002E; // U+002E FULL STOP (.)

// Terms of <ratio> should be a positive numbers (not zero or negative)
// (see https://drafts.csswg.org/mediaqueries-3/#values)
// However, -o-min-device-pixel-ratio takes fractional values as a ratio's term
// and this is using by various sites. Therefore we relax checking on parse
// to test a term is unsigned number without an exponent part.
// Additional checking may be applied on lexer validation.
function consumeNumber() {
    this.scanner.skipWS();

    var value = this.consume(NUMBER);

    for (var i = 0; i < value.length; i++) {
        var code = value.charCodeAt(i);
        if (!isDigit(code) && code !== FULLSTOP) {
            this.error('Unsigned number is expected', this.scanner.tokenStart - value.length + i);
        }
    }

    if (Number(value) === 0) {
        this.error('Zero number is not allowed', this.scanner.tokenStart - value.length);
    }

    return value;
}

// <positive-integer> S* '/' S* <positive-integer>
module.exports = {
    name: 'Ratio',
    structure: {
        left: String,
        right: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var left = consumeNumber.call(this);
        var right;

        this.scanner.skipWS();

        if (!this.scanner.isDelim(SOLIDUS)) {
            this.error('Solidus is expected');
        }
        this.eat(DELIM);
        right = consumeNumber.call(this);

        return {
            type: 'Ratio',
            loc: this.getLocation(start, this.scanner.tokenStart),
            left: left,
            right: right
        };
    },
    generate: function(node) {
        this.chunk(node.left);
        this.chunk('/');
        this.chunk(node.right);
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294344, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;
var rawMode = require('./Raw').mode;

var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;

function consumeRaw(startToken) {
    return this.Raw(startToken, rawMode.leftCurlyBracket, true);
}

function consumePrelude() {
    var prelude = this.SelectorList();

    if (prelude.type !== 'Raw' &&
        this.scanner.eof === false &&
        this.scanner.tokenType !== LEFTCURLYBRACKET) {
        this.error();
    }

    return prelude;
}

module.exports = {
    name: 'Rule',
    structure: {
        prelude: ['SelectorList', 'Raw'],
        block: ['Block']
    },
    parse: function() {
        var startToken = this.scanner.tokenIndex;
        var startOffset = this.scanner.tokenStart;
        var prelude;
        var block;

        if (this.parseRulePrelude) {
            prelude = this.parseWithFallback(consumePrelude, consumeRaw);
        } else {
            prelude = consumeRaw.call(this, startToken);
        }

        block = this.Block(true);

        return {
            type: 'Rule',
            loc: this.getLocation(startOffset, this.scanner.tokenStart),
            prelude: prelude,
            block: block
        };
    },
    generate: function(node) {
        this.node(node.prelude);
        this.node(node.block);
    },
    walkContext: 'rule'
};

}, function(modId) { var map = {"../../tokenizer":1597942294286,"./Raw":1597942294316}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294345, function(require, module, exports) {
module.exports = {
    name: 'Selector',
    structure: {
        children: [[
            'TypeSelector',
            'IdSelector',
            'ClassSelector',
            'AttributeSelector',
            'PseudoClassSelector',
            'PseudoElementSelector',
            'Combinator',
            'WhiteSpace'
        ]]
    },
    parse: function() {
        var children = this.readSequence(this.scope.Selector);

        // nothing were consumed
        if (this.getFirstListNode(children) === null) {
            this.error('Selector is expected');
        }

        return {
            type: 'Selector',
            loc: this.getLocationFromList(children),
            children: children
        };
    },
    generate: function(node) {
        this.children(node);
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294346, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var COMMA = TYPE.Comma;

module.exports = {
    name: 'SelectorList',
    structure: {
        children: [[
            'Selector',
            'Raw'
        ]]
    },
    parse: function() {
        var children = this.createList();

        while (!this.scanner.eof) {
            children.push(this.Selector());

            if (this.scanner.tokenType === COMMA) {
                this.scanner.next();
                continue;
            }

            break;
        }

        return {
            type: 'SelectorList',
            loc: this.getLocationFromList(children),
            children: children
        };
    },
    generate: function(node) {
        this.children(node, function() {
            this.chunk(',');
        });
    },
    walkContext: 'selector'
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294347, function(require, module, exports) {
var STRING = require('../../tokenizer').TYPE.String;

module.exports = {
    name: 'String',
    structure: {
        value: String
    },
    parse: function() {
        return {
            type: 'String',
            loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
            value: this.consume(STRING)
        };
    },
    generate: function(node) {
        this.chunk(node.value);
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294348, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var WHITESPACE = TYPE.WhiteSpace;
var COMMENT = TYPE.Comment;
var ATKEYWORD = TYPE.AtKeyword;
var CDO = TYPE.CDO;
var CDC = TYPE.CDC;
var EXCLAMATIONMARK = 0x0021; // U+0021 EXCLAMATION MARK (!)

function consumeRaw(startToken) {
    return this.Raw(startToken, null, false);
}

module.exports = {
    name: 'StyleSheet',
    structure: {
        children: [[
            'Comment',
            'CDO',
            'CDC',
            'Atrule',
            'Rule',
            'Raw'
        ]]
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var children = this.createList();
        var child;

        scan:
        while (!this.scanner.eof) {
            switch (this.scanner.tokenType) {
                case WHITESPACE:
                    this.scanner.next();
                    continue;

                case COMMENT:
                    // ignore comments except exclamation comments (i.e. /*! .. */) on top level
                    if (this.scanner.source.charCodeAt(this.scanner.tokenStart + 2) !== EXCLAMATIONMARK) {
                        this.scanner.next();
                        continue;
                    }

                    child = this.Comment();
                    break;

                case CDO: // <!--
                    child = this.CDO();
                    break;

                case CDC: // -->
                    child = this.CDC();
                    break;

                // CSS Syntax Module Level 3
                // §2.2 Error handling
                // At the "top level" of a stylesheet, an <at-keyword-token> starts an at-rule.
                case ATKEYWORD:
                    child = this.parseWithFallback(this.Atrule, consumeRaw);
                    break;

                // Anything else starts a qualified rule ...
                default:
                    child = this.parseWithFallback(this.Rule, consumeRaw);
            }

            children.push(child);
        }

        return {
            type: 'StyleSheet',
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
        };
    },
    generate: function(node) {
        this.children(node);
    },
    walkContext: 'stylesheet'
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294349, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var IDENT = TYPE.Ident;
var ASTERISK = 0x002A;     // U+002A ASTERISK (*)
var VERTICALLINE = 0x007C; // U+007C VERTICAL LINE (|)

function eatIdentifierOrAsterisk() {
    if (this.scanner.tokenType !== IDENT &&
        this.scanner.isDelim(ASTERISK) === false) {
        this.error('Identifier or asterisk is expected');
    }

    this.scanner.next();
}

// ident
// ident|ident
// ident|*
// *
// *|ident
// *|*
// |ident
// |*
module.exports = {
    name: 'TypeSelector',
    structure: {
        name: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;

        if (this.scanner.isDelim(VERTICALLINE)) {
            this.scanner.next();
            eatIdentifierOrAsterisk.call(this);
        } else {
            eatIdentifierOrAsterisk.call(this);

            if (this.scanner.isDelim(VERTICALLINE)) {
                this.scanner.next();
                eatIdentifierOrAsterisk.call(this);
            }
        }

        return {
            type: 'TypeSelector',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: this.scanner.substrToCursor(start)
        };
    },
    generate: function(node) {
        this.chunk(node.name);
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294350, function(require, module, exports) {
var isHexDigit = require('../../tokenizer').isHexDigit;
var cmpChar = require('../../tokenizer').cmpChar;
var TYPE = require('../../tokenizer').TYPE;
var NAME = require('../../tokenizer').NAME;

var IDENT = TYPE.Ident;
var NUMBER = TYPE.Number;
var DIMENSION = TYPE.Dimension;
var PLUSSIGN = 0x002B;     // U+002B PLUS SIGN (+)
var HYPHENMINUS = 0x002D;  // U+002D HYPHEN-MINUS (-)
var QUESTIONMARK = 0x003F; // U+003F QUESTION MARK (?)
var U = 0x0075;            // U+0075 LATIN SMALL LETTER U (u)

function eatHexSequence(offset, allowDash) {
    for (var pos = this.scanner.tokenStart + offset, len = 0; pos < this.scanner.tokenEnd; pos++) {
        var code = this.scanner.source.charCodeAt(pos);

        if (code === HYPHENMINUS && allowDash && len !== 0) {
            if (eatHexSequence.call(this, offset + len + 1, false) === 0) {
                this.error();
            }

            return -1;
        }

        if (!isHexDigit(code)) {
            this.error(
                allowDash && len !== 0
                    ? 'HyphenMinus' + (len < 6 ? ' or hex digit' : '') + ' is expected'
                    : (len < 6 ? 'Hex digit is expected' : 'Unexpected input'),
                pos
            );
        }

        if (++len > 6) {
            this.error('Too many hex digits', pos);
        };
    }

    this.scanner.next();
    return len;
}

function eatQuestionMarkSequence(max) {
    var count = 0;

    while (this.scanner.isDelim(QUESTIONMARK)) {
        if (++count > max) {
            this.error('Too many question marks');
        }

        this.scanner.next();
    }
}

function startsWith(code) {
    if (this.scanner.source.charCodeAt(this.scanner.tokenStart) !== code) {
        this.error(NAME[code] + ' is expected');
    }
}

// https://drafts.csswg.org/css-syntax/#urange
// Informally, the <urange> production has three forms:
// U+0001
//      Defines a range consisting of a single code point, in this case the code point "1".
// U+0001-00ff
//      Defines a range of codepoints between the first and the second value, in this case
//      the range between "1" and "ff" (255 in decimal) inclusive.
// U+00??
//      Defines a range of codepoints where the "?" characters range over all hex digits,
//      in this case defining the same as the value U+0000-00ff.
// In each form, a maximum of 6 digits is allowed for each hexadecimal number (if you treat "?" as a hexadecimal digit).
//
// <urange> =
//   u '+' <ident-token> '?'* |
//   u <dimension-token> '?'* |
//   u <number-token> '?'* |
//   u <number-token> <dimension-token> |
//   u <number-token> <number-token> |
//   u '+' '?'+
function scanUnicodeRange() {
    var hexLength = 0;

    // u '+' <ident-token> '?'*
    // u '+' '?'+
    if (this.scanner.isDelim(PLUSSIGN)) {
        this.scanner.next();

        if (this.scanner.tokenType === IDENT) {
            hexLength = eatHexSequence.call(this, 0, true);
            if (hexLength > 0) {
                eatQuestionMarkSequence.call(this, 6 - hexLength);
            }
            return;
        }

        if (this.scanner.isDelim(QUESTIONMARK)) {
            this.scanner.next();
            eatQuestionMarkSequence.call(this, 5);
            return;
        }

        this.error('Hex digit or question mark is expected');
        return;
    }

    // u <number-token> '?'*
    // u <number-token> <dimension-token>
    // u <number-token> <number-token>
    if (this.scanner.tokenType === NUMBER) {
        startsWith.call(this, PLUSSIGN);
        hexLength = eatHexSequence.call(this, 1, true);

        if (this.scanner.isDelim(QUESTIONMARK)) {
            eatQuestionMarkSequence.call(this, 6 - hexLength);
            return;
        }

        if (this.scanner.tokenType === DIMENSION ||
            this.scanner.tokenType === NUMBER) {
            startsWith.call(this, HYPHENMINUS);
            eatHexSequence.call(this, 1, false);
            return;
        }

        return;
    }

    // u <dimension-token> '?'*
    if (this.scanner.tokenType === DIMENSION) {
        startsWith.call(this, PLUSSIGN);
        hexLength = eatHexSequence.call(this, 1, true);

        if (hexLength > 0) {
            eatQuestionMarkSequence.call(this, 6 - hexLength);
        }

        return;
    }

    this.error();
}

module.exports = {
    name: 'UnicodeRange',
    structure: {
        value: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;

        // U or u
        if (!cmpChar(this.scanner.source, start, U)) {
            this.error('U is expected');
        }

        if (!cmpChar(this.scanner.source, start + 1, PLUSSIGN)) {
            this.error('Plus sign is expected');
        }

        this.scanner.next();
        scanUnicodeRange.call(this);

        return {
            type: 'UnicodeRange',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.substrToCursor(start)
        };
    },
    generate: function(node) {
        this.chunk(node.value);
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294351, function(require, module, exports) {
var isWhiteSpace = require('../../tokenizer').isWhiteSpace;
var cmpStr = require('../../tokenizer').cmpStr;
var TYPE = require('../../tokenizer').TYPE;

var FUNCTION = TYPE.Function;
var URL = TYPE.Url;
var RIGHTPARENTHESIS = TYPE.RightParenthesis;

// <url-token> | <function-token> <string> )
module.exports = {
    name: 'Url',
    structure: {
        value: ['String', 'Raw']
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var value;

        switch (this.scanner.tokenType) {
            case URL:
                var rawStart = start + 4;
                var rawEnd = this.scanner.tokenEnd - 1;

                while (rawStart < rawEnd && isWhiteSpace(this.scanner.source.charCodeAt(rawStart))) {
                    rawStart++;
                }

                while (rawStart < rawEnd && isWhiteSpace(this.scanner.source.charCodeAt(rawEnd - 1))) {
                    rawEnd--;
                }

                value = {
                    type: 'Raw',
                    loc: this.getLocation(rawStart, rawEnd),
                    value: this.scanner.source.substring(rawStart, rawEnd)
                };

                this.eat(URL);
                break;

            case FUNCTION:
                if (!cmpStr(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, 'url(')) {
                    this.error('Function name must be `url`');
                }

                this.eat(FUNCTION);
                this.scanner.skipSC();
                value = this.String();
                this.scanner.skipSC();
                this.eat(RIGHTPARENTHESIS);
                break;

            default:
                this.error('Url or Function is expected');
        }

        return {
            type: 'Url',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: value
        };
    },
    generate: function(node) {
        this.chunk('url');
        this.chunk('(');
        this.node(node.value);
        this.chunk(')');
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294352, function(require, module, exports) {
module.exports = {
    name: 'Value',
    structure: {
        children: [[]]
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var children = this.readSequence(this.scope.Value);

        return {
            type: 'Value',
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
        };
    },
    generate: function(node) {
        this.children(node);
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294353, function(require, module, exports) {
var WHITESPACE = require('../../tokenizer').TYPE.WhiteSpace;
var SPACE = Object.freeze({
    type: 'WhiteSpace',
    loc: null,
    value: ' '
});

module.exports = {
    name: 'WhiteSpace',
    structure: {
        value: String
    },
    parse: function() {
        this.eat(WHITESPACE);
        return SPACE;

        // return {
        //     type: 'WhiteSpace',
        //     loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
        //     value: this.consume(WHITESPACE)
        // };
    },
    generate: function(node) {
        this.chunk(node.value);
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294354, function(require, module, exports) {
module.exports = {
    parseContext: {
        default: 'StyleSheet',
        stylesheet: 'StyleSheet',
        atrule: 'Atrule',
        atrulePrelude: function(options) {
            return this.AtrulePrelude(options.atrule ? String(options.atrule) : null);
        },
        mediaQueryList: 'MediaQueryList',
        mediaQuery: 'MediaQuery',
        rule: 'Rule',
        selectorList: 'SelectorList',
        selector: 'Selector',
        block: function() {
            return this.Block(true);
        },
        declarationList: 'DeclarationList',
        declaration: 'Declaration',
        value: 'Value'
    },
    scope: require('../scope'),
    atrule: require('../atrule'),
    pseudo: require('../pseudo'),
    node: require('../node')
};

}, function(modId) { var map = {"../scope":1597942294355,"../atrule":1597942294363,"../pseudo":1597942294369,"../node":1597942294313}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294355, function(require, module, exports) {
module.exports = {
    AtrulePrelude: require('./atrulePrelude'),
    Selector: require('./selector'),
    Value: require('./value')
};

}, function(modId) { var map = {"./atrulePrelude":1597942294356,"./selector":1597942294358,"./value":1597942294359}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294356, function(require, module, exports) {
module.exports = {
    getNode: require('./default')
};

}, function(modId) { var map = {"./default":1597942294357}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294357, function(require, module, exports) {
var cmpChar = require('../../tokenizer').cmpChar;
var cmpStr = require('../../tokenizer').cmpStr;
var TYPE = require('../../tokenizer').TYPE;

var IDENT = TYPE.Ident;
var STRING = TYPE.String;
var NUMBER = TYPE.Number;
var FUNCTION = TYPE.Function;
var URL = TYPE.Url;
var HASH = TYPE.Hash;
var DIMENSION = TYPE.Dimension;
var PERCENTAGE = TYPE.Percentage;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;
var LEFTSQUAREBRACKET = TYPE.LeftSquareBracket;
var COMMA = TYPE.Comma;
var DELIM = TYPE.Delim;
var NUMBERSIGN = 0x0023;  // U+0023 NUMBER SIGN (#)
var ASTERISK = 0x002A;    // U+002A ASTERISK (*)
var PLUSSIGN = 0x002B;    // U+002B PLUS SIGN (+)
var HYPHENMINUS = 0x002D; // U+002D HYPHEN-MINUS (-)
var SOLIDUS = 0x002F;     // U+002F SOLIDUS (/)
var U = 0x0075;           // U+0075 LATIN SMALL LETTER U (u)

module.exports = function defaultRecognizer(context) {
    switch (this.scanner.tokenType) {
        case HASH:
            return this.HexColor();

        case COMMA:
            context.space = null;
            context.ignoreWSAfter = true;
            return this.Operator();

        case LEFTPARENTHESIS:
            return this.Parentheses(this.readSequence, context.recognizer);

        case LEFTSQUAREBRACKET:
            return this.Brackets(this.readSequence, context.recognizer);

        case STRING:
            return this.String();

        case DIMENSION:
            return this.Dimension();

        case PERCENTAGE:
            return this.Percentage();

        case NUMBER:
            return this.Number();

        case FUNCTION:
            return cmpStr(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, 'url(')
                ? this.Url()
                : this.Function(this.readSequence, context.recognizer);

        case URL:
            return this.Url();

        case IDENT:
            // check for unicode range, it should start with u+ or U+
            if (cmpChar(this.scanner.source, this.scanner.tokenStart, U) &&
                cmpChar(this.scanner.source, this.scanner.tokenStart + 1, PLUSSIGN)) {
                return this.UnicodeRange();
            } else {
                return this.Identifier();
            }

        case DELIM:
            var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);

            if (code === SOLIDUS ||
                code === ASTERISK ||
                code === PLUSSIGN ||
                code === HYPHENMINUS) {
                return this.Operator(); // TODO: replace with Delim
            }

            // TODO: produce a node with Delim node type

            if (code === NUMBERSIGN) {
                this.error('Hex or identifier is expected', this.scanner.tokenStart + 1);
            }

            break;
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294358, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var DELIM = TYPE.Delim;
var IDENT = TYPE.Ident;
var DIMENSION = TYPE.Dimension;
var PERCENTAGE = TYPE.Percentage;
var NUMBER = TYPE.Number;
var HASH = TYPE.Hash;
var COLON = TYPE.Colon;
var LEFTSQUAREBRACKET = TYPE.LeftSquareBracket;
var NUMBERSIGN = 0x0023;      // U+0023 NUMBER SIGN (#)
var ASTERISK = 0x002A;        // U+002A ASTERISK (*)
var PLUSSIGN = 0x002B;        // U+002B PLUS SIGN (+)
var SOLIDUS = 0x002F;         // U+002F SOLIDUS (/)
var FULLSTOP = 0x002E;        // U+002E FULL STOP (.)
var GREATERTHANSIGN = 0x003E; // U+003E GREATER-THAN SIGN (>)
var VERTICALLINE = 0x007C;    // U+007C VERTICAL LINE (|)
var TILDE = 0x007E;           // U+007E TILDE (~)

function getNode(context) {
    switch (this.scanner.tokenType) {
        case LEFTSQUAREBRACKET:
            return this.AttributeSelector();

        case HASH:
            return this.IdSelector();

        case COLON:
            if (this.scanner.lookupType(1) === COLON) {
                return this.PseudoElementSelector();
            } else {
                return this.PseudoClassSelector();
            }

        case IDENT:
            return this.TypeSelector();

        case NUMBER:
        case PERCENTAGE:
            return this.Percentage();

        case DIMENSION:
            // throws when .123ident
            if (this.scanner.source.charCodeAt(this.scanner.tokenStart) === FULLSTOP) {
                this.error('Identifier is expected', this.scanner.tokenStart + 1);
            }
            break;

        case DELIM:
            var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);

            switch (code) {
                case PLUSSIGN:
                case GREATERTHANSIGN:
                case TILDE:
                    context.space = null;
                    context.ignoreWSAfter = true;
                    return this.Combinator();

                case SOLIDUS:  // /deep/
                    return this.Combinator();

                case FULLSTOP:
                    return this.ClassSelector();

                case ASTERISK:
                case VERTICALLINE:
                    return this.TypeSelector();

                case NUMBERSIGN:
                    return this.IdSelector();
            }

            break;
    }
};

module.exports = {
    getNode: getNode
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294359, function(require, module, exports) {
module.exports = {
    getNode: require('./default'),
    '-moz-element': require('../function/element'),
    'element': require('../function/element'),
    'expression': require('../function/expression'),
    'var': require('../function/var')
};

}, function(modId) { var map = {"./default":1597942294357,"../function/element":1597942294360,"../function/expression":1597942294361,"../function/var":1597942294362}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294360, function(require, module, exports) {
// https://drafts.csswg.org/css-images-4/#element-notation
// https://developer.mozilla.org/en-US/docs/Web/CSS/element
module.exports = function() {
    this.scanner.skipSC();

    var children = this.createSingleNodeList(
        this.IdSelector()
    );

    this.scanner.skipSC();

    return children;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294361, function(require, module, exports) {
// legacy IE function
// expression( <any-value> )
module.exports = function() {
    return this.createSingleNodeList(
        this.Raw(this.scanner.tokenIndex, null, false)
    );
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294362, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;
var rawMode = require('../node/Raw').mode;

var COMMA = TYPE.Comma;

// var( <ident> , <value>? )
module.exports = function() {
    var children = this.createList();

    this.scanner.skipSC();

    // NOTE: Don't check more than a first argument is an ident, rest checks are for lexer
    children.push(this.Identifier());

    this.scanner.skipSC();

    if (this.scanner.tokenType === COMMA) {
        children.push(this.Operator());
        children.push(this.parseCustomProperty
            ? this.Value(null)
            : this.Raw(this.scanner.tokenIndex, rawMode.exclamationMarkOrSemicolon, false)
        );
    }

    return children;
};

}, function(modId) { var map = {"../../tokenizer":1597942294286,"../node/Raw":1597942294316}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294363, function(require, module, exports) {
module.exports = {
    'font-face': require('./font-face'),
    'import': require('./import'),
    'media': require('./media'),
    'page': require('./page'),
    'supports': require('./supports')
};

}, function(modId) { var map = {"./font-face":1597942294364,"./import":1597942294365,"./media":1597942294366,"./page":1597942294367,"./supports":1597942294368}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294364, function(require, module, exports) {
module.exports = {
    parse: {
        prelude: null,
        block: function() {
            return this.Block(true);
        }
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294365, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var STRING = TYPE.String;
var IDENT = TYPE.Ident;
var URL = TYPE.Url;
var FUNCTION = TYPE.Function;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;

module.exports = {
    parse: {
        prelude: function() {
            var children = this.createList();

            this.scanner.skipSC();

            switch (this.scanner.tokenType) {
                case STRING:
                    children.push(this.String());
                    break;

                case URL:
                case FUNCTION:
                    children.push(this.Url());
                    break;

                default:
                    this.error('String or url() is expected');
            }

            if (this.lookupNonWSType(0) === IDENT ||
                this.lookupNonWSType(0) === LEFTPARENTHESIS) {
                children.push(this.WhiteSpace());
                children.push(this.MediaQueryList());
            }

            return children;
        },
        block: null
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294366, function(require, module, exports) {
module.exports = {
    parse: {
        prelude: function() {
            return this.createSingleNodeList(
                this.MediaQueryList()
            );
        },
        block: function() {
            return this.Block(false);
        }
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294367, function(require, module, exports) {
module.exports = {
    parse: {
        prelude: function() {
            return this.createSingleNodeList(
                this.SelectorList()
            );
        },
        block: function() {
            return this.Block(true);
        }
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294368, function(require, module, exports) {
var TYPE = require('../../tokenizer').TYPE;

var WHITESPACE = TYPE.WhiteSpace;
var COMMENT = TYPE.Comment;
var IDENT = TYPE.Ident;
var FUNCTION = TYPE.Function;
var COLON = TYPE.Colon;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;

function consumeRaw() {
    return this.createSingleNodeList(
        this.Raw(this.scanner.tokenIndex, null, false)
    );
}

function parentheses() {
    this.scanner.skipSC();

    if (this.scanner.tokenType === IDENT &&
        this.lookupNonWSType(1) === COLON) {
        return this.createSingleNodeList(
            this.Declaration()
        );
    }

    return readSequence.call(this);
}

function readSequence() {
    var children = this.createList();
    var space = null;
    var child;

    this.scanner.skipSC();

    scan:
    while (!this.scanner.eof) {
        switch (this.scanner.tokenType) {
            case WHITESPACE:
                space = this.WhiteSpace();
                continue;

            case COMMENT:
                this.scanner.next();
                continue;

            case FUNCTION:
                child = this.Function(consumeRaw, this.scope.AtrulePrelude);
                break;

            case IDENT:
                child = this.Identifier();
                break;

            case LEFTPARENTHESIS:
                child = this.Parentheses(parentheses, this.scope.AtrulePrelude);
                break;

            default:
                break scan;
        }

        if (space !== null) {
            children.push(space);
            space = null;
        }

        children.push(child);
    }

    return children;
}

module.exports = {
    parse: {
        prelude: function() {
            var children = readSequence.call(this);

            if (this.getFirstListNode(children) === null) {
                this.error('Condition is expected');
            }

            return children;
        },
        block: function() {
            return this.Block(false);
        }
    }
};

}, function(modId) { var map = {"../../tokenizer":1597942294286}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294369, function(require, module, exports) {
module.exports = {
    'dir': require('./dir'),
    'has': require('./has'),
    'lang': require('./lang'),
    'matches': require('./matches'),
    'not': require('./not'),
    'nth-child': require('./nth-child'),
    'nth-last-child': require('./nth-last-child'),
    'nth-last-of-type': require('./nth-last-of-type'),
    'nth-of-type': require('./nth-of-type'),
    'slotted': require('./slotted')
};

}, function(modId) { var map = {"./dir":1597942294370,"./has":1597942294371,"./lang":1597942294372,"./matches":1597942294373,"./not":1597942294375,"./nth-child":1597942294376,"./nth-last-child":1597942294378,"./nth-last-of-type":1597942294379,"./nth-of-type":1597942294381,"./slotted":1597942294382}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294370, function(require, module, exports) {
module.exports = {
    parse: function() {
        return this.createSingleNodeList(
            this.Identifier()
        );
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294371, function(require, module, exports) {
module.exports = {
    parse: function() {
        return this.createSingleNodeList(
            this.SelectorList()
        );
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294372, function(require, module, exports) {
module.exports = {
    parse: function() {
        return this.createSingleNodeList(
            this.Identifier()
        );
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294373, function(require, module, exports) {
module.exports = require('./common/selectorList');

}, function(modId) { var map = {"./common/selectorList":1597942294374}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294374, function(require, module, exports) {
module.exports = {
    parse: function selectorList() {
        return this.createSingleNodeList(
            this.SelectorList()
        );
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294375, function(require, module, exports) {
module.exports = require('./common/selectorList');

}, function(modId) { var map = {"./common/selectorList":1597942294374}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294376, function(require, module, exports) {
module.exports = require('./common/nthWithOfClause');

}, function(modId) { var map = {"./common/nthWithOfClause":1597942294377}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294377, function(require, module, exports) {
var ALLOW_OF_CLAUSE = true;

module.exports = {
    parse: function nthWithOfClause() {
        return this.createSingleNodeList(
            this.Nth(ALLOW_OF_CLAUSE)
        );
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294378, function(require, module, exports) {
module.exports = require('./common/nthWithOfClause');

}, function(modId) { var map = {"./common/nthWithOfClause":1597942294377}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294379, function(require, module, exports) {
module.exports = require('./common/nth');

}, function(modId) { var map = {"./common/nth":1597942294380}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294380, function(require, module, exports) {
var DISALLOW_OF_CLAUSE = false;

module.exports = {
    parse: function nth() {
        return this.createSingleNodeList(
            this.Nth(DISALLOW_OF_CLAUSE)
        );
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294381, function(require, module, exports) {
module.exports = require('./common/nth');

}, function(modId) { var map = {"./common/nth":1597942294380}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294382, function(require, module, exports) {
module.exports = {
    parse: function compoundSelector() {
        return this.createSingleNodeList(
            this.Selector()
        );
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294383, function(require, module, exports) {
module.exports = {
    node: require('../node')
};

}, function(modId) { var map = {"../node":1597942294313}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1597942294271);
})()
//# sourceMappingURL=index.js.map