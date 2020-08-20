module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1597781800320, function(require, module, exports) {


var define = require('define-properties');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

define(implementation, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = implementation;

}, function(modId) {var map = {"./implementation":1597781800321,"./polyfill":1597781800322,"./shim":1597781800323}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781800321, function(require, module, exports) {


var CreateDataProperty = require('es-abstract/2019/CreateDataProperty');
var IsCallable = require('es-abstract/2019/IsCallable');
var RequireObjectCoercible = require('es-abstract/2019/RequireObjectCoercible');
var ToObject = require('es-abstract/2019/ToObject');
var callBound = require('es-abstract/helpers/callBound');

var $gOPD = Object.getOwnPropertyDescriptor;
var $getOwnNames = Object.getOwnPropertyNames;
var $getSymbols = Object.getOwnPropertySymbols;
var $concat = callBound('Array.prototype.concat');
var $reduce = callBound('Array.prototype.reduce');
var getAll = $getSymbols ? function (obj) {
	return $concat($getOwnNames(obj), $getSymbols(obj));
} : $getOwnNames;

var isES5 = IsCallable($gOPD) && IsCallable($getOwnNames);

module.exports = function getOwnPropertyDescriptors(value) {
	RequireObjectCoercible(value);
	if (!isES5) {
		throw new TypeError('getOwnPropertyDescriptors requires Object.getOwnPropertyDescriptor');
	}

	var O = ToObject(value);
	return $reduce(
		getAll(O),
		function (acc, key) {
			var descriptor = $gOPD(O, key);
			if (typeof descriptor !== 'undefined') {
				CreateDataProperty(acc, key, descriptor);
			}
			return acc;
		},
		{}
	);
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781800322, function(require, module, exports) {


var implementation = require('./implementation');

module.exports = function getPolyfill() {
	return typeof Object.getOwnPropertyDescriptors === 'function' ? Object.getOwnPropertyDescriptors : implementation;
};

}, function(modId) { var map = {"./implementation":1597781800321}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781800323, function(require, module, exports) {


var getPolyfill = require('./polyfill');
var define = require('define-properties');

module.exports = function shimGetOwnPropertyDescriptors() {
	var polyfill = getPolyfill();
	define(
		Object,
		{ getOwnPropertyDescriptors: polyfill },
		{ getOwnPropertyDescriptors: function () { return Object.getOwnPropertyDescriptors !== polyfill; } }
	);
	return polyfill;
};

}, function(modId) { var map = {"./polyfill":1597781800322}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1597781800320);
})()
//# sourceMappingURL=index.js.map