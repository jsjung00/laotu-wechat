module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1597781800324, function(require, module, exports) {


var define = require('define-properties');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

var polyfill = getPolyfill();

define(polyfill, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = polyfill;

}, function(modId) {var map = {"./implementation":1597781800325,"./polyfill":1597781800326,"./shim":1597781800327}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781800325, function(require, module, exports) {


var has = require('has');
var RequireObjectCoercible = require('es-abstract/2019/RequireObjectCoercible');
var callBound = require('es-abstract/helpers/callBound');

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

module.exports = function values(O) {
	var obj = RequireObjectCoercible(O);
	var vals = [];
	for (var key in obj) {
		if (has(obj, key) && $isEnumerable(obj, key)) {
			vals.push(obj[key]);
		}
	}
	return vals;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781800326, function(require, module, exports) {


var implementation = require('./implementation');

module.exports = function getPolyfill() {
	return typeof Object.values === 'function' ? Object.values : implementation;
};

}, function(modId) { var map = {"./implementation":1597781800325}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781800327, function(require, module, exports) {


var getPolyfill = require('./polyfill');
var define = require('define-properties');

module.exports = function shimValues() {
	var polyfill = getPolyfill();
	define(Object, { values: polyfill }, {
		values: function testValues() {
			return Object.values !== polyfill;
		}
	});
	return polyfill;
};

}, function(modId) { var map = {"./polyfill":1597781800326}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1597781800324);
})()
//# sourceMappingURL=index.js.map