module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1597781799299, function(require, module, exports) {


module.exports = adapterFactory;

function adapterFactory(implementation){
	ensureImplementation(implementation);

	var adapter = {}

	var baseAdapter = {
		removeSubsets: function (nodes){
			return removeSubsets(adapter, nodes);
		},
		existsOne: function(test, elems){
			return existsOne(adapter, test, elems);
		},
		getSiblings: function(elem){
			return getSiblings(adapter, elem);
		},
		hasAttrib: function(elem, name){
			return hasAttrib(adapter, elem, name);
		},
		findOne: function(test, arr){
			return findOne(adapter, test, arr);
		},
		findAll: function(test, elems){
			return findAll(adapter, test, elems)
		}
	};

	Object.assign(adapter, baseAdapter, implementation);

	return adapter;
}

var expectImplemented = [
	"isTag", "getAttributeValue", "getChildren", "getName", "getParent",
	"getText"
];

function ensureImplementation(implementation){
	if(!implementation)	throw new TypeError("Expected implementation")

	var notImplemented = expectImplemented.filter(function(fname){
		return typeof implementation[fname] !== "function";
	});

	if(notImplemented.length){
		var notList = "(" + notImplemented.join(", ") + ")";
		var message = "Expected functions " + notList + " to be implemented";
		throw new Error(message);
	}
}

function removeSubsets(adapter, nodes){
	var idx = nodes.length, node, ancestor, replace;

	// Check if each node (or one of its ancestors) is already contained in the
	// array.
	while(--idx > -1){
		node = ancestor = nodes[idx];

		// Temporarily remove the node under consideration
		nodes[idx] = null;
		replace = true;

		while(ancestor){
			if(nodes.indexOf(ancestor) > -1){
				replace = false;
				nodes.splice(idx, 1);
				break;
			}
			ancestor = adapter.getParent(ancestor)
		}

		// If the node has been found to be unique, re-insert it.
		if(replace){
			nodes[idx] = node;
		}
	}

	return nodes;
}

function existsOne(adapter, test, elems){
	return elems.some(function(elem){
		return adapter.isTag(elem) ?
			test(elem) || adapter.existsOne(test, adapter.getChildren(elem)) :
			false;
	});
}

function getSiblings(adapter, elem){
	var parent = adapter.getParent(elem);
	return parent && adapter.getChildren(parent);
}


function hasAttrib(adapter, elem, name){
	return adapter.getAttributeValue(elem,name) !== undefined
}

function findOne(adapter, test, arr){
	var elem = null;

	for(var i = 0, l = arr.length; i < l && !elem; i++){
		if(test(arr[i])){
			elem = arr[i];
		} else {
			var childs = adapter.getChildren(arr[i]);
			if(childs && childs.length > 0){
				elem = adapter.findOne(test, childs);
			}
		}
	}

	return elem;
}

function findAll(adapter, test, elems){
	var result = [];

	for(var i = 0, j = elems.length; i < j; i++){
		if(!adapter.isTag(elems[i])) continue;
		if(test(elems[i])) result.push(elems[i]);
		var childs = adapter.getChildren(elems[i]);
		if(childs) result = result.concat(adapter.findAll(test, childs));
	}

	return result;
}

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1597781799299);
})()
//# sourceMappingURL=index.js.map