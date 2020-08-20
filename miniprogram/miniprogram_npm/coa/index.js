module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1597942294249, function(require, module, exports) {
module.exports = require('./lib');

}, function(modId) {var map = {"./lib":1597942294250}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294250, function(require, module, exports) {
const
    Cmd = require('./cmd'),
    Opt = require('./opt'),
    Arg = require('./arg'),
    shell = require('./shell');

module.exports = {
    Cmd : Cmd.create,
    Opt : Opt.create,
    Arg : Arg.create,
    classes : { Cmd, Opt, Arg },
    shell,
    require
};

}, function(modId) { var map = {"./cmd":1597942294251,"./opt":1597942294253,"./arg":1597942294255,"./shell":1597942294257}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294251, function(require, module, exports) {
/* eslint-disable class-methods-use-this */


const
    UTIL = require('util'),
    PATH = require('path'),
    EOL = require('os').EOL,

    Q = require('q'),
    chalk = require('chalk'),

    CoaObject = require('./coaobject'),
    Opt = require('./opt'),
    Arg = require('./arg'),
    completion = require('./completion');

/**
 * Command
 *
 * Top level entity. Commands may have options and arguments.
 *
 * @namespace
 * @class Cmd
 * @extends CoaObject
 */
class Cmd extends CoaObject {
    /**
     * @constructs
     * @param {COA.Cmd} [cmd] parent command
     */
    constructor(cmd) {
        super(cmd);

        this._parent(cmd);
        this._cmds = [];
        this._cmdsByName = {};
        this._opts = [];
        this._optsByKey = {};
        this._args = [];
        this._api = null;
        this._ext = false;
    }

    static create(cmd) {
        return new Cmd(cmd);
    }

    /**
     * Returns object containing all its subcommands as methods
     * to use from other programs.
     *
     * @returns {Object}
     */
    get api() {
        // Need _this here because of passed arguments into _api
        const _this = this;
        this._api || (this._api = function () {
            return _this.invoke.apply(_this, arguments);
        });

        const cmds = this._cmdsByName;
        Object.keys(cmds).forEach(cmd => { this._api[cmd] = cmds[cmd].api; });

        return this._api;
    }

    _parent(cmd) {
        this._cmd = cmd || this;

        this.isRootCmd ||
            cmd._cmds.push(this) &&
            this._name &&
            (this._cmd._cmdsByName[this._name] = this);

        return this;
    }

    get isRootCmd() {
        return this._cmd === this;
    }

    /**
     * Set a canonical command identifier to be used anywhere in the API.
     *
     * @param {String} name - command name
     * @returns {COA.Cmd} - this instance (for chainability)
     */
    name(name) {
        super.name(name);

        this.isRootCmd ||
            (this._cmd._cmdsByName[name] = this);

        return this;
    }

    /**
     * Create new or add existing subcommand for current command.
     *
     * @param {COA.Cmd} [cmd] existing command instance
     * @returns {COA.Cmd} new subcommand instance
     */
    cmd(cmd) {
        return cmd?
            cmd._parent(this)
            : new Cmd(this);
    }

    /**
     * Create option for current command.
     *
     * @returns {COA.Opt} new option instance
     */
    opt() {
        return new Opt(this);
    }

    /**
     * Create argument for current command.
     *
     * @returns {COA.Opt} new argument instance
     */
    arg() {
        return new Arg(this);
    }

    /**
     * Add (or set) action for current command.
     *
     * @param {Function} act - action function,
     *         invoked in the context of command instance
     *         and has the parameters:
     *                 - {Object} opts - parsed options
     *                 - {String[]} args - parsed arguments
     *                 - {Object} res - actions result accumulator
     *         It can return rejected promise by Cmd.reject (in case of error)
     *         or any other value treated as result.
     * @param {Boolean} [force=false] flag for set action instead add to existings
     * @returns {COA.Cmd} - this instance (for chainability)
     */
    act(act, force) {
        if(!act) return this;

        (!this._act || force) && (this._act = []);
        this._act.push(act);

        return this;
    }

    /**
     * Make command "helpful", i.e. add -h --help flags for print usage.
     *
     * @returns {COA.Cmd} - this instance (for chainability)
     */
    helpful() {
        return this.opt()
            .name('help')
            .title('Help')
            .short('h')
            .long('help')
            .flag()
            .only()
            .act(function() {
                return this.usage();
            })
            .end();
    }

    /**
     * Adds shell completion to command, adds "completion" subcommand,
     * that makes all the magic.
     * Must be called only on root command.
     *
     * @returns {COA.Cmd} - this instance (for chainability)
     */
    completable() {
        return this.cmd()
            .name('completion')
            .apply(completion)
            .end();
    }

    /**
     * Allow command to be extendable by external node.js modules.
     *
     * @param {String} [pattern]  Pattern of node.js module to find subcommands at.
     * @returns {COA.Cmd} - this instance (for chainability)
     */
    extendable(pattern) {
        this._ext = pattern || true;
        return this;
    }

    _exit(msg, code) {
        return process.once('exit', function(exitCode) {
            msg && console[code === 0 ? 'log' : 'error'](msg);
            process.exit(code || exitCode || 0);
        });
    }

    /**
     * Build full usage text for current command instance.
     *
     * @returns {String} usage text
     */
    usage() {
        const res = [];

        this._title && res.push(this._fullTitle());

        res.push('', 'Usage:');

        this._cmds.length
            && res.push([
                '', '', chalk.redBright(this._fullName()), chalk.blueBright('COMMAND'),
                chalk.greenBright('[OPTIONS]'), chalk.magentaBright('[ARGS]')
            ].join(' '));

        (this._opts.length + this._args.length)
            && res.push([
                '', '', chalk.redBright(this._fullName()),
                chalk.greenBright('[OPTIONS]'), chalk.magentaBright('[ARGS]')
            ].join(' '));

        res.push(
            this._usages(this._cmds, 'Commands'),
            this._usages(this._opts, 'Options'),
            this._usages(this._args, 'Arguments')
        );

        return res.join(EOL);
    }

    _usage() {
        return chalk.blueBright(this._name) + ' : ' + this._title;
    }

    _usages(os, title) {
        if(!os.length) return;

        return ['', title + ':']
            .concat(os.map(o => `  ${o._usage()}`))
            .join(EOL);
    }

    _fullTitle() {
        return `${this.isRootCmd? '' : this._cmd._fullTitle() + EOL}${this._title}`;
    }

    _fullName() {
        return `${this.isRootCmd? '' : this._cmd._fullName() + ' '}${PATH.basename(this._name)}`;
    }

    _ejectOpt(opts, opt) {
        const pos = opts.indexOf(opt);
        if(pos === -1) return;

        return opts[pos]._arr?
            opts[pos] :
            opts.splice(pos, 1)[0];
    }

    _checkRequired(opts, args) {
        if(this._opts.some(opt => opt._only && opts.hasOwnProperty(opt._name))) return;

        const all = this._opts.concat(this._args);
        let i;
        while(i = all.shift())
            if(i._req && i._checkParsed(opts, args))
                return this.reject(i._requiredText());
    }

    _parseCmd(argv, unparsed) {
        unparsed || (unparsed = []);

        let i,
            optSeen = false;
        while(i = argv.shift()) {
            i.indexOf('-') || (optSeen = true);

            if(optSeen || !/^\w[\w-_]*$/.test(i)) {
                unparsed.push(i);
                continue;
            }

            let pkg, cmd = this._cmdsByName[i];
            if(!cmd && this._ext) {
                if(this._ext === true) {
                    pkg = i;
                    let c = this;
                    while(true) { // eslint-disable-line
                        pkg = c._name + '-' + pkg;
                        if(c.isRootCmd) break;
                        c = c._cmd;
                    }
                } else if(typeof this._ext === 'string')
                    pkg = ~this._ext.indexOf('%s')?
                        UTIL.format(this._ext, i) :
                        this._ext + i;

                let cmdDesc;
                try {
                    cmdDesc = require(pkg);
                } catch(e) {
                    // Dummy
                }

                if(cmdDesc) {
                    if(typeof cmdDesc === 'function') {
                        this.cmd().name(i).apply(cmdDesc).end();
                    } else if(typeof cmdDesc === 'object') {
                        this.cmd(cmdDesc);
                        cmdDesc.name(i);
                    } else throw new Error('Error: Unsupported command declaration type, '
                        + 'should be a function or COA.Cmd() object');

                    cmd = this._cmdsByName[i];
                }
            }

            if(cmd) return cmd._parseCmd(argv, unparsed);

            unparsed.push(i);
        }

        return { cmd : this, argv : unparsed };
    }

    _parseOptsAndArgs(argv) {
        const opts = {},
            args = {},
            nonParsedOpts = this._opts.concat(),
            nonParsedArgs = this._args.concat();

        let res, i;
        while(i = argv.shift()) {
            if(i !== '--' && i[0] === '-') {
                const m = i.match(/^(--\w[\w-_]*)=(.*)$/);
                if(m) {
                    i = m[1];
                    this._optsByKey[i]._flag || argv.unshift(m[2]);
                }

                const opt = this._ejectOpt(nonParsedOpts, this._optsByKey[i]);
                if(!opt) return this.reject(`Unknown option: ${i}`);

                if(Q.isRejected(res = opt._parse(argv, opts))) return res;

                continue;
            }

            i === '--' && (i = argv.splice(0));
            Array.isArray(i) || (i = [i]);

            let a;
            while(a = i.shift()) {
                let arg = nonParsedArgs.shift();
                if(!arg) return this.reject(`Unknown argument: ${a}`);

                arg._arr && nonParsedArgs.unshift(arg);
                if(Q.isRejected(res = arg._parse(a, args))) return res;
            }
        }

        return {
            opts : this._setDefaults(opts, nonParsedOpts),
            args : this._setDefaults(args, nonParsedArgs)
        };
    }

    _setDefaults(params, desc) {
        for(const item of desc)
            item._def !== undefined &&
                !params.hasOwnProperty(item._name) &&
                item._saveVal(params, item._def);

        return params;
    }

    _processParams(params, desc) {
        const notExists = [];

        for(const item of desc) {
            const n = item._name;

            if(!params.hasOwnProperty(n)) {
                notExists.push(item);
                continue;
            }

            const vals = Array.isArray(params[n])? params[n] : [params[n]];
            delete params[n];

            let res;
            for(const v of vals)
                if(Q.isRejected(res = item._saveVal(params, v)))
                    return res;
        }

        return this._setDefaults(params, notExists);
    }

    _parseArr(argv) {
        return Q.when(this._parseCmd(argv), p =>
            Q.when(p.cmd._parseOptsAndArgs(p.argv), r => ({
                cmd : p.cmd,
                opts : r.opts,
                args : r.args
            })));
    }

    _do(inputPromise) {
        return Q.when(inputPromise, input => {
            return [this._checkRequired]
                .concat(input.cmd._act || [])
                .reduce((res, act) =>
                    Q.when(res, prev => act.call(input.cmd, input.opts, input.args, prev)),
                    undefined);
        });
    }

    /**
     * Parse arguments from simple format like NodeJS process.argv
     * and run ahead current program, i.e. call process.exit when all actions done.
     *
     * @param {String[]} argv - arguments
     * @returns {COA.Cmd} - this instance (for chainability)
     */
    run(argv) {
        argv || (argv = process.argv.slice(2));

        const cb = code =>
            res => res?
                this._exit(res.stack || res.toString(), (res.hasOwnProperty('exitCode')? res.exitCode : code) || 0) :
                this._exit();

        Q.when(this.do(argv), cb(0), cb(1)).done();

        return this;
    }

    /**
     * Invoke specified (or current) command using provided
     * options and arguments.
     *
     * @param {String|String[]} [cmds] - subcommand to invoke (optional)
     * @param {Object} [opts] - command options (optional)
     * @param {Object} [args] - command arguments (optional)
     * @returns {Q.Promise}
     */
    invoke(cmds, opts, args) {
        cmds || (cmds = []);
        opts || (opts = {});
        args || (args = {});
        typeof cmds === 'string' && (cmds = cmds.split(' '));

        if(arguments.length < 3 && !Array.isArray(cmds)) {
            args = opts;
            opts = cmds;
            cmds = [];
        }

        return Q.when(this._parseCmd(cmds), p => {
            if(p.argv.length)
                return this.reject(`Unknown command: ${cmds.join(' ')}`);

            return Q.all([
                this._processParams(opts, this._opts),
                this._processParams(args, this._args)
            ]).spread((_opts, _args) =>
                this._do({
                    cmd : p.cmd,
                    opts : _opts,
                    args : _args
                })
                .fail(res => (res && res.exitCode === 0)?
                    res.toString() :
                    this.reject(res)));
        });
    }
}

/**
 * Convenient function to run command from tests.
 *
 * @param {String[]} argv - arguments
 * @returns {Q.Promise}
 */
Cmd.prototype.do = function(argv) {
    return this._do(this._parseArr(argv || []));
};

module.exports = Cmd;

}, function(modId) { var map = {"./coaobject":1597942294252,"./opt":1597942294253,"./arg":1597942294255,"./completion":1597942294256}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294252, function(require, module, exports) {
/* eslint-disable class-methods-use-this */


const Q = require('q');

/**
 * COA Object
 *
 * Base class for all COA-related objects
 *
 * --------|-----|-----|-----
 *         | Cmd | Opt | Arg
 * --------|-----|-----|-----
 *  name   | ✓   | ✓   | ✓
 *  title  | ✓   | ✓   | ✓
 *  comp   | ✓   | ✓   | ✓
 *  reject | ✓   | ✓   | ✓
 *  end    | ✓   | ✓   | ✓
 *  apply  | ✓   | ✓   | ✓
 *
 * @class CoaObject
 */
module.exports = class CoaObject {
    constructor(cmd) {
        this._cmd = cmd;
        this._name = null;
        this._title = null;
        this._comp = null;
    }

    /**
     * Set a canonical identifier to be used anywhere in the API.
     *
     * @param {String} name - command, option or argument name
     * @returns {COA.CoaObject} - this instance (for chainability)
     */
    name(name) {
        this._name = name;
        return this;
    }

    /**
     * Set a long description to be used anywhere in text messages.
     * @param {String} title - human readable entity title
     * @returns {COA.CoaObject} - this instance (for chainability)
     */
    title(title) {
        this._title = title;
        return this;
    }

    /**
     * Set custom additional completion for current object.
     *
     * @param {Function} comp - completion generation function,
     *         invoked in the context of object instance.
     *         Accepts parameters:
     *                 - {Object} opts - completion options
     *         It can return promise or any other value threated as a result.
     * @returns {COA.CoaObject} - this instance (for chainability)
     */
    comp(comp) {
        this._comp = comp;
        return this;
    }

    /**
     * Apply function with arguments in a context of object instance.
     *
     * @param {Function} fn - body
     * @param {Array.<*>} args... - arguments
     * @returns {COA.CoaObject} - this instance (for chainability)
     */
    apply(fn) {
        arguments.length > 1?
            fn.apply(this, [].slice.call(arguments, 1))
            : fn.call(this);

        return this;
    }

    /**
     * Return reject of actions results promise with error code.
     * Use in .act() for return with error.
     * @param {Object} reason - reject reason
     *         You can customize toString() method and exitCode property
     *         of reason object.
     * @returns {Q.promise} rejected promise
     */
    reject(reason) {
        return Q.reject(reason);
    }

    /**
     * Finish chain for current subcommand and return parent command instance.
     * @returns {COA.Cmd} parent command
     */
    end() {
        return this._cmd;
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294253, function(require, module, exports) {


const
    Q = require('q'),

    CoaParam = require('./coaparam'),
    chalk = require('chalk');

/**
 * Option
 *
 * Named entity. Options may have short and long keys for use from command line.
 *
 * @namespace
 * @class Opt
 * @extends CoaParam
 */
module.exports = class Opt extends CoaParam {
    /**
     * @constructs
     * @param {COA.Cmd} cmd - parent command
     */
    constructor(cmd) {
        super(cmd);

        this._short = null;
        this._long = null;
        this._flag = false;
        this._only = false;
        this._cmd._opts.push(this);
    }

    /**
     * Set a short key for option to be used with one hyphen from command line.
     *
     * @param {String} short - short name
     * @returns {COA.Opt} - this instance (for chainability)
     */
    short(short) {
        this._short = short;
        this._cmd._optsByKey[`-${short}`] = this;
        return this;
    }

    /**
     * Set a short key for option to be used with double hyphens from command line.
     *
     * @param {String} long - long name
     * @returns {COA.Opt} - this instance (for chainability)
     */
    long(long) {
        this._long = long;
        this._cmd._optsByKey[`--${long}`] = this;
        return this;
    }

    /**
     * Make an option boolean, i.e. option without value.
     *
     * @returns {COA.Opt} - this instance (for chainability)
     */
    flag() {
        this._flag = true;
        return this;
    }

    /**
     * Makes an option to act as a command,
     * i.e. program will exit just after option action.
     *
     * @returns {COA.Opt} - this instance (for chainability)
     */
    only() {
        this._only = true;
        return this;
    }

    /**
     * Add action for current option command.
     * This action is performed if the current option
     * is present in parsed options (with any value).
     *
     * @param {Function} act - action function,
     *         invoked in the context of command instance
     *         and has the parameters:
     *                 - {Object} opts - parsed options
     *                 - {Array} args - parsed arguments
     *                 - {Object} res - actions result accumulator
     *         It can return rejected promise by Cmd.reject (in case of error)
     *         or any other value treated as result.
     * @returns {COA.Opt} - this instance (for chainability)
     */
    act(act) {
        // Need function here for arguments
        const opt = this;
        this._cmd.act(function(opts) {
            if(!opts.hasOwnProperty(opt._name)) return;

            const res = act.apply(this, arguments);
            if(!opt._only) return res;

            return Q.when(res, out => this.reject({
                toString : () => out.toString(),
                exitCode : 0
            }));
        });

        return this;
    }

    _saveVal(opts, val) {
        this._val && (val = this._val(val));

        const name = this._name;
        this._arr
            ? (opts[name] || (opts[name] = [])).push(val)
            : (opts[name] = val);

        return val;
    }

    _parse(argv, opts) {
        return this._saveVal(opts, this._flag ? true : argv.shift());
    }

    _checkParsed(opts) {
        return !opts.hasOwnProperty(this._name);
    }

    _usage() {
        const res = [],
            nameStr = this._name.toUpperCase();

        if(this._short) {
            res.push('-', chalk.greenBright(this._short));
            this._flag || res.push(' ' + nameStr);
            res.push(', ');
        }

        if(this._long) {
            res.push('--', chalk.green(this._long));
            this._flag || res.push('=' + nameStr);
        }

        res.push(' : ', this._title);

        this._req && res.push(' ', chalk.redBright('(required)'));

        return res.join('');
    }

    _requiredText() {
        return `Missing required option:\n  ${this._usage()}`;
    }
};

}, function(modId) { var map = {"./coaparam":1597942294254}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294254, function(require, module, exports) {


const fs = require('fs');

const CoaObject = require('./coaobject');

/**
 * COA Parameter
 *
 * Base class for options and arguments
 *
 * --------|-----|-----|-----
 *         | Cmd | Opt | Arg
 * --------|-----|-----|-----
 *  arr    |     | ✓   | ✓
 *  req    |     | ✓   | ✓
 *  val    |     | ✓   | ✓
 *  def    |     | ✓   | ✓
 *  input  |     | ✓   | ✓
 *  output |     | ✓   | ✓
 *
 * @class CoaParam
 * @extends CoaObject
 */
module.exports = class CoaParam extends CoaObject {
    constructor(cmd) {
        super(cmd);

        this._arr = false;
        this._req = false;
        this._val = undefined;
        this._def = undefined;
    }

    /**
     * Makes a param accepts multiple values.
     * Otherwise, the value will be used by the latter passed.
     *
     * @returns {COA.CoaParam} - this instance (for chainability)
     */
    arr() {
        this._arr = true;
        return this;
    }

    /**
     * Makes a param required.
     *
     * @returns {COA.CoaParam} - this instance (for chainability)
     */
    req() {
        this._req = true;
        return this;
    }

    /**
     * Set a validation (or value) function for param.
     * Value from command line passes through before becoming available from API.
     * Using for validation and convertion simple types to any values.
     *
     * @param {Function} val - validating function,
     *         invoked in the context of option instance
     *         and has one parameter with value from command line.
     * @returns {COA.CoaParam} - this instance (for chainability)
     */
    val(val) {
        this._val = val;
        return this;
    }

    /**
     * Set a default value for param.
     * Default value passed through validation function as ordinary value.
     *
     * @param {*} def - default value of function generator
     * @returns {COA.CoaParam} - this instance (for chainability)
     */
    def(def) {
        this._def = def;
        return this;
    }

    /**
     * Make option value inputting stream.
     * It's add useful validation and shortcut for STDIN.
     *
     * @returns {COA.CoaParam} - this instance (for chainability)
     */
    input() {
        process.stdin.pause();
        return this
            .def(process.stdin)
            .val(function(v) {
                if(typeof v !== 'string')
                    return v;

                if(v === '-')
                    return process.stdin;

                const s = fs.createReadStream(v, { encoding : 'utf8' });
                s.pause();
                return s;
            });
    }

    /**
     * Make option value outputing stream.
     * It's add useful validation and shortcut for STDOUT.
     *
     * @returns {COA.CoaParam} - this instance (for chainability)
     */
    output() {
        return this
            .def(process.stdout)
            .val(function(v) {
                if(typeof v !== 'string')
                    return v;

                if(v === '-')
                    return process.stdout;

                return fs.createWriteStream(v, { encoding : 'utf8' });
            });
    }
};

}, function(modId) { var map = {"./coaobject":1597942294252}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294255, function(require, module, exports) {


const
    CoaParam = require('./coaparam'),
    chalk = require('chalk');

/**
 * Argument
 *
 * Unnamed entity. From command line arguments passed as list of unnamed values.
 *
 * @class Arg
 * @extends CoaParam
 */
module.exports = class Arg extends CoaParam {
    /**
     * @constructs
     * @param {COA.Cmd} cmd - parent command
     */
    constructor(cmd) {
        super(cmd);

        this._cmd._args.push(this);
    }

    _saveVal(args, val) {
        this._val && (val = this._val(val));

        const name = this._name;
        this._arr
            ? (args[name] || (args[name] = [])).push(val)
            : (args[name] = val);

        return val;
    }

    _parse(arg, args) {
        return this._saveVal(args, arg);
    }

    _checkParsed(opts, args) {
        return !args.hasOwnProperty(this._name);
    }

    _usage() {
        const res = [];

        res.push(chalk.magentaBright(this._name.toUpperCase()), ' : ', this._title);

        this._req && res.push(' ', chalk.redBright('(required)'));

        return res.join('');
    }

    _requiredText() {
        return `Missing required argument:\n  ${this._usage()}`;
    }
};

}, function(modId) { var map = {"./coaparam":1597942294254}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294256, function(require, module, exports) {


const constants = require('constants');
const fs = require('fs');
const path = require('path');

const Q = require('q');

const shell = require('./shell');
const escape = shell.escape;
const unescape = shell.unescape;

/**
 * Most of the code adopted from the npm package shell completion code.
 * See https://github.com/isaacs/npm/blob/master/lib/completion.js
 *
 * @returns {COA.CoaObject}
 */
module.exports = function completion() {
    return this
        .title('Shell completion')
        .helpful()
        .arg()
            .name('raw')
            .title('Completion words')
            .arr()
            .end()
        .act((opts, args) => {
            if(process.platform === 'win32') {
                const e = new Error('shell completion not supported on windows');
                e.code = 'ENOTSUP';
                e.errno = constants.ENOTSUP;
                return this.reject(e);
            }

            // if the COMP_* isn't in the env, then just dump the script
            if((process.env.COMP_CWORD == null)
                || (process.env.COMP_LINE == null)
                || (process.env.COMP_POINT == null)) {
                return dumpScript(this._cmd._name);
            }

            console.error('COMP_LINE:  %s', process.env.COMP_LINE);
            console.error('COMP_CWORD: %s', process.env.COMP_CWORD);
            console.error('COMP_POINT: %s', process.env.COMP_POINT);
            console.error('args: %j', args.raw);

            // completion opts
            opts = getOpts(args.raw);

            // cmd
            const parsed = this._cmd._parseCmd(opts.partialWords);
            return Q.when(complete(parsed.cmd, parsed.opts), compls => {
                console.error('filtered: %j', compls);
                return console.log(compls.map(escape).join('\n'));
            });
        });
};

function dumpScript(name) {
    const defer = Q.defer();

    fs.readFile(path.resolve(__dirname, 'completion.sh'), 'utf8', function(err, d) {
        if(err) return defer.reject(err);
        d = d.replace(/{{cmd}}/g, path.basename(name)).replace(/^#!.*?\n/, '');

        process.stdout.on('error', onError);
        process.stdout.write(d, () => defer.resolve());
    });

    return defer.promise;

    function onError(err) {
        // Darwin is a real dick sometimes.
        //
        // This is necessary because the "source" or "." program in
        // bash on OS X closes its file argument before reading
        // from it, meaning that you get exactly 1 write, which will
        // work most of the time, and will always raise an EPIPE.
        //
        // Really, one should not be tossing away EPIPE errors, or any
        // errors, so casually. But, without this, `. <(cmd completion)`
        // can never ever work on OS X.
        if(err.errno !== constants.EPIPE) return defer.reject(err);
        process.stdout.removeListener('error', onError);
        return defer.resolve();
    }
}

function getOpts(argv) {
    // get the partial line and partial word, if the point isn't at the end
    // ie, tabbing at: cmd foo b|ar
    const line = process.env.COMP_LINE;
    const w = +process.env.COMP_CWORD;
    const point = +process.env.COMP_POINT;
    const words = argv.map(unescape);
    const word = words[w];
    const partialLine = line.substr(0, point);
    const partialWords = words.slice(0, w);

    // figure out where in that last word the point is
    let partialWord = argv[w] || '';
    let i = partialWord.length;
    while(partialWord.substr(0, i) !== partialLine.substr(-1 * i) && i > 0) i--;

    partialWord = unescape(partialWord.substr(0, i));
    partialWord && partialWords.push(partialWord);

    return {
        line,
        w,
        point,
        words,
        word,
        partialLine,
        partialWords,
        partialWord
    };
}

function complete(cmd, opts) {
    let optWord, optPrefix,
        compls = [];

    // Complete on cmds
    if(opts.partialWord.indexOf('-'))
        compls = Object.keys(cmd._cmdsByName);
        // Complete on required opts without '-' in last partial word
        // (if required not already specified)
        //
        // Commented out because of uselessness:
        // -b, --block suggest results in '-' on cmd line;
        // next completion suggest all options, because of '-'
        //.concat Object.keys(cmd._optsByKey).filter (v) -> cmd._optsByKey[v]._req
    else {
        // complete on opt values: --opt=| case
        const m = opts.partialWord.match(/^(--\w[\w-_]*)=(.*)$/);
        if(m) {
            optWord = m[1];
            optPrefix = optWord + '=';
        } else
            // complete on opts
            // don't complete on opts in case of --opt=val completion
            // TODO: don't complete on opts in case of unknown arg after commands
            // TODO: complete only on opts with arr() or not already used
            // TODO: complete only on full opts?
            compls = Object.keys(cmd._optsByKey);
    }

    // complete on opt values: next arg case
    opts.partialWords[opts.w - 1].indexOf('-') || (optWord = opts.partialWords[opts.w - 1]);

    // complete on opt values: completion
    let opt;
    optWord
        && (opt = cmd._optsByKey[optWord])
        && !opt._flag
        && opt._comp
        && (compls = Q.join(compls,
            Q.when(opt._comp(opts),
                (c, o) => c.concat(o.map(v => (optPrefix || '') + v)))));

    // TODO: complete on args values (context aware, custom completion?)

    // custom completion on cmds
    cmd._comp && (compls = Q.join(compls, Q.when(cmd._comp(opts)), (c, o) => c.concat(o)));

    // TODO: context aware custom completion on cmds, opts and args
    // (can depend on already entered values, especially options)

    return Q.when(compls, complitions => {
        console.error('partialWord: %s', opts.partialWord);
        console.error('compls: %j', complitions);
        return compls.filter(c => c.indexOf(opts.partialWord) === 0);
    });
}

}, function(modId) { var map = {"./shell":1597942294257}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1597942294257, function(require, module, exports) {
module.exports = { escape, unescape };

function unescape(w) {
    w = w.charAt(0) === '"'
        ? w.replace(/^"|([^\\])"$/g, '$1')
        : w.replace(/\\ /g, ' ');

    return w.replace(/\\("|'|\$|`|\\)/g, '$1');
}

function escape(w) {
    w = w.replace(/(["'$`\\])/g,'\\$1');
    return w.match(/\s+/) ? `"${w}"` : w;
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1597942294249);
})()
//# sourceMappingURL=index.js.map