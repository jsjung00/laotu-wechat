module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1597942294565, function(require, module, exports) {


var assign = require('./helpers/assign');

var ES5 = require('./es5');
var ES2015 = require('./es2015');
var ES2016 = require('./es2016');
var ES2017 = require('./es2017');
var ES2018 = require('./es2018');
var ES2019 = require('./es2019');

var ES = {
	ES5: ES5,
	ES6: ES2015,
	ES2015: ES2015,
	ES7: ES2016,
	ES2016: ES2016,
	ES2017: ES2017,
	ES2018: ES2018,
	ES2019: ES2019
};
assign(ES, ES5);
delete ES.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible
assign(ES, ES2015);

module.exports = ES;

}, function(modId) {var map = {"./helpers/assign":1597942294566,"./es5":1597942294568,"./es2015":1597942294621,"./es2016":1597942294740,"./es2017":1597942294854,"./es2018":1597942294967,"./es2019":1597942295088}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294566, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var has = require('has');

var $assign = GetIntrinsic('%Object%').assign;

module.exports = function assign(target, source) {
	if ($assign) {
		return $assign(target, source);
	}

	// eslint-disable-next-line no-restricted-syntax
	for (var key in source) {
		if (has(source, key)) {
			// eslint-disable-next-line no-param-reassign
			target[key] = source[key];
		}
	}
	return target;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294567, function(require, module, exports) {


/* globals
	Atomics,
	SharedArrayBuffer,
*/

var undefined;

var $TypeError = TypeError;

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () { throw new $TypeError(); };
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = require('has-symbols')();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var generator; // = function * () {};
var generatorFunction = generator ? getProto(generator) : undefined;
var asyncFn; // async function() {};
var asyncFunction = asyncFn ? asyncFn.constructor : undefined;
var asyncGen; // async function * () {};
var asyncGenFunction = asyncGen ? getProto(asyncGen) : undefined;
var asyncGenIterator = asyncGen ? asyncGen() : undefined;

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayBufferPrototype%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer.prototype,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%ArrayPrototype%': Array.prototype,
	'%ArrayProto_entries%': Array.prototype.entries,
	'%ArrayProto_forEach%': Array.prototype.forEach,
	'%ArrayProto_keys%': Array.prototype.keys,
	'%ArrayProto_values%': Array.prototype.values,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': asyncFunction,
	'%AsyncFunctionPrototype%': asyncFunction ? asyncFunction.prototype : undefined,
	'%AsyncGenerator%': asyncGen ? getProto(asyncGenIterator) : undefined,
	'%AsyncGeneratorFunction%': asyncGenFunction,
	'%AsyncGeneratorPrototype%': asyncGenFunction ? asyncGenFunction.prototype : undefined,
	'%AsyncIteratorPrototype%': asyncGenIterator && hasSymbols && Symbol.asyncIterator ? asyncGenIterator[Symbol.asyncIterator]() : undefined,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%Boolean%': Boolean,
	'%BooleanPrototype%': Boolean.prototype,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%DataViewPrototype%': typeof DataView === 'undefined' ? undefined : DataView.prototype,
	'%Date%': Date,
	'%DatePrototype%': Date.prototype,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%ErrorPrototype%': Error.prototype,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%EvalErrorPrototype%': EvalError.prototype,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float32ArrayPrototype%': typeof Float32Array === 'undefined' ? undefined : Float32Array.prototype,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%Float64ArrayPrototype%': typeof Float64Array === 'undefined' ? undefined : Float64Array.prototype,
	'%Function%': Function,
	'%FunctionPrototype%': Function.prototype,
	'%Generator%': generator ? getProto(generator()) : undefined,
	'%GeneratorFunction%': generatorFunction,
	'%GeneratorPrototype%': generatorFunction ? generatorFunction.prototype : undefined,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int8ArrayPrototype%': typeof Int8Array === 'undefined' ? undefined : Int8Array.prototype,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int16ArrayPrototype%': typeof Int16Array === 'undefined' ? undefined : Int8Array.prototype,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%Int32ArrayPrototype%': typeof Int32Array === 'undefined' ? undefined : Int32Array.prototype,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%JSONParse%': typeof JSON === 'object' ? JSON.parse : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%MapPrototype%': typeof Map === 'undefined' ? undefined : Map.prototype,
	'%Math%': Math,
	'%Number%': Number,
	'%NumberPrototype%': Number.prototype,
	'%Object%': Object,
	'%ObjectPrototype%': Object.prototype,
	'%ObjProto_toString%': Object.prototype.toString,
	'%ObjProto_valueOf%': Object.prototype.valueOf,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%PromisePrototype%': typeof Promise === 'undefined' ? undefined : Promise.prototype,
	'%PromiseProto_then%': typeof Promise === 'undefined' ? undefined : Promise.prototype.then,
	'%Promise_all%': typeof Promise === 'undefined' ? undefined : Promise.all,
	'%Promise_reject%': typeof Promise === 'undefined' ? undefined : Promise.reject,
	'%Promise_resolve%': typeof Promise === 'undefined' ? undefined : Promise.resolve,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%RangeErrorPrototype%': RangeError.prototype,
	'%ReferenceError%': ReferenceError,
	'%ReferenceErrorPrototype%': ReferenceError.prototype,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%RegExpPrototype%': RegExp.prototype,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SetPrototype%': typeof Set === 'undefined' ? undefined : Set.prototype,
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%SharedArrayBufferPrototype%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer.prototype,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%StringPrototype%': String.prototype,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SymbolPrototype%': hasSymbols ? Symbol.prototype : undefined,
	'%SyntaxError%': SyntaxError,
	'%SyntaxErrorPrototype%': SyntaxError.prototype,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypedArrayPrototype%': TypedArray ? TypedArray.prototype : undefined,
	'%TypeError%': $TypeError,
	'%TypeErrorPrototype%': $TypeError.prototype,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ArrayPrototype%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array.prototype,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint8ClampedArrayPrototype%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray.prototype,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint16ArrayPrototype%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array.prototype,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%Uint32ArrayPrototype%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array.prototype,
	'%URIError%': URIError,
	'%URIErrorPrototype%': URIError.prototype,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakMapPrototype%': typeof WeakMap === 'undefined' ? undefined : WeakMap.prototype,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet,
	'%WeakSetPrototype%': typeof WeakSet === 'undefined' ? undefined : WeakSet.prototype
};

var bind = require('function-bind');
var $replace = bind.call(Function.call, String.prototype.replace);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : (number || match);
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	if (!(name in INTRINSICS)) {
		throw new SyntaxError('intrinsic ' + name + ' does not exist!');
	}

	// istanbul ignore if // hopefully this is impossible to test :-)
	if (typeof INTRINSICS[name] === 'undefined' && !allowMissing) {
		throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
	}

	return INTRINSICS[name];
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);

	var value = getBaseIntrinsic('%' + (parts.length > 0 ? parts[0] : '') + '%', allowMissing);
	for (var i = 1; i < parts.length; i += 1) {
		if (value != null) {
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, parts[i]);
				if (!allowMissing && !(parts[i] in value)) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				value = desc ? (desc.get || desc.value) : value[parts[i]];
			} else {
				value = value[parts[i]];
			}
		}
	}
	return value;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294568, function(require, module, exports) {


/* eslint global-require: 0 */

// https://es5.github.io/#x9
module.exports = {
	'Abstract Equality Comparison': require('./5/AbstractEqualityComparison'),
	'Abstract Relational Comparison': require('./5/AbstractRelationalComparison'),
	'Strict Equality Comparison': require('./5/StrictEqualityComparison'),
	CheckObjectCoercible: require('./5/CheckObjectCoercible'),
	DateFromTime: require('./5/DateFromTime'),
	Day: require('./5/Day'),
	DayFromYear: require('./5/DayFromYear'),
	DaysInYear: require('./5/DaysInYear'),
	DayWithinYear: require('./5/DayWithinYear'),
	FromPropertyDescriptor: require('./5/FromPropertyDescriptor'),
	HourFromTime: require('./5/HourFromTime'),
	InLeapYear: require('./5/InLeapYear'),
	IsAccessorDescriptor: require('./5/IsAccessorDescriptor'),
	IsCallable: require('./5/IsCallable'),
	IsDataDescriptor: require('./5/IsDataDescriptor'),
	IsGenericDescriptor: require('./5/IsGenericDescriptor'),
	IsPropertyDescriptor: require('./5/IsPropertyDescriptor'),
	MakeDate: require('./5/MakeDate'),
	MakeDay: require('./5/MakeDay'),
	MakeTime: require('./5/MakeTime'),
	MinFromTime: require('./5/MinFromTime'),
	modulo: require('./5/modulo'),
	MonthFromTime: require('./5/MonthFromTime'),
	msFromTime: require('./5/msFromTime'),
	SameValue: require('./5/SameValue'),
	SecFromTime: require('./5/SecFromTime'),
	TimeClip: require('./5/TimeClip'),
	TimeFromYear: require('./5/TimeFromYear'),
	TimeWithinDay: require('./5/TimeWithinDay'),
	ToBoolean: require('./5/ToBoolean'),
	ToInt32: require('./5/ToInt32'),
	ToInteger: require('./5/ToInteger'),
	ToNumber: require('./5/ToNumber'),
	ToObject: require('./5/ToObject'),
	ToPrimitive: require('./5/ToPrimitive'),
	ToPropertyDescriptor: require('./5/ToPropertyDescriptor'),
	ToString: require('./5/ToString'),
	ToUint16: require('./5/ToUint16'),
	ToUint32: require('./5/ToUint32'),
	Type: require('./5/Type'),
	WeekDay: require('./5/WeekDay'),
	YearFromTime: require('./5/YearFromTime')
};

}, function(modId) { var map = {"./5/AbstractEqualityComparison":1597942294569,"./5/AbstractRelationalComparison":1597942294573,"./5/StrictEqualityComparison":1597942294579,"./5/CheckObjectCoercible":1597942294580,"./5/DateFromTime":1597942294581,"./5/Day":1597942294583,"./5/DayFromYear":1597942294585,"./5/DaysInYear":1597942294588,"./5/DayWithinYear":1597942294582,"./5/FromPropertyDescriptor":1597942294591,"./5/HourFromTime":1597942294595,"./5/InLeapYear":1597942294587,"./5/IsAccessorDescriptor":1597942294594,"./5/IsCallable":1597942294596,"./5/IsDataDescriptor":1597942294592,"./5/IsGenericDescriptor":1597942294597,"./5/IsPropertyDescriptor":1597942294598,"./5/MakeDate":1597942294600,"./5/MakeDay":1597942294601,"./5/MakeTime":1597942294604,"./5/MinFromTime":1597942294605,"./5/modulo":1597942294606,"./5/MonthFromTime":1597942294590,"./5/msFromTime":1597942294607,"./5/SameValue":1597942294608,"./5/SecFromTime":1597942294609,"./5/TimeClip":1597942294610,"./5/TimeFromYear":1597942294611,"./5/TimeWithinDay":1597942294612,"./5/ToBoolean":1597942294613,"./5/ToInt32":1597942294614,"./5/ToInteger":1597942294602,"./5/ToNumber":1597942294570,"./5/ToObject":1597942294615,"./5/ToPrimitive":1597942294571,"./5/ToPropertyDescriptor":1597942294616,"./5/ToString":1597942294617,"./5/ToUint16":1597942294618,"./5/ToUint32":1597942294619,"./5/Type":1597942294572,"./5/WeekDay":1597942294620,"./5/YearFromTime":1597942294586}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294569, function(require, module, exports) {


var ToNumber = require('./ToNumber');
var ToPrimitive = require('./ToPrimitive');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3

module.exports = function AbstractEqualityComparison(x, y) {
	var xType = Type(x);
	var yType = Type(y);
	if (xType === yType) {
		return x === y; // ES6+ specified this shortcut anyways.
	}
	if (x == null && y == null) {
		return true;
	}
	if (xType === 'Number' && yType === 'String') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if (xType === 'String' && yType === 'Number') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (xType === 'Boolean') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (yType === 'Boolean') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if ((xType === 'String' || xType === 'Number') && yType === 'Object') {
		return AbstractEqualityComparison(x, ToPrimitive(y));
	}
	if (xType === 'Object' && (yType === 'String' || yType === 'Number')) {
		return AbstractEqualityComparison(ToPrimitive(x), y);
	}
	return false;
};

}, function(modId) { var map = {"./ToNumber":1597942294570,"./ToPrimitive":1597942294571,"./Type":1597942294572}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294570, function(require, module, exports) {


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.3

module.exports = function ToNumber(value) {
	return +value; // eslint-disable-line no-implicit-coercion
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294571, function(require, module, exports) {


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.1

module.exports = require('es-to-primitive/es5');

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294572, function(require, module, exports) {


// https://www.ecma-international.org/ecma-262/5.1/#sec-8

module.exports = function Type(x) {
	if (x === null) {
		return 'Null';
	}
	if (typeof x === 'undefined') {
		return 'Undefined';
	}
	if (typeof x === 'function' || typeof x === 'object') {
		return 'Object';
	}
	if (typeof x === 'number') {
		return 'Number';
	}
	if (typeof x === 'boolean') {
		return 'Boolean';
	}
	if (typeof x === 'string') {
		return 'String';
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294573, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Number = GetIntrinsic('%Number%');
var $TypeError = GetIntrinsic('%TypeError%');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var isPrefixOf = require('../helpers/isPrefixOf');

var ToNumber = require('./ToNumber');
var ToPrimitive = require('./ToPrimitive');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/5.1/#sec-11.8.5

// eslint-disable-next-line max-statements
module.exports = function AbstractRelationalComparison(x, y, LeftFirst) {
	if (Type(LeftFirst) !== 'Boolean') {
		throw new $TypeError('Assertion failed: LeftFirst argument must be a Boolean');
	}
	var px;
	var py;
	if (LeftFirst) {
		px = ToPrimitive(x, $Number);
		py = ToPrimitive(y, $Number);
	} else {
		py = ToPrimitive(y, $Number);
		px = ToPrimitive(x, $Number);
	}
	var bothStrings = Type(px) === 'String' && Type(py) === 'String';
	if (!bothStrings) {
		var nx = ToNumber(px);
		var ny = ToNumber(py);
		if ($isNaN(nx) || $isNaN(ny)) {
			return undefined;
		}
		if ($isFinite(nx) && $isFinite(ny) && nx === ny) {
			return false;
		}
		if (nx === 0 && ny === 0) {
			return false;
		}
		if (nx === Infinity) {
			return false;
		}
		if (ny === Infinity) {
			return true;
		}
		if (ny === -Infinity) {
			return false;
		}
		if (nx === -Infinity) {
			return true;
		}
		return nx < ny; // by now, these are both nonzero, finite, and not equal
	}
	if (isPrefixOf(py, px)) {
		return false;
	}
	if (isPrefixOf(px, py)) {
		return true;
	}
	return px < py; // both strings, neither a prefix of the other. shortcut for steps c-f
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/isPrefixOf":1597942294576,"./ToNumber":1597942294570,"./ToPrimitive":1597942294571,"./Type":1597942294572}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294574, function(require, module, exports) {


module.exports = Number.isNaN || function isNaN(a) {
	return a !== a;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294575, function(require, module, exports) {


var $isNaN = Number.isNaN || function (a) { return a !== a; };

module.exports = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294576, function(require, module, exports) {


var $strSlice = require('../helpers/callBound')('String.prototype.slice');

module.exports = function isPrefixOf(prefix, string) {
	if (prefix === string) {
		return true;
	}
	if (prefix.length > string.length) {
		return false;
	}
	return $strSlice(string, 0, prefix.length) === prefix;
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294577, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var callBind = require('./callBind');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.')) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./callBind":1597942294578}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294578, function(require, module, exports) {


var bind = require('function-bind');

var GetIntrinsic = require('../GetIntrinsic');

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

module.exports = function callBind() {
	return $reflectApply(bind, $call, arguments);
};

module.exports.apply = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294579, function(require, module, exports) {


var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/5.1/#sec-11.9.6

module.exports = function StrictEqualityComparison(x, y) {
	var xType = Type(x);
	var yType = Type(y);
	if (xType !== yType) {
		return false;
	}
	if (xType === 'Undefined' || xType === 'Null') {
		return true;
	}
	return x === y; // shortcut for steps 4-7
};

}, function(modId) { var map = {"./Type":1597942294572}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294580, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.10

module.exports = function CheckObjectCoercible(value, optMessage) {
	if (value == null) {
		throw new $TypeError(optMessage || ('Cannot call method on ' + value));
	}
	return value;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294581, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $EvalError = GetIntrinsic('%EvalError%');

var DayWithinYear = require('./DayWithinYear');
var InLeapYear = require('./InLeapYear');
var MonthFromTime = require('./MonthFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.5

module.exports = function DateFromTime(t) {
	var m = MonthFromTime(t);
	var d = DayWithinYear(t);
	if (m === 0) {
		return d + 1;
	}
	if (m === 1) {
		return d - 30;
	}
	var leap = InLeapYear(t);
	if (m === 2) {
		return d - 58 - leap;
	}
	if (m === 3) {
		return d - 89 - leap;
	}
	if (m === 4) {
		return d - 119 - leap;
	}
	if (m === 5) {
		return d - 150 - leap;
	}
	if (m === 6) {
		return d - 180 - leap;
	}
	if (m === 7) {
		return d - 211 - leap;
	}
	if (m === 8) {
		return d - 242 - leap;
	}
	if (m === 9) {
		return d - 272 - leap;
	}
	if (m === 10) {
		return d - 303 - leap;
	}
	if (m === 11) {
		return d - 333 - leap;
	}
	throw new $EvalError('Assertion failed: MonthFromTime returned an impossible value: ' + m);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./DayWithinYear":1597942294582,"./InLeapYear":1597942294587,"./MonthFromTime":1597942294590}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294582, function(require, module, exports) {


var Day = require('./Day');
var DayFromYear = require('./DayFromYear');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.4

module.exports = function DayWithinYear(t) {
	return Day(t) - DayFromYear(YearFromTime(t));
};

}, function(modId) { var map = {"./Day":1597942294583,"./DayFromYear":1597942294585,"./YearFromTime":1597942294586}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294583, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.2

module.exports = function Day(t) {
	return $floor(t / msPerDay);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294584, function(require, module, exports) {


var HoursPerDay = 24;
var MinutesPerHour = 60;
var SecondsPerMinute = 60;
var msPerSecond = 1e3;
var msPerMinute = msPerSecond * SecondsPerMinute;
var msPerHour = msPerMinute * MinutesPerHour;
var msPerDay = 86400000;

module.exports = {
	HoursPerDay: HoursPerDay,
	MinutesPerHour: MinutesPerHour,
	SecondsPerMinute: SecondsPerMinute,
	msPerSecond: msPerSecond,
	msPerMinute: msPerMinute,
	msPerHour: msPerHour,
	msPerDay: msPerDay
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294585, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function DayFromYear(y) {
	return (365 * (y - 1970)) + $floor((y - 1969) / 4) - $floor((y - 1901) / 100) + $floor((y - 1601) / 400);
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294586, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Date = GetIntrinsic('%Date%');

var callBound = require('../helpers/callBound');

var $getUTCFullYear = callBound('Date.prototype.getUTCFullYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function YearFromTime(t) {
	// largest y such that this.TimeFromYear(y) <= t
	return $getUTCFullYear(new $Date(t));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294587, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $EvalError = GetIntrinsic('%EvalError%');

var DaysInYear = require('./DaysInYear');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function InLeapYear(t) {
	var days = DaysInYear(YearFromTime(t));
	if (days === 365) {
		return 0;
	}
	if (days === 366) {
		return 1;
	}
	throw new $EvalError('Assertion failed: there are not 365 or 366 days in a year, got: ' + days);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./DaysInYear":1597942294588,"./YearFromTime":1597942294586}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294588, function(require, module, exports) {


var mod = require('../helpers/mod');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function DaysInYear(y) {
	if (mod(y, 4) !== 0) {
		return 365;
	}
	if (mod(y, 100) !== 0) {
		return 366;
	}
	if (mod(y, 400) !== 0) {
		return 365;
	}
	return 366;
};

}, function(modId) { var map = {"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294589, function(require, module, exports) {


var $floor = Math.floor;

module.exports = function mod(number, modulo) {
	var remain = number % modulo;
	return $floor(remain >= 0 ? remain : remain + modulo);
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294590, function(require, module, exports) {


var DayWithinYear = require('./DayWithinYear');
var InLeapYear = require('./InLeapYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.4

module.exports = function MonthFromTime(t) {
	var day = DayWithinYear(t);
	if (0 <= day && day < 31) {
		return 0;
	}
	var leap = InLeapYear(t);
	if (31 <= day && day < (59 + leap)) {
		return 1;
	}
	if ((59 + leap) <= day && day < (90 + leap)) {
		return 2;
	}
	if ((90 + leap) <= day && day < (120 + leap)) {
		return 3;
	}
	if ((120 + leap) <= day && day < (151 + leap)) {
		return 4;
	}
	if ((151 + leap) <= day && day < (181 + leap)) {
		return 5;
	}
	if ((181 + leap) <= day && day < (212 + leap)) {
		return 6;
	}
	if ((212 + leap) <= day && day < (243 + leap)) {
		return 7;
	}
	if ((243 + leap) <= day && day < (273 + leap)) {
		return 8;
	}
	if ((273 + leap) <= day && day < (304 + leap)) {
		return 9;
	}
	if ((304 + leap) <= day && day < (334 + leap)) {
		return 10;
	}
	if ((334 + leap) <= day && day < (365 + leap)) {
		return 11;
	}
};

}, function(modId) { var map = {"./DayWithinYear":1597942294582,"./InLeapYear":1597942294587}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294591, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Type = require('./Type');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');

var assertRecord = require('../helpers/assertRecord');

// https://ecma-international.org/ecma-262/5.1/#sec-8.10.4

module.exports = function FromPropertyDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return Desc;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (IsDataDescriptor(Desc)) {
		return {
			value: Desc['[[Value]]'],
			writable: !!Desc['[[Writable]]'],
			enumerable: !!Desc['[[Enumerable]]'],
			configurable: !!Desc['[[Configurable]]']
		};
	} else if (IsAccessorDescriptor(Desc)) {
		return {
			get: Desc['[[Get]]'],
			set: Desc['[[Set]]'],
			enumerable: !!Desc['[[Enumerable]]'],
			configurable: !!Desc['[[Configurable]]']
		};
	} else {
		throw new $TypeError('FromPropertyDescriptor must be called with a fully populated Property Descriptor');
	}
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294572,"./IsDataDescriptor":1597942294592,"./IsAccessorDescriptor":1597942294594,"../helpers/assertRecord":1597942294593}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294592, function(require, module, exports) {


var has = require('has');

var Type = require('./Type');

var assertRecord = require('../helpers/assertRecord');

// https://ecma-international.org/ecma-262/5.1/#sec-8.10.2

module.exports = function IsDataDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!has(Desc, '[[Value]]') && !has(Desc, '[[Writable]]')) {
		return false;
	}

	return true;
};

}, function(modId) { var map = {"./Type":1597942294572,"../helpers/assertRecord":1597942294593}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294593, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');

var has = require('has');

var predicates = {
	// https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type
	'Property Descriptor': function isPropertyDescriptor(Type, Desc) {
		if (Type(Desc) !== 'Object') {
			return false;
		}
		var allowed = {
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Get]]': true,
			'[[Set]]': true,
			'[[Value]]': true,
			'[[Writable]]': true
		};

		for (var key in Desc) { // eslint-disable-line
			if (has(Desc, key) && !allowed[key]) {
				return false;
			}
		}

		var isData = has(Desc, '[[Value]]');
		var IsAccessor = has(Desc, '[[Get]]') || has(Desc, '[[Set]]');
		if (isData && IsAccessor) {
			throw new $TypeError('Property Descriptors may not be both accessor and data descriptors');
		}
		return true;
	}
};

module.exports = function assertRecord(Type, recordType, argumentName, value) {
	var predicate = predicates[recordType];
	if (typeof predicate !== 'function') {
		throw new $SyntaxError('unknown record type: ' + recordType);
	}
	if (!predicate(Type, value)) {
		throw new $TypeError(argumentName + ' must be a ' + recordType);
	}
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294594, function(require, module, exports) {


var has = require('has');

var Type = require('./Type');

var assertRecord = require('../helpers/assertRecord');

// https://ecma-international.org/ecma-262/5.1/#sec-8.10.1

module.exports = function IsAccessorDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!has(Desc, '[[Get]]') && !has(Desc, '[[Set]]')) {
		return false;
	}

	return true;
};

}, function(modId) { var map = {"./Type":1597942294572,"../helpers/assertRecord":1597942294593}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294595, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerHour = timeConstants.msPerHour;
var HoursPerDay = timeConstants.HoursPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function HourFromTime(t) {
	return mod($floor(t / msPerHour), HoursPerDay);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294596, function(require, module, exports) {


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.11

module.exports = require('is-callable');

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294597, function(require, module, exports) {


var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var Type = require('./Type');

var assertRecord = require('../helpers/assertRecord');

// https://ecma-international.org/ecma-262/5.1/#sec-8.10.3

module.exports = function IsGenericDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!IsAccessorDescriptor(Desc) && !IsDataDescriptor(Desc)) {
		return true;
	}

	return false;
};

}, function(modId) { var map = {"./IsAccessorDescriptor":1597942294594,"./IsDataDescriptor":1597942294592,"./Type":1597942294572,"../helpers/assertRecord":1597942294593}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294598, function(require, module, exports) {


var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');

var Type = require('./Type');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');

// https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type

module.exports = function IsPropertyDescriptor(Desc) {
	return isPropertyDescriptor({
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor,
		Type: Type
	}, Desc);
};

}, function(modId) { var map = {"../helpers/isPropertyDescriptor":1597942294599,"./Type":1597942294572,"./IsDataDescriptor":1597942294592,"./IsAccessorDescriptor":1597942294594}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294599, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var has = require('has');
var $TypeError = GetIntrinsic('%TypeError%');

module.exports = function IsPropertyDescriptor(ES, Desc) {
	if (ES.Type(Desc) !== 'Object') {
		return false;
	}
	var allowed = {
		'[[Configurable]]': true,
		'[[Enumerable]]': true,
		'[[Get]]': true,
		'[[Set]]': true,
		'[[Value]]': true,
		'[[Writable]]': true
	};

	for (var key in Desc) { // eslint-disable-line no-restricted-syntax
		if (has(Desc, key) && !allowed[key]) {
			return false;
		}
	}

	if (ES.IsDataDescriptor(Desc) && ES.IsAccessorDescriptor(Desc)) {
		throw new $TypeError('Property Descriptors may not be both accessor and data descriptors');
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294600, function(require, module, exports) {


var $isFinite = require('../helpers/isFinite');
var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.13

module.exports = function MakeDate(day, time) {
	if (!$isFinite(day) || !$isFinite(time)) {
		return NaN;
	}
	return (day * msPerDay) + time;
};

}, function(modId) { var map = {"../helpers/isFinite":1597942294575,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294601, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');
var $DateUTC = GetIntrinsic('%Date.UTC%');

var mod = require('../helpers/mod');
var $isFinite = require('../helpers/isFinite');

var DateFromTime = require('./DateFromTime');
var Day = require('./Day');
var MonthFromTime = require('./MonthFromTime');
var ToInteger = require('./ToInteger');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.12

module.exports = function MakeDay(year, month, date) {
	if (!$isFinite(year) || !$isFinite(month) || !$isFinite(date)) {
		return NaN;
	}
	var y = ToInteger(year);
	var m = ToInteger(month);
	var dt = ToInteger(date);
	var ym = y + $floor(m / 12);
	var mn = mod(m, 12);
	var t = $DateUTC(ym, mn, 1);
	if (YearFromTime(t) !== ym || MonthFromTime(t) !== mn || DateFromTime(t) !== 1) {
		return NaN;
	}
	return Day(t) + dt - 1;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/isFinite":1597942294575,"./DateFromTime":1597942294581,"./Day":1597942294583,"./MonthFromTime":1597942294590,"./ToInteger":1597942294602,"./YearFromTime":1597942294586}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294602, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');
var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var $sign = require('../helpers/sign');

var $floor = $Math.floor;
var $abs = $Math.abs;

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.4

module.exports = function ToInteger(value) {
	var number = ToNumber(value);
	if ($isNaN(number)) { return 0; }
	if (number === 0 || !$isFinite(number)) { return number; }
	return $sign(number) * $floor($abs(number));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942294570,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/sign":1597942294603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294603, function(require, module, exports) {


module.exports = function sign(number) {
	return number >= 0 ? 1 : -1;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294604, function(require, module, exports) {


var $isFinite = require('../helpers/isFinite');
var timeConstants = require('../helpers/timeConstants');
var msPerSecond = timeConstants.msPerSecond;
var msPerMinute = timeConstants.msPerMinute;
var msPerHour = timeConstants.msPerHour;

var ToInteger = require('./ToInteger');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.11

module.exports = function MakeTime(hour, min, sec, ms) {
	if (!$isFinite(hour) || !$isFinite(min) || !$isFinite(sec) || !$isFinite(ms)) {
		return NaN;
	}
	var h = ToInteger(hour);
	var m = ToInteger(min);
	var s = ToInteger(sec);
	var milli = ToInteger(ms);
	var t = (h * msPerHour) + (m * msPerMinute) + (s * msPerSecond) + milli;
	return t;
};

}, function(modId) { var map = {"../helpers/isFinite":1597942294575,"../helpers/timeConstants":1597942294584,"./ToInteger":1597942294602}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294605, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerMinute = timeConstants.msPerMinute;
var MinutesPerHour = timeConstants.MinutesPerHour;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function MinFromTime(t) {
	return mod($floor(t / msPerMinute), MinutesPerHour);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294606, function(require, module, exports) {


var mod = require('../helpers/mod');

// https://ecma-international.org/ecma-262/5.1/#sec-5.2

module.exports = function modulo(x, y) {
	return mod(x, y);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294607, function(require, module, exports) {


var mod = require('../helpers/mod');
var msPerSecond = require('../helpers/timeConstants').msPerSecond;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function msFromTime(t) {
	return mod(t, msPerSecond);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294608, function(require, module, exports) {


var $isNaN = require('../helpers/isNaN');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.12

module.exports = function SameValue(x, y) {
	if (x === y) { // 0 === -0, but they are not identical.
		if (x === 0) { return 1 / x === 1 / y; }
		return true;
	}
	return $isNaN(x) && $isNaN(y);
};

}, function(modId) { var map = {"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294609, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerSecond = timeConstants.msPerSecond;
var SecondsPerMinute = timeConstants.SecondsPerMinute;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function SecFromTime(t) {
	return mod($floor(t / msPerSecond), SecondsPerMinute);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294610, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Date = GetIntrinsic('%Date%');
var $Number = GetIntrinsic('%Number%');
var $abs = GetIntrinsic('%Math.abs%');

var $isFinite = require('../helpers/isFinite');

var ToNumber = require('./ToNumber');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.14

module.exports = function TimeClip(time) {
	if (!$isFinite(time) || $abs(time) > 8.64e15) {
		return NaN;
	}
	return $Number(new $Date(ToNumber(time)));
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isFinite":1597942294575,"./ToNumber":1597942294570}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294611, function(require, module, exports) {


var msPerDay = require('../helpers/timeConstants').msPerDay;

var DayFromYear = require('./DayFromYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function TimeFromYear(y) {
	return msPerDay * DayFromYear(y);
};

}, function(modId) { var map = {"../helpers/timeConstants":1597942294584,"./DayFromYear":1597942294585}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294612, function(require, module, exports) {


var mod = require('../helpers/mod');
var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.2

module.exports = function TimeWithinDay(t) {
	return mod(t, msPerDay);
};


}, function(modId) { var map = {"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294613, function(require, module, exports) {


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.2

module.exports = function ToBoolean(value) { return !!value; };

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294614, function(require, module, exports) {


var ToNumber = require('./ToNumber');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.5

module.exports = function ToInt32(x) {
	return ToNumber(x) >> 0;
};

}, function(modId) { var map = {"./ToNumber":1597942294570}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294615, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Object = GetIntrinsic('%Object%');

var CheckObjectCoercible = require('./CheckObjectCoercible');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.9

module.exports = function ToObject(value) {
	CheckObjectCoercible(value);
	return $Object(value);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./CheckObjectCoercible":1597942294580}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294616, function(require, module, exports) {


var has = require('has');

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Type = require('./Type');
var ToBoolean = require('./ToBoolean');
var IsCallable = require('./IsCallable');

// https://ecma-international.org/ecma-262/5.1/#sec-8.10.5

module.exports = function ToPropertyDescriptor(Obj) {
	if (Type(Obj) !== 'Object') {
		throw new $TypeError('ToPropertyDescriptor requires an object');
	}

	var desc = {};
	if (has(Obj, 'enumerable')) {
		desc['[[Enumerable]]'] = ToBoolean(Obj.enumerable);
	}
	if (has(Obj, 'configurable')) {
		desc['[[Configurable]]'] = ToBoolean(Obj.configurable);
	}
	if (has(Obj, 'value')) {
		desc['[[Value]]'] = Obj.value;
	}
	if (has(Obj, 'writable')) {
		desc['[[Writable]]'] = ToBoolean(Obj.writable);
	}
	if (has(Obj, 'get')) {
		var getter = Obj.get;
		if (typeof getter !== 'undefined' && !IsCallable(getter)) {
			throw new TypeError('getter must be a function');
		}
		desc['[[Get]]'] = getter;
	}
	if (has(Obj, 'set')) {
		var setter = Obj.set;
		if (typeof setter !== 'undefined' && !IsCallable(setter)) {
			throw new $TypeError('setter must be a function');
		}
		desc['[[Set]]'] = setter;
	}

	if ((has(desc, '[[Get]]') || has(desc, '[[Set]]')) && (has(desc, '[[Value]]') || has(desc, '[[Writable]]'))) {
		throw new $TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
	}
	return desc;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294572,"./ToBoolean":1597942294613,"./IsCallable":1597942294596}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294617, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $String = GetIntrinsic('%String%');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.8

module.exports = function ToString(value) {
	return $String(value);
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294618, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var $sign = require('../helpers/sign');
var $mod = require('../helpers/mod');

var $floor = $Math.floor;
var $abs = $Math.abs;

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.7

module.exports = function ToUint16(value) {
	var number = ToNumber(value);
	if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
	var posInt = $sign(number) * $floor($abs(number));
	return $mod(posInt, 0x10000);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942294570,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/sign":1597942294603,"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294619, function(require, module, exports) {


var ToNumber = require('./ToNumber');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.6

module.exports = function ToUint32(x) {
	return ToNumber(x) >>> 0;
};

}, function(modId) { var map = {"./ToNumber":1597942294570}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294620, function(require, module, exports) {


var mod = require('../helpers/mod');

var Day = require('./Day');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.6

module.exports = function WeekDay(t) {
	return mod(Day(t) + 4, 7);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589,"./Day":1597942294583}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294621, function(require, module, exports) {


/* eslint global-require: 0 */
// https://www.ecma-international.org/ecma-262/6.0/#sec-abstract-operations
var ES6 = {
	'Abstract Equality Comparison': require('./2015/AbstractEqualityComparison'),
	'Abstract Relational Comparison': require('./2015/AbstractRelationalComparison'),
	'Strict Equality Comparison': require('./2015/StrictEqualityComparison'),
	AdvanceStringIndex: require('./2015/AdvanceStringIndex'),
	ArrayCreate: require('./2015/ArrayCreate'),
	ArraySetLength: require('./2015/ArraySetLength'),
	ArraySpeciesCreate: require('./2015/ArraySpeciesCreate'),
	Call: require('./2015/Call'),
	CanonicalNumericIndexString: require('./2015/CanonicalNumericIndexString'),
	CompletePropertyDescriptor: require('./2015/CompletePropertyDescriptor'),
	CreateDataProperty: require('./2015/CreateDataProperty'),
	CreateDataPropertyOrThrow: require('./2015/CreateDataPropertyOrThrow'),
	CreateHTML: require('./2015/CreateHTML'),
	CreateIterResultObject: require('./2015/CreateIterResultObject'),
	CreateListFromArrayLike: require('./2015/CreateListFromArrayLike'),
	CreateMethodProperty: require('./2015/CreateMethodProperty'),
	DateFromTime: require('./2015/DateFromTime'),
	Day: require('./2015/Day'),
	DayFromYear: require('./2015/DayFromYear'),
	DaysInYear: require('./2015/DaysInYear'),
	DayWithinYear: require('./2015/DayWithinYear'),
	DefinePropertyOrThrow: require('./2015/DefinePropertyOrThrow'),
	DeletePropertyOrThrow: require('./2015/DeletePropertyOrThrow'),
	EnumerableOwnNames: require('./2015/EnumerableOwnNames'),
	FromPropertyDescriptor: require('./2015/FromPropertyDescriptor'),
	Get: require('./2015/Get'),
	GetIterator: require('./2015/GetIterator'),
	GetMethod: require('./2015/GetMethod'),
	GetOwnPropertyKeys: require('./2015/GetOwnPropertyKeys'),
	GetPrototypeFromConstructor: require('./2015/GetPrototypeFromConstructor'),
	GetSubstitution: require('./2015/GetSubstitution'),
	GetV: require('./2015/GetV'),
	HasOwnProperty: require('./2015/HasOwnProperty'),
	HasProperty: require('./2015/HasProperty'),
	HourFromTime: require('./2015/HourFromTime'),
	InLeapYear: require('./2015/InLeapYear'),
	InstanceofOperator: require('./2015/InstanceofOperator'),
	Invoke: require('./2015/Invoke'),
	IsAccessorDescriptor: require('./2015/IsAccessorDescriptor'),
	IsArray: require('./2015/IsArray'),
	IsCallable: require('./2015/IsCallable'),
	IsConcatSpreadable: require('./2015/IsConcatSpreadable'),
	IsConstructor: require('./2015/IsConstructor'),
	IsDataDescriptor: require('./2015/IsDataDescriptor'),
	IsExtensible: require('./2015/IsExtensible'),
	IsGenericDescriptor: require('./2015/IsGenericDescriptor'),
	IsInteger: require('./2015/IsInteger'),
	IsPromise: require('./2015/IsPromise'),
	IsPropertyDescriptor: require('./2015/IsPropertyDescriptor'),
	IsPropertyKey: require('./2015/IsPropertyKey'),
	IsRegExp: require('./2015/IsRegExp'),
	IteratorClose: require('./2015/IteratorClose'),
	IteratorComplete: require('./2015/IteratorComplete'),
	IteratorNext: require('./2015/IteratorNext'),
	IteratorStep: require('./2015/IteratorStep'),
	IteratorValue: require('./2015/IteratorValue'),
	MakeDate: require('./2015/MakeDate'),
	MakeDay: require('./2015/MakeDay'),
	MakeTime: require('./2015/MakeTime'),
	MinFromTime: require('./2015/MinFromTime'),
	modulo: require('./2015/modulo'),
	MonthFromTime: require('./2015/MonthFromTime'),
	msFromTime: require('./2015/msFromTime'),
	ObjectCreate: require('./2015/ObjectCreate'),
	OrdinaryDefineOwnProperty: require('./2015/OrdinaryDefineOwnProperty'),
	OrdinaryGetOwnProperty: require('./2015/OrdinaryGetOwnProperty'),
	OrdinaryHasInstance: require('./2015/OrdinaryHasInstance'),
	OrdinaryHasProperty: require('./2015/OrdinaryHasProperty'),
	RegExpExec: require('./2015/RegExpExec'),
	RequireObjectCoercible: require('./2015/RequireObjectCoercible'),
	SameValue: require('./2015/SameValue'),
	SameValueZero: require('./2015/SameValueZero'),
	SecFromTime: require('./2015/SecFromTime'),
	Set: require('./2015/Set'),
	SetFunctionName: require('./2015/SetFunctionName'),
	SetIntegrityLevel: require('./2015/SetIntegrityLevel'),
	SpeciesConstructor: require('./2015/SpeciesConstructor'),
	SymbolDescriptiveString: require('./2015/SymbolDescriptiveString'),
	TestIntegrityLevel: require('./2015/TestIntegrityLevel'),
	thisBooleanValue: require('./2015/thisBooleanValue'),
	thisNumberValue: require('./2015/thisNumberValue'),
	thisStringValue: require('./2015/thisStringValue'),
	thisTimeValue: require('./2015/thisTimeValue'),
	TimeClip: require('./2015/TimeClip'),
	TimeFromYear: require('./2015/TimeFromYear'),
	TimeWithinDay: require('./2015/TimeWithinDay'),
	ToBoolean: require('./2015/ToBoolean'),
	ToDateString: require('./2015/ToDateString'),
	ToInt16: require('./2015/ToInt16'),
	ToInt32: require('./2015/ToInt32'),
	ToInt8: require('./2015/ToInt8'),
	ToInteger: require('./2015/ToInteger'),
	ToLength: require('./2015/ToLength'),
	ToNumber: require('./2015/ToNumber'),
	ToObject: require('./2015/ToObject'),
	ToPrimitive: require('./2015/ToPrimitive'),
	ToPropertyDescriptor: require('./2015/ToPropertyDescriptor'),
	ToPropertyKey: require('./2015/ToPropertyKey'),
	ToString: require('./2015/ToString'),
	ToUint16: require('./2015/ToUint16'),
	ToUint32: require('./2015/ToUint32'),
	ToUint8: require('./2015/ToUint8'),
	ToUint8Clamp: require('./2015/ToUint8Clamp'),
	Type: require('./2015/Type'),
	ValidateAndApplyPropertyDescriptor: require('./2015/ValidateAndApplyPropertyDescriptor'),
	WeekDay: require('./2015/WeekDay'),
	YearFromTime: require('./2015/YearFromTime')
};

module.exports = ES6;

}, function(modId) { var map = {"./2015/AbstractEqualityComparison":1597942294622,"./2015/AbstractRelationalComparison":1597942294628,"./2015/StrictEqualityComparison":1597942294629,"./2015/AdvanceStringIndex":1597942294630,"./2015/ArrayCreate":1597942294633,"./2015/ArraySetLength":1597942294634,"./2015/ArraySpeciesCreate":1597942294656,"./2015/Call":1597942294660,"./2015/CanonicalNumericIndexString":1597942294661,"./2015/CompletePropertyDescriptor":1597942294662,"./2015/CreateDataProperty":1597942294663,"./2015/CreateDataPropertyOrThrow":1597942294664,"./2015/CreateHTML":1597942294665,"./2015/CreateIterResultObject":1597942294667,"./2015/CreateListFromArrayLike":1597942294668,"./2015/CreateMethodProperty":1597942294671,"./2015/DateFromTime":1597942294672,"./2015/Day":1597942294674,"./2015/DayFromYear":1597942294675,"./2015/DaysInYear":1597942294678,"./2015/DayWithinYear":1597942294673,"./2015/DefinePropertyOrThrow":1597942294659,"./2015/DeletePropertyOrThrow":1597942294680,"./2015/EnumerableOwnNames":1597942294681,"./2015/FromPropertyDescriptor":1597942294650,"./2015/Get":1597942294657,"./2015/GetIterator":1597942294682,"./2015/GetMethod":1597942294684,"./2015/GetOwnPropertyKeys":1597942294687,"./2015/GetPrototypeFromConstructor":1597942294688,"./2015/GetSubstitution":1597942294689,"./2015/GetV":1597942294685,"./2015/HasOwnProperty":1597942294690,"./2015/HasProperty":1597942294691,"./2015/HourFromTime":1597942294692,"./2015/InLeapYear":1597942294677,"./2015/InstanceofOperator":1597942294693,"./2015/Invoke":1597942294695,"./2015/IsAccessorDescriptor":1597942294636,"./2015/IsArray":1597942294635,"./2015/IsCallable":1597942294644,"./2015/IsConcatSpreadable":1597942294696,"./2015/IsConstructor":1597942294658,"./2015/IsDataDescriptor":1597942294637,"./2015/IsExtensible":1597942294640,"./2015/IsGenericDescriptor":1597942294651,"./2015/IsInteger":1597942294631,"./2015/IsPromise":1597942294697,"./2015/IsPropertyDescriptor":1597942294698,"./2015/IsPropertyKey":1597942294641,"./2015/IsRegExp":1597942294653,"./2015/IteratorClose":1597942294699,"./2015/IteratorComplete":1597942294700,"./2015/IteratorNext":1597942294701,"./2015/IteratorStep":1597942294702,"./2015/IteratorValue":1597942294703,"./2015/MakeDate":1597942294704,"./2015/MakeDay":1597942294705,"./2015/MakeTime":1597942294706,"./2015/MinFromTime":1597942294707,"./2015/modulo":1597942294708,"./2015/MonthFromTime":1597942294679,"./2015/msFromTime":1597942294709,"./2015/ObjectCreate":1597942294710,"./2015/OrdinaryDefineOwnProperty":1597942294638,"./2015/OrdinaryGetOwnProperty":1597942294652,"./2015/OrdinaryHasInstance":1597942294694,"./2015/OrdinaryHasProperty":1597942294711,"./2015/RegExpExec":1597942294712,"./2015/RequireObjectCoercible":1597942294666,"./2015/SameValue":1597942294645,"./2015/SameValueZero":1597942294713,"./2015/SecFromTime":1597942294714,"./2015/Set":1597942294715,"./2015/SetFunctionName":1597942294716,"./2015/SetIntegrityLevel":1597942294719,"./2015/SpeciesConstructor":1597942294721,"./2015/SymbolDescriptiveString":1597942294722,"./2015/TestIntegrityLevel":1597942294723,"./2015/thisBooleanValue":1597942294724,"./2015/thisNumberValue":1597942294725,"./2015/thisStringValue":1597942294726,"./2015/thisTimeValue":1597942294727,"./2015/TimeClip":1597942294728,"./2015/TimeFromYear":1597942294729,"./2015/TimeWithinDay":1597942294730,"./2015/ToBoolean":1597942294643,"./2015/ToDateString":1597942294731,"./2015/ToInt16":1597942294732,"./2015/ToInt32":1597942294734,"./2015/ToInt8":1597942294735,"./2015/ToInteger":1597942294670,"./2015/ToLength":1597942294669,"./2015/ToNumber":1597942294623,"./2015/ToObject":1597942294686,"./2015/ToPrimitive":1597942294626,"./2015/ToPropertyDescriptor":1597942294642,"./2015/ToPropertyKey":1597942294737,"./2015/ToString":1597942294654,"./2015/ToUint16":1597942294733,"./2015/ToUint32":1597942294655,"./2015/ToUint8":1597942294736,"./2015/ToUint8Clamp":1597942294738,"./2015/Type":1597942294627,"./2015/ValidateAndApplyPropertyDescriptor":1597942294646,"./2015/WeekDay":1597942294739,"./2015/YearFromTime":1597942294676}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294622, function(require, module, exports) {


var ToNumber = require('./ToNumber');
var ToPrimitive = require('./ToPrimitive');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-abstract-equality-comparison

module.exports = function AbstractEqualityComparison(x, y) {
	var xType = Type(x);
	var yType = Type(y);
	if (xType === yType) {
		return x === y; // ES6+ specified this shortcut anyways.
	}
	if (x == null && y == null) {
		return true;
	}
	if (xType === 'Number' && yType === 'String') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if (xType === 'String' && yType === 'Number') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (xType === 'Boolean') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (yType === 'Boolean') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if ((xType === 'String' || xType === 'Number' || xType === 'Symbol') && yType === 'Object') {
		return AbstractEqualityComparison(x, ToPrimitive(y));
	}
	if (xType === 'Object' && (yType === 'String' || yType === 'Number' || yType === 'Symbol')) {
		return AbstractEqualityComparison(ToPrimitive(x), y);
	}
	return false;
};

}, function(modId) { var map = {"./ToNumber":1597942294623,"./ToPrimitive":1597942294626,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294623, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $Number = GetIntrinsic('%Number%');
var $RegExp = GetIntrinsic('%RegExp%');
var $parseInteger = GetIntrinsic('%parseInt%');

var callBound = require('../helpers/callBound');
var regexTester = require('../helpers/regexTester');
var isPrimitive = require('../helpers/isPrimitive');

var $strSlice = callBound('String.prototype.slice');
var isBinary = regexTester(/^0b[01]+$/i);
var isOctal = regexTester(/^0o[0-7]+$/i);
var isInvalidHexLiteral = regexTester(/^[-+]0x[0-9a-f]+$/i);
var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
var nonWSregex = new $RegExp('[' + nonWS + ']', 'g');
var hasNonWS = regexTester(nonWSregex);

// whitespace from: https://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = [
	'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
	'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
	'\u2029\uFEFF'
].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var $replace = callBound('String.prototype.replace');
var $trim = function (value) {
	return $replace(value, trimRegex, '');
};

var ToPrimitive = require('./ToPrimitive');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tonumber

module.exports = function ToNumber(argument) {
	var value = isPrimitive(argument) ? argument : ToPrimitive(argument, $Number);
	if (typeof value === 'symbol') {
		throw new $TypeError('Cannot convert a Symbol value to a number');
	}
	if (typeof value === 'string') {
		if (isBinary(value)) {
			return ToNumber($parseInteger($strSlice(value, 2), 2));
		} else if (isOctal(value)) {
			return ToNumber($parseInteger($strSlice(value, 2), 8));
		} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
			return NaN;
		} else {
			var trimmed = $trim(value);
			if (trimmed !== value) {
				return ToNumber(trimmed);
			}
		}
	}
	return $Number(value);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"../helpers/regexTester":1597942294624,"../helpers/isPrimitive":1597942294625,"./ToPrimitive":1597942294626}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294624, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $test = GetIntrinsic('RegExp.prototype.test');

var callBind = require('./callBind');

module.exports = function regexTester(regex) {
	return callBind($test, regex);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./callBind":1597942294578}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294625, function(require, module, exports) {


module.exports = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294626, function(require, module, exports) {


var toPrimitive = require('es-to-primitive/es2015');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive

module.exports = function ToPrimitive(input) {
	if (arguments.length > 1) {
		return toPrimitive(input, arguments[1]);
	}
	return toPrimitive(input);
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294627, function(require, module, exports) {


var ES5Type = require('../5/Type');

// https://ecma-international.org/ecma-262/6.0/#sec-ecmascript-data-types-and-values

module.exports = function Type(x) {
	if (typeof x === 'symbol') {
		return 'Symbol';
	}
	return ES5Type(x);
};

}, function(modId) { var map = {"../5/Type":1597942294572}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294628, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Number = GetIntrinsic('%Number%');
var $TypeError = GetIntrinsic('%TypeError%');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var isPrefixOf = require('../helpers/isPrefixOf');

var ToNumber = require('./ToNumber');
var ToPrimitive = require('./ToPrimitive');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/5.1/#sec-11.8.5

// eslint-disable-next-line max-statements
module.exports = function AbstractRelationalComparison(x, y, LeftFirst) {
	if (Type(LeftFirst) !== 'Boolean') {
		throw new $TypeError('Assertion failed: LeftFirst argument must be a Boolean');
	}
	var px;
	var py;
	if (LeftFirst) {
		px = ToPrimitive(x, $Number);
		py = ToPrimitive(y, $Number);
	} else {
		py = ToPrimitive(y, $Number);
		px = ToPrimitive(x, $Number);
	}
	var bothStrings = Type(px) === 'String' && Type(py) === 'String';
	if (!bothStrings) {
		var nx = ToNumber(px);
		var ny = ToNumber(py);
		if ($isNaN(nx) || $isNaN(ny)) {
			return undefined;
		}
		if ($isFinite(nx) && $isFinite(ny) && nx === ny) {
			return false;
		}
		if (nx === 0 && ny === 0) {
			return false;
		}
		if (nx === Infinity) {
			return false;
		}
		if (ny === Infinity) {
			return true;
		}
		if (ny === -Infinity) {
			return false;
		}
		if (nx === -Infinity) {
			return true;
		}
		return nx < ny; // by now, these are both nonzero, finite, and not equal
	}
	if (isPrefixOf(py, px)) {
		return false;
	}
	if (isPrefixOf(px, py)) {
		return true;
	}
	return px < py; // both strings, neither a prefix of the other. shortcut for steps c-f
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/isPrefixOf":1597942294576,"./ToNumber":1597942294623,"./ToPrimitive":1597942294626,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294629, function(require, module, exports) {


var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/5.1/#sec-11.9.6

module.exports = function StrictEqualityComparison(x, y) {
	var xType = Type(x);
	var yType = Type(y);
	if (xType !== yType) {
		return false;
	}
	if (xType === 'Undefined' || xType === 'Null') {
		return true;
	}
	return x === y; // shortcut for steps 4-7
};

}, function(modId) { var map = {"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294630, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var IsInteger = require('./IsInteger');
var Type = require('./Type');

var MAX_SAFE_INTEGER = require('../helpers/maxSafeInteger');

var $TypeError = GetIntrinsic('%TypeError%');

var $charCodeAt = require('../helpers/callBound')('String.prototype.charCodeAt');

// https://ecma-international.org/ecma-262/6.0/#sec-advancestringindex

module.exports = function AdvanceStringIndex(S, index, unicode) {
	if (Type(S) !== 'String') {
		throw new $TypeError('Assertion failed: `S` must be a String');
	}
	if (!IsInteger(index) || index < 0 || index > MAX_SAFE_INTEGER) {
		throw new $TypeError('Assertion failed: `length` must be an integer >= 0 and <= 2**53');
	}
	if (Type(unicode) !== 'Boolean') {
		throw new $TypeError('Assertion failed: `unicode` must be a Boolean');
	}
	if (!unicode) {
		return index + 1;
	}
	var length = S.length;
	if ((index + 1) >= length) {
		return index + 1;
	}

	var first = $charCodeAt(S, index);
	if (first < 0xD800 || first > 0xDBFF) {
		return index + 1;
	}

	var second = $charCodeAt(S, index + 1);
	if (second < 0xDC00 || second > 0xDFFF) {
		return index + 1;
	}

	return index + 2;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsInteger":1597942294631,"./Type":1597942294627,"../helpers/maxSafeInteger":1597942294632,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294631, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var $floor = $Math.floor;
var $abs = $Math.abs;

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isinteger

module.exports = function IsInteger(argument) {
	if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
		return false;
	}
	var abs = $abs(argument);
	return $floor(abs) === abs;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294632, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');
var $Number = GetIntrinsic('%Number%');

module.exports = $Number.MAX_SAFE_INTEGER || $Math.pow(2, 53) - 1;

}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294633, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $ArrayPrototype = GetIntrinsic('%Array.prototype%');
var $RangeError = GetIntrinsic('%RangeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');

var IsInteger = require('./IsInteger');

var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1;

var $setProto = GetIntrinsic('%Object.setPrototypeOf%', true) || (
	// eslint-disable-next-line no-proto, no-negated-condition
	[].__proto__ !== $ArrayPrototype
		? null
		: function (O, proto) {
			O.__proto__ = proto; // eslint-disable-line no-proto, no-param-reassign
			return O;
		}
);

// https://www.ecma-international.org/ecma-262/6.0/#sec-arraycreate

module.exports = function ArrayCreate(length) {
	if (!IsInteger(length) || length < 0) {
		throw new $TypeError('Assertion failed: `length` must be an integer Number >= 0');
	}
	if (length > MAX_ARRAY_LENGTH) {
		throw new $RangeError('length is greater than (2**32 - 1)');
	}
	var proto = arguments.length > 1 ? arguments[1] : $ArrayPrototype;
	var A = []; // steps 5 - 7, and 9
	if (proto !== $ArrayPrototype) { // step 8
		if (!$setProto) {
			throw new $SyntaxError('ArrayCreate: a `proto` argument that is not `Array.prototype` is not supported in an environment that does not support setting the [[Prototype]]');
		}
		$setProto(A, proto);
	}
	if (length !== 0) { // bypasses the need for step 2
		A.length = length;
	}
	/* step 10, the above as a shortcut for the below
    OrdinaryDefineOwnProperty(A, 'length', {
        '[[Configurable]]': false,
        '[[Enumerable]]': false,
        '[[Value]]': length,
        '[[Writable]]': true
    });
    */
	return A;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsInteger":1597942294631}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294634, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $RangeError = GetIntrinsic('%RangeError%');
var $TypeError = GetIntrinsic('%TypeError%');

var assign = require('object.assign');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');

var IsArray = require('./IsArray');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var OrdinaryDefineOwnProperty = require('./OrdinaryDefineOwnProperty');
var OrdinaryGetOwnProperty = require('./OrdinaryGetOwnProperty');
var ToNumber = require('./ToNumber');
var ToString = require('./ToString');
var ToUint32 = require('./ToUint32');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-arraysetlength

// eslint-disable-next-line max-statements, max-lines-per-function
module.exports = function ArraySetLength(A, Desc) {
	if (!IsArray(A)) {
		throw new $TypeError('Assertion failed: A must be an Array');
	}
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
	}
	if (!('[[Value]]' in Desc)) {
		return OrdinaryDefineOwnProperty(A, 'length', Desc);
	}
	var newLenDesc = assign({}, Desc);
	var newLen = ToUint32(Desc['[[Value]]']);
	var numberLen = ToNumber(Desc['[[Value]]']);
	if (newLen !== numberLen) {
		throw new $RangeError('Invalid array length');
	}
	newLenDesc['[[Value]]'] = newLen;
	var oldLenDesc = OrdinaryGetOwnProperty(A, 'length');
	if (!IsDataDescriptor(oldLenDesc)) {
		throw new $TypeError('Assertion failed: an array had a non-data descriptor on `length`');
	}
	var oldLen = oldLenDesc['[[Value]]'];
	if (newLen >= oldLen) {
		return OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
	}
	if (!oldLenDesc['[[Writable]]']) {
		return false;
	}
	var newWritable;
	if (!('[[Writable]]' in newLenDesc) || newLenDesc['[[Writable]]']) {
		newWritable = true;
	} else {
		newWritable = false;
		newLenDesc['[[Writable]]'] = true;
	}
	var succeeded = OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
	if (!succeeded) {
		return false;
	}
	while (newLen < oldLen) {
		oldLen -= 1;
		// eslint-disable-next-line no-param-reassign
		var deleteSucceeded = delete A[ToString(oldLen)];
		if (!deleteSucceeded) {
			newLenDesc['[[Value]]'] = oldLen + 1;
			if (!newWritable) {
				newLenDesc['[[Writable]]'] = false;
				OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
				return false;
			}
		}
	}
	if (!newWritable) {
		return OrdinaryDefineOwnProperty(A, 'length', { '[[Writable]]': false });
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPropertyDescriptor":1597942294599,"./IsArray":1597942294635,"./IsAccessorDescriptor":1597942294636,"./IsDataDescriptor":1597942294637,"./OrdinaryDefineOwnProperty":1597942294638,"./OrdinaryGetOwnProperty":1597942294652,"./ToNumber":1597942294623,"./ToString":1597942294654,"./ToUint32":1597942294655,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294635, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Array = GetIntrinsic('%Array%');

// eslint-disable-next-line global-require
var toStr = !$Array.isArray && require('../helpers/callBound')('Object.prototype.toString');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isarray

module.exports = $Array.isArray || function IsArray(argument) {
	return toStr(argument) === '[object Array]';
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294636, function(require, module, exports) {


var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isaccessordescriptor

module.exports = function IsAccessorDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!has(Desc, '[[Get]]') && !has(Desc, '[[Set]]')) {
		return false;
	}

	return true;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294637, function(require, module, exports) {


var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isdatadescriptor

module.exports = function IsDataDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!has(Desc, '[[Value]]') && !has(Desc, '[[Writable]]')) {
		return false;
	}

	return true;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294638, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');

var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsExtensible = require('./IsExtensible');
var IsPropertyKey = require('./IsPropertyKey');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var SameValue = require('./SameValue');
var Type = require('./Type');
var ValidateAndApplyPropertyDescriptor = require('./ValidateAndApplyPropertyDescriptor');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarydefineownproperty

module.exports = function OrdinaryDefineOwnProperty(O, P, Desc) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: O must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
	}
	if (!$gOPD) {
		// ES3/IE 8 fallback
		if (IsAccessorDescriptor(Desc)) {
			throw new $SyntaxError('This environment does not support accessor property descriptors.');
		}
		var creatingNormalDataProperty = !(P in O)
			&& Desc['[[Writable]]']
			&& Desc['[[Enumerable]]']
			&& Desc['[[Configurable]]']
			&& '[[Value]]' in Desc;
		var settingExistingDataProperty = (P in O)
			&& (!('[[Configurable]]' in Desc) || Desc['[[Configurable]]'])
			&& (!('[[Enumerable]]' in Desc) || Desc['[[Enumerable]]'])
			&& (!('[[Writable]]' in Desc) || Desc['[[Writable]]'])
			&& '[[Value]]' in Desc;
		if (creatingNormalDataProperty || settingExistingDataProperty) {
			O[P] = Desc['[[Value]]']; // eslint-disable-line no-param-reassign
			return SameValue(O[P], Desc['[[Value]]']);
		}
		throw new $SyntaxError('This environment does not support defining non-writable, non-enumerable, or non-configurable properties');
	}
	var desc = $gOPD(O, P);
	var current = desc && ToPropertyDescriptor(desc);
	var extensible = IsExtensible(O);
	return ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/isPropertyDescriptor":1597942294599,"./IsAccessorDescriptor":1597942294636,"./IsDataDescriptor":1597942294637,"./IsExtensible":1597942294640,"./IsPropertyKey":1597942294641,"./ToPropertyDescriptor":1597942294642,"./SameValue":1597942294645,"./Type":1597942294627,"./ValidateAndApplyPropertyDescriptor":1597942294646}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294639, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%');
if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;

}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294640, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Object = GetIntrinsic('%Object%');

var isPrimitive = require('../helpers/isPrimitive');

var $preventExtensions = $Object.preventExtensions;
var $isExtensible = $Object.isExtensible;

// https://www.ecma-international.org/ecma-262/6.0/#sec-isextensible-o

module.exports = $preventExtensions
	? function IsExtensible(obj) {
		return !isPrimitive(obj) && $isExtensible(obj);
	}
	: function IsExtensible(obj) {
		return !isPrimitive(obj);
	};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPrimitive":1597942294625}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294641, function(require, module, exports) {


// https://www.ecma-international.org/ecma-262/6.0/#sec-ispropertykey

module.exports = function IsPropertyKey(argument) {
	return typeof argument === 'string' || typeof argument === 'symbol';
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294642, function(require, module, exports) {


var has = require('has');

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Type = require('./Type');
var ToBoolean = require('./ToBoolean');
var IsCallable = require('./IsCallable');

// https://ecma-international.org/ecma-262/5.1/#sec-8.10.5

module.exports = function ToPropertyDescriptor(Obj) {
	if (Type(Obj) !== 'Object') {
		throw new $TypeError('ToPropertyDescriptor requires an object');
	}

	var desc = {};
	if (has(Obj, 'enumerable')) {
		desc['[[Enumerable]]'] = ToBoolean(Obj.enumerable);
	}
	if (has(Obj, 'configurable')) {
		desc['[[Configurable]]'] = ToBoolean(Obj.configurable);
	}
	if (has(Obj, 'value')) {
		desc['[[Value]]'] = Obj.value;
	}
	if (has(Obj, 'writable')) {
		desc['[[Writable]]'] = ToBoolean(Obj.writable);
	}
	if (has(Obj, 'get')) {
		var getter = Obj.get;
		if (typeof getter !== 'undefined' && !IsCallable(getter)) {
			throw new TypeError('getter must be a function');
		}
		desc['[[Get]]'] = getter;
	}
	if (has(Obj, 'set')) {
		var setter = Obj.set;
		if (typeof setter !== 'undefined' && !IsCallable(setter)) {
			throw new $TypeError('setter must be a function');
		}
		desc['[[Set]]'] = setter;
	}

	if ((has(desc, '[[Get]]') || has(desc, '[[Set]]')) && (has(desc, '[[Value]]') || has(desc, '[[Writable]]'))) {
		throw new $TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
	}
	return desc;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294627,"./ToBoolean":1597942294643,"./IsCallable":1597942294644}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294643, function(require, module, exports) {


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.2

module.exports = function ToBoolean(value) { return !!value; };

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294644, function(require, module, exports) {


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.11

module.exports = require('is-callable');

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294645, function(require, module, exports) {


var $isNaN = require('../helpers/isNaN');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.12

module.exports = function SameValue(x, y) {
	if (x === y) { // 0 === -0, but they are not identical.
		if (x === 0) { return 1 / x === 1 / y; }
		return true;
	}
	return $isNaN(x) && $isNaN(y);
};

}, function(modId) { var map = {"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294646, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');
var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');
var isSamePropertyDescriptor = require('../helpers/isSamePropertyDescriptor');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsGenericDescriptor = require('./IsGenericDescriptor');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-validateandapplypropertydescriptor
// https://www.ecma-international.org/ecma-262/8.0/#sec-validateandapplypropertydescriptor

// eslint-disable-next-line max-lines-per-function, max-statements, max-params
module.exports = function ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current) {
	// this uses the ES2017+ logic, since it fixes a number of bugs in the ES2015 logic.
	var oType = Type(O);
	if (oType !== 'Undefined' && oType !== 'Object') {
		throw new $TypeError('Assertion failed: O must be undefined or an Object');
	}
	if (Type(extensible) !== 'Boolean') {
		throw new $TypeError('Assertion failed: extensible must be a Boolean');
	}
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
	}
	if (Type(current) !== 'Undefined' && !isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, current)) {
		throw new $TypeError('Assertion failed: current must be a Property Descriptor, or undefined');
	}
	if (oType !== 'Undefined' && !IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: if O is not undefined, P must be a Property Key');
	}
	if (Type(current) === 'Undefined') {
		if (!extensible) {
			return false;
		}
		if (IsGenericDescriptor(Desc) || IsDataDescriptor(Desc)) {
			if (oType !== 'Undefined') {
				DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					{
						'[[Configurable]]': Desc['[[Configurable]]'],
						'[[Enumerable]]': Desc['[[Enumerable]]'],
						'[[Value]]': Desc['[[Value]]'],
						'[[Writable]]': Desc['[[Writable]]']
					}
				);
			}
		} else {
			if (!IsAccessorDescriptor(Desc)) {
				throw new $TypeError('Assertion failed: Desc is not an accessor descriptor');
			}
			if (oType !== 'Undefined') {
				return DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					Desc
				);
			}
		}
		return true;
	}
	if (IsGenericDescriptor(Desc) && !('[[Configurable]]' in Desc) && !('[[Enumerable]]' in Desc)) {
		return true;
	}
	if (isSamePropertyDescriptor({ SameValue: SameValue }, Desc, current)) {
		return true; // removed by ES2017, but should still be correct
	}
	// "if every field in Desc is absent, return true" can't really match the assertion that it's a Property Descriptor
	if (!current['[[Configurable]]']) {
		if (Desc['[[Configurable]]']) {
			return false;
		}
		if ('[[Enumerable]]' in Desc && !Desc['[[Enumerable]]'] === !!current['[[Enumerable]]']) {
			return false;
		}
	}
	if (IsGenericDescriptor(Desc)) {
		// no further validation is required.
	} else if (IsDataDescriptor(current) !== IsDataDescriptor(Desc)) {
		if (!current['[[Configurable]]']) {
			return false;
		}
		if (IsDataDescriptor(current)) {
			if (oType !== 'Undefined') {
				DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					{
						'[[Configurable]]': current['[[Configurable]]'],
						'[[Enumerable]]': current['[[Enumerable]]'],
						'[[Get]]': undefined
					}
				);
			}
		} else if (oType !== 'Undefined') {
			DefineOwnProperty(
				IsDataDescriptor,
				SameValue,
				FromPropertyDescriptor,
				O,
				P,
				{
					'[[Configurable]]': current['[[Configurable]]'],
					'[[Enumerable]]': current['[[Enumerable]]'],
					'[[Value]]': undefined
				}
			);
		}
	} else if (IsDataDescriptor(current) && IsDataDescriptor(Desc)) {
		if (!current['[[Configurable]]'] && !current['[[Writable]]']) {
			if ('[[Writable]]' in Desc && Desc['[[Writable]]']) {
				return false;
			}
			if ('[[Value]]' in Desc && !SameValue(Desc['[[Value]]'], current['[[Value]]'])) {
				return false;
			}
			return true;
		}
	} else if (IsAccessorDescriptor(current) && IsAccessorDescriptor(Desc)) {
		if (!current['[[Configurable]]']) {
			if ('[[Set]]' in Desc && !SameValue(Desc['[[Set]]'], current['[[Set]]'])) {
				return false;
			}
			if ('[[Get]]' in Desc && !SameValue(Desc['[[Get]]'], current['[[Get]]'])) {
				return false;
			}
			return true;
		}
	} else {
		throw new $TypeError('Assertion failed: current and Desc are not both data, both accessors, or one accessor and one data.');
	}
	if (oType !== 'Undefined') {
		return DefineOwnProperty(
			IsDataDescriptor,
			SameValue,
			FromPropertyDescriptor,
			O,
			P,
			Desc
		);
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/DefineOwnProperty":1597942294647,"../helpers/isPropertyDescriptor":1597942294599,"../helpers/isSamePropertyDescriptor":1597942294648,"./FromPropertyDescriptor":1597942294650,"./IsAccessorDescriptor":1597942294636,"./IsDataDescriptor":1597942294637,"./IsGenericDescriptor":1597942294651,"./IsPropertyKey":1597942294641,"./SameValue":1597942294645,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294647, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

var callBound = require('../helpers/callBound');

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

// eslint-disable-next-line max-params
module.exports = function DefineOwnProperty(IsDataDescriptor, SameValue, FromPropertyDescriptor, O, P, desc) {
	if (!$defineProperty) {
		if (!IsDataDescriptor(desc)) {
			// ES3 does not support getters/setters
			return false;
		}
		if (!desc['[[Configurable]]'] || !desc['[[Writable]]']) {
			return false;
		}

		// fallback for ES3
		if (P in O && $isEnumerable(O, P) !== !!desc['[[Enumerable]]']) {
			// a non-enumerable existing property
			return false;
		}

		// property does not exist at all, or exists but is enumerable
		var V = desc['[[Value]]'];
		// eslint-disable-next-line no-param-reassign
		O[P] = V; // will use [[Define]]
		return SameValue(O[P], V);
	}
	$defineProperty(O, P, FromPropertyDescriptor(desc));
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294648, function(require, module, exports) {


var every = require('./every');

module.exports = function isSamePropertyDescriptor(ES, D1, D2) {
	var fields = [
		'[[Configurable]]',
		'[[Enumerable]]',
		'[[Get]]',
		'[[Set]]',
		'[[Value]]',
		'[[Writable]]'
	];
	return every(fields, function (field) {
		if ((field in D1) !== (field in D2)) {
			return false;
		}
		return ES.SameValue(D1[field], D2[field]);
	});
};

}, function(modId) { var map = {"./every":1597942294649}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294649, function(require, module, exports) {


module.exports = function every(array, predicate) {
	for (var i = 0; i < array.length; i += 1) {
		if (!predicate(array[i], i, array)) {
			return false;
		}
	}
	return true;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294650, function(require, module, exports) {


var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-frompropertydescriptor

module.exports = function FromPropertyDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return Desc;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	var obj = {};
	if ('[[Value]]' in Desc) {
		obj.value = Desc['[[Value]]'];
	}
	if ('[[Writable]]' in Desc) {
		obj.writable = Desc['[[Writable]]'];
	}
	if ('[[Get]]' in Desc) {
		obj.get = Desc['[[Get]]'];
	}
	if ('[[Set]]' in Desc) {
		obj.set = Desc['[[Set]]'];
	}
	if ('[[Enumerable]]' in Desc) {
		obj.enumerable = Desc['[[Enumerable]]'];
	}
	if ('[[Configurable]]' in Desc) {
		obj.configurable = Desc['[[Configurable]]'];
	}
	return obj;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294651, function(require, module, exports) {


var assertRecord = require('../helpers/assertRecord');

var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isgenericdescriptor

module.exports = function IsGenericDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!IsAccessorDescriptor(Desc) && !IsDataDescriptor(Desc)) {
		return true;
	}

	return false;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./IsAccessorDescriptor":1597942294636,"./IsDataDescriptor":1597942294637,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294652, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

var has = require('has');

var IsArray = require('./IsArray');
var IsPropertyKey = require('./IsPropertyKey');
var IsRegExp = require('./IsRegExp');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarygetownproperty

module.exports = function OrdinaryGetOwnProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: O must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	if (!has(O, P)) {
		return void 0;
	}
	if (!$gOPD) {
		// ES3 / IE 8 fallback
		var arrayLength = IsArray(O) && P === 'length';
		var regexLastIndex = IsRegExp(O) && P === 'lastIndex';
		return {
			'[[Configurable]]': !(arrayLength || regexLastIndex),
			'[[Enumerable]]': $isEnumerable(O, P),
			'[[Value]]': O[P],
			'[[Writable]]': true
		};
	}
	return ToPropertyDescriptor($gOPD(O, P));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/callBound":1597942294577,"./IsArray":1597942294635,"./IsPropertyKey":1597942294641,"./IsRegExp":1597942294653,"./ToPropertyDescriptor":1597942294642,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294653, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $match = GetIntrinsic('%Symbol.match%', true);

var hasRegExpMatcher = require('is-regex');

var ToBoolean = require('./ToBoolean');

// https://ecma-international.org/ecma-262/6.0/#sec-isregexp

module.exports = function IsRegExp(argument) {
	if (!argument || typeof argument !== 'object') {
		return false;
	}
	if ($match) {
		var isRegExp = argument[$match];
		if (typeof isRegExp !== 'undefined') {
			return ToBoolean(isRegExp);
		}
	}
	return hasRegExpMatcher(argument);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToBoolean":1597942294643}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294654, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $String = GetIntrinsic('%String%');
var $TypeError = GetIntrinsic('%TypeError%');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tostring

module.exports = function ToString(argument) {
	if (typeof argument === 'symbol') {
		throw new $TypeError('Cannot convert a Symbol value to a string');
	}
	return $String(argument);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294655, function(require, module, exports) {


var ToNumber = require('./ToNumber');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.6

module.exports = function ToUint32(x) {
	return ToNumber(x) >>> 0;
};

}, function(modId) { var map = {"./ToNumber":1597942294623}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294656, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Array = GetIntrinsic('%Array%');
var $species = GetIntrinsic('%Symbol.species%', true);
var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var IsArray = require('./IsArray');
var IsConstructor = require('./IsConstructor');
var IsInteger = require('./IsInteger');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-arrayspeciescreate

module.exports = function ArraySpeciesCreate(originalArray, length) {
	if (!IsInteger(length) || length < 0) {
		throw new $TypeError('Assertion failed: length must be an integer >= 0');
	}
	var len = length === 0 ? 0 : length;
	var C;
	var isArray = IsArray(originalArray);
	if (isArray) {
		C = Get(originalArray, 'constructor');
		// TODO: figure out how to make a cross-realm normal Array, a same-realm Array
		// if (IsConstructor(C)) {
		// 	if C is another realm's Array, C = undefined
		// 	Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(Array))) === null ?
		// }
		if ($species && Type(C) === 'Object') {
			C = Get(C, $species);
			if (C === null) {
				C = void 0;
			}
		}
	}
	if (typeof C === 'undefined') {
		return $Array(len);
	}
	if (!IsConstructor(C)) {
		throw new $TypeError('C must be a constructor');
	}
	return new C(len); // Construct(C, len);
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294657,"./IsArray":1597942294635,"./IsConstructor":1597942294658,"./IsInteger":1597942294631,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294657, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var inspect = require('object-inspect');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

/**
 * 7.3.1 Get (O, P) - https://ecma-international.org/ecma-262/6.0/#sec-get-o-p
 * 1. Assert: Type(O) is Object.
 * 2. Assert: IsPropertyKey(P) is true.
 * 3. Return O.[[Get]](P, O).
 */

module.exports = function Get(O, P) {
	// 7.3.1.1
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	// 7.3.1.2
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true, got ' + inspect(P));
	}
	// 7.3.1.3
	return O[P];
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294641,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294658, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic.js');

var $construct = GetIntrinsic('%Reflect.construct%', true);

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');
try {
	DefinePropertyOrThrow({}, '', { '[[Get]]': function () {} });
} catch (e) {
	// Accessor properties aren't supported
	DefinePropertyOrThrow = null;
}

// https://www.ecma-international.org/ecma-262/6.0/#sec-isconstructor

if (DefinePropertyOrThrow && $construct) {
	var isConstructorMarker = {};
	var badArrayLike = {};
	DefinePropertyOrThrow(badArrayLike, 'length', {
		'[[Get]]': function () {
			throw isConstructorMarker;
		},
		'[[Enumerable]]': true
	});

	module.exports = function IsConstructor(argument) {
		try {
			// `Reflect.construct` invokes `IsConstructor(target)` before `Get(args, 'length')`:
			$construct(argument, badArrayLike);
		} catch (err) {
			return err === isConstructorMarker;
		}
	};
} else {
	module.exports = function IsConstructor(argument) {
		// unfortunately there's no way to truly check this without try/catch `new argument` in old environments
		return typeof argument === 'function' && !!argument.prototype;
	};
}

}, function(modId) { var map = {"../GetIntrinsic.js":1597942294567,"./DefinePropertyOrThrow":1597942294659}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294659, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');
var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-definepropertyorthrow

module.exports = function DefinePropertyOrThrow(O, P, desc) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	var Desc = isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, desc) ? desc : ToPropertyDescriptor(desc);
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc is not a valid Property Descriptor');
	}

	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		Desc
	);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPropertyDescriptor":1597942294599,"../helpers/DefineOwnProperty":1597942294647,"./FromPropertyDescriptor":1597942294650,"./IsAccessorDescriptor":1597942294636,"./IsDataDescriptor":1597942294637,"./IsPropertyKey":1597942294641,"./SameValue":1597942294645,"./ToPropertyDescriptor":1597942294642,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294660, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');
var callBound = require('../helpers/callBound');

var $apply = GetIntrinsic('%Reflect.apply%', true) || callBound('%Function.prototype.apply%');

// https://www.ecma-international.org/ecma-262/6.0/#sec-call

module.exports = function Call(F, V) {
	var args = arguments.length > 2 ? arguments[2] : [];
	return $apply(F, V, args);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294661, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var SameValue = require('./SameValue');
var ToNumber = require('./ToNumber');
var ToString = require('./ToString');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring

module.exports = function CanonicalNumericIndexString(argument) {
	if (Type(argument) !== 'String') {
		throw new $TypeError('Assertion failed: `argument` must be a String');
	}
	if (argument === '-0') { return -0; }
	var n = ToNumber(argument);
	if (SameValue(ToString(n), argument)) { return n; }
	return void 0;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./SameValue":1597942294645,"./ToNumber":1597942294623,"./ToString":1597942294654,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294662, function(require, module, exports) {


var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var IsDataDescriptor = require('./IsDataDescriptor');
var IsGenericDescriptor = require('./IsGenericDescriptor');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-completepropertydescriptor

module.exports = function CompletePropertyDescriptor(Desc) {
	/* eslint no-param-reassign: 0 */
	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (IsGenericDescriptor(Desc) || IsDataDescriptor(Desc)) {
		if (!has(Desc, '[[Value]]')) {
			Desc['[[Value]]'] = void 0;
		}
		if (!has(Desc, '[[Writable]]')) {
			Desc['[[Writable]]'] = false;
		}
	} else {
		if (!has(Desc, '[[Get]]')) {
			Desc['[[Get]]'] = void 0;
		}
		if (!has(Desc, '[[Set]]')) {
			Desc['[[Set]]'] = void 0;
		}
	}
	if (!has(Desc, '[[Enumerable]]')) {
		Desc['[[Enumerable]]'] = false;
	}
	if (!has(Desc, '[[Configurable]]')) {
		Desc['[[Configurable]]'] = false;
	}
	return Desc;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./IsDataDescriptor":1597942294637,"./IsGenericDescriptor":1597942294651,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294663, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var OrdinaryGetOwnProperty = require('./OrdinaryGetOwnProperty');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsExtensible = require('./IsExtensible');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-createdataproperty

module.exports = function CreateDataProperty(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}
	var oldDesc = OrdinaryGetOwnProperty(O, P);
	var extensible = !oldDesc || IsExtensible(O);
	var immutable = oldDesc && (!oldDesc['[[Writable]]'] || !oldDesc['[[Configurable]]']);
	if (immutable || !extensible) {
		return false;
	}
	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		{
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Value]]': V,
			'[[Writable]]': true
		}
	);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/DefineOwnProperty":1597942294647,"./FromPropertyDescriptor":1597942294650,"./OrdinaryGetOwnProperty":1597942294652,"./IsDataDescriptor":1597942294637,"./IsExtensible":1597942294640,"./IsPropertyKey":1597942294641,"./SameValue":1597942294645,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294664, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var CreateDataProperty = require('./CreateDataProperty');
var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// // https://ecma-international.org/ecma-262/6.0/#sec-createdatapropertyorthrow

module.exports = function CreateDataPropertyOrThrow(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}
	var success = CreateDataProperty(O, P, V);
	if (!success) {
		throw new $TypeError('unable to create data property');
	}
	return success;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./CreateDataProperty":1597942294663,"./IsPropertyKey":1597942294641,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294665, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $replace = callBound('String.prototype.replace');

var RequireObjectCoercible = require('./RequireObjectCoercible');
var ToString = require('./ToString');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-createhtml

module.exports = function CreateHTML(string, tag, attribute, value) {
	if (Type(tag) !== 'String' || Type(attribute) !== 'String') {
		throw new $TypeError('Assertion failed: `tag` and `attribute` must be strings');
	}
	var str = RequireObjectCoercible(string);
	var S = ToString(str);
	var p1 = '<' + tag;
	if (attribute !== '') {
		var V = ToString(value);
		var escapedV = $replace(V, /\x22/g, '&quot;');
		p1 += '\x20' + attribute + '\x3D\x22' + escapedV + '\x22';
	}
	return p1 + '>' + S + '</' + tag + '>';
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./RequireObjectCoercible":1597942294666,"./ToString":1597942294654,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294666, function(require, module, exports) {


module.exports = require('../5/CheckObjectCoercible');

}, function(modId) { var map = {"../5/CheckObjectCoercible":1597942294580}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294667, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-createiterresultobject

module.exports = function CreateIterResultObject(value, done) {
	if (Type(done) !== 'Boolean') {
		throw new $TypeError('Assertion failed: Type(done) is not Boolean');
	}
	return {
		value: value,
		done: done
	};
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294668, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var callBound = require('../helpers/callBound');

var $TypeError = GetIntrinsic('%TypeError%');
var $indexOf = callBound('Array.prototype.indexOf', true) || callBound('String.prototype.indexOf');
var $push = callBound('Array.prototype.push');

var Get = require('./Get');
var IsArray = require('./IsArray');
var ToLength = require('./ToLength');
var ToString = require('./ToString');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-createlistfromarraylike
module.exports = function CreateListFromArrayLike(obj) {
	var elementTypes = arguments.length > 1
		? arguments[1]
		: ['Undefined', 'Null', 'Boolean', 'String', 'Symbol', 'Number', 'Object'];

	if (Type(obj) !== 'Object') {
		throw new $TypeError('Assertion failed: `obj` must be an Object');
	}
	if (!IsArray(elementTypes)) {
		throw new $TypeError('Assertion failed: `elementTypes`, if provided, must be an array');
	}
	var len = ToLength(Get(obj, 'length'));
	var list = [];
	var index = 0;
	while (index < len) {
		var indexName = ToString(index);
		var next = Get(obj, indexName);
		var nextType = Type(next);
		if ($indexOf(elementTypes, nextType) < 0) {
			throw new $TypeError('item type ' + nextType + ' is not a valid elementType');
		}
		$push(list, next);
		index += 1;
	}
	return list;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Get":1597942294657,"./IsArray":1597942294635,"./ToLength":1597942294669,"./ToString":1597942294654,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294669, function(require, module, exports) {


var MAX_SAFE_INTEGER = require('../helpers/maxSafeInteger');

var ToInteger = require('./ToInteger');

module.exports = function ToLength(argument) {
	var len = ToInteger(argument);
	if (len <= 0) { return 0; } // includes converting -0 to +0
	if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
	return len;
};

}, function(modId) { var map = {"../helpers/maxSafeInteger":1597942294632,"./ToInteger":1597942294670}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294670, function(require, module, exports) {


var ES5ToInteger = require('../5/ToInteger');

var ToNumber = require('./ToNumber');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tointeger

module.exports = function ToInteger(value) {
	var number = ToNumber(value);
	return ES5ToInteger(number);
};

}, function(modId) { var map = {"../5/ToInteger":1597942294602,"./ToNumber":1597942294623}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294671, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-createmethodproperty

module.exports = function CreateMethodProperty(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	var newDesc = {
		'[[Configurable]]': true,
		'[[Enumerable]]': false,
		'[[Value]]': V,
		'[[Writable]]': true
	};
	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		newDesc
	);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/DefineOwnProperty":1597942294647,"./FromPropertyDescriptor":1597942294650,"./IsDataDescriptor":1597942294637,"./IsPropertyKey":1597942294641,"./SameValue":1597942294645,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294672, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $EvalError = GetIntrinsic('%EvalError%');

var DayWithinYear = require('./DayWithinYear');
var InLeapYear = require('./InLeapYear');
var MonthFromTime = require('./MonthFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.5

module.exports = function DateFromTime(t) {
	var m = MonthFromTime(t);
	var d = DayWithinYear(t);
	if (m === 0) {
		return d + 1;
	}
	if (m === 1) {
		return d - 30;
	}
	var leap = InLeapYear(t);
	if (m === 2) {
		return d - 58 - leap;
	}
	if (m === 3) {
		return d - 89 - leap;
	}
	if (m === 4) {
		return d - 119 - leap;
	}
	if (m === 5) {
		return d - 150 - leap;
	}
	if (m === 6) {
		return d - 180 - leap;
	}
	if (m === 7) {
		return d - 211 - leap;
	}
	if (m === 8) {
		return d - 242 - leap;
	}
	if (m === 9) {
		return d - 272 - leap;
	}
	if (m === 10) {
		return d - 303 - leap;
	}
	if (m === 11) {
		return d - 333 - leap;
	}
	throw new $EvalError('Assertion failed: MonthFromTime returned an impossible value: ' + m);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./DayWithinYear":1597942294673,"./InLeapYear":1597942294677,"./MonthFromTime":1597942294679}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294673, function(require, module, exports) {


var Day = require('./Day');
var DayFromYear = require('./DayFromYear');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.4

module.exports = function DayWithinYear(t) {
	return Day(t) - DayFromYear(YearFromTime(t));
};

}, function(modId) { var map = {"./Day":1597942294674,"./DayFromYear":1597942294675,"./YearFromTime":1597942294676}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294674, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.2

module.exports = function Day(t) {
	return $floor(t / msPerDay);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294675, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function DayFromYear(y) {
	return (365 * (y - 1970)) + $floor((y - 1969) / 4) - $floor((y - 1901) / 100) + $floor((y - 1601) / 400);
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294676, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Date = GetIntrinsic('%Date%');

var callBound = require('../helpers/callBound');

var $getUTCFullYear = callBound('Date.prototype.getUTCFullYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function YearFromTime(t) {
	// largest y such that this.TimeFromYear(y) <= t
	return $getUTCFullYear(new $Date(t));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294677, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $EvalError = GetIntrinsic('%EvalError%');

var DaysInYear = require('./DaysInYear');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function InLeapYear(t) {
	var days = DaysInYear(YearFromTime(t));
	if (days === 365) {
		return 0;
	}
	if (days === 366) {
		return 1;
	}
	throw new $EvalError('Assertion failed: there are not 365 or 366 days in a year, got: ' + days);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./DaysInYear":1597942294678,"./YearFromTime":1597942294676}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294678, function(require, module, exports) {


var mod = require('../helpers/mod');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function DaysInYear(y) {
	if (mod(y, 4) !== 0) {
		return 365;
	}
	if (mod(y, 100) !== 0) {
		return 366;
	}
	if (mod(y, 400) !== 0) {
		return 365;
	}
	return 366;
};

}, function(modId) { var map = {"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294679, function(require, module, exports) {


var DayWithinYear = require('./DayWithinYear');
var InLeapYear = require('./InLeapYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.4

module.exports = function MonthFromTime(t) {
	var day = DayWithinYear(t);
	if (0 <= day && day < 31) {
		return 0;
	}
	var leap = InLeapYear(t);
	if (31 <= day && day < (59 + leap)) {
		return 1;
	}
	if ((59 + leap) <= day && day < (90 + leap)) {
		return 2;
	}
	if ((90 + leap) <= day && day < (120 + leap)) {
		return 3;
	}
	if ((120 + leap) <= day && day < (151 + leap)) {
		return 4;
	}
	if ((151 + leap) <= day && day < (181 + leap)) {
		return 5;
	}
	if ((181 + leap) <= day && day < (212 + leap)) {
		return 6;
	}
	if ((212 + leap) <= day && day < (243 + leap)) {
		return 7;
	}
	if ((243 + leap) <= day && day < (273 + leap)) {
		return 8;
	}
	if ((273 + leap) <= day && day < (304 + leap)) {
		return 9;
	}
	if ((304 + leap) <= day && day < (334 + leap)) {
		return 10;
	}
	if ((334 + leap) <= day && day < (365 + leap)) {
		return 11;
	}
};

}, function(modId) { var map = {"./DayWithinYear":1597942294673,"./InLeapYear":1597942294677}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294680, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-deletepropertyorthrow

module.exports = function DeletePropertyOrThrow(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	// eslint-disable-next-line no-param-reassign
	var success = delete O[P];
	if (!success) {
		throw new $TypeError('Attempt to delete property failed.');
	}
	return success;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294641,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294681, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var keys = require('object-keys');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-enumerableownnames

module.exports = function EnumerableOwnNames(O) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	return keys(O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294682, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var getIteratorMethod = require('../helpers/getIteratorMethod');
var AdvanceStringIndex = require('./AdvanceStringIndex');
var Call = require('./Call');
var GetMethod = require('./GetMethod');
var IsArray = require('./IsArray');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-getiterator

module.exports = function GetIterator(obj, method) {
	var actualMethod = method;
	if (arguments.length < 2) {
		actualMethod = getIteratorMethod(
			{
				AdvanceStringIndex: AdvanceStringIndex,
				GetMethod: GetMethod,
				IsArray: IsArray,
				Type: Type
			},
			obj
		);
	}
	var iterator = Call(actualMethod, obj);
	if (Type(iterator) !== 'Object') {
		throw new $TypeError('iterator must return an object');
	}

	return iterator;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getIteratorMethod":1597942294683,"./AdvanceStringIndex":1597942294630,"./Call":1597942294660,"./GetMethod":1597942294684,"./IsArray":1597942294635,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294683, function(require, module, exports) {


var hasSymbols = require('has-symbols')();
var GetIntrinsic = require('../GetIntrinsic');
var callBound = require('./callBound');

var $iterator = GetIntrinsic('%Symbol.iterator%', true);
var $stringSlice = callBound('String.prototype.slice');

module.exports = function getIteratorMethod(ES, iterable) {
	var usingIterator;
	if (hasSymbols) {
		usingIterator = ES.GetMethod(iterable, $iterator);
	} else if (ES.IsArray(iterable)) {
		usingIterator = function () {
			var i = -1;
			var arr = this; // eslint-disable-line no-invalid-this
			return {
				next: function () {
					i += 1;
					return {
						done: i >= arr.length,
						value: arr[i]
					};
				}
			};
		};
	} else if (ES.Type(iterable) === 'String') {
		usingIterator = function () {
			var i = 0;
			return {
				next: function () {
					var nextIndex = ES.AdvanceStringIndex(iterable, i, true);
					var value = $stringSlice(iterable, i, nextIndex);
					i = nextIndex;
					return {
						done: nextIndex > iterable.length,
						value: value
					};
				}
			};
		};
	}
	return usingIterator;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294684, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var GetV = require('./GetV');
var IsCallable = require('./IsCallable');
var IsPropertyKey = require('./IsPropertyKey');

/**
 * 7.3.9 - https://ecma-international.org/ecma-262/6.0/#sec-getmethod
 * 1. Assert: IsPropertyKey(P) is true.
 * 2. Let func be GetV(O, P).
 * 3. ReturnIfAbrupt(func).
 * 4. If func is either undefined or null, return undefined.
 * 5. If IsCallable(func) is false, throw a TypeError exception.
 * 6. Return func.
 */

module.exports = function GetMethod(O, P) {
	// 7.3.9.1
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	// 7.3.9.2
	var func = GetV(O, P);

	// 7.3.9.4
	if (func == null) {
		return void 0;
	}

	// 7.3.9.5
	if (!IsCallable(func)) {
		throw new $TypeError(P + 'is not a function');
	}

	// 7.3.9.6
	return func;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./GetV":1597942294685,"./IsCallable":1597942294644,"./IsPropertyKey":1597942294641}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294685, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var ToObject = require('./ToObject');

/**
 * 7.3.2 GetV (V, P)
 * 1. Assert: IsPropertyKey(P) is true.
 * 2. Let O be ToObject(V).
 * 3. ReturnIfAbrupt(O).
 * 4. Return O.[[Get]](P, V).
 */

module.exports = function GetV(V, P) {
	// 7.3.2.1
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	// 7.3.2.2-3
	var O = ToObject(V);

	// 7.3.2.4
	return O[P];
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294641,"./ToObject":1597942294686}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294686, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Object = GetIntrinsic('%Object%');

var RequireObjectCoercible = require('./RequireObjectCoercible');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toobject

module.exports = function ToObject(value) {
	RequireObjectCoercible(value);
	return $Object(value);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./RequireObjectCoercible":1597942294666}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294687, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var hasSymbols = require('has-symbols')();

var $TypeError = GetIntrinsic('%TypeError%');

var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%');
var $gOPS = hasSymbols && GetIntrinsic('%Object.getOwnPropertySymbols%');
var keys = require('object-keys');

var esType = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-getownpropertykeys

module.exports = function GetOwnPropertyKeys(O, Type) {
	if (esType(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (Type === 'Symbol') {
		return $gOPS ? $gOPS(O) : [];
	}
	if (Type === 'String') {
		if (!$gOPN) {
			return keys(O);
		}
		return $gOPN(O);
	}
	throw new $TypeError('Assertion failed: `Type` must be `"String"` or `"Symbol"`');
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294688, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Function = GetIntrinsic('%Function%');
var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var IsConstructor = require('./IsConstructor');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-getprototypefromconstructor

module.exports = function GetPrototypeFromConstructor(constructor, intrinsicDefaultProto) {
	var intrinsic = GetIntrinsic(intrinsicDefaultProto); // throws if not a valid intrinsic
	if (!IsConstructor(constructor)) {
		throw new $TypeError('Assertion failed: `constructor` must be a constructor');
	}
	var proto = Get(constructor, 'prototype');
	if (Type(proto) !== 'Object') {
		if (!(constructor instanceof $Function)) {
			// ignore other realms, for now
			throw new $TypeError('cross-realm constructors not currently supported');
		}
		proto = intrinsic;
	}
	return proto;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294657,"./IsConstructor":1597942294658,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294689, function(require, module, exports) {



var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $parseInt = GetIntrinsic('%parseInt%');

var inspect = require('object-inspect');

var regexTester = require('../helpers/regexTester');
var callBound = require('../helpers/callBound');
var every = require('../helpers/every');

var isDigit = regexTester(/^[0-9]$/);

var $charAt = callBound('String.prototype.charAt');
var $strSlice = callBound('String.prototype.slice');

var IsArray = require('./IsArray');
var IsInteger = require('./IsInteger');
var Type = require('./Type');

var canDistinguishSparseFromUndefined = 0 in [undefined]; // IE 6 - 8 have a bug where this returns false

var isStringOrHole = function (capture, index, arr) {
	return Type(capture) === 'String' || (canDistinguishSparseFromUndefined ? !(index in arr) : Type(capture) === 'Undefined');
};

// https://www.ecma-international.org/ecma-262/6.0/#sec-getsubstitution

// eslint-disable-next-line max-statements, max-params, max-lines-per-function
module.exports = function GetSubstitution(matched, str, position, captures, replacement) {
	if (Type(matched) !== 'String') {
		throw new $TypeError('Assertion failed: `matched` must be a String');
	}
	var matchLength = matched.length;

	if (Type(str) !== 'String') {
		throw new $TypeError('Assertion failed: `str` must be a String');
	}
	var stringLength = str.length;

	if (!IsInteger(position) || position < 0 || position > stringLength) {
		throw new $TypeError('Assertion failed: `position` must be a nonnegative integer, and less than or equal to the length of `string`, got ' + inspect(position));
	}

	if (!IsArray(captures) || !every(captures, isStringOrHole)) {
		throw new $TypeError('Assertion failed: `captures` must be a List of Strings, got ' + inspect(captures));
	}

	if (Type(replacement) !== 'String') {
		throw new $TypeError('Assertion failed: `replacement` must be a String');
	}

	var tailPos = position + matchLength;
	var m = captures.length;

	var result = '';
	for (var i = 0; i < replacement.length; i += 1) {
		// if this is a $, and it's not the end of the replacement
		var current = $charAt(replacement, i);
		var isLast = (i + 1) >= replacement.length;
		var nextIsLast = (i + 2) >= replacement.length;
		if (current === '$' && !isLast) {
			var next = $charAt(replacement, i + 1);
			if (next === '$') {
				result += '$';
				i += 1;
			} else if (next === '&') {
				result += matched;
				i += 1;
			} else if (next === '`') {
				result += position === 0 ? '' : $strSlice(str, 0, position - 1);
				i += 1;
			} else if (next === "'") {
				result += tailPos >= stringLength ? '' : $strSlice(str, tailPos);
				i += 1;
			} else {
				var nextNext = nextIsLast ? null : $charAt(replacement, i + 2);
				if (isDigit(next) && next !== '0' && (nextIsLast || !isDigit(nextNext))) {
					// $1 through $9, and not followed by a digit
					var n = $parseInt(next, 10);
					// if (n > m, impl-defined)
					result += (n <= m && Type(captures[n - 1]) === 'Undefined') ? '' : captures[n - 1];
					i += 1;
				} else if (isDigit(next) && (nextIsLast || isDigit(nextNext))) {
					// $00 through $99
					var nn = next + nextNext;
					var nnI = $parseInt(nn, 10) - 1;
					// if nn === '00' or nn > m, impl-defined
					result += (nn <= m && Type(captures[nnI]) === 'Undefined') ? '' : captures[nnI];
					i += 2;
				} else {
					result += '$';
				}
			}
		} else {
			// the final $, or else not a $
			result += $charAt(replacement, i);
		}
	}
	return result;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/regexTester":1597942294624,"../helpers/callBound":1597942294577,"../helpers/every":1597942294649,"./IsArray":1597942294635,"./IsInteger":1597942294631,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294690, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var has = require('has');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-hasownproperty

module.exports = function HasOwnProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	return has(O, P);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294641,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294691, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-hasproperty

module.exports = function HasProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	return P in O;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294641,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294692, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerHour = timeConstants.msPerHour;
var HoursPerDay = timeConstants.HoursPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function HourFromTime(t) {
	return mod($floor(t / msPerHour), HoursPerDay);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294693, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $hasInstance = GetIntrinsic('Symbol.hasInstance', true);

var Call = require('./Call');
var GetMethod = require('./GetMethod');
var IsCallable = require('./IsCallable');
var OrdinaryHasInstance = require('./OrdinaryHasInstance');
var ToBoolean = require('./ToBoolean');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-instanceofoperator

module.exports = function InstanceofOperator(O, C) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	var instOfHandler = $hasInstance ? GetMethod(C, $hasInstance) : void 0;
	if (typeof instOfHandler !== 'undefined') {
		return ToBoolean(Call(instOfHandler, C, [O]));
	}
	if (!IsCallable(C)) {
		throw new $TypeError('`C` is not Callable');
	}
	return OrdinaryHasInstance(C, O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Call":1597942294660,"./GetMethod":1597942294684,"./IsCallable":1597942294644,"./OrdinaryHasInstance":1597942294694,"./ToBoolean":1597942294643,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294694, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var IsCallable = require('./IsCallable');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinaryhasinstance

module.exports = function OrdinaryHasInstance(C, O) {
	if (IsCallable(C) === false) {
		return false;
	}
	if (Type(O) !== 'Object') {
		return false;
	}
	var P = Get(C, 'prototype');
	if (Type(P) !== 'Object') {
		throw new $TypeError('OrdinaryHasInstance called on an object with an invalid prototype property.');
	}
	return O instanceof C;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294657,"./IsCallable":1597942294644,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294695, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $arraySlice = require('../helpers/callBound')('Array.prototype.slice');

var Call = require('./Call');
var GetV = require('./GetV');
var IsPropertyKey = require('./IsPropertyKey');

// https://ecma-international.org/ecma-262/6.0/#sec-invoke

module.exports = function Invoke(O, P) {
	if (!IsPropertyKey(P)) {
		throw new $TypeError('P must be a Property Key');
	}
	var argumentsList = $arraySlice(arguments, 2);
	var func = GetV(O, P);
	return Call(func, O, argumentsList);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Call":1597942294660,"./GetV":1597942294685,"./IsPropertyKey":1597942294641}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294696, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $isConcatSpreadable = GetIntrinsic('%Symbol.isConcatSpreadable%', true);

var Get = require('./Get');
var IsArray = require('./IsArray');
var ToBoolean = require('./ToBoolean');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable

module.exports = function IsConcatSpreadable(O) {
	if (Type(O) !== 'Object') {
		return false;
	}
	if ($isConcatSpreadable) {
		var spreadable = Get(O, $isConcatSpreadable);
		if (typeof spreadable !== 'undefined') {
			return ToBoolean(spreadable);
		}
	}
	return IsArray(O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294657,"./IsArray":1597942294635,"./ToBoolean":1597942294643,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294697, function(require, module, exports) {


var callBound = require('../helpers/callBound');

var $PromiseThen = callBound('Promise.prototype.then', true);

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ispromise

module.exports = function IsPromise(x) {
	if (Type(x) !== 'Object') {
		return false;
	}
	if (!$PromiseThen) { // Promises are not supported
		return false;
	}
	try {
		$PromiseThen(x); // throws if not a promise
	} catch (e) {
		return false;
	}
	return true;
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294698, function(require, module, exports) {


var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');

var Type = require('./Type');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');

// https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type

module.exports = function IsPropertyDescriptor(Desc) {
	return isPropertyDescriptor({
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor,
		Type: Type
	}, Desc);
};

}, function(modId) { var map = {"../helpers/isPropertyDescriptor":1597942294599,"./Type":1597942294627,"./IsDataDescriptor":1597942294637,"./IsAccessorDescriptor":1597942294636}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294699, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Call = require('./Call');
var GetMethod = require('./GetMethod');
var IsCallable = require('./IsCallable');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorclose

module.exports = function IteratorClose(iterator, completion) {
	if (Type(iterator) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(iterator) is not Object');
	}
	if (!IsCallable(completion)) {
		throw new $TypeError('Assertion failed: completion is not a thunk for a Completion Record');
	}
	var completionThunk = completion;

	var iteratorReturn = GetMethod(iterator, 'return');

	if (typeof iteratorReturn === 'undefined') {
		return completionThunk();
	}

	var completionRecord;
	try {
		var innerResult = Call(iteratorReturn, iterator, []);
	} catch (e) {
		// if we hit here, then "e" is the innerResult completion that needs re-throwing

		// if the completion is of type "throw", this will throw.
		completionThunk();
		completionThunk = null; // ensure it's not called twice.

		// if not, then return the innerResult completion
		throw e;
	}
	completionRecord = completionThunk(); // if innerResult worked, then throw if the completion does
	completionThunk = null; // ensure it's not called twice.

	if (Type(innerResult) !== 'Object') {
		throw new $TypeError('iterator .return must return an object');
	}

	return completionRecord;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Call":1597942294660,"./GetMethod":1597942294684,"./IsCallable":1597942294644,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294700, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var ToBoolean = require('./ToBoolean');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorcomplete

module.exports = function IteratorComplete(iterResult) {
	if (Type(iterResult) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(iterResult) is not Object');
	}
	return ToBoolean(Get(iterResult, 'done'));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294657,"./ToBoolean":1597942294643,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294701, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Invoke = require('./Invoke');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratornext

module.exports = function IteratorNext(iterator, value) {
	var result = Invoke(iterator, 'next', arguments.length < 2 ? [] : [value]);
	if (Type(result) !== 'Object') {
		throw new $TypeError('iterator next must return an object');
	}
	return result;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Invoke":1597942294695,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294702, function(require, module, exports) {


var IteratorComplete = require('./IteratorComplete');
var IteratorNext = require('./IteratorNext');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorstep

module.exports = function IteratorStep(iterator) {
	var result = IteratorNext(iterator);
	var done = IteratorComplete(result);
	return done === true ? false : result;
};


}, function(modId) { var map = {"./IteratorComplete":1597942294700,"./IteratorNext":1597942294701}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294703, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorvalue

module.exports = function IteratorValue(iterResult) {
	if (Type(iterResult) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(iterResult) is not Object');
	}
	return Get(iterResult, 'value');
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294657,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294704, function(require, module, exports) {


var $isFinite = require('../helpers/isFinite');
var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.13

module.exports = function MakeDate(day, time) {
	if (!$isFinite(day) || !$isFinite(time)) {
		return NaN;
	}
	return (day * msPerDay) + time;
};

}, function(modId) { var map = {"../helpers/isFinite":1597942294575,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294705, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');
var $DateUTC = GetIntrinsic('%Date.UTC%');

var mod = require('../helpers/mod');
var $isFinite = require('../helpers/isFinite');

var DateFromTime = require('./DateFromTime');
var Day = require('./Day');
var MonthFromTime = require('./MonthFromTime');
var ToInteger = require('./ToInteger');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.12

module.exports = function MakeDay(year, month, date) {
	if (!$isFinite(year) || !$isFinite(month) || !$isFinite(date)) {
		return NaN;
	}
	var y = ToInteger(year);
	var m = ToInteger(month);
	var dt = ToInteger(date);
	var ym = y + $floor(m / 12);
	var mn = mod(m, 12);
	var t = $DateUTC(ym, mn, 1);
	if (YearFromTime(t) !== ym || MonthFromTime(t) !== mn || DateFromTime(t) !== 1) {
		return NaN;
	}
	return Day(t) + dt - 1;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/isFinite":1597942294575,"./DateFromTime":1597942294672,"./Day":1597942294674,"./MonthFromTime":1597942294679,"./ToInteger":1597942294670,"./YearFromTime":1597942294676}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294706, function(require, module, exports) {


var $isFinite = require('../helpers/isFinite');
var timeConstants = require('../helpers/timeConstants');
var msPerSecond = timeConstants.msPerSecond;
var msPerMinute = timeConstants.msPerMinute;
var msPerHour = timeConstants.msPerHour;

var ToInteger = require('./ToInteger');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.11

module.exports = function MakeTime(hour, min, sec, ms) {
	if (!$isFinite(hour) || !$isFinite(min) || !$isFinite(sec) || !$isFinite(ms)) {
		return NaN;
	}
	var h = ToInteger(hour);
	var m = ToInteger(min);
	var s = ToInteger(sec);
	var milli = ToInteger(ms);
	var t = (h * msPerHour) + (m * msPerMinute) + (s * msPerSecond) + milli;
	return t;
};

}, function(modId) { var map = {"../helpers/isFinite":1597942294575,"../helpers/timeConstants":1597942294584,"./ToInteger":1597942294670}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294707, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerMinute = timeConstants.msPerMinute;
var MinutesPerHour = timeConstants.MinutesPerHour;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function MinFromTime(t) {
	return mod($floor(t / msPerMinute), MinutesPerHour);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294708, function(require, module, exports) {


var mod = require('../helpers/mod');

// https://ecma-international.org/ecma-262/5.1/#sec-5.2

module.exports = function modulo(x, y) {
	return mod(x, y);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294709, function(require, module, exports) {


var mod = require('../helpers/mod');
var msPerSecond = require('../helpers/timeConstants').msPerSecond;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function msFromTime(t) {
	return mod(t, msPerSecond);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294710, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $ObjectCreate = GetIntrinsic('%Object.create%', true);
var $TypeError = GetIntrinsic('%TypeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');

var Type = require('./Type');

var hasProto = !({ __proto__: null } instanceof Object);

// https://www.ecma-international.org/ecma-262/6.0/#sec-objectcreate

module.exports = function ObjectCreate(proto, internalSlotsList) {
	if (proto !== null && Type(proto) !== 'Object') {
		throw new $TypeError('Assertion failed: `proto` must be null or an object');
	}
	var slots = arguments.length < 2 ? [] : internalSlotsList;
	if (slots.length > 0) {
		throw new $SyntaxError('es-abstract does not yet support internal slots');
	}

	if ($ObjectCreate) {
		return $ObjectCreate(proto);
	}
	if (hasProto) {
		return { __proto__: proto };
	}

	if (proto === null) {
		throw new $SyntaxError('native Object.create support is required to create null objects');
	}
	var T = function T() {};
	T.prototype = proto;
	return new T();
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294711, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinaryhasproperty

module.exports = function OrdinaryHasProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	return P in O;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294641,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294712, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var regexExec = require('../helpers/callBound')('RegExp.prototype.exec');

var Call = require('./Call');
var Get = require('./Get');
var IsCallable = require('./IsCallable');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-regexpexec

module.exports = function RegExpExec(R, S) {
	if (Type(R) !== 'Object') {
		throw new $TypeError('Assertion failed: `R` must be an Object');
	}
	if (Type(S) !== 'String') {
		throw new $TypeError('Assertion failed: `S` must be a String');
	}
	var exec = Get(R, 'exec');
	if (IsCallable(exec)) {
		var result = Call(exec, R, [S]);
		if (result === null || Type(result) === 'Object') {
			return result;
		}
		throw new $TypeError('"exec" method must return `null` or an Object');
	}
	return regexExec(R, S);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Call":1597942294660,"./Get":1597942294657,"./IsCallable":1597942294644,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294713, function(require, module, exports) {


var $isNaN = require('../helpers/isNaN');

// https://www.ecma-international.org/ecma-262/6.0/#sec-samevaluezero

module.exports = function SameValueZero(x, y) {
	return (x === y) || ($isNaN(x) && $isNaN(y));
};

}, function(modId) { var map = {"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294714, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerSecond = timeConstants.msPerSecond;
var SecondsPerMinute = timeConstants.SecondsPerMinute;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function SecFromTime(t) {
	return mod($floor(t / msPerSecond), SecondsPerMinute);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294715, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// IE 9 does not throw in strict mode when writability/configurability/extensibility is violated
var noThrowOnStrictViolation = (function () {
	try {
		delete [].length;
		return true;
	} catch (e) {
		return false;
	}
}());

// https://ecma-international.org/ecma-262/6.0/#sec-set-o-p-v-throw

module.exports = function Set(O, P, V, Throw) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	if (Type(Throw) !== 'Boolean') {
		throw new $TypeError('Assertion failed: `Throw` must be a Boolean');
	}
	if (Throw) {
		O[P] = V; // eslint-disable-line no-param-reassign
		if (noThrowOnStrictViolation && !SameValue(O[P], V)) {
			throw new $TypeError('Attempted to assign to readonly property.');
		}
		return true;
	} else {
		try {
			O[P] = V; // eslint-disable-line no-param-reassign
			return noThrowOnStrictViolation ? SameValue(O[P], V) : true;
		} catch (e) {
			return false;
		}
	}
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294641,"./SameValue":1597942294645,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294716, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var has = require('has');

var $TypeError = GetIntrinsic('%TypeError%');

var getSymbolDescription = require('../helpers/getSymbolDescription');

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');
var IsExtensible = require('./IsExtensible');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-setfunctionname

module.exports = function SetFunctionName(F, name) {
	if (typeof F !== 'function') {
		throw new $TypeError('Assertion failed: `F` must be a function');
	}
	if (!IsExtensible(F) || has(F, 'name')) {
		throw new $TypeError('Assertion failed: `F` must be extensible, and must not have a `name` own property');
	}
	var nameType = Type(name);
	if (nameType !== 'Symbol' && nameType !== 'String') {
		throw new $TypeError('Assertion failed: `name` must be a Symbol or a String');
	}
	if (nameType === 'Symbol') {
		var description = getSymbolDescription(name);
		// eslint-disable-next-line no-param-reassign
		name = typeof description === 'undefined' ? '' : '[' + description + ']';
	}
	if (arguments.length > 2) {
		var prefix = arguments[2];
		// eslint-disable-next-line no-param-reassign
		name = prefix + ' ' + name;
	}
	return DefinePropertyOrThrow(F, 'name', {
		'[[Value]]': name,
		'[[Writable]]': false,
		'[[Enumerable]]': false,
		'[[Configurable]]': true
	});
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getSymbolDescription":1597942294717,"./DefinePropertyOrThrow":1597942294659,"./IsExtensible":1597942294640,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294717, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var callBound = require('./callBound');

var $SyntaxError = GetIntrinsic('%SyntaxError%');
var getGlobalSymbolDescription = GetIntrinsic('%Symbol.keyFor%', true);
var thisSymbolValue = callBound('%Symbol.prototype.valueOf%', true);
var symToStr = callBound('Symbol.prototype.toString', true);

var getInferredName = require('./getInferredName');

/* eslint-disable consistent-return */
module.exports = callBound('%Symbol.prototype.description%', true) || function getSymbolDescription(symbol) {
	if (!thisSymbolValue) {
		throw new $SyntaxError('Symbols are not supported in this environment');
	}

	// will throw if not a symbol primitive or wrapper object
	var sym = thisSymbolValue(symbol);

	if (getInferredName) {
		var name = getInferredName(sym);
		if (name === '') { return; }
		return name.slice(1, -1); // name.slice('['.length, -']'.length);
	}

	var desc;
	if (getGlobalSymbolDescription) {
		desc = getGlobalSymbolDescription(sym);
		if (typeof desc === 'string') {
			return desc;
		}
	}

	desc = symToStr(sym).slice(7, -1); // str.slice('Symbol('.length, -')'.length);
	if (desc) {
		return desc;
	}
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./callBound":1597942294577,"./getInferredName":1597942294718}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294718, function(require, module, exports) {


var getInferredName;
try {
	// eslint-disable-next-line no-new-func
	getInferredName = Function('s', 'return { [s]() {} }[s].name;');
} catch (e) {}

var inferred = function () {};
module.exports = getInferredName && inferred.name === 'inferred' ? getInferredName : null;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294719, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');
var $preventExtensions = GetIntrinsic('%Object.preventExtensions%');
var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%');

var forEach = require('../helpers/forEach');

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-setintegritylevel

module.exports = function SetIntegrityLevel(O, level) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (level !== 'sealed' && level !== 'frozen') {
		throw new $TypeError('Assertion failed: `level` must be `"sealed"` or `"frozen"`');
	}
	if (!$preventExtensions) {
		throw new $SyntaxError('SetIntegrityLevel requires native `Object.preventExtensions` support');
	}
	var status = $preventExtensions(O);
	if (!status) {
		return false;
	}
	if (!$gOPN) {
		throw new $SyntaxError('SetIntegrityLevel requires native `Object.getOwnPropertyNames` support');
	}
	var theKeys = $gOPN(O);
	if (level === 'sealed') {
		forEach(theKeys, function (k) {
			DefinePropertyOrThrow(O, k, { configurable: false });
		});
	} else if (level === 'frozen') {
		forEach(theKeys, function (k) {
			var currentDesc = $gOPD(O, k);
			if (typeof currentDesc !== 'undefined') {
				var desc;
				if (IsAccessorDescriptor(ToPropertyDescriptor(currentDesc))) {
					desc = { configurable: false };
				} else {
					desc = { configurable: false, writable: false };
				}
				DefinePropertyOrThrow(O, k, desc);
			}
		});
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/forEach":1597942294720,"./DefinePropertyOrThrow":1597942294659,"./IsAccessorDescriptor":1597942294636,"./ToPropertyDescriptor":1597942294642,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294720, function(require, module, exports) {


module.exports = function forEach(array, callback) {
	for (var i = 0; i < array.length; i += 1) {
		callback(array[i], i, array); // eslint-disable-line callback-return
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294721, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $species = GetIntrinsic('%Symbol.species%', true);
var $TypeError = GetIntrinsic('%TypeError%');

var IsConstructor = require('./IsConstructor');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-speciesconstructor

module.exports = function SpeciesConstructor(O, defaultConstructor) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	var C = O.constructor;
	if (typeof C === 'undefined') {
		return defaultConstructor;
	}
	if (Type(C) !== 'Object') {
		throw new $TypeError('O.constructor is not an Object');
	}
	var S = $species ? C[$species] : void 0;
	if (S == null) {
		return defaultConstructor;
	}
	if (IsConstructor(S)) {
		return S;
	}
	throw new $TypeError('no constructor found');
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsConstructor":1597942294658,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294722, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $SymbolToString = callBound('Symbol.prototype.toString', true);

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-symboldescriptivestring

module.exports = function SymbolDescriptiveString(sym) {
	if (Type(sym) !== 'Symbol') {
		throw new $TypeError('Assertion failed: `sym` must be a Symbol');
	}
	return $SymbolToString(sym);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294723, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%');
var $TypeError = GetIntrinsic('%TypeError%');

var every = require('../helpers/every');

var IsDataDescriptor = require('./IsDataDescriptor');
var IsExtensible = require('./IsExtensible');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-testintegritylevel

module.exports = function TestIntegrityLevel(O, level) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (level !== 'sealed' && level !== 'frozen') {
		throw new $TypeError('Assertion failed: `level` must be `"sealed"` or `"frozen"`');
	}
	var status = IsExtensible(O);
	if (status) {
		return false;
	}
	var theKeys = $gOPN(O);
	return theKeys.length === 0 || every(theKeys, function (k) {
		var currentDesc = $gOPD(O, k);
		if (typeof currentDesc !== 'undefined') {
			if (currentDesc.configurable) {
				return false;
			}
			if (level === 'frozen' && IsDataDescriptor(ToPropertyDescriptor(currentDesc)) && currentDesc.writable) {
				return false;
			}
		}
		return true;
	});
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/every":1597942294649,"./IsDataDescriptor":1597942294637,"./IsExtensible":1597942294640,"./ToPropertyDescriptor":1597942294642,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294724, function(require, module, exports) {


var $BooleanValueOf = require('../helpers/callBound')('Boolean.prototype.valueOf');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-boolean-prototype-object

module.exports = function thisBooleanValue(value) {
	if (Type(value) === 'Boolean') {
		return value;
	}

	return $BooleanValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294725, function(require, module, exports) {


var callBound = require('../helpers/callBound');

var Type = require('./Type');

var $NumberValueOf = callBound('Number.prototype.valueOf');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-number-prototype-object

module.exports = function thisNumberValue(value) {
	if (Type(value) === 'Number') {
		return value;
	}

	return $NumberValueOf(value);
};


}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294726, function(require, module, exports) {


var $StringValueOf = require('../helpers/callBound')('String.prototype.valueOf');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-string-prototype-object

module.exports = function thisStringValue(value) {
	if (Type(value) === 'String') {
		return value;
	}

	return $StringValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294727, function(require, module, exports) {


var $DateValueOf = require('../helpers/callBound')('Date.prototype.valueOf');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-date-prototype-object

module.exports = function thisTimeValue(value) {
	return $DateValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294728, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Date = GetIntrinsic('%Date%');
var $Number = GetIntrinsic('%Number%');
var $abs = GetIntrinsic('%Math.abs%');

var $isFinite = require('../helpers/isFinite');

var ToNumber = require('./ToNumber');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.14

module.exports = function TimeClip(time) {
	if (!$isFinite(time) || $abs(time) > 8.64e15) {
		return NaN;
	}
	return $Number(new $Date(ToNumber(time)));
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isFinite":1597942294575,"./ToNumber":1597942294623}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294729, function(require, module, exports) {


var msPerDay = require('../helpers/timeConstants').msPerDay;

var DayFromYear = require('./DayFromYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function TimeFromYear(y) {
	return msPerDay * DayFromYear(y);
};

}, function(modId) { var map = {"../helpers/timeConstants":1597942294584,"./DayFromYear":1597942294675}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294730, function(require, module, exports) {


var mod = require('../helpers/mod');
var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.2

module.exports = function TimeWithinDay(t) {
	return mod(t, msPerDay);
};


}, function(modId) { var map = {"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294731, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $Date = GetIntrinsic('%Date%');

var $isNaN = require('../helpers/isNaN');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-todatestring

module.exports = function ToDateString(tv) {
	if (Type(tv) !== 'Number') {
		throw new $TypeError('Assertion failed: `tv` must be a Number');
	}
	if ($isNaN(tv)) {
		return 'Invalid Date';
	}
	return $Date(tv);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"./Type":1597942294627}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294732, function(require, module, exports) {


var ToUint16 = require('./ToUint16');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toint16

module.exports = function ToInt16(argument) {
	var int16bit = ToUint16(argument);
	return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
};

}, function(modId) { var map = {"./ToUint16":1597942294733}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294733, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var $sign = require('../helpers/sign');
var $mod = require('../helpers/mod');

var $floor = $Math.floor;
var $abs = $Math.abs;

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.7

module.exports = function ToUint16(value) {
	var number = ToNumber(value);
	if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
	var posInt = $sign(number) * $floor($abs(number));
	return $mod(posInt, 0x10000);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942294623,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/sign":1597942294603,"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294734, function(require, module, exports) {


var ToNumber = require('./ToNumber');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.5

module.exports = function ToInt32(x) {
	return ToNumber(x) >> 0;
};

}, function(modId) { var map = {"./ToNumber":1597942294623}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294735, function(require, module, exports) {


var ToUint8 = require('./ToUint8');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toint8

module.exports = function ToInt8(argument) {
	var int8bit = ToUint8(argument);
	return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
};

}, function(modId) { var map = {"./ToUint8":1597942294736}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294736, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var $sign = require('../helpers/sign');
var $mod = require('../helpers/mod');

var $floor = $Math.floor;
var $abs = $Math.abs;

module.exports = function ToUint8(argument) {
	var number = ToNumber(argument);
	if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
	var posInt = $sign(number) * $floor($abs(number));
	return $mod(posInt, 0x100);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942294623,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/sign":1597942294603,"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294737, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $String = GetIntrinsic('%String%');

var ToPrimitive = require('./ToPrimitive');
var ToString = require('./ToString');

// https://www.ecma-international.org/ecma-262/6.0/#sec-topropertykey

module.exports = function ToPropertyKey(argument) {
	var key = ToPrimitive(argument, $String);
	return typeof key === 'symbol' ? key : ToString(key);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToPrimitive":1597942294626,"./ToString":1597942294654}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294738, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');

var $floor = $Math.floor;

// https://www.ecma-international.org/ecma-262/6.0/#sec-touint8clamp

module.exports = function ToUint8Clamp(argument) {
	var number = ToNumber(argument);
	if ($isNaN(number) || number <= 0) { return 0; }
	if (number >= 0xFF) { return 0xFF; }
	var f = $floor(argument);
	if (f + 0.5 < number) { return f + 1; }
	if (number < f + 0.5) { return f; }
	if (f % 2 !== 0) { return f + 1; }
	return f;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942294623,"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294739, function(require, module, exports) {


var mod = require('../helpers/mod');

var Day = require('./Day');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.6

module.exports = function WeekDay(t) {
	return mod(Day(t) + 4, 7);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589,"./Day":1597942294674}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294740, function(require, module, exports) {


/* eslint global-require: 0 */
// https://www.ecma-international.org/ecma-262/7.0/#sec-abstract-operations
var ES2016 = {
	'Abstract Equality Comparison': require('./2016/AbstractEqualityComparison'),
	'Abstract Relational Comparison': require('./2016/AbstractRelationalComparison'),
	'Strict Equality Comparison': require('./2016/StrictEqualityComparison'),
	AdvanceStringIndex: require('./2016/AdvanceStringIndex'),
	ArrayCreate: require('./2016/ArrayCreate'),
	ArraySetLength: require('./2016/ArraySetLength'),
	ArraySpeciesCreate: require('./2016/ArraySpeciesCreate'),
	Call: require('./2016/Call'),
	CanonicalNumericIndexString: require('./2016/CanonicalNumericIndexString'),
	CompletePropertyDescriptor: require('./2016/CompletePropertyDescriptor'),
	CreateDataProperty: require('./2016/CreateDataProperty'),
	CreateDataPropertyOrThrow: require('./2016/CreateDataPropertyOrThrow'),
	CreateHTML: require('./2016/CreateHTML'),
	CreateIterResultObject: require('./2016/CreateIterResultObject'),
	CreateListFromArrayLike: require('./2016/CreateListFromArrayLike'),
	CreateMethodProperty: require('./2016/CreateMethodProperty'),
	DateFromTime: require('./2016/DateFromTime'),
	Day: require('./2016/Day'),
	DayFromYear: require('./2016/DayFromYear'),
	DaysInYear: require('./2016/DaysInYear'),
	DayWithinYear: require('./2016/DayWithinYear'),
	DefinePropertyOrThrow: require('./2016/DefinePropertyOrThrow'),
	DeletePropertyOrThrow: require('./2016/DeletePropertyOrThrow'),
	EnumerableOwnNames: require('./2016/EnumerableOwnNames'),
	FromPropertyDescriptor: require('./2016/FromPropertyDescriptor'),
	Get: require('./2016/Get'),
	GetIterator: require('./2016/GetIterator'),
	GetMethod: require('./2016/GetMethod'),
	GetOwnPropertyKeys: require('./2016/GetOwnPropertyKeys'),
	GetPrototypeFromConstructor: require('./2016/GetPrototypeFromConstructor'),
	GetSubstitution: require('./2016/GetSubstitution'),
	GetV: require('./2016/GetV'),
	HasOwnProperty: require('./2016/HasOwnProperty'),
	HasProperty: require('./2016/HasProperty'),
	HourFromTime: require('./2016/HourFromTime'),
	InLeapYear: require('./2016/InLeapYear'),
	InstanceofOperator: require('./2016/InstanceofOperator'),
	Invoke: require('./2016/Invoke'),
	IsAccessorDescriptor: require('./2016/IsAccessorDescriptor'),
	IsArray: require('./2016/IsArray'),
	IsCallable: require('./2016/IsCallable'),
	IsConcatSpreadable: require('./2016/IsConcatSpreadable'),
	IsConstructor: require('./2016/IsConstructor'),
	IsDataDescriptor: require('./2016/IsDataDescriptor'),
	IsExtensible: require('./2016/IsExtensible'),
	IsGenericDescriptor: require('./2016/IsGenericDescriptor'),
	IsInteger: require('./2016/IsInteger'),
	IsPromise: require('./2016/IsPromise'),
	IsPropertyDescriptor: require('./2016/IsPropertyDescriptor'),
	IsPropertyKey: require('./2016/IsPropertyKey'),
	IsRegExp: require('./2016/IsRegExp'),
	IterableToArrayLike: require('./2016/IterableToArrayLike'),
	IteratorClose: require('./2016/IteratorClose'),
	IteratorComplete: require('./2016/IteratorComplete'),
	IteratorNext: require('./2016/IteratorNext'),
	IteratorStep: require('./2016/IteratorStep'),
	IteratorValue: require('./2016/IteratorValue'),
	MakeDate: require('./2016/MakeDate'),
	MakeDay: require('./2016/MakeDay'),
	MakeTime: require('./2016/MakeTime'),
	MinFromTime: require('./2016/MinFromTime'),
	modulo: require('./2016/modulo'),
	MonthFromTime: require('./2016/MonthFromTime'),
	msFromTime: require('./2016/msFromTime'),
	ObjectCreate: require('./2016/ObjectCreate'),
	OrdinaryDefineOwnProperty: require('./2016/OrdinaryDefineOwnProperty'),
	OrdinaryGetOwnProperty: require('./2016/OrdinaryGetOwnProperty'),
	OrdinaryGetPrototypeOf: require('./2016/OrdinaryGetPrototypeOf'),
	OrdinarySetPrototypeOf: require('./2016/OrdinarySetPrototypeOf'),
	OrdinaryHasInstance: require('./2016/OrdinaryHasInstance'),
	OrdinaryHasProperty: require('./2016/OrdinaryHasProperty'),
	RegExpExec: require('./2016/RegExpExec'),
	RequireObjectCoercible: require('./2016/RequireObjectCoercible'),
	SameValue: require('./2016/SameValue'),
	SameValueNonNumber: require('./2016/SameValueNonNumber'),
	SameValueZero: require('./2016/SameValueZero'),
	SecFromTime: require('./2016/SecFromTime'),
	Set: require('./2016/Set'),
	SetFunctionName: require('./2016/SetFunctionName'),
	SetIntegrityLevel: require('./2016/SetIntegrityLevel'),
	SpeciesConstructor: require('./2016/SpeciesConstructor'),
	SymbolDescriptiveString: require('./2016/SymbolDescriptiveString'),
	TestIntegrityLevel: require('./2016/TestIntegrityLevel'),
	thisBooleanValue: require('./2016/thisBooleanValue'),
	thisNumberValue: require('./2016/thisNumberValue'),
	thisStringValue: require('./2016/thisStringValue'),
	thisTimeValue: require('./2016/thisTimeValue'),
	TimeClip: require('./2016/TimeClip'),
	TimeFromYear: require('./2016/TimeFromYear'),
	TimeWithinDay: require('./2016/TimeWithinDay'),
	ToBoolean: require('./2016/ToBoolean'),
	ToDateString: require('./2016/ToDateString'),
	ToInt16: require('./2016/ToInt16'),
	ToInt32: require('./2016/ToInt32'),
	ToInt8: require('./2016/ToInt8'),
	ToInteger: require('./2016/ToInteger'),
	ToLength: require('./2016/ToLength'),
	ToNumber: require('./2016/ToNumber'),
	ToObject: require('./2016/ToObject'),
	ToPrimitive: require('./2016/ToPrimitive'),
	ToPropertyDescriptor: require('./2016/ToPropertyDescriptor'),
	ToPropertyKey: require('./2016/ToPropertyKey'),
	ToString: require('./2016/ToString'),
	ToUint16: require('./2016/ToUint16'),
	ToUint32: require('./2016/ToUint32'),
	ToUint8: require('./2016/ToUint8'),
	ToUint8Clamp: require('./2016/ToUint8Clamp'),
	Type: require('./2016/Type'),
	ValidateAndApplyPropertyDescriptor: require('./2016/ValidateAndApplyPropertyDescriptor'),
	WeekDay: require('./2016/WeekDay'),
	YearFromTime: require('./2016/YearFromTime')
};

module.exports = ES2016;

}, function(modId) { var map = {"./2016/AbstractEqualityComparison":1597942294741,"./2016/AbstractRelationalComparison":1597942294745,"./2016/StrictEqualityComparison":1597942294746,"./2016/AdvanceStringIndex":1597942294747,"./2016/ArrayCreate":1597942294749,"./2016/ArraySetLength":1597942294750,"./2016/ArraySpeciesCreate":1597942294768,"./2016/Call":1597942294772,"./2016/CanonicalNumericIndexString":1597942294773,"./2016/CompletePropertyDescriptor":1597942294774,"./2016/CreateDataProperty":1597942294775,"./2016/CreateDataPropertyOrThrow":1597942294776,"./2016/CreateHTML":1597942294777,"./2016/CreateIterResultObject":1597942294779,"./2016/CreateListFromArrayLike":1597942294780,"./2016/CreateMethodProperty":1597942294783,"./2016/DateFromTime":1597942294784,"./2016/Day":1597942294786,"./2016/DayFromYear":1597942294787,"./2016/DaysInYear":1597942294790,"./2016/DayWithinYear":1597942294785,"./2016/DefinePropertyOrThrow":1597942294771,"./2016/DeletePropertyOrThrow":1597942294792,"./2016/EnumerableOwnNames":1597942294793,"./2016/FromPropertyDescriptor":1597942294762,"./2016/Get":1597942294769,"./2016/GetIterator":1597942294794,"./2016/GetMethod":1597942294795,"./2016/GetOwnPropertyKeys":1597942294798,"./2016/GetPrototypeFromConstructor":1597942294799,"./2016/GetSubstitution":1597942294800,"./2016/GetV":1597942294796,"./2016/HasOwnProperty":1597942294801,"./2016/HasProperty":1597942294802,"./2016/HourFromTime":1597942294803,"./2016/InLeapYear":1597942294789,"./2016/InstanceofOperator":1597942294804,"./2016/Invoke":1597942294806,"./2016/IsAccessorDescriptor":1597942294752,"./2016/IsArray":1597942294751,"./2016/IsCallable":1597942294759,"./2016/IsConcatSpreadable":1597942294807,"./2016/IsConstructor":1597942294770,"./2016/IsDataDescriptor":1597942294753,"./2016/IsExtensible":1597942294755,"./2016/IsGenericDescriptor":1597942294763,"./2016/IsInteger":1597942294748,"./2016/IsPromise":1597942294808,"./2016/IsPropertyDescriptor":1597942294809,"./2016/IsPropertyKey":1597942294756,"./2016/IsRegExp":1597942294765,"./2016/IterableToArrayLike":1597942294810,"./2016/IteratorClose":1597942294815,"./2016/IteratorComplete":1597942294812,"./2016/IteratorNext":1597942294813,"./2016/IteratorStep":1597942294811,"./2016/IteratorValue":1597942294814,"./2016/MakeDate":1597942294816,"./2016/MakeDay":1597942294817,"./2016/MakeTime":1597942294818,"./2016/MinFromTime":1597942294819,"./2016/modulo":1597942294820,"./2016/MonthFromTime":1597942294791,"./2016/msFromTime":1597942294821,"./2016/ObjectCreate":1597942294822,"./2016/OrdinaryDefineOwnProperty":1597942294754,"./2016/OrdinaryGetOwnProperty":1597942294764,"./2016/OrdinaryGetPrototypeOf":1597942294823,"./2016/OrdinarySetPrototypeOf":1597942294825,"./2016/OrdinaryHasInstance":1597942294805,"./2016/OrdinaryHasProperty":1597942294827,"./2016/RegExpExec":1597942294828,"./2016/RequireObjectCoercible":1597942294778,"./2016/SameValue":1597942294760,"./2016/SameValueNonNumber":1597942294829,"./2016/SameValueZero":1597942294830,"./2016/SecFromTime":1597942294831,"./2016/Set":1597942294832,"./2016/SetFunctionName":1597942294833,"./2016/SetIntegrityLevel":1597942294834,"./2016/SpeciesConstructor":1597942294835,"./2016/SymbolDescriptiveString":1597942294836,"./2016/TestIntegrityLevel":1597942294837,"./2016/thisBooleanValue":1597942294838,"./2016/thisNumberValue":1597942294839,"./2016/thisStringValue":1597942294840,"./2016/thisTimeValue":1597942294841,"./2016/TimeClip":1597942294842,"./2016/TimeFromYear":1597942294843,"./2016/TimeWithinDay":1597942294844,"./2016/ToBoolean":1597942294758,"./2016/ToDateString":1597942294845,"./2016/ToInt16":1597942294846,"./2016/ToInt32":1597942294848,"./2016/ToInt8":1597942294849,"./2016/ToInteger":1597942294782,"./2016/ToLength":1597942294781,"./2016/ToNumber":1597942294742,"./2016/ToObject":1597942294797,"./2016/ToPrimitive":1597942294743,"./2016/ToPropertyDescriptor":1597942294757,"./2016/ToPropertyKey":1597942294851,"./2016/ToString":1597942294766,"./2016/ToUint16":1597942294847,"./2016/ToUint32":1597942294767,"./2016/ToUint8":1597942294850,"./2016/ToUint8Clamp":1597942294852,"./2016/Type":1597942294744,"./2016/ValidateAndApplyPropertyDescriptor":1597942294761,"./2016/WeekDay":1597942294853,"./2016/YearFromTime":1597942294788}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294741, function(require, module, exports) {


var ToNumber = require('./ToNumber');
var ToPrimitive = require('./ToPrimitive');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-abstract-equality-comparison

module.exports = function AbstractEqualityComparison(x, y) {
	var xType = Type(x);
	var yType = Type(y);
	if (xType === yType) {
		return x === y; // ES6+ specified this shortcut anyways.
	}
	if (x == null && y == null) {
		return true;
	}
	if (xType === 'Number' && yType === 'String') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if (xType === 'String' && yType === 'Number') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (xType === 'Boolean') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (yType === 'Boolean') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if ((xType === 'String' || xType === 'Number' || xType === 'Symbol') && yType === 'Object') {
		return AbstractEqualityComparison(x, ToPrimitive(y));
	}
	if (xType === 'Object' && (yType === 'String' || yType === 'Number' || yType === 'Symbol')) {
		return AbstractEqualityComparison(ToPrimitive(x), y);
	}
	return false;
};

}, function(modId) { var map = {"./ToNumber":1597942294742,"./ToPrimitive":1597942294743,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294742, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $Number = GetIntrinsic('%Number%');
var $RegExp = GetIntrinsic('%RegExp%');
var $parseInteger = GetIntrinsic('%parseInt%');

var callBound = require('../helpers/callBound');
var regexTester = require('../helpers/regexTester');
var isPrimitive = require('../helpers/isPrimitive');

var $strSlice = callBound('String.prototype.slice');
var isBinary = regexTester(/^0b[01]+$/i);
var isOctal = regexTester(/^0o[0-7]+$/i);
var isInvalidHexLiteral = regexTester(/^[-+]0x[0-9a-f]+$/i);
var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
var nonWSregex = new $RegExp('[' + nonWS + ']', 'g');
var hasNonWS = regexTester(nonWSregex);

// whitespace from: https://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = [
	'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
	'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
	'\u2029\uFEFF'
].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var $replace = callBound('String.prototype.replace');
var $trim = function (value) {
	return $replace(value, trimRegex, '');
};

var ToPrimitive = require('./ToPrimitive');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tonumber

module.exports = function ToNumber(argument) {
	var value = isPrimitive(argument) ? argument : ToPrimitive(argument, $Number);
	if (typeof value === 'symbol') {
		throw new $TypeError('Cannot convert a Symbol value to a number');
	}
	if (typeof value === 'string') {
		if (isBinary(value)) {
			return ToNumber($parseInteger($strSlice(value, 2), 2));
		} else if (isOctal(value)) {
			return ToNumber($parseInteger($strSlice(value, 2), 8));
		} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
			return NaN;
		} else {
			var trimmed = $trim(value);
			if (trimmed !== value) {
				return ToNumber(trimmed);
			}
		}
	}
	return $Number(value);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"../helpers/regexTester":1597942294624,"../helpers/isPrimitive":1597942294625,"./ToPrimitive":1597942294743}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294743, function(require, module, exports) {


var toPrimitive = require('es-to-primitive/es2015');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive

module.exports = function ToPrimitive(input) {
	if (arguments.length > 1) {
		return toPrimitive(input, arguments[1]);
	}
	return toPrimitive(input);
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294744, function(require, module, exports) {


var ES5Type = require('../5/Type');

// https://ecma-international.org/ecma-262/6.0/#sec-ecmascript-data-types-and-values

module.exports = function Type(x) {
	if (typeof x === 'symbol') {
		return 'Symbol';
	}
	return ES5Type(x);
};

}, function(modId) { var map = {"../5/Type":1597942294572}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294745, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Number = GetIntrinsic('%Number%');
var $TypeError = GetIntrinsic('%TypeError%');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var isPrefixOf = require('../helpers/isPrefixOf');

var ToNumber = require('./ToNumber');
var ToPrimitive = require('./ToPrimitive');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/5.1/#sec-11.8.5

// eslint-disable-next-line max-statements
module.exports = function AbstractRelationalComparison(x, y, LeftFirst) {
	if (Type(LeftFirst) !== 'Boolean') {
		throw new $TypeError('Assertion failed: LeftFirst argument must be a Boolean');
	}
	var px;
	var py;
	if (LeftFirst) {
		px = ToPrimitive(x, $Number);
		py = ToPrimitive(y, $Number);
	} else {
		py = ToPrimitive(y, $Number);
		px = ToPrimitive(x, $Number);
	}
	var bothStrings = Type(px) === 'String' && Type(py) === 'String';
	if (!bothStrings) {
		var nx = ToNumber(px);
		var ny = ToNumber(py);
		if ($isNaN(nx) || $isNaN(ny)) {
			return undefined;
		}
		if ($isFinite(nx) && $isFinite(ny) && nx === ny) {
			return false;
		}
		if (nx === 0 && ny === 0) {
			return false;
		}
		if (nx === Infinity) {
			return false;
		}
		if (ny === Infinity) {
			return true;
		}
		if (ny === -Infinity) {
			return false;
		}
		if (nx === -Infinity) {
			return true;
		}
		return nx < ny; // by now, these are both nonzero, finite, and not equal
	}
	if (isPrefixOf(py, px)) {
		return false;
	}
	if (isPrefixOf(px, py)) {
		return true;
	}
	return px < py; // both strings, neither a prefix of the other. shortcut for steps c-f
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/isPrefixOf":1597942294576,"./ToNumber":1597942294742,"./ToPrimitive":1597942294743,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294746, function(require, module, exports) {


var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/5.1/#sec-11.9.6

module.exports = function StrictEqualityComparison(x, y) {
	var xType = Type(x);
	var yType = Type(y);
	if (xType !== yType) {
		return false;
	}
	if (xType === 'Undefined' || xType === 'Null') {
		return true;
	}
	return x === y; // shortcut for steps 4-7
};

}, function(modId) { var map = {"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294747, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var IsInteger = require('./IsInteger');
var Type = require('./Type');

var MAX_SAFE_INTEGER = require('../helpers/maxSafeInteger');

var $TypeError = GetIntrinsic('%TypeError%');

var $charCodeAt = require('../helpers/callBound')('String.prototype.charCodeAt');

// https://ecma-international.org/ecma-262/6.0/#sec-advancestringindex

module.exports = function AdvanceStringIndex(S, index, unicode) {
	if (Type(S) !== 'String') {
		throw new $TypeError('Assertion failed: `S` must be a String');
	}
	if (!IsInteger(index) || index < 0 || index > MAX_SAFE_INTEGER) {
		throw new $TypeError('Assertion failed: `length` must be an integer >= 0 and <= 2**53');
	}
	if (Type(unicode) !== 'Boolean') {
		throw new $TypeError('Assertion failed: `unicode` must be a Boolean');
	}
	if (!unicode) {
		return index + 1;
	}
	var length = S.length;
	if ((index + 1) >= length) {
		return index + 1;
	}

	var first = $charCodeAt(S, index);
	if (first < 0xD800 || first > 0xDBFF) {
		return index + 1;
	}

	var second = $charCodeAt(S, index + 1);
	if (second < 0xDC00 || second > 0xDFFF) {
		return index + 1;
	}

	return index + 2;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsInteger":1597942294748,"./Type":1597942294744,"../helpers/maxSafeInteger":1597942294632,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294748, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var $floor = $Math.floor;
var $abs = $Math.abs;

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isinteger

module.exports = function IsInteger(argument) {
	if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
		return false;
	}
	var abs = $abs(argument);
	return $floor(abs) === abs;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294749, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $ArrayPrototype = GetIntrinsic('%Array.prototype%');
var $RangeError = GetIntrinsic('%RangeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');

var IsInteger = require('./IsInteger');

var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1;

var $setProto = GetIntrinsic('%Object.setPrototypeOf%', true) || (
	// eslint-disable-next-line no-proto, no-negated-condition
	[].__proto__ !== $ArrayPrototype
		? null
		: function (O, proto) {
			O.__proto__ = proto; // eslint-disable-line no-proto, no-param-reassign
			return O;
		}
);

// https://www.ecma-international.org/ecma-262/6.0/#sec-arraycreate

module.exports = function ArrayCreate(length) {
	if (!IsInteger(length) || length < 0) {
		throw new $TypeError('Assertion failed: `length` must be an integer Number >= 0');
	}
	if (length > MAX_ARRAY_LENGTH) {
		throw new $RangeError('length is greater than (2**32 - 1)');
	}
	var proto = arguments.length > 1 ? arguments[1] : $ArrayPrototype;
	var A = []; // steps 5 - 7, and 9
	if (proto !== $ArrayPrototype) { // step 8
		if (!$setProto) {
			throw new $SyntaxError('ArrayCreate: a `proto` argument that is not `Array.prototype` is not supported in an environment that does not support setting the [[Prototype]]');
		}
		$setProto(A, proto);
	}
	if (length !== 0) { // bypasses the need for step 2
		A.length = length;
	}
	/* step 10, the above as a shortcut for the below
    OrdinaryDefineOwnProperty(A, 'length', {
        '[[Configurable]]': false,
        '[[Enumerable]]': false,
        '[[Value]]': length,
        '[[Writable]]': true
    });
    */
	return A;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsInteger":1597942294748}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294750, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $RangeError = GetIntrinsic('%RangeError%');
var $TypeError = GetIntrinsic('%TypeError%');

var assign = require('object.assign');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');

var IsArray = require('./IsArray');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var OrdinaryDefineOwnProperty = require('./OrdinaryDefineOwnProperty');
var OrdinaryGetOwnProperty = require('./OrdinaryGetOwnProperty');
var ToNumber = require('./ToNumber');
var ToString = require('./ToString');
var ToUint32 = require('./ToUint32');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-arraysetlength

// eslint-disable-next-line max-statements, max-lines-per-function
module.exports = function ArraySetLength(A, Desc) {
	if (!IsArray(A)) {
		throw new $TypeError('Assertion failed: A must be an Array');
	}
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
	}
	if (!('[[Value]]' in Desc)) {
		return OrdinaryDefineOwnProperty(A, 'length', Desc);
	}
	var newLenDesc = assign({}, Desc);
	var newLen = ToUint32(Desc['[[Value]]']);
	var numberLen = ToNumber(Desc['[[Value]]']);
	if (newLen !== numberLen) {
		throw new $RangeError('Invalid array length');
	}
	newLenDesc['[[Value]]'] = newLen;
	var oldLenDesc = OrdinaryGetOwnProperty(A, 'length');
	if (!IsDataDescriptor(oldLenDesc)) {
		throw new $TypeError('Assertion failed: an array had a non-data descriptor on `length`');
	}
	var oldLen = oldLenDesc['[[Value]]'];
	if (newLen >= oldLen) {
		return OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
	}
	if (!oldLenDesc['[[Writable]]']) {
		return false;
	}
	var newWritable;
	if (!('[[Writable]]' in newLenDesc) || newLenDesc['[[Writable]]']) {
		newWritable = true;
	} else {
		newWritable = false;
		newLenDesc['[[Writable]]'] = true;
	}
	var succeeded = OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
	if (!succeeded) {
		return false;
	}
	while (newLen < oldLen) {
		oldLen -= 1;
		// eslint-disable-next-line no-param-reassign
		var deleteSucceeded = delete A[ToString(oldLen)];
		if (!deleteSucceeded) {
			newLenDesc['[[Value]]'] = oldLen + 1;
			if (!newWritable) {
				newLenDesc['[[Writable]]'] = false;
				OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
				return false;
			}
		}
	}
	if (!newWritable) {
		return OrdinaryDefineOwnProperty(A, 'length', { '[[Writable]]': false });
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPropertyDescriptor":1597942294599,"./IsArray":1597942294751,"./IsAccessorDescriptor":1597942294752,"./IsDataDescriptor":1597942294753,"./OrdinaryDefineOwnProperty":1597942294754,"./OrdinaryGetOwnProperty":1597942294764,"./ToNumber":1597942294742,"./ToString":1597942294766,"./ToUint32":1597942294767,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294751, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Array = GetIntrinsic('%Array%');

// eslint-disable-next-line global-require
var toStr = !$Array.isArray && require('../helpers/callBound')('Object.prototype.toString');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isarray

module.exports = $Array.isArray || function IsArray(argument) {
	return toStr(argument) === '[object Array]';
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294752, function(require, module, exports) {


var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isaccessordescriptor

module.exports = function IsAccessorDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!has(Desc, '[[Get]]') && !has(Desc, '[[Set]]')) {
		return false;
	}

	return true;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294753, function(require, module, exports) {


var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isdatadescriptor

module.exports = function IsDataDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!has(Desc, '[[Value]]') && !has(Desc, '[[Writable]]')) {
		return false;
	}

	return true;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294754, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');

var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsExtensible = require('./IsExtensible');
var IsPropertyKey = require('./IsPropertyKey');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var SameValue = require('./SameValue');
var Type = require('./Type');
var ValidateAndApplyPropertyDescriptor = require('./ValidateAndApplyPropertyDescriptor');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarydefineownproperty

module.exports = function OrdinaryDefineOwnProperty(O, P, Desc) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: O must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
	}
	if (!$gOPD) {
		// ES3/IE 8 fallback
		if (IsAccessorDescriptor(Desc)) {
			throw new $SyntaxError('This environment does not support accessor property descriptors.');
		}
		var creatingNormalDataProperty = !(P in O)
			&& Desc['[[Writable]]']
			&& Desc['[[Enumerable]]']
			&& Desc['[[Configurable]]']
			&& '[[Value]]' in Desc;
		var settingExistingDataProperty = (P in O)
			&& (!('[[Configurable]]' in Desc) || Desc['[[Configurable]]'])
			&& (!('[[Enumerable]]' in Desc) || Desc['[[Enumerable]]'])
			&& (!('[[Writable]]' in Desc) || Desc['[[Writable]]'])
			&& '[[Value]]' in Desc;
		if (creatingNormalDataProperty || settingExistingDataProperty) {
			O[P] = Desc['[[Value]]']; // eslint-disable-line no-param-reassign
			return SameValue(O[P], Desc['[[Value]]']);
		}
		throw new $SyntaxError('This environment does not support defining non-writable, non-enumerable, or non-configurable properties');
	}
	var desc = $gOPD(O, P);
	var current = desc && ToPropertyDescriptor(desc);
	var extensible = IsExtensible(O);
	return ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/isPropertyDescriptor":1597942294599,"./IsAccessorDescriptor":1597942294752,"./IsDataDescriptor":1597942294753,"./IsExtensible":1597942294755,"./IsPropertyKey":1597942294756,"./ToPropertyDescriptor":1597942294757,"./SameValue":1597942294760,"./Type":1597942294744,"./ValidateAndApplyPropertyDescriptor":1597942294761}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294755, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Object = GetIntrinsic('%Object%');

var isPrimitive = require('../helpers/isPrimitive');

var $preventExtensions = $Object.preventExtensions;
var $isExtensible = $Object.isExtensible;

// https://www.ecma-international.org/ecma-262/6.0/#sec-isextensible-o

module.exports = $preventExtensions
	? function IsExtensible(obj) {
		return !isPrimitive(obj) && $isExtensible(obj);
	}
	: function IsExtensible(obj) {
		return !isPrimitive(obj);
	};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPrimitive":1597942294625}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294756, function(require, module, exports) {


// https://www.ecma-international.org/ecma-262/6.0/#sec-ispropertykey

module.exports = function IsPropertyKey(argument) {
	return typeof argument === 'string' || typeof argument === 'symbol';
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294757, function(require, module, exports) {


var has = require('has');

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Type = require('./Type');
var ToBoolean = require('./ToBoolean');
var IsCallable = require('./IsCallable');

// https://ecma-international.org/ecma-262/5.1/#sec-8.10.5

module.exports = function ToPropertyDescriptor(Obj) {
	if (Type(Obj) !== 'Object') {
		throw new $TypeError('ToPropertyDescriptor requires an object');
	}

	var desc = {};
	if (has(Obj, 'enumerable')) {
		desc['[[Enumerable]]'] = ToBoolean(Obj.enumerable);
	}
	if (has(Obj, 'configurable')) {
		desc['[[Configurable]]'] = ToBoolean(Obj.configurable);
	}
	if (has(Obj, 'value')) {
		desc['[[Value]]'] = Obj.value;
	}
	if (has(Obj, 'writable')) {
		desc['[[Writable]]'] = ToBoolean(Obj.writable);
	}
	if (has(Obj, 'get')) {
		var getter = Obj.get;
		if (typeof getter !== 'undefined' && !IsCallable(getter)) {
			throw new TypeError('getter must be a function');
		}
		desc['[[Get]]'] = getter;
	}
	if (has(Obj, 'set')) {
		var setter = Obj.set;
		if (typeof setter !== 'undefined' && !IsCallable(setter)) {
			throw new $TypeError('setter must be a function');
		}
		desc['[[Set]]'] = setter;
	}

	if ((has(desc, '[[Get]]') || has(desc, '[[Set]]')) && (has(desc, '[[Value]]') || has(desc, '[[Writable]]'))) {
		throw new $TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
	}
	return desc;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294744,"./ToBoolean":1597942294758,"./IsCallable":1597942294759}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294758, function(require, module, exports) {


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.2

module.exports = function ToBoolean(value) { return !!value; };

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294759, function(require, module, exports) {


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.11

module.exports = require('is-callable');

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294760, function(require, module, exports) {


var $isNaN = require('../helpers/isNaN');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.12

module.exports = function SameValue(x, y) {
	if (x === y) { // 0 === -0, but they are not identical.
		if (x === 0) { return 1 / x === 1 / y; }
		return true;
	}
	return $isNaN(x) && $isNaN(y);
};

}, function(modId) { var map = {"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294761, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');
var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');
var isSamePropertyDescriptor = require('../helpers/isSamePropertyDescriptor');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsGenericDescriptor = require('./IsGenericDescriptor');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-validateandapplypropertydescriptor
// https://www.ecma-international.org/ecma-262/8.0/#sec-validateandapplypropertydescriptor

// eslint-disable-next-line max-lines-per-function, max-statements, max-params
module.exports = function ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current) {
	// this uses the ES2017+ logic, since it fixes a number of bugs in the ES2015 logic.
	var oType = Type(O);
	if (oType !== 'Undefined' && oType !== 'Object') {
		throw new $TypeError('Assertion failed: O must be undefined or an Object');
	}
	if (Type(extensible) !== 'Boolean') {
		throw new $TypeError('Assertion failed: extensible must be a Boolean');
	}
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
	}
	if (Type(current) !== 'Undefined' && !isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, current)) {
		throw new $TypeError('Assertion failed: current must be a Property Descriptor, or undefined');
	}
	if (oType !== 'Undefined' && !IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: if O is not undefined, P must be a Property Key');
	}
	if (Type(current) === 'Undefined') {
		if (!extensible) {
			return false;
		}
		if (IsGenericDescriptor(Desc) || IsDataDescriptor(Desc)) {
			if (oType !== 'Undefined') {
				DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					{
						'[[Configurable]]': Desc['[[Configurable]]'],
						'[[Enumerable]]': Desc['[[Enumerable]]'],
						'[[Value]]': Desc['[[Value]]'],
						'[[Writable]]': Desc['[[Writable]]']
					}
				);
			}
		} else {
			if (!IsAccessorDescriptor(Desc)) {
				throw new $TypeError('Assertion failed: Desc is not an accessor descriptor');
			}
			if (oType !== 'Undefined') {
				return DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					Desc
				);
			}
		}
		return true;
	}
	if (IsGenericDescriptor(Desc) && !('[[Configurable]]' in Desc) && !('[[Enumerable]]' in Desc)) {
		return true;
	}
	if (isSamePropertyDescriptor({ SameValue: SameValue }, Desc, current)) {
		return true; // removed by ES2017, but should still be correct
	}
	// "if every field in Desc is absent, return true" can't really match the assertion that it's a Property Descriptor
	if (!current['[[Configurable]]']) {
		if (Desc['[[Configurable]]']) {
			return false;
		}
		if ('[[Enumerable]]' in Desc && !Desc['[[Enumerable]]'] === !!current['[[Enumerable]]']) {
			return false;
		}
	}
	if (IsGenericDescriptor(Desc)) {
		// no further validation is required.
	} else if (IsDataDescriptor(current) !== IsDataDescriptor(Desc)) {
		if (!current['[[Configurable]]']) {
			return false;
		}
		if (IsDataDescriptor(current)) {
			if (oType !== 'Undefined') {
				DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					{
						'[[Configurable]]': current['[[Configurable]]'],
						'[[Enumerable]]': current['[[Enumerable]]'],
						'[[Get]]': undefined
					}
				);
			}
		} else if (oType !== 'Undefined') {
			DefineOwnProperty(
				IsDataDescriptor,
				SameValue,
				FromPropertyDescriptor,
				O,
				P,
				{
					'[[Configurable]]': current['[[Configurable]]'],
					'[[Enumerable]]': current['[[Enumerable]]'],
					'[[Value]]': undefined
				}
			);
		}
	} else if (IsDataDescriptor(current) && IsDataDescriptor(Desc)) {
		if (!current['[[Configurable]]'] && !current['[[Writable]]']) {
			if ('[[Writable]]' in Desc && Desc['[[Writable]]']) {
				return false;
			}
			if ('[[Value]]' in Desc && !SameValue(Desc['[[Value]]'], current['[[Value]]'])) {
				return false;
			}
			return true;
		}
	} else if (IsAccessorDescriptor(current) && IsAccessorDescriptor(Desc)) {
		if (!current['[[Configurable]]']) {
			if ('[[Set]]' in Desc && !SameValue(Desc['[[Set]]'], current['[[Set]]'])) {
				return false;
			}
			if ('[[Get]]' in Desc && !SameValue(Desc['[[Get]]'], current['[[Get]]'])) {
				return false;
			}
			return true;
		}
	} else {
		throw new $TypeError('Assertion failed: current and Desc are not both data, both accessors, or one accessor and one data.');
	}
	if (oType !== 'Undefined') {
		return DefineOwnProperty(
			IsDataDescriptor,
			SameValue,
			FromPropertyDescriptor,
			O,
			P,
			Desc
		);
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/DefineOwnProperty":1597942294647,"../helpers/isPropertyDescriptor":1597942294599,"../helpers/isSamePropertyDescriptor":1597942294648,"./FromPropertyDescriptor":1597942294762,"./IsAccessorDescriptor":1597942294752,"./IsDataDescriptor":1597942294753,"./IsGenericDescriptor":1597942294763,"./IsPropertyKey":1597942294756,"./SameValue":1597942294760,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294762, function(require, module, exports) {


var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-frompropertydescriptor

module.exports = function FromPropertyDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return Desc;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	var obj = {};
	if ('[[Value]]' in Desc) {
		obj.value = Desc['[[Value]]'];
	}
	if ('[[Writable]]' in Desc) {
		obj.writable = Desc['[[Writable]]'];
	}
	if ('[[Get]]' in Desc) {
		obj.get = Desc['[[Get]]'];
	}
	if ('[[Set]]' in Desc) {
		obj.set = Desc['[[Set]]'];
	}
	if ('[[Enumerable]]' in Desc) {
		obj.enumerable = Desc['[[Enumerable]]'];
	}
	if ('[[Configurable]]' in Desc) {
		obj.configurable = Desc['[[Configurable]]'];
	}
	return obj;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294763, function(require, module, exports) {


var assertRecord = require('../helpers/assertRecord');

var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isgenericdescriptor

module.exports = function IsGenericDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!IsAccessorDescriptor(Desc) && !IsDataDescriptor(Desc)) {
		return true;
	}

	return false;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./IsAccessorDescriptor":1597942294752,"./IsDataDescriptor":1597942294753,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294764, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

var has = require('has');

var IsArray = require('./IsArray');
var IsPropertyKey = require('./IsPropertyKey');
var IsRegExp = require('./IsRegExp');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarygetownproperty

module.exports = function OrdinaryGetOwnProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: O must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	if (!has(O, P)) {
		return void 0;
	}
	if (!$gOPD) {
		// ES3 / IE 8 fallback
		var arrayLength = IsArray(O) && P === 'length';
		var regexLastIndex = IsRegExp(O) && P === 'lastIndex';
		return {
			'[[Configurable]]': !(arrayLength || regexLastIndex),
			'[[Enumerable]]': $isEnumerable(O, P),
			'[[Value]]': O[P],
			'[[Writable]]': true
		};
	}
	return ToPropertyDescriptor($gOPD(O, P));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/callBound":1597942294577,"./IsArray":1597942294751,"./IsPropertyKey":1597942294756,"./IsRegExp":1597942294765,"./ToPropertyDescriptor":1597942294757,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294765, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $match = GetIntrinsic('%Symbol.match%', true);

var hasRegExpMatcher = require('is-regex');

var ToBoolean = require('./ToBoolean');

// https://ecma-international.org/ecma-262/6.0/#sec-isregexp

module.exports = function IsRegExp(argument) {
	if (!argument || typeof argument !== 'object') {
		return false;
	}
	if ($match) {
		var isRegExp = argument[$match];
		if (typeof isRegExp !== 'undefined') {
			return ToBoolean(isRegExp);
		}
	}
	return hasRegExpMatcher(argument);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToBoolean":1597942294758}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294766, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $String = GetIntrinsic('%String%');
var $TypeError = GetIntrinsic('%TypeError%');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tostring

module.exports = function ToString(argument) {
	if (typeof argument === 'symbol') {
		throw new $TypeError('Cannot convert a Symbol value to a string');
	}
	return $String(argument);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294767, function(require, module, exports) {


var ToNumber = require('./ToNumber');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.6

module.exports = function ToUint32(x) {
	return ToNumber(x) >>> 0;
};

}, function(modId) { var map = {"./ToNumber":1597942294742}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294768, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Array = GetIntrinsic('%Array%');
var $species = GetIntrinsic('%Symbol.species%', true);
var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var IsArray = require('./IsArray');
var IsConstructor = require('./IsConstructor');
var IsInteger = require('./IsInteger');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-arrayspeciescreate

module.exports = function ArraySpeciesCreate(originalArray, length) {
	if (!IsInteger(length) || length < 0) {
		throw new $TypeError('Assertion failed: length must be an integer >= 0');
	}
	var len = length === 0 ? 0 : length;
	var C;
	var isArray = IsArray(originalArray);
	if (isArray) {
		C = Get(originalArray, 'constructor');
		// TODO: figure out how to make a cross-realm normal Array, a same-realm Array
		// if (IsConstructor(C)) {
		// 	if C is another realm's Array, C = undefined
		// 	Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(Array))) === null ?
		// }
		if ($species && Type(C) === 'Object') {
			C = Get(C, $species);
			if (C === null) {
				C = void 0;
			}
		}
	}
	if (typeof C === 'undefined') {
		return $Array(len);
	}
	if (!IsConstructor(C)) {
		throw new $TypeError('C must be a constructor');
	}
	return new C(len); // Construct(C, len);
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294769,"./IsArray":1597942294751,"./IsConstructor":1597942294770,"./IsInteger":1597942294748,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294769, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var inspect = require('object-inspect');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

/**
 * 7.3.1 Get (O, P) - https://ecma-international.org/ecma-262/6.0/#sec-get-o-p
 * 1. Assert: Type(O) is Object.
 * 2. Assert: IsPropertyKey(P) is true.
 * 3. Return O.[[Get]](P, O).
 */

module.exports = function Get(O, P) {
	// 7.3.1.1
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	// 7.3.1.2
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true, got ' + inspect(P));
	}
	// 7.3.1.3
	return O[P];
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294756,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294770, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic.js');

var $construct = GetIntrinsic('%Reflect.construct%', true);

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');
try {
	DefinePropertyOrThrow({}, '', { '[[Get]]': function () {} });
} catch (e) {
	// Accessor properties aren't supported
	DefinePropertyOrThrow = null;
}

// https://www.ecma-international.org/ecma-262/6.0/#sec-isconstructor

if (DefinePropertyOrThrow && $construct) {
	var isConstructorMarker = {};
	var badArrayLike = {};
	DefinePropertyOrThrow(badArrayLike, 'length', {
		'[[Get]]': function () {
			throw isConstructorMarker;
		},
		'[[Enumerable]]': true
	});

	module.exports = function IsConstructor(argument) {
		try {
			// `Reflect.construct` invokes `IsConstructor(target)` before `Get(args, 'length')`:
			$construct(argument, badArrayLike);
		} catch (err) {
			return err === isConstructorMarker;
		}
	};
} else {
	module.exports = function IsConstructor(argument) {
		// unfortunately there's no way to truly check this without try/catch `new argument` in old environments
		return typeof argument === 'function' && !!argument.prototype;
	};
}

}, function(modId) { var map = {"../GetIntrinsic.js":1597942294567,"./DefinePropertyOrThrow":1597942294771}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294771, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');
var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-definepropertyorthrow

module.exports = function DefinePropertyOrThrow(O, P, desc) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	var Desc = isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, desc) ? desc : ToPropertyDescriptor(desc);
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc is not a valid Property Descriptor');
	}

	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		Desc
	);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPropertyDescriptor":1597942294599,"../helpers/DefineOwnProperty":1597942294647,"./FromPropertyDescriptor":1597942294762,"./IsAccessorDescriptor":1597942294752,"./IsDataDescriptor":1597942294753,"./IsPropertyKey":1597942294756,"./SameValue":1597942294760,"./ToPropertyDescriptor":1597942294757,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294772, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');
var callBound = require('../helpers/callBound');

var $apply = GetIntrinsic('%Reflect.apply%', true) || callBound('%Function.prototype.apply%');

// https://www.ecma-international.org/ecma-262/6.0/#sec-call

module.exports = function Call(F, V) {
	var args = arguments.length > 2 ? arguments[2] : [];
	return $apply(F, V, args);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294773, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var SameValue = require('./SameValue');
var ToNumber = require('./ToNumber');
var ToString = require('./ToString');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring

module.exports = function CanonicalNumericIndexString(argument) {
	if (Type(argument) !== 'String') {
		throw new $TypeError('Assertion failed: `argument` must be a String');
	}
	if (argument === '-0') { return -0; }
	var n = ToNumber(argument);
	if (SameValue(ToString(n), argument)) { return n; }
	return void 0;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./SameValue":1597942294760,"./ToNumber":1597942294742,"./ToString":1597942294766,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294774, function(require, module, exports) {


var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var IsDataDescriptor = require('./IsDataDescriptor');
var IsGenericDescriptor = require('./IsGenericDescriptor');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-completepropertydescriptor

module.exports = function CompletePropertyDescriptor(Desc) {
	/* eslint no-param-reassign: 0 */
	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (IsGenericDescriptor(Desc) || IsDataDescriptor(Desc)) {
		if (!has(Desc, '[[Value]]')) {
			Desc['[[Value]]'] = void 0;
		}
		if (!has(Desc, '[[Writable]]')) {
			Desc['[[Writable]]'] = false;
		}
	} else {
		if (!has(Desc, '[[Get]]')) {
			Desc['[[Get]]'] = void 0;
		}
		if (!has(Desc, '[[Set]]')) {
			Desc['[[Set]]'] = void 0;
		}
	}
	if (!has(Desc, '[[Enumerable]]')) {
		Desc['[[Enumerable]]'] = false;
	}
	if (!has(Desc, '[[Configurable]]')) {
		Desc['[[Configurable]]'] = false;
	}
	return Desc;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./IsDataDescriptor":1597942294753,"./IsGenericDescriptor":1597942294763,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294775, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var OrdinaryGetOwnProperty = require('./OrdinaryGetOwnProperty');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsExtensible = require('./IsExtensible');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-createdataproperty

module.exports = function CreateDataProperty(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}
	var oldDesc = OrdinaryGetOwnProperty(O, P);
	var extensible = !oldDesc || IsExtensible(O);
	var immutable = oldDesc && (!oldDesc['[[Writable]]'] || !oldDesc['[[Configurable]]']);
	if (immutable || !extensible) {
		return false;
	}
	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		{
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Value]]': V,
			'[[Writable]]': true
		}
	);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/DefineOwnProperty":1597942294647,"./FromPropertyDescriptor":1597942294762,"./OrdinaryGetOwnProperty":1597942294764,"./IsDataDescriptor":1597942294753,"./IsExtensible":1597942294755,"./IsPropertyKey":1597942294756,"./SameValue":1597942294760,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294776, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var CreateDataProperty = require('./CreateDataProperty');
var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// // https://ecma-international.org/ecma-262/6.0/#sec-createdatapropertyorthrow

module.exports = function CreateDataPropertyOrThrow(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}
	var success = CreateDataProperty(O, P, V);
	if (!success) {
		throw new $TypeError('unable to create data property');
	}
	return success;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./CreateDataProperty":1597942294775,"./IsPropertyKey":1597942294756,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294777, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $replace = callBound('String.prototype.replace');

var RequireObjectCoercible = require('./RequireObjectCoercible');
var ToString = require('./ToString');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-createhtml

module.exports = function CreateHTML(string, tag, attribute, value) {
	if (Type(tag) !== 'String' || Type(attribute) !== 'String') {
		throw new $TypeError('Assertion failed: `tag` and `attribute` must be strings');
	}
	var str = RequireObjectCoercible(string);
	var S = ToString(str);
	var p1 = '<' + tag;
	if (attribute !== '') {
		var V = ToString(value);
		var escapedV = $replace(V, /\x22/g, '&quot;');
		p1 += '\x20' + attribute + '\x3D\x22' + escapedV + '\x22';
	}
	return p1 + '>' + S + '</' + tag + '>';
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./RequireObjectCoercible":1597942294778,"./ToString":1597942294766,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294778, function(require, module, exports) {


module.exports = require('../5/CheckObjectCoercible');

}, function(modId) { var map = {"../5/CheckObjectCoercible":1597942294580}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294779, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-createiterresultobject

module.exports = function CreateIterResultObject(value, done) {
	if (Type(done) !== 'Boolean') {
		throw new $TypeError('Assertion failed: Type(done) is not Boolean');
	}
	return {
		value: value,
		done: done
	};
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294780, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var callBound = require('../helpers/callBound');

var $TypeError = GetIntrinsic('%TypeError%');
var $indexOf = callBound('Array.prototype.indexOf', true) || callBound('String.prototype.indexOf');
var $push = callBound('Array.prototype.push');

var Get = require('./Get');
var IsArray = require('./IsArray');
var ToLength = require('./ToLength');
var ToString = require('./ToString');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-createlistfromarraylike
module.exports = function CreateListFromArrayLike(obj) {
	var elementTypes = arguments.length > 1
		? arguments[1]
		: ['Undefined', 'Null', 'Boolean', 'String', 'Symbol', 'Number', 'Object'];

	if (Type(obj) !== 'Object') {
		throw new $TypeError('Assertion failed: `obj` must be an Object');
	}
	if (!IsArray(elementTypes)) {
		throw new $TypeError('Assertion failed: `elementTypes`, if provided, must be an array');
	}
	var len = ToLength(Get(obj, 'length'));
	var list = [];
	var index = 0;
	while (index < len) {
		var indexName = ToString(index);
		var next = Get(obj, indexName);
		var nextType = Type(next);
		if ($indexOf(elementTypes, nextType) < 0) {
			throw new $TypeError('item type ' + nextType + ' is not a valid elementType');
		}
		$push(list, next);
		index += 1;
	}
	return list;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Get":1597942294769,"./IsArray":1597942294751,"./ToLength":1597942294781,"./ToString":1597942294766,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294781, function(require, module, exports) {


var MAX_SAFE_INTEGER = require('../helpers/maxSafeInteger');

var ToInteger = require('./ToInteger');

module.exports = function ToLength(argument) {
	var len = ToInteger(argument);
	if (len <= 0) { return 0; } // includes converting -0 to +0
	if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
	return len;
};

}, function(modId) { var map = {"../helpers/maxSafeInteger":1597942294632,"./ToInteger":1597942294782}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294782, function(require, module, exports) {


var ES5ToInteger = require('../5/ToInteger');

var ToNumber = require('./ToNumber');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tointeger

module.exports = function ToInteger(value) {
	var number = ToNumber(value);
	return ES5ToInteger(number);
};

}, function(modId) { var map = {"../5/ToInteger":1597942294602,"./ToNumber":1597942294742}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294783, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-createmethodproperty

module.exports = function CreateMethodProperty(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	var newDesc = {
		'[[Configurable]]': true,
		'[[Enumerable]]': false,
		'[[Value]]': V,
		'[[Writable]]': true
	};
	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		newDesc
	);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/DefineOwnProperty":1597942294647,"./FromPropertyDescriptor":1597942294762,"./IsDataDescriptor":1597942294753,"./IsPropertyKey":1597942294756,"./SameValue":1597942294760,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294784, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $EvalError = GetIntrinsic('%EvalError%');

var DayWithinYear = require('./DayWithinYear');
var InLeapYear = require('./InLeapYear');
var MonthFromTime = require('./MonthFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.5

module.exports = function DateFromTime(t) {
	var m = MonthFromTime(t);
	var d = DayWithinYear(t);
	if (m === 0) {
		return d + 1;
	}
	if (m === 1) {
		return d - 30;
	}
	var leap = InLeapYear(t);
	if (m === 2) {
		return d - 58 - leap;
	}
	if (m === 3) {
		return d - 89 - leap;
	}
	if (m === 4) {
		return d - 119 - leap;
	}
	if (m === 5) {
		return d - 150 - leap;
	}
	if (m === 6) {
		return d - 180 - leap;
	}
	if (m === 7) {
		return d - 211 - leap;
	}
	if (m === 8) {
		return d - 242 - leap;
	}
	if (m === 9) {
		return d - 272 - leap;
	}
	if (m === 10) {
		return d - 303 - leap;
	}
	if (m === 11) {
		return d - 333 - leap;
	}
	throw new $EvalError('Assertion failed: MonthFromTime returned an impossible value: ' + m);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./DayWithinYear":1597942294785,"./InLeapYear":1597942294789,"./MonthFromTime":1597942294791}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294785, function(require, module, exports) {


var Day = require('./Day');
var DayFromYear = require('./DayFromYear');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.4

module.exports = function DayWithinYear(t) {
	return Day(t) - DayFromYear(YearFromTime(t));
};

}, function(modId) { var map = {"./Day":1597942294786,"./DayFromYear":1597942294787,"./YearFromTime":1597942294788}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294786, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.2

module.exports = function Day(t) {
	return $floor(t / msPerDay);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294787, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function DayFromYear(y) {
	return (365 * (y - 1970)) + $floor((y - 1969) / 4) - $floor((y - 1901) / 100) + $floor((y - 1601) / 400);
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294788, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Date = GetIntrinsic('%Date%');

var callBound = require('../helpers/callBound');

var $getUTCFullYear = callBound('Date.prototype.getUTCFullYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function YearFromTime(t) {
	// largest y such that this.TimeFromYear(y) <= t
	return $getUTCFullYear(new $Date(t));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294789, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $EvalError = GetIntrinsic('%EvalError%');

var DaysInYear = require('./DaysInYear');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function InLeapYear(t) {
	var days = DaysInYear(YearFromTime(t));
	if (days === 365) {
		return 0;
	}
	if (days === 366) {
		return 1;
	}
	throw new $EvalError('Assertion failed: there are not 365 or 366 days in a year, got: ' + days);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./DaysInYear":1597942294790,"./YearFromTime":1597942294788}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294790, function(require, module, exports) {


var mod = require('../helpers/mod');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function DaysInYear(y) {
	if (mod(y, 4) !== 0) {
		return 365;
	}
	if (mod(y, 100) !== 0) {
		return 366;
	}
	if (mod(y, 400) !== 0) {
		return 365;
	}
	return 366;
};

}, function(modId) { var map = {"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294791, function(require, module, exports) {


var DayWithinYear = require('./DayWithinYear');
var InLeapYear = require('./InLeapYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.4

module.exports = function MonthFromTime(t) {
	var day = DayWithinYear(t);
	if (0 <= day && day < 31) {
		return 0;
	}
	var leap = InLeapYear(t);
	if (31 <= day && day < (59 + leap)) {
		return 1;
	}
	if ((59 + leap) <= day && day < (90 + leap)) {
		return 2;
	}
	if ((90 + leap) <= day && day < (120 + leap)) {
		return 3;
	}
	if ((120 + leap) <= day && day < (151 + leap)) {
		return 4;
	}
	if ((151 + leap) <= day && day < (181 + leap)) {
		return 5;
	}
	if ((181 + leap) <= day && day < (212 + leap)) {
		return 6;
	}
	if ((212 + leap) <= day && day < (243 + leap)) {
		return 7;
	}
	if ((243 + leap) <= day && day < (273 + leap)) {
		return 8;
	}
	if ((273 + leap) <= day && day < (304 + leap)) {
		return 9;
	}
	if ((304 + leap) <= day && day < (334 + leap)) {
		return 10;
	}
	if ((334 + leap) <= day && day < (365 + leap)) {
		return 11;
	}
};

}, function(modId) { var map = {"./DayWithinYear":1597942294785,"./InLeapYear":1597942294789}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294792, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-deletepropertyorthrow

module.exports = function DeletePropertyOrThrow(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	// eslint-disable-next-line no-param-reassign
	var success = delete O[P];
	if (!success) {
		throw new $TypeError('Attempt to delete property failed.');
	}
	return success;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294756,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294793, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var keys = require('object-keys');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-enumerableownnames

module.exports = function EnumerableOwnNames(O) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	return keys(O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294794, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var getIteratorMethod = require('../helpers/getIteratorMethod');
var AdvanceStringIndex = require('./AdvanceStringIndex');
var Call = require('./Call');
var GetMethod = require('./GetMethod');
var IsArray = require('./IsArray');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-getiterator

module.exports = function GetIterator(obj, method) {
	var actualMethod = method;
	if (arguments.length < 2) {
		actualMethod = getIteratorMethod(
			{
				AdvanceStringIndex: AdvanceStringIndex,
				GetMethod: GetMethod,
				IsArray: IsArray,
				Type: Type
			},
			obj
		);
	}
	var iterator = Call(actualMethod, obj);
	if (Type(iterator) !== 'Object') {
		throw new $TypeError('iterator must return an object');
	}

	return iterator;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getIteratorMethod":1597942294683,"./AdvanceStringIndex":1597942294747,"./Call":1597942294772,"./GetMethod":1597942294795,"./IsArray":1597942294751,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294795, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var GetV = require('./GetV');
var IsCallable = require('./IsCallable');
var IsPropertyKey = require('./IsPropertyKey');

/**
 * 7.3.9 - https://ecma-international.org/ecma-262/6.0/#sec-getmethod
 * 1. Assert: IsPropertyKey(P) is true.
 * 2. Let func be GetV(O, P).
 * 3. ReturnIfAbrupt(func).
 * 4. If func is either undefined or null, return undefined.
 * 5. If IsCallable(func) is false, throw a TypeError exception.
 * 6. Return func.
 */

module.exports = function GetMethod(O, P) {
	// 7.3.9.1
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	// 7.3.9.2
	var func = GetV(O, P);

	// 7.3.9.4
	if (func == null) {
		return void 0;
	}

	// 7.3.9.5
	if (!IsCallable(func)) {
		throw new $TypeError(P + 'is not a function');
	}

	// 7.3.9.6
	return func;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./GetV":1597942294796,"./IsCallable":1597942294759,"./IsPropertyKey":1597942294756}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294796, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var ToObject = require('./ToObject');

/**
 * 7.3.2 GetV (V, P)
 * 1. Assert: IsPropertyKey(P) is true.
 * 2. Let O be ToObject(V).
 * 3. ReturnIfAbrupt(O).
 * 4. Return O.[[Get]](P, V).
 */

module.exports = function GetV(V, P) {
	// 7.3.2.1
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	// 7.3.2.2-3
	var O = ToObject(V);

	// 7.3.2.4
	return O[P];
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294756,"./ToObject":1597942294797}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294797, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Object = GetIntrinsic('%Object%');

var RequireObjectCoercible = require('./RequireObjectCoercible');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toobject

module.exports = function ToObject(value) {
	RequireObjectCoercible(value);
	return $Object(value);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./RequireObjectCoercible":1597942294778}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294798, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var hasSymbols = require('has-symbols')();

var $TypeError = GetIntrinsic('%TypeError%');

var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%');
var $gOPS = hasSymbols && GetIntrinsic('%Object.getOwnPropertySymbols%');
var keys = require('object-keys');

var esType = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-getownpropertykeys

module.exports = function GetOwnPropertyKeys(O, Type) {
	if (esType(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (Type === 'Symbol') {
		return $gOPS ? $gOPS(O) : [];
	}
	if (Type === 'String') {
		if (!$gOPN) {
			return keys(O);
		}
		return $gOPN(O);
	}
	throw new $TypeError('Assertion failed: `Type` must be `"String"` or `"Symbol"`');
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294799, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Function = GetIntrinsic('%Function%');
var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var IsConstructor = require('./IsConstructor');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-getprototypefromconstructor

module.exports = function GetPrototypeFromConstructor(constructor, intrinsicDefaultProto) {
	var intrinsic = GetIntrinsic(intrinsicDefaultProto); // throws if not a valid intrinsic
	if (!IsConstructor(constructor)) {
		throw new $TypeError('Assertion failed: `constructor` must be a constructor');
	}
	var proto = Get(constructor, 'prototype');
	if (Type(proto) !== 'Object') {
		if (!(constructor instanceof $Function)) {
			// ignore other realms, for now
			throw new $TypeError('cross-realm constructors not currently supported');
		}
		proto = intrinsic;
	}
	return proto;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294769,"./IsConstructor":1597942294770,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294800, function(require, module, exports) {



var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $parseInt = GetIntrinsic('%parseInt%');

var inspect = require('object-inspect');

var regexTester = require('../helpers/regexTester');
var callBound = require('../helpers/callBound');
var every = require('../helpers/every');

var isDigit = regexTester(/^[0-9]$/);

var $charAt = callBound('String.prototype.charAt');
var $strSlice = callBound('String.prototype.slice');

var IsArray = require('./IsArray');
var IsInteger = require('./IsInteger');
var Type = require('./Type');

var canDistinguishSparseFromUndefined = 0 in [undefined]; // IE 6 - 8 have a bug where this returns false

var isStringOrHole = function (capture, index, arr) {
	return Type(capture) === 'String' || (canDistinguishSparseFromUndefined ? !(index in arr) : Type(capture) === 'Undefined');
};

// https://www.ecma-international.org/ecma-262/6.0/#sec-getsubstitution

// eslint-disable-next-line max-statements, max-params, max-lines-per-function
module.exports = function GetSubstitution(matched, str, position, captures, replacement) {
	if (Type(matched) !== 'String') {
		throw new $TypeError('Assertion failed: `matched` must be a String');
	}
	var matchLength = matched.length;

	if (Type(str) !== 'String') {
		throw new $TypeError('Assertion failed: `str` must be a String');
	}
	var stringLength = str.length;

	if (!IsInteger(position) || position < 0 || position > stringLength) {
		throw new $TypeError('Assertion failed: `position` must be a nonnegative integer, and less than or equal to the length of `string`, got ' + inspect(position));
	}

	if (!IsArray(captures) || !every(captures, isStringOrHole)) {
		throw new $TypeError('Assertion failed: `captures` must be a List of Strings, got ' + inspect(captures));
	}

	if (Type(replacement) !== 'String') {
		throw new $TypeError('Assertion failed: `replacement` must be a String');
	}

	var tailPos = position + matchLength;
	var m = captures.length;

	var result = '';
	for (var i = 0; i < replacement.length; i += 1) {
		// if this is a $, and it's not the end of the replacement
		var current = $charAt(replacement, i);
		var isLast = (i + 1) >= replacement.length;
		var nextIsLast = (i + 2) >= replacement.length;
		if (current === '$' && !isLast) {
			var next = $charAt(replacement, i + 1);
			if (next === '$') {
				result += '$';
				i += 1;
			} else if (next === '&') {
				result += matched;
				i += 1;
			} else if (next === '`') {
				result += position === 0 ? '' : $strSlice(str, 0, position - 1);
				i += 1;
			} else if (next === "'") {
				result += tailPos >= stringLength ? '' : $strSlice(str, tailPos);
				i += 1;
			} else {
				var nextNext = nextIsLast ? null : $charAt(replacement, i + 2);
				if (isDigit(next) && next !== '0' && (nextIsLast || !isDigit(nextNext))) {
					// $1 through $9, and not followed by a digit
					var n = $parseInt(next, 10);
					// if (n > m, impl-defined)
					result += (n <= m && Type(captures[n - 1]) === 'Undefined') ? '' : captures[n - 1];
					i += 1;
				} else if (isDigit(next) && (nextIsLast || isDigit(nextNext))) {
					// $00 through $99
					var nn = next + nextNext;
					var nnI = $parseInt(nn, 10) - 1;
					// if nn === '00' or nn > m, impl-defined
					result += (nn <= m && Type(captures[nnI]) === 'Undefined') ? '' : captures[nnI];
					i += 2;
				} else {
					result += '$';
				}
			}
		} else {
			// the final $, or else not a $
			result += $charAt(replacement, i);
		}
	}
	return result;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/regexTester":1597942294624,"../helpers/callBound":1597942294577,"../helpers/every":1597942294649,"./IsArray":1597942294751,"./IsInteger":1597942294748,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294801, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var has = require('has');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-hasownproperty

module.exports = function HasOwnProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	return has(O, P);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294756,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294802, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-hasproperty

module.exports = function HasProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	return P in O;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294756,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294803, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerHour = timeConstants.msPerHour;
var HoursPerDay = timeConstants.HoursPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function HourFromTime(t) {
	return mod($floor(t / msPerHour), HoursPerDay);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294804, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $hasInstance = GetIntrinsic('Symbol.hasInstance', true);

var Call = require('./Call');
var GetMethod = require('./GetMethod');
var IsCallable = require('./IsCallable');
var OrdinaryHasInstance = require('./OrdinaryHasInstance');
var ToBoolean = require('./ToBoolean');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-instanceofoperator

module.exports = function InstanceofOperator(O, C) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	var instOfHandler = $hasInstance ? GetMethod(C, $hasInstance) : void 0;
	if (typeof instOfHandler !== 'undefined') {
		return ToBoolean(Call(instOfHandler, C, [O]));
	}
	if (!IsCallable(C)) {
		throw new $TypeError('`C` is not Callable');
	}
	return OrdinaryHasInstance(C, O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Call":1597942294772,"./GetMethod":1597942294795,"./IsCallable":1597942294759,"./OrdinaryHasInstance":1597942294805,"./ToBoolean":1597942294758,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294805, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var IsCallable = require('./IsCallable');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinaryhasinstance

module.exports = function OrdinaryHasInstance(C, O) {
	if (IsCallable(C) === false) {
		return false;
	}
	if (Type(O) !== 'Object') {
		return false;
	}
	var P = Get(C, 'prototype');
	if (Type(P) !== 'Object') {
		throw new $TypeError('OrdinaryHasInstance called on an object with an invalid prototype property.');
	}
	return O instanceof C;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294769,"./IsCallable":1597942294759,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294806, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $arraySlice = require('../helpers/callBound')('Array.prototype.slice');

var Call = require('./Call');
var GetV = require('./GetV');
var IsPropertyKey = require('./IsPropertyKey');

// https://ecma-international.org/ecma-262/6.0/#sec-invoke

module.exports = function Invoke(O, P) {
	if (!IsPropertyKey(P)) {
		throw new $TypeError('P must be a Property Key');
	}
	var argumentsList = $arraySlice(arguments, 2);
	var func = GetV(O, P);
	return Call(func, O, argumentsList);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Call":1597942294772,"./GetV":1597942294796,"./IsPropertyKey":1597942294756}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294807, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $isConcatSpreadable = GetIntrinsic('%Symbol.isConcatSpreadable%', true);

var Get = require('./Get');
var IsArray = require('./IsArray');
var ToBoolean = require('./ToBoolean');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable

module.exports = function IsConcatSpreadable(O) {
	if (Type(O) !== 'Object') {
		return false;
	}
	if ($isConcatSpreadable) {
		var spreadable = Get(O, $isConcatSpreadable);
		if (typeof spreadable !== 'undefined') {
			return ToBoolean(spreadable);
		}
	}
	return IsArray(O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294769,"./IsArray":1597942294751,"./ToBoolean":1597942294758,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294808, function(require, module, exports) {


var callBound = require('../helpers/callBound');

var $PromiseThen = callBound('Promise.prototype.then', true);

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ispromise

module.exports = function IsPromise(x) {
	if (Type(x) !== 'Object') {
		return false;
	}
	if (!$PromiseThen) { // Promises are not supported
		return false;
	}
	try {
		$PromiseThen(x); // throws if not a promise
	} catch (e) {
		return false;
	}
	return true;
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294809, function(require, module, exports) {


var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');

var Type = require('./Type');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');

// https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type

module.exports = function IsPropertyDescriptor(Desc) {
	return isPropertyDescriptor({
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor,
		Type: Type
	}, Desc);
};

}, function(modId) { var map = {"../helpers/isPropertyDescriptor":1597942294599,"./Type":1597942294744,"./IsDataDescriptor":1597942294753,"./IsAccessorDescriptor":1597942294752}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294810, function(require, module, exports) {


var callBound = require('../helpers/callBound');
var $arrayPush = callBound('Array.prototype.push');

var getIteratorMethod = require('../helpers/getIteratorMethod');
var AdvanceStringIndex = require('./AdvanceStringIndex');
var GetIterator = require('./GetIterator');
var GetMethod = require('./GetMethod');
var IsArray = require('./IsArray');
var IteratorStep = require('./IteratorStep');
var IteratorValue = require('./IteratorValue');
var ToObject = require('./ToObject');
var Type = require('./Type');
var ES = {
	AdvanceStringIndex: AdvanceStringIndex,
	GetMethod: GetMethod,
	IsArray: IsArray,
	Type: Type
};

// https://www.ecma-international.org/ecma-262/7.0/#sec-iterabletoarraylike
/**
 * 1. Let usingIterator be ? GetMethod(items, @@iterator).
 * 2. If usingIterator is not undefined, then
 *    1. Let iterator be ? GetIterator(items, usingIterator).
 *    2. Let values be a new empty List.
 *    3. Let next be true.
 *    4. Repeat, while next is not false
 *       1. Let next be ? IteratorStep(iterator).
 *       2. If next is not false, then
 *          1. Let nextValue be ? IteratorValue(next).
 *          2. Append nextValue to the end of the List values.
 *    5. Return CreateArrayFromList(values).
 * 3. NOTE: items is not an Iterable so assume it is already an array-like object.
 * 4. Return ! ToObject(items).
 */

module.exports = function IterableToArrayLike(items) {
	var usingIterator = getIteratorMethod(ES, items);
	if (typeof usingIterator !== 'undefined') {
		var iterator = GetIterator(items, usingIterator);
		var values = [];
		var next = true;
		while (next) {
			next = IteratorStep(iterator);
			if (next) {
				var nextValue = IteratorValue(next);
				$arrayPush(values, nextValue);
			}
		}
		return values;
	}

	return ToObject(items);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"../helpers/getIteratorMethod":1597942294683,"./AdvanceStringIndex":1597942294747,"./GetIterator":1597942294794,"./GetMethod":1597942294795,"./IsArray":1597942294751,"./IteratorStep":1597942294811,"./IteratorValue":1597942294814,"./ToObject":1597942294797,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294811, function(require, module, exports) {


var IteratorComplete = require('./IteratorComplete');
var IteratorNext = require('./IteratorNext');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorstep

module.exports = function IteratorStep(iterator) {
	var result = IteratorNext(iterator);
	var done = IteratorComplete(result);
	return done === true ? false : result;
};


}, function(modId) { var map = {"./IteratorComplete":1597942294812,"./IteratorNext":1597942294813}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294812, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var ToBoolean = require('./ToBoolean');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorcomplete

module.exports = function IteratorComplete(iterResult) {
	if (Type(iterResult) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(iterResult) is not Object');
	}
	return ToBoolean(Get(iterResult, 'done'));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294769,"./ToBoolean":1597942294758,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294813, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Invoke = require('./Invoke');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratornext

module.exports = function IteratorNext(iterator, value) {
	var result = Invoke(iterator, 'next', arguments.length < 2 ? [] : [value]);
	if (Type(result) !== 'Object') {
		throw new $TypeError('iterator next must return an object');
	}
	return result;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Invoke":1597942294806,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294814, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorvalue

module.exports = function IteratorValue(iterResult) {
	if (Type(iterResult) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(iterResult) is not Object');
	}
	return Get(iterResult, 'value');
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294769,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294815, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Call = require('./Call');
var GetMethod = require('./GetMethod');
var IsCallable = require('./IsCallable');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorclose

module.exports = function IteratorClose(iterator, completion) {
	if (Type(iterator) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(iterator) is not Object');
	}
	if (!IsCallable(completion)) {
		throw new $TypeError('Assertion failed: completion is not a thunk for a Completion Record');
	}
	var completionThunk = completion;

	var iteratorReturn = GetMethod(iterator, 'return');

	if (typeof iteratorReturn === 'undefined') {
		return completionThunk();
	}

	var completionRecord;
	try {
		var innerResult = Call(iteratorReturn, iterator, []);
	} catch (e) {
		// if we hit here, then "e" is the innerResult completion that needs re-throwing

		// if the completion is of type "throw", this will throw.
		completionThunk();
		completionThunk = null; // ensure it's not called twice.

		// if not, then return the innerResult completion
		throw e;
	}
	completionRecord = completionThunk(); // if innerResult worked, then throw if the completion does
	completionThunk = null; // ensure it's not called twice.

	if (Type(innerResult) !== 'Object') {
		throw new $TypeError('iterator .return must return an object');
	}

	return completionRecord;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Call":1597942294772,"./GetMethod":1597942294795,"./IsCallable":1597942294759,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294816, function(require, module, exports) {


var $isFinite = require('../helpers/isFinite');
var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.13

module.exports = function MakeDate(day, time) {
	if (!$isFinite(day) || !$isFinite(time)) {
		return NaN;
	}
	return (day * msPerDay) + time;
};

}, function(modId) { var map = {"../helpers/isFinite":1597942294575,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294817, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');
var $DateUTC = GetIntrinsic('%Date.UTC%');

var mod = require('../helpers/mod');
var $isFinite = require('../helpers/isFinite');

var DateFromTime = require('./DateFromTime');
var Day = require('./Day');
var MonthFromTime = require('./MonthFromTime');
var ToInteger = require('./ToInteger');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.12

module.exports = function MakeDay(year, month, date) {
	if (!$isFinite(year) || !$isFinite(month) || !$isFinite(date)) {
		return NaN;
	}
	var y = ToInteger(year);
	var m = ToInteger(month);
	var dt = ToInteger(date);
	var ym = y + $floor(m / 12);
	var mn = mod(m, 12);
	var t = $DateUTC(ym, mn, 1);
	if (YearFromTime(t) !== ym || MonthFromTime(t) !== mn || DateFromTime(t) !== 1) {
		return NaN;
	}
	return Day(t) + dt - 1;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/isFinite":1597942294575,"./DateFromTime":1597942294784,"./Day":1597942294786,"./MonthFromTime":1597942294791,"./ToInteger":1597942294782,"./YearFromTime":1597942294788}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294818, function(require, module, exports) {


var $isFinite = require('../helpers/isFinite');
var timeConstants = require('../helpers/timeConstants');
var msPerSecond = timeConstants.msPerSecond;
var msPerMinute = timeConstants.msPerMinute;
var msPerHour = timeConstants.msPerHour;

var ToInteger = require('./ToInteger');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.11

module.exports = function MakeTime(hour, min, sec, ms) {
	if (!$isFinite(hour) || !$isFinite(min) || !$isFinite(sec) || !$isFinite(ms)) {
		return NaN;
	}
	var h = ToInteger(hour);
	var m = ToInteger(min);
	var s = ToInteger(sec);
	var milli = ToInteger(ms);
	var t = (h * msPerHour) + (m * msPerMinute) + (s * msPerSecond) + milli;
	return t;
};

}, function(modId) { var map = {"../helpers/isFinite":1597942294575,"../helpers/timeConstants":1597942294584,"./ToInteger":1597942294782}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294819, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerMinute = timeConstants.msPerMinute;
var MinutesPerHour = timeConstants.MinutesPerHour;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function MinFromTime(t) {
	return mod($floor(t / msPerMinute), MinutesPerHour);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294820, function(require, module, exports) {


var mod = require('../helpers/mod');

// https://ecma-international.org/ecma-262/5.1/#sec-5.2

module.exports = function modulo(x, y) {
	return mod(x, y);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294821, function(require, module, exports) {


var mod = require('../helpers/mod');
var msPerSecond = require('../helpers/timeConstants').msPerSecond;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function msFromTime(t) {
	return mod(t, msPerSecond);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294822, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $ObjectCreate = GetIntrinsic('%Object.create%', true);
var $TypeError = GetIntrinsic('%TypeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');

var Type = require('./Type');

var hasProto = !({ __proto__: null } instanceof Object);

// https://www.ecma-international.org/ecma-262/6.0/#sec-objectcreate

module.exports = function ObjectCreate(proto, internalSlotsList) {
	if (proto !== null && Type(proto) !== 'Object') {
		throw new $TypeError('Assertion failed: `proto` must be null or an object');
	}
	var slots = arguments.length < 2 ? [] : internalSlotsList;
	if (slots.length > 0) {
		throw new $SyntaxError('es-abstract does not yet support internal slots');
	}

	if ($ObjectCreate) {
		return $ObjectCreate(proto);
	}
	if (hasProto) {
		return { __proto__: proto };
	}

	if (proto === null) {
		throw new $SyntaxError('native Object.create support is required to create null objects');
	}
	var T = function T() {};
	T.prototype = proto;
	return new T();
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294823, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $getProto = require('../helpers/getProto');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/7.0/#sec-ordinarygetprototypeof

module.exports = function OrdinaryGetPrototypeOf(O) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: O must be an Object');
	}
	if (!$getProto) {
		throw new $TypeError('This environment does not support fetching prototypes.');
	}
	return $getProto(O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getProto":1597942294824,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294824, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var originalGetProto = GetIntrinsic('%Object.getPrototypeOf%', true);
var $ArrayProto = GetIntrinsic('%Array.prototype%');

module.exports = originalGetProto || (
	// eslint-disable-next-line no-proto
	[].__proto__ === $ArrayProto
		? function (O) {
			return O.__proto__; // eslint-disable-line no-proto
		}
		: null
);

}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294825, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $setProto = require('../helpers/setProto');

var OrdinaryGetPrototypeOf = require('./OrdinaryGetPrototypeOf');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/7.0/#sec-ordinarysetprototypeof

module.exports = function OrdinarySetPrototypeOf(O, V) {
	if (Type(V) !== 'Object' && Type(V) !== 'Null') {
		throw new $TypeError('Assertion failed: V must be Object or Null');
	}
	/*
    var extensible = IsExtensible(O);
    var current = OrdinaryGetPrototypeOf(O);
    if (SameValue(V, current)) {
        return true;
    }
    if (!extensible) {
        return false;
    }
    */
	try {
		$setProto(O, V);
	} catch (e) {
		return false;
	}
	return OrdinaryGetPrototypeOf(O) === V;
	/*
    var p = V;
    var done = false;
    while (!done) {
        if (p === null) {
            done = true;
        } else if (SameValue(p, O)) {
            return false;
        } else {
            if (wat) {
                done = true;
            } else {
                p = p.[[Prototype]];
            }
        }
     }
     O.[[Prototype]] = V;
     return true;
     */
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/setProto":1597942294826,"./OrdinaryGetPrototypeOf":1597942294823,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294826, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var originalSetProto = GetIntrinsic('%Object.setPrototypeOf%', true);
var $ArrayProto = GetIntrinsic('%Array.prototype%');

module.exports = originalSetProto || (
	// eslint-disable-next-line no-proto, no-negated-condition
	[].__proto__ !== $ArrayProto
		? null
		: function (O, proto) {
			O.__proto__ = proto; // eslint-disable-line no-proto, no-param-reassign
			return O;
		}
);

}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294827, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinaryhasproperty

module.exports = function OrdinaryHasProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	return P in O;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294756,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294828, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var regexExec = require('../helpers/callBound')('RegExp.prototype.exec');

var Call = require('./Call');
var Get = require('./Get');
var IsCallable = require('./IsCallable');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-regexpexec

module.exports = function RegExpExec(R, S) {
	if (Type(R) !== 'Object') {
		throw new $TypeError('Assertion failed: `R` must be an Object');
	}
	if (Type(S) !== 'String') {
		throw new $TypeError('Assertion failed: `S` must be a String');
	}
	var exec = Get(R, 'exec');
	if (IsCallable(exec)) {
		var result = Call(exec, R, [S]);
		if (result === null || Type(result) === 'Object') {
			return result;
		}
		throw new $TypeError('"exec" method must return `null` or an Object');
	}
	return regexExec(R, S);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Call":1597942294772,"./Get":1597942294769,"./IsCallable":1597942294759,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294829, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var SameValue = require('./SameValue');

// https://www.ecma-international.org/ecma-262/7.0/#sec-samevaluenonnumber

module.exports = function SameValueNonNumber(x, y) {
	if (typeof x === 'number' || typeof x !== typeof y) {
		throw new $TypeError('SameValueNonNumber requires two non-number values of the same type.');
	}
	return SameValue(x, y);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./SameValue":1597942294760}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294830, function(require, module, exports) {


var $isNaN = require('../helpers/isNaN');

// https://www.ecma-international.org/ecma-262/6.0/#sec-samevaluezero

module.exports = function SameValueZero(x, y) {
	return (x === y) || ($isNaN(x) && $isNaN(y));
};

}, function(modId) { var map = {"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294831, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerSecond = timeConstants.msPerSecond;
var SecondsPerMinute = timeConstants.SecondsPerMinute;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function SecFromTime(t) {
	return mod($floor(t / msPerSecond), SecondsPerMinute);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294832, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// IE 9 does not throw in strict mode when writability/configurability/extensibility is violated
var noThrowOnStrictViolation = (function () {
	try {
		delete [].length;
		return true;
	} catch (e) {
		return false;
	}
}());

// https://ecma-international.org/ecma-262/6.0/#sec-set-o-p-v-throw

module.exports = function Set(O, P, V, Throw) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	if (Type(Throw) !== 'Boolean') {
		throw new $TypeError('Assertion failed: `Throw` must be a Boolean');
	}
	if (Throw) {
		O[P] = V; // eslint-disable-line no-param-reassign
		if (noThrowOnStrictViolation && !SameValue(O[P], V)) {
			throw new $TypeError('Attempted to assign to readonly property.');
		}
		return true;
	} else {
		try {
			O[P] = V; // eslint-disable-line no-param-reassign
			return noThrowOnStrictViolation ? SameValue(O[P], V) : true;
		} catch (e) {
			return false;
		}
	}
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294756,"./SameValue":1597942294760,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294833, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var has = require('has');

var $TypeError = GetIntrinsic('%TypeError%');

var getSymbolDescription = require('../helpers/getSymbolDescription');

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');
var IsExtensible = require('./IsExtensible');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-setfunctionname

module.exports = function SetFunctionName(F, name) {
	if (typeof F !== 'function') {
		throw new $TypeError('Assertion failed: `F` must be a function');
	}
	if (!IsExtensible(F) || has(F, 'name')) {
		throw new $TypeError('Assertion failed: `F` must be extensible, and must not have a `name` own property');
	}
	var nameType = Type(name);
	if (nameType !== 'Symbol' && nameType !== 'String') {
		throw new $TypeError('Assertion failed: `name` must be a Symbol or a String');
	}
	if (nameType === 'Symbol') {
		var description = getSymbolDescription(name);
		// eslint-disable-next-line no-param-reassign
		name = typeof description === 'undefined' ? '' : '[' + description + ']';
	}
	if (arguments.length > 2) {
		var prefix = arguments[2];
		// eslint-disable-next-line no-param-reassign
		name = prefix + ' ' + name;
	}
	return DefinePropertyOrThrow(F, 'name', {
		'[[Value]]': name,
		'[[Writable]]': false,
		'[[Enumerable]]': false,
		'[[Configurable]]': true
	});
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getSymbolDescription":1597942294717,"./DefinePropertyOrThrow":1597942294771,"./IsExtensible":1597942294755,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294834, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');
var $preventExtensions = GetIntrinsic('%Object.preventExtensions%');
var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%');

var forEach = require('../helpers/forEach');

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-setintegritylevel

module.exports = function SetIntegrityLevel(O, level) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (level !== 'sealed' && level !== 'frozen') {
		throw new $TypeError('Assertion failed: `level` must be `"sealed"` or `"frozen"`');
	}
	if (!$preventExtensions) {
		throw new $SyntaxError('SetIntegrityLevel requires native `Object.preventExtensions` support');
	}
	var status = $preventExtensions(O);
	if (!status) {
		return false;
	}
	if (!$gOPN) {
		throw new $SyntaxError('SetIntegrityLevel requires native `Object.getOwnPropertyNames` support');
	}
	var theKeys = $gOPN(O);
	if (level === 'sealed') {
		forEach(theKeys, function (k) {
			DefinePropertyOrThrow(O, k, { configurable: false });
		});
	} else if (level === 'frozen') {
		forEach(theKeys, function (k) {
			var currentDesc = $gOPD(O, k);
			if (typeof currentDesc !== 'undefined') {
				var desc;
				if (IsAccessorDescriptor(ToPropertyDescriptor(currentDesc))) {
					desc = { configurable: false };
				} else {
					desc = { configurable: false, writable: false };
				}
				DefinePropertyOrThrow(O, k, desc);
			}
		});
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/forEach":1597942294720,"./DefinePropertyOrThrow":1597942294771,"./IsAccessorDescriptor":1597942294752,"./ToPropertyDescriptor":1597942294757,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294835, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $species = GetIntrinsic('%Symbol.species%', true);
var $TypeError = GetIntrinsic('%TypeError%');

var IsConstructor = require('./IsConstructor');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-speciesconstructor

module.exports = function SpeciesConstructor(O, defaultConstructor) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	var C = O.constructor;
	if (typeof C === 'undefined') {
		return defaultConstructor;
	}
	if (Type(C) !== 'Object') {
		throw new $TypeError('O.constructor is not an Object');
	}
	var S = $species ? C[$species] : void 0;
	if (S == null) {
		return defaultConstructor;
	}
	if (IsConstructor(S)) {
		return S;
	}
	throw new $TypeError('no constructor found');
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsConstructor":1597942294770,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294836, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $SymbolToString = callBound('Symbol.prototype.toString', true);

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-symboldescriptivestring

module.exports = function SymbolDescriptiveString(sym) {
	if (Type(sym) !== 'Symbol') {
		throw new $TypeError('Assertion failed: `sym` must be a Symbol');
	}
	return $SymbolToString(sym);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294837, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%');
var $TypeError = GetIntrinsic('%TypeError%');

var every = require('../helpers/every');

var IsDataDescriptor = require('./IsDataDescriptor');
var IsExtensible = require('./IsExtensible');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-testintegritylevel

module.exports = function TestIntegrityLevel(O, level) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (level !== 'sealed' && level !== 'frozen') {
		throw new $TypeError('Assertion failed: `level` must be `"sealed"` or `"frozen"`');
	}
	var status = IsExtensible(O);
	if (status) {
		return false;
	}
	var theKeys = $gOPN(O);
	return theKeys.length === 0 || every(theKeys, function (k) {
		var currentDesc = $gOPD(O, k);
		if (typeof currentDesc !== 'undefined') {
			if (currentDesc.configurable) {
				return false;
			}
			if (level === 'frozen' && IsDataDescriptor(ToPropertyDescriptor(currentDesc)) && currentDesc.writable) {
				return false;
			}
		}
		return true;
	});
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/every":1597942294649,"./IsDataDescriptor":1597942294753,"./IsExtensible":1597942294755,"./ToPropertyDescriptor":1597942294757,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294838, function(require, module, exports) {


var $BooleanValueOf = require('../helpers/callBound')('Boolean.prototype.valueOf');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-boolean-prototype-object

module.exports = function thisBooleanValue(value) {
	if (Type(value) === 'Boolean') {
		return value;
	}

	return $BooleanValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294839, function(require, module, exports) {


var callBound = require('../helpers/callBound');

var Type = require('./Type');

var $NumberValueOf = callBound('Number.prototype.valueOf');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-number-prototype-object

module.exports = function thisNumberValue(value) {
	if (Type(value) === 'Number') {
		return value;
	}

	return $NumberValueOf(value);
};


}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294840, function(require, module, exports) {


var $StringValueOf = require('../helpers/callBound')('String.prototype.valueOf');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-string-prototype-object

module.exports = function thisStringValue(value) {
	if (Type(value) === 'String') {
		return value;
	}

	return $StringValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294841, function(require, module, exports) {


var $DateValueOf = require('../helpers/callBound')('Date.prototype.valueOf');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-date-prototype-object

module.exports = function thisTimeValue(value) {
	return $DateValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294842, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Date = GetIntrinsic('%Date%');
var $Number = GetIntrinsic('%Number%');
var $abs = GetIntrinsic('%Math.abs%');

var $isFinite = require('../helpers/isFinite');

var ToNumber = require('./ToNumber');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.14

module.exports = function TimeClip(time) {
	if (!$isFinite(time) || $abs(time) > 8.64e15) {
		return NaN;
	}
	return $Number(new $Date(ToNumber(time)));
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isFinite":1597942294575,"./ToNumber":1597942294742}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294843, function(require, module, exports) {


var msPerDay = require('../helpers/timeConstants').msPerDay;

var DayFromYear = require('./DayFromYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function TimeFromYear(y) {
	return msPerDay * DayFromYear(y);
};

}, function(modId) { var map = {"../helpers/timeConstants":1597942294584,"./DayFromYear":1597942294787}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294844, function(require, module, exports) {


var mod = require('../helpers/mod');
var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.2

module.exports = function TimeWithinDay(t) {
	return mod(t, msPerDay);
};


}, function(modId) { var map = {"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294845, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $Date = GetIntrinsic('%Date%');

var $isNaN = require('../helpers/isNaN');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-todatestring

module.exports = function ToDateString(tv) {
	if (Type(tv) !== 'Number') {
		throw new $TypeError('Assertion failed: `tv` must be a Number');
	}
	if ($isNaN(tv)) {
		return 'Invalid Date';
	}
	return $Date(tv);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"./Type":1597942294744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294846, function(require, module, exports) {


var ToUint16 = require('./ToUint16');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toint16

module.exports = function ToInt16(argument) {
	var int16bit = ToUint16(argument);
	return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
};

}, function(modId) { var map = {"./ToUint16":1597942294847}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294847, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var $sign = require('../helpers/sign');
var $mod = require('../helpers/mod');

var $floor = $Math.floor;
var $abs = $Math.abs;

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.7

module.exports = function ToUint16(value) {
	var number = ToNumber(value);
	if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
	var posInt = $sign(number) * $floor($abs(number));
	return $mod(posInt, 0x10000);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942294742,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/sign":1597942294603,"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294848, function(require, module, exports) {


var ToNumber = require('./ToNumber');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.5

module.exports = function ToInt32(x) {
	return ToNumber(x) >> 0;
};

}, function(modId) { var map = {"./ToNumber":1597942294742}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294849, function(require, module, exports) {


var ToUint8 = require('./ToUint8');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toint8

module.exports = function ToInt8(argument) {
	var int8bit = ToUint8(argument);
	return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
};

}, function(modId) { var map = {"./ToUint8":1597942294850}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294850, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var $sign = require('../helpers/sign');
var $mod = require('../helpers/mod');

var $floor = $Math.floor;
var $abs = $Math.abs;

module.exports = function ToUint8(argument) {
	var number = ToNumber(argument);
	if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
	var posInt = $sign(number) * $floor($abs(number));
	return $mod(posInt, 0x100);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942294742,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/sign":1597942294603,"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294851, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $String = GetIntrinsic('%String%');

var ToPrimitive = require('./ToPrimitive');
var ToString = require('./ToString');

// https://www.ecma-international.org/ecma-262/6.0/#sec-topropertykey

module.exports = function ToPropertyKey(argument) {
	var key = ToPrimitive(argument, $String);
	return typeof key === 'symbol' ? key : ToString(key);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToPrimitive":1597942294743,"./ToString":1597942294766}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294852, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');

var $floor = $Math.floor;

// https://www.ecma-international.org/ecma-262/6.0/#sec-touint8clamp

module.exports = function ToUint8Clamp(argument) {
	var number = ToNumber(argument);
	if ($isNaN(number) || number <= 0) { return 0; }
	if (number >= 0xFF) { return 0xFF; }
	var f = $floor(argument);
	if (f + 0.5 < number) { return f + 1; }
	if (number < f + 0.5) { return f; }
	if (f % 2 !== 0) { return f + 1; }
	return f;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942294742,"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294853, function(require, module, exports) {


var mod = require('../helpers/mod');

var Day = require('./Day');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.6

module.exports = function WeekDay(t) {
	return mod(Day(t) + 4, 7);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589,"./Day":1597942294786}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294854, function(require, module, exports) {


/* eslint global-require: 0 */
// https://www.ecma-international.org/ecma-262/8.0/#sec-abstract-operations
var ES2017 = {
	'Abstract Equality Comparison': require('./2017/AbstractEqualityComparison'),
	'Abstract Relational Comparison': require('./2017/AbstractRelationalComparison'),
	'Strict Equality Comparison': require('./2017/StrictEqualityComparison'),
	AdvanceStringIndex: require('./2017/AdvanceStringIndex'),
	ArrayCreate: require('./2017/ArrayCreate'),
	ArraySetLength: require('./2017/ArraySetLength'),
	ArraySpeciesCreate: require('./2017/ArraySpeciesCreate'),
	Call: require('./2017/Call'),
	CanonicalNumericIndexString: require('./2017/CanonicalNumericIndexString'),
	CompletePropertyDescriptor: require('./2017/CompletePropertyDescriptor'),
	CreateDataProperty: require('./2017/CreateDataProperty'),
	CreateDataPropertyOrThrow: require('./2017/CreateDataPropertyOrThrow'),
	CreateHTML: require('./2017/CreateHTML'),
	CreateIterResultObject: require('./2017/CreateIterResultObject'),
	CreateListFromArrayLike: require('./2017/CreateListFromArrayLike'),
	CreateMethodProperty: require('./2017/CreateMethodProperty'),
	DateFromTime: require('./2017/DateFromTime'),
	Day: require('./2017/Day'),
	DayFromYear: require('./2017/DayFromYear'),
	DaysInYear: require('./2017/DaysInYear'),
	DayWithinYear: require('./2017/DayWithinYear'),
	DefinePropertyOrThrow: require('./2017/DefinePropertyOrThrow'),
	DeletePropertyOrThrow: require('./2017/DeletePropertyOrThrow'),
	EnumerableOwnProperties: require('./2017/EnumerableOwnProperties'),
	FromPropertyDescriptor: require('./2017/FromPropertyDescriptor'),
	Get: require('./2017/Get'),
	GetIterator: require('./2017/GetIterator'),
	GetMethod: require('./2017/GetMethod'),
	GetOwnPropertyKeys: require('./2017/GetOwnPropertyKeys'),
	GetPrototypeFromConstructor: require('./2017/GetPrototypeFromConstructor'),
	GetSubstitution: require('./2017/GetSubstitution'),
	GetV: require('./2017/GetV'),
	HasOwnProperty: require('./2017/HasOwnProperty'),
	HasProperty: require('./2017/HasProperty'),
	HourFromTime: require('./2017/HourFromTime'),
	InLeapYear: require('./2017/InLeapYear'),
	InstanceofOperator: require('./2017/InstanceofOperator'),
	Invoke: require('./2017/Invoke'),
	IsAccessorDescriptor: require('./2017/IsAccessorDescriptor'),
	IsArray: require('./2017/IsArray'),
	IsCallable: require('./2017/IsCallable'),
	IsConcatSpreadable: require('./2017/IsConcatSpreadable'),
	IsConstructor: require('./2017/IsConstructor'),
	IsDataDescriptor: require('./2017/IsDataDescriptor'),
	IsExtensible: require('./2017/IsExtensible'),
	IsGenericDescriptor: require('./2017/IsGenericDescriptor'),
	IsInteger: require('./2017/IsInteger'),
	IsPromise: require('./2017/IsPromise'),
	IsPropertyDescriptor: require('./2017/IsPropertyDescriptor'),
	IsPropertyKey: require('./2017/IsPropertyKey'),
	IsRegExp: require('./2017/IsRegExp'),
	IterableToList: require('./2017/IterableToList'),
	IteratorClose: require('./2017/IteratorClose'),
	IteratorComplete: require('./2017/IteratorComplete'),
	IteratorNext: require('./2017/IteratorNext'),
	IteratorStep: require('./2017/IteratorStep'),
	IteratorValue: require('./2017/IteratorValue'),
	MakeDate: require('./2017/MakeDate'),
	MakeDay: require('./2017/MakeDay'),
	MakeTime: require('./2017/MakeTime'),
	MinFromTime: require('./2017/MinFromTime'),
	modulo: require('./2017/modulo'),
	MonthFromTime: require('./2017/MonthFromTime'),
	msFromTime: require('./2017/msFromTime'),
	ObjectCreate: require('./2017/ObjectCreate'),
	OrdinaryDefineOwnProperty: require('./2017/OrdinaryDefineOwnProperty'),
	OrdinaryGetOwnProperty: require('./2017/OrdinaryGetOwnProperty'),
	OrdinarySetPrototypeOf: require('./2017/OrdinarySetPrototypeOf'),
	OrdinaryGetPrototypeOf: require('./2017/OrdinaryGetPrototypeOf'),
	OrdinaryHasInstance: require('./2017/OrdinaryHasInstance'),
	OrdinaryHasProperty: require('./2017/OrdinaryHasProperty'),
	RegExpExec: require('./2017/RegExpExec'),
	RequireObjectCoercible: require('./2017/RequireObjectCoercible'),
	SameValue: require('./2017/SameValue'),
	SameValueNonNumber: require('./2017/SameValueNonNumber'),
	SameValueZero: require('./2017/SameValueZero'),
	SecFromTime: require('./2017/SecFromTime'),
	Set: require('./2017/Set'),
	SetFunctionName: require('./2017/SetFunctionName'),
	SetIntegrityLevel: require('./2017/SetIntegrityLevel'),
	SpeciesConstructor: require('./2017/SpeciesConstructor'),
	SymbolDescriptiveString: require('./2017/SymbolDescriptiveString'),
	TestIntegrityLevel: require('./2017/TestIntegrityLevel'),
	thisBooleanValue: require('./2017/thisBooleanValue'),
	thisNumberValue: require('./2017/thisNumberValue'),
	thisStringValue: require('./2017/thisStringValue'),
	thisTimeValue: require('./2017/thisTimeValue'),
	TimeClip: require('./2017/TimeClip'),
	TimeFromYear: require('./2017/TimeFromYear'),
	TimeWithinDay: require('./2017/TimeWithinDay'),
	ToBoolean: require('./2017/ToBoolean'),
	ToDateString: require('./2017/ToDateString'),
	ToIndex: require('./2017/ToIndex'),
	ToInt16: require('./2017/ToInt16'),
	ToInt32: require('./2017/ToInt32'),
	ToInt8: require('./2017/ToInt8'),
	ToInteger: require('./2017/ToInteger'),
	ToLength: require('./2017/ToLength'),
	ToNumber: require('./2017/ToNumber'),
	ToObject: require('./2017/ToObject'),
	ToPrimitive: require('./2017/ToPrimitive'),
	ToPropertyDescriptor: require('./2017/ToPropertyDescriptor'),
	ToPropertyKey: require('./2017/ToPropertyKey'),
	ToString: require('./2017/ToString'),
	ToUint16: require('./2017/ToUint16'),
	ToUint32: require('./2017/ToUint32'),
	ToUint8: require('./2017/ToUint8'),
	ToUint8Clamp: require('./2017/ToUint8Clamp'),
	Type: require('./2017/Type'),
	ValidateAndApplyPropertyDescriptor: require('./2017/ValidateAndApplyPropertyDescriptor'),
	WeekDay: require('./2017/WeekDay'),
	YearFromTime: require('./2017/YearFromTime')
};

module.exports = ES2017;

}, function(modId) { var map = {"./2017/AbstractEqualityComparison":1597942294855,"./2017/AbstractRelationalComparison":1597942294859,"./2017/StrictEqualityComparison":1597942294860,"./2017/AdvanceStringIndex":1597942294861,"./2017/ArrayCreate":1597942294863,"./2017/ArraySetLength":1597942294864,"./2017/ArraySpeciesCreate":1597942294882,"./2017/Call":1597942294886,"./2017/CanonicalNumericIndexString":1597942294887,"./2017/CompletePropertyDescriptor":1597942294888,"./2017/CreateDataProperty":1597942294889,"./2017/CreateDataPropertyOrThrow":1597942294890,"./2017/CreateHTML":1597942294891,"./2017/CreateIterResultObject":1597942294893,"./2017/CreateListFromArrayLike":1597942294894,"./2017/CreateMethodProperty":1597942294897,"./2017/DateFromTime":1597942294898,"./2017/Day":1597942294900,"./2017/DayFromYear":1597942294901,"./2017/DaysInYear":1597942294904,"./2017/DayWithinYear":1597942294899,"./2017/DefinePropertyOrThrow":1597942294885,"./2017/DeletePropertyOrThrow":1597942294906,"./2017/EnumerableOwnProperties":1597942294907,"./2017/FromPropertyDescriptor":1597942294876,"./2017/Get":1597942294883,"./2017/GetIterator":1597942294908,"./2017/GetMethod":1597942294909,"./2017/GetOwnPropertyKeys":1597942294912,"./2017/GetPrototypeFromConstructor":1597942294913,"./2017/GetSubstitution":1597942294914,"./2017/GetV":1597942294910,"./2017/HasOwnProperty":1597942294915,"./2017/HasProperty":1597942294916,"./2017/HourFromTime":1597942294917,"./2017/InLeapYear":1597942294903,"./2017/InstanceofOperator":1597942294918,"./2017/Invoke":1597942294920,"./2017/IsAccessorDescriptor":1597942294866,"./2017/IsArray":1597942294865,"./2017/IsCallable":1597942294873,"./2017/IsConcatSpreadable":1597942294921,"./2017/IsConstructor":1597942294884,"./2017/IsDataDescriptor":1597942294867,"./2017/IsExtensible":1597942294869,"./2017/IsGenericDescriptor":1597942294877,"./2017/IsInteger":1597942294862,"./2017/IsPromise":1597942294922,"./2017/IsPropertyDescriptor":1597942294923,"./2017/IsPropertyKey":1597942294870,"./2017/IsRegExp":1597942294879,"./2017/IterableToList":1597942294924,"./2017/IteratorClose":1597942294929,"./2017/IteratorComplete":1597942294926,"./2017/IteratorNext":1597942294927,"./2017/IteratorStep":1597942294925,"./2017/IteratorValue":1597942294928,"./2017/MakeDate":1597942294930,"./2017/MakeDay":1597942294931,"./2017/MakeTime":1597942294932,"./2017/MinFromTime":1597942294933,"./2017/modulo":1597942294934,"./2017/MonthFromTime":1597942294905,"./2017/msFromTime":1597942294935,"./2017/ObjectCreate":1597942294936,"./2017/OrdinaryDefineOwnProperty":1597942294868,"./2017/OrdinaryGetOwnProperty":1597942294878,"./2017/OrdinarySetPrototypeOf":1597942294937,"./2017/OrdinaryGetPrototypeOf":1597942294938,"./2017/OrdinaryHasInstance":1597942294919,"./2017/OrdinaryHasProperty":1597942294939,"./2017/RegExpExec":1597942294940,"./2017/RequireObjectCoercible":1597942294892,"./2017/SameValue":1597942294874,"./2017/SameValueNonNumber":1597942294941,"./2017/SameValueZero":1597942294942,"./2017/SecFromTime":1597942294943,"./2017/Set":1597942294944,"./2017/SetFunctionName":1597942294945,"./2017/SetIntegrityLevel":1597942294946,"./2017/SpeciesConstructor":1597942294947,"./2017/SymbolDescriptiveString":1597942294948,"./2017/TestIntegrityLevel":1597942294949,"./2017/thisBooleanValue":1597942294950,"./2017/thisNumberValue":1597942294951,"./2017/thisStringValue":1597942294952,"./2017/thisTimeValue":1597942294953,"./2017/TimeClip":1597942294954,"./2017/TimeFromYear":1597942294955,"./2017/TimeWithinDay":1597942294956,"./2017/ToBoolean":1597942294872,"./2017/ToDateString":1597942294957,"./2017/ToIndex":1597942294958,"./2017/ToInt16":1597942294959,"./2017/ToInt32":1597942294961,"./2017/ToInt8":1597942294962,"./2017/ToInteger":1597942294896,"./2017/ToLength":1597942294895,"./2017/ToNumber":1597942294856,"./2017/ToObject":1597942294911,"./2017/ToPrimitive":1597942294857,"./2017/ToPropertyDescriptor":1597942294871,"./2017/ToPropertyKey":1597942294964,"./2017/ToString":1597942294880,"./2017/ToUint16":1597942294960,"./2017/ToUint32":1597942294881,"./2017/ToUint8":1597942294963,"./2017/ToUint8Clamp":1597942294965,"./2017/Type":1597942294858,"./2017/ValidateAndApplyPropertyDescriptor":1597942294875,"./2017/WeekDay":1597942294966,"./2017/YearFromTime":1597942294902}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294855, function(require, module, exports) {


var ToNumber = require('./ToNumber');
var ToPrimitive = require('./ToPrimitive');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-abstract-equality-comparison

module.exports = function AbstractEqualityComparison(x, y) {
	var xType = Type(x);
	var yType = Type(y);
	if (xType === yType) {
		return x === y; // ES6+ specified this shortcut anyways.
	}
	if (x == null && y == null) {
		return true;
	}
	if (xType === 'Number' && yType === 'String') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if (xType === 'String' && yType === 'Number') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (xType === 'Boolean') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (yType === 'Boolean') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if ((xType === 'String' || xType === 'Number' || xType === 'Symbol') && yType === 'Object') {
		return AbstractEqualityComparison(x, ToPrimitive(y));
	}
	if (xType === 'Object' && (yType === 'String' || yType === 'Number' || yType === 'Symbol')) {
		return AbstractEqualityComparison(ToPrimitive(x), y);
	}
	return false;
};

}, function(modId) { var map = {"./ToNumber":1597942294856,"./ToPrimitive":1597942294857,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294856, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $Number = GetIntrinsic('%Number%');
var $RegExp = GetIntrinsic('%RegExp%');
var $parseInteger = GetIntrinsic('%parseInt%');

var callBound = require('../helpers/callBound');
var regexTester = require('../helpers/regexTester');
var isPrimitive = require('../helpers/isPrimitive');

var $strSlice = callBound('String.prototype.slice');
var isBinary = regexTester(/^0b[01]+$/i);
var isOctal = regexTester(/^0o[0-7]+$/i);
var isInvalidHexLiteral = regexTester(/^[-+]0x[0-9a-f]+$/i);
var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
var nonWSregex = new $RegExp('[' + nonWS + ']', 'g');
var hasNonWS = regexTester(nonWSregex);

// whitespace from: https://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = [
	'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
	'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
	'\u2029\uFEFF'
].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var $replace = callBound('String.prototype.replace');
var $trim = function (value) {
	return $replace(value, trimRegex, '');
};

var ToPrimitive = require('./ToPrimitive');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tonumber

module.exports = function ToNumber(argument) {
	var value = isPrimitive(argument) ? argument : ToPrimitive(argument, $Number);
	if (typeof value === 'symbol') {
		throw new $TypeError('Cannot convert a Symbol value to a number');
	}
	if (typeof value === 'string') {
		if (isBinary(value)) {
			return ToNumber($parseInteger($strSlice(value, 2), 2));
		} else if (isOctal(value)) {
			return ToNumber($parseInteger($strSlice(value, 2), 8));
		} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
			return NaN;
		} else {
			var trimmed = $trim(value);
			if (trimmed !== value) {
				return ToNumber(trimmed);
			}
		}
	}
	return $Number(value);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"../helpers/regexTester":1597942294624,"../helpers/isPrimitive":1597942294625,"./ToPrimitive":1597942294857}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294857, function(require, module, exports) {


var toPrimitive = require('es-to-primitive/es2015');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive

module.exports = function ToPrimitive(input) {
	if (arguments.length > 1) {
		return toPrimitive(input, arguments[1]);
	}
	return toPrimitive(input);
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294858, function(require, module, exports) {


var ES5Type = require('../5/Type');

// https://ecma-international.org/ecma-262/6.0/#sec-ecmascript-data-types-and-values

module.exports = function Type(x) {
	if (typeof x === 'symbol') {
		return 'Symbol';
	}
	return ES5Type(x);
};

}, function(modId) { var map = {"../5/Type":1597942294572}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294859, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Number = GetIntrinsic('%Number%');
var $TypeError = GetIntrinsic('%TypeError%');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var isPrefixOf = require('../helpers/isPrefixOf');

var ToNumber = require('./ToNumber');
var ToPrimitive = require('./ToPrimitive');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/5.1/#sec-11.8.5

// eslint-disable-next-line max-statements
module.exports = function AbstractRelationalComparison(x, y, LeftFirst) {
	if (Type(LeftFirst) !== 'Boolean') {
		throw new $TypeError('Assertion failed: LeftFirst argument must be a Boolean');
	}
	var px;
	var py;
	if (LeftFirst) {
		px = ToPrimitive(x, $Number);
		py = ToPrimitive(y, $Number);
	} else {
		py = ToPrimitive(y, $Number);
		px = ToPrimitive(x, $Number);
	}
	var bothStrings = Type(px) === 'String' && Type(py) === 'String';
	if (!bothStrings) {
		var nx = ToNumber(px);
		var ny = ToNumber(py);
		if ($isNaN(nx) || $isNaN(ny)) {
			return undefined;
		}
		if ($isFinite(nx) && $isFinite(ny) && nx === ny) {
			return false;
		}
		if (nx === 0 && ny === 0) {
			return false;
		}
		if (nx === Infinity) {
			return false;
		}
		if (ny === Infinity) {
			return true;
		}
		if (ny === -Infinity) {
			return false;
		}
		if (nx === -Infinity) {
			return true;
		}
		return nx < ny; // by now, these are both nonzero, finite, and not equal
	}
	if (isPrefixOf(py, px)) {
		return false;
	}
	if (isPrefixOf(px, py)) {
		return true;
	}
	return px < py; // both strings, neither a prefix of the other. shortcut for steps c-f
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/isPrefixOf":1597942294576,"./ToNumber":1597942294856,"./ToPrimitive":1597942294857,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294860, function(require, module, exports) {


var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/5.1/#sec-11.9.6

module.exports = function StrictEqualityComparison(x, y) {
	var xType = Type(x);
	var yType = Type(y);
	if (xType !== yType) {
		return false;
	}
	if (xType === 'Undefined' || xType === 'Null') {
		return true;
	}
	return x === y; // shortcut for steps 4-7
};

}, function(modId) { var map = {"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294861, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var IsInteger = require('./IsInteger');
var Type = require('./Type');

var MAX_SAFE_INTEGER = require('../helpers/maxSafeInteger');

var $TypeError = GetIntrinsic('%TypeError%');

var $charCodeAt = require('../helpers/callBound')('String.prototype.charCodeAt');

// https://ecma-international.org/ecma-262/6.0/#sec-advancestringindex

module.exports = function AdvanceStringIndex(S, index, unicode) {
	if (Type(S) !== 'String') {
		throw new $TypeError('Assertion failed: `S` must be a String');
	}
	if (!IsInteger(index) || index < 0 || index > MAX_SAFE_INTEGER) {
		throw new $TypeError('Assertion failed: `length` must be an integer >= 0 and <= 2**53');
	}
	if (Type(unicode) !== 'Boolean') {
		throw new $TypeError('Assertion failed: `unicode` must be a Boolean');
	}
	if (!unicode) {
		return index + 1;
	}
	var length = S.length;
	if ((index + 1) >= length) {
		return index + 1;
	}

	var first = $charCodeAt(S, index);
	if (first < 0xD800 || first > 0xDBFF) {
		return index + 1;
	}

	var second = $charCodeAt(S, index + 1);
	if (second < 0xDC00 || second > 0xDFFF) {
		return index + 1;
	}

	return index + 2;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsInteger":1597942294862,"./Type":1597942294858,"../helpers/maxSafeInteger":1597942294632,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294862, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var $floor = $Math.floor;
var $abs = $Math.abs;

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isinteger

module.exports = function IsInteger(argument) {
	if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
		return false;
	}
	var abs = $abs(argument);
	return $floor(abs) === abs;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294863, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $ArrayPrototype = GetIntrinsic('%Array.prototype%');
var $RangeError = GetIntrinsic('%RangeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');

var IsInteger = require('./IsInteger');

var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1;

var $setProto = GetIntrinsic('%Object.setPrototypeOf%', true) || (
	// eslint-disable-next-line no-proto, no-negated-condition
	[].__proto__ !== $ArrayPrototype
		? null
		: function (O, proto) {
			O.__proto__ = proto; // eslint-disable-line no-proto, no-param-reassign
			return O;
		}
);

// https://www.ecma-international.org/ecma-262/6.0/#sec-arraycreate

module.exports = function ArrayCreate(length) {
	if (!IsInteger(length) || length < 0) {
		throw new $TypeError('Assertion failed: `length` must be an integer Number >= 0');
	}
	if (length > MAX_ARRAY_LENGTH) {
		throw new $RangeError('length is greater than (2**32 - 1)');
	}
	var proto = arguments.length > 1 ? arguments[1] : $ArrayPrototype;
	var A = []; // steps 5 - 7, and 9
	if (proto !== $ArrayPrototype) { // step 8
		if (!$setProto) {
			throw new $SyntaxError('ArrayCreate: a `proto` argument that is not `Array.prototype` is not supported in an environment that does not support setting the [[Prototype]]');
		}
		$setProto(A, proto);
	}
	if (length !== 0) { // bypasses the need for step 2
		A.length = length;
	}
	/* step 10, the above as a shortcut for the below
    OrdinaryDefineOwnProperty(A, 'length', {
        '[[Configurable]]': false,
        '[[Enumerable]]': false,
        '[[Value]]': length,
        '[[Writable]]': true
    });
    */
	return A;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsInteger":1597942294862}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294864, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $RangeError = GetIntrinsic('%RangeError%');
var $TypeError = GetIntrinsic('%TypeError%');

var assign = require('object.assign');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');

var IsArray = require('./IsArray');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var OrdinaryDefineOwnProperty = require('./OrdinaryDefineOwnProperty');
var OrdinaryGetOwnProperty = require('./OrdinaryGetOwnProperty');
var ToNumber = require('./ToNumber');
var ToString = require('./ToString');
var ToUint32 = require('./ToUint32');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-arraysetlength

// eslint-disable-next-line max-statements, max-lines-per-function
module.exports = function ArraySetLength(A, Desc) {
	if (!IsArray(A)) {
		throw new $TypeError('Assertion failed: A must be an Array');
	}
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
	}
	if (!('[[Value]]' in Desc)) {
		return OrdinaryDefineOwnProperty(A, 'length', Desc);
	}
	var newLenDesc = assign({}, Desc);
	var newLen = ToUint32(Desc['[[Value]]']);
	var numberLen = ToNumber(Desc['[[Value]]']);
	if (newLen !== numberLen) {
		throw new $RangeError('Invalid array length');
	}
	newLenDesc['[[Value]]'] = newLen;
	var oldLenDesc = OrdinaryGetOwnProperty(A, 'length');
	if (!IsDataDescriptor(oldLenDesc)) {
		throw new $TypeError('Assertion failed: an array had a non-data descriptor on `length`');
	}
	var oldLen = oldLenDesc['[[Value]]'];
	if (newLen >= oldLen) {
		return OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
	}
	if (!oldLenDesc['[[Writable]]']) {
		return false;
	}
	var newWritable;
	if (!('[[Writable]]' in newLenDesc) || newLenDesc['[[Writable]]']) {
		newWritable = true;
	} else {
		newWritable = false;
		newLenDesc['[[Writable]]'] = true;
	}
	var succeeded = OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
	if (!succeeded) {
		return false;
	}
	while (newLen < oldLen) {
		oldLen -= 1;
		// eslint-disable-next-line no-param-reassign
		var deleteSucceeded = delete A[ToString(oldLen)];
		if (!deleteSucceeded) {
			newLenDesc['[[Value]]'] = oldLen + 1;
			if (!newWritable) {
				newLenDesc['[[Writable]]'] = false;
				OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
				return false;
			}
		}
	}
	if (!newWritable) {
		return OrdinaryDefineOwnProperty(A, 'length', { '[[Writable]]': false });
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPropertyDescriptor":1597942294599,"./IsArray":1597942294865,"./IsAccessorDescriptor":1597942294866,"./IsDataDescriptor":1597942294867,"./OrdinaryDefineOwnProperty":1597942294868,"./OrdinaryGetOwnProperty":1597942294878,"./ToNumber":1597942294856,"./ToString":1597942294880,"./ToUint32":1597942294881,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294865, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Array = GetIntrinsic('%Array%');

// eslint-disable-next-line global-require
var toStr = !$Array.isArray && require('../helpers/callBound')('Object.prototype.toString');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isarray

module.exports = $Array.isArray || function IsArray(argument) {
	return toStr(argument) === '[object Array]';
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294866, function(require, module, exports) {


var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isaccessordescriptor

module.exports = function IsAccessorDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!has(Desc, '[[Get]]') && !has(Desc, '[[Set]]')) {
		return false;
	}

	return true;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294867, function(require, module, exports) {


var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isdatadescriptor

module.exports = function IsDataDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!has(Desc, '[[Value]]') && !has(Desc, '[[Writable]]')) {
		return false;
	}

	return true;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294868, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');

var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsExtensible = require('./IsExtensible');
var IsPropertyKey = require('./IsPropertyKey');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var SameValue = require('./SameValue');
var Type = require('./Type');
var ValidateAndApplyPropertyDescriptor = require('./ValidateAndApplyPropertyDescriptor');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarydefineownproperty

module.exports = function OrdinaryDefineOwnProperty(O, P, Desc) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: O must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
	}
	if (!$gOPD) {
		// ES3/IE 8 fallback
		if (IsAccessorDescriptor(Desc)) {
			throw new $SyntaxError('This environment does not support accessor property descriptors.');
		}
		var creatingNormalDataProperty = !(P in O)
			&& Desc['[[Writable]]']
			&& Desc['[[Enumerable]]']
			&& Desc['[[Configurable]]']
			&& '[[Value]]' in Desc;
		var settingExistingDataProperty = (P in O)
			&& (!('[[Configurable]]' in Desc) || Desc['[[Configurable]]'])
			&& (!('[[Enumerable]]' in Desc) || Desc['[[Enumerable]]'])
			&& (!('[[Writable]]' in Desc) || Desc['[[Writable]]'])
			&& '[[Value]]' in Desc;
		if (creatingNormalDataProperty || settingExistingDataProperty) {
			O[P] = Desc['[[Value]]']; // eslint-disable-line no-param-reassign
			return SameValue(O[P], Desc['[[Value]]']);
		}
		throw new $SyntaxError('This environment does not support defining non-writable, non-enumerable, or non-configurable properties');
	}
	var desc = $gOPD(O, P);
	var current = desc && ToPropertyDescriptor(desc);
	var extensible = IsExtensible(O);
	return ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/isPropertyDescriptor":1597942294599,"./IsAccessorDescriptor":1597942294866,"./IsDataDescriptor":1597942294867,"./IsExtensible":1597942294869,"./IsPropertyKey":1597942294870,"./ToPropertyDescriptor":1597942294871,"./SameValue":1597942294874,"./Type":1597942294858,"./ValidateAndApplyPropertyDescriptor":1597942294875}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294869, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Object = GetIntrinsic('%Object%');

var isPrimitive = require('../helpers/isPrimitive');

var $preventExtensions = $Object.preventExtensions;
var $isExtensible = $Object.isExtensible;

// https://www.ecma-international.org/ecma-262/6.0/#sec-isextensible-o

module.exports = $preventExtensions
	? function IsExtensible(obj) {
		return !isPrimitive(obj) && $isExtensible(obj);
	}
	: function IsExtensible(obj) {
		return !isPrimitive(obj);
	};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPrimitive":1597942294625}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294870, function(require, module, exports) {


// https://www.ecma-international.org/ecma-262/6.0/#sec-ispropertykey

module.exports = function IsPropertyKey(argument) {
	return typeof argument === 'string' || typeof argument === 'symbol';
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294871, function(require, module, exports) {


var has = require('has');

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Type = require('./Type');
var ToBoolean = require('./ToBoolean');
var IsCallable = require('./IsCallable');

// https://ecma-international.org/ecma-262/5.1/#sec-8.10.5

module.exports = function ToPropertyDescriptor(Obj) {
	if (Type(Obj) !== 'Object') {
		throw new $TypeError('ToPropertyDescriptor requires an object');
	}

	var desc = {};
	if (has(Obj, 'enumerable')) {
		desc['[[Enumerable]]'] = ToBoolean(Obj.enumerable);
	}
	if (has(Obj, 'configurable')) {
		desc['[[Configurable]]'] = ToBoolean(Obj.configurable);
	}
	if (has(Obj, 'value')) {
		desc['[[Value]]'] = Obj.value;
	}
	if (has(Obj, 'writable')) {
		desc['[[Writable]]'] = ToBoolean(Obj.writable);
	}
	if (has(Obj, 'get')) {
		var getter = Obj.get;
		if (typeof getter !== 'undefined' && !IsCallable(getter)) {
			throw new TypeError('getter must be a function');
		}
		desc['[[Get]]'] = getter;
	}
	if (has(Obj, 'set')) {
		var setter = Obj.set;
		if (typeof setter !== 'undefined' && !IsCallable(setter)) {
			throw new $TypeError('setter must be a function');
		}
		desc['[[Set]]'] = setter;
	}

	if ((has(desc, '[[Get]]') || has(desc, '[[Set]]')) && (has(desc, '[[Value]]') || has(desc, '[[Writable]]'))) {
		throw new $TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
	}
	return desc;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294858,"./ToBoolean":1597942294872,"./IsCallable":1597942294873}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294872, function(require, module, exports) {


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.2

module.exports = function ToBoolean(value) { return !!value; };

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294873, function(require, module, exports) {


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.11

module.exports = require('is-callable');

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294874, function(require, module, exports) {


var $isNaN = require('../helpers/isNaN');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.12

module.exports = function SameValue(x, y) {
	if (x === y) { // 0 === -0, but they are not identical.
		if (x === 0) { return 1 / x === 1 / y; }
		return true;
	}
	return $isNaN(x) && $isNaN(y);
};

}, function(modId) { var map = {"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294875, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');
var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');
var isSamePropertyDescriptor = require('../helpers/isSamePropertyDescriptor');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsGenericDescriptor = require('./IsGenericDescriptor');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-validateandapplypropertydescriptor
// https://www.ecma-international.org/ecma-262/8.0/#sec-validateandapplypropertydescriptor

// eslint-disable-next-line max-lines-per-function, max-statements, max-params
module.exports = function ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current) {
	// this uses the ES2017+ logic, since it fixes a number of bugs in the ES2015 logic.
	var oType = Type(O);
	if (oType !== 'Undefined' && oType !== 'Object') {
		throw new $TypeError('Assertion failed: O must be undefined or an Object');
	}
	if (Type(extensible) !== 'Boolean') {
		throw new $TypeError('Assertion failed: extensible must be a Boolean');
	}
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
	}
	if (Type(current) !== 'Undefined' && !isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, current)) {
		throw new $TypeError('Assertion failed: current must be a Property Descriptor, or undefined');
	}
	if (oType !== 'Undefined' && !IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: if O is not undefined, P must be a Property Key');
	}
	if (Type(current) === 'Undefined') {
		if (!extensible) {
			return false;
		}
		if (IsGenericDescriptor(Desc) || IsDataDescriptor(Desc)) {
			if (oType !== 'Undefined') {
				DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					{
						'[[Configurable]]': Desc['[[Configurable]]'],
						'[[Enumerable]]': Desc['[[Enumerable]]'],
						'[[Value]]': Desc['[[Value]]'],
						'[[Writable]]': Desc['[[Writable]]']
					}
				);
			}
		} else {
			if (!IsAccessorDescriptor(Desc)) {
				throw new $TypeError('Assertion failed: Desc is not an accessor descriptor');
			}
			if (oType !== 'Undefined') {
				return DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					Desc
				);
			}
		}
		return true;
	}
	if (IsGenericDescriptor(Desc) && !('[[Configurable]]' in Desc) && !('[[Enumerable]]' in Desc)) {
		return true;
	}
	if (isSamePropertyDescriptor({ SameValue: SameValue }, Desc, current)) {
		return true; // removed by ES2017, but should still be correct
	}
	// "if every field in Desc is absent, return true" can't really match the assertion that it's a Property Descriptor
	if (!current['[[Configurable]]']) {
		if (Desc['[[Configurable]]']) {
			return false;
		}
		if ('[[Enumerable]]' in Desc && !Desc['[[Enumerable]]'] === !!current['[[Enumerable]]']) {
			return false;
		}
	}
	if (IsGenericDescriptor(Desc)) {
		// no further validation is required.
	} else if (IsDataDescriptor(current) !== IsDataDescriptor(Desc)) {
		if (!current['[[Configurable]]']) {
			return false;
		}
		if (IsDataDescriptor(current)) {
			if (oType !== 'Undefined') {
				DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					{
						'[[Configurable]]': current['[[Configurable]]'],
						'[[Enumerable]]': current['[[Enumerable]]'],
						'[[Get]]': undefined
					}
				);
			}
		} else if (oType !== 'Undefined') {
			DefineOwnProperty(
				IsDataDescriptor,
				SameValue,
				FromPropertyDescriptor,
				O,
				P,
				{
					'[[Configurable]]': current['[[Configurable]]'],
					'[[Enumerable]]': current['[[Enumerable]]'],
					'[[Value]]': undefined
				}
			);
		}
	} else if (IsDataDescriptor(current) && IsDataDescriptor(Desc)) {
		if (!current['[[Configurable]]'] && !current['[[Writable]]']) {
			if ('[[Writable]]' in Desc && Desc['[[Writable]]']) {
				return false;
			}
			if ('[[Value]]' in Desc && !SameValue(Desc['[[Value]]'], current['[[Value]]'])) {
				return false;
			}
			return true;
		}
	} else if (IsAccessorDescriptor(current) && IsAccessorDescriptor(Desc)) {
		if (!current['[[Configurable]]']) {
			if ('[[Set]]' in Desc && !SameValue(Desc['[[Set]]'], current['[[Set]]'])) {
				return false;
			}
			if ('[[Get]]' in Desc && !SameValue(Desc['[[Get]]'], current['[[Get]]'])) {
				return false;
			}
			return true;
		}
	} else {
		throw new $TypeError('Assertion failed: current and Desc are not both data, both accessors, or one accessor and one data.');
	}
	if (oType !== 'Undefined') {
		return DefineOwnProperty(
			IsDataDescriptor,
			SameValue,
			FromPropertyDescriptor,
			O,
			P,
			Desc
		);
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/DefineOwnProperty":1597942294647,"../helpers/isPropertyDescriptor":1597942294599,"../helpers/isSamePropertyDescriptor":1597942294648,"./FromPropertyDescriptor":1597942294876,"./IsAccessorDescriptor":1597942294866,"./IsDataDescriptor":1597942294867,"./IsGenericDescriptor":1597942294877,"./IsPropertyKey":1597942294870,"./SameValue":1597942294874,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294876, function(require, module, exports) {


var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-frompropertydescriptor

module.exports = function FromPropertyDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return Desc;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	var obj = {};
	if ('[[Value]]' in Desc) {
		obj.value = Desc['[[Value]]'];
	}
	if ('[[Writable]]' in Desc) {
		obj.writable = Desc['[[Writable]]'];
	}
	if ('[[Get]]' in Desc) {
		obj.get = Desc['[[Get]]'];
	}
	if ('[[Set]]' in Desc) {
		obj.set = Desc['[[Set]]'];
	}
	if ('[[Enumerable]]' in Desc) {
		obj.enumerable = Desc['[[Enumerable]]'];
	}
	if ('[[Configurable]]' in Desc) {
		obj.configurable = Desc['[[Configurable]]'];
	}
	return obj;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294877, function(require, module, exports) {


var assertRecord = require('../helpers/assertRecord');

var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isgenericdescriptor

module.exports = function IsGenericDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!IsAccessorDescriptor(Desc) && !IsDataDescriptor(Desc)) {
		return true;
	}

	return false;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./IsAccessorDescriptor":1597942294866,"./IsDataDescriptor":1597942294867,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294878, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

var has = require('has');

var IsArray = require('./IsArray');
var IsPropertyKey = require('./IsPropertyKey');
var IsRegExp = require('./IsRegExp');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarygetownproperty

module.exports = function OrdinaryGetOwnProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: O must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	if (!has(O, P)) {
		return void 0;
	}
	if (!$gOPD) {
		// ES3 / IE 8 fallback
		var arrayLength = IsArray(O) && P === 'length';
		var regexLastIndex = IsRegExp(O) && P === 'lastIndex';
		return {
			'[[Configurable]]': !(arrayLength || regexLastIndex),
			'[[Enumerable]]': $isEnumerable(O, P),
			'[[Value]]': O[P],
			'[[Writable]]': true
		};
	}
	return ToPropertyDescriptor($gOPD(O, P));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/callBound":1597942294577,"./IsArray":1597942294865,"./IsPropertyKey":1597942294870,"./IsRegExp":1597942294879,"./ToPropertyDescriptor":1597942294871,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294879, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $match = GetIntrinsic('%Symbol.match%', true);

var hasRegExpMatcher = require('is-regex');

var ToBoolean = require('./ToBoolean');

// https://ecma-international.org/ecma-262/6.0/#sec-isregexp

module.exports = function IsRegExp(argument) {
	if (!argument || typeof argument !== 'object') {
		return false;
	}
	if ($match) {
		var isRegExp = argument[$match];
		if (typeof isRegExp !== 'undefined') {
			return ToBoolean(isRegExp);
		}
	}
	return hasRegExpMatcher(argument);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToBoolean":1597942294872}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294880, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $String = GetIntrinsic('%String%');
var $TypeError = GetIntrinsic('%TypeError%');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tostring

module.exports = function ToString(argument) {
	if (typeof argument === 'symbol') {
		throw new $TypeError('Cannot convert a Symbol value to a string');
	}
	return $String(argument);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294881, function(require, module, exports) {


var ToNumber = require('./ToNumber');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.6

module.exports = function ToUint32(x) {
	return ToNumber(x) >>> 0;
};

}, function(modId) { var map = {"./ToNumber":1597942294856}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294882, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Array = GetIntrinsic('%Array%');
var $species = GetIntrinsic('%Symbol.species%', true);
var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var IsArray = require('./IsArray');
var IsConstructor = require('./IsConstructor');
var IsInteger = require('./IsInteger');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-arrayspeciescreate

module.exports = function ArraySpeciesCreate(originalArray, length) {
	if (!IsInteger(length) || length < 0) {
		throw new $TypeError('Assertion failed: length must be an integer >= 0');
	}
	var len = length === 0 ? 0 : length;
	var C;
	var isArray = IsArray(originalArray);
	if (isArray) {
		C = Get(originalArray, 'constructor');
		// TODO: figure out how to make a cross-realm normal Array, a same-realm Array
		// if (IsConstructor(C)) {
		// 	if C is another realm's Array, C = undefined
		// 	Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(Array))) === null ?
		// }
		if ($species && Type(C) === 'Object') {
			C = Get(C, $species);
			if (C === null) {
				C = void 0;
			}
		}
	}
	if (typeof C === 'undefined') {
		return $Array(len);
	}
	if (!IsConstructor(C)) {
		throw new $TypeError('C must be a constructor');
	}
	return new C(len); // Construct(C, len);
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294883,"./IsArray":1597942294865,"./IsConstructor":1597942294884,"./IsInteger":1597942294862,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294883, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var inspect = require('object-inspect');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

/**
 * 7.3.1 Get (O, P) - https://ecma-international.org/ecma-262/6.0/#sec-get-o-p
 * 1. Assert: Type(O) is Object.
 * 2. Assert: IsPropertyKey(P) is true.
 * 3. Return O.[[Get]](P, O).
 */

module.exports = function Get(O, P) {
	// 7.3.1.1
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	// 7.3.1.2
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true, got ' + inspect(P));
	}
	// 7.3.1.3
	return O[P];
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294870,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294884, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic.js');

var $construct = GetIntrinsic('%Reflect.construct%', true);

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');
try {
	DefinePropertyOrThrow({}, '', { '[[Get]]': function () {} });
} catch (e) {
	// Accessor properties aren't supported
	DefinePropertyOrThrow = null;
}

// https://www.ecma-international.org/ecma-262/6.0/#sec-isconstructor

if (DefinePropertyOrThrow && $construct) {
	var isConstructorMarker = {};
	var badArrayLike = {};
	DefinePropertyOrThrow(badArrayLike, 'length', {
		'[[Get]]': function () {
			throw isConstructorMarker;
		},
		'[[Enumerable]]': true
	});

	module.exports = function IsConstructor(argument) {
		try {
			// `Reflect.construct` invokes `IsConstructor(target)` before `Get(args, 'length')`:
			$construct(argument, badArrayLike);
		} catch (err) {
			return err === isConstructorMarker;
		}
	};
} else {
	module.exports = function IsConstructor(argument) {
		// unfortunately there's no way to truly check this without try/catch `new argument` in old environments
		return typeof argument === 'function' && !!argument.prototype;
	};
}

}, function(modId) { var map = {"../GetIntrinsic.js":1597942294567,"./DefinePropertyOrThrow":1597942294885}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294885, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');
var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-definepropertyorthrow

module.exports = function DefinePropertyOrThrow(O, P, desc) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	var Desc = isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, desc) ? desc : ToPropertyDescriptor(desc);
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc is not a valid Property Descriptor');
	}

	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		Desc
	);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPropertyDescriptor":1597942294599,"../helpers/DefineOwnProperty":1597942294647,"./FromPropertyDescriptor":1597942294876,"./IsAccessorDescriptor":1597942294866,"./IsDataDescriptor":1597942294867,"./IsPropertyKey":1597942294870,"./SameValue":1597942294874,"./ToPropertyDescriptor":1597942294871,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294886, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');
var callBound = require('../helpers/callBound');

var $apply = GetIntrinsic('%Reflect.apply%', true) || callBound('%Function.prototype.apply%');

// https://www.ecma-international.org/ecma-262/6.0/#sec-call

module.exports = function Call(F, V) {
	var args = arguments.length > 2 ? arguments[2] : [];
	return $apply(F, V, args);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294887, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var SameValue = require('./SameValue');
var ToNumber = require('./ToNumber');
var ToString = require('./ToString');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring

module.exports = function CanonicalNumericIndexString(argument) {
	if (Type(argument) !== 'String') {
		throw new $TypeError('Assertion failed: `argument` must be a String');
	}
	if (argument === '-0') { return -0; }
	var n = ToNumber(argument);
	if (SameValue(ToString(n), argument)) { return n; }
	return void 0;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./SameValue":1597942294874,"./ToNumber":1597942294856,"./ToString":1597942294880,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294888, function(require, module, exports) {


var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var IsDataDescriptor = require('./IsDataDescriptor');
var IsGenericDescriptor = require('./IsGenericDescriptor');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-completepropertydescriptor

module.exports = function CompletePropertyDescriptor(Desc) {
	/* eslint no-param-reassign: 0 */
	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (IsGenericDescriptor(Desc) || IsDataDescriptor(Desc)) {
		if (!has(Desc, '[[Value]]')) {
			Desc['[[Value]]'] = void 0;
		}
		if (!has(Desc, '[[Writable]]')) {
			Desc['[[Writable]]'] = false;
		}
	} else {
		if (!has(Desc, '[[Get]]')) {
			Desc['[[Get]]'] = void 0;
		}
		if (!has(Desc, '[[Set]]')) {
			Desc['[[Set]]'] = void 0;
		}
	}
	if (!has(Desc, '[[Enumerable]]')) {
		Desc['[[Enumerable]]'] = false;
	}
	if (!has(Desc, '[[Configurable]]')) {
		Desc['[[Configurable]]'] = false;
	}
	return Desc;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./IsDataDescriptor":1597942294867,"./IsGenericDescriptor":1597942294877,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294889, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var OrdinaryGetOwnProperty = require('./OrdinaryGetOwnProperty');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsExtensible = require('./IsExtensible');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-createdataproperty

module.exports = function CreateDataProperty(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}
	var oldDesc = OrdinaryGetOwnProperty(O, P);
	var extensible = !oldDesc || IsExtensible(O);
	var immutable = oldDesc && (!oldDesc['[[Writable]]'] || !oldDesc['[[Configurable]]']);
	if (immutable || !extensible) {
		return false;
	}
	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		{
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Value]]': V,
			'[[Writable]]': true
		}
	);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/DefineOwnProperty":1597942294647,"./FromPropertyDescriptor":1597942294876,"./OrdinaryGetOwnProperty":1597942294878,"./IsDataDescriptor":1597942294867,"./IsExtensible":1597942294869,"./IsPropertyKey":1597942294870,"./SameValue":1597942294874,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294890, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var CreateDataProperty = require('./CreateDataProperty');
var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// // https://ecma-international.org/ecma-262/6.0/#sec-createdatapropertyorthrow

module.exports = function CreateDataPropertyOrThrow(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}
	var success = CreateDataProperty(O, P, V);
	if (!success) {
		throw new $TypeError('unable to create data property');
	}
	return success;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./CreateDataProperty":1597942294889,"./IsPropertyKey":1597942294870,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294891, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $replace = callBound('String.prototype.replace');

var RequireObjectCoercible = require('./RequireObjectCoercible');
var ToString = require('./ToString');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-createhtml

module.exports = function CreateHTML(string, tag, attribute, value) {
	if (Type(tag) !== 'String' || Type(attribute) !== 'String') {
		throw new $TypeError('Assertion failed: `tag` and `attribute` must be strings');
	}
	var str = RequireObjectCoercible(string);
	var S = ToString(str);
	var p1 = '<' + tag;
	if (attribute !== '') {
		var V = ToString(value);
		var escapedV = $replace(V, /\x22/g, '&quot;');
		p1 += '\x20' + attribute + '\x3D\x22' + escapedV + '\x22';
	}
	return p1 + '>' + S + '</' + tag + '>';
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./RequireObjectCoercible":1597942294892,"./ToString":1597942294880,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294892, function(require, module, exports) {


module.exports = require('../5/CheckObjectCoercible');

}, function(modId) { var map = {"../5/CheckObjectCoercible":1597942294580}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294893, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-createiterresultobject

module.exports = function CreateIterResultObject(value, done) {
	if (Type(done) !== 'Boolean') {
		throw new $TypeError('Assertion failed: Type(done) is not Boolean');
	}
	return {
		value: value,
		done: done
	};
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294894, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var callBound = require('../helpers/callBound');

var $TypeError = GetIntrinsic('%TypeError%');
var $indexOf = callBound('Array.prototype.indexOf', true) || callBound('String.prototype.indexOf');
var $push = callBound('Array.prototype.push');

var Get = require('./Get');
var IsArray = require('./IsArray');
var ToLength = require('./ToLength');
var ToString = require('./ToString');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-createlistfromarraylike
module.exports = function CreateListFromArrayLike(obj) {
	var elementTypes = arguments.length > 1
		? arguments[1]
		: ['Undefined', 'Null', 'Boolean', 'String', 'Symbol', 'Number', 'Object'];

	if (Type(obj) !== 'Object') {
		throw new $TypeError('Assertion failed: `obj` must be an Object');
	}
	if (!IsArray(elementTypes)) {
		throw new $TypeError('Assertion failed: `elementTypes`, if provided, must be an array');
	}
	var len = ToLength(Get(obj, 'length'));
	var list = [];
	var index = 0;
	while (index < len) {
		var indexName = ToString(index);
		var next = Get(obj, indexName);
		var nextType = Type(next);
		if ($indexOf(elementTypes, nextType) < 0) {
			throw new $TypeError('item type ' + nextType + ' is not a valid elementType');
		}
		$push(list, next);
		index += 1;
	}
	return list;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Get":1597942294883,"./IsArray":1597942294865,"./ToLength":1597942294895,"./ToString":1597942294880,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294895, function(require, module, exports) {


var MAX_SAFE_INTEGER = require('../helpers/maxSafeInteger');

var ToInteger = require('./ToInteger');

module.exports = function ToLength(argument) {
	var len = ToInteger(argument);
	if (len <= 0) { return 0; } // includes converting -0 to +0
	if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
	return len;
};

}, function(modId) { var map = {"../helpers/maxSafeInteger":1597942294632,"./ToInteger":1597942294896}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294896, function(require, module, exports) {


var ES5ToInteger = require('../5/ToInteger');

var ToNumber = require('./ToNumber');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tointeger

module.exports = function ToInteger(value) {
	var number = ToNumber(value);
	return ES5ToInteger(number);
};

}, function(modId) { var map = {"../5/ToInteger":1597942294602,"./ToNumber":1597942294856}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294897, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-createmethodproperty

module.exports = function CreateMethodProperty(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	var newDesc = {
		'[[Configurable]]': true,
		'[[Enumerable]]': false,
		'[[Value]]': V,
		'[[Writable]]': true
	};
	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		newDesc
	);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/DefineOwnProperty":1597942294647,"./FromPropertyDescriptor":1597942294876,"./IsDataDescriptor":1597942294867,"./IsPropertyKey":1597942294870,"./SameValue":1597942294874,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294898, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $EvalError = GetIntrinsic('%EvalError%');

var DayWithinYear = require('./DayWithinYear');
var InLeapYear = require('./InLeapYear');
var MonthFromTime = require('./MonthFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.5

module.exports = function DateFromTime(t) {
	var m = MonthFromTime(t);
	var d = DayWithinYear(t);
	if (m === 0) {
		return d + 1;
	}
	if (m === 1) {
		return d - 30;
	}
	var leap = InLeapYear(t);
	if (m === 2) {
		return d - 58 - leap;
	}
	if (m === 3) {
		return d - 89 - leap;
	}
	if (m === 4) {
		return d - 119 - leap;
	}
	if (m === 5) {
		return d - 150 - leap;
	}
	if (m === 6) {
		return d - 180 - leap;
	}
	if (m === 7) {
		return d - 211 - leap;
	}
	if (m === 8) {
		return d - 242 - leap;
	}
	if (m === 9) {
		return d - 272 - leap;
	}
	if (m === 10) {
		return d - 303 - leap;
	}
	if (m === 11) {
		return d - 333 - leap;
	}
	throw new $EvalError('Assertion failed: MonthFromTime returned an impossible value: ' + m);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./DayWithinYear":1597942294899,"./InLeapYear":1597942294903,"./MonthFromTime":1597942294905}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294899, function(require, module, exports) {


var Day = require('./Day');
var DayFromYear = require('./DayFromYear');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.4

module.exports = function DayWithinYear(t) {
	return Day(t) - DayFromYear(YearFromTime(t));
};

}, function(modId) { var map = {"./Day":1597942294900,"./DayFromYear":1597942294901,"./YearFromTime":1597942294902}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294900, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.2

module.exports = function Day(t) {
	return $floor(t / msPerDay);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294901, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function DayFromYear(y) {
	return (365 * (y - 1970)) + $floor((y - 1969) / 4) - $floor((y - 1901) / 100) + $floor((y - 1601) / 400);
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294902, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Date = GetIntrinsic('%Date%');

var callBound = require('../helpers/callBound');

var $getUTCFullYear = callBound('Date.prototype.getUTCFullYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function YearFromTime(t) {
	// largest y such that this.TimeFromYear(y) <= t
	return $getUTCFullYear(new $Date(t));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294903, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $EvalError = GetIntrinsic('%EvalError%');

var DaysInYear = require('./DaysInYear');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function InLeapYear(t) {
	var days = DaysInYear(YearFromTime(t));
	if (days === 365) {
		return 0;
	}
	if (days === 366) {
		return 1;
	}
	throw new $EvalError('Assertion failed: there are not 365 or 366 days in a year, got: ' + days);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./DaysInYear":1597942294904,"./YearFromTime":1597942294902}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294904, function(require, module, exports) {


var mod = require('../helpers/mod');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function DaysInYear(y) {
	if (mod(y, 4) !== 0) {
		return 365;
	}
	if (mod(y, 100) !== 0) {
		return 366;
	}
	if (mod(y, 400) !== 0) {
		return 365;
	}
	return 366;
};

}, function(modId) { var map = {"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294905, function(require, module, exports) {


var DayWithinYear = require('./DayWithinYear');
var InLeapYear = require('./InLeapYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.4

module.exports = function MonthFromTime(t) {
	var day = DayWithinYear(t);
	if (0 <= day && day < 31) {
		return 0;
	}
	var leap = InLeapYear(t);
	if (31 <= day && day < (59 + leap)) {
		return 1;
	}
	if ((59 + leap) <= day && day < (90 + leap)) {
		return 2;
	}
	if ((90 + leap) <= day && day < (120 + leap)) {
		return 3;
	}
	if ((120 + leap) <= day && day < (151 + leap)) {
		return 4;
	}
	if ((151 + leap) <= day && day < (181 + leap)) {
		return 5;
	}
	if ((181 + leap) <= day && day < (212 + leap)) {
		return 6;
	}
	if ((212 + leap) <= day && day < (243 + leap)) {
		return 7;
	}
	if ((243 + leap) <= day && day < (273 + leap)) {
		return 8;
	}
	if ((273 + leap) <= day && day < (304 + leap)) {
		return 9;
	}
	if ((304 + leap) <= day && day < (334 + leap)) {
		return 10;
	}
	if ((334 + leap) <= day && day < (365 + leap)) {
		return 11;
	}
};

}, function(modId) { var map = {"./DayWithinYear":1597942294899,"./InLeapYear":1597942294903}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294906, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-deletepropertyorthrow

module.exports = function DeletePropertyOrThrow(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	// eslint-disable-next-line no-param-reassign
	var success = delete O[P];
	if (!success) {
		throw new $TypeError('Attempt to delete property failed.');
	}
	return success;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294870,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294907, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var objectKeys = require('object-keys');

var callBound = require('../helpers/callBound');

var callBind = require('../helpers/callBind');

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');
var $pushApply = callBind.apply(GetIntrinsic('%Array.prototype.push%'));

var forEach = require('../helpers/forEach');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/8.0/#sec-enumerableownproperties

module.exports = function EnumerableOwnProperties(O, kind) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	var keys = objectKeys(O);
	if (kind === 'key') {
		return keys;
	}
	if (kind === 'value' || kind === 'key+value') {
		var results = [];
		forEach(keys, function (key) {
			if ($isEnumerable(O, key)) {
				$pushApply(results, [
					kind === 'value' ? O[key] : [key, O[key]]
				]);
			}
		});
		return results;
	}
	throw new $TypeError('Assertion failed: "kind" is not "key", "value", or "key+value": ' + kind);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"../helpers/callBind":1597942294578,"../helpers/forEach":1597942294720,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294908, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var getIteratorMethod = require('../helpers/getIteratorMethod');
var AdvanceStringIndex = require('./AdvanceStringIndex');
var Call = require('./Call');
var GetMethod = require('./GetMethod');
var IsArray = require('./IsArray');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-getiterator

module.exports = function GetIterator(obj, method) {
	var actualMethod = method;
	if (arguments.length < 2) {
		actualMethod = getIteratorMethod(
			{
				AdvanceStringIndex: AdvanceStringIndex,
				GetMethod: GetMethod,
				IsArray: IsArray,
				Type: Type
			},
			obj
		);
	}
	var iterator = Call(actualMethod, obj);
	if (Type(iterator) !== 'Object') {
		throw new $TypeError('iterator must return an object');
	}

	return iterator;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getIteratorMethod":1597942294683,"./AdvanceStringIndex":1597942294861,"./Call":1597942294886,"./GetMethod":1597942294909,"./IsArray":1597942294865,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294909, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var GetV = require('./GetV');
var IsCallable = require('./IsCallable');
var IsPropertyKey = require('./IsPropertyKey');

/**
 * 7.3.9 - https://ecma-international.org/ecma-262/6.0/#sec-getmethod
 * 1. Assert: IsPropertyKey(P) is true.
 * 2. Let func be GetV(O, P).
 * 3. ReturnIfAbrupt(func).
 * 4. If func is either undefined or null, return undefined.
 * 5. If IsCallable(func) is false, throw a TypeError exception.
 * 6. Return func.
 */

module.exports = function GetMethod(O, P) {
	// 7.3.9.1
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	// 7.3.9.2
	var func = GetV(O, P);

	// 7.3.9.4
	if (func == null) {
		return void 0;
	}

	// 7.3.9.5
	if (!IsCallable(func)) {
		throw new $TypeError(P + 'is not a function');
	}

	// 7.3.9.6
	return func;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./GetV":1597942294910,"./IsCallable":1597942294873,"./IsPropertyKey":1597942294870}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294910, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var ToObject = require('./ToObject');

/**
 * 7.3.2 GetV (V, P)
 * 1. Assert: IsPropertyKey(P) is true.
 * 2. Let O be ToObject(V).
 * 3. ReturnIfAbrupt(O).
 * 4. Return O.[[Get]](P, V).
 */

module.exports = function GetV(V, P) {
	// 7.3.2.1
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	// 7.3.2.2-3
	var O = ToObject(V);

	// 7.3.2.4
	return O[P];
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294870,"./ToObject":1597942294911}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294911, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Object = GetIntrinsic('%Object%');

var RequireObjectCoercible = require('./RequireObjectCoercible');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toobject

module.exports = function ToObject(value) {
	RequireObjectCoercible(value);
	return $Object(value);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./RequireObjectCoercible":1597942294892}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294912, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var hasSymbols = require('has-symbols')();

var $TypeError = GetIntrinsic('%TypeError%');

var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%');
var $gOPS = hasSymbols && GetIntrinsic('%Object.getOwnPropertySymbols%');
var keys = require('object-keys');

var esType = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-getownpropertykeys

module.exports = function GetOwnPropertyKeys(O, Type) {
	if (esType(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (Type === 'Symbol') {
		return $gOPS ? $gOPS(O) : [];
	}
	if (Type === 'String') {
		if (!$gOPN) {
			return keys(O);
		}
		return $gOPN(O);
	}
	throw new $TypeError('Assertion failed: `Type` must be `"String"` or `"Symbol"`');
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294913, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Function = GetIntrinsic('%Function%');
var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var IsConstructor = require('./IsConstructor');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-getprototypefromconstructor

module.exports = function GetPrototypeFromConstructor(constructor, intrinsicDefaultProto) {
	var intrinsic = GetIntrinsic(intrinsicDefaultProto); // throws if not a valid intrinsic
	if (!IsConstructor(constructor)) {
		throw new $TypeError('Assertion failed: `constructor` must be a constructor');
	}
	var proto = Get(constructor, 'prototype');
	if (Type(proto) !== 'Object') {
		if (!(constructor instanceof $Function)) {
			// ignore other realms, for now
			throw new $TypeError('cross-realm constructors not currently supported');
		}
		proto = intrinsic;
	}
	return proto;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294883,"./IsConstructor":1597942294884,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294914, function(require, module, exports) {



var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $parseInt = GetIntrinsic('%parseInt%');

var inspect = require('object-inspect');

var regexTester = require('../helpers/regexTester');
var callBound = require('../helpers/callBound');
var every = require('../helpers/every');

var isDigit = regexTester(/^[0-9]$/);

var $charAt = callBound('String.prototype.charAt');
var $strSlice = callBound('String.prototype.slice');

var IsArray = require('./IsArray');
var IsInteger = require('./IsInteger');
var Type = require('./Type');

var canDistinguishSparseFromUndefined = 0 in [undefined]; // IE 6 - 8 have a bug where this returns false

var isStringOrHole = function (capture, index, arr) {
	return Type(capture) === 'String' || (canDistinguishSparseFromUndefined ? !(index in arr) : Type(capture) === 'Undefined');
};

// https://www.ecma-international.org/ecma-262/6.0/#sec-getsubstitution

// eslint-disable-next-line max-statements, max-params, max-lines-per-function
module.exports = function GetSubstitution(matched, str, position, captures, replacement) {
	if (Type(matched) !== 'String') {
		throw new $TypeError('Assertion failed: `matched` must be a String');
	}
	var matchLength = matched.length;

	if (Type(str) !== 'String') {
		throw new $TypeError('Assertion failed: `str` must be a String');
	}
	var stringLength = str.length;

	if (!IsInteger(position) || position < 0 || position > stringLength) {
		throw new $TypeError('Assertion failed: `position` must be a nonnegative integer, and less than or equal to the length of `string`, got ' + inspect(position));
	}

	if (!IsArray(captures) || !every(captures, isStringOrHole)) {
		throw new $TypeError('Assertion failed: `captures` must be a List of Strings, got ' + inspect(captures));
	}

	if (Type(replacement) !== 'String') {
		throw new $TypeError('Assertion failed: `replacement` must be a String');
	}

	var tailPos = position + matchLength;
	var m = captures.length;

	var result = '';
	for (var i = 0; i < replacement.length; i += 1) {
		// if this is a $, and it's not the end of the replacement
		var current = $charAt(replacement, i);
		var isLast = (i + 1) >= replacement.length;
		var nextIsLast = (i + 2) >= replacement.length;
		if (current === '$' && !isLast) {
			var next = $charAt(replacement, i + 1);
			if (next === '$') {
				result += '$';
				i += 1;
			} else if (next === '&') {
				result += matched;
				i += 1;
			} else if (next === '`') {
				result += position === 0 ? '' : $strSlice(str, 0, position - 1);
				i += 1;
			} else if (next === "'") {
				result += tailPos >= stringLength ? '' : $strSlice(str, tailPos);
				i += 1;
			} else {
				var nextNext = nextIsLast ? null : $charAt(replacement, i + 2);
				if (isDigit(next) && next !== '0' && (nextIsLast || !isDigit(nextNext))) {
					// $1 through $9, and not followed by a digit
					var n = $parseInt(next, 10);
					// if (n > m, impl-defined)
					result += (n <= m && Type(captures[n - 1]) === 'Undefined') ? '' : captures[n - 1];
					i += 1;
				} else if (isDigit(next) && (nextIsLast || isDigit(nextNext))) {
					// $00 through $99
					var nn = next + nextNext;
					var nnI = $parseInt(nn, 10) - 1;
					// if nn === '00' or nn > m, impl-defined
					result += (nn <= m && Type(captures[nnI]) === 'Undefined') ? '' : captures[nnI];
					i += 2;
				} else {
					result += '$';
				}
			}
		} else {
			// the final $, or else not a $
			result += $charAt(replacement, i);
		}
	}
	return result;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/regexTester":1597942294624,"../helpers/callBound":1597942294577,"../helpers/every":1597942294649,"./IsArray":1597942294865,"./IsInteger":1597942294862,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294915, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var has = require('has');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-hasownproperty

module.exports = function HasOwnProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	return has(O, P);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294870,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294916, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-hasproperty

module.exports = function HasProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	return P in O;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294870,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294917, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerHour = timeConstants.msPerHour;
var HoursPerDay = timeConstants.HoursPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function HourFromTime(t) {
	return mod($floor(t / msPerHour), HoursPerDay);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294918, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $hasInstance = GetIntrinsic('Symbol.hasInstance', true);

var Call = require('./Call');
var GetMethod = require('./GetMethod');
var IsCallable = require('./IsCallable');
var OrdinaryHasInstance = require('./OrdinaryHasInstance');
var ToBoolean = require('./ToBoolean');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-instanceofoperator

module.exports = function InstanceofOperator(O, C) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	var instOfHandler = $hasInstance ? GetMethod(C, $hasInstance) : void 0;
	if (typeof instOfHandler !== 'undefined') {
		return ToBoolean(Call(instOfHandler, C, [O]));
	}
	if (!IsCallable(C)) {
		throw new $TypeError('`C` is not Callable');
	}
	return OrdinaryHasInstance(C, O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Call":1597942294886,"./GetMethod":1597942294909,"./IsCallable":1597942294873,"./OrdinaryHasInstance":1597942294919,"./ToBoolean":1597942294872,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294919, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var IsCallable = require('./IsCallable');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinaryhasinstance

module.exports = function OrdinaryHasInstance(C, O) {
	if (IsCallable(C) === false) {
		return false;
	}
	if (Type(O) !== 'Object') {
		return false;
	}
	var P = Get(C, 'prototype');
	if (Type(P) !== 'Object') {
		throw new $TypeError('OrdinaryHasInstance called on an object with an invalid prototype property.');
	}
	return O instanceof C;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294883,"./IsCallable":1597942294873,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294920, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $arraySlice = require('../helpers/callBound')('Array.prototype.slice');

var Call = require('./Call');
var GetV = require('./GetV');
var IsPropertyKey = require('./IsPropertyKey');

// https://ecma-international.org/ecma-262/6.0/#sec-invoke

module.exports = function Invoke(O, P) {
	if (!IsPropertyKey(P)) {
		throw new $TypeError('P must be a Property Key');
	}
	var argumentsList = $arraySlice(arguments, 2);
	var func = GetV(O, P);
	return Call(func, O, argumentsList);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Call":1597942294886,"./GetV":1597942294910,"./IsPropertyKey":1597942294870}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294921, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $isConcatSpreadable = GetIntrinsic('%Symbol.isConcatSpreadable%', true);

var Get = require('./Get');
var IsArray = require('./IsArray');
var ToBoolean = require('./ToBoolean');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable

module.exports = function IsConcatSpreadable(O) {
	if (Type(O) !== 'Object') {
		return false;
	}
	if ($isConcatSpreadable) {
		var spreadable = Get(O, $isConcatSpreadable);
		if (typeof spreadable !== 'undefined') {
			return ToBoolean(spreadable);
		}
	}
	return IsArray(O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294883,"./IsArray":1597942294865,"./ToBoolean":1597942294872,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294922, function(require, module, exports) {


var callBound = require('../helpers/callBound');

var $PromiseThen = callBound('Promise.prototype.then', true);

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ispromise

module.exports = function IsPromise(x) {
	if (Type(x) !== 'Object') {
		return false;
	}
	if (!$PromiseThen) { // Promises are not supported
		return false;
	}
	try {
		$PromiseThen(x); // throws if not a promise
	} catch (e) {
		return false;
	}
	return true;
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294923, function(require, module, exports) {


var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');

var Type = require('./Type');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');

// https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type

module.exports = function IsPropertyDescriptor(Desc) {
	return isPropertyDescriptor({
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor,
		Type: Type
	}, Desc);
};

}, function(modId) { var map = {"../helpers/isPropertyDescriptor":1597942294599,"./Type":1597942294858,"./IsDataDescriptor":1597942294867,"./IsAccessorDescriptor":1597942294866}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294924, function(require, module, exports) {


var callBound = require('../helpers/callBound');
var $arrayPush = callBound('Array.prototype.push');

var GetIterator = require('./GetIterator');
var IteratorStep = require('./IteratorStep');
var IteratorValue = require('./IteratorValue');

// https://www.ecma-international.org/ecma-262/8.0/#sec-iterabletolist

module.exports = function IterableToList(items, method) {
	var iterator = GetIterator(items, method);
	var values = [];
	var next = true;
	while (next) {
		next = IteratorStep(iterator);
		if (next) {
			var nextValue = IteratorValue(next);
			$arrayPush(values, nextValue);
		}
	}
	return values;
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./GetIterator":1597942294908,"./IteratorStep":1597942294925,"./IteratorValue":1597942294928}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294925, function(require, module, exports) {


var IteratorComplete = require('./IteratorComplete');
var IteratorNext = require('./IteratorNext');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorstep

module.exports = function IteratorStep(iterator) {
	var result = IteratorNext(iterator);
	var done = IteratorComplete(result);
	return done === true ? false : result;
};


}, function(modId) { var map = {"./IteratorComplete":1597942294926,"./IteratorNext":1597942294927}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294926, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var ToBoolean = require('./ToBoolean');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorcomplete

module.exports = function IteratorComplete(iterResult) {
	if (Type(iterResult) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(iterResult) is not Object');
	}
	return ToBoolean(Get(iterResult, 'done'));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294883,"./ToBoolean":1597942294872,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294927, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Invoke = require('./Invoke');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratornext

module.exports = function IteratorNext(iterator, value) {
	var result = Invoke(iterator, 'next', arguments.length < 2 ? [] : [value]);
	if (Type(result) !== 'Object') {
		throw new $TypeError('iterator next must return an object');
	}
	return result;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Invoke":1597942294920,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294928, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorvalue

module.exports = function IteratorValue(iterResult) {
	if (Type(iterResult) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(iterResult) is not Object');
	}
	return Get(iterResult, 'value');
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294883,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294929, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Call = require('./Call');
var GetMethod = require('./GetMethod');
var IsCallable = require('./IsCallable');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorclose

module.exports = function IteratorClose(iterator, completion) {
	if (Type(iterator) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(iterator) is not Object');
	}
	if (!IsCallable(completion)) {
		throw new $TypeError('Assertion failed: completion is not a thunk for a Completion Record');
	}
	var completionThunk = completion;

	var iteratorReturn = GetMethod(iterator, 'return');

	if (typeof iteratorReturn === 'undefined') {
		return completionThunk();
	}

	var completionRecord;
	try {
		var innerResult = Call(iteratorReturn, iterator, []);
	} catch (e) {
		// if we hit here, then "e" is the innerResult completion that needs re-throwing

		// if the completion is of type "throw", this will throw.
		completionThunk();
		completionThunk = null; // ensure it's not called twice.

		// if not, then return the innerResult completion
		throw e;
	}
	completionRecord = completionThunk(); // if innerResult worked, then throw if the completion does
	completionThunk = null; // ensure it's not called twice.

	if (Type(innerResult) !== 'Object') {
		throw new $TypeError('iterator .return must return an object');
	}

	return completionRecord;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Call":1597942294886,"./GetMethod":1597942294909,"./IsCallable":1597942294873,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294930, function(require, module, exports) {


var $isFinite = require('../helpers/isFinite');
var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.13

module.exports = function MakeDate(day, time) {
	if (!$isFinite(day) || !$isFinite(time)) {
		return NaN;
	}
	return (day * msPerDay) + time;
};

}, function(modId) { var map = {"../helpers/isFinite":1597942294575,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294931, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');
var $DateUTC = GetIntrinsic('%Date.UTC%');

var mod = require('../helpers/mod');
var $isFinite = require('../helpers/isFinite');

var DateFromTime = require('./DateFromTime');
var Day = require('./Day');
var MonthFromTime = require('./MonthFromTime');
var ToInteger = require('./ToInteger');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.12

module.exports = function MakeDay(year, month, date) {
	if (!$isFinite(year) || !$isFinite(month) || !$isFinite(date)) {
		return NaN;
	}
	var y = ToInteger(year);
	var m = ToInteger(month);
	var dt = ToInteger(date);
	var ym = y + $floor(m / 12);
	var mn = mod(m, 12);
	var t = $DateUTC(ym, mn, 1);
	if (YearFromTime(t) !== ym || MonthFromTime(t) !== mn || DateFromTime(t) !== 1) {
		return NaN;
	}
	return Day(t) + dt - 1;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/isFinite":1597942294575,"./DateFromTime":1597942294898,"./Day":1597942294900,"./MonthFromTime":1597942294905,"./ToInteger":1597942294896,"./YearFromTime":1597942294902}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294932, function(require, module, exports) {


var $isFinite = require('../helpers/isFinite');
var timeConstants = require('../helpers/timeConstants');
var msPerSecond = timeConstants.msPerSecond;
var msPerMinute = timeConstants.msPerMinute;
var msPerHour = timeConstants.msPerHour;

var ToInteger = require('./ToInteger');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.11

module.exports = function MakeTime(hour, min, sec, ms) {
	if (!$isFinite(hour) || !$isFinite(min) || !$isFinite(sec) || !$isFinite(ms)) {
		return NaN;
	}
	var h = ToInteger(hour);
	var m = ToInteger(min);
	var s = ToInteger(sec);
	var milli = ToInteger(ms);
	var t = (h * msPerHour) + (m * msPerMinute) + (s * msPerSecond) + milli;
	return t;
};

}, function(modId) { var map = {"../helpers/isFinite":1597942294575,"../helpers/timeConstants":1597942294584,"./ToInteger":1597942294896}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294933, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerMinute = timeConstants.msPerMinute;
var MinutesPerHour = timeConstants.MinutesPerHour;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function MinFromTime(t) {
	return mod($floor(t / msPerMinute), MinutesPerHour);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294934, function(require, module, exports) {


var mod = require('../helpers/mod');

// https://ecma-international.org/ecma-262/5.1/#sec-5.2

module.exports = function modulo(x, y) {
	return mod(x, y);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294935, function(require, module, exports) {


var mod = require('../helpers/mod');
var msPerSecond = require('../helpers/timeConstants').msPerSecond;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function msFromTime(t) {
	return mod(t, msPerSecond);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294936, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $ObjectCreate = GetIntrinsic('%Object.create%', true);
var $TypeError = GetIntrinsic('%TypeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');

var Type = require('./Type');

var hasProto = !({ __proto__: null } instanceof Object);

// https://www.ecma-international.org/ecma-262/6.0/#sec-objectcreate

module.exports = function ObjectCreate(proto, internalSlotsList) {
	if (proto !== null && Type(proto) !== 'Object') {
		throw new $TypeError('Assertion failed: `proto` must be null or an object');
	}
	var slots = arguments.length < 2 ? [] : internalSlotsList;
	if (slots.length > 0) {
		throw new $SyntaxError('es-abstract does not yet support internal slots');
	}

	if ($ObjectCreate) {
		return $ObjectCreate(proto);
	}
	if (hasProto) {
		return { __proto__: proto };
	}

	if (proto === null) {
		throw new $SyntaxError('native Object.create support is required to create null objects');
	}
	var T = function T() {};
	T.prototype = proto;
	return new T();
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294937, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $setProto = require('../helpers/setProto');

var OrdinaryGetPrototypeOf = require('./OrdinaryGetPrototypeOf');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/7.0/#sec-ordinarysetprototypeof

module.exports = function OrdinarySetPrototypeOf(O, V) {
	if (Type(V) !== 'Object' && Type(V) !== 'Null') {
		throw new $TypeError('Assertion failed: V must be Object or Null');
	}
	/*
    var extensible = IsExtensible(O);
    var current = OrdinaryGetPrototypeOf(O);
    if (SameValue(V, current)) {
        return true;
    }
    if (!extensible) {
        return false;
    }
    */
	try {
		$setProto(O, V);
	} catch (e) {
		return false;
	}
	return OrdinaryGetPrototypeOf(O) === V;
	/*
    var p = V;
    var done = false;
    while (!done) {
        if (p === null) {
            done = true;
        } else if (SameValue(p, O)) {
            return false;
        } else {
            if (wat) {
                done = true;
            } else {
                p = p.[[Prototype]];
            }
        }
     }
     O.[[Prototype]] = V;
     return true;
     */
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/setProto":1597942294826,"./OrdinaryGetPrototypeOf":1597942294938,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294938, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $getProto = require('../helpers/getProto');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/7.0/#sec-ordinarygetprototypeof

module.exports = function OrdinaryGetPrototypeOf(O) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: O must be an Object');
	}
	if (!$getProto) {
		throw new $TypeError('This environment does not support fetching prototypes.');
	}
	return $getProto(O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getProto":1597942294824,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294939, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinaryhasproperty

module.exports = function OrdinaryHasProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	return P in O;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294870,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294940, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var regexExec = require('../helpers/callBound')('RegExp.prototype.exec');

var Call = require('./Call');
var Get = require('./Get');
var IsCallable = require('./IsCallable');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-regexpexec

module.exports = function RegExpExec(R, S) {
	if (Type(R) !== 'Object') {
		throw new $TypeError('Assertion failed: `R` must be an Object');
	}
	if (Type(S) !== 'String') {
		throw new $TypeError('Assertion failed: `S` must be a String');
	}
	var exec = Get(R, 'exec');
	if (IsCallable(exec)) {
		var result = Call(exec, R, [S]);
		if (result === null || Type(result) === 'Object') {
			return result;
		}
		throw new $TypeError('"exec" method must return `null` or an Object');
	}
	return regexExec(R, S);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Call":1597942294886,"./Get":1597942294883,"./IsCallable":1597942294873,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294941, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var SameValue = require('./SameValue');

// https://www.ecma-international.org/ecma-262/7.0/#sec-samevaluenonnumber

module.exports = function SameValueNonNumber(x, y) {
	if (typeof x === 'number' || typeof x !== typeof y) {
		throw new $TypeError('SameValueNonNumber requires two non-number values of the same type.');
	}
	return SameValue(x, y);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./SameValue":1597942294874}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294942, function(require, module, exports) {


var $isNaN = require('../helpers/isNaN');

// https://www.ecma-international.org/ecma-262/6.0/#sec-samevaluezero

module.exports = function SameValueZero(x, y) {
	return (x === y) || ($isNaN(x) && $isNaN(y));
};

}, function(modId) { var map = {"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294943, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerSecond = timeConstants.msPerSecond;
var SecondsPerMinute = timeConstants.SecondsPerMinute;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function SecFromTime(t) {
	return mod($floor(t / msPerSecond), SecondsPerMinute);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294944, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// IE 9 does not throw in strict mode when writability/configurability/extensibility is violated
var noThrowOnStrictViolation = (function () {
	try {
		delete [].length;
		return true;
	} catch (e) {
		return false;
	}
}());

// https://ecma-international.org/ecma-262/6.0/#sec-set-o-p-v-throw

module.exports = function Set(O, P, V, Throw) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	if (Type(Throw) !== 'Boolean') {
		throw new $TypeError('Assertion failed: `Throw` must be a Boolean');
	}
	if (Throw) {
		O[P] = V; // eslint-disable-line no-param-reassign
		if (noThrowOnStrictViolation && !SameValue(O[P], V)) {
			throw new $TypeError('Attempted to assign to readonly property.');
		}
		return true;
	} else {
		try {
			O[P] = V; // eslint-disable-line no-param-reassign
			return noThrowOnStrictViolation ? SameValue(O[P], V) : true;
		} catch (e) {
			return false;
		}
	}
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294870,"./SameValue":1597942294874,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294945, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var has = require('has');

var $TypeError = GetIntrinsic('%TypeError%');

var getSymbolDescription = require('../helpers/getSymbolDescription');

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');
var IsExtensible = require('./IsExtensible');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-setfunctionname

module.exports = function SetFunctionName(F, name) {
	if (typeof F !== 'function') {
		throw new $TypeError('Assertion failed: `F` must be a function');
	}
	if (!IsExtensible(F) || has(F, 'name')) {
		throw new $TypeError('Assertion failed: `F` must be extensible, and must not have a `name` own property');
	}
	var nameType = Type(name);
	if (nameType !== 'Symbol' && nameType !== 'String') {
		throw new $TypeError('Assertion failed: `name` must be a Symbol or a String');
	}
	if (nameType === 'Symbol') {
		var description = getSymbolDescription(name);
		// eslint-disable-next-line no-param-reassign
		name = typeof description === 'undefined' ? '' : '[' + description + ']';
	}
	if (arguments.length > 2) {
		var prefix = arguments[2];
		// eslint-disable-next-line no-param-reassign
		name = prefix + ' ' + name;
	}
	return DefinePropertyOrThrow(F, 'name', {
		'[[Value]]': name,
		'[[Writable]]': false,
		'[[Enumerable]]': false,
		'[[Configurable]]': true
	});
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getSymbolDescription":1597942294717,"./DefinePropertyOrThrow":1597942294885,"./IsExtensible":1597942294869,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294946, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');
var $preventExtensions = GetIntrinsic('%Object.preventExtensions%');
var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%');

var forEach = require('../helpers/forEach');

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-setintegritylevel

module.exports = function SetIntegrityLevel(O, level) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (level !== 'sealed' && level !== 'frozen') {
		throw new $TypeError('Assertion failed: `level` must be `"sealed"` or `"frozen"`');
	}
	if (!$preventExtensions) {
		throw new $SyntaxError('SetIntegrityLevel requires native `Object.preventExtensions` support');
	}
	var status = $preventExtensions(O);
	if (!status) {
		return false;
	}
	if (!$gOPN) {
		throw new $SyntaxError('SetIntegrityLevel requires native `Object.getOwnPropertyNames` support');
	}
	var theKeys = $gOPN(O);
	if (level === 'sealed') {
		forEach(theKeys, function (k) {
			DefinePropertyOrThrow(O, k, { configurable: false });
		});
	} else if (level === 'frozen') {
		forEach(theKeys, function (k) {
			var currentDesc = $gOPD(O, k);
			if (typeof currentDesc !== 'undefined') {
				var desc;
				if (IsAccessorDescriptor(ToPropertyDescriptor(currentDesc))) {
					desc = { configurable: false };
				} else {
					desc = { configurable: false, writable: false };
				}
				DefinePropertyOrThrow(O, k, desc);
			}
		});
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/forEach":1597942294720,"./DefinePropertyOrThrow":1597942294885,"./IsAccessorDescriptor":1597942294866,"./ToPropertyDescriptor":1597942294871,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294947, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $species = GetIntrinsic('%Symbol.species%', true);
var $TypeError = GetIntrinsic('%TypeError%');

var IsConstructor = require('./IsConstructor');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-speciesconstructor

module.exports = function SpeciesConstructor(O, defaultConstructor) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	var C = O.constructor;
	if (typeof C === 'undefined') {
		return defaultConstructor;
	}
	if (Type(C) !== 'Object') {
		throw new $TypeError('O.constructor is not an Object');
	}
	var S = $species ? C[$species] : void 0;
	if (S == null) {
		return defaultConstructor;
	}
	if (IsConstructor(S)) {
		return S;
	}
	throw new $TypeError('no constructor found');
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsConstructor":1597942294884,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294948, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $SymbolToString = callBound('Symbol.prototype.toString', true);

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-symboldescriptivestring

module.exports = function SymbolDescriptiveString(sym) {
	if (Type(sym) !== 'Symbol') {
		throw new $TypeError('Assertion failed: `sym` must be a Symbol');
	}
	return $SymbolToString(sym);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294949, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%');
var $TypeError = GetIntrinsic('%TypeError%');

var every = require('../helpers/every');

var IsDataDescriptor = require('./IsDataDescriptor');
var IsExtensible = require('./IsExtensible');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-testintegritylevel

module.exports = function TestIntegrityLevel(O, level) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (level !== 'sealed' && level !== 'frozen') {
		throw new $TypeError('Assertion failed: `level` must be `"sealed"` or `"frozen"`');
	}
	var status = IsExtensible(O);
	if (status) {
		return false;
	}
	var theKeys = $gOPN(O);
	return theKeys.length === 0 || every(theKeys, function (k) {
		var currentDesc = $gOPD(O, k);
		if (typeof currentDesc !== 'undefined') {
			if (currentDesc.configurable) {
				return false;
			}
			if (level === 'frozen' && IsDataDescriptor(ToPropertyDescriptor(currentDesc)) && currentDesc.writable) {
				return false;
			}
		}
		return true;
	});
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/every":1597942294649,"./IsDataDescriptor":1597942294867,"./IsExtensible":1597942294869,"./ToPropertyDescriptor":1597942294871,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294950, function(require, module, exports) {


var $BooleanValueOf = require('../helpers/callBound')('Boolean.prototype.valueOf');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-boolean-prototype-object

module.exports = function thisBooleanValue(value) {
	if (Type(value) === 'Boolean') {
		return value;
	}

	return $BooleanValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294951, function(require, module, exports) {


var callBound = require('../helpers/callBound');

var Type = require('./Type');

var $NumberValueOf = callBound('Number.prototype.valueOf');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-number-prototype-object

module.exports = function thisNumberValue(value) {
	if (Type(value) === 'Number') {
		return value;
	}

	return $NumberValueOf(value);
};


}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294952, function(require, module, exports) {


var $StringValueOf = require('../helpers/callBound')('String.prototype.valueOf');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-string-prototype-object

module.exports = function thisStringValue(value) {
	if (Type(value) === 'String') {
		return value;
	}

	return $StringValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294953, function(require, module, exports) {


var $DateValueOf = require('../helpers/callBound')('Date.prototype.valueOf');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-date-prototype-object

module.exports = function thisTimeValue(value) {
	return $DateValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294954, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Date = GetIntrinsic('%Date%');
var $Number = GetIntrinsic('%Number%');
var $abs = GetIntrinsic('%Math.abs%');

var $isFinite = require('../helpers/isFinite');

var ToNumber = require('./ToNumber');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.14

module.exports = function TimeClip(time) {
	if (!$isFinite(time) || $abs(time) > 8.64e15) {
		return NaN;
	}
	return $Number(new $Date(ToNumber(time)));
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isFinite":1597942294575,"./ToNumber":1597942294856}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294955, function(require, module, exports) {


var msPerDay = require('../helpers/timeConstants').msPerDay;

var DayFromYear = require('./DayFromYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function TimeFromYear(y) {
	return msPerDay * DayFromYear(y);
};

}, function(modId) { var map = {"../helpers/timeConstants":1597942294584,"./DayFromYear":1597942294901}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294956, function(require, module, exports) {


var mod = require('../helpers/mod');
var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.2

module.exports = function TimeWithinDay(t) {
	return mod(t, msPerDay);
};


}, function(modId) { var map = {"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294957, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $Date = GetIntrinsic('%Date%');

var $isNaN = require('../helpers/isNaN');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-todatestring

module.exports = function ToDateString(tv) {
	if (Type(tv) !== 'Number') {
		throw new $TypeError('Assertion failed: `tv` must be a Number');
	}
	if ($isNaN(tv)) {
		return 'Invalid Date';
	}
	return $Date(tv);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"./Type":1597942294858}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294958, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $RangeError = GetIntrinsic('%RangeError%');

var ToInteger = require('./ToInteger');
var ToLength = require('./ToLength');
var SameValueZero = require('./SameValueZero');

// https://www.ecma-international.org/ecma-262/8.0/#sec-toindex

module.exports = function ToIndex(value) {
	if (typeof value === 'undefined') {
		return 0;
	}
	var integerIndex = ToInteger(value);
	if (integerIndex < 0) {
		throw new $RangeError('index must be >= 0');
	}
	var index = ToLength(integerIndex);
	if (!SameValueZero(integerIndex, index)) {
		throw new $RangeError('index must be >= 0 and < 2 ** 53 - 1');
	}
	return index;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToInteger":1597942294896,"./ToLength":1597942294895,"./SameValueZero":1597942294942}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294959, function(require, module, exports) {


var ToUint16 = require('./ToUint16');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toint16

module.exports = function ToInt16(argument) {
	var int16bit = ToUint16(argument);
	return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
};

}, function(modId) { var map = {"./ToUint16":1597942294960}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294960, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var $sign = require('../helpers/sign');
var $mod = require('../helpers/mod');

var $floor = $Math.floor;
var $abs = $Math.abs;

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.7

module.exports = function ToUint16(value) {
	var number = ToNumber(value);
	if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
	var posInt = $sign(number) * $floor($abs(number));
	return $mod(posInt, 0x10000);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942294856,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/sign":1597942294603,"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294961, function(require, module, exports) {


var ToNumber = require('./ToNumber');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.5

module.exports = function ToInt32(x) {
	return ToNumber(x) >> 0;
};

}, function(modId) { var map = {"./ToNumber":1597942294856}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294962, function(require, module, exports) {


var ToUint8 = require('./ToUint8');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toint8

module.exports = function ToInt8(argument) {
	var int8bit = ToUint8(argument);
	return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
};

}, function(modId) { var map = {"./ToUint8":1597942294963}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294963, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var $sign = require('../helpers/sign');
var $mod = require('../helpers/mod');

var $floor = $Math.floor;
var $abs = $Math.abs;

module.exports = function ToUint8(argument) {
	var number = ToNumber(argument);
	if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
	var posInt = $sign(number) * $floor($abs(number));
	return $mod(posInt, 0x100);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942294856,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/sign":1597942294603,"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294964, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $String = GetIntrinsic('%String%');

var ToPrimitive = require('./ToPrimitive');
var ToString = require('./ToString');

// https://www.ecma-international.org/ecma-262/6.0/#sec-topropertykey

module.exports = function ToPropertyKey(argument) {
	var key = ToPrimitive(argument, $String);
	return typeof key === 'symbol' ? key : ToString(key);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToPrimitive":1597942294857,"./ToString":1597942294880}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294965, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');

var $floor = $Math.floor;

// https://www.ecma-international.org/ecma-262/6.0/#sec-touint8clamp

module.exports = function ToUint8Clamp(argument) {
	var number = ToNumber(argument);
	if ($isNaN(number) || number <= 0) { return 0; }
	if (number >= 0xFF) { return 0xFF; }
	var f = $floor(argument);
	if (f + 0.5 < number) { return f + 1; }
	if (number < f + 0.5) { return f; }
	if (f % 2 !== 0) { return f + 1; }
	return f;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942294856,"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294966, function(require, module, exports) {


var mod = require('../helpers/mod');

var Day = require('./Day');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.6

module.exports = function WeekDay(t) {
	return mod(Day(t) + 4, 7);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589,"./Day":1597942294900}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294967, function(require, module, exports) {


/* eslint global-require: 0 */
// https://www.ecma-international.org/ecma-262/9.0/#sec-abstract-operations
var ES2018 = {
	'Abstract Equality Comparison': require('./2018/AbstractEqualityComparison'),
	'Abstract Relational Comparison': require('./2018/AbstractRelationalComparison'),
	'Strict Equality Comparison': require('./2018/StrictEqualityComparison'),
	AdvanceStringIndex: require('./2018/AdvanceStringIndex'),
	ArrayCreate: require('./2018/ArrayCreate'),
	ArraySetLength: require('./2018/ArraySetLength'),
	ArraySpeciesCreate: require('./2018/ArraySpeciesCreate'),
	Call: require('./2018/Call'),
	CanonicalNumericIndexString: require('./2018/CanonicalNumericIndexString'),
	CompletePropertyDescriptor: require('./2018/CompletePropertyDescriptor'),
	CopyDataProperties: require('./2018/CopyDataProperties'),
	CreateDataProperty: require('./2018/CreateDataProperty'),
	CreateDataPropertyOrThrow: require('./2018/CreateDataPropertyOrThrow'),
	CreateHTML: require('./2018/CreateHTML'),
	CreateIterResultObject: require('./2018/CreateIterResultObject'),
	CreateListFromArrayLike: require('./2018/CreateListFromArrayLike'),
	CreateMethodProperty: require('./2018/CreateMethodProperty'),
	DateFromTime: require('./2018/DateFromTime'),
	DateString: require('./2018/DateString'),
	Day: require('./2018/Day'),
	DayFromYear: require('./2018/DayFromYear'),
	DaysInYear: require('./2018/DaysInYear'),
	DayWithinYear: require('./2018/DayWithinYear'),
	DefinePropertyOrThrow: require('./2018/DefinePropertyOrThrow'),
	DeletePropertyOrThrow: require('./2018/DeletePropertyOrThrow'),
	EnumerableOwnPropertyNames: require('./2018/EnumerableOwnPropertyNames'),
	FromPropertyDescriptor: require('./2018/FromPropertyDescriptor'),
	Get: require('./2018/Get'),
	GetIterator: require('./2018/GetIterator'),
	GetMethod: require('./2018/GetMethod'),
	GetOwnPropertyKeys: require('./2018/GetOwnPropertyKeys'),
	GetPrototypeFromConstructor: require('./2018/GetPrototypeFromConstructor'),
	GetSubstitution: require('./2018/GetSubstitution'),
	GetV: require('./2018/GetV'),
	HasOwnProperty: require('./2018/HasOwnProperty'),
	HasProperty: require('./2018/HasProperty'),
	HourFromTime: require('./2018/HourFromTime'),
	InLeapYear: require('./2018/InLeapYear'),
	InstanceofOperator: require('./2018/InstanceofOperator'),
	Invoke: require('./2018/Invoke'),
	IsAccessorDescriptor: require('./2018/IsAccessorDescriptor'),
	IsArray: require('./2018/IsArray'),
	IsCallable: require('./2018/IsCallable'),
	IsConcatSpreadable: require('./2018/IsConcatSpreadable'),
	IsConstructor: require('./2018/IsConstructor'),
	IsDataDescriptor: require('./2018/IsDataDescriptor'),
	IsExtensible: require('./2018/IsExtensible'),
	IsGenericDescriptor: require('./2018/IsGenericDescriptor'),
	IsInteger: require('./2018/IsInteger'),
	IsPromise: require('./2018/IsPromise'),
	IsPropertyKey: require('./2018/IsPropertyKey'),
	IsRegExp: require('./2018/IsRegExp'),
	IsStringPrefix: require('./2018/IsStringPrefix'),
	IterableToList: require('./2018/IterableToList'),
	IteratorClose: require('./2018/IteratorClose'),
	IteratorComplete: require('./2018/IteratorComplete'),
	IteratorNext: require('./2018/IteratorNext'),
	IteratorStep: require('./2018/IteratorStep'),
	IteratorValue: require('./2018/IteratorValue'),
	MakeDate: require('./2018/MakeDate'),
	MakeDay: require('./2018/MakeDay'),
	MakeTime: require('./2018/MakeTime'),
	MinFromTime: require('./2018/MinFromTime'),
	modulo: require('./2018/modulo'),
	MonthFromTime: require('./2018/MonthFromTime'),
	msFromTime: require('./2018/msFromTime'),
	NumberToString: require('./2018/NumberToString'),
	ObjectCreate: require('./2018/ObjectCreate'),
	OrdinaryDefineOwnProperty: require('./2018/OrdinaryDefineOwnProperty'),
	OrdinaryGetOwnProperty: require('./2018/OrdinaryGetOwnProperty'),
	OrdinaryGetPrototypeOf: require('./2018/OrdinaryGetPrototypeOf'),
	OrdinarySetPrototypeOf: require('./2018/OrdinarySetPrototypeOf'),
	OrdinaryHasInstance: require('./2018/OrdinaryHasInstance'),
	OrdinaryHasProperty: require('./2018/OrdinaryHasProperty'),
	PromiseResolve: require('./2018/PromiseResolve'),
	RegExpExec: require('./2018/RegExpExec'),
	RequireObjectCoercible: require('./2018/RequireObjectCoercible'),
	SameValue: require('./2018/SameValue'),
	SameValueNonNumber: require('./2018/SameValueNonNumber'),
	SameValueZero: require('./2018/SameValueZero'),
	SecFromTime: require('./2018/SecFromTime'),
	Set: require('./2018/Set'),
	SetFunctionName: require('./2018/SetFunctionName'),
	SetIntegrityLevel: require('./2018/SetIntegrityLevel'),
	SpeciesConstructor: require('./2018/SpeciesConstructor'),
	SymbolDescriptiveString: require('./2018/SymbolDescriptiveString'),
	TestIntegrityLevel: require('./2018/TestIntegrityLevel'),
	thisBooleanValue: require('./2018/thisBooleanValue'),
	thisNumberValue: require('./2018/thisNumberValue'),
	thisStringValue: require('./2018/thisStringValue'),
	thisSymbolValue: require('./2018/thisSymbolValue'),
	thisTimeValue: require('./2018/thisTimeValue'),
	TimeClip: require('./2018/TimeClip'),
	TimeFromYear: require('./2018/TimeFromYear'),
	TimeString: require('./2018/TimeString'),
	TimeWithinDay: require('./2018/TimeWithinDay'),
	ToBoolean: require('./2018/ToBoolean'),
	ToDateString: require('./2018/ToDateString'),
	ToIndex: require('./2018/ToIndex'),
	ToInt16: require('./2018/ToInt16'),
	ToInt32: require('./2018/ToInt32'),
	ToInt8: require('./2018/ToInt8'),
	ToInteger: require('./2018/ToInteger'),
	ToLength: require('./2018/ToLength'),
	ToNumber: require('./2018/ToNumber'),
	ToObject: require('./2018/ToObject'),
	ToPrimitive: require('./2018/ToPrimitive'),
	ToPropertyDescriptor: require('./2018/ToPropertyDescriptor'),
	ToPropertyKey: require('./2018/ToPropertyKey'),
	ToString: require('./2018/ToString'),
	ToUint16: require('./2018/ToUint16'),
	ToUint32: require('./2018/ToUint32'),
	ToUint8: require('./2018/ToUint8'),
	ToUint8Clamp: require('./2018/ToUint8Clamp'),
	Type: require('./2018/Type'),
	ValidateAndApplyPropertyDescriptor: require('./2018/ValidateAndApplyPropertyDescriptor'),
	WeekDay: require('./2018/WeekDay'),
	YearFromTime: require('./2018/YearFromTime')
};

module.exports = ES2018;

}, function(modId) { var map = {"./2018/AbstractEqualityComparison":1597942294968,"./2018/AbstractRelationalComparison":1597942294972,"./2018/StrictEqualityComparison":1597942294973,"./2018/AdvanceStringIndex":1597942294974,"./2018/ArrayCreate":1597942294976,"./2018/ArraySetLength":1597942294977,"./2018/ArraySpeciesCreate":1597942294995,"./2018/Call":1597942294999,"./2018/CanonicalNumericIndexString":1597942295000,"./2018/CompletePropertyDescriptor":1597942295001,"./2018/CopyDataProperties":1597942295002,"./2018/CreateDataProperty":1597942295004,"./2018/CreateDataPropertyOrThrow":1597942295007,"./2018/CreateHTML":1597942295008,"./2018/CreateIterResultObject":1597942295009,"./2018/CreateListFromArrayLike":1597942295010,"./2018/CreateMethodProperty":1597942295013,"./2018/DateFromTime":1597942295014,"./2018/DateString":1597942295022,"./2018/Day":1597942295016,"./2018/DayFromYear":1597942295017,"./2018/DaysInYear":1597942295020,"./2018/DayWithinYear":1597942295015,"./2018/DefinePropertyOrThrow":1597942294998,"./2018/DeletePropertyOrThrow":1597942295025,"./2018/EnumerableOwnPropertyNames":1597942295026,"./2018/FromPropertyDescriptor":1597942294989,"./2018/Get":1597942294996,"./2018/GetIterator":1597942295027,"./2018/GetMethod":1597942295028,"./2018/GetOwnPropertyKeys":1597942295030,"./2018/GetPrototypeFromConstructor":1597942295031,"./2018/GetSubstitution":1597942295032,"./2018/GetV":1597942295029,"./2018/HasOwnProperty":1597942295033,"./2018/HasProperty":1597942295034,"./2018/HourFromTime":1597942295035,"./2018/InLeapYear":1597942295019,"./2018/InstanceofOperator":1597942295036,"./2018/Invoke":1597942295038,"./2018/IsAccessorDescriptor":1597942294979,"./2018/IsArray":1597942294978,"./2018/IsCallable":1597942294986,"./2018/IsConcatSpreadable":1597942295039,"./2018/IsConstructor":1597942294997,"./2018/IsDataDescriptor":1597942294980,"./2018/IsExtensible":1597942294982,"./2018/IsGenericDescriptor":1597942294990,"./2018/IsInteger":1597942294975,"./2018/IsPromise":1597942295040,"./2018/IsPropertyKey":1597942294983,"./2018/IsRegExp":1597942294992,"./2018/IsStringPrefix":1597942295041,"./2018/IterableToList":1597942295042,"./2018/IteratorClose":1597942295047,"./2018/IteratorComplete":1597942295044,"./2018/IteratorNext":1597942295045,"./2018/IteratorStep":1597942295043,"./2018/IteratorValue":1597942295046,"./2018/MakeDate":1597942295048,"./2018/MakeDay":1597942295049,"./2018/MakeTime":1597942295050,"./2018/MinFromTime":1597942295051,"./2018/modulo":1597942295052,"./2018/MonthFromTime":1597942295021,"./2018/msFromTime":1597942295053,"./2018/NumberToString":1597942295054,"./2018/ObjectCreate":1597942295055,"./2018/OrdinaryDefineOwnProperty":1597942294981,"./2018/OrdinaryGetOwnProperty":1597942294991,"./2018/OrdinaryGetPrototypeOf":1597942295056,"./2018/OrdinarySetPrototypeOf":1597942295057,"./2018/OrdinaryHasInstance":1597942295037,"./2018/OrdinaryHasProperty":1597942295058,"./2018/PromiseResolve":1597942295059,"./2018/RegExpExec":1597942295060,"./2018/RequireObjectCoercible":1597942295006,"./2018/SameValue":1597942294987,"./2018/SameValueNonNumber":1597942295061,"./2018/SameValueZero":1597942295062,"./2018/SecFromTime":1597942295063,"./2018/Set":1597942295064,"./2018/SetFunctionName":1597942295065,"./2018/SetIntegrityLevel":1597942295066,"./2018/SpeciesConstructor":1597942295067,"./2018/SymbolDescriptiveString":1597942295068,"./2018/TestIntegrityLevel":1597942295069,"./2018/thisBooleanValue":1597942295070,"./2018/thisNumberValue":1597942295071,"./2018/thisStringValue":1597942295072,"./2018/thisSymbolValue":1597942295073,"./2018/thisTimeValue":1597942295074,"./2018/TimeClip":1597942295075,"./2018/TimeFromYear":1597942295076,"./2018/TimeString":1597942295077,"./2018/TimeWithinDay":1597942295078,"./2018/ToBoolean":1597942294985,"./2018/ToDateString":1597942295079,"./2018/ToIndex":1597942295080,"./2018/ToInt16":1597942295081,"./2018/ToInt32":1597942295083,"./2018/ToInt8":1597942295084,"./2018/ToInteger":1597942295012,"./2018/ToLength":1597942295011,"./2018/ToNumber":1597942294969,"./2018/ToObject":1597942295005,"./2018/ToPrimitive":1597942294970,"./2018/ToPropertyDescriptor":1597942294984,"./2018/ToPropertyKey":1597942295086,"./2018/ToString":1597942294993,"./2018/ToUint16":1597942295082,"./2018/ToUint32":1597942294994,"./2018/ToUint8":1597942295085,"./2018/ToUint8Clamp":1597942295087,"./2018/Type":1597942294971,"./2018/ValidateAndApplyPropertyDescriptor":1597942294988,"./2018/WeekDay":1597942295024,"./2018/YearFromTime":1597942295018}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294968, function(require, module, exports) {


var ToNumber = require('./ToNumber');
var ToPrimitive = require('./ToPrimitive');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-abstract-equality-comparison

module.exports = function AbstractEqualityComparison(x, y) {
	var xType = Type(x);
	var yType = Type(y);
	if (xType === yType) {
		return x === y; // ES6+ specified this shortcut anyways.
	}
	if (x == null && y == null) {
		return true;
	}
	if (xType === 'Number' && yType === 'String') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if (xType === 'String' && yType === 'Number') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (xType === 'Boolean') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (yType === 'Boolean') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if ((xType === 'String' || xType === 'Number' || xType === 'Symbol') && yType === 'Object') {
		return AbstractEqualityComparison(x, ToPrimitive(y));
	}
	if (xType === 'Object' && (yType === 'String' || yType === 'Number' || yType === 'Symbol')) {
		return AbstractEqualityComparison(ToPrimitive(x), y);
	}
	return false;
};

}, function(modId) { var map = {"./ToNumber":1597942294969,"./ToPrimitive":1597942294970,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294969, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $Number = GetIntrinsic('%Number%');
var $RegExp = GetIntrinsic('%RegExp%');
var $parseInteger = GetIntrinsic('%parseInt%');

var callBound = require('../helpers/callBound');
var regexTester = require('../helpers/regexTester');
var isPrimitive = require('../helpers/isPrimitive');

var $strSlice = callBound('String.prototype.slice');
var isBinary = regexTester(/^0b[01]+$/i);
var isOctal = regexTester(/^0o[0-7]+$/i);
var isInvalidHexLiteral = regexTester(/^[-+]0x[0-9a-f]+$/i);
var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
var nonWSregex = new $RegExp('[' + nonWS + ']', 'g');
var hasNonWS = regexTester(nonWSregex);

// whitespace from: https://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = [
	'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
	'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
	'\u2029\uFEFF'
].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var $replace = callBound('String.prototype.replace');
var $trim = function (value) {
	return $replace(value, trimRegex, '');
};

var ToPrimitive = require('./ToPrimitive');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tonumber

module.exports = function ToNumber(argument) {
	var value = isPrimitive(argument) ? argument : ToPrimitive(argument, $Number);
	if (typeof value === 'symbol') {
		throw new $TypeError('Cannot convert a Symbol value to a number');
	}
	if (typeof value === 'string') {
		if (isBinary(value)) {
			return ToNumber($parseInteger($strSlice(value, 2), 2));
		} else if (isOctal(value)) {
			return ToNumber($parseInteger($strSlice(value, 2), 8));
		} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
			return NaN;
		} else {
			var trimmed = $trim(value);
			if (trimmed !== value) {
				return ToNumber(trimmed);
			}
		}
	}
	return $Number(value);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"../helpers/regexTester":1597942294624,"../helpers/isPrimitive":1597942294625,"./ToPrimitive":1597942294970}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294970, function(require, module, exports) {


var toPrimitive = require('es-to-primitive/es2015');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive

module.exports = function ToPrimitive(input) {
	if (arguments.length > 1) {
		return toPrimitive(input, arguments[1]);
	}
	return toPrimitive(input);
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294971, function(require, module, exports) {


var ES5Type = require('../5/Type');

// https://ecma-international.org/ecma-262/6.0/#sec-ecmascript-data-types-and-values

module.exports = function Type(x) {
	if (typeof x === 'symbol') {
		return 'Symbol';
	}
	return ES5Type(x);
};

}, function(modId) { var map = {"../5/Type":1597942294572}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294972, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Number = GetIntrinsic('%Number%');
var $TypeError = GetIntrinsic('%TypeError%');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var isPrefixOf = require('../helpers/isPrefixOf');

var ToNumber = require('./ToNumber');
var ToPrimitive = require('./ToPrimitive');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/5.1/#sec-11.8.5

// eslint-disable-next-line max-statements
module.exports = function AbstractRelationalComparison(x, y, LeftFirst) {
	if (Type(LeftFirst) !== 'Boolean') {
		throw new $TypeError('Assertion failed: LeftFirst argument must be a Boolean');
	}
	var px;
	var py;
	if (LeftFirst) {
		px = ToPrimitive(x, $Number);
		py = ToPrimitive(y, $Number);
	} else {
		py = ToPrimitive(y, $Number);
		px = ToPrimitive(x, $Number);
	}
	var bothStrings = Type(px) === 'String' && Type(py) === 'String';
	if (!bothStrings) {
		var nx = ToNumber(px);
		var ny = ToNumber(py);
		if ($isNaN(nx) || $isNaN(ny)) {
			return undefined;
		}
		if ($isFinite(nx) && $isFinite(ny) && nx === ny) {
			return false;
		}
		if (nx === 0 && ny === 0) {
			return false;
		}
		if (nx === Infinity) {
			return false;
		}
		if (ny === Infinity) {
			return true;
		}
		if (ny === -Infinity) {
			return false;
		}
		if (nx === -Infinity) {
			return true;
		}
		return nx < ny; // by now, these are both nonzero, finite, and not equal
	}
	if (isPrefixOf(py, px)) {
		return false;
	}
	if (isPrefixOf(px, py)) {
		return true;
	}
	return px < py; // both strings, neither a prefix of the other. shortcut for steps c-f
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/isPrefixOf":1597942294576,"./ToNumber":1597942294969,"./ToPrimitive":1597942294970,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294973, function(require, module, exports) {


var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/5.1/#sec-11.9.6

module.exports = function StrictEqualityComparison(x, y) {
	var xType = Type(x);
	var yType = Type(y);
	if (xType !== yType) {
		return false;
	}
	if (xType === 'Undefined' || xType === 'Null') {
		return true;
	}
	return x === y; // shortcut for steps 4-7
};

}, function(modId) { var map = {"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294974, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var IsInteger = require('./IsInteger');
var Type = require('./Type');

var MAX_SAFE_INTEGER = require('../helpers/maxSafeInteger');

var $TypeError = GetIntrinsic('%TypeError%');

var $charCodeAt = require('../helpers/callBound')('String.prototype.charCodeAt');

// https://ecma-international.org/ecma-262/6.0/#sec-advancestringindex

module.exports = function AdvanceStringIndex(S, index, unicode) {
	if (Type(S) !== 'String') {
		throw new $TypeError('Assertion failed: `S` must be a String');
	}
	if (!IsInteger(index) || index < 0 || index > MAX_SAFE_INTEGER) {
		throw new $TypeError('Assertion failed: `length` must be an integer >= 0 and <= 2**53');
	}
	if (Type(unicode) !== 'Boolean') {
		throw new $TypeError('Assertion failed: `unicode` must be a Boolean');
	}
	if (!unicode) {
		return index + 1;
	}
	var length = S.length;
	if ((index + 1) >= length) {
		return index + 1;
	}

	var first = $charCodeAt(S, index);
	if (first < 0xD800 || first > 0xDBFF) {
		return index + 1;
	}

	var second = $charCodeAt(S, index + 1);
	if (second < 0xDC00 || second > 0xDFFF) {
		return index + 1;
	}

	return index + 2;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsInteger":1597942294975,"./Type":1597942294971,"../helpers/maxSafeInteger":1597942294632,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294975, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var $floor = $Math.floor;
var $abs = $Math.abs;

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isinteger

module.exports = function IsInteger(argument) {
	if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
		return false;
	}
	var abs = $abs(argument);
	return $floor(abs) === abs;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294976, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $ArrayPrototype = GetIntrinsic('%Array.prototype%');
var $RangeError = GetIntrinsic('%RangeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');

var IsInteger = require('./IsInteger');

var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1;

var $setProto = GetIntrinsic('%Object.setPrototypeOf%', true) || (
	// eslint-disable-next-line no-proto, no-negated-condition
	[].__proto__ !== $ArrayPrototype
		? null
		: function (O, proto) {
			O.__proto__ = proto; // eslint-disable-line no-proto, no-param-reassign
			return O;
		}
);

// https://www.ecma-international.org/ecma-262/6.0/#sec-arraycreate

module.exports = function ArrayCreate(length) {
	if (!IsInteger(length) || length < 0) {
		throw new $TypeError('Assertion failed: `length` must be an integer Number >= 0');
	}
	if (length > MAX_ARRAY_LENGTH) {
		throw new $RangeError('length is greater than (2**32 - 1)');
	}
	var proto = arguments.length > 1 ? arguments[1] : $ArrayPrototype;
	var A = []; // steps 5 - 7, and 9
	if (proto !== $ArrayPrototype) { // step 8
		if (!$setProto) {
			throw new $SyntaxError('ArrayCreate: a `proto` argument that is not `Array.prototype` is not supported in an environment that does not support setting the [[Prototype]]');
		}
		$setProto(A, proto);
	}
	if (length !== 0) { // bypasses the need for step 2
		A.length = length;
	}
	/* step 10, the above as a shortcut for the below
    OrdinaryDefineOwnProperty(A, 'length', {
        '[[Configurable]]': false,
        '[[Enumerable]]': false,
        '[[Value]]': length,
        '[[Writable]]': true
    });
    */
	return A;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsInteger":1597942294975}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294977, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $RangeError = GetIntrinsic('%RangeError%');
var $TypeError = GetIntrinsic('%TypeError%');

var assign = require('object.assign');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');

var IsArray = require('./IsArray');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var OrdinaryDefineOwnProperty = require('./OrdinaryDefineOwnProperty');
var OrdinaryGetOwnProperty = require('./OrdinaryGetOwnProperty');
var ToNumber = require('./ToNumber');
var ToString = require('./ToString');
var ToUint32 = require('./ToUint32');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-arraysetlength

// eslint-disable-next-line max-statements, max-lines-per-function
module.exports = function ArraySetLength(A, Desc) {
	if (!IsArray(A)) {
		throw new $TypeError('Assertion failed: A must be an Array');
	}
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
	}
	if (!('[[Value]]' in Desc)) {
		return OrdinaryDefineOwnProperty(A, 'length', Desc);
	}
	var newLenDesc = assign({}, Desc);
	var newLen = ToUint32(Desc['[[Value]]']);
	var numberLen = ToNumber(Desc['[[Value]]']);
	if (newLen !== numberLen) {
		throw new $RangeError('Invalid array length');
	}
	newLenDesc['[[Value]]'] = newLen;
	var oldLenDesc = OrdinaryGetOwnProperty(A, 'length');
	if (!IsDataDescriptor(oldLenDesc)) {
		throw new $TypeError('Assertion failed: an array had a non-data descriptor on `length`');
	}
	var oldLen = oldLenDesc['[[Value]]'];
	if (newLen >= oldLen) {
		return OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
	}
	if (!oldLenDesc['[[Writable]]']) {
		return false;
	}
	var newWritable;
	if (!('[[Writable]]' in newLenDesc) || newLenDesc['[[Writable]]']) {
		newWritable = true;
	} else {
		newWritable = false;
		newLenDesc['[[Writable]]'] = true;
	}
	var succeeded = OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
	if (!succeeded) {
		return false;
	}
	while (newLen < oldLen) {
		oldLen -= 1;
		// eslint-disable-next-line no-param-reassign
		var deleteSucceeded = delete A[ToString(oldLen)];
		if (!deleteSucceeded) {
			newLenDesc['[[Value]]'] = oldLen + 1;
			if (!newWritable) {
				newLenDesc['[[Writable]]'] = false;
				OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
				return false;
			}
		}
	}
	if (!newWritable) {
		return OrdinaryDefineOwnProperty(A, 'length', { '[[Writable]]': false });
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPropertyDescriptor":1597942294599,"./IsArray":1597942294978,"./IsAccessorDescriptor":1597942294979,"./IsDataDescriptor":1597942294980,"./OrdinaryDefineOwnProperty":1597942294981,"./OrdinaryGetOwnProperty":1597942294991,"./ToNumber":1597942294969,"./ToString":1597942294993,"./ToUint32":1597942294994,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294978, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Array = GetIntrinsic('%Array%');

// eslint-disable-next-line global-require
var toStr = !$Array.isArray && require('../helpers/callBound')('Object.prototype.toString');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isarray

module.exports = $Array.isArray || function IsArray(argument) {
	return toStr(argument) === '[object Array]';
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294979, function(require, module, exports) {


var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isaccessordescriptor

module.exports = function IsAccessorDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!has(Desc, '[[Get]]') && !has(Desc, '[[Set]]')) {
		return false;
	}

	return true;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294980, function(require, module, exports) {


var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isdatadescriptor

module.exports = function IsDataDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!has(Desc, '[[Value]]') && !has(Desc, '[[Writable]]')) {
		return false;
	}

	return true;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294981, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');

var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsExtensible = require('./IsExtensible');
var IsPropertyKey = require('./IsPropertyKey');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var SameValue = require('./SameValue');
var Type = require('./Type');
var ValidateAndApplyPropertyDescriptor = require('./ValidateAndApplyPropertyDescriptor');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarydefineownproperty

module.exports = function OrdinaryDefineOwnProperty(O, P, Desc) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: O must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
	}
	if (!$gOPD) {
		// ES3/IE 8 fallback
		if (IsAccessorDescriptor(Desc)) {
			throw new $SyntaxError('This environment does not support accessor property descriptors.');
		}
		var creatingNormalDataProperty = !(P in O)
			&& Desc['[[Writable]]']
			&& Desc['[[Enumerable]]']
			&& Desc['[[Configurable]]']
			&& '[[Value]]' in Desc;
		var settingExistingDataProperty = (P in O)
			&& (!('[[Configurable]]' in Desc) || Desc['[[Configurable]]'])
			&& (!('[[Enumerable]]' in Desc) || Desc['[[Enumerable]]'])
			&& (!('[[Writable]]' in Desc) || Desc['[[Writable]]'])
			&& '[[Value]]' in Desc;
		if (creatingNormalDataProperty || settingExistingDataProperty) {
			O[P] = Desc['[[Value]]']; // eslint-disable-line no-param-reassign
			return SameValue(O[P], Desc['[[Value]]']);
		}
		throw new $SyntaxError('This environment does not support defining non-writable, non-enumerable, or non-configurable properties');
	}
	var desc = $gOPD(O, P);
	var current = desc && ToPropertyDescriptor(desc);
	var extensible = IsExtensible(O);
	return ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/isPropertyDescriptor":1597942294599,"./IsAccessorDescriptor":1597942294979,"./IsDataDescriptor":1597942294980,"./IsExtensible":1597942294982,"./IsPropertyKey":1597942294983,"./ToPropertyDescriptor":1597942294984,"./SameValue":1597942294987,"./Type":1597942294971,"./ValidateAndApplyPropertyDescriptor":1597942294988}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294982, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Object = GetIntrinsic('%Object%');

var isPrimitive = require('../helpers/isPrimitive');

var $preventExtensions = $Object.preventExtensions;
var $isExtensible = $Object.isExtensible;

// https://www.ecma-international.org/ecma-262/6.0/#sec-isextensible-o

module.exports = $preventExtensions
	? function IsExtensible(obj) {
		return !isPrimitive(obj) && $isExtensible(obj);
	}
	: function IsExtensible(obj) {
		return !isPrimitive(obj);
	};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPrimitive":1597942294625}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294983, function(require, module, exports) {


// https://www.ecma-international.org/ecma-262/6.0/#sec-ispropertykey

module.exports = function IsPropertyKey(argument) {
	return typeof argument === 'string' || typeof argument === 'symbol';
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294984, function(require, module, exports) {


var has = require('has');

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Type = require('./Type');
var ToBoolean = require('./ToBoolean');
var IsCallable = require('./IsCallable');

// https://ecma-international.org/ecma-262/5.1/#sec-8.10.5

module.exports = function ToPropertyDescriptor(Obj) {
	if (Type(Obj) !== 'Object') {
		throw new $TypeError('ToPropertyDescriptor requires an object');
	}

	var desc = {};
	if (has(Obj, 'enumerable')) {
		desc['[[Enumerable]]'] = ToBoolean(Obj.enumerable);
	}
	if (has(Obj, 'configurable')) {
		desc['[[Configurable]]'] = ToBoolean(Obj.configurable);
	}
	if (has(Obj, 'value')) {
		desc['[[Value]]'] = Obj.value;
	}
	if (has(Obj, 'writable')) {
		desc['[[Writable]]'] = ToBoolean(Obj.writable);
	}
	if (has(Obj, 'get')) {
		var getter = Obj.get;
		if (typeof getter !== 'undefined' && !IsCallable(getter)) {
			throw new TypeError('getter must be a function');
		}
		desc['[[Get]]'] = getter;
	}
	if (has(Obj, 'set')) {
		var setter = Obj.set;
		if (typeof setter !== 'undefined' && !IsCallable(setter)) {
			throw new $TypeError('setter must be a function');
		}
		desc['[[Set]]'] = setter;
	}

	if ((has(desc, '[[Get]]') || has(desc, '[[Set]]')) && (has(desc, '[[Value]]') || has(desc, '[[Writable]]'))) {
		throw new $TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
	}
	return desc;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294971,"./ToBoolean":1597942294985,"./IsCallable":1597942294986}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294985, function(require, module, exports) {


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.2

module.exports = function ToBoolean(value) { return !!value; };

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294986, function(require, module, exports) {


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.11

module.exports = require('is-callable');

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294987, function(require, module, exports) {


var $isNaN = require('../helpers/isNaN');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.12

module.exports = function SameValue(x, y) {
	if (x === y) { // 0 === -0, but they are not identical.
		if (x === 0) { return 1 / x === 1 / y; }
		return true;
	}
	return $isNaN(x) && $isNaN(y);
};

}, function(modId) { var map = {"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294988, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');
var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');
var isSamePropertyDescriptor = require('../helpers/isSamePropertyDescriptor');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsGenericDescriptor = require('./IsGenericDescriptor');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-validateandapplypropertydescriptor
// https://www.ecma-international.org/ecma-262/8.0/#sec-validateandapplypropertydescriptor

// eslint-disable-next-line max-lines-per-function, max-statements, max-params
module.exports = function ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current) {
	// this uses the ES2017+ logic, since it fixes a number of bugs in the ES2015 logic.
	var oType = Type(O);
	if (oType !== 'Undefined' && oType !== 'Object') {
		throw new $TypeError('Assertion failed: O must be undefined or an Object');
	}
	if (Type(extensible) !== 'Boolean') {
		throw new $TypeError('Assertion failed: extensible must be a Boolean');
	}
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
	}
	if (Type(current) !== 'Undefined' && !isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, current)) {
		throw new $TypeError('Assertion failed: current must be a Property Descriptor, or undefined');
	}
	if (oType !== 'Undefined' && !IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: if O is not undefined, P must be a Property Key');
	}
	if (Type(current) === 'Undefined') {
		if (!extensible) {
			return false;
		}
		if (IsGenericDescriptor(Desc) || IsDataDescriptor(Desc)) {
			if (oType !== 'Undefined') {
				DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					{
						'[[Configurable]]': Desc['[[Configurable]]'],
						'[[Enumerable]]': Desc['[[Enumerable]]'],
						'[[Value]]': Desc['[[Value]]'],
						'[[Writable]]': Desc['[[Writable]]']
					}
				);
			}
		} else {
			if (!IsAccessorDescriptor(Desc)) {
				throw new $TypeError('Assertion failed: Desc is not an accessor descriptor');
			}
			if (oType !== 'Undefined') {
				return DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					Desc
				);
			}
		}
		return true;
	}
	if (IsGenericDescriptor(Desc) && !('[[Configurable]]' in Desc) && !('[[Enumerable]]' in Desc)) {
		return true;
	}
	if (isSamePropertyDescriptor({ SameValue: SameValue }, Desc, current)) {
		return true; // removed by ES2017, but should still be correct
	}
	// "if every field in Desc is absent, return true" can't really match the assertion that it's a Property Descriptor
	if (!current['[[Configurable]]']) {
		if (Desc['[[Configurable]]']) {
			return false;
		}
		if ('[[Enumerable]]' in Desc && !Desc['[[Enumerable]]'] === !!current['[[Enumerable]]']) {
			return false;
		}
	}
	if (IsGenericDescriptor(Desc)) {
		// no further validation is required.
	} else if (IsDataDescriptor(current) !== IsDataDescriptor(Desc)) {
		if (!current['[[Configurable]]']) {
			return false;
		}
		if (IsDataDescriptor(current)) {
			if (oType !== 'Undefined') {
				DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					{
						'[[Configurable]]': current['[[Configurable]]'],
						'[[Enumerable]]': current['[[Enumerable]]'],
						'[[Get]]': undefined
					}
				);
			}
		} else if (oType !== 'Undefined') {
			DefineOwnProperty(
				IsDataDescriptor,
				SameValue,
				FromPropertyDescriptor,
				O,
				P,
				{
					'[[Configurable]]': current['[[Configurable]]'],
					'[[Enumerable]]': current['[[Enumerable]]'],
					'[[Value]]': undefined
				}
			);
		}
	} else if (IsDataDescriptor(current) && IsDataDescriptor(Desc)) {
		if (!current['[[Configurable]]'] && !current['[[Writable]]']) {
			if ('[[Writable]]' in Desc && Desc['[[Writable]]']) {
				return false;
			}
			if ('[[Value]]' in Desc && !SameValue(Desc['[[Value]]'], current['[[Value]]'])) {
				return false;
			}
			return true;
		}
	} else if (IsAccessorDescriptor(current) && IsAccessorDescriptor(Desc)) {
		if (!current['[[Configurable]]']) {
			if ('[[Set]]' in Desc && !SameValue(Desc['[[Set]]'], current['[[Set]]'])) {
				return false;
			}
			if ('[[Get]]' in Desc && !SameValue(Desc['[[Get]]'], current['[[Get]]'])) {
				return false;
			}
			return true;
		}
	} else {
		throw new $TypeError('Assertion failed: current and Desc are not both data, both accessors, or one accessor and one data.');
	}
	if (oType !== 'Undefined') {
		return DefineOwnProperty(
			IsDataDescriptor,
			SameValue,
			FromPropertyDescriptor,
			O,
			P,
			Desc
		);
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/DefineOwnProperty":1597942294647,"../helpers/isPropertyDescriptor":1597942294599,"../helpers/isSamePropertyDescriptor":1597942294648,"./FromPropertyDescriptor":1597942294989,"./IsAccessorDescriptor":1597942294979,"./IsDataDescriptor":1597942294980,"./IsGenericDescriptor":1597942294990,"./IsPropertyKey":1597942294983,"./SameValue":1597942294987,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294989, function(require, module, exports) {


var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-frompropertydescriptor

module.exports = function FromPropertyDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return Desc;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	var obj = {};
	if ('[[Value]]' in Desc) {
		obj.value = Desc['[[Value]]'];
	}
	if ('[[Writable]]' in Desc) {
		obj.writable = Desc['[[Writable]]'];
	}
	if ('[[Get]]' in Desc) {
		obj.get = Desc['[[Get]]'];
	}
	if ('[[Set]]' in Desc) {
		obj.set = Desc['[[Set]]'];
	}
	if ('[[Enumerable]]' in Desc) {
		obj.enumerable = Desc['[[Enumerable]]'];
	}
	if ('[[Configurable]]' in Desc) {
		obj.configurable = Desc['[[Configurable]]'];
	}
	return obj;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294990, function(require, module, exports) {


var assertRecord = require('../helpers/assertRecord');

var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isgenericdescriptor

module.exports = function IsGenericDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!IsAccessorDescriptor(Desc) && !IsDataDescriptor(Desc)) {
		return true;
	}

	return false;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./IsAccessorDescriptor":1597942294979,"./IsDataDescriptor":1597942294980,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294991, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

var has = require('has');

var IsArray = require('./IsArray');
var IsPropertyKey = require('./IsPropertyKey');
var IsRegExp = require('./IsRegExp');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarygetownproperty

module.exports = function OrdinaryGetOwnProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: O must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	if (!has(O, P)) {
		return void 0;
	}
	if (!$gOPD) {
		// ES3 / IE 8 fallback
		var arrayLength = IsArray(O) && P === 'length';
		var regexLastIndex = IsRegExp(O) && P === 'lastIndex';
		return {
			'[[Configurable]]': !(arrayLength || regexLastIndex),
			'[[Enumerable]]': $isEnumerable(O, P),
			'[[Value]]': O[P],
			'[[Writable]]': true
		};
	}
	return ToPropertyDescriptor($gOPD(O, P));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/callBound":1597942294577,"./IsArray":1597942294978,"./IsPropertyKey":1597942294983,"./IsRegExp":1597942294992,"./ToPropertyDescriptor":1597942294984,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294992, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $match = GetIntrinsic('%Symbol.match%', true);

var hasRegExpMatcher = require('is-regex');

var ToBoolean = require('./ToBoolean');

// https://ecma-international.org/ecma-262/6.0/#sec-isregexp

module.exports = function IsRegExp(argument) {
	if (!argument || typeof argument !== 'object') {
		return false;
	}
	if ($match) {
		var isRegExp = argument[$match];
		if (typeof isRegExp !== 'undefined') {
			return ToBoolean(isRegExp);
		}
	}
	return hasRegExpMatcher(argument);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToBoolean":1597942294985}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294993, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $String = GetIntrinsic('%String%');
var $TypeError = GetIntrinsic('%TypeError%');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tostring

module.exports = function ToString(argument) {
	if (typeof argument === 'symbol') {
		throw new $TypeError('Cannot convert a Symbol value to a string');
	}
	return $String(argument);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294994, function(require, module, exports) {


var ToNumber = require('./ToNumber');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.6

module.exports = function ToUint32(x) {
	return ToNumber(x) >>> 0;
};

}, function(modId) { var map = {"./ToNumber":1597942294969}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294995, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Array = GetIntrinsic('%Array%');
var $species = GetIntrinsic('%Symbol.species%', true);
var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var IsArray = require('./IsArray');
var IsConstructor = require('./IsConstructor');
var IsInteger = require('./IsInteger');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-arrayspeciescreate

module.exports = function ArraySpeciesCreate(originalArray, length) {
	if (!IsInteger(length) || length < 0) {
		throw new $TypeError('Assertion failed: length must be an integer >= 0');
	}
	var len = length === 0 ? 0 : length;
	var C;
	var isArray = IsArray(originalArray);
	if (isArray) {
		C = Get(originalArray, 'constructor');
		// TODO: figure out how to make a cross-realm normal Array, a same-realm Array
		// if (IsConstructor(C)) {
		// 	if C is another realm's Array, C = undefined
		// 	Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(Array))) === null ?
		// }
		if ($species && Type(C) === 'Object') {
			C = Get(C, $species);
			if (C === null) {
				C = void 0;
			}
		}
	}
	if (typeof C === 'undefined') {
		return $Array(len);
	}
	if (!IsConstructor(C)) {
		throw new $TypeError('C must be a constructor');
	}
	return new C(len); // Construct(C, len);
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294996,"./IsArray":1597942294978,"./IsConstructor":1597942294997,"./IsInteger":1597942294975,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294996, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var inspect = require('object-inspect');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

/**
 * 7.3.1 Get (O, P) - https://ecma-international.org/ecma-262/6.0/#sec-get-o-p
 * 1. Assert: Type(O) is Object.
 * 2. Assert: IsPropertyKey(P) is true.
 * 3. Return O.[[Get]](P, O).
 */

module.exports = function Get(O, P) {
	// 7.3.1.1
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	// 7.3.1.2
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true, got ' + inspect(P));
	}
	// 7.3.1.3
	return O[P];
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294983,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294997, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic.js');

var $construct = GetIntrinsic('%Reflect.construct%', true);

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');
try {
	DefinePropertyOrThrow({}, '', { '[[Get]]': function () {} });
} catch (e) {
	// Accessor properties aren't supported
	DefinePropertyOrThrow = null;
}

// https://www.ecma-international.org/ecma-262/6.0/#sec-isconstructor

if (DefinePropertyOrThrow && $construct) {
	var isConstructorMarker = {};
	var badArrayLike = {};
	DefinePropertyOrThrow(badArrayLike, 'length', {
		'[[Get]]': function () {
			throw isConstructorMarker;
		},
		'[[Enumerable]]': true
	});

	module.exports = function IsConstructor(argument) {
		try {
			// `Reflect.construct` invokes `IsConstructor(target)` before `Get(args, 'length')`:
			$construct(argument, badArrayLike);
		} catch (err) {
			return err === isConstructorMarker;
		}
	};
} else {
	module.exports = function IsConstructor(argument) {
		// unfortunately there's no way to truly check this without try/catch `new argument` in old environments
		return typeof argument === 'function' && !!argument.prototype;
	};
}

}, function(modId) { var map = {"../GetIntrinsic.js":1597942294567,"./DefinePropertyOrThrow":1597942294998}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294998, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');
var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-definepropertyorthrow

module.exports = function DefinePropertyOrThrow(O, P, desc) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	var Desc = isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, desc) ? desc : ToPropertyDescriptor(desc);
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc is not a valid Property Descriptor');
	}

	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		Desc
	);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPropertyDescriptor":1597942294599,"../helpers/DefineOwnProperty":1597942294647,"./FromPropertyDescriptor":1597942294989,"./IsAccessorDescriptor":1597942294979,"./IsDataDescriptor":1597942294980,"./IsPropertyKey":1597942294983,"./SameValue":1597942294987,"./ToPropertyDescriptor":1597942294984,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294999, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');
var callBound = require('../helpers/callBound');

var $apply = GetIntrinsic('%Reflect.apply%', true) || callBound('%Function.prototype.apply%');

// https://www.ecma-international.org/ecma-262/6.0/#sec-call

module.exports = function Call(F, V) {
	var args = arguments.length > 2 ? arguments[2] : [];
	return $apply(F, V, args);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295000, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var SameValue = require('./SameValue');
var ToNumber = require('./ToNumber');
var ToString = require('./ToString');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring

module.exports = function CanonicalNumericIndexString(argument) {
	if (Type(argument) !== 'String') {
		throw new $TypeError('Assertion failed: `argument` must be a String');
	}
	if (argument === '-0') { return -0; }
	var n = ToNumber(argument);
	if (SameValue(ToString(n), argument)) { return n; }
	return void 0;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./SameValue":1597942294987,"./ToNumber":1597942294969,"./ToString":1597942294993,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295001, function(require, module, exports) {


var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var IsDataDescriptor = require('./IsDataDescriptor');
var IsGenericDescriptor = require('./IsGenericDescriptor');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-completepropertydescriptor

module.exports = function CompletePropertyDescriptor(Desc) {
	/* eslint no-param-reassign: 0 */
	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (IsGenericDescriptor(Desc) || IsDataDescriptor(Desc)) {
		if (!has(Desc, '[[Value]]')) {
			Desc['[[Value]]'] = void 0;
		}
		if (!has(Desc, '[[Writable]]')) {
			Desc['[[Writable]]'] = false;
		}
	} else {
		if (!has(Desc, '[[Get]]')) {
			Desc['[[Get]]'] = void 0;
		}
		if (!has(Desc, '[[Set]]')) {
			Desc['[[Set]]'] = void 0;
		}
	}
	if (!has(Desc, '[[Enumerable]]')) {
		Desc['[[Enumerable]]'] = false;
	}
	if (!has(Desc, '[[Configurable]]')) {
		Desc['[[Configurable]]'] = false;
	}
	return Desc;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./IsDataDescriptor":1597942294980,"./IsGenericDescriptor":1597942294990,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295002, function(require, module, exports) {


var callBound = require('../helpers/callBound');
var forEach = require('../helpers/forEach');
var OwnPropertyKeys = require('../helpers/OwnPropertyKeys');

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

var CreateDataProperty = require('./CreateDataProperty');
var Get = require('./Get');
var IsArray = require('./IsArray');
var IsInteger = require('./IsInteger');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var ToNumber = require('./ToNumber');
var ToObject = require('./ToObject');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/9.0/#sec-copydataproperties

module.exports = function CopyDataProperties(target, source, excludedItems) {
	if (Type(target) !== 'Object') {
		throw new TypeError('Assertion failed: "target" must be an Object');
	}

	if (!IsArray(excludedItems)) {
		throw new TypeError('Assertion failed: "excludedItems" must be a List of Property Keys');
	}
	for (var i = 0; i < excludedItems.length; i += 1) {
		if (!IsPropertyKey(excludedItems[i])) {
			throw new TypeError('Assertion failed: "excludedItems" must be a List of Property Keys');
		}
	}

	if (typeof source === 'undefined' || source === null) {
		return target;
	}

	var fromObj = ToObject(source);

	var sourceKeys = OwnPropertyKeys(fromObj);
	forEach(sourceKeys, function (nextKey) {
		var excluded = false;

		forEach(excludedItems, function (e) {
			if (SameValue(e, nextKey) === true) {
				excluded = true;
			}
		});

		var enumerable = $isEnumerable(fromObj, nextKey) || (
		// this is to handle string keys being non-enumerable in older engines
			typeof source === 'string'
            && nextKey >= 0
            && IsInteger(ToNumber(nextKey))
		);
		if (excluded === false && enumerable) {
			var propValue = Get(fromObj, nextKey);
			CreateDataProperty(target, nextKey, propValue);
		}
	});

	return target;
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"../helpers/forEach":1597942294720,"../helpers/OwnPropertyKeys":1597942295003,"./CreateDataProperty":1597942295004,"./Get":1597942294996,"./IsArray":1597942294978,"./IsInteger":1597942294975,"./IsPropertyKey":1597942294983,"./SameValue":1597942294987,"./ToNumber":1597942294969,"./ToObject":1597942295005,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295003, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var callBind = require('./callBind');
var callBound = require('./callBound');

var $ownKeys = GetIntrinsic('%Reflect.ownKeys%', true);
var $pushApply = callBind.apply(GetIntrinsic('%Array.prototype.push%'));
var $SymbolValueOf = callBound('Symbol.prototype.valueOf', true);
var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%', true);
var $gOPS = $SymbolValueOf ? GetIntrinsic('%Object.getOwnPropertySymbols%') : null;

var keys = require('object-keys');

module.exports = $ownKeys || function OwnPropertyKeys(source) {
	var ownKeys = ($gOPN || keys)(source);
	if ($gOPS) {
		$pushApply(ownKeys, $gOPS(source));
	}
	return ownKeys;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./callBind":1597942294578,"./callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295004, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var OrdinaryGetOwnProperty = require('./OrdinaryGetOwnProperty');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsExtensible = require('./IsExtensible');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-createdataproperty

module.exports = function CreateDataProperty(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}
	var oldDesc = OrdinaryGetOwnProperty(O, P);
	var extensible = !oldDesc || IsExtensible(O);
	var immutable = oldDesc && (!oldDesc['[[Writable]]'] || !oldDesc['[[Configurable]]']);
	if (immutable || !extensible) {
		return false;
	}
	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		{
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Value]]': V,
			'[[Writable]]': true
		}
	);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/DefineOwnProperty":1597942294647,"./FromPropertyDescriptor":1597942294989,"./OrdinaryGetOwnProperty":1597942294991,"./IsDataDescriptor":1597942294980,"./IsExtensible":1597942294982,"./IsPropertyKey":1597942294983,"./SameValue":1597942294987,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295005, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Object = GetIntrinsic('%Object%');

var RequireObjectCoercible = require('./RequireObjectCoercible');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toobject

module.exports = function ToObject(value) {
	RequireObjectCoercible(value);
	return $Object(value);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./RequireObjectCoercible":1597942295006}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295006, function(require, module, exports) {


module.exports = require('../5/CheckObjectCoercible');

}, function(modId) { var map = {"../5/CheckObjectCoercible":1597942294580}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295007, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var CreateDataProperty = require('./CreateDataProperty');
var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// // https://ecma-international.org/ecma-262/6.0/#sec-createdatapropertyorthrow

module.exports = function CreateDataPropertyOrThrow(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}
	var success = CreateDataProperty(O, P, V);
	if (!success) {
		throw new $TypeError('unable to create data property');
	}
	return success;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./CreateDataProperty":1597942295004,"./IsPropertyKey":1597942294983,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295008, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $replace = callBound('String.prototype.replace');

var RequireObjectCoercible = require('./RequireObjectCoercible');
var ToString = require('./ToString');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-createhtml

module.exports = function CreateHTML(string, tag, attribute, value) {
	if (Type(tag) !== 'String' || Type(attribute) !== 'String') {
		throw new $TypeError('Assertion failed: `tag` and `attribute` must be strings');
	}
	var str = RequireObjectCoercible(string);
	var S = ToString(str);
	var p1 = '<' + tag;
	if (attribute !== '') {
		var V = ToString(value);
		var escapedV = $replace(V, /\x22/g, '&quot;');
		p1 += '\x20' + attribute + '\x3D\x22' + escapedV + '\x22';
	}
	return p1 + '>' + S + '</' + tag + '>';
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./RequireObjectCoercible":1597942295006,"./ToString":1597942294993,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295009, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-createiterresultobject

module.exports = function CreateIterResultObject(value, done) {
	if (Type(done) !== 'Boolean') {
		throw new $TypeError('Assertion failed: Type(done) is not Boolean');
	}
	return {
		value: value,
		done: done
	};
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295010, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var callBound = require('../helpers/callBound');

var $TypeError = GetIntrinsic('%TypeError%');
var $indexOf = callBound('Array.prototype.indexOf', true) || callBound('String.prototype.indexOf');
var $push = callBound('Array.prototype.push');

var Get = require('./Get');
var IsArray = require('./IsArray');
var ToLength = require('./ToLength');
var ToString = require('./ToString');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-createlistfromarraylike
module.exports = function CreateListFromArrayLike(obj) {
	var elementTypes = arguments.length > 1
		? arguments[1]
		: ['Undefined', 'Null', 'Boolean', 'String', 'Symbol', 'Number', 'Object'];

	if (Type(obj) !== 'Object') {
		throw new $TypeError('Assertion failed: `obj` must be an Object');
	}
	if (!IsArray(elementTypes)) {
		throw new $TypeError('Assertion failed: `elementTypes`, if provided, must be an array');
	}
	var len = ToLength(Get(obj, 'length'));
	var list = [];
	var index = 0;
	while (index < len) {
		var indexName = ToString(index);
		var next = Get(obj, indexName);
		var nextType = Type(next);
		if ($indexOf(elementTypes, nextType) < 0) {
			throw new $TypeError('item type ' + nextType + ' is not a valid elementType');
		}
		$push(list, next);
		index += 1;
	}
	return list;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Get":1597942294996,"./IsArray":1597942294978,"./ToLength":1597942295011,"./ToString":1597942294993,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295011, function(require, module, exports) {


var MAX_SAFE_INTEGER = require('../helpers/maxSafeInteger');

var ToInteger = require('./ToInteger');

module.exports = function ToLength(argument) {
	var len = ToInteger(argument);
	if (len <= 0) { return 0; } // includes converting -0 to +0
	if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
	return len;
};

}, function(modId) { var map = {"../helpers/maxSafeInteger":1597942294632,"./ToInteger":1597942295012}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295012, function(require, module, exports) {


var ES5ToInteger = require('../5/ToInteger');

var ToNumber = require('./ToNumber');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tointeger

module.exports = function ToInteger(value) {
	var number = ToNumber(value);
	return ES5ToInteger(number);
};

}, function(modId) { var map = {"../5/ToInteger":1597942294602,"./ToNumber":1597942294969}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295013, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-createmethodproperty

module.exports = function CreateMethodProperty(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	var newDesc = {
		'[[Configurable]]': true,
		'[[Enumerable]]': false,
		'[[Value]]': V,
		'[[Writable]]': true
	};
	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		newDesc
	);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/DefineOwnProperty":1597942294647,"./FromPropertyDescriptor":1597942294989,"./IsDataDescriptor":1597942294980,"./IsPropertyKey":1597942294983,"./SameValue":1597942294987,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295014, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $EvalError = GetIntrinsic('%EvalError%');

var DayWithinYear = require('./DayWithinYear');
var InLeapYear = require('./InLeapYear');
var MonthFromTime = require('./MonthFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.5

module.exports = function DateFromTime(t) {
	var m = MonthFromTime(t);
	var d = DayWithinYear(t);
	if (m === 0) {
		return d + 1;
	}
	if (m === 1) {
		return d - 30;
	}
	var leap = InLeapYear(t);
	if (m === 2) {
		return d - 58 - leap;
	}
	if (m === 3) {
		return d - 89 - leap;
	}
	if (m === 4) {
		return d - 119 - leap;
	}
	if (m === 5) {
		return d - 150 - leap;
	}
	if (m === 6) {
		return d - 180 - leap;
	}
	if (m === 7) {
		return d - 211 - leap;
	}
	if (m === 8) {
		return d - 242 - leap;
	}
	if (m === 9) {
		return d - 272 - leap;
	}
	if (m === 10) {
		return d - 303 - leap;
	}
	if (m === 11) {
		return d - 333 - leap;
	}
	throw new $EvalError('Assertion failed: MonthFromTime returned an impossible value: ' + m);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./DayWithinYear":1597942295015,"./InLeapYear":1597942295019,"./MonthFromTime":1597942295021}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295015, function(require, module, exports) {


var Day = require('./Day');
var DayFromYear = require('./DayFromYear');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.4

module.exports = function DayWithinYear(t) {
	return Day(t) - DayFromYear(YearFromTime(t));
};

}, function(modId) { var map = {"./Day":1597942295016,"./DayFromYear":1597942295017,"./YearFromTime":1597942295018}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295016, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.2

module.exports = function Day(t) {
	return $floor(t / msPerDay);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295017, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function DayFromYear(y) {
	return (365 * (y - 1970)) + $floor((y - 1969) / 4) - $floor((y - 1901) / 100) + $floor((y - 1601) / 400);
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295018, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Date = GetIntrinsic('%Date%');

var callBound = require('../helpers/callBound');

var $getUTCFullYear = callBound('Date.prototype.getUTCFullYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function YearFromTime(t) {
	// largest y such that this.TimeFromYear(y) <= t
	return $getUTCFullYear(new $Date(t));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295019, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $EvalError = GetIntrinsic('%EvalError%');

var DaysInYear = require('./DaysInYear');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function InLeapYear(t) {
	var days = DaysInYear(YearFromTime(t));
	if (days === 365) {
		return 0;
	}
	if (days === 366) {
		return 1;
	}
	throw new $EvalError('Assertion failed: there are not 365 or 366 days in a year, got: ' + days);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./DaysInYear":1597942295020,"./YearFromTime":1597942295018}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295020, function(require, module, exports) {


var mod = require('../helpers/mod');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function DaysInYear(y) {
	if (mod(y, 4) !== 0) {
		return 365;
	}
	if (mod(y, 100) !== 0) {
		return 366;
	}
	if (mod(y, 400) !== 0) {
		return 365;
	}
	return 366;
};

}, function(modId) { var map = {"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295021, function(require, module, exports) {


var DayWithinYear = require('./DayWithinYear');
var InLeapYear = require('./InLeapYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.4

module.exports = function MonthFromTime(t) {
	var day = DayWithinYear(t);
	if (0 <= day && day < 31) {
		return 0;
	}
	var leap = InLeapYear(t);
	if (31 <= day && day < (59 + leap)) {
		return 1;
	}
	if ((59 + leap) <= day && day < (90 + leap)) {
		return 2;
	}
	if ((90 + leap) <= day && day < (120 + leap)) {
		return 3;
	}
	if ((120 + leap) <= day && day < (151 + leap)) {
		return 4;
	}
	if ((151 + leap) <= day && day < (181 + leap)) {
		return 5;
	}
	if ((181 + leap) <= day && day < (212 + leap)) {
		return 6;
	}
	if ((212 + leap) <= day && day < (243 + leap)) {
		return 7;
	}
	if ((243 + leap) <= day && day < (273 + leap)) {
		return 8;
	}
	if ((273 + leap) <= day && day < (304 + leap)) {
		return 9;
	}
	if ((304 + leap) <= day && day < (334 + leap)) {
		return 10;
	}
	if ((334 + leap) <= day && day < (365 + leap)) {
		return 11;
	}
};

}, function(modId) { var map = {"./DayWithinYear":1597942295015,"./InLeapYear":1597942295019}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295022, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var $isNaN = require('../helpers/isNaN');
var padTimeComponent = require('../helpers/padTimeComponent');

var Type = require('./Type');
var WeekDay = require('./WeekDay');
var MonthFromTime = require('./MonthFromTime');
var YearFromTime = require('./YearFromTime');
var DateFromTime = require('./DateFromTime');

// https://www.ecma-international.org/ecma-262/9.0/#sec-datestring

module.exports = function DateString(tv) {
	if (Type(tv) !== 'Number' || $isNaN(tv)) {
		throw new $TypeError('Assertion failed: `tv` must be a non-NaN Number');
	}
	var weekday = weekdays[WeekDay(tv)];
	var month = months[MonthFromTime(tv)];
	var day = padTimeComponent(DateFromTime(tv));
	var year = padTimeComponent(YearFromTime(tv), 4);
	return weekday + '\x20' + month + '\x20' + day + '\x20' + year;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"../helpers/padTimeComponent":1597942295023,"./Type":1597942294971,"./WeekDay":1597942295024,"./MonthFromTime":1597942295021,"./YearFromTime":1597942295018,"./DateFromTime":1597942295014}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295023, function(require, module, exports) {


var callBound = require('../helpers/callBound');

var $strSlice = callBound('String.prototype.slice');

module.exports = function padTimeComponent(c, count) {
	return $strSlice('00' + c, -(count || 2));
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295024, function(require, module, exports) {


var mod = require('../helpers/mod');

var Day = require('./Day');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.6

module.exports = function WeekDay(t) {
	return mod(Day(t) + 4, 7);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589,"./Day":1597942295016}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295025, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-deletepropertyorthrow

module.exports = function DeletePropertyOrThrow(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	// eslint-disable-next-line no-param-reassign
	var success = delete O[P];
	if (!success) {
		throw new $TypeError('Attempt to delete property failed.');
	}
	return success;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294983,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295026, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var objectKeys = require('object-keys');

var callBound = require('../helpers/callBound');

var callBind = require('../helpers/callBind');

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');
var $pushApply = callBind.apply(GetIntrinsic('%Array.prototype.push%'));

var forEach = require('../helpers/forEach');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/8.0/#sec-enumerableownproperties

module.exports = function EnumerableOwnProperties(O, kind) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	var keys = objectKeys(O);
	if (kind === 'key') {
		return keys;
	}
	if (kind === 'value' || kind === 'key+value') {
		var results = [];
		forEach(keys, function (key) {
			if ($isEnumerable(O, key)) {
				$pushApply(results, [
					kind === 'value' ? O[key] : [key, O[key]]
				]);
			}
		});
		return results;
	}
	throw new $TypeError('Assertion failed: "kind" is not "key", "value", or "key+value": ' + kind);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"../helpers/callBind":1597942294578,"../helpers/forEach":1597942294720,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295027, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var getIteratorMethod = require('../helpers/getIteratorMethod');
var AdvanceStringIndex = require('./AdvanceStringIndex');
var Call = require('./Call');
var GetMethod = require('./GetMethod');
var IsArray = require('./IsArray');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-getiterator

module.exports = function GetIterator(obj, method) {
	var actualMethod = method;
	if (arguments.length < 2) {
		actualMethod = getIteratorMethod(
			{
				AdvanceStringIndex: AdvanceStringIndex,
				GetMethod: GetMethod,
				IsArray: IsArray,
				Type: Type
			},
			obj
		);
	}
	var iterator = Call(actualMethod, obj);
	if (Type(iterator) !== 'Object') {
		throw new $TypeError('iterator must return an object');
	}

	return iterator;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getIteratorMethod":1597942294683,"./AdvanceStringIndex":1597942294974,"./Call":1597942294999,"./GetMethod":1597942295028,"./IsArray":1597942294978,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295028, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var GetV = require('./GetV');
var IsCallable = require('./IsCallable');
var IsPropertyKey = require('./IsPropertyKey');

/**
 * 7.3.9 - https://ecma-international.org/ecma-262/6.0/#sec-getmethod
 * 1. Assert: IsPropertyKey(P) is true.
 * 2. Let func be GetV(O, P).
 * 3. ReturnIfAbrupt(func).
 * 4. If func is either undefined or null, return undefined.
 * 5. If IsCallable(func) is false, throw a TypeError exception.
 * 6. Return func.
 */

module.exports = function GetMethod(O, P) {
	// 7.3.9.1
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	// 7.3.9.2
	var func = GetV(O, P);

	// 7.3.9.4
	if (func == null) {
		return void 0;
	}

	// 7.3.9.5
	if (!IsCallable(func)) {
		throw new $TypeError(P + 'is not a function');
	}

	// 7.3.9.6
	return func;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./GetV":1597942295029,"./IsCallable":1597942294986,"./IsPropertyKey":1597942294983}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295029, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var ToObject = require('./ToObject');

/**
 * 7.3.2 GetV (V, P)
 * 1. Assert: IsPropertyKey(P) is true.
 * 2. Let O be ToObject(V).
 * 3. ReturnIfAbrupt(O).
 * 4. Return O.[[Get]](P, V).
 */

module.exports = function GetV(V, P) {
	// 7.3.2.1
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	// 7.3.2.2-3
	var O = ToObject(V);

	// 7.3.2.4
	return O[P];
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294983,"./ToObject":1597942295005}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295030, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var hasSymbols = require('has-symbols')();

var $TypeError = GetIntrinsic('%TypeError%');

var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%');
var $gOPS = hasSymbols && GetIntrinsic('%Object.getOwnPropertySymbols%');
var keys = require('object-keys');

var esType = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-getownpropertykeys

module.exports = function GetOwnPropertyKeys(O, Type) {
	if (esType(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (Type === 'Symbol') {
		return $gOPS ? $gOPS(O) : [];
	}
	if (Type === 'String') {
		if (!$gOPN) {
			return keys(O);
		}
		return $gOPN(O);
	}
	throw new $TypeError('Assertion failed: `Type` must be `"String"` or `"Symbol"`');
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295031, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Function = GetIntrinsic('%Function%');
var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var IsConstructor = require('./IsConstructor');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-getprototypefromconstructor

module.exports = function GetPrototypeFromConstructor(constructor, intrinsicDefaultProto) {
	var intrinsic = GetIntrinsic(intrinsicDefaultProto); // throws if not a valid intrinsic
	if (!IsConstructor(constructor)) {
		throw new $TypeError('Assertion failed: `constructor` must be a constructor');
	}
	var proto = Get(constructor, 'prototype');
	if (Type(proto) !== 'Object') {
		if (!(constructor instanceof $Function)) {
			// ignore other realms, for now
			throw new $TypeError('cross-realm constructors not currently supported');
		}
		proto = intrinsic;
	}
	return proto;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294996,"./IsConstructor":1597942294997,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295032, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');
var regexTester = require('../helpers/regexTester');
var every = require('../helpers/every');

var $charAt = callBound('String.prototype.charAt');
var $strSlice = callBound('String.prototype.slice');
var $indexOf = callBound('String.prototype.indexOf');
var $parseInt = parseInt;

var isDigit = regexTester(/^[0-9]$/);

var inspect = require('object-inspect');

var Get = require('./Get');
var IsArray = require('./IsArray');
var IsInteger = require('./IsInteger');
var ToObject = require('./ToObject');
var ToString = require('./ToString');
var Type = require('./Type');

var canDistinguishSparseFromUndefined = 0 in [undefined]; // IE 6 - 8 have a bug where this returns false

var isStringOrHole = function (capture, index, arr) {
	return Type(capture) === 'String' || (canDistinguishSparseFromUndefined ? !(index in arr) : Type(capture) === 'Undefined');
};

// http://www.ecma-international.org/ecma-262/9.0/#sec-getsubstitution

// eslint-disable-next-line max-statements, max-params, max-lines-per-function
module.exports = function GetSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	if (Type(matched) !== 'String') {
		throw new $TypeError('Assertion failed: `matched` must be a String');
	}
	var matchLength = matched.length;

	if (Type(str) !== 'String') {
		throw new $TypeError('Assertion failed: `str` must be a String');
	}
	var stringLength = str.length;

	if (!IsInteger(position) || position < 0 || position > stringLength) {
		throw new $TypeError('Assertion failed: `position` must be a nonnegative integer, and less than or equal to the length of `string`, got ' + inspect(position));
	}

	if (!IsArray(captures) || !every(captures, isStringOrHole)) {
		throw new $TypeError('Assertion failed: `captures` must be a List of Strings, got ' + inspect(captures));
	}

	if (Type(replacement) !== 'String') {
		throw new $TypeError('Assertion failed: `replacement` must be a String');
	}

	var tailPos = position + matchLength;
	var m = captures.length;
	if (Type(namedCaptures) !== 'Undefined') {
		namedCaptures = ToObject(namedCaptures); // eslint-disable-line no-param-reassign
	}

	var result = '';
	for (var i = 0; i < replacement.length; i += 1) {
		// if this is a $, and it's not the end of the replacement
		var current = $charAt(replacement, i);
		var isLast = (i + 1) >= replacement.length;
		var nextIsLast = (i + 2) >= replacement.length;
		if (current === '$' && !isLast) {
			var next = $charAt(replacement, i + 1);
			if (next === '$') {
				result += '$';
				i += 1;
			} else if (next === '&') {
				result += matched;
				i += 1;
			} else if (next === '`') {
				result += position === 0 ? '' : $strSlice(str, 0, position - 1);
				i += 1;
			} else if (next === "'") {
				result += tailPos >= stringLength ? '' : $strSlice(str, tailPos);
				i += 1;
			} else {
				var nextNext = nextIsLast ? null : $charAt(replacement, i + 2);
				if (isDigit(next) && next !== '0' && (nextIsLast || !isDigit(nextNext))) {
					// $1 through $9, and not followed by a digit
					var n = $parseInt(next, 10);
					// if (n > m, impl-defined)
					result += (n <= m && Type(captures[n - 1]) === 'Undefined') ? '' : captures[n - 1];
					i += 1;
				} else if (isDigit(next) && (nextIsLast || isDigit(nextNext))) {
					// $00 through $99
					var nn = next + nextNext;
					var nnI = $parseInt(nn, 10) - 1;
					// if nn === '00' or nn > m, impl-defined
					result += (nn <= m && Type(captures[nnI]) === 'Undefined') ? '' : captures[nnI];
					i += 2;
				} else if (next === '<') {
					// eslint-disable-next-line max-depth
					if (Type(namedCaptures) === 'Undefined') {
						result += '$<';
						i += 2;
					} else {
						var endIndex = $indexOf(replacement, '>', i);
						// eslint-disable-next-line max-depth
						if (endIndex > -1) {
							var groupName = $strSlice(replacement, i, endIndex);
							var capture = Get(namedCaptures, groupName);
							// eslint-disable-next-line max-depth
							if (Type(capture) !== 'Undefined') {
								result += ToString(capture);
							}
							i += '$<' + groupName + '>'.length;
						}
					}
				} else {
					result += '$';
				}
			}
		} else {
			// the final $, or else not a $
			result += $charAt(replacement, i);
		}
	}
	return result;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"../helpers/regexTester":1597942294624,"../helpers/every":1597942294649,"./Get":1597942294996,"./IsArray":1597942294978,"./IsInteger":1597942294975,"./ToObject":1597942295005,"./ToString":1597942294993,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295033, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var has = require('has');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-hasownproperty

module.exports = function HasOwnProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	return has(O, P);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294983,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295034, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-hasproperty

module.exports = function HasProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	return P in O;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294983,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295035, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerHour = timeConstants.msPerHour;
var HoursPerDay = timeConstants.HoursPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function HourFromTime(t) {
	return mod($floor(t / msPerHour), HoursPerDay);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295036, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $hasInstance = GetIntrinsic('Symbol.hasInstance', true);

var Call = require('./Call');
var GetMethod = require('./GetMethod');
var IsCallable = require('./IsCallable');
var OrdinaryHasInstance = require('./OrdinaryHasInstance');
var ToBoolean = require('./ToBoolean');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-instanceofoperator

module.exports = function InstanceofOperator(O, C) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	var instOfHandler = $hasInstance ? GetMethod(C, $hasInstance) : void 0;
	if (typeof instOfHandler !== 'undefined') {
		return ToBoolean(Call(instOfHandler, C, [O]));
	}
	if (!IsCallable(C)) {
		throw new $TypeError('`C` is not Callable');
	}
	return OrdinaryHasInstance(C, O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Call":1597942294999,"./GetMethod":1597942295028,"./IsCallable":1597942294986,"./OrdinaryHasInstance":1597942295037,"./ToBoolean":1597942294985,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295037, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var IsCallable = require('./IsCallable');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinaryhasinstance

module.exports = function OrdinaryHasInstance(C, O) {
	if (IsCallable(C) === false) {
		return false;
	}
	if (Type(O) !== 'Object') {
		return false;
	}
	var P = Get(C, 'prototype');
	if (Type(P) !== 'Object') {
		throw new $TypeError('OrdinaryHasInstance called on an object with an invalid prototype property.');
	}
	return O instanceof C;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294996,"./IsCallable":1597942294986,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295038, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $arraySlice = require('../helpers/callBound')('Array.prototype.slice');

var Call = require('./Call');
var GetV = require('./GetV');
var IsPropertyKey = require('./IsPropertyKey');

// https://ecma-international.org/ecma-262/6.0/#sec-invoke

module.exports = function Invoke(O, P) {
	if (!IsPropertyKey(P)) {
		throw new $TypeError('P must be a Property Key');
	}
	var argumentsList = $arraySlice(arguments, 2);
	var func = GetV(O, P);
	return Call(func, O, argumentsList);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Call":1597942294999,"./GetV":1597942295029,"./IsPropertyKey":1597942294983}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295039, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $isConcatSpreadable = GetIntrinsic('%Symbol.isConcatSpreadable%', true);

var Get = require('./Get');
var IsArray = require('./IsArray');
var ToBoolean = require('./ToBoolean');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable

module.exports = function IsConcatSpreadable(O) {
	if (Type(O) !== 'Object') {
		return false;
	}
	if ($isConcatSpreadable) {
		var spreadable = Get(O, $isConcatSpreadable);
		if (typeof spreadable !== 'undefined') {
			return ToBoolean(spreadable);
		}
	}
	return IsArray(O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294996,"./IsArray":1597942294978,"./ToBoolean":1597942294985,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295040, function(require, module, exports) {


var callBound = require('../helpers/callBound');

var $PromiseThen = callBound('Promise.prototype.then', true);

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ispromise

module.exports = function IsPromise(x) {
	if (Type(x) !== 'Object') {
		return false;
	}
	if (!$PromiseThen) { // Promises are not supported
		return false;
	}
	try {
		$PromiseThen(x); // throws if not a promise
	} catch (e) {
		return false;
	}
	return true;
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295041, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var isPrefixOf = require('../helpers/isPrefixOf');

// var callBound = require('../helpers/callBound');

// var $charAt = callBound('String.prototype.charAt');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/9.0/#sec-isstringprefix

module.exports = function IsStringPrefix(p, q) {
	if (Type(p) !== 'String') {
		throw new $TypeError('Assertion failed: "p" must be a String');
	}

	if (Type(q) !== 'String') {
		throw new $TypeError('Assertion failed: "q" must be a String');
	}

	return isPrefixOf(p, q);
	/*
	if (p === q || p === '') {
		return true;
	}

	var pLength = p.length;
	var qLength = q.length;
	if (pLength >= qLength) {
		return false;
	}

	// assert: pLength < qLength

	for (var i = 0; i < pLength; i += 1) {
		if ($charAt(p, i) !== $charAt(q, i)) {
			return false;
		}
	}
	return true;
	*/
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPrefixOf":1597942294576,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295042, function(require, module, exports) {


var callBound = require('../helpers/callBound');
var $arrayPush = callBound('Array.prototype.push');

var GetIterator = require('./GetIterator');
var IteratorStep = require('./IteratorStep');
var IteratorValue = require('./IteratorValue');

// https://www.ecma-international.org/ecma-262/8.0/#sec-iterabletolist

module.exports = function IterableToList(items, method) {
	var iterator = GetIterator(items, method);
	var values = [];
	var next = true;
	while (next) {
		next = IteratorStep(iterator);
		if (next) {
			var nextValue = IteratorValue(next);
			$arrayPush(values, nextValue);
		}
	}
	return values;
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./GetIterator":1597942295027,"./IteratorStep":1597942295043,"./IteratorValue":1597942295046}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295043, function(require, module, exports) {


var IteratorComplete = require('./IteratorComplete');
var IteratorNext = require('./IteratorNext');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorstep

module.exports = function IteratorStep(iterator) {
	var result = IteratorNext(iterator);
	var done = IteratorComplete(result);
	return done === true ? false : result;
};


}, function(modId) { var map = {"./IteratorComplete":1597942295044,"./IteratorNext":1597942295045}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295044, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var ToBoolean = require('./ToBoolean');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorcomplete

module.exports = function IteratorComplete(iterResult) {
	if (Type(iterResult) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(iterResult) is not Object');
	}
	return ToBoolean(Get(iterResult, 'done'));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294996,"./ToBoolean":1597942294985,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295045, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Invoke = require('./Invoke');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratornext

module.exports = function IteratorNext(iterator, value) {
	var result = Invoke(iterator, 'next', arguments.length < 2 ? [] : [value]);
	if (Type(result) !== 'Object') {
		throw new $TypeError('iterator next must return an object');
	}
	return result;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Invoke":1597942295038,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295046, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorvalue

module.exports = function IteratorValue(iterResult) {
	if (Type(iterResult) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(iterResult) is not Object');
	}
	return Get(iterResult, 'value');
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942294996,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295047, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Call = require('./Call');
var GetMethod = require('./GetMethod');
var IsCallable = require('./IsCallable');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorclose

module.exports = function IteratorClose(iterator, completion) {
	if (Type(iterator) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(iterator) is not Object');
	}
	if (!IsCallable(completion)) {
		throw new $TypeError('Assertion failed: completion is not a thunk for a Completion Record');
	}
	var completionThunk = completion;

	var iteratorReturn = GetMethod(iterator, 'return');

	if (typeof iteratorReturn === 'undefined') {
		return completionThunk();
	}

	var completionRecord;
	try {
		var innerResult = Call(iteratorReturn, iterator, []);
	} catch (e) {
		// if we hit here, then "e" is the innerResult completion that needs re-throwing

		// if the completion is of type "throw", this will throw.
		completionThunk();
		completionThunk = null; // ensure it's not called twice.

		// if not, then return the innerResult completion
		throw e;
	}
	completionRecord = completionThunk(); // if innerResult worked, then throw if the completion does
	completionThunk = null; // ensure it's not called twice.

	if (Type(innerResult) !== 'Object') {
		throw new $TypeError('iterator .return must return an object');
	}

	return completionRecord;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Call":1597942294999,"./GetMethod":1597942295028,"./IsCallable":1597942294986,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295048, function(require, module, exports) {


var $isFinite = require('../helpers/isFinite');
var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.13

module.exports = function MakeDate(day, time) {
	if (!$isFinite(day) || !$isFinite(time)) {
		return NaN;
	}
	return (day * msPerDay) + time;
};

}, function(modId) { var map = {"../helpers/isFinite":1597942294575,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295049, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');
var $DateUTC = GetIntrinsic('%Date.UTC%');

var mod = require('../helpers/mod');
var $isFinite = require('../helpers/isFinite');

var DateFromTime = require('./DateFromTime');
var Day = require('./Day');
var MonthFromTime = require('./MonthFromTime');
var ToInteger = require('./ToInteger');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.12

module.exports = function MakeDay(year, month, date) {
	if (!$isFinite(year) || !$isFinite(month) || !$isFinite(date)) {
		return NaN;
	}
	var y = ToInteger(year);
	var m = ToInteger(month);
	var dt = ToInteger(date);
	var ym = y + $floor(m / 12);
	var mn = mod(m, 12);
	var t = $DateUTC(ym, mn, 1);
	if (YearFromTime(t) !== ym || MonthFromTime(t) !== mn || DateFromTime(t) !== 1) {
		return NaN;
	}
	return Day(t) + dt - 1;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/isFinite":1597942294575,"./DateFromTime":1597942295014,"./Day":1597942295016,"./MonthFromTime":1597942295021,"./ToInteger":1597942295012,"./YearFromTime":1597942295018}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295050, function(require, module, exports) {


var $isFinite = require('../helpers/isFinite');
var timeConstants = require('../helpers/timeConstants');
var msPerSecond = timeConstants.msPerSecond;
var msPerMinute = timeConstants.msPerMinute;
var msPerHour = timeConstants.msPerHour;

var ToInteger = require('./ToInteger');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.11

module.exports = function MakeTime(hour, min, sec, ms) {
	if (!$isFinite(hour) || !$isFinite(min) || !$isFinite(sec) || !$isFinite(ms)) {
		return NaN;
	}
	var h = ToInteger(hour);
	var m = ToInteger(min);
	var s = ToInteger(sec);
	var milli = ToInteger(ms);
	var t = (h * msPerHour) + (m * msPerMinute) + (s * msPerSecond) + milli;
	return t;
};

}, function(modId) { var map = {"../helpers/isFinite":1597942294575,"../helpers/timeConstants":1597942294584,"./ToInteger":1597942295012}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295051, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerMinute = timeConstants.msPerMinute;
var MinutesPerHour = timeConstants.MinutesPerHour;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function MinFromTime(t) {
	return mod($floor(t / msPerMinute), MinutesPerHour);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295052, function(require, module, exports) {


var mod = require('../helpers/mod');

// https://ecma-international.org/ecma-262/5.1/#sec-5.2

module.exports = function modulo(x, y) {
	return mod(x, y);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295053, function(require, module, exports) {


var mod = require('../helpers/mod');
var msPerSecond = require('../helpers/timeConstants').msPerSecond;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function msFromTime(t) {
	return mod(t, msPerSecond);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295054, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $String = GetIntrinsic('%String%');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/9.0/#sec-tostring-applied-to-the-number-type

module.exports = function NumberToString(m) {
	if (Type(m) !== 'Number') {
		throw new TypeError('Assertion failed: "m" must be a String');
	}

	return $String(m);
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295055, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $ObjectCreate = GetIntrinsic('%Object.create%', true);
var $TypeError = GetIntrinsic('%TypeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');

var Type = require('./Type');

var hasProto = !({ __proto__: null } instanceof Object);

// https://www.ecma-international.org/ecma-262/6.0/#sec-objectcreate

module.exports = function ObjectCreate(proto, internalSlotsList) {
	if (proto !== null && Type(proto) !== 'Object') {
		throw new $TypeError('Assertion failed: `proto` must be null or an object');
	}
	var slots = arguments.length < 2 ? [] : internalSlotsList;
	if (slots.length > 0) {
		throw new $SyntaxError('es-abstract does not yet support internal slots');
	}

	if ($ObjectCreate) {
		return $ObjectCreate(proto);
	}
	if (hasProto) {
		return { __proto__: proto };
	}

	if (proto === null) {
		throw new $SyntaxError('native Object.create support is required to create null objects');
	}
	var T = function T() {};
	T.prototype = proto;
	return new T();
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295056, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $getProto = require('../helpers/getProto');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/7.0/#sec-ordinarygetprototypeof

module.exports = function OrdinaryGetPrototypeOf(O) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: O must be an Object');
	}
	if (!$getProto) {
		throw new $TypeError('This environment does not support fetching prototypes.');
	}
	return $getProto(O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getProto":1597942294824,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295057, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $setProto = require('../helpers/setProto');

var OrdinaryGetPrototypeOf = require('./OrdinaryGetPrototypeOf');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/7.0/#sec-ordinarysetprototypeof

module.exports = function OrdinarySetPrototypeOf(O, V) {
	if (Type(V) !== 'Object' && Type(V) !== 'Null') {
		throw new $TypeError('Assertion failed: V must be Object or Null');
	}
	/*
    var extensible = IsExtensible(O);
    var current = OrdinaryGetPrototypeOf(O);
    if (SameValue(V, current)) {
        return true;
    }
    if (!extensible) {
        return false;
    }
    */
	try {
		$setProto(O, V);
	} catch (e) {
		return false;
	}
	return OrdinaryGetPrototypeOf(O) === V;
	/*
    var p = V;
    var done = false;
    while (!done) {
        if (p === null) {
            done = true;
        } else if (SameValue(p, O)) {
            return false;
        } else {
            if (wat) {
                done = true;
            } else {
                p = p.[[Prototype]];
            }
        }
     }
     O.[[Prototype]] = V;
     return true;
     */
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/setProto":1597942294826,"./OrdinaryGetPrototypeOf":1597942295056,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295058, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinaryhasproperty

module.exports = function OrdinaryHasProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	return P in O;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294983,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295059, function(require, module, exports) {


var callBound = require('../helpers/callBound');

var $PromiseResolve = callBound('Promise.resolve', true);

// https://ecma-international.org/ecma-262/9.0/#sec-promise-resolve

module.exports = function PromiseResolve(C, x) {
	if (!$PromiseResolve) {
		throw new SyntaxError('This environment does not support Promises.');
	}
	return $PromiseResolve(C, x);
};


}, function(modId) { var map = {"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295060, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var regexExec = require('../helpers/callBound')('RegExp.prototype.exec');

var Call = require('./Call');
var Get = require('./Get');
var IsCallable = require('./IsCallable');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-regexpexec

module.exports = function RegExpExec(R, S) {
	if (Type(R) !== 'Object') {
		throw new $TypeError('Assertion failed: `R` must be an Object');
	}
	if (Type(S) !== 'String') {
		throw new $TypeError('Assertion failed: `S` must be a String');
	}
	var exec = Get(R, 'exec');
	if (IsCallable(exec)) {
		var result = Call(exec, R, [S]);
		if (result === null || Type(result) === 'Object') {
			return result;
		}
		throw new $TypeError('"exec" method must return `null` or an Object');
	}
	return regexExec(R, S);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Call":1597942294999,"./Get":1597942294996,"./IsCallable":1597942294986,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295061, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var SameValue = require('./SameValue');

// https://www.ecma-international.org/ecma-262/7.0/#sec-samevaluenonnumber

module.exports = function SameValueNonNumber(x, y) {
	if (typeof x === 'number' || typeof x !== typeof y) {
		throw new $TypeError('SameValueNonNumber requires two non-number values of the same type.');
	}
	return SameValue(x, y);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./SameValue":1597942294987}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295062, function(require, module, exports) {


var $isNaN = require('../helpers/isNaN');

// https://www.ecma-international.org/ecma-262/6.0/#sec-samevaluezero

module.exports = function SameValueZero(x, y) {
	return (x === y) || ($isNaN(x) && $isNaN(y));
};

}, function(modId) { var map = {"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295063, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerSecond = timeConstants.msPerSecond;
var SecondsPerMinute = timeConstants.SecondsPerMinute;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function SecFromTime(t) {
	return mod($floor(t / msPerSecond), SecondsPerMinute);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295064, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// IE 9 does not throw in strict mode when writability/configurability/extensibility is violated
var noThrowOnStrictViolation = (function () {
	try {
		delete [].length;
		return true;
	} catch (e) {
		return false;
	}
}());

// https://ecma-international.org/ecma-262/6.0/#sec-set-o-p-v-throw

module.exports = function Set(O, P, V, Throw) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	if (Type(Throw) !== 'Boolean') {
		throw new $TypeError('Assertion failed: `Throw` must be a Boolean');
	}
	if (Throw) {
		O[P] = V; // eslint-disable-line no-param-reassign
		if (noThrowOnStrictViolation && !SameValue(O[P], V)) {
			throw new $TypeError('Attempted to assign to readonly property.');
		}
		return true;
	} else {
		try {
			O[P] = V; // eslint-disable-line no-param-reassign
			return noThrowOnStrictViolation ? SameValue(O[P], V) : true;
		} catch (e) {
			return false;
		}
	}
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942294983,"./SameValue":1597942294987,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295065, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var has = require('has');

var $TypeError = GetIntrinsic('%TypeError%');

var getSymbolDescription = require('../helpers/getSymbolDescription');

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');
var IsExtensible = require('./IsExtensible');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-setfunctionname

module.exports = function SetFunctionName(F, name) {
	if (typeof F !== 'function') {
		throw new $TypeError('Assertion failed: `F` must be a function');
	}
	if (!IsExtensible(F) || has(F, 'name')) {
		throw new $TypeError('Assertion failed: `F` must be extensible, and must not have a `name` own property');
	}
	var nameType = Type(name);
	if (nameType !== 'Symbol' && nameType !== 'String') {
		throw new $TypeError('Assertion failed: `name` must be a Symbol or a String');
	}
	if (nameType === 'Symbol') {
		var description = getSymbolDescription(name);
		// eslint-disable-next-line no-param-reassign
		name = typeof description === 'undefined' ? '' : '[' + description + ']';
	}
	if (arguments.length > 2) {
		var prefix = arguments[2];
		// eslint-disable-next-line no-param-reassign
		name = prefix + ' ' + name;
	}
	return DefinePropertyOrThrow(F, 'name', {
		'[[Value]]': name,
		'[[Writable]]': false,
		'[[Enumerable]]': false,
		'[[Configurable]]': true
	});
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getSymbolDescription":1597942294717,"./DefinePropertyOrThrow":1597942294998,"./IsExtensible":1597942294982,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295066, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');
var $preventExtensions = GetIntrinsic('%Object.preventExtensions%');
var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%');

var forEach = require('../helpers/forEach');

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-setintegritylevel

module.exports = function SetIntegrityLevel(O, level) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (level !== 'sealed' && level !== 'frozen') {
		throw new $TypeError('Assertion failed: `level` must be `"sealed"` or `"frozen"`');
	}
	if (!$preventExtensions) {
		throw new $SyntaxError('SetIntegrityLevel requires native `Object.preventExtensions` support');
	}
	var status = $preventExtensions(O);
	if (!status) {
		return false;
	}
	if (!$gOPN) {
		throw new $SyntaxError('SetIntegrityLevel requires native `Object.getOwnPropertyNames` support');
	}
	var theKeys = $gOPN(O);
	if (level === 'sealed') {
		forEach(theKeys, function (k) {
			DefinePropertyOrThrow(O, k, { configurable: false });
		});
	} else if (level === 'frozen') {
		forEach(theKeys, function (k) {
			var currentDesc = $gOPD(O, k);
			if (typeof currentDesc !== 'undefined') {
				var desc;
				if (IsAccessorDescriptor(ToPropertyDescriptor(currentDesc))) {
					desc = { configurable: false };
				} else {
					desc = { configurable: false, writable: false };
				}
				DefinePropertyOrThrow(O, k, desc);
			}
		});
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/forEach":1597942294720,"./DefinePropertyOrThrow":1597942294998,"./IsAccessorDescriptor":1597942294979,"./ToPropertyDescriptor":1597942294984,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295067, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $species = GetIntrinsic('%Symbol.species%', true);
var $TypeError = GetIntrinsic('%TypeError%');

var IsConstructor = require('./IsConstructor');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-speciesconstructor

module.exports = function SpeciesConstructor(O, defaultConstructor) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	var C = O.constructor;
	if (typeof C === 'undefined') {
		return defaultConstructor;
	}
	if (Type(C) !== 'Object') {
		throw new $TypeError('O.constructor is not an Object');
	}
	var S = $species ? C[$species] : void 0;
	if (S == null) {
		return defaultConstructor;
	}
	if (IsConstructor(S)) {
		return S;
	}
	throw new $TypeError('no constructor found');
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsConstructor":1597942294997,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295068, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $SymbolToString = callBound('Symbol.prototype.toString', true);

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-symboldescriptivestring

module.exports = function SymbolDescriptiveString(sym) {
	if (Type(sym) !== 'Symbol') {
		throw new $TypeError('Assertion failed: `sym` must be a Symbol');
	}
	return $SymbolToString(sym);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295069, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%');
var $TypeError = GetIntrinsic('%TypeError%');

var every = require('../helpers/every');

var IsDataDescriptor = require('./IsDataDescriptor');
var IsExtensible = require('./IsExtensible');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-testintegritylevel

module.exports = function TestIntegrityLevel(O, level) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (level !== 'sealed' && level !== 'frozen') {
		throw new $TypeError('Assertion failed: `level` must be `"sealed"` or `"frozen"`');
	}
	var status = IsExtensible(O);
	if (status) {
		return false;
	}
	var theKeys = $gOPN(O);
	return theKeys.length === 0 || every(theKeys, function (k) {
		var currentDesc = $gOPD(O, k);
		if (typeof currentDesc !== 'undefined') {
			if (currentDesc.configurable) {
				return false;
			}
			if (level === 'frozen' && IsDataDescriptor(ToPropertyDescriptor(currentDesc)) && currentDesc.writable) {
				return false;
			}
		}
		return true;
	});
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/every":1597942294649,"./IsDataDescriptor":1597942294980,"./IsExtensible":1597942294982,"./ToPropertyDescriptor":1597942294984,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295070, function(require, module, exports) {


var $BooleanValueOf = require('../helpers/callBound')('Boolean.prototype.valueOf');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-boolean-prototype-object

module.exports = function thisBooleanValue(value) {
	if (Type(value) === 'Boolean') {
		return value;
	}

	return $BooleanValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295071, function(require, module, exports) {


var callBound = require('../helpers/callBound');

var Type = require('./Type');

var $NumberValueOf = callBound('Number.prototype.valueOf');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-number-prototype-object

module.exports = function thisNumberValue(value) {
	if (Type(value) === 'Number') {
		return value;
	}

	return $NumberValueOf(value);
};


}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295072, function(require, module, exports) {


var $StringValueOf = require('../helpers/callBound')('String.prototype.valueOf');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-string-prototype-object

module.exports = function thisStringValue(value) {
	if (Type(value) === 'String') {
		return value;
	}

	return $StringValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295073, function(require, module, exports) {


var callBound = require('../helpers/callBound');

var $SymbolValueOf = callBound('Symbol.prototype.valueOf', true);

var Type = require('./Type');

// https://ecma-international.org/ecma-262/9.0/#sec-thissymbolvalue

module.exports = function thisSymbolValue(value) {
	if (!$SymbolValueOf) {
		throw new SyntaxError('Symbols are not supported; thisSymbolValue requires that `value` be a Symbol or a Symbol object');
	}
	if (Type(value) === 'Symbol') {
		return value;
	}
	return $SymbolValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295074, function(require, module, exports) {


var $DateValueOf = require('../helpers/callBound')('Date.prototype.valueOf');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-date-prototype-object

module.exports = function thisTimeValue(value) {
	return $DateValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295075, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Date = GetIntrinsic('%Date%');
var $Number = GetIntrinsic('%Number%');
var $abs = GetIntrinsic('%Math.abs%');

var $isFinite = require('../helpers/isFinite');

var ToNumber = require('./ToNumber');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.14

module.exports = function TimeClip(time) {
	if (!$isFinite(time) || $abs(time) > 8.64e15) {
		return NaN;
	}
	return $Number(new $Date(ToNumber(time)));
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isFinite":1597942294575,"./ToNumber":1597942294969}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295076, function(require, module, exports) {


var msPerDay = require('../helpers/timeConstants').msPerDay;

var DayFromYear = require('./DayFromYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function TimeFromYear(y) {
	return msPerDay * DayFromYear(y);
};

}, function(modId) { var map = {"../helpers/timeConstants":1597942294584,"./DayFromYear":1597942295017}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295077, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $isNaN = require('../helpers/isNaN');
var padTimeComponent = require('../helpers/padTimeComponent');

var HourFromTime = require('./HourFromTime');
var MinFromTime = require('./MinFromTime');
var SecFromTime = require('./SecFromTime');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/9.0/#sec-timestring

module.exports = function TimeString(tv) {
	if (Type(tv) !== 'Number' || $isNaN(tv)) {
		throw new $TypeError('Assertion failed: `tv` must be a non-NaN Number');
	}
	var hour = HourFromTime(tv);
	var minute = MinFromTime(tv);
	var second = SecFromTime(tv);
	return padTimeComponent(hour) + ':' + padTimeComponent(minute) + ':' + padTimeComponent(second) + '\x20GMT';
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"../helpers/padTimeComponent":1597942295023,"./HourFromTime":1597942295035,"./MinFromTime":1597942295051,"./SecFromTime":1597942295063,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295078, function(require, module, exports) {


var mod = require('../helpers/mod');
var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.2

module.exports = function TimeWithinDay(t) {
	return mod(t, msPerDay);
};


}, function(modId) { var map = {"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295079, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $Date = GetIntrinsic('%Date%');

var $isNaN = require('../helpers/isNaN');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-todatestring

module.exports = function ToDateString(tv) {
	if (Type(tv) !== 'Number') {
		throw new $TypeError('Assertion failed: `tv` must be a Number');
	}
	if ($isNaN(tv)) {
		return 'Invalid Date';
	}
	return $Date(tv);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"./Type":1597942294971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295080, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $RangeError = GetIntrinsic('%RangeError%');

var ToInteger = require('./ToInteger');
var ToLength = require('./ToLength');
var SameValueZero = require('./SameValueZero');

// https://www.ecma-international.org/ecma-262/8.0/#sec-toindex

module.exports = function ToIndex(value) {
	if (typeof value === 'undefined') {
		return 0;
	}
	var integerIndex = ToInteger(value);
	if (integerIndex < 0) {
		throw new $RangeError('index must be >= 0');
	}
	var index = ToLength(integerIndex);
	if (!SameValueZero(integerIndex, index)) {
		throw new $RangeError('index must be >= 0 and < 2 ** 53 - 1');
	}
	return index;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToInteger":1597942295012,"./ToLength":1597942295011,"./SameValueZero":1597942295062}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295081, function(require, module, exports) {


var ToUint16 = require('./ToUint16');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toint16

module.exports = function ToInt16(argument) {
	var int16bit = ToUint16(argument);
	return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
};

}, function(modId) { var map = {"./ToUint16":1597942295082}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295082, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var $sign = require('../helpers/sign');
var $mod = require('../helpers/mod');

var $floor = $Math.floor;
var $abs = $Math.abs;

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.7

module.exports = function ToUint16(value) {
	var number = ToNumber(value);
	if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
	var posInt = $sign(number) * $floor($abs(number));
	return $mod(posInt, 0x10000);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942294969,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/sign":1597942294603,"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295083, function(require, module, exports) {


var ToNumber = require('./ToNumber');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.5

module.exports = function ToInt32(x) {
	return ToNumber(x) >> 0;
};

}, function(modId) { var map = {"./ToNumber":1597942294969}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295084, function(require, module, exports) {


var ToUint8 = require('./ToUint8');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toint8

module.exports = function ToInt8(argument) {
	var int8bit = ToUint8(argument);
	return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
};

}, function(modId) { var map = {"./ToUint8":1597942295085}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295085, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var $sign = require('../helpers/sign');
var $mod = require('../helpers/mod');

var $floor = $Math.floor;
var $abs = $Math.abs;

module.exports = function ToUint8(argument) {
	var number = ToNumber(argument);
	if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
	var posInt = $sign(number) * $floor($abs(number));
	return $mod(posInt, 0x100);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942294969,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/sign":1597942294603,"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295086, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $String = GetIntrinsic('%String%');

var ToPrimitive = require('./ToPrimitive');
var ToString = require('./ToString');

// https://www.ecma-international.org/ecma-262/6.0/#sec-topropertykey

module.exports = function ToPropertyKey(argument) {
	var key = ToPrimitive(argument, $String);
	return typeof key === 'symbol' ? key : ToString(key);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToPrimitive":1597942294970,"./ToString":1597942294993}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295087, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');

var $floor = $Math.floor;

// https://www.ecma-international.org/ecma-262/6.0/#sec-touint8clamp

module.exports = function ToUint8Clamp(argument) {
	var number = ToNumber(argument);
	if ($isNaN(number) || number <= 0) { return 0; }
	if (number >= 0xFF) { return 0xFF; }
	var f = $floor(argument);
	if (f + 0.5 < number) { return f + 1; }
	if (number < f + 0.5) { return f; }
	if (f % 2 !== 0) { return f + 1; }
	return f;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942294969,"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295088, function(require, module, exports) {


/* eslint global-require: 0 */
// https://www.ecma-international.org/ecma-262/10.0/#sec-abstract-operations
var ES2019 = {
	'Abstract Equality Comparison': require('./2019/AbstractEqualityComparison'),
	'Abstract Relational Comparison': require('./2019/AbstractRelationalComparison'),
	'Strict Equality Comparison': require('./2019/StrictEqualityComparison'),
	AddEntriesFromIterable: require('./2019/AddEntriesFromIterable'),
	AdvanceStringIndex: require('./2019/AdvanceStringIndex'),
	ArrayCreate: require('./2019/ArrayCreate'),
	ArraySetLength: require('./2019/ArraySetLength'),
	ArraySpeciesCreate: require('./2019/ArraySpeciesCreate'),
	Call: require('./2019/Call'),
	CanonicalNumericIndexString: require('./2019/CanonicalNumericIndexString'),
	CompletePropertyDescriptor: require('./2019/CompletePropertyDescriptor'),
	CopyDataProperties: require('./2019/CopyDataProperties'),
	CreateDataProperty: require('./2019/CreateDataProperty'),
	CreateDataPropertyOrThrow: require('./2019/CreateDataPropertyOrThrow'),
	CreateHTML: require('./2019/CreateHTML'),
	CreateIterResultObject: require('./2019/CreateIterResultObject'),
	CreateListFromArrayLike: require('./2019/CreateListFromArrayLike'),
	CreateMethodProperty: require('./2019/CreateMethodProperty'),
	DateFromTime: require('./2019/DateFromTime'),
	DateString: require('./2019/DateString'),
	Day: require('./2019/Day'),
	DayFromYear: require('./2019/DayFromYear'),
	DaysInYear: require('./2019/DaysInYear'),
	DayWithinYear: require('./2019/DayWithinYear'),
	DefinePropertyOrThrow: require('./2019/DefinePropertyOrThrow'),
	DeletePropertyOrThrow: require('./2019/DeletePropertyOrThrow'),
	EnumerableOwnPropertyNames: require('./2019/EnumerableOwnPropertyNames'),
	FlattenIntoArray: require('./2019/FlattenIntoArray'),
	FromPropertyDescriptor: require('./2019/FromPropertyDescriptor'),
	Get: require('./2019/Get'),
	GetIterator: require('./2019/GetIterator'),
	GetMethod: require('./2019/GetMethod'),
	GetOwnPropertyKeys: require('./2019/GetOwnPropertyKeys'),
	GetPrototypeFromConstructor: require('./2019/GetPrototypeFromConstructor'),
	GetSubstitution: require('./2019/GetSubstitution'),
	GetV: require('./2019/GetV'),
	HasOwnProperty: require('./2019/HasOwnProperty'),
	HasProperty: require('./2019/HasProperty'),
	HourFromTime: require('./2019/HourFromTime'),
	InLeapYear: require('./2019/InLeapYear'),
	InstanceofOperator: require('./2019/InstanceofOperator'),
	Invoke: require('./2019/Invoke'),
	IsAccessorDescriptor: require('./2019/IsAccessorDescriptor'),
	IsArray: require('./2019/IsArray'),
	IsCallable: require('./2019/IsCallable'),
	IsConcatSpreadable: require('./2019/IsConcatSpreadable'),
	IsConstructor: require('./2019/IsConstructor'),
	IsDataDescriptor: require('./2019/IsDataDescriptor'),
	IsExtensible: require('./2019/IsExtensible'),
	IsGenericDescriptor: require('./2019/IsGenericDescriptor'),
	IsInteger: require('./2019/IsInteger'),
	IsPromise: require('./2019/IsPromise'),
	IsPropertyKey: require('./2019/IsPropertyKey'),
	IsRegExp: require('./2019/IsRegExp'),
	IsStringPrefix: require('./2019/IsStringPrefix'),
	IterableToList: require('./2019/IterableToList'),
	IteratorClose: require('./2019/IteratorClose'),
	IteratorComplete: require('./2019/IteratorComplete'),
	IteratorNext: require('./2019/IteratorNext'),
	IteratorStep: require('./2019/IteratorStep'),
	IteratorValue: require('./2019/IteratorValue'),
	MakeDate: require('./2019/MakeDate'),
	MakeDay: require('./2019/MakeDay'),
	MakeTime: require('./2019/MakeTime'),
	MinFromTime: require('./2019/MinFromTime'),
	modulo: require('./2019/modulo'),
	MonthFromTime: require('./2019/MonthFromTime'),
	msFromTime: require('./2019/msFromTime'),
	NumberToString: require('./2019/NumberToString'),
	ObjectCreate: require('./2019/ObjectCreate'),
	OrdinaryDefineOwnProperty: require('./2019/OrdinaryDefineOwnProperty'),
	OrdinaryGetOwnProperty: require('./2019/OrdinaryGetOwnProperty'),
	OrdinaryGetPrototypeOf: require('./2019/OrdinaryGetPrototypeOf'),
	OrdinarySetPrototypeOf: require('./2019/OrdinarySetPrototypeOf'),
	OrdinaryHasInstance: require('./2019/OrdinaryHasInstance'),
	OrdinaryHasProperty: require('./2019/OrdinaryHasProperty'),
	PromiseResolve: require('./2019/PromiseResolve'),
	RegExpExec: require('./2019/RegExpExec'),
	RequireObjectCoercible: require('./2019/RequireObjectCoercible'),
	SameValue: require('./2019/SameValue'),
	SameValueNonNumber: require('./2019/SameValueNonNumber'),
	SameValueZero: require('./2019/SameValueZero'),
	SecFromTime: require('./2019/SecFromTime'),
	Set: require('./2019/Set'),
	SetFunctionName: require('./2019/SetFunctionName'),
	SetIntegrityLevel: require('./2019/SetIntegrityLevel'),
	SpeciesConstructor: require('./2019/SpeciesConstructor'),
	SymbolDescriptiveString: require('./2019/SymbolDescriptiveString'),
	TestIntegrityLevel: require('./2019/TestIntegrityLevel'),
	thisBooleanValue: require('./2019/thisBooleanValue'),
	thisNumberValue: require('./2019/thisNumberValue'),
	thisStringValue: require('./2019/thisStringValue'),
	thisSymbolValue: require('./2019/thisSymbolValue'),
	thisTimeValue: require('./2019/thisTimeValue'),
	TimeClip: require('./2019/TimeClip'),
	TimeFromYear: require('./2019/TimeFromYear'),
	TimeString: require('./2019/TimeString'),
	TimeWithinDay: require('./2019/TimeWithinDay'),
	ToBoolean: require('./2019/ToBoolean'),
	ToDateString: require('./2019/ToDateString'),
	ToIndex: require('./2019/ToIndex'),
	ToInt16: require('./2019/ToInt16'),
	ToInt32: require('./2019/ToInt32'),
	ToInt8: require('./2019/ToInt8'),
	ToInteger: require('./2019/ToInteger'),
	ToLength: require('./2019/ToLength'),
	ToNumber: require('./2019/ToNumber'),
	ToObject: require('./2019/ToObject'),
	ToPrimitive: require('./2019/ToPrimitive'),
	ToPropertyDescriptor: require('./2019/ToPropertyDescriptor'),
	ToPropertyKey: require('./2019/ToPropertyKey'),
	ToString: require('./2019/ToString'),
	ToUint16: require('./2019/ToUint16'),
	ToUint32: require('./2019/ToUint32'),
	ToUint8: require('./2019/ToUint8'),
	ToUint8Clamp: require('./2019/ToUint8Clamp'),
	TrimString: require('./2019/TrimString'),
	Type: require('./2019/Type'),
	ValidateAndApplyPropertyDescriptor: require('./2019/ValidateAndApplyPropertyDescriptor'),
	WeekDay: require('./2019/WeekDay'),
	YearFromTime: require('./2019/YearFromTime')
};

module.exports = ES2019;

}, function(modId) { var map = {"./2019/AbstractEqualityComparison":1597942295089,"./2019/AbstractRelationalComparison":1597942295093,"./2019/StrictEqualityComparison":1597942295094,"./2019/AddEntriesFromIterable":1597942295095,"./2019/AdvanceStringIndex":1597942295100,"./2019/ArrayCreate":1597942295115,"./2019/ArraySetLength":1597942295116,"./2019/ArraySpeciesCreate":1597942295130,"./2019/Call":1597942295096,"./2019/CanonicalNumericIndexString":1597942295133,"./2019/CompletePropertyDescriptor":1597942295134,"./2019/CopyDataProperties":1597942295135,"./2019/CreateDataProperty":1597942295136,"./2019/CreateDataPropertyOrThrow":1597942295137,"./2019/CreateHTML":1597942295138,"./2019/CreateIterResultObject":1597942295139,"./2019/CreateListFromArrayLike":1597942295140,"./2019/CreateMethodProperty":1597942295143,"./2019/DateFromTime":1597942295144,"./2019/DateString":1597942295152,"./2019/Day":1597942295146,"./2019/DayFromYear":1597942295147,"./2019/DaysInYear":1597942295150,"./2019/DayWithinYear":1597942295145,"./2019/DefinePropertyOrThrow":1597942295132,"./2019/DeletePropertyOrThrow":1597942295154,"./2019/EnumerableOwnPropertyNames":1597942295155,"./2019/FlattenIntoArray":1597942295156,"./2019/FromPropertyDescriptor":1597942295124,"./2019/Get":1597942295097,"./2019/GetIterator":1597942295099,"./2019/GetMethod":1597942295102,"./2019/GetOwnPropertyKeys":1597942295158,"./2019/GetPrototypeFromConstructor":1597942295159,"./2019/GetSubstitution":1597942295160,"./2019/GetV":1597942295103,"./2019/HasOwnProperty":1597942295161,"./2019/HasProperty":1597942295157,"./2019/HourFromTime":1597942295162,"./2019/InLeapYear":1597942295149,"./2019/InstanceofOperator":1597942295163,"./2019/Invoke":1597942295113,"./2019/IsAccessorDescriptor":1597942295117,"./2019/IsArray":1597942295107,"./2019/IsCallable":1597942295106,"./2019/IsConcatSpreadable":1597942295165,"./2019/IsConstructor":1597942295131,"./2019/IsDataDescriptor":1597942295118,"./2019/IsExtensible":1597942295120,"./2019/IsGenericDescriptor":1597942295125,"./2019/IsInteger":1597942295101,"./2019/IsPromise":1597942295166,"./2019/IsPropertyKey":1597942295098,"./2019/IsRegExp":1597942295127,"./2019/IsStringPrefix":1597942295167,"./2019/IterableToList":1597942295168,"./2019/IteratorClose":1597942295108,"./2019/IteratorComplete":1597942295110,"./2019/IteratorNext":1597942295112,"./2019/IteratorStep":1597942295109,"./2019/IteratorValue":1597942295114,"./2019/MakeDate":1597942295169,"./2019/MakeDay":1597942295170,"./2019/MakeTime":1597942295171,"./2019/MinFromTime":1597942295172,"./2019/modulo":1597942295173,"./2019/MonthFromTime":1597942295151,"./2019/msFromTime":1597942295174,"./2019/NumberToString":1597942295175,"./2019/ObjectCreate":1597942295176,"./2019/OrdinaryDefineOwnProperty":1597942295119,"./2019/OrdinaryGetOwnProperty":1597942295126,"./2019/OrdinaryGetPrototypeOf":1597942295177,"./2019/OrdinarySetPrototypeOf":1597942295178,"./2019/OrdinaryHasInstance":1597942295164,"./2019/OrdinaryHasProperty":1597942295179,"./2019/PromiseResolve":1597942295180,"./2019/RegExpExec":1597942295181,"./2019/RequireObjectCoercible":1597942295105,"./2019/SameValue":1597942295122,"./2019/SameValueNonNumber":1597942295182,"./2019/SameValueZero":1597942295183,"./2019/SecFromTime":1597942295184,"./2019/Set":1597942295185,"./2019/SetFunctionName":1597942295186,"./2019/SetIntegrityLevel":1597942295187,"./2019/SpeciesConstructor":1597942295188,"./2019/SymbolDescriptiveString":1597942295189,"./2019/TestIntegrityLevel":1597942295190,"./2019/thisBooleanValue":1597942295191,"./2019/thisNumberValue":1597942295192,"./2019/thisStringValue":1597942295193,"./2019/thisSymbolValue":1597942295194,"./2019/thisTimeValue":1597942295195,"./2019/TimeClip":1597942295196,"./2019/TimeFromYear":1597942295197,"./2019/TimeString":1597942295198,"./2019/TimeWithinDay":1597942295199,"./2019/ToBoolean":1597942295111,"./2019/ToDateString":1597942295200,"./2019/ToIndex":1597942295201,"./2019/ToInt16":1597942295202,"./2019/ToInt32":1597942295204,"./2019/ToInt8":1597942295205,"./2019/ToInteger":1597942295142,"./2019/ToLength":1597942295141,"./2019/ToNumber":1597942295090,"./2019/ToObject":1597942295104,"./2019/ToPrimitive":1597942295091,"./2019/ToPropertyDescriptor":1597942295121,"./2019/ToPropertyKey":1597942295207,"./2019/ToString":1597942295128,"./2019/ToUint16":1597942295203,"./2019/ToUint32":1597942295129,"./2019/ToUint8":1597942295206,"./2019/ToUint8Clamp":1597942295208,"./2019/TrimString":1597942295209,"./2019/Type":1597942295092,"./2019/ValidateAndApplyPropertyDescriptor":1597942295123,"./2019/WeekDay":1597942295153,"./2019/YearFromTime":1597942295148}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295089, function(require, module, exports) {


var ToNumber = require('./ToNumber');
var ToPrimitive = require('./ToPrimitive');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-abstract-equality-comparison

module.exports = function AbstractEqualityComparison(x, y) {
	var xType = Type(x);
	var yType = Type(y);
	if (xType === yType) {
		return x === y; // ES6+ specified this shortcut anyways.
	}
	if (x == null && y == null) {
		return true;
	}
	if (xType === 'Number' && yType === 'String') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if (xType === 'String' && yType === 'Number') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (xType === 'Boolean') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (yType === 'Boolean') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if ((xType === 'String' || xType === 'Number' || xType === 'Symbol') && yType === 'Object') {
		return AbstractEqualityComparison(x, ToPrimitive(y));
	}
	if (xType === 'Object' && (yType === 'String' || yType === 'Number' || yType === 'Symbol')) {
		return AbstractEqualityComparison(ToPrimitive(x), y);
	}
	return false;
};

}, function(modId) { var map = {"./ToNumber":1597942295090,"./ToPrimitive":1597942295091,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295090, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $Number = GetIntrinsic('%Number%');
var $RegExp = GetIntrinsic('%RegExp%');
var $parseInteger = GetIntrinsic('%parseInt%');

var callBound = require('../helpers/callBound');
var regexTester = require('../helpers/regexTester');
var isPrimitive = require('../helpers/isPrimitive');

var $strSlice = callBound('String.prototype.slice');
var isBinary = regexTester(/^0b[01]+$/i);
var isOctal = regexTester(/^0o[0-7]+$/i);
var isInvalidHexLiteral = regexTester(/^[-+]0x[0-9a-f]+$/i);
var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
var nonWSregex = new $RegExp('[' + nonWS + ']', 'g');
var hasNonWS = regexTester(nonWSregex);

// whitespace from: https://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = [
	'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
	'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
	'\u2029\uFEFF'
].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var $replace = callBound('String.prototype.replace');
var $trim = function (value) {
	return $replace(value, trimRegex, '');
};

var ToPrimitive = require('./ToPrimitive');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tonumber

module.exports = function ToNumber(argument) {
	var value = isPrimitive(argument) ? argument : ToPrimitive(argument, $Number);
	if (typeof value === 'symbol') {
		throw new $TypeError('Cannot convert a Symbol value to a number');
	}
	if (typeof value === 'string') {
		if (isBinary(value)) {
			return ToNumber($parseInteger($strSlice(value, 2), 2));
		} else if (isOctal(value)) {
			return ToNumber($parseInteger($strSlice(value, 2), 8));
		} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
			return NaN;
		} else {
			var trimmed = $trim(value);
			if (trimmed !== value) {
				return ToNumber(trimmed);
			}
		}
	}
	return $Number(value);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"../helpers/regexTester":1597942294624,"../helpers/isPrimitive":1597942294625,"./ToPrimitive":1597942295091}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295091, function(require, module, exports) {


var toPrimitive = require('es-to-primitive/es2015');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive

module.exports = function ToPrimitive(input) {
	if (arguments.length > 1) {
		return toPrimitive(input, arguments[1]);
	}
	return toPrimitive(input);
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295092, function(require, module, exports) {


var ES5Type = require('../5/Type');

// https://ecma-international.org/ecma-262/6.0/#sec-ecmascript-data-types-and-values

module.exports = function Type(x) {
	if (typeof x === 'symbol') {
		return 'Symbol';
	}
	return ES5Type(x);
};

}, function(modId) { var map = {"../5/Type":1597942294572}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295093, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Number = GetIntrinsic('%Number%');
var $TypeError = GetIntrinsic('%TypeError%');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var isPrefixOf = require('../helpers/isPrefixOf');

var ToNumber = require('./ToNumber');
var ToPrimitive = require('./ToPrimitive');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/5.1/#sec-11.8.5

// eslint-disable-next-line max-statements
module.exports = function AbstractRelationalComparison(x, y, LeftFirst) {
	if (Type(LeftFirst) !== 'Boolean') {
		throw new $TypeError('Assertion failed: LeftFirst argument must be a Boolean');
	}
	var px;
	var py;
	if (LeftFirst) {
		px = ToPrimitive(x, $Number);
		py = ToPrimitive(y, $Number);
	} else {
		py = ToPrimitive(y, $Number);
		px = ToPrimitive(x, $Number);
	}
	var bothStrings = Type(px) === 'String' && Type(py) === 'String';
	if (!bothStrings) {
		var nx = ToNumber(px);
		var ny = ToNumber(py);
		if ($isNaN(nx) || $isNaN(ny)) {
			return undefined;
		}
		if ($isFinite(nx) && $isFinite(ny) && nx === ny) {
			return false;
		}
		if (nx === 0 && ny === 0) {
			return false;
		}
		if (nx === Infinity) {
			return false;
		}
		if (ny === Infinity) {
			return true;
		}
		if (ny === -Infinity) {
			return false;
		}
		if (nx === -Infinity) {
			return true;
		}
		return nx < ny; // by now, these are both nonzero, finite, and not equal
	}
	if (isPrefixOf(py, px)) {
		return false;
	}
	if (isPrefixOf(px, py)) {
		return true;
	}
	return px < py; // both strings, neither a prefix of the other. shortcut for steps c-f
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/isPrefixOf":1597942294576,"./ToNumber":1597942295090,"./ToPrimitive":1597942295091,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295094, function(require, module, exports) {


var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/5.1/#sec-11.9.6

module.exports = function StrictEqualityComparison(x, y) {
	var xType = Type(x);
	var yType = Type(y);
	if (xType !== yType) {
		return false;
	}
	if (xType === 'Undefined' || xType === 'Null') {
		return true;
	}
	return x === y; // shortcut for steps 4-7
};

}, function(modId) { var map = {"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295095, function(require, module, exports) {


var inspect = require('object-inspect');

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Call = require('./Call');
var Get = require('./Get');
var GetIterator = require('./GetIterator');
var IsCallable = require('./IsCallable');
var IteratorClose = require('./IteratorClose');
var IteratorStep = require('./IteratorStep');
var IteratorValue = require('./IteratorValue');
var Type = require('./Type');

// https://tc39.es/ecma262/#sec-add-entries-from-iterable

module.exports = function AddEntriesFromIterable(target, iterable, adder) {
	if (!IsCallable(adder)) {
		throw new $TypeError('Assertion failed: `adder` is not callable');
	}
	if (iterable == null) {
		throw new $TypeError('Assertion failed: `iterable` is present, and not nullish');
	}
	var iteratorRecord = GetIterator(iterable);
	while (true) { // eslint-disable-line no-constant-condition
		var next = IteratorStep(iteratorRecord);
		if (!next) {
			return target;
		}
		var nextItem = IteratorValue(next);
		if (Type(nextItem) !== 'Object') {
			var error = new $TypeError('iterator next must return an Object, got ' + inspect(nextItem));
			return IteratorClose(
				iteratorRecord,
				function () { throw error; } // eslint-disable-line no-loop-func
			);
		}
		try {
			var k = Get(nextItem, '0');
			var v = Get(nextItem, '1');
			Call(adder, target, [k, v]);
		} catch (e) {
			return IteratorClose(
				iteratorRecord,
				function () { throw e; }
			);
		}
	}
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Call":1597942295096,"./Get":1597942295097,"./GetIterator":1597942295099,"./IsCallable":1597942295106,"./IteratorClose":1597942295108,"./IteratorStep":1597942295109,"./IteratorValue":1597942295114,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295096, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');
var callBound = require('../helpers/callBound');

var $apply = GetIntrinsic('%Reflect.apply%', true) || callBound('%Function.prototype.apply%');

// https://www.ecma-international.org/ecma-262/6.0/#sec-call

module.exports = function Call(F, V) {
	var args = arguments.length > 2 ? arguments[2] : [];
	return $apply(F, V, args);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295097, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var inspect = require('object-inspect');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

/**
 * 7.3.1 Get (O, P) - https://ecma-international.org/ecma-262/6.0/#sec-get-o-p
 * 1. Assert: Type(O) is Object.
 * 2. Assert: IsPropertyKey(P) is true.
 * 3. Return O.[[Get]](P, O).
 */

module.exports = function Get(O, P) {
	// 7.3.1.1
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	// 7.3.1.2
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true, got ' + inspect(P));
	}
	// 7.3.1.3
	return O[P];
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942295098,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295098, function(require, module, exports) {


// https://www.ecma-international.org/ecma-262/6.0/#sec-ispropertykey

module.exports = function IsPropertyKey(argument) {
	return typeof argument === 'string' || typeof argument === 'symbol';
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295099, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var getIteratorMethod = require('../helpers/getIteratorMethod');
var AdvanceStringIndex = require('./AdvanceStringIndex');
var Call = require('./Call');
var GetMethod = require('./GetMethod');
var IsArray = require('./IsArray');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-getiterator

module.exports = function GetIterator(obj, method) {
	var actualMethod = method;
	if (arguments.length < 2) {
		actualMethod = getIteratorMethod(
			{
				AdvanceStringIndex: AdvanceStringIndex,
				GetMethod: GetMethod,
				IsArray: IsArray,
				Type: Type
			},
			obj
		);
	}
	var iterator = Call(actualMethod, obj);
	if (Type(iterator) !== 'Object') {
		throw new $TypeError('iterator must return an object');
	}

	return iterator;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getIteratorMethod":1597942294683,"./AdvanceStringIndex":1597942295100,"./Call":1597942295096,"./GetMethod":1597942295102,"./IsArray":1597942295107,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295100, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var IsInteger = require('./IsInteger');
var Type = require('./Type');

var MAX_SAFE_INTEGER = require('../helpers/maxSafeInteger');

var $TypeError = GetIntrinsic('%TypeError%');

var $charCodeAt = require('../helpers/callBound')('String.prototype.charCodeAt');

// https://ecma-international.org/ecma-262/6.0/#sec-advancestringindex

module.exports = function AdvanceStringIndex(S, index, unicode) {
	if (Type(S) !== 'String') {
		throw new $TypeError('Assertion failed: `S` must be a String');
	}
	if (!IsInteger(index) || index < 0 || index > MAX_SAFE_INTEGER) {
		throw new $TypeError('Assertion failed: `length` must be an integer >= 0 and <= 2**53');
	}
	if (Type(unicode) !== 'Boolean') {
		throw new $TypeError('Assertion failed: `unicode` must be a Boolean');
	}
	if (!unicode) {
		return index + 1;
	}
	var length = S.length;
	if ((index + 1) >= length) {
		return index + 1;
	}

	var first = $charCodeAt(S, index);
	if (first < 0xD800 || first > 0xDBFF) {
		return index + 1;
	}

	var second = $charCodeAt(S, index + 1);
	if (second < 0xDC00 || second > 0xDFFF) {
		return index + 1;
	}

	return index + 2;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsInteger":1597942295101,"./Type":1597942295092,"../helpers/maxSafeInteger":1597942294632,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295101, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var $floor = $Math.floor;
var $abs = $Math.abs;

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isinteger

module.exports = function IsInteger(argument) {
	if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
		return false;
	}
	var abs = $abs(argument);
	return $floor(abs) === abs;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295102, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var GetV = require('./GetV');
var IsCallable = require('./IsCallable');
var IsPropertyKey = require('./IsPropertyKey');

/**
 * 7.3.9 - https://ecma-international.org/ecma-262/6.0/#sec-getmethod
 * 1. Assert: IsPropertyKey(P) is true.
 * 2. Let func be GetV(O, P).
 * 3. ReturnIfAbrupt(func).
 * 4. If func is either undefined or null, return undefined.
 * 5. If IsCallable(func) is false, throw a TypeError exception.
 * 6. Return func.
 */

module.exports = function GetMethod(O, P) {
	// 7.3.9.1
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	// 7.3.9.2
	var func = GetV(O, P);

	// 7.3.9.4
	if (func == null) {
		return void 0;
	}

	// 7.3.9.5
	if (!IsCallable(func)) {
		throw new $TypeError(P + 'is not a function');
	}

	// 7.3.9.6
	return func;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./GetV":1597942295103,"./IsCallable":1597942295106,"./IsPropertyKey":1597942295098}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295103, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var ToObject = require('./ToObject');

/**
 * 7.3.2 GetV (V, P)
 * 1. Assert: IsPropertyKey(P) is true.
 * 2. Let O be ToObject(V).
 * 3. ReturnIfAbrupt(O).
 * 4. Return O.[[Get]](P, V).
 */

module.exports = function GetV(V, P) {
	// 7.3.2.1
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	// 7.3.2.2-3
	var O = ToObject(V);

	// 7.3.2.4
	return O[P];
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942295098,"./ToObject":1597942295104}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295104, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Object = GetIntrinsic('%Object%');

var RequireObjectCoercible = require('./RequireObjectCoercible');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toobject

module.exports = function ToObject(value) {
	RequireObjectCoercible(value);
	return $Object(value);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./RequireObjectCoercible":1597942295105}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295105, function(require, module, exports) {


module.exports = require('../5/CheckObjectCoercible');

}, function(modId) { var map = {"../5/CheckObjectCoercible":1597942294580}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295106, function(require, module, exports) {


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.11

module.exports = require('is-callable');

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295107, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Array = GetIntrinsic('%Array%');

// eslint-disable-next-line global-require
var toStr = !$Array.isArray && require('../helpers/callBound')('Object.prototype.toString');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isarray

module.exports = $Array.isArray || function IsArray(argument) {
	return toStr(argument) === '[object Array]';
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295108, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Call = require('./Call');
var GetMethod = require('./GetMethod');
var IsCallable = require('./IsCallable');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorclose

module.exports = function IteratorClose(iterator, completion) {
	if (Type(iterator) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(iterator) is not Object');
	}
	if (!IsCallable(completion)) {
		throw new $TypeError('Assertion failed: completion is not a thunk for a Completion Record');
	}
	var completionThunk = completion;

	var iteratorReturn = GetMethod(iterator, 'return');

	if (typeof iteratorReturn === 'undefined') {
		return completionThunk();
	}

	var completionRecord;
	try {
		var innerResult = Call(iteratorReturn, iterator, []);
	} catch (e) {
		// if we hit here, then "e" is the innerResult completion that needs re-throwing

		// if the completion is of type "throw", this will throw.
		completionThunk();
		completionThunk = null; // ensure it's not called twice.

		// if not, then return the innerResult completion
		throw e;
	}
	completionRecord = completionThunk(); // if innerResult worked, then throw if the completion does
	completionThunk = null; // ensure it's not called twice.

	if (Type(innerResult) !== 'Object') {
		throw new $TypeError('iterator .return must return an object');
	}

	return completionRecord;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Call":1597942295096,"./GetMethod":1597942295102,"./IsCallable":1597942295106,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295109, function(require, module, exports) {


var IteratorComplete = require('./IteratorComplete');
var IteratorNext = require('./IteratorNext');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorstep

module.exports = function IteratorStep(iterator) {
	var result = IteratorNext(iterator);
	var done = IteratorComplete(result);
	return done === true ? false : result;
};


}, function(modId) { var map = {"./IteratorComplete":1597942295110,"./IteratorNext":1597942295112}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295110, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var ToBoolean = require('./ToBoolean');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorcomplete

module.exports = function IteratorComplete(iterResult) {
	if (Type(iterResult) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(iterResult) is not Object');
	}
	return ToBoolean(Get(iterResult, 'done'));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942295097,"./ToBoolean":1597942295111,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295111, function(require, module, exports) {


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.2

module.exports = function ToBoolean(value) { return !!value; };

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295112, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Invoke = require('./Invoke');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratornext

module.exports = function IteratorNext(iterator, value) {
	var result = Invoke(iterator, 'next', arguments.length < 2 ? [] : [value]);
	if (Type(result) !== 'Object') {
		throw new $TypeError('iterator next must return an object');
	}
	return result;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Invoke":1597942295113,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295113, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $arraySlice = require('../helpers/callBound')('Array.prototype.slice');

var Call = require('./Call');
var GetV = require('./GetV');
var IsPropertyKey = require('./IsPropertyKey');

// https://ecma-international.org/ecma-262/6.0/#sec-invoke

module.exports = function Invoke(O, P) {
	if (!IsPropertyKey(P)) {
		throw new $TypeError('P must be a Property Key');
	}
	var argumentsList = $arraySlice(arguments, 2);
	var func = GetV(O, P);
	return Call(func, O, argumentsList);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Call":1597942295096,"./GetV":1597942295103,"./IsPropertyKey":1597942295098}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295114, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorvalue

module.exports = function IteratorValue(iterResult) {
	if (Type(iterResult) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(iterResult) is not Object');
	}
	return Get(iterResult, 'value');
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942295097,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295115, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $ArrayPrototype = GetIntrinsic('%Array.prototype%');
var $RangeError = GetIntrinsic('%RangeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');

var IsInteger = require('./IsInteger');

var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1;

var $setProto = GetIntrinsic('%Object.setPrototypeOf%', true) || (
	// eslint-disable-next-line no-proto, no-negated-condition
	[].__proto__ !== $ArrayPrototype
		? null
		: function (O, proto) {
			O.__proto__ = proto; // eslint-disable-line no-proto, no-param-reassign
			return O;
		}
);

// https://www.ecma-international.org/ecma-262/6.0/#sec-arraycreate

module.exports = function ArrayCreate(length) {
	if (!IsInteger(length) || length < 0) {
		throw new $TypeError('Assertion failed: `length` must be an integer Number >= 0');
	}
	if (length > MAX_ARRAY_LENGTH) {
		throw new $RangeError('length is greater than (2**32 - 1)');
	}
	var proto = arguments.length > 1 ? arguments[1] : $ArrayPrototype;
	var A = []; // steps 5 - 7, and 9
	if (proto !== $ArrayPrototype) { // step 8
		if (!$setProto) {
			throw new $SyntaxError('ArrayCreate: a `proto` argument that is not `Array.prototype` is not supported in an environment that does not support setting the [[Prototype]]');
		}
		$setProto(A, proto);
	}
	if (length !== 0) { // bypasses the need for step 2
		A.length = length;
	}
	/* step 10, the above as a shortcut for the below
    OrdinaryDefineOwnProperty(A, 'length', {
        '[[Configurable]]': false,
        '[[Enumerable]]': false,
        '[[Value]]': length,
        '[[Writable]]': true
    });
    */
	return A;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsInteger":1597942295101}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295116, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $RangeError = GetIntrinsic('%RangeError%');
var $TypeError = GetIntrinsic('%TypeError%');

var assign = require('object.assign');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');

var IsArray = require('./IsArray');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var OrdinaryDefineOwnProperty = require('./OrdinaryDefineOwnProperty');
var OrdinaryGetOwnProperty = require('./OrdinaryGetOwnProperty');
var ToNumber = require('./ToNumber');
var ToString = require('./ToString');
var ToUint32 = require('./ToUint32');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-arraysetlength

// eslint-disable-next-line max-statements, max-lines-per-function
module.exports = function ArraySetLength(A, Desc) {
	if (!IsArray(A)) {
		throw new $TypeError('Assertion failed: A must be an Array');
	}
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
	}
	if (!('[[Value]]' in Desc)) {
		return OrdinaryDefineOwnProperty(A, 'length', Desc);
	}
	var newLenDesc = assign({}, Desc);
	var newLen = ToUint32(Desc['[[Value]]']);
	var numberLen = ToNumber(Desc['[[Value]]']);
	if (newLen !== numberLen) {
		throw new $RangeError('Invalid array length');
	}
	newLenDesc['[[Value]]'] = newLen;
	var oldLenDesc = OrdinaryGetOwnProperty(A, 'length');
	if (!IsDataDescriptor(oldLenDesc)) {
		throw new $TypeError('Assertion failed: an array had a non-data descriptor on `length`');
	}
	var oldLen = oldLenDesc['[[Value]]'];
	if (newLen >= oldLen) {
		return OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
	}
	if (!oldLenDesc['[[Writable]]']) {
		return false;
	}
	var newWritable;
	if (!('[[Writable]]' in newLenDesc) || newLenDesc['[[Writable]]']) {
		newWritable = true;
	} else {
		newWritable = false;
		newLenDesc['[[Writable]]'] = true;
	}
	var succeeded = OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
	if (!succeeded) {
		return false;
	}
	while (newLen < oldLen) {
		oldLen -= 1;
		// eslint-disable-next-line no-param-reassign
		var deleteSucceeded = delete A[ToString(oldLen)];
		if (!deleteSucceeded) {
			newLenDesc['[[Value]]'] = oldLen + 1;
			if (!newWritable) {
				newLenDesc['[[Writable]]'] = false;
				OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
				return false;
			}
		}
	}
	if (!newWritable) {
		return OrdinaryDefineOwnProperty(A, 'length', { '[[Writable]]': false });
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPropertyDescriptor":1597942294599,"./IsArray":1597942295107,"./IsAccessorDescriptor":1597942295117,"./IsDataDescriptor":1597942295118,"./OrdinaryDefineOwnProperty":1597942295119,"./OrdinaryGetOwnProperty":1597942295126,"./ToNumber":1597942295090,"./ToString":1597942295128,"./ToUint32":1597942295129,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295117, function(require, module, exports) {


var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isaccessordescriptor

module.exports = function IsAccessorDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!has(Desc, '[[Get]]') && !has(Desc, '[[Set]]')) {
		return false;
	}

	return true;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295118, function(require, module, exports) {


var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isdatadescriptor

module.exports = function IsDataDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!has(Desc, '[[Value]]') && !has(Desc, '[[Writable]]')) {
		return false;
	}

	return true;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295119, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');

var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsExtensible = require('./IsExtensible');
var IsPropertyKey = require('./IsPropertyKey');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var SameValue = require('./SameValue');
var Type = require('./Type');
var ValidateAndApplyPropertyDescriptor = require('./ValidateAndApplyPropertyDescriptor');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarydefineownproperty

module.exports = function OrdinaryDefineOwnProperty(O, P, Desc) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: O must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
	}
	if (!$gOPD) {
		// ES3/IE 8 fallback
		if (IsAccessorDescriptor(Desc)) {
			throw new $SyntaxError('This environment does not support accessor property descriptors.');
		}
		var creatingNormalDataProperty = !(P in O)
			&& Desc['[[Writable]]']
			&& Desc['[[Enumerable]]']
			&& Desc['[[Configurable]]']
			&& '[[Value]]' in Desc;
		var settingExistingDataProperty = (P in O)
			&& (!('[[Configurable]]' in Desc) || Desc['[[Configurable]]'])
			&& (!('[[Enumerable]]' in Desc) || Desc['[[Enumerable]]'])
			&& (!('[[Writable]]' in Desc) || Desc['[[Writable]]'])
			&& '[[Value]]' in Desc;
		if (creatingNormalDataProperty || settingExistingDataProperty) {
			O[P] = Desc['[[Value]]']; // eslint-disable-line no-param-reassign
			return SameValue(O[P], Desc['[[Value]]']);
		}
		throw new $SyntaxError('This environment does not support defining non-writable, non-enumerable, or non-configurable properties');
	}
	var desc = $gOPD(O, P);
	var current = desc && ToPropertyDescriptor(desc);
	var extensible = IsExtensible(O);
	return ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/isPropertyDescriptor":1597942294599,"./IsAccessorDescriptor":1597942295117,"./IsDataDescriptor":1597942295118,"./IsExtensible":1597942295120,"./IsPropertyKey":1597942295098,"./ToPropertyDescriptor":1597942295121,"./SameValue":1597942295122,"./Type":1597942295092,"./ValidateAndApplyPropertyDescriptor":1597942295123}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295120, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Object = GetIntrinsic('%Object%');

var isPrimitive = require('../helpers/isPrimitive');

var $preventExtensions = $Object.preventExtensions;
var $isExtensible = $Object.isExtensible;

// https://www.ecma-international.org/ecma-262/6.0/#sec-isextensible-o

module.exports = $preventExtensions
	? function IsExtensible(obj) {
		return !isPrimitive(obj) && $isExtensible(obj);
	}
	: function IsExtensible(obj) {
		return !isPrimitive(obj);
	};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPrimitive":1597942294625}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295121, function(require, module, exports) {


var has = require('has');

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Type = require('./Type');
var ToBoolean = require('./ToBoolean');
var IsCallable = require('./IsCallable');

// https://ecma-international.org/ecma-262/5.1/#sec-8.10.5

module.exports = function ToPropertyDescriptor(Obj) {
	if (Type(Obj) !== 'Object') {
		throw new $TypeError('ToPropertyDescriptor requires an object');
	}

	var desc = {};
	if (has(Obj, 'enumerable')) {
		desc['[[Enumerable]]'] = ToBoolean(Obj.enumerable);
	}
	if (has(Obj, 'configurable')) {
		desc['[[Configurable]]'] = ToBoolean(Obj.configurable);
	}
	if (has(Obj, 'value')) {
		desc['[[Value]]'] = Obj.value;
	}
	if (has(Obj, 'writable')) {
		desc['[[Writable]]'] = ToBoolean(Obj.writable);
	}
	if (has(Obj, 'get')) {
		var getter = Obj.get;
		if (typeof getter !== 'undefined' && !IsCallable(getter)) {
			throw new TypeError('getter must be a function');
		}
		desc['[[Get]]'] = getter;
	}
	if (has(Obj, 'set')) {
		var setter = Obj.set;
		if (typeof setter !== 'undefined' && !IsCallable(setter)) {
			throw new $TypeError('setter must be a function');
		}
		desc['[[Set]]'] = setter;
	}

	if ((has(desc, '[[Get]]') || has(desc, '[[Set]]')) && (has(desc, '[[Value]]') || has(desc, '[[Writable]]'))) {
		throw new $TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
	}
	return desc;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942295092,"./ToBoolean":1597942295111,"./IsCallable":1597942295106}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295122, function(require, module, exports) {


var $isNaN = require('../helpers/isNaN');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.12

module.exports = function SameValue(x, y) {
	if (x === y) { // 0 === -0, but they are not identical.
		if (x === 0) { return 1 / x === 1 / y; }
		return true;
	}
	return $isNaN(x) && $isNaN(y);
};

}, function(modId) { var map = {"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295123, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');
var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');
var isSamePropertyDescriptor = require('../helpers/isSamePropertyDescriptor');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsGenericDescriptor = require('./IsGenericDescriptor');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-validateandapplypropertydescriptor
// https://www.ecma-international.org/ecma-262/8.0/#sec-validateandapplypropertydescriptor

// eslint-disable-next-line max-lines-per-function, max-statements, max-params
module.exports = function ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current) {
	// this uses the ES2017+ logic, since it fixes a number of bugs in the ES2015 logic.
	var oType = Type(O);
	if (oType !== 'Undefined' && oType !== 'Object') {
		throw new $TypeError('Assertion failed: O must be undefined or an Object');
	}
	if (Type(extensible) !== 'Boolean') {
		throw new $TypeError('Assertion failed: extensible must be a Boolean');
	}
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
	}
	if (Type(current) !== 'Undefined' && !isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, current)) {
		throw new $TypeError('Assertion failed: current must be a Property Descriptor, or undefined');
	}
	if (oType !== 'Undefined' && !IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: if O is not undefined, P must be a Property Key');
	}
	if (Type(current) === 'Undefined') {
		if (!extensible) {
			return false;
		}
		if (IsGenericDescriptor(Desc) || IsDataDescriptor(Desc)) {
			if (oType !== 'Undefined') {
				DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					{
						'[[Configurable]]': Desc['[[Configurable]]'],
						'[[Enumerable]]': Desc['[[Enumerable]]'],
						'[[Value]]': Desc['[[Value]]'],
						'[[Writable]]': Desc['[[Writable]]']
					}
				);
			}
		} else {
			if (!IsAccessorDescriptor(Desc)) {
				throw new $TypeError('Assertion failed: Desc is not an accessor descriptor');
			}
			if (oType !== 'Undefined') {
				return DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					Desc
				);
			}
		}
		return true;
	}
	if (IsGenericDescriptor(Desc) && !('[[Configurable]]' in Desc) && !('[[Enumerable]]' in Desc)) {
		return true;
	}
	if (isSamePropertyDescriptor({ SameValue: SameValue }, Desc, current)) {
		return true; // removed by ES2017, but should still be correct
	}
	// "if every field in Desc is absent, return true" can't really match the assertion that it's a Property Descriptor
	if (!current['[[Configurable]]']) {
		if (Desc['[[Configurable]]']) {
			return false;
		}
		if ('[[Enumerable]]' in Desc && !Desc['[[Enumerable]]'] === !!current['[[Enumerable]]']) {
			return false;
		}
	}
	if (IsGenericDescriptor(Desc)) {
		// no further validation is required.
	} else if (IsDataDescriptor(current) !== IsDataDescriptor(Desc)) {
		if (!current['[[Configurable]]']) {
			return false;
		}
		if (IsDataDescriptor(current)) {
			if (oType !== 'Undefined') {
				DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					{
						'[[Configurable]]': current['[[Configurable]]'],
						'[[Enumerable]]': current['[[Enumerable]]'],
						'[[Get]]': undefined
					}
				);
			}
		} else if (oType !== 'Undefined') {
			DefineOwnProperty(
				IsDataDescriptor,
				SameValue,
				FromPropertyDescriptor,
				O,
				P,
				{
					'[[Configurable]]': current['[[Configurable]]'],
					'[[Enumerable]]': current['[[Enumerable]]'],
					'[[Value]]': undefined
				}
			);
		}
	} else if (IsDataDescriptor(current) && IsDataDescriptor(Desc)) {
		if (!current['[[Configurable]]'] && !current['[[Writable]]']) {
			if ('[[Writable]]' in Desc && Desc['[[Writable]]']) {
				return false;
			}
			if ('[[Value]]' in Desc && !SameValue(Desc['[[Value]]'], current['[[Value]]'])) {
				return false;
			}
			return true;
		}
	} else if (IsAccessorDescriptor(current) && IsAccessorDescriptor(Desc)) {
		if (!current['[[Configurable]]']) {
			if ('[[Set]]' in Desc && !SameValue(Desc['[[Set]]'], current['[[Set]]'])) {
				return false;
			}
			if ('[[Get]]' in Desc && !SameValue(Desc['[[Get]]'], current['[[Get]]'])) {
				return false;
			}
			return true;
		}
	} else {
		throw new $TypeError('Assertion failed: current and Desc are not both data, both accessors, or one accessor and one data.');
	}
	if (oType !== 'Undefined') {
		return DefineOwnProperty(
			IsDataDescriptor,
			SameValue,
			FromPropertyDescriptor,
			O,
			P,
			Desc
		);
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/DefineOwnProperty":1597942294647,"../helpers/isPropertyDescriptor":1597942294599,"../helpers/isSamePropertyDescriptor":1597942294648,"./FromPropertyDescriptor":1597942295124,"./IsAccessorDescriptor":1597942295117,"./IsDataDescriptor":1597942295118,"./IsGenericDescriptor":1597942295125,"./IsPropertyKey":1597942295098,"./SameValue":1597942295122,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295124, function(require, module, exports) {


var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-frompropertydescriptor

module.exports = function FromPropertyDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return Desc;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	var obj = {};
	if ('[[Value]]' in Desc) {
		obj.value = Desc['[[Value]]'];
	}
	if ('[[Writable]]' in Desc) {
		obj.writable = Desc['[[Writable]]'];
	}
	if ('[[Get]]' in Desc) {
		obj.get = Desc['[[Get]]'];
	}
	if ('[[Set]]' in Desc) {
		obj.set = Desc['[[Set]]'];
	}
	if ('[[Enumerable]]' in Desc) {
		obj.enumerable = Desc['[[Enumerable]]'];
	}
	if ('[[Configurable]]' in Desc) {
		obj.configurable = Desc['[[Configurable]]'];
	}
	return obj;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295125, function(require, module, exports) {


var assertRecord = require('../helpers/assertRecord');

var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isgenericdescriptor

module.exports = function IsGenericDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!IsAccessorDescriptor(Desc) && !IsDataDescriptor(Desc)) {
		return true;
	}

	return false;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./IsAccessorDescriptor":1597942295117,"./IsDataDescriptor":1597942295118,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295126, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

var has = require('has');

var IsArray = require('./IsArray');
var IsPropertyKey = require('./IsPropertyKey');
var IsRegExp = require('./IsRegExp');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarygetownproperty

module.exports = function OrdinaryGetOwnProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: O must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	if (!has(O, P)) {
		return void 0;
	}
	if (!$gOPD) {
		// ES3 / IE 8 fallback
		var arrayLength = IsArray(O) && P === 'length';
		var regexLastIndex = IsRegExp(O) && P === 'lastIndex';
		return {
			'[[Configurable]]': !(arrayLength || regexLastIndex),
			'[[Enumerable]]': $isEnumerable(O, P),
			'[[Value]]': O[P],
			'[[Writable]]': true
		};
	}
	return ToPropertyDescriptor($gOPD(O, P));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/callBound":1597942294577,"./IsArray":1597942295107,"./IsPropertyKey":1597942295098,"./IsRegExp":1597942295127,"./ToPropertyDescriptor":1597942295121,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295127, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $match = GetIntrinsic('%Symbol.match%', true);

var hasRegExpMatcher = require('is-regex');

var ToBoolean = require('./ToBoolean');

// https://ecma-international.org/ecma-262/6.0/#sec-isregexp

module.exports = function IsRegExp(argument) {
	if (!argument || typeof argument !== 'object') {
		return false;
	}
	if ($match) {
		var isRegExp = argument[$match];
		if (typeof isRegExp !== 'undefined') {
			return ToBoolean(isRegExp);
		}
	}
	return hasRegExpMatcher(argument);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToBoolean":1597942295111}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295128, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $String = GetIntrinsic('%String%');
var $TypeError = GetIntrinsic('%TypeError%');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tostring

module.exports = function ToString(argument) {
	if (typeof argument === 'symbol') {
		throw new $TypeError('Cannot convert a Symbol value to a string');
	}
	return $String(argument);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295129, function(require, module, exports) {


var ToNumber = require('./ToNumber');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.6

module.exports = function ToUint32(x) {
	return ToNumber(x) >>> 0;
};

}, function(modId) { var map = {"./ToNumber":1597942295090}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295130, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Array = GetIntrinsic('%Array%');
var $species = GetIntrinsic('%Symbol.species%', true);
var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var IsArray = require('./IsArray');
var IsConstructor = require('./IsConstructor');
var IsInteger = require('./IsInteger');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-arrayspeciescreate

module.exports = function ArraySpeciesCreate(originalArray, length) {
	if (!IsInteger(length) || length < 0) {
		throw new $TypeError('Assertion failed: length must be an integer >= 0');
	}
	var len = length === 0 ? 0 : length;
	var C;
	var isArray = IsArray(originalArray);
	if (isArray) {
		C = Get(originalArray, 'constructor');
		// TODO: figure out how to make a cross-realm normal Array, a same-realm Array
		// if (IsConstructor(C)) {
		// 	if C is another realm's Array, C = undefined
		// 	Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(Array))) === null ?
		// }
		if ($species && Type(C) === 'Object') {
			C = Get(C, $species);
			if (C === null) {
				C = void 0;
			}
		}
	}
	if (typeof C === 'undefined') {
		return $Array(len);
	}
	if (!IsConstructor(C)) {
		throw new $TypeError('C must be a constructor');
	}
	return new C(len); // Construct(C, len);
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942295097,"./IsArray":1597942295107,"./IsConstructor":1597942295131,"./IsInteger":1597942295101,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295131, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic.js');

var $construct = GetIntrinsic('%Reflect.construct%', true);

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');
try {
	DefinePropertyOrThrow({}, '', { '[[Get]]': function () {} });
} catch (e) {
	// Accessor properties aren't supported
	DefinePropertyOrThrow = null;
}

// https://www.ecma-international.org/ecma-262/6.0/#sec-isconstructor

if (DefinePropertyOrThrow && $construct) {
	var isConstructorMarker = {};
	var badArrayLike = {};
	DefinePropertyOrThrow(badArrayLike, 'length', {
		'[[Get]]': function () {
			throw isConstructorMarker;
		},
		'[[Enumerable]]': true
	});

	module.exports = function IsConstructor(argument) {
		try {
			// `Reflect.construct` invokes `IsConstructor(target)` before `Get(args, 'length')`:
			$construct(argument, badArrayLike);
		} catch (err) {
			return err === isConstructorMarker;
		}
	};
} else {
	module.exports = function IsConstructor(argument) {
		// unfortunately there's no way to truly check this without try/catch `new argument` in old environments
		return typeof argument === 'function' && !!argument.prototype;
	};
}

}, function(modId) { var map = {"../GetIntrinsic.js":1597942294567,"./DefinePropertyOrThrow":1597942295132}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295132, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');
var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-definepropertyorthrow

module.exports = function DefinePropertyOrThrow(O, P, desc) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	var Desc = isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, desc) ? desc : ToPropertyDescriptor(desc);
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc is not a valid Property Descriptor');
	}

	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		Desc
	);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPropertyDescriptor":1597942294599,"../helpers/DefineOwnProperty":1597942294647,"./FromPropertyDescriptor":1597942295124,"./IsAccessorDescriptor":1597942295117,"./IsDataDescriptor":1597942295118,"./IsPropertyKey":1597942295098,"./SameValue":1597942295122,"./ToPropertyDescriptor":1597942295121,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295133, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var SameValue = require('./SameValue');
var ToNumber = require('./ToNumber');
var ToString = require('./ToString');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring

module.exports = function CanonicalNumericIndexString(argument) {
	if (Type(argument) !== 'String') {
		throw new $TypeError('Assertion failed: `argument` must be a String');
	}
	if (argument === '-0') { return -0; }
	var n = ToNumber(argument);
	if (SameValue(ToString(n), argument)) { return n; }
	return void 0;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./SameValue":1597942295122,"./ToNumber":1597942295090,"./ToString":1597942295128,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295134, function(require, module, exports) {


var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var IsDataDescriptor = require('./IsDataDescriptor');
var IsGenericDescriptor = require('./IsGenericDescriptor');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-completepropertydescriptor

module.exports = function CompletePropertyDescriptor(Desc) {
	/* eslint no-param-reassign: 0 */
	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (IsGenericDescriptor(Desc) || IsDataDescriptor(Desc)) {
		if (!has(Desc, '[[Value]]')) {
			Desc['[[Value]]'] = void 0;
		}
		if (!has(Desc, '[[Writable]]')) {
			Desc['[[Writable]]'] = false;
		}
	} else {
		if (!has(Desc, '[[Get]]')) {
			Desc['[[Get]]'] = void 0;
		}
		if (!has(Desc, '[[Set]]')) {
			Desc['[[Set]]'] = void 0;
		}
	}
	if (!has(Desc, '[[Enumerable]]')) {
		Desc['[[Enumerable]]'] = false;
	}
	if (!has(Desc, '[[Configurable]]')) {
		Desc['[[Configurable]]'] = false;
	}
	return Desc;
};

}, function(modId) { var map = {"../helpers/assertRecord":1597942294593,"./IsDataDescriptor":1597942295118,"./IsGenericDescriptor":1597942295125,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295135, function(require, module, exports) {


var callBound = require('../helpers/callBound');
var forEach = require('../helpers/forEach');
var OwnPropertyKeys = require('../helpers/OwnPropertyKeys');

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

var CreateDataProperty = require('./CreateDataProperty');
var Get = require('./Get');
var IsArray = require('./IsArray');
var IsInteger = require('./IsInteger');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var ToNumber = require('./ToNumber');
var ToObject = require('./ToObject');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/9.0/#sec-copydataproperties

module.exports = function CopyDataProperties(target, source, excludedItems) {
	if (Type(target) !== 'Object') {
		throw new TypeError('Assertion failed: "target" must be an Object');
	}

	if (!IsArray(excludedItems)) {
		throw new TypeError('Assertion failed: "excludedItems" must be a List of Property Keys');
	}
	for (var i = 0; i < excludedItems.length; i += 1) {
		if (!IsPropertyKey(excludedItems[i])) {
			throw new TypeError('Assertion failed: "excludedItems" must be a List of Property Keys');
		}
	}

	if (typeof source === 'undefined' || source === null) {
		return target;
	}

	var fromObj = ToObject(source);

	var sourceKeys = OwnPropertyKeys(fromObj);
	forEach(sourceKeys, function (nextKey) {
		var excluded = false;

		forEach(excludedItems, function (e) {
			if (SameValue(e, nextKey) === true) {
				excluded = true;
			}
		});

		var enumerable = $isEnumerable(fromObj, nextKey) || (
		// this is to handle string keys being non-enumerable in older engines
			typeof source === 'string'
            && nextKey >= 0
            && IsInteger(ToNumber(nextKey))
		);
		if (excluded === false && enumerable) {
			var propValue = Get(fromObj, nextKey);
			CreateDataProperty(target, nextKey, propValue);
		}
	});

	return target;
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"../helpers/forEach":1597942294720,"../helpers/OwnPropertyKeys":1597942295003,"./CreateDataProperty":1597942295136,"./Get":1597942295097,"./IsArray":1597942295107,"./IsInteger":1597942295101,"./IsPropertyKey":1597942295098,"./SameValue":1597942295122,"./ToNumber":1597942295090,"./ToObject":1597942295104,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295136, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var OrdinaryGetOwnProperty = require('./OrdinaryGetOwnProperty');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsExtensible = require('./IsExtensible');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-createdataproperty

module.exports = function CreateDataProperty(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}
	var oldDesc = OrdinaryGetOwnProperty(O, P);
	var extensible = !oldDesc || IsExtensible(O);
	var immutable = oldDesc && (!oldDesc['[[Writable]]'] || !oldDesc['[[Configurable]]']);
	if (immutable || !extensible) {
		return false;
	}
	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		{
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Value]]': V,
			'[[Writable]]': true
		}
	);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/DefineOwnProperty":1597942294647,"./FromPropertyDescriptor":1597942295124,"./OrdinaryGetOwnProperty":1597942295126,"./IsDataDescriptor":1597942295118,"./IsExtensible":1597942295120,"./IsPropertyKey":1597942295098,"./SameValue":1597942295122,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295137, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var CreateDataProperty = require('./CreateDataProperty');
var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// // https://ecma-international.org/ecma-262/6.0/#sec-createdatapropertyorthrow

module.exports = function CreateDataPropertyOrThrow(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}
	var success = CreateDataProperty(O, P, V);
	if (!success) {
		throw new $TypeError('unable to create data property');
	}
	return success;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./CreateDataProperty":1597942295136,"./IsPropertyKey":1597942295098,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295138, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $replace = callBound('String.prototype.replace');

var RequireObjectCoercible = require('./RequireObjectCoercible');
var ToString = require('./ToString');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-createhtml

module.exports = function CreateHTML(string, tag, attribute, value) {
	if (Type(tag) !== 'String' || Type(attribute) !== 'String') {
		throw new $TypeError('Assertion failed: `tag` and `attribute` must be strings');
	}
	var str = RequireObjectCoercible(string);
	var S = ToString(str);
	var p1 = '<' + tag;
	if (attribute !== '') {
		var V = ToString(value);
		var escapedV = $replace(V, /\x22/g, '&quot;');
		p1 += '\x20' + attribute + '\x3D\x22' + escapedV + '\x22';
	}
	return p1 + '>' + S + '</' + tag + '>';
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./RequireObjectCoercible":1597942295105,"./ToString":1597942295128,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295139, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-createiterresultobject

module.exports = function CreateIterResultObject(value, done) {
	if (Type(done) !== 'Boolean') {
		throw new $TypeError('Assertion failed: Type(done) is not Boolean');
	}
	return {
		value: value,
		done: done
	};
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295140, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var callBound = require('../helpers/callBound');

var $TypeError = GetIntrinsic('%TypeError%');
var $indexOf = callBound('Array.prototype.indexOf', true) || callBound('String.prototype.indexOf');
var $push = callBound('Array.prototype.push');

var Get = require('./Get');
var IsArray = require('./IsArray');
var ToLength = require('./ToLength');
var ToString = require('./ToString');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-createlistfromarraylike
module.exports = function CreateListFromArrayLike(obj) {
	var elementTypes = arguments.length > 1
		? arguments[1]
		: ['Undefined', 'Null', 'Boolean', 'String', 'Symbol', 'Number', 'Object'];

	if (Type(obj) !== 'Object') {
		throw new $TypeError('Assertion failed: `obj` must be an Object');
	}
	if (!IsArray(elementTypes)) {
		throw new $TypeError('Assertion failed: `elementTypes`, if provided, must be an array');
	}
	var len = ToLength(Get(obj, 'length'));
	var list = [];
	var index = 0;
	while (index < len) {
		var indexName = ToString(index);
		var next = Get(obj, indexName);
		var nextType = Type(next);
		if ($indexOf(elementTypes, nextType) < 0) {
			throw new $TypeError('item type ' + nextType + ' is not a valid elementType');
		}
		$push(list, next);
		index += 1;
	}
	return list;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Get":1597942295097,"./IsArray":1597942295107,"./ToLength":1597942295141,"./ToString":1597942295128,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295141, function(require, module, exports) {


var MAX_SAFE_INTEGER = require('../helpers/maxSafeInteger');

var ToInteger = require('./ToInteger');

module.exports = function ToLength(argument) {
	var len = ToInteger(argument);
	if (len <= 0) { return 0; } // includes converting -0 to +0
	if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
	return len;
};

}, function(modId) { var map = {"../helpers/maxSafeInteger":1597942294632,"./ToInteger":1597942295142}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295142, function(require, module, exports) {


var ES5ToInteger = require('../5/ToInteger');

var ToNumber = require('./ToNumber');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tointeger

module.exports = function ToInteger(value) {
	var number = ToNumber(value);
	return ES5ToInteger(number);
};

}, function(modId) { var map = {"../5/ToInteger":1597942294602,"./ToNumber":1597942295090}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295143, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');
var IsDataDescriptor = require('./IsDataDescriptor');
var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-createmethodproperty

module.exports = function CreateMethodProperty(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	var newDesc = {
		'[[Configurable]]': true,
		'[[Enumerable]]': false,
		'[[Value]]': V,
		'[[Writable]]': true
	};
	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		newDesc
	);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/DefineOwnProperty":1597942294647,"./FromPropertyDescriptor":1597942295124,"./IsDataDescriptor":1597942295118,"./IsPropertyKey":1597942295098,"./SameValue":1597942295122,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295144, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $EvalError = GetIntrinsic('%EvalError%');

var DayWithinYear = require('./DayWithinYear');
var InLeapYear = require('./InLeapYear');
var MonthFromTime = require('./MonthFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.5

module.exports = function DateFromTime(t) {
	var m = MonthFromTime(t);
	var d = DayWithinYear(t);
	if (m === 0) {
		return d + 1;
	}
	if (m === 1) {
		return d - 30;
	}
	var leap = InLeapYear(t);
	if (m === 2) {
		return d - 58 - leap;
	}
	if (m === 3) {
		return d - 89 - leap;
	}
	if (m === 4) {
		return d - 119 - leap;
	}
	if (m === 5) {
		return d - 150 - leap;
	}
	if (m === 6) {
		return d - 180 - leap;
	}
	if (m === 7) {
		return d - 211 - leap;
	}
	if (m === 8) {
		return d - 242 - leap;
	}
	if (m === 9) {
		return d - 272 - leap;
	}
	if (m === 10) {
		return d - 303 - leap;
	}
	if (m === 11) {
		return d - 333 - leap;
	}
	throw new $EvalError('Assertion failed: MonthFromTime returned an impossible value: ' + m);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./DayWithinYear":1597942295145,"./InLeapYear":1597942295149,"./MonthFromTime":1597942295151}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295145, function(require, module, exports) {


var Day = require('./Day');
var DayFromYear = require('./DayFromYear');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.4

module.exports = function DayWithinYear(t) {
	return Day(t) - DayFromYear(YearFromTime(t));
};

}, function(modId) { var map = {"./Day":1597942295146,"./DayFromYear":1597942295147,"./YearFromTime":1597942295148}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295146, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.2

module.exports = function Day(t) {
	return $floor(t / msPerDay);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295147, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function DayFromYear(y) {
	return (365 * (y - 1970)) + $floor((y - 1969) / 4) - $floor((y - 1901) / 100) + $floor((y - 1601) / 400);
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295148, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Date = GetIntrinsic('%Date%');

var callBound = require('../helpers/callBound');

var $getUTCFullYear = callBound('Date.prototype.getUTCFullYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function YearFromTime(t) {
	// largest y such that this.TimeFromYear(y) <= t
	return $getUTCFullYear(new $Date(t));
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295149, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $EvalError = GetIntrinsic('%EvalError%');

var DaysInYear = require('./DaysInYear');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function InLeapYear(t) {
	var days = DaysInYear(YearFromTime(t));
	if (days === 365) {
		return 0;
	}
	if (days === 366) {
		return 1;
	}
	throw new $EvalError('Assertion failed: there are not 365 or 366 days in a year, got: ' + days);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./DaysInYear":1597942295150,"./YearFromTime":1597942295148}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295150, function(require, module, exports) {


var mod = require('../helpers/mod');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function DaysInYear(y) {
	if (mod(y, 4) !== 0) {
		return 365;
	}
	if (mod(y, 100) !== 0) {
		return 366;
	}
	if (mod(y, 400) !== 0) {
		return 365;
	}
	return 366;
};

}, function(modId) { var map = {"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295151, function(require, module, exports) {


var DayWithinYear = require('./DayWithinYear');
var InLeapYear = require('./InLeapYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.4

module.exports = function MonthFromTime(t) {
	var day = DayWithinYear(t);
	if (0 <= day && day < 31) {
		return 0;
	}
	var leap = InLeapYear(t);
	if (31 <= day && day < (59 + leap)) {
		return 1;
	}
	if ((59 + leap) <= day && day < (90 + leap)) {
		return 2;
	}
	if ((90 + leap) <= day && day < (120 + leap)) {
		return 3;
	}
	if ((120 + leap) <= day && day < (151 + leap)) {
		return 4;
	}
	if ((151 + leap) <= day && day < (181 + leap)) {
		return 5;
	}
	if ((181 + leap) <= day && day < (212 + leap)) {
		return 6;
	}
	if ((212 + leap) <= day && day < (243 + leap)) {
		return 7;
	}
	if ((243 + leap) <= day && day < (273 + leap)) {
		return 8;
	}
	if ((273 + leap) <= day && day < (304 + leap)) {
		return 9;
	}
	if ((304 + leap) <= day && day < (334 + leap)) {
		return 10;
	}
	if ((334 + leap) <= day && day < (365 + leap)) {
		return 11;
	}
};

}, function(modId) { var map = {"./DayWithinYear":1597942295145,"./InLeapYear":1597942295149}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295152, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var $isNaN = require('../helpers/isNaN');
var padTimeComponent = require('../helpers/padTimeComponent');

var Type = require('./Type');
var WeekDay = require('./WeekDay');
var MonthFromTime = require('./MonthFromTime');
var YearFromTime = require('./YearFromTime');
var DateFromTime = require('./DateFromTime');

// https://www.ecma-international.org/ecma-262/9.0/#sec-datestring

module.exports = function DateString(tv) {
	if (Type(tv) !== 'Number' || $isNaN(tv)) {
		throw new $TypeError('Assertion failed: `tv` must be a non-NaN Number');
	}
	var weekday = weekdays[WeekDay(tv)];
	var month = months[MonthFromTime(tv)];
	var day = padTimeComponent(DateFromTime(tv));
	var year = padTimeComponent(YearFromTime(tv), 4);
	return weekday + '\x20' + month + '\x20' + day + '\x20' + year;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"../helpers/padTimeComponent":1597942295023,"./Type":1597942295092,"./WeekDay":1597942295153,"./MonthFromTime":1597942295151,"./YearFromTime":1597942295148,"./DateFromTime":1597942295144}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295153, function(require, module, exports) {


var mod = require('../helpers/mod');

var Day = require('./Day');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.6

module.exports = function WeekDay(t) {
	return mod(Day(t) + 4, 7);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589,"./Day":1597942295146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295154, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-deletepropertyorthrow

module.exports = function DeletePropertyOrThrow(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	// eslint-disable-next-line no-param-reassign
	var success = delete O[P];
	if (!success) {
		throw new $TypeError('Attempt to delete property failed.');
	}
	return success;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942295098,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295155, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var objectKeys = require('object-keys');

var callBound = require('../helpers/callBound');

var callBind = require('../helpers/callBind');

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');
var $pushApply = callBind.apply(GetIntrinsic('%Array.prototype.push%'));

var forEach = require('../helpers/forEach');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/8.0/#sec-enumerableownproperties

module.exports = function EnumerableOwnProperties(O, kind) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	var keys = objectKeys(O);
	if (kind === 'key') {
		return keys;
	}
	if (kind === 'value' || kind === 'key+value') {
		var results = [];
		forEach(keys, function (key) {
			if ($isEnumerable(O, key)) {
				$pushApply(results, [
					kind === 'value' ? O[key] : [key, O[key]]
				]);
			}
		});
		return results;
	}
	throw new $TypeError('Assertion failed: "kind" is not "key", "value", or "key+value": ' + kind);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"../helpers/callBind":1597942294578,"../helpers/forEach":1597942294720,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295156, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var MAX_SAFE_INTEGER = require('../helpers/maxSafeInteger');

var Call = require('./Call');
var CreateDataPropertyOrThrow = require('./CreateDataPropertyOrThrow');
var Get = require('./Get');
var HasProperty = require('./HasProperty');
var IsArray = require('./IsArray');
var ToLength = require('./ToLength');
var ToString = require('./ToString');

// https://ecma-international.org/ecma-262/10.0/#sec-flattenintoarray

// eslint-disable-next-line max-params, max-statements
module.exports = function FlattenIntoArray(target, source, sourceLen, start, depth) {
	var mapperFunction;
	if (arguments.length > 5) {
		mapperFunction = arguments[5];
	}

	var targetIndex = start;
	var sourceIndex = 0;
	while (sourceIndex < sourceLen) {
		var P = ToString(sourceIndex);
		var exists = HasProperty(source, P);
		if (exists === true) {
			var element = Get(source, P);
			if (typeof mapperFunction !== 'undefined') {
				if (arguments.length <= 6) {
					throw new $TypeError('Assertion failed: thisArg is required when mapperFunction is provided');
				}
				element = Call(mapperFunction, arguments[6], [element, sourceIndex, source]);
			}
			var shouldFlatten = false;
			if (depth > 0) {
				shouldFlatten = IsArray(element);
			}
			if (shouldFlatten) {
				var elementLen = ToLength(Get(element, 'length'));
				targetIndex = FlattenIntoArray(target, element, elementLen, targetIndex, depth - 1);
			} else {
				if (targetIndex >= MAX_SAFE_INTEGER) {
					throw new $TypeError('index too large');
				}
				CreateDataPropertyOrThrow(target, ToString(targetIndex), element);
				targetIndex += 1;
			}
		}
		sourceIndex += 1;
	}

	return targetIndex;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/maxSafeInteger":1597942294632,"./Call":1597942295096,"./CreateDataPropertyOrThrow":1597942295137,"./Get":1597942295097,"./HasProperty":1597942295157,"./IsArray":1597942295107,"./ToLength":1597942295141,"./ToString":1597942295128}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295157, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-hasproperty

module.exports = function HasProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	return P in O;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942295098,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295158, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var hasSymbols = require('has-symbols')();

var $TypeError = GetIntrinsic('%TypeError%');

var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%');
var $gOPS = hasSymbols && GetIntrinsic('%Object.getOwnPropertySymbols%');
var keys = require('object-keys');

var esType = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-getownpropertykeys

module.exports = function GetOwnPropertyKeys(O, Type) {
	if (esType(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (Type === 'Symbol') {
		return $gOPS ? $gOPS(O) : [];
	}
	if (Type === 'String') {
		if (!$gOPN) {
			return keys(O);
		}
		return $gOPN(O);
	}
	throw new $TypeError('Assertion failed: `Type` must be `"String"` or `"Symbol"`');
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295159, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Function = GetIntrinsic('%Function%');
var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var IsConstructor = require('./IsConstructor');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-getprototypefromconstructor

module.exports = function GetPrototypeFromConstructor(constructor, intrinsicDefaultProto) {
	var intrinsic = GetIntrinsic(intrinsicDefaultProto); // throws if not a valid intrinsic
	if (!IsConstructor(constructor)) {
		throw new $TypeError('Assertion failed: `constructor` must be a constructor');
	}
	var proto = Get(constructor, 'prototype');
	if (Type(proto) !== 'Object') {
		if (!(constructor instanceof $Function)) {
			// ignore other realms, for now
			throw new $TypeError('cross-realm constructors not currently supported');
		}
		proto = intrinsic;
	}
	return proto;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942295097,"./IsConstructor":1597942295131,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295160, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');
var regexTester = require('../helpers/regexTester');
var every = require('../helpers/every');

var $charAt = callBound('String.prototype.charAt');
var $strSlice = callBound('String.prototype.slice');
var $indexOf = callBound('String.prototype.indexOf');
var $parseInt = parseInt;

var isDigit = regexTester(/^[0-9]$/);

var inspect = require('object-inspect');

var Get = require('./Get');
var IsArray = require('./IsArray');
var IsInteger = require('./IsInteger');
var ToObject = require('./ToObject');
var ToString = require('./ToString');
var Type = require('./Type');

var canDistinguishSparseFromUndefined = 0 in [undefined]; // IE 6 - 8 have a bug where this returns false

var isStringOrHole = function (capture, index, arr) {
	return Type(capture) === 'String' || (canDistinguishSparseFromUndefined ? !(index in arr) : Type(capture) === 'Undefined');
};

// http://www.ecma-international.org/ecma-262/9.0/#sec-getsubstitution

// eslint-disable-next-line max-statements, max-params, max-lines-per-function
module.exports = function GetSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	if (Type(matched) !== 'String') {
		throw new $TypeError('Assertion failed: `matched` must be a String');
	}
	var matchLength = matched.length;

	if (Type(str) !== 'String') {
		throw new $TypeError('Assertion failed: `str` must be a String');
	}
	var stringLength = str.length;

	if (!IsInteger(position) || position < 0 || position > stringLength) {
		throw new $TypeError('Assertion failed: `position` must be a nonnegative integer, and less than or equal to the length of `string`, got ' + inspect(position));
	}

	if (!IsArray(captures) || !every(captures, isStringOrHole)) {
		throw new $TypeError('Assertion failed: `captures` must be a List of Strings, got ' + inspect(captures));
	}

	if (Type(replacement) !== 'String') {
		throw new $TypeError('Assertion failed: `replacement` must be a String');
	}

	var tailPos = position + matchLength;
	var m = captures.length;
	if (Type(namedCaptures) !== 'Undefined') {
		namedCaptures = ToObject(namedCaptures); // eslint-disable-line no-param-reassign
	}

	var result = '';
	for (var i = 0; i < replacement.length; i += 1) {
		// if this is a $, and it's not the end of the replacement
		var current = $charAt(replacement, i);
		var isLast = (i + 1) >= replacement.length;
		var nextIsLast = (i + 2) >= replacement.length;
		if (current === '$' && !isLast) {
			var next = $charAt(replacement, i + 1);
			if (next === '$') {
				result += '$';
				i += 1;
			} else if (next === '&') {
				result += matched;
				i += 1;
			} else if (next === '`') {
				result += position === 0 ? '' : $strSlice(str, 0, position - 1);
				i += 1;
			} else if (next === "'") {
				result += tailPos >= stringLength ? '' : $strSlice(str, tailPos);
				i += 1;
			} else {
				var nextNext = nextIsLast ? null : $charAt(replacement, i + 2);
				if (isDigit(next) && next !== '0' && (nextIsLast || !isDigit(nextNext))) {
					// $1 through $9, and not followed by a digit
					var n = $parseInt(next, 10);
					// if (n > m, impl-defined)
					result += (n <= m && Type(captures[n - 1]) === 'Undefined') ? '' : captures[n - 1];
					i += 1;
				} else if (isDigit(next) && (nextIsLast || isDigit(nextNext))) {
					// $00 through $99
					var nn = next + nextNext;
					var nnI = $parseInt(nn, 10) - 1;
					// if nn === '00' or nn > m, impl-defined
					result += (nn <= m && Type(captures[nnI]) === 'Undefined') ? '' : captures[nnI];
					i += 2;
				} else if (next === '<') {
					// eslint-disable-next-line max-depth
					if (Type(namedCaptures) === 'Undefined') {
						result += '$<';
						i += 2;
					} else {
						var endIndex = $indexOf(replacement, '>', i);
						// eslint-disable-next-line max-depth
						if (endIndex > -1) {
							var groupName = $strSlice(replacement, i, endIndex);
							var capture = Get(namedCaptures, groupName);
							// eslint-disable-next-line max-depth
							if (Type(capture) !== 'Undefined') {
								result += ToString(capture);
							}
							i += '$<' + groupName + '>'.length;
						}
					}
				} else {
					result += '$';
				}
			}
		} else {
			// the final $, or else not a $
			result += $charAt(replacement, i);
		}
	}
	return result;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"../helpers/regexTester":1597942294624,"../helpers/every":1597942294649,"./Get":1597942295097,"./IsArray":1597942295107,"./IsInteger":1597942295101,"./ToObject":1597942295104,"./ToString":1597942295128,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295161, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var has = require('has');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-hasownproperty

module.exports = function HasOwnProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	return has(O, P);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942295098,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295162, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerHour = timeConstants.msPerHour;
var HoursPerDay = timeConstants.HoursPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function HourFromTime(t) {
	return mod($floor(t / msPerHour), HoursPerDay);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295163, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $hasInstance = GetIntrinsic('Symbol.hasInstance', true);

var Call = require('./Call');
var GetMethod = require('./GetMethod');
var IsCallable = require('./IsCallable');
var OrdinaryHasInstance = require('./OrdinaryHasInstance');
var ToBoolean = require('./ToBoolean');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-instanceofoperator

module.exports = function InstanceofOperator(O, C) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	var instOfHandler = $hasInstance ? GetMethod(C, $hasInstance) : void 0;
	if (typeof instOfHandler !== 'undefined') {
		return ToBoolean(Call(instOfHandler, C, [O]));
	}
	if (!IsCallable(C)) {
		throw new $TypeError('`C` is not Callable');
	}
	return OrdinaryHasInstance(C, O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Call":1597942295096,"./GetMethod":1597942295102,"./IsCallable":1597942295106,"./OrdinaryHasInstance":1597942295164,"./ToBoolean":1597942295111,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295164, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Get = require('./Get');
var IsCallable = require('./IsCallable');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinaryhasinstance

module.exports = function OrdinaryHasInstance(C, O) {
	if (IsCallable(C) === false) {
		return false;
	}
	if (Type(O) !== 'Object') {
		return false;
	}
	var P = Get(C, 'prototype');
	if (Type(P) !== 'Object') {
		throw new $TypeError('OrdinaryHasInstance called on an object with an invalid prototype property.');
	}
	return O instanceof C;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942295097,"./IsCallable":1597942295106,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295165, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $isConcatSpreadable = GetIntrinsic('%Symbol.isConcatSpreadable%', true);

var Get = require('./Get');
var IsArray = require('./IsArray');
var ToBoolean = require('./ToBoolean');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable

module.exports = function IsConcatSpreadable(O) {
	if (Type(O) !== 'Object') {
		return false;
	}
	if ($isConcatSpreadable) {
		var spreadable = Get(O, $isConcatSpreadable);
		if (typeof spreadable !== 'undefined') {
			return ToBoolean(spreadable);
		}
	}
	return IsArray(O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Get":1597942295097,"./IsArray":1597942295107,"./ToBoolean":1597942295111,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295166, function(require, module, exports) {


var callBound = require('../helpers/callBound');

var $PromiseThen = callBound('Promise.prototype.then', true);

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ispromise

module.exports = function IsPromise(x) {
	if (Type(x) !== 'Object') {
		return false;
	}
	if (!$PromiseThen) { // Promises are not supported
		return false;
	}
	try {
		$PromiseThen(x); // throws if not a promise
	} catch (e) {
		return false;
	}
	return true;
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295167, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var isPrefixOf = require('../helpers/isPrefixOf');

// var callBound = require('../helpers/callBound');

// var $charAt = callBound('String.prototype.charAt');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/9.0/#sec-isstringprefix

module.exports = function IsStringPrefix(p, q) {
	if (Type(p) !== 'String') {
		throw new $TypeError('Assertion failed: "p" must be a String');
	}

	if (Type(q) !== 'String') {
		throw new $TypeError('Assertion failed: "q" must be a String');
	}

	return isPrefixOf(p, q);
	/*
	if (p === q || p === '') {
		return true;
	}

	var pLength = p.length;
	var qLength = q.length;
	if (pLength >= qLength) {
		return false;
	}

	// assert: pLength < qLength

	for (var i = 0; i < pLength; i += 1) {
		if ($charAt(p, i) !== $charAt(q, i)) {
			return false;
		}
	}
	return true;
	*/
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isPrefixOf":1597942294576,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295168, function(require, module, exports) {


var callBound = require('../helpers/callBound');
var $arrayPush = callBound('Array.prototype.push');

var GetIterator = require('./GetIterator');
var IteratorStep = require('./IteratorStep');
var IteratorValue = require('./IteratorValue');

// https://www.ecma-international.org/ecma-262/8.0/#sec-iterabletolist

module.exports = function IterableToList(items, method) {
	var iterator = GetIterator(items, method);
	var values = [];
	var next = true;
	while (next) {
		next = IteratorStep(iterator);
		if (next) {
			var nextValue = IteratorValue(next);
			$arrayPush(values, nextValue);
		}
	}
	return values;
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./GetIterator":1597942295099,"./IteratorStep":1597942295109,"./IteratorValue":1597942295114}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295169, function(require, module, exports) {


var $isFinite = require('../helpers/isFinite');
var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.13

module.exports = function MakeDate(day, time) {
	if (!$isFinite(day) || !$isFinite(time)) {
		return NaN;
	}
	return (day * msPerDay) + time;
};

}, function(modId) { var map = {"../helpers/isFinite":1597942294575,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295170, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');
var $DateUTC = GetIntrinsic('%Date.UTC%');

var mod = require('../helpers/mod');
var $isFinite = require('../helpers/isFinite');

var DateFromTime = require('./DateFromTime');
var Day = require('./Day');
var MonthFromTime = require('./MonthFromTime');
var ToInteger = require('./ToInteger');
var YearFromTime = require('./YearFromTime');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.12

module.exports = function MakeDay(year, month, date) {
	if (!$isFinite(year) || !$isFinite(month) || !$isFinite(date)) {
		return NaN;
	}
	var y = ToInteger(year);
	var m = ToInteger(month);
	var dt = ToInteger(date);
	var ym = y + $floor(m / 12);
	var mn = mod(m, 12);
	var t = $DateUTC(ym, mn, 1);
	if (YearFromTime(t) !== ym || MonthFromTime(t) !== mn || DateFromTime(t) !== 1) {
		return NaN;
	}
	return Day(t) + dt - 1;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/isFinite":1597942294575,"./DateFromTime":1597942295144,"./Day":1597942295146,"./MonthFromTime":1597942295151,"./ToInteger":1597942295142,"./YearFromTime":1597942295148}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295171, function(require, module, exports) {


var $isFinite = require('../helpers/isFinite');
var timeConstants = require('../helpers/timeConstants');
var msPerSecond = timeConstants.msPerSecond;
var msPerMinute = timeConstants.msPerMinute;
var msPerHour = timeConstants.msPerHour;

var ToInteger = require('./ToInteger');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.11

module.exports = function MakeTime(hour, min, sec, ms) {
	if (!$isFinite(hour) || !$isFinite(min) || !$isFinite(sec) || !$isFinite(ms)) {
		return NaN;
	}
	var h = ToInteger(hour);
	var m = ToInteger(min);
	var s = ToInteger(sec);
	var milli = ToInteger(ms);
	var t = (h * msPerHour) + (m * msPerMinute) + (s * msPerSecond) + milli;
	return t;
};

}, function(modId) { var map = {"../helpers/isFinite":1597942294575,"../helpers/timeConstants":1597942294584,"./ToInteger":1597942295142}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295172, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerMinute = timeConstants.msPerMinute;
var MinutesPerHour = timeConstants.MinutesPerHour;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function MinFromTime(t) {
	return mod($floor(t / msPerMinute), MinutesPerHour);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295173, function(require, module, exports) {


var mod = require('../helpers/mod');

// https://ecma-international.org/ecma-262/5.1/#sec-5.2

module.exports = function modulo(x, y) {
	return mod(x, y);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295174, function(require, module, exports) {


var mod = require('../helpers/mod');
var msPerSecond = require('../helpers/timeConstants').msPerSecond;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function msFromTime(t) {
	return mod(t, msPerSecond);
};

}, function(modId) { var map = {"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295175, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $String = GetIntrinsic('%String%');

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/9.0/#sec-tostring-applied-to-the-number-type

module.exports = function NumberToString(m) {
	if (Type(m) !== 'Number') {
		throw new TypeError('Assertion failed: "m" must be a String');
	}

	return $String(m);
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295176, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $ObjectCreate = GetIntrinsic('%Object.create%', true);
var $TypeError = GetIntrinsic('%TypeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');

var Type = require('./Type');

var hasProto = !({ __proto__: null } instanceof Object);

// https://www.ecma-international.org/ecma-262/6.0/#sec-objectcreate

module.exports = function ObjectCreate(proto, internalSlotsList) {
	if (proto !== null && Type(proto) !== 'Object') {
		throw new $TypeError('Assertion failed: `proto` must be null or an object');
	}
	var slots = arguments.length < 2 ? [] : internalSlotsList;
	if (slots.length > 0) {
		throw new $SyntaxError('es-abstract does not yet support internal slots');
	}

	if ($ObjectCreate) {
		return $ObjectCreate(proto);
	}
	if (hasProto) {
		return { __proto__: proto };
	}

	if (proto === null) {
		throw new $SyntaxError('native Object.create support is required to create null objects');
	}
	var T = function T() {};
	T.prototype = proto;
	return new T();
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295177, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $getProto = require('../helpers/getProto');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/7.0/#sec-ordinarygetprototypeof

module.exports = function OrdinaryGetPrototypeOf(O) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: O must be an Object');
	}
	if (!$getProto) {
		throw new $TypeError('This environment does not support fetching prototypes.');
	}
	return $getProto(O);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getProto":1597942294824,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295178, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $setProto = require('../helpers/setProto');

var OrdinaryGetPrototypeOf = require('./OrdinaryGetPrototypeOf');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/7.0/#sec-ordinarysetprototypeof

module.exports = function OrdinarySetPrototypeOf(O, V) {
	if (Type(V) !== 'Object' && Type(V) !== 'Null') {
		throw new $TypeError('Assertion failed: V must be Object or Null');
	}
	/*
    var extensible = IsExtensible(O);
    var current = OrdinaryGetPrototypeOf(O);
    if (SameValue(V, current)) {
        return true;
    }
    if (!extensible) {
        return false;
    }
    */
	try {
		$setProto(O, V);
	} catch (e) {
		return false;
	}
	return OrdinaryGetPrototypeOf(O) === V;
	/*
    var p = V;
    var done = false;
    while (!done) {
        if (p === null) {
            done = true;
        } else if (SameValue(p, O)) {
            return false;
        } else {
            if (wat) {
                done = true;
            } else {
                p = p.[[Prototype]];
            }
        }
     }
     O.[[Prototype]] = V;
     return true;
     */
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/setProto":1597942294826,"./OrdinaryGetPrototypeOf":1597942295177,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295179, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinaryhasproperty

module.exports = function OrdinaryHasProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	return P in O;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942295098,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295180, function(require, module, exports) {


var callBound = require('../helpers/callBound');

var $PromiseResolve = callBound('Promise.resolve', true);

// https://ecma-international.org/ecma-262/9.0/#sec-promise-resolve

module.exports = function PromiseResolve(C, x) {
	if (!$PromiseResolve) {
		throw new SyntaxError('This environment does not support Promises.');
	}
	return $PromiseResolve(C, x);
};


}, function(modId) { var map = {"../helpers/callBound":1597942294577}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295181, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var regexExec = require('../helpers/callBound')('RegExp.prototype.exec');

var Call = require('./Call');
var Get = require('./Get');
var IsCallable = require('./IsCallable');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-regexpexec

module.exports = function RegExpExec(R, S) {
	if (Type(R) !== 'Object') {
		throw new $TypeError('Assertion failed: `R` must be an Object');
	}
	if (Type(S) !== 'String') {
		throw new $TypeError('Assertion failed: `S` must be a String');
	}
	var exec = Get(R, 'exec');
	if (IsCallable(exec)) {
		var result = Call(exec, R, [S]);
		if (result === null || Type(result) === 'Object') {
			return result;
		}
		throw new $TypeError('"exec" method must return `null` or an Object');
	}
	return regexExec(R, S);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Call":1597942295096,"./Get":1597942295097,"./IsCallable":1597942295106,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295182, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var SameValue = require('./SameValue');

// https://www.ecma-international.org/ecma-262/7.0/#sec-samevaluenonnumber

module.exports = function SameValueNonNumber(x, y) {
	if (typeof x === 'number' || typeof x !== typeof y) {
		throw new $TypeError('SameValueNonNumber requires two non-number values of the same type.');
	}
	return SameValue(x, y);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./SameValue":1597942295122}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295183, function(require, module, exports) {


var $isNaN = require('../helpers/isNaN');

// https://www.ecma-international.org/ecma-262/6.0/#sec-samevaluezero

module.exports = function SameValueZero(x, y) {
	return (x === y) || ($isNaN(x) && $isNaN(y));
};

}, function(modId) { var map = {"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295184, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $floor = GetIntrinsic('%Math.floor%');

var mod = require('../helpers/mod');
var timeConstants = require('../helpers/timeConstants');
var msPerSecond = timeConstants.msPerSecond;
var SecondsPerMinute = timeConstants.SecondsPerMinute;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10

module.exports = function SecFromTime(t) {
	return mod($floor(t / msPerSecond), SecondsPerMinute);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295185, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = require('./IsPropertyKey');
var SameValue = require('./SameValue');
var Type = require('./Type');

// IE 9 does not throw in strict mode when writability/configurability/extensibility is violated
var noThrowOnStrictViolation = (function () {
	try {
		delete [].length;
		return true;
	} catch (e) {
		return false;
	}
}());

// https://ecma-international.org/ecma-262/6.0/#sec-set-o-p-v-throw

module.exports = function Set(O, P, V, Throw) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	if (Type(Throw) !== 'Boolean') {
		throw new $TypeError('Assertion failed: `Throw` must be a Boolean');
	}
	if (Throw) {
		O[P] = V; // eslint-disable-line no-param-reassign
		if (noThrowOnStrictViolation && !SameValue(O[P], V)) {
			throw new $TypeError('Attempted to assign to readonly property.');
		}
		return true;
	} else {
		try {
			O[P] = V; // eslint-disable-line no-param-reassign
			return noThrowOnStrictViolation ? SameValue(O[P], V) : true;
		} catch (e) {
			return false;
		}
	}
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsPropertyKey":1597942295098,"./SameValue":1597942295122,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295186, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var has = require('has');

var $TypeError = GetIntrinsic('%TypeError%');

var getSymbolDescription = require('../helpers/getSymbolDescription');

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');
var IsExtensible = require('./IsExtensible');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-setfunctionname

module.exports = function SetFunctionName(F, name) {
	if (typeof F !== 'function') {
		throw new $TypeError('Assertion failed: `F` must be a function');
	}
	if (!IsExtensible(F) || has(F, 'name')) {
		throw new $TypeError('Assertion failed: `F` must be extensible, and must not have a `name` own property');
	}
	var nameType = Type(name);
	if (nameType !== 'Symbol' && nameType !== 'String') {
		throw new $TypeError('Assertion failed: `name` must be a Symbol or a String');
	}
	if (nameType === 'Symbol') {
		var description = getSymbolDescription(name);
		// eslint-disable-next-line no-param-reassign
		name = typeof description === 'undefined' ? '' : '[' + description + ']';
	}
	if (arguments.length > 2) {
		var prefix = arguments[2];
		// eslint-disable-next-line no-param-reassign
		name = prefix + ' ' + name;
	}
	return DefinePropertyOrThrow(F, 'name', {
		'[[Value]]': name,
		'[[Writable]]': false,
		'[[Enumerable]]': false,
		'[[Configurable]]': true
	});
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getSymbolDescription":1597942294717,"./DefinePropertyOrThrow":1597942295132,"./IsExtensible":1597942295120,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295187, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');
var $preventExtensions = GetIntrinsic('%Object.preventExtensions%');
var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%');

var forEach = require('../helpers/forEach');

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');
var IsAccessorDescriptor = require('./IsAccessorDescriptor');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-setintegritylevel

module.exports = function SetIntegrityLevel(O, level) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (level !== 'sealed' && level !== 'frozen') {
		throw new $TypeError('Assertion failed: `level` must be `"sealed"` or `"frozen"`');
	}
	if (!$preventExtensions) {
		throw new $SyntaxError('SetIntegrityLevel requires native `Object.preventExtensions` support');
	}
	var status = $preventExtensions(O);
	if (!status) {
		return false;
	}
	if (!$gOPN) {
		throw new $SyntaxError('SetIntegrityLevel requires native `Object.getOwnPropertyNames` support');
	}
	var theKeys = $gOPN(O);
	if (level === 'sealed') {
		forEach(theKeys, function (k) {
			DefinePropertyOrThrow(O, k, { configurable: false });
		});
	} else if (level === 'frozen') {
		forEach(theKeys, function (k) {
			var currentDesc = $gOPD(O, k);
			if (typeof currentDesc !== 'undefined') {
				var desc;
				if (IsAccessorDescriptor(ToPropertyDescriptor(currentDesc))) {
					desc = { configurable: false };
				} else {
					desc = { configurable: false, writable: false };
				}
				DefinePropertyOrThrow(O, k, desc);
			}
		});
	}
	return true;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/forEach":1597942294720,"./DefinePropertyOrThrow":1597942295132,"./IsAccessorDescriptor":1597942295117,"./ToPropertyDescriptor":1597942295121,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295188, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $species = GetIntrinsic('%Symbol.species%', true);
var $TypeError = GetIntrinsic('%TypeError%');

var IsConstructor = require('./IsConstructor');
var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-speciesconstructor

module.exports = function SpeciesConstructor(O, defaultConstructor) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	var C = O.constructor;
	if (typeof C === 'undefined') {
		return defaultConstructor;
	}
	if (Type(C) !== 'Object') {
		throw new $TypeError('O.constructor is not an Object');
	}
	var S = $species ? C[$species] : void 0;
	if (S == null) {
		return defaultConstructor;
	}
	if (IsConstructor(S)) {
		return S;
	}
	throw new $TypeError('no constructor found');
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./IsConstructor":1597942295131,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295189, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $SymbolToString = callBound('Symbol.prototype.toString', true);

var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-symboldescriptivestring

module.exports = function SymbolDescriptiveString(sym) {
	if (Type(sym) !== 'Symbol') {
		throw new $TypeError('Assertion failed: `sym` must be a Symbol');
	}
	return $SymbolToString(sym);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/callBound":1597942294577,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295190, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');
var $gOPN = GetIntrinsic('%Object.getOwnPropertyNames%');
var $TypeError = GetIntrinsic('%TypeError%');

var every = require('../helpers/every');

var IsDataDescriptor = require('./IsDataDescriptor');
var IsExtensible = require('./IsExtensible');
var ToPropertyDescriptor = require('./ToPropertyDescriptor');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/6.0/#sec-testintegritylevel

module.exports = function TestIntegrityLevel(O, level) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (level !== 'sealed' && level !== 'frozen') {
		throw new $TypeError('Assertion failed: `level` must be `"sealed"` or `"frozen"`');
	}
	var status = IsExtensible(O);
	if (status) {
		return false;
	}
	var theKeys = $gOPN(O);
	return theKeys.length === 0 || every(theKeys, function (k) {
		var currentDesc = $gOPD(O, k);
		if (typeof currentDesc !== 'undefined') {
			if (currentDesc.configurable) {
				return false;
			}
			if (level === 'frozen' && IsDataDescriptor(ToPropertyDescriptor(currentDesc)) && currentDesc.writable) {
				return false;
			}
		}
		return true;
	});
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/getOwnPropertyDescriptor":1597942294639,"../helpers/every":1597942294649,"./IsDataDescriptor":1597942295118,"./IsExtensible":1597942295120,"./ToPropertyDescriptor":1597942295121,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295191, function(require, module, exports) {


var $BooleanValueOf = require('../helpers/callBound')('Boolean.prototype.valueOf');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-boolean-prototype-object

module.exports = function thisBooleanValue(value) {
	if (Type(value) === 'Boolean') {
		return value;
	}

	return $BooleanValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295192, function(require, module, exports) {


var callBound = require('../helpers/callBound');

var Type = require('./Type');

var $NumberValueOf = callBound('Number.prototype.valueOf');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-number-prototype-object

module.exports = function thisNumberValue(value) {
	if (Type(value) === 'Number') {
		return value;
	}

	return $NumberValueOf(value);
};


}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295193, function(require, module, exports) {


var $StringValueOf = require('../helpers/callBound')('String.prototype.valueOf');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-string-prototype-object

module.exports = function thisStringValue(value) {
	if (Type(value) === 'String') {
		return value;
	}

	return $StringValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295194, function(require, module, exports) {


var callBound = require('../helpers/callBound');

var $SymbolValueOf = callBound('Symbol.prototype.valueOf', true);

var Type = require('./Type');

// https://ecma-international.org/ecma-262/9.0/#sec-thissymbolvalue

module.exports = function thisSymbolValue(value) {
	if (!$SymbolValueOf) {
		throw new SyntaxError('Symbols are not supported; thisSymbolValue requires that `value` be a Symbol or a Symbol object');
	}
	if (Type(value) === 'Symbol') {
		return value;
	}
	return $SymbolValueOf(value);
};

}, function(modId) { var map = {"../helpers/callBound":1597942294577,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295195, function(require, module, exports) {


module.exports = require('../2018/thisTimeValue');

}, function(modId) { var map = {"../2018/thisTimeValue":1597942295074}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295196, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Date = GetIntrinsic('%Date%');
var $Number = GetIntrinsic('%Number%');
var $abs = GetIntrinsic('%Math.abs%');

var $isFinite = require('../helpers/isFinite');

var ToNumber = require('./ToNumber');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.14

module.exports = function TimeClip(time) {
	if (!$isFinite(time) || $abs(time) > 8.64e15) {
		return NaN;
	}
	return $Number(new $Date(ToNumber(time)));
};


}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isFinite":1597942294575,"./ToNumber":1597942295090}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295197, function(require, module, exports) {


var msPerDay = require('../helpers/timeConstants').msPerDay;

var DayFromYear = require('./DayFromYear');

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3

module.exports = function TimeFromYear(y) {
	return msPerDay * DayFromYear(y);
};

}, function(modId) { var map = {"../helpers/timeConstants":1597942294584,"./DayFromYear":1597942295147}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295198, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var $isNaN = require('../helpers/isNaN');
var padTimeComponent = require('../helpers/padTimeComponent');

var HourFromTime = require('./HourFromTime');
var MinFromTime = require('./MinFromTime');
var SecFromTime = require('./SecFromTime');
var Type = require('./Type');

// https://www.ecma-international.org/ecma-262/9.0/#sec-timestring

module.exports = function TimeString(tv) {
	if (Type(tv) !== 'Number' || $isNaN(tv)) {
		throw new $TypeError('Assertion failed: `tv` must be a non-NaN Number');
	}
	var hour = HourFromTime(tv);
	var minute = MinFromTime(tv);
	var second = SecFromTime(tv);
	return padTimeComponent(hour) + ':' + padTimeComponent(minute) + ':' + padTimeComponent(second) + '\x20GMT';
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"../helpers/padTimeComponent":1597942295023,"./HourFromTime":1597942295162,"./MinFromTime":1597942295172,"./SecFromTime":1597942295184,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295199, function(require, module, exports) {


var mod = require('../helpers/mod');
var msPerDay = require('../helpers/timeConstants').msPerDay;

// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.2

module.exports = function TimeWithinDay(t) {
	return mod(t, msPerDay);
};


}, function(modId) { var map = {"../helpers/mod":1597942294589,"../helpers/timeConstants":1597942294584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295200, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $Date = GetIntrinsic('%Date%');

var $isNaN = require('../helpers/isNaN');

var Type = require('./Type');

// https://ecma-international.org/ecma-262/6.0/#sec-todatestring

module.exports = function ToDateString(tv) {
	if (Type(tv) !== 'Number') {
		throw new $TypeError('Assertion failed: `tv` must be a Number');
	}
	if ($isNaN(tv)) {
		return 'Invalid Date';
	}
	return $Date(tv);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"../helpers/isNaN":1597942294574,"./Type":1597942295092}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295201, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $RangeError = GetIntrinsic('%RangeError%');

var ToInteger = require('./ToInteger');
var ToLength = require('./ToLength');
var SameValueZero = require('./SameValueZero');

// https://www.ecma-international.org/ecma-262/8.0/#sec-toindex

module.exports = function ToIndex(value) {
	if (typeof value === 'undefined') {
		return 0;
	}
	var integerIndex = ToInteger(value);
	if (integerIndex < 0) {
		throw new $RangeError('index must be >= 0');
	}
	var index = ToLength(integerIndex);
	if (!SameValueZero(integerIndex, index)) {
		throw new $RangeError('index must be >= 0 and < 2 ** 53 - 1');
	}
	return index;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToInteger":1597942295142,"./ToLength":1597942295141,"./SameValueZero":1597942295183}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295202, function(require, module, exports) {


var ToUint16 = require('./ToUint16');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toint16

module.exports = function ToInt16(argument) {
	var int16bit = ToUint16(argument);
	return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
};

}, function(modId) { var map = {"./ToUint16":1597942295203}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295203, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var $sign = require('../helpers/sign');
var $mod = require('../helpers/mod');

var $floor = $Math.floor;
var $abs = $Math.abs;

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.7

module.exports = function ToUint16(value) {
	var number = ToNumber(value);
	if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
	var posInt = $sign(number) * $floor($abs(number));
	return $mod(posInt, 0x10000);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942295090,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/sign":1597942294603,"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295204, function(require, module, exports) {


var ToNumber = require('./ToNumber');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.5

module.exports = function ToInt32(x) {
	return ToNumber(x) >> 0;
};

}, function(modId) { var map = {"./ToNumber":1597942295090}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295205, function(require, module, exports) {


var ToUint8 = require('./ToUint8');

// https://www.ecma-international.org/ecma-262/6.0/#sec-toint8

module.exports = function ToInt8(argument) {
	var int8bit = ToUint8(argument);
	return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
};

}, function(modId) { var map = {"./ToUint8":1597942295206}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295206, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');
var $isFinite = require('../helpers/isFinite');
var $sign = require('../helpers/sign');
var $mod = require('../helpers/mod');

var $floor = $Math.floor;
var $abs = $Math.abs;

module.exports = function ToUint8(argument) {
	var number = ToNumber(argument);
	if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
	var posInt = $sign(number) * $floor($abs(number));
	return $mod(posInt, 0x100);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942295090,"../helpers/isNaN":1597942294574,"../helpers/isFinite":1597942294575,"../helpers/sign":1597942294603,"../helpers/mod":1597942294589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295207, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $String = GetIntrinsic('%String%');

var ToPrimitive = require('./ToPrimitive');
var ToString = require('./ToString');

// https://www.ecma-international.org/ecma-262/6.0/#sec-topropertykey

module.exports = function ToPropertyKey(argument) {
	var key = ToPrimitive(argument, $String);
	return typeof key === 'symbol' ? key : ToString(key);
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToPrimitive":1597942295091,"./ToString":1597942295128}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295208, function(require, module, exports) {


var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');

var $floor = $Math.floor;

// https://www.ecma-international.org/ecma-262/6.0/#sec-touint8clamp

module.exports = function ToUint8Clamp(argument) {
	var number = ToNumber(argument);
	if ($isNaN(number) || number <= 0) { return 0; }
	if (number >= 0xFF) { return 0xFF; }
	var f = $floor(argument);
	if (f + 0.5 < number) { return f + 1; }
	if (number < f + 0.5) { return f; }
	if (f % 2 !== 0) { return f + 1; }
	return f;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./ToNumber":1597942295090,"../helpers/isNaN":1597942294574}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942295209, function(require, module, exports) {


var trimStart = require('string.prototype.trimstart');
var trimEnd = require('string.prototype.trimend');

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var RequireObjectCoercible = require('./RequireObjectCoercible');
var ToString = require('./ToString');

// https://ecma-international.org/ecma-262/10.0/#sec-trimstring

module.exports = function TrimString(string, where) {
	var str = RequireObjectCoercible(string);
	var S = ToString(str);
	var T;
	if (where === 'start') {
		T = trimStart(S);
	} else if (where === 'end') {
		T = trimEnd(S);
	} else if (where === 'start+end') {
		T = trimStart(trimEnd(S));
	} else {
		throw new $TypeError('Assertion failed: invalid `where` value; must be "start", "end", or "start+end"');
	}
	return T;
};

}, function(modId) { var map = {"../GetIntrinsic":1597942294567,"./RequireObjectCoercible":1597942295105,"./ToString":1597942295128}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1597942294565);
})()
//# sourceMappingURL=index.js.map