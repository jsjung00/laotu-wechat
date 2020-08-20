module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1597781800301, function(require, module, exports) {
module.exports = {
  api: require('./api'),
  css: require('./css'),
  l10n: require('./l10n'),
}

}, function(modId) {var map = {"./api":1597781800302,"./css":1597781800303,"./l10n":1597781800304}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781800302, function(require, module, exports) {
module.exports = {
  inheritance: require('./inheritance'),
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781800303, function(require, module, exports) {
module.exports = {
  atRules:    require('./at-rules'),
  selectors:  require('./selectors'),
  types:      require('./types'),
  properties: require('./properties'),
  syntaxes:   require('./syntaxes'),
  units:      require('./units'),
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597781800304, function(require, module, exports) {
module.exports = {
  css: require('./css'),
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1597781800301);
})()
//# sourceMappingURL=index.js.map