require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 43);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const DataTypes = __webpack_require__(2);
const SqlString = __webpack_require__(29);
const _ = __webpack_require__(0).runInContext(); // Prevent anyone messing with template settings by creating a fresh copy
const parameterValidator = __webpack_require__(63);
const Logger = __webpack_require__(64);
const uuid = __webpack_require__(30);
const Promise = __webpack_require__(4);
const primitives = ['string', 'number', 'boolean'];

let inflection = __webpack_require__(68);
const logger = new Logger();

exports.Promise = Promise;
exports._ = _;
exports.debug = logger.debug.bind(logger);
exports.deprecate = logger.deprecate.bind(logger);
exports.warn = logger.warn.bind(logger);
exports.getLogger = () =>  logger ;

function useInflection(_inflection) {
  inflection = _inflection;
}
exports.useInflection = useInflection;

function camelizeIf(str, condition) {
  let result = str;

  if (condition) {
    result = camelize(str);
  }

  return result;
}
exports.camelizeIf = camelizeIf;

function underscoredIf(str, condition) {
  let result = str;

  if (condition) {
    result = underscore(str);
  }

  return result;
}
exports.underscoredIf = underscoredIf;

function isPrimitive(val) {
  return primitives.indexOf(typeof val) !== -1;
}
exports.isPrimitive = isPrimitive;

// Same concept as _.merge, but don't overwrite properties that have already been assigned
function mergeDefaults(a, b) {
  return _.mergeWith(a, b, objectValue => {
    // If it's an object, let _ handle it this time, we will be called again for each property
    if (!this._.isPlainObject(objectValue) && objectValue !== undefined) {
      return objectValue;
    }
  });
}
exports.mergeDefaults = mergeDefaults;

// An alternative to _.merge, which doesn't clone its arguments
// Cloning is a bad idea because options arguments may contain references to sequelize
// models - which again reference database libs which don't like to be cloned (in particular pg-native)
function merge() {
  const result = {};

  for (const obj of arguments) {
    _.forOwn(obj, (value, key) => {
      if (typeof value !== 'undefined') {
        if (!result[key]) {
          result[key] = value;
        } else if (_.isPlainObject(value) && _.isPlainObject(result[key])) {
          result[key] = merge(result[key], value);
        } else if (Array.isArray(value) && Array.isArray(result[key])) {
          result[key] = value.concat(result[key]);
        } else {
          result[key] = value;
        }
      }
    });
  }

  return result;
}
exports.merge = merge;

function lowercaseFirst(s) {
  return s[0].toLowerCase() + s.slice(1);
}
exports.lowercaseFirst = lowercaseFirst;

function uppercaseFirst(s) {
  return s[0].toUpperCase() + s.slice(1);
}
exports.uppercaseFirst = uppercaseFirst;

function spliceStr(str, index, count, add) {
  return str.slice(0, index) + add + str.slice(index + count);
}
exports.spliceStr = spliceStr;

function camelize(str) {
  return str.trim().replace(/[-_\s]+(.)?/g, (match, c) => c.toUpperCase());
}
exports.camelize = camelize;

function underscore(str) {
  return inflection.underscore(str);
}
exports.underscore = underscore;

function format(arr, dialect) {
  const timeZone = null;
  // Make a clone of the array beacuse format modifies the passed args
  return SqlString.format(arr[0], arr.slice(1), timeZone, dialect);
}
exports.format = format;

function formatNamedParameters(sql, parameters, dialect) {
  const timeZone = null;
  return SqlString.formatNamedParameters(sql, parameters, timeZone, dialect);
}
exports.formatNamedParameters = formatNamedParameters;

function cloneDeep(obj) {
  obj = obj || {};
  return _.cloneDeepWith(obj, elem => {
    // Do not try to customize cloning of arrays or POJOs
    if (Array.isArray(elem) || _.isPlainObject(elem)) {
      return undefined;
    }

    // Don't clone stuff that's an object, but not a plain one - fx example sequelize models and instances
    if (typeof elem === 'object') {
      return elem;
    }

    // Preserve special data-types like `fn` across clones. _.get() is used for checking up the prototype chain
    if (elem && typeof elem.clone === 'function') {
      return elem.clone();
    }
  });
}
exports.cloneDeep = cloneDeep;

/* Expand and normalize finder options */
function mapFinderOptions(options, Model) {
  if (Model._hasVirtualAttributes && Array.isArray(options.attributes)) {
    for (const attribute of options.attributes) {
      if (Model._isVirtualAttribute(attribute) && Model.rawAttributes[attribute].type.fields) {
        options.attributes = options.attributes.concat(Model.rawAttributes[attribute].type.fields);
      }
    }
    options.attributes = _.without.apply(_, [options.attributes].concat(Model._virtualAttributes));
    options.attributes = _.uniq(options.attributes);
  }

  mapOptionFieldNames(options, Model);

  return options;
}
exports.mapFinderOptions = mapFinderOptions;

/* Used to map field names in attributes and where conditions */
function mapOptionFieldNames(options, Model) {
  if (Array.isArray(options.attributes)) {
    options.attributes = options.attributes.map(attr => {
      // Object lookups will force any variable to strings, we don't want that for special objects etc
      if (typeof attr !== 'string') return attr;
      // Map attributes to aliased syntax attributes
      if (Model.rawAttributes[attr] && attr !== Model.rawAttributes[attr].field) {
        return [Model.rawAttributes[attr].field, attr];
      }
      return attr;
    });
  }

  if (options.where && _.isPlainObject(options.where)) {
    options.where = mapWhereFieldNames(options.where, Model);
  }

  return options;
}
exports.mapOptionFieldNames = mapOptionFieldNames;

function mapWhereFieldNames(attributes, Model) {
  let attribute;
  let rawAttribute;

  if (attributes) {
    for (attribute in attributes) {
      rawAttribute = Model.rawAttributes[attribute];

      if (rawAttribute && rawAttribute.field !== rawAttribute.fieldName) {
        attributes[rawAttribute.field] = attributes[attribute];
        delete attributes[attribute];
      }

      if (_.isPlainObject(attributes[attribute])
        && !(rawAttribute && (
          rawAttribute.type instanceof DataTypes.HSTORE
          || rawAttribute.type instanceof DataTypes.JSON))) { // Prevent renaming of HSTORE & JSON fields
        attributes[attribute] = mapOptionFieldNames({
          where: attributes[attribute]
        }, Model).where;
      }

      if (Array.isArray(attributes[attribute])) {
        attributes[attribute] = attributes[attribute].map(where => {
          if (_.isPlainObject(where)) {
            return mapWhereFieldNames(where, Model);
          }

          return where;
        });
      }
    }
  }

  return attributes;
}
exports.mapWhereFieldNames = mapWhereFieldNames;

/* Used to map field names in values */
function mapValueFieldNames(dataValues, fields, Model) {
  const values = {};

  for (const attr of fields) {
    if (dataValues[attr] !== undefined && !Model._isVirtualAttribute(attr)) {
      // Field name mapping
      if (Model.rawAttributes[attr] && Model.rawAttributes[attr].field && Model.rawAttributes[attr].field !== attr) {
        values[Model.rawAttributes[attr].field] = dataValues[attr];
      } else {
        values[attr] = dataValues[attr];
      }
    }
  }

  return values;
}
exports.mapValueFieldNames = mapValueFieldNames;

function isColString(value) {
  return typeof value === 'string' && value.substr(0, 1) === '$' && value.substr(value.length - 1, 1) === '$';
}
exports.isColString = isColString;

function argsArePrimaryKeys(args, primaryKeys) {
  let result = args.length === Object.keys(primaryKeys).length;
  if (result) {
    _.each(args, arg => {
      if (result) {
        if (['number', 'string'].indexOf(typeof arg) !== -1) {
          result = true;
        } else {
          result = arg instanceof Date || Buffer.isBuffer(arg);
        }
      }
    });
  }
  return result;
}
exports.argsArePrimaryKeys = argsArePrimaryKeys;

function canTreatArrayAsAnd(arr) {
  return arr.reduce((treatAsAnd, arg) => {
    if (treatAsAnd) {
      return treatAsAnd;
    } else {
      return _.isPlainObject(arg);
    }
  }, false);
}
exports.canTreatArrayAsAnd = canTreatArrayAsAnd;

function combineTableNames(tableName1, tableName2) {
  return tableName1.toLowerCase() < tableName2.toLowerCase() ? tableName1 + tableName2 : tableName2 + tableName1;
}
exports.combineTableNames = combineTableNames;

function singularize(str) {
  return inflection.singularize(str);
}
exports.singularize = singularize;

function pluralize(str) {
  return inflection.pluralize(str);
}
exports.pluralize = pluralize;

function removeCommentsFromFunctionString(s) {
  s = s.replace(/\s*(\/\/.*)/g, '');
  s = s.replace(/(\/\*[\n\r\s\S]*?\*\/)/mg, '');

  return s;
}
exports.removeCommentsFromFunctionString = removeCommentsFromFunctionString;

function toDefaultValue(value) {
  if (typeof value === 'function') {
    const tmp = value();
    if (tmp instanceof DataTypes.ABSTRACT) {
      return tmp.toSql();
    } else {
      return tmp;
    }
  } else if (value instanceof DataTypes.UUIDV1) {
    return uuid.v1();
  } else if (value instanceof DataTypes.UUIDV4) {
    return uuid.v4();
  } else if (value instanceof DataTypes.NOW) {
    return now();
  } else if (_.isPlainObject(value) || _.isArray(value)) {
    return _.clone(value);
  } else {
    return value;
  }
}
exports.toDefaultValue = toDefaultValue;

/**
 * Determine if the default value provided exists and can be described
 * in a db schema using the DEFAULT directive.
 *
 * @param  {*} value Any default value.
 * @return {boolean} yes / no.
 * @private
 */
function defaultValueSchemable(value) {
  if (typeof value === 'undefined') { return false; }

  // TODO this will be schemable when all supported db
  // have been normalized for this case
  if (value instanceof DataTypes.NOW) { return false; }

  if (value instanceof DataTypes.UUIDV1 || value instanceof DataTypes.UUIDV4) { return false; }

  if (_.isFunction(value)) {
    return false;
  }

  return true;
}
exports.defaultValueSchemable = defaultValueSchemable;

function removeNullValuesFromHash(hash, omitNull, options) {
  let result = hash;

  options = options || {};
  options.allowNull = options.allowNull || [];

  if (omitNull) {
    const _hash = {};

    _.forIn(hash, (val, key) => {
      if (options.allowNull.indexOf(key) > -1 || key.match(/Id$/) || val !== null && val !== undefined) {
        _hash[key] = val;
      }
    });

    result = _hash;
  }

  return result;
}
exports.removeNullValuesFromHash = removeNullValuesFromHash;

function stack() {
  const orig = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const err = new Error();
  Error.captureStackTrace(err, stack);
  const errStack = err.stack;
  Error.prepareStackTrace = orig;
  return errStack;
}
exports.stack = stack;

function sliceArgs(args, begin) {
  begin = begin || 0;
  const tmp = new Array(args.length - begin);
  for (let i = begin; i < args.length; ++i) {
    tmp[i - begin] = args[i];
  }
  return tmp;
}
exports.sliceArgs = sliceArgs;

function now(dialect) {
  const now = new Date();
  if (['mysql', 'postgres', 'sqlite'].indexOf(dialect) === -1) {
    now.setMilliseconds(0);
  }
  return now;
}
exports.now = now;

// Note: Use the `quoteIdentifier()` and `escape()` methods on the
// `QueryInterface` instead for more portable code.

const TICK_CHAR = '`';
exports.TICK_CHAR = TICK_CHAR;

function addTicks(s, tickChar) {
  tickChar = tickChar || TICK_CHAR;
  return tickChar + removeTicks(s, tickChar) + tickChar;
}
exports.addTicks = addTicks;

function removeTicks(s, tickChar) {
  tickChar = tickChar || TICK_CHAR;
  return s.replace(new RegExp(tickChar, 'g'), '');
}
exports.removeTicks = removeTicks;

/**
 * Receives a tree-like object and returns a plain object which depth is 1.
 *
 * - Input:
 *
 *  {
 *    name: 'John',
 *    address: {
 *      street: 'Fake St. 123',
 *      coordinates: {
 *        longitude: 55.6779627,
 *        latitude: 12.5964313
 *      }
 *    }
 *  }
 *
 * - Output:
 *
 *  {
 *    name: 'John',
 *    address.street: 'Fake St. 123',
 *    address.coordinates.latitude: 55.6779627,
 *    address.coordinates.longitude: 12.5964313
 *  }
 *
 * @param {object} value Object to be deeply flattened
 */
function flattenObjectDeep(value) {
  if (!_.isPlainObject(value)) return value;
  const flattenedObj = {};

  function flattenObject(obj, subPath) {
    Object.keys(obj).forEach(key => {
      const pathToProperty = subPath ? `${subPath}.${key}` : `${key}`;
      if (typeof obj[key] === 'object') {
        flattenObject(obj[key], flattenedObj, pathToProperty);
      } else {
        flattenedObj[pathToProperty] = _.get(obj, key);
      }
    });
    return flattenedObj;
  }

  return flattenObject(value, undefined);
}
exports.flattenObjectDeep = flattenObjectDeep;

/**
 * Utility functions for representing SQL functions, and columns that should be escaped.
 * Please do not use these functions directly, use Sequelize.fn and Sequelize.col instead.
 * @private
 */
class SequelizeMethod {}
exports.SequelizeMethod = SequelizeMethod;

class Fn extends SequelizeMethod {
  constructor(fn, args) {
    super();
    this.fn = fn;
    this.args = args;
  }
  clone() {
    return new Fn(this.fn, this.args);
  }
}
exports.Fn = Fn;

class Col extends SequelizeMethod {
  constructor(col) {
    super();
    if (arguments.length > 1) {
      col = this.sliceArgs(arguments);
    }
    this.col = col;
  }
}
exports.Col = Col;

class Cast extends SequelizeMethod {
  constructor(val, type) {
    super();
    this.val = val;
    this.type = (type || '').trim();
  }
}
exports.Cast = Cast;

class Literal extends SequelizeMethod {
  constructor(val) {
    super();
    this.val = val;
  }
}
exports.Literal = Literal;

class Json extends SequelizeMethod {
  constructor(conditionsOrPath, value) {
    super();
    if (_.isObject(conditionsOrPath)) {
      this.conditions = conditionsOrPath;
    } else {
      this.path = conditionsOrPath;
      if (value) {
        this.value = value;
      }
    }
  }
}
exports.Json = Json;

class Where extends SequelizeMethod {
  constructor(attribute, comparator, logic) {
    super();
    if (logic === undefined) {
      logic = comparator;
      comparator = '=';
    }

    this.attribute = attribute;
    this.comparator = comparator;
    this.logic = logic;
  }
}
exports.Where = Where;

exports.validateParameter = parameterValidator;


exports.mapIsolationLevelStringToTedious = (isolationLevel, tedious) => {
  if (!tedious) {
    throw new Error('An instance of tedious lib should be passed to this function');
  }
  const tediousIsolationLevel = tedious.ISOLATION_LEVEL;
  switch (isolationLevel) {
    case 'READ_UNCOMMITTED':
      return tediousIsolationLevel.READ_UNCOMMITTED;
    case 'READ_COMMITTED':
      return tediousIsolationLevel.READ_COMMITTED;
    case 'REPEATABLE_READ':
      return tediousIsolationLevel.REPEATABLE_READ;
    case 'SERIALIZABLE':
      return tediousIsolationLevel.SERIALIZABLE;
    case 'SNAPSHOT':
      return tediousIsolationLevel.SNAPSHOT;
  }
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const util = __webpack_require__(7);
const inherits = __webpack_require__(11);
const _ = __webpack_require__(0);
const Wkt = __webpack_require__(54);
const sequelizeErrors = __webpack_require__(3);
const warnings = {};
const Validator = __webpack_require__(16).validator;
const momentTz = __webpack_require__(18);
const moment = __webpack_require__(17);
const Utils = __webpack_require__(1);

function ABSTRACT() {}

ABSTRACT.prototype.dialectTypes = '';

ABSTRACT.prototype.toString = function toString(options) {
  return this.toSql(options);
};
ABSTRACT.prototype.toSql = function toSql() {
  return this.key;
};
ABSTRACT.warn = function warn(link, text) {
  if (!warnings[text]) {
    warnings[text] = true;
    Utils.warn(`${text}, '\n>> Check:', ${link}`);
  }
};
ABSTRACT.prototype.stringify = function stringify(value, options) {
  if (this._stringify) {
    return this._stringify(value, options);
  }
  return value;
};

function STRING(length, binary) {
  const options = typeof length === 'object' && length || {length, binary};

  if (!(this instanceof STRING)) return new STRING(options);

  this.options = options;
  this._binary = options.binary;
  this._length = options.length || 255;
}
inherits(STRING, ABSTRACT);

STRING.prototype.key = STRING.key = 'STRING';
STRING.prototype.toSql = function toSql() {
  return 'VARCHAR(' + this._length + ')' + (this._binary ? ' BINARY' : '');
};
STRING.prototype.validate = function validate(value) {
  if (Object.prototype.toString.call(value) !== '[object String]') {
    if (this.options.binary && Buffer.isBuffer(value) || _.isNumber(value)) {
      return true;
    }
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid string', value));
  }

  return true;
};
Object.defineProperty(STRING.prototype, 'BINARY', {
  get() {
    this._binary = true;
    this.options.binary = true;
    return this;
  }
});

function CHAR(length, binary) {
  const options = typeof length === 'object' && length || {length, binary};

  if (!(this instanceof CHAR)) return new CHAR(options);
  STRING.apply(this, arguments);
}
inherits(CHAR, STRING);

CHAR.prototype.key = CHAR.key = 'CHAR';
CHAR.prototype.toSql = function toSql() {
  return 'CHAR(' + this._length + ')' + (this._binary ? ' BINARY' : '');
};

function TEXT(length) {
  const options = typeof length === 'object' && length || {length};
  if (!(this instanceof TEXT)) return new TEXT(options);
  this.options = options;
  this._length = options.length || '';
}
inherits(TEXT, ABSTRACT);

TEXT.prototype.key = TEXT.key = 'TEXT';
TEXT.prototype.toSql = function toSql() {
  switch (this._length.toLowerCase()) {
    case 'tiny':
      return 'TINYTEXT';
    case 'medium':
      return 'MEDIUMTEXT';
    case 'long':
      return 'LONGTEXT';
    default:
      return this.key;
  }
};
TEXT.prototype.validate = function validate(value) {
  if (!_.isString(value)) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid string', value));
  }

  return true;
};

function NUMBER(options) {
  this.options = options;
  this._length = options.length;
  this._zerofill = options.zerofill;
  this._decimals = options.decimals;
  this._precision = options.precision;
  this._scale = options.scale;
  this._unsigned = options.unsigned;
}
inherits(NUMBER, ABSTRACT);

NUMBER.prototype.key = NUMBER.key = 'NUMBER';
NUMBER.prototype.toSql = function toSql() {
  let result = this.key;
  if (this._length) {
    result += '(' + this._length;
    if (typeof this._decimals === 'number') {
      result += ',' + this._decimals;
    }
    result += ')';
  }
  if (this._unsigned) {
    result += ' UNSIGNED';
  }
  if (this._zerofill) {
    result += ' ZEROFILL';
  }
  return result;
};

NUMBER.prototype.validate = function(value) {
  if (!Validator.isFloat(String(value))) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid number', value));
  }

  return true;
};

Object.defineProperty(NUMBER.prototype, 'UNSIGNED', {
  get() {
    this._unsigned = true;
    this.options.unsigned = true;
    return this;
  }
});
Object.defineProperty(NUMBER.prototype, 'ZEROFILL', {
  get() {
    this._zerofill = true;
    this.options.zerofill = true;
    return this;
  }
});

function INTEGER(length) {
  const options = typeof length === 'object' && length || {length};
  if (!(this instanceof INTEGER)) return new INTEGER(options);
  NUMBER.call(this, options);
}
inherits(INTEGER, NUMBER);

INTEGER.prototype.key = INTEGER.key = 'INTEGER';
INTEGER.prototype.validate = function validate(value) {
  if (!Validator.isInt(String(value))) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid integer', value));
  }

  return true;
};

function BIGINT(length) {
  const options = typeof length === 'object' && length || {length};
  if (!(this instanceof BIGINT)) return new BIGINT(options);
  NUMBER.call(this, options);
}
inherits(BIGINT, NUMBER);

BIGINT.prototype.key = BIGINT.key = 'BIGINT';
BIGINT.prototype.validate = function validate(value) {
  if (!Validator.isInt(String(value))) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid bigint', value));
  }

  return true;
};

function FLOAT(length, decimals) {
  const options = typeof length === 'object' && length || {length, decimals};
  if (!(this instanceof FLOAT)) return new FLOAT(options);
  NUMBER.call(this, options);
}
inherits(FLOAT, NUMBER);

FLOAT.prototype.key = FLOAT.key = 'FLOAT';
FLOAT.prototype.validate = function validate(value) {
  if (!Validator.isFloat(String(value))) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid float', value));
  }

  return true;
};

function REAL(length, decimals) {
  const options = typeof length === 'object' && length || {length, decimals};
  if (!(this instanceof REAL)) return new REAL(options);
  NUMBER.call(this, options);
}
inherits(REAL, NUMBER);

REAL.prototype.key = REAL.key = 'REAL';

function DOUBLE(length, decimals) {
  const options = typeof length === 'object' && length || {length, decimals};
  if (!(this instanceof DOUBLE)) return new DOUBLE(options);
  NUMBER.call(this, options);
}
inherits(DOUBLE, NUMBER);

DOUBLE.prototype.key = DOUBLE.key = 'DOUBLE PRECISION';

function DECIMAL(precision, scale) {
  const options = typeof precision === 'object' && precision || {precision, scale};
  if (!(this instanceof DECIMAL)) return new DECIMAL(options);
  NUMBER.call(this, options);
}
inherits(DECIMAL, NUMBER);

DECIMAL.prototype.key = DECIMAL.key = 'DECIMAL';
DECIMAL.prototype.toSql = function toSql() {

  if (this._precision || this._scale) {
    return 'DECIMAL(' + [this._precision, this._scale].filter(_.identity).join(',') + ')';
  }

  return 'DECIMAL';
};
DECIMAL.prototype.validate = function validate(value) {
  if (!Validator.isDecimal(String(value))) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid decimal', value));
  }

  return true;
};

for (const floating of [FLOAT, DOUBLE, REAL]) {
  floating.prototype.escape = false;
  floating.prototype._stringify = function _stringify(value) {
    if (isNaN(value)) {
      return "'NaN'";
    } else if (!isFinite(value)) {
      const sign = value < 0 ? '-' : '';
      return "'" + sign + "Infinity'";
    }

    return value;
  };
}

function BOOLEAN() {
  if (!(this instanceof BOOLEAN)) return new BOOLEAN();
}
inherits(BOOLEAN, ABSTRACT);

BOOLEAN.prototype.key = BOOLEAN.key = 'BOOLEAN';
BOOLEAN.prototype.toSql = function toSql() {
  return 'TINYINT(1)';
};
BOOLEAN.prototype.validate = function validate(value) {
  if (!Validator.isBoolean(String(value))) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid boolean', value));
  }

  return true;
};

function TIME() {
  if (!(this instanceof TIME)) return new TIME();
}
inherits(TIME, ABSTRACT);

TIME.prototype.key = TIME.key = 'TIME';
TIME.prototype.toSql = function toSql() {
  return 'TIME';
};

function DATE(length) {
  const options = typeof length === 'object' && length || {length};

  if (!(this instanceof DATE)) return new DATE(options);

  this.options = options;
  this._length = options.length || '';
}
inherits(DATE, ABSTRACT);

DATE.prototype.key = DATE.key = 'DATE';
DATE.prototype.toSql = function toSql() {
  return 'DATETIME';
};
DATE.prototype.validate = function validate(value) {
  if (!Validator.isDate(String(value))) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid date', value));
  }

  return true;
};

DATE.prototype._applyTimezone = function _applyTimezone(date, options) {
  if (options.timezone) {
    if (momentTz.tz.zone(options.timezone)) {
      date = momentTz(date).tz(options.timezone);
    } else {
      date = moment(date).utcOffset(options.timezone);
    }
  } else {
    date = momentTz(date);
  }

  return date;
};

DATE.prototype._stringify = function _stringify(date, options) {
  date = this._applyTimezone(date, options);

  // Z here means current timezone, _not_ UTC
  return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
};

function DATEONLY() {
  if (!(this instanceof DATEONLY)) return new DATEONLY();
}
util.inherits(DATEONLY, ABSTRACT);

DATEONLY.prototype.key = DATEONLY.key = 'DATEONLY';
DATEONLY.prototype.toSql = function() {
  return 'DATE';
};

DATEONLY.prototype._stringify = function _stringify(date) {
  return moment(date).format('YYYY-MM-DD');
};

function HSTORE() {
  if (!(this instanceof HSTORE)) return new HSTORE();
}
inherits(HSTORE, ABSTRACT);

HSTORE.prototype.key = HSTORE.key = 'HSTORE';
HSTORE.prototype.validate = function validate(value) {
  if (!_.isPlainObject(value)) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid hstore', value));
  }

  return true;
};

function JSONTYPE() {
  if (!(this instanceof JSONTYPE)) return new JSONTYPE();
}
inherits(JSONTYPE, ABSTRACT);

JSONTYPE.prototype.key = JSONTYPE.key = 'JSON';
JSONTYPE.prototype.validate = function validate() {
  return true;
};

JSONTYPE.prototype._stringify = function _stringify(value) {
  return JSON.stringify(value);
};

function JSONB() {
  if (!(this instanceof JSONB)) return new JSONB();
  JSONTYPE.call(this);
}
inherits(JSONB, JSONTYPE);

JSONB.prototype.key = JSONB.key = 'JSONB';

function NOW() {
  if (!(this instanceof NOW)) return new NOW();
}
inherits(NOW, ABSTRACT);

NOW.prototype.key = NOW.key = 'NOW';

function BLOB(length) {
  const options = typeof length === 'object' && length || {length};
  if (!(this instanceof BLOB)) return new BLOB(options);
  this.options = options;
  this._length = options.length || '';
}
inherits(BLOB, ABSTRACT);

BLOB.prototype.key = BLOB.key = 'BLOB';
BLOB.prototype.toSql = function toSql() {
  switch (this._length.toLowerCase()) {
    case 'tiny':
      return 'TINYBLOB';
    case 'medium':
      return 'MEDIUMBLOB';
    case 'long':
      return 'LONGBLOB';
    default:
      return this.key;
  }
};
BLOB.prototype.validate = function validate(value) {
  if (!_.isString(value) && !Buffer.isBuffer(value)) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid blob', value));
  }

  return true;
};

BLOB.prototype.escape = false;
BLOB.prototype._stringify = function _stringify(value) {
  if (!Buffer.isBuffer(value)) {
    if (Array.isArray(value)) {
      value = new Buffer(value);
    } else {
      value = new Buffer(value.toString());
    }
  }
  const hex = value.toString('hex');

  return this._hexify(hex);
};

BLOB.prototype._hexify = function _hexify(hex) {
  return "X'" + hex + "'";
};

function RANGE(subtype) {
  const options = _.isPlainObject(subtype) ? subtype : {subtype};

  if (!options.subtype) options.subtype = new INTEGER();

  if (_.isFunction(options.subtype)) {
    options.subtype = new options.subtype();
  }

  if (!(this instanceof RANGE)) return new RANGE(options);

  this._subtype = options.subtype.key;
  this.options = options;
}
inherits(RANGE, ABSTRACT);

const pgRangeSubtypes = {
  integer: 'int4range',
  bigint: 'int8range',
  decimal: 'numrange',
  dateonly: 'daterange',
  date: 'tstzrange',
  datenotz: 'tsrange'
};

const pgRangeCastTypes = {
  integer: 'integer',
  bigint: 'bigint',
  decimal: 'numeric',
  dateonly: 'date',
  date: 'timestamptz',
  datenotz: 'timestamp'
};

RANGE.prototype.key = RANGE.key = 'RANGE';
RANGE.prototype.toSql = function toSql() {
  return pgRangeSubtypes[this._subtype.toLowerCase()];
};
RANGE.prototype.toCastType = function toCastType() {
  return pgRangeCastTypes[this._subtype.toLowerCase()];
};
RANGE.prototype.validate = function validate(value) {
  if (_.isPlainObject(value) && value.inclusive) {
    value = value.inclusive;
  }

  if (!_.isArray(value)) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid range', value));
  }

  if (value.length !== 2) {
    throw new sequelizeErrors.ValidationError('A range must be an array with two elements');
  }

  return true;
};

function UUID() {
  if (!(this instanceof UUID)) return new UUID();
}
inherits(UUID, ABSTRACT);

UUID.prototype.key = UUID.key = 'UUID';
UUID.prototype.validate = function validate(value, options) {
  if (!_.isString(value) || !Validator.isUUID(value) && (!options || !options.acceptStrings)) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid uuid', value));
  }

  return true;
};

function UUIDV1() {
  if (!(this instanceof UUIDV1)) return new UUIDV1();
}
inherits(UUIDV1, ABSTRACT);

UUIDV1.prototype.key = UUIDV1.key = 'UUIDV1';
UUIDV1.prototype.validate = function validate(value, options) {
  if (!_.isString(value) || !Validator.isUUID(value) && (!options || !options.acceptStrings)) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid uuid', value));
  }

  return true;
};

function UUIDV4() {
  if (!(this instanceof UUIDV4)) return new UUIDV4();
}
inherits(UUIDV4, ABSTRACT);

UUIDV4.prototype.key = UUIDV4.key = 'UUIDV4';
UUIDV4.prototype.validate = function validate(value, options) {
  if (!_.isString(value) || !Validator.isUUID(value, 4) && (!options || !options.acceptStrings)) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid uuidv4', value));
  }

  return true;
};

function VIRTUAL(ReturnType, fields) {
  if (!(this instanceof VIRTUAL)) return new VIRTUAL(ReturnType, fields);
  if (typeof ReturnType === 'function') ReturnType = new ReturnType();

  this.returnType = ReturnType;
  this.fields = fields;
}
inherits(VIRTUAL, ABSTRACT);

VIRTUAL.prototype.key = VIRTUAL.key = 'VIRTUAL';

function ENUM(value) {
  const options = typeof value === 'object' && !Array.isArray(value) && value || {
    values: Array.prototype.slice.call(arguments).reduce((result, element) => {
      return result.concat(Array.isArray(element) ? element : [element]);
    }, [])
  };
  if (!(this instanceof ENUM)) return new ENUM(options);
  this.values = options.values;
  this.options = options;
}
inherits(ENUM, ABSTRACT);

ENUM.prototype.key = ENUM.key = 'ENUM';
ENUM.prototype.validate = function validate(value) {
  if (!_.includes(this.values, value)) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid choice in %j', value, this.values));
  }

  return true;
};

function ARRAY(type) {
  const options = _.isPlainObject(type) ? type : {type};
  if (!(this instanceof ARRAY)) return new ARRAY(options);
  this.type = typeof options.type === 'function' ? new options.type() : options.type;
}
inherits(ARRAY, ABSTRACT);

ARRAY.prototype.key = ARRAY.key = 'ARRAY';
ARRAY.prototype.toSql = function toSql() {
  return this.type.toSql() + '[]';
};
ARRAY.prototype.validate = function validate(value) {
  if (!_.isArray(value)) {
    throw new sequelizeErrors.ValidationError(util.format('%j is not a valid array', value));
  }

  return true;
};
ARRAY.is = function is(obj, type) {
  return obj instanceof ARRAY && obj.type instanceof type;
};

const helpers = {
  BINARY: [STRING, CHAR],
  UNSIGNED: [NUMBER, INTEGER, BIGINT, FLOAT, DOUBLE, REAL, DECIMAL],
  ZEROFILL: [NUMBER, INTEGER, BIGINT, FLOAT, DOUBLE, REAL, DECIMAL],
  PRECISION: [DECIMAL],
  SCALE: [DECIMAL]
};

function GEOMETRY(type, srid) {
  const options = _.isPlainObject(type) ? type : {type, srid};

  if (!(this instanceof GEOMETRY)) return new GEOMETRY(options);

  this.options = options;
  this.type = options.type;
  this.srid = options.srid;
}
inherits(GEOMETRY, ABSTRACT);

GEOMETRY.prototype.key = GEOMETRY.key = 'GEOMETRY';

GEOMETRY.prototype.escape = false;
GEOMETRY.prototype._stringify = function _stringify(value, options) {
  return 'GeomFromText(' + options.escape(Wkt.convert(value)) + ')';
};

function GEOGRAPHY(type, srid) {
  const options = _.isPlainObject(type) ? type : {type, srid};

  if (!(this instanceof GEOGRAPHY)) return new GEOGRAPHY(options);

  this.options = options;
  this.type = options.type;
  this.srid = options.srid;
}
inherits(GEOGRAPHY, ABSTRACT);

GEOGRAPHY.prototype.key = GEOGRAPHY.key = 'GEOGRAPHY';

GEOGRAPHY.prototype.escape = false;
GEOGRAPHY.prototype._stringify = function _stringify(value, options) {
  return 'GeomFromText(' + options.escape(Wkt.convert(value)) + ')';
};

for (const helper of Object.keys(helpers)) {
  for (const DataType of helpers[helper]) {
    if (!DataType[helper]) {
      Object.defineProperty(DataType, helper, {
        get() {
          const dataType = new DataType();
          if (typeof dataType[helper] === 'object') {
            return dataType;
          }
          return dataType[helper].apply(dataType, arguments);
        }
      });
    }
  }
}

/**
 * A convenience class holding commonly used data types. The datatypes are used when defining a new model using `Sequelize.define`, like this:
 * ```js
 * sequelize.define('model', {
 *   column: DataTypes.INTEGER
 * })
 * ```
 * When defining a model you can just as easily pass a string as type, but often using the types defined here is beneficial. For example, using `DataTypes.BLOB`, mean
 * that that column will be returned as an instance of `Buffer` when being fetched by sequelize.
 *
 * To provide a length for the data type, you can invoke it like a function: `INTEGER(2)`
 *
 * Some data types have special properties that can be accessed in order to change the data type.
 * For example, to get an unsigned integer with zerofill you can do `DataTypes.INTEGER.UNSIGNED.ZEROFILL`.
 * The order you access the properties in do not matter, so `DataTypes.INTEGER.ZEROFILL.UNSIGNED` is fine as well.
 *
 * * All number types (`INTEGER`, `BIGINT`, `FLOAT`, `DOUBLE`, `REAL`, `DECIMAL`) expose the properties `UNSIGNED` and `ZEROFILL`
 * * The `CHAR` and `STRING` types expose the `BINARY` property
 *
 *
 * Three of the values provided here (`NOW`, `UUIDV1` and `UUIDV4`) are special default values, that should not be used to define types. Instead they are used as shorthands for
 * defining default values. For example, to get a uuid field with a default value generated following v1 of the UUID standard:
 * ```js`
 * sequelize.define('model',` {
 *   uuid: {
 *     type: DataTypes.UUID,
 *     defaultValue: DataTypes.UUIDV1,
 *     primaryKey: true
 *   }
 * })
 * ```
 * There may be times when you want to generate your own UUID conforming to some other algorithm. This is accomplished
 * using the defaultValue property as well, but instead of specifying one of the supplied UUID types, you return a value
 * from a function.
 * ```js
 * sequelize.define('model', {
 *   uuid: {
 *     type: DataTypes.UUID,
 *     defaultValue: function() {
 *       return generateMyId()
 *     },
 *     primaryKey: true
 *   }
 * })
 * ```
 *
 * @property {function(length=255: integer)} STRING A variable length string
 * @property {function(length=255: integer)} CHAR A fixed length string.
 * @property {function([length]: string)} TEXT An unlimited length text column. Available lengths: `tiny`, `medium`, `long`
 * @property {function(length=255: integer)} INTEGER A 32 bit integer.
 * @property {function(length: integer)} BIGINT A 64 bit integer. Note: an attribute defined as `BIGINT` will be treated like a `string` due this [feature from node-postgres](https://github.com/brianc/node-postgres/pull/353) to prevent precision loss. To have this attribute as a `number`, this is a possible [workaround](https://github.com/sequelize/sequelize/issues/2383#issuecomment-58006083).
 * @property {function(length: integer, decimals: integer)} FLOAT Floating point number (4-byte precision).
 * @property {function(length: integer, decimals: integer)} DOUBLE Floating point number (8-byte precision).
 * @property {function(precision: integer, scale: integer)} DECIMAL Decimal number.
 * @property {function(length: integer, decimals: integer)} REAL Floating point number (4-byte precision).
 * @property {function} BOOLEAN A boolean / tinyint column, depending on dialect
 * @property {function(length: string)} BLOB Binary storage. Available lengths: `tiny`, `medium`, `long`
 * @property {function(values: string[])} ENUM An enumeration. `DataTypes.ENUM('value', 'another value')`.
 * @property {function(length: integer)} DATE A datetime column
 * @property {function} DATEONLY A date only column (no timestamp)
 * @property {function} TIME A time column
 * @property {function} NOW A default value of the current timestamp
 * @property {function} UUID A column storing a unique universal identifier. Use with `UUIDV1` or `UUIDV4` for default values.
 * @property {function} UUIDV1 A default unique universal identifier generated following the UUID v1 standard
 * @property {function} UUIDV4 A default unique universal identifier generated following the UUID v4 standard
 * @property {function} HSTORE A key / value store column. Only available in postgres.
 * @property {function} JSON A JSON string column. Only available in postgres and sqlite.
 * @property {function} JSONB A binary storage JSON column. Only available in postgres.
 * @property {function(type: DataTypes)} ARRAY An array of `type`, e.g. `DataTypes.ARRAY(DataTypes.DECIMAL)`. Only available in postgres.
 * @property {function(type: DataTypes)} RANGE Range types are data types representing a range of values of some element type (called the range's subtype).
 * Only available in postgres. See [the Postgres documentation](http://www.postgresql.org/docs/9.4/static/rangetypes.html) for more details
 * @property {function(type: string, srid: string)} GEOMETRY A column storing Geometry information. It is only available in PostgreSQL (with PostGIS) or MySQL.
 * In MySQL, allowable Geometry types are `POINT`, `LINESTRING`, `POLYGON`.
 *
 * GeoJSON is accepted as input and returned as output.
 * In PostGIS, the GeoJSON is parsed using the PostGIS function `ST_GeomFromGeoJSON`.
 * In MySQL it is parsed using the function `GeomFromText`.
 * Therefore, one can just follow the [GeoJSON spec](http://geojson.org/geojson-spec.html) for handling geometry objects.  See the following examples:
 *
 * ```js
 * // Create a new point:
 * const point = { type: 'Point', coordinates: [39.807222,-76.984722]};
 *
 * User.create({username: 'username', geometry: point });
 *
 * // Create a new linestring:
 * const line = { type: 'LineString', 'coordinates': [ [100.0, 0.0], [101.0, 1.0] ] };
 *
 * User.create({username: 'username', geometry: line });
 *
 * // Create a new polygon:
 * const polygon = { type: 'Polygon', coordinates: [
 *                 [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
 *                   [100.0, 1.0], [100.0, 0.0] ]
 *                 ]};
 *
 * User.create({username: 'username', geometry: polygon });

 * // Create a new point with a custom SRID:
 * const point = {
 *   type: 'Point',
 *   coordinates: [39.807222,-76.984722],
 *   crs: { type: 'name', properties: { name: 'EPSG:4326'} }
 * };
 *
 * User.create({username: 'username', geometry: point })
 * ```
 * @property {function(type: string, srid: string)} GEOGRAPHY A geography datatype represents two dimensional spacial objects in an elliptic coord system.
 * @property {function(returnType: DataTypes, fields: string[])} VIRTUAL A virtual value that is not stored in the DB. This could for example be useful if you want to provide a default value in your model that is returned to the user but not stored in the DB.
 *
 * You could also use it to validate a value before permuting and storing it. Checking password length before hashing it for example:
 * ```js
 * sequelize.define('user', {
 *   password_hash: DataTypes.STRING,
 *   password: {
 *     type: DataTypes.VIRTUAL,
 *     set: function (val) {
 *        // Remember to set the data value, otherwise it won't be validated
 *        this.setDataValue('password', val);
 *        this.setDataValue('password_hash', this.salt + val);
 *      },
 *      validate: {
 *         isLongEnough: function (val) {
 *           if (val.length < 7) {
 *             throw new Error("Please choose a longer password")
 *          }
 *       }
 *     }
 *   }
 * })
 * ```
 * In the above code the password is stored plainly in the password field so it can be validated, but is never stored in the DB.
 *
 * VIRTUAL also takes a return type and dependency fields as arguments
 * If a virtual attribute is present in `attributes` it will automatically pull in the extra fields as well.
 * Return type is mostly useful for setups that rely on types like GraphQL.
 * ```js
 * {
 *   active: {
 *     type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['createdAt']),
 *     get: function() {
 *       return this.get('createdAt') > Date.now() - (7 * 24 * 60 * 60 * 1000)
 *     }
 *   }
 * }
 * ```
 */
const DataTypes = module.exports = {
  ABSTRACT,
  STRING,
  CHAR,
  TEXT,
  NUMBER,
  INTEGER,
  BIGINT,
  FLOAT,
  TIME,
  DATE,
  DATEONLY,
  BOOLEAN,
  NOW,
  BLOB,
  DECIMAL,
  NUMERIC: DECIMAL,
  UUID,
  UUIDV1,
  UUIDV4,
  HSTORE,
  JSON: JSONTYPE,
  JSONB,
  VIRTUAL,
  ARRAY,
  NONE: VIRTUAL,
  ENUM,
  RANGE,
  REAL,
  DOUBLE,
  'DOUBLE PRECISION': DOUBLE,
  GEOMETRY,
  GEOGRAPHY
};

_.each(DataTypes, dataType => {
  dataType.types = {};
});

DataTypes.postgres = __webpack_require__(57)(DataTypes);
DataTypes.mysql = __webpack_require__(60)(DataTypes);
DataTypes.sqlite = __webpack_require__(61)(DataTypes);
DataTypes.mssql = __webpack_require__(62)(DataTypes);

module.exports = DataTypes;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(55);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Promise = __webpack_require__(67).getNewLibraryCopy();

module.exports = Promise;
module.exports.Promise = Promise;
module.exports.default = Promise;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(47);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fs__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_fs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_Sequelize__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_Sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_Sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__db_js__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__changelog__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__users__ = __webpack_require__(111);
__webpack_require__(15).config();





var env = "development" || "development";
var config = __WEBPACK_IMPORTED_MODULE_3__db_js__["a" /* default */][env];





var params = Object.assign({
  // 字段以下划线（_）来分割
  underscored: true,
  dialectOptions: {
    ssl: false
  },
  define: {
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
  },
  logging: false
}, config);

var sequelize = void 0;

if (config.url) {
  sequelize = new __WEBPACK_IMPORTED_MODULE_2_Sequelize___default.a(config.url, params);
} else {
  sequelize = new __WEBPACK_IMPORTED_MODULE_2_Sequelize___default.a(config.database, config.username, config.password, params);
}

var db = {};

[__WEBPACK_IMPORTED_MODULE_4__changelog__["a" /* default */], __WEBPACK_IMPORTED_MODULE_5__pages__["a" /* default */], __WEBPACK_IMPORTED_MODULE_6__users__["a" /* default */]].forEach(function (md) {
  var model = md(sequelize, __WEBPACK_IMPORTED_MODULE_2_Sequelize___default.a);
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = __WEBPACK_IMPORTED_MODULE_2_Sequelize___default.a;

/* harmony default export */ __webpack_exports__["a"] = (db);

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const AssociationError = __webpack_require__(3).AssociationError;


/**
 * Creating associations in sequelize is done by calling one of the belongsTo / hasOne / hasMany / belongsToMany functions on a model (the source), and providing another model as the first argument to the function (the target).
 *
 * * hasOne - adds a foreign key to the target and singular association mixins to the source.
 * * belongsTo - add a foreign key and singular association mixins to the source.
 * * hasMany - adds a foreign key to target and plural association mixins to the source.
 * * belongsToMany - creates an N:M association with a join table and adds plural association mixins to the source. The junction table is created with sourceId and targetId.
 *
 * Creating an association will add a foreign key constraint to the attributes. All associations use `CASCADE` on update and `SET NULL` on delete, except for n:m, which also uses `CASCADE` on delete.
 *
 * When creating associations, you can provide an alias, via the `as` option. This is useful if the same model is associated twice, or you want your association to be called something other than the name of the target model.
 *
 * As an example, consider the case where users have many pictures, one of which is their profile picture. All pictures have a `userId`, but in addition the user model also has a `profilePictureId`, to be able to easily load the user's profile picture.
 *
 * ```js
 * User.hasMany(Picture)
 * User.belongsTo(Picture, { as: 'ProfilePicture', constraints: false })
 *
 * user.getPictures() // gets you all pictures
 * user.getProfilePicture() // gets you only the profile picture
 *
 * User.findAll({
 *   where: ...,
 *   include: [
 *     { model: Picture }, // load all pictures
 *     { model: Picture, as: 'ProfilePicture' }, // load the profile picture.
 *     // Notice that the spelling must be the exact same as the one in the association
 *   ]
 * })
 * ```
 * To get full control over the foreign key column added by sequelize, you can use the `foreignKey` option. It can either be a string, that specifies the name, or and object type definition,
 * equivalent to those passed to `sequelize.define`.
 *
 * ```js
 * User.hasMany(Picture, { foreignKey: 'uid' })
 * ```
 *
 * The foreign key column in Picture will now be called `uid` instead of the default `userId`.
 *
 * ```js
 * User.hasMany(Picture, {
 *   foreignKey: {
 *     name: 'uid',
 *     allowNull: false
 *   }
 * })
 * ```
 *
 * This specifies that the `uid` column cannot be null. In most cases this will already be covered by the foreign key constraints, which sequelize creates automatically, but can be useful in case where the foreign keys are disabled, e.g. due to circular references (see `constraints: false` below).
 *
 * When fetching associated models, you can limit your query to only load some models. These queries are written in the same way as queries to `find`/`findAll`. To only get pictures in JPG, you can do:
 *
 * ```js
 * user.getPictures({
 *   where: {
 *     format: 'jpg'
 *   }
 * })
 * ```
 *
 * There are several ways to update and add new associations. Continuing with our example of users and pictures:
 * ```js
 * user.addPicture(p) // Add a single picture
 * user.setPictures([p1, p2]) // Associate user with ONLY these two picture, all other associations will be deleted
 * user.addPictures([p1, p2]) // Associate user with these two pictures, but don't touch any current associations
 * ```
 *
 * You don't have to pass in a complete object to the association functions, if your associated model has a single primary key:
 *
 * ```js
 * user.addPicture(req.query.pid) // Here pid is just an integer, representing the primary key of the picture
 * ```
 *
 * In the example above we have specified that a user belongs to his profile picture. Conceptually, this might not make sense, but since we want to add the foreign key to the user model this is the way to do it.
 *
 * Note how we also specified `constraints: false` for profile picture. This is because we add a foreign key from user to picture (profilePictureId), and from picture to user (userId). If we were to add foreign keys to both, it would create a cyclic dependency, and sequelize would not know which table to create first, since user depends on picture, and picture depends on user. These kinds of problems are detected by sequelize before the models are synced to the database, and you will get an error along the lines of `Error: Cyclic dependency found. 'users' is dependent of itself`. If you encounter this, you should either disable some constraints, or rethink your associations completely.
 */
class Association {
  constructor(source, target, options) {
    options = options || {};
    /**
     * @type {Model}
     */
    this.source = source;
    /**
     * @type {Model}
     */
    this.target = target;
    this.options = options;
    this.scope = options.scope;
    this.isSelfAssociation = this.source === this.target;
    this.as = options.as;
    /**
     * The type of the association. One of `HasMany`, `BelongsTo`, `HasOne`, `BelongsToMany`
     * @type {string}
     */
    this.associationType = '';

    if (source.hasAlias(options.as)) {
      throw new AssociationError(`You have used the alias ${options.as} in two separate associations. ` +
      'Aliased associations must have unique aliases.'
      );
    }
  }
  // Normalize input - may be array or single obj, instance or primary key - convert it to an array of built objects
  toInstanceArray(objs) {
    if (!Array.isArray(objs)) {
      objs = [objs];
    }
    return objs.map(function(obj) {
      if (!(obj instanceof this.target)) {
        const tmpInstance = {};
        tmpInstance[this.target.primaryKeyAttribute] = obj;
        return this.target.build(tmpInstance, {
          isNewRecord: false
        });
      }
      return obj;
    }, this);
  }
  inspect() {
    return this.as;
  }
}

module.exports = Association;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * An enum of query types used by `sequelize.query`
 *
 * @see {@link Sequelize#query}
 *
 * @property SELECT
 * @property INSERT
 * @property UPDATE
 * @property BULKUPDATE
 * @property BULKDELETE
 * @property DELETE
 * @property UPSERT
 * @property VERSION
 * @property SHOWTABLES
 * @property SHOWINDEXES
 * @property DESCRIBE
 * @property RAW
 * @property FOREIGNKEYS
 * @property SHOWCONSTRAINTS
 */
const QueryTypes = module.exports = { // eslint-disable-line
  SELECT: 'SELECT',
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  BULKUPDATE: 'BULKUPDATE',
  BULKDELETE: 'BULKDELETE',
  DELETE: 'DELETE',
  UPSERT: 'UPSERT',
  VERSION: 'VERSION',
  SHOWTABLES: 'SHOWTABLES',
  SHOWINDEXES: 'SHOWINDEXES',
  DESCRIBE: 'DESCRIBE',
  RAW: 'RAW',
  FOREIGNKEYS: 'FOREIGNKEYS',
  SHOWCONSTRAINTS: 'SHOWCONSTRAINTS'
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const util = __webpack_require__(7);
const _ = __webpack_require__(0);

/**
 * like util.inherits, but also copies over static properties
 * @private
 */
function inherits(constructor, superConstructor) {
  util.inherits(constructor, superConstructor); // Instance (prototype) methods
  _.extend(constructor, superConstructor); // Static methods
}

module.exports = inherits;
module.exports.inherits = inherits;
module.exports.default = inherits;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const Helpers = __webpack_require__(19);
const _ = __webpack_require__(0);
const Transaction = __webpack_require__(20);
const Association = __webpack_require__(8);

/**
 * One-to-one association
 *
 * In the API reference below, add the name of the association to the method, e.g. for `User.belongsTo(Project)` the getter will be `user.getProject()`.
 *
 * @see {@link Model.belongsTo}
 */
class BelongsTo extends Association {
  constructor(source, target, options) {
    super(source, target, options);

    this.associationType = 'BelongsTo';
    this.isSingleAssociation = true;
    this.foreignKeyAttribute = {};

    if (this.as) {
      this.isAliased = true;
      this.options.name = {
        singular: this.as
      };
    } else {
      this.as = this.target.options.name.singular;
      this.options.name = this.target.options.name;
    }

    if (_.isObject(this.options.foreignKey)) {
      this.foreignKeyAttribute = this.options.foreignKey;
      this.foreignKey = this.foreignKeyAttribute.name || this.foreignKeyAttribute.fieldName;
    } else if (this.options.foreignKey) {
      this.foreignKey = this.options.foreignKey;
    }

    if (!this.foreignKey) {
      this.foreignKey = Utils.camelizeIf(
        [
          Utils.underscoredIf(this.as, this.source.options.underscored),
          this.target.primaryKeyAttribute
        ].join('_'),
        !this.source.options.underscored
      );
    }

    this.identifier = this.foreignKey;

    if (this.source.rawAttributes[this.identifier]) {
      this.identifierField = this.source.rawAttributes[this.identifier].field || this.identifier;
    }

    this.targetKey = this.options.targetKey || this.target.primaryKeyAttribute;
    this.targetKeyField = this.target.rawAttributes[this.targetKey].field || this.targetKey;
    this.targetKeyIsPrimary = this.targetKey === this.target.primaryKeyAttribute;

    this.targetIdentifier = this.targetKey;
    this.associationAccessor = this.as;
    this.options.useHooks = options.useHooks;

    // Get singular name, trying to uppercase the first letter, unless the model forbids it
    const singular = Utils.uppercaseFirst(this.options.name.singular);

    this.accessors = {
      get: 'get' + singular,
      set: 'set' + singular,
      create: 'create' + singular
    };
  }

  // the id is in the source table
  injectAttributes() {
    const newAttributes = {};

    newAttributes[this.foreignKey] = _.defaults({}, this.foreignKeyAttribute, {
      type: this.options.keyType || this.target.rawAttributes[this.targetKey].type,
      allowNull : true
    });

    if (this.options.constraints !== false) {
      const source = this.source.rawAttributes[this.foreignKey] || newAttributes[this.foreignKey];
      this.options.onDelete = this.options.onDelete || (source.allowNull ? 'SET NULL' : 'NO ACTION');
      this.options.onUpdate = this.options.onUpdate || 'CASCADE';
    }

    Helpers.addForeignKeyConstraints(newAttributes[this.foreignKey], this.target, this.source, this.options, this.targetKeyField);
    Utils.mergeDefaults(this.source.rawAttributes, newAttributes);

    this.identifierField = this.source.rawAttributes[this.foreignKey].field || this.foreignKey;

    this.source.refreshAttributes();

    Helpers.checkNamingCollision(this);

    return this;
  }

  mixin(obj) {
    const methods = ['get', 'set', 'create'];

    Helpers.mixinMethods(this, obj, methods);
  }

  /**
   * Get the associated instance.
   *
   * @param {Object} [options]
   * @param {String|Boolean} [options.scope] Apply a scope on the related model, or remove its default scope by passing false.
   * @param {String} [options.schema] Apply a schema on the related model
   * @see {@link Model.findOne} for a full explanation of options
   * @return {Promise<Model>}
   */
  get(instances, options) {
    const association = this;
    const where = {};
    let Target = association.target;
    let instance;

    options = Utils.cloneDeep(options);

    if (options.hasOwnProperty('scope')) {
      if (!options.scope) {
        Target = Target.unscoped();
      } else {
        Target = Target.scope(options.scope);
      }
    }

    if (options.hasOwnProperty('schema')) {
      Target = Target.schema(options.schema, options.schemaDelimiter);
    }

    if (!Array.isArray(instances)) {
      instance = instances;
      instances = undefined;
    }

    if (instances) {
      where[association.targetKey] = {
        $in: instances.map(instance => instance.get(association.foreignKey))
      };
    } else {
      if (association.targetKeyIsPrimary && !options.where) {
        return Target.findById(instance.get(association.foreignKey), options);
      } else {
        where[association.targetKey] = instance.get(association.foreignKey);
        options.limit = null;
      }
    }

    options.where = options.where ?
      {$and: [where, options.where]} :
      where;

    if (instances) {
      return Target.findAll(options).then(results => {
        const result = {};
        for (const instance of instances) {
          result[instance.get(association.foreignKey, {raw: true})] = null;
        }

        for (const instance of results) {
          result[instance.get(association.targetKey, {raw: true})] = instance;
        }

        return result;
      });
    }

    return Target.findOne(options);
  }

  /**
   * Set the associated model.
   *
   * @param {Model|String|Number} [newAssociation] An persisted instance or the primary key of an instance to associate with this. Pass `null` or `undefined` to remove the association.
   * @param {Object} [options] Options passed to `this.save`
   * @param {Boolean} [options.save=true] Skip saving this after setting the foreign key if false.
   * @return {Promise}
   */
  set(sourceInstance, associatedInstance, options) {
    const association = this;

    options = options || {};

    let value = associatedInstance;
    if (associatedInstance instanceof association.target) {
      value = associatedInstance[association.targetKey];
    }

    sourceInstance.set(association.foreignKey, value);

    if (options.save === false) return;

    options = _.extend({
      fields: [association.foreignKey],
      allowNull: [association.foreignKey],
      association: true
    }, options);

    // passes the changed field to save, so only that field get updated.
    return sourceInstance.save(options);
  }

  /**
   * Create a new instance of the associated model and associate it with this.
   *
   * @param {Object} [values]
   * @param {Object} [options] Options passed to `target.create` and setAssociation.
   * @see {@link Model#create}  for a full explanation of options
   * @return {Promise}
   */
  create(sourceInstance, values, fieldsOrOptions) {
    const association = this;

    const options = {};

    if ((fieldsOrOptions || {}).transaction instanceof Transaction) {
      options.transaction = fieldsOrOptions.transaction;
    }
    options.logging = (fieldsOrOptions || {}).logging;

    return association.target.create(values, fieldsOrOptions).then(newAssociatedObject =>
      sourceInstance[association.accessors.set](newAssociatedObject, options)
    );
  }
}

module.exports = BelongsTo;
module.exports.BelongsTo = BelongsTo;
module.exports.default = BelongsTo;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const Helpers = __webpack_require__(19);
const _ = __webpack_require__(0);
const Association = __webpack_require__(8);

/**
 * One-to-many association
 *
 * In the API reference below, add the name of the association to the method, e.g. for `User.hasMany(Project)` the getter will be `user.getProjects()`.
 * If the association is aliased, use the alias instead, e.g. `User.hasMany(Project, { as: 'jobs' })` will be `user.getJobs()`.
 *
 * @see {@link Model.hasMany}
 */
class HasMany extends Association {
  constructor(source, target, options) {
    super(source, target, options);

    this.associationType = 'HasMany';
    this.targetAssociation = null;
    this.sequelize = source.sequelize;
    this.through = options.through;
    this.isMultiAssociation = true;
    this.foreignKeyAttribute = {};

    if (this.options.through) {
      throw new Error('N:M associations are not supported with hasMany. Use belongsToMany instead');
    }

    /*
    * If self association, this is the target association
    */
    if (this.isSelfAssociation) {
      this.targetAssociation = this;
    }

    if (this.as) {
      this.isAliased = true;

      if (_.isPlainObject(this.as)) {
        this.options.name = this.as;
        this.as = this.as.plural;
      } else {
        this.options.name = {
          plural: this.as,
          singular: Utils.singularize(this.as)
        };
      }
    } else {
      this.as = this.target.options.name.plural;
      this.options.name = this.target.options.name;
    }

    /*
    * Foreign key setup
    */
    if (_.isObject(this.options.foreignKey)) {
      this.foreignKeyAttribute = this.options.foreignKey;
      this.foreignKey = this.foreignKeyAttribute.name || this.foreignKeyAttribute.fieldName;
    } else if (this.options.foreignKey) {
      this.foreignKey = this.options.foreignKey;
    }

    if (!this.foreignKey) {
      this.foreignKey = Utils.camelizeIf(
        [
          Utils.underscoredIf(this.source.options.name.singular, this.source.options.underscored),
          this.source.primaryKeyAttribute
        ].join('_'),
        !this.source.options.underscored
      );
    }

    if (this.target.rawAttributes[this.foreignKey]) {
      this.identifierField = this.target.rawAttributes[this.foreignKey].field || this.foreignKey;
      this.foreignKeyField = this.target.rawAttributes[this.foreignKey].field || this.foreignKey;
    }

    this.sourceKey = this.options.sourceKey || this.source.primaryKeyAttribute;
    if (this.target.rawAttributes[this.sourceKey]) {
      this.sourceKeyField = this.source.rawAttributes[this.sourceKey].field || this.sourceKey;
    } else {
      this.sourceKeyField = this.sourceKey;
    }

    if (this.source.fieldRawAttributesMap[this.sourceKey]) {
      this.sourceKeyAttribute = this.source.fieldRawAttributesMap[this.sourceKey].fieldName;
    } else {
      this.sourceKeyAttribute = this.source.primaryKeyAttribute;
    }
    this.sourceIdentifier = this.sourceKey;
    this.associationAccessor = this.as;

    // Get singular and plural names, trying to uppercase the first letter, unless the model forbids it
    const plural = Utils.uppercaseFirst(this.options.name.plural);
    const singular = Utils.uppercaseFirst(this.options.name.singular);

    this.accessors = {
      get: 'get' + plural,
      set: 'set' + plural,
      addMultiple: 'add' + plural,
      add: 'add' + singular,
      create: 'create' + singular,
      remove: 'remove' + singular,
      removeMultiple: 'remove' + plural,
      hasSingle: 'has' + singular,
      hasAll: 'has' + plural,
      count: 'count' + plural
    };
  }

  // the id is in the target table
  // or in an extra table which connects two tables
  injectAttributes() {
    const newAttributes = {};
    const constraintOptions = _.clone(this.options); // Create a new options object for use with addForeignKeyConstraints, to avoid polluting this.options in case it is later used for a n:m
    newAttributes[this.foreignKey] = _.defaults({}, this.foreignKeyAttribute, {
      type: this.options.keyType || this.source.rawAttributes[this.sourceKeyAttribute].type,
      allowNull : true
    });

    if (this.options.constraints !== false) {
      const target = this.target.rawAttributes[this.foreignKey] || newAttributes[this.foreignKey];
      constraintOptions.onDelete = constraintOptions.onDelete || (target.allowNull ? 'SET NULL' : 'CASCADE');
      constraintOptions.onUpdate = constraintOptions.onUpdate || 'CASCADE';
    }
    Helpers.addForeignKeyConstraints(newAttributes[this.foreignKey], this.source, this.target, constraintOptions, this.sourceKeyField);
    Utils.mergeDefaults(this.target.rawAttributes, newAttributes);

    this.identifierField = this.target.rawAttributes[this.foreignKey].field || this.foreignKey;
    this.foreignKeyField = this.target.rawAttributes[this.foreignKey].field || this.foreignKey;

    this.target.refreshAttributes();
    this.source.refreshAttributes();

    Helpers.checkNamingCollision(this);

    return this;
  }

  mixin(obj) {
    const methods = ['get', 'count', 'hasSingle', 'hasAll', 'set', 'add', 'addMultiple', 'remove', 'removeMultiple', 'create'];
    const aliases = {
      hasSingle: 'has',
      hasAll: 'has',
      addMultiple: 'add',
      removeMultiple: 'remove'
    };

    Helpers.mixinMethods(this, obj, methods, aliases);
  }

  /**
   * Get everything currently associated with this, using an optional where clause.
   *
   * @param {Object} [options]
   * @param {Object} [options.where] An optional where clause to limit the associated models
   * @param {String|Boolean} [options.scope] Apply a scope on the related model, or remove its default scope by passing false
   * @param {String} [options.schema] Apply a schema on the related model
   * @see {@link Model.findAll}  for a full explanation of options
   * @return {Promise<Array<Model>>}
   */
  get(instances, options) {
    const association = this;
    const where = {};
    let Model = association.target;
    let instance;
    let values;

    if (!Array.isArray(instances)) {
      instance = instances;
      instances = undefined;
    }

    options = Utils.cloneDeep(options) || {};

    if (association.scope) {
      _.assign(where, association.scope);
    }

    if (instances) {
      values = instances.map(instance => instance.get(association.sourceKey, {raw: true}));

      if (options.limit && instances.length > 1) {
        options.groupedLimit = {
          limit: options.limit,
          on: association,
          values
        };

        delete options.limit;
      } else {
        where[association.foreignKey] = {
          $in: values
        };
        delete options.groupedLimit;
      }
    } else {
      where[association.foreignKey] = instance.get(association.sourceKey, {raw: true});
    }


    options.where = options.where ?
      {$and: [where, options.where]} :
      where;

    if (options.hasOwnProperty('scope')) {
      if (!options.scope) {
        Model = Model.unscoped();
      } else {
        Model = Model.scope(options.scope);
      }
    }

    if (options.hasOwnProperty('schema')) {
      Model = Model.schema(options.schema, options.schemaDelimiter);
    }


    return Model.findAll(options).then(results => {
      if (instance) return results;

      const result = {};
      for (const instance of instances) {
        result[instance.get(association.sourceKey, {raw: true})] = [];
      }

      for (const instance of results) {
        result[instance.get(association.foreignKey, {raw: true})].push(instance);
      }

      return result;
    });
  }

  /**
   * Count everything currently associated with this, using an optional where clause.
   *
   * @param {Object} [options]
   * @param {Object} [options.where] An optional where clause to limit the associated models
   * @param {String|Boolean} [options.scope] Apply a scope on the related model, or remove its default scope by passing false
   * @return {Promise<Integer>}
   */
  count(instance, options) {
    const association = this;
    const model = association.target;
    const sequelize = model.sequelize;

    options = Utils.cloneDeep(options);
    options.attributes = [
      [sequelize.fn('COUNT', sequelize.col(model.primaryKeyField)), 'count']
    ];
    options.raw = true;
    options.plain = true;

    return association.get(instance, options).then(result => parseInt(result.count, 10));
  }

  /**
   * Check if one or more rows are associated with `this`.
   *
   * @param {Model[]|Model|string[]|String|number[]|Number} [instance(s)]
   * @param {Object} [options] Options passed to getAssociations
   * @return {Promise}
   */
  has(sourceInstance, targetInstances, options) {
    const association = this;
    const where = {};

    if (!Array.isArray(targetInstances)) {
      targetInstances = [targetInstances];
    }

    options = _.assign({}, options, {
      scope: false,
      raw: true
    });

    where.$or = targetInstances.map(instance => {
      if (instance instanceof association.target) {
        return instance.where();
      } else {
        const _where = {};
        _where[association.target.primaryKeyAttribute] = instance;
        return _where;
      }
    });

    options.where = {
      $and: [
        where,
        options.where
      ]
    };

    return association.get(sourceInstance, options).then(associatedObjects => associatedObjects.length === targetInstances.length);
  }

  /**
   * Set the associated models by passing an array of persisted instances or their primary keys. Everything that is not in the passed array will be un-associated
   *
   * @param {Array<Model|String|Number>} [newAssociations] An array of persisted instances or primary key of instances to associate with this. Pass `null` or `undefined` to remove all associations.
   * @param {Object} [options] Options passed to `target.findAll` and `update`.
   * @param {Object} [options.validate] Run validation for the join model
   * @return {Promise}
   */
  set(sourceInstance, targetInstances, options) {
    const association = this;

    if (targetInstances === null) {
      targetInstances = [];
    } else {
      targetInstances = association.toInstanceArray(targetInstances);
    }

    return association.get(sourceInstance, _.defaults({scope: false, raw: true}, options)).then(oldAssociations => {
      const promises = [];
      const obsoleteAssociations = oldAssociations.filter(old =>
        !_.find(targetInstances, obj =>
          obj[association.target.primaryKeyAttribute] === old[association.target.primaryKeyAttribute]
        )
      );
      const unassociatedObjects = targetInstances.filter(obj =>
        !_.find(oldAssociations, old =>
          obj[association.target.primaryKeyAttribute] === old[association.target.primaryKeyAttribute]
        )
      );
      let updateWhere;
      let update;

      if (obsoleteAssociations.length > 0) {
        update = {};
        update[association.foreignKey] = null;

        updateWhere = {};

        updateWhere[association.target.primaryKeyAttribute] = obsoleteAssociations.map(associatedObject =>
          associatedObject[association.target.primaryKeyAttribute]
        );

        promises.push(association.target.unscoped().update(
          update,
          _.defaults({
            where: updateWhere
          }, options)
        ));
      }

      if (unassociatedObjects.length > 0) {
        updateWhere = {};

        update = {};
        update[association.foreignKey] = sourceInstance.get(association.sourceKey);

        _.assign(update, association.scope);
        updateWhere[association.target.primaryKeyAttribute] = unassociatedObjects.map(unassociatedObject =>
          unassociatedObject[association.target.primaryKeyAttribute]
        );

        promises.push(association.target.unscoped().update(
          update,
          _.defaults({
            where: updateWhere
          }, options)
        ));
      }

      return Utils.Promise.all(promises).return(sourceInstance);
    });
  }

  /**
   * Associate one or more target rows with `this`. This method accepts a Model / string / number to associate a single row,
   * or a mixed array of Model / string / numbers to associate multiple rows.
   *
   * @param {Model[]|Model|string[]|string|number[]|number} [newAssociation(s)]
   * @param {Object} [options] Options passed to `target.update`.
   * @return {Promise}
   */
  add(sourceInstance, targetInstances, options) {
    if (!targetInstances) return Utils.Promise.resolve();

    const association = this;
    const update = {};
    const where = {};

    options = options || {};

    targetInstances = association.toInstanceArray(targetInstances);

    update[association.foreignKey] = sourceInstance.get(association.sourceKey);
    _.assign(update, association.scope);

    where[association.target.primaryKeyAttribute] = targetInstances.map(unassociatedObject =>
      unassociatedObject.get(association.target.primaryKeyAttribute)
    );

    return association.target.unscoped().update(update, _.defaults({where}, options)).return(sourceInstance);
  }

  /**
   * Un-associate one or several target rows.
   *
   * @param {Model[]|Model|String[]|string|Number[]|number} [oldAssociatedInstance(s)]
   * @param {Object} [options] Options passed to `target.update`
   * @return {Promise}
   */
  remove(sourceInstance, targetInstances, options) {
    const association = this;
    const update = {};
    const where = {};

    options = options || {};
    targetInstances = association.toInstanceArray(targetInstances);

    update[association.foreignKey] = null;

    where[association.foreignKey] = sourceInstance.get(association.sourceKey);
    where[association.target.primaryKeyAttribute] = targetInstances.map(targetInstance =>
      targetInstance.get(association.target.primaryKeyAttribute)
    );

    return association.target.unscoped().update(update, _.defaults({where}, options)).return(this);
  }

  /**
   * Create a new instance of the associated model and associate it with this.
   *
   * @param {Object} [values]
   * @param {Object} [options] Options passed to `target.create`.
   * @return {Promise}
   */
  create(sourceInstance, values, options) {
    const association = this;

    options = options || {};

    if (Array.isArray(options)) {
      options = {
        fields: options
      };
    }

    if (values === undefined) {
      values = {};
    }

    if (association.scope) {
      for (const attribute of Object.keys(association.scope)) {
        values[attribute] = association.scope[attribute];
        if (options.fields) options.fields.push(attribute);
      }
    }

    values[association.foreignKey] = sourceInstance.get(association.sourceKey);
    if (options.fields) options.fields.push(association.foreignKey);
    return association.target.create(values, options);
  }
}

module.exports = HasMany;
module.exports.HasMany = HasMany;
module.exports.default = HasMany;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("semver");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _ = __webpack_require__(0);
const validator = _.cloneDeep(__webpack_require__(56));
const moment = __webpack_require__(17);

const extensions = {
  extend(name, fn) {
    this[name] = fn;

    return this;
  },
  notEmpty(str) {
    return !str.match(/^[\s\t\r\n]*$/);
  },
  len(str, min, max) {
    return this.isLength(str, min, max);
  },
  isUrl(str) {
    return this.isURL(str);
  },
  isIPv6(str) {
    return this.isIP(str, 6);
  },
  isIPv4(str) {
    return this.isIP(str, 4);
  },
  notIn(str, values) {
    return !this.isIn(str, values);
  },
  regex(str, pattern, modifiers) {
    str += '';
    if (Object.prototype.toString.call(pattern).slice(8, -1) !== 'RegExp') {
      pattern = new RegExp(pattern, modifiers);
    }
    return str.match(pattern);
  },
  notRegex(str, pattern, modifiers) {
    return !this.regex(str, pattern, modifiers);
  },
  isDecimal(str) {
    return str !== '' && !!str.match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/);
  },
  min(str, val) {
    const number = parseFloat(str);
    return isNaN(number) || number >= val;
  },
  max(str, val) {
    const number = parseFloat(str);
    return isNaN(number) || number <= val;
  },
  not(str, pattern, modifiers) {
    return this.notRegex(str, pattern, modifiers);
  },
  contains(str, elem) {
    return str.indexOf(elem) >= 0 && !!elem;
  },
  notContains(str, elem) {
    return !this.contains(str, elem);
  },
  is(str, pattern, modifiers) {
    return this.regex(str, pattern, modifiers);
  }
};
exports.extensions = extensions;

function extendModelValidations(modelInstance) {
  const extensions = {
    isImmutable(str, param, field) {
      return modelInstance.isNewRecord || modelInstance.dataValues[field] === modelInstance._previousDataValues[field];
    }
  };

  _.forEach(extensions, (extend, key) => {
    validator[key] = extend;
  });
}
exports.extendModelValidations = extendModelValidations;

// Deprecate this.
validator.notNull = function() {
  throw new Error('Warning "notNull" validation has been deprecated in favor of Schema based "allowNull"');
};

// https://github.com/chriso/validator.js/blob/6.2.0/validator.js
_.forEach(extensions, (extend, key) => {
  validator[key] = extend;
});

// map isNull to isEmpty
// https://github.com/chriso/validator.js/commit/e33d38a26ee2f9666b319adb67c7fc0d3dea7125
validator.isNull = validator.isEmpty;

// isDate removed in 7.0.0
// https://github.com/chriso/validator.js/commit/095509fc707a4dc0e99f85131df1176ad6389fc9
validator.isDate = function(dateString) {
  // avoid http://momentjs.com/guides/#/warnings/js-date/
  // by doing a preliminary check on `dateString`
  const parsed = Date.parse(dateString);
  if (isNaN(parsed)) {
    // fail if we can't parse it
    return false;
  } else {
    // otherwise convert to ISO 8601 as moment prefers
    // http://momentjs.com/docs/#/parsing/string/
    const date = new Date(parsed);
    return moment(date.toISOString()).isValid();
  }
};

exports.validator = validator;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("moment-timezone");

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);

function checkNamingCollision(association) {
  if (association.source.rawAttributes.hasOwnProperty(association.as)) {
    throw new Error(
      'Naming collision between attribute \'' + association.as +
      '\' and association \'' + association.as + '\' on model ' + association.source.name +
      '. To remedy this, change either foreignKey or as in your association definition'
    );
  }
}
exports.checkNamingCollision = checkNamingCollision;

function addForeignKeyConstraints(newAttribute, source, target, options, key) {
  // FK constraints are opt-in: users must either set `foreignKeyConstraints`
  // on the association, or request an `onDelete` or `onUpdate` behaviour

  if (options.foreignKeyConstraint || options.onDelete || options.onUpdate) {

    // Find primary keys: composite keys not supported with this approach
    const primaryKeys = Utils._.chain(source.rawAttributes).keys()
      .filter(key => source.rawAttributes[key].primaryKey)
      .map(key => source.rawAttributes[key].field || key).value();

    if (primaryKeys.length === 1) {
      if (source._schema) {
        newAttribute.references = {
          model: source.sequelize.getQueryInterface().QueryGenerator.addSchema({
            tableName: source.tableName,
            _schema: source._schema,
            _schemaDelimiter: source._schemaDelimiter
          })
        };
      } else {
        newAttribute.references = { model: source.tableName };
      }

      newAttribute.references.key = key || primaryKeys[0];
      newAttribute.onDelete = options.onDelete;
      newAttribute.onUpdate = options.onUpdate;
    }
  }
}
exports.addForeignKeyConstraints = addForeignKeyConstraints;

/**
 * Mixin (inject) association methods to model prototype
 *
 * @private
 * @param {Object} Association instance
 * @param {Object} Model prototype
 * @param {Array} Method names to inject
 * @param {Object} Mapping between model and association method names
 */
function mixinMethods(association, obj, methods, aliases) {
  aliases = aliases || {};

  for (const method of methods) {
    // don't override custom methods
    if (!obj[association.accessors[method]]) {
      const realMethod = aliases[method] || method;

      obj[association.accessors[method]] = function() {
        const instance = this;
        const args = [instance].concat(Array.from(arguments));

        return association[realMethod].apply(association, args);
      };
    }
  }
}
exports.mixinMethods = mixinMethods;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);

/**
 * The transaction object is used to identify a running transaction. It is created by calling `Sequelize.transaction()`.
 *
 * To run a query under a transaction, you should pass the transaction in the options object.
 *
 * @see {@link Sequelize.transaction}
 */
class Transaction {
  /**
   * @param {Sequelize} sequelize A configured sequelize Instance
   * @param {Object} options An object with options
   * @param {Boolean} options.autocommit Sets the autocommit property of the transaction.
   * @param {String} options.type=true Sets the type of the transaction.
   * @param {String} options.isolationLevel=true Sets the isolation level of the transaction.
   * @param {String} options.deferrable Sets the constraints to be deferred or immediately checked.
   */
  constructor(sequelize, options) {
    this.sequelize = sequelize;
    this.savepoints = [];

    // get dialect specific transaction options
    const transactionOptions = sequelize.dialect.supports.transactionOptions || {};
    const generateTransactionId = this.sequelize.dialect.QueryGenerator.generateTransactionId;

    this.options = Utils._.extend({
      autocommit: transactionOptions.autocommit || null,
      type: sequelize.options.transactionType,
      isolationLevel: sequelize.options.isolationLevel,
      readOnly: false
    }, options || {});

    this.parent = this.options.transaction;
    this.id = this.parent ? this.parent.id : generateTransactionId();

    if (this.parent) {
      this.id = this.parent.id;
      this.parent.savepoints.push(this);
      this.name = this.id + '-savepoint-' + this.parent.savepoints.length;
    } else {
      this.id = this.name = generateTransactionId();
    }

    delete this.options.transaction;
  }

  /**
   * Commit the transaction
   *
   * @return {Promise}
   */
  commit() {

    if (this.finished) {
      return Utils.Promise.reject(new Error('Transaction cannot be committed because it has been finished with state: ' + this.finished));
    }

    this._clearCls();

    return this
      .sequelize
      .getQueryInterface()
      .commitTransaction(this, this.options)
      .finally(() => {
        this.finished = 'commit';
        if (!this.parent) {
          return this.cleanup();
        }
        return null;
      });
  }

  /**
   * Rollback (abort) the transaction
   *
   * @return {Promise}
   */
  rollback() {

    if (this.finished) {
      return Utils.Promise.reject(new Error('Transaction cannot be rolled back because it has been finished with state: ' + this.finished));
    }

    this._clearCls();

    return this
      .sequelize
      .getQueryInterface()
      .rollbackTransaction(this, this.options)
      .finally(() => {
        if (!this.parent) {
          return this.cleanup();
        }
        return this;
      });
  }

  prepareEnvironment() {
    let connectionPromise;

    if (this.parent) {
      connectionPromise = Utils.Promise.resolve(this.parent.connection);
    } else {
      const acquireOptions = { uuid: this.id };
      if (this.options.readOnly) {
        acquireOptions.type = 'SELECT';
      }
      connectionPromise = this.sequelize.connectionManager.getConnection(acquireOptions);
    }

    return connectionPromise
      .then(connection => {
        this.connection = connection;
        this.connection.uuid = this.id;
      })
      .then(() => this.begin())
      .then(() => this.setDeferrable())
      .then(() => this.setIsolationLevel())
      .then(() => this.setAutocommit())
      .catch(setupErr => this.rollback().finally(() => {
        throw setupErr;
      }))
      .tap(() => {
        if (this.sequelize.constructor._cls) {
          this.sequelize.constructor._cls.set('transaction', this);
        }
        return null;
      });
  }

  begin() {
    return this
      .sequelize
      .getQueryInterface()
      .startTransaction(this, this.options);
  }

  setDeferrable() {
    if (this.options.deferrable) {
      return this
        .sequelize
        .getQueryInterface()
        .deferConstraints(this, this.options);
    }
  }

  setAutocommit() {
    return this
      .sequelize
      .getQueryInterface()
      .setAutocommit(this, this.options.autocommit, this.options);
  }

  setIsolationLevel() {
    return this
      .sequelize
      .getQueryInterface()
      .setIsolationLevel(this, this.options.isolationLevel, this.options);
  }

  cleanup() {
    const res = this.sequelize.connectionManager.releaseConnection(this.connection);
    this.connection.uuid = undefined;
    return res;
  }

  _clearCls() {
    const cls = this.sequelize.constructor._cls;

    if (cls) {
      if (cls.get('transaction') === this) {
        cls.set('transaction', null);
      }
    }
  }

  /**
   * Types can be set per-transaction by passing `options.type` to `sequelize.transaction`.
   * Default to `DEFERRED` but you can override the default type by passing `options.transactionType` in `new Sequelize`.
   * Sqlite only.
   *
   * Pass in the desired level as the first argument:
   *
   * ```js
   * return sequelize.transaction({type: Sequelize.Transaction.TYPES.EXCLUSIVE}, transaction => {
   *
   *  // your transactions
   *
   * }).then(result => {
   *   // transaction has been committed. Do something after the commit if required.
   * }).catch(err => {
   *   // do something with the err.
   * });
   * ```
   * @property DEFERRED
   * @property IMMEDIATE
   * @property EXCLUSIVE
   */
  static get TYPES() {
    return {
      DEFERRED: 'DEFERRED',
      IMMEDIATE: 'IMMEDIATE',
      EXCLUSIVE: 'EXCLUSIVE'
    };
  }

  /**
   * Isolations levels can be set per-transaction by passing `options.isolationLevel` to `sequelize.transaction`.
   * Default to `REPEATABLE_READ` but you can override the default isolation level by passing `options.isolationLevel` in `new Sequelize`.
   *
   * Pass in the desired level as the first argument:
   *
   * ```js
   * return sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, transaction => {
 *
 *  // your transactions
 *
 * }).then(result => {
 *   // transaction has been committed. Do something after the commit if required.
 * }).catch(err => {
 *   // do something with the err.
 * });
   * ```
   * @property READ_UNCOMMITTED
   * @property READ_COMMITTED
   * @property REPEATABLE_READ
   * @property SERIALIZABLE
   */
  static get ISOLATION_LEVELS() {
    return {
      READ_UNCOMMITTED: 'READ UNCOMMITTED',
      READ_COMMITTED: 'READ COMMITTED',
      REPEATABLE_READ: 'REPEATABLE READ',
      SERIALIZABLE: 'SERIALIZABLE'
    };
  }


  /**
   * Possible options for row locking. Used in conjunction with `find` calls:
   *
   * ```js
   * t1 // is a transaction
   * Model.findAll({
   *   where: ...,
   *   transaction: t1,
   *   lock: t1.LOCK...
   * });
   * ```
   *
   * Postgres also supports specific locks while eager loading by using OF:
   * ```js
   * UserModel.findAll({
   *   where: ...,
   *   include: [TaskModel, ...],
   *   transaction: t1,
   *   lock: {
   *     level: t1.LOCK...,
   *     of: UserModel
   *   }
   * });
   * ```
   * UserModel will be locked but TaskModel won't!
   *
   * @return {Object}
   * @property UPDATE
   * @property SHARE
   * @property KEY_SHARE Postgres 9.3+ only
   * @property NO_KEY_UPDATE Postgres 9.3+ only
   */
  static get LOCK() {
    return {
      UPDATE: 'UPDATE',
      SHARE: 'SHARE',
      KEY_SHARE: 'KEY SHARE',
      NO_KEY_UPDATE: 'NO KEY UPDATE'
    };
  }

  /**
   * @see {@link Transaction.LOCK}
   */
  get LOCK() {
    return Transaction.LOCK;
  }
}

module.exports = Transaction;
module.exports.Transaction = Transaction;
module.exports.default = Transaction;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const Helpers = __webpack_require__(19);
const _ = __webpack_require__(0);
const Association = __webpack_require__(8);
const BelongsTo = __webpack_require__(12);
const HasMany = __webpack_require__(13);
const HasOne = __webpack_require__(31);
const AssociationError = __webpack_require__(3).AssociationError;

/**
 * Many-to-many association with a join table.
 *
 * When the join table has additional attributes, these can be passed in the options object:
 *
 * ```js
 * UserProject = sequelize.define('user_project', {
 *   role: Sequelize.STRING
 * });
 * User.belongsToMany(Project, { through: UserProject });
 * Project.belongsToMany(User, { through: UserProject });
 * // through is required!
 *
 * user.addProject(project, { through: { role: 'manager' }});
 * ```
 *
 * All methods allow you to pass either a persisted instance, its primary key, or a mixture:
 *
 * ```js
 * Project.create({ id: 11 }).then(function (project) {
 *   user.addProjects([project, 12]);
 * });
 * ```
 *
 * If you want to set several target instances, but with different attributes you have to set the attributes on the instance, using a property with the name of the through model:
 *
 * ```js
 * p1.UserProjects = {
 *   started: true
 * }
 * user.setProjects([p1, p2], { through: { started: false }}) // The default value is false, but p1 overrides that.
 * ```
 *
 * Similarly, when fetching through a join table with custom attributes, these attributes will be available as an object with the name of the through model.
 * ```js
 * user.getProjects().then(function (projects) {
   *   let p1 = projects[0]
   *   p1.UserProjects.started // Is this project started yet?
   * })
 * ```
 *
 * In the API reference below, add the name of the association to the method, e.g. for `User.belongsToMany(Project)` the getter will be `user.getProjects()`.
 *
 * @see {@link Model.belongsToMany}
 */
class BelongsToMany extends Association {
  constructor(source, target, options) {
    super(source, target, options);

    if (this.options.through === undefined || this.options.through === true || this.options.through === null) {
      throw new AssociationError('belongsToMany must be given a through option, either a string or a model');
    }

    if (!this.options.through.model) {
      this.options.through = {
        model: options.through
      };
    }

    this.associationType = 'BelongsToMany';
    this.targetAssociation = null;
    this.sequelize = source.sequelize;
    this.through = _.assign({}, this.options.through);
    this.isMultiAssociation = true;
    this.doubleLinked = false;

    if (!this.as && this.isSelfAssociation) {
      throw new AssociationError('\'as\' must be defined for many-to-many self-associations');
    }

    if (this.as) {
      this.isAliased = true;

      if (Utils._.isPlainObject(this.as)) {
        this.options.name = this.as;
        this.as = this.as.plural;
      } else {
        this.options.name = {
          plural: this.as,
          singular: Utils.singularize(this.as)
        };
      }
    } else {
      this.as = this.target.options.name.plural;
      this.options.name = this.target.options.name;
    }

    this.combinedTableName = Utils.combineTableNames(
      this.source.tableName,
      this.isSelfAssociation ? this.as || this.target.tableName : this.target.tableName
    );

    /*
    * If self association, this is the target association - Unless we find a pairing association
    */
    if (this.isSelfAssociation) {
      this.targetAssociation = this;
    }

    /*
    * Default/generated foreign/other keys
    */
    if (_.isObject(this.options.foreignKey)) {
      this.foreignKeyAttribute = this.options.foreignKey;
      this.foreignKey = this.foreignKeyAttribute.name || this.foreignKeyAttribute.fieldName;
    } else {
      if (!this.options.foreignKey) {
        this.foreignKeyDefault = true;
      }

      this.foreignKeyAttribute = {};
      this.foreignKey = this.options.foreignKey || Utils.camelizeIf(
        [
          Utils.underscoredIf(this.source.options.name.singular, this.source.options.underscored),
          this.source.primaryKeyAttribute
        ].join('_'),
        !this.source.options.underscored
      );
    }

    if (_.isObject(this.options.otherKey)) {
      this.otherKeyAttribute = this.options.otherKey;
      this.otherKey = this.otherKeyAttribute.name || this.otherKeyAttribute.fieldName;
    } else {
      if (!this.options.otherKey) {
        this.otherKeyDefault = true;
      }

      this.otherKeyAttribute = {};
      this.otherKey = this.options.otherKey || Utils.camelizeIf(
        [
          Utils.underscoredIf(
            this.isSelfAssociation ?
              Utils.singularize(this.as) :
              this.target.options.name.singular,
            this.target.options.underscored
          ),
          this.target.primaryKeyAttribute
        ].join('_'),
        !this.target.options.underscored
      );
    }

    /*
    * Find paired association (if exists)
    */
    _.each(this.target.associations, association => {
      if (association.associationType !== 'BelongsToMany') return;
      if (association.target !== this.source) return;

      if (this.options.through.model === association.options.through.model) {
        this.paired = association;
        association.paired = this;
      }
    });

    if (typeof this.through.model === 'string') {
      if (!this.sequelize.isDefined(this.through.model)) {
        this.through.model = this.sequelize.define(this.through.model, {}, _.extend(this.options, {
          tableName: this.through.model,
          indexes: [], //we don't want indexes here (as referenced in #2416)
          paranoid: false,  // A paranoid join table does not make sense
          validate: {} // Don't propagate model-level validations
        }));
      } else {
        this.through.model = this.sequelize.model(this.through.model);
      }
    }

    this.options = Object.assign(this.options, _.pick(this.through.model.options, [
      'timestamps', 'createdAt', 'updatedAt', 'deletedAt', 'paranoid'
    ]));

    if (this.paired) {
      if (this.otherKeyDefault) {
        this.otherKey = this.paired.foreignKey;
      }
      if (this.paired.otherKeyDefault) {
        // If paired otherKey was inferred we should make sure to clean it up before adding a new one that matches the foreignKey
        if (this.paired.otherKey !== this.foreignKey) {
          delete this.through.model.rawAttributes[this.paired.otherKey];
        }
        this.paired.otherKey = this.foreignKey;
        this.paired.foreignIdentifier = this.foreignKey;
        delete this.paired.foreignIdentifierField;
      }
    }

    if (this.through) {
      this.throughModel = this.through.model;
    }

    this.options.tableName = this.combinedName = this.through.model === Object(this.through.model) ? this.through.model.tableName : this.through.model;

    this.associationAccessor = this.as;

    // Get singular and plural names, trying to uppercase the first letter, unless the model forbids it
    const plural = Utils.uppercaseFirst(this.options.name.plural);
    const singular = Utils.uppercaseFirst(this.options.name.singular);

    this.accessors = {
      get: 'get' + plural,
      set: 'set' + plural,
      addMultiple: 'add' + plural,
      add: 'add' + singular,
      create: 'create' + singular,
      remove: 'remove' + singular,
      removeMultiple: 'remove' + plural,
      hasSingle: 'has' + singular,
      hasAll: 'has' + plural,
      count: 'count' + plural
    };
  }

  // the id is in the target table
  // or in an extra table which connects two tables
  injectAttributes() {

    this.identifier = this.foreignKey;
    this.foreignIdentifier = this.otherKey;

    // remove any PKs previously defined by sequelize
    // but ignore any keys that are part of this association (#5865)
    _.each(this.through.model.rawAttributes, (attribute, attributeName) => {
      if (attribute.primaryKey === true && attribute._autoGenerated === true) {
        if (attributeName === this.foreignKey || attributeName === this.otherKey) {
          // this key is still needed as it's part of the association
          // so just set primaryKey to false
          attribute.primaryKey = false;
        }
        else {
          delete this.through.model.rawAttributes[attributeName];
        }
        this.primaryKeyDeleted = true;
      }
    });

    const sourceKey = this.source.rawAttributes[this.source.primaryKeyAttribute];
    const sourceKeyType = sourceKey.type;
    const sourceKeyField = sourceKey.field || this.source.primaryKeyAttribute;
    const targetKey = this.target.rawAttributes[this.target.primaryKeyAttribute];
    const targetKeyType = targetKey.type;
    const targetKeyField = targetKey.field || this.target.primaryKeyAttribute;
    const sourceAttribute = _.defaults({}, this.foreignKeyAttribute, { type: sourceKeyType });
    const targetAttribute = _.defaults({}, this.otherKeyAttribute, { type: targetKeyType });

    if (this.primaryKeyDeleted === true) {
      targetAttribute.primaryKey = sourceAttribute.primaryKey = true;
    } else if (this.through.unique !== false) {
      const uniqueKey = [this.through.model.tableName, this.foreignKey, this.otherKey, 'unique'].join('_');
      targetAttribute.unique = sourceAttribute.unique = uniqueKey;
    }

    if (!this.through.model.rawAttributes[this.foreignKey]) {
      this.through.model.rawAttributes[this.foreignKey] = {
        _autoGenerated: true
      };
    }

    if (!this.through.model.rawAttributes[this.otherKey]) {
      this.through.model.rawAttributes[this.otherKey] = {
        _autoGenerated: true
      };
    }

    if (this.options.constraints !== false) {
      sourceAttribute.references = {
        model: this.source.getTableName(),
        key:   sourceKeyField
      };
      // For the source attribute the passed option is the priority
      sourceAttribute.onDelete = this.options.onDelete || this.through.model.rawAttributes[this.foreignKey].onDelete;
      sourceAttribute.onUpdate = this.options.onUpdate || this.through.model.rawAttributes[this.foreignKey].onUpdate;

      if (!sourceAttribute.onDelete) sourceAttribute.onDelete = 'CASCADE';
      if (!sourceAttribute.onUpdate) sourceAttribute.onUpdate = 'CASCADE';

      targetAttribute.references = {
        model: this.target.getTableName(),
        key:   targetKeyField
      };
      // But the for target attribute the previously defined option is the priority (since it could've been set by another belongsToMany call)
      targetAttribute.onDelete = this.through.model.rawAttributes[this.otherKey].onDelete || this.options.onDelete;
      targetAttribute.onUpdate = this.through.model.rawAttributes[this.otherKey].onUpdate || this.options.onUpdate;

      if (!targetAttribute.onDelete) targetAttribute.onDelete = 'CASCADE';
      if (!targetAttribute.onUpdate) targetAttribute.onUpdate = 'CASCADE';
    }

    this.through.model.rawAttributes[this.foreignKey] = _.extend(this.through.model.rawAttributes[this.foreignKey], sourceAttribute);
    this.through.model.rawAttributes[this.otherKey] = _.extend(this.through.model.rawAttributes[this.otherKey], targetAttribute);

    this.identifierField = this.through.model.rawAttributes[this.foreignKey].field || this.foreignKey;
    this.foreignIdentifierField = this.through.model.rawAttributes[this.otherKey].field || this.otherKey;

    if (this.paired && !this.paired.foreignIdentifierField) {
      this.paired.foreignIdentifierField = this.through.model.rawAttributes[this.paired.otherKey].field || this.paired.otherKey;
    }

    this.through.model.refreshAttributes();

    this.toSource = new BelongsTo(this.through.model, this.source, {
      foreignKey: this.foreignKey
    });
    this.manyFromSource = new HasMany(this.source, this.through.model, {
      foreignKey: this.foreignKey
    });
    this.oneFromSource = new HasOne(this.source, this.through.model, {
      foreignKey: this.foreignKey,
      as: this.through.model.name
    });

    this.toTarget = new BelongsTo(this.through.model, this.target, {
      foreignKey: this.otherKey
    });
    this.manyFromTarget = new HasMany(this.target, this.through.model, {
      foreignKey: this.otherKey
    });
    this.oneFromTarget = new HasOne(this.target, this.through.model, {
      foreignKey: this.otherKey,
      as: this.through.model.name
    });

    if (this.paired && this.paired.otherKeyDefault) {
      this.paired.toTarget = new BelongsTo(this.paired.through.model, this.paired.target, {
        foreignKey: this.paired.otherKey
      });

      this.paired.oneFromTarget = new HasOne(this.paired.target, this.paired.through.model, {
        foreignKey: this.paired.otherKey,
        as: this.paired.through.model.name
      });
    }

    Helpers.checkNamingCollision(this);

    return this;
  }

  mixin(obj) {
    const methods = ['get', 'count', 'hasSingle', 'hasAll', 'set', 'add', 'addMultiple', 'remove', 'removeMultiple', 'create'];
    const aliases = {
      hasSingle: 'has',
      hasAll: 'has',
      addMultiple: 'add',
      removeMultiple: 'remove'
    };

    Helpers.mixinMethods(this, obj, methods, aliases);
  }

  /**
   * Get everything currently associated with this, using an optional where clause.
   *
   * @param {Object} [options]
   * @param {Object} [options.where] An optional where clause to limit the associated models
   * @param {String|Boolean} [options.scope] Apply a scope on the related model, or remove its default scope by passing false
   * @param {String} [options.schema] Apply a schema on the related model
   * @see {@link Model.findAll}  for a full explanation of options
   * @return {Promise<Array<Model>>}
   */
  get(instance, options) {
    options = Utils.cloneDeep(options) || {};

    const association = this;
    const through = association.through;
    let scopeWhere;
    let throughWhere;

    if (association.scope) {
      scopeWhere = _.clone(association.scope);
    }

    options.where = {
      $and: [
        scopeWhere,
        options.where
      ]
    };

    if (Object(through.model) === through.model) {
      throughWhere = {};
      throughWhere[association.foreignKey] = instance.get(association.source.primaryKeyAttribute);

      if (through.scope) {
        _.assign(throughWhere, through.scope);
      }

      //If a user pass a where on the options through options, make an "and" with the current throughWhere
      if (options.through && options.through.where) {
        throughWhere = {
          $and: [throughWhere, options.through.where]
        };
      }

      options.include = options.include || [];
      options.include.push({
        association: association.oneFromTarget,
        attributes: options.joinTableAttributes,
        required: true,
        where: throughWhere
      });
    }

    let model = association.target;
    if (options.hasOwnProperty('scope')) {
      if (!options.scope) {
        model = model.unscoped();
      } else {
        model = model.scope(options.scope);
      }
    }

    if (options.hasOwnProperty('schema')) {
      model = model.schema(options.schema, options.schemaDelimiter);
    }

    return model.findAll(options);
  }

  /**
   * Count everything currently associated with this, using an optional where clause.
   *
   * @param {Object} [options]
   * @param {Object} [options.where] An optional where clause to limit the associated models
   * @param {String|Boolean} [options.scope] Apply a scope on the related model, or remove its default scope by passing false
   * @return {Promise<Integer>}
   */
  count(instance, options) {
    const association = this;
    const model = association.target;
    const sequelize = model.sequelize;

    options = Utils.cloneDeep(options);
    options.attributes = [
      [sequelize.fn('COUNT', sequelize.col([association.target.name, model.primaryKeyField].join('.'))), 'count']
    ];
    options.joinTableAttributes = [];
    options.raw = true;
    options.plain = true;

    return association.get(instance, options).then(result => parseInt(result.count, 10));
  }

  /**
   * Check if one or more instance(s) are associated with this. If a list of instances is passed, the function returns true if _all_ instances are associated
   *
   * @param {Model[]|Model|string[]|String|number[]|Number} [instance(s)] Can be an array of instances or their primary keys
   * @param {Object} [options] Options passed to getAssociations
   * @return {Promise<boolean>}
   */
  has(sourceInstance, instances, options) {
    const association = this;
    const where = {};

    if (!Array.isArray(instances)) {
      instances = [instances];
    }

    options = _.assign({
      raw: true
    }, options, {
      scope: false
    });

    where.$or = instances.map(instance => {
      if (instance instanceof association.target) {
        return instance.where();
      } else {
        const where = {};
        where[association.target.primaryKeyAttribute] = instance;
        return where;
      }
    });

    options.where = {
      $and: [
        where,
        options.where
      ]
    };

    return association.get(sourceInstance, options).then(associatedObjects => associatedObjects.length === instances.length);
  }

  /**
   * Set the associated models by passing an array of instances or their primary keys. Everything that it not in the passed array will be un-associated.
   *
   * @param {Array<Model|String|Number>} [newAssociations] An array of persisted instances or primary key of instances to associate with this. Pass `null` or `undefined` to remove all associations.
   * @param {Object} [options] Options passed to `through.findAll`, `bulkCreate`, `update` and `destroy`
   * @param {Object} [options.validate] Run validation for the join model
   * @param {Object} [options.through] Additional attributes for the join table.
   * @return {Promise}
   */
  set(sourceInstance, newAssociatedObjects, options) {
    options = options || {};

    const association = this;
    const sourceKey = association.source.primaryKeyAttribute;
    const targetKey = association.target.primaryKeyAttribute;
    const identifier = association.identifier;
    const foreignIdentifier = association.foreignIdentifier;
    let where = {};

    if (newAssociatedObjects === null) {
      newAssociatedObjects = [];
    } else {
      newAssociatedObjects = association.toInstanceArray(newAssociatedObjects);
    }

    where[identifier] = sourceInstance.get(sourceKey);
    where = Object.assign(where, association.through.scope);

    return association.through.model.findAll(_.defaults({where, raw: true}, options)).then(currentRows => {
      const obsoleteAssociations = [];
      const promises = [];
      let defaultAttributes = options.through || {};

      // Don't try to insert the transaction as an attribute in the through table
      defaultAttributes = _.omit(defaultAttributes, ['transaction', 'hooks', 'individualHooks', 'ignoreDuplicates', 'validate', 'fields', 'logging']);

      const unassociatedObjects = newAssociatedObjects.filter(obj =>
        !_.find(currentRows, currentRow => currentRow[foreignIdentifier] === obj.get(targetKey))
      );

      for (const currentRow of currentRows) {
        const newObj = _.find(newAssociatedObjects, obj => currentRow[foreignIdentifier] === obj.get(targetKey));

        if (!newObj) {
          obsoleteAssociations.push(currentRow);
        } else {
          let throughAttributes = newObj[association.through.model.name];
          // Quick-fix for subtle bug when using existing objects that might have the through model attached (not as an attribute object)
          if (throughAttributes instanceof association.through.model) {
            throughAttributes = {};
          }

          const where = {};
          const attributes = _.defaults({}, throughAttributes, defaultAttributes);

          where[identifier] = sourceInstance.get(sourceKey);
          where[foreignIdentifier] = newObj.get(targetKey);

          if (Object.keys(attributes).length) {
            promises.push(association.through.model.update(attributes, _.extend(options, {where})));
          }
        }
      }

      if (obsoleteAssociations.length > 0) {
        let where = {};
        where[identifier] = sourceInstance.get(sourceKey);
        where[foreignIdentifier] = obsoleteAssociations.map(obsoleteAssociation => obsoleteAssociation[foreignIdentifier]);
        where = Object.assign(where, association.through.scope);
        promises.push(association.through.model.destroy(_.defaults({where}, options)));
      }

      if (unassociatedObjects.length > 0) {
        const bulk = unassociatedObjects.map(unassociatedObject => {
          let attributes = {};

          attributes[identifier] = sourceInstance.get(sourceKey);
          attributes[foreignIdentifier] = unassociatedObject.get(targetKey);

          attributes = _.defaults(attributes, unassociatedObject[association.through.model.name], defaultAttributes);

          _.assign(attributes, association.through.scope);
          attributes = Object.assign(attributes, association.through.scope);

          return attributes;
        });

        promises.push(association.through.model.bulkCreate(bulk, _.assign({ validate: true }, options)));
      }

      return Utils.Promise.all(promises);
    });
  }

  /**
   * Associate one ore several rows with `this`.
   *
   * @param {Model[]|Model|string[]|string|number[]|Number} [newAssociation(s)] A single instance or primary key, or a mixed array of persisted instances or primary keys
   * @param {Object} [options] Options passed to `through.findAll`, `bulkCreate` and `update`
   * @param {Object} [options.validate] Run validation for the join model.
   * @param {Object} [options.through] Additional attributes for the join table.
   * @return {Promise}
   */
  add(sourceInstance, newInstances, options) {
    // If newInstances is null or undefined, no-op
    if (!newInstances) return Utils.Promise.resolve();

    options = _.clone(options) || {};

    const association = this;
    const sourceKey = association.source.primaryKeyAttribute;
    const targetKey = association.target.primaryKeyAttribute;
    const identifier = association.identifier;
    const foreignIdentifier = association.foreignIdentifier;
    const defaultAttributes = _.omit(options.through || {}, ['transaction', 'hooks', 'individualHooks', 'ignoreDuplicates', 'validate', 'fields', 'logging']);

    newInstances = association.toInstanceArray(newInstances);

    const where = {};
    where[identifier] = sourceInstance.get(sourceKey);
    where[foreignIdentifier] = newInstances.map(newInstance => newInstance.get(targetKey));

    _.assign(where, association.through.scope);

    return association.through.model.findAll(_.defaults({where, raw: true}, options)).then(currentRows => {
      const promises = [];
      const unassociatedObjects = [];
      const changedAssociations = [];
      for (const obj of newInstances) {
        const existingAssociation = _.find(currentRows, current => current[foreignIdentifier] === obj.get(targetKey));

        if (!existingAssociation) {
          unassociatedObjects.push(obj);
        } else {
          const throughAttributes = obj[association.through.model.name];
          const attributes = _.defaults({}, throughAttributes, defaultAttributes);

          if (_.some(Object.keys(attributes), attribute => attributes[attribute] !== existingAssociation[attribute])) {
            changedAssociations.push(obj);
          }
        }
      }

      if (unassociatedObjects.length > 0) {
        const bulk = unassociatedObjects.map(unassociatedObject => {
          const throughAttributes = unassociatedObject[association.through.model.name];
          const attributes = _.defaults({}, throughAttributes, defaultAttributes);

          attributes[identifier] = sourceInstance.get(sourceKey);
          attributes[foreignIdentifier] = unassociatedObject.get(targetKey);

          _.assign(attributes, association.through.scope);

          return attributes;
        });

        promises.push(association.through.model.bulkCreate(bulk, _.assign({ validate: true }, options)));
      }

      for (const assoc of changedAssociations) {
        let throughAttributes = assoc[association.through.model.name];
        const attributes = _.defaults({}, throughAttributes, defaultAttributes);
        const where = {};
        // Quick-fix for subtle bug when using existing objects that might have the through model attached (not as an attribute object)
        if (throughAttributes instanceof association.through.model) {
          throughAttributes = {};
        }

        where[identifier] = sourceInstance.get(sourceKey);
        where[foreignIdentifier] = assoc.get(targetKey);

        promises.push(association.through.model.update(attributes, _.extend(options, {where})));
      }

      return Utils.Promise.all(promises);
    });
  }

  /**
   * Un-associate one or more instance(s).
   *
   * @param {Model|String|Number} [oldAssociated] Can be an Instance or its primary key, or a mixed array of instances and primary keys
   * @param {Object} [options] Options passed to `through.destroy`
   * @return {Promise}
   */
  remove(sourceInstance, oldAssociatedObjects, options) {
    const association = this;

    options = options || {};

    oldAssociatedObjects = association.toInstanceArray(oldAssociatedObjects);

    const where = {};
    where[association.identifier] = sourceInstance.get(association.source.primaryKeyAttribute);
    where[association.foreignIdentifier] = oldAssociatedObjects.map(newInstance => newInstance.get(association.target.primaryKeyAttribute));

    return association.through.model.destroy(_.defaults({where}, options));
  }

  /**
   * Create a new instance of the associated model and associate it with this.
   *
   * @param {Object} [values]
   * @param {Object} [options] Options passed to create and add
   * @param {Object} [options.through] Additional attributes for the join table
   * @return {Promise}
   */
  create(sourceInstance, values, options) {
    const association = this;

    options = options || {};
    values = values || {};

    if (Array.isArray(options)) {
      options = {
        fields: options
      };
    }

    if (association.scope) {
      _.assign(values, association.scope);
      if (options.fields) {
        options.fields = options.fields.concat(Object.keys(association.scope));
      }
    }

    // Create the related model instance
    return association.target.create(values, options).then(newAssociatedObject =>
      sourceInstance[association.accessors.add](newAssociatedObject, _.omit(options, ['fields'])).return(newAssociatedObject)
    );
  }
}

module.exports = BelongsToMany;
module.exports.BelongsToMany = BelongsToMany;
module.exports.default = BelongsToMany;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class AbstractDialect {}

AbstractDialect.prototype.supports = {
  'DEFAULT': true,
  'DEFAULT VALUES': false,
  'VALUES ()': false,
  'LIMIT ON UPDATE': false,
  'ON DUPLICATE KEY': true,
  'ORDER NULLS': false,
  'UNION': true,
  'UNION ALL': true,
  /* What is the dialect's keyword for INSERT IGNORE */
  'IGNORE': '',

  /* does the dialect support returning values for inserted/updated fields */
  returnValues: false,

  /* features specific to autoIncrement values */
  autoIncrement: {
    /* does the dialect require modification of insert queries when inserting auto increment fields */
    identityInsert: false,

    /* does the dialect support inserting default/null values for autoincrement fields */
    defaultValue: true,

    /* does the dialect support updating autoincrement fields */
    update: true
  },
  /* Do we need to say DEFAULT for bulk insert */
  bulkDefault: false,
  /* The dialect's words for INSERT IGNORE */
  ignoreDuplicates: '',
  /* Does the dialect support ON DUPLICATE KEY UPDATE */
  updateOnDuplicate: false,
  schemas: false,
  transactions: true,
  transactionOptions: {
    type: false
  },
  migrations: true,
  upserts: true,
  constraints: {
    restrict: true,
    addConstraint: true,
    dropConstraint: true,
    unique: true,
    default: false,
    check: true,
    foreignKey: true,
    primaryKey: true
  },
  index: {
    collate: true,
    length: false,
    parser: false,
    concurrently: false,
    type: false,
    using: true
  },
  joinTableDependent: true,
  groupedLimit: true,
  indexViaAlter: false,
  JSON: false,
  deferrableConstraints: false
};

module.exports = AbstractDialect;
module.exports.AbstractDialect = AbstractDialect;
module.exports.default = AbstractDialect;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Pooling = __webpack_require__(82);
const Promise = __webpack_require__(4);
const _ = __webpack_require__(0);
const Utils = __webpack_require__(1);
const debug = Utils.getLogger().debugContext('pool');
const semver = __webpack_require__(14);
const timers = __webpack_require__(83);

const defaultPoolingConfig = {
  max: 5,
  min: 0,
  idle: 10000,
  acquire: 10000,
  evict: 60000,
  handleDisconnects: true
};

class ConnectionManager {
  constructor(dialect, sequelize) {
    const config = _.cloneDeep(sequelize.config);

    this.sequelize = sequelize;
    this.config = config;
    this.dialect = dialect;
    this.versionPromise = null;
    this.poolError = null;
    this.dialectName = this.sequelize.options.dialect;

    if (config.pool === false) {
      throw new Error('Support for pool:false was removed in v4.0');
    }

    config.pool =_.defaults(config.pool || {}, defaultPoolingConfig, {
      validate: this._validate.bind(this),
      Promise
    }) ;

    // Save a reference to the bound version so we can remove it with removeListener
    this.onProcessExit = this.onProcessExit.bind(this);

    process.on('exit', this.onProcessExit);

    this.initPools();
  }

  refreshTypeParser(dataTypes) {
    _.each(dataTypes, dataType => {
      if (dataType.hasOwnProperty('parse')) {
        if (dataType.types[this.dialectName]) {
          this._refreshTypeParser(dataType);
        } else {
          throw new Error('Parse function not supported for type ' + dataType.key + ' in dialect ' + this.dialectName);
        }
      }
    });
  }

  onProcessExit() {
    if (!this.pool) {
      return Promise.resolve();
    }

    return this.pool.drain().then(() => {
      debug('connection drain due to process exit');
      return this.pool.clear();
    });
  }

  close() {
    // Remove the listener, so all references to this instance can be garbage collected.
    process.removeListener('exit', this.onProcessExit);

    // Mark close of pool
    this.getConnection = function getConnection() {
      return Promise.reject(new Error('ConnectionManager.getConnection was called after the connection manager was closed!'));
    };

    return this.onProcessExit();
  }

  initPools() {
    const config = this.config;

    if (!config.replication) {
      this.pool = Pooling.createPool({
        create: () => new Promise(resolve => {
          this
            ._connect(config)
            .tap(() => {
              this.poolError = null;
            })
            .then(resolve)
            .catch(e => {
              // dont throw otherwise pool will release _dispense call
              // which will call _connect even if error is fatal
              // https://github.com/coopernurse/node-pool/issues/161
              this.poolError = e;
            });
        }),
        destroy: connection => {
          return this._disconnect(connection).tap(() => {
            debug('connection destroy');
          });
        },
        validate: config.pool.validate
      }, {
        Promise: config.pool.Promise,
        max: config.pool.max,
        min: config.pool.min,
        testOnBorrow: true,
        autostart: false,
        acquireTimeoutMillis: config.pool.acquire,
        idleTimeoutMillis: config.pool.idle,
        evictionRunIntervalMillis: config.pool.evict
      });

      this.pool.on('factoryCreateError', error => {
        this.poolError = error;
      });

      debug(`pool created max/min: ${config.pool.max}/${config.pool.min} with no replication`);
      return;
    }

    let reads = 0;

    if (!Array.isArray(config.replication.read)) {
      config.replication.read = [config.replication.read];
    }

    // Map main connection config
    config.replication.write = _.defaults(config.replication.write, _.omit(config, 'replication'));

    // Apply defaults to each read config
    config.replication.read = _.map(config.replication.read, readConfig =>
      _.defaults(readConfig, _.omit(this.config, 'replication'))
    );

    // custom pooling for replication (original author @janmeier)
    this.pool = {
      release: client => {
        if (client.queryType === 'read') {
          return this.pool.read.release(client);
        } else {
          return this.pool.write.release(client);
        }
      },
      acquire: (priority, queryType, useMaster) => {
        useMaster = _.isUndefined(useMaster) ? false : useMaster;
        if (queryType === 'SELECT' && !useMaster) {
          return this.pool.read.acquire(priority);
        } else {
          return this.pool.write.acquire(priority);
        }
      },
      destroy: connection => {
        debug('connection destroy');
        return this.pool[connection.queryType].destroy(connection);
      },
      clear: () => {
        debug('all connection clear');
        return Promise.join(
          this.pool.read.clear(),
          this.pool.write.clear()
        );
      },
      drain: () => {
        return Promise.join(
          this.pool.write.drain(),
          this.pool.read.drain()
        );
      },
      read: Pooling.createPool({
        create: () => {
          const nextRead = reads++ % config.replication.read.length; // round robin config
          return new Promise(resolve => {
            this
              ._connect(config.replication.read[nextRead])
              .tap(connection => {
                connection.queryType = 'read';
                this.poolError = null;
                resolve(connection);
              })
              .catch(e => {
                this.poolError = e;
              });
          });
        },
        destroy: connection => {
          return this._disconnect(connection);
        },
        validate: config.pool.validate
      }, {
        Promise: config.pool.Promise,
        max: config.pool.max,
        min: config.pool.min,
        testOnBorrow: true,
        autostart: false,
        acquireTimeoutMillis: config.pool.acquire,
        idleTimeoutMillis: config.pool.idle,
        evictionRunIntervalMillis: config.pool.evict
      }),
      write: Pooling.createPool({
        create: () => new Promise(resolve => {
          this
            ._connect(config.replication.write)
            .then(connection => {
              connection.queryType = 'write';
              this.poolError = null;
              return resolve(connection);
            })
            .catch(e => {
              this.poolError = e;
            });
        }),
        destroy: connection => {
          return this._disconnect(connection);
        },
        validate: config.pool.validate
      }, {
        Promise: config.pool.Promise,
        max: config.pool.max,
        min: config.pool.min,
        testOnBorrow: true,
        autostart: false,
        acquireTimeoutMillis: config.pool.acquire,
        idleTimeoutMillis: config.pool.idle,
        evictionRunIntervalMillis: config.pool.evict
      })
    };

    this.pool.read.on('factoryCreateError', error => {
      this.poolError = error;
    });

    this.pool.write.on('factoryCreateError', error => {
      this.poolError = error;
    });
  }

  getConnection(options) {
    options = options || {};

    let promise;
    if (this.sequelize.options.databaseVersion === 0) {
      if (this.versionPromise) {
        promise = this.versionPromise;
      } else {
        promise = this.versionPromise = this._connect(this.config.replication.write || this.config).then(connection => {
          const _options = {};
          _options.transaction = {connection}; // Cheat .query to use our private connection
          _options.logging = () => {};
          _options.logging.__testLoggingFn = true;

          return this.sequelize.databaseVersion(_options).then(version => {
            this.sequelize.options.databaseVersion = semver.valid(version) ? version : this.defaultVersion;
            this.versionPromise = null;

            return this._disconnect(connection);
          });
        }).catch(err => {
          this.versionPromise = null;
          throw err;
        });
      }
    } else {
      promise = Promise.resolve();
    }

    return promise.then(() => {
      return Promise.race([
        this.pool.acquire(options.priority, options.type, options.useMaster),
        new Promise((resolve, reject) =>
          timers.setTimeout(() => {
            if (this.poolError) {
              reject(this.poolError);
            }
          }, 0))
      ])
        .tap(() => { debug('connection acquired'); })
        .catch(e => {
          e = this.poolError || e;
          this.poolError = null;
          throw e;
        });
    });
  }

  releaseConnection(connection) {
    return this.pool.release(connection).tap(() => {
      debug('connection released');
    });
  }

  _connect(config) {
    return this.sequelize.runHooks('beforeConnect', config)
      .then(() => this.dialect.connectionManager.connect(config))
      .then(connection => this.sequelize.runHooks('afterConnect', connection, config).return(connection));
  }

  _disconnect(connection) {
    return this.dialect.connectionManager.disconnect(connection);
  }

  _validate(connection) {
    if (!this.dialect.connectionManager.validate) return true;
    return this.dialect.connectionManager.validate(connection);
  }
}

module.exports = ConnectionManager;
module.exports.ConnectionManager = ConnectionManager;
module.exports.default = ConnectionManager;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const stores = new Map();

module.exports = dialect => {

  if (!stores.has(dialect)) {
    stores.set(dialect, new Map());
  }

  return {
    clear() {
      stores.get(dialect).clear();
    },
    refresh(dataType) {
      for (const type of dataType.types[dialect]) {
        stores.get(dialect).set(type, dataType.parse);
      }
    },
    get(type) {
      return stores.get(dialect).get(type);
    }
  };
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const SqlString = __webpack_require__(29);
const Dot = __webpack_require__(32);
const QueryTypes = __webpack_require__(9);

class AbstractQuery {

  /**
   * rewrite query with parameters
   *
   * Examples:
   *
   *   query.formatBindParameters('select $1 as foo', ['fooval']);
   *
   *   query.formatBindParameters('select $foo as foo', { foo: 'fooval' });
   *
   * Options
   *   skipUnescape: bool, skip unescaping $$
   *   skipValueReplace: bool, do not replace (but do unescape $$). Check correct syntax and if all values are available
   * @private
   */
  static formatBindParameters(sql, values, dialect, replacementFunc, options) {
    if (!values) {
      return [sql, []];
    }

    options = options || {};
    if (typeof replacementFunc !== 'function') {
      options = replacementFunc || {};
      replacementFunc = undefined;
    }

    if (!replacementFunc) {
      if (options.skipValueReplace) {
        replacementFunc = (match, key, values) => {
          if (values[key] !== undefined) {
            return match;
          }
          return undefined;
        };
      } else {
        replacementFunc = (match, key, values, timeZone, dialect) => {
          if (values[key] !== undefined) {
            return SqlString.escape(values[key], false, timeZone, dialect);
          }
          return undefined;
        };
      }
    } else {
      if (options.skipValueReplace) {
        const origReplacementFunc = replacementFunc;
        replacementFunc = (match, key, values, timeZone, dialect, options) => {
          if (origReplacementFunc(match, key, values, timeZone, dialect, options) !== undefined) {
            return match;
          }
          return undefined;
        };
      }
    }

    const timeZone = null;
    const list = Array.isArray(values);

    sql = sql.replace(/\$(\$|\w+)/g, (match, key) => {
      if ('$' === key) {
        return options.skipUnescape ? match : key;
      }

      let replVal;
      if (list) {
        if (key.match(/^[1-9]\d*$/)) {
          key = key - 1;
          replVal = replacementFunc(match, key, values, timeZone, dialect, options);
        }
      } else {
        if (!key.match(/^\d*$/)) {
          replVal = replacementFunc(match, key, values, timeZone, dialect, options);
        }
      }
      if (replVal === undefined) {
        throw new Error('Named bind parameter "' + match + '" has no value in the given object.');
      }
      return replVal;
    });
    return [sql, []];
  }

  /**
   * Execute the passed sql query.
   *
   * Examples:
   *
   *     query.run('SELECT 1')
   *
   * @param {String} sql - The SQL query which should be executed.
   * @private
   */
  run() {
    throw new Error('The run method wasn\'t overwritten!');
  }

  /**
   * Check the logging option of the instance and print deprecation warnings.
   *
   * @return {void}
   * @private
   */
  checkLoggingOption() {
    if (this.options.logging === true) {
      Utils.deprecate('The logging-option should be either a function or false. Default: console.log');
      this.options.logging = console.log;
    }
  }

  /**
   * Get the attributes of an insert query, which contains the just inserted id.
   *
   * @return {String} The field name.
   * @private
   */
  getInsertIdField() {
    return 'insertId';
  }

  /**
   * Iterate over all known tables and search their names inside the sql query.
   * This method will also check association aliases ('as' option).
   *
   * @param  {String} attribute An attribute of a SQL query. (?)
   * @return {String}           The found tableName / alias.
   * @private
   */
  findTableNameInAttribute(attribute) {
    if (!this.options.include) {
      return null;
    }
    if (!this.options.includeNames) {
      this.options.includeNames = this.options.include.map(include => include.as);
    }

    const tableNames = this.options.includeNames.filter(include => attribute.indexOf(include + '.') === 0);

    if (tableNames.length === 1) {
      return tableNames[0];
    } else {
      return null;
    }
  }

  getUniqueConstraintErrorMessage(field) {
    let message = field + ' must be unique';

    if (this.model) {
      for (const key of Object.keys(this.model.uniqueKeys)) {
        if (this.model.uniqueKeys[key].fields.indexOf(field.replace(/"/g, '')) >= 0) {
          if (this.model.uniqueKeys[key].msg) {
            message = this.model.uniqueKeys[key].msg;
          }
        }
      }
    }
    return message;
  }

  isRawQuery() {
    return this.options.type === QueryTypes.RAW;
  }

  isVersionQuery() {
    return this.options.type === QueryTypes.VERSION;
  }

  isUpsertQuery() {
    return this.options.type === QueryTypes.UPSERT;
  }

  isInsertQuery(results, metaData) {
    let result = true;

    if (this.options.type === QueryTypes.INSERT) {
      return true;
    }

    // is insert query if sql contains insert into
    result = result && this.sql.toLowerCase().indexOf('insert into') === 0;

    // is insert query if no results are passed or if the result has the inserted id
    result = result && (!results || results.hasOwnProperty(this.getInsertIdField()));

    // is insert query if no metadata are passed or if the metadata has the inserted id
    result = result && (!metaData || metaData.hasOwnProperty(this.getInsertIdField()));

    return result;
  }

  handleInsertQuery(results, metaData) {
    if (this.instance) {
      // add the inserted row id to the instance
      const autoIncrementAttribute = this.model.autoIncrementAttribute;
      let id = null;

      id = id || results && results[this.getInsertIdField()];
      id = id || metaData && metaData[this.getInsertIdField()];

      this.instance[autoIncrementAttribute] = id;
    }
  }

  isShowTablesQuery() {
    return this.options.type === QueryTypes.SHOWTABLES;
  }

  handleShowTablesQuery(results) {
    return Utils._.flatten(results.map(resultSet => Utils._.values(resultSet)));
  }

  isShowIndexesQuery() {
    return this.options.type === QueryTypes.SHOWINDEXES;
  }

  isShowConstraintsQuery() {
    return this.options.type === QueryTypes.SHOWCONSTRAINTS;
  }

  isDescribeQuery() {
    return this.options.type === QueryTypes.DESCRIBE;
  }

  isSelectQuery() {
    return this.options.type === QueryTypes.SELECT;
  }

  isBulkUpdateQuery() {
    return this.options.type === QueryTypes.BULKUPDATE;
  }

  isBulkDeleteQuery() {
    return this.options.type === QueryTypes.BULKDELETE;
  }

  isForeignKeysQuery() {
    return this.options.type === QueryTypes.FOREIGNKEYS;
  }

  isUpdateQuery() {
    return this.options.type === QueryTypes.UPDATE;
  }

  handleSelectQuery(results) {
    let result = null;
    // Map raw fields to names if a mapping is provided
    if (this.options.fieldMap) {
      const fieldMap = this.options.fieldMap;
      results = Utils._.map(results, result => Utils._.reduce(fieldMap, (result, name, field) => {
        if (result[field] !== undefined) {
          result[name] = result[field];
          delete result[field];
        }
        return result;
      }, result));
    }
    // Raw queries
    if (this.options.raw) {
      result = results.map(result => {
        let o = {};

        for (const key in result) {
          if (result.hasOwnProperty(key)) {
            o[key] = result[key];
          }
        }

        if (this.options.nest) {
          o = Dot.transform(o);
        }

        return o;
      });
    // Queries with include
    } else if (this.options.hasJoin === true) {
      results = AbstractQuery._groupJoinData(results, {
        model: this.model,
        includeMap: this.options.includeMap,
        includeNames: this.options.includeNames
      }, {
        checkExisting: this.options.hasMultiAssociation
      });

      result = this.model.bulkBuild(results, {
        isNewRecord: false,
        include: this.options.include,
        includeNames: this.options.includeNames,
        includeMap: this.options.includeMap,
        includeValidated: true,
        attributes: this.options.originalAttributes || this.options.attributes,
        raw: true
      });
    // Regular queries
    } else {
      result = this.model.bulkBuild(results, {
        isNewRecord: false,
        raw: true,
        attributes: this.options.attributes
      });
    }

    // return the first real model instance if options.plain is set (e.g. Model.find)
    if (this.options.plain) {
      result = result.length === 0 ? null : result[0];
    }
    return result;
  }

  isShowOrDescribeQuery() {
    let result = false;

    result = result || this.sql.toLowerCase().indexOf('show') === 0;
    result = result || this.sql.toLowerCase().indexOf('describe') === 0;

    return result;
  }

  isCallQuery() {
    return this.sql.toLowerCase().indexOf('call') === 0;
  }

  /**
   * The function takes the result of the query execution and groups
   * the associated data by the callee.
   *
   * Example:
   *   groupJoinData([
   *     {
   *       some: 'data',
   *       id: 1,
   *       association: { foo: 'bar', id: 1 }
   *     }, {
   *       some: 'data',
   *       id: 1,
   *       association: { foo: 'bar', id: 2 }
   *     }, {
   *       some: 'data',
   *       id: 1,
   *       association: { foo: 'bar', id: 3 }
   *     }
   *   ])
   *
   * Result:
   *   Something like this:
   *
   *   [
   *     {
   *       some: 'data',
   *       id: 1,
   *       association: [
   *         { foo: 'bar', id: 1 },
   *         { foo: 'bar', id: 2 },
   *         { foo: 'bar', id: 3 }
   *       ]
   *     }
   *   ]
   * @private
   */
  static _groupJoinData(rows, includeOptions, options) {

    /*
     * Assumptions
     * ID is not necessarily the first field
     * All fields for a level is grouped in the same set (i.e. Panel.id, Task.id, Panel.title is not possible)
     * Parent keys will be seen before any include/child keys
     * Previous set won't necessarily be parent set (one parent could have two children, one child would then be previous set for the other)
     */

    /*
     * Author (MH) comment: This code is an unreadable mess, but its performant.
     * groupJoinData is a performance critical function so we prioritize perf over readability.
     */
    if (!rows.length) {
      return [];
    }

    // Generic looping
    let i;
    let length;
    let $i;
    let $length;
    // Row specific looping
    let rowsI;
    let row;
    const rowsLength = rows.length;
    // Key specific looping
    let keys;
    let key;
    let keyI;
    let keyLength;
    let prevKey;
    let values;
    let topValues;
    let topExists;
    const checkExisting = options.checkExisting;
    // If we don't have to deduplicate we can pre-allocate the resulting array
    let itemHash;
    let parentHash;
    let topHash;
    const results = checkExisting ? [] : new Array(rowsLength);
    const resultMap = {};
    const includeMap = {};
    // Result variables for the respective functions
    let $keyPrefix;
    let $keyPrefixString;
    let $prevKeyPrefixString; // eslint-disable-line
    let $prevKeyPrefix;
    let $lastKeyPrefix;
    let $current;
    let $parent;
    // Map each key to an include option
    let previousPiece;
    const buildIncludeMap = piece => {
      if ($current.includeMap[piece]) {
        includeMap[key] = $current = $current.includeMap[piece];
        if (previousPiece) {
          previousPiece = previousPiece+'.'+piece;
        } else {
          previousPiece = piece;
        }
        includeMap[previousPiece] = $current;
      }
    };
    // Calculate the string prefix of a key ('User.Results' for 'User.Results.id')
    const keyPrefixStringMemo = {};
    const keyPrefixString = (key, memo) => {
      if (!memo[key]) {
        memo[key] = key.substr(0, key.lastIndexOf('.'));
      }
      return memo[key];
    };
    // Removes the prefix from a key ('id' for 'User.Results.id')
    const removeKeyPrefixMemo = {};
    const removeKeyPrefix = key => {
      if (!removeKeyPrefixMemo[key]) {
        const index = key.lastIndexOf('.');
        removeKeyPrefixMemo[key] = key.substr(index === -1 ? 0 : index + 1);
      }
      return removeKeyPrefixMemo[key];
    };
    // Calculates the array prefix of a key (['User', 'Results'] for 'User.Results.id')
    const keyPrefixMemo = {};
    const keyPrefix = key => {
      // We use a double memo and keyPrefixString so that different keys with the same prefix will receive the same array instead of differnet arrays with equal values
      if (!keyPrefixMemo[key]) {
        const prefixString = keyPrefixString(key, keyPrefixStringMemo);
        if (!keyPrefixMemo[prefixString]) {
          keyPrefixMemo[prefixString] = prefixString ? prefixString.split('.') : [];
        }
        keyPrefixMemo[key] = keyPrefixMemo[prefixString];
      }
      return keyPrefixMemo[key];
    };
    // Calcuate the last item in the array prefix ('Results' for 'User.Results.id')
    const lastKeyPrefixMemo = {};
    const lastKeyPrefix = key => {
      if (!lastKeyPrefixMemo[key]) {
        const prefix = keyPrefix(key);
        const length = prefix.length;

        lastKeyPrefixMemo[key] = !length ? '' : prefix[length - 1];
      }
      return lastKeyPrefixMemo[key];
    };
    const getUniqueKeyAttributes = model => {
      let uniqueKeyAttributes = Utils._.chain(model.uniqueKeys);
      uniqueKeyAttributes = uniqueKeyAttributes
        .result(uniqueKeyAttributes.findKey() + '.fields')
        .map(field => Utils._.findKey(model.attributes, chr => chr.field === field))
        .value();

      return uniqueKeyAttributes;
    };
    let primaryKeyAttributes;
    let uniqueKeyAttributes;
    let prefix;

    for (rowsI = 0; rowsI < rowsLength; rowsI++) {
      row = rows[rowsI];

      // Keys are the same for all rows, so only need to compute them on the first row
      if (rowsI === 0) {
        keys = Object.keys(row);
        keyLength = keys.length;
      }

      if (checkExisting) {
        topExists = false;

        // Compute top level hash key (this is usually just the primary key values)
        $length = includeOptions.model.primaryKeyAttributes.length;
        topHash = '';
        if ($length === 1) {
          topHash = row[includeOptions.model.primaryKeyAttributes[0]];
        }
        else if ($length > 1) {
          for ($i = 0; $i < $length; $i++) {
            topHash += row[includeOptions.model.primaryKeyAttributes[$i]];
          }
        }
        else if (!Utils._.isEmpty(includeOptions.model.uniqueKeys)) {
          uniqueKeyAttributes = getUniqueKeyAttributes(includeOptions.model);
          for ($i = 0; $i < uniqueKeyAttributes.length; $i++) {
            topHash += row[uniqueKeyAttributes[$i]];
          }
        }
      }

      topValues = values = {};
      $prevKeyPrefix = undefined;
      for (keyI = 0; keyI < keyLength; keyI++) {
        key = keys[keyI];

        // The string prefix isn't actualy needed
        // We use it so keyPrefix for different keys will resolve to the same array if they have the same prefix
        // TODO: Find a better way?
        $keyPrefixString = keyPrefixString(key, keyPrefixStringMemo);
        $keyPrefix = keyPrefix(key);

        // On the first row we compute the includeMap
        if (rowsI === 0 && includeMap[key] === undefined) {
          if (!$keyPrefix.length) {
            includeMap[key] = includeMap[''] = includeOptions;
          } else {
            $current = includeOptions;
            previousPiece = undefined;
            $keyPrefix.forEach(buildIncludeMap);
          }
        }
        // End of key set
        if ($prevKeyPrefix !== undefined && $prevKeyPrefix !== $keyPrefix) {
          if (checkExisting) {
            // Compute hash key for this set instance
            // TODO: Optimize
            length = $prevKeyPrefix.length;
            $parent = null;
            parentHash = null;

            if (length) {
              for (i = 0; i < length; i++) {
                prefix = $parent ? $parent+'.'+$prevKeyPrefix[i] : $prevKeyPrefix[i];
                primaryKeyAttributes = includeMap[prefix].model.primaryKeyAttributes;
                $length = primaryKeyAttributes.length;
                itemHash = prefix;
                if ($length === 1) {
                  itemHash += row[prefix+'.'+primaryKeyAttributes[0]];
                }
                else if ($length > 1) {
                  for ($i = 0; $i < $length; $i++) {
                    itemHash += row[prefix+'.'+primaryKeyAttributes[$i]];
                  }
                }
                else if (!Utils._.isEmpty(includeMap[prefix].model.uniqueKeys)) {
                  uniqueKeyAttributes = getUniqueKeyAttributes(includeMap[prefix].model);
                  for ($i = 0; $i < uniqueKeyAttributes.length; $i++) {
                    itemHash += row[prefix+'.'+uniqueKeyAttributes[$i]];
                  }
                }
                if (!parentHash) {
                  parentHash = topHash;
                }

                itemHash = parentHash + itemHash;
                $parent = prefix;
                if (i < length - 1) {
                  parentHash = itemHash;
                }
              }
            } else {
              itemHash = topHash;
            }

            if (itemHash === topHash) {
              if (!resultMap[itemHash]) {
                resultMap[itemHash] = values;
              } else {
                topExists = true;
              }
            } else {
              if (!resultMap[itemHash]) {
                $parent = resultMap[parentHash];
                $lastKeyPrefix = lastKeyPrefix(prevKey);

                if (includeMap[prevKey].association.isSingleAssociation) {
                  if ($parent) {
                    $parent[$lastKeyPrefix] = resultMap[itemHash] = values;
                  }
                } else {
                  if (!$parent[$lastKeyPrefix]) {
                    $parent[$lastKeyPrefix] = [];
                  }
                  $parent[$lastKeyPrefix].push(resultMap[itemHash] = values);
                }
              }
            }

            // Reset values
            values = {};
          } else {
            // If checkExisting is false it's because there's only 1:1 associations in this query
            // However we still need to map onto the appropriate parent
            // For 1:1 we map forward, initializing the value object on the parent to be filled in the next iterations of the loop
            $current = topValues;
            length = $keyPrefix.length;
            if (length) {
              for (i = 0; i < length; i++) {
                if (i === length -1) {
                  values = $current[$keyPrefix[i]] = {};
                }
                $current = $current[$keyPrefix[i]];
              }
            }
          }
        }

        // End of iteration, set value and set prev values (for next iteration)
        values[removeKeyPrefix(key)] = row[key];
        prevKey = key;
        $prevKeyPrefix = $keyPrefix;
        $prevKeyPrefixString = $keyPrefixString;
      }

      if (checkExisting) {
        length = $prevKeyPrefix.length;
        $parent = null;
        parentHash = null;

        if (length) {
          for (i = 0; i < length; i++) {
            prefix = $parent ? $parent+'.'+$prevKeyPrefix[i] : $prevKeyPrefix[i];
            primaryKeyAttributes = includeMap[prefix].model.primaryKeyAttributes;
            $length = primaryKeyAttributes.length;
            itemHash = prefix;
            if ($length === 1) {
              itemHash += row[prefix+'.'+primaryKeyAttributes[0]];
            }
            else if ($length > 0) {
              for ($i = 0; $i < $length; $i++) {
                itemHash += row[prefix+'.'+primaryKeyAttributes[$i]];
              }
            }
            else if (!Utils._.isEmpty(includeMap[prefix].model.uniqueKeys)) {
              uniqueKeyAttributes = getUniqueKeyAttributes(includeMap[prefix].model);
              for ($i = 0; $i < uniqueKeyAttributes.length; $i++) {
                itemHash += row[prefix+'.'+uniqueKeyAttributes[$i]];
              }
            }
            if (!parentHash) {
              parentHash = topHash;
            }

            itemHash = parentHash + itemHash;
            $parent = prefix;
            if (i < length - 1) {
              parentHash = itemHash;
            }
          }
        } else {
          itemHash = topHash;
        }

        if (itemHash === topHash) {
          if (!resultMap[itemHash]) {
            resultMap[itemHash] = values;
          } else {
            topExists = true;
          }
        } else {
          if (!resultMap[itemHash]) {
            $parent = resultMap[parentHash];
            $lastKeyPrefix = lastKeyPrefix(prevKey);

            if (includeMap[prevKey].association.isSingleAssociation) {
              if ($parent) {
                $parent[$lastKeyPrefix] = resultMap[itemHash] = values;
              }
            } else {
              if (!$parent[$lastKeyPrefix]) {
                $parent[$lastKeyPrefix] = [];
              }
              $parent[$lastKeyPrefix].push(resultMap[itemHash] = values);
            }
          }
        }
        if (!topExists) {
          results.push(topValues);
        }
      } else {
        results[rowsI] = topValues;
      }
    }

    return results;
  }
}

module.exports = AbstractQuery;
module.exports.AbstractQuery = AbstractQuery;
module.exports.default = AbstractQuery;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const SqlString = __webpack_require__(29);
const Model = __webpack_require__(35);
const DataTypes = __webpack_require__(2);
const util = __webpack_require__(7);
const _ = __webpack_require__(0);
const Dottie = __webpack_require__(32);
const Association = __webpack_require__(8);
const BelongsTo = __webpack_require__(12);
const BelongsToMany = __webpack_require__(21);
const HasMany = __webpack_require__(13);
const uuid = __webpack_require__(30);
const semver = __webpack_require__(14);

const QueryGenerator = {
  options: {},

  extractTableDetails(tableName, options) {
    options = options || {};
    tableName = tableName || {};
    return {
      schema: tableName.schema || options.schema || 'public',
      tableName: _.isPlainObject(tableName) ? tableName.tableName : tableName,
      delimiter: tableName.delimiter || options.delimiter || '.'
    };
  },

  addSchema(param) {
    const self = this;

    if (!param._schema) return param.tableName || param;

    return {
      tableName: param.tableName || param,
      table: param.tableName || param,
      name: param.name || param,
      schema: param._schema,
      delimiter: param._schemaDelimiter || '.',
      toString() {
        return self.quoteTable(this);
      }
    };
  },

  dropSchema(tableName, options) {
    return this.dropTableQuery(tableName, options);
  },

  describeTableQuery(tableName, schema, schemaDelimiter) {
    const table = this.quoteTable(
      this.addSchema({
        tableName,
        _schema: schema,
        _schemaDelimiter: schemaDelimiter
      })
    );

    return 'DESCRIBE ' + table + ';';
  },

  dropTableQuery(tableName) {
    return `DROP TABLE IF EXISTS ${this.quoteTable(tableName)};`;
  },

  renameTableQuery(before, after) {
    return `ALTER TABLE ${this.quoteTable(before)} RENAME TO ${this.quoteTable(after)};`;
  },

  /*
    Returns an insert into command. Parameters: table name + hash of attribute-value-pairs.
   @private
  */
  insertQuery(table, valueHash, modelAttributes, options) {
    options = options || {};
    _.defaults(options, this.options);

    const modelAttributeMap = {};
    const fields = [];
    const values = [];
    let query;
    let valueQuery = '<%= tmpTable %>INSERT<%= ignoreDuplicates %> INTO <%= table %> (<%= attributes %>)<%= output %> VALUES (<%= values %>)';
    let emptyQuery = '<%= tmpTable %>INSERT<%= ignoreDuplicates %> INTO <%= table %><%= output %>';
    let outputFragment;
    let identityWrapperRequired = false;
    let tmpTable = '';         //tmpTable declaration for trigger

    if (modelAttributes) {
      _.each(modelAttributes, (attribute, key) => {
        modelAttributeMap[key] = attribute;
        if (attribute.field) {
          modelAttributeMap[attribute.field] = attribute;
        }
      });
    }

    if (this._dialect.supports['DEFAULT VALUES']) {
      emptyQuery += ' DEFAULT VALUES';
    } else if (this._dialect.supports['VALUES ()']) {
      emptyQuery += ' VALUES ()';
    }

    if (this._dialect.supports.returnValues && options.returning) {
      if (this._dialect.supports.returnValues.returning) {
        valueQuery += ' RETURNING *';
        emptyQuery += ' RETURNING *';
      } else if (this._dialect.supports.returnValues.output) {
        outputFragment = ' OUTPUT INSERTED.*';

        //To capture output rows when there is a trigger on MSSQL DB
        if (modelAttributes && options.hasTrigger && this._dialect.supports.tmpTableTrigger) {

          let tmpColumns = '';
          let outputColumns = '';
          tmpTable = 'declare @tmp table (<%= columns %>); ';

          for (const modelKey in modelAttributes) {
            const attribute = modelAttributes[modelKey];
            if (!(attribute.type instanceof DataTypes.VIRTUAL)) {
              if (tmpColumns.length > 0) {
                tmpColumns += ',';
                outputColumns += ',';
              }

              tmpColumns += this.quoteIdentifier(attribute.field) + ' ' + attribute.type.toSql();
              outputColumns += 'INSERTED.' + this.quoteIdentifier(attribute.field);
            }
          }

          const replacement = {
            columns: tmpColumns
          };

          tmpTable = _.template(tmpTable)(replacement).trim();
          outputFragment = ' OUTPUT ' + outputColumns + ' into @tmp';
          const selectFromTmp = ';select * from @tmp';

          valueQuery += selectFromTmp;
          emptyQuery += selectFromTmp;
        }
      }
    }

    if (this._dialect.supports.EXCEPTION && options.exception) {
      // Mostly for internal use, so we expect the user to know what he's doing!
      // pg_temp functions are private per connection, so we never risk this function interfering with another one.
      if (semver.gte(this.sequelize.options.databaseVersion, '9.2.0')) {
        // >= 9.2 - Use a UUID but prefix with 'func_' (numbers first not allowed)
        const delimiter = '$func_' + uuid.v4().replace(/-/g, '') + '$';

        options.exception = 'WHEN unique_violation THEN GET STACKED DIAGNOSTICS sequelize_caught_exception = PG_EXCEPTION_DETAIL;';
        valueQuery = 'CREATE OR REPLACE FUNCTION pg_temp.testfunc(OUT response <%= table %>, OUT sequelize_caught_exception text) RETURNS RECORD AS ' + delimiter +
          ' BEGIN ' + valueQuery + ' INTO response; EXCEPTION ' + options.exception + ' END ' + delimiter +
          ' LANGUAGE plpgsql; SELECT (testfunc.response).*, testfunc.sequelize_caught_exception FROM pg_temp.testfunc(); DROP FUNCTION IF EXISTS pg_temp.testfunc()';
      } else {
        options.exception = 'WHEN unique_violation THEN NULL;';
        valueQuery = 'CREATE OR REPLACE FUNCTION pg_temp.testfunc() RETURNS SETOF <%= table %> AS $body$ BEGIN RETURN QUERY ' + valueQuery + '; EXCEPTION ' + options.exception + ' END; $body$ LANGUAGE plpgsql; SELECT * FROM pg_temp.testfunc(); DROP FUNCTION IF EXISTS pg_temp.testfunc();';
      }
    }

    if (this._dialect.supports['ON DUPLICATE KEY'] && options.onDuplicate) {
      valueQuery += ' ON DUPLICATE KEY ' + options.onDuplicate;
      emptyQuery += ' ON DUPLICATE KEY ' + options.onDuplicate;
    }

    valueHash = Utils.removeNullValuesFromHash(valueHash, this.options.omitNull);
    for (const key in valueHash) {
      if (valueHash.hasOwnProperty(key)) {
        const value = valueHash[key];
        fields.push(this.quoteIdentifier(key));

        // SERIALS' can't be NULL in postgresql, use DEFAULT where supported
        if (modelAttributeMap && modelAttributeMap[key] && modelAttributeMap[key].autoIncrement === true && !value) {
          if (!this._dialect.supports.autoIncrement.defaultValue) {
            fields.splice(-1, 1);
          } else if (this._dialect.supports.DEFAULT) {
            values.push('DEFAULT');
          } else {
            values.push(this.escape(null));
          }
        } else {
          if (modelAttributeMap && modelAttributeMap[key] && modelAttributeMap[key].autoIncrement === true) {
            identityWrapperRequired = true;
          }

          values.push(this.escape(value, modelAttributeMap && modelAttributeMap[key] || undefined, { context: 'INSERT' }));
        }
      }
    }

    const replacements = {
      ignoreDuplicates: options.ignoreDuplicates ? this._dialect.supports.IGNORE : '',
      table: this.quoteTable(table),
      attributes: fields.join(','),
      output: outputFragment,
      values: values.join(','),
      tmpTable
    };

    query = (replacements.attributes.length ? valueQuery : emptyQuery) + ';';
    if (identityWrapperRequired && this._dialect.supports.autoIncrement.identityInsert) {
      query = [
        'SET IDENTITY_INSERT', this.quoteTable(table), 'ON;',
        query,
        'SET IDENTITY_INSERT', this.quoteTable(table), 'OFF;'
      ].join(' ');
    }

    return _.template(query)(replacements);
  },

  /*
    Returns an insert into command for multiple values.
    Parameters: table name + list of hashes of attribute-value-pairs.
   @private
  */
  bulkInsertQuery(tableName, attrValueHashes, options, rawAttributes) {
    options = options || {};
    rawAttributes = rawAttributes || {};

    const query = 'INSERT<%= ignoreDuplicates %> INTO <%= table %> (<%= attributes %>) VALUES <%= tuples %><%= onDuplicateKeyUpdate %><%= returning %>;';
    const tuples = [];
    const serials = {};
    const allAttributes = [];
    let onDuplicateKeyUpdate = '';

    for (const attrValueHash of attrValueHashes) {
      _.forOwn(attrValueHash, (value, key) => {
        if (allAttributes.indexOf(key) === -1) {
          allAttributes.push(key);
        }

        if (rawAttributes[key] && rawAttributes[key].autoIncrement === true) {
          serials[key] = true;
        }
      });
    }

    for (const attrValueHash of attrValueHashes) {
      tuples.push('(' + allAttributes.map(key => {
        if (this._dialect.supports.bulkDefault && serials[key] === true) {
          return attrValueHash[key] || 'DEFAULT';
        }
        return this.escape(attrValueHash[key], rawAttributes[key], { context: 'INSERT' });
      }).join(',') + ')');
    }

    if (this._dialect.supports.updateOnDuplicate && options.updateOnDuplicate) {
      onDuplicateKeyUpdate += ' ON DUPLICATE KEY UPDATE ' + options.updateOnDuplicate.map(attr => {
        const field = rawAttributes && rawAttributes[attr] && rawAttributes[attr].field || attr;
        const key = this.quoteIdentifier(field);
        return key + '=VALUES(' + key + ')';
      }).join(',');
    }

    const replacements = {
      ignoreDuplicates: options.ignoreDuplicates ? this._dialect.supports.ignoreDuplicates : '',
      table: this.quoteTable(tableName),
      attributes: allAttributes.map(attr => this.quoteIdentifier(attr)).join(','),
      tuples: tuples.join(','),
      onDuplicateKeyUpdate,
      returning: this._dialect.supports.returnValues && options.returning ? ' RETURNING *' : ''
    };

    return _.template(query)(replacements);
  },

  /*
    Returns an update query.
    Parameters:
      - tableName -> Name of the table
      - values -> A hash with attribute-value-pairs
      - where -> A hash with conditions (e.g. {name: 'foo'})
                 OR an ID as integer
                 OR a string with conditions (e.g. 'name="foo"').
                 If you use a string, you have to escape it on your own.
   @private
  */
  updateQuery(tableName, attrValueHash, where, options, attributes) {
    options = options || {};
    _.defaults(options, this.options);

    attrValueHash = Utils.removeNullValuesFromHash(attrValueHash, options.omitNull, options);

    const values = [];
    const modelAttributeMap = {};
    let query = '<%= tmpTable %>UPDATE <%= table %> SET <%= values %><%= output %> <%= where %>';
    let outputFragment;
    let tmpTable = '';        // tmpTable declaration for trigger
    let selectFromTmp = '';   // Select statement for trigger

    if (this._dialect.supports['LIMIT ON UPDATE'] && options.limit) {
      if (this.dialect !== 'mssql') {
        query += ' LIMIT ' + this.escape(options.limit) + ' ';
      }
    }

    if (this._dialect.supports.returnValues) {
      if (this._dialect.supports.returnValues.output) {
        // we always need this for mssql
        outputFragment = ' OUTPUT INSERTED.*';

        //To capture output rows when there is a trigger on MSSQL DB
        if (attributes && options.hasTrigger && this._dialect.supports.tmpTableTrigger) {
          tmpTable = 'declare @tmp table (<%= columns %>); ';
          let tmpColumns = '';
          let outputColumns = '';

          for (const modelKey in attributes) {
            const attribute = attributes[modelKey];
            if (!(attribute.type instanceof DataTypes.VIRTUAL)) {
              if (tmpColumns.length > 0) {
                tmpColumns += ',';
                outputColumns += ',';
              }

              tmpColumns += this.quoteIdentifier(attribute.field) + ' ' + attribute.type.toSql();
              outputColumns += 'INSERTED.' + this.quoteIdentifier(attribute.field);
            }
          }

          const replacement ={
            columns : tmpColumns
          };

          tmpTable = _.template(tmpTable)(replacement).trim();
          outputFragment = ' OUTPUT ' + outputColumns + ' into @tmp';
          selectFromTmp = ';select * from @tmp';

          query += selectFromTmp;
        }
      } else if (this._dialect.supports.returnValues && options.returning) {
        // ensure that the return output is properly mapped to model fields.
        options.mapToModel = true;
        query += ' RETURNING *';
      }
    }

    if (attributes) {
      _.each(attributes, (attribute, key) => {
        modelAttributeMap[key] = attribute;
        if (attribute.field) {
          modelAttributeMap[attribute.field] = attribute;
        }
      });
    }

    for (const key in attrValueHash) {
      if (modelAttributeMap && modelAttributeMap[key] &&
          modelAttributeMap[key].autoIncrement === true &&
          !this._dialect.supports.autoIncrement.update) {
        // not allowed to update identity column
        continue;
      }

      const value = attrValueHash[key];
      values.push(this.quoteIdentifier(key) + '=' + this.escape(value, modelAttributeMap && modelAttributeMap[key] || undefined, { context: 'UPDATE' }));
    }

    const replacements = {
      table: this.quoteTable(tableName),
      values: values.join(','),
      output: outputFragment,
      where: this.whereQuery(where, options),
      tmpTable
    };

    if (values.length === 0) {
      return '';
    }

    return _.template(query)(replacements).trim();
  },

  /*
    Returns an update query.
    Parameters:
      - operator -> String with the arithmetic operator (e.g. '+' or '-')
      - tableName -> Name of the table
      - values -> A hash with attribute-value-pairs
      - where -> A hash with conditions (e.g. {name: 'foo'})
                 OR an ID as integer
                 OR a string with conditions (e.g. 'name="foo"').
                 If you use a string, you have to escape it on your own.
   @private
  */
  arithmeticQuery(operator, tableName, attrValueHash, where, options, attributes) {
    attrValueHash = Utils.removeNullValuesFromHash(attrValueHash, this.options.omitNull);

    const values = [];
    let query = 'UPDATE <%= table %> SET <%= values %><%= output %> <%= where %>';
    let outputFragment;

    if (this._dialect.supports.returnValues) {
      if (this._dialect.supports.returnValues.returning) {
        options.mapToModel = true;
        query += ' RETURNING *';
      } else if (this._dialect.supports.returnValues.output) {
        outputFragment = ' OUTPUT INSERTED.*';
      }
    }

    for (const key in attrValueHash) {
      const value = attrValueHash[key];
      values.push(this.quoteIdentifier(key) + '=' + this.quoteIdentifier(key) + operator + this.escape(value));
    }

    attributes = attributes || {};
    for (const key in attributes) {
      const value = attributes[key];
      values.push(this.quoteIdentifier(key) + '=' + this.escape(value));
    }

    const replacements = {
      table: this.quoteTable(tableName),
      values: values.join(','),
      output: outputFragment,
      where: this.whereQuery(where)
    };

    return _.template(query)(replacements);
  },

  nameIndexes(indexes, rawTablename) {
    return _.map(indexes, index => {
      if (!index.hasOwnProperty('name')) {
        const onlyAttributeNames = index.fields.map(field => typeof field === 'string' ? field : field.name || field.attribute);
        index.name = Utils.underscore(rawTablename + '_' + onlyAttributeNames.join('_'));
      }

      return index;
    });
  },

  /*
    Returns an add index query.
    Parameters:
      - tableName -> Name of an existing table, possibly with schema.
      - options:
        - type: UNIQUE|FULLTEXT|SPATIAL
        - name: The name of the index. Default is <table>_<attr1>_<attr2>
        - fields: An array of attributes as string or as hash.
                  If the attribute is a hash, it must have the following content:
                  - name: The name of the attribute/column
                  - length: An integer. Optional
                  - order: 'ASC' or 'DESC'. Optional
        - parser
      - rawTablename, the name of the table, without schema. Used to create the name of the index
   @private
  */
  addIndexQuery(tableName, attributes, options, rawTablename) {
    options = options || {};

    if (!Array.isArray(attributes)) {
      options = attributes;
      attributes = undefined;
    } else {
      options.fields = attributes;
    }

    // Backwards compatability
    if (options.indexName) {
      options.name = options.indexName;
    }
    if (options.indicesType) {
      options.type = options.indicesType;
    }
    if (options.indexType || options.method) {
      options.using = options.indexType || options.method;
    }

    options.prefix = options.prefix || rawTablename || tableName;
    if (options.prefix && _.isString(options.prefix)) {
      options.prefix = options.prefix.replace(/\./g, '_');
      options.prefix = options.prefix.replace(/(\"|\')/g, '');
    }

    const fieldsSql = options.fields.map(field => {
      if (typeof field === 'string') {
        return this.quoteIdentifier(field);
      } else if (field instanceof Utils.SequelizeMethod) {
        return this.handleSequelizeMethod(field);
      } else {
        let result = '';

        if (field.attribute) {
          field.name = field.attribute;
        }

        if (!field.name) {
          throw new Error('The following index field has no name: ' + util.inspect(field));
        }

        result += this.quoteIdentifier(field.name);

        if (this._dialect.supports.index.collate && field.collate) {
          result += ' COLLATE ' + this.quoteIdentifier(field.collate);
        }

        if (this._dialect.supports.index.length && field.length) {
          result += '(' + field.length + ')';
        }

        if (field.order) {
          result += ' ' + field.order;
        }

        return result;
      }
    });

    if (!options.name) {
      // Mostly for cases where addIndex is called directly by the user without an options object (for example in migrations)
      // All calls that go through sequelize should already have a name
      options = this.nameIndexes([options], options.prefix)[0];
    }

    options = Model._conformIndex(options);

    if (!this._dialect.supports.index.type) {
      delete options.type;
    }

    if (options.where) {
      options.where = this.whereQuery(options.where);
    }

    if (_.isString(tableName)) {
      tableName = this.quoteIdentifiers(tableName);
    } else {
      tableName = this.quoteTable(tableName);
    }

    const concurrently = this._dialect.supports.index.concurrently && options.concurrently ? 'CONCURRENTLY' : undefined;
    let ind;
    if (this._dialect.supports.indexViaAlter) {
      ind = [
        'ALTER TABLE',
        tableName,
        concurrently,
        'ADD'
      ];
    } else {
      ind = ['CREATE'];
    }

    ind = ind.concat(
      options.unique ? 'UNIQUE' : '',
      options.type, 'INDEX',
      !this._dialect.supports.indexViaAlter ? concurrently : undefined,
      this.quoteIdentifiers(options.name),
      this._dialect.supports.index.using === 1 && options.using ? 'USING ' + options.using : '',
      !this._dialect.supports.indexViaAlter ? 'ON ' + tableName : undefined,
      this._dialect.supports.index.using === 2 && options.using ? 'USING ' + options.using : '',
      '(' + fieldsSql.join(', ') + (options.operator ? ' '+options.operator : '') + ')',
      this._dialect.supports.index.parser && options.parser ? 'WITH PARSER ' + options.parser : undefined,
      this._dialect.supports.index.where && options.where ? options.where : undefined
    );

    return _.compact(ind).join(' ');
  },

  addConstraintQuery(tableName, options) {
    options = options || {};
    const constraintSnippet = this.getConstraintSnippet(tableName, options);

    if (typeof tableName === 'string') {
      tableName = this.quoteIdentifiers(tableName);
    } else {
      tableName = this.quoteTable(tableName);
    }

    return `ALTER TABLE ${tableName} ADD ${constraintSnippet};`;
  },

  getConstraintSnippet(tableName, options) {
    let constraintSnippet, constraintName;

    const fieldsSql = options.fields.map(field => {
      if (typeof field === 'string') {
        return this.quoteIdentifier(field);
      } else if (field._isSequelizeMethod) {
        return this.handleSequelizeMethod(field);
      } else {
        let result = '';

        if (field.attribute) {
          field.name = field.attribute;
        }

        if (!field.name) {
          throw new Error('The following index field has no name: ' + field);
        }

        result += this.quoteIdentifier(field.name);
        return result;
      }
    });

    const fieldsSqlQuotedString = fieldsSql.join(', ');
    const fieldsSqlString = fieldsSql.join('_');

    switch (options.type.toUpperCase()) {
      case 'UNIQUE':
        constraintName = this.quoteIdentifier(options.name || `${tableName}_${fieldsSqlString}_uk`);
        constraintSnippet = `CONSTRAINT ${constraintName} UNIQUE (${fieldsSqlQuotedString})`;
        break;
      case 'CHECK':
        options.where = this.whereItemsQuery(options.where);
        constraintName = this.quoteIdentifier(options.name || `${tableName}_${fieldsSqlString}_ck`);
        constraintSnippet = `CONSTRAINT ${constraintName} CHECK (${options.where})`;
        break;
      case 'DEFAULT':
        if (options.defaultValue === undefined) {
          throw new Error('Default value must be specifed for DEFAULT CONSTRAINT');
        }

        if (this._dialect.name !== 'mssql') {
          throw new Error('Default constraints are supported only for MSSQL dialect.');
        }

        constraintName = this.quoteIdentifier(options.name || `${tableName}_${fieldsSqlString}_df`);
        constraintSnippet = `CONSTRAINT ${constraintName} DEFAULT (${this.escape(options.defaultValue)}) FOR ${fieldsSql[0]}`;
        break;
      case 'PRIMARY KEY':
        constraintName = this.quoteIdentifier(options.name || `${tableName}_${fieldsSqlString}_pk`);
        constraintSnippet = `CONSTRAINT ${constraintName} PRIMARY KEY (${fieldsSqlQuotedString})`;
        break;
      case 'FOREIGN KEY':
        const references = options.references;
        if (!references || !references.table || !references.field) {
          throw new Error('references object with table and field must be specified');
        }
        constraintName = this.quoteIdentifier(options.name || `${tableName}_${fieldsSqlString}_${references.table}_fk`);
        const referencesSnippet = `${this.quoteTable(references.table)} (${this.quoteIdentifier(references.field)})`;
        constraintSnippet = `CONSTRAINT ${constraintName} `;
        constraintSnippet += `FOREIGN KEY (${fieldsSqlQuotedString}) REFERENCES ${referencesSnippet}`;
        if (options.onUpdate) {
          constraintSnippet += ` ON UPDATE ${options.onUpdate.toUpperCase()}`;
        }
        if (options.onDelete) {
          constraintSnippet += ` ON DELETE ${options.onDelete.toUpperCase()}`;
        }
        break;
      default: throw new Error(`${options.type} is invalid.`);
    }
    return constraintSnippet;
  },

  removeConstraintQuery(tableName, constraintName) {
    return `ALTER TABLE ${this.quoteIdentifiers(tableName)} DROP CONSTRAINT ${this.quoteIdentifiers(constraintName)}`;
  },

  quoteTable(param, as) {
    let table = '';

    if (as === true) {
      as = param.as || param.name || param;
    }

    if (_.isObject(param)) {
      if (this._dialect.supports.schemas) {
        if (param.schema) {
          table += this.quoteIdentifier(param.schema) + '.';
        }

        table += this.quoteIdentifier(param.tableName);
      } else {
        if (param.schema) {
          table += param.schema + (param.delimiter || '.');
        }

        table += param.tableName;
        table = this.quoteIdentifier(table);
      }


    } else {
      table = this.quoteIdentifier(param);
    }

    if (as) {
      table += ' AS ' + this.quoteIdentifier(as);
    }
    return table;
  },

  /*
    Quote an object based on its type. This is a more general version of quoteIdentifiers
    Strings: should proxy to quoteIdentifiers
    Arrays:
      * Expects array in the form: [<model> (optional), <model> (optional),... String, String (optional)]
        Each <model> can be a model, or an object {model: Model, as: String}, matching include, or an
        association object, or the name of an association.
      * Zero or more models can be included in the array and are used to trace a path through the tree of
        included nested associations. This produces the correct table name for the ORDER BY/GROUP BY SQL
        and quotes it.
      * If a single string is appended to end of array, it is quoted.
        If two strings appended, the 1st string is quoted, the 2nd string unquoted.
    Objects:
      * If raw is set, that value should be returned verbatim, without quoting
      * If fn is set, the string should start with the value of fn, starting paren, followed by
        the values of cols (which is assumed to be an array), quoted and joined with ', ',
        unless they are themselves objects
      * If direction is set, should be prepended

    Currently this function is only used for ordering / grouping columns and Sequelize.col(), but it could
    potentially also be used for other places where we want to be able to call SQL functions (e.g. as default values)
   @private
  */
  quote(collection, parent, connector) {
    // init
    const validOrderOptions = [
      'ASC',
      'DESC',
      'ASC NULLS LAST',
      'DESC NULLS LAST',
      'ASC NULLS FIRST',
      'DESC NULLS FIRST',
      'NULLS FIRST',
      'NULLS LAST'
    ];

    // default
    connector = connector || '.';

    // just quote as identifiers if string
    if (typeof collection === 'string') {
      return this.quoteIdentifiers(collection);
    } else if (Array.isArray(collection)) {
      // iterate through the collection and mutate objects into associations
      collection.forEach((item, index) => {
        const previous = collection[index - 1];
        let previousAssociation;
        let previousModel;

        // set the previous as the parent when previous is undefined or the target of the association
        if (!previous && parent !== undefined) {
          previousModel = parent;
        } else if (previous && previous instanceof Association) {
          previousAssociation = previous;
          previousModel = previous.target;
        }

        // if the previous item is a model, then attempt getting an association
        if (previousModel && previousModel.prototype instanceof Model) {
          let model;
          let as;

          if (typeof item === 'function' && item.prototype instanceof Model) {
            // set
            model = item;
          } else if (_.isPlainObject(item) && item.model && item.model.prototype instanceof Model) {
            // set
            model = item.model;
            as = item.as;
          }

          if (model) {
            // set the as to either the through name or the model name
            if (!as && previousAssociation && previousAssociation instanceof Association && previousAssociation.through && previousAssociation.through.model === model) {
              // get from previous association
              item = new Association(previousModel, model, {
                as: model.name
              });
            } else {
              // get association from previous model
              item = previousModel.getAssociationForAlias(model, as);

              // attempt to use the model name if the item is still null
              if (!item) {
                item = previousModel.getAssociationForAlias(model, model.name);
              }
            }

            // make sure we have an association
            if (!(item instanceof Association)) {
              throw new Error(util.format('Unable to find a valid association for model, \'%s\'', model.name));
            }
          }
        }

        if (typeof item === 'string') {
          // get order index
          const orderIndex = validOrderOptions.indexOf(item.toUpperCase());

          // see if this is an order
          if (index > 0 && orderIndex !== -1) {
            item = this.sequelize.literal(' ' + validOrderOptions[orderIndex]);
          } else if (previousModel && previousModel.prototype instanceof Model) {
            // only go down this path if we have preivous model and check only once
            if (previousModel.associations !== undefined && previousModel.associations[item]) {
              // convert the item to an association
              item = previousModel.associations[item];
            } else if (previousModel.rawAttributes !== undefined && previousModel.rawAttributes[item] && item !== previousModel.rawAttributes[item].field) {
              // convert the item attribute from it's alias
              item = previousModel.rawAttributes[item].field;
            } else if (
              item.indexOf('.') !== -1
              && previousModel.rawAttributes !== undefined
            ) {
              const itemSplit = item.split('.');

              if (previousModel.rawAttributes[itemSplit[0]].type instanceof DataTypes.JSON) {
                // just quote identifiers for now
                const identifier = this.quoteIdentifiers(previousModel.name  + '.' + previousModel.rawAttributes[itemSplit[0]].field);

                // get path
                const path = itemSplit.slice(1);

                // extract path
                item = this.jsonPathExtractionQuery(identifier, path);

                // literal because we don't want to append the model name when string
                item = this.sequelize.literal(item);
              }
            }
          }
        }

        collection[index] = item;
      }, this);

      // loop through array, adding table names of models to quoted
      const collectionLength = collection.length;
      const tableNames = [];
      let item;
      let i = 0;

      for (i = 0; i < collectionLength - 1; i++) {
        item = collection[i];
        if (typeof item === 'string' || item._modelAttribute || item instanceof Utils.SequelizeMethod) {
          break;
        } else if (item instanceof Association) {
          tableNames[i] = item.as;
        }
      }

      // start building sql
      let sql = '';

      if (i > 0) {
        sql += this.quoteIdentifier(tableNames.join(connector)) + '.';
      } else if (typeof collection[0] === 'string' && parent) {
        sql += this.quoteIdentifier(parent.name) + '.';
      }

      // loop through everything past i and append to the sql
      collection.slice(i).forEach(collectionItem => {
        sql += this.quote(collectionItem, parent, connector);
      }, this);

      return sql;
    } else if (collection._modelAttribute) {
      return this.quoteTable(collection.Model.name) + '.' + this.quoteIdentifier(collection.fieldName);
    } else if (collection instanceof Utils.SequelizeMethod) {
      return this.handleSequelizeMethod(collection);
    } else if (_.isPlainObject(collection) && collection.raw) {
      // simple objects with raw is no longer supported
      throw new Error('The `{raw: "..."}` syntax is no longer supported.  Use `sequelize.literal` instead.');
    } else {
      throw new Error('Unknown structure passed to order / group: ' + util.inspect(collection));
    }
  },

  /*
    Split an identifier into .-separated tokens and quote each part
   @private
  */
  quoteIdentifiers(identifiers) {
    if (identifiers.indexOf('.') !== -1) {
      identifiers = identifiers.split('.');
      return this.quoteIdentifier(identifiers.slice(0, identifiers.length - 1).join('.')) + '.' + this.quoteIdentifier(identifiers[identifiers.length - 1]);
    } else {
      return this.quoteIdentifier(identifiers);
    }
  },

  /*
    Escape a value (e.g. a string, number or date)
   @private
  */
  escape(value, field, options) {
    options = options || {};

    if (value !== null && value !== undefined) {
      if (value instanceof Utils.SequelizeMethod) {
        return this.handleSequelizeMethod(value);
      } else {
        if (field && field.type) {
          if (this.typeValidation && field.type.validate && value) {
            if (options.isList && Array.isArray(value)) {
              for (const item of value) {
                field.type.validate(item, options);
              }
            } else {
              field.type.validate(value, options);
            }
          }

          if (field.type.stringify) {
            // Users shouldn't have to worry about these args - just give them a function that takes a single arg
            const simpleEscape = _.partialRight(SqlString.escape, this.options.timezone, this.dialect);

            value = field.type.stringify(value, { escape: simpleEscape, field, timezone: this.options.timezone });

            if (field.type.escape === false) {
              // The data-type already did the required escaping
              return value;
            }
          }
        }
      }
    }

    return SqlString.escape(value, this.options.timezone, this.dialect);
  },

  /*
    Returns a query for selecting elements in the table <tableName>.
    Options:
      - attributes -> An array of attributes (e.g. ['name', 'birthday']). Default: *
      - where -> A hash with conditions (e.g. {name: 'foo'})
                 OR an ID as integer
                 OR a string with conditions (e.g. 'name="foo"').
                 If you use a string, you have to escape it on your own.
      - order -> e.g. 'id DESC'
      - group
      - limit -> The maximum count you want to get.
      - offset -> An offset value to start from. Only useable with limit!
   @private
  */
  selectQuery(tableName, options, model) {
    options = options || {};
    const limit = options.limit;
    const mainQueryItems = [];
    const subQueryItems = [];
    const subQuery = options.subQuery === undefined ? limit && options.hasMultiAssociation : options.subQuery;
    const attributes = {
      main: options.attributes && options.attributes.slice(),
      subQuery: null
    };
    const mainTable = {
      name: tableName,
      quotedName: null,
      as: null,
      model
    };
    const topLevelInfo = {
      names: mainTable,
      options,
      subQuery
    };
    let mainJoinQueries = [];
    let subJoinQueries = [];
    let query;

    // resolve table name options
    if (options.tableAs) {
      mainTable.as = this.quoteIdentifier(options.tableAs);
    } else if (!Array.isArray(mainTable.name) && mainTable.model) {
      mainTable.as = this.quoteIdentifier(mainTable.model.name);
    }

    mainTable.quotedName = !Array.isArray(mainTable.name) ? this.quoteTable(mainTable.name) : tableName.map(t => {
      return Array.isArray(t) ? this.quoteTable(t[0], t[1]) : this.quoteTable(t, true);
    }).join(', ');

    if (subQuery && attributes.main) {
      for (const keyAtt of mainTable.model.primaryKeyAttributes) {
        // Check if mainAttributes contain the primary key of the model either as a field or an aliased field
        if (!_.find(attributes.main, attr => keyAtt === attr || keyAtt === attr[0] || keyAtt === attr[1])) {
          attributes.main.push(mainTable.model.rawAttributes[keyAtt].field ? [keyAtt, mainTable.model.rawAttributes[keyAtt].field] : keyAtt);
        }
      }
    }

    attributes.main = this.escapeAttributes(attributes.main, options, mainTable.as);
    attributes.main = attributes.main || (options.include ? [`${mainTable.as}.*`] : ['*']);

    // If subquery, we ad the mainAttributes to the subQuery and set the mainAttributes to select * from subquery
    if (subQuery || options.groupedLimit) {
      // We need primary keys
      attributes.subQuery = attributes.main;
      attributes.main = [(mainTable.as || mainTable.quotedName) + '.*'];
    }

    if (options.include) {
      for (const include of options.include) {
        if (include.separate) {
          continue;
        }
        const joinQueries = this.generateInclude(include, { externalAs: mainTable.as, internalAs: mainTable.as }, topLevelInfo);

        subJoinQueries = subJoinQueries.concat(joinQueries.subQuery);
        mainJoinQueries = mainJoinQueries.concat(joinQueries.mainQuery);

        if (joinQueries.attributes.main.length > 0) {
          attributes.main = attributes.main.concat(joinQueries.attributes.main);
        }
        if (joinQueries.attributes.subQuery.length > 0) {
          attributes.subQuery = attributes.subQuery.concat(joinQueries.attributes.subQuery);
        }
      }
    }

    if (subQuery) {
      subQueryItems.push(this.selectFromTableFragment(options, mainTable.model, attributes.subQuery, mainTable.quotedName, mainTable.as));
      subQueryItems.push(subJoinQueries.join(''));
    } else {
      if (options.groupedLimit) {
        if (!mainTable.as) {
          mainTable.as = mainTable.quotedName;
        }
        const where = Object.assign({}, options.where);
        let groupedLimitOrder,
          whereKey,
          include,
          groupedTableName = mainTable.as;

        if (typeof options.groupedLimit.on === 'string') {
          whereKey = options.groupedLimit.on;
        } else if (options.groupedLimit.on instanceof HasMany) {
          whereKey = options.groupedLimit.on.foreignKeyField;
        }

        if (options.groupedLimit.on instanceof BelongsToMany) {
          // BTM includes needs to join the through table on to check ID
          groupedTableName = options.groupedLimit.on.manyFromSource.as;
          const groupedLimitOptions = Model._validateIncludedElements({
            include: [{
              association: options.groupedLimit.on.manyFromSource,
              duplicating: false, // The UNION'ed query may contain duplicates, but each sub-query cannot
              required: true,
              where: Object.assign({
                '$$PLACEHOLDER$$': true
              }, options.groupedLimit.through && options.groupedLimit.through.where)
            }],
            model
          });

          // Make sure attributes from the join table are mapped back to models
          options.hasJoin = true;
          options.hasMultiAssociation = true;
          options.includeMap = Object.assign(groupedLimitOptions.includeMap, options.includeMap);
          options.includeNames = groupedLimitOptions.includeNames.concat(options.includeNames || []);
          include = groupedLimitOptions.include;

          if (Array.isArray(options.order)) {
            // We need to make sure the order by attributes are available to the parent query
            options.order.forEach((order, i) => {
              if (Array.isArray(order)) {
                order = order[0];
              }

              let alias = `subquery_order_${i}`;
              options.attributes.push([order, alias]);

              // We don't want to prepend model name when we alias the attributes, so quote them here
              alias = this.sequelize.literal(this.quote(alias));

              if (Array.isArray(options.order[i])) {
                options.order[i][0] = alias;
              } else {
                options.order[i] = alias;
              }
            });
            groupedLimitOrder = options.order;
          }
        } else {
          // Ordering is handled by the subqueries, so ordering the UNION'ed result is not needed
          groupedLimitOrder = options.order;
          delete options.order;
          where.$$PLACEHOLDER$$ = true;
        }

        // Caching the base query and splicing the where part into it is consistently > twice
        // as fast than generating from scratch each time for values.length >= 5
        const baseQuery = '(' + this.selectQuery(
          tableName,
          {
            attributes: options.attributes,
            limit: options.groupedLimit.limit,
            order: groupedLimitOrder,
            where,
            include,
            model
          },
          model
        ).replace(/;$/, '') + ')';
        const placeHolder = this.whereItemQuery('$$PLACEHOLDER$$', true, { model });
        const splicePos = baseQuery.indexOf(placeHolder);

        mainQueryItems.push(this.selectFromTableFragment(options, mainTable.model, attributes.main, '(' +
          options.groupedLimit.values.map(value => {
            let groupWhere;
            if (whereKey) {
              groupWhere = {
                [whereKey]: value
              };
            }
            if (include) {
              groupWhere = {
                [options.groupedLimit.on.foreignIdentifierField]: value
              };
            }

            return Utils.spliceStr(baseQuery, splicePos, placeHolder.length, this.getWhereConditions(groupWhere, groupedTableName));
          }).join(
            this._dialect.supports['UNION ALL'] ? ' UNION ALL ' : ' UNION '
          )
          + ')', mainTable.as));
      } else {
        mainQueryItems.push(this.selectFromTableFragment(options, mainTable.model, attributes.main, mainTable.quotedName, mainTable.as));
      }

      mainQueryItems.push(mainJoinQueries.join(''));
    }

    // Add WHERE to sub or main query
    if (options.hasOwnProperty('where') && !options.groupedLimit) {
      options.where = this.getWhereConditions(options.where, mainTable.as || tableName, model, options);
      if (options.where) {
        if (subQuery) {
          subQueryItems.push(' WHERE ' + options.where);
        } else {
          mainQueryItems.push(' WHERE ' + options.where);
          // Walk the main query to update all selects
          _.each(mainQueryItems, (value, key) => {
            if (value.match(/^SELECT/)) {
              mainQueryItems[key] = this.selectFromTableFragment(options, model, attributes.main, mainTable.quotedName, mainTable.as, options.where);
            }
          });
        }
      }
    }

    // Add GROUP BY to sub or main query
    if (options.group) {
      options.group = Array.isArray(options.group) ? options.group.map(t => this.quote(t, model)).join(', ') : options.group;
      if (subQuery) {
        subQueryItems.push(' GROUP BY ' + options.group);
      } else {
        mainQueryItems.push(' GROUP BY ' + options.group);
      }
    }

    // Add HAVING to sub or main query
    if (options.hasOwnProperty('having')) {
      options.having = this.getWhereConditions(options.having, tableName, model, options, false);
      if (subQuery) {
        subQueryItems.push(' HAVING ' + options.having);
      } else {
        mainQueryItems.push(' HAVING ' + options.having);
      }
    }

    // Add ORDER to sub or main query
    if (options.order) {
      const orders = this.getQueryOrders(options, model, subQuery);
      if (orders.mainQueryOrder.length) {
        mainQueryItems.push(' ORDER BY ' + orders.mainQueryOrder.join(', '));
      }
      if (orders.subQueryOrder.length) {
        subQueryItems.push(' ORDER BY ' + orders.subQueryOrder.join(', '));
      }
    }

    // Add LIMIT, OFFSET to sub or main query
    const limitOrder = this.addLimitAndOffset(options, mainTable.model);
    if (limitOrder && !options.groupedLimit) {
      if (subQuery) {
        subQueryItems.push(limitOrder);
      } else {
        mainQueryItems.push(limitOrder);
      }
    }

    if (subQuery) {
      query = `SELECT ${attributes.main.join(', ')} FROM (${subQueryItems.join('')}) AS ${mainTable.as}${mainJoinQueries.join('')}${mainQueryItems.join('')}`;
    } else {
      query = mainQueryItems.join('');
    }

    if (options.lock && this._dialect.supports.lock) {
      let lock = options.lock;
      if (typeof options.lock === 'object') {
        lock = options.lock.level;
      }
      if (this._dialect.supports.lockKey && (lock === 'KEY SHARE' || lock === 'NO KEY UPDATE')) {
        query += ' FOR ' + lock;
      } else if (lock === 'SHARE') {
        query += ' ' + this._dialect.supports.forShare;
      } else {
        query += ' FOR UPDATE';
      }
      if (this._dialect.supports.lockOf && options.lock.of && options.lock.of.prototype instanceof Model) {
        query += ' OF ' + this.quoteTable(options.lock.of.name);
      }
    }

    return `${query};`;
  },

  escapeAttributes(attributes, options, mainTableAs) {
    return attributes && attributes.map(attr => {
      let addTable = true;

      if (attr instanceof Utils.SequelizeMethod) {
        return this.handleSequelizeMethod(attr);
      }
      if (Array.isArray(attr)) {
        if (attr.length !== 2) {
          throw new Error(JSON.stringify(attr) + ' is not a valid attribute definition. Please use the following format: [\'attribute definition\', \'alias\']');
        }
        attr = attr.slice();

        if (attr[0] instanceof Utils.SequelizeMethod) {
          attr[0] = this.handleSequelizeMethod(attr[0]);
          addTable = false;
        } else if (attr[0].indexOf('(') === -1 && attr[0].indexOf(')') === -1) {
          attr[0] = this.quoteIdentifier(attr[0]);
        }
        attr = [attr[0], this.quoteIdentifier(attr[1])].join(' AS ');
      } else {
        attr = attr.indexOf(Utils.TICK_CHAR) < 0 && attr.indexOf('"') < 0 ? this.quoteIdentifiers(attr) : attr;
      }
      if (options.include && attr.indexOf('.') === -1 && addTable) {
        attr = mainTableAs + '.' + attr;
      }

      return attr;
    });
  },

  generateInclude(include, parentTableName, topLevelInfo) {
    const association = include.association;
    const joinQueries = {
      mainQuery: [],
      subQuery: []
    };
    const mainChildIncludes = [];
    const subChildIncludes = [];
    let requiredMismatch = false;
    const includeAs = {
      internalAs: include.as,
      externalAs: include.as
    };
    const attributes = {
      main: [],
      subQuery: []
    };
    let joinQuery;

    topLevelInfo.options.keysEscaped = true;

    if (topLevelInfo.names.name !== parentTableName.externalAs && topLevelInfo.names.as !== parentTableName.externalAs) {
      includeAs.internalAs = `${parentTableName.internalAs}->${include.as}`;
      includeAs.externalAs = `${parentTableName.externalAs}.${include.as}`;
    }

    // includeIgnoreAttributes is used by aggregate functions
    if (topLevelInfo.options.includeIgnoreAttributes !== false) {
      const includeAttributes = include.attributes.map(attr => {
        let attrAs = attr;
        let verbatim = false;

        if (Array.isArray(attr) && attr.length === 2) {
          if (attr[0] instanceof Utils.SequelizeMethod && (
            attr[0] instanceof Utils.Literal ||
            attr[0] instanceof Utils.Cast ||
            attr[0] instanceof Utils.Fn
          )) {
            verbatim = true;
          }

          attr = attr.map(attr => attr instanceof Utils.SequelizeMethod ? this.handleSequelizeMethod(attr) : attr);

          attrAs = attr[1];
          attr = attr[0];
        } else if (attr instanceof Utils.Literal) {
          return attr.val; // We trust the user to rename the field correctly
        } else if (attr instanceof Utils.Cast || attr instanceof Utils.Fn) {
          throw new Error(
            'Tried to select attributes using Sequelize.cast or Sequelize.fn without specifying an alias for the result, during eager loading. ' +
            'This means the attribute will not be added to the returned instance'
          );
        }

        let prefix;
        if (verbatim === true) {
          prefix = attr;
        } else {
          prefix = `${this.quoteIdentifier(includeAs.internalAs)}.${this.quoteIdentifier(attr)}`;
        }
        return `${prefix} AS ${this.quoteIdentifier(`${includeAs.externalAs}.${attrAs}`, true)}`;
      });
      if (include.subQuery && topLevelInfo.subQuery) {
        for (const attr of includeAttributes) {
          attributes.subQuery.push(attr);
        }
      } else {
        for (const attr of includeAttributes) {
          attributes.main.push(attr);
        }
      }
    }

    //through
    if (include.through) {
      joinQuery = this.generateThroughJoin(include, includeAs, parentTableName.internalAs, topLevelInfo);
    } else {
      if (topLevelInfo.subQuery && include.subQueryFilter) {
        const associationWhere = {};

        associationWhere[association.identifierField] = {
          $eq: this.sequelize.literal(`${this.quoteTable(parentTableName.internalAs)}.${this.quoteIdentifier(association.sourceKeyField || association.source.primaryKeyField)}`)
        };

        if (!topLevelInfo.options.where) {
          topLevelInfo.options.where = {};
        }

        // Creating the as-is where for the subQuery, checks that the required association exists
        const $query = this.selectQuery(include.model.getTableName(), {
          attributes: [association.identifierField],
          where: {
            $and: [
              associationWhere,
              include.where || {}
            ]
          },
          limit: 1,
          tableAs: include.as
        }, include.model);

        const subQueryWhere = this.sequelize.asIs([
          '(',
          $query.replace(/\;$/, ''),
          ')',
          'IS NOT NULL'
        ].join(' '));

        if (_.isPlainObject(topLevelInfo.options.where)) {
          topLevelInfo.options.where['__' + includeAs.internalAs] = subQueryWhere;
        } else {
          topLevelInfo.options.where = { $and: [topLevelInfo.options.where, subQueryWhere] };
        }
      }
      joinQuery = this.generateJoin(include, topLevelInfo);
    }

    // handle possible new attributes created in join
    if (joinQuery.attributes.main.length > 0) {
      attributes.main = attributes.main.concat(joinQuery.attributes.main);
    }

    if (joinQuery.attributes.subQuery.length > 0) {
      attributes.subQuery = attributes.subQuery.concat(joinQuery.attributes.subQuery);
    }

    if (include.include) {
      for (const childInclude of include.include) {
        if (childInclude.separate || childInclude._pseudo) {
          continue;
        }

        const childJoinQueries = this.generateInclude(childInclude, includeAs, topLevelInfo);

        if (include.required === false && childInclude.required === true) {
          requiredMismatch = true;
        }
        // if the child is a sub query we just give it to the
        if (childInclude.subQuery && topLevelInfo.subQuery) {
          subChildIncludes.push(childJoinQueries.subQuery);
        }
        if (childJoinQueries.mainQuery) {
          mainChildIncludes.push(childJoinQueries.mainQuery);
        }
        if (childJoinQueries.attributes.main.length > 0) {
          attributes.main = attributes.main.concat(childJoinQueries.attributes.main);
        }
        if (childJoinQueries.attributes.subQuery.length > 0) {
          attributes.subQuery = attributes.subQuery.concat(childJoinQueries.attributes.subQuery);
        }
      }
    }

    if (include.subQuery && topLevelInfo.subQuery) {
      if (requiredMismatch && subChildIncludes.length > 0) {
        joinQueries.subQuery.push(` ${joinQuery.join} ( ${joinQuery.body}${subChildIncludes.join('')} ) ON ${joinQuery.condition}`);
      } else {
        joinQueries.subQuery.push(` ${joinQuery.join} ${joinQuery.body} ON ${joinQuery.condition}`);
        if (subChildIncludes.length > 0) {
          joinQueries.subQuery.push(subChildIncludes.join(''));
        }
      }
      joinQueries.mainQuery.push(mainChildIncludes.join(''));
    } else {
      if (requiredMismatch && mainChildIncludes.length > 0) {
        joinQueries.mainQuery.push(` ${joinQuery.join} ( ${joinQuery.body}${mainChildIncludes.join('')} ) ON ${joinQuery.condition}`);
      } else {
        joinQueries.mainQuery.push(` ${joinQuery.join} ${joinQuery.body} ON ${joinQuery.condition}`);
        if (mainChildIncludes.length > 0) {
          joinQueries.mainQuery.push(mainChildIncludes.join(''));
        }
      }
      joinQueries.subQuery.push(subChildIncludes.join(''));
    }

    return {
      mainQuery: joinQueries.mainQuery.join(''),
      subQuery: joinQueries.subQuery.join(''),
      attributes
    };
  },

  generateJoin(include, topLevelInfo) {
    const association = include.association;
    const parent = include.parent;
    const parentIsTop = !!parent && !include.parent.association && include.parent.model.name === topLevelInfo.options.model.name;
    let $parent;
    let joinWhere;
    /* Attributes for the left side */
    const left = association.source;
    const attrLeft = association instanceof BelongsTo ?
      association.identifier :
      association.sourceKeyAttribute || left.primaryKeyAttribute;
    const fieldLeft = association instanceof BelongsTo ?
      association.identifierField :
      left.rawAttributes[association.sourceKeyAttribute || left.primaryKeyAttribute].field;
    let asLeft;
    /* Attributes for the right side */
    const right = include.model;
    const tableRight = right.getTableName();
    const fieldRight = association instanceof BelongsTo ?
      right.rawAttributes[association.targetIdentifier || right.primaryKeyAttribute].field :
      association.identifierField;
    let asRight = include.as;

    while (($parent = $parent && $parent.parent || include.parent) && $parent.association) {
      if (asLeft) {
        asLeft = `${$parent.as}->${asLeft}`;
      } else {
        asLeft = $parent.as;
      }
    }

    if (!asLeft) asLeft = parent.as || parent.model.name;
    else asRight = `${asLeft}->${asRight}`;

    let joinOn = `${this.quoteTable(asLeft)}.${this.quoteIdentifier(fieldLeft)}`;

    if (topLevelInfo.options.groupedLimit && parentIsTop || topLevelInfo.subQuery && include.parent.subQuery && !include.subQuery) {
      if (parentIsTop) {
        // The main model attributes is not aliased to a prefix
        joinOn = `${this.quoteTable(parent.as || parent.model.name)}.${this.quoteIdentifier(attrLeft)}`;
      } else {
        joinOn = this.quoteIdentifier(`${asLeft.replace(/->/g, '.')}.${attrLeft}`);
      }
    }

    joinOn += ` = ${this.quoteIdentifier(asRight)}.${this.quoteIdentifier(fieldRight)}`;

    if (include.on) {
      joinOn = this.whereItemsQuery(include.on, {
        prefix: this.sequelize.literal(this.quoteIdentifier(asRight)),
        model: include.model
      });
    }

    if (include.where) {
      joinWhere = this.whereItemsQuery(include.where, {
        prefix: this.sequelize.literal(this.quoteIdentifier(asRight)),
        model: include.model
      });
      if (joinWhere) {
        if (include.or) {
          joinOn += ` OR ${joinWhere}`;
        } else {
          joinOn += ` AND ${joinWhere}`;
        }
      }
    }

    return {
      join: include.required ? 'INNER JOIN' : 'LEFT OUTER JOIN',
      body: this.quoteTable(tableRight, asRight),
      condition: joinOn,
      attributes: {
        main: [],
        subQuery: []
      }
    };
  },

  generateThroughJoin(include, includeAs, parentTableName, topLevelInfo) {
    const through = include.through;
    const throughTable = through.model.getTableName();
    const throughAs = `${includeAs.internalAs}->${through.as}`;
    const externalThroughAs = `${includeAs.externalAs}.${through.as}`;
    const throughAttributes = through.attributes.map(attr =>
      this.quoteIdentifier(throughAs) + '.' + this.quoteIdentifier(Array.isArray(attr) ? attr[0] : attr)
      + ' AS '
      + this.quoteIdentifier(externalThroughAs + '.' + (Array.isArray(attr) ? attr[1] : attr))
    );
    const association = include.association;
    const parentIsTop = !include.parent.association && include.parent.model.name === topLevelInfo.options.model.name;
    const primaryKeysSource = association.source.primaryKeyAttributes;
    const tableSource = parentTableName;
    const identSource = association.identifierField;
    const primaryKeysTarget = association.target.primaryKeyAttributes;
    const tableTarget = includeAs.internalAs;
    const identTarget = association.foreignIdentifierField;
    const attrTarget = association.target.rawAttributes[primaryKeysTarget[0]].field || primaryKeysTarget[0];

    const joinType = include.required ? 'INNER JOIN' : 'LEFT OUTER JOIN';
    let joinBody;
    let joinCondition;
    const attributes = {
      main: [],
      subQuery: []
    };
    let attrSource = primaryKeysSource[0];
    let sourceJoinOn;
    let targetJoinOn;
    let throughWhere;
    let targetWhere;

    if (topLevelInfo.options.includeIgnoreAttributes !== false) {
      // Through includes are always hasMany, so we need to add the attributes to the mainAttributes no matter what (Real join will never be executed in subquery)
      for (const attr of throughAttributes) {
        attributes.main.push(attr);
      }
    }

    // Figure out if we need to use field or attribute
    if (!topLevelInfo.subQuery) {
      attrSource = association.source.rawAttributes[primaryKeysSource[0]].field;
    }
    if (topLevelInfo.subQuery && !include.subQuery && !include.parent.subQuery && include.parent.model !== topLevelInfo.options.mainModel) {
      attrSource = association.source.rawAttributes[primaryKeysSource[0]].field;
    }

    // Filter statement for left side of through
    // Used by both join and subquery where
    // If parent include was in a subquery need to join on the aliased attribute
    if (topLevelInfo.subQuery && !include.subQuery && include.parent.subQuery && !parentIsTop) {
      sourceJoinOn = `${this.quoteIdentifier(`${tableSource}.${attrSource}`)} = `;
    } else {
      sourceJoinOn = `${this.quoteTable(tableSource)}.${this.quoteIdentifier(attrSource)} = `;
    }
    sourceJoinOn += `${this.quoteIdentifier(throughAs)}.${this.quoteIdentifier(identSource)}`;

    // Filter statement for right side of through
    // Used by both join and subquery where
    targetJoinOn = `${this.quoteIdentifier(tableTarget)}.${this.quoteIdentifier(attrTarget)} = `;
    targetJoinOn += `${this.quoteIdentifier(throughAs)}.${this.quoteIdentifier(identTarget)}`;

    if (through.where) {
      throughWhere = this.getWhereConditions(through.where, this.sequelize.literal(this.quoteIdentifier(throughAs)), through.model);
    }

    if (this._dialect.supports.joinTableDependent) {
      // Generate a wrapped join so that the through table join can be dependent on the target join
      joinBody = `( ${this.quoteTable(throughTable, throughAs)} INNER JOIN ${this.quoteTable(include.model.getTableName(), includeAs.internalAs)} ON ${targetJoinOn}`;
      if (throughWhere) {
        joinBody += ` AND ${throughWhere}`;
      }
      joinBody += ')';
      joinCondition = sourceJoinOn;
    } else {
      // Generate join SQL for left side of through
      joinBody = `${this.quoteTable(throughTable, throughAs)} ON ${sourceJoinOn} ${joinType} ${this.quoteTable(include.model.getTableName(), includeAs.internalAs)}`;
      joinCondition = targetJoinOn;
      if (throughWhere) {
        joinCondition += ` AND ${throughWhere}`;
      }
    }

    if (include.where || include.through.where) {
      if (include.where) {
        targetWhere = this.getWhereConditions(include.where, this.sequelize.literal(this.quoteIdentifier(includeAs.internalAs)), include.model, topLevelInfo.options);
        if (targetWhere) {
          joinCondition += ` AND ${targetWhere}`;
        }
      }
      if (topLevelInfo.subQuery && include.required) {
        if (!topLevelInfo.options.where) {
          topLevelInfo.options.where = {};
        }
        let parent = include;
        let child = include;
        let nestedIncludes = [];
        let query;

        while ((parent = parent.parent)) { // eslint-disable-line
          nestedIncludes = [_.extend({}, child, { include: nestedIncludes })];
          child = parent;
        }

        const topInclude = nestedIncludes[0];
        const topParent = topInclude.parent;

        if (topInclude.through && Object(topInclude.through.model) === topInclude.through.model) {
          query = this.selectQuery(topInclude.through.model.getTableName(), {
            attributes: [topInclude.through.model.primaryKeyField],
            include: Model._validateIncludedElements({
              model: topInclude.through.model,
              include: [{
                association: topInclude.association.toTarget,
                required: true
              }]
            }).include,
            model: topInclude.through.model,
            where: {
              $and: [
                this.sequelize.asIs([
                  this.quoteTable(topParent.model.name) + '.' + this.quoteIdentifier(topParent.model.primaryKeyField),
                  this.quoteIdentifier(topInclude.through.model.name) + '.' + this.quoteIdentifier(topInclude.association.identifierField)
                ].join(' = ')),
                topInclude.through.where
              ]
            },
            limit: 1,
            includeIgnoreAttributes: false
          }, topInclude.through.model);
        } else {
          const isBelongsTo = topInclude.association.associationType === 'BelongsTo';
          const join = [
            this.quoteTable(topParent.model.name) + '.' + this.quoteIdentifier(isBelongsTo ? topInclude.association.identifierField : topParent.model.primaryKeyAttributes[0]),
            this.quoteIdentifier(topInclude.model.name) + '.' + this.quoteIdentifier(isBelongsTo ? topInclude.model.primaryKeyAttributes[0] : topInclude.association.identifierField)
          ].join(' = ');
          query = this.selectQuery(topInclude.model.tableName, {
            attributes: [topInclude.model.primaryKeyAttributes[0]],
            include: topInclude.include,
            where: {
              $join: this.sequelize.asIs(join)
            },
            limit: 1,
            includeIgnoreAttributes: false
          }, topInclude.model);
        }
        topLevelInfo.options.where['__' + throughAs] = this.sequelize.asIs([
          '(',
          query.replace(/\;$/, ''),
          ')',
          'IS NOT NULL'
        ].join(' '));
      }
    }

    return {
      join: joinType,
      body: joinBody,
      condition: joinCondition,
      attributes
    };
  },

  getQueryOrders(options, model, subQuery) {
    const mainQueryOrder = [];
    const subQueryOrder = [];

    if (Array.isArray(options.order)) {
      for (let order of options.order) {
        // wrap if not array
        if (!Array.isArray(order)) {
          order = [order];
        }

        if (
          subQuery
          && Array.isArray(order)
          && order[0]
          && !(order[0] instanceof Association)
          && !(typeof order[0] === 'function' && order[0].prototype instanceof Model)
          && !(typeof order[0].model === 'function' && order[0].model.prototype instanceof Model)
          && !(typeof order[0] === 'string' && model && model.associations !== undefined && model.associations[order[0]])
        ) {
          subQueryOrder.push(this.quote(order, model, '->'));
        }
        mainQueryOrder.push(this.quote(order, model, '->'));
      }
    } else if (options.order instanceof Utils.SequelizeMethod) {
      const sql = this.quote(options.order, model, '->');
      if (subQuery) {
        subQueryOrder.push(sql);
      }
      mainQueryOrder.push(sql);
    } else {
      throw new Error('Order must be type of array or instance of a valid sequelize method.');
    }

    return {mainQueryOrder, subQueryOrder};
  },

  selectFromTableFragment(options, model, attributes, tables, mainTableAs) {
    let fragment = 'SELECT ' + attributes.join(', ') + ' FROM ' + tables;

    if (mainTableAs) {
      fragment += ' AS ' + mainTableAs;
    }

    return fragment;
  },

  /**
   * Returns a query that starts a transaction.
   *
   * @param  {Boolean} value   A boolean that states whether autocommit shall be done or not.
   * @param  {Object}  options An object with options.
   * @return {String}          The generated sql query.
   * @private
   */
  setAutocommitQuery(value, options) {
    if (options.parent) {
      return;
    }

    // no query when value is not explicitly set
    if (typeof value === 'undefined' || value === null) {
      return;
    }

    return 'SET autocommit = ' + (value ? 1 : 0) + ';';
  },

  /**
   * Returns a query that sets the transaction isolation level.
   *
   * @param  {String} value   The isolation level.
   * @param  {Object} options An object with options.
   * @return {String}         The generated sql query.
   * @private
   */
  setIsolationLevelQuery(value, options) {
    if (options.parent) {
      return;
    }

    return 'SET SESSION TRANSACTION ISOLATION LEVEL ' + value + ';';
  },

  generateTransactionId() {
    return uuid.v4();
  },

  /**
   * Returns a query that starts a transaction.
   *
   * @param  {Transaction} transaction
   * @param  {Object} options An object with options.
   * @return {String}         The generated sql query.
   * @private
   */
  startTransactionQuery(transaction) {
    if (transaction.parent) {
      // force quoting of savepoint identifiers for postgres
      return 'SAVEPOINT ' + this.quoteIdentifier(transaction.name, true) + ';';
    }

    return 'START TRANSACTION;';
  },

  /**
   * Returns a query that defers the constraints. Only works for postgres.
   *
   * @param  {Transaction} transaction
   * @param  {Object} options An object with options.
   * @return {String}         The generated sql query.
   * @private
   */
  deferConstraintsQuery() {},

  setConstraintQuery() {},
  setDeferredQuery() {},
  setImmediateQuery() {},

  /**
   * Returns a query that commits a transaction.
   *
   * @param  {Object} options An object with options.
   * @return {String}         The generated sql query.
   * @private
   */
  commitTransactionQuery(transaction) {
    if (transaction.parent) {
      return;
    }

    return 'COMMIT;';
  },

  /**
   * Returns a query that rollbacks a transaction.
   *
   * @param  {Transaction} transaction
   * @param  {Object} options An object with options.
   * @return {String}         The generated sql query.
   * @private
   */
  rollbackTransactionQuery(transaction) {
    if (transaction.parent) {
      // force quoting of savepoint identifiers for postgres
      return 'ROLLBACK TO SAVEPOINT ' + this.quoteIdentifier(transaction.name, true) + ';';
    }

    return 'ROLLBACK;';
  },

  /**
   * Returns an SQL fragment for adding result constraints
   *
   * @param  {Object} options An object with selectQuery options.
   * @param  {Object} options The model passed to the selectQuery.
   * @return {String}         The generated sql query.
   * @private
   */
  addLimitAndOffset(options) {
    let fragment = '';

    /* eslint-disable */
    if (options.offset != null && options.limit == null) {
      fragment += ' LIMIT ' + this.escape(options.offset) + ', ' + 10000000000000;
    } else if (options.limit != null) {
      if (options.offset != null) {
        fragment += ' LIMIT ' + this.escape(options.offset) + ', ' + this.escape(options.limit);
      } else {
        fragment += ' LIMIT ' + this.escape(options.limit);
      }
    }
    /* eslint-enable */

    return fragment;
  },

  handleSequelizeMethod(smth, tableName, factory, options, prepend) {
    let result;

    if (smth instanceof Utils.Where) {
      let value = smth.logic;
      let key;

      if (smth.attribute instanceof Utils.SequelizeMethod) {
        key = this.getWhereConditions(smth.attribute, tableName, factory, options, prepend);
      } else {
        key = this.quoteTable(smth.attribute.Model.name) + '.' + this.quoteIdentifier(smth.attribute.field || smth.attribute.fieldName);
      }

      if (value && value instanceof Utils.SequelizeMethod) {
        value = this.getWhereConditions(value, tableName, factory, options, prepend);

        result = value === 'NULL' ? key + ' IS NULL' : [key, value].join(smth.comparator);
      } else if (_.isPlainObject(value)) {
        result = this.whereItemQuery(smth.attribute, value, {
          model: factory
        });
      } else {
        if (typeof value === 'boolean') {
          value = this.booleanValue(value);
        } else {
          value = this.escape(value);
        }

        result = value === 'NULL' ? key + ' IS NULL' : [key, value].join(' ' + smth.comparator + ' ');
      }
    } else if (smth instanceof Utils.Literal) {
      result = smth.val;
    } else if (smth instanceof Utils.Cast) {
      if (smth.val instanceof Utils.SequelizeMethod) {
        result = this.handleSequelizeMethod(smth.val, tableName, factory, options, prepend);
      } else if (_.isPlainObject(smth.val)) {
        result = this.whereItemsQuery(smth.val);
      } else {
        result = this.escape(smth.val);
      }

      result = 'CAST(' + result + ' AS ' + smth.type.toUpperCase() + ')';
    } else if (smth instanceof Utils.Fn) {
      result = smth.fn + '(' + smth.args.map(arg => {
        if (arg instanceof Utils.SequelizeMethod) {
          return this.handleSequelizeMethod(arg, tableName, factory, options, prepend);
        } else if (_.isPlainObject(arg)) {
          return this.whereItemsQuery(arg);
        } else {
          return this.escape(arg);
        }
      }).join(', ') + ')';
    } else if (smth instanceof Utils.Col) {
      if (Array.isArray(smth.col)) {
        if (!factory) {
          throw new Error('Cannot call Sequelize.col() with array outside of order / group clause');
        }
      } else if (smth.col.indexOf('*') === 0) {
        return '*';
      }
      return this.quote(smth.col, factory);
    } else {
      result = smth.toString(this, factory);
    }

    return result;
  },

  whereQuery(where, options) {
    const query = this.whereItemsQuery(where, options);
    if (query && query.length) {
      return 'WHERE '+query;
    }
    return '';
  },

  whereItemsQuery(where, options, binding) {
    if (
      Array.isArray(where) && where.length === 0 ||
      _.isPlainObject(where) && _.isEmpty(where) ||
      where === null ||
      where === undefined
    ) {
      // NO OP
      return '';
    }

    if (_.isString(where)) {
      throw new Error('Support for `{where: \'raw query\'}` has been removed.');
    }

    const items = [];

    binding = binding || 'AND';
    if (binding.substr(0, 1) !== ' ') binding = ' '+binding+' ';

    if (_.isPlainObject(where)) {
      _.forOwn(where, (value, key) => {
        items.push(this.whereItemQuery(key, value, options));
      });
    } else {
      items.push(this.whereItemQuery(undefined, where, options));
    }

    return items.length && items.filter(item => item && item.length).join(binding) || '';
  },

  whereItemQuery(key, value, options) {

    options = options || {};

    let binding;
    let outerBinding;
    let comparator = '=';
    let field = options.field || options.model && options.model.rawAttributes && options.model.rawAttributes[key] || options.model && options.model.fieldRawAttributesMap && options.model.fieldRawAttributesMap[key];
    let fieldType = field && field.type || options.type;

    if (key && typeof key === 'string' && key.indexOf('.') !== -1 && options.model) {
      if (options.model.rawAttributes[key.split('.')[0]] && options.model.rawAttributes[key.split('.')[0]].type instanceof DataTypes.JSON) {
        field = options.model.rawAttributes[key.split('.')[0]];
        fieldType = field.type;
        const tmp = value;
        value = {};

        Dottie.set(value, key.split('.').slice(1), tmp);
        key = field.field || key.split('.')[0];
      }
    }

    const comparatorMap = {
      $eq: '=',
      $ne: '!=',
      $gte: '>=',
      $gt: '>',
      $lte: '<=',
      $lt: '<',
      $not: 'IS NOT',
      $is: 'IS',
      $like: 'LIKE',
      $notLike: 'NOT LIKE',
      $iLike: 'ILIKE',
      $notILike: 'NOT ILIKE',
      $regexp: '~',
      $notRegexp: '!~',
      $iRegexp: '~*',
      $notIRegexp: '!~*',
      $between: 'BETWEEN',
      $notBetween: 'NOT BETWEEN',
      $overlap: '&&',
      $contains: '@>',
      $contained: '<@',
      $adjacent: '-|-',
      $strictLeft: '<<',
      $strictRight: '>>',
      $noExtendRight: '&<',
      $noExtendLeft: '&>'
    };

    // Maintain BC
    const aliasMap = {
      'ne': '$ne',
      'in': '$in',
      'not': '$not',
      'notIn': '$notIn',
      'gte': '$gte',
      'gt': '$gt',
      'lte': '$lte',
      'lt': '$lt',
      'like': '$like',
      'ilike': '$iLike',
      '$ilike': '$iLike',
      'nlike': '$notLike',
      '$notlike': '$notLike',
      'notilike': '$notILike',
      '..': '$between',
      'between': '$between',
      '!..': '$notBetween',
      'notbetween': '$notBetween',
      'nbetween': '$notBetween',
      'overlap': '$overlap',
      '&&': '$overlap',
      '@>': '$contains',
      '<@': '$contained'
    };

    key = aliasMap[key] || key;
    if (_.isPlainObject(value)) {
      _.forOwn(value, (item, key) => {
        if (aliasMap[key]) {
          value[aliasMap[key]] = item;
          delete value[key];
        }
      });
    }

    if (key === undefined) {
      if (typeof value === 'string') {
        return value;
      }

      if (_.isPlainObject(value) && _.size(value) === 1) {
        key = Object.keys(value)[0];
        value = _.values(value)[0];
      }
    }

    if (value && value instanceof Utils.SequelizeMethod && !(key !== undefined && value instanceof Utils.Fn)) {
      return this.handleSequelizeMethod(value);
    }

    // Convert where: [] to $and if possible, else treat as literal/replacements
    if (key === undefined && Array.isArray(value)) {
      if (Utils.canTreatArrayAsAnd(value)) {
        key = '$and';
      } else {
        throw new Error('Support for literal replacements in the `where` object has been removed.');
      }
    }
    // OR/AND/NOT grouping logic
    if (key === '$or' || key === '$and' || key === '$not') {
      binding = key === '$or' ?' OR ' : ' AND ';
      outerBinding = '';
      if (key === '$not') outerBinding = 'NOT ';

      if (Array.isArray(value)) {
        value = value.map(item => {
          let itemQuery = this.whereItemsQuery(item, options, ' AND ');
          if ((Array.isArray(item) || _.isPlainObject(item)) && _.size(item) > 1) {
            itemQuery = '('+itemQuery+')';
          }
          return itemQuery;
        }).filter(item => item && item.length);

        // $or: [] should return no data.
        // $not of no restriction should also return no data
        if ((key === '$or' || key === '$not') && value.length === 0) {
          return '0 = 1';
        }

        return value.length ? outerBinding + '('+value.join(binding)+')' : undefined;
      } else {
        value = this.whereItemsQuery(value, options, binding);

        if ((key === '$or' || key === '$not') && !value) {
          return '0 = 1';
        }

        return value ? outerBinding + '('+value+')' : undefined;
      }
    }

    if (value && (value.$or || value.$and)) {
      binding = value.$or ? ' OR ' : ' AND ';
      value = value.$or || value.$and;

      if (_.isPlainObject(value)) {
        value = _.reduce(value, (result, _value, key) => {
          result.push(_.zipObject([key], [_value]));
          return result;
        }, []);
      }

      value = value.map(_value => this.whereItemQuery(key, _value, options)).filter(item => item && item.length);

      return value.length ? '('+value.join(binding)+')' : undefined;
    }

    if (_.isPlainObject(value) && fieldType instanceof DataTypes.JSON && options.json !== false) {
      const items = [];
      const traverse = (prop, item, path) => {
        const where = {};
        let cast;

        if (path[path.length - 1].indexOf('::') > -1) {
          const tmp = path[path.length - 1].split('::');
          cast = tmp[1];
          path[path.length - 1] = tmp[0];
        }

        let baseKey = this.quoteIdentifier(key);

        if (options.prefix) {
          if (options.prefix instanceof Utils.Literal) {
            baseKey = `${this.handleSequelizeMethod(options.prefix)}.${baseKey}`;
          } else {
            baseKey = `${this.quoteTable(options.prefix)}.${baseKey}`;
          }
        }

        baseKey = this.jsonPathExtractionQuery(baseKey, path);

        const castKey = item => {
          const key = baseKey;

          if (!cast) {
            if (typeof item === 'number') {
              cast = 'double precision';
            } else if (item instanceof Date) {
              cast = 'timestamptz';
            } else if (typeof item === 'boolean') {
              cast = 'boolean';
            }
          }

          if (cast) {
            return this.handleSequelizeMethod(new Utils.Cast(new Utils.Literal(key), cast));
          }

          return key;
        };

        if (_.isPlainObject(item)) {
          _.forOwn(item, (item, prop) => {
            if (prop.indexOf('$') === 0) {
              where[prop] = item;
              const key = castKey(item);

              items.push(this.whereItemQuery(new Utils.Literal(key), where/*, _.pick(options, 'prefix')*/));
            } else {
              traverse(prop, item, path.concat([prop]));
            }
          });
        } else {
          where.$eq = item;
          const key = castKey(item);

          items.push(this.whereItemQuery(new Utils.Literal(key), where/*, _.pick(options, 'prefix')*/));
        }
      };

      _.forOwn(value, (item, prop) => {
        if (prop.indexOf('$') === 0) {
          const where = {};
          where[prop] = item;
          items.push(this.whereItemQuery(key, where, _.assign({}, options, {json: false})));
          return;
        }

        traverse(prop, item, [prop]);
      });

      const result = items.join(' AND ');
      return items.length > 1 ? '('+result+')' : result;
    }

    // If multiple keys we combine the different logic conditions
    if (_.isPlainObject(value) && Object.keys(value).length > 1) {
      const items = [];
      _.forOwn(value, (item, logic) => {
        const where = {};
        where[logic] = item;
        items.push(this.whereItemQuery(key, where, options));
      });

      return '('+items.join(' AND ')+')';
    }

    // Do [] to $in/$notIn normalization
    if (value && (!fieldType || !(fieldType instanceof DataTypes.ARRAY))) {
      if (Array.isArray(value)) {
        value = {
          $in: value
        };
      } else if (value && Array.isArray(value.$not)) {
        value.$notIn = value.$not;
        delete value.$not;
      }
    }

    // normalize $not: non-bool|non-null to $ne
    if (value && typeof value.$not !== 'undefined' && [null, true, false].indexOf(value.$not) < 0) {
      value.$ne = value.$not;
      delete value.$not;
    }

    // Setup keys and comparators
    if (Array.isArray(value) && fieldType instanceof DataTypes.ARRAY) {
      value = this.escape(value, field);
    } else if (value && (value.$in || value.$notIn)) {
      comparator = 'IN';
      if (value.$notIn) comparator = 'NOT IN';

      if ((value.$in || value.$notIn) instanceof Utils.Literal) {
        value = (value.$in || value.$notIn).val;
      } else if ((value.$in || value.$notIn).length) {
        value = '('+(value.$in || value.$notIn).map(item => this.escape(item)).join(', ')+')';
      } else {
        if (value.$in) {
          value = '(NULL)';
        } else {
          return '';
        }
      }
    } else if (value && (value.$any || value.$all)) {
      comparator = value.$any ? '= ANY' : '= ALL';
      if (value.$any && value.$any.$values || value.$all && value.$all.$values) {
        value = '(VALUES '+(value.$any && value.$any.$values || value.$all && value.$all.$values).map(value => '('+this.escape(value)+')').join(', ')+')';
      } else {
        value = '('+this.escape(value.$any || value.$all, field)+')';
      }
    } else if (value && (value.$between || value.$notBetween)) {
      comparator = 'BETWEEN';
      if (value.$notBetween) comparator = 'NOT BETWEEN';

      value = (value.$between || value.$notBetween).map(item => this.escape(item)).join(' AND ');
    } else if (value && value.$raw) {
      throw new Error('The `$raw` where property is no longer supported.  Use `sequelize.literal` instead.');
    } else if (value && value.$col) {
      value = value.$col.split('.');

      if (value.length > 2) {
        value = [
          // join the tables by -> to match out internal namings
          value.slice(0, -1).join('->'),
          value[value.length - 1]
        ];
      }

      value = value.map(identifier => this.quoteIdentifier(identifier)).join('.');
    } else {
      let escapeValue = true;
      const escapeOptions = {};

      if (_.isPlainObject(value)) {
        _.forOwn(value, (item, key) => {
          if (comparatorMap[key]) {
            comparator = comparatorMap[key];
            value = item;

            if (_.isPlainObject(value) && value.$any) {
              comparator += ' ANY';
              escapeOptions.isList = true;
              value = value.$any;
            } else if (_.isPlainObject(value) && value.$all) {
              comparator += ' ALL';
              escapeOptions.isList = true;
              value = value.$all;
            } else if (value && value.$col) {
              escapeValue = false;
              value = this.whereItemQuery(null, value);
            }
          }
        });
      }

      if (comparator === '=' && value === null) {
        comparator = 'IS';
      } else if (comparator === '!=' && value === null) {
        comparator = 'IS NOT';
      }

      if (comparator.indexOf('~') !== -1) {
        escapeValue = false;
      }

      if (this._dialect.name === 'mysql') {
        if (comparator ===  '~') {
          comparator = 'REGEXP';
        } else if (comparator ===  '!~') {
          comparator = 'NOT REGEXP';
        }
      }

      escapeOptions.acceptStrings = comparator.indexOf('LIKE') !== -1;
      escapeOptions.acceptRegExp = comparator.indexOf('~') !== -1 || comparator.indexOf('REGEXP') !== -1;

      if (escapeValue) {
        value = this.escape(value, field, escapeOptions);

        // if ANY or ALL is used with like, add parentheses to generate correct query
        if (escapeOptions.acceptStrings && (
          comparator.indexOf('ANY') > comparator.indexOf('LIKE') ||
          comparator.indexOf('ALL') > comparator.indexOf('LIKE')
        )) {
          value = '(' + value + ')';
        }
      } else if (escapeOptions.acceptRegExp) {
        value = '\'' + value + '\'';
      }
    }

    if (key) {
      let prefix = true;
      if (key instanceof Utils.SequelizeMethod) {
        key = this.handleSequelizeMethod(key);
      } else if (Utils.isColString(key)) {
        key = key.substr(1, key.length - 2).split('.');

        if (key.length > 2) {
          key = [
            // join the tables by -> to match out internal namings
            key.slice(0, -1).join('->'),
            key[key.length - 1]
          ];
        }

        key = key.map(identifier => this.quoteIdentifier(identifier)).join('.');
        prefix = false;
      } else {
        key = this.quoteIdentifier(key);
      }

      if (options.prefix && prefix) {
        if (options.prefix instanceof Utils.Literal) {
          key = [this.handleSequelizeMethod(options.prefix), key].join('.');
        } else {
          key = [this.quoteTable(options.prefix), key].join('.');
        }
      }
      return [key, value].join(' '+comparator+' ');
    }
    return value;
  },

  /*
    Takes something and transforms it into values of a where condition.
   @private
  */
  getWhereConditions(smth, tableName, factory, options, prepend) {
    let result = null;
    const where = {};

    if (Array.isArray(tableName)) {
      tableName = tableName[0];
      if (Array.isArray(tableName)) {
        tableName = tableName[1];
      }
    }

    options = options || {};

    if (typeof prepend === 'undefined') {
      prepend = true;
    }

    if (smth && smth instanceof Utils.SequelizeMethod) { // Checking a property is cheaper than a lot of instanceof calls
      result = this.handleSequelizeMethod(smth, tableName, factory, options, prepend);
    } else if (_.isPlainObject(smth)) {
      return this.whereItemsQuery(smth, {
        model: factory,
        prefix: prepend && tableName
      });
    } else if (typeof smth === 'number') {
      let primaryKeys = factory ? Object.keys(factory.primaryKeys) : [];

      if (primaryKeys.length > 0) {
        // Since we're just a number, assume only the first key
        primaryKeys = primaryKeys[0];
      } else {
        primaryKeys = 'id';
      }

      where[primaryKeys] = smth;

      return this.whereItemsQuery(where, {
        model: factory,
        prefix: prepend && tableName
      });
    } else if (typeof smth === 'string') {
      return this.whereItemsQuery(smth, {
        model: factory,
        prefix: prepend && tableName
      });
    } else if (Buffer.isBuffer(smth)) {
      result = this.escape(smth);
    } else if (Array.isArray(smth)) {
      if (smth.length === 0 || smth.length > 0 && smth[0].length === 0) return '1=1';
      if (Utils.canTreatArrayAsAnd(smth)) {
        const _smth = { $and: smth };
        result = this.getWhereConditions(_smth, tableName, factory, options, prepend);
      } else {
        throw new Error('Support for literal replacements in the `where` object has been removed.');
      }
    } else if (smth === null) {
      return this.whereItemsQuery(smth, {
        model: factory,
        prefix: prepend && tableName
      });
    }

    return result ? result : '1=1';
  },

  // A recursive parser for nested where conditions
  parseConditionObject(conditions, path) {
    path = path || [];
    return _.reduce(conditions, (result, value, key) => {
      if (_.isObject(value)) {
        result = result.concat(this.parseConditionObject(value, path.concat(key))); // Recursively parse objects
      } else {
        result.push({ path: path.concat(key), value });
      }
      return result;
    }, []);
  },

  isIdentifierQuoted(string) {
    return /^\s*(?:([`"'])(?:(?!\1).|\1{2})*\1\.?)+\s*$/i.test(string);
  },

  booleanValue(value) {
    return value;
  }
};

module.exports = QueryGenerator;


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const hstore = __webpack_require__(58)({sanitize : true});

function stringify(data) {
  if (data === null) return null;
  return hstore.stringify(data);
}
exports.stringify = stringify;

function parse(value) {
  if (value === null) return null;
  return hstore.parse(value);
}
exports.parse = parse;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const dataTypes = __webpack_require__(2);
const _ = __webpack_require__(0);

function escape(val, timeZone, dialect, format) {
  let prependN = false;
  if (val === undefined || val === null) {
    return 'NULL';
  }
  switch (typeof val) {
    case 'boolean':
    // SQLite doesn't have true/false support. MySQL aliases true/false to 1/0
    // for us. Postgres actually has a boolean type with true/false literals,
    // but sequelize doesn't use it yet.
      if (dialect === 'sqlite' || dialect === 'mssql') {
        return +!!val;
      }
      return '' + !!val;
    case 'number':
      return val + '';
    case 'string':
    // In mssql, prepend N to all quoted vals which are originally a string (for
    // unicode compatibility)
      prependN = dialect === 'mssql';
      break;
  }

  if (val instanceof Date) {
    val = dataTypes[dialect].DATE.prototype.stringify(val, { timezone: timeZone });
  }

  if (Buffer.isBuffer(val)) {
    if (dataTypes[dialect].BLOB) {
      return dataTypes[dialect].BLOB.prototype.stringify(val);
    }

    return dataTypes.BLOB.prototype.stringify(val);
  }

  if (Array.isArray(val)) {
    const partialEscape = _.partial(escape, _, timeZone, dialect, format);
    if (dialect === 'postgres' && !format) {
      return dataTypes.ARRAY.prototype.stringify(val, {escape: partialEscape});
    }
    return val.map(partialEscape);
  }

  if (!val.replace) {
    throw new Error('Invalid value ' + val);
  }

  if (dialect === 'postgres' || dialect === 'sqlite' || dialect === 'mssql') {
    // http://www.postgresql.org/docs/8.2/static/sql-syntax-lexical.html#SQL-SYNTAX-STRINGS
    // http://stackoverflow.com/q/603572/130598
    val = val.replace(/'/g, "''");
  } else {
    val = val.replace(/[\0\n\r\b\t\\\'\"\x1a]/g, s => {
      switch (s) {
        case '\0': return '\\0';
        case '\n': return '\\n';
        case '\r': return '\\r';
        case '\b': return '\\b';
        case '\t': return '\\t';
        case '\x1a': return '\\Z';
        default: return '\\' + s;
      }
    });
  }
  return (prependN ? "N'" : "'") + val + "'";
}
exports.escape = escape;

function format(sql, values, timeZone, dialect) {
  values = [].concat(values);

  if (typeof sql !== 'string') {
    throw new Error('Invalid SQL string provided: ' + sql);
  }
  return sql.replace(/\?/g, match => {
    if (!values.length) {
      return match;
    }

    return escape(values.shift(), timeZone, dialect, true);
  });
}
exports.format = format;

function formatNamedParameters(sql, values, timeZone, dialect) {
  return sql.replace(/\:+(?!\d)(\w+)/g, (value, key) => {
    if ('postgres' === dialect && '::' === value.slice(0, 2)) {
      return value;
    }

    if (values[key] !== undefined) {
      return escape(values[key], timeZone, dialect, true);
    } else {
      throw new Error('Named parameter "' + value + '" has no value in the given object.');
    }
  });
}
exports.formatNamedParameters = formatNamedParameters;


/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("uuid");

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const Helpers = __webpack_require__(19);
const _ = __webpack_require__(0);
const Association = __webpack_require__(8);

/**
 * One-to-one association
 *
 * In the API reference below, add the name of the association to the method, e.g. for `User.hasOne(Project)` the getter will be `user.getProject()`.
 * This is almost the same as `belongsTo` with one exception - The foreign key will be defined on the target model.
 *
 * @see {@link Model.hasOne}
 */
class HasOne extends Association {
  constructor(source, target, options) {
    super(source, target, options);

    this.associationType = 'HasOne';
    this.isSingleAssociation = true;
    this.foreignKeyAttribute = {};

    if (this.as) {
      this.isAliased = true;
      this.options.name = {
        singular: this.as
      };
    } else {
      this.as = this.target.options.name.singular;
      this.options.name = this.target.options.name;
    }

    if (_.isObject(this.options.foreignKey)) {
      this.foreignKeyAttribute = this.options.foreignKey;
      this.foreignKey = this.foreignKeyAttribute.name || this.foreignKeyAttribute.fieldName;
    } else if (this.options.foreignKey) {
      this.foreignKey = this.options.foreignKey;
    }

    if (!this.foreignKey) {
      this.foreignKey = Utils.camelizeIf(
        [
          Utils.underscoredIf(Utils.singularize(this.options.as || this.source.name), this.target.options.underscored),
          this.source.primaryKeyAttribute
        ].join('_'),
        !this.source.options.underscored
      );
    }

    this.sourceIdentifier = this.source.primaryKeyAttribute;
    this.sourceKey = this.source.primaryKeyAttribute;
    this.sourceKeyIsPrimary = this.sourceKey === this.source.primaryKeyAttribute;

    this.associationAccessor = this.as;
    this.options.useHooks = options.useHooks;

    if (this.target.rawAttributes[this.foreignKey]) {
      this.identifierField = this.target.rawAttributes[this.foreignKey].field || this.foreignKey;
    }

    // Get singular name, trying to uppercase the first letter, unless the model forbids it
    const singular = Utils.uppercaseFirst(this.options.name.singular);

    this.accessors = {
      get: 'get' + singular,
      set: 'set' + singular,
      create: 'create' + singular
    };
  }

  // the id is in the target table
  injectAttributes() {
    const newAttributes = {};
    const keyType = this.source.rawAttributes[this.source.primaryKeyAttribute].type;

    newAttributes[this.foreignKey] = _.defaults({}, this.foreignKeyAttribute, {
      type: this.options.keyType || keyType,
      allowNull : true
    });
    Utils.mergeDefaults(this.target.rawAttributes, newAttributes);

    this.identifierField = this.target.rawAttributes[this.foreignKey].field || this.foreignKey;

    if (this.options.constraints !== false) {
      const target = this.target.rawAttributes[this.foreignKey] || newAttributes[this.foreignKey];
      this.options.onDelete = this.options.onDelete || (target.allowNull ? 'SET NULL' : 'CASCADE');
      this.options.onUpdate = this.options.onUpdate || 'CASCADE';
    }

    Helpers.addForeignKeyConstraints(this.target.rawAttributes[this.foreignKey], this.source, this.target, this.options);

    // Sync attributes and setters/getters to Model prototype
    this.target.refreshAttributes();

    Helpers.checkNamingCollision(this);

    return this;
  }

  mixin(obj) {
    const methods = ['get', 'set', 'create'];

    Helpers.mixinMethods(this, obj, methods);
  }

  /**
   * Get the associated instance.
   *
   * @param {Object} [options]
   * @param {String|Boolean} [options.scope] Apply a scope on the related model, or remove its default scope by passing false
   * @param {String} [options.schema] Apply a schema on the related model
   * @see {@link Model.findOne} for a full explanation of options
   * @return {Promise<Model>}
   */
  get(instances, options) {
    const association = this;
    const where = {};
    let Target = association.target;
    let instance;

    options = Utils.cloneDeep(options);

    if (options.hasOwnProperty('scope')) {
      if (!options.scope) {
        Target = Target.unscoped();
      } else {
        Target = Target.scope(options.scope);
      }
    }

    if (options.hasOwnProperty('schema')) {
      Target = Target.schema(options.schema, options.schemaDelimiter);
    }

    if (!Array.isArray(instances)) {
      instance = instances;
      instances = undefined;
    }

    if (instances) {
      where[association.foreignKey] = {
        $in: instances.map(instance => instance.get(association.sourceKey))
      };
    } else {
      where[association.foreignKey] = instance.get(association.sourceKey);
    }

    if (association.scope) {
      _.assign(where, association.scope);
    }

    options.where = options.where ?
      {$and: [where, options.where]} :
      where;

    if (instances) {
      return Target.findAll(options).then(results => {
        const result = {};
        for (const instance of instances) {
          result[instance.get(association.sourceKey, {raw: true})] = null;
        }

        for (const instance of results) {
          result[instance.get(association.foreignKey, {raw: true})] = instance;
        }

        return result;
      });
    }
    return Target.findOne(options);
  }

  /**
   * Set the associated model.
   *
   * @param {Model|String|Number} [newAssociation] An persisted instance or the primary key of a persisted instance to associate with this. Pass `null` or `undefined` to remove the association.
   * @param {Object} [options] Options passed to getAssociation and `target.save`
   * @return {Promise}
   */
  set(sourceInstance, associatedInstance, options) {
    const association = this;

    let alreadyAssociated;

    options = _.assign({}, options, {
      scope: false
    });

    return sourceInstance[association.accessors.get](options).then(oldInstance => {
      // TODO Use equals method once #5605 is resolved
      alreadyAssociated = oldInstance && associatedInstance && _.every(association.target.primaryKeyAttributes, attribute =>
        oldInstance.get(attribute, {raw: true}) === (associatedInstance.get ? associatedInstance.get(attribute, {raw: true}) : associatedInstance)
      );

      if (oldInstance && !alreadyAssociated) {
        oldInstance[association.foreignKey] = null;
        return oldInstance.save(_.extend({}, options, {
          fields: [association.foreignKey],
          allowNull: [association.foreignKey],
          association: true
        }));
      }
    }).then(() => {
      if (associatedInstance && !alreadyAssociated) {
        if (!(associatedInstance instanceof association.target)) {
          const tmpInstance = {};
          tmpInstance[association.target.primaryKeyAttribute] = associatedInstance;
          associatedInstance = association.target.build(tmpInstance, {
            isNewRecord: false
          });
        }

        _.assign(associatedInstance, association.scope);
        associatedInstance.set(association.foreignKey, sourceInstance.get(association.sourceIdentifier));

        return associatedInstance.save(options);
      }

      return null;
    });
  }

  /**
   * Create a new instance of the associated model and associate it with this.
   *
   * @param {Object} [values]
   * @param {Object} [options] Options passed to `target.create` and setAssociation.
   * @see {@link Model#create} for a full explanation of options
   * @return {Promise}
   */
  create(sourceInstance, values, options) {
    const association = this;

    values = values || {};
    options = options || {};

    if (association.scope) {
      for (const attribute of Object.keys(association.scope)) {
        values[attribute] = association.scope[attribute];
        if (options.fields) {
          options.fields.push(attribute);
        }
      }
    }

    values[association.foreignKey] = sourceInstance.get(association.sourceIdentifier);
    if (options.fields) {
      options.fields.push(association.foreignKey);
    }

    return association.target.create(values, options);
  }
}

module.exports = HasOne;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("dottie");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("koa-router");

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = require("wkx");

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const BelongsTo = __webpack_require__(12);
const BelongsToMany = __webpack_require__(21);
const InstanceValidator = __webpack_require__(69);
const QueryTypes = __webpack_require__(9);
const sequelizeErrors = __webpack_require__(3);
const Dottie = __webpack_require__(32);
const Promise = __webpack_require__(4);
const _ = __webpack_require__(0);
const moment = __webpack_require__(17);
const Association = __webpack_require__(8);
const HasMany = __webpack_require__(13);
const DataTypes = __webpack_require__(2);
const Hooks = __webpack_require__(36);
const associationsMixin = __webpack_require__(70);
const defaultsOptions = { raw: true };
const assert = __webpack_require__(71);

/**
 * A Model represents a table in the database. Instances of this class represent a database row.
 *
 * Model instances operate with the concept of a `dataValues` property, which stores the actual values represented by the instance.
 * By default, the values from dataValues can also be accessed directly from the Instance, that is:
 * ```js
 * instance.field
 * // is the same as
 * instance.get('field')
 * // is the same as
 * instance.getDataValue('field')
 * ```
 * However, if getters and/or setters are defined for `field` they will be invoked, instead of returning the value from `dataValues`.
 * Accessing properties directly or using `get` is preferred for regular use, `getDataValue` should only be used for custom getters.
 *
 * @see {@link Sequelize#define} for more information about getters and setters
 * @class Model
 * @mixes Hooks
 */
class Model {
  static get QueryInterface() {
    return this.sequelize.getQueryInterface();
  }

  static get QueryGenerator() {
    return this.QueryInterface.QueryGenerator;
  }

  // validateIncludedElements should have been called before this method
  static _paranoidClause(model, options) {
    options = options || {};

    // Apply on each include
    // This should be handled before handling where conditions because of logic with returns
    // otherwise this code will never run on includes of a already conditionable where
    if (options.include) {
      for (const include of options.include) {
        this._paranoidClause(include.model, include);
      }
    }

    // apply paranoid when groupedLimit is used
    if (_.get(options, 'groupedLimit.on.options.paranoid')) {
      const throughModel = _.get(options, 'groupedLimit.on.through.model');
      if (throughModel) {
        options.groupedLimit.through = this._paranoidClause(throughModel, options.groupedLimit.through);
      }
    }

    if (!model.options.timestamps || !model.options.paranoid || options.paranoid === false) {
      // This model is not paranoid, nothing to do here;
      return options;
    }

    const deletedAtCol = model._timestampAttributes.deletedAt;
    const deletedAtAttribute = model.rawAttributes[deletedAtCol];
    const deletedAtObject = {};
    let deletedAtDefaultValue = deletedAtAttribute.hasOwnProperty('defaultValue') ? deletedAtAttribute.defaultValue : null;

    deletedAtDefaultValue = deletedAtDefaultValue || { $or: { $gt: model.sequelize.literal('CURRENT_TIMESTAMP'), $eq: null } };

    deletedAtObject[deletedAtAttribute.field || deletedAtCol] = deletedAtDefaultValue;

    if (Utils._.isEmpty(options.where)) {
      options.where = deletedAtObject;
    } else {
      options.where = { $and: [deletedAtObject, options.where] };
    }

    return options;
  }

  static _addDefaultAttributes() {
    const tail = {};
    let head = {};

    // Add id if no primary key was manually added to definition
    // Can't use this.primaryKeys here, since this function is called before PKs are identified
    if (!_.some(this.rawAttributes, 'primaryKey')) {
      if ('id' in this.rawAttributes) {
        // Something is fishy here!
        throw new Error(`A column called 'id' was added to the attributes of '${this.tableName}' but not marked with 'primaryKey: true'`);
      }

      head = {
        id: {
          type: new DataTypes.INTEGER(),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          _autoGenerated: true
        }
      };
    }

    if (this._timestampAttributes.createdAt) {
      tail[this._timestampAttributes.createdAt] = {
        type: DataTypes.DATE,
        allowNull: false,
        _autoGenerated: true
      };
    }

    if (this._timestampAttributes.updatedAt) {
      tail[this._timestampAttributes.updatedAt] = {
        type: DataTypes.DATE,
        allowNull: false,
        _autoGenerated: true
      };
    }

    if (this._timestampAttributes.deletedAt) {
      tail[this._timestampAttributes.deletedAt] = {
        type: DataTypes.DATE,
        _autoGenerated: true
      };
    }

    if (this._versionAttribute) {
      tail[this._versionAttribute] = {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        _autoGenerated: true
      };
    }

    const existingAttributes = Utils._.clone(this.rawAttributes);
    this.rawAttributes = {};

    Utils._.each(head, (value, attr) => {
      this.rawAttributes[attr] = value;
    });

    Utils._.each(existingAttributes, (value, attr) => {
      this.rawAttributes[attr] = value;
    });

    Utils._.each(tail, (value, attr) => {
      if (Utils._.isUndefined(this.rawAttributes[attr])) {
        this.rawAttributes[attr] = value;
      }
    });

    if (!Object.keys(this.primaryKeys).length) {
      this.primaryKeys.id = this.rawAttributes.id;
    }
  }

  static _findAutoIncrementAttribute() {
    this.autoIncrementAttribute = null;

    for (const name in this.rawAttributes) {
      if (this.rawAttributes.hasOwnProperty(name)) {
        const definition = this.rawAttributes[name];
        if (definition && definition.autoIncrement) {
          if (this.autoIncrementAttribute) {
            throw new Error('Invalid Instance definition. Only one autoincrement field allowed.');
          } else {
            this.autoIncrementAttribute = name;
          }
        }
      }
    }
  }

  static _conformOptions(options, self) {
    if (self) {
      self._expandAttributes(options);
    }

    if (!options.include) {
      return;
    }
    // if include is not an array, wrap in an array
    if (!Array.isArray(options.include)) {
      options.include = [options.include];
    } else if (!options.include.length) {
      delete options.include;
      return;
    }

    // convert all included elements to { model: Model } form
    options.include = options.include.map(include => this._conformInclude(include, self));
  }

  static _transformStringAssociation(include, self) {
    if (self && typeof include === 'string') {
      if (!self.associations.hasOwnProperty(include)) {
        throw new Error('Association with alias "' + include + '" does not exists');
      }
      return self.associations[include];
    }
    return include;
  }

  static _conformInclude(include, self) {
    let model;

    if (include._pseudo) return include;

    include = this._transformStringAssociation(include, self);

    if (include instanceof Association) {
      if (self && include.target.name === self.name) {
        model = include.source;
      } else {
        model = include.target;
      }

      include = { model, association: include, as: include.as };
    } else if (include.prototype && include.prototype instanceof Model) {
      include = { model: include };
    } else if (_.isPlainObject(include)) {
      if (include.association) {

        include.association = this._transformStringAssociation(include.association, self);

        if (self && include.association.target.name === self.name) {
          model = include.association.source;
        } else {
          model = include.association.target;
        }

        if (!include.model) {
          include.model = model;
        }
        if (!include.as) {
          include.as = include.association.as;
        }
      } else {
        model = include.model;
      }

      this._conformOptions(include, model);
    } else {
      throw new Error('Include unexpected. Element has to be either a Model, an Association or an object.');
    }

    return include;
  }

  static _expandIncludeAllElement(includes, include) {
    // check 'all' attribute provided is valid
    let all = include.all;
    delete include.all;

    if (all !== true) {
      if (!Array.isArray(all)) {
        all = [all];
      }

      const validTypes = {
        BelongsTo: true,
        HasOne: true,
        HasMany: true,
        One: ['BelongsTo', 'HasOne'],
        Has: ['HasOne', 'HasMany'],
        Many: ['HasMany']
      };

      for (let i = 0; i < all.length; i++) {
        const type = all[i];
        if (type === 'All') {
          all = true;
          break;
        }

        const types = validTypes[type];
        if (!types) {
          throw new sequelizeErrors.EagerLoadingError('include all \'' + type + '\' is not valid - must be BelongsTo, HasOne, HasMany, One, Has, Many or All');
        }

        if (types !== true) {
          // replace type placeholder e.g. 'One' with it's constituent types e.g. 'HasOne', 'BelongsTo'
          all.splice(i, 1);
          i--;
          for (let j = 0; j < types.length; j++) {
            if (all.indexOf(types[j]) === -1) {
              all.unshift(types[j]);
              i++;
            }
          }
        }
      }
    }

    // add all associations of types specified to includes
    const nested = include.nested;
    if (nested) {
      delete include.nested;

      if (!include.include) {
        include.include = [];
      } else if (!Array.isArray(include.include)) {
        include.include = [include.include];
      }
    }

    const used = [];
    (function addAllIncludes(parent, includes) {
      Utils._.forEach(parent.associations, association => {
        if (all !== true && all.indexOf(association.associationType) === -1) {
          return;
        }

        // check if model already included, and skip if so
        const model = association.target;
        const as = association.options.as;

        const predicate = {model};
        if (as) {
          // We only add 'as' to the predicate if it actually exists
          predicate.as = as;
        }

        if (Utils._.find(includes, predicate)) {
          return;
        }

        // skip if recursing over a model already nested
        if (nested && used.indexOf(model) !== -1) {
          return;
        }
        used.push(parent);

        // include this model
        const thisInclude = Utils.cloneDeep(include);
        thisInclude.model = model;
        if (as) {
          thisInclude.as = as;
        }
        includes.push(thisInclude);

        // run recursively if nested
        if (nested) {
          addAllIncludes(model, thisInclude.include);
          if (thisInclude.include.length === 0) delete thisInclude.include;
        }
      });
      used.pop();
    })(this, includes);
  }

  static _validateIncludedElements(options, tableNames) {
    if (!options.model) options.model = this;

    tableNames = tableNames || {};
    options.includeNames = [];
    options.includeMap = {};

    /* Legacy */
    options.hasSingleAssociation = false;
    options.hasMultiAssociation = false;

    if (!options.parent) {
      options.topModel = options.model;
      options.topLimit = options.limit;
    }

    options.include = options.include.map(include => {
      include = this._conformInclude(include);
      include.parent = options;

      this._validateIncludedElement.call(options.model, include, tableNames, options);

      if (include.duplicating === undefined) {
        include.duplicating = include.association.isMultiAssociation;
      }

      include.hasDuplicating = include.hasDuplicating || include.duplicating;
      include.hasRequired = include.hasRequired || include.required;

      options.hasDuplicating = options.hasDuplicating || include.hasDuplicating;
      options.hasRequired = options.hasRequired || include.required;

      options.hasWhere = options.hasWhere || include.hasWhere || !!include.where;
      return include;
    });

    for (const include of options.include) {
      include.hasParentWhere = options.hasParentWhere || !!options.where;
      include.hasParentRequired = options.hasParentRequired || !!options.required;

      if (include.subQuery !== false && options.hasDuplicating && options.topLimit) {
        if (include.duplicating) {
          include.subQuery = false;
          include.subQueryFilter = include.hasRequired;
        } else {
          include.subQuery = include.hasRequired;
          include.subQueryFilter = false;
        }
      } else {
        include.subQuery = include.subQuery || false;
        if (include.duplicating) {
          include.subQueryFilter = include.subQuery;
          include.subQuery = false;
        } else {
          include.subQueryFilter = false;
          include.subQuery = include.subQuery || include.hasParentRequired && include.hasRequired;
        }
      }

      options.includeMap[include.as] = include;
      options.includeNames.push(include.as);

      // Set top level options
      if (options.topModel === options.model && options.subQuery === undefined && options.topLimit) {
        if (include.subQuery) {
          options.subQuery = include.subQuery;
        } else if (include.hasDuplicating) {
          options.subQuery = true;
        }
      }

      /* Legacy */
      options.hasIncludeWhere = options.hasIncludeWhere || include.hasIncludeWhere || !!include.where;
      options.hasIncludeRequired = options.hasIncludeRequired || include.hasIncludeRequired || !!include.required;

      if (include.association.isMultiAssociation || include.hasMultiAssociation) {
        options.hasMultiAssociation = true;
      }
      if (include.association.isSingleAssociation || include.hasSingleAssociation) {
        options.hasSingleAssociation = true;
      }
    }

    if (options.topModel === options.model && options.subQuery === undefined) {
      options.subQuery = false;
    }
    return options;
  }

  static _validateIncludedElement(include, tableNames, options) {
    tableNames[include.model.getTableName()] = true;

    if (include.attributes && !options.raw) {
      include.model._expandAttributes(include);

      // Need to make sure virtuals are mapped before setting originalAttributes
      include = Utils.mapFinderOptions(include, include.model);

      include.originalAttributes = include.attributes.slice(0);

      if (include.attributes.length) {
        _.each(include.model.primaryKeys, (attr, key) => {
          // Include the primary key if its not already take - take into account that the pk might be aliassed (due to a .field prop)
          if (!_.some(include.attributes, includeAttr => {
            if (attr.field !== key) {
              return Array.isArray(includeAttr) && includeAttr[0] === attr.field && includeAttr[1] === key;
            }
            return includeAttr === key;
          })) {
            include.attributes.unshift(key);
          }
        });
      }
    } else {
      include = Utils.mapFinderOptions(include, include.model);
    }

    // pseudo include just needed the attribute logic, return
    if (include._pseudo) {
      include.attributes = Object.keys(include.model.tableAttributes);
      return Utils.mapFinderOptions(include, include.model);
    }

    // check if the current Model is actually associated with the passed Model - or it's a pseudo include
    const association = include.association || this._getIncludedAssociation(include.model, include.as);

    include.association = association;
    include.as = association.as;

    // If through, we create a pseudo child include, to ease our parsing later on
    if (include.association.through && Object(include.association.through.model) === include.association.through.model) {
      if (!include.include) include.include = [];
      const through = include.association.through;

      include.through = Utils._.defaults(include.through || {}, {
        model: through.model,
        as: through.model.name,
        association: {
          isSingleAssociation: true
        },
        _pseudo: true,
        parent: include
      });


      if (through.scope) {
        include.through.where = include.through.where ? { $and: [include.through.where, through.scope]} :  through.scope;
      }

      include.include.push(include.through);
      tableNames[through.tableName] = true;
    }

    // include.model may be the main model, while the association target may be scoped - thus we need to look at association.target/source
    let model;
    if (include.model.scoped === true) {
      // If the passed model is already scoped, keep that
      model = include.model;
    } else {
      // Otherwise use the model that was originally passed to the association
      model = include.association.target.name === include.model.name ? include.association.target : include.association.source;
    }

    model._injectScope(include);

    // This check should happen after injecting the scope, since the scope may contain a .attributes
    if (!include.attributes) {
      include.attributes = Object.keys(include.model.tableAttributes);
    }

    include = Utils.mapFinderOptions(include, include.model);

    if (include.required === undefined) {
      include.required = !!include.where;
    }

    if (include.association.scope) {
      include.where = include.where ? { $and: [include.where, include.association.scope] }:  include.association.scope;
    }

    if (include.limit && include.separate === undefined) {
      include.separate = true;
    }

    if (include.separate === true && !(include.association instanceof HasMany)) {
      throw new Error('Only HasMany associations support include.separate');
    }

    if (include.separate === true) {
      include.duplicating = false;
    }

    if (include.separate === true && options.attributes && options.attributes.length && !_.includes(options.attributes, association.source.primaryKeyAttribute)) {
      options.attributes.push(association.source.primaryKeyAttribute);
    }

    // Validate child includes
    if (include.hasOwnProperty('include')) {
      this._validateIncludedElements.call(include.model, include, tableNames, options);
    }

    return include;
  }

  static _getIncludedAssociation(targetModel, targetAlias) {
    const associations = this.getAssociations(targetModel);
    let association = null;
    if (associations.length === 0) {
      throw new sequelizeErrors.EagerLoadingError(`${targetModel.name} is not associated to ${this.name}!`);
    } else if (associations.length === 1) {
      association = this.getAssociationForAlias(targetModel, targetAlias);
      if (!association) {
        if (targetAlias) {
          throw new sequelizeErrors.EagerLoadingError(`${targetModel.name} is associated to ${this.name} using an alias. ` +
            `You've included an alias (${targetAlias}), but it does not match the alias defined in your association.`);
        } else {
          throw new sequelizeErrors.EagerLoadingError(`${targetModel.name} is associated to ${this.name} using an alias. ` +
            'You must use the \'as\' keyword to specify the alias within your include statement.');
        }
      }
    } else {
      association = this.getAssociationForAlias(targetModel, targetAlias);
      if (!association) {
        throw new sequelizeErrors.EagerLoadingError(`${targetModel.name} is associated to ${this.name} multiple times. ` +
          'To identify the correct association, you must use the \'as\' keyword to specify the alias of the association you want to include.');
      }
    }
    return association;
  }


  static _expandIncludeAll(options) {
    const includes = options.include;
    if (!includes) {
      return;
    }

    for (let index = 0; index < includes.length; index++) {
      const include = includes[index];

      if (include.all) {
        includes.splice(index, 1);
        index--;

        this._expandIncludeAllElement.call(this, includes, include);
      }
    }

    Utils._.forEach(includes, include => {
      this._expandIncludeAll.call(include.model, include);
    });
  }

  /**
   * Initialize a model, representing a table in the DB, with attributes and options.
   *
   * The table columns are define by the hash that is given as the second argument. Each attribute of the hash represents a column. A short table definition might look like this:
   *
   * ```js
   * Project.init({
   *   columnA: {
   *     type: Sequelize.BOOLEAN,
   *     validate: {
   *       is: ['[a-z]','i'],        // will only allow letters
   *       max: 23,                  // only allow values <= 23
   *       isIn: {
   *         args: [['en', 'zh']],
   *         msg: "Must be English or Chinese"
   *       }
   *     },
   *     field: 'column_a'
   *     // Other attributes here
   *   },
   *   columnB: Sequelize.STRING,
   *   columnC: 'MY VERY OWN COLUMN TYPE'
   * }, {sequelize})
   *
   * sequelize.models.modelName // The model will now be available in models under the class name
   * ```
   *
   *
   * As shown above, column definitions can be either strings, a reference to one of the datatypes that are predefined on the Sequelize constructor, or an object that allows you to specify both the type of the column, and other attributes such as default values, foreign key constraints and custom setters and getters.
   *
   * For a list of possible data types, see {@link DataTypes}
   *
   * For more about validation, see http://docs.sequelizejs.com/manual/tutorial/models-definition.html#validations
   *
   * @see {@link DataTypes}
   * @see {@link Hooks}
   *
   * @param {Object}                  attributes An object, where each attribute is a column of the table. Each column can be either a DataType, a string or a type-description object, with the properties described below:
   * @param {String|DataTypes|Object}  attributes.column The description of a database column
   * @param {String|DataTypes}         attributes.column.type A string or a data type
   * @param {Boolean}                 [attributes.column.allowNull=true] If false, the column will have a NOT NULL constraint, and a not null validation will be run before an instance is saved.
   * @param {any}                     [attributes.column.defaultValue=null] A literal default value, a JavaScript function, or an SQL function (see `sequelize.fn`)
   * @param {String|Boolean}          [attributes.column.unique=false] If true, the column will get a unique constraint. If a string is provided, the column will be part of a composite unique index. If multiple columns have the same string, they will be part of the same unique index
   * @param {Boolean}                 [attributes.column.primaryKey=false]
   * @param {String}                  [attributes.column.field=null] If set, sequelize will map the attribute name to a different name in the database
   * @param {Boolean}                 [attributes.column.autoIncrement=false]
   * @param {String}                  [attributes.column.comment=null]
   * @param {String|Model}            [attributes.column.references=null] An object with reference configurations
   * @param {String|Model}            [attributes.column.references.model] If this column references another table, provide it here as a Model, or a string
   * @param {String}                  [attributes.column.references.key='id'] The column of the foreign table that this column references
   * @param {String}                  [attributes.column.onUpdate] What should happen when the referenced key is updated. One of CASCADE, RESTRICT, SET DEFAULT, SET NULL or NO ACTION
   * @param {String}                  [attributes.column.onDelete] What should happen when the referenced key is deleted. One of CASCADE, RESTRICT, SET DEFAULT, SET NULL or NO ACTION
   * @param {Function}                [attributes.column.get] Provide a custom getter for this column. Use `this.getDataValue(String)` to manipulate the underlying values.
   * @param {Function}                [attributes.column.set] Provide a custom setter for this column. Use `this.setDataValue(String, Value)` to manipulate the underlying values.
   * @param {Object}                  [attributes.validate] An object of validations to execute for this column every time the model is saved. Can be either the name of a validation provided by validator.js, a validation function provided by extending validator.js (see the `DAOValidator` property for more details), or a custom validation function. Custom validation functions are called with the value of the field, and can possibly take a second callback argument, to signal that they are asynchronous. If the validator is sync, it should throw in the case of a failed validation, it it is async, the callback should be called with the error text.
   * @param {Object}                  [options] These options are merged with the default define options provided to the Sequelize constructor
   * @param {Object}                  [options.defaultScope={}] Define the default search scope to use for this model. Scopes have the same form as the options passed to find / findAll
   * @param {Object}                  [options.scopes] More scopes, defined in the same way as defaultScope above. See `Model.scope` for more information about how scopes are defined, and what you can do with them
   * @param {Boolean}                 [options.omitNull] Don't persist null values. This means that all columns with null values will not be saved
   * @param {Boolean}                 [options.timestamps=true] Adds createdAt and updatedAt timestamps to the model.
   * @param {Boolean}                 [options.paranoid=false] Calling `destroy` will not delete the model, but instead set a `deletedAt` timestamp if this is true. Needs `timestamps=true` to work
   * @param {Boolean}                 [options.underscored=false] Converts all camelCased columns to underscored if true. Will not affect timestamp fields named explicitly by model options and will not affect fields with explicitly set `field` option
   * @param {Boolean}                 [options.underscoredAll=false] Converts camelCased model names to underscored table names if true. Will not change model name if freezeTableName is set to true
   * @param {Boolean}                 [options.freezeTableName=false] If freezeTableName is true, sequelize will not try to alter the model name to get the table name. Otherwise, the model name will be pluralized
   * @param {Object}                  [options.name] An object with two attributes, `singular` and `plural`, which are used when this model is associated to others.
   * @param {String}                  [options.name.singular=Utils.singularize(modelName)]
   * @param {String}                  [options.name.plural=Utils.pluralize(modelName)]
   * @param {Array<Object>}           [options.indexes]
   * @param {String}                  [options.indexes[].name] The name of the index. Defaults to model name + _ + fields concatenated
   * @param {String}                  [options.indexes[].type] Index type. Only used by mysql. One of `UNIQUE`, `FULLTEXT` and `SPATIAL`
   * @param {String}                  [options.indexes[].method] The method to create the index by (`USING` statement in SQL). BTREE and HASH are supported by mysql and postgres, and postgres additionally supports GIST and GIN.
   * @param {Boolean}                 [options.indexes[].unique=false] Should the index by unique? Can also be triggered by setting type to `UNIQUE`
   * @param {Boolean}                 [options.indexes[].concurrently=false] PostgreSQL will build the index without taking any write locks. Postgres only
   * @param {Array<String|Object>}    [options.indexes[].fields] An array of the fields to index. Each field can either be a string containing the name of the field, a sequelize object (e.g `sequelize.fn`), or an object with the following attributes: `attribute` (field name), `length` (create a prefix index of length chars), `order` (the direction the column should be sorted in), `collate` (the collation (sort order) for the column)
   * @param {String|Boolean}          [options.createdAt] Override the name of the createdAt column if a string is provided, or disable it if false. Timestamps must be true. Not affected by underscored setting.
   * @param {String|Boolean}          [options.updatedAt] Override the name of the updatedAt column if a string is provided, or disable it if false. Timestamps must be true. Not affected by underscored setting.
   * @param {String|Boolean}          [options.deletedAt] Override the name of the deletedAt column if a string is provided, or disable it if false. Timestamps must be true. Not affected by underscored setting.
   * @param {String}                  [options.tableName] Defaults to pluralized model name, unless freezeTableName is true, in which case it uses model name verbatim
   * @param {String}                  [options.schema='public']
   * @param {String}                  [options.engine]
   * @param {String}                  [options.charset]
   * @param {String}                  [options.comment]
   * @param {String}                  [options.collate]
   * @param {String}                  [options.initialAutoIncrement] Set the initial AUTO_INCREMENT value for the table in MySQL.
   * @param {Object}                  [options.hooks] An object of hook function that are called before and after certain lifecycle events. The possible hooks are: beforeValidate, afterValidate, validationFailed, beforeBulkCreate, beforeBulkDestroy, beforeBulkUpdate, beforeCreate, beforeDestroy, beforeUpdate, afterCreate, afterDestroy, afterUpdate, afterBulkCreate, afterBulkDestory and afterBulkUpdate. See Hooks for more information about hook functions and their signatures. Each property can either be a function, or an array of functions.
   * @param {Object}                  [options.validate] An object of model wide validations. Validations have access to all model values via `this`. If the validator function takes an argument, it is assumed to be async, and is called with a callback that accepts an optional error.

   * @return {Model}
   */
  static init(attributes, options) { // testhint options:none
    options = options || {};

    if (!options.sequelize) {
      throw new Error('No Sequelize instance passed');
    }

    this.sequelize = options.sequelize;

    const globalOptions = this.sequelize.options;

    options = Utils.merge(_.cloneDeep(globalOptions.define), options);

    if (!options.modelName) {
      options.modelName = this.name;
    }

    options = Utils.merge({
      name: {
        plural: Utils.pluralize(options.modelName),
        singular: Utils.singularize(options.modelName)
      },
      indexes: [],
      omitNull: globalOptions.omitNull,
      schema: globalOptions.schema
    }, options);

    this.sequelize.runHooks('beforeDefine', attributes, options);

    if (options.modelName !== this.name) {
      Object.defineProperty(this, 'name', {value: options.modelName});
    }
    delete options.modelName;

    this.options = Object.assign({
      timestamps: true,
      validate: {},
      freezeTableName: false,
      underscored: false,
      underscoredAll: false,
      paranoid: false,
      rejectOnEmpty: false,
      whereCollection: null,
      schema: null,
      schemaDelimiter: '',
      defaultScope: {},
      scopes: [],
      hooks: {},
      indexes: []
    }, options);

    // if you call "define" multiple times for the same modelName, do not clutter the factory
    if (this.sequelize.isDefined(this.name)) {
      this.sequelize.modelManager.removeModel(this.sequelize.modelManager.getModel(this.name));
    }

    this.associations = {};
    this.options.hooks = _.mapValues(this.replaceHookAliases(this.options.hooks), hooks => {
      if (!Array.isArray(hooks)) hooks = [hooks];
      return hooks;
    });

    this.underscored = this.underscored || this.underscoredAll;

    if (!this.options.tableName) {
      this.tableName = this.options.freezeTableName ? this.name : Utils.underscoredIf(Utils.pluralize(this.name), this.options.underscoredAll);
    } else {
      this.tableName = this.options.tableName;
    }

    this._schema = this.options.schema;
    this._schemaDelimiter = this.options.schemaDelimiter;

    // error check options
    _.each(options.validate, (validator, validatorType) => {
      if (_.includes(Utils._.keys(attributes), validatorType)) {
        throw new Error('A model validator function must not have the same name as a field. Model: ' + this.name + ', field/validation name: ' + validatorType);
      }

      if (!_.isFunction(validator)) {
        throw new Error('Members of the validate option must be functions. Model: ' + this.name + ', error with validate member ' + validatorType);
      }
    });

    this.rawAttributes = _.mapValues(attributes, (attribute, name) => {

      attribute = this.sequelize.normalizeAttribute(attribute);

      if (attribute.type === undefined) {
        throw new Error('Unrecognized data type for field ' + name);
      }

      if (_.get(attribute, 'references.model.prototype') instanceof Model) {
        attribute.references.model = attribute.references.model.tableName;
      }

      return attribute;
    });

    this.primaryKeys = {};

    // Setup names of timestamp attributes
    this._timestampAttributes = {};
    if (this.options.timestamps) {
      if (this.options.createdAt !== false) {
        this._timestampAttributes.createdAt = this.options.createdAt || Utils.underscoredIf('createdAt', this.options.underscored);
      }
      if (this.options.updatedAt !== false) {
        this._timestampAttributes.updatedAt = this.options.updatedAt || Utils.underscoredIf('updatedAt', this.options.underscored);
      }
      if (this.options.paranoid && this.options.deletedAt !== false) {
        this._timestampAttributes.deletedAt = this.options.deletedAt || Utils.underscoredIf('deletedAt', this.options.underscored);
      }
    }
    if (this.options.version) {
      this._versionAttribute = typeof this.options.version === 'string' ? this.options.version : 'version';
    }

    // Add head and tail default attributes (id, timestamps)
    this._readOnlyAttributes = Utils._.values(this._timestampAttributes);
    if (this._versionAttribute) {
      this._readOnlyAttributes.push(this._versionAttribute);
    }
    this._hasReadOnlyAttributes = this._readOnlyAttributes && this._readOnlyAttributes.length;
    this._isReadOnlyAttribute = Utils._.memoize(key => this._hasReadOnlyAttributes && this._readOnlyAttributes.indexOf(key) !== -1);

    this._addDefaultAttributes();
    this.refreshAttributes();
    this._findAutoIncrementAttribute();

    this._scope = this.options.defaultScope;

    if (_.isPlainObject(this._scope)) {
      this._conformOptions(this._scope, this);
    }

    _.each(this.options.scopes, scope => {
      if (_.isPlainObject(scope)) {
        this._conformOptions(scope, this);
      }
    });

    this.options.indexes = this.options.indexes.map(this._conformIndex);

    this.sequelize.modelManager.addModel(this);
    this.sequelize.runHooks('afterDefine', this);

    return this;
  }

  static _conformIndex(index) {
    index = _.defaults(index, {
      type: '',
      parser: null
    });

    if (index.type && index.type.toLowerCase() === 'unique') {
      index.unique = true;
      delete index.type;
    }
    return index;
  }

  static refreshAttributes() {
    const attributeManipulation = {};

    this.prototype._customGetters = {};
    this.prototype._customSetters = {};

    Utils._.each(['get', 'set'], type => {
      const opt = type + 'terMethods';
      const funcs = Utils._.clone(Utils._.isObject(this.options[opt]) ? this.options[opt] : {});
      const _custom = type === 'get' ? this.prototype._customGetters : this.prototype._customSetters;

      Utils._.each(funcs, (method, attribute) => {
        _custom[attribute] = method;

        if (type === 'get') {
          funcs[attribute] = function() {
            return this.get(attribute);
          };
        }
        if (type === 'set') {
          funcs[attribute] = function(value) {
            return this.set(attribute, value);
          };
        }
      });

      Utils._.each(this.rawAttributes, (options, attribute) => {
        if (options.hasOwnProperty(type)) {
          _custom[attribute] = options[type];
        }

        if (type === 'get') {
          funcs[attribute] = function() {
            return this.get(attribute);
          };
        }
        if (type === 'set') {
          funcs[attribute] = function(value) {
            return this.set(attribute, value);
          };
        }
      });

      Utils._.each(funcs, (fct, name) => {
        if (!attributeManipulation[name]) {
          attributeManipulation[name] = {
            configurable: true
          };
        }
        attributeManipulation[name][type] = fct;
      });
    });

    this._booleanAttributes = [];
    this._dateAttributes = [];
    this._hstoreAttributes = [];
    this._rangeAttributes = [];
    this._jsonAttributes = [];
    this._geometryAttributes = [];
    this._virtualAttributes = [];
    this._defaultValues = {};
    this.prototype.validators = {};

    this.fieldRawAttributesMap = {};

    this.primaryKeys = {};
    this.options.uniqueKeys = {};

    _.each(this.rawAttributes, (definition, name) => {
      definition.type = this.sequelize.normalizeDataType(definition.type);

      definition.Model = this;
      definition.fieldName = name;
      definition._modelAttribute = true;

      if (definition.field === undefined) {
        definition.field = name;
      }

      if (definition.primaryKey === true) {
        this.primaryKeys[name] = definition;
      }

      this.fieldRawAttributesMap[definition.field] = definition;

      if (definition.type instanceof DataTypes.BOOLEAN) {
        this._booleanAttributes.push(name);
      } else if (definition.type instanceof DataTypes.DATE || definition.type instanceof DataTypes.DATEONLY) {
        this._dateAttributes.push(name);
      } else if (definition.type instanceof DataTypes.HSTORE || DataTypes.ARRAY.is(definition.type, DataTypes.HSTORE)) {
        this._hstoreAttributes.push(name);
      } else if (definition.type instanceof DataTypes.RANGE || DataTypes.ARRAY.is(definition.type, DataTypes.RANGE)) {
        this._rangeAttributes.push(name);
      } else if (definition.type instanceof DataTypes.JSON) {
        this._jsonAttributes.push(name);
      } else if (definition.type instanceof DataTypes.VIRTUAL) {
        this._virtualAttributes.push(name);
      } else if (definition.type instanceof DataTypes.GEOMETRY) {
        this._geometryAttributes.push(name);
      }

      if (definition.hasOwnProperty('defaultValue')) {
        this._defaultValues[name] = Utils._.partial(Utils.toDefaultValue, definition.defaultValue);
      }

      if (definition.hasOwnProperty('unique') && definition.unique !== false) {
        let idxName;
        if (typeof definition.unique === 'object' && definition.unique.hasOwnProperty('name')) {
          idxName = definition.unique.name;
        } else if (typeof definition.unique === 'string') {
          idxName = definition.unique;
        } else {
          idxName = this.tableName + '_' + name + '_unique';
        }

        let idx = this.options.uniqueKeys[idxName] || { fields: [] };
        idx = idx || {fields: [], msg: null};
        idx.fields.push(definition.field);
        idx.msg = idx.msg || definition.unique.msg || null;
        idx.name = idxName || false;
        idx.column = name;

        this.options.uniqueKeys[idxName] = idx;
      }

      if (definition.hasOwnProperty('validate')) {
        this.prototype.validators[name] = definition.validate;
      }

      if (definition.index === true && definition.type instanceof DataTypes.JSONB) {
        this.options.indexes.push({
          fields: [definition.field || name],
          using: 'gin'
        });

        delete definition.index;
      }
    });
    // Create a map of field to attribute names
    this.fieldAttributeMap = Utils._.reduce(this.fieldRawAttributesMap, (map, value, key) => {
      if (key !== value.fieldName) {
        map[key] = value.fieldName;
      }
      return map;
    }, {});

    this.uniqueKeys = this.options.uniqueKeys;

    this._hasBooleanAttributes = !!this._booleanAttributes.length;
    this._isBooleanAttribute = Utils._.memoize(key => this._booleanAttributes.indexOf(key) !== -1);

    this._hasDateAttributes = !!this._dateAttributes.length;
    this._isDateAttribute = Utils._.memoize(key => this._dateAttributes.indexOf(key) !== -1);

    this._hasHstoreAttributes = !!this._hstoreAttributes.length;
    this._isHstoreAttribute = Utils._.memoize(key => this._hstoreAttributes.indexOf(key) !== -1);

    this._hasRangeAttributes = !!this._rangeAttributes.length;
    this._isRangeAttribute = Utils._.memoize(key => this._rangeAttributes.indexOf(key) !== -1);

    this._hasJsonAttributes = !!this._jsonAttributes.length;
    this._isJsonAttribute = Utils._.memoize(key => this._jsonAttributes.indexOf(key) !== -1);

    this._hasVirtualAttributes = !!this._virtualAttributes.length;
    this._isVirtualAttribute = Utils._.memoize(key => this._virtualAttributes.indexOf(key) !== -1);

    this._hasGeometryAttributes = !!this._geometryAttributes.length;
    this._isGeometryAttribute = Utils._.memoize(key => this._geometryAttributes.indexOf(key) !== -1);

    this._hasDefaultValues = !Utils._.isEmpty(this._defaultValues);

    // DEPRECATE: All code base is free from this.attributes now
    //            This should be removed in v5
    this.attributes = this.rawAttributes;

    this.tableAttributes = Utils._.omit(this.rawAttributes, this._virtualAttributes);

    this.prototype._hasCustomGetters = Object.keys(this.prototype._customGetters).length;
    this.prototype._hasCustomSetters = Object.keys(this.prototype._customSetters).length;

    for (const key of Object.keys(attributeManipulation)) {
      if (Model.prototype.hasOwnProperty(key)) {
        this.sequelize.log('Not overriding built-in method from model attribute: ' + key);
        continue;
      }
      Object.defineProperty(this.prototype, key, attributeManipulation[key]);
    }


    this.prototype.rawAttributes = this.rawAttributes;
    this.prototype.attributes = Object.keys(this.prototype.rawAttributes);
    this.prototype._isAttribute = Utils._.memoize(key => this.prototype.attributes.indexOf(key) !== -1);

    // Primary key convenience constiables
    this.primaryKeyAttributes = Object.keys(this.primaryKeys);
    this.primaryKeyAttribute = this.primaryKeyAttributes[0];
    if (this.primaryKeyAttribute) {
      this.primaryKeyField = this.rawAttributes[this.primaryKeyAttribute].field || this.primaryKeyAttribute;
    }

    this._hasPrimaryKeys = this.primaryKeyAttributes.length > 0;
    this._isPrimaryKey = Utils._.memoize(key => this.primaryKeyAttributes.indexOf(key) !== -1);
  }

  /**
   * Remove attribute from model definition
   * @param {String} [attribute]
   */
  static removeAttribute(attribute) {
    delete this.rawAttributes[attribute];
    this.refreshAttributes();
  }

  /**
   * Sync this Model to the DB, that is create the table. Upon success, the callback will be called with the model instance (this)
   * @see {@link Sequelize#sync} for options
   * @return {Promise<this>}
   */
  static sync(options) {
    options = _.extend({}, this.options, options);
    options.hooks = options.hooks === undefined ? true : !!options.hooks;

    const attributes = this.tableAttributes;

    return Promise.try(() => {
      if (options.hooks) {
        return this.runHooks('beforeSync', options);
      }
    }).then(() => {
      if (options.force) {
        return this.drop(options);
      }
    })
      .then(() => this.QueryInterface.createTable(this.getTableName(options), attributes, options, this))
      .then(() => {
        if (options.alter) {
          return this.QueryInterface.describeTable(this.getTableName(options))
            .then(columns => {
              const changes = []; // array of promises to run
              _.each(attributes, (columnDesc, columnName) => {
                if (!columns[columnName]) {
                  changes.push(() => this.QueryInterface.addColumn(this.getTableName(options), columnName, attributes[columnName]));
                }
              });
              _.each(columns, (columnDesc, columnName) => {
                if (!attributes[columnName]) {
                  changes.push(() => this.QueryInterface.removeColumn(this.getTableName(options), columnName, options));
                } else if (!attributes[columnName].primaryKey) {
                  changes.push(() => this.QueryInterface.changeColumn(this.getTableName(options), columnName, attributes[columnName]));
                }
              });
              return changes.reduce((p, fn) => p.then(fn), Promise.resolve());
            });
        }
      })
      .then(() => this.QueryInterface.showIndex(this.getTableName(options), options))
      .then(indexes => {
      // Assign an auto-generated name to indexes which are not named by the user
        this.options.indexes = this.QueryInterface.nameIndexes(this.options.indexes, this.tableName);

        indexes = _.filter(this.options.indexes, item1 =>
          !_.some(indexes, item2 => item1.name === item2.name)
        ).sort((index1, index2) => {
          if (this.sequelize.options.dialect === 'postgres') {
          // move concurrent indexes to the bottom to avoid weird deadlocks
            if (index1.concurrently === true) return 1;
            if (index2.concurrently === true) return -1;
          }

          return 0;
        });

        return Promise.map(indexes, index => this.QueryInterface.addIndex(
          this.getTableName(options),
          _.assign({
            logging: options.logging,
            benchmark: options.benchmark,
            transaction: options.transaction
          }, index),
          this.tableName
        ));
      }).then(() => {
        if (options.hooks) {
          return this.runHooks('afterSync', options);
        }
      }).return(this);
  }

  /**
   * Drop the table represented by this Model
   * @param {Object}   [options]
   * @param {Boolean}  [options.cascade=false]   Also drop all objects depending on this table, such as views. Only works in postgres
   * @param {Function} [options.logging=false]   A function that gets executed while running the query to log the sql.
   * @param {Boolean}  [options.benchmark=false] Pass query execution time in milliseconds as second argument to logging function (options.logging).
   * @return {Promise}
   */
  static drop(options) {
    return this.QueryInterface.dropTable(this.getTableName(options), options);
  }

  static dropSchema(schema) {
    return this.QueryInterface.dropSchema(schema);
  }

  /**
   * Apply a schema to this model. For postgres, this will actually place the schema in front of the table name - `"schema"."tableName"`,
   * while the schema will be prepended to the table name for mysql and sqlite - `'schema.tablename'`.
   *
   * This method is intended for use cases where the same model is needed in multiple schemas. In such a use case it is important
   * to call `model.schema(schema, [options]).sync()` for each model to ensure the models are created in the correct schema.
   *
   * If a single default schema per model is needed, set the `options.schema='schema'` parameter during the `define()` call
   * for the model.
   *
   * @param {String} schema The name of the schema
   * @param {Object} [options]
   * @param {String} [options.schemaDelimiter='.'] The character(s) that separates the schema name from the table name
   * @param {Function} [options.logging=false] A function that gets executed while running the query to log the sql.
   * @param {Boolean}  [options.benchmark=false] Pass query execution time in milliseconds as second argument to logging function (options.logging).
   *
   * @see {@link Sequelize#define} for more information about setting a default schema.
   *
   * @return {this}
   */
  static schema(schema, options) { // testhint options:none

    const clone = class extends this {};
    Object.defineProperty(clone, 'name', {value: this.name});

    clone._schema = schema;

    if (options) {
      if (typeof options === 'string') {
        clone._schemaDelimiter = options;
      } else {
        if (options.schemaDelimiter) {
          clone._schemaDelimiter = options.schemaDelimiter;
        }
      }
    }

    return clone;
  }

  /**
   * Get the tablename of the model, taking schema into account. The method will return The name as a string if the model has no schema,
   * or an object with `tableName`, `schema` and `delimiter` properties.
   *
   * @return {String|Object}
   */
  static getTableName() { // testhint options:none
    return this.QueryGenerator.addSchema(this);
  }

  /**
   * @return {Model}
   */
  static unscoped() {
    return this.scope();
  }

  /**
   * Add a new scope to the model. This is especially useful for adding scopes with includes, when the model you want to include is not available at the time this model is defined.
   *
   * By default this will throw an error if a scope with that name already exists. Pass `override: true` in the options object to silence this error.
   *
   * @param {String}          name The name of the scope. Use `defaultScope` to override the default scope
   * @param {Object|Function} scope
   * @param {Object}          [options]
   * @param {Boolean}         [options.override=false]
   */
  static addScope(name, scope, options) {
    options = _.assign({
      override: false
    }, options);

    if ((name === 'defaultScope' || name in this.options.scopes) && options.override === false) {
      throw new Error('The scope ' + name + ' already exists. Pass { override: true } as options to silence this error');
    }

    this._conformOptions(scope, this);

    if (name === 'defaultScope') {
      this.options.defaultScope = this._scope = scope;
    } else {
      this.options.scopes[name] = scope;
    }
  }

  /**
   * Apply a scope created in `define` to the model. First let's look at how to create scopes:
   * ```js
   * const Model = sequelize.define('model', attributes, {
   *   defaultScope: {
   *     where: {
   *       username: 'dan'
   *     },
   *     limit: 12
   *   },
   *   scopes: {
   *     isALie: {
   *       where: {
   *         stuff: 'cake'
   *       }
   *     },
   *     complexFunction: function(email, accessLevel) {
   *       return {
   *         where: {
   *           email: {
   *             $like: email
   *           },
   *           accesss_level {
   *             $gte: accessLevel
   *           }
   *         }
   *       }
   *     }
   *   }
   * })
   * ```
   * Now, since you defined a default scope, every time you do Model.find, the default scope is appended to your query. Here's a couple of examples:
   * ```js
   * Model.findAll() // WHERE username = 'dan'
   * Model.findAll({ where: { age: { gt: 12 } } }) // WHERE age > 12 AND username = 'dan'
   * ```
   *
   * To invoke scope functions you can do:
   * ```js
   * Model.scope({ method: ['complexFunction' 'dan@sequelize.com', 42]}).findAll()
   * // WHERE email like 'dan@sequelize.com%' AND access_level >= 42
   * ```
   *
   * @param {Array|Object|String|null}    options The scope(s) to apply. Scopes can either be passed as consecutive arguments, or as an array of arguments. To apply simple scopes and scope functions with no arguments, pass them as strings. For scope function, pass an object, with a `method` property. The value can either be a string, if the method does not take any arguments, or an array, where the first element is the name of the method, and consecutive elements are arguments to that method. Pass null to remove all scopes, including the default.
   * @return {Model}                      A reference to the model, with the scope(s) applied. Calling scope again on the returned model will clear the previous scope.
   */
  static scope(option) {
    const self = class extends this {};
    let scope;
    let scopeName;
    Object.defineProperty(self, 'name', {value: this.name});

    self._scope = {};
    self.scoped = true;

    if (!option) {
      return self;
    }

    const options = _.flatten(arguments);
    for (const option of options) {
      scope = null;
      scopeName = null;

      if (_.isPlainObject(option)) {
        if (option.method) {
          if (Array.isArray(option.method) && !!self.options.scopes[option.method[0]]) {
            scopeName = option.method[0];
            scope = self.options.scopes[scopeName].apply(self, option.method.slice(1));
          }
          else if (self.options.scopes[option.method]) {
            scopeName = option.method;
            scope = self.options.scopes[scopeName].apply(self);
          }
        } else {
          scope = option;
        }
      } else {
        if (option === 'defaultScope' && _.isPlainObject(self.options.defaultScope)) {
          scope = self.options.defaultScope;
        } else {
          scopeName = option;
          scope = self.options.scopes[scopeName];

          if (_.isFunction(scope)) {
            scope = scope();
            this._conformOptions(scope, self);
          }
        }
      }

      if (scope) {
        _.assignWith(self._scope, scope, (objectValue, sourceValue, key) => {
          if (key === 'where') {
            return Array.isArray(sourceValue) ? sourceValue : _.assign(objectValue || {}, sourceValue);
          } else if (['attributes', 'include', 'group'].indexOf(key) >= 0 && Array.isArray(objectValue) && Array.isArray(sourceValue)) {
            return objectValue.concat(sourceValue);
          }

          return objectValue ? objectValue : sourceValue;
        });
      } else {
        throw new sequelizeErrors.SequelizeScopeError('Invalid scope ' + scopeName + ' called.');
      }
    }

    return self;
  }

  static all(options) {
    return this.findAll(options);
  }

  /**
   * Search for multiple instances.
   *
   * __Simple search using AND and =__
   * ```js
   * Model.findAll({
   *   where: {
   *     attr1: 42,
   *     attr2: 'cake'
   *   }
   * })
   * ```
   * ```sql
   * WHERE attr1 = 42 AND attr2 = 'cake'
   *```
   *
   * __Using greater than, less than etc.__
   * ```js
   *
   * Model.findAll({
   *   where: {
   *     attr1: {
   *       gt: 50
   *     },
   *     attr2: {
   *       lte: 45
   *     },
   *     attr3: {
   *       in: [1,2,3]
   *     },
   *     attr4: {
   *       ne: 5
   *     }
   *   }
   * })
   * ```
   * ```sql
   * WHERE attr1 > 50 AND attr2 <= 45 AND attr3 IN (1,2,3) AND attr4 != 5
   * ```
   * Possible options are: `$ne, $in, $not, $notIn, $gte, $gt, $lte, $lt, $like, $ilike/$iLike, $notLike, $notILike, $regexp, $notRegexp, '..'/$between, '!..'/$notBetween, '&&'/$overlap, '@>'/$contains, '<@'/$contained`
   *
   * __Queries using OR__
   * ```js
   * Model.findAll({
   *   where: {
   *     name: 'a project',
   *     $or: [
   *       {id: [1, 2, 3]},
   *       {
   *         $and: [
   *           {id: {gt: 10}},
   *           {id: {lt: 100}}
   *         ]
   *       }
   *     ]
   *   }
   * });
   * ```
   * ```sql
   * WHERE `Model`.`name` = 'a project' AND (`Model`.`id` IN (1, 2, 3) OR (`Model`.`id` > 10 AND `Model`.`id` < 100));
   * ```
   *
   * The promise is resolved with an array of Model instances if the query succeeds.
   *
   * __Alias__: _all_
   *
   * @param  {Object}                                                    [options] A hash of options to describe the scope of the search
   * @param  {Object}                                                    [options.where] A hash of attributes to describe your search. See above for examples.
   * @param  {Array<String>|Object}                                      [options.attributes] A list of the attributes that you want to select, or an object with `include` and `exclude` keys. To rename an attribute, you can pass an array, with two elements - the first is the name of the attribute in the DB (or some kind of expression such as `Sequelize.literal`, `Sequelize.fn` and so on), and the second is the name you want the attribute to have in the returned instance
   * @param  {Array<String>}                                             [options.attributes.include] Select all the attributes of the model, plus some additional ones. Useful for aggregations, e.g. `{ attributes: { include: [[sequelize.fn('COUNT', sequelize.col('id')), 'total']] }`
   * @param  {Array<String>}                                             [options.attributes.exclude] Select all the attributes of the model, except some few. Useful for security purposes e.g. `{ attributes: { exclude: ['password'] } }`
   * @param  {Boolean}                                                   [options.paranoid=true] If true, only non-deleted records will be returned. If false, both deleted and non-deleted records will be returned. Only applies if `options.paranoid` is true for the model.
   * @param  {Array<Object|Model|String>}                                [options.include] A list of associations to eagerly load using a left join. Supported is either `{ include: [ Model1, Model2, ...]}` or `{ include: [{ model: Model1, as: 'Alias' }]}` or `{ include: ['Alias']}`. If your association are set up with an `as` (eg. `X.hasMany(Y, { as: 'Z }`, you need to specify Z in the as attribute when eager loading Y).
   * @param  {Model}                                                     [options.include[].model] The model you want to eagerly load
   * @param  {String}                                                    [options.include[].as] The alias of the relation, in case the model you want to eagerly load is aliased. For `hasOne` / `belongsTo`, this should be the singular name, and for `hasMany`, it should be the plural
   * @param  {Association}                                               [options.include[].association] The association you want to eagerly load. (This can be used instead of providing a model/as pair)
   * @param  {Object}                                                    [options.include[].where] Where clauses to apply to the child models. Note that this converts the eager load to an inner join, unless you explicitly set `required: false`
   * @param  {Boolean}                                                   [options.include[].or=false] Whether to bind the ON and WHERE clause together by OR instead of AND.
   * @param  {Object}                                                    [options.include[].on] Supply your own ON condition for the join.
   * @param  {Array<String>}                                             [options.include[].attributes] A list of attributes to select from the child model
   * @param  {Boolean}                                                   [options.include[].required] If true, converts to an inner join, which means that the parent model will only be loaded if it has any matching children. True if `include.where` is set, false otherwise.
   * @param  {Boolean}                                                   [options.include[].separate] If true, runs a separate query to fetch the associated instances, only supported for hasMany associations
   * @param  {Number}                                                    [options.include[].limit] Limit the joined rows, only supported with include.separate=true
   * @param  {Object}                                                    [options.include[].through.where] Filter on the join model for belongsToMany relations
   * @param  {Array}                                                     [options.include[].through.attributes] A list of attributes to select from the join model for belongsToMany relations
   * @param  {Array<Object|Model|String>}                                [options.include[].include] Load further nested related models
   * @param  {Array|Sequelize.fn|Sequelize.col|Sequelize.literal}        [options.order] Specifies an ordering. Using an array, you can provide several columns / functions to order by. Each element can be further wrapped in a two-element array. The first element is the column / function to order by, the second is the direction. For example: `order: [['name', 'DESC']]`. In this way the column will be escaped, but the direction will not.
   * @param  {Number}                                                    [options.limit]
   * @param  {Number}                                                    [options.offset]
   * @param  {Transaction}                                               [options.transaction] Transaction to run query under
   * @param  {String|Object}                                             [options.lock] Lock the selected rows. Possible options are transaction.LOCK.UPDATE and transaction.LOCK.SHARE. Postgres also supports transaction.LOCK.KEY_SHARE, transaction.LOCK.NO_KEY_UPDATE and specific model locks with joins. See [transaction.LOCK for an example](transaction#lock)
   * @param  {Boolean}                                                   [options.raw] Return raw result. See sequelize.query for more information.
   * @param  {Function}                                                  [options.logging=false] A function that gets executed while running the query to log the sql.
   * @param  {Boolean}                                                   [options.benchmark=false] Pass query execution time in milliseconds as second argument to logging function (options.logging).
   * @param  {Object}                                                    [options.having]
   * @param  {String}                                                    [options.searchPath=DEFAULT] An optional parameter to specify the schema search_path (Postgres only)
   * @param  {Boolean|Error}                                             [options.rejectOnEmpty=false] Throws an error when no records found
   *
   * @link   {@link Sequelize.query}
   * @return {Promise<Array<Model>>}
   */
  static findAll(options) {
    if (options !== undefined && !_.isPlainObject(options)) {
      throw new sequelizeErrors.QueryError('The argument passed to findAll must be an options object, use findById if you wish to pass a single primary key value');
    }

    if (options !== undefined && options.attributes) {
      if (!Array.isArray(options.attributes) && !_.isPlainObject(options.attributes)) {
        throw new sequelizeErrors.QueryError('The attributes option must be an array of column names or an object');
      }
    }

    this.warnOnInvalidOptions(options, Object.keys(this.rawAttributes));

    const tableNames = {};
    let originalOptions;

    tableNames[this.getTableName(options)] = true;
    options = Utils.cloneDeep(options);

    _.defaults(options, { hooks: true, rejectOnEmpty: this.options.rejectOnEmpty });

    // set rejectOnEmpty option from model config
    options.rejectOnEmpty = options.rejectOnEmpty || this.options.rejectOnEmpty;

    return Promise.try(() => {
      this._injectScope(options);

      if (options.hooks) {
        return this.runHooks('beforeFind', options);
      }
    }).then(() => {
      this._conformOptions(options, this);
      this._expandIncludeAll(options);

      if (options.hooks) {
        return this.runHooks('beforeFindAfterExpandIncludeAll', options);
      }
    }).then(() => {
      if (options.include) {
        options.hasJoin = true;

        this._validateIncludedElements(options, tableNames);

        // If we're not raw, we have to make sure we include the primary key for deduplication
        if (options.attributes && !options.raw && this.primaryKeyAttribute &&  options.attributes.indexOf(this.primaryKeyAttribute) === -1) {
          options.originalAttributes = options.attributes;
          options.attributes = [this.primaryKeyAttribute].concat(options.attributes);
        }
      }

      if (!options.attributes) {
        options.attributes = Object.keys(this.tableAttributes);
      }

      // whereCollection is used for non-primary key updates
      this.options.whereCollection = options.where || null;

      Utils.mapFinderOptions(options, this);

      options = this._paranoidClause(this, options);

      if (options.hooks) {
        return this.runHooks('beforeFindAfterOptions', options);
      }
    }).then(() => {
      originalOptions = Utils.cloneDeep(options);
      options.tableNames = Object.keys(tableNames);
      return this.QueryInterface.select(this, this.getTableName(options), options);
    }).tap(results => {
      if (options.hooks) {
        return this.runHooks('afterFind', results, options);
      }
    }).then(results => {

      //rejectOnEmpty mode
      if (_.isEmpty(results) && options.rejectOnEmpty) {
        if (typeof options.rejectOnEmpty === 'function') {
          throw new options.rejectOnEmpty();
        } else if (typeof options.rejectOnEmpty === 'object') {
          throw options.rejectOnEmpty;
        } else {
          throw new sequelizeErrors.EmptyResultError();
        }
      }

      return Model._findSeparate(results, originalOptions);
    });
  }

  static warnOnInvalidOptions(options, validColumnNames) {
    if (!_.isPlainObject(options)) {
      return;
    }

    // This list will quickly become dated, but failing to maintain this list just means
    // we won't throw a warning when we should. At least most common cases will forever be covered
    // so we stop throwing erroneous warnings when we shouldn't.
    const validQueryKeywords = ['where', 'attributes', 'paranoid', 'include', 'order', 'limit', 'offset',
      'transaction', 'lock', 'raw', 'logging', 'benchmark', 'having', 'searchPath', 'rejectOnEmpty', 'plain',
      'scope', 'group', 'through', 'defaults', 'distinct', 'primary', 'exception', 'type', 'hooks', 'force',
      'name'];

    const unrecognizedOptions = _.difference(Object.keys(options), validQueryKeywords);
    const unexpectedModelAttributes = _.intersection(unrecognizedOptions, validColumnNames);
    if (!options.where && unexpectedModelAttributes.length > 0) {
      Utils.warn(`Model attributes (${unexpectedModelAttributes.join(', ')}) passed into finder method options of model ${this.name}, but the options.where object is empty. Did you forget to use options.where?`);
    }
  }

  static _findSeparate(results, options) {
    if (!options.include || options.raw || !results) return Promise.resolve(results);

    const original = results;
    if (options.plain) results = [results];

    if (!results.length) return original;

    return Promise.map(options.include, include => {
      if (!include.separate) {
        return Model._findSeparate(
          results.reduce((memo, result) => {
            let associations = result.get(include.association.as);

            // Might be an empty belongsTo relation
            if (!associations) return memo;

            // Force array so we can concat no matter if it's 1:1 or :M
            if (!Array.isArray(associations)) associations = [associations];

            for (let i = 0, len = associations.length; i !== len; ++i) {
              memo.push(associations[i]);
            }
            return memo;
          }, []),
          _.assign(
            {},
            _.omit(options, 'include', 'attributes', 'order', 'where', 'limit', 'plain', 'scope'),
            {include: include.include || []}
          )
        );
      }

      return include.association.get(results, _.assign(
        {},
        _.omit(options, 'include', 'attributes', 'order', 'where', 'limit', 'plain'),
        _.omit(include, 'parent', 'association', 'as')
      )).then(map => {
        for (const result of results) {
          result.set(
            include.association.as,
            map[result.get(include.association.source.primaryKeyAttribute)],
            {
              raw: true
            }
          );
        }
      });
    }).return(original);
  }

  /**
   * Search for a single instance by its primary key.
   *
   * __Alias__: _findByPrimary_
   *
   * @param  {Number|String|Buffer}      id The value of the desired instance's primary key.
   * @param  {Object}                    [options]
   * @param  {Transaction}               [options.transaction] Transaction to run query under
   * @param  {String}                    [options.searchPath=DEFAULT] An optional parameter to specify the schema search_path (Postgres only)
   *
   * @see {@link Model.findAll}           for a full explanation of options
   * @return {Promise<Model>}
   */
  static findById(param, options) {
    // return Promise resolved with null if no arguments are passed
    if ([null, undefined].indexOf(param) !== -1) {
      return Promise.resolve(null);
    }

    options = Utils.cloneDeep(options) || {};

    if (typeof param === 'number' || typeof param === 'string' || Buffer.isBuffer(param)) {
      options.where = {};
      options.where[this.primaryKeyAttribute] = param;
    } else {
      throw new Error('Argument passed to findById is invalid: '+param);
    }

    // Bypass a possible overloaded findOne
    return this.findOne(options);
  }

  /**
   * Search for a single instance. This applies LIMIT 1, so the listener will always be called with a single instance.
   *
   * __Alias__: _find_
   *
   * @param  {Object}                    [options] A hash of options to describe the scope of the search
   * @param  {Transaction}               [options.transaction] Transaction to run query under
   * @param  {String}                    [options.searchPath=DEFAULT] An optional parameter to specify the schema search_path (Postgres only)
   *
   * @see {@link Model.findAll}           for an explanation of options
   * @return {Promise<Model>}
   */
  static findOne(options) {
    if (options !== undefined && !_.isPlainObject(options)) {
      throw new Error('The argument passed to findOne must be an options object, use findById if you wish to pass a single primary key value');
    }
    options = Utils.cloneDeep(options);

    if (options.limit === undefined) {
      const pkVal = options.where && options.where[this.primaryKeyAttribute];

      // Don't add limit if querying directly on the pk
      if (!options.where || !(Utils.isPrimitive(pkVal) || Buffer.isBuffer(pkVal))) {
        options.limit = 1;
      }
    }

    // Bypass a possible overloaded findAll.
    return this.findAll(_.defaults(options, {
      plain: true,
      rejectOnEmpty: false
    }));
  }

  /**
   * Run an aggregation method on the specified field
   *
   * @param {String}          field The field to aggregate over. Can be a field name or *
   * @param {String}          aggregateFunction The function to use for aggregation, e.g. sum, max etc.
   * @param {Object}          [options] Query options. See sequelize.query for full options
   * @param {Object}          [options.where] A hash of search attributes.
   * @param {Function}        [options.logging=false] A function that gets executed while running the query to log the sql.
   * @param {Boolean}         [options.benchmark=false] Pass query execution time in milliseconds as second argument to logging function (options.logging).
   * @param {DataTypes|String} [options.dataType] The type of the result. If `field` is a field in this Model, the default will be the type of that field, otherwise defaults to float.
   * @param {boolean}         [options.distinct] Applies DISTINCT to the field being aggregated over
   * @param {Transaction}     [options.transaction] Transaction to run query under
   * @param {Boolean}         [options.plain] When `true`, the first returned value of `aggregateFunction` is cast to `dataType` and returned. If additional attributes are specified, along with `group` clauses, set `plain` to `false` to return all values of all returned rows.  Defaults to `true`
   *
   * @return {Promise<DataTypes|object>}                Returns the aggregate result cast to `options.dataType`, unless `options.plain` is false, in which case the complete data result is returned.
   */
  static aggregate(attribute, aggregateFunction, options) {
    options = Utils.cloneDeep(options);
    options = _.defaults(options, { attributes: [] });
    this._conformOptions(options, this);
    this._injectScope(options);

    if (options.include) {
      this._expandIncludeAll(options);
      this._validateIncludedElements(options);
    }

    const attrOptions = this.rawAttributes[attribute];
    const field = attrOptions && attrOptions.field || attribute;
    let aggregateColumn = this.sequelize.col(field);

    if (options.distinct) {
      aggregateColumn = this.sequelize.fn('DISTINCT', aggregateColumn);
    }
    options.attributes.push([this.sequelize.fn(aggregateFunction, aggregateColumn), aggregateFunction]);

    if (!options.dataType) {
      if (attrOptions) {
        options.dataType = attrOptions.type;
      } else {
        // Use FLOAT as fallback
        options.dataType = new DataTypes.FLOAT();
      }
    } else {
      options.dataType = this.sequelize.normalizeDataType(options.dataType);
    }

    Utils.mapOptionFieldNames(options, this);
    options = this._paranoidClause(this, options);

    return this.QueryInterface.rawSelect(this.getTableName(options), options, aggregateFunction, this);
  }

  /**
   * Count the number of records matching the provided where clause.
   *
   * If you provide an `include` option, the number of matching associations will be counted instead.
   *
   * @param {Object}        [options]
   * @param {Object}        [options.where] A hash of search attributes.
   * @param {Object}        [options.include] Include options. See `find` for details
   * @param {Boolean}       [options.paranoid=true] Set `true` to count only non-deleted records. Can be used on models with `paranoid` enabled
   * @param {Boolean}       [options.distinct] Apply COUNT(DISTINCT(col)) on primary key or on options.col.
   * @param {String}        [options.col] Column on which COUNT() should be applied
   * @param {Object}        [options.attributes] Used in conjunction with `group`
   * @param {Object}        [options.group] For creating complex counts. Will return multiple rows as needed.
   * @param {Transaction}   [options.transaction] Transaction to run query under
   * @param {Function}      [options.logging=false] A function that gets executed while running the query to log the sql.
   * @param {Boolean}       [options.benchmark=false] Pass query execution time in milliseconds as second argument to logging function (options.logging).
   * @param {String}        [options.searchPath=DEFAULT] An optional parameter to specify the schema search_path (Postgres only)
   *
   * @return {Promise<Integer>}
   */
  static count(options) {
    return Promise.try(() => {
      options = _.defaults(Utils.cloneDeep(options), { hooks: true });
      if (options.hooks) {
        return this.runHooks('beforeCount', options);
      }
    }).then(() => {
      let col = options.col || '*';
      if (options.include) {
        col = this.name + '.' + (options.col || this.primaryKeyField);
      }

      Utils.mapOptionFieldNames(options, this);

      options.plain = !options.group;
      options.dataType = new DataTypes.INTEGER();
      options.includeIgnoreAttributes = false;

      // No limit, offset or order for the options max be given to count()
      // Set them to null to prevent scopes setting those values
      options.limit = null;
      options.offset = null;
      options.order = null;

      return this.aggregate(col, 'count', options);
    });
  }

  /**
   * Find all the rows matching your query, within a specified offset / limit, and get the total number of rows matching your query. This is very useful for paging
   *
   * ```js
   * Model.findAndCountAll({
   *   where: ...,
   *   limit: 12,
   *   offset: 12
   * }).then(result => {
   *   ...
   * })
   * ```
   * In the above example, `result.rows` will contain rows 13 through 24, while `result.count` will return the total number of rows that matched your query.
   *
   * When you add includes, only those which are required (either because they have a where clause, or because `required` is explicitly set to true on the include) will be added to the count part.
   *
   * Suppose you want to find all users who have a profile attached:
   * ```js
   * User.findAndCountAll({
   *   include: [
   *      { model: Profile, required: true}
   *   ],
   *   limit 3
   * });
   * ```
   * Because the include for `Profile` has `required` set it will result in an inner join, and only the users who have a profile will be counted. If we remove `required` from the include, both users with and without profiles will be counted
   *
   * __Alias__: _findAndCountAll_
   *
   * @param {Object} [findOptions] See findAll
   *
   * @see {@link Model.findAll} for a specification of find and query options
   * @return {Promise<{count: Integer, rows: Model[]}>}
   */
  static findAndCount(options) {
    if (options !== undefined && !_.isPlainObject(options)) {
      throw new Error('The argument passed to findAndCount must be an options object, use findById if you wish to pass a single primary key value');
    }

    const countOptions = Utils.cloneDeep(options);
    if (countOptions.attributes) {
      countOptions.attributes = undefined;
    }

    const countQuery = this.count(countOptions);
    const findQuery = this.findAll(options);

    return countQuery.then(count => {
      if (count === 0) {
        return {
          count: 0,
          rows: []
        };
      }
      return findQuery.then(results => ({
        count: count || 0,
        rows: results
      }));
    });
  }

  /**
   * Find the maximum value of field
   *
   * @param {String} field
   * @param {Object} [options] See aggregate
   * @see {@link Model#aggregate} for options
   *
   * @return {Promise<Any>}
   */
  static max(field, options) {
    return this.aggregate(field, 'max', options);
  }

  /**
   * Find the minimum value of field
   *
   * @param {String} field
   * @param {Object} [options] See aggregate
   * @see {@link Model#aggregate} for options
   *
   * @return {Promise<Any>}
   */
  static min(field, options) {
    return this.aggregate(field, 'min', options);
  }

  /**
   * Find the sum of field
   *
   * @param {String} field
   * @param {Object} [options] See aggregate
   * @see {@link Model#aggregate} for options
   *
   * @return {Promise<Number>}
   */
  static sum(field, options) {
    return this.aggregate(field, 'sum', options);
  }

  /**
   * Builds a new model instance.
   *
   * @param {Object}  [(values|values[])={}] An object of key value pairs or an array of such. If an array, the function will return an array of instances.
   * @param {Object}  [options]
   * @param {Boolean} [options.raw=false] If set to true, values will ignore field and virtual setters.
   * @param {Boolean} [options.isNewRecord=true]
   * @param {Array}   [options.include] an array of include options - Used to build prefetched/included model instances. See `set`
   *
   * @return {(Model|Model[])}
   */
  static build(values, options) { // testhint options:none
    if (Array.isArray(values)) {
      return this.bulkBuild(values, options);
    }

    return new this(values, options);
  }

  static bulkBuild(valueSets, options) { // testhint options:none
    options = _.extend({
      isNewRecord: true
    }, options || {});

    if (!options.includeValidated) {
      this._conformOptions(options, this);
      if (options.include) {
        this._expandIncludeAll(options);
        this._validateIncludedElements(options);
      }
    }

    if (options.attributes) {
      options.attributes = options.attributes.map(attribute => Array.isArray(attribute) ? attribute[1] : attribute);
    }

    return valueSets.map(values => this.build(values, options));
  }

  /**
   * Builds a new model instance and calls save on it.

   * @see {@link Model#build}
   * @see {@link Model#save}
   *
   * @param {Object}        values
   * @param {Object}        [options]
   * @param {Boolean}       [options.raw=false] If set to true, values will ignore field and virtual setters.
   * @param {Boolean}       [options.isNewRecord=true]
   * @param {Array}         [options.include] an array of include options - Used to build prefetched/included model instances. See `set`
   * @param {Array}         [options.fields] If set, only columns matching those in fields will be saved
   * @param {string[]}      [options.fields] An optional array of strings, representing database columns. If fields is provided, only those columns will be validated and saved.
   * @param {Boolean}       [options.silent=false] If true, the updatedAt timestamp will not be updated.
   * @param {Boolean}       [options.validate=true] If false, validations won't be run.
   * @param {Boolean}       [options.hooks=true] Run before and after create / update + validate hooks
   * @param {Function}      [options.logging=false] A function that gets executed while running the query to log the sql.
   * @param {Boolean}       [options.benchmark=false] Pass query execution time in milliseconds as second argument to logging function (options.logging).
   * @param {Transaction}   [options.transaction] Transaction to run query under
   * @param {String}        [options.searchPath=DEFAULT] An optional parameter to specify the schema search_path (Postgres only)
   * @param  {Boolean}      [options.returning=true] Return the affected rows (only for postgres)
   *
   * @return {Promise<Model>}
   *
   */
  static create(values, options) {
    options = Utils.cloneDeep(options || {});

    return this.build(values, {
      isNewRecord: true,
      attributes: options.fields,
      include: options.include,
      raw: options.raw,
      silent: options.silent
    }).save(options);
  }

  /**
   * Find a row that matches the query, or build (but don't save) the row if none is found.
   * The successful result of the promise will be (instance, initialized) - Make sure to use .spread()
   *
   * __Alias__: _findOrInitialize_
   *
   * @param {Object}   options
   * @param {Object}   options.where A hash of search attributes.
   * @param {Object}   [options.defaults] Default values to use if building a new instance
   * @param {Object}   [options.transaction] Transaction to run query under
   * @param {Function} [options.logging=false] A function that gets executed while running the query to log the sql.
   * @param {Boolean}  [options.benchmark=false] Pass query execution time in milliseconds as second argument to logging function (options.logging).
   *
   * @return {Promise<Model,initialized>}
   */
  static findOrBuild(options) {
    if (!options || !options.where || arguments.length > 1) {
      throw new Error(
        'Missing where attribute in the options parameter passed to findOrInitialize. ' +
        'Please note that the API has changed, and is now options only (an object with where, defaults keys, transaction etc.)'
      );
    }

    let values;

    return this.find(options).then(instance => {
      if (instance === null) {
        values = Utils._.clone(options.defaults) || {};
        if (Utils._.isPlainObject(options.where)) {
          values = Utils._.defaults(values, options.where);
        }

        instance = this.build(values);

        return Promise.resolve([instance, true]);
      }

      return Promise.resolve([instance, false]);
    });
  }

  /**
   * Find a row that matches the query, or build and save the row if none is found
   * The successful result of the promise will be (instance, created) - Make sure to use .spread()
   *
   * If no transaction is passed in the `options` object, a new transaction will be created internally, to prevent the race condition where a matching row is created by another connection after the find but before the insert call.
   * However, it is not always possible to handle this case in SQLite, specifically if one transaction inserts and another tries to select before the first one has committed. In this case, an instance of sequelize. TimeoutError will be thrown instead.
   * If a transaction is created, a savepoint will be created instead, and any unique constraint violation will be handled internally.
   *
   * @param {Object}      options
   * @param {Object}      options.where where A hash of search attributes.
   * @param {Object}      [options.defaults] Default values to use if creating a new instance
   * @param {Transaction} [options.transaction] Transaction to run query under
   * @see {@link Model.findAll} for a full specification of find and options
   * @return {Promise<Model,created>}
   */
  static findOrCreate(options) {
    if (!options || !options.where || arguments.length > 1) {
      throw new Error(
        'Missing where attribute in the options parameter passed to findOrCreate. '+
        'Please note that the API has changed, and is now options only (an object with where, defaults keys, transaction etc.)'
      );
    }

    options = _.assign({}, options);

    if (options.transaction === undefined && this.sequelize.constructor._cls) {
      const t = this.sequelize.constructor._cls.get('transaction');
      if (t) {
        options.transaction = t;
      }
    }

    const internalTransaction = !options.transaction;
    let values;
    let transaction;

    // Create a transaction or a savepoint, depending on whether a transaction was passed in
    return this.sequelize.transaction(options).then(t => {
      transaction = t;
      options.transaction = t;

      return this.findOne(_.defaults({transaction}, options));
    }).then(instance => {
      if (instance !== null) {
        return [instance, false];
      }

      values = Utils._.clone(options.defaults) || {};
      if (Utils._.isPlainObject(options.where)) {
        values = _.defaults(values, options.where);
      }

      options.exception = true;

      return this.create(values, options).then(instance => {
        if (instance.get(this.primaryKeyAttribute, { raw: true }) === null) {
          // If the query returned an empty result for the primary key, we know that this was actually a unique constraint violation
          throw new this.sequelize.UniqueConstraintError();
        }

        return [instance, true];
      }).catch(this.sequelize.UniqueConstraintError, err => {
        const flattenedWhere = Utils.flattenObjectDeep(options.where);
        const flattenedWhereKeys = _.map(_.keys(flattenedWhere), name => _.last(_.split(name, '.')));
        const whereFields = flattenedWhereKeys.map(name => _.get(this.rawAttributes, `${name}.field`, name));
        const defaultFields = options.defaults && Object.keys(options.defaults).map(name => this.rawAttributes[name].field || name);

        if (defaultFields) {
          if (!_.intersection(Object.keys(err.fields), whereFields).length && _.intersection(Object.keys(err.fields), defaultFields).length) {
            throw err;
          }
        }

        if (_.intersection(Object.keys(err.fields), whereFields).length) {
          _.each(err.fields, (value, key) => {
            const name = this.fieldRawAttributesMap[key].fieldName;
            if (value.toString() !== options.where[name].toString()) {
              throw new Error(`${this.name}#findOrCreate: value used for ${name} was not equal for both the find and the create calls, '${options.where[name]}' vs '${value}'`);
            }
          });
        }

        // Someone must have created a matching instance inside the same transaction since we last did a find. Let's find it!
        return this.findOne(_.defaults({
          transaction: internalTransaction ? null : transaction
        }, options)).then(instance => {
          // Sanity check, ideally we caught this at the defaultFeilds/err.fields check
          // But if we didn't and instance is null, we will throw
          if (instance === null) throw err;
          return [instance, false];
        });
      });
    }).finally(() => {
      if (internalTransaction && transaction) {
        // If we created a transaction internally (and not just a savepoint), we should clean it up
        return transaction.commit();
      }
    });
  }

  /**
   * A more performant findOrCreate that will not work under a transaction (at least not in postgres)
   * Will execute a find call, if empty then attempt to create, if unique constraint then attempt to find again
   *
   * @param {Object}      options
   * @param {Object}      options.where where A hash of search attributes.
   * @param {Object}      [options.defaults] Default values to use if creating a new instance
   * @see {@link Model.findAll} for a full specification of find and options
   * @return {Promise<Model,created>}
   */
  static findCreateFind(options) {
    if (!options || !options.where) {
      throw new Error(
        'Missing where attribute in the options parameter passed to findOrCreate.'
      );
    }

    let values = Utils._.clone(options.defaults) || {};
    if (Utils._.isPlainObject(options.where)) {
      values = _.defaults(values, options.where);
    }


    return this.findOne(options).then(result => {
      if (result) return [result, false];

      return this.create(values, options)
        .then(result => [result, true])
        .catch(this.sequelize.UniqueConstraintError, () => this.findOne(options).then(result => [result, false]));
    });
  }

  /**
   * Insert or update a single row. An update will be executed if a row which matches the supplied values on either the primary key or a unique key is found. Note that the unique index must be defined in your sequelize model and not just in the table. Otherwise you may experience a unique constraint violation, because sequelize fails to identify the row that should be updated.
   *
   * **Implementation details:**
   *
   * * MySQL - Implemented as a single query `INSERT values ON DUPLICATE KEY UPDATE values`
   * * PostgreSQL - Implemented as a temporary function with exception handling: INSERT EXCEPTION WHEN unique_constraint UPDATE
   * * SQLite - Implemented as two queries `INSERT; UPDATE`. This means that the update is executed regardless of whether the row already existed or not
   * * MSSQL - Implemented as a single query using `MERGE` and `WHEN (NOT) MATCHED THEN`
   * **Note** that SQLite returns undefined for created, no matter if the row was created or updated. This is because SQLite always runs INSERT OR IGNORE + UPDATE, in a single query, so there is no way to know whether the row was inserted or not.
   *
   * __Alias__: _insertOrUpdate_
   *
   * @param  {Object}       values
   * @param  {Object}       [options]
   * @param  {Boolean}      [options.validate=true] Run validations before the row is inserted
   * @param  {Array}        [options.fields=Object.keys(this.attributes)] The fields to insert / update. Defaults to all changed fields
   * @param  {Boolean}      [options.hooks=true]  Run before / after upsert hooks?
   * @param  {Transaction}  [options.transaction] Transaction to run query under
   * @param  {Function}     [options.logging=false] A function that gets executed while running the query to log the sql.
   * @param  {Boolean}      [options.benchmark=false] Pass query execution time in milliseconds as second argument to logging function (options.logging).
   * @param  {String}       [options.searchPath=DEFAULT] An optional parameter to specify the schema search_path (Postgres only)
   *
   * @return {Promise<created>} Returns a boolean indicating whether the row was created or updated.
   */
  static upsert(values, options) {
    options = Utils._.extend({
      hooks: true
    }, Utils.cloneDeep(options || {}));

    const createdAtAttr = this._timestampAttributes.createdAt;
    const updatedAtAttr = this._timestampAttributes.updatedAt;
    const hadPrimary = this.primaryKeyField in values || this.primaryKeyAttribute in values;
    const instance = this.build(values);

    if (!options.fields) {
      options.fields = Object.keys(instance._changed);
    }

    return instance.validate(options).then(() => {
      // Map field names
      const updatedDataValues = _.pick(instance.dataValues, Object.keys(instance._changed));
      const insertValues = Utils.mapValueFieldNames(instance.dataValues, instance.attributes, this);
      const updateValues = Utils.mapValueFieldNames(updatedDataValues, options.fields, this);
      const now = Utils.now(this.sequelize.options.dialect);

      // Attach createdAt
      if (createdAtAttr && !updateValues[createdAtAttr]) {
        const field = this.rawAttributes[createdAtAttr].field || createdAtAttr;
        insertValues[field] = this._getDefaultTimestamp(createdAtAttr) || now;
      }
      if (updatedAtAttr && !insertValues[updatedAtAttr]) {
        const field = this.rawAttributes[updatedAtAttr].field || updatedAtAttr;
        insertValues[field] = updateValues[field] = this._getDefaultTimestamp(updatedAtAttr) || now;
      }

      // Build adds a null value for the primary key, if none was given by the user.
      // We need to remove that because of some Postgres technicalities.
      if (!hadPrimary && this.primaryKeyAttribute && !this.rawAttributes[this.primaryKeyAttribute].defaultValue) {
        delete insertValues[this.primaryKeyField];
        delete updateValues[this.primaryKeyField];
      }

      return Promise.try(() => {
        if (options.hooks) {
          return this.runHooks('beforeUpsert', values, options);
        }
      }).then(() => {
        return this.QueryInterface.upsert(this.getTableName(options), insertValues, updateValues, instance.where(), this, options);
      }).tap(result => {
        if (options.hooks) {
          return this.runHooks('afterUpsert', result, options);
        }
      });
    });
  }

  /**
   * Create and insert multiple instances in bulk.
   *
   * The success handler is passed an array of instances, but please notice that these may not completely represent the state of the rows in the DB. This is because MySQL
   * and SQLite do not make it easy to obtain back automatically generated IDs and other default values in a way that can be mapped to multiple records.
   * To obtain Instances for the newly created values, you will need to query for them again.
   *
   * If validation fails, the promise is rejected with an array-like [AggregateError](http://bluebirdjs.com/docs/api/aggregateerror.html)
   *
   * @param  {Array}        records                          List of objects (key/value pairs) to create instances from
   * @param  {Object}       [options]
   * @param  {Array}        [options.fields]                 Fields to insert (defaults to all fields)
   * @param  {Boolean}      [options.validate=false]         Should each row be subject to validation before it is inserted. The whole insert will fail if one row fails validation
   * @param  {Boolean}      [options.hooks=true]             Run before / after bulk create hooks?
   * @param  {Boolean}      [options.individualHooks=false]  Run before / after create hooks for each individual Instance? BulkCreate hooks will still be run if options.hooks is true.
   * @param  {Boolean}      [options.ignoreDuplicates=false] Ignore duplicate values for primary keys? (not supported by postgres)
   * @param  {Array}        [options.updateOnDuplicate]      Fields to update if row key already exists (on duplicate key update)? (only supported by mysql). By default, all fields are updated.
   * @param  {Transaction}  [options.transaction] Transaction to run query under
   * @param  {Function}     [options.logging=false]          A function that gets executed while running the query to log the sql.
   * @param  {Boolean}      [options.benchmark=false] Pass query execution time in milliseconds as second argument to logging function (options.logging).
   * @param  {Boolean}      [options.returning=false] Append RETURNING * to get back auto generated values (Postgres only)
   * @param  {String}       [options.searchPath=DEFAULT] An optional parameter to specify the schema search_path (Postgres only)
   *
   * @return {Promise<Array<Model>>}
   */
  static bulkCreate(records, options) {
    if (!records.length) {
      return Promise.resolve([]);
    }

    options = Utils._.extend({
      validate: false,
      hooks: true,
      individualHooks: false,
      ignoreDuplicates: false
    }, options || {});

    options.fields = options.fields || Object.keys(this.tableAttributes);

    const dialect = this.sequelize.options.dialect;
    if (options.ignoreDuplicates && ['postgres', 'mssql'].indexOf(dialect) !== -1) {
      return Promise.reject(new Error(dialect + ' does not support the \'ignoreDuplicates\' option.'));
    }
    if (options.updateOnDuplicate && dialect !== 'mysql') {
      return Promise.reject(new Error(dialect + ' does not support the \'updateOnDuplicate\' option.'));
    }

    if (options.updateOnDuplicate) {
      // By default, all attributes except 'createdAt' can be updated
      let updatableFields = Utils._.pull(Object.keys(this.tableAttributes), 'createdAt');
      if (Utils._.isArray(options.updateOnDuplicate) && !Utils._.isEmpty(options.updateOnDuplicate)) {
        updatableFields = Utils._.intersection(updatableFields, options.updateOnDuplicate);
      }
      options.updateOnDuplicate = updatableFields;
    }

    options.model = this;

    const createdAtAttr = this._timestampAttributes.createdAt;
    const updatedAtAttr = this._timestampAttributes.updatedAt;
    const now = Utils.now(this.sequelize.options.dialect);

    let instances = records.map(values => this.build(values, {isNewRecord: true}));

    return Promise.try(() => {
      // Run before hook
      if (options.hooks) {
        return this.runHooks('beforeBulkCreate', instances, options);
      }
    }).then(() => {
      // Validate
      if (options.validate) {
        const errors = new Promise.AggregateError();
        const validateOptions = _.clone(options);
        validateOptions.hooks = options.individualHooks;

        return Promise.map(instances, instance =>
          instance.validate(validateOptions).catch(err => {
            errors.push({record: instance, errors: err});
          })
        ).then(() => {
          delete options.skip;
          if (errors.length) {
            throw errors;
          }
        });
      }
    }).then(() => {
      for (const instance of instances) {
        const values = instance.dataValues;

        // set createdAt/updatedAt attributes
        if (createdAtAttr && !values[createdAtAttr]) {
          values[createdAtAttr] = now;
          options.fields.indexOf(createdAtAttr) === -1 && options.fields.push(createdAtAttr);
        }
        if (updatedAtAttr && !values[updatedAtAttr]) {
          values[updatedAtAttr] = now;
          options.fields.indexOf(updatedAtAttr) === -1 && options.fields.push(updatedAtAttr);
        }

        instance.dataValues = Utils.mapValueFieldNames(values, options.fields, this);
      }

      if (options.individualHooks) {
        // Create each instance individually
        return Promise.map(instances, instance => {
          const individualOptions = Utils._.clone(options);
          delete individualOptions.fields;
          delete individualOptions.individualHooks;
          delete individualOptions.ignoreDuplicates;
          individualOptions.validate = false;
          individualOptions.hooks = true;

          return instance.save(individualOptions);
        }).then(_instances => {
          instances = _instances;
        });
      } else {
        // Create all in one query
        // Recreate records from instances to represent any changes made in hooks or validation
        records = instances.map(instance => {
          return Utils._.omit(instance.dataValues, this._virtualAttributes);
        });

        // Map attributes for serial identification
        const attributes = {};
        for (const attr in this.tableAttributes) {
          attributes[this.rawAttributes[attr].field] = this.rawAttributes[attr];
        }

        return this.QueryInterface.bulkInsert(this.getTableName(options), records, options, attributes).then(results => {
          if (Array.isArray(results)) {
            results.forEach((result, i) => {
              instances[i] && instances[i].set(this.primaryKeyAttribute, result[this.primaryKeyField], {raw: true});
            });
          }
          return results;
        });
      }
    }).then(() => {

      // map fields back to attributes
      instances.forEach(instance => {
        for (const attr in this.rawAttributes) {
          if (this.rawAttributes[attr].field &&
              instance.dataValues[this.rawAttributes[attr].field] !== undefined &&
              this.rawAttributes[attr].field !== attr
          ) {
            instance.set(attr, instance.dataValues[this.rawAttributes[attr].field]);
            delete instance.dataValues[this.rawAttributes[attr].field];
          }
        }
        instance.isNewRecord = false;
      });

      // Run after hook
      if (options.hooks) {
        return this.runHooks('afterBulkCreate', instances, options);
      }
    }).then(() => instances);
  }

  /**
   * Truncate all instances of the model. This is a convenient method for Model.destroy({ truncate: true }).
   *
   * @param {object} [options] The options passed to Model.destroy in addition to truncate
   * @param {Boolean|function} [options.cascade = false] Only used in conjunction with TRUNCATE. Truncates  all tables that have foreign-key references to the named table, or to any tables added to the group due to CASCADE.
   * @param {Transaction}      [options.transaction] Transaction to run query under
   * @param {Boolean|function} [options.logging] A function that logs sql queries, or false for no logging
   * @param {Boolean}          [options.benchmark=false] Pass query execution time in milliseconds as second argument to logging function (options.logging).
   * @param {String}           [options.searchPath=DEFAULT] An optional parameter to specify the schema search_path (Postgres only)
   *
   * @return {Promise}
   *
   * @see {@link Model#destroy} for more information
   */
  static truncate(options) {
    options = Utils.cloneDeep(options) || {};
    options.truncate = true;
    return this.destroy(options);
  }

  /**
   * Delete multiple instances, or set their deletedAt timestamp to the current time if `paranoid` is enabled.
   *
   * @param  {Object}       options
   * @param  {Object}       [options.where]                 Filter the destroy
   * @param  {Boolean}      [options.hooks=true]            Run before / after bulk destroy hooks?
   * @param  {Boolean}      [options.individualHooks=false] If set to true, destroy will SELECT all records matching the where parameter and will execute before / after destroy hooks on each row
   * @param  {Number}       [options.limit]                 How many rows to delete
   * @param  {Boolean}      [options.force=false]           Delete instead of setting deletedAt to current timestamp (only applicable if `paranoid` is enabled)
   * @param  {Boolean}      [options.truncate=false]        If set to true, dialects that support it will use TRUNCATE instead of DELETE FROM. If a table is truncated the where and limit options are ignored
   * @param  {Boolean}      [options.cascade=false]         Only used in conjunction with TRUNCATE. Truncates  all tables that have foreign-key references to the named table, or to any tables added to the group due to CASCADE.
   * @param  {Boolean}      [options.restartIdentity=false] Only used in conjunction with TRUNCATE. Automatically restart sequences owned by columns of the truncated table.
   * @param  {Transaction}  [options.transaction] Transaction to run query under
   * @param  {Function}     [options.logging=false]         A function that gets executed while running the query to log the sql.
   * @param  {Boolean}      [options.benchmark=false]       Pass query execution time in milliseconds as second argument to logging function (options.logging).
   * @return {Promise<Integer>} The number of destroyed rows
   */
  static destroy(options) {
    let instances;

    if (!options || !(options.where || options.truncate)) {
      throw new Error('Missing where or truncate attribute in the options parameter of model.destroy.');
    }

    if (!options.truncate && !_.isPlainObject(options.where) && !_.isArray(options.where) && !(options.where instanceof Utils.SequelizeMethod)) {
      throw new Error('Expected plain object, array or sequelize method in the options.where parameter of model.destroy.');
    }

    options = Utils.cloneDeep(options);
    options = _.defaults(options, {
      hooks: true,
      individualHooks: false,
      force: false,
      cascade: false,
      restartIdentity: false
    });

    options.type = QueryTypes.BULKDELETE;
    this._injectScope(options);

    Utils.mapOptionFieldNames(options, this);
    options.model = this;

    return Promise.try(() => {
      // Run before hook
      if (options.hooks) {
        return this.runHooks('beforeBulkDestroy', options);
      }
    }).then(() => {
      // Get daos and run beforeDestroy hook on each record individually
      if (options.individualHooks) {
        return this.findAll({where: options.where, transaction: options.transaction, logging: options.logging, benchmark: options.benchmark})
          .map(instance => this.runHooks('beforeDestroy', instance, options).then(() => instance))
          .then(_instances => {
            instances = _instances;
          });
      }
    }).then(() => {
      // Run delete query (or update if paranoid)
      if (this._timestampAttributes.deletedAt && !options.force) {
        // Set query type appropriately when running soft delete
        options.type = QueryTypes.BULKUPDATE;

        const attrValueHash = {};
        const deletedAtAttribute = this.rawAttributes[this._timestampAttributes.deletedAt];
        const field = this.rawAttributes[this._timestampAttributes.deletedAt].field;
        const where = {};

        where[field] = deletedAtAttribute.hasOwnProperty('defaultValue') ? deletedAtAttribute.defaultValue : null;

        attrValueHash[field] = Utils.now(this.sequelize.options.dialect);
        return this.QueryInterface.bulkUpdate(this.getTableName(options), attrValueHash, _.defaults(where, options.where), options, this.rawAttributes);
      } else {
        return this.QueryInterface.bulkDelete(this.getTableName(options), options.where, options, this);
      }
    }).tap(() => {
      // Run afterDestroy hook on each record individually
      if (options.individualHooks) {
        return Promise.map(instances, instance => this.runHooks('afterDestroy', instance, options));
      }
    }).tap(() => {
      // Run after hook
      if (options.hooks) {
        return this.runHooks('afterBulkDestroy', options);
      }
    });
  }

  /**
   * Restore multiple instances if `paranoid` is enabled.
   *
   * @param  {Object}       options
   * @param  {Object}       [options.where]                 Filter the restore
   * @param  {Boolean}      [options.hooks=true]            Run before / after bulk restore hooks?
   * @param  {Boolean}      [options.individualHooks=false] If set to true, restore will find all records within the where parameter and will execute before / after bulkRestore hooks on each row
   * @param  {Number}       [options.limit]                 How many rows to undelete (only for mysql)
   * @param  {Function}     [options.logging=false]         A function that gets executed while running the query to log the sql.
   * @param  {Boolean}      [options.benchmark=false]       Pass query execution time in milliseconds as second argument to logging function (options.logging).
   * @param  {Transaction}  [options.transaction] Transaction to run query under
   *
   * @return {Promise<undefined>}
   */
  static restore(options) {
    if (!this._timestampAttributes.deletedAt) throw new Error('Model is not paranoid');

    options = Utils._.extend({
      hooks: true,
      individualHooks: false
    }, options || {});

    options.type = QueryTypes.RAW;
    options.model = this;

    let instances;

    Utils.mapOptionFieldNames(options, this);

    return Promise.try(() => {
      // Run before hook
      if (options.hooks) {
        return this.runHooks('beforeBulkRestore', options);
      }
    }).then(() => {
      // Get daos and run beforeRestore hook on each record individually
      if (options.individualHooks) {
        return this.findAll({where: options.where, transaction: options.transaction, logging: options.logging, benchmark: options.benchmark, paranoid: false})
          .map(instance => this.runHooks('beforeRestore', instance, options).then(() => instance))
          .then(_instances => {
            instances = _instances;
          });
      }
    }).then(() => {
      // Run undelete query
      const attrValueHash = {};
      const deletedAtCol = this._timestampAttributes.deletedAt;
      const deletedAtAttribute = this.rawAttributes[deletedAtCol];
      const deletedAtDefaultValue = deletedAtAttribute.hasOwnProperty('defaultValue') ? deletedAtAttribute.defaultValue : null;

      attrValueHash[deletedAtAttribute.field || deletedAtCol] = deletedAtDefaultValue;
      options.omitNull = false;
      return this.QueryInterface.bulkUpdate(this.getTableName(options), attrValueHash, options.where, options, this._timestampAttributes.deletedAt);
    }).tap(() => {
      // Run afterDestroy hook on each record individually
      if (options.individualHooks) {
        return Promise.map(instances, instance => this.runHooks('afterRestore', instance, options));
      }
    }).tap(() => {
      // Run after hook
      if (options.hooks) {
        return this.runHooks('afterBulkRestore', options);
      }
    });
  }

  /**
   * Update multiple instances that match the where options. The promise returns an array with one or two elements. The first element is always the number
   * of affected rows, while the second element is the actual affected rows (only supported in postgres with `options.returning` true.)
   *
   * @param  {Object}       values
   * @param  {Object}       options
   * @param  {Object}       options.where                   Options to describe the scope of the search.
   * @param  {Array}        [options.fields]                Fields to update (defaults to all fields)
   * @param  {Boolean}      [options.validate=true]         Should each row be subject to validation before it is inserted. The whole insert will fail if one row fails validation
   * @param  {Boolean}      [options.hooks=true]            Run before / after bulk update hooks?
   * @param  {Boolean}      [options.sideEffects=true] Whether or not to update the side effects of any virtual setters.
   * @param  {Boolean}      [options.individualHooks=false] Run before / after update hooks?. If true, this will execute a SELECT followed by individual UPDATEs. A select is needed, because the row data needs to be passed to the hooks
   * @param  {Boolean}      [options.returning=false]       Return the affected rows (only for postgres)
   * @param  {Number}       [options.limit]                 How many rows to update (only for mysql and mariadb, implemented as TOP(n) for MSSQL)
   * @param  {Function}     [options.logging=false] A function that gets executed while running the query to log the sql.
   * @param  {Boolean}      [options.benchmark=false] Pass query execution time in milliseconds as second argument to logging function (options.logging).
   * @param  {Transaction}  [options.transaction] Transaction to run query under
   * @param  {Boolean}      [options.silent=false] If true, the updatedAt timestamp will not be updated.
   *
   * @return {Promise<Array<affectedCount,affectedRows>>}
   */
  static update(values, options) {
    this._optionsMustContainWhere(options);

    options = Utils.cloneDeep(options);
    options = _.defaults(options, {
      validate: true,
      hooks: true,
      individualHooks: false,
      returning: false,
      force: false,
      sideEffects: true
    });

    options.type = QueryTypes.BULKUPDATE;

    this._injectScope(options);

    // Clone values so it doesn't get modified for caller scope
    values = _.clone(values);

    // Remove values that are not in the options.fields
    if (options.fields && options.fields instanceof Array) {
      for (const key of Object.keys(values)) {
        if (options.fields.indexOf(key) < 0) {
          delete values[key];
        }
      }
    } else {
      const updatedAtAttr = this._timestampAttributes.updatedAt;
      options.fields = _.intersection(Object.keys(values), Object.keys(this.tableAttributes));
      if (updatedAtAttr && options.fields.indexOf(updatedAtAttr) === -1) {
        options.fields.push(updatedAtAttr);
      }
    }

    if (this._timestampAttributes.updatedAt && !options.silent) {
      values[this._timestampAttributes.updatedAt] = this._getDefaultTimestamp(this._timestampAttributes.updatedAt) || Utils.now(this.sequelize.options.dialect);
    }

    options.model = this;

    let instances;
    let valuesUse;

    return Promise.try(() => {
      // Validate
      if (options.validate) {
        const build = this.build(values);
        build.set(this._timestampAttributes.updatedAt, values[this._timestampAttributes.updatedAt], { raw: true });

        if (options.sideEffects) {
          values = Utils._.assign(values, Utils._.pick(build.get(), build.changed()));
          options.fields = Utils._.union(options.fields, Object.keys(values));
        }

        // We want to skip validations for all other fields
        options.skip = Utils._.difference(Object.keys(this.rawAttributes), Object.keys(values));
        return build.validate(options).then(attributes => {
          options.skip = undefined;
          if (attributes && attributes.dataValues) {
            values = Utils._.pick(attributes.dataValues, Object.keys(values));
          }
        });
      }
      return null;
    }).then(() => {
      // Run before hook
      if (options.hooks) {
        options.attributes = values;
        return this.runHooks('beforeBulkUpdate', options).then(() => {
          values = options.attributes;
          delete options.attributes;
        });
      }
      return null;
    }).then(() => {
      valuesUse = values;

      // Get instances and run beforeUpdate hook on each record individually
      if (options.individualHooks) {
        return this.findAll({where: options.where, transaction: options.transaction, logging: options.logging, benchmark: options.benchmark}).then(_instances => {
          instances = _instances;
          if (!instances.length) {
            return [];
          }

          // Run beforeUpdate hooks on each record and check whether beforeUpdate hook changes values uniformly
          // i.e. whether they change values for each record in the same way
          let changedValues;
          let different = false;

          return Promise.map(instances, instance => {
            // Record updates in instances dataValues
            Utils._.extend(instance.dataValues, values);
            // Set the changed fields on the instance
            Utils._.forIn(valuesUse, (newValue, attr) => {
              if (newValue !== instance._previousDataValues[attr]) {
                instance.setDataValue(attr, newValue);
              }
            });

            // Run beforeUpdate hook
            return this.runHooks('beforeUpdate', instance, options).then(() => {
              if (!different) {
                const thisChangedValues = {};
                Utils._.forIn(instance.dataValues, (newValue, attr) => {
                  if (newValue !== instance._previousDataValues[attr]) {
                    thisChangedValues[attr] = newValue;
                  }
                });

                if (!changedValues) {
                  changedValues = thisChangedValues;
                } else {
                  different = !Utils._.isEqual(changedValues, thisChangedValues);
                }
              }

              return instance;
            });
          }).then(_instances => {
            instances = _instances;

            if (!different) {
              const keys = Object.keys(changedValues);
              // Hooks do not change values or change them uniformly
              if (keys.length) {
                // Hooks change values - record changes in valuesUse so they are executed
                valuesUse = changedValues;
                options.fields = Utils._.union(options.fields, keys);
              }
              return;
            } else {
              // Hooks change values in a different way for each record
              // Do not run original query but save each record individually
              return Promise.map(instances, instance => {
                const individualOptions = Utils._.clone(options);
                delete individualOptions.individualHooks;
                individualOptions.hooks = false;
                individualOptions.validate = false;

                return instance.save(individualOptions);
              }).tap(_instances => {
                instances = _instances;
              });
            }
          });
        });
      }
    }).then(results => {
      if (results) {
        // Update already done row-by-row - exit
        return [results.length, results];
      }

      valuesUse = Utils.mapValueFieldNames(valuesUse, options.fields, this);
      options = Utils.mapOptionFieldNames(options, this);
      options.hasTrigger =  this.options ? this.options.hasTrigger : false;

      // Run query to update all rows
      return this.QueryInterface.bulkUpdate(this.getTableName(options), valuesUse, options.where, options, this.tableAttributes).then(affectedRows => {
        if (options.returning) {
          instances = affectedRows;
          return [affectedRows.length, affectedRows];
        }

        return [affectedRows];
      });
    }).tap(result => {
      if (options.individualHooks) {
        return Promise.map(instances, instance => {
          return this.runHooks('afterUpdate', instance, options);
        }).then(() => {
          result[1] = instances;
        });
      }
    }).tap(() => {
      // Run after hook
      if (options.hooks) {
        options.attributes = values;
        return this.runHooks('afterBulkUpdate', options).then(() => {
          delete options.attributes;
        });
      }
    });
  }

  /**
   * Run a describe query on the table. The result will be return to the listener as a hash of attributes and their types.
   *
   * @return {Promise}
   */
  static describe(schema, options) {
    return this.QueryInterface.describeTable(this.tableName, _.assign({schema: schema || this._schema || undefined}, options));
  }

  static _getDefaultTimestamp(attr) {
    if (!!this.rawAttributes[attr] && !!this.rawAttributes[attr].defaultValue) {
      return Utils.toDefaultValue(this.rawAttributes[attr].defaultValue);
    }
    return undefined;
  }

  static _expandAttributes(options) {
    if (_.isPlainObject(options.attributes)) {
      let attributes = Object.keys(this.rawAttributes);

      if (options.attributes.exclude) {
        attributes = attributes.filter(elem => {
          return options.attributes.exclude.indexOf(elem) === -1;
        });
      }
      if (options.attributes.include) {
        attributes = attributes.concat(options.attributes.include);
      }

      options.attributes = attributes;
    }
  }

  // Inject _scope into options. Includes should have been conformed (conformOptions) before calling this
  static _injectScope(options) {
    const scope = Utils.cloneDeep(this._scope);

    const filteredScope = _.omit(scope, 'include'); // Includes need special treatment

    _.defaults(options, filteredScope);
    _.defaults(options.where, filteredScope.where);

    if (scope.include) {
      options.include = options.include || [];

      // Reverse so we consider the latest include first.
      // This is used if several scopes specify the same include - the last scope should take precedence
      for (const scopeInclude of scope.include.reverse()) {
        if (scopeInclude.all || !options.include.some(item => {
          const isSameModel = item.model && item.model.name === scopeInclude.model.name;
          if (!isSameModel || !item.as) return isSameModel;

          if (scopeInclude.as) {
            return item.as === scopeInclude.as;
          } else {
            const association = scopeInclude.association || this.getAssociationForAlias(scopeInclude.model, scopeInclude.as);
            return association ? item.as === association.as : false;
          }
        })) {
          options.include.push(scopeInclude);
        }
      }
    }
  }

  static inspect() {
    return this.name;
  }

  static hasAlias(alias) {
    return this.associations.hasOwnProperty(alias);
  }

  /**
   * Increment the value of one or more columns. This is done in the database, which means it does not use the values currently stored on the Instance. The increment is done using a
   * ```sql
   * SET column = column + X WHERE foo = 'bar'
   * ```
   * query. To get the correct value after an increment into the Instance you should do a reload.
   *
   *```js
  * Model.increment('number', { where: { foo: 'bar' }) // increment number by 1
  * Model.increment(['number', 'count'], { by: 2, where: { foo: 'bar' } }) // increment number and count by 2
  * Model.increment({ answer: 42, tries: -1}, { by: 2, where: { foo: 'bar' } }) // increment answer by 42, and decrement tries by 1.
  *                                                        // `by` is ignored, since each column has its own value
  * ```
  *
  * @see {@link Model#reload}
  * @param {String|Array|Object} fields If a string is provided, that column is incremented by the value of `by` given in options. If an array is provided, the same is true for each column. If and object is provided, each column is incremented by the value given.
  * @param {Object} options
  * @param {Object} options.where
  * @param {Integer} [options.by=1] The number to increment by
  * @param {Boolean} [options.silent=false] If true, the updatedAt timestamp will not be updated.
  * @param {Function} [options.logging=false] A function that gets executed while running the query to log the sql.
  * @param {Transaction} [options.transaction]
  * @param  {String}       [options.searchPath=DEFAULT] An optional parameter to specify the schema search_path (Postgres only)
  *
  * @return {Promise<this>}
  */
  static increment(fields, options) {
    this._optionsMustContainWhere(options);

    const updatedAtAttr = this._timestampAttributes.updatedAt;
    const versionAttr = this._versionAttribute;
    const updatedAtAttribute = this.rawAttributes[updatedAtAttr];
    options = _.defaults({}, options, {
      by: 1,
      attributes: {},
      where: {},
      increment: true
    });

    const where = _.extend({}, options.where);

    let values = {};
    if (Utils._.isString(fields)) {
      values[fields] = options.by;
    } else if (Utils._.isArray(fields)) {
      Utils._.each(fields, field => {
        values[field] = options.by;
      });
    } else { // Assume fields is key-value pairs
      values = fields;
    }

    if (!options.silent && updatedAtAttr && !values[updatedAtAttr]) {
      options.attributes[updatedAtAttribute.field || updatedAtAttr] = this._getDefaultTimestamp(updatedAtAttr) || Utils.now(this.sequelize.options.dialect);
    }
    if (versionAttr) {
      values[versionAttr] = 1;
    }

    for (const attr of Object.keys(values)) {
      // Field name mapping
      if (this.rawAttributes[attr] && this.rawAttributes[attr].field && this.rawAttributes[attr].field !== attr) {
        values[this.rawAttributes[attr].field] = values[attr];
        delete values[attr];
      }
    }

    let promise;
    if (!options.increment) {
      promise = this.sequelize.getQueryInterface().decrement(this, this.getTableName(options), values, where, options);
    } else {
      promise = this.sequelize.getQueryInterface().increment(this, this.getTableName(options), values, where, options);
    }

    return promise.then(affectedRows => {
      if (options.returning) {
        return [affectedRows, affectedRows.length];
      }

      return [affectedRows];
    });
  }

  static _optionsMustContainWhere(options) {
    assert(options && options.where, 'Missing where attribute in the options parameter');
    assert(_.isPlainObject(options.where) || _.isArray(options.where) || options.where instanceof Utils.SequelizeMethod,
      'Expected plain object, array or sequelize method in the options.where parameter');
  }

  /**
   * Builds a new model instance.
   * @param {Object}  [values={}] an object of key value pairs
   * @param {Object}  [options]
   * @param {Boolean} [options.raw=false] If set to true, values will ignore field and virtual setters.
   * @param {Boolean} [options.isNewRecord=true]
   * @param {Array}   [options.include] an array of include options - Used to build prefetched/included model instances. See `set`
   */
  constructor(values, options) {
    values = values || {};
    options = _.extend({
      isNewRecord: true,
      _schema: this.constructor._schema,
      _schemaDelimiter: this.constructor._schemaDelimiter
    }, options || {});

    if (options.attributes) {
      options.attributes = options.attributes.map(attribute => Array.isArray(attribute) ? attribute[1] : attribute);
    }

    if (!options.includeValidated) {
      this.constructor._conformOptions(options, this.constructor);
      if (options.include) {
        this.constructor._expandIncludeAll(options);
        this.constructor._validateIncludedElements(options);
      }
    }

    this.dataValues = {};
    this._previousDataValues = {};
    this._changed = {};
    this._modelOptions = this.constructor.options;
    this._options = options || {};
    this.__eagerlyLoadedAssociations = [];
    /**
     * Returns true if this instance has not yet been persisted to the database
     * @property isNewRecord
     * @return {Boolean}
     */
    this.isNewRecord = options.isNewRecord;

    /**
     * Returns the Model the instance was created from.
     * @see {@link Model}
     * @property Model
     * @return {Model}
     */

    this._initValues(values, options);
  }

  _initValues(values, options) {
    let defaults;
    let key;

    values = values && _.clone(values) || {};

    if (options.isNewRecord) {
      defaults = {};

      if (this.constructor._hasDefaultValues) {
        defaults = _.mapValues(this.constructor._defaultValues, valueFn => {
          const value = valueFn();
          return value && value instanceof Utils.SequelizeMethod ? value : _.cloneDeep(value);
        });
      }

      // set id to null if not passed as value, a newly created dao has no id
      // removing this breaks bulkCreate
      // do after default values since it might have UUID as a default value
      if (this.constructor.primaryKeyAttribute && !defaults.hasOwnProperty(this.constructor.primaryKeyAttribute)) {
        defaults[this.constructor.primaryKeyAttribute] = null;
      }

      if (this.constructor._timestampAttributes.createdAt && defaults[this.constructor._timestampAttributes.createdAt]) {
        this.dataValues[this.constructor._timestampAttributes.createdAt] = Utils.toDefaultValue(defaults[this.constructor._timestampAttributes.createdAt]);
        delete defaults[this.constructor._timestampAttributes.createdAt];
      }

      if (this.constructor._timestampAttributes.updatedAt && defaults[this.constructor._timestampAttributes.updatedAt]) {
        this.dataValues[this.constructor._timestampAttributes.updatedAt] = Utils.toDefaultValue(defaults[this.constructor._timestampAttributes.updatedAt]);
        delete defaults[this.constructor._timestampAttributes.updatedAt];
      }

      if (this.constructor._timestampAttributes.deletedAt && defaults[this.constructor._timestampAttributes.deletedAt]) {
        this.dataValues[this.constructor._timestampAttributes.deletedAt] = Utils.toDefaultValue(defaults[this.constructor._timestampAttributes.deletedAt]);
        delete defaults[this.constructor._timestampAttributes.deletedAt];
      }

      if (Object.keys(defaults).length) {
        for (key in defaults) {
          if (values[key] === undefined) {
            this.set(key, Utils.toDefaultValue(defaults[key]), defaultsOptions);
            delete values[key];
          }
        }
      }
    }

    this.set(values, options);
  }

  /**
   * A reference to the sequelize instance
   * @see {@link Sequelize}
   * @property sequelize
   * @return {Sequelize}
   */
  get sequelize() {
    return this.constructor.sequelize;
  }

  /**
   * Get an object representing the query for this instance, use with `options.where`
   *
   * @property where
   * @return {Object}
   */
  where(checkVersion) {
    const where = this.constructor.primaryKeyAttributes.reduce((result, attribute) => {
      result[attribute] = this.get(attribute, {raw: true});
      return result;
    }, {});

    if (_.size(where) === 0) {
      return this._modelOptions.whereCollection;
    }
    const versionAttr = this.constructor._versionAttribute;
    if (checkVersion && versionAttr) {
      where[versionAttr] = this.get(versionAttr, {raw: true});
    }
    return Utils.mapWhereFieldNames(where, this.constructor);
  }

  toString() {
    return '[object SequelizeInstance:'+this.constructor.name+']';
  }

  /**
   * Get the value of the underlying data value
   *
   * @param {String} key
   * @return {any}
   */
  getDataValue(key) {
    return this.dataValues[key];
  }

  /**
   * Update the underlying data value
   *
   * @param {String} key
   * @param {any} value
   */
  setDataValue(key, value) {
    const originalValue = this._previousDataValues[key];
    if (!Utils.isPrimitive(value) || value !== originalValue) {
      this.changed(key, true);
    }

    this.dataValues[key] = value;
  }

  /**
   * If no key is given, returns all values of the instance, also invoking virtual getters.
   *
   * If key is given and a field or virtual getter is present for the key it will call that getter - else it will return the value for key.
   *
   * @param {String}  [key]
   * @param {Object}  [options]
   * @param {Boolean} [options.plain=false] If set to true, included instances will be returned as plain objects
   * @param {Boolean} [options.raw=false] If set to true, field and virtual setters will be ignored
   * @return {Object|any}
   */
  get(key, options) { // testhint options:none
    if (options === undefined && typeof key === 'object') {
      options = key;
      key = undefined;
    }

    options = options || {};

    if (key) {
      if (this._customGetters[key] && !options.raw) {
        return this._customGetters[key].call(this, key, options);
      }
      if (options.plain && this._options.include && this._options.includeNames.indexOf(key) !== -1) {
        if (Array.isArray(this.dataValues[key])) {
          return this.dataValues[key].map(instance => instance.get(options));
        } else if (this.dataValues[key] instanceof Model) {
          return this.dataValues[key].get(options);
        } else {
          return this.dataValues[key];
        }
      }
      return this.dataValues[key];
    }

    if (this._hasCustomGetters || options.plain && this._options.include || options.clone) {
      const values = {};
      let _key;

      if (this._hasCustomGetters) {
        for (_key in this._customGetters) {
          if (this._customGetters.hasOwnProperty(_key)) {
            values[_key] = this.get(_key, options);
          }
        }
      }

      for (_key in this.dataValues) {
        if (!values.hasOwnProperty(_key) && this.dataValues.hasOwnProperty(_key)) {
          values[_key] = this.get(_key, options);
        }
      }
      return values;
    }
    return this.dataValues;
  }

  /**
   * Set is used to update values on the instance (the sequelize representation of the instance that is, remember that nothing will be persisted before you actually call `save`).
   * In its most basic form `set` will update a value stored in the underlying `dataValues` object. However, if a custom setter function is defined for the key, that function
   * will be called instead. To bypass the setter, you can pass `raw: true` in the options object.
   *
   * If set is called with an object, it will loop over the object, and call set recursively for each key, value pair. If you set raw to true, the underlying dataValues will either be
   * set directly to the object passed, or used to extend dataValues, if dataValues already contain values.
   *
   * When set is called, the previous value of the field is stored and sets a changed flag(see `changed`).
   *
   * Set can also be used to build instances for associations, if you have values for those.
   * When using set with associations you need to make sure the property key matches the alias of the association
   * while also making sure that the proper include options have been set (from .build() or .find())
   *
   * If called with a dot.separated key on a JSON/JSONB attribute it will set the value nested and flag the entire object as changed.
   *
   * @see {@link Model.findAll} for more information about includes
   * @param {String|Object} key
   * @param {any} value
   * @param {Object} [options]
   * @param {Boolean} [options.raw=false] If set to true, field and virtual setters will be ignored
   * @param {Boolean} [options.reset=false] Clear all previously set data values
   */
  set(key, value, options) { // testhint options:none
    let values;
    let originalValue;

    if (typeof key === 'object' && key !== null) {
      values = key;
      options = value || {};

      if (options.reset) {
        this.dataValues = {};
      }

      // If raw, and we're not dealing with includes or special attributes, just set it straight on the dataValues object
      if (options.raw && !(this._options && this._options.include) && !(options && options.attributes) && !this.constructor._hasBooleanAttributes && !this.constructor._hasDateAttributes) {
        if (Object.keys(this.dataValues).length) {
          this.dataValues = _.extend(this.dataValues, values);
        } else {
          this.dataValues = values;
        }
        // If raw, .changed() shouldn't be true
        this._previousDataValues = _.clone(this.dataValues);
      } else {
        // Loop and call set

        if (options.attributes) {
          let keys = options.attributes;
          if (this.constructor._hasVirtualAttributes) {
            keys = keys.concat(this.constructor._virtualAttributes);
          }

          if (this._options.includeNames) {
            keys = keys.concat(this._options.includeNames);
          }

          for (let i = 0, length = keys.length; i < length; i++) {
            if (values[keys[i]] !== undefined) {
              this.set(keys[i], values[keys[i]], options);
            }
          }
        } else {
          for (const key in values) {
            this.set(key, values[key], options);
          }
        }

        if (options.raw) {
          // If raw, .changed() shouldn't be true
          this._previousDataValues = _.clone(this.dataValues);
        }
      }
    } else {
      if (!options)
        options = {};
      if (!options.raw) {
        originalValue = this.dataValues[key];
      }

      // If not raw, and there's a custom setter
      if (!options.raw && this._customSetters[key]) {
        this._customSetters[key].call(this, value, key);
        if (!Utils.isPrimitive(value) && value !== null || value !== originalValue) {
          this._previousDataValues[key] = originalValue;
          this.changed(key, true);
        }
      } else {
        // Check if we have included models, and if this key matches the include model names/aliases

        if (this._options && this._options.include && this._options.includeNames.indexOf(key) !== -1) {
          // Pass it on to the include handler
          this._setInclude(key, value, options);
          return this;
        } else {
          // Bunch of stuff we won't do when its raw
          if (!options.raw) {
            // If attribute is not in model definition, return
            if (!this._isAttribute(key)) {
              if (key.indexOf('.') > -1 && this.constructor._isJsonAttribute(key.split('.')[0])) {
                const previousDottieValue = Dottie.get(this.dataValues, key);
                if (!_.isEqual(previousDottieValue, value)) {
                  Dottie.set(this.dataValues, key, value);
                  this.changed(key.split('.')[0], true);
                }
              }
              return this;
            }

            // If attempting to set primary key and primary key is already defined, return
            if (this.constructor._hasPrimaryKeys && originalValue && this.constructor._isPrimaryKey(key)) {
              return this;
            }

            // If attempting to set read only attributes, return
            if (!this.isNewRecord && this.constructor._hasReadOnlyAttributes && this.constructor._isReadOnlyAttribute(key)) {
              return this;
            }

            // Convert date fields to real date objects
            if (this.constructor._hasDateAttributes && this.constructor._isDateAttribute(key) && !!value && !(value instanceof Utils.SequelizeMethod)) {
              // Dont parse DATEONLY to new Date, keep them as string
              if (this.rawAttributes[key].type instanceof DataTypes.DATEONLY) {
                if (originalValue && originalValue === value) {
                  return this;
                } else {
                  value = moment(value).format('YYYY-MM-DD');
                }
              } else { // go ahread and parse as Date if required
                if (!(value instanceof Date)) {
                  value = new Date(value);
                }
                if (originalValue) {
                  if (!(originalValue instanceof Date)) {
                    originalValue = new Date(originalValue);
                  }
                  if (value.getTime() === originalValue.getTime()) {
                    return this;
                  }
                }
              }
            }
          }

          // Convert boolean-ish values to booleans
          if (this.constructor._hasBooleanAttributes && this.constructor._isBooleanAttribute(key) && value !== null && value !== undefined && !(value instanceof Utils.SequelizeMethod)) {
            if (Buffer.isBuffer(value) && value.length === 1) {
              // Bit fields are returned as buffers
              value = value[0];
            }

            if (_.isString(value)) {
              // Only take action on valid boolean strings.
              value = value === 'true' ? true : value === 'false' ? false : value;

            } else if (_.isNumber(value)) {
              // Only take action on valid boolean integers.
              value = value === 1 ? true : value === 0 ? false : value;
            }
          }

          if (!options.raw && (!Utils.isPrimitive(value) && value !== null || value !== originalValue)) {
            this._previousDataValues[key] = originalValue;
            this.changed(key, true);
          }
          this.dataValues[key] = value;
        }
      }
    }

    return this;
  }

  setAttributes(updates) {
    return this.set(updates);
  }

  /**
   * If changed is called with a string it will return a boolean indicating whether the value of that key in `dataValues` is different from the value in `_previousDataValues`.
   *
   * If changed is called without an argument, it will return an array of keys that have changed.
   *
   * If changed is called without an argument and no keys have changed, it will return `false`.
   *
   * @param {String} [key]
   * @return {Boolean|Array}
   */
  changed(key, value) {
    if (key) {
      if (value !== undefined) {
        this._changed[key] = value;
        return this;
      }
      return this._changed[key] || false;
    }

    const changed = Object.keys(this.dataValues).filter(key => this.changed(key));

    return changed.length ? changed : false;
  }

  /**
   * Returns the previous value for key from `_previousDataValues`.
   *
   * If called without a key, returns the previous values for all values which have changed
   *
   * @param {String} [key]
   * @return {any|Array<any>}
   */
  previous(key) {
    if (key) {
      return this._previousDataValues[key];
    }

    return _.pickBy(this._previousDataValues, (value, key) => this.changed(key));
  }

  _setInclude(key, value, options) {
    if (!Array.isArray(value)) value = [value];
    if (value[0] instanceof Model) {
      value = value.map(instance => instance.dataValues);
    }

    const include = this._options.includeMap[key];
    const association = include.association;
    const accessor = key;
    const primaryKeyAttribute  = include.model.primaryKeyAttribute;
    let childOptions;
    let isEmpty;

    if (!isEmpty) {
      childOptions = {
        isNewRecord: this.isNewRecord,
        include: include.include,
        includeNames: include.includeNames,
        includeMap: include.includeMap,
        includeValidated: true,
        raw: options.raw,
        attributes: include.originalAttributes
      };
    }
    if (include.originalAttributes === undefined || include.originalAttributes.length) {
      if (association.isSingleAssociation) {
        if (Array.isArray(value)) {
          value = value[0];
        }

        isEmpty = value && value[primaryKeyAttribute] === null || value === null;
        this[accessor] = this.dataValues[accessor] = isEmpty ? null : include.model.build(value, childOptions);
      } else {
        isEmpty = value[0] && value[0][primaryKeyAttribute] === null;
        this[accessor] = this.dataValues[accessor] = isEmpty ? [] : include.model.bulkBuild(value, childOptions);
      }
    }
  }

  /**
   * Validate this instance, and if the validation passes, persist it to the database. It will only save changed fields, and do nothing if no fields have changed.
   *
   * On success, the callback will be called with this instance. On validation error, the callback will be called with an instance of `Sequelize.ValidationError`.
   * This error will have a property for each of the fields for which validation failed, with the error message for that field.
   *
   * @param {Object}      [options]
   * @param {string[]}    [options.fields] An optional array of strings, representing database columns. If fields is provided, only those columns will be validated and saved.
   * @param {Boolean}     [options.silent=false] If true, the updatedAt timestamp will not be updated.
   * @param {Boolean}     [options.validate=true] If false, validations won't be run.
   * @param {Boolean}     [options.hooks=true] Run before and after create / update + validate hooks
   * @param {Function}    [options.logging=false] A function that gets executed while running the query to log the sql.
   * @param {Transaction} [options.transaction]
   * @param  {String}     [options.searchPath=DEFAULT] An optional parameter to specify the schema search_path (Postgres only)
   * @param  {Boolean}    [options.returning] Append RETURNING * to get back auto generated values (Postgres only)
   * @return {Promise<this|Errors.ValidationError>}
   */
  save(options) {
    if (arguments.length > 1) {
      throw new Error('The second argument was removed in favor of the options object.');
    }

    options = Utils.cloneDeep(options);
    options = _.defaults(options, {
      hooks: true,
      validate: true
    });

    if (!options.fields) {
      if (this.isNewRecord) {
        options.fields = Object.keys(this.constructor.rawAttributes);
      } else {
        options.fields = _.intersection(this.changed(), Object.keys(this.constructor.rawAttributes));
      }

      options.defaultFields = options.fields;
    }

    if (options.returning === undefined) {
      if (options.association) {
        options.returning = false;
      } else if (this.isNewRecord) {
        options.returning = true;
      }
    }

    const primaryKeyName = this.constructor.primaryKeyAttribute;
    const primaryKeyAttribute = primaryKeyName && this.constructor.rawAttributes[primaryKeyName];
    const createdAtAttr = this.constructor._timestampAttributes.createdAt;
    const versionAttr = this.constructor._versionAttribute;
    const hook = this.isNewRecord ? 'Create' : 'Update';
    const wasNewRecord = this.isNewRecord;
    const now = Utils.now(this.sequelize.options.dialect);
    let updatedAtAttr = this.constructor._timestampAttributes.updatedAt;

    if (updatedAtAttr && options.fields.length >= 1 && options.fields.indexOf(updatedAtAttr) === -1) {
      options.fields.push(updatedAtAttr);
    }
    if (versionAttr && options.fields.length >= 1 && options.fields.indexOf(versionAttr) === -1) {
      options.fields.push(versionAttr);
    }

    if (options.silent === true && !(this.isNewRecord && this.get(updatedAtAttr, {raw: true}))) {
      // UpdateAtAttr might have been added as a result of Object.keys(Model.attributes). In that case we have to remove it again
      Utils._.remove(options.fields, val => val === updatedAtAttr);
      updatedAtAttr = false;
    }

    if (this.isNewRecord === true) {
      if (createdAtAttr && options.fields.indexOf(createdAtAttr) === -1) {
        options.fields.push(createdAtAttr);
      }

      if (primaryKeyAttribute && primaryKeyAttribute.defaultValue && options.fields.indexOf(primaryKeyName) < 0) {
        options.fields.unshift(primaryKeyName);
      }
    }

    if (this.isNewRecord === false) {
      if (primaryKeyName && this.get(primaryKeyName, {raw: true}) === undefined) {
        throw new Error('You attempted to save an instance with no primary key, this is not allowed since it would result in a global update');
      }
    }

    if (updatedAtAttr && !options.silent && options.fields.indexOf(updatedAtAttr) !== -1) {
      this.dataValues[updatedAtAttr] = this.constructor._getDefaultTimestamp(updatedAtAttr) || now;
    }

    if (this.isNewRecord && createdAtAttr && !this.dataValues[createdAtAttr]) {
      this.dataValues[createdAtAttr] = this.constructor._getDefaultTimestamp(createdAtAttr) || now;
    }

    return Promise.try(() => {
      // Validate
      if (options.validate) {
        return this.validate(options);
      }
    }).then(() => {
      // Run before hook
      if (options.hooks) {
        const beforeHookValues = _.pick(this.dataValues, options.fields);
        let ignoreChanged = _.difference(this.changed(), options.fields); // In case of update where it's only supposed to update the passed values and the hook values
        let hookChanged;
        let afterHookValues;

        if (updatedAtAttr && options.fields.indexOf(updatedAtAttr) !== -1) {
          ignoreChanged = _.without(ignoreChanged, updatedAtAttr);
        }

        return this.constructor.runHooks('before' + hook, this, options)
          .then(() => {
            if (options.defaultFields && !this.isNewRecord) {
              afterHookValues = _.pick(this.dataValues, _.difference(this.changed(), ignoreChanged));

              hookChanged = [];
              for (const key of Object.keys(afterHookValues)) {
                if (afterHookValues[key] !== beforeHookValues[key]) {
                  hookChanged.push(key);
                }
              }

              options.fields = _.uniq(options.fields.concat(hookChanged));
            }

            if (hookChanged) {
              if (options.validate) {
              // Validate again

                options.skip = _.difference(Object.keys(this.constructor.rawAttributes), hookChanged);
                return this.validate(options).then(() => {
                  delete options.skip;
                });
              }
            }
          });
      }
    }).then(() => {
      if (!options.fields.length) return this;
      if (!this.isNewRecord) return this;
      if (!this._options.include || !this._options.include.length) return this;

      // Nested creation for BelongsTo relations
      return Promise.map(this._options.include.filter(include => include.association instanceof BelongsTo), include => {
        const instance = this.get(include.as);
        if (!instance) return Promise.resolve();

        const includeOptions =  _(Utils.cloneDeep(include))
          .omit(['association'])
          .defaults({
            transaction: options.transaction,
            logging: options.logging,
            parentRecord: this
          }).value();

        return instance.save(includeOptions).then(() => this[include.association.accessors.set](instance, {save: false, logging: options.logging}));
      });
    }).then(() => {
      const realFields = options.fields.filter(field => !this.constructor._isVirtualAttribute(field));
      if (!realFields.length) return this;
      if (!this.changed() && !this.isNewRecord) return this;

      const versionFieldName = _.get(this.constructor.rawAttributes[versionAttr], 'field') || versionAttr;
      let values = Utils.mapValueFieldNames(this.dataValues, options.fields, this.constructor);
      let query = null;
      let args = [];
      let where;

      if (this.isNewRecord) {
        query = 'insert';
        args = [this, this.constructor.getTableName(options), values, options];
      } else {
        where = this.where(true);
        where = Utils.mapValueFieldNames(where, Object.keys(where), this.constructor);
        if (versionAttr) {
          values[versionFieldName] += 1;
        }
        query = 'update';
        args = [this, this.constructor.getTableName(options), values, where, options];
      }

      return this.sequelize.getQueryInterface()[query].apply(this.sequelize.getQueryInterface(), args)
        .then(results => {
          const result = _.head(results);
          const rowsUpdated = results[1];

          if (versionAttr) {
            // Check to see that a row was updated, otherwise it's an optimistic locking error.
            if (rowsUpdated < 1) {
              throw new sequelizeErrors.OptimisticLockError({
                modelName: this.constructor.name,
                values,
                where
              });
            } else {
              result.dataValues[versionAttr] = values[versionFieldName];
            }
          }

          // Transfer database generated values (defaults, autoincrement, etc)
          for (const attr of Object.keys(this.constructor.rawAttributes)) {
            if (this.constructor.rawAttributes[attr].field &&
                values[this.constructor.rawAttributes[attr].field] !== undefined &&
                this.constructor.rawAttributes[attr].field !== attr
            ) {
              values[attr] = values[this.constructor.rawAttributes[attr].field];
              delete values[this.constructor.rawAttributes[attr].field];
            }
          }
          values = _.extend(values, result.dataValues);

          result.dataValues = _.extend(result.dataValues, values);
          return result;
        })
        .tap(() => {
          if (!wasNewRecord) return this;
          if (!this._options.include || !this._options.include.length) return this;

          // Nested creation for HasOne/HasMany/BelongsToMany relations
          return Promise.map(this._options.include.filter(include => !(include.association instanceof BelongsTo)), include => {
            let instances = this.get(include.as);

            if (!instances) return Promise.resolve();
            if (!Array.isArray(instances)) instances = [instances];
            if (!instances.length) return Promise.resolve();

            const includeOptions =  _(Utils.cloneDeep(include))
              .omit(['association'])
              .defaults({
                transaction: options.transaction,
                logging: options.logging,
                parentRecord: this
              }).value();

            // Instances will be updated in place so we can safely treat HasOne like a HasMany
            return Promise.map(instances, instance => {
              if (include.association instanceof BelongsToMany) {
                return instance.save(includeOptions).then(() => {
                  const values = {};
                  values[include.association.foreignKey] = this.get(this.constructor.primaryKeyAttribute, {raw: true});
                  values[include.association.otherKey] = instance.get(instance.constructor.primaryKeyAttribute, {raw: true});
                  // Include values defined in the scope of the association
                  _.assign(values, include.association.through.scope);
                  return include.association.throughModel.create(values, includeOptions);
                });
              } else {
                instance.set(include.association.foreignKey, this.get(this.constructor.primaryKeyAttribute, {raw: true}));
                return instance.save(includeOptions);
              }
            });
          });
        })
        .tap(result => {
          // Run after hook
          if (options.hooks) {
            return this.constructor.runHooks('after' + hook, result, options);
          }
        })
        .then(result => {
          for (const field of options.fields) {
            result._previousDataValues[field] = result.dataValues[field];
            this.changed(field, false);
          }
          this.isNewRecord = false;
          return result;
        });
    });
  }

  /**
  * Refresh the current instance in-place, i.e. update the object with current data from the DB and return the same object.
  * This is different from doing a `find(Instance.id)`, because that would create and return a new instance. With this method,
  * all references to the Instance are updated with the new data and no new objects are created.
  *
  * @see {@link Model.findAll}
  * @param {Object} [options] Options that are passed on to `Model.find`
  * @param {Function} [options.logging=false] A function that gets executed while running the query to log the sql.
  *
  * @return {Promise<this>}
  */
  reload(options) {
    options = _.defaults({}, options, {
      where: this.where(),
      include: this._options.include || null
    });

    return this.constructor.findOne(options)
      .tap(reload => {
        if (!reload) {
          throw new sequelizeErrors.InstanceError(
            'Instance could not be reloaded because it does not exist anymore (find call returned null)'
          );
        }
      })
      .then(reload => {
      // update the internal options of the instance
        this._options = reload._options;
        // re-set instance values
        this.set(reload.dataValues, {
          raw: true,
          reset: true && !options.attributes
        });
        return this;
      });
  }

  /**
  * Validate the attributes of this instance according to validation rules set in the model definition.
  *
  * The promise fulfills if and only if validation successful; otherwise it rejects an Error instance containing { field name : [error msgs] } entries.
  *
  * @param {Object} [options] Options that are passed to the validator
  * @param {Array} [options.skip] An array of strings. All properties that are in this array will not be validated
  * @param {Array} [options.fields] An array of strings. Only the properties that are in this array will be validated
  * @param {Boolean} [options.hooks=true] Run before and after validate hooks
  *
  * @return {Promise<undefined>}
  */
  validate(options) {
    return new InstanceValidator(this, options).validate();
  }

  /**
   * This is the same as calling `set` and then calling `save` but it only saves the
   * exact values passed to it, making it more atomic and safer.
   *
   * @see {@link Model#set}
   * @see {@link Model#save}
   * @param {Object} updates See `set`
   * @param {Object} options See `save`
   *
   * @return {Promise<this>}
   */
  update(values, options) {
    const changedBefore = this.changed() || [];

    options = options || {};
    if (Array.isArray(options)) options = {fields: options};

    options = Utils.cloneDeep(options);
    const setOptions = Utils.cloneDeep(options);
    setOptions.attributes = options.fields;
    this.set(values, setOptions);

    // Now we need to figure out which fields were actually affected by the setter.
    const sideEffects = _.without.apply(this, [this.changed() || []].concat(changedBefore));
    const fields = _.union(Object.keys(values), sideEffects);

    if (!options.fields) {
      options.fields = _.intersection(fields, this.changed());
      options.defaultFields = options.fields;
    }

    return this.save(options);
  }

  /**
   * Destroy the row corresponding to this instance. Depending on your setting for paranoid, the row will either be completely deleted, or have its deletedAt timestamp set to the current time.
   *
   * @param {Object}      [options={}]
   * @param {Boolean}     [options.force=false] If set to true, paranoid models will actually be deleted
   * @param {Function}    [options.logging=false] A function that gets executed while running the query to log the sql.
   * @param {Transaction} [options.transaction]
   * @param  {String}       [options.searchPath=DEFAULT] An optional parameter to specify the schema search_path (Postgres only)
   *
   * @return {Promise<undefined>}
   */

  destroy(options) {
    options = Utils._.extend({
      hooks: true,
      force: false
    }, options);

    return Promise.try(() => {
      // Run before hook
      if (options.hooks) {
        return this.constructor.runHooks('beforeDestroy', this, options);
      }
    }).then(() => {
      const where = this.where(true);

      if (this.constructor._timestampAttributes.deletedAt && options.force === false) {
        const attribute = this.constructor.rawAttributes[this.constructor._timestampAttributes.deletedAt];
        const field = attribute.field || this.constructor._timestampAttributes.deletedAt;
        const values = {};

        values[field] = new Date();
        where[field] = attribute.hasOwnProperty('defaultValue') ? attribute.defaultValue : null;

        this.setDataValue(field, values[field]);

        return this.sequelize.getQueryInterface().update(
          this, this.constructor.getTableName(options), values, where, _.defaults({ hooks: false }, options)
        ).then(results => {
          const rowsUpdated = results[1];
          if (this.constructor._versionAttribute && rowsUpdated < 1) {
            throw new sequelizeErrors.OptimisticLockError({
              modelName: this.constructor.name,
              values,
              where
            });
          }
          return _.head(results);
        });
      } else {
        return this.sequelize.getQueryInterface().delete(this, this.constructor.getTableName(options), where, _.assign({ type: QueryTypes.DELETE, limit: null }, options));
      }
    }).tap(() => {
      // Run after hook
      if (options.hooks) {
        return this.constructor.runHooks('afterDestroy', this, options);
      }
    });
  }

  /**
   * Helper method to determine if a instance is "soft deleted".  This is
   * particularly useful if the implementer renamed the `deletedAt` attribute
   * to something different.  This method requires `paranoid` to be enabled.
   *
   * @returns {Boolean}
   */
  isSoftDeleted() {
    if (!this.constructor._timestampAttributes.deletedAt) {
      throw new Error('Model is not paranoid');
    }

    const deletedAtAttribute = this.constructor.rawAttributes[this.constructor._timestampAttributes.deletedAt];
    const defaultValue = deletedAtAttribute.hasOwnProperty('defaultValue') ? deletedAtAttribute.defaultValue : null;
    const deletedAt = this.get(this.constructor._timestampAttributes.deletedAt);
    const isSet = deletedAt !== defaultValue;

    // No need to check the value of deletedAt if it's equal to the default
    // value.  If so return the inverse of `isNotSet` since we are asking if
    // the model *is* soft-deleted.
    if (!isSet) {
      return isSet;
    }

    const now = moment();
    const deletedAtIsInTheFuture = moment(deletedAt).isAfter(now);

    // If deletedAt is a datetime in the future then the model is *not* soft-deleted.
    // Therefore, return the inverse of `deletedAtIsInTheFuture`.
    return !deletedAtIsInTheFuture;
  }

  /**
   * Restore the row corresponding to this instance. Only available for paranoid models.
   *
   * @param {Object}      [options={}]
   * @param {Function}    [options.logging=false] A function that gets executed while running the query to log the sql.
   * @param {Transaction} [options.transaction]
   *
   * @return {Promise<undefined>}
   */
  restore(options) {
    if (!this.constructor._timestampAttributes.deletedAt) throw new Error('Model is not paranoid');

    options = Utils._.extend({
      hooks: true,
      force: false
    }, options);

    return Promise.try(() => {
      // Run before hook
      if (options.hooks) {
        return this.constructor.runHooks('beforeRestore', this, options);
      }
    }).then(() => {
      const deletedAtCol = this.constructor._timestampAttributes.deletedAt;
      const deletedAtAttribute = this.constructor.rawAttributes[deletedAtCol];
      const deletedAtDefaultValue = deletedAtAttribute.hasOwnProperty('defaultValue') ? deletedAtAttribute.defaultValue : null;

      this.setDataValue(deletedAtCol, deletedAtDefaultValue);
      return this.save(_.extend({}, options, {hooks : false, omitNull : false}));
    }).tap(() => {
      // Run after hook
      if (options.hooks) {
        return this.constructor.runHooks('afterRestore', this, options);
      }
    });
  }

  /**
   * Increment the value of one or more columns. This is done in the database, which means it does not use the values currently stored on the Instance. The increment is done using a
   * ```sql
   * SET column = column + X
   * ```
   * query. To get the correct value after an increment into the Instance you should do a reload.
   *
   *```js
  * instance.increment('number') // increment number by 1
  * instance.increment(['number', 'count'], { by: 2 }) // increment number and count by 2
  * instance.increment({ answer: 42, tries: 1}, { by: 2 }) // increment answer by 42, and tries by 1.
  *                                                        // `by` is ignored, since each column has its own value
  * ```
  *
  * @see {@link Model#reload}
  * @param {String|Array|Object} fields If a string is provided, that column is incremented by the value of `by` given in options. If an array is provided, the same is true for each column. If and object is provided, each column is incremented by the value given.
  * @param {Object} [options]
  * @param {Integer} [options.by=1] The number to increment by
  * @param {Boolean} [options.silent=false] If true, the updatedAt timestamp will not be updated.
  * @param {Function} [options.logging=false] A function that gets executed while running the query to log the sql.
  * @param {Transaction} [options.transaction]
  * @param  {String}       [options.searchPath=DEFAULT] An optional parameter to specify the schema search_path (Postgres only)
  *
  * @return {Promise<this>}
  * @since 4.0.0
  */
  increment(fields, options) {
    const identifier = this.where();

    options = Utils.cloneDeep(options);
    options.where = _.extend({}, options.where, identifier);
    options.instance = this;

    return this.constructor.increment(fields, options).return(this);
  }

  /**
   * Decrement the value of one or more columns. This is done in the database, which means it does not use the values currently stored on the Instance. The decrement is done using a
   * ```sql
   * SET column = column - X
   * ```
   * query. To get the correct value after an decrement into the Instance you should do a reload.
   *
   * ```js
   * instance.decrement('number') // decrement number by 1
   * instance.decrement(['number', 'count'], { by: 2 }) // decrement number and count by 2
   * instance.decrement({ answer: 42, tries: 1}, { by: 2 }) // decrement answer by 42, and tries by 1.
   *                                                        // `by` is ignored, since each column has its own value
   * ```
   *
   * @see {@link Model#reload}
   * @param {String|Array|Object} fields If a string is provided, that column is decremented by the value of `by` given in options. If an array is provided, the same is true for each column. If and object is provided, each column is decremented by the value given
   * @param {Object} [options]
   * @param {Integer} [options.by=1] The number to decrement by
   * @param {Boolean} [options.silent=false] If true, the updatedAt timestamp will not be updated.
   * @param {Function} [options.logging=false] A function that gets executed while running the query to log the sql.
   * @param {Transaction} [options.transaction]
   * @param  {String}       [options.searchPath=DEFAULT] An optional parameter to specify the schema search_path (Postgres only)
   *
   * @return {Promise}
   */
  decrement(fields, options) {
    options = _.defaults({ increment: false }, options, {
      by: 1
    });

    return this.increment(fields, options);
  }

  /**
   * Check whether this and `other` Instance refer to the same row
   *
   * @param {Model} other
   * @return {Boolean}
   */
  equals(other) {

    if (!other || !other.constructor) {
      return false;
    }

    if (!(other instanceof this.constructor)) {
      return false;
    }

    return Utils._.every(this.constructor.primaryKeyAttributes, attribute => this.get(attribute, {raw: true}) === other.get(attribute, {raw: true}));
  }

  /**
   * Check if this is equal to one of `others` by calling equals
   *
   * @param {Array} others
   * @return {Boolean}
   */
  equalsOneOf(others) {
    return _.some(others, other => this.equals(other));
  }

  setValidators(attribute, validators) {
    this.validators[attribute] = validators;
  }

  /**
   * Convert the instance to a JSON representation. Proxies to calling `get` with no keys. This means get all values gotten from the DB, and apply all custom getters.
   *
   * @see {@link Model#get}
   * @return {object}
   */
  toJSON() {
    return Utils._.clone(
      this.get({
        plain: true
      })
    );
  }

  /**
   * Creates a 1:m association between this (the source) and the provided target. The foreign key is added on the target.
   *
   * @param {Model}               target
   * @param {object}              [options]
   * @param {boolean}             [options.hooks=false] Set to true to run before-/afterDestroy hooks when an associated model is deleted because of a cascade. For example if `User.hasOne(Profile, {onDelete: 'cascade', hooks:true})`, the before-/afterDestroy hooks for profile will be called when a user is deleted. Otherwise the profile will be deleted without invoking any hooks
   * @param {string|object}       [options.as] The alias of this model. If you provide a string, it should be plural, and will be singularized using node.inflection. If you want to control the singular version yourself, provide an object with `plural` and `singular` keys. See also the `name` option passed to `sequelize.define`. If you create multiple associations between the same tables, you should provide an alias to be able to distinguish between them. If you provide an alias when creating the association, you should provide the same alias when eager loading and when getting associated models. Defaults to the pluralized name of target
   * @param {string|object}       [options.foreignKey] The name of the foreign key in the target table or an object representing the type definition for the foreign column (see `Sequelize.define` for syntax). When using an object, you can add a `name` property to set the name of the column. Defaults to the name of source + primary key of source
   * @param {string}              [options.sourceKey] The name of the field to use as the key for the association in the source table. Defaults to the primary key of the source table
   * @param {object}              [options.scope] A key/value set that will be used for association create and find defaults on the target. (sqlite not supported for N:M)
   * @param {string}              [options.onDelete='SET&nbsp;NULL|CASCADE'] SET NULL if foreignKey allows nulls, CASCADE if otherwise
   * @param {string}              [options.onUpdate='CASCADE']
   * @param {boolean}             [options.constraints=true] Should on update and on delete constraints be enabled on the foreign key.
   * @returns {HasMany}
   * @example
   * User.hasMany(Profile) // This will add userId to the profile table
   */
  static hasMany(target, options) {} // eslint-disable-line


  /**
   * Create an N:M association with a join table. Defining `through` is required.
   *
   * @param {Model}               target
   * @param {object}              options
   * @param {boolean}             [options.hooks=false] Set to true to run before-/afterDestroy hooks when an associated model is deleted because of a cascade. For example if `User.hasOne(Profile, {onDelete: 'cascade', hooks:true})`, the before-/afterDestroy hooks for profile will be called when a user is deleted. Otherwise the profile will be deleted without invoking any hooks
   * @param {Model|string|object} options.through The name of the table that is used to join source and target in n:m associations. Can also be a sequelize model if you want to define the junction table yourself and add extra attributes to it.
   * @param {Model}               [options.through.model] The model used to join both sides of the N:M association.
   * @param {object}              [options.through.scope] A key/value set that will be used for association create and find defaults on the through model. (Remember to add the attributes to the through model)
   * @param {boolean}             [options.through.unique=true] If true a unique key will be generated from the foreign keys used (might want to turn this off and create specific unique keys when using scopes)
   * @param {string|object}       [options.as] The alias of this association. If you provide a string, it should be plural, and will be singularized using node.inflection. If you want to control the singular version yourself, provide an object with `plural` and `singular` keys. See also the `name` option passed to `sequelize.define`. If you create multiple associations between the same tables, you should provide an alias to be able to distinguish between them. If you provide an alias when creating the association, you should provide the same alias when eager loading and when getting associated models. Defaults to the pluralized name of target
   * @param {string|object}       [options.foreignKey] The name of the foreign key in the join table (representing the source model) or an object representing the type definition for the foreign column (see `Sequelize.define` for syntax). When using an object, you can add a `name` property to set the name of the column. Defaults to the name of source + primary key of source
   * @param {string|object}       [options.otherKey] The name of the foreign key in the join table (representing the target model) or an object representing the type definition for the other column (see `Sequelize.define` for syntax). When using an object, you can add a `name` property to set the name of the column. Defaults to the name of target + primary key of target
   * @param {object}              [options.scope] A key/value set that will be used for association create and find defaults on the target. (sqlite not supported for N:M)
   * @param {boolean}             [options.timestamps=sequelize.options.timestamps] Should the join model have timestamps
   * @param {string}              [options.onDelete='SET&nbsp;NULL|CASCADE'] Cascade if this is a n:m, and set null if it is a 1:m
   * @param {string}              [options.onUpdate='CASCADE']
   * @param {boolean}             [options.constraints=true] Should on update and on delete constraints be enabled on the foreign key.
   * @return {BelongsToMany}
   * @example
   * // Automagically generated join model
   * User.belongsToMany(Project, { through: 'UserProjects' })
   * Project.belongsToMany(User, { through: 'UserProjects' })
   *
   * // Join model with additional attributes
   * const UserProjects = sequelize.define('UserProjects', {
   *   started: Sequelize.BOOLEAN
   * })
   * User.belongsToMany(Project, { through: UserProjects })
   * Project.belongsToMany(User, { through: UserProjects })
   */
  static belongsToMany(target, options) {} // eslint-disable-line

  /**
   * Creates an association between this (the source) and the provided target. The foreign key is added on the target.
   *
   * @param {Model}           target
   * @param {object}          [options]
   * @param {boolean}         [options.hooks=false] Set to true to run before-/afterDestroy hooks when an associated model is deleted because of a cascade. For example if `User.hasOne(Profile, {onDelete: 'cascade', hooks:true})`, the before-/afterDestroy hooks for profile will be called when a user is deleted. Otherwise the profile will be deleted without invoking any hooks
   * @param {string}          [options.as] The alias of this model, in singular form. See also the `name` option passed to `sequelize.define`. If you create multiple associations between the same tables, you should provide an alias to be able to distinguish between them. If you provide an alias when creating the association, you should provide the same alias when eager loading and when getting associated models. Defaults to the singularized name of target
   * @param {string|object}   [options.foreignKey] The name of the foreign key in the target table or an object representing the type definition for the foreign column (see `Sequelize.define` for syntax). When using an object, you can add a `name` property to set the name of the column. Defaults to the name of source + primary key of source
   * @param {string}          [options.onDelete='SET&nbsp;NULL|CASCADE'] SET NULL if foreignKey allows nulls, CASCADE if otherwise
   * @param {string}          [options.onUpdate='CASCADE']
   * @param {boolean}         [options.constraints=true] Should on update and on delete constraints be enabled on the foreign key.
   * @returns {HasOne}
   * @example
   * User.hasOne(Profile) // This will add userId to the profile table
   */
  static hasOne(target, options) {} // eslint-disable-line


  /**
   * Creates an association between this (the source) and the provided target. The foreign key is added on the source.
   *
   * @param {Model}           target
   * @param {object}          [options]
   * @param {boolean}         [options.hooks=false] Set to true to run before-/afterDestroy hooks when an associated model is deleted because of a cascade. For example if `User.hasOne(Profile, {onDelete: 'cascade', hooks:true})`, the before-/afterDestroy hooks for profile will be called when a user is deleted. Otherwise the profile will be deleted without invoking any hooks
   * @param {string}          [options.as] The alias of this model, in singular form. See also the `name` option passed to `sequelize.define`. If you create multiple associations between the same tables, you should provide an alias to be able to distinguish between them. If you provide an alias when creating the association, you should provide the same alias when eager loading and when getting associated models. Defaults to the singularized name of target
   * @param {string|object}   [options.foreignKey] The name of the foreign key in the source table or an object representing the type definition for the foreign column (see `Sequelize.define` for syntax). When using an object, you can add a `name` property to set the name of the column. Defaults to the name of target + primary key of target
   * @param {string}          [options.targetKey] The name of the field to use as the key for the association in the target table. Defaults to the primary key of the target table
   * @param {string}          [options.onDelete='SET&nbsp;NULL|NO&nbsp;ACTION'] SET NULL if foreignKey allows nulls, NO ACTION if otherwise
   * @param {string}          [options.onUpdate='CASCADE']
   * @param {boolean}         [options.constraints=true] Should on update and on delete constraints be enabled on the foreign key.
   * @returns {BelongsTo}
   * @example
   * Profile.belongsTo(User) // This will add userId to the profile table
   */
  static belongsTo(target, options) {} // eslint-disable-line
}

// Aliases
Model.prototype.updateAttributes = Model.prototype.update;

Model._conformOptions = Model._conformOptions;
Model._validateIncludedElements = Model._validateIncludedElements;
Model._expandIncludeAll = Model._expandIncludeAll;
Model.findByPrimary = Model.findById;
Model.find = Model.findOne;
Model.findAndCountAll = Model.findAndCount;
Model.findOrInitialize = Model.findOrBuild;
Model.insertOrUpdate = Model.upsert;

Utils._.extend(Model, associationsMixin);
Hooks.applyTo(Model);

module.exports = Model;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const Promise = __webpack_require__(4);
const debug = Utils.getLogger().debugContext('hooks');

const hookTypes = {
  beforeValidate: {params: 2},
  afterValidate: {params: 2},
  validationFailed: {params: 3},
  beforeCreate: {params: 2},
  afterCreate: {params: 2},
  beforeDestroy: {params: 2},
  afterDestroy: {params: 2},
  beforeRestore: {params: 2},
  afterRestore: {params: 2},
  beforeUpdate: {params: 2},
  afterUpdate: {params: 2},
  beforeSave: {params: 2, proxies: ['beforeUpdate', 'beforeCreate']},
  afterSave: {params: 2, proxies: ['afterUpdate', 'afterCreate']},
  beforeUpsert: {params: 2},
  afterUpsert: {params: 2},
  beforeBulkCreate: {params: 2},
  afterBulkCreate: {params: 2},
  beforeBulkDestroy: {params: 1},
  afterBulkDestroy: {params: 1},
  beforeBulkRestore: {params: 1},
  afterBulkRestore: {params: 1},
  beforeBulkUpdate: {params: 1},
  afterBulkUpdate: {params: 1},
  beforeFind: {params: 1},
  beforeFindAfterExpandIncludeAll: {params: 1},
  beforeFindAfterOptions: {params: 1},
  afterFind: {params: 2},
  beforeCount: {params: 1},
  beforeDefine: {params: 2, sync: true},
  afterDefine: {params: 1, sync: true},
  beforeInit: {params: 2, sync: true},
  afterInit: {params: 1, sync: true},
  beforeConnect: {params: 1},
  afterConnect: {params: 2},
  beforeSync: {params: 1},
  afterSync: {params: 1},
  beforeBulkSync: {params: 1},
  afterBulkSync: {params: 1}
};
exports.hooks = hookTypes;

const hookAliases = {
  beforeDelete: 'beforeDestroy',
  afterDelete: 'afterDestroy',
  beforeBulkDelete: 'beforeBulkDestroy',
  afterBulkDelete: 'afterBulkDestroy',
  beforeConnection: 'beforeConnect'
};
exports.hookAliases = hookAliases;

/**
 * get array of current hook and its proxied hooks combined
 * @private
 */
const getProxiedHooks = hookType =>
  hookTypes[hookType].proxies
    ? hookTypes[hookType].proxies.concat(hookType)
    : [hookType]
;

const Hooks = {
  replaceHookAliases(hooks) {
    Utils._.each(hooks, (hooksArray, name) => {
      // Does an alias for this hook name exist?
      const realHookName = hookAliases[name];
      if (realHookName) {
        // Add the hooks to the actual hook
        hooks[realHookName] = (hooks[realHookName] || []).concat(hooksArray);

        // Delete the alias
        delete hooks[name];
      }
    });

    return hooks;
  },

  runHooks(hooks) {
    if (!hooks) throw new Error('runHooks requires atleast 1 argument');

    const hookArgs = Utils.sliceArgs(arguments, 1);
    let hookType;

    if (typeof hooks === 'string') {
      hookType = hooks;
      hooks = this.options.hooks[hookType] || [];
      if (this.sequelize) hooks = hooks.concat(this.sequelize.options.hooks[hookType] || []);
    }

    if (!Array.isArray(hooks)) {
      hooks = [hooks];
    }

    // synchronous hooks
    if (hookTypes[hookType] && hookTypes[hookType].sync) {
      for (let hook of hooks) {
        if (typeof hook === 'object') {
          hook = hook.fn;
        }

        debug(`running hook(sync) ${hookType}`);
        hook.apply(this, hookArgs);
      }
      return;
    }

    // asynchronous hooks (default)
    return Promise.each(hooks, hook => {
      if (typeof hook === 'object') {
        hook = hook.fn;
      }

      debug(`running hook ${hookType}`);
      return Promise.resolve(hook.apply(this, hookArgs));
    }).return();
  },

  hook() {
    return Hooks.addHook.apply(this, arguments);
  },

  /**
   * Add a hook to the model
   *
   * @param {String}    hookType
   * @param {String}    [name]    Provide a name for the hook function. It can be used to remove the hook later or to order hooks based on some sort of priority system in the future.
   * @param {Function}  fn        The hook function
   *
   * @memberOf Sequelize
   * @memberOf Sequelize.Model
   */
  addHook(hookType, name, fn) {
    if (typeof name === 'function') {
      fn = name;
      name = null;
    }

    debug(`adding hook ${hookType}`);
    hookType = hookAliases[hookType] || hookType;

    // check for proxies, add them too
    hookType = getProxiedHooks(hookType);

    Utils._.each(hookType, type => {
      this.options.hooks[type] = this.options.hooks[type] || [];
      this.options.hooks[type].push(name ? {name, fn} : fn);
    });

    return this;
  },

  /**
   * Remove hook from the model
   *
   * @param {String} hookType
   * @param {String|Function} name
   *
   * @memberOf Sequelize
   * @memberOf Sequelize.Model
   */
  removeHook(hookType, name) {
    hookType = hookAliases[hookType] || hookType;
    const isReference = typeof name === 'function' ? true : false;

    if (!this.hasHook(hookType)) {
      return this;
    }

    Utils.debug(`removing hook ${hookType}`);

    // check for proxies, add them too
    hookType = getProxiedHooks(hookType);

    for (const type of hookType) {
      this.options.hooks[type] = this.options.hooks[type].filter(hook => {
        if (isReference && typeof hook === 'function') {
          return hook !== name; // check if same method
        } else if (!isReference && typeof hook === 'object') {
          return hook.name !== name;
        }
        return true;
      });
    }

    return this;
  },

  /**
   * Check whether the mode has any hooks of this type
   *
   * @param {String}  hookType
   *
   * @alias hasHooks
   * @memberOf Sequelize
   * @memberOf Sequelize.Model
   */
  hasHook(hookType) {
    return this.options.hooks[hookType] && !!this.options.hooks[hookType].length;
  }
};
Hooks.hasHooks = Hooks.hasHook;


function applyTo(target) {
  Utils._.mixin(target, Hooks);

  const allHooks = Object.keys(hookTypes).concat(Object.keys(hookAliases));
  for (const hook of allHooks) {
    target[hook] = function(name, callback) {
      return this.addHook(hook, name, callback);
    };
  }
}
exports.applyTo = applyTo;

/**
 * A hook that is run before validation
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with instance, options
 * @name beforeValidate
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run after validation
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with instance, options
 * @name afterValidate
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run when validation fails
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with instance, options, error. Error is the
 * SequelizeValidationError. If the callback throws an error, it will replace the original validation error.
 * @name validationFailed
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run before creating a single instance
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with attributes, options
 * @name beforeCreate
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run after creating a single instance
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with attributes, options
 * @name afterCreate
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run before creating or updating a single instance, It proxies `beforeCreate` and `beforeUpdate`
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with attributes, options
 * @name beforeSave
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run before upserting
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with attributes, options
 * @name beforeUpsert
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run after upserting
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with attributes, options
 * @name afterUpsert
 * @memberOf Sequelize.Model
 */

/**
  * A hook that is run after creating or updating a single instance, It proxies `afterCreate` and `afterUpdate`
  * @param {String}   name
  * @param {Function} fn   A callback function that is called with attributes, options
  * @name afterSave
  * @memberOf Sequelize.Model
  */

/**
 * A hook that is run before destroying a single instance
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with instance, options
 *
 * @name beforeDestroy
 * @alias beforeDelete
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run after destroying a single instance
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with instance, options
 *
 * @name afterDestroy
 * @alias afterDelete
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run before restoring a single instance
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with instance, options
 *
 * @name beforeRestore
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run after restoring a single instance
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with instance, options
 *
 * @name afterRestore
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run before updating a single instance
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with instance, options
 * @name beforeUpdate
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run after updating a single instance
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with instance, options
 * @name afterUpdate
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run before creating instances in bulk
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with instances, options
 * @name beforeBulkCreate
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run after creating instances in bulk
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with instances, options
 * @name afterBulkCreate
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run before destroying instances in bulk
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with options
 *
 * @name beforeBulkDestroy
 * @alias beforeBulkDelete
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run after destroying instances in bulk
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with options
 *
 * @name afterBulkDestroy
 * @alias afterBulkDelete
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run before restoring instances in bulk
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with options
 *
 * @name beforeBulkRestore
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run after restoring instances in bulk
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with options
 *
 * @name afterBulkRestore
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run before updating instances in bulk
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with options
 * @name beforeBulkUpdate
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run after updating instances in bulk
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with options
 * @name afterBulkUpdate
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run before a find (select) query
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with options
 * @name beforeFind
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run before a find (select) query, after any { include: {all: ...} } options are expanded
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with options
 * @name beforeFindAfterExpandIncludeAll
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run before a find (select) query, after all option parsing is complete
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with options
 * @name beforeFindAfterOptions
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run after a find (select) query
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with instance(s), options
 * @name afterFind
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run before a count query
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with options
 * @name beforeCount
 * @memberOf Sequelize.Model
 */

/**
 * A hook that is run before a define call
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with attributes, options
 * @name beforeDefine
 * @memberOf Sequelize
 */

/**
 * A hook that is run after a define call
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with factory
 * @name afterDefine
 * @memberOf Sequelize
 */

/**
 * A hook that is run before Sequelize() call
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with config, options
 * @name beforeInit
 * @memberOf Sequelize
 */

/**
 * A hook that is run after Sequelize() call
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with sequelize
 * @name afterInit
 * @memberOf Sequelize
 */

/**
 * A hook that is run before a connection is created
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with config passed to connection
 * @name beforeConnect
 * @memberOf Sequelize
 */

/**
 * A hook that is run after a connection is created
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with the connection object and thye config passed to connection
 * @name afterConnect
 * @memberOf Sequelize
 */

/**
 * A hook that is run before Model.sync call
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with options passed to Model.sync
 * @name beforeSync
 * @memberOf Sequelize
 */

/**
 * A hook that is run after Model.sync call
 * @param {String}   name
 * @param {Function} fn   A callback function that is called with options passed to Model.sync
 * @name afterSync
 * @memberOf Sequelize
 */

/**
  * A hook that is run before sequelize.sync call
  * @param {String}   name
  * @param {Function} fn   A callback function that is called with options passed to sequelize.sync
  * @name beforeBulkSync
  * @memberOf Sequelize
  */

/**
  * A hook that is run after sequelize.sync call
  * @param {String}   name
  * @param {Function} fn   A callback function that is called with options passed to sequelize.sync
  * @name afterBulkSync
  * @memberOf Sequelize
  */


/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("tedious");

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const AbstractQueryGenerator = __webpack_require__(26);

const QueryGenerator = {
  __proto__: AbstractQueryGenerator,
  dialect: 'mysql',

  createSchema() {
    return 'SHOW TABLES';
  },

  showSchemasQuery() {
    return 'SHOW TABLES';
  },

  versionQuery() {
    return 'SELECT VERSION() as `version`';
  },

  createTableQuery(tableName, attributes, options) {
    options = Utils._.extend({
      engine: 'InnoDB',
      charset: null,
      rowFormat: null
    }, options || {});

    const query = 'CREATE TABLE IF NOT EXISTS <%= table %> (<%= attributes%>) ENGINE=<%= engine %><%= comment %><%= charset %><%= collation %><%= initialAutoIncrement %><%= rowFormat %>';
    const primaryKeys = [];
    const foreignKeys = {};
    const attrStr = [];

    for (const attr in attributes) {
      if (attributes.hasOwnProperty(attr)) {
        const dataType = attributes[attr];
        let match;

        if (Utils._.includes(dataType, 'PRIMARY KEY')) {
          primaryKeys.push(attr);

          if (Utils._.includes(dataType, 'REFERENCES')) {
            // MySQL doesn't support inline REFERENCES declarations: move to the end
            match = dataType.match(/^(.+) (REFERENCES.*)$/);
            attrStr.push(this.quoteIdentifier(attr) + ' ' + match[1].replace(/PRIMARY KEY/, ''));
            foreignKeys[attr] = match[2];
          } else {
            attrStr.push(this.quoteIdentifier(attr) + ' ' + dataType.replace(/PRIMARY KEY/, ''));
          }
        } else if (Utils._.includes(dataType, 'REFERENCES')) {
          // MySQL doesn't support inline REFERENCES declarations: move to the end
          match = dataType.match(/^(.+) (REFERENCES.*)$/);
          attrStr.push(this.quoteIdentifier(attr) + ' ' + match[1]);
          foreignKeys[attr] = match[2];
        } else {
          attrStr.push(this.quoteIdentifier(attr) + ' ' + dataType);
        }
      }
    }

    const values = {
      table: this.quoteTable(tableName),
      attributes: attrStr.join(', '),
      comment: options.comment && Utils._.isString(options.comment) ? ' COMMENT ' + this.escape(options.comment) : '',
      engine: options.engine,
      charset: options.charset ? ' DEFAULT CHARSET=' + options.charset : '',
      collation: options.collate ? ' COLLATE ' + options.collate : '',
      rowFormat: options.rowFormat ? ' ROW_FORMAT=' + options.rowFormat : '',
      initialAutoIncrement: options.initialAutoIncrement ? ' AUTO_INCREMENT=' + options.initialAutoIncrement : ''
    };
    const pkString = primaryKeys.map(pk => this.quoteIdentifier(pk)).join(', ');

    if (options.uniqueKeys) {
      Utils._.each(options.uniqueKeys, (columns, indexName) => {
        if (!columns.singleField) { // If it's a single field its handled in column def, not as an index
          if (!Utils._.isString(indexName)) {
            indexName = 'uniq_' + tableName + '_' + columns.fields.join('_');
          }
          values.attributes += ', UNIQUE ' + this.quoteIdentifier(indexName) + ' (' + Utils._.map(columns.fields, this.quoteIdentifier).join(', ') + ')';
        }
      });
    }

    if (pkString.length > 0) {
      values.attributes += ', PRIMARY KEY (' + pkString + ')';
    }

    for (const fkey in foreignKeys) {
      if (foreignKeys.hasOwnProperty(fkey)) {
        values.attributes += ', FOREIGN KEY (' + this.quoteIdentifier(fkey) + ') ' + foreignKeys[fkey];
      }
    }

    return Utils._.template(query)(values).trim() + ';';
  },

  showTablesQuery() {
    return 'SHOW TABLES;';
  },

  addColumnQuery(table, key, dataType) {
    const definition = this.attributeToSQL(dataType, {
      context: 'addColumn',
      tableName: table,
      foreignKey: key
    });
    return `ALTER TABLE ${this.quoteTable(table)} ADD ${this.quoteIdentifier(key)} ${definition};`;
  },

  removeColumnQuery(tableName, attributeName) {
    return `ALTER TABLE ${this.quoteTable(tableName)} DROP ${this.quoteIdentifier(attributeName)};`;
  },

  changeColumnQuery(tableName, attributes) {
    const attrString = [];
    const constraintString = [];

    for (const attributeName in attributes) {
      let definition = attributes[attributeName];
      if (definition.match(/REFERENCES/)) {
        const fkName = this.quoteIdentifier(tableName + '_' + attributeName + '_foreign_idx');
        const attrName = this.quoteIdentifier(attributeName);
        definition = definition.replace(/.+?(?=REFERENCES)/, '');
        constraintString.push(`${fkName} FOREIGN KEY (${attrName}) ${definition}`);
      } else {
        attrString.push('`' + attributeName + '` `' + attributeName + '` ' + definition);
      }
    }

    let finalQuery = '';
    if (attrString.length) {
      finalQuery += 'CHANGE ' + attrString.join(', ');
      finalQuery += constraintString.length ? ' ' : '';
    }
    if (constraintString.length) {
      finalQuery += 'ADD CONSTRAINT ' + constraintString.join(', ');
    }

    return `ALTER TABLE ${this.quoteTable(tableName)} ${finalQuery};`;
  },

  renameColumnQuery(tableName, attrBefore, attributes) {
    const attrString = [];

    for (const attrName in attributes) {
      const definition = attributes[attrName];
      attrString.push('`' + attrBefore + '` `' + attrName + '` ' + definition);
    }

    return `ALTER TABLE ${this.quoteTable(tableName)} CHANGE ${attrString.join(', ')};`;
  },

  upsertQuery(tableName, insertValues, updateValues, where, model, options) {
    options.onDuplicate = 'UPDATE ';

    options.onDuplicate += Object.keys(updateValues).map(key => {
      key = this.quoteIdentifier(key);
      return key + '=VALUES(' + key +')';
    }).join(', ');

    return this.insertQuery(tableName, insertValues, model.rawAttributes, options);
  },

  deleteQuery(tableName, where, options) {
    options = options || {};

    const table = this.quoteTable(tableName);
    if (options.truncate === true) {
      // Truncate does not allow LIMIT and WHERE
      return 'TRUNCATE ' + table;
    }

    where = this.getWhereConditions(where);
    let limit = '';

    if (Utils._.isUndefined(options.limit)) {
      options.limit = 1;
    }

    if (options.limit) {
      limit = ' LIMIT ' + this.escape(options.limit);
    }

    let query = 'DELETE FROM ' + table;
    if (where) query += ' WHERE ' + where;
    query += limit;

    return query;
  },

  showIndexesQuery(tableName, options) {
    return 'SHOW INDEX FROM ' + this.quoteTable(tableName) + ((options || {}).database ? ' FROM `' + options.database + '`' : '');
  },

  showConstraintsQuery(tableName, constraintName) {
    let sql = [
      'SELECT CONSTRAINT_CATALOG AS constraintCatalog,',
      'CONSTRAINT_NAME AS constraintName,',
      'CONSTRAINT_SCHEMA AS constraintSchema,',
      'CONSTRAINT_TYPE AS constraintType,',
      'TABLE_NAME AS tableName,',
      'TABLE_SCHEMA AS tableSchema',
      'from INFORMATION_SCHEMA.TABLE_CONSTRAINTS',
      `WHERE table_name='${tableName}'`
    ].join(' ');

    if (constraintName) {
      sql += ` AND constraint_name = '${constraintName}'`;
    }

    return sql + ';';
  },

  removeIndexQuery(tableName, indexNameOrAttributes) {
    let indexName = indexNameOrAttributes;

    if (typeof indexName !== 'string') {
      indexName = Utils.underscore(tableName + '_' + indexNameOrAttributes.join('_'));
    }

    return `DROP INDEX ${this.quoteIdentifier(indexName)} ON ${this.quoteTable(tableName)}`;
  },

  attributeToSQL(attribute, options) {
    if (!Utils._.isPlainObject(attribute)) {
      attribute = {
        type: attribute
      };
    }

    let template = attribute.type.toString({ escape: this.escape.bind(this) });

    if (attribute.allowNull === false) {
      template += ' NOT NULL';
    }

    if (attribute.autoIncrement) {
      template += ' auto_increment';
    }

    // Blobs/texts cannot have a defaultValue
    if (attribute.type !== 'TEXT' && attribute.type._binary !== true && Utils.defaultValueSchemable(attribute.defaultValue)) {
      template += ' DEFAULT ' + this.escape(attribute.defaultValue);
    }

    if (attribute.unique === true) {
      template += ' UNIQUE';
    }

    if (attribute.primaryKey) {
      template += ' PRIMARY KEY';
    }

    if (attribute.after) {
      template += ' AFTER ' + this.quoteIdentifier(attribute.after);
    }

    if (attribute.references) {

      if (options && options.context === 'addColumn' && options.foreignKey) {
        const attrName = this.quoteIdentifier(options.foreignKey);
        const fkName = this.quoteIdentifier(`${options.tableName}_${attrName}_foreign_idx`);

        template += `, ADD CONSTRAINT ${fkName} FOREIGN KEY (${attrName})`;
      }

      template += ' REFERENCES ' + this.quoteTable(attribute.references.model);

      if (attribute.references.key) {
        template += ' (' + this.quoteIdentifier(attribute.references.key) + ')';
      } else {
        template += ' (' + this.quoteIdentifier('id') + ')';
      }

      if (attribute.onDelete) {
        template += ' ON DELETE ' + attribute.onDelete.toUpperCase();
      }

      if (attribute.onUpdate) {
        template += ' ON UPDATE ' + attribute.onUpdate.toUpperCase();
      }
    }

    return template;
  },

  attributesToSQL(attributes, options) {
    const result = {};

    for (const key in attributes) {
      const attribute = attributes[key];
      result[attribute.field || key] = this.attributeToSQL(attribute, options);
    }

    return result;
  },

  quoteIdentifier(identifier) {
    if (identifier === '*') return identifier;
    return Utils.addTicks(Utils.removeTicks(identifier, '`'), '`');
  },

  /**
   * Generates an SQL query that returns all foreign keys of a table.
   *
   * @param  {String} tableName  The name of the table.
   * @param  {String} schemaName The name of the schema.
   * @return {String}            The generated sql query.
   * @private
   */
  getForeignKeysQuery(tableName, schemaName) {
    return "SELECT CONSTRAINT_NAME as constraint_name FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME = '" + tableName + /* jshint ignore: line */
      "' AND CONSTRAINT_NAME!='PRIMARY' AND CONSTRAINT_SCHEMA='" + schemaName + "' AND REFERENCED_TABLE_NAME IS NOT NULL;"; /* jshint ignore: line */
  },

  /**
   * Generates an SQL query that returns the foreign key constraint of a given column.
   *
   * @param  {String} tableName  The name of the table.
   * @param  {String} columnName The name of the column.
   * @return {String}            The generated sql query.
   * @private
   */
  getForeignKeyQuery(table, columnName) {
    let tableName = table.tableName || table;
    if (table.schema) {
      tableName = table.schema + '.' + tableName;
    }
    return 'SELECT CONSTRAINT_NAME as constraint_name'
      + ' FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE'
      + ' WHERE (REFERENCED_TABLE_NAME = ' + wrapSingleQuote(tableName)
      + ' AND REFERENCED_COLUMN_NAME = ' + wrapSingleQuote(columnName)
      + ') OR (TABLE_NAME = ' + wrapSingleQuote(tableName)
      + ' AND COLUMN_NAME = ' + wrapSingleQuote(columnName)
      + ')';
  },

  /**
   * Generates an SQL query that removes a foreign key from a table.
   *
   * @param  {String} tableName  The name of the table.
   * @param  {String} foreignKey The name of the foreign key constraint.
   * @return {String}            The generated sql query.
   * @private
   */
  dropForeignKeyQuery(tableName, foreignKey) {
    return 'ALTER TABLE ' + this.quoteTable(tableName) + ' DROP FOREIGN KEY ' + this.quoteIdentifier(foreignKey) + ';';
  }
};

// private methods
function wrapSingleQuote(identifier) {
  return Utils.addTicks(identifier, '\'');
}

module.exports = QueryGenerator;


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__qiniu__ = __webpack_require__(115);


/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__qiniu__["a" /* default */]);

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models__ = __webpack_require__(6);


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this.url = '/page/:id';
  }

  _createClass(_class, [{
    key: 'delete',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx) {
        var id;
        return __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                id = ctx.params.id;
                _context.next = 3;
                return __WEBPACK_IMPORTED_MODULE_2__models__["a" /* default */].pages.update({
                  is_delete: 1
                }, {
                  where: {
                    id: id
                  }
                });

              case 3:
                _context.next = 5;
                return __WEBPACK_IMPORTED_MODULE_2__models__["a" /* default */].changelog.create({
                  action: 3,
                  page_id: id,
                  items: null,
                  create_by: ctx.state.user.id
                });

              case 5:

                ctx.body = {
                  message: "Delete success"
                };

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _delete(_x) {
        return _ref.apply(this, arguments);
      }

      return _delete;
    }()
  }, {
    key: 'get',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2(ctx) {
        var id, result, page;
        return __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                id = ctx.params.id;
                _context2.next = 3;
                return __WEBPACK_IMPORTED_MODULE_2__models__["a" /* default */].pages.findAll({
                  where: {
                    is_delete: 0,
                    id: id
                  }
                });

              case 3:
                result = _context2.sent;
                page = result[0];

                if (page) {
                  _context2.next = 7;
                  break;
                }

                throw {
                  status: 404,
                  name: "PAGES_NOT_FOUND",
                  message: "page is not found"
                };

              case 7:
                _context2.prev = 7;

                if (page.items) page.items = JSON.parse(page.items);
                if (page.config) page.config = JSON.parse(page.config);
                _context2.next = 15;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2['catch'](7);
                throw {
                  status: 500,
                  name: "JSON_PARSE_ERROR",
                  message: "json parse error"
                };

              case 15:

                ctx.body = page;

              case 16:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[7, 12]]);
      }));

      function get(_x2) {
        return _ref2.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: 'put',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.mark(function _callee3(ctx) {
        var id, body, change, count, _ref4, _ref5, page, changed;

        return __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                id = ctx.params.id;
                body = ctx.request.body;
                change = Object.create(null);
                count = ["title", "config", "items"].reduce(function (count, name) {
                  if (!(name in body)) return count;
                  change[name] = body[name];
                  return count + 1;
                }, 0);

                if (!(count === 0)) {
                  _context3.next = 6;
                  break;
                }

                throw {
                  status: 400,
                  name: "ERR",
                  message: "require `title` or/and `items` in request body"
                };

              case 6:

                change.title = change.title.trim();

                if (change.title) {
                  _context3.next = 9;
                  break;
                }

                throw { status: 400, name: "ERROR_PARAMS", message: "Title 不能为空" };

              case 9:
                if (!("items" in change)) {
                  _context3.next = 13;
                  break;
                }

                change.items = JSON.stringify(change.items);

                if (!(change.items.length > __WEBPACK_IMPORTED_MODULE_1__constants__["a" /* default */].VALUE_MAX_LENGTH)) {
                  _context3.next = 13;
                  break;
                }

                throw __WEBPACK_IMPORTED_MODULE_1__constants__["a" /* default */].VALUE_TOO_LONG;

              case 13:
                if ("config" in change) {
                  change.config = JSON.stringify(change.config);
                }

                _context3.next = 16;
                return __WEBPACK_IMPORTED_MODULE_2__models__["a" /* default */].pages.findAll({
                  attributes: ['is_delete', 'items'],
                  where: {
                    id: id
                  }
                });

              case 16:
                _ref4 = _context3.sent;
                _ref5 = _slicedToArray(_ref4, 1);
                page = _ref5[0];

                if (!(!page || page.is_delete)) {
                  _context3.next = 21;
                  break;
                }

                throw {
                  status: 404,
                  name: "PAGE_NOT_FOUND",
                  message: "page is not found"
                };

              case 21:
                _context3.next = 23;
                return __WEBPACK_IMPORTED_MODULE_2__models__["a" /* default */].pages.update(change, {
                  where: {
                    id: id
                  }
                });

              case 23:
                changed = ["title", "config", "items"].reduce(function (changed, name) {
                  return page[name] !== change[name] ? changed + 1 : changed;
                }, 0);

                if (!(changed > 0)) {
                  _context3.next = 27;
                  break;
                }

                _context3.next = 27;
                return __WEBPACK_IMPORTED_MODULE_2__models__["a" /* default */].changelog.create({
                  action: 2,
                  page_id: id,
                  items: change.items,
                  create_by: ctx.state.user.id
                });

              case 27:

                ctx.body = {
                  message: "Save success"
                };

              case 28:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function put(_x3) {
        return _ref3.apply(this, arguments);
      }

      return put;
    }()
  }]);

  return _class;
}();

/* harmony default export */ __webpack_exports__["a"] = (_class);
;

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
                  VALUE_MAX_LENGTH: 10240,
                  VALUE_TOO_LONG: {
                                    status: 400,
                                    message: 'Value 不能大于 10240 个字符',
                                    name: 'VALUE_TOO_LONG'
                  }
});

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = require("koa-passport");

/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nuxt__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nuxt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_nuxt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_api__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models__ = __webpack_require__(6);





var app = new __WEBPACK_IMPORTED_MODULE_0_koa___default.a();
var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || 3000;

app.keys = ['i-love-piper'];
app.use(__webpack_require__(122)({}, app));
app.use(__webpack_require__(123)());

// authentication
__webpack_require__(124);
var passport = __webpack_require__(42);
app.use(passport.initialize());
app.use(passport.session());

var router = __webpack_require__(33)();

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', {
  successRedirect: '/',
  // TODO: login failure page
  failureRedirect: '/login'
}));

app.use(router.routes());
app.use(__WEBPACK_IMPORTED_MODULE_2__lib_api__["a" /* default */].routes());

app.use(function (ctx) {
  ctx.status = 200; // koa defaults to 404 when it sees that status is unset

  return new Promise(function (resolve, reject) {
    ctx.res.on('close', resolve);
    ctx.res.on('finish', resolve);
    nuxt.render(ctx.req, ctx.res, function (promise) {
      // nuxt.render passes a rejected promise into callback on error.
      promise.then(resolve).catch(reject);
    });
  });
});

// Import and Set Nuxt.js options
var config = __webpack_require__(126);
config.dev = !(app.env === 'production');

// Instantiate nuxt.js
var nuxt = new __WEBPACK_IMPORTED_MODULE_1_nuxt__["Nuxt"](config);

// Build in development
if (config.dev) {
  var builder = new __WEBPACK_IMPORTED_MODULE_1_nuxt__["Builder"](nuxt);
  builder.build().catch(function (e) {
    console.error(e); // eslint-disable-line no-console
    process.exit(1);
  });
}

__WEBPACK_IMPORTED_MODULE_3__models__["a" /* default */].sequelize.sync().then(function () {
  app.listen(port, host);
  console.log('Server listening on ' + host + ':' + port); // eslint-disable-line no-console
}).catch(function (err) {
  console.error(new Error(err));
});

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = require("koa");

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = require("nuxt");

/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa_router__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_koa_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fs__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_fs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_path__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__controllers_changelogs__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__controllers_count__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__controllers_files__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__controllers_page__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__controllers_pages__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__controllers_publish__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__controllers_users__ = __webpack_require__(121);


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }













var apiRouter = new __WEBPACK_IMPORTED_MODULE_1_koa_router___default.a({ prefix: '/api' });

[__WEBPACK_IMPORTED_MODULE_4__controllers_changelogs__["a" /* default */], __WEBPACK_IMPORTED_MODULE_5__controllers_count__["a" /* default */], __WEBPACK_IMPORTED_MODULE_6__controllers_files__["a" /* default */], __WEBPACK_IMPORTED_MODULE_7__controllers_page__["a" /* default */], __WEBPACK_IMPORTED_MODULE_8__controllers_pages__["a" /* default */], __WEBPACK_IMPORTED_MODULE_9__controllers_publish__["a" /* default */], __WEBPACK_IMPORTED_MODULE_10__controllers_users__["a" /* default */]].forEach(function (klass) {
  var _this = this;

  var controller = new klass();

  var _loop = function _loop(method) {
    if (method in controller) {
      // apiRouter[method](controller.url, async (ctx) => {
      //   if (ctx.isAuthenticated()) {
      //     return await controller[method](ctx)
      //   } else {
      //     throw {
      //       status: 401,
      //       name: 'NOT_LOGIN',
      //       message: 'not login'
      //     }
      //   }
      // });
      // TODO: ctx.isAuthenticated
      apiRouter[method](controller.url, function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx) {
          return __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return controller[method](ctx);

                case 2:
                  return _context.abrupt('return', _context.sent);

                case 3:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  };

  var _arr = ['options', 'get', 'post', 'delete', 'put'];
  for (var _i = 0; _i < _arr.length; _i++) {
    var method = _arr[_i];
    _loop(method);
  }
});

apiRouter.get('/logout', function (ctx) {
  ctx.logout();
  ctx.body = {
    message: 'success'
  };
});

/* harmony default export */ __webpack_exports__["a"] = (apiRouter);

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models__ = __webpack_require__(6);


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this.url = '/changelogs';
  }

  _createClass(_class, [{
    key: 'get',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx) {
        var _ctx$query, page, size, title, action, start, limit, where, result;

        return __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ctx$query = ctx.query, page = _ctx$query.page, size = _ctx$query.size, title = _ctx$query.title, action = _ctx$query.action;

                page = parseInt(page, 10);
                size = parseInt(size, 10);
                start = (page - 1) * size;
                limit = size;
                where = {};

                if (title) {
                  where['$page.title$'] = {
                    $like: '%' + title + '%'
                  };
                }
                if (action && action != 0) {
                  where['action'] = action;
                }

                _context.next = 10;
                return __WEBPACK_IMPORTED_MODULE_1__models__["a" /* default */].changelog.findAndCountAll({
                  attributes: ['action', 'create_at'],
                  include: [{
                    model: __WEBPACK_IMPORTED_MODULE_1__models__["a" /* default */].pages,
                    attributes: ['title']
                  }, {
                    model: __WEBPACK_IMPORTED_MODULE_1__models__["a" /* default */].users,
                    attributes: ['name']
                  }],
                  offset: start,
                  limit: limit,
                  where: where,
                  order: [['create_at', 'DESC']]
                });

              case 10:
                result = _context.sent;


                ctx.body = {
                  total: result.count,
                  page: page,
                  size: size,
                  data: result.rows
                };

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get(_x) {
        return _ref.apply(this, arguments);
      }

      return get;
    }()
  }]);

  return _class;
}();

/* harmony default export */ __webpack_exports__["a"] = (_class);
;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
  * The entry point.
  *
  * @module Sequelize
  */
module.exports = __webpack_require__(50);


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const url = __webpack_require__(51);
const Path = __webpack_require__(10);
const retry = __webpack_require__(52);
const clsBluebird = __webpack_require__(53);
const Utils = __webpack_require__(1);
const Model = __webpack_require__(35);
const DataTypes = __webpack_require__(2);
const Deferrable = __webpack_require__(72);
const ModelManager = __webpack_require__(73);
const QueryInterface = __webpack_require__(75);
const Transaction = __webpack_require__(20);
const QueryTypes = __webpack_require__(9);
const sequelizeErrors = __webpack_require__(3);
const Promise = __webpack_require__(4);
const Hooks = __webpack_require__(36);
const Association = __webpack_require__(79);
const Validator = __webpack_require__(16).validator;
const _ = __webpack_require__(0);

/**
 * This is the main class, the entry point to sequelize. To use it, you just need to import sequelize:
 *
 * ```js
 * const Sequelize = require('sequelize');
 * ```
 *
 * In addition to sequelize, the connection library for the dialect you want to use should also be installed in your project. You don't need to import it however, as sequelize will take care of that.
 */
class Sequelize {

  /**
   * Instantiate sequelize with name of database, username and password
   *
   * #### Example usage
   *
   * ```javascript
   * // without password and options
   * const sequelize = new Sequelize('database', 'username')
   *
   * // without options
   * const sequelize = new Sequelize('database', 'username', 'password')
   *
   * // without password / with blank password
   * const sequelize = new Sequelize('database', 'username', null, {})
   *
   * // with password and options
   * const sequelize = new Sequelize('my_database', 'john', 'doe', {})
   *
   * // with database, username, and password in the options object
   * const sequelize = new Sequelize({ database, username, password });
   *
   * // with uri
   * const sequelize = new Sequelize('mysql://localhost:3306/database', {})
   * ```
   *
   * @param {String}   [database] The name of the database
   * @param {String}   [username=null] The username which is used to authenticate against the database.
   * @param {String}   [password=null] The password which is used to authenticate against the database. Supports SQLCipher encryption for SQLite.
   * @param {Object}   [options={}] An object with options.
   * @param {String}   [options.host='localhost'] The host of the relational database.
   * @param {Integer}  [options.port=] The port of the relational database.
   * @param {String}   [options.username=null] The username which is used to authenticate against the database.
   * @param {String}   [options.password=null] The password which is used to authenticate against the database.
   * @param {String}   [options.database=null] The name of the database
   * @param {String}   [options.dialect] The dialect of the database you are connecting to. One of mysql, postgres, sqlite and mssql.
   * @param {String}   [options.dialectModulePath=null] If specified, load the dialect library from this path. For example, if you want to use pg.js instead of pg when connecting to a pg database, you should specify 'pg.js' here
   * @param {Object}   [options.dialectOptions] An object of additional options, which are passed directly to the connection library
   * @param {String}   [options.storage] Only used by sqlite. Defaults to ':memory:'
   * @param {String}   [options.protocol='tcp'] The protocol of the relational database.
   * @param {Object}   [options.define={}] Default options for model definitions. See sequelize.define for options
   * @param {Object}   [options.query={}] Default options for sequelize.query
   * @param {Object}   [options.set={}] Default options for sequelize.set
   * @param {Object}   [options.sync={}] Default options for sequelize.sync
   * @param {String}   [options.timezone='+00:00'] The timezone used when converting a date from the database into a JavaScript date. The timezone is also used to SET TIMEZONE when connecting to the server, to ensure that the result of NOW, CURRENT_TIMESTAMP and other time related functions have in the right timezone. For best cross platform performance use the format +/-HH:MM. Will also accept string versions of timezones used by moment.js (e.g. 'America/Los_Angeles'); this is useful to capture daylight savings time changes.
   * @param {Function} [options.logging=console.log] A function that gets executed every time Sequelize would log something.
   * @param {Boolean}  [options.benchmark=false] Pass query execution time in milliseconds as second argument to logging function (options.logging).
   * @param {Boolean}  [options.omitNull=false] A flag that defines if null values should be passed to SQL queries or not.
   * @param {Boolean}  [options.native=false] A flag that defines if native library shall be used or not. Currently only has an effect for postgres
   * @param {Boolean}  [options.replication=false] Use read / write replication. To enable replication, pass an object, with two properties, read and write. Write should be an object (a single server for handling writes), and read an array of object (several servers to handle reads). Each read/write server can have the following properties: `host`, `port`, `username`, `password`, `database`
   * @param {Object}   [options.pool={}] Should sequelize use a connection pool. Default is true
   * @param {Integer}  [options.pool.max] Maximum number of connection in pool. Default is 5
   * @param {Integer}  [options.pool.min] Minimum number of connection in pool. Default is 0
   * @param {Integer}  [options.pool.idle] The maximum time, in milliseconds, that a connection can be idle before being released
   * @param {Integer}  [options.pool.acquire] The maximum time, in milliseconds, that pool will try to get connection before throwing error
   * @param {Function} [options.pool.validate] A function that validates a connection. Called with client. The default function checks that client is an object, and that its state is not disconnected
   * @param {Integer}  [options.pool.evict] The time interval, in milliseconds, for evicting stale connections. The default value is 0, which disables this feature.
   * @param {Boolean}  [options.quoteIdentifiers=true] Set to `false` to make table names and attributes case-insensitive on Postgres and skip double quoting of them.  WARNING: Setting this to false may expose vulnerabilities and is not reccomended!
   * @param {String}   [options.transactionType='DEFERRED'] Set the default transaction type. See `Sequelize.Transaction.TYPES` for possible options. Sqlite only.
   * @param {String}   [options.isolationLevel] Set the default transaction isolation level. See `Sequelize.Transaction.ISOLATION_LEVELS` for possible options.
   * @param {Object}   [options.retry] Set of flags that control when a query is automatically retried.
   * @param {Array}    [options.retry.match] Only retry a query if the error matches one of these strings.
   * @param {Integer}  [options.retry.max] How many times a failing query is automatically retried.  Set to 0 to disable retrying on SQL_BUSY error.
   * @param {Boolean}  [options.typeValidation=false] Run built in type validators on insert and update, e.g. validate that arguments passed to integer fields are integer-like.
   */
  constructor(database, username, password, options) {
    let config;

    if (arguments.length === 1 && typeof database === 'object') {
      // new Sequelize({ ... options })
      options = database;
      config = _.pick(options, 'host', 'port', 'database', 'username', 'password');
    } else if (arguments.length === 1 && typeof database === 'string' || arguments.length === 2 && typeof username === 'object') {
      // new Sequelize(URI, { ... options })

      config = {};
      options = username || {};

      const urlParts = url.parse(arguments[0]);

      options.dialect = urlParts.protocol.replace(/:$/, '');
      options.host = urlParts.hostname;

      if (options.dialect === 'sqlite' && urlParts.pathname && urlParts.pathname.indexOf('/:memory') !== 0) {
        const path = Path.join(options.host, urlParts.pathname);
        options.storage = options.storage || path;
      }

      if (urlParts.pathname) {
        config.database = urlParts.pathname.replace(/^\//, '');
      }

      if (urlParts.port) {
        options.port = urlParts.port;
      }

      if (urlParts.auth) {
        const authParts = urlParts.auth.split(':');

        config.username = authParts[0];

        if (authParts.length > 1)
          config.password = authParts.slice(1).join(':');
      }
    } else {
      // new Sequelize(database, username, password, { ... options })
      options = options || {};
      config = {database, username, password};
    }

    Sequelize.runHooks('beforeInit', config, options);

    this.options = Utils._.extend({
      dialect: null,
      dialectModulePath: null,
      host: 'localhost',
      protocol: 'tcp',
      define: {},
      query: {},
      sync: {},
      timezone:'+00:00',
      logging: console.log,
      omitNull: false,
      native: false,
      replication: false,
      ssl: undefined,
      pool: {},
      quoteIdentifiers: true,
      hooks: {},
      retry: {max: 5, match: ['SQLITE_BUSY: database is locked']},
      transactionType: Transaction.TYPES.DEFERRED,
      isolationLevel: null,
      databaseVersion: 0,
      typeValidation: false,
      benchmark: false
    }, options || {});

    if (!this.options.dialect) {
      throw new Error('Dialect needs to be explicitly supplied as of v4.0.0');
    }

    if (this.options.dialect === 'postgresql') {
      this.options.dialect = 'postgres';
    }

    if (this.options.dialect === 'sqlite' && this.options.timezone !== '+00:00') {
      throw new Error('Setting a custom timezone is not supported by SQLite, dates are always returned as UTC. Please remove the custom timezone parameter.');
    }

    if (this.options.logging === true) {
      Utils.deprecate('The logging-option should be either a function or false. Default: console.log');
      this.options.logging = console.log;
    }

    this.options.hooks = this.replaceHookAliases(this.options.hooks);

    if (['', null, false].indexOf(config.password) > -1 || typeof config.password === 'undefined') {
      config.password = null;
    }

    this.config = {
      database: config.database,
      username: config.username,
      password: config.password,
      host: config.host || this.options.host,
      port: config.port || this.options.port,
      pool: this.options.pool,
      protocol: this.options.protocol,
      native: this.options.native,
      ssl: this.options.ssl,
      replication: this.options.replication,
      dialectModulePath: this.options.dialectModulePath,
      keepDefaultTimezone: this.options.keepDefaultTimezone,
      dialectOptions: this.options.dialectOptions
    };

    let Dialect;
    // Requiring the dialect in a switch-case to keep the
    // require calls static. (Browserify fix)
    switch (this.getDialect()) {
      case 'mssql':
        Dialect = __webpack_require__(80);
        break;
      case 'mysql':
        Dialect = __webpack_require__(89);
        break;
      case 'postgres':
        Dialect = __webpack_require__(94);
        break;
      case 'sqlite':
        Dialect = __webpack_require__(100);
        break;
      default:
        throw new Error('The dialect ' + this.getDialect() + ' is not supported. Supported dialects: mssql, mysql, postgres, and sqlite.');
    }

    this.dialect = new Dialect(this);
    this.dialect.QueryGenerator.typeValidation = options.typeValidation;

    this.queryInterface = new QueryInterface(this);

    /**
     * Models are stored here under the name given to `sequelize.define`
     */
    this.models = {};
    this.modelManager = new ModelManager(this);
    this.connectionManager = this.dialect.connectionManager;

    this.importCache = {};

    this.test = {
      _trackRunningQueries: false,
      _runningQueries: 0,
      trackRunningQueries() {
        this._trackRunningQueries = true;
      },
      verifyNoRunningQueries() {
        if (this._runningQueries > 0) throw new Error('Expected 0 running queries. '+this._runningQueries+' queries still running');
      }
    };

    Sequelize.runHooks('afterInit', this);
  }

  refreshTypes() {
    this.connectionManager.refreshTypeParser(DataTypes);
  }

  /**
   * Returns the specified dialect.
   *
   * @return {String} The specified dialect.
   */
  getDialect() {
    return this.options.dialect;
  }

  /**
   * Returns an instance of QueryInterface.

   * @method getQueryInterface
   * @memberOf Sequelize
   * @return {QueryInterface} An instance (singleton) of QueryInterface.
   */
  getQueryInterface() {
    this.queryInterface = this.queryInterface || new QueryInterface(this);
    return this.queryInterface;
  }

  /**
   * Define a new model, representing a table in the DB.
   *
   * The table columns are defined by the object that is given as the second argument. Each key of the object represents a column
   *
   * @param {String} modelName The name of the model. The model will be stored in `sequelize.models` under this name
   * @param {Object} attributes An object, where each attribute is a column of the table. See {@link Model.init}
   * @param {Object} [options] These options are merged with the default define options provided to the Sequelize constructor and passed to Model.init()
   *
   * @see {@link Model.init} for a more comprehensive specification of the `options` and `attributes` objects.
   * @see <a href="../manual/tutorial/models-definition.html">The manual section about defining models</a>
   * @see {@link DataTypes} For a list of possible data types
   *
   * @return {Model}
   *
   * @example
   * sequelize.define('modelName', {
   *     columnA: {
   *         type: Sequelize.BOOLEAN,
   *         validate: {
   *           is: ["[a-z]",'i'],        // will only allow letters
   *           max: 23,                  // only allow values <= 23
   *           isIn: {
   *             args: [['en', 'zh']],
   *             msg: "Must be English or Chinese"
   *           }
   *         },
   *         field: 'column_a'
   *         // Other attributes here
   *     },
   *     columnB: Sequelize.STRING,
   *     columnC: 'MY VERY OWN COLUMN TYPE'
   * })
   *
   * sequelize.models.modelName // The model will now be available in models under the name given to define
   */
  define(modelName, attributes, options) { // testhint options:none
    options = options || {};

    options.modelName = modelName;
    options.sequelize = this;

    const model = class extends Model {};

    model.init(attributes, options);


    return model;
  }

  /**
   * Fetch a Model which is already defined
   *
   * @param {String} modelName The name of a model defined with Sequelize.define
   * @throws Will throw an error if the model is not defined (that is, if sequelize#isDefined returns false)
   * @return {Model}
   */
  model(modelName) {
    if (!this.isDefined(modelName)) {
      throw new Error(modelName + ' has not been defined');
    }

    return this.modelManager.getModel(modelName);
  }

  /**
   * Checks whether a model with the given name is defined
   *
   * @param {String} modelName The name of a model defined with Sequelize.define
   * @return {Boolean}
   */
  isDefined(modelName) {
    const models = this.modelManager.models;
    return models.filter(model => model.name === modelName).length !== 0;
  }

  /**
   * Imports a model defined in another file
   *
   * Imported models are cached, so multiple calls to import with the same path will not load the file multiple times
   *
   * See https://github.com/sequelize/express-example for a short example of how to define your models in separate files so that they can be imported by sequelize.import
   * @param {String} path The path to the file that holds the model you want to import. If the part is relative, it will be resolved relatively to the calling file
   * @return {Model}
   */
  import(path) {
    // is it a relative path?
    if (Path.normalize(path) !== Path.resolve(path)) {
      // make path relative to the caller
      const callerFilename = Utils.stack()[1].getFileName();
      const callerPath = Path.dirname(callerFilename);

      path = Path.resolve(callerPath, path);
    }

    if (!this.importCache[path]) {
      let defineCall = arguments.length > 1 ? arguments[1] : !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
      if (typeof defineCall === 'object') {
        // ES6 module compatability
        defineCall = defineCall.default;
      }
      this.importCache[path] = defineCall(this, DataTypes);
    }

    return this.importCache[path];
  }

  /**
   * Execute a query on the DB, with the possibility to bypass all the sequelize goodness.
   *
   * By default, the function will return two arguments: an array of results, and a metadata object, containing number of affected rows etc. Use `.spread` to access the results.
   *
   * If you are running a type of query where you don't need the metadata, for example a `SELECT` query, you can pass in a query type to make sequelize format the results:
   *
   * ```js
   * sequelize.query('SELECT...').spread((results, metadata) => {
   *   // Raw query - use spread
   * });
   *
   * sequelize.query('SELECT...', { type: sequelize.QueryTypes.SELECT }).then(results => {
   *   // SELECT query - use then
   * })
   * ```
   *
   * @method query
   * @param {String}          sql
   * @param {Object}          [options={}] Query options.
   * @param {Boolean}         [options.raw] If true, sequelize will not try to format the results of the query, or build an instance of a model from the result
   * @param {Transaction}     [options.transaction=null] The transaction that the query should be executed under
   * @param {QueryTypes}      [options.type='RAW'] The type of query you are executing. The query type affects how results are formatted before they are passed back. The type is a string, but `Sequelize.QueryTypes` is provided as convenience shortcuts.
   * @param {Boolean}         [options.nest=false] If true, transforms objects with `.` separated property names into nested objects using [dottie.js](https://github.com/mickhansen/dottie.js). For example { 'user.username': 'john' } becomes { user: { username: 'john' }}. When `nest` is true, the query type is assumed to be `'SELECT'`, unless otherwise specified
   * @param {Boolean}         [options.plain=false] Sets the query type to `SELECT` and return a single row
   * @param {Object|Array}    [options.replacements] Either an object of named parameter replacements in the format `:param` or an array of unnamed replacements to replace `?` in your SQL.
   * @param {Object|Array}    [options.bind] Either an object of named bind parameter in the format `_param` or an array of unnamed bind parameter to replace `$1, $2, ...` in your SQL.
   * @param {Boolean}         [options.useMaster=false] Force the query to use the write pool, regardless of the query type.
   * @param {Function}        [options.logging=false] A function that gets executed while running the query to log the sql.
   * @param {new Model()}       [options.instance] A sequelize instance used to build the return instance
   * @param {Model}           [options.model] A sequelize model used to build the returned model instances (used to be called callee)
   * @param {Object}          [options.retry] Set of flags that control when a query is automatically retried.
   * @param {Array}           [options.retry.match] Only retry a query if the error matches one of these strings.
   * @param {Integer}         [options.retry.max] How many times a failing query is automatically retried.
   * @param {String}          [options.searchPath=DEFAULT] An optional parameter to specify the schema search_path (Postgres only)
   * @param {Boolean}         [options.supportsSearchPath] If false do not prepend the query with the search_path (Postgres only)
   * @param {Boolean}          [options.mapToModel=false] Map returned fields to model's fields if `options.model` or `options.instance` is present. Mapping will occur before building the model instance.
   * @param {Object}          [options.fieldMap] Map returned fields to arbitrary names for `SELECT` query type.
   *
   * @return {Promise}
   *
   * @see {@link Model.build} for more information about instance option.
   */

  query(sql, options) {
    let bindParameters;

    return Promise.try(() => {
      options = _.assign({}, this.options.query, options);

      if (options.instance && !options.model) {
        options.model = options.instance.constructor;
      }

      // map raw fields to model attributes
      if (options.mapToModel) {
        options.fieldMap = _.get(options, 'model.fieldAttributeMap', {});
      }

      if (typeof sql === 'object') {
        if (sql.values !== undefined) {
          if (options.replacements !== undefined) {
            throw new Error('Both `sql.values` and `options.replacements` cannot be set at the same time');
          }
          options.replacements = sql.values;
        }

        if (sql.bind !== undefined) {
          if (options.bind !== undefined) {
            throw new Error('Both `sql.bind` and `options.bind` cannot be set at the same time');
          }
          options.bind = sql.bind;
        }

        if (sql.query !== undefined) {
          sql = sql.query;
        }
      }

      sql = sql.trim();

      if (!options.instance && !options.model) {
        options.raw = true;
      }

      if (options.replacements && options.bind) {
        throw new Error('Both `replacements` and `bind` cannot be set at the same time');
      }

      if (options.replacements) {
        if (Array.isArray(options.replacements)) {
          sql = Utils.format([sql].concat(options.replacements), this.options.dialect);
        } else {
          sql = Utils.formatNamedParameters(sql, options.replacements, this.options.dialect);
        }
      }

      if (options.bind) {
        const bindSql = this.dialect.Query.formatBindParameters(sql, options.bind, this.options.dialect);
        sql = bindSql[0];
        bindParameters = bindSql[1];
      }

      options = _.defaults(options, {
        logging: this.options.hasOwnProperty('logging') ? this.options.logging : console.log,
        searchPath: this.options.hasOwnProperty('searchPath') ? this.options.searchPath : 'DEFAULT'
      });

      if (options.transaction === undefined && Sequelize._cls) {
        options.transaction = Sequelize._cls.get('transaction');
      }

      if (!options.type) {
        if (options.model || options.nest || options.plain) {
          options.type = QueryTypes.SELECT;
        } else {
          options.type = QueryTypes.RAW;
        }
      }

      if (options.transaction && options.transaction.finished) {
        const error = new Error(options.transaction.finished+' has been called on this transaction('+options.transaction.id+'), you can no longer use it. (The rejected query is attached as the \'sql\' property of this error)');
        error.sql = sql;
        return Promise.reject(error);
      }

      if (this.test._trackRunningQueries) {
        this.test._runningQueries++;
      }

      //if dialect doesn't support search_path or dialect option
      //to prepend searchPath is not true delete the searchPath option
      if (!this.dialect.supports.searchPath || !this.options.dialectOptions || !this.options.dialectOptions.prependSearchPath ||
        options.supportsSearchPath === false) {
        delete options.searchPath;
      } else if (!options.searchPath) {
        //if user wants to always prepend searchPath (dialectOptions.preprendSearchPath = true)
        //then set to DEFAULT if none is provided
        options.searchPath = 'DEFAULT';
      }
      return options.transaction ? options.transaction.connection : this.connectionManager.getConnection(options);
    }).then(connection => {
      const query = new this.dialect.Query(connection, this, options);

      return retry(() => query.run(sql, bindParameters).finally(() => {
        if (!options.transaction) {
          return this.connectionManager.releaseConnection(connection);
        }
      }), Utils._.extend(this.options.retry, options.retry || {}));
    }).finally(() => {
      if (this.test._trackRunningQueries) {
        this.test._runningQueries--;
      }
    });
  }

  /**
   * Execute a query which would set an environment or user variable. The variables are set per connection, so this function needs a transaction.
   * Only works for MySQL.
   *
   * @method set
   * @param {Object}        variables Object with multiple variables.
   * @param {Object}        options Query options.
   * @param {Transaction}   options.transaction The transaction that the query should be executed under
   *
   * @memberof Sequelize
   * @return {Promise}
   */
  set(variables, options) {

    // Prepare options
    options = Utils._.extend({}, this.options.set, typeof options === 'object' && options || {});

    if (this.options.dialect !== 'mysql') {
      throw new Error('sequelize.set is only supported for mysql');
    }
    if (!options.transaction || !(options.transaction instanceof Transaction) ) {
      throw new TypeError('options.transaction is required');
    }

    // Override some options, since this isn't a SELECT
    options.raw = true;
    options.plain = true;
    options.type = 'SET';

    // Generate SQL Query
    const query =
      'SET '+
      Utils._.map(variables, (v, k) => '@'+k +' := '+ (typeof v === 'string' ? '"'+v+'"' : v)).join(', ');

    return this.query(query, options);
  }

  /**
   * Escape value.
   *
   * @param {String} value
   * @return {String}
   */
  escape(value) {
    return this.getQueryInterface().escape(value);
  }

  /**
   * Create a new database schema.
   *
   * Note, that this is a schema in the [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this command will do nothing.
   *
   * @see {@link Model.schema}
   * @param {String} schema Name of the schema
   * @param {Object} options={}
   * @param {Boolean|function} options.logging A function that logs sql queries, or false for no logging
   * @return {Promise}
   */
  createSchema(schema, options) {
    return this.getQueryInterface().createSchema(schema, options);
  }

  /**
   * Show all defined schemas
   *
   * Note, that this is a schema in the [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this will show all tables.
   * @param {Object} options={}
   * @param {Boolean|function} options.logging A function that logs sql queries, or false for no logging
   * @return {Promise}
   */
  showAllSchemas(options) {
    return this.getQueryInterface().showAllSchemas(options);
  }

  /**
   * Drop a single schema
   *
   * Note, that this is a schema in the [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this drop a table matching the schema name
   * @param {String} schema Name of the schema
   * @param {Object} options={}
   * @param {Boolean|function} options.logging A function that logs sql queries, or false for no logging
   * @return {Promise}
   */
  dropSchema(schema, options) {
    return this.getQueryInterface().dropSchema(schema, options);
  }

  /**
   * Drop all schemas
   *
   * Note,that this is a schema in the [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this is the equivalent of drop all tables.
   * @param {Object} options={}
   * @param {Boolean|function} options.logging A function that logs sql queries, or false for no logging
   * @return {Promise}
   */
  dropAllSchemas(options) {
    return this.getQueryInterface().dropAllSchemas(options);
  }

  /**
   * Sync all defined models to the DB.
   *
   * @param {Object} [options={}]
   * @param {Boolean} [options.force=false] If force is true, each Model will run `DROP TABLE IF EXISTS`, before it tries to create its own table
   * @param {RegExp} [options.match] Match a regex against the database name before syncing, a safety check for cases where force: true is used in tests but not live code
   * @param {Boolean|function} [options.logging=console.log] A function that logs sql queries, or false for no logging
   * @param {String} [options.schema='public'] The schema that the tables should be created in. This can be overriden for each table in sequelize.define
   * @param  {String} [options.searchPath=DEFAULT] An optional parameter to specify the schema search_path (Postgres only)
   * @param {Boolean} [options.hooks=true] If hooks is true then beforeSync, afterSync, beforBulkSync, afterBulkSync hooks will be called
   * @param {Boolean} [options.alter=false] Alters tables to fit models. Not recommended for production use. Deletes data in columns that were removed or had their type changed in the model.
   * @return {Promise}
   */
  sync(options) {

    options = _.clone(options) || {};
    options.hooks = options.hooks === undefined ? true : !!options.hooks;
    options = Utils._.defaults(options, this.options.sync, this.options);

    if (options.match) {
      if (!options.match.test(this.config.database)) {
        return Promise.reject(new Error('Database does not match sync match parameter'));
      }
    }

    return Promise.try(() => {
      if (options.hooks) {
        return this.runHooks('beforeBulkSync', options);
      }
    }).then(() => {
      if (options.force) {
        return this.drop(options);
      }
    }).then(() => {
      const models = [];

      // Topologically sort by foreign key constraints to give us an appropriate
      // creation order
      this.modelManager.forEachModel(model => {
        if (model) {
          models.push(model);
        } else {
          // DB should throw an SQL error if referencing inexistant table
        }
      });

      return Promise.each(models, model => model.sync(options));
    }).then(() => {
      if (options.hooks) {
        return this.runHooks('afterBulkSync', options);
      }
    }).return(this);
  }

  /**
   * Truncate all tables defined through the sequelize models. This is done
   * by calling Model.truncate() on each model.
   *
   * @param {object} [options] The options passed to Model.destroy in addition to truncate
   * @param {Boolean|function} [options.transaction]
   * @param {Boolean|function} [options.logging] A function that logs sql queries, or false for no logging
   * @return {Promise}
   *
   * @see {@link Model.truncate} for more information
   */
  truncate(options) {
    const models = [];

    this.modelManager.forEachModel(model => {
      if (model) {
        models.push(model);
      }
    }, { reverse: false });

    const truncateModel = model => model.truncate(options);

    if (options && options.cascade) {
      return Promise.each(models, truncateModel);
    } else {
      return Promise.map(models, truncateModel);
    }
  }

  /**
   * Drop all tables defined through this sequelize instance. This is done by calling Model.drop on each model
   * @see {@link Model.drop} for options
   *
   * @param {object} options  The options passed to each call to Model.drop
   * @param {Boolean|function} options.logging A function that logs sql queries, or false for no logging
   * @return {Promise}
   */
  drop(options) {
    const models = [];

    this.modelManager.forEachModel(model => {
      if (model) {
        models.push(model);
      }
    }, { reverse: false });

    return Promise.each(models, model => model.drop(options));
  }

  /**
   * Test the connection by trying to authenticate
   *
   * @error 'Invalid credentials' if the authentication failed (even if the database did not respond at all...)
   * @return {Promise}
   */
  authenticate(options) {
    return this.query('SELECT 1+1 AS result', Utils._.assign({ raw: true, plain: true }, options)).return();
  }

  databaseVersion(options) {
    return this.getQueryInterface().databaseVersion(options);
  }

  /**
   * Creates an object representing a database function. This can be used in search queries, both in where and order parts, and as default values in column definitions.
   * If you want to refer to columns in your function, you should use `sequelize.col`, so that the columns are properly interpreted as columns and not a strings.
   *
   * Convert a user's username to upper case
   * ```js
   * instance.updateAttributes({
   *   username: self.sequelize.fn('upper', self.sequelize.col('username'))
   * })
   * ```
   *
   * @see {@link Model.findAll}
   * @see {@link Sequelize.define}
   * @see {@link Sequelize.col}
   * @method fn
   *
   * @param {String} fn The function you want to call
   * @param {any} args All further arguments will be passed as arguments to the function
   *
   * @since v2.0.0-dev3
   * @memberof Sequelize
   * @return {Sequelize.fn}
   * @example <caption>Convert a user's username to upper case</caption>
   * instance.updateAttributes({
   *   username: self.sequelize.fn('upper', self.sequelize.col('username'))
   * })
   */
  static fn(fn) {
    return new Utils.Fn(fn, Utils.sliceArgs(arguments, 1));
  }

  /**
   * Creates an object which represents a column in the DB, this allows referencing another column in your query. This is often useful in conjunction with `sequelize.fn`, since raw string arguments to fn will be escaped.
   * @see {@link Sequelize#fn}
   *
   * @method col
   * @param {String} col The name of the column
   * @since v2.0.0-dev3
   * @memberof Sequelize
   * @return {Sequelize.col}
   */
  static col(col) {
    return new Utils.Col(col);
  }

  /**
   * Creates an object representing a call to the cast function.
   *
   * @method cast
   * @param {any} val The value to cast
   * @param {String} type The type to cast it to
   * @since v2.0.0-dev3
   * @memberof Sequelize
   * @return {Sequelize.cast}
   */
  static cast(val, type) {
    return new Utils.Cast(val, type);
  }

  /**
   * Creates an object representing a literal, i.e. something that will not be escaped.
   *
   * @method literal
   * @param {any} val
   * @alias asIs
   * @since v2.0.0-dev3
   * @memberof Sequelize
   * @return {Sequelize.literal}
   */
  static literal(val) {
    return new Utils.Literal(val);
  }

  /**
   * An AND query
   * @see {@link Model.findAll}
   *
   * @method and
   * @param {String|Object} args Each argument will be joined by AND
   * @since v2.0.0-dev3
   * @memberof Sequelize
   * @return {Sequelize.and}
   */
  static and() {
    return { $and: Utils.sliceArgs(arguments) };
  }

  /**
   * An OR query
   * @see {@link Model.findAll}
   *
   * @method or
   * @param {String|Object} args Each argument will be joined by OR
   * @since v2.0.0-dev3
   * @memberof Sequelize
   * @return {Sequelize.or}
   */
  static or() {
    return { $or: Utils.sliceArgs(arguments) };
  }

  /**
   * Creates an object representing nested where conditions for postgres's json data-type.
   * @see {@link Model.findAll}
   *
   * @method json
   * @param {String|Object} conditions A hash containing strings/numbers or other nested hash, a string using dot notation or a string using postgres json syntax.
   * @param {String|Number|Boolean} [value] An optional value to compare against. Produces a string of the form "<json path> = '<value>'".
   * @memberof Sequelize
   * @return {Sequelize.json}
   */
  static json(conditionsOrPath, value) {
    return new Utils.Json(conditionsOrPath, value);
  }

  /**
   * A way of specifying attr = condition.
   *
   * The attr can either be an object taken from `Model.rawAttributes` (for example `Model.rawAttributes.id` or `Model.rawAttributes.name`). The
   * attribute should be defined in your model definition. The attribute can also be an object from one of the sequelize utility functions (`sequelize.fn`, `sequelize.col` etc.)
   *
   * For string attributes, use the regular `{ where: { attr: something }}` syntax. If you don't want your string to be escaped, use `sequelize.literal`.
   *
   * @see {@link Model.findAll}
   *
   * @param {Object} attr The attribute, which can be either an attribute object from `Model.rawAttributes` or a sequelize object, for example an instance of `sequelize.fn`. For simple string attributes, use the POJO syntax
   * @param {string} [comparator='=']
   * @param {String|Object} logic The condition. Can be both a simply type, or a further condition (`$or`, `$and`, `.literal` etc.)
   * @alias condition
   * @since v2.0.0-dev3
   */
  static where(attr, comparator, logic) {
    return new Utils.Where(attr, comparator, logic);
  }

  /**
   * Start a transaction. When using transactions, you should pass the transaction in the options argument in order for the query to happen under that transaction
   *
   * ```js
   * sequelize.transaction().then(transaction => {
   *   return User.find(..., {transaction})
   *     .then(user => user.updateAttributes(..., {transaction}))
   *     .then(() => transaction.commit())
   *     .catch(() => transaction.rollback());
   * })
   * ```
   *
   * A syntax for automatically committing or rolling back based on the promise chain resolution is also supported:
   *
   * ```js
   * sequelize.transaction(transaction => { // Note that we use a callback rather than a promise.then()
   *   return User.find(..., {transaction})
   *     .then(user => user.updateAttributes(..., {transaction}))
   * }).then(() => {
   *   // Committed
   * }).catch(err => {
   *   // Rolled back
   *   console.error(err);
   * });
   * ```
   *
   * If you have [CLS](https://github.com/othiym23/node-continuation-local-storage) enabled, the transaction will automatically be passed to any query that runs within the callback.
   * To enable CLS, add it do your project, create a namespace and set it on the sequelize constructor:
   *
   * ```js
   * const cls = require('continuation-local-storage');
   * const ns = cls.createNamespace('....');
   * const Sequelize = require('sequelize');
   * Sequelize.useCLS(ns);
   * ```
   * Note, that CLS is enabled for all sequelize instances, and all instances will share the same namespace
   *
   * @see {@link Transaction}
   * @param {Object}   [options={}]
   * @param {Boolean}  [options.autocommit]
   * @param {String}   [options.type='DEFERRED'] See `Sequelize.Transaction.TYPES` for possible options. Sqlite only.
   * @param {String}   [options.isolationLevel] See `Sequelize.Transaction.ISOLATION_LEVELS` for possible options
   * @param {Function} [options.logging=false] A function that gets executed while running the query to log the sql.
   * @param {Function} [autoCallback] The callback is called with the transaction object, and should return a promise. If the promise is resolved, the transaction commits; if the promise rejects, the transaction rolls back
   * @return {Promise}
   */
  transaction(options, autoCallback) {
    if (typeof options === 'function') {
      autoCallback = options;
      options = undefined;
    }
    // testhint argsConform.end

    const transaction = new Transaction(this, options);

    if (!autoCallback) return transaction.prepareEnvironment().return(transaction);

    // autoCallback provided
    return Sequelize._clsRun(() => {
      return transaction.prepareEnvironment()
        .then(() => autoCallback(transaction))
        .tap(() => transaction.commit())
        .catch(err => {
          // Rollback transaction if not already finished (commit, rollback, etc)
          // and reject with original error (ignore any error in rollback)
          return Promise.try(() => {
            if (!transaction.finished) return transaction.rollback().catch(() => {});
          }).throw(err);
        });
    });
  }

  /**
   * Use CLS with Sequelize.
   * CLS namespace provided is stored as `Sequelize._cls`
   * and bluebird Promise is patched to use the namespace, using `cls-bluebird` module.
   *
   * @param {Object}   ns   CLS namespace
   * @returns {Object}      Sequelize constructor
   */
  static useCLS(ns) {
    // check `ns` is valid CLS namespace
    if (!ns || typeof ns !== 'object' || typeof ns.bind !== 'function' || typeof ns.run !== 'function') throw new Error('Must provide CLS namespace');

    // save namespace as `Sequelize._cls`
    this._cls = ns;

    // patch bluebird to bind all promise callbacks to CLS namespace
    clsBluebird(ns, Promise);

    // return Sequelize for chaining
    return this;
  }

  /**
   * Run function in CLS context.
   * If no CLS context in use, just runs the function normally
   *
   * @private
   * @param {Function} fn Function to run
   * @returns {*} Return value of function
   */
  static _clsRun(fn) {
    const ns = Sequelize._cls;
    if (!ns) return fn();

    let res;
    ns.run(context => res = fn(context));
    return res;
  }

  /*
   * Getter/setter for `Sequelize.cls`
   * To maintain backward compatibility with Sequelize v3.x
   * Calling the
   */
  static get cls() {
    Utils.deprecate('Sequelize.cls is deprecated and will be removed in a future version. Keep track of the CLS namespace you use in your own code.');
    return this._cls;
  }

  static set cls(ns) {
    Utils.deprecate('Sequelize.cls should not be set directly. Use Sequelize.useCLS().');
    this.useCLS(ns);
  }

  log() {
    let options;
    let args = Utils.sliceArgs(arguments);
    const last = Utils._.last(args);

    if (last && Utils._.isPlainObject(last) && last.hasOwnProperty('logging')) {
      options = last;

      // remove options from set of logged arguments if options.logging is equal to console.log
      if (options.logging === console.log) {
        args.splice(args.length-1, 1);
      }
    } else {
      options = this.options;
    }

    if (options.logging) {
      if (options.logging === true) {
        Utils.deprecate('The logging-option should be either a function or false. Default: console.log');
        options.logging = console.log;
      }

      // second argument is sql-timings, when benchmarking option enabled
      if ((this.options.benchmark || options.benchmark) && options.logging === console.log) {
        args = [args[0] + ' Elapsed time: ' + args[1] + 'ms'];
      }

      options.logging.apply(null, args);
    }
  }

  /**
   * Close all connections used by this sequelize instance, and free all references so the instance can be garbage collected.
   *
   * Normally this is done on process exit, so you only need to call this method if you are creating multiple instances, and want
   * to garbage collect some of them.
   */
  close() {
    this.connectionManager.close();
  }

  normalizeDataType(Type) {
    let type = typeof Type === 'function' ? new Type() : Type;
    const dialectTypes = this.dialect.DataTypes || {};

    if (dialectTypes[type.key]) {
      type = dialectTypes[type.key].extend(type);
    }

    if (type instanceof DataTypes.ARRAY && dialectTypes[type.type.key]) {
      type.type = dialectTypes[type.type.key].extend(type.type);
    }
    return type;
  }
  normalizeAttribute(attribute) {
    if (!Utils._.isPlainObject(attribute)) {
      attribute = { type: attribute };
    }

    if (!attribute.type) return attribute;

    attribute.type = this.normalizeDataType(attribute.type);

    if (attribute.hasOwnProperty('defaultValue')) {
      if (typeof attribute.defaultValue === 'function' && (
        attribute.defaultValue === DataTypes.NOW ||
          attribute.defaultValue === DataTypes.UUIDV1 ||
          attribute.defaultValue === DataTypes.UUIDV4
      )) {
        attribute.defaultValue = new attribute.defaultValue();
      }
    }

    if (attribute.type instanceof DataTypes.ENUM) {
      // The ENUM is a special case where the type is an object containing the values
      if (attribute.values) {
        attribute.type.values = attribute.type.options.values = attribute.values;
      } else {
        attribute.values = attribute.type.values;
      }

      if (!attribute.values.length) {
        throw new Error('Values for ENUM have not been defined.');
      }
    }

    return attribute;
  }
}

// Aliases
Sequelize.prototype.fn = Sequelize.fn;
Sequelize.prototype.col = Sequelize.col;
Sequelize.prototype.cast = Sequelize.cast;
Sequelize.prototype.literal = Sequelize.asIs = Sequelize.prototype.asIs = Sequelize.literal;
Sequelize.prototype.and = Sequelize.and;
Sequelize.prototype.or = Sequelize.or;
Sequelize.prototype.json = Sequelize.json;
Sequelize.prototype.where = Sequelize.condition = Sequelize.prototype.condition = Sequelize.where;
Sequelize.prototype.validate = Sequelize.prototype.authenticate;

/**
 * Sequelize version number.
 */
Sequelize.version = __webpack_require__(107).version;

Sequelize.options = {hooks: {}};

/**
 * A reference to Sequelize constructor from sequelize. Useful for accessing DataTypes, Errors etc.
 * @see {@link Sequelize}
 */
Sequelize.prototype.Sequelize = Sequelize;

/**
 * @private
 */
Sequelize.prototype.Utils = Sequelize.Utils = Utils;

/**
 * A handy reference to the bluebird Promise class
 */
Sequelize.prototype.Promise = Sequelize.Promise = Promise;

/**
 * Available query types for use with `sequelize.query`
 * @see {@link QueryTypes}
 */
Sequelize.prototype.QueryTypes = Sequelize.QueryTypes = QueryTypes;

/**
 * Exposes the validator.js object, so you can extend it with custom validation functions. The validator is exposed both on the instance, and on the constructor.
 * @see https://github.com/chriso/validator.js
 */
Sequelize.prototype.Validator = Sequelize.Validator = Validator;

Sequelize.prototype.Model = Sequelize.Model = Model;

Sequelize.DataTypes = DataTypes;
for (const dataType in DataTypes) {
  Sequelize[dataType] = DataTypes[dataType];
}

/**
 * A reference to the sequelize transaction class. Use this to access isolationLevels and types when creating a transaction
 * @see {@link Transaction}
 * @see {@link Sequelize.transaction}
 */
Sequelize.prototype.Transaction = Sequelize.Transaction = Transaction;

/**
 * A reference to the deferrable collection. Use this to access the different deferrable options.
 * @see {@link Transaction.Deferrable}
 * @see {@link Sequelize#transaction}
 */
Sequelize.prototype.Deferrable = Sequelize.Deferrable = Deferrable;

/**
 * A reference to the sequelize association class.
 * @see {@link Association}
 */
Sequelize.prototype.Association = Sequelize.Association = Association;

/**
 * Provide alternative version of `inflection` module to be used by `Utils.pluralize` etc.
 * @param {Object} _inflection - `inflection` module
 */
Sequelize.useInflection = Utils.useInflection;

/**
 * Allow hooks to be defined on Sequelize + on sequelize instance as universal hooks to run on all models
 * and on Sequelize/sequelize methods e.g. Sequelize(), Sequelize#define()
 */
Hooks.applyTo(Sequelize);
Hooks.applyTo(Sequelize.prototype);

/**
 * Expose various errors available
 */
for (const error of Object.keys(sequelizeErrors)) {
  if (sequelizeErrors[error] === sequelizeErrors.BaseError) {
    Sequelize.prototype.Error = Sequelize.Error = sequelizeErrors.BaseError;
  } else {
    Sequelize.prototype[error] = Sequelize[error] = sequelizeErrors[error];
  }
}

module.exports = Sequelize;
module.exports.Sequelize = Sequelize;
module.exports.default = Sequelize;


/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = require("retry-as-promised");

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = require("cls-bluebird");

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = require("terraformer-wkt-parser");

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Sequelize provides a host of custom error classes, to allow you to do easier debugging. All of these errors are exposed on the sequelize object and the sequelize constructor.
 * All sequelize errors inherit from the base JS error object.
 *
 * This means that errors can be accessed using `Sequelize.ValidationError` or `sequelize.ValidationError`
 * The Base Error all Sequelize Errors inherit from.
 */
class BaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SequelizeBaseError';
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.BaseError = BaseError;

/**
 * Scope Error. Thrown when the sequelize cannot query the specified scope.
 */
class SequelizeScopeError extends BaseError {
  constructor(parent) {
    super(parent);
    this.name = 'SequelizeScopeError';
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.SequelizeScopeError = SequelizeScopeError;

/**
 * Validation Error. Thrown when the sequelize validation has failed. The error contains an `errors` property,
 * which is an array with 1 or more ValidationErrorItems, one for each validation that failed.
 *
 * @param {string} message Error message
 * @param {Array} [errors] Array of ValidationErrorItem objects describing the validation errors
 *
 * @property errors An array of ValidationErrorItems
 */
class ValidationError extends BaseError {
  constructor(message, errors) {
    super(message);
    this.name = 'SequelizeValidationError';
    this.message = 'Validation Error';
    /**
     *
     * @type {ValidationErrorItem[]}
     */
    this.errors = errors || [];

    // Use provided error message if available...
    if (message) {
      this.message = message;

      // ... otherwise create a concatenated message out of existing errors.
    } else if (this.errors.length > 0 && this.errors[0].message) {
      this.message = this.errors.map(err => err.type + ': ' + err.message).join(',\n');
    }
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Gets all validation error items for the path / field specified.
   *
   * @param {string} path The path to be checked for error items
   * @returns {ValidationErrorItem[]} Validation error items for the specified path
   */
  get(path) {
    return this.errors.reduce((reduced, error) => {
      if (error.path === path) {
        reduced.push(error);
      }
      return reduced;
    }, []);
  }
}
exports.ValidationError = ValidationError;

/**
 * Thrown when attempting to update a stale model instance
 */
class OptimisticLockError extends BaseError {
  constructor(options) {
    options = options || {};
    options.message = options.message || 'Attempting to update a stale model instance: ' + options.modelName;
    super(options);
    this.name = 'SequelizeOptimisticLockError';
    this.message = options.message;
    /**
     * The name of the model on which the update was attempted
     * @type {string}
     */
    this.modelName = options.modelName;
    /**
     * The values of the attempted update
     * @type {object}
     */
    this.values = options.values;
    /**
     *
     * @type {object}
     */
    this.where = options.where;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.OptimisticLockError = OptimisticLockError;

/**
 * A base class for all database related errors.
 */
class DatabaseError extends BaseError {
  constructor(parent) {
    super(parent.message);
    this.name = 'SequelizeDatabaseError';
    /**
     * @type {Error}
     */
    this.parent = parent;
    /**
     * @type {Error}
     */
    this.original = parent;
    /**
     * The SQL that triggered the error
     * @type {string}
     */
    this.sql = parent.sql;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.DatabaseError = DatabaseError;

/**
 * Thrown when a database query times out because of a deadlock
 */
class TimeoutError extends DatabaseError {
  constructor(parent) {
    super(parent);
    this.name = 'SequelizeTimeoutError';
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.TimeoutError = TimeoutError;

/**
 * Thrown when a unique constraint is violated in the database
 */
class UniqueConstraintError extends ValidationError {
  constructor(options) {
    options = options || {};
    options.parent = options.parent || { sql: '' };
    options.message = options.message || options.parent.message || 'Validation Error';
    options.errors = options.errors || {};
    super(options.message, options.errors);

    this.name = 'SequelizeUniqueConstraintError';
    this.message = options.message;
    this.errors = options.errors;
    this.fields = options.fields;
    this.parent = options.parent;
    this.original = options.parent;
    this.sql = options.parent.sql;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.UniqueConstraintError = UniqueConstraintError;

/**
 * Thrown when a foreign key constraint is violated in the database
 */
class ForeignKeyConstraintError extends DatabaseError {
  constructor(options) {
    options = options || {};
    options.parent = options.parent || { sql: '' };

    super(options.parent);
    this.name = 'SequelizeForeignKeyConstraintError';

    this.message = options.message || options.parent.message || 'Database Error';
    this.fields = options.fields;
    this.table = options.table;
    this.value = options.value;
    this.index = options.index;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.ForeignKeyConstraintError = ForeignKeyConstraintError;

/**
 * Thrown when an exclusion constraint is violated in the database
 */
class ExclusionConstraintError extends DatabaseError {
  constructor(options) {
    options = options || {};
    options.parent = options.parent || { sql: '' };

    super(options.parent);
    this.name = 'SequelizeExclusionConstraintError';

    this.message = options.message || options.parent.message;
    this.constraint = options.constraint;
    this.fields = options.fields;
    this.table = options.table;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.ExclusionConstraintError = ExclusionConstraintError;

/**
 * Thrown when constraint name is not found in the database
 */
class UnknownConstraintError extends DatabaseError {
  constructor(message) {
    const parent = { message };
    super(parent);
    this.name = 'SequelizeUnknownConstraintError';
    this.message = message || 'The specified constraint does not exist';
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.UnknownConstraintError = UnknownConstraintError;

/**
 * Validation Error Item
 * Instances of this class are included in the `ValidationError.errors` property.
 *
 * @param {string} message An error message
 * @param {string} type The type of the validation error
 * @param {string} path The field that triggered the validation error
 * @param {string} value The value that generated the error
 */
class ValidationErrorItem {
  constructor(message, type, path, value) {
    this.message = message || '';
    this.type = type || null;
    this.path = path || null;
    this.value = value !== undefined ? value : null;
    //This doesn't need captureStackTrace because its not a subclass of Error
  }
}
exports.ValidationErrorItem = ValidationErrorItem;

/**
 * A base class for all connection related errors.
 */
class ConnectionError extends BaseError {
  constructor(parent) {
    super(parent ? parent.message : '');
    this.name = 'SequelizeConnectionError';
    /**
     * The connection specific error which triggered this one
     * @type {Error}
     */
    this.parent = parent;
    this.original = parent;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.ConnectionError = ConnectionError;

/**
 * Thrown when a connection to a database is refused
 */
class ConnectionRefusedError extends ConnectionError {
  constructor(parent) {
    super(parent);
    this.name = 'SequelizeConnectionRefusedError';
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.ConnectionRefusedError = ConnectionRefusedError;

/**
 * Thrown when a connection to a database is refused due to insufficient privileges
 */
class AccessDeniedError extends ConnectionError {
  constructor(parent) {
    super(parent);
    this.name = 'SequelizeAccessDeniedError';
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.AccessDeniedError = AccessDeniedError;

/**
 * Thrown when a connection to a database has a hostname that was not found
 */
class HostNotFoundError extends ConnectionError {
  constructor(parent) {
    super(parent);
    this.name = 'SequelizeHostNotFoundError';
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.HostNotFoundError = HostNotFoundError;

/**
 * Thrown when a connection to a database has a hostname that was not reachable
 */
class HostNotReachableError extends ConnectionError {
  constructor(parent) {
    super(parent);
    this.name = 'SequelizeHostNotReachableError';
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.HostNotReachableError = HostNotReachableError;

/**
 * Thrown when a connection to a database has invalid values for any of the connection parameters
 */
class InvalidConnectionError extends ConnectionError {
  constructor(parent) {
    super(parent);
    this.name = 'SequelizeInvalidConnectionError';
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.InvalidConnectionError = InvalidConnectionError;

/**
 * Thrown when a connection to a database times out
 */
class ConnectionTimedOutError extends ConnectionError {
  constructor(parent) {
    super(parent);
    this.name = 'SequelizeConnectionTimedOutError';
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.ConnectionTimedOutError = ConnectionTimedOutError;

/**
 * Thrown when a some problem occurred with Instance methods (see message for details)
 */
class InstanceError extends BaseError {
  constructor(message) {
    super(message);
    this.name = 'SequelizeInstanceError';
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.InstanceError = InstanceError;

/**
 * Thrown when a record was not found, Usually used with rejectOnEmpty mode (see message for details)
 */
class EmptyResultError extends BaseError {
  constructor(message) {
    super(message);
    this.name = 'SequelizeEmptyResultError';
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.EmptyResultError = EmptyResultError;

/**
 * Thrown when an include statement is improperly constructed (see message for details)
 */
class EagerLoadingError extends BaseError {
  constructor(message) {
    super(message);
    this.name = 'SequelizeEagerLoadingError';
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.EagerLoadingError = EagerLoadingError;

/**
 * Thrown when an association is improperly constructed (see message for details)
 */
class AssociationError extends BaseError {
  constructor(message) {
    super(message);
    this.name = 'SequelizeAssociationError';
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.AssociationError = AssociationError;
/**
 * Thrown when a query is passed invalid options (see message for details)
 */
class QueryError extends BaseError {
  constructor(message) {
    super(message);
    this.name = 'SequelizeQueryError';
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.QueryError = QueryError;


/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = require("validator");

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _ = __webpack_require__(0);
const wkx = __webpack_require__(34);
const inherits = __webpack_require__(11);

module.exports = BaseTypes => {
  const warn = BaseTypes.ABSTRACT.warn.bind(undefined, 'http://www.postgresql.org/docs/9.4/static/datatype.html');

  BaseTypes.UUID.types.postgres = {
    oids: [2950],
    array_oids: [2951]
  };

  BaseTypes.JSON.types.postgres = {
    oids: [114],
    array_oids: [199]
  };

  BaseTypes.JSONB.types.postgres = {
    oids: [3802],
    array_oids: [3807]
  };

  BaseTypes.TIME.types.postgres = {
    oids: [1083],
    array_oids: [1183]
  };

  function DATEONLY() {
    if (!(this instanceof DATEONLY)) return new DATEONLY();
    BaseTypes.DATEONLY.apply(this, arguments);
  }
  inherits(DATEONLY, BaseTypes.DATEONLY);

  DATEONLY.parse = function parse(value) {
    return value;
  };

  BaseTypes.DATEONLY.types.postgres = {
    oids: [1082],
    array_oids: [1182]
  };

  function DECIMAL(precision, scale) {
    if (!(this instanceof DECIMAL)) return new DECIMAL(precision, scale);
    BaseTypes.DECIMAL.apply(this, arguments);
  }
  inherits(DECIMAL, BaseTypes.DECIMAL);

  DECIMAL.parse = function parse(value) {
    return value;
  };

  // numeric
  BaseTypes.DECIMAL.types.postgres = {
    oids: [1700],
    array_oids: [1231]
  };

  function STRING(length, binary) {
    if (!(this instanceof STRING)) return new STRING(length, binary);
    BaseTypes.STRING.apply(this, arguments);
  }
  inherits(STRING, BaseTypes.STRING);

  STRING.prototype.toSql = function toSql() {
    if (this._binary) {
      return 'BYTEA';
    }
    return BaseTypes.STRING.prototype.toSql.call(this);
  };

  BaseTypes.STRING.types.postgres = {
    oids: [1043],
    array_oids: [1015]
  };

  function TEXT(length) {
    if (!(this instanceof TEXT)) return new TEXT(length);
    BaseTypes.TEXT.apply(this, arguments);
  }
  inherits(TEXT, BaseTypes.TEXT);

  TEXT.prototype.toSql = function toSql() {
    if (this._length) {
      warn('PostgreSQL does not support TEXT with options. Plain `TEXT` will be used instead.');
      this._length = undefined;
    }
    return 'TEXT';
  };

  BaseTypes.TEXT.types.postgres = {
    oids: [25],
    array_oids: [1009]
  };

  function CHAR(length, binary) {
    if (!(this instanceof CHAR)) return new CHAR(length, binary);
    BaseTypes.CHAR.apply(this, arguments);
  }
  inherits(CHAR, BaseTypes.CHAR);

  CHAR.prototype.toSql = function toSql() {
    if (this._binary) {
      return 'BYTEA';
    }
    return BaseTypes.CHAR.prototype.toSql.call(this);
  };

  BaseTypes.CHAR.types.postgres = {
    oids: [18, 1042],
    array_oids: [1002, 1014]
  };

  function BOOLEAN() {
    if (!(this instanceof BOOLEAN)) return new BOOLEAN();
    BaseTypes.BOOLEAN.apply(this, arguments);
  }
  inherits(BOOLEAN, BaseTypes.BOOLEAN);

  BOOLEAN.prototype.toSql = function toSql() {
    return 'BOOLEAN';
  };

  BaseTypes.BOOLEAN.types.postgres = {
    oids: [16],
    array_oids: [1000]
  };

  function DATE(length) {
    if (!(this instanceof DATE)) return new DATE(length);
    BaseTypes.DATE.apply(this, arguments);
  }
  inherits(DATE, BaseTypes.DATE);

  DATE.prototype.toSql = function toSql() {
    return 'TIMESTAMP WITH TIME ZONE';
  };

  BaseTypes.DATE.types.postgres = {
    oids: [1184],
    array_oids: [1185]
  };

  function INTEGER(length) {
    if (!(this instanceof INTEGER)) return new INTEGER(length);
    BaseTypes.INTEGER.apply(this, arguments);

    // POSTGRES does not support any parameters for integer
    if (this._length || this.options.length || this._unsigned || this._zerofill) {
      warn('PostgreSQL does not support INTEGER with options. Plain `INTEGER` will be used instead.');
      this._length = undefined;
      this.options.length = undefined;
      this._unsigned = undefined;
      this._zerofill = undefined;
    }
  }
  inherits(INTEGER, BaseTypes.INTEGER);

  INTEGER.parse = function parse(value) {
    return parseInt(value, 10);
  };

  // int4
  BaseTypes.INTEGER.types.postgres = {
    oids: [23],
    array_oids: [1007]
  };

  function BIGINT(length) {
    if (!(this instanceof BIGINT)) return new BIGINT(length);
    BaseTypes.BIGINT.apply(this, arguments);

    // POSTGRES does not support any parameters for bigint
    if (this._length || this.options.length || this._unsigned || this._zerofill) {
      warn('PostgreSQL does not support BIGINT with options. Plain `BIGINT` will be used instead.');
      this._length = undefined;
      this.options.length = undefined;
      this._unsigned = undefined;
      this._zerofill = undefined;
    }
  }
  inherits(BIGINT, BaseTypes.BIGINT);

  // int8
  BaseTypes.BIGINT.types.postgres = {
    oids: [20],
    array_oids: [1016]
  };

  function REAL(length, decimals) {
    if (!(this instanceof REAL)) return new REAL(length, decimals);
    BaseTypes.REAL.apply(this, arguments);

    // POSTGRES does not support any parameters for real
    if (this._length || this.options.length || this._unsigned || this._zerofill) {
      warn('PostgreSQL does not support REAL with options. Plain `REAL` will be used instead.');
      this._length = undefined;
      this.options.length = undefined;
      this._unsigned = undefined;
      this._zerofill = undefined;
    }
  }
  inherits(REAL, BaseTypes.REAL);

  // float4
  BaseTypes.REAL.types.postgres = {
    oids: [700],
    array_oids: [1021]
  };

  function DOUBLE(length, decimals) {
    if (!(this instanceof DOUBLE)) return new DOUBLE(length, decimals);
    BaseTypes.DOUBLE.apply(this, arguments);

    // POSTGRES does not support any parameters for double
    if (this._length || this.options.length || this._unsigned || this._zerofill) {
      warn('PostgreSQL does not support DOUBLE with options. Plain `DOUBLE` will be used instead.');
      this._length = undefined;
      this.options.length = undefined;
      this._unsigned = undefined;
      this._zerofill = undefined;
    }
  }
  inherits(DOUBLE, BaseTypes.DOUBLE);

  // float8
  BaseTypes.DOUBLE.types.postgres = {
    oids: [701],
    array_oids: [1022]
  };

  function FLOAT(length, decimals) {
    if (!(this instanceof FLOAT)) return new FLOAT(length, decimals);
    BaseTypes.FLOAT.apply(this, arguments);

    // POSTGRES does only support lengths as parameter.
    // Values between 1-24 result in REAL
    // Values between 25-53 result in DOUBLE PRECISION
    // If decimals are provided remove these and print a warning
    if (this._decimals) {
      warn('PostgreSQL does not support FLOAT with decimals. Plain `FLOAT` will be used instead.');
      this._length = undefined;
      this.options.length = undefined;
      this._decimals = undefined;
    }
    if (this._unsigned) {
      warn('PostgreSQL does not support FLOAT unsigned. `UNSIGNED` was removed.');
      this._unsigned = undefined;
    }
    if (this._zerofill) {
      warn('PostgreSQL does not support FLOAT zerofill. `ZEROFILL` was removed.');
      this._zerofill = undefined;
    }
  }
  inherits(FLOAT, BaseTypes.FLOAT);
  delete FLOAT.parse; // Float has no separate type in PG

  function BLOB(length) {
    if (!(this instanceof BLOB)) return new BLOB(length);
    BaseTypes.BLOB.apply(this, arguments);
  }
  inherits(BLOB, BaseTypes.BLOB);

  BLOB.prototype.toSql = function toSql() {
    if (this._length) {
      warn('PostgreSQL does not support BLOB (BYTEA) with options. Plain `BYTEA` will be used instead.');
      this._length = undefined;
    }
    return 'BYTEA';
  };

  BLOB.prototype._hexify = function _hexify(hex) {
    // bytea hex format http://www.postgresql.org/docs/current/static/datatype-binary.html
    return "E'\\\\x" + hex + "'";
  };

  BaseTypes.BLOB.types.postgres = {
    oids: [17],
    array_oids: [1001]
  };

  function GEOMETRY(type, srid) {
    if (!(this instanceof GEOMETRY)) return new GEOMETRY(type, srid);
    BaseTypes.GEOMETRY.apply(this, arguments);
  }
  inherits(GEOMETRY, BaseTypes.GEOMETRY);

  GEOMETRY.prototype.toSql = function toSql() {
    let result = this.key;

    if (this.type) {
      result += '(' + this.type;

      if (this.srid) {
        result += ',' + this.srid;
      }

      result += ')';
    }

    return result;
  };

  BaseTypes.GEOMETRY.types.postgres = {
    oids: [],
    array_oids: []
  };

  GEOMETRY.parse = GEOMETRY.prototype.parse = function parse(value) {
    const b = new Buffer(value, 'hex');
    return wkx.Geometry.parse(b).toGeoJSON();
  };

  GEOMETRY.prototype._stringify = function _stringify(value, options) {
    return 'ST_GeomFromGeoJSON(' + options.escape(JSON.stringify(value)) + ')';
  };

  function GEOGRAPHY(type, srid) {
    if (!(this instanceof GEOGRAPHY)) return new GEOGRAPHY(type, srid);
    BaseTypes.GEOGRAPHY.apply(this, arguments);
  }
  inherits(GEOGRAPHY, BaseTypes.GEOGRAPHY);

  GEOGRAPHY.prototype.toSql = function toSql() {
    let result = 'GEOGRAPHY';

    if (this.type) {
      result += '(' + this.type;

      if (this.srid) {
        result += ',' + this.srid;
      }

      result += ')';
    }

    return result;
  };

  BaseTypes.GEOGRAPHY.types.postgres = {
    oids: [],
    array_oids: []
  };

  GEOGRAPHY.parse = GEOGRAPHY.prototype.parse = function parse(value) {
    const b = new Buffer(value, 'hex');
    return wkx.Geometry.parse(b).toGeoJSON();
  };

  GEOGRAPHY.prototype._stringify = function _stringify(value, options) {
    return 'ST_GeomFromGeoJSON(' + options.escape(JSON.stringify(value)) + ')';
  };

  let hstore;
  function HSTORE() {
    if (!(this instanceof HSTORE)) return new HSTORE();
    BaseTypes.HSTORE.apply(this, arguments);

    if (!hstore) {
      // All datatype files are loaded at import - make sure we don't load the hstore parser before a hstore is instantiated
      hstore = __webpack_require__(28);
    }
  }
  inherits(HSTORE, BaseTypes.HSTORE);

  HSTORE.parse = function parse(value) {
    if (!hstore) {
      // All datatype files are loaded at import - make sure we don't load the hstore parser before a hstore is instantiated
      hstore = __webpack_require__(28);
    }
    return hstore.parse(value);
  };

  HSTORE.prototype.escape = false;
  HSTORE.prototype._stringify = function _stringify(value) {
    if (!hstore) {
      // All datatype files are loaded at import - make sure we don't load the hstore parser before a hstore is instantiated
      hstore = __webpack_require__(28);
    }
    return "'" + hstore.stringify(value) + "'";
  };

  BaseTypes.HSTORE.types.postgres = {
    oids: [],
    array_oids: []
  };

  function RANGE(subtype) {
    if (!(this instanceof RANGE)) return new RANGE(subtype);
    BaseTypes.RANGE.apply(this, arguments);
  }
  inherits(RANGE, BaseTypes.RANGE);

  RANGE.oid_map = {
    3904: 23, // int4
    3905: 23,
    3906: 1700, // Numeric
    3907: 1700,
    3908: 1114, // timestamp
    3909: 1114,
    3910: 1184, // timestamptz
    3911: 1184,
    3912: 1082, // date
    3913: 1082,
    3926: 20,    // int8
    3927: 20
  };

  const range = __webpack_require__(59);
  RANGE.parse = function parse(value, oid, getTypeParser) {
    const parser = getTypeParser(RANGE.oid_map[oid]);

    return range.parse(value, parser);
  };

  RANGE.prototype.escape = false;
  RANGE.prototype._stringify = function _stringify(values, options) {
    if (!Array.isArray(values)) {
      return "'" + this.options.subtype.stringify(values, options) + "'::" +
        this.toCastType();
    }
    const valuesStringified = values.map(value => {
      if (_.includes([null, -Infinity, Infinity], value)) {
        // Pass through "unbounded" bounds unchanged
        return value;
      } else if (this.options.subtype.stringify) {
        return this.options.subtype.stringify(value, options);
      } else {
        return options.escape(value);
      }
    });

    // Array.map does not preserve extra array properties
    valuesStringified.inclusive = values.inclusive;

    return  '\'' + range.stringify(valuesStringified) + '\'';
  };

  BaseTypes.RANGE.types.postgres = {
    oids: [3904, 3906, 3908, 3910, 3912, 3926],
    array_oids: [3905, 3907, 3909, 3911, 3913, 3927]
  };

  BaseTypes.ARRAY.prototype.escape = false;
  BaseTypes.ARRAY.prototype._stringify = function _stringify(values, options) {
    let str = 'ARRAY[' + values.map(value => {
      if (this.type && this.type.stringify) {
        value = this.type.stringify(value, options);

        if (this.type.escape === false) {
          return value;
        }
      }
      return options.escape(value);
    }, this).join(',') + ']';

    if (this.type) {
      str += '::' + this.toSql();
    }

    return str;
  };

  const exports = {
    DECIMAL,
    BLOB,
    STRING,
    CHAR,
    TEXT,
    INTEGER,
    BOOLEAN,
    DATE,
    DATEONLY,
    BIGINT,
    REAL,
    'DOUBLE PRECISION': DOUBLE,
    FLOAT,
    GEOMETRY,
    GEOGRAPHY,
    HSTORE,
    RANGE
  };

  _.forIn(exports, (DataType, key) => {
    if (!DataType.key) DataType.key = key;
    if (!DataType.extend) {
      DataType.extend = oldType => new DataType(oldType.options);
    }
  });

  return exports;
};


/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = require("pg-hstore");

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _ = __webpack_require__(0);

function stringifyRangeBound(bound) {
  if (bound === null) {
    return '' ;
  } else if (bound === Infinity || bound === -Infinity) {
    return bound.toString().toLowerCase();
  } else {
    return JSON.stringify(bound);
  }
}

function parseRangeBound(bound, parseType) {
  if (!bound) {
    return null;
  } else if (bound === 'infinity') {
    return Infinity;
  } else if (bound === '-infinity') {
    return -Infinity;
  } else {
    return parseType(bound);
  }
}

function stringify(data) {
  if (data === null) return null;

  if (!_.isArray(data)) throw new Error('range must be an array');
  if (!data.length) return 'empty';
  if (data.length !== 2) throw new Error('range array length must be 0 (empty) or 2 (lower and upper bounds)');

  if (data.hasOwnProperty('inclusive')) {
    if (data.inclusive === false) data.inclusive = [false, false];
    else if (!data.inclusive) data.inclusive = [true, false];
    else if (data.inclusive === true) data.inclusive = [true, true];
  } else {
    data.inclusive = [true, false];
  }

  _.each(data, (value, index) => {
    if (_.isObject(value)) {
      if (value.hasOwnProperty('inclusive')) data.inclusive[index] = !!value.inclusive;
      if (value.hasOwnProperty('value')) data[index] = value.value;
    }
  });

  const lowerBound = stringifyRangeBound(data[0]);
  const upperBound = stringifyRangeBound(data[1]);

  return (data.inclusive[0] ? '[' : '(') + lowerBound + ',' + upperBound + (data.inclusive[1] ? ']' : ')');
}
exports.stringify = stringify;

function parse(value, parser) {
  if (value === null) return null;
  if (value === 'empty') {
    const empty = [];
    empty.inclusive = [];
    return empty;
  }

  let result = value
    .substring(1, value.length - 1)
    .split(',', 2);

  if (result.length !== 2) return value;

  result = result.map(value => parseRangeBound(value, parser));

  result.inclusive = [value[0] === '[', value[value.length - 1] === ']'];

  return result;
}
exports.parse = parse;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const wkx = __webpack_require__(34);
const _ = __webpack_require__(0);
const moment = __webpack_require__(18);
const inherits = __webpack_require__(11);

module.exports = BaseTypes => {
  BaseTypes.ABSTRACT.prototype.dialectTypes = 'https://dev.mysql.com/doc/refman/5.7/en/data-types.html';

  BaseTypes.DATE.types.mysql = ['DATETIME'];
  BaseTypes.STRING.types.mysql = ['VAR_STRING'];
  BaseTypes.CHAR.types.mysql = ['STRING'];
  BaseTypes.TEXT.types.mysql = ['BLOB'];
  BaseTypes.INTEGER.types.mysql = ['LONG'];
  BaseTypes.BIGINT.types.mysql = ['LONGLONG'];
  BaseTypes.FLOAT.types.mysql = ['FLOAT'];
  BaseTypes.TIME.types.mysql = ['TIME'];
  BaseTypes.DATEONLY.types.mysql = ['DATE'];
  BaseTypes.BOOLEAN.types.mysql = ['TINY'];
  BaseTypes.BLOB.types.mysql = ['TINYBLOB', 'BLOB', 'LONGBLOB'];
  BaseTypes.DECIMAL.types.mysql = ['NEWDECIMAL'];
  BaseTypes.UUID.types.mysql = false;
  BaseTypes.ENUM.types.mysql = false;
  BaseTypes.REAL.types.mysql = ['DOUBLE'];
  BaseTypes.DOUBLE.types.mysql = ['DOUBLE'];
  BaseTypes.GEOMETRY.types.mysql = ['GEOMETRY'];

  function BLOB(length) {
    if (!(this instanceof BLOB)) return new BLOB(length);
    BaseTypes.BLOB.apply(this, arguments);
  }
  inherits(BLOB, BaseTypes.BLOB);

  BLOB.parse = function(value, options, next) {
    const data = next();

    if (Buffer.isBuffer(data) && data.length === 0) {
      return null;
    }

    return data;
  };

  function DECIMAL(precision, scale) {
    if (!(this instanceof DECIMAL)) return new DECIMAL(precision, scale);
    BaseTypes.DECIMAL.apply(this, arguments);
  }
  inherits(DECIMAL, BaseTypes.DECIMAL);

  DECIMAL.prototype.toSql = function toSql() {
    let definition = BaseTypes.DECIMAL.prototype.toSql.apply(this);

    if (this._unsigned) {
      definition += ' UNSIGNED';
    }

    if (this._zerofill) {
      definition += ' ZEROFILL';
    }

    return definition;
  };

  function DATE(length) {
    if (!(this instanceof DATE)) return new DATE(length);
    BaseTypes.DATE.apply(this, arguments);
  }
  inherits(DATE, BaseTypes.DATE);

  DATE.prototype.toSql = function toSql() {
    return 'DATETIME' + (this._length ? '(' + this._length + ')' : '');
  };

  DATE.prototype._stringify = function _stringify(date, options) {
    date = BaseTypes.DATE.prototype._applyTimezone(date, options);
    // Fractional DATETIMEs only supported on MySQL 5.6.4+
    if (this._length) {
      return date.format('YYYY-MM-DD HH:mm:ss.SSS');
    }

    return date.format('YYYY-MM-DD HH:mm:ss');
  };

  DATE.parse = function parse(value, options) {
    value = value.string();

    if (value === null) {
      return value;
    }

    if (moment.tz.zone(options.timezone)) {
      value = moment.tz(value, options.timezone).toDate();
    } else {
      value = new Date(value + ' ' + options.timezone);
    }

    return value;
  };

  function DATEONLY() {
    if (!(this instanceof DATEONLY)) return new DATEONLY();
    BaseTypes.DATEONLY.apply(this, arguments);
  }
  inherits(DATEONLY, BaseTypes.DATEONLY);

  DATEONLY.parse = function parse(value) {
    return value.string();
  };

  function UUID() {
    if (!(this instanceof UUID)) return new UUID();
    BaseTypes.UUID.apply(this, arguments);
  }
  inherits(UUID, BaseTypes.UUID);

  UUID.prototype.toSql = function toSql() {
    return 'CHAR(36) BINARY';
  };


  const SUPPORTED_GEOMETRY_TYPES = ['POINT', 'LINESTRING', 'POLYGON'];

  function GEOMETRY(type, srid) {
    if (!(this instanceof GEOMETRY)) return new GEOMETRY(type, srid);
    BaseTypes.GEOMETRY.apply(this, arguments);

    if (_.isEmpty(this.type)) {
      this.sqlType = this.key;
    } else if (_.includes(SUPPORTED_GEOMETRY_TYPES, this.type)) {
      this.sqlType = this.type;
    } else {
      throw new Error('Supported geometry types are: ' + SUPPORTED_GEOMETRY_TYPES.join(', '));
    }
  }
  inherits(GEOMETRY, BaseTypes.GEOMETRY);

  GEOMETRY.parse = GEOMETRY.prototype.parse = function parse(value) {
    value = value.buffer();

    // Empty buffer, MySQL doesn't support POINT EMPTY
    // check, https://dev.mysql.com/worklog/task/?id=2381
    if (value.length === 0) {
      return null;
    }

    // For some reason, discard the first 4 bytes
    value = value.slice(4);

    return wkx.Geometry.parse(value).toGeoJSON();
  };

  GEOMETRY.prototype.toSql = function toSql() {
    return this.sqlType;
  };

  function ENUM() {
    if (!(this instanceof ENUM)) {
      const obj = Object.create(ENUM.prototype);
      ENUM.apply(obj, arguments);
      return obj;
    }
    BaseTypes.ENUM.apply(this, arguments);
  }
  inherits(ENUM, BaseTypes.ENUM);

  ENUM.prototype.toSql = function toSql(options) {
    return 'ENUM(' + _.map(this.values, value => options.escape(value)).join(', ') + ')';
  };

  const exports = {
    ENUM,
    DATE,
    DATEONLY,
    UUID,
    GEOMETRY,
    DECIMAL,
    BLOB
  };

  _.forIn(exports, (DataType, key) => {
    if (!DataType.key) DataType.key = key;
    if (!DataType.extend) {
      DataType.extend = function extend(oldType) {
        return new DataType(oldType.options);
      };
    }
  });

  return exports;
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _ = __webpack_require__(0);
const inherits = __webpack_require__(11);

module.exports = BaseTypes => {
  const warn = BaseTypes.ABSTRACT.warn.bind(undefined, 'https://www.sqlite.org/datatype3.html');

  BaseTypes.DATE.types.sqlite = ['DATETIME'];
  BaseTypes.STRING.types.sqlite = ['VARCHAR', 'VARCHAR BINARY'];
  BaseTypes.CHAR.types.sqlite = ['CHAR', 'CHAR BINARY'];
  BaseTypes.TEXT.types.sqlite = ['TEXT'];
  BaseTypes.INTEGER.types.sqlite = ['INTEGER'];
  BaseTypes.BIGINT.types.sqlite = ['BIGINT'];
  BaseTypes.FLOAT.types.sqlite = ['FLOAT'];
  BaseTypes.TIME.types.sqlite = ['TIME'];
  BaseTypes.DATEONLY.types.sqlite = ['DATE'];
  BaseTypes.BOOLEAN.types.sqlite = ['TINYINT'];
  BaseTypes.BLOB.types.sqlite = ['TINYBLOB', 'BLOB', 'LONGBLOB'];
  BaseTypes.DECIMAL.types.sqlite = ['DECIMAL'];
  BaseTypes.UUID.types.sqlite = ['UUID'];
  BaseTypes.ENUM.types.sqlite = false;
  BaseTypes.REAL.types.sqlite = ['REAL'];
  BaseTypes.DOUBLE.types.sqlite = ['DOUBLE PRECISION'];
  BaseTypes.GEOMETRY.types.sqlite = false;
  BaseTypes.JSON.types.sqlite = ['JSON', 'JSONB'];

  function JSONTYPE() {
    if (!(this instanceof JSONTYPE)) return new JSONTYPE();
    BaseTypes.JSON.apply(this, arguments);
  }
  inherits(JSONTYPE, BaseTypes.JSON);

  JSONTYPE.parse = function parse(data) {
    return JSON.parse(data);
  };

  function DATE(length) {
    if (!(this instanceof DATE)) return new DATE(length);
    BaseTypes.DATE.apply(this, arguments);
  }
  inherits(DATE, BaseTypes.DATE);

  DATE.parse = function parse(date, options) {
    if (date.indexOf('+') === -1) {
      // For backwards compat. Dates inserted by sequelize < 2.0dev12 will not have a timestamp set
      return new Date(date + options.timezone);
    } else {
      return new Date(date); // We already have a timezone stored in the string
    }
  };

  function DATEONLY() {
    if (!(this instanceof DATEONLY)) return new DATEONLY();
    BaseTypes.DATEONLY.apply(this, arguments);
  }
  inherits(DATEONLY, BaseTypes.DATEONLY);

  DATEONLY.parse = function parse(date) {
    return date;
  };

  function STRING(length, binary) {
    if (!(this instanceof STRING)) return new STRING(length, binary);
    BaseTypes.STRING.apply(this, arguments);
  }
  inherits(STRING, BaseTypes.STRING);

  STRING.prototype.toSql = function toSql() {
    if (this._binary) {
      return 'VARCHAR BINARY(' + this._length + ')';
    } else {
      return BaseTypes.STRING.prototype.toSql.call(this);
    }
  };

  function TEXT(length) {
    if (!(this instanceof TEXT)) return new TEXT(length);
    BaseTypes.TEXT.apply(this, arguments);
  }
  inherits(TEXT, BaseTypes.TEXT);

  TEXT.prototype.toSql = function toSql() {
    if (this._length) {
      warn('SQLite does not support TEXT with options. Plain `TEXT` will be used instead.');
      this._length = undefined;
    }
    return 'TEXT';
  };

  function CHAR(length, binary) {
    if (!(this instanceof CHAR)) return new CHAR(length, binary);
    BaseTypes.CHAR.apply(this, arguments);
  }
  inherits(CHAR, BaseTypes.CHAR);

  CHAR.prototype.toSql = function toSql() {
    if (this._binary) {
      return 'CHAR BINARY(' + this._length + ')';
    } else {
      return BaseTypes.CHAR.prototype.toSql.call(this);
    }
  };

  function NUMBER(options) {
    if (!(this instanceof NUMBER)) return new NUMBER(options);
    BaseTypes.NUMBER.apply(this, arguments);
  }
  inherits(NUMBER, BaseTypes.NUMBER);

  NUMBER.prototype.toSql = function toSql() {
    let result = this.key;

    if (this._unsigned) {
      result += ' UNSIGNED';
    }
    if (this._zerofill) {
      result += ' ZEROFILL';
    }

    if (this._length) {
      result += '(' + this._length;
      if (typeof this._decimals === 'number') {
        result += ',' + this._decimals;
      }
      result += ')';
    }
    return result;
  };

  function INTEGER(length) {
    if (!(this instanceof INTEGER)) return new INTEGER(length);
    BaseTypes.INTEGER.apply(this, arguments);
  }
  inherits(INTEGER, BaseTypes.INTEGER);

  INTEGER.prototype.toSql = function toSql() {
    return NUMBER.prototype.toSql.call(this);
  };

  function BIGINT(length) {
    if (!(this instanceof BIGINT)) return new BIGINT(length);
    BaseTypes.BIGINT.apply(this, arguments);
  }
  inherits(BIGINT, BaseTypes.BIGINT);

  BIGINT.prototype.toSql = function toSql() {
    return NUMBER.prototype.toSql.call(this);
  };

  function FLOAT(length, decimals) {
    if (!(this instanceof FLOAT)) return new FLOAT(length, decimals);
    BaseTypes.FLOAT.apply(this, arguments);
  }
  inherits(FLOAT, BaseTypes.FLOAT);
  FLOAT.prototype.toSql = function toSql() {
    return NUMBER.prototype.toSql.call(this);
  };

  function DOUBLE(length, decimals) {
    if (!(this instanceof DOUBLE)) return new DOUBLE(length, decimals);
    BaseTypes.DOUBLE.apply(this, arguments);
  }
  inherits(DOUBLE, BaseTypes.DOUBLE);
  DOUBLE.prototype.toSql = function toSql() {
    return NUMBER.prototype.toSql.call(this);
  };

  function REAL(length, decimals) {
    if (!(this instanceof REAL)) return new REAL(length, decimals);
    BaseTypes.REAL.apply(this, arguments);
  }
  inherits(REAL, BaseTypes.REAL);
  REAL.prototype.toSql = function toSql() {
    return NUMBER.prototype.toSql.call(this);
  };

  [FLOAT, DOUBLE, REAL].forEach(floating => {
    floating.parse = function parse(value) {
      if (_.isString(value)) {
        if (value === 'NaN') {
          return NaN;
        } else if (value === 'Infinity') {
          return Infinity;
        } else if (value === '-Infinity') {
          return -Infinity;
        }
      }
      return value;
    };
  });

  function ENUM() {
    if (!(this instanceof ENUM)) {
      const obj = Object.create(ENUM.prototype);
      ENUM.apply(obj, arguments);
      return obj;
    }
    BaseTypes.ENUM.apply(this, arguments);
  }
  inherits(ENUM, BaseTypes.ENUM);

  ENUM.prototype.toSql = function toSql() {
    return 'TEXT';
  };

  const exports = {
    DATE,
    DATEONLY,
    STRING,
    CHAR,
    NUMBER,
    FLOAT,
    REAL,
    'DOUBLE PRECISION': DOUBLE,
    INTEGER,
    BIGINT,
    TEXT,
    ENUM,
    JSON: JSONTYPE
  };

  _.forIn(exports, (DataType, key) => {
    if (!DataType.key) DataType.key = key;
    if (!DataType.extend) {
      DataType.extend = oldType => {
        return new DataType(oldType.options);
      };
    }
  });

  return exports;

};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _ = __webpack_require__(0);
const moment = __webpack_require__(17);
const inherits = __webpack_require__(11);

module.exports = BaseTypes => {
  const warn = BaseTypes.ABSTRACT.warn.bind(undefined, 'https://msdn.microsoft.com/en-us/library/ms187752%28v=sql.110%29.aspx');

  BaseTypes.DATE.types.mssql = [43];
  BaseTypes.STRING.types.mssql = [231, 173];
  BaseTypes.CHAR.types.mssql = [175];
  BaseTypes.TEXT.types.mssql = false;
  BaseTypes.INTEGER.types.mssql = [38];
  BaseTypes.BIGINT.types.mssql = false;
  BaseTypes.FLOAT.types.mssql = [109];
  BaseTypes.TIME.types.mssql = [41];
  BaseTypes.DATEONLY.types.mssql = [40];
  BaseTypes.BOOLEAN.types.mssql = [104];
  BaseTypes.BLOB.types.mssql = [165];
  BaseTypes.DECIMAL.types.mssql = [106];
  BaseTypes.UUID.types.mssql = false;
  BaseTypes.ENUM.types.mssql = false;
  BaseTypes.REAL.types.mssql = [109];
  BaseTypes.DOUBLE.types.mssql = [109];
  // BaseTypes.GEOMETRY.types.mssql = [240]; // not yet supported
  BaseTypes.GEOMETRY.types.mssql = false;

  function BLOB(length) {
    if (!(this instanceof BLOB)) return new BLOB(length);
    BaseTypes.BLOB.apply(this, arguments);
  }
  inherits(BLOB, BaseTypes.BLOB);

  BLOB.prototype.toSql = function toSql() {
    if (this._length) {
      if (this._length.toLowerCase() === 'tiny') { // tiny = 2^8
        warn('MSSQL does not support BLOB with the `length` = `tiny` option. `VARBINARY(256)` will be used instead.');
        return 'VARBINARY(256)';
      }
      warn('MSSQL does not support BLOB with the `length` option. `VARBINARY(MAX)` will be used instead.');
    }
    return 'VARBINARY(MAX)';
  };

  BLOB.prototype._hexify = function _hexify(hex) {
    return '0x' + hex;
  };

  function STRING(length, binary) {
    if (!(this instanceof STRING)) return new STRING(length, binary);
    BaseTypes.STRING.apply(this, arguments);
  }
  inherits(STRING, BaseTypes.STRING);

  STRING.prototype.toSql = function toSql() {
    if (!this._binary) {
      return 'NVARCHAR(' + this._length + ')';
    } else {
      return 'BINARY(' + this._length + ')';
    }
  };

  STRING.prototype.escape = false;
  STRING.prototype._stringify = function _stringify(value, options) {
    if (this._binary) {
      return BLOB.prototype._stringify(value);
    } else {
      return options.escape(value);
    }
  };

  function TEXT(length) {
    if (!(this instanceof TEXT)) return new TEXT(length);
    BaseTypes.TEXT.apply(this, arguments);
  }
  inherits(TEXT, BaseTypes.TEXT);

  TEXT.prototype.toSql = function toSql() {
    // TEXT is deprecated in mssql and it would normally be saved as a non-unicode string.
    // Using unicode is just future proof
    if (this._length) {
      if (this._length.toLowerCase() === 'tiny') { // tiny = 2^8
        warn('MSSQL does not support TEXT with the `length` = `tiny` option. `NVARCHAR(256)` will be used instead.');
        return 'NVARCHAR(256)';
      }
      warn('MSSQL does not support TEXT with the `length` option. `NVARCHAR(MAX)` will be used instead.');
    }
    return 'NVARCHAR(MAX)';
  };

  function BOOLEAN() {
    if (!(this instanceof BOOLEAN)) return new BOOLEAN();
    BaseTypes.BOOLEAN.apply(this, arguments);
  }
  inherits(BOOLEAN, BaseTypes.BOOLEAN);

  BOOLEAN.prototype.toSql = function toSql() {
    return 'BIT';
  };

  function UUID() {
    if (!(this instanceof UUID)) return new UUID();
    BaseTypes.UUID.apply(this, arguments);
  }
  inherits(UUID, BaseTypes.UUID);

  UUID.prototype.toSql = function toSql() {
    return 'CHAR(36)';
  };

  function NOW() {
    if (!(this instanceof NOW)) return new NOW();
    BaseTypes.NOW.apply(this, arguments);
  }
  inherits(NOW, BaseTypes.NOW);

  NOW.prototype.toSql = function toSql() {
    return 'GETDATE()';
  };

  function DATE(length) {
    if (!(this instanceof DATE)) return new DATE(length);
    BaseTypes.DATE.apply(this, arguments);
  }
  inherits(DATE, BaseTypes.DATE);

  DATE.prototype.toSql = function toSql() {
    return 'DATETIMEOFFSET';
  };

  function DATEONLY() {
    if (!(this instanceof DATEONLY)) return new DATEONLY();
    BaseTypes.DATEONLY.apply(this, arguments);
  }
  inherits(DATEONLY, BaseTypes.DATEONLY);

  DATEONLY.parse = function(value) {
    return moment(value).format('YYYY-MM-DD');
  };

  function INTEGER(length) {
    if (!(this instanceof INTEGER)) return new INTEGER(length);
    BaseTypes.INTEGER.apply(this, arguments);

    // MSSQL does not support any options for integer
    if (this._length || this.options.length || this._unsigned || this._zerofill) {
      warn('MSSQL does not support INTEGER with options. Plain `INTEGER` will be used instead.');
      this._length = undefined;
      this.options.length = undefined;
      this._unsigned = undefined;
      this._zerofill = undefined;
    }
  }
  inherits(INTEGER, BaseTypes.INTEGER);

  function BIGINT(length) {
    if (!(this instanceof BIGINT)) return new BIGINT(length);
    BaseTypes.BIGINT.apply(this, arguments);

    // MSSQL does not support any options for bigint
    if (this._length || this.options.length || this._unsigned || this._zerofill) {
      warn('MSSQL does not support BIGINT with options. Plain `BIGINT` will be used instead.');
      this._length = undefined;
      this.options.length = undefined;
      this._unsigned = undefined;
      this._zerofill = undefined;
    }
  }
  inherits(BIGINT, BaseTypes.BIGINT);

  function REAL(length, decimals) {
    if (!(this instanceof REAL)) return new REAL(length, decimals);
    BaseTypes.REAL.apply(this, arguments);

    // MSSQL does not support any options for real
    if (this._length || this.options.length || this._unsigned || this._zerofill) {
      warn('MSSQL does not support REAL with options. Plain `REAL` will be used instead.');
      this._length = undefined;
      this.options.length = undefined;
      this._unsigned = undefined;
      this._zerofill = undefined;
    }
  }
  inherits(REAL, BaseTypes.REAL);

  function FLOAT(length, decimals) {
    if (!(this instanceof FLOAT)) return new FLOAT(length, decimals);
    BaseTypes.FLOAT.apply(this, arguments);

    // MSSQL does only support lengths as option.
    // Values between 1-24 result in 7 digits precision (4 bytes storage size)
    // Values between 25-53 result in 15 digits precision (8 bytes storage size)
    // If decimals are provided remove these and print a warning
    if (this._decimals) {
      warn('MSSQL does not support Float with decimals. Plain `FLOAT` will be used instead.');
      this._length = undefined;
      this.options.length = undefined;
    }
    if (this._unsigned) {
      warn('MSSQL does not support Float unsigned. `UNSIGNED` was removed.');
      this._unsigned = undefined;
    }
    if (this._zerofill) {
      warn('MSSQL does not support Float zerofill. `ZEROFILL` was removed.');
      this._zerofill = undefined;
    }
  }
  inherits(FLOAT, BaseTypes.FLOAT);

  function ENUM() {
    if (!(this instanceof ENUM)) {
      const obj = Object.create(ENUM.prototype);
      ENUM.apply(obj, arguments);
      return obj;
    }
    BaseTypes.ENUM.apply(this, arguments);
  }
  inherits(ENUM, BaseTypes.ENUM);

  ENUM.prototype.toSql = function toSql() {
    return 'VARCHAR(255)';
  };

  const exports = {
    BLOB,
    BOOLEAN,
    ENUM,
    STRING,
    UUID,
    DATE,
    DATEONLY,
    NOW,
    INTEGER,
    BIGINT,
    REAL,
    FLOAT,
    TEXT
  };

  _.forIn(exports, (DataType, key) => {
    if (!DataType.key) DataType.key = key;
    if (!DataType.extend) {
      DataType.extend = function extend(oldType) {
        return new DataType(oldType.options);
      };
    }
  });

  return exports;
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _ = __webpack_require__(0);
const util = __webpack_require__(7);
const Utils = __webpack_require__(1);

function validateDeprecation(value, expectation, options) {
  if (!options.deprecated) {
    return;
  }

  const valid = value instanceof options.deprecated || Object.prototype.toString.call(value) === Object.prototype.toString.call(options.deprecated.call());

  if (valid) {
    const message = `${util.inspect(value)} should not be of type "${options.deprecated.name}"`;
    Utils.deprecate(options.deprecationWarning || message);
  }

  return valid;
}

function validate(value, expectation) {
  // the second part of this check is a workaround to deal with an issue that occurs in node-webkit when
  // using object literals.  https://github.com/sequelize/sequelize/issues/2685
  if (value instanceof expectation || Object.prototype.toString.call(value) === Object.prototype.toString.call(expectation.call())) {
    return true;
  }

  throw new Error(`The parameter (value: ${value}) is no ${expectation.name}`);
}

function check(value, expectation, options) {
  options = _.extend({
    deprecated: false,
    index: null,
    method: null,
    optional: false
  }, options || {});

  if (!value && options.optional) {
    return true;
  }

  if (value === undefined) {
    throw new Error('No value has been passed.');
  }

  if (expectation === undefined) {
    throw new Error('No expectation has been passed.');
  }

  return false
    || validateDeprecation(value, expectation, options)
    || validate(value, expectation, options);
}

module.exports = check;
module.exports.check = check;
module.exports.default = check;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Sequelize module for debug and deprecation messages.
 * It require a `context` for which messages will be printed.
 *
 * @module logging
 * @private
 */

const depd = __webpack_require__(65),
  debug = __webpack_require__(66),
  _ = __webpack_require__(0);

class Logger {
  constructor(config) {

    this.config = _.extend({
      context: 'sequelize',
      debug: true
    }, config || {});

    this.depd = depd(this.config.context);
    this.debug = debug(this.config.context);
  }

  deprecate(message) {
    this.depd(message);
  }

  debug(message) {
    this.config.debug && this.debug(message);
  }

  warn(message) {
    console.warn(`(${this.config.context}) Warning: ${message}`);
  }

  debugContext(childContext) {
    if (!childContext) {
      throw new Error('No context supplied to debug');
    }
    return debug([this.config.context, childContext].join(':'));
  }
}

module.exports = Logger;


/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = require("depd");

/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = require("inflection");

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const validator = __webpack_require__(16).validator;
const extendModelValidations = __webpack_require__(16).extendModelValidations;
const Utils = __webpack_require__(1);
const sequelizeError = __webpack_require__(3);
const Promise = __webpack_require__(4);
const DataTypes = __webpack_require__(2);
const _ = __webpack_require__(0);

/**
 * The Main Instance Validator.
 *
 * @param {Instance} modelInstance The model instance.
 * @param {Object} options A dict with options.
 * @constructor
 * @private
 */
class InstanceValidator {

  constructor(modelInstance, options) {
    options = _.clone(options) || {};

    if (options.fields && !options.skip) {
      options.skip = Utils._.difference(Object.keys(modelInstance.constructor.rawAttributes), options.fields);
    }

    // assign defined and default options
    this.options = Utils._.defaults(options, {
      skip: [],
      hooks: true
    });

    this.modelInstance = modelInstance;

    /**
     * Exposes a reference to validator.js. This allows you to add custom validations using `validator.extend`
     * @name validator
     * @private
     */
    this.validator = validator;

    /**
     *  All errors will be stored here from the validations.
     *
     * @type {Array} Will contain keys that correspond to attributes which will
     *   be Arrays of Errors.
     * @private
     */
    this.errors = [];

    /**
     * @type {boolean} Indicates if validations are in progress
     * @private
     */
    this.inProgress = false;

    extendModelValidations(modelInstance);
  }

  /**
   * The main entry point for the Validation module, invoke to start the dance.
   *
   * @return {Promise}
   * @private
   */
  _validate() {
    if (this.inProgress) {
      throw new Error('Validations already in progress.');
    }
    this.inProgress = true;

    return Promise.all(
      [this._builtinValidators(), this._customValidators()].map(promise => promise.reflect())
    ).then(() => {
      if (this.errors.length) {
        throw new sequelizeError.ValidationError(null, this.errors);
      }
    });
  }

  /**
   * Invoke the Validation sequence and run validation hooks if defined
   *   - Before Validation Model Hooks
   *   - Validation
   *   - On validation success: After Validation Model Hooks
   *   - On validation failure: Validation Failed Model Hooks
   *
   * @return {Promise}
   * @private
   */
  validate() {
    return this.options.hooks ? this._validateAndRunHooks() : this._validate();
  }

  /**
   * Invoke the Validation sequence and run hooks
   *   - Before Validation Model Hooks
   *   - Validation
   *   - On validation success: After Validation Model Hooks
   *   - On validation failure: Validation Failed Model Hooks
   *
   * @return {Promise}
   * @private
   */
  _validateAndRunHooks() {
    const runHooks = this.modelInstance.constructor.runHooks.bind(this.modelInstance.constructor);
    return runHooks('beforeValidate', this.modelInstance, this.options)
      .then(() =>
        this._validate()
          .catch(error => runHooks('validationFailed', this.modelInstance, this.options, error)
            .then(newError => { throw newError || error; }))
      )
      .then(() => runHooks('afterValidate', this.modelInstance, this.options))
      .return(this.modelInstance);
  }

  /**
   * Will run all the built-in validators.
   *
   * @return {Promise(Array.<Promise.PromiseInspection>)} A promise from .reflect().
   * @private
   */
  _builtinValidators() {
    // promisify all attribute invocations
    const validators = [];
    Utils._.forIn(this.modelInstance.rawAttributes, (rawAttribute, field) => {
      if (this.options.skip.indexOf(field) >= 0) {
        return;
      }

      const value = this.modelInstance.dataValues[field];

      if (!rawAttribute._autoGenerated && !rawAttribute.autoIncrement) {
        // perform validations based on schema
        this._validateSchema(rawAttribute, field, value);
      }

      if (this.modelInstance.validators.hasOwnProperty(field)) {
        validators.push(this._builtinAttrValidate.call(this, value, field).reflect());
      }
    });

    return Promise.all(validators);
  }

  /**
   * Will run all the custom validators.
   *
   * @return {Promise(Array.<Promise.PromiseInspection>)} A promise from .reflect().
   * @private
   */
  _customValidators() {
    const validators = [];
    Utils._.each(this.modelInstance._modelOptions.validate, (validator, validatorType) => {
      if (this.options.skip.indexOf(validatorType) >= 0) {
        return;
      }

      const valprom = this._invokeCustomValidator(validator, validatorType)
        // errors are handled in settling, stub this
        .catch(() => {})
        .reflect();

      validators.push(valprom);
    });

    return Promise.all(validators);
  }

  /**
   * Validate a single attribute with all the defined built-in validators.
   *
   * @param {*} value Anything.
   * @param {string} field The field name.
   * @return {Promise} A promise, will always resolve,
   *   auto populates error on this.error local object.
   * @private
   */
  _builtinAttrValidate(value, field) {
    // check if value is null (if null not allowed the Schema pass will capture it)
    if (value === null || typeof value === 'undefined') {
      return Promise.resolve();
    }

    // Promisify each validator
    const validators = [];
    Utils._.forIn(this.modelInstance.validators[field], (test, validatorType) => {

      if (['isUrl', 'isURL', 'isEmail'].indexOf(validatorType) !== -1) {
        // Preserve backwards compat. Validator.js now expects the second param to isURL and isEmail to be an object
        if (typeof test === 'object' && test !== null && test.msg) {
          test = {
            msg: test.msg
          };
        } else if (test === true) {
          test = {};
        }
      }

      // Check for custom validator.
      if (typeof test === 'function') {
        return validators.push(this._invokeCustomValidator(test, validatorType, true, value, field).reflect());
      }

      const validatorPromise = this._invokeBuiltinValidator(value, test, validatorType, field);
      // errors are handled in settling, stub this
      validatorPromise.catch(() => {});
      validators.push(validatorPromise.reflect());
    });

    return Promise
      .all(validators)
      .then(results => this._handleReflectedResult(field, value, results));
  }

  /**
   * Prepare and invoke a custom validator.
   *
   * @param {Function} validator The custom validator.
   * @param {string} validatorType the custom validator type (name).
   * @param {boolean=} optAttrDefined Set to true if custom validator was defined
   *   from the Attribute
   * @return {Promise} A promise.
   * @private
   */
  _invokeCustomValidator(validator, validatorType, optAttrDefined, optValue, optField) {
    let validatorFunction = null;  // the validation function to call
    let isAsync = false;

    const validatorArity = validator.length;
    // check if validator is async and requires a callback
    let asyncArity = 1;
    let errorKey = validatorType;
    let invokeArgs;
    if (optAttrDefined) {
      asyncArity = 2;
      invokeArgs = optValue;
      errorKey = optField;
    }
    if (validatorArity === asyncArity) {
      isAsync = true;
    }

    if (isAsync) {
      if (optAttrDefined) {
        validatorFunction = Promise.promisify(validator.bind(this.modelInstance, invokeArgs));
      } else {
        validatorFunction = Promise.promisify(validator.bind(this.modelInstance));
      }
      return validatorFunction()
        .catch(e => this._pushError(false, errorKey, e, optValue));
    } else {
      return Promise
        .try(() => validator.call(this.modelInstance, invokeArgs))
        .catch(e => this._pushError(false, errorKey, e, optValue));
    }
  }

  /**
   * Prepare and invoke a build-in validator.
   *
   * @param {*} value Anything.
   * @param {*} test The test case.
   * @param {string} validatorType One of known to Sequelize validators.
   * @param {string} field The field that is being validated
   * @return {Object} An object with specific keys to invoke the validator.
   * @private
   */
  _invokeBuiltinValidator(value, test, validatorType, field) {
    return Promise.try(() => {
      // Cast value as string to pass new Validator.js string requirement
      const valueString = String(value);
      // check if Validator knows that kind of validation test
      if (typeof validator[validatorType] !== 'function') {
        throw new Error('Invalid validator function: ' + validatorType);
      }
      const validatorArgs = this._extractValidatorArgs(test, validatorType, field);
      if (!validator[validatorType].apply(validator, [valueString].concat(validatorArgs))) {
      // extract the error msg
        throw new Error(test.msg || `Validation ${validatorType} on ${field} failed`);
      }
    });
  }

  /**
   * Will extract arguments for the validator.
   *
   * @param {*} test The test case.
   * @param {string} validatorType One of known to Sequelize validators.
   * @param {string} field The field that is being validated.
   * @private
   */
  _extractValidatorArgs(test, validatorType, field) {
    let validatorArgs = test.args || test;
    const isLocalizedValidator = typeof validatorArgs !== 'string' && (validatorType === 'isAlpha' || validatorType === 'isAlphanumeric' || validatorType === 'isMobilePhone');

    if (!Array.isArray(validatorArgs)) {
      if (validatorType === 'isImmutable') {
        validatorArgs = [validatorArgs, field];
      } else if (isLocalizedValidator || validatorType === 'isIP') {
        validatorArgs = [];
      } else {
        validatorArgs = [validatorArgs];
      }
    } else {
      validatorArgs = validatorArgs.slice(0);
    }
    return validatorArgs;
  }

  /**
   * Will validate a single field against its schema definition (isnull).
   *
   * @param {Object} rawAttribute As defined in the Schema.
   * @param {string} field The field name.
   * @param {*} value anything.
   * @private
   */
  _validateSchema(rawAttribute, field, value) {
    let error;

    if (rawAttribute.allowNull === false && (value === null || value === undefined)) {
      const validators = this.modelInstance.validators[field];
      const errMsg = _.get(validators, 'notNull.msg', `${field} cannot be null`);
      error = new sequelizeError.ValidationErrorItem(errMsg, 'notNull Violation', field, value);
      this.errors.push(error);
    }

    if (rawAttribute.type === DataTypes.STRING || rawAttribute.type instanceof DataTypes.STRING || rawAttribute.type === DataTypes.TEXT || rawAttribute.type instanceof DataTypes.TEXT) {
      if (Array.isArray(value) || _.isObject(value) && !(value instanceof Utils.SequelizeMethod) && !Buffer.isBuffer(value)) {
        error = new sequelizeError.ValidationErrorItem(`${field} cannot be an array or an object`, 'string violation', field, value);
        this.errors.push(error);
      }
    }
  }


  /**
   * Handles the returned result of a Promise.reflect.
   *
   * If errors are found it populates this.error.
   *
   * @param {string} field The attribute name.
   * @param {string|number} value The data value.
   * @param {Array.<Promise.PromiseInspection>} Promise inspection objects.
   * @private
   */
  _handleReflectedResult(field, value, promiseInspections) {
    for (const promiseInspection of promiseInspections) {
      if (promiseInspection.isRejected()) {
        const rejection = promiseInspection.error();
        this._pushError(true, field, rejection, value);
      }
    }
  }

  /**
   * Signs all errors retaining the original.
   *
   * @param {boolean} isBuiltin Determines if error is from builtin validator.
   * @param {string} errorKey The error key to assign on this.errors object.
   * @param {Error|string} rawError The original error.
   * @param {string|number} value The data that triggered the error.
   * @private
   */
  _pushError(isBuiltin, errorKey, rawError, value) {
    const message = rawError.message || rawError || 'Validation error';
    const error = new sequelizeError.ValidationErrorItem(message, 'Validation error', errorKey, value);
    error[InstanceValidator.RAW_KEY_NAME] = rawError;

    this.errors.push(error);
  }
}
/**
 * @define {string} The error key for arguments as passed by custom validators
 * @private
 */
InstanceValidator.RAW_KEY_NAME = '__raw';

module.exports = InstanceValidator;
module.exports.InstanceValidator = InstanceValidator;
module.exports.default = InstanceValidator;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const _ = __webpack_require__(0);
const HasOne = __webpack_require__(31);
const HasMany = __webpack_require__(13);
const BelongsToMany = __webpack_require__(21);
const BelongsTo = __webpack_require__(12);

const Mixin = {
  hasMany(target, options) { // testhint options:none
    if (!target || !target.prototype || !(target.prototype instanceof this.sequelize.Model)) {
      throw new Error(this.name + '.hasMany called with something that\'s not a subclass of Sequelize.Model');
    }

    const source = this;

    // Since this is a mixin, we'll need a unique letiable name for hooks (since Model will override our hooks option)
    options = options || {};
    options.hooks = options.hooks === undefined ? false : Boolean(options.hooks);
    options.useHooks = options.hooks;

    options = _.extend(options, _.omit(source.options, ['hooks']));

    // the id is in the foreign table or in a connecting table
    const association = new HasMany(source, target, options);
    source.associations[association.associationAccessor] = association;

    association.injectAttributes();
    association.mixin(source.prototype);

    return association;
  },

  belongsToMany(targetModel, options) { // testhint options:none
    if (!targetModel || !targetModel.prototype || !(targetModel.prototype instanceof this.sequelize.Model)) {
      throw new Error(this.name + '.belongsToMany called with something that\'s not a subclass of Sequelize.Model');
    }

    const sourceModel = this;

    // Since this is a mixin, we'll need a unique letiable name for hooks (since Model will override our hooks option)
    options = options || {};
    options.hooks = options.hooks === undefined ? false : Boolean(options.hooks);
    options.useHooks = options.hooks;
    options.timestamps = options.timestamps === undefined ? this.sequelize.options.timestamps : options.timestamps;
    options = _.extend(options, _.omit(sourceModel.options, ['hooks', 'timestamps', 'scopes', 'defaultScope']));

    // the id is in the foreign table or in a connecting table
    const association = new BelongsToMany(sourceModel, targetModel, options);
    sourceModel.associations[association.associationAccessor] = association;

    association.injectAttributes();
    association.mixin(sourceModel.prototype);

    return association;
  },

  getAssociations(target) {
    return _.values(this.associations).filter(association => association.target.name === target.name);
  },

  getAssociationForAlias(target, alias) {
    // Two associations cannot have the same alias, so we can use find instead of filter
    return this.getAssociations(target).find(association => this.verifyAssociationAlias(association, alias)) || null;
  },

  verifyAssociationAlias(association, alias) {
    if (alias) {
      return association.as === alias;
    } else {
      return !association.isAliased;
    }
  }
};

// The logic for hasOne and belongsTo is exactly the same
function singleLinked(Type) {
  return function(target, options) { // testhint options:none
    if (!target || !target.prototype || !(target.prototype instanceof this.sequelize.Model)) {
      throw new Error(this.name + '.' + Utils.lowercaseFirst(Type.toString()) + ' called with something that\'s not a subclass of Sequelize.Model');
    }

    const source = this;

    // Since this is a mixin, we'll need a unique letiable name for hooks (since Model will override our hooks option)
    options = options || {};
    options.hooks = options.hooks === undefined ? false : Boolean(options.hooks);
    options.useHooks = options.hooks;

    // the id is in the foreign table
    const association = new Type(source, target, _.extend(options, source.options));
    source.associations[association.associationAccessor] = association;

    association.injectAttributes();
    association.mixin(source.prototype);

    return association;
  };
}

Mixin.hasOne = singleLinked(HasOne);

Mixin.belongsTo = singleLinked(BelongsTo);

module.exports = Mixin;
module.exports.Mixin = Mixin;
module.exports.default = Mixin;


/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const util = __webpack_require__(7);


/**
 * A collection of properties related to deferrable constraints. It can be used to
 * make foreign key constraints deferrable and to set the constraints within a
 * transaction. This is only supported in PostgreSQL.
 *
 * The foreign keys can be configured like this. It will create a foreign key
 * that will check the constraints immediately when the data was inserted.
 *
 * ```js
 * sequelize.define('Model', {
 *   foreign_id: {
 *     type: Sequelize.INTEGER,
 *     references: {
 *       model: OtherModel,
 *       key: 'id',
 *       deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
 *     }
 *   }
 * });
 * ```
 *
 * The constraints can be configured in a transaction like this. It will
 * trigger a query once the transaction has been started and set the constraints
 * to be checked at the very end of the transaction.
 *
 * ```js
 * sequelize.transaction({
 *   deferrable: Sequelize.Deferrable.SET_DEFERRED
 * });
 * ```
 *
 * @property INITIALLY_DEFERRED Defer constraints checks to the end of transactions.
 * @property INITIALLY_IMMEDIATE Trigger the constraint checks immediately
 * @property NOT Set the constraints to not deferred. This is the default in PostgreSQL and it make it impossible to dynamically defer the constraints within a transaction.
 * @property SET_DEFERRED
 * @property SET_IMMEDIATE
 */
const Deferrable = module.exports = {
  INITIALLY_DEFERRED,
  INITIALLY_IMMEDIATE,
  NOT,
  SET_DEFERRED,
  SET_IMMEDIATE
};

function ABSTRACT() {}

ABSTRACT.prototype.toString = function() {
  return this.toSql.apply(this, arguments);
};

function INITIALLY_DEFERRED() {
  if (!(this instanceof INITIALLY_DEFERRED)) {
    return new INITIALLY_DEFERRED();
  }
}
util.inherits(INITIALLY_DEFERRED, ABSTRACT);

INITIALLY_DEFERRED.prototype.toSql = function() {
  return 'DEFERRABLE INITIALLY DEFERRED';
};

function INITIALLY_IMMEDIATE() {
  if (!(this instanceof INITIALLY_IMMEDIATE)) {
    return new INITIALLY_IMMEDIATE();
  }
}
util.inherits(INITIALLY_IMMEDIATE, ABSTRACT);

INITIALLY_IMMEDIATE.prototype.toSql = function() {
  return 'DEFERRABLE INITIALLY IMMEDIATE';
};

function NOT() {
  if (!(this instanceof NOT)) {
    return new NOT();
  }
}
util.inherits(NOT, ABSTRACT);

NOT.prototype.toSql = function() {
  return 'NOT DEFERRABLE';
};

function SET_DEFERRED(constraints) {
  if (!(this instanceof SET_DEFERRED)) {
    return new SET_DEFERRED(constraints);
  }

  this.constraints = constraints;
}
util.inherits(SET_DEFERRED, ABSTRACT);

SET_DEFERRED.prototype.toSql = function(queryGenerator) {
  return queryGenerator.setDeferredQuery(this.constraints);
};

function SET_IMMEDIATE(constraints) {
  if (!(this instanceof SET_IMMEDIATE)) {
    return new SET_IMMEDIATE(constraints);
  }

  this.constraints = constraints;
}
util.inherits(SET_IMMEDIATE, ABSTRACT);

SET_IMMEDIATE.prototype.toSql = function(queryGenerator) {
  return queryGenerator.setImmediateQuery(this.constraints);
};

Object.keys(Deferrable).forEach(key => {
  const DeferrableType = Deferrable[key];

  DeferrableType.toString = function() {
    const instance = new DeferrableType();
    return instance.toString.apply(instance, arguments);
  };
});


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Toposort = __webpack_require__(74);
const _ = __webpack_require__(0);

class ModelManager {
  constructor(sequelize) {
    this.models = [];
    this.sequelize = sequelize;
  }

  addModel(model) {
    this.models.push(model);
    this.sequelize.models[model.name] = model;

    return model;
  }

  removeModel(modelToRemove) {
    this.models = this.models.filter(model => model.name !== modelToRemove.name);

    delete this.sequelize.models[modelToRemove.name];
  }

  getModel(against, options) {
    options = _.defaults(options || {}, {
      attribute: 'name'
    });

    const model = this.models.filter(model => model[options.attribute] === against);

    return model ? model[0] : null;
  }

  get all() {
    return this.models;
  }

  /**
   * Iterate over Models in an order suitable for e.g. creating tables. Will
   * take foreign key constraints into account so that dependencies are visited
   * before dependents.
   * @private
   */
  forEachModel(iterator, options) {
    const models = {};
    const sorter = new Toposort();
    let sorted;
    let dep;

    options = _.defaults(options || {}, {
      reverse: true
    });

    for (const model of this.models) {
      let deps = [];
      let tableName = model.getTableName();

      if (_.isObject(tableName)) {
        tableName = tableName.schema + '.' + tableName.tableName;
      }

      models[tableName] = model;

      for (const attrName in model.rawAttributes) {
        if (model.rawAttributes.hasOwnProperty(attrName)) {
          const attribute = model.rawAttributes[attrName];

          if (attribute.references) {
            dep = attribute.references.model;

            if (_.isObject(dep)) {
              dep = dep.schema + '.' + dep.tableName;
            }

            deps.push(dep);
          }
        }
      }

      deps = deps.filter(dep => tableName !== dep);

      sorter.add(tableName, deps);
    }

    sorted = sorter.sort();
    if (options.reverse) {
      sorted = sorted.reverse();
    }
    for (const name of sorted) {
      iterator(models[name], name);
    }
  }
}

module.exports = ModelManager;
module.exports.ModelManager = ModelManager;
module.exports.default = ModelManager;


/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = require("toposort-class");

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const _ = __webpack_require__(0);
const DataTypes = __webpack_require__(2);
const SQLiteQueryInterface = __webpack_require__(76);
const MSSSQLQueryInterface = __webpack_require__(77);
const MySQLQueryInterface = __webpack_require__(78);
const Transaction = __webpack_require__(20);
const Promise = __webpack_require__(4);
const QueryTypes = __webpack_require__(9);

/**
 * The interface that Sequelize uses to talk to all databases
 * @class QueryInterface
 * @private
 */
class QueryInterface {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.QueryGenerator = this.sequelize.dialect.QueryGenerator;
  }

  createSchema(schema, options) {
    options = options || {};
    const sql = this.QueryGenerator.createSchema(schema);
    return this.sequelize.query(sql, options);
  }

  dropSchema(schema, options) {
    options = options || {};
    const sql = this.QueryGenerator.dropSchema(schema);
    return this.sequelize.query(sql, options);
  }

  dropAllSchemas(options) {
    options = options || {};

    if (!this.QueryGenerator._dialect.supports.schemas) {
      return this.sequelize.drop(options);
    } else {
      return this.showAllSchemas(options).map(schemaName => this.dropSchema(schemaName, options));
    }
  }

  showAllSchemas(options) {

    options = _.assign({}, options, {
      raw: true,
      type: this.sequelize.QueryTypes.SELECT
    });

    const showSchemasSql = this.QueryGenerator.showSchemasQuery();

    return this.sequelize.query(showSchemasSql, options).then(schemaNames => Utils._.flatten(
      Utils._.map(schemaNames, value => value.schema_name ? value.schema_name : value)
    ));
  }

  databaseVersion(options) {
    return this.sequelize.query(
      this.QueryGenerator.versionQuery(),
      _.assign({}, options, { type: QueryTypes.VERSION })
    );
  }

  createTable(tableName, attributes, options, model) {
    const keys = Object.keys(attributes);
    const keyLen = keys.length;
    let sql = '';
    let i = 0;

    options = _.clone(options) || {};

    attributes = Utils._.mapValues(attributes, attribute => {
      if (!Utils._.isPlainObject(attribute)) {
        attribute = { type: attribute, allowNull: true };
      }

      attribute = this.sequelize.normalizeAttribute(attribute);

      return attribute;
    });

    // Postgres requires a special SQL command for enums
    if (this.sequelize.options.dialect === 'postgres') {
      const promises = [];

      for (i = 0; i < keyLen; i++) {
        if (attributes[keys[i]].type instanceof DataTypes.ENUM) {
          sql = this.QueryGenerator.pgListEnums(tableName, attributes[keys[i]].field || keys[i], options);
          promises.push(this.sequelize.query(
            sql,
            _.assign({}, options, { plain: true, raw: true, type: QueryTypes.SELECT })
          ));
        }
      }

      return Promise.all(promises).then(results => {
        const promises = [];
        let enumIdx = 0;

        for (i = 0; i < keyLen; i++) {
          if (attributes[keys[i]].type instanceof DataTypes.ENUM) {
            // If the enum type doesn't exist then create it
            if (!results[enumIdx]) {
              sql = this.QueryGenerator.pgEnum(tableName, attributes[keys[i]].field || keys[i], attributes[keys[i]], options);
              promises.push(this.sequelize.query(
                sql,
                _.assign({}, options, { raw: true })
              ));
            } else if (!!results[enumIdx] && !!model) {
              const enumVals = this.QueryGenerator.fromArray(results[enumIdx].enum_value);
              const vals = model.rawAttributes[keys[i]].values;

              vals.forEach((value, idx) => {
                // reset out after/before options since it's for every enum value
                const valueOptions = _.clone(options);
                valueOptions.before = null;
                valueOptions.after = null;

                if (enumVals.indexOf(value) === -1) {
                  if (vals[idx + 1]) {
                    valueOptions.before = vals[idx + 1];
                  }
                  else if (vals[idx - 1]) {
                    valueOptions.after = vals[idx - 1];
                  }
                  valueOptions.supportsSearchPath = false;
                  promises.push(this.sequelize.query(this.QueryGenerator.pgEnumAdd(tableName, keys[i], value, valueOptions), valueOptions));
                }
              });
              enumIdx++;
            }
          }
        }

        if (!tableName.schema &&
          (options.schema || !!model && model._schema)) {
          tableName = this.QueryGenerator.addSchema({
            tableName,
            _schema: !!model && model._schema || options.schema
          });
        }

        attributes = this.QueryGenerator.attributesToSQL(attributes, {
          context: 'createTable'
        });
        sql = this.QueryGenerator.createTableQuery(tableName, attributes, options);

        return Promise.all(promises).then(() => {
          return this.sequelize.query(sql, options);
        });
      });
    } else {
      if (!tableName.schema &&
        (options.schema || !!model && model._schema)) {
        tableName = this.QueryGenerator.addSchema({
          tableName,
          _schema: !!model && model._schema || options.schema
        });
      }

      attributes = this.QueryGenerator.attributesToSQL(attributes, {
        context: 'createTable'
      });
      sql = this.QueryGenerator.createTableQuery(tableName, attributes, options);

      return this.sequelize.query(sql, options);
    }
  }

  dropTable(tableName, options) {
    // if we're forcing we should be cascading unless explicitly stated otherwise
    options = _.clone(options) || {};
    options.cascade = options.cascade || options.force || false;

    let sql = this.QueryGenerator.dropTableQuery(tableName, options);

    return this.sequelize.query(sql, options).then(() => {
      const promises = [];

      // Since postgres has a special case for enums, we should drop the related
      // enum type within the table and attribute
      if (this.sequelize.options.dialect === 'postgres') {
        const instanceTable = this.sequelize.modelManager.getModel(tableName, { attribute: 'tableName' });

        if (instanceTable) {
          const getTableName = (!options || !options.schema || options.schema === 'public' ? '' : options.schema + '_') + tableName;

          const keys = Object.keys(instanceTable.rawAttributes);
          const keyLen = keys.length;

          for (let i = 0; i < keyLen; i++) {
            if (instanceTable.rawAttributes[keys[i]].type instanceof DataTypes.ENUM) {
              sql = this.QueryGenerator.pgEnumDrop(getTableName, keys[i]);
              options.supportsSearchPath = false;
              promises.push(this.sequelize.query(sql, _.assign({}, options, { raw: true })));
            }
          }
        }
      }

      return Promise.all(promises).get(0);
    });
  }

  dropAllTables(options) {

    options = options || {};
    const skip = options.skip || [];

    const dropAllTables = tableNames => Promise.each(tableNames, tableName => {
      // if tableName is not in the Array of tables names then dont drop it
      if (skip.indexOf(tableName.tableName || tableName) === -1) {
        return this.dropTable(tableName, _.assign({}, options, { cascade: true }) );
      }
    });

    return this.showAllTables(options).then(tableNames => {
      if (this.sequelize.options.dialect === 'sqlite') {
        return this.sequelize.query('PRAGMA foreign_keys;', options).then(result => {
          const foreignKeysAreEnabled = result.foreign_keys === 1;

          if (foreignKeysAreEnabled) {
            return this.sequelize.query('PRAGMA foreign_keys = OFF', options)
              .then(() => dropAllTables(tableNames))
              .then(() => this.sequelize.query('PRAGMA foreign_keys = ON', options));
          } else {
            return dropAllTables(tableNames);
          }
        });
      } else {
        return this.getForeignKeysForTables(tableNames, options).then(foreignKeys => {
          const promises = [];

          tableNames.forEach(tableName => {
            let normalizedTableName = tableName;
            if (Utils._.isObject(tableName)) {
              normalizedTableName = tableName.schema + '.' + tableName.tableName;
            }

            foreignKeys[normalizedTableName].forEach(foreignKey => {
              const sql = this.QueryGenerator.dropForeignKeyQuery(tableName, foreignKey);
              promises.push(this.sequelize.query(sql, options));
            });
          });

          return Promise.all(promises).then(() => dropAllTables(tableNames));
        });
      }
    });
  }

  dropAllEnums(options) {
    if (this.sequelize.getDialect() !== 'postgres') {
      return Promise.resolve();
    }

    options = options || {};

    return this.pgListEnums(null, options).map(result => this.sequelize.query(
      this.QueryGenerator.pgEnumDrop(null, null, this.QueryGenerator.pgEscapeAndQuote(result.enum_name)),
      _.assign({}, options, { raw: true })
    ));
  }

  pgListEnums(tableName, options) {
    options = options || {};
    const sql = this.QueryGenerator.pgListEnums(tableName);
    return this.sequelize.query(sql, _.assign({}, options, { plain: false, raw: true, type: QueryTypes.SELECT }));
  }

  renameTable(before, after, options) {
    options = options || {};
    const sql = this.QueryGenerator.renameTableQuery(before, after);
    return this.sequelize.query(sql, options);
  }

  showAllTables(options) {
    options = _.assign({}, options, {
      raw: true,
      type: QueryTypes.SHOWTABLES
    });

    const showTablesSql = this.QueryGenerator.showTablesQuery();
    return this.sequelize.query(showTablesSql, options).then(tableNames => Utils._.flatten(tableNames));
  }

  describeTable(tableName, options) {
    let schema = null;
    let schemaDelimiter = null;

    if (typeof options === 'string') {
      schema = options;
    } else if (typeof options === 'object' && options !== null) {
      schema = options.schema || null;
      schemaDelimiter = options.schemaDelimiter || null;
    }

    if (typeof tableName === 'object' && tableName !== null) {
      schema = tableName.schema;
      tableName = tableName.tableName;
    }

    const sql = this.QueryGenerator.describeTableQuery(tableName, schema, schemaDelimiter);

    return this.sequelize.query(
      sql,
      _.assign({}, options, { type: QueryTypes.DESCRIBE })
    ).then(data => {
      // If no data is returned from the query, then the table name may be wrong.
      // Query generators that use information_schema for retrieving table info will just return an empty result set,
      // it will not throw an error like built-ins do (e.g. DESCRIBE on MySql).
      if (Utils._.isEmpty(data)) {
        return Promise.reject('No description found for "' + tableName + '" table. Check the table name and schema; remember, they _are_ case sensitive.');
      } else {
        return Promise.resolve(data);
      }
    });
  }

  addColumn(table, key, attribute, options) {
    if (!table || !key || !attribute) {
      throw new Error('addColumn takes atleast 3 arguments (table, attribute name, attribute definition)');
    }

    options = options || {};
    attribute = this.sequelize.normalizeAttribute(attribute);
    return this.sequelize.query(this.QueryGenerator.addColumnQuery(table, key, attribute), options);
  }

  removeColumn(tableName, attributeName, options) {
    options = options || {};
    switch (this.sequelize.options.dialect) {
      case 'sqlite':
        // sqlite needs some special treatment as it cannot drop a column
        return SQLiteQueryInterface.removeColumn.call(this, tableName, attributeName, options);
      case 'mssql':
        // mssql needs special treatment as it cannot drop a column with a default or foreign key constraint
        return MSSSQLQueryInterface.removeColumn.call(this, tableName, attributeName, options);
      case 'mysql':
        // mysql needs special treatment as it cannot drop a column with a foreign key constraint
        return MySQLQueryInterface.removeColumn.call(this, tableName, attributeName, options);
      default:
        return this.sequelize.query(this.QueryGenerator.removeColumnQuery(tableName, attributeName), options);
    }
  }

  changeColumn(tableName, attributeName, dataTypeOrOptions, options) {
    const attributes = {};
    options = options || {};

    if (Utils._.values(DataTypes).indexOf(dataTypeOrOptions) > -1) {
      attributes[attributeName] = { type: dataTypeOrOptions, allowNull: true };
    } else {
      attributes[attributeName] = dataTypeOrOptions;
    }

    attributes[attributeName].type = this.sequelize.normalizeDataType(attributes[attributeName].type);

    if (this.sequelize.options.dialect === 'sqlite') {
      // sqlite needs some special treatment as it cannot change a column
      return SQLiteQueryInterface.changeColumn.call(this, tableName, attributes, options);
    } else {
      const query = this.QueryGenerator.attributesToSQL(attributes);
      const sql = this.QueryGenerator.changeColumnQuery(tableName, query);

      return this.sequelize.query(sql, options);
    }
  }

  renameColumn(tableName, attrNameBefore, attrNameAfter, options) {
    options = options || {};
    return this.describeTable(tableName, options).then(data => {
      if (!data[attrNameBefore]) {
        throw new Error('Table ' + tableName + ' doesn\'t have the column ' + attrNameBefore);
      }

      data = data[attrNameBefore] || {};

      const _options = {};

      _options[attrNameAfter] = {
        attribute: attrNameAfter,
        type: data.type,
        allowNull: data.allowNull,
        defaultValue: data.defaultValue
      };

      // fix: a not-null column cannot have null as default value
      if (data.defaultValue === null && !data.allowNull) {
        delete _options[attrNameAfter].defaultValue;
      }

      if (this.sequelize.options.dialect === 'sqlite') {
        // sqlite needs some special treatment as it cannot rename a column
        return SQLiteQueryInterface.renameColumn.call(this, tableName, attrNameBefore, attrNameAfter, options);
      } else {
        const sql = this.QueryGenerator.renameColumnQuery(
          tableName,
          attrNameBefore,
          this.QueryGenerator.attributesToSQL(_options)
        );
        return this.sequelize.query(sql, options);
      }
    });
  }

  addIndex(tableName, attributes, options, rawTablename) {
    // Support for passing tableName, attributes, options or tableName, options (with a fields param which is the attributes)
    if (!Array.isArray(attributes)) {
      rawTablename = options;
      options = attributes;
      attributes = options.fields;
    }
    // testhint argsConform.end

    if (!rawTablename) {
      // Map for backwards compat
      rawTablename = tableName;
    }

    options = Utils.cloneDeep(options);
    options.fields = attributes;
    const sql = this.QueryGenerator.addIndexQuery(tableName, options, rawTablename);
    return this.sequelize.query(sql, _.assign({}, options, { supportsSearchPath: false }));
  }

  showIndex(tableName, options) {
    const sql = this.QueryGenerator.showIndexesQuery(tableName, options);
    return this.sequelize.query(sql, _.assign({}, options, { type: QueryTypes.SHOWINDEXES }));
  }

  nameIndexes(indexes, rawTablename) {
    return this.QueryGenerator.nameIndexes(indexes, rawTablename);
  }

  getForeignKeysForTables(tableNames, options) {
    options = options || {};

    if (tableNames.length === 0) {
      return Promise.resolve({});
    }

    return Promise.map(tableNames, tableName =>
      this.sequelize.query(this.QueryGenerator.getForeignKeysQuery(tableName, this.sequelize.config.database), options).get(0)
    ).then(results => {
      const result = {};

      tableNames.forEach((tableName, i) => {
        if (Utils._.isObject(tableName)) {
          tableName = tableName.schema + '.' + tableName.tableName;
        }

        result[tableName] = Utils._.compact(results[i]).map(r => r.constraint_name);
      });

      return result;
    });
  }

  removeIndex(tableName, indexNameOrAttributes, options) {
    options = options || {};
    const sql = this.QueryGenerator.removeIndexQuery(tableName, indexNameOrAttributes);
    return this.sequelize.query(sql, options);
  }

  addConstraint(tableName, attributes, options, rawTablename) {
    if (!Array.isArray(attributes)) {
      rawTablename = options;
      options = attributes;
      attributes = options.fields;
    }

    if (!options.type) {
      throw new Error('Constraint type must be specified through options.type');
    }

    if (!rawTablename) {
      // Map for backwards compat
      rawTablename = tableName;
    }

    options = Utils.cloneDeep(options);
    options.fields = attributes;

    if (this.sequelize.dialect.name === 'sqlite') {
      return SQLiteQueryInterface.addConstraint.call(this, tableName, options, rawTablename);
    } else {
      const sql = this.QueryGenerator.addConstraintQuery(tableName, options, rawTablename);
      return this.sequelize.query(sql, options);
    }
  }

  showConstraint(tableName, options) {
    const sql = this.QueryGenerator.showConstraintsQuery(tableName, options);
    return this.sequelize.query(sql, Object.assign({}, options, { type: QueryTypes.SHOWCONSTRAINTS }));
  }

  removeConstraint(tableName, constraintName, options) {
    options = options || {};

    switch (this.sequelize.options.dialect) {
      case 'mysql':
        //Mysql does not support DROP CONSTRAINT. Instead DROP PRIMARY, FOREIGN KEY, INDEX should be used
        return MySQLQueryInterface.removeConstraint.call(this, tableName, constraintName, options);
      case 'sqlite':
        return SQLiteQueryInterface.removeConstraint.call(this, tableName, constraintName, options);
      default:
        const sql = this.QueryGenerator.removeConstraintQuery(tableName, constraintName);
        return this.sequelize.query(sql, options);
    }
  }

  insert(instance, tableName, values, options) {
    options = Utils.cloneDeep(options);
    options.hasTrigger = instance && instance.constructor.options.hasTrigger;
    const sql = this.QueryGenerator.insertQuery(tableName, values, instance && instance.constructor.rawAttributes, options);

    options.type = QueryTypes.INSERT;
    options.instance = instance;

    return this.sequelize.query(sql, options).then(results => {
      if (instance) results[0].isNewRecord = false;
      return results;
    });
  }

  upsert(tableName, valuesByField, updateValues, where, model, options) {
    const wheres = [];
    const attributes = Object.keys(valuesByField);
    let indexes = [];
    let indexFields;

    options = _.clone(options);

    if (!Utils._.isEmpty(where)) {
      wheres.push(where);
    }

    // Lets combine uniquekeys and indexes into one
    indexes = Utils._.map(model.options.uniqueKeys, value => {
      return value.fields;
    });

    Utils._.each(model.options.indexes, value => {
      if (value.unique) {
        // fields in the index may both the strings or objects with an attribute property - lets sanitize that
        indexFields = Utils._.map(value.fields, field => {
          if (Utils._.isPlainObject(field)) {
            return field.attribute;
          }
          return field;
        });
        indexes.push(indexFields);
      }
    });

    for (const index of indexes) {
      if (Utils._.intersection(attributes, index).length === index.length) {
        where = {};
        for (const field of index) {
          where[field] = valuesByField[field];
        }
        wheres.push(where);
      }
    }

    where = { $or: wheres };

    options.type = QueryTypes.UPSERT;
    options.raw = true;

    const sql = this.QueryGenerator.upsertQuery(tableName, valuesByField, updateValues, where, model, options);
    return this.sequelize.query(sql, options).then(rowCount => {
      if (rowCount === undefined) {
        return rowCount;
      }

      // MySQL returns 1 for inserted, 2 for updated http://dev.mysql.com/doc/refman/5.0/en/insert-on-duplicate.html. Postgres has been modded to do the same

      return rowCount === 1;
    });
  }

  bulkInsert(tableName, records, options, attributes) {
    options = _.clone(options) || {};
    options.type = QueryTypes.INSERT;
    const sql = this.QueryGenerator.bulkInsertQuery(tableName, records, options, attributes);
    return this.sequelize.query(sql, options).then(results => results[0]);
  }

  update(instance, tableName, values, identifier, options) {
    options = _.clone(options || {});
    options.hasTrigger = !!(instance && instance._modelOptions && instance._modelOptions.hasTrigger);

    const sql = this.QueryGenerator.updateQuery(tableName, values, identifier, options, instance.constructor.rawAttributes);

    options.type = QueryTypes.UPDATE;

    options.instance = instance;
    return this.sequelize.query(sql, options);
  }

  bulkUpdate(tableName, values, identifier, options, attributes) {
    options = Utils.cloneDeep(options);
    if (typeof identifier === 'object') identifier = Utils.cloneDeep(identifier);

    const sql = this.QueryGenerator.updateQuery(tableName, values, identifier, options, attributes);
    const table = Utils._.isObject(tableName) ? tableName : { tableName };
    const model = Utils._.find(this.sequelize.modelManager.models, { tableName: table.tableName });

    options.model = model;
    return this.sequelize.query(sql, options);
  }

  delete(instance, tableName, identifier, options) {
    const cascades = [];
    const sql = this.QueryGenerator.deleteQuery(tableName, identifier, null, instance.constructor);

    options = _.clone(options) || {};

    // Check for a restrict field
    if (!!instance.constructor && !!instance.constructor.associations) {
      const keys = Object.keys(instance.constructor.associations);
      const length = keys.length;
      let association;

      for (let i = 0; i < length; i++) {
        association = instance.constructor.associations[keys[i]];
        if (association.options && association.options.onDelete &&
          association.options.onDelete.toLowerCase() === 'cascade' &&
          association.options.useHooks === true) {
          cascades.push(association.accessors.get);
        }
      }
    }

    return Promise.each(cascades, cascade => {
      return instance[cascade](options).then(instances => {
        // Check for hasOne relationship with non-existing associate ("has zero")
        if (!instances) {
          return Promise.resolve();
        }

        if (!Array.isArray(instances)) instances = [instances];

        return Promise.each(instances, instance => instance.destroy(options));
      });
    }).then(() => {
      options.instance = instance;
      return this.sequelize.query(sql, options);
    });
  }

  bulkDelete(tableName, identifier, options, model) {
    options = Utils.cloneDeep(options);
    options = _.defaults(options, {limit: null});
    if (typeof identifier === 'object') identifier = Utils.cloneDeep(identifier);

    const sql = this.QueryGenerator.deleteQuery(tableName, identifier, options, model);
    return this.sequelize.query(sql, options);
  }

  select(model, tableName, options) {
    options = Utils.cloneDeep(options);
    options.type = QueryTypes.SELECT;
    options.model = model;

    return this.sequelize.query(
      this.QueryGenerator.selectQuery(tableName, options, model),
      options
    );
  }

  increment(model, tableName, values, identifier, options) {
    options = Utils.cloneDeep(options);

    const sql = this.QueryGenerator.arithmeticQuery('+', tableName, values, identifier, options, options.attributes);

    options.type = QueryTypes.UPDATE;
    options.model = model;

    return this.sequelize.query(sql, options);
  }

  decrement(model, tableName, values, identifier, options) {
    options = Utils.cloneDeep(options);

    const sql = this.QueryGenerator.arithmeticQuery('-', tableName, values, identifier, options, options.attributes);

    options.type = QueryTypes.UPDATE;
    options.model = model;

    return this.sequelize.query(sql, options);
  }

  rawSelect(tableName, options, attributeSelector, Model) {
    if (options.schema) {
      tableName = this.QueryGenerator.addSchema({
        tableName,
        _schema: options.schema
      });
    }

    options = Utils.cloneDeep(options);
    options = _.defaults(options, {
      raw: true,
      plain: true,
      type: QueryTypes.SELECT
    });

    const sql = this.QueryGenerator.selectQuery(tableName, options, Model);

    if (attributeSelector === undefined) {
      throw new Error('Please pass an attribute selector!');
    }

    return this.sequelize.query(sql, options).then(data => {
      if (!options.plain) {
        return data;
      }

      let result = data ? data[attributeSelector] : null;

      if (options && options.dataType) {
        const dataType = options.dataType;

        if (dataType instanceof DataTypes.DECIMAL || dataType instanceof DataTypes.FLOAT) {
          result = parseFloat(result);
        } else if (dataType instanceof DataTypes.INTEGER || dataType instanceof DataTypes.BIGINT) {
          result = parseInt(result, 10);
        } else if (dataType instanceof DataTypes.DATE) {
          if (!Utils._.isNull(result) && !Utils._.isDate(result)) {
            result = new Date(result);
          }
        } else if (dataType instanceof DataTypes.STRING) {
          // Nothing to do, result is already a string.
        }
      }

      return result;
    });
  }

  createTrigger(tableName, triggerName, timingType, fireOnArray, functionName, functionParams, optionsArray, options) {
    const sql = this.QueryGenerator.createTrigger(tableName, triggerName, timingType, fireOnArray, functionName, functionParams, optionsArray);
    options = options || {};
    if (sql) {
      return this.sequelize.query(sql, options);
    } else {
      return Promise.resolve();
    }
  }

  dropTrigger(tableName, triggerName, options) {
    const sql = this.QueryGenerator.dropTrigger(tableName, triggerName);
    options = options || {};

    if (sql) {
      return this.sequelize.query(sql, options);
    } else {
      return Promise.resolve();
    }
  }

  renameTrigger(tableName, oldTriggerName, newTriggerName, options) {
    const sql = this.QueryGenerator.renameTrigger(tableName, oldTriggerName, newTriggerName);
    options = options || {};

    if (sql) {
      return this.sequelize.query(sql, options);
    } else {
      return Promise.resolve();
    }
  }

  createFunction(functionName, params, returnType, language, body, options) {
    const sql = this.QueryGenerator.createFunction(functionName, params, returnType, language, body, options);
    options = options || {};

    if (sql) {
      return this.sequelize.query(sql, options);
    } else {
      return Promise.resolve();
    }
  }

  dropFunction(functionName, params, options) {
    const sql = this.QueryGenerator.dropFunction(functionName, params);
    options = options || {};

    if (sql) {
      return this.sequelize.query(sql, options);
    } else {
      return Promise.resolve();
    }
  }

  renameFunction(oldFunctionName, params, newFunctionName, options) {
    const sql = this.QueryGenerator.renameFunction(oldFunctionName, params, newFunctionName);
    options = options || {};

    if (sql) {
      return this.sequelize.query(sql, options);
    } else {
      return Promise.resolve();
    }
  }

  // Helper methods useful for querying

  /**
   * Escape an identifier (e.g. a table or attribute name). If force is true,
   * the identifier will be quoted even if the `quoteIdentifiers` option is
   * false.
   * @private
   */
  quoteIdentifier(identifier, force) {
    return this.QueryGenerator.quoteIdentifier(identifier, force);
  }

  quoteTable(identifier) {
    return this.QueryGenerator.quoteTable(identifier);
  }

  /**
   * Split an identifier into .-separated tokens and quote each part.
   * If force is true, the identifier will be quoted even if the
   * `quoteIdentifiers` option is false.
   * @private
   */
  quoteIdentifiers(identifiers, force) {
    return this.QueryGenerator.quoteIdentifiers(identifiers, force);
  }

  /**
   * Escape a value (e.g. a string, number or date)
   * @private
   */
  escape(value) {
    return this.QueryGenerator.escape(value);
  }

  setAutocommit(transaction, value, options) {
    if (!transaction || !(transaction instanceof Transaction)) {
      throw new Error('Unable to set autocommit for a transaction without transaction object!');
    }
    if (transaction.parent) {
      // Not possible to set a separate isolation level for savepoints
      return Promise.resolve();
    }

    options = _.assign({}, options, {
      transaction: transaction.parent || transaction
    });

    const sql = this.QueryGenerator.setAutocommitQuery(value, {
      parent: transaction.parent
    });

    if (!sql) return Promise.resolve();

    return this.sequelize.query(sql, options);
  }

  setIsolationLevel(transaction, value, options) {
    if (!transaction || !(transaction instanceof Transaction)) {
      throw new Error('Unable to set isolation level for a transaction without transaction object!');
    }

    if (transaction.parent || !value) {
      // Not possible to set a separate isolation level for savepoints
      return Promise.resolve();
    }

    options = _.assign({}, options, {
      transaction: transaction.parent || transaction
    });

    const sql = this.QueryGenerator.setIsolationLevelQuery(value, {
      parent: transaction.parent
    });

    if (!sql) return Promise.resolve();

    return this.sequelize.query(sql, options);
  }

  startTransaction(transaction, options) {
    if (!transaction || !(transaction instanceof Transaction)) {
      throw new Error('Unable to start a transaction without transaction object!');
    }

    options = _.assign({}, options, {
      transaction: transaction.parent || transaction
    });
    options.transaction.name = transaction.parent ? transaction.name : undefined;
    const sql = this.QueryGenerator.startTransactionQuery(transaction);

    return this.sequelize.query(sql, options);
  }

  deferConstraints(transaction, options) {
    options = _.assign({}, options, {
      transaction: transaction.parent || transaction
    });

    const sql = this.QueryGenerator.deferConstraintsQuery(options);

    if (sql) {
      return this.sequelize.query(sql, options);
    }

    return Promise.resolve();
  }

  commitTransaction(transaction, options) {
    if (!transaction || !(transaction instanceof Transaction)) {
      throw new Error('Unable to commit a transaction without transaction object!');
    }
    if (transaction.parent) {
      // Savepoints cannot be committed
      return Promise.resolve();
    }

    options = _.assign({}, options, {
      transaction: transaction.parent || transaction,
      supportsSearchPath: false
    });

    const sql = this.QueryGenerator.commitTransactionQuery(transaction);
    const promise = this.sequelize.query(sql, options);

    transaction.finished = 'commit';

    return promise;
  }

  rollbackTransaction(transaction, options) {
    if (!transaction || !(transaction instanceof Transaction)) {
      throw new Error('Unable to rollback a transaction without transaction object!');
    }

    options = _.assign({}, options, {
      transaction: transaction.parent || transaction,
      supportsSearchPath: false
    });
    options.transaction.name = transaction.parent ? transaction.name : undefined;
    const sql = this.QueryGenerator.rollbackTransactionQuery(transaction);
    const promise = this.sequelize.query(sql, options);

    transaction.finished = 'rollback';

    return promise;
  }
}

module.exports = QueryInterface;
module.exports.QueryInterface = QueryInterface;
module.exports.default = QueryInterface;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const Promise = __webpack_require__(4);
const UnknownConstraintError = __webpack_require__(3).UnknownConstraintError;

/**
 Returns an object that treats SQLite's inabilities to do certain queries.

 @class QueryInterface
 @static
 @private
 */

/**
  A wrapper that fixes SQLite's inability to remove columns from existing tables.
  It will create a backup of the table, drop the table afterwards and create a
  new table with the same name but without the obsolete column.

  @method removeColumn
  @for    QueryInterface

  @param  {String} tableName     The name of the table.
  @param  {String} attributeName The name of the attribute that we want to remove.
  @param  {Object} options
  @param  {Boolean|Function} [options.logging] A function that logs the sql queries, or false for explicitly not logging these queries

  @since 1.6.0
  @private
 */
function removeColumn(tableName, attributeName, options) {
  options = options || {};

  return this.describeTable(tableName, options).then(fields => {
    delete fields[attributeName];

    const sql = this.QueryGenerator.removeColumnQuery(tableName, fields);
    const subQueries = sql.split(';').filter(q => q !== '');

    return Promise.each(subQueries, subQuery => this.sequelize.query(subQuery + ';', Utils._.assign({raw: true}, options)));
  });
}
exports.removeColumn = removeColumn;

/**
  A wrapper that fixes SQLite's inability to change columns from existing tables.
  It will create a backup of the table, drop the table afterwards and create a
  new table with the same name but with a modified version of the respective column.

  @method changeColumn
  @for    QueryInterface

  @param  {String} tableName The name of the table.
  @param  {Object} attributes An object with the attribute's name as key and it's options as value object.
  @param  {Object} options
  @param  {Boolean|Function} [options.logging] A function that logs the sql queries, or false for explicitly not logging these queries

  @since 1.6.0
  @private
 */
function changeColumn(tableName, attributes, options) {
  const attributeName = Object.keys(attributes)[0];
  options = options || {};

  return this.describeTable(tableName, options).then(fields => {
    fields[attributeName] = attributes[attributeName];

    const sql = this.QueryGenerator.removeColumnQuery(tableName, fields);
    const subQueries = sql.split(';').filter(q => q !== '');

    return Promise.each(subQueries, subQuery => this.sequelize.query(subQuery + ';', Utils._.assign({raw: true}, options)));
  });
}
exports.changeColumn = changeColumn;

/**
  A wrapper that fixes SQLite's inability to rename columns from existing tables.
  It will create a backup of the table, drop the table afterwards and create a
  new table with the same name but with a renamed version of the respective column.

  @method renameColumn
  @for    QueryInterface

  @param  {String} tableName The name of the table.
  @param  {String} attrNameBefore The name of the attribute before it was renamed.
  @param  {String} attrNameAfter The name of the attribute after it was renamed.
  @param  {Object} options
  @param  {Boolean|Function} [options.logging] A function that logs the sql queries, or false for explicitly not logging these queries

  @since 1.6.0
  @private
 */
function renameColumn(tableName, attrNameBefore, attrNameAfter, options) {
  options = options || {};

  return this.describeTable(tableName, options).then(fields => {
    fields[attrNameAfter] = Utils._.clone(fields[attrNameBefore]);
    delete fields[attrNameBefore];

    const sql = this.QueryGenerator.renameColumnQuery(tableName, attrNameBefore, attrNameAfter, fields);
    const subQueries = sql.split(';').filter(q => q !== '');

    return Promise.each(subQueries, subQuery => this.sequelize.query(subQuery + ';', Utils._.assign({raw: true}, options)));
  });
}
exports.renameColumn = renameColumn;

function removeConstraint(tableName, constraintName, options) {
  let createTableSql;

  return this.showConstraint(tableName, constraintName)
    .then(constraints => {
      const constraint = constraints[0];

      if (constraint) {
        createTableSql = constraint.sql;
        constraint.constraintName = this.QueryGenerator.quoteIdentifier(constraint.constraintName);
        let constraintSnippet = `, CONSTRAINT ${constraint.constraintName} ${constraint.constraintType} ${constraint.constraintCondition}`;

        if (constraint.constraintType === 'FOREIGN KEY') {
          const referenceTableName = this.QueryGenerator.quoteTable(constraint.referenceTableName);
          constraint.referenceTableKeys = constraint.referenceTableKeys.map(columnName => this.QueryGenerator.quoteIdentifier(columnName));
          const referenceTableKeys = constraint.referenceTableKeys.join(', ');
          constraintSnippet += ` REFERENCES ${referenceTableName} (${referenceTableKeys})`;
          constraintSnippet += ` ON UPDATE ${constraint.updateAction}`;
          constraintSnippet += ` ON DELETE ${constraint.deleteAction}`;
        }

        createTableSql = createTableSql.replace(constraintSnippet, '');
        createTableSql += ';';

        return this.describeTable(tableName, options);
      } else {
        throw new UnknownConstraintError(`Constraint ${constraintName} on table ${tableName} does not exist`);
      }
    })
    .then(fields => {
      const sql = this.QueryGenerator._alterConstraintQuery(tableName, fields, createTableSql);
      const subQueries = sql.split(';').filter(q => q !== '');

      return Promise.each(subQueries, subQuery => this.sequelize.query(subQuery + ';', Utils._.assign({raw: true}, options)));
    });
}
exports.removeConstraint = removeConstraint;

function addConstraint(tableName, options) {
  const constraintSnippet = this.QueryGenerator.getConstraintSnippet(tableName, options);
  const describeCreateTableSql = this.QueryGenerator.describeCreateTableQuery(tableName);
  let createTableSql;

  return this.sequelize.query(describeCreateTableSql, options)
    .then(constraints => {
      const sql = constraints[0].sql;
      const index = sql.length - 1;
      //Replace ending ')' with constraint snippet - Simulates String.replaceAt
      //http://stackoverflow.com/questions/1431094
      createTableSql = sql.substr(0, index) +  `, ${constraintSnippet})` + sql.substr(index + 1) + ';';

      return this.describeTable(tableName, options);
    })
    .then(fields => {
      const sql = this.QueryGenerator._alterConstraintQuery(tableName, fields, createTableSql);
      const subQueries = sql.split(';').filter(q => q !== '');

      return Promise.each(subQueries, subQuery => this.sequelize.query(subQuery + ';', Utils._.assign({raw: true}, options)));
    });
}
exports.addConstraint = addConstraint;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 Returns an object that treats MSSQL's inabilities to do certain queries.

 @class QueryInterface
 @static
 @private
 */

/**
  A wrapper that fixes MSSQL's inability to cleanly remove columns from existing tables if they have a default constraint.

  @method removeColumn
  @for    QueryInterface

  @param  {String} tableName     The name of the table.
  @param  {String} attributeName The name of the attribute that we want to remove.
  @param  {Object} options
  @param  {Boolean|Function} [options.logging] A function that logs the sql queries, or false for explicitly not logging these queries
 @private
 */
const removeColumn = function(tableName, attributeName, options) {
  options = Object.assign({ raw: true }, options || {});

  const findConstraintSql = this.QueryGenerator.getDefaultConstraintQuery(tableName, attributeName);
  return this.sequelize.query(findConstraintSql, options)
    .spread(results => {
      if (!results.length) {
        // No default constraint found -- we can cleanly remove the column
        return;
      }
      const dropConstraintSql = this.QueryGenerator.dropConstraintQuery(tableName, results[0].name);
      return this.sequelize.query(dropConstraintSql, options);
    })
    .then(() => {
      const findForeignKeySql = this.QueryGenerator.getForeignKeyQuery(tableName, attributeName);
      return this.sequelize.query(findForeignKeySql, options);
    })
    .spread(results => {
      if (!results.length) {
        // No foreign key constraints found, so we can remove the column
        return;
      }
      const dropForeignKeySql = this.QueryGenerator.dropForeignKeyQuery(tableName, results[0].constraint_name);
      return this.sequelize.query(dropForeignKeySql, options);
    })
    .then(() => {
      //Check if the current column is a primaryKey
      const primaryKeyConstraintSql = this.QueryGenerator.getPrimaryKeyConstraintQuery(tableName, attributeName);
      return this.sequelize.query(primaryKeyConstraintSql, options);
    })
    .spread(result => {
      if (!result.length) {
        return;
      }
      const dropConstraintSql = this.QueryGenerator.dropConstraintQuery(tableName, result[0].constraintName);
      return this.sequelize.query(dropConstraintSql, options);
    })
    .then(() => {
      const removeSql = this.QueryGenerator.removeColumnQuery(tableName, attributeName);
      return this.sequelize.query(removeSql, options);
    });
};

module.exports = {
  removeColumn
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 Returns an object that treats MySQL's inabilities to do certain queries.

 @class QueryInterface
 @static
 @private
 */

const _ = __webpack_require__(0);
const UnknownConstraintError = __webpack_require__(3).UnknownConstraintError;

/**
  A wrapper that fixes MySQL's inability to cleanly remove columns from existing tables if they have a foreign key constraint.

  @method removeColumn
  @for    QueryInterface

  @param  {String} tableName     The name of the table.
  @param  {String} columnName    The name of the attribute that we want to remove.
  @param  {Object} options
 @private
 */
function removeColumn(tableName, columnName, options) {
  options = options || {};

  return this.sequelize.query(
    this.QueryGenerator.getForeignKeyQuery(tableName, columnName),
    _.assign({ raw: true }, options)
  )
    .spread(results => {
      //Exclude primary key constraint
      if (!results.length || results[0].constraint_name === 'PRIMARY') {
        // No foreign key constraints found, so we can remove the column
        return;
      }
      return this.sequelize.query(
        this.QueryGenerator.dropForeignKeyQuery(tableName, results[0].constraint_name),
        _.assign({ raw: true }, options)
      );
    })
    .then(() => this.sequelize.query(
      this.QueryGenerator.removeColumnQuery(tableName, columnName),
      _.assign({ raw: true }, options)
    ));
}


function removeConstraint(tableName, constraintName, options) {
  const sql = this.QueryGenerator.showConstraintsQuery(tableName, constraintName);

  return this.sequelize.query(sql, Object.assign({}, options, { type: this.sequelize.QueryTypes.SHOWCONSTRAINTS }))
    .then(constraints => {
      const constraint = constraints[0];
      let query;
      if (constraint && constraint.constraintType) {
        if (constraint.constraintType === 'FOREIGN KEY') {
          query = this.QueryGenerator.dropForeignKeyQuery(tableName, constraintName);
        } else {
          query = this.QueryGenerator.removeIndexQuery(constraint.tableName, constraint.constraintName);
        }
      } else {
        throw new UnknownConstraintError(`Constraint ${constraintName} on table ${tableName} does not exist`);
      }

      return this.sequelize.query(query, options);
    });
}

exports.removeConstraint = removeConstraint;
exports.removeColumn = removeColumn;


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Association = __webpack_require__(8);
Association.BelongsTo = __webpack_require__(12);
Association.HasOne = __webpack_require__(31);
Association.HasMany = __webpack_require__(13);
Association.BelongsToMany = __webpack_require__(21);

module.exports = Association;
module.exports.default = Association;
module.exports.Association = Association;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _ = __webpack_require__(0);
const AbstractDialect = __webpack_require__(22);
const ConnectionManager = __webpack_require__(81);
const Query = __webpack_require__(86);
const QueryGenerator = __webpack_require__(87);
const DataTypes = __webpack_require__(2).mssql;

class MssqlDialect extends AbstractDialect {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.connectionManager = new ConnectionManager(this, sequelize);
    this.QueryGenerator = _.extend({}, QueryGenerator, {
      options: sequelize.options,
      _dialect: this,
      sequelize
    });
  }
}

MssqlDialect.prototype.supports = _.merge(_.cloneDeep(AbstractDialect.prototype.supports), {
  'DEFAULT': true,
  'DEFAULT VALUES': true,
  'LIMIT ON UPDATE': true,
  'ORDER NULLS': false,
  lock: false,
  transactions: true,
  migrations: false,
  upserts: true,
  returnValues: {
    output: true
  },
  schemas: true,
  autoIncrement: {
    identityInsert: true,
    defaultValue: false,
    update: false
  },
  constraints: {
    restrict: false,
    default: true
  },
  index: {
    collate: false,
    length: false,
    parser: false,
    type: true,
    using: false,
    where: true
  },
  NUMERIC: true,
  tmpTableTrigger: true
});

ConnectionManager.prototype.defaultVersion = '12.0.2000'; // SQL Server 2014 Express
MssqlDialect.prototype.Query = Query;
MssqlDialect.prototype.name = 'mssql';
MssqlDialect.prototype.TICK_CHAR = '"';
MssqlDialect.prototype.TICK_CHAR_LEFT = '[';
MssqlDialect.prototype.TICK_CHAR_RIGHT = ']';
MssqlDialect.prototype.DataTypes = DataTypes;

module.exports = MssqlDialect;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractConnectionManager = __webpack_require__(23);
const ResourceLock = __webpack_require__(84);
const Promise = __webpack_require__(4);
const Utils = __webpack_require__(1);
const debug = Utils.getLogger().debugContext('connection:mssql');
const debugTedious = Utils.getLogger().debugContext('connection:mssql:tedious');
const sequelizeErrors = __webpack_require__(3);
const parserStore = __webpack_require__(24)('mssql');
const _ = __webpack_require__(0);

class ConnectionManager extends AbstractConnectionManager {
  constructor(dialect, sequelize) {
    super(dialect, sequelize);

    this.sequelize = sequelize;
    this.sequelize.config.port = this.sequelize.config.port || 1433;
    try {
      if (sequelize.config.dialectModulePath) {
        this.lib = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
      } else {
        this.lib = __webpack_require__(37);
      }
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        throw new Error('Please install tedious package manually');
      }
      throw err;
    }
  }

  // Expose this as a method so that the parsing may be updated when the user has added additional, custom types
  _refreshTypeParser(dataType) {
    parserStore.refresh(dataType);
  }

  _clearTypeParser() {
    parserStore.clear();
  }

  connect(config) {
    return new Promise((resolve, reject) => {
      const connectionConfig = {
        userName: config.username,
        password: config.password,
        server: config.host,
        options: {
          port: config.port,
          database: config.database
        }
      };

      if (config.dialectOptions) {
        // only set port if no instance name was provided
        if (config.dialectOptions.instanceName) {
          delete connectionConfig.options.port;
        }

        // The 'tedious' driver needs domain property to be in the main Connection config object
        if (config.dialectOptions.domain) {
          connectionConfig.domain = config.dialectOptions.domain;
        }

        for (const key of Object.keys(config.dialectOptions)) {
          connectionConfig.options[key] = config.dialectOptions[key];
        }
      }

      const connection = new this.lib.Connection(connectionConfig);
      const connectionLock = new ResourceLock(connection);
      connection.lib = this.lib;

      connection.on('connect', err => {
        if (!err) {
          debug('connection acquired');
          resolve(connectionLock);
          return;
        }

        if (!err.code) {
          reject(new sequelizeErrors.ConnectionError(err));
          return;
        }

        switch (err.code) {
          case 'ESOCKET':
            if (_.includes(err.message, 'connect EHOSTUNREACH')) {
              reject(new sequelizeErrors.HostNotReachableError(err));
            } else if (_.includes(err.message, 'connect ENETUNREACH')) {
              reject(new sequelizeErrors.HostNotReachableError(err));
            } else if (_.includes(err.message, 'connect EADDRNOTAVAIL')) {
              reject(new sequelizeErrors.HostNotReachableError(err));
            } else if (_.includes(err.message, 'getaddrinfo ENOTFOUND')) {
              reject(new sequelizeErrors.HostNotFoundError(err));
            } else if (_.includes(err.message, 'connect ECONNREFUSED')) {
              reject(new sequelizeErrors.ConnectionRefusedError(err));
            } else {
              reject(new sequelizeErrors.ConnectionError(err));
            }
            break;
          case 'ER_ACCESS_DENIED_ERROR':
          case 'ELOGIN':
            reject(new sequelizeErrors.AccessDeniedError(err));
            break;
          case 'EINVAL':
            reject(new sequelizeErrors.InvalidConnectionError(err));
            break;
          default:
            reject(new sequelizeErrors.ConnectionError(err));
            break;
        }
      });
      
      if (config.dialectOptions && config.dialectOptions.debug) {
        connection.on('debug', debugTedious);        
      }

      if (config.pool.handleDisconnects) {
        connection.on('error', err => {
          switch (err.code) {
            case 'ESOCKET':
            case 'ECONNRESET':
              this.pool.destroy(connectionLock);
          }
        });
      }

    });
  }

  disconnect(connectionLock) {
    const connection = connectionLock.unwrap();

    // Dont disconnect a connection that is already disconnected
    if (connection.closed) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      connection.on('end', resolve);
      connection.close();
      debug('connection closed');
    });
  }

  validate(connectionLock) {
    const connection = connectionLock.unwrap();
    return connection && connection.loggedIn;
  }
}

module.exports = ConnectionManager;
module.exports.ConnectionManager = ConnectionManager;
module.exports.default = ConnectionManager;


/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = require("generic-pool");

/***/ }),
/* 83 */
/***/ (function(module, exports) {

module.exports = require("timers");

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Promise = __webpack_require__(4);

function ResourceLock(resource) {
  this.resource = resource;
  this.previous = Promise.resolve(resource);
}

ResourceLock.prototype.unwrap = function() {
  return this.resource;
};

ResourceLock.prototype.lock = function() {
  const lock = this.previous;
  let resolve;

  this.previous = new Promise(r => {
    resolve = r;
  });

  return lock.disposer(resolve);
};

module.exports = ResourceLock;


/***/ }),
/* 85 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 85;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const debug = Utils.getLogger().debugContext('sql:mssql');
const Promise = __webpack_require__(4);
const AbstractQuery = __webpack_require__(25);
const sequelizeErrors = __webpack_require__(3);
const parserStore = __webpack_require__(24)('mssql');
const _ = __webpack_require__(0);
const TYPES = __webpack_require__(37).TYPES;

class Query extends AbstractQuery {
  constructor(connection, sequelize, options) {
    super();
    this.connection = connection;
    this.instance = options.instance;
    this.model = options.model;
    this.sequelize = sequelize;
    this.options = Utils._.extend({
      logging: console.log,
      plain: false,
      raw: false
    }, options || {});

    this.checkLoggingOption();
  }

  getInsertIdField() {
    return 'id';
  }

  getSQLTypeFromJsType(value) {
    const paramType = {type: TYPES.VarChar, typeOptions: {} };
    paramType.type = TYPES.NVarChar;
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        paramType.type = TYPES.Int;
      } else {
        paramType.type = TYPES.Numeric;
        //Default to a reasonable numeric precision/scale pending more sophisticated logic
        paramType.typeOptions = {precision: 30, scale: 15};
      }
    }
    return paramType;
  }

  _run(connection, sql, parameters) {
    this.sql = sql;

    //do we need benchmark for this query execution
    const benchmark = this.sequelize.options.benchmark || this.options.benchmark;
    let queryBegin;
    if (benchmark) {
      queryBegin = Date.now();
    } else {
      this.sequelize.log('Executing (' + (this.connection.uuid || 'default') + '): ' + this.sql, this.options);
    }

    debug(`executing(${this.connection.uuid || 'default'}) : ${this.sql}`);

    return new Promise((resolve, reject) => {
      // TRANSACTION SUPPORT
      if (_.startsWith(this.sql, 'BEGIN TRANSACTION')) {
        connection.beginTransaction(err => {
          if (err) {
            reject(this.formatError(err));
          } else {
            resolve(this.formatResults());
          }
        }, this.options.transaction.name, Utils.mapIsolationLevelStringToTedious(this.options.isolationLevel, connection.lib));
      } else if (_.startsWith(this.sql, 'COMMIT TRANSACTION')) {
        connection.commitTransaction(err => {
          if (err) {
            reject(this.formatError(err));
          } else {
            resolve(this.formatResults());
          }
        });
      } else if (_.startsWith(this.sql, 'ROLLBACK TRANSACTION')) {
        connection.rollbackTransaction(err => {
          if (err) {
            reject(this.formatError(err));
          } else {
            resolve(this.formatResults());
          }
        }, this.options.transaction.name);
      } else if (_.startsWith(this.sql, 'SAVE TRANSACTION')) {
        connection.saveTransaction(err => {
          if (err) {
            reject(this.formatError(err));
          } else {
            resolve(this.formatResults());
          }
        }, this.options.transaction.name);
      } else {
        const results = [];
        const request = new connection.lib.Request(this.sql, (err, rowCount) => {

          debug(`executed(${this.connection.uuid || 'default'}) : ${this.sql}`);

          if (benchmark) {
            this.sequelize.log('Executed (' + (this.connection.uuid || 'default') + '): ' + this.sql, Date.now() - queryBegin, this.options);
          }

          if (err) {
            err.sql = sql;
            reject(this.formatError(err));
          } else {
            resolve(this.formatResults(results, rowCount));
          }
        });

        if (parameters) {
          _.forOwn(parameters, (value, key) => {
            const paramType = this.getSQLTypeFromJsType(value);
            request.addParameter(key, paramType.type, value, paramType.typeOptions);
          });
        }

        request.on('row', columns => {
          const row = {};
          for (const column of columns) {
            const typeid = column.metadata.type.id;
            const parse = parserStore.get(typeid);
            let value = column.value;

            if (value !== null & !!parse) {
              value = parse(value);
            }
            row[column.metadata.colName] = value;
          }

          results.push(row);
        });

        connection.execSql(request);
      }
    });
  }

  run(sql, parameters) {
    return Promise.using(this.connection.lock(), connection => this._run(connection, sql, parameters));
  }

  static formatBindParameters(sql, values, dialect) {
    const bindParam = {};
    let i = 0;
    const seen = {};
    const replacementFunc = (match, key, values) => {
      if (seen[key] !== undefined) {
        return seen[key];
      }
      if (values[key] !== undefined) {
        i = i + 1;
        bindParam[key] = values[key];
        seen[key] = '$' + i;
        return '@' + key;
      }
      return undefined;
    };
    sql = AbstractQuery.formatBindParameters(sql, values, dialect, replacementFunc)[0];

    return [sql, bindParam];
  }

  /**
   * High level function that handles the results of a query execution.
   *
   *
   * Example:
   *  query.formatResults([
   *    {
   *      id: 1,              // this is from the main table
   *      attr2: 'snafu',     // this is from the main table
   *      Tasks.id: 1,        // this is from the associated table
   *      Tasks.title: 'task' // this is from the associated table
   *    }
   *  ])
   *
   * @param {Array} data - The result of the query execution.
   * @private
   */
  formatResults(data, rowCount) {
    let result = this.instance;
    if (this.isInsertQuery(data)) {
      this.handleInsertQuery(data);

      if (!this.instance) {
        if (this.options.plain) {
          // NOTE: super contrived. This just passes the newly added query-interface
          //       test returning only the PK. There isn't a way in MSSQL to identify
          //       that a given return value is the PK, and we have no schema information
          //       because there was no calling Model.
          const record = data[0];
          result = record[Object.keys(record)[0]];
        } else {
          result = data;
        }
      }
    }

    if (this.isShowTablesQuery()) {
      result = this.handleShowTablesQuery(data);
    } else if (this.isDescribeQuery()) {
      result = {};
      for (const _result of data) {
        if (_result.Default) {
          _result.Default = _result.Default.replace("('", '').replace("')", '').replace(/'/g, '');
        }

        result[_result.Name] = {
          type: _result.Type.toUpperCase(),
          allowNull: _result.IsNull === 'YES' ? true : false,
          defaultValue: _result.Default,
          primaryKey: _result.Constraint === 'PRIMARY KEY'
        };
      }
    } else if (this.isShowIndexesQuery()) {
      result = this.handleShowIndexesQuery(data);
    } else if (this.isSelectQuery()) {
      result = this.handleSelectQuery(data);
    } else if (this.isUpsertQuery()) {
      //Use the same return value as that of MySQL & Postgres
      if (data[0].$action === 'INSERT') {
        result = 1;
      } else {
        result = 2;
      }
    } else if (this.isCallQuery()) {
      result = data[0];
    } else if (this.isBulkUpdateQuery()) {
      result = data.length;
    } else if (this.isBulkDeleteQuery()) {
      result = data[0] && data[0].AFFECTEDROWS;
    } else if (this.isVersionQuery()) {
      result = data[0].version;
    } else if (this.isForeignKeysQuery()) {
      result = data;
    } else if (this.isInsertQuery() || this.isUpdateQuery()) {
      result = [result, rowCount];
    } else if (this.isShowConstraintsQuery()) {
      result = this.handleShowConstraintsQuery(data);
    } else if (this.isRawQuery()) {
      // MSSQL returns row data and metadata (affected rows etc) in a single object - let's standarize it, sorta
      result = [data, data];
    }

    return result;
  }

  handleShowTablesQuery(results) {
    return results.map(resultSet => {
      return {
        tableName: resultSet.TABLE_NAME,
        schema: resultSet.TABLE_SCHEMA
      };
    });
  }

  handleShowConstraintsQuery(data) {
    //Convert snake_case keys to camelCase as its generated by stored procedure
    return data.slice(1).map(result => {
      const constraint = {};
      for (const key in result) {
        constraint[_.camelCase(key)] = result[key];
      }
      return constraint;
    });
  }

  formatError(err) {
    let match;
    match = err.message.match(/Violation of UNIQUE KEY constraint '((.|\s)*)'. Cannot insert duplicate key in object '.*'.(:? The duplicate key value is \((.*)\).)?/);
    match = match || err.message.match(/Cannot insert duplicate key row in object .* with unique index '(.*)'/);
    if (match && match.length > 1) {
      let fields = {};
      const uniqueKey = this.model && this.model.uniqueKeys[match[1]];
      let message = 'Validation error';

      if (uniqueKey && !!uniqueKey.msg) {
        message = uniqueKey.msg;
      }
      if (match[4]) {
        const values = match[4].split(',').map(part => part.trim());
        if (uniqueKey) {
          fields = Utils._.zipObject(uniqueKey.fields, values);
        } else {
          fields[match[1]] = match[4];
        }
      }

      const errors = [];
      Utils._.forOwn(fields, (value, field) => {
        errors.push(new sequelizeErrors.ValidationErrorItem(
          this.getUniqueConstraintErrorMessage(field),
          'unique violation', field, value
        ));
      });

      return new sequelizeErrors.UniqueConstraintError({ message, errors, parent: err, fields });
    }

    match = err.message.match(/Failed on step '(.*)'.Could not create constraint. See previous errors./) ||
      err.message.match(/The DELETE statement conflicted with the REFERENCE constraint "(.*)". The conflict occurred in database "(.*)", table "(.*)", column '(.*)'./) ||
      err.message.match(/The INSERT statement conflicted with the FOREIGN KEY constraint "(.*)". The conflict occurred in database "(.*)", table "(.*)", column '(.*)'./) ||
      err.message.match(/The MERGE statement conflicted with the FOREIGN KEY constraint "(.*)". The conflict occurred in database "(.*)", table "(.*)", column '(.*)'./) ||
      err.message.match(/The UPDATE statement conflicted with the FOREIGN KEY constraint "(.*)". The conflict occurred in database "(.*)", table "(.*)", column '(.*)'./);
    if (match && match.length > 0) {
      return new sequelizeErrors.ForeignKeyConstraintError({
        fields: null,
        index: match[1],
        parent: err
      });
    }

    match = err.message.match(/Could not drop constraint. See previous errors./);

    if (match && match.length > 0) {
      return new sequelizeErrors.UnknownConstraintError(match[1]);
    }

    return new sequelizeErrors.DatabaseError(err);
  }

  isShowOrDescribeQuery() {
    let result = false;

    result = result || this.sql.toLowerCase().indexOf("select c.column_name as 'name', c.data_type as 'type', c.is_nullable as 'isnull'") === 0;
    result = result || this.sql.toLowerCase().indexOf('select tablename = t.name, name = ind.name,') === 0;
    result = result || this.sql.toLowerCase().indexOf('exec sys.sp_helpindex @objname') === 0;

    return result;
  }

  isShowIndexesQuery() {
    return this.sql.toLowerCase().indexOf('exec sys.sp_helpindex @objname') === 0;
  }

  handleShowIndexesQuery(data) {
    // Group by index name, and collect all fields
    data = _.reduce(data, (acc, item) => {
      if (!(item.index_name in acc)) {
        acc[item.index_name] = item;
        item.fields = [];
      }

      Utils._.forEach(item.index_keys.split(','), column => {
        let columnName = column.trim();
        if (columnName.indexOf('(-)') !== -1) {
          columnName = columnName.replace('(-)', '');
        }

        acc[item.index_name].fields.push({
          attribute: columnName,
          length: undefined,
          order: column.indexOf('(-)') !== -1 ? 'DESC' : 'ASC',
          collate: undefined
        });
      });
      delete item.index_keys;
      return acc;
    }, {});

    return Utils._.map(data, item => ({
      primary: item.index_name.toLowerCase().indexOf('pk') === 0,
      fields: item.fields,
      name: item.index_name,
      tableName: undefined,
      unique: item.index_description.toLowerCase().indexOf('unique') !== -1,
      type: undefined
    }));
  }

  handleInsertQuery(results, metaData) {
    if (this.instance) {
      // add the inserted row id to the instance
      const autoIncrementAttribute = this.model.autoIncrementAttribute;
      let id = null;
      let autoIncrementAttributeAlias = null;

      if (this.model.rawAttributes.hasOwnProperty(autoIncrementAttribute) &&
        this.model.rawAttributes[autoIncrementAttribute].field !== undefined)
        autoIncrementAttributeAlias = this.model.rawAttributes[autoIncrementAttribute].field;

      id = id || results && results[0][this.getInsertIdField()];
      id = id || metaData && metaData[this.getInsertIdField()];
      id = id || results && results[0][autoIncrementAttribute];
      id = id || autoIncrementAttributeAlias && results && results[0][autoIncrementAttributeAlias];

      this.instance[autoIncrementAttribute] = id;
    }
  }
}

module.exports = Query;
module.exports.Query = Query;
module.exports.default = Query;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1),
  DataTypes = __webpack_require__(2),
  AbstractQueryGenerator = __webpack_require__(26),
  randomBytes = __webpack_require__(88).randomBytes,
  semver = __webpack_require__(14);

/* istanbul ignore next */
const throwMethodUndefined = function(methodName) {
  throw new Error('The method "' + methodName + '" is not defined! Please add it to your sql dialect.');
};

const QueryGenerator = {
  __proto__: AbstractQueryGenerator,
  options: {},
  dialect: 'mssql',

  createSchema(schema) {
    return [
      'IF NOT EXISTS (SELECT schema_name',
      'FROM information_schema.schemata',
      'WHERE schema_name =', wrapSingleQuote(schema), ')',
      'BEGIN',
      "EXEC sp_executesql N'CREATE SCHEMA",
      this.quoteIdentifier(schema),
      ";'",
      'END;'
    ].join(' ');
  },

  showSchemasQuery() {
    return [
      'SELECT "name" as "schema_name" FROM sys.schemas as s',
      'WHERE "s"."name" NOT IN (',
      "'INFORMATION_SCHEMA', 'dbo', 'guest', 'sys', 'archive'",
      ')', 'AND', '"s"."name" NOT LIKE', "'db_%'"
    ].join(' ');
  },

  versionQuery() {
    // Uses string manipulation to convert the MS Maj.Min.Patch.Build to semver Maj.Min.Patch
    return [
      'DECLARE @ms_ver NVARCHAR(20);',
      "SET @ms_ver = REVERSE(CONVERT(NVARCHAR(20), SERVERPROPERTY('ProductVersion')));",
      "SELECT REVERSE(SUBSTRING(@ms_ver, CHARINDEX('.', @ms_ver)+1, 20)) AS 'version'"
    ].join(' ');
  },

  createTableQuery(tableName, attributes, options) {
    const query = "IF OBJECT_ID('<%= table %>', 'U') IS NULL CREATE TABLE <%= table %> (<%= attributes %>)",
      primaryKeys = [],
      foreignKeys = {},
      attrStr = [],
      self = this;

    for (const attr in attributes) {
      if (attributes.hasOwnProperty(attr)) {
        const dataType = attributes[attr];
        let match;

        if (Utils._.includes(dataType, 'PRIMARY KEY')) {
          primaryKeys.push(attr);

          if (Utils._.includes(dataType, 'REFERENCES')) {
            // MSSQL doesn't support inline REFERENCES declarations: move to the end
            match = dataType.match(/^(.+) (REFERENCES.*)$/);
            attrStr.push(this.quoteIdentifier(attr) + ' ' + match[1].replace(/PRIMARY KEY/, ''));
            foreignKeys[attr] = match[2];
          } else {
            attrStr.push(this.quoteIdentifier(attr) + ' ' + dataType.replace(/PRIMARY KEY/, ''));
          }
        } else if (Utils._.includes(dataType, 'REFERENCES')) {
          // MSSQL doesn't support inline REFERENCES declarations: move to the end
          match = dataType.match(/^(.+) (REFERENCES.*)$/);
          attrStr.push(this.quoteIdentifier(attr) + ' ' + match[1]);
          foreignKeys[attr] = match[2];
        } else {
          attrStr.push(this.quoteIdentifier(attr) + ' ' + dataType);
        }
      }
    }

    const values = {
        table: this.quoteTable(tableName),
        attributes: attrStr.join(', ')
      },
      pkString = primaryKeys.map(pk => { return this.quoteIdentifier(pk); }).join(', ');

    if (options.uniqueKeys) {
      Utils._.each(options.uniqueKeys, (columns, indexName) => {
        if (!Utils._.isString(indexName)) {
          indexName = 'uniq_' + tableName + '_' + columns.fields.join('_');
        }
        values.attributes += ', CONSTRAINT ' + self.quoteIdentifier(indexName) + ' UNIQUE (' + Utils._.map(columns.fields, self.quoteIdentifier).join(', ') + ')';
      });
    }

    if (pkString.length > 0) {
      values.attributes += ', PRIMARY KEY (' + pkString + ')';
    }

    for (const fkey in foreignKeys) {
      if (foreignKeys.hasOwnProperty(fkey)) {
        values.attributes += ', FOREIGN KEY (' + this.quoteIdentifier(fkey) + ') ' + foreignKeys[fkey];
      }
    }

    return Utils._.template(query)(values).trim() + ';';
  },

  describeTableQuery(tableName, schema) {
    let sql = [
      'SELECT',
      "c.COLUMN_NAME AS 'Name',",
      "c.DATA_TYPE AS 'Type',",
      "c.CHARACTER_MAXIMUM_LENGTH AS 'Length',",
      "c.IS_NULLABLE as 'IsNull',",
      "COLUMN_DEFAULT AS 'Default',",
      "pk.CONSTRAINT_TYPE AS 'Constraint'",
      'FROM',
      'INFORMATION_SCHEMA.TABLES t',
      'INNER JOIN',
      'INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME AND t.TABLE_SCHEMA = c.TABLE_SCHEMA',
      'LEFT JOIN (SELECT tc.table_schema, tc.table_name, ',
      'cu.column_name, tc.constraint_type ',
      'FROM information_schema.TABLE_CONSTRAINTS tc ',
      'JOIN information_schema.KEY_COLUMN_USAGE  cu ',
      'ON tc.table_schema=cu.table_schema and tc.table_name=cu.table_name ',
      'and tc.constraint_name=cu.constraint_name ',
      'and tc.constraint_type=\'PRIMARY KEY\') pk ',
      'ON pk.table_schema=c.table_schema ',
      'AND pk.table_name=c.table_name ',
      'AND pk.column_name=c.column_name ',
      'WHERE t.TABLE_NAME =', wrapSingleQuote(tableName)
    ].join(' ');

    if (schema) {
      sql += 'AND t.TABLE_SCHEMA =' + wrapSingleQuote(schema);
    }

    return sql;
  },

  renameTableQuery(before, after) {
    const query = 'EXEC sp_rename <%= before %>, <%= after %>;';
    return Utils._.template(query)({
      before: this.quoteTable(before),
      after: this.quoteTable(after)
    });
  },

  showTablesQuery() {
    return 'SELECT TABLE_NAME, TABLE_SCHEMA FROM INFORMATION_SCHEMA.TABLES;';
  },

  dropTableQuery(tableName) {
    const query = "IF OBJECT_ID('<%= table %>', 'U') IS NOT NULL DROP TABLE <%= table %>";
    const values = {
      table: this.quoteTable(tableName)
    };

    return Utils._.template(query)(values).trim() + ';';
  },

  addColumnQuery(table, key, dataType) {
    // FIXME: attributeToSQL SHOULD be using attributes in addColumnQuery
    //        but instead we need to pass the key along as the field here
    dataType.field = key;

    const query = 'ALTER TABLE <%= table %> ADD <%= attribute %>;',
      attribute = Utils._.template('<%= key %> <%= definition %>')({
        key: this.quoteIdentifier(key),
        definition: this.attributeToSQL(dataType, {
          context: 'addColumn'
        })
      });

    return Utils._.template(query)({
      table: this.quoteTable(table),
      attribute
    });
  },

  removeColumnQuery(tableName, attributeName) {
    const query = 'ALTER TABLE <%= tableName %> DROP COLUMN <%= attributeName %>;';
    return Utils._.template(query)({
      tableName: this.quoteTable(tableName),
      attributeName: this.quoteIdentifier(attributeName)
    });
  },

  changeColumnQuery(tableName, attributes) {
    const query = 'ALTER TABLE <%= tableName %> <%= query %>;';
    const attrString = [],
      constraintString = [];

    for (const attributeName in attributes) {
      const definition = attributes[attributeName];
      if (definition.match(/REFERENCES/)) {
        constraintString.push(Utils._.template('<%= fkName %> FOREIGN KEY (<%= attrName %>) <%= definition %>')({
          fkName: this.quoteIdentifier(attributeName + '_foreign_idx'),
          attrName: this.quoteIdentifier(attributeName),
          definition: definition.replace(/.+?(?=REFERENCES)/, '')
        }));
      } else {
        attrString.push(Utils._.template('<%= attrName %> <%= definition %>')({
          attrName: this.quoteIdentifier(attributeName),
          definition
        }));
      }
    }

    let finalQuery = '';
    if (attrString.length) {
      finalQuery += 'ALTER COLUMN ' + attrString.join(', ');
      finalQuery += constraintString.length ? ' ' : '';
    }
    if (constraintString.length) {
      finalQuery += 'ADD CONSTRAINT ' + constraintString.join(', ');
    }

    return Utils._.template(query)({
      tableName: this.quoteTable(tableName),
      query: finalQuery
    });
  },

  renameColumnQuery(tableName, attrBefore, attributes) {
    const query = "EXEC sp_rename '<%= tableName %>.<%= before %>', '<%= after %>', 'COLUMN';",
      newName = Object.keys(attributes)[0];

    return Utils._.template(query)({
      tableName: this.quoteTable(tableName),
      before: attrBefore,
      after: newName
    });
  },

  bulkInsertQuery(tableName, attrValueHashes, options, attributes) {
    options = options || {};
    attributes = attributes || {};
    const query = 'INSERT INTO <%= table %> (<%= attributes %>)<%= output %> VALUES <%= tuples %>;',
      emptyQuery = 'INSERT INTO <%= table %><%= output %> DEFAULT VALUES',
      tuples = [],
      allAttributes = [],
      allQueries = [];

    let needIdentityInsertWrapper = false,
      outputFragment;

    if (options.returning) {
      outputFragment = ' OUTPUT INSERTED.*';
    }

    Utils._.forEach(attrValueHashes, attrValueHash => {
      // special case for empty objects with primary keys
      const fields = Object.keys(attrValueHash);
      const firstAttr = attributes[fields[0]];
      if (fields.length === 1 && firstAttr && firstAttr.autoIncrement && attrValueHash[fields[0]] === null) {
        allQueries.push(emptyQuery);
        return;
      }

      // normal case
      Utils._.forOwn(attrValueHash, (value, key) => {
        if (value !== null && attributes[key] && attributes[key].autoIncrement) {
          needIdentityInsertWrapper = true;
        }

        if (allAttributes.indexOf(key) === -1) {
          if (value === null && attributes[key].autoIncrement)
            return;

          allAttributes.push(key);
        }
      });
    });

    if (allAttributes.length > 0) {
      Utils._.forEach(attrValueHashes, attrValueHash => {
        tuples.push('(' +
          allAttributes.map(key =>
            this.escape(attrValueHash[key])).join(',') +
        ')');
      });

      allQueries.push(query);
    }
    const commands = [];
    let offset = 0;
    const batch = Math.floor(250 / (allAttributes.length + 1)) + 1;
    while (offset < Math.max(tuples.length, 1)) {
      const replacements = {
        table: this.quoteTable(tableName),
        attributes: allAttributes.map(attr =>
          this.quoteIdentifier(attr)).join(','),
        tuples: tuples.slice(offset, Math.min(tuples.length, offset + batch)),
        output: outputFragment
      };

      let generatedQuery = Utils._.template(allQueries.join(';'))(replacements);
      if (needIdentityInsertWrapper) {
        generatedQuery = [
          'SET IDENTITY_INSERT', this.quoteTable(tableName), 'ON;',
          generatedQuery,
          'SET IDENTITY_INSERT', this.quoteTable(tableName), 'OFF;'
        ].join(' ');
      }
      commands.push(generatedQuery);
      offset += batch;
    }
    return commands.join(';');
  },

  updateQuery(tableName, attrValueHash, where, options, attributes) {
    let sql = super.updateQuery(tableName, attrValueHash, where, options, attributes);
    if (options.limit) {
      const updateArgs = `UPDATE TOP(${this.escape(options.limit)})`;
      sql = sql.replace('UPDATE', updateArgs);
    }
    return sql;
  },

  upsertQuery(tableName, insertValues, updateValues, where, model) {
    const targetTableAlias = this.quoteTable(`${tableName}_target`);
    const sourceTableAlias = this.quoteTable(`${tableName}_source`);
    const primaryKeysAttrs = [];
    const identityAttrs = [];
    const uniqueAttrs = [];
    const tableNameQuoted = this.quoteTable(tableName);
    let needIdentityInsertWrapper = false;


    //Obtain primaryKeys, uniquekeys and identity attrs from rawAttributes as model is not passed
    for (const key in model.rawAttributes) {
      if (model.rawAttributes[key].primaryKey) {
        primaryKeysAttrs.push(model.rawAttributes[key].field || key);
      }
      if (model.rawAttributes[key].unique) {
        uniqueAttrs.push(model.rawAttributes[key].field || key);
      }
      if (model.rawAttributes[key].autoIncrement) {
        identityAttrs.push(model.rawAttributes[key].field || key);
      }
    }

    //Add unique indexes defined by indexes option to uniqueAttrs
    for (const index of model.options.indexes) {
      if (index.unique && index.fields) {
        for (const field of index.fields) {
          const fieldName = typeof field === 'string' ? field : field.name || field.attribute;
          if (uniqueAttrs.indexOf(fieldName) === -1 && model.rawAttributes[fieldName]) {
            uniqueAttrs.push(fieldName);
          }
        }
      }
    }

    const updateKeys = Object.keys(updateValues);
    const insertKeys = Object.keys(insertValues);
    const insertKeysQuoted = insertKeys.map(key => this.quoteIdentifier(key)).join(', ');
    const insertValuesEscaped = insertKeys.map(key => this.escape(insertValues[key])).join(', ');
    const sourceTableQuery = `VALUES(${insertValuesEscaped})`; //Virtual Table
    let joinCondition;

    //IDENTITY_INSERT Condition
    identityAttrs.forEach(key => {
      if (updateValues[key] && updateValues[key] !== null) {
        needIdentityInsertWrapper = true;
        /*
         * IDENTITY_INSERT Column Cannot be updated, only inserted
         * http://stackoverflow.com/a/30176254/2254360
         */
      }
    });

    //Filter NULL Clauses
    const clauses = where.$or.filter(clause => {
      let valid = true;
      /*
       * Exclude NULL Composite PK/UK. Partial Composite clauses should also be excluded as it doesn't guarantee a single row
       */
      for (const key in clause) {
        if (!clause[key]) {
          valid = false;
          break;
        }
      }
      return valid;
    });

    /*
     * Generate ON condition using PK(s).
     * If not, generate using UK(s). Else throw error
     */
    const getJoinSnippet = array => {
      return array.map(key => {
        key = this.quoteIdentifier(key);
        return `${targetTableAlias}.${key} = ${sourceTableAlias}.${key}`;
      });
    };

    if (clauses.length === 0) {
      throw new Error('Primary Key or Unique key should be passed to upsert query');
    } else {
      // Search for primary key attribute in clauses -- Model can have two separate unique keys
      for (const key in clauses) {
        const keys = Object.keys(clauses[key]);
        if (primaryKeysAttrs.indexOf(keys[0]) !== -1) {
          joinCondition = getJoinSnippet(primaryKeysAttrs).join(' AND ');
          break;
        }
      }
      if (!joinCondition) {
        joinCondition = getJoinSnippet(uniqueAttrs).join(' AND ');
      }
    }

    // Remove the IDENTITY_INSERT Column from update
    const updateSnippet = updateKeys.filter(key => {
      if (identityAttrs.indexOf(key) === -1) {
        return true;
      } else {
        return false;
      }
    })
      .map(key => {
        const value = this.escape(updateValues[key]);
        key = this.quoteIdentifier(key);
        return `${targetTableAlias}.${key} = ${value}`;
      }).join(', ');

    const insertSnippet = `(${insertKeysQuoted}) VALUES(${insertValuesEscaped})`;
    let query = `MERGE INTO ${tableNameQuoted} WITH(HOLDLOCK) AS ${targetTableAlias} USING (${sourceTableQuery}) AS ${sourceTableAlias}(${insertKeysQuoted}) ON ${joinCondition}`;
    query += ` WHEN MATCHED THEN UPDATE SET ${updateSnippet} WHEN NOT MATCHED THEN INSERT ${insertSnippet} OUTPUT $action, INSERTED.*;`;
    if (needIdentityInsertWrapper) {
      query = `SET IDENTITY_INSERT ${tableNameQuoted} ON; ${query} SET IDENTITY_INSERT ${tableNameQuoted} OFF;`;
    }
    return query;
  },

  deleteQuery(tableName, where, options) {
    options = options || {};

    const table = this.quoteTable(tableName);
    if (options.truncate === true) {
      // Truncate does not allow LIMIT and WHERE
      return 'TRUNCATE TABLE ' + table;
    }

    where = this.getWhereConditions(where);
    let limit = '';
    const query = 'DELETE<%= limit %> FROM <%= table %><%= where %>; ' +
                'SELECT @@ROWCOUNT AS AFFECTEDROWS;';

    if (Utils._.isUndefined(options.limit)) {
      options.limit = 1;
    }

    if (options.limit) {
      limit = ' TOP(' + this.escape(options.limit) + ')';
    }

    const replacements = {
      limit,
      table,
      where
    };

    if (replacements.where) {
      replacements.where = ' WHERE ' + replacements.where;
    }

    return Utils._.template(query)(replacements);
  },

  showIndexesQuery(tableName) {
    const sql = "EXEC sys.sp_helpindex @objname = N'<%= tableName %>';";
    return Utils._.template(sql)({
      tableName: this.quoteTable(tableName)
    });
  },

  showConstraintsQuery(tableName) {
    return `EXEC sp_helpconstraint @objname = ${this.escape(this.quoteTable(tableName))};`;
  },

  removeIndexQuery(tableName, indexNameOrAttributes) {
    const sql = 'DROP INDEX <%= indexName %> ON <%= tableName %>';
    let indexName = indexNameOrAttributes;

    if (typeof indexName !== 'string') {
      indexName = Utils.underscore(tableName + '_' + indexNameOrAttributes.join('_'));
    }

    const values = {
      tableName: this.quoteIdentifiers(tableName),
      indexName: this.quoteIdentifiers(indexName)
    };

    return Utils._.template(sql)(values);
  },

  attributeToSQL(attribute) {
    if (!Utils._.isPlainObject(attribute)) {
      attribute = {
        type: attribute
      };
    }

    // handle self referential constraints
    if (attribute.references) {

      if (attribute.Model && attribute.Model.tableName === attribute.references.model) {
        this.sequelize.log('MSSQL does not support self referencial constraints, '
          + 'we will remove it but we recommend restructuring your query');
        attribute.onDelete = '';
        attribute.onUpdate = '';
      }
    }

    let template;

    if (attribute.type instanceof DataTypes.ENUM) {
      if (attribute.type.values && !attribute.values) attribute.values = attribute.type.values;

      // enums are a special case
      template = attribute.type.toSql();
      template += ' CHECK (' + this.quoteIdentifier(attribute.field) + ' IN(' + Utils._.map(attribute.values, value => {
        return this.escape(value);
      }).join(', ') + '))';
      return template;
    } else {
      template = attribute.type.toString();
    }

    if (attribute.allowNull === false) {
      template += ' NOT NULL';
    } else if (!attribute.primaryKey && !Utils.defaultValueSchemable(attribute.defaultValue)) {
      template += ' NULL';
    }

    if (attribute.autoIncrement) {
      template += ' IDENTITY(1,1)';
    }

    // Blobs/texts cannot have a defaultValue
    if (attribute.type !== 'TEXT' && attribute.type._binary !== true &&
        Utils.defaultValueSchemable(attribute.defaultValue)) {
      template += ' DEFAULT ' + this.escape(attribute.defaultValue);
    }

    if (attribute.unique === true) {
      template += ' UNIQUE';
    }

    if (attribute.primaryKey) {
      template += ' PRIMARY KEY';
    }

    if (attribute.references) {
      template += ' REFERENCES ' + this.quoteTable(attribute.references.model);

      if (attribute.references.key) {
        template += ' (' + this.quoteIdentifier(attribute.references.key) + ')';
      } else {
        template += ' (' + this.quoteIdentifier('id') + ')';
      }

      if (attribute.onDelete) {
        template += ' ON DELETE ' + attribute.onDelete.toUpperCase();
      }

      if (attribute.onUpdate) {
        template += ' ON UPDATE ' + attribute.onUpdate.toUpperCase();
      }
    }

    return template;
  },

  attributesToSQL(attributes, options) {
    const result = {},
      existingConstraints = [];
    let key,
      attribute;

    for (key in attributes) {
      attribute = attributes[key];

      if (attribute.references) {

        if (existingConstraints.indexOf(attribute.references.model.toString()) !== -1) {
          // no cascading constraints to a table more than once
          attribute.onDelete = '';
          attribute.onUpdate = '';
        } else {
          existingConstraints.push(attribute.references.model.toString());

          // NOTE: this really just disables cascading updates for all
          //       definitions. Can be made more robust to support the
          //       few cases where MSSQL actually supports them
          attribute.onUpdate = '';
        }

      }

      if (key && !attribute.field) attribute.field = key;
      result[attribute.field || key] = this.attributeToSQL(attribute, options);
    }

    return result;
  },

  createTrigger() {
    throwMethodUndefined('createTrigger');
  },

  dropTrigger() {
    throwMethodUndefined('dropTrigger');
  },

  renameTrigger() {
    throwMethodUndefined('renameTrigger');
  },

  createFunction() {
    throwMethodUndefined('createFunction');
  },

  dropFunction() {
    throwMethodUndefined('dropFunction');
  },

  renameFunction() {
    throwMethodUndefined('renameFunction');
  },

  quoteIdentifier(identifier) {
    if (identifier === '*') return identifier;
    return '[' + identifier.replace(/[\[\]']+/g, '') + ']';
  },

  getForeignKeysQuery(table) {
    const tableName = table.tableName || table;
    let sql = [
      'SELECT',
      'constraint_name = C.CONSTRAINT_NAME',
      'FROM',
      'INFORMATION_SCHEMA.TABLE_CONSTRAINTS C',
      "WHERE C.CONSTRAINT_TYPE = 'FOREIGN KEY'",
      'AND C.TABLE_NAME =', wrapSingleQuote(tableName)
    ].join(' ');

    if (table.schema) {
      sql += ' AND C.TABLE_SCHEMA =' + wrapSingleQuote(table.schema);
    }

    return sql;
  },

  getForeignKeyQuery(table, attributeName) {
    const tableName = table.tableName || table;
    let sql = [
      'SELECT',
      'constraint_name = TC.CONSTRAINT_NAME',
      'FROM',
      'INFORMATION_SCHEMA.TABLE_CONSTRAINTS TC',
      'JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE CCU',
      'ON TC.CONSTRAINT_NAME = CCU.CONSTRAINT_NAME',
      "WHERE TC.CONSTRAINT_TYPE = 'FOREIGN KEY'",
      'AND TC.TABLE_NAME =', wrapSingleQuote(tableName),
      'AND CCU.COLUMN_NAME =', wrapSingleQuote(attributeName)
    ].join(' ');

    if (table.schema) {
      sql += ' AND TC.TABLE_SCHEMA =' + wrapSingleQuote(table.schema);
    }

    return sql;
  },

  getPrimaryKeyConstraintQuery(table, attributeName) {
    const tableName = wrapSingleQuote(table.tableName || table);
    return [
      'SELECT K.TABLE_NAME AS tableName,',
      'K.COLUMN_NAME AS columnName,',
      'K.CONSTRAINT_NAME AS constraintName',
      'FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS C',
      'JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS K',
      'ON C.TABLE_NAME = K.TABLE_NAME',
      'AND C.CONSTRAINT_CATALOG = K.CONSTRAINT_CATALOG',
      'AND C.CONSTRAINT_SCHEMA = K.CONSTRAINT_SCHEMA',
      'AND C.CONSTRAINT_NAME = K.CONSTRAINT_NAME',
      'WHERE C.CONSTRAINT_TYPE = \'PRIMARY KEY\'',
      `AND K.COLUMN_NAME = ${wrapSingleQuote(attributeName)}`,
      `AND K.TABLE_NAME = ${tableName};`
    ].join(' ');
  },

  dropForeignKeyQuery(tableName, foreignKey) {
    return Utils._.template('ALTER TABLE <%= table %> DROP <%= key %>')({
      table: this.quoteTable(tableName),
      key: this.quoteIdentifier(foreignKey)
    });
  },

  getDefaultConstraintQuery(tableName, attributeName) {
    const sql = 'SELECT name FROM SYS.DEFAULT_CONSTRAINTS ' +
      "WHERE PARENT_OBJECT_ID = OBJECT_ID('<%= table %>', 'U') " +
      "AND PARENT_COLUMN_ID = (SELECT column_id FROM sys.columns WHERE NAME = ('<%= column %>') " +
      "AND object_id = OBJECT_ID('<%= table %>', 'U'));";
    return Utils._.template(sql)({
      table: this.quoteTable(tableName),
      column: attributeName
    });
  },

  dropConstraintQuery(tableName, constraintName) {
    const sql = 'ALTER TABLE <%= table %> DROP CONSTRAINT <%= constraint %>;';
    return Utils._.template(sql)({
      table: this.quoteTable(tableName),
      constraint: this.quoteIdentifier(constraintName)
    });
  },

  setAutocommitQuery() {
    return '';
  },

  setIsolationLevelQuery() {

  },

  generateTransactionId() {
    return randomBytes(10).toString('hex');
  },

  startTransactionQuery(transaction) {
    if (transaction.parent) {
      return 'SAVE TRANSACTION ' + this.quoteIdentifier(transaction.name) + ';';
    }

    return 'BEGIN TRANSACTION;';
  },

  commitTransactionQuery(transaction) {
    if (transaction.parent) {
      return;
    }

    return 'COMMIT TRANSACTION;';
  },

  rollbackTransactionQuery(transaction) {
    if (transaction.parent) {
      return 'ROLLBACK TRANSACTION ' + this.quoteIdentifier(transaction.name) + ';';
    }

    return 'ROLLBACK TRANSACTION;';
  },

  selectFromTableFragment(options, model, attributes, tables, mainTableAs, where) {
    let topFragment = '';
    let mainFragment = 'SELECT ' + attributes.join(', ') + ' FROM ' + tables;

    // Handle SQL Server 2008 with TOP instead of LIMIT
    if (semver.valid(this.sequelize.options.databaseVersion) && semver.lt(this.sequelize.options.databaseVersion, '11.0.0')) {
      if (options.limit) {
        topFragment = 'TOP ' + options.limit + ' ';
      }
      if (options.offset) {
        const offset = options.offset || 0,
          isSubQuery = options.hasIncludeWhere || options.hasIncludeRequired || options.hasMultiAssociation;
        let orders = { mainQueryOrder: [] };
        if (options.order) {
          orders = this.getQueryOrders(options, model, isSubQuery);
        }

        if (!orders.mainQueryOrder.length) {
          orders.mainQueryOrder.push(this.quoteIdentifier(model.primaryKeyField));
        }

        const tmpTable = mainTableAs ? mainTableAs : 'OffsetTable';
        const whereFragment = where ? ' WHERE ' + where : '';

        /*
         * For earlier versions of SQL server, we need to nest several queries
         * in order to emulate the OFFSET behavior.
         *
         * 1. The outermost query selects all items from the inner query block.
         *    This is due to a limitation in SQL server with the use of computed
         *    columns (e.g. SELECT ROW_NUMBER()...AS x) in WHERE clauses.
         * 2. The next query handles the LIMIT and OFFSET behavior by getting
         *    the TOP N rows of the query where the row number is > OFFSET
         * 3. The innermost query is the actual set we want information from
         */
        const fragment = 'SELECT TOP 100 PERCENT ' + attributes.join(', ') + ' FROM ' +
                        '(SELECT ' + topFragment + '*' +
                          ' FROM (SELECT ROW_NUMBER() OVER (ORDER BY ' + orders.mainQueryOrder.join(', ') + ') as row_num, * ' +
                            ' FROM ' + tables + ' AS ' + tmpTable + whereFragment + ')' +
                          ' AS ' + tmpTable + ' WHERE row_num > ' + offset + ')' +
                        ' AS ' + tmpTable;
        return fragment;
      } else {
        mainFragment = 'SELECT ' + topFragment + attributes.join(', ') + ' FROM ' + tables;
      }
    }

    if (mainTableAs) {
      mainFragment += ' AS ' + mainTableAs;
    }

    return mainFragment;
  },

  addLimitAndOffset(options, model) {
    // Skip handling of limit and offset as postfixes for older SQL Server versions
    if (semver.valid(this.sequelize.options.databaseVersion) && semver.lt(this.sequelize.options.databaseVersion, '11.0.0')) {
      return '';
    }

    let fragment = '';
    const offset = options.offset || 0,
      isSubQuery = options.hasIncludeWhere || options.hasIncludeRequired || options.hasMultiAssociation;

    let orders = {};
    if (options.order) {
      orders = this.getQueryOrders(options, model, isSubQuery);
    }

    if (options.limit || options.offset) {
      if (!options.order || options.include && !orders.subQueryOrder.length) {
        fragment += options.order && !isSubQuery ? ', ' : ' ORDER BY ';
        fragment += this.quoteTable(options.tableAs || model.name) + '.' + this.quoteIdentifier(model.primaryKeyField);
      }

      if (options.offset || options.limit) {
        fragment += ' OFFSET ' + this.escape(offset) + ' ROWS';
      }

      if (options.limit) {
        fragment += ' FETCH NEXT ' + this.escape(options.limit) + ' ROWS ONLY';
      }
    }

    return fragment;
  },

  booleanValue(value) {
    return value ? 1 : 0;
  }
};

// private methods
function wrapSingleQuote(identifier) {
  return Utils.addTicks(Utils.removeTicks(identifier, "'"), "'");
}

module.exports = QueryGenerator;


/***/ }),
/* 88 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _ = __webpack_require__(0);
const AbstractDialect = __webpack_require__(22);
const ConnectionManager = __webpack_require__(90);
const Query = __webpack_require__(93);
const QueryGenerator = __webpack_require__(38);
const DataTypes = __webpack_require__(2).mysql;

class MysqlDialect extends AbstractDialect {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.connectionManager = new ConnectionManager(this, sequelize);
    this.QueryGenerator = _.extend({}, QueryGenerator, {
      options: sequelize.options,
      _dialect: this,
      sequelize
    });
  }
}

MysqlDialect.prototype.supports = _.merge(_.cloneDeep(AbstractDialect.prototype.supports), {
  'VALUES ()': true,
  'LIMIT ON UPDATE': true,
  'IGNORE': ' IGNORE',
  lock: true,
  forShare: 'LOCK IN SHARE MODE',
  index: {
    collate: false,
    length: true,
    parser: true,
    type: true,
    using: 1
  },
  constraints: {
    dropConstraint: false,
    check: false
  },
  ignoreDuplicates: ' IGNORE',
  updateOnDuplicate: true,
  indexViaAlter: true,
  NUMERIC: true,
  GEOMETRY: true,
  REGEXP: true
});

ConnectionManager.prototype.defaultVersion = '5.6.0';
MysqlDialect.prototype.Query = Query;
MysqlDialect.prototype.QueryGenerator = QueryGenerator;
MysqlDialect.prototype.DataTypes = DataTypes;
MysqlDialect.prototype.name = 'mysql';
MysqlDialect.prototype.TICK_CHAR = '`';
MysqlDialect.prototype.TICK_CHAR_LEFT = MysqlDialect.prototype.TICK_CHAR;
MysqlDialect.prototype.TICK_CHAR_RIGHT = MysqlDialect.prototype.TICK_CHAR;

module.exports = MysqlDialect;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractConnectionManager = __webpack_require__(23);
const SequelizeErrors = __webpack_require__(3);
const Utils = __webpack_require__(1);
const DataTypes = __webpack_require__(2).mysql;
const momentTz = __webpack_require__(18);
const debug = Utils.getLogger().debugContext('connection:mysql');
const parserMap = new Map();

/**
 * MySQL Connection Managger
 *
 * Get connections, validate and disconnect them.
 * AbstractConnectionManager pooling use it to handle MySQL specific connections
 * Use https://github.com/sidorares/node-mysql2 to connect with MySQL server
 *
 * @extends AbstractConnectionManager
 * @return Class<ConnectionManager>
 * @private
 */

class ConnectionManager extends AbstractConnectionManager {
  constructor(dialect, sequelize) {
    super(dialect, sequelize);

    this.sequelize = sequelize;
    this.sequelize.config.port = this.sequelize.config.port || 3306;
    try {
      if (sequelize.config.dialectModulePath) {
        this.lib = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
      } else {
        this.lib = __webpack_require__(92);
      }
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        throw new Error('Please install mysql2 package manually');
      }
      throw err;
    }

    this.refreshTypeParser(DataTypes);
  }

  // Update parsing when the user has added additional, custom types
  _refreshTypeParser(dataType) {
    for (const type of dataType.types.mysql) {
      parserMap.set(type, dataType.parse);
    }
  }

  _clearTypeParser() {
    parserMap.clear();
  }

  static _typecast(field, next) {
    if (parserMap.has(field.type)) {
      return parserMap.get(field.type)(field, this.sequelize.options, next);
    }
    return next();
  }

  /**
   * Connect with MySQL database based on config, Handle any errors in connection
   * Set the pool handlers on connection.error
   * Also set proper timezone once conection is connected
   *
   * @return Promise<Connection>
   * @private
   */
  connect(config) {
    const connectionConfig = {
      host: config.host,
      port: config.port,
      user: config.username,
      flags: '-FOUND_ROWS',
      password: config.password,
      database: config.database,
      timezone: this.sequelize.options.timezone,
      typeCast: ConnectionManager._typecast.bind(this),
      bigNumberStrings: false,
      supportBigNumbers: true
    };

    if (config.dialectOptions) {
      for (const key of Object.keys(config.dialectOptions)) {
        connectionConfig[key] = config.dialectOptions[key];
      }
    }

    return new Utils.Promise((resolve, reject) => {
      const connection = this.lib.createConnection(connectionConfig);

      const errorHandler = e => {
        // clean up connect event if there is error
        connection.removeListener('connect', connectHandler);

        if (config.pool.handleDisconnects) {
          debug(`connection error ${e.code}`);

          if (e.code === 'PROTOCOL_CONNECTION_LOST') {
            return;
          }
        }

        connection.removeListener('error', errorHandler);
        reject(e);
      };

      const connectHandler = () => {
        if (!config.pool.handleDisconnects) {
          // clean up error event if connected
          connection.removeListener('error', errorHandler);
        }
        resolve(connection);
      };

      connection.on('error', errorHandler);
      connection.once('connect', connectHandler);
    })
      .tap (() => { debug('connection acquired'); })
      .then(connection => {
        return new Utils.Promise((resolve, reject) => {
        // set timezone for this connection
        // but named timezone are not directly supported in mysql, so get its offset first
          let tzOffset = this.sequelize.options.timezone;
          tzOffset = /\//.test(tzOffset) ? momentTz.tz(tzOffset).format('Z') : tzOffset;
          connection.query(`SET time_zone = '${tzOffset}'`, err => {
            if (err) { reject(err); } else { resolve(connection); }
          });
        });
      })
      .catch(err => {
        switch (err.code) {
          case 'ECONNREFUSED':
            throw new SequelizeErrors.ConnectionRefusedError(err);
          case 'ER_ACCESS_DENIED_ERROR':
            throw new SequelizeErrors.AccessDeniedError(err);
          case 'ENOTFOUND':
            throw new SequelizeErrors.HostNotFoundError(err);
          case 'EHOSTUNREACH':
            throw new SequelizeErrors.HostNotReachableError(err);
          case 'EINVAL':
            throw new SequelizeErrors.InvalidConnectionError(err);
          default:
            throw new SequelizeErrors.ConnectionError(err);
        }
      });
  }

  disconnect(connection) {
    // Dont disconnect connections with CLOSED state
    if (connection._closing) {
      debug('connection tried to disconnect but was already at CLOSED state');
      return Utils.Promise.resolve();
    }

    return new Utils.Promise((resolve, reject) => {
      connection.end(err => {
        if (err) {
          reject(new SequelizeErrors.ConnectionError(err));
        } else {
          debug('connection disconnected');
          resolve();
        }
      });
    });
  }

  validate(connection) {
    return connection && connection._fatalError === null && connection._protocolError === null && !connection._closing &&
      !connection.stream.destroyed;
  }
}

Utils._.extend(ConnectionManager.prototype, AbstractConnectionManager.prototype);

module.exports = ConnectionManager;
module.exports.ConnectionManager = ConnectionManager;
module.exports.default = ConnectionManager;


/***/ }),
/* 91 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 91;

/***/ }),
/* 92 */
/***/ (function(module, exports) {

module.exports = require("mysql2");

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const debug = Utils.getLogger().debugContext('sql:mysql');
const AbstractQuery = __webpack_require__(25);
const uuid = __webpack_require__(30);
const sequelizeErrors = __webpack_require__(3);
const _ = __webpack_require__(0);

class Query extends AbstractQuery {
  constructor(connection, sequelize, options) {
    super();
    this.connection = connection;
    this.instance = options.instance;
    this.model = options.model;
    this.sequelize = sequelize;
    this.uuid = uuid.v4();
    this.options = Utils._.extend({
      logging: console.log,
      plain: false,
      raw: false,
      showWarnings: false
    }, options || {});

    this.checkLoggingOption();
  }

  run(sql) {
    this.sql = sql;

    //do we need benchmark for this query execution
    const benchmark = this.sequelize.options.benchmark || this.options.benchmark;
    const showWarnings = this.sequelize.options.showWarnings || this.options.showWarnings;

    let queryBegin;
    if (benchmark) {
      queryBegin = Date.now();
    } else {
      this.sequelize.log('Executing (' + (this.connection.uuid || 'default') + '): ' + this.sql, this.options);
    }

    debug(`executing(${this.connection.uuid || 'default'}) : ${this.sql}`);

    return new Utils.Promise((resolve, reject) => {
      this.connection.query({ sql: this.sql }, (err, results) => {
        debug(`executed(${this.connection.uuid || 'default'}) : ${this.sql}`);

        if (benchmark) {
          this.sequelize.log('Executed (' + (this.connection.uuid || 'default') + '): ' + this.sql, Date.now() - queryBegin, this.options);
        }

        if (err) {
          err.sql = sql;

          reject(this.formatError(err));
        } else {
          resolve(results);
        }
      }).setMaxListeners(100);
    })
    // Log warnings if we've got them.
      .then(results => {
        if (showWarnings && results && results.warningStatus > 0) {
          return this.logWarnings(results);
        }
        return results;
      })
    // Return formatted results...
      .then(results => this.formatResults(results));
  }

  /**
   * High level function that handles the results of a query execution.
   *
   *
   * Example:
   *  query.formatResults([
   *    {
   *      id: 1,              // this is from the main table
   *      attr2: 'snafu',     // this is from the main table
   *      Tasks.id: 1,        // this is from the associated table
   *      Tasks.title: 'task' // this is from the associated table
   *    }
   *  ])
   *
   * @param {Array} data - The result of the query execution.
   * @private
   */
  formatResults(data) {
    let result = this.instance;

    if (this.isInsertQuery(data)) {
      this.handleInsertQuery(data);

      if (!this.instance) {
        // handle bulkCreate AI primiary key
        if (
          data.constructor.name === 'ResultSetHeader'
          && this.model
          && this.model.autoIncrementAttribute
          && this.model.autoIncrementAttribute === this.model.primaryKeyAttribute
          && this.model.rawAttributes[this.model.primaryKeyAttribute]
        ) {
          const startId = data[this.getInsertIdField()];
          result = [];
          for (let i = startId; i < startId + data.affectedRows; i++) {
            result.push({ [this.model.rawAttributes[this.model.primaryKeyAttribute].field]: i });
          }
        } else {
          result = data[this.getInsertIdField()];
        }
      }
    }

    if (this.isSelectQuery()) {
      result = this.handleSelectQuery(data);
    } else if (this.isShowTablesQuery()) {
      result = this.handleShowTablesQuery(data);
    } else if (this.isDescribeQuery()) {
      result = {};

      for (const _result of data) {
        const enumRegex = /^enum/i;
        result[_result.Field] = {
          type: enumRegex.test(_result.Type) ? _result.Type.replace(enumRegex, 'ENUM') : _result.Type.toUpperCase(),
          allowNull: _result.Null === 'YES',
          defaultValue: _result.Default,
          primaryKey: _result.Key === 'PRI'
        };
      }
    } else if (this.isShowIndexesQuery()) {
      result = this.handleShowIndexesQuery(data);

    } else if (this.isCallQuery()) {
      result = data[0];
    } else if (this.isBulkUpdateQuery() || this.isBulkDeleteQuery() || this.isUpsertQuery()) {
      result = data.affectedRows;
    } else if (this.isVersionQuery()) {
      result = data[0].version;
    } else if (this.isForeignKeysQuery()) {
      result = data;
    } else if (this.isInsertQuery() || this.isUpdateQuery()) {
      result = [result, data.affectedRows];
    } else if (this.isShowConstraintsQuery()) {
      result = data;
    } else if (this.isRawQuery()) {
      // MySQL returns row data and metadata (affected rows etc) in a single object - let's standarize it, sorta
      result = [data, data];
    }

    return result;
  }

  logWarnings(results) {
    return this.run('SHOW WARNINGS').then(warningResults => {
      const warningMessage = 'MySQL Warnings (' + (this.connection.uuid||'default') + '): ';
      const messages = [];
      for (const _warningRow of warningResults) {
        for (const _warningResult of _warningRow) {
          if (_warningResult.hasOwnProperty('Message')) {
            messages.push(_warningResult.Message);
          } else {
            for (const _objectKey of _warningResult.keys()) {
              messages.push([_objectKey, _warningResult[_objectKey]].join(': '));
            }
          }
        }
      }

      this.sequelize.log(warningMessage + messages.join('; '), this.options);

      return results;
    });
  }

  formatError(err) {
    switch (err.errno || err.code) {
      case 1062: {
        const match = err.message.match(/Duplicate entry '(.*)' for key '?((.|\s)*?)'?$/);

        let fields = {};
        let message = 'Validation error';
        const values = match ? match[1].split('-') : undefined;
        const uniqueKey = this.model && this.model.uniqueKeys[match[2]];

        if (uniqueKey) {
          if (uniqueKey.msg) message = uniqueKey.msg;
          fields = Utils._.zipObject(uniqueKey.fields, values);
        } else {
          fields[match[2]] = match[1];
        }

        const errors = [];
        Utils._.forOwn(fields, (value, field) => {
          errors.push(new sequelizeErrors.ValidationErrorItem(
            this.getUniqueConstraintErrorMessage(field),
            'unique violation', field, value
          ));
        });

        return new sequelizeErrors.UniqueConstraintError({message, errors, parent: err, fields});
      }
      case 1451: {
        const match = err.message.match(/FOREIGN KEY \(`(.*)`\) REFERENCES `(.*)` \(`(.*)`\)(?: ON .*)?\)$/);

        return new sequelizeErrors.ForeignKeyConstraintError({
          fields: null,
          index: match ? match[3] : undefined,
          parent: err
        });
      }
      case 1452: {
        const match = err.message.match(/FOREIGN KEY \(`(.*)`\) REFERENCES `(.*)` \(`(.*)`\)(.*)\)$/);

        return new sequelizeErrors.ForeignKeyConstraintError({
          fields: null,
          index: match ? match[1] : undefined,
          parent: err
        });
      }
      default:
        return new sequelizeErrors.DatabaseError(err);
    }
  }

  handleShowIndexesQuery(data) {
    // Group by index name, and collect all fields
    data = _.reduce(data, (acc, item) => {
      if (!(item.Key_name in acc)) {
        acc[item.Key_name] = item;
        item.fields = [];
      }

      acc[item.Key_name].fields[item.Seq_in_index - 1] = {
        attribute: item.Column_name,
        length: item.Sub_part || undefined,
        order: item.Collation === 'A' ? 'ASC' : undefined
      };
      delete item.column_name;

      return acc;
    }, {});

    return Utils._.map(data, item => ({
      primary: item.Key_name === 'PRIMARY',
      fields: item.fields,
      name: item.Key_name,
      tableName: item.Table,
      unique: item.Non_unique !== 1,
      type: item.Index_type
    }));
  }
}

module.exports = Query;
module.exports.Query = Query;
module.exports.default = Query;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _ = __webpack_require__(0);
const AbstractDialect = __webpack_require__(22);
const ConnectionManager = __webpack_require__(95);
const Query = __webpack_require__(98);
const QueryGenerator = __webpack_require__(99);
const DataTypes = __webpack_require__(2).postgres;

class PostgresDialect extends AbstractDialect {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.connectionManager = new ConnectionManager(this, sequelize);
    this.QueryGenerator = _.extend({}, QueryGenerator, {
      options: sequelize.options,
      _dialect: this,
      sequelize
    });
  }
}

PostgresDialect.prototype.supports = _.merge(_.cloneDeep(AbstractDialect.prototype.supports), {
  'DEFAULT VALUES': true,
  'EXCEPTION': true,
  'ON DUPLICATE KEY': false,
  'ORDER NULLS': true,
  returnValues: {
    returning: true
  },
  bulkDefault: true,
  schemas: true,
  lock: true,
  lockOf: true,
  lockKey: true,
  lockOuterJoinFailure: true,
  forShare: 'FOR SHARE',
  index: {
    concurrently: true,
    using: 2,
    where: true
  },
  NUMERIC: true,
  ARRAY: true,
  RANGE: true,
  GEOMETRY: true,
  REGEXP: true,
  GEOGRAPHY: true,
  JSON: true,
  JSONB: true,
  HSTORE: true,
  deferrableConstraints: true,
  searchPath : true
});

ConnectionManager.prototype.defaultVersion = '9.4.0';
PostgresDialect.prototype.Query = Query;
PostgresDialect.prototype.DataTypes = DataTypes;
PostgresDialect.prototype.name = 'postgres';
PostgresDialect.prototype.TICK_CHAR = '"';
PostgresDialect.prototype.TICK_CHAR_LEFT = PostgresDialect.prototype.TICK_CHAR;
PostgresDialect.prototype.TICK_CHAR_RIGHT = PostgresDialect.prototype.TICK_CHAR;

module.exports = PostgresDialect;
module.exports.default = PostgresDialect;
module.exports.PostgresDialect = PostgresDialect;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractConnectionManager = __webpack_require__(23);
const Utils = __webpack_require__(1);
const debug = Utils.getLogger().debugContext('connection:pg');
const Promise = __webpack_require__(4);
const sequelizeErrors = __webpack_require__(3);
const semver = __webpack_require__(14);
const dataTypes = __webpack_require__(2);
const moment = __webpack_require__(18);

class ConnectionManager extends AbstractConnectionManager {
  constructor(dialect, sequelize) {
    super(dialect, sequelize);

    this.sequelize = sequelize;
    this.sequelize.config.port = this.sequelize.config.port || 5432;
    try {
      let pgLib;
      if (sequelize.config.dialectModulePath) {
        pgLib = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
      } else {
        pgLib = __webpack_require__(97);
      }
      this.lib = sequelize.config.native ? pgLib.native : pgLib;
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        throw new Error('Please install \'' + (sequelize.config.dialectModulePath || 'pg') + '\' module manually');
      }
      throw err;
    }

    this.refreshTypeParser(dataTypes.postgres);
  }

  // Expose this as a method so that the parsing may be updated when the user has added additional, custom types
  _refreshTypeParser(dataType) {

    if (dataType.types.postgres.oids) {
      for (const oid of dataType.types.postgres.oids) {
        this.lib.types.setTypeParser(oid, value => dataType.parse(value, oid, this.lib.types.getTypeParser));
      }
    }

    if (dataType.types.postgres.array_oids) {
      for (const oid of dataType.types.postgres.array_oids) {
        this.lib.types.setTypeParser(oid, value =>
          this.lib.types.arrayParser.create(value, v =>
            dataType.parse(v, oid, this.lib.types.getTypeParser)
          ).parse()
        );
      }
    }
  }

  connect(config) {

    config.user = config.username;
    const connectionConfig = Utils._.pick(config, [
      'user', 'password', 'host', 'database', 'port'
    ]);

    if (config.dialectOptions) {
      Utils._.merge(connectionConfig,
        Utils._.pick(config.dialectOptions, [
        // see [http://www.postgresql.org/docs/9.3/static/runtime-config-logging.html#GUC-APPLICATION-NAME]
          'application_name',
          // choose the SSL mode with the PGSSLMODE environment variable
          // object format: [https://github.com/brianc/node-postgres/blob/master/lib/connection.js#L79]
          // see also [http://www.postgresql.org/docs/9.3/static/libpq-ssl.html]
          'ssl',
          // In addition to the values accepted by the corresponding server,
          // you can use "auto" to determine the right encoding from the
          // current locale in the client (LC_CTYPE environment variable on Unix systems)
          'client_encoding',
          // !! DONT SET THIS TO TRUE !!
          // (unless you know what you're doing)
          // see [http://www.postgresql.org/message-id/flat/bc9549a50706040852u27633f41ib1e6b09f8339d845@mail.gmail.com#bc9549a50706040852u27633f41ib1e6b09f8339d845@mail.gmail.com]
          'binary',
          // This should help with backends incorrectly considering idle clients to be dead and prematurely disconnecting them.
          // this feature has been added in pg module v6.0.0, check pg/CHANGELOG.md
          'keepAlive'
        ]));
    }

    return new Promise((resolve, reject) => {
      const connection = new this.lib.Client(connectionConfig);
      let responded = false;

      connection.connect(err => {
        if (err) {
          if (err.code) {
            switch (err.code) {
              case 'ECONNREFUSED':
                reject(new sequelizeErrors.ConnectionRefusedError(err));
                break;
              case 'ENOTFOUND':
                reject(new sequelizeErrors.HostNotFoundError(err));
                break;
              case 'EHOSTUNREACH':
                reject(new sequelizeErrors.HostNotReachableError(err));
                break;
              case 'EINVAL':
                reject(new sequelizeErrors.InvalidConnectionError(err));
                break;
              default:
                reject(new sequelizeErrors.ConnectionError(err));
                break;
            }
          } else {
            reject(new sequelizeErrors.ConnectionError(err));
          }
          return;
        }
        responded = true;
        debug('connection acquired');
        resolve(connection);
      });

      // If we didn't ever hear from the client.connect() callback the connection timeout, node-postgres does not treat this as an error since no active query was ever emitted
      connection.on('end', () => {
        debug('connection timeout');
        if (!responded) {
          reject(new sequelizeErrors.ConnectionTimedOutError(new Error('Connection timed out')));
        }
      });

      // Don't let a Postgres restart (or error) to take down the whole app
      connection.on('error', err => {
        debug(`connection error ${err.code}`);
        connection._invalid = true;
      });
    }).tap(connection => {
      // Disable escape characters in strings, see https://github.com/sequelize/sequelize/issues/3545
      let query = '';

      if (this.sequelize.options.databaseVersion !== 0 && semver.gte(this.sequelize.options.databaseVersion, '8.2.0')) {
        query += 'SET standard_conforming_strings=on;';
      }

      if (!this.sequelize.config.keepDefaultTimezone) {
        const isZone = !!moment.tz.zone(this.sequelize.options.timezone);
        if (isZone) {
          query += 'SET client_min_messages TO warning; SET TIME ZONE \'' + this.sequelize.options.timezone + '\';';
        } else {
          query += 'SET client_min_messages TO warning; SET TIME ZONE INTERVAL \'' + this.sequelize.options.timezone + '\' HOUR TO MINUTE;';
        }
      }

      // oids for hstore and geometry are dynamic - so select them at connection time
      const supportedVersion = this.sequelize.options.databaseVersion !== 0 && semver.gte(this.sequelize.options.databaseVersion, '8.3.0');
      if (dataTypes.HSTORE.types.postgres.oids.length === 0 && supportedVersion) {
        query += 'SELECT typname, oid, typarray FROM pg_type WHERE typtype = \'b\' AND typname IN (\'hstore\', \'geometry\', \'geography\')';
      }

      return new Promise((resolve, reject) => connection.query(query, (error, result) => error ? reject(error) : resolve(result))).then(results => {
        const result = Array.isArray(results) ? results.pop() : results;
        
        for (const row of result.rows) {
          let type;
          if (row.typname === 'geometry') {
            type = dataTypes.postgres.GEOMETRY;
          } else if (row.typname === 'hstore') {
            type = dataTypes.postgres.HSTORE;
          } else if (row.typname === 'geography') {
            type = dataTypes.postgres.GEOGRAPHY;
          }

          type.types.postgres.oids.push(row.oid);
          type.types.postgres.array_oids.push(row.typarray);

          this._refreshTypeParser(type);
        }
      });
    });
  }
  disconnect(connection) {
    return new Promise(resolve => {
      connection.end();
      resolve();
    });
  }

  validate(connection) {
    return connection._invalid === undefined;
  }
}

Utils._.extend(ConnectionManager.prototype, AbstractConnectionManager.prototype);

module.exports = ConnectionManager;
module.exports.ConnectionManager = ConnectionManager;
module.exports.default = ConnectionManager;


/***/ }),
/* 96 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 96;

/***/ }),
/* 97 */
/***/ (function(module, exports) {

module.exports = require("pg");

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const debug = Utils.getLogger().debugContext('sql:pg');
const AbstractQuery = __webpack_require__(25);
const QueryTypes = __webpack_require__(9);
const Promise = __webpack_require__(4);
const sequelizeErrors = __webpack_require__(3);
const _ = __webpack_require__(0);

class Query extends AbstractQuery {
  constructor(client, sequelize, options) {
    super();
    this.client = client;
    this.sequelize = sequelize;
    this.instance = options.instance;
    this.model = options.model;
    this.options = _.extend({
      logging: console.log,
      plain: false,
      raw: false
    }, options || {});

    this.checkLoggingOption();
  }

  /**
   * rewrite query with parameters
   * @private
   */
  static formatBindParameters(sql, values, dialect) {
    let bindParam = [];
    if (Array.isArray(values)) {
      bindParam = values;
      sql = AbstractQuery.formatBindParameters(sql, values, dialect, { skipValueReplace: true })[0];
    } else {
      let i = 0;
      const seen = {};
      const replacementFunc = (match, key, values) => {
        if (seen[key] !== undefined) {
          return seen[key];
        }
        if (values[key] !== undefined) {
          i = i + 1;
          bindParam.push(values[key]);
          seen[key] = '$'+i;
          return '$'+i;
        }
        return undefined;
      };
      sql = AbstractQuery.formatBindParameters(sql, values, dialect, replacementFunc)[0];
    }
    return [sql, bindParam];
  }

  run(sql, parameters) {
    this.sql = sql;

    if (!Utils._.isEmpty(this.options.searchPath)) {
      this.sql = this.sequelize.getQueryInterface().QueryGenerator.setSearchPath(this.options.searchPath) + sql;
    }

    const query = parameters && parameters.length
      ? new Promise((resolve, reject) => this.client.query(this.sql, parameters, (error, result) => error ? reject(error) : resolve(result)))
      : new Promise((resolve, reject) => this.client.query(this.sql, (error, result) => error ? reject(error) : resolve(result)));

    //do we need benchmark for this query execution
    const benchmark = this.sequelize.options.benchmark || this.options.benchmark;

    let queryBegin;
    if (benchmark) {
      queryBegin = Date.now();
    } else {
      this.sequelize.log('Executing (' + (this.client.uuid || 'default') + '): ' + this.sql, this.options);
    }

    debug(`executing(${this.client.uuid || 'default'}) : ${this.sql}`);

    return query.catch(err => {
      // set the client so that it will be reaped if the connection resets while executing
      if (err.code === 'ECONNRESET') {
        this.client._invalid = true;
      }

      err.sql = sql;
      throw this.formatError(err);
    })
      .then(queryResult => {
        debug(`executed(${this.client.uuid || 'default'}) : ${this.sql}`);

        if (benchmark) {
          this.sequelize.log('Executed (' + (this.client.uuid || 'default') + '): ' + this.sql, Date.now() - queryBegin, this.options);
        }

        return queryResult;
      })
      .then(queryResult => {
        const rows = queryResult.rows;
        const rowCount = queryResult.rowCount;
        const isTableNameQuery = sql.indexOf('SELECT table_name FROM information_schema.tables') === 0;
        const isRelNameQuery = sql.indexOf('SELECT relname FROM pg_class WHERE oid IN') === 0;

        if (isRelNameQuery) {
          return rows.map(row => ({
            name: row.relname,
            tableName: row.relname.split('_')[0]
          }));
        } else if (isTableNameQuery) {
          return rows.map(row => _.values(row));
        }

        if (rows[0] && rows[0].sequelize_caught_exception !== undefined) {
          if (rows[0].sequelize_caught_exception !== null) {
            throw this.formatError({
              code: '23505',
              detail: rows[0].sequelize_caught_exception
            });
          } else {
            for (const row of rows) {
              delete row.sequelize_caught_exception;
            }
          }
        }

        if (this.isShowIndexesQuery()) {
          for (const row of rows) {
            const attributes = /ON .*? (?:USING .*?\s)?\(([^]*)\)/gi.exec(row.definition)[1].split(',');

            // Map column index in table to column name
            const columns = _.zipObject(
              row.column_indexes,
              this.sequelize.getQueryInterface().QueryGenerator.fromArray(row.column_names)
            );
            delete row.column_indexes;
            delete row.column_names;

            let field;
            let attribute;

            // Indkey is the order of attributes in the index, specified by a string of attribute indexes
            row.fields = row.indkey.split(' ').map((indKey, index) => {
              field = columns[indKey];
              // for functional indices indKey = 0
              if (!field) {
                return null;
              }
              attribute = attributes[index];
              return {
                attribute: field,
                collate: attribute.match(/COLLATE "(.*?)"/) ? /COLLATE "(.*?)"/.exec(attribute)[1] : undefined,
                order: attribute.indexOf('DESC') !== -1 ? 'DESC' : attribute.indexOf('ASC') !== -1 ? 'ASC': undefined,
                length: undefined
              };
            }).filter(n => n !== null);
            delete row.columns;
          }
          return rows;
        } else if (this.isForeignKeysQuery()) {
          const result = [];
          for (const row of rows) {
            let defParts;
            if (row.condef !== undefined && (defParts = row.condef.match(/FOREIGN KEY \((.+)\) REFERENCES (.+)\((.+)\)( ON (UPDATE|DELETE) (CASCADE|RESTRICT))?( ON (UPDATE|DELETE) (CASCADE|RESTRICT))?/))) {
              row.id = row.constraint_name;
              row.table = defParts[2];
              row.from = defParts[1];
              row.to = defParts[3];
              let i;
              for (i=5;i<=8;i+=3) {
                if (/(UPDATE|DELETE)/.test(defParts[i])) {
                  row['on_'+defParts[i].toLowerCase()] = defParts[i+1];
                }
              }
            }
            result.push(row);
          }
          return result;
        } else if (this.isSelectQuery()) {
          let result = rows;
          // Postgres will treat tables as case-insensitive, so fix the case
          // of the returned values to match attributes
          if (this.options.raw === false && this.sequelize.options.quoteIdentifiers === false) {
            const attrsMap = _.reduce(this.model.rawAttributes, (m, v, k) => {
              m[k.toLowerCase()] = k;
              return m;
            }, {});
            result = _.map(rows, row=> {
              return _.mapKeys(row, (value, key)=> {
                const targetAttr = attrsMap[key];
                if (typeof targetAttr === 'string' && targetAttr !== key) {
                  return targetAttr;
                } else {
                  return key;
                }
              });
            });
          }
          return this.handleSelectQuery(result);
        } else if (QueryTypes.DESCRIBE === this.options.type) {
          const result = {};

          for (const row of rows) {
            result[row.Field] = {
              type: row.Type.toUpperCase(),
              allowNull: row.Null === 'YES',
              defaultValue: row.Default,
              special: row.special ? this.sequelize.getQueryInterface().QueryGenerator.fromArray(row.special) : [],
              primaryKey: row.Constraint === 'PRIMARY KEY'
            };

            if (result[row.Field].type === 'BOOLEAN') {
              result[row.Field].defaultValue = { 'false': false, 'true': true }[result[row.Field].defaultValue];

              if (result[row.Field].defaultValue === undefined) {
                result[row.Field].defaultValue = null;
              }
            }

            if (typeof result[row.Field].defaultValue === 'string') {
              result[row.Field].defaultValue = result[row.Field].defaultValue.replace(/'/g, '');

              if (result[row.Field].defaultValue.indexOf('::') > -1) {
                const split = result[row.Field].defaultValue.split('::');
                if (split[1].toLowerCase() !== 'regclass)') {
                  result[row.Field].defaultValue = split[0];
                }
              }
            }
          }

          return result;
        } else if (this.isVersionQuery()) {
          return rows[0].server_version;
        } else if (this.isShowOrDescribeQuery()) {
          return rows;
        } else if (QueryTypes.BULKUPDATE === this.options.type) {
          if (!this.options.returning) {
            return parseInt(rowCount, 10);
          }

          return this.handleSelectQuery(rows);
        } else if (QueryTypes.BULKDELETE === this.options.type) {
          return parseInt(rowCount, 10);
        } else if (this.isUpsertQuery()) {
          return rows[0].sequelize_upsert;
        } else if (this.isInsertQuery() || this.isUpdateQuery()) {
          if (this.instance && this.instance.dataValues) {
            for (const key in rows[0]) {
              if (rows[0].hasOwnProperty(key)) {
                const record = rows[0][key];

                const attr = _.find(this.model.rawAttributes, attribute => attribute.fieldName === key || attribute.field === key);

                this.instance.dataValues[attr && attr.fieldName || key] = record;
              }
            }
          }

          return [
            this.instance || rows && (this.options.plain && rows[0] || rows) || undefined,
            rowCount
          ];
        } else if (this.isRawQuery()) {
          return [rows, queryResult];
        } else {
          return rows;
        }
      });
  }

  formatError(err) {
    let match;
    let table;
    let index;
    let fields;
    let errors;
    let message;

    const code = err.code || err.sqlState;
    const errMessage = err.message || err.messagePrimary;
    const errDetail = err.detail || err.messageDetail;

    switch (code) {
      case '23503':
        index = errMessage.match(/violates foreign key constraint \"(.+?)\"/);
        index = index ? index[1] : undefined;
        table = errMessage.match(/on table \"(.+?)\"/);
        table = table ? table[1] : undefined;

        return new sequelizeErrors.ForeignKeyConstraintError({message: errMessage, fields: null, index, table, parent: err});
      case '23505':
        // there are multiple different formats of error messages for this error code
        // this regex should check at least two
        if (errDetail && (match = errDetail.replace(/"/g, '').match(/Key \((.*?)\)=\((.*?)\)/))) {
          fields = _.zipObject(match[1].split(', '), match[2].split(', '));
          errors = [];
          message = 'Validation error';

          _.forOwn(fields, (value, field) => {
            errors.push(new sequelizeErrors.ValidationErrorItem(
              this.getUniqueConstraintErrorMessage(field),
              'unique violation', field, value));
          });

          if (this.model && this.model.uniqueKeys) {
            _.forOwn(this.model.uniqueKeys, constraint => {
              if (_.isEqual(constraint.fields, Object.keys(fields)) && !!constraint.msg) {
                message = constraint.msg;
                return false;
              }
            });
          }

          return new sequelizeErrors.UniqueConstraintError({message, errors, parent: err, fields});
        }

        return new sequelizeErrors.UniqueConstraintError({
          message: errMessage,
          parent: err
        });

      case '23P01':
        match = errDetail.match(/Key \((.*?)\)=\((.*?)\)/);

        if (match) {
          fields = _.zipObject(match[1].split(', '), match[2].split(', '));
        }
        message = 'Exclusion constraint error';

        return new sequelizeErrors.ExclusionConstraintError({
          message,
          constraint: err.constraint,
          fields,
          table: err.table,
          parent: err
        });

      case '42704':
        if (err.sql && /CONSTRAINT/gi.test(err.sql)) {
          message = 'Unknown constraint error';

          throw new sequelizeErrors.UnknownConstraintError({
            message,
            constraint: err.constraint,
            fields,
            table: err.table,
            parent: err
          });
        }

      default:
        return new sequelizeErrors.DatabaseError(err);
    }
  }

  isForeignKeysQuery() {
    return /SELECT conname as constraint_name, pg_catalog\.pg_get_constraintdef\(r\.oid, true\) as condef FROM pg_catalog\.pg_constraint r WHERE r\.conrelid = \(SELECT oid FROM pg_class WHERE relname = '.*' LIMIT 1\) AND r\.contype = 'f' ORDER BY 1;/.test(this.sql);
  }

  getInsertIdField() {
    return 'id';
  }
}


module.exports = Query;
module.exports.Query = Query;
module.exports.default = Query;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const util = __webpack_require__(7);
const DataTypes = __webpack_require__(2);
const AbstractQueryGenerator = __webpack_require__(26);
const semver = __webpack_require__(14);
const _ = __webpack_require__(0);

const QueryGenerator = {
  __proto__: AbstractQueryGenerator,
  options: {},
  dialect: 'postgres',

  setSearchPath(searchPath) {
    return `SET search_path to ${searchPath};`;
  },

  createSchema(schema) {
    return `CREATE SCHEMA ${schema};`;
  },

  dropSchema(schema) {
    return `DROP SCHEMA IF EXISTS ${schema} CASCADE;`;
  },

  showSchemasQuery() {
    return "SELECT schema_name FROM information_schema.schemata WHERE schema_name <> 'information_schema' AND schema_name != 'public' AND schema_name !~ E'^pg_';";
  },

  versionQuery() {
    return 'SHOW SERVER_VERSION';
  },

  createTableQuery(tableName, attributes, options) {

    options = Utils._.extend({
    }, options || {});

    //Postgres 9.0 does not support CREATE TABLE IF NOT EXISTS, 9.1 and above do
    const databaseVersion = Utils._.get(this, 'sequelize.options.databaseVersion', 0);
    const attrStr = [];
    let comments = '';

    if (options.comment && Utils._.isString(options.comment)) {
      comments += '; COMMENT ON TABLE <%= table %> IS ' + this.escape(options.comment);
    }

    for (const attr in attributes) {
      const i = attributes[attr].indexOf('COMMENT');
      if (i !== -1) {
        // Move comment to a separate query
        comments += '; ' + attributes[attr].substring(i);
        attributes[attr] = attributes[attr].substring(0, i);
      }

      const dataType = this.dataTypeMapping(tableName, attr, attributes[attr]);
      attrStr.push(this.quoteIdentifier(attr) + ' ' + dataType);
    }

    const values = {
      table: this.quoteTable(tableName),
      attributes: attrStr.join(', '),
      comments: Utils._.template(comments)({ table: this.quoteTable(tableName) })
    };

    if (options.uniqueKeys) {
      Utils._.each(options.uniqueKeys, columns => {
        if (!columns.singleField) { // If it's a single field its handled in column def, not as an index
          values.attributes += ', UNIQUE (' + columns.fields.map(f => this.quoteIdentifiers(f)).join(', ') + ')';
        }
      });
    }

    const pks = _.reduce(attributes, (acc, attribute, key) => {
      if (_.includes(attribute, 'PRIMARY KEY')) {
        acc.push(this.quoteIdentifier(key));
      }
      return acc;
    }, []).join(',');

    if (pks.length > 0) {
      values.attributes += ', PRIMARY KEY (' + pks + ')';
    }

    return `CREATE TABLE ${databaseVersion === 0 || semver.gte(databaseVersion, '9.1.0') ? 'IF NOT EXISTS ' : ''}${values.table} (${values.attributes})${values.comments};`;
  },

  dropTableQuery(tableName, options) {
    options = options || {};
    return `DROP TABLE IF EXISTS ${this.quoteTable(tableName)}${options.cascade ? ' CASCADE' : ''};`;
  },

  showTablesQuery() {
    return "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type LIKE '%TABLE' AND table_name != 'spatial_ref_sys';";
  },

  describeTableQuery(tableName, schema) {
    if (!schema) {
      schema = 'public';
    }
    return 'SELECT pk.constraint_type as "Constraint", c.column_name as "Field", ' +
              'c.column_default as "Default", c.is_nullable as "Null", ' +
              '(CASE WHEN c.udt_name = \'hstore\' THEN c.udt_name ELSE c.data_type END) || (CASE WHEN c.character_maximum_length IS NOT NULL THEN \'(\' || c.character_maximum_length || \')\' ELSE \'\' END) as "Type", ' +
              '(SELECT array_agg(e.enumlabel) ' +
              'FROM pg_catalog.pg_type t JOIN pg_catalog.pg_enum e ON t.oid=e.enumtypid ' +
              'WHERE t.typname=c.udt_name) AS "special" ' +
            'FROM information_schema.columns c ' +
            'LEFT JOIN (SELECT tc.table_schema, tc.table_name, ' +
              'cu.column_name, tc.constraint_type ' +
              'FROM information_schema.TABLE_CONSTRAINTS tc ' +
              'JOIN information_schema.KEY_COLUMN_USAGE  cu ' +
              'ON tc.table_schema=cu.table_schema and tc.table_name=cu.table_name ' +
                'and tc.constraint_name=cu.constraint_name ' +
                'and tc.constraint_type=\'PRIMARY KEY\') pk ' +
            'ON pk.table_schema=c.table_schema ' +
            'AND pk.table_name=c.table_name ' +
            'AND pk.column_name=c.column_name ' +
      `WHERE c.table_name = ${this.escape(tableName)} AND c.table_schema = ${this.escape(schema)} `;
  },

  /**
   * Check whether the statmement is json function or simple path
   *
   * @param   {String}  stmt  The statement to validate
   * @returns {Boolean}       true if the given statement is json function
   * @throws  {Error}         throw if the statement looks like json function but has invalid token
   */
  checkValidJsonStatement(stmt) {
    if (!_.isString(stmt)) {
      return false;
    }

    // https://www.postgresql.org/docs/current/static/functions-json.html
    const jsonFunctionRegex = /^\s*((?:[a-z]+_){0,2}jsonb?(?:_[a-z]+){0,2})\([^)]*\)/i;
    const jsonOperatorRegex = /^\s*(->>?|#>>?|@>|<@|\?[|&]?|\|{2}|#-)/i;
    const tokenCaptureRegex = /^\s*((?:([`"'])(?:(?!\2).|\2{2})*\2)|[\w\d\s]+|[().,;+-])/i;

    let currentIndex = 0;
    let openingBrackets = 0;
    let closingBrackets = 0;
    let hasJsonFunction = false;
    let hasInvalidToken = false;

    while (currentIndex < stmt.length) {
      const string = stmt.substr(currentIndex);
      const functionMatches = jsonFunctionRegex.exec(string);
      if (functionMatches) {
        currentIndex += functionMatches[0].indexOf('(');
        hasJsonFunction = true;
        continue;
      }

      const operatorMatches = jsonOperatorRegex.exec(string);
      if (operatorMatches) {
        currentIndex += operatorMatches[0].length;
        hasJsonFunction = true;
        continue;
      }

      const tokenMatches = tokenCaptureRegex.exec(string);
      if (tokenMatches) {
        const capturedToken = tokenMatches[1];
        if (capturedToken === '(') {
          openingBrackets++;
        } else if (capturedToken === ')') {
          closingBrackets++;
        } else if (capturedToken === ';') {
          hasInvalidToken = true;
          break;
        }
        currentIndex += tokenMatches[0].length;
        continue;
      }

      break;
    }

    // Check invalid json statement
    hasInvalidToken |= openingBrackets !== closingBrackets;
    if (hasJsonFunction && hasInvalidToken) {
      throw new Error('Invalid json statement: ' + stmt);
    }

    // return true if the statement has valid json function
    return hasJsonFunction;
  },

  /**
   * Generates an SQL query that extract JSON property of given path.
   *
   * @param   {String}               column  The JSON column
   * @param   {String|Array<String>} [path]  The path to extract (optional)
   * @returns {String}                       The generated sql query
   * @private
   */
  jsonPathExtractionQuery(column, path) {
    const paths = _.toPath(path);
    const pathStr = this.escape(`{${paths.join(',')}}`);
    const quotedColumn = this.isIdentifierQuoted(column) ? column : this.quoteIdentifier(column);
    return `(${quotedColumn}#>>${pathStr})`;
  },

  handleSequelizeMethod(smth, tableName, factory, options, prepend) {
    if (smth instanceof Utils.Json) {
      // Parse nested object
      if (smth.conditions) {
        const conditions = _.map(this.parseConditionObject(smth.conditions), condition =>
          `${this.jsonPathExtractionQuery(_.first(condition.path), _.tail(condition.path))} = '${condition.value}'`
        );

        return conditions.join(' AND ');
      } else if (smth.path) {
        let str;

        // Allow specifying conditions using the postgres json syntax
        if (this.checkValidJsonStatement(smth.path)) {
          str = smth.path;
        } else {
          // Also support json property accessors
          const paths = _.toPath(smth.path);
          const column = paths.shift();
          str = this.jsonPathExtractionQuery(column, paths);
        }

        if (smth.value) {
          str += util.format(' = %s', this.escape(smth.value));
        }

        return str;
      }
    }
    return AbstractQueryGenerator.handleSequelizeMethod.call(this, smth, tableName, factory, options, prepend);
  },

  addColumnQuery(table, key, dataType) {

    const dbDataType = this.attributeToSQL(dataType, { context: 'addColumn' });
    const definition = this.dataTypeMapping(table, key, dbDataType);
    const quotedKey = this.quoteIdentifier(key);
    const quotedTable = this.quoteTable(this.extractTableDetails(table));

    let query = `ALTER TABLE ${quotedTable} ADD COLUMN ${quotedKey} ${definition};`;

    if (dataType.type && dataType.type instanceof DataTypes.ENUM || dataType instanceof DataTypes.ENUM) {
      query = this.pgEnum(table, key, dataType) + query;
    }

    return query;
  },

  removeColumnQuery(tableName, attributeName) {
    const quotedTableName = this.quoteTable(this.extractTableDetails(tableName));
    const quotedAttributeName = this.quoteIdentifier(attributeName);
    return `ALTER TABLE ${quotedTableName} DROP COLUMN ${quotedAttributeName};`;
  },

  changeColumnQuery(tableName, attributes) {
    const query = 'ALTER TABLE <%= tableName %> ALTER COLUMN <%= query %>;';
    const sql = [];

    for (const attributeName in attributes) {
      let definition = this.dataTypeMapping(tableName, attributeName, attributes[attributeName]);
      let attrSql = '';

      if (definition.indexOf('NOT NULL') > 0) {
        attrSql += Utils._.template(query)({
          tableName: this.quoteTable(tableName),
          query: this.quoteIdentifier(attributeName) + ' SET NOT NULL'
        });

        definition = definition.replace('NOT NULL', '').trim();
      } else if (!definition.match(/REFERENCES/)) {
        attrSql += Utils._.template(query)({
          tableName: this.quoteTable(tableName),
          query: this.quoteIdentifier(attributeName) + ' DROP NOT NULL'
        });
      }

      if (definition.indexOf('DEFAULT') > 0) {
        attrSql += Utils._.template(query)({
          tableName: this.quoteTable(tableName),
          query: this.quoteIdentifier(attributeName) + ' SET DEFAULT ' + definition.match(/DEFAULT ([^;]+)/)[1]
        });

        definition = definition.replace(/(DEFAULT[^;]+)/, '').trim();
      } else if (!definition.match(/REFERENCES/)) {
        attrSql += Utils._.template(query)({
          tableName: this.quoteTable(tableName),
          query: this.quoteIdentifier(attributeName) + ' DROP DEFAULT'
        });
      }

      if (attributes[attributeName].match(/^ENUM\(/)) {
        attrSql += this.pgEnum(tableName, attributeName, attributes[attributeName]);
        definition = definition.replace(/^ENUM\(.+\)/, this.pgEnumName(tableName, attributeName, { schema: false }));
        definition += ' USING (' + this.quoteIdentifier(attributeName) + '::' + this.pgEnumName(tableName, attributeName) + ')';
      }

      if (definition.match(/UNIQUE;*$/)) {
        definition = definition.replace(/UNIQUE;*$/, '');

        attrSql += Utils._.template(query.replace('ALTER COLUMN', ''))({
          tableName: this.quoteTable(tableName),
          query: 'ADD CONSTRAINT ' + this.quoteIdentifier(attributeName + '_unique_idx') + ' UNIQUE (' + this.quoteIdentifier(attributeName) + ')'
        });
      }

      if (definition.match(/REFERENCES/)) {
        definition = definition.replace(/.+?(?=REFERENCES)/, '');
        attrSql += Utils._.template(query.replace('ALTER COLUMN', ''))({
          tableName: this.quoteTable(tableName),
          query: 'ADD CONSTRAINT ' + this.quoteIdentifier(attributeName + '_foreign_idx') + ' FOREIGN KEY (' + this.quoteIdentifier(attributeName) + ') ' + definition
        });
      } else {
        attrSql += Utils._.template(query)({
          tableName: this.quoteTable(tableName),
          query: this.quoteIdentifier(attributeName) + ' TYPE ' + definition
        });
      }

      sql.push(attrSql);
    }

    return sql.join('');
  },

  renameColumnQuery(tableName, attrBefore, attributes) {

    const attrString = [];

    for (const attributeName in attributes) {
      attrString.push(Utils._.template('<%= before %> TO <%= after %>')({
        before: this.quoteIdentifier(attrBefore),
        after: this.quoteIdentifier(attributeName)
      }));
    }

    return `ALTER TABLE ${this.quoteTable(tableName)} RENAME COLUMN ${attrString.join(', ')};`;
  },

  fn(fnName, tableName, body, returns, language) {
    fnName = fnName || 'testfunc';
    language = language || 'plpgsql';
    returns = returns || 'SETOF ' + this.quoteTable(tableName);

    return `CREATE OR REPLACE FUNCTION pg_temp.${fnName}() RETURNS ${returns} AS $func$ BEGIN ${body} END; $func$ LANGUAGE ${language}; SELECT * FROM pg_temp.${fnName}();`;
  },

  exceptionFn(fnName, tableName, main, then, when, returns, language) {
    when = when || 'unique_violation';

    const body = `${main} EXCEPTION WHEN ${when} THEN ${then};`;

    return this.fn(fnName, tableName, body, returns, language);
  },

  upsertQuery(tableName, insertValues, updateValues, where, model, options) {
    const insert = this.insertQuery(tableName, insertValues, model.rawAttributes, options);
    const update = this.updateQuery(tableName, updateValues, where, options, model.rawAttributes);

    // The numbers here are selected to match the number of affected rows returned by MySQL
    return this.exceptionFn(
      'sequelize_upsert',
      tableName,
      insert + ' RETURN 1;',
      update + '; RETURN 2',
      'unique_violation',
      'integer'
    );
  },

  deleteQuery(tableName, where, options, model) {
    let query;

    options = options || {};

    tableName = this.quoteTable(tableName);

    if (options.truncate === true) {
      query = 'TRUNCATE ' + tableName;

      if (options.restartIdentity) {
        query += ' RESTART IDENTITY';
      }

      if (options.cascade) {
        query += ' CASCADE';
      }

      return query;
    }

    if (Utils._.isUndefined(options.limit)) {
      options.limit = 1;
    }

    const replacements = {
      table: tableName,
      where: this.getWhereConditions(where, null, model, options),
      limit: options.limit ? ' LIMIT ' + this.escape(options.limit) : ''
    };

    if (options.limit) {
      if (!model) {
        throw new Error('Cannot LIMIT delete without a model.');
      }

      const pks = _.map(_.values(model.primaryKeys), pk => this.quoteIdentifier(pk.field)).join(',');

      replacements.primaryKeys = model.primaryKeyAttributes.length > 1 ? '(' + pks + ')' : pks;
      replacements.primaryKeysSelection = pks;

      query = 'DELETE FROM <%= table %> WHERE <%= primaryKeys %> IN (SELECT <%= primaryKeysSelection %> FROM <%= table %><%= where %><%= limit %>)';
    } else {
      query = 'DELETE FROM <%= table %><%= where %>';
    }

    if (replacements.where) {
      replacements.where = ' WHERE ' + replacements.where;
    }

    return Utils._.template(query)(replacements);
  },

  showIndexesQuery(tableName) {
    let schemaJoin = '';
    let schemaWhere = '';
    if (!Utils._.isString(tableName)) {
      schemaJoin = ', pg_namespace s';
      schemaWhere = ` AND s.oid = t.relnamespace AND s.nspname = '${tableName.schema}'`;
      tableName = tableName.tableName;
    }

    // This is ARCANE!
    return 'SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, ' +
      'array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) ' +
      `AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a${schemaJoin} ` +
      'WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND ' +
      `t.relkind = 'r' and t.relname = '${tableName}'${schemaWhere} ` +
      'GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;';
  },

  showConstraintsQuery(tableName) {
    //Postgres converts camelCased alias to lowercase unless quoted
    return [
      'SELECT constraint_catalog AS "constraintCatalog",',
      'constraint_schema AS "constraintSchema",',
      'constraint_name AS "constraintName",',
      'table_catalog AS "tableCatalog",',
      'table_schema AS "tableSchema",',
      'table_name AS "tableName",',
      'constraint_type AS "constraintType",',
      'is_deferrable AS "isDeferrable",',
      'initially_deferred AS "initiallyDeferred"',
      'from INFORMATION_SCHEMA.table_constraints',
      `WHERE table_name='${tableName}';`
    ].join(' ');
  },

  removeIndexQuery(tableName, indexNameOrAttributes) {
    let indexName = indexNameOrAttributes;

    if (typeof indexName !== 'string') {
      indexName = Utils.underscore(tableName + '_' + indexNameOrAttributes.join('_'));
    }

    return `DROP INDEX IF EXISTS ${this.quoteIdentifiers(indexName)}`;
  },

  addLimitAndOffset(options) {
    let fragment = '';
    /* eslint-disable */
    if (options.limit != null) {
      fragment += ' LIMIT ' + this.escape(options.limit);
    }
    if (options.offset != null) {
      fragment += ' OFFSET ' + this.escape(options.offset);
    }
    /* eslint-enable */

    return fragment;
  },

  attributeToSQL(attribute) {
    if (!Utils._.isPlainObject(attribute)) {
      attribute = {
        type: attribute
      };
    }

    let type;
    if (attribute.type instanceof DataTypes.ENUM) {
      if (attribute.type.values && !attribute.values) attribute.values = attribute.type.values;

      if (Array.isArray(attribute.values) && attribute.values.length > 0) {
        type = 'ENUM(' + Utils._.map(attribute.values, value => this.escape(value)).join(', ') + ')';
      } else {
        throw new Error("Values for ENUM haven't been defined.");
      }
    }

    if (!type) {
      type = attribute.type;
    }

    let sql = type + '';

    if (attribute.hasOwnProperty('allowNull') && !attribute.allowNull) {
      sql += ' NOT NULL';
    }

    if (attribute.autoIncrement) {
      sql += ' SERIAL';
    }

    if (Utils.defaultValueSchemable(attribute.defaultValue)) {
      sql += ' DEFAULT ' + this.escape(attribute.defaultValue, attribute);
    }

    if (attribute.unique === true) {
      sql += ' UNIQUE';
    }

    if (attribute.primaryKey) {
      sql += ' PRIMARY KEY';
    }

    if (attribute.references) {
      const referencesTable = this.quoteTable(attribute.references.model);
      let referencesKey;

      if (attribute.references.key) {
        referencesKey = this.quoteIdentifiers(attribute.references.key);
      } else {
        referencesKey = this.quoteIdentifier('id');
      }

      sql += ` REFERENCES ${referencesTable} (${referencesKey})`;

      if (attribute.onDelete) {
        sql += ' ON DELETE ' + attribute.onDelete.toUpperCase();
      }

      if (attribute.onUpdate) {
        sql += ' ON UPDATE ' + attribute.onUpdate.toUpperCase();
      }

      if (attribute.references.deferrable) {
        sql += ' ' + attribute.references.deferrable.toString(this);
      }
    }

    return sql;
  },

  deferConstraintsQuery(options) {
    return options.deferrable.toString(this);
  },

  setConstraintQuery(columns, type) {
    let columnFragment = 'ALL';

    if (columns) {
      columnFragment = columns.map(column => this.quoteIdentifier(column)).join(', ');
    }

    return 'SET CONSTRAINTS ' + columnFragment + ' ' + type;
  },

  setDeferredQuery(columns) {
    return this.setConstraintQuery(columns, 'DEFERRED');
  },

  setImmediateQuery(columns) {
    return this.setConstraintQuery(columns, 'IMMEDIATE');
  },

  attributesToSQL(attributes, options) {
    const result = {};

    for (const key in attributes) {
      const attribute = attributes[key];
      result[attribute.field || key] = this.attributeToSQL(attribute, options);
    }

    return result;
  },

  createTrigger(tableName, triggerName, eventType, fireOnSpec, functionName, functionParams, optionsArray) {

    const decodedEventType = this.decodeTriggerEventType(eventType);
    const eventSpec = this.expandTriggerEventSpec(fireOnSpec);
    const expandedOptions = this.expandOptions(optionsArray);
    const paramList = this.expandFunctionParamList(functionParams);

    return `CREATE ${this.triggerEventTypeIsConstraint(eventType)}TRIGGER ${triggerName}\n`
      + `\t${decodedEventType} ${eventSpec}\n`
      + `\tON ${tableName}\n`
      + `\t${expandedOptions}\n`
      + `\tEXECUTE PROCEDURE ${functionName}(${paramList});`;
  },

  dropTrigger(tableName, triggerName) {
    return `DROP TRIGGER ${triggerName} ON ${tableName} RESTRICT;`;
  },

  renameTrigger(tableName, oldTriggerName, newTriggerName) {
    return `ALTER TRIGGER ${oldTriggerName} ON ${tableName} RENAME TO ${newTriggerName};`;
  },

  createFunction(functionName, params, returnType, language, body, options) {
    if (!functionName || !returnType || !language || !body) throw new Error('createFunction missing some parameters. Did you pass functionName, returnType, language and body?');

    const paramList = this.expandFunctionParamList(params);
    const indentedBody = body.replace('\n', '\n\t');
    const expandedOptions = this.expandOptions(options);

    return `CREATE FUNCTION ${functionName}(${paramList})\n`
      + `RETURNS ${returnType} AS $func$\n`
      + 'BEGIN\n'
      + `\t${indentedBody}\n`
      + 'END;\n'
      + `$func$ language '${language}'${expandedOptions};`;
  },

  dropFunction(functionName, params) {
    if (!functionName) throw new Error('requires functionName');
    // RESTRICT is (currently, as of 9.2) default but we'll be explicit
    const paramList = this.expandFunctionParamList(params);
    return `DROP FUNCTION ${functionName}(${paramList}) RESTRICT;`;
  },

  renameFunction(oldFunctionName, params, newFunctionName) {
    const paramList = this.expandFunctionParamList(params);
    return `ALTER FUNCTION ${oldFunctionName}(${paramList}) RENAME TO ${newFunctionName};`;
  },

  databaseConnectionUri(config) {
    let uri = config.protocol + '://' + config.user + ':' + config.password + '@' + config.host;
    if (config.port) {
      uri += ':' + config.port;
    }
    uri += '/' + config.database;
    if (config.ssl) {
      uri += '?ssl=' + config.ssl;
    }
    return uri;
  },

  pgEscapeAndQuote(val) {
    return this.quoteIdentifier(Utils.removeTicks(this.escape(val), "'"));
  },

  expandFunctionParamList(params) {
    if (Utils._.isUndefined(params) || !Utils._.isArray(params)) {
      throw new Error('expandFunctionParamList: function parameters array required, including an empty one for no arguments');
    }

    const paramList = [];
    Utils._.each(params, curParam => {
      const paramDef = [];
      if (Utils._.has(curParam, 'type')) {
        if (Utils._.has(curParam, 'direction')) { paramDef.push(curParam.direction); }
        if (Utils._.has(curParam, 'name')) { paramDef.push(curParam.name); }
        paramDef.push(curParam.type);
      } else {
        throw new Error('function or trigger used with a parameter without any type');
      }

      const joined = paramDef.join(' ');
      if (joined) paramList.push(joined);

    });

    return paramList.join(', ');
  },

  expandOptions(options) {
    return Utils._.isUndefined(options) || Utils._.isEmpty(options) ?
      '' : '\n\t' + options.join('\n\t');
  },

  decodeTriggerEventType(eventSpecifier) {
    const EVENT_DECODER = {
      'after': 'AFTER',
      'before': 'BEFORE',
      'instead_of': 'INSTEAD OF',
      'after_constraint': 'AFTER'
    };

    if (!Utils._.has(EVENT_DECODER, eventSpecifier)) {
      throw new Error('Invalid trigger event specified: ' + eventSpecifier);
    }

    return EVENT_DECODER[eventSpecifier];
  },

  triggerEventTypeIsConstraint(eventSpecifier) {
    return eventSpecifier === 'after_constraint' ? 'CONSTRAINT ' : '';
  },

  expandTriggerEventSpec(fireOnSpec) {
    if (Utils._.isEmpty(fireOnSpec)) {
      throw new Error('no table change events specified to trigger on');
    }

    return Utils._.map(fireOnSpec, (fireValue, fireKey) => {
      const EVENT_MAP = {
        'insert': 'INSERT',
        'update': 'UPDATE',
        'delete': 'DELETE',
        'truncate': 'TRUNCATE'
      };

      if (!Utils._.has(EVENT_MAP, fireKey)) {
        throw new Error('parseTriggerEventSpec: undefined trigger event ' + fireKey);
      }

      let eventSpec = EVENT_MAP[fireKey];
      if (eventSpec === 'UPDATE') {
        if (Utils._.isArray(fireValue) && fireValue.length > 0) {
          eventSpec += ' OF ' + fireValue.join(', ');
        }
      }

      return eventSpec;
    }).join(' OR ');
  },

  pgEnumName(tableName, attr, options) {
    options = options || {};
    const tableDetails = this.extractTableDetails(tableName, options);
    let enumName = '"enum_' + tableDetails.tableName + '_' + attr + '"';

    // pgListEnums requires the enum name only, without the schema
    if (options.schema !== false && tableDetails.schema) {
      enumName = this.quoteIdentifier(tableDetails.schema) + tableDetails.delimiter + enumName;
    }

    return enumName;

  },

  pgListEnums(tableName, attrName, options) {
    let enumName = '';
    const tableDetails = this.extractTableDetails(tableName, options);

    if (tableDetails.tableName && attrName) {
      enumName = ' AND t.typname=' + this.pgEnumName(tableDetails.tableName, attrName, { schema: false }).replace(/"/g, "'");
    }

    return 'SELECT t.typname enum_name, array_agg(e.enumlabel ORDER BY enumsortorder) enum_value FROM pg_type t ' +
      'JOIN pg_enum e ON t.oid = e.enumtypid ' +
      'JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace ' +
      `WHERE n.nspname = '${tableDetails.schema}'${enumName} GROUP BY 1`;
  },

  pgEnum(tableName, attr, dataType, options) {
    const enumName = this.pgEnumName(tableName, attr, options);
    let values;

    if (dataType.values) {
      values = "ENUM('" + dataType.values.join("', '") + "')";
    } else {
      values = dataType.toString().match(/^ENUM\(.+\)/)[0];
    }

    let sql = 'CREATE TYPE ' + enumName + ' AS ' + values + ';';
    if (!!options && options.force === true) {
      sql = this.pgEnumDrop(tableName, attr) + sql;
    }
    return sql;
  },

  pgEnumAdd(tableName, attr, value, options) {
    const enumName = this.pgEnumName(tableName, attr);
    let sql = 'ALTER TYPE ' + enumName + ' ADD VALUE ';

    if (semver.gte(this.sequelize.options.databaseVersion, '9.3.0')) {
      sql += 'IF NOT EXISTS ';
    }
    sql += this.escape(value);

    if (options.before) {
      sql += ' BEFORE ' + this.escape(options.before);
    } else if (options.after) {
      sql += ' AFTER ' + this.escape(options.after);
    }

    return sql;
  },

  pgEnumDrop(tableName, attr, enumName) {
    enumName = enumName || this.pgEnumName(tableName, attr);
    return 'DROP TYPE IF EXISTS ' + enumName + '; ';
  },

  fromArray(text) {
    text = text.replace(/^{/, '').replace(/}$/, '');
    let matches = text.match(/("(?:\\.|[^"\\\\])*"|[^,]*)(?:\s*,\s*|\s*$)/ig);

    if (matches.length < 1) {
      return [];
    }

    matches = matches.map(m => m.replace(/",$/, '').replace(/,$/, '').replace(/(^"|"$)/, ''));

    return matches.slice(0, -1);
  },

  padInt(i) {
    return i < 10 ? '0' + i.toString() : i.toString();
  },

  dataTypeMapping(tableName, attr, dataType) {
    if (Utils._.includes(dataType, 'PRIMARY KEY')) {
      dataType = dataType.replace(/PRIMARY KEY/, '');
    }

    if (Utils._.includes(dataType, 'SERIAL')) {
      if (Utils._.includes(dataType, 'BIGINT')) {
        dataType = dataType.replace(/SERIAL/, 'BIGSERIAL');
        dataType = dataType.replace(/BIGINT/, '');
      } else {
        dataType = dataType.replace(/INTEGER/, '');
      }
      dataType = dataType.replace(/NOT NULL/, '');
    }

    if (dataType.match(/^ENUM\(/)) {
      dataType = dataType.replace(/^ENUM\(.+\)/, this.pgEnumName(tableName, attr));
    }

    return dataType;
  },

  quoteIdentifier(identifier, force) {
    if (identifier === '*') return identifier;
    if (!force && this.options && this.options.quoteIdentifiers === false && identifier.indexOf('.') === -1 && identifier.indexOf('->') === -1) { // default is `true`
      // In Postgres, if tables or attributes are created double-quoted,
      // they are also case sensitive. If they contain any uppercase
      // characters, they must always be double-quoted. This makes it
      // impossible to write queries in portable SQL if tables are created in
      // this way. Hence, we strip quotes if we don't want case sensitivity.
      return Utils.removeTicks(identifier, '"');
    } else {
      return Utils.addTicks(Utils.removeTicks(identifier, '"'), '"');
    }
  },

  /**
   * Generates an SQL query that returns all foreign keys of a table.
   *
   * @param  {String} tableName  The name of the table.
   * @return {String}            The generated sql query.
   * @private
   */
  getForeignKeysQuery(tableName) {
    return 'SELECT conname as constraint_name, pg_catalog.pg_get_constraintdef(r.oid, true) as condef FROM pg_catalog.pg_constraint r ' +
      `WHERE r.conrelid = (SELECT oid FROM pg_class WHERE relname = '${tableName}' LIMIT 1) AND r.contype = 'f' ORDER BY 1;`;
  },

  /**
   * Generates an SQL query that removes a foreign key from a table.
   *
   * @param  {String} tableName  The name of the table.
   * @param  {String} foreignKey The name of the foreign key constraint.
   * @return {String}            The generated sql query.
   * @private
   */
  dropForeignKeyQuery(tableName, foreignKey) {
    return 'ALTER TABLE ' + this.quoteTable(tableName) + ' DROP CONSTRAINT ' + this.quoteIdentifier(foreignKey) + ';';
  },

  setAutocommitQuery(value, options) {
    if (options.parent) {
      return;
    }

    // POSTGRES does not support setting AUTOCOMMIT = OFF as of 9.4.0
    // Additionally it does not support AUTOCOMMIT at all starting at v9.5
    // The assumption is that it won't be returning in future versions either
    // If you are on a Pg version that is not semver compliant e.g. '9.5.0beta2', which fails due to the 'beta' qualification, then you need to pass
    // the database version as "9.5.0" explicitly through the options param passed when creating the Sequelize instance under the key "databaseVersion"
    // otherwise Pg version "9.4.0" is assumed by default as per Sequelize 3.14.2.
    // For Pg versions that are semver compliant, this is auto-detected upon the first connection.
    if (!value || semver.gte(this.sequelize.options.databaseVersion, '9.4.0')) {
      return;
    }

    return AbstractQueryGenerator.setAutocommitQuery.call(this, value, options);
  }
};

module.exports = QueryGenerator;


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _ = __webpack_require__(0);
const AbstractDialect = __webpack_require__(22);
const ConnectionManager = __webpack_require__(101);
const Query = __webpack_require__(104);
const QueryGenerator = __webpack_require__(105);
const DataTypes = __webpack_require__(2).sqlite;

class SqliteDialect extends AbstractDialect {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.connectionManager = new ConnectionManager(this, sequelize);
    this.QueryGenerator = _.extend({}, QueryGenerator, {
      options: sequelize.options,
      _dialect: this,
      sequelize
    });
  }
}

SqliteDialect.prototype.supports = _.merge(_.cloneDeep(AbstractDialect.prototype.supports), {
  'DEFAULT': false,
  'DEFAULT VALUES': true,
  'UNION ALL': false,
  'IGNORE': ' OR IGNORE',
  index: {
    using: false
  },
  transactionOptions: {
    type: true,
    autocommit: false
  },
  constraints: {
    addConstraint: false,
    dropConstraint: false
  },
  joinTableDependent: false,
  groupedLimit: false,
  ignoreDuplicates: ' OR IGNORE',
  JSON: true
});

ConnectionManager.prototype.defaultVersion = '3.8.0';
SqliteDialect.prototype.Query = Query;
SqliteDialect.prototype.DataTypes = DataTypes;
SqliteDialect.prototype.name = 'sqlite';
SqliteDialect.prototype.TICK_CHAR = '`';
SqliteDialect.prototype.TICK_CHAR_LEFT = SqliteDialect.prototype.TICK_CHAR;
SqliteDialect.prototype.TICK_CHAR_RIGHT = SqliteDialect.prototype.TICK_CHAR;

module.exports = SqliteDialect;
module.exports.SqliteDialect = SqliteDialect;
module.exports.default = SqliteDialect;


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractConnectionManager = __webpack_require__(23);
const Promise = __webpack_require__(4);
const Utils = __webpack_require__(1);
const debug = Utils.getLogger().debugContext('connection:sqlite');
const dataTypes = __webpack_require__(2).sqlite;
const sequelizeErrors = __webpack_require__(3);
const parserStore = __webpack_require__(24)('sqlite');

class ConnectionManager extends AbstractConnectionManager {
  constructor(dialect, sequelize) {
    super(dialect, sequelize);
    this.sequelize = sequelize;
    this.config = sequelize.config;
    this.dialect = dialect;
    this.dialectName = this.sequelize.options.dialect;
    this.connections = {};

    // We attempt to parse file location from a connection uri but we shouldn't match sequelize default host.
    if (this.sequelize.options.host === 'localhost') delete this.sequelize.options.host;

    try {
      if (sequelize.config.dialectModulePath) {
        this.lib = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()).verbose();
      } else {
        this.lib = __webpack_require__(103).verbose();
      }
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        throw new Error('Please install sqlite3 package manually');
      }
      throw err;
    }

    this.refreshTypeParser(dataTypes);
  }

  // Expose this as a method so that the parsing may be updated when the user has added additional, custom types
  _refreshTypeParser(dataType) {
    parserStore.refresh(dataType);
  }

  _clearTypeParser() {
    parserStore.clear();
  }

  getConnection(options) {
    options = options || {};
    options.uuid = options.uuid || 'default';
    options.inMemory = (this.sequelize.options.storage || this.sequelize.options.host || ':memory:') === ':memory:' ? 1 : 0;

    const dialectOptions = this.sequelize.options.dialectOptions;
    options.readWriteMode = dialectOptions && dialectOptions.mode;

    if (this.connections[options.inMemory || options.uuid]) {
      return Promise.resolve(this.connections[options.inMemory || options.uuid]);
    }

    return new Promise((resolve, reject) => {
      this.connections[options.inMemory || options.uuid] = new this.lib.Database(
        this.sequelize.options.storage || this.sequelize.options.host || ':memory:',
        options.readWriteMode || this.lib.OPEN_READWRITE | this.lib.OPEN_CREATE, // default mode
        err => {
          if (err) {
            if (err.code === 'SQLITE_CANTOPEN') return reject(new sequelizeErrors.ConnectionError(err));
            return reject(new sequelizeErrors.ConnectionError(err));
          }
          debug(`connection acquired ${options.uuid}`);
          resolve(this.connections[options.inMemory || options.uuid]);
        }
      );
    }).tap(connection => {
      if (this.sequelize.config.password) {
        // Make it possible to define and use password for sqlite encryption plugin like sqlcipher
        connection.run('PRAGMA KEY=' + this.sequelize.escape(this.sequelize.config.password));
      }
      if (this.sequelize.options.foreignKeys !== false) {
        // Make it possible to define and use foreign key constraints unless
        // explicitly disallowed. It's still opt-in per relation
        connection.run('PRAGMA FOREIGN_KEYS=ON');
      }
    });
  }

  releaseConnection(connection, force) {
    if (connection.filename === ':memory:' && force !== true) return;

    if (connection.uuid) {
      connection.close();
      debug(`connection released ${connection.uuid}`);
      delete this.connections[connection.uuid];
    }
  }
}


module.exports = ConnectionManager;
module.exports.ConnectionManager = ConnectionManager;
module.exports.default = ConnectionManager;


/***/ }),
/* 102 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 102;

/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports = require("sqlite3");

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _ = __webpack_require__(0);
const Utils = __webpack_require__(1);
const debug = Utils.getLogger().debugContext('sql:sqlite');
const Promise = __webpack_require__(4);
const AbstractQuery = __webpack_require__(25);
const QueryTypes = __webpack_require__(9);
const sequelizeErrors = __webpack_require__(3);
const parserStore = __webpack_require__(24)('sqlite');

class Query extends AbstractQuery {

  constructor(database, sequelize, options) {
    super();
    this.database = database;
    this.sequelize = sequelize;
    this.instance = options.instance;
    this.model = options.model;
    this.options = _.extend({
      logging: console.log,
      plain: false,
      raw: false
    }, options || {});

    this.checkLoggingOption();
  }

  getInsertIdField() {
    return 'lastID';
  }

  /**
   * rewrite query with parameters
   * @private
   */
  static formatBindParameters(sql, values, dialect) {
    let bindParam;
    if (Array.isArray(values)) {
      bindParam = {};
      values.forEach((v, i) => {
        bindParam['$'+(i+1)] = v;
      });
      sql = AbstractQuery.formatBindParameters(sql, values, dialect, { skipValueReplace: true })[0];
    } else {
      bindParam = {};
      if (typeof values === 'object') {
        for (const k of Object.keys(values)) {
          bindParam['$'+k] = values[k];
        }
      }
      sql = AbstractQuery.formatBindParameters(sql, values, dialect, { skipValueReplace: true })[0];
    }
    return [sql, bindParam];
  }

  _collectModels(include, prefix) {
    const ret = {};

    if (include) {
      for (const _include of include) {
        let key;
        if (!prefix) {
          key = _include.as;
        } else {
          key = prefix + '.' + _include.as;
        }
        ret[key] = _include.model;

        if (_include.include) {
          _.merge(ret, this._collectModels(_include.include, key));
        }
      }
    }

    return ret;
  }

  run(sql, parameters) {
    this.sql = sql;
    const method = this.getDatabaseMethod();
    if (method === 'exec') {
      // exec does not support bind parameter
      sql = AbstractQuery.formatBindParameters(sql, this.options.bind, this.options.dialect, { skipUnescape: true })[0];
      this.sql = sql;
    }

    //do we need benchmark for this query execution
    const benchmark = this.sequelize.options.benchmark || this.options.benchmark;

    let queryBegin;
    if (benchmark) {
      queryBegin = Date.now();
    } else {
      this.sequelize.log('Executing (' + (this.database.uuid || 'default') + '): ' + this.sql, this.options);
    }

    debug(`executing(${this.database.uuid || 'default'}) : ${this.sql}`);

    return new Promise(resolve => {
      const columnTypes = {};
      this.database.serialize(() => {
        const executeSql = () => {
          if (this.sql.indexOf('-- ') === 0) {
            return resolve();
          } else {
            resolve(new Promise((resolve, reject) => {
              const query = this;
              // cannot use arrow function here because the function is bound to the statement
              function afterExecute(err, results) {
                debug(`executed(${query.database.uuid || 'default'}) : ${query.sql}`);

                if (benchmark) {
                  query.sequelize.log('Executed (' + (query.database.uuid || 'default') + '): ' + query.sql, Date.now() - queryBegin, query.options);
                }

                if (err) {
                  err.sql = query.sql;
                  reject(query.formatError(err));
                } else {
                  const metaData = this;
                  let result = query.instance;

                  // add the inserted row id to the instance
                  if (query.isInsertQuery(results, metaData)) {
                    query.handleInsertQuery(results, metaData);
                    if (!query.instance) {
                      // handle bulkCreate AI primary key
                      if (
                        metaData.constructor.name === 'Statement'
                        && query.model
                        && query.model.autoIncrementAttribute
                        && query.model.autoIncrementAttribute === query.model.primaryKeyAttribute
                        && query.model.rawAttributes[query.model.primaryKeyAttribute]
                      ) {
                        const startId = metaData[query.getInsertIdField()] - metaData.changes + 1;
                        result = [];
                        for (let i = startId; i < startId + metaData.changes; i++) {
                          result.push({ [query.model.rawAttributes[query.model.primaryKeyAttribute].field]: i });
                        }
                      } else {
                        result = metaData[query.getInsertIdField()];
                      }
                    }
                  }

                  if (query.sql.indexOf('sqlite_master') !== -1) {
                    if (query.sql.indexOf('SELECT sql FROM sqlite_master WHERE tbl_name') !== -1) {
                      result = results;
                      if (result && result[0] && result[0].sql.indexOf('CONSTRAINT') !== -1) {
                        result = query.parseConstraintsFromSql(results[0].sql);
                      }
                    } else {
                      result = results.map(resultSet => resultSet.name);
                    }
                  } else if (query.isSelectQuery()) {
                    if (!query.options.raw) {
                      // This is a map of prefix strings to models, e.g. user.projects -> Project model
                      const prefixes = query._collectModels(query.options.include);

                      results = results.map(result => {
                        return _.mapValues(result, (value, name) => {
                          let model;
                          if (name.indexOf('.') !== -1) {
                            const lastind = name.lastIndexOf('.');

                            model = prefixes[name.substr(0, lastind)];

                            name = name.substr(lastind + 1);
                          } else {
                            model = query.options.model;
                          }

                          const tableName = model.getTableName().toString().replace(/`/g, '');
                          const tableTypes = columnTypes[tableName] || {};

                          if (tableTypes && !(name in tableTypes)) {
                            // The column is aliased
                            _.forOwn(model.rawAttributes, (attribute, key) => {
                              if (name === key && attribute.field) {
                                name = attribute.field;
                                return false;
                              }
                            });
                          }

                          return tableTypes[name]
                            ? query.applyParsers(tableTypes[name], value)
                            : value;
                        });
                      });
                    }

                    result = query.handleSelectQuery(results);
                  } else if (query.isShowOrDescribeQuery()) {
                    result = results;
                  } else if (query.sql.indexOf('PRAGMA INDEX_LIST') !== -1) {
                    result = query.handleShowIndexesQuery(results);
                  } else if (query.sql.indexOf('PRAGMA INDEX_INFO') !== -1) {
                    result = results;
                  } else if (query.sql.indexOf('PRAGMA TABLE_INFO') !== -1) {
                    // this is the sqlite way of getting the metadata of a table
                    result = {};

                    let defaultValue;
                    for (const _result of results) {
                      if (_result.dflt_value === null) {
                        // Column schema omits any "DEFAULT ..."
                        defaultValue = undefined;
                      } else if (_result.dflt_value === 'NULL') {
                        // Column schema is a "DEFAULT NULL"
                        defaultValue = null;
                      } else {
                        defaultValue = _result.dflt_value;
                      }

                      result[_result.name] = {
                        type: _result.type,
                        allowNull: _result.notnull === 0,
                        defaultValue,
                        primaryKey: _result.pk !== 0
                      };

                      if (result[_result.name].type === 'TINYINT(1)') {
                        result[_result.name].defaultValue = { '0': false, '1': true }[result[_result.name].defaultValue];
                      }

                      if (typeof result[_result.name].defaultValue === 'string') {
                        result[_result.name].defaultValue = result[_result.name].defaultValue.replace(/'/g, '');
                      }
                    }
                  } else if (query.sql.indexOf('PRAGMA foreign_keys;') !== -1) {
                    result = results[0];
                  } else if (query.sql.indexOf('PRAGMA foreign_keys') !== -1) {
                    result = results;
                  } else if (query.sql.indexOf('PRAGMA foreign_key_list') !== -1) {
                    result = results;
                  } else if ([QueryTypes.BULKUPDATE, QueryTypes.BULKDELETE].indexOf(query.options.type) !== -1) {
                    result = metaData.changes;
                  } else if (query.options.type === QueryTypes.UPSERT) {
                    result = undefined;
                  } else if (query.options.type === QueryTypes.VERSION) {
                    result = results[0].version;
                  } else if (query.options.type === QueryTypes.RAW) {
                    result = [results, metaData];
                  } else if (query.isUpdateQuery() || query.isInsertQuery()) {
                    result = [result, metaData.changes];
                  }

                  resolve(result);
                }
              }

              if (method === 'exec') {
                // exec does not support bind parameter
                this.database[method](this.sql, afterExecute);
              } else {
                if (!parameters) parameters = [];
                this.database[method](this.sql, parameters, afterExecute);
              }
            }));
            return null;
          }
        };

        if (this.getDatabaseMethod() === 'all') {
          let tableNames = [];
          if (this.options && this.options.tableNames) {
            tableNames = this.options.tableNames;
          } else if (/FROM `(.*?)`/i.exec(this.sql)) {
            tableNames.push(/FROM `(.*?)`/i.exec(this.sql)[1]);
          }

          // If we already have the metadata for the table, there's no need to ask for it again
          tableNames = _.filter(tableNames, tableName => !(tableName in columnTypes) && tableName !== 'sqlite_master');

          if (!tableNames.length) {
            return executeSql();
          } else {
            return Promise.map(tableNames, tableName =>
              new Promise(resolve => {
                tableName = tableName.replace(/`/g, '');
                columnTypes[tableName] = {};

                this.database.all('PRAGMA table_info(`' + tableName + '`)', (err, results) => {
                  if (!err) {
                    for (const result of results) {
                      columnTypes[tableName][result.name] = result.type;
                    }
                  }
                  resolve();
                });
              })
            ).then(executeSql);
          }
        } else {
          return executeSql();
        }
      });
    });
  }

  parseConstraintsFromSql(sql) {
    let constraints = sql.split('CONSTRAINT ');
    let referenceTableName, referenceTableKeys, updateAction, deleteAction;
    constraints.splice(0, 1);
    constraints = constraints.map(constraintSql => {
      //Parse foreign key snippets
      if (constraintSql.indexOf('REFERENCES') !== -1) {
        //Parse out the constraint condition form sql string
        updateAction = constraintSql.match(/ON UPDATE (CASCADE|SET NULL|RESTRICT|NO ACTION|SET DEFAULT){1}/);
        deleteAction = constraintSql.match(/ON DELETE (CASCADE|SET NULL|RESTRICT|NO ACTION|SET DEFAULT){1}/);

        if (updateAction) {
          updateAction = updateAction[1];
        }

        if (deleteAction) {
          deleteAction = deleteAction[1];
        }

        const referencesRegex = /REFERENCES.+\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/;
        const referenceConditions = constraintSql.match(referencesRegex)[0].split(' ');
        referenceTableName = Utils.removeTicks(referenceConditions[1]);
        let columnNames = referenceConditions[2];
        columnNames = columnNames.replace(/\(|\)/g, '').split(', ');
        referenceTableKeys = columnNames.map(column => Utils.removeTicks(column));
      }

      const constraintCondition = constraintSql.match(/\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/)[0];
      constraintSql = constraintSql.replace(/\(.+\)/, '');
      const constraint = constraintSql.split(' ');

      if (constraint[1] === 'PRIMARY' || constraint[1] === 'FOREIGN') {
        constraint[1]+= ' KEY';
      }

      return {
        constraintName: Utils.removeTicks(constraint[0]),
        constraintType: constraint[1],
        updateAction,
        deleteAction,
        sql: sql.replace(/\"/g, '\`'), //Sqlite returns double quotes for table name
        constraintCondition,
        referenceTableName,
        referenceTableKeys
      };
    });

    return constraints;
  }

  applyParsers(type, value) {
    if (type.indexOf('(') !== -1) {
      // Remove the length part
      type = type.substr(0, type.indexOf('('));
    }
    type = type.replace('UNSIGNED', '').replace('ZEROFILL', '');
    type = type.trim().toUpperCase();
    const parse = parserStore.get(type);

    if (value !== null && parse) {
      return parse(value, { timezone: this.sequelize.options.timezone });
    }
    return value;
  }

  formatError(err) {

    switch (err.code) {
      case 'SQLITE_CONSTRAINT': {
        let match = err.message.match(/FOREIGN KEY constraint failed/);
        if (match !== null) {
          return new sequelizeErrors.ForeignKeyConstraintError({
            parent :err
          });
        }

        let fields = [];

        // Sqlite pre 2.2 behavior - Error: SQLITE_CONSTRAINT: columns x, y are not unique
        match = err.message.match(/columns (.*?) are/);
        if (match !== null && match.length >= 2) {
          fields = match[1].split(', ');
        } else {

          // Sqlite post 2.2 behavior - Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: table.x, table.y
          match = err.message.match(/UNIQUE constraint failed: (.*)/);
          if (match !== null && match.length >= 2) {
            fields = match[1].split(', ').map(columnWithTable => columnWithTable.split('.')[1]);
          }
        }

        const errors = [];
        let message = 'Validation error';

        for (const field of fields) {
          errors.push(new sequelizeErrors.ValidationErrorItem(
            this.getUniqueConstraintErrorMessage(field),
            'unique violation', field, this.instance && this.instance[field]));
        }

        if (this.model) {
          _.forOwn(this.model.uniqueKeys, constraint => {
            if (_.isEqual(constraint.fields, fields) && !!constraint.msg) {
              message = constraint.msg;
              return false;
            }
          });
        }

        return new sequelizeErrors.UniqueConstraintError({message, errors, parent: err, fields});
      }
      case 'SQLITE_BUSY':
        return new sequelizeErrors.TimeoutError(err);

      default:
        return new sequelizeErrors.DatabaseError(err);
    }
  }

  handleShowIndexesQuery(data) {

    // Sqlite returns indexes so the one that was defined last is returned first. Lets reverse that!
    return this.sequelize.Promise.map(data.reverse(), item => {
      item.fields = [];
      item.primary = false;
      item.unique = !!item.unique;
      item.constraintName = item.name;
      return this.run('PRAGMA INDEX_INFO(`' + item.name + '`)').then(columns => {
        for (const column of columns) {
          item.fields[column.seqno] = {
            attribute: column.name,
            length: undefined,
            order: undefined
          };
        }

        return item;
      });
    });
  }

  getDatabaseMethod() {
    if (this.isUpsertQuery()) {
      return 'exec'; // Needed to run multiple queries in one
    } else if (this.isInsertQuery() || this.isUpdateQuery() || this.isBulkUpdateQuery() || this.sql.toLowerCase().indexOf('CREATE TEMPORARY TABLE'.toLowerCase()) !== -1 || this.options.type === QueryTypes.BULKDELETE) {
      return 'run';
    } else {
      return 'all';
    }
  }
}

module.exports = Query;
module.exports.Query = Query;
module.exports.default = Query;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = __webpack_require__(1);
const util = __webpack_require__(7);
const Transaction = __webpack_require__(20);
const _ = __webpack_require__(0);
const MySqlQueryGenerator = __webpack_require__(38);
const AbstractQueryGenerator = __webpack_require__(26);

const QueryGenerator = {
  __proto__: MySqlQueryGenerator,
  options: {},
  dialect: 'sqlite',

  createSchema() {
    return "SELECT name FROM `sqlite_master` WHERE type='table' and name!='sqlite_sequence';";
  },

  showSchemasQuery() {
    return "SELECT name FROM `sqlite_master` WHERE type='table' and name!='sqlite_sequence';";
  },

  versionQuery() {
    return 'SELECT sqlite_version() as `version`';
  },

  createTableQuery(tableName, attributes, options) {
    options = options || {};

    const primaryKeys = [];
    const needsMultiplePrimaryKeys = Utils._.values(attributes).filter(definition => _.includes(definition, 'PRIMARY KEY')).length > 1;
    const attrArray = [];

    for (const attr in attributes) {
      if (attributes.hasOwnProperty(attr)) {
        let dataType = attributes[attr];
        const containsAutoIncrement = Utils._.includes(dataType, 'AUTOINCREMENT');

        if (containsAutoIncrement) {
          dataType = dataType.replace(/BIGINT/, 'INTEGER');
        }

        let dataTypeString = dataType;
        if (Utils._.includes(dataType, 'PRIMARY KEY')) {
          if (Utils._.includes(dataType, 'INTEGER')) { // Only INTEGER is allowed for primary key, see https://github.com/sequelize/sequelize/issues/969 (no lenght, unsigned etc)
            dataTypeString = containsAutoIncrement ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INTEGER PRIMARY KEY';
          }

          if (needsMultiplePrimaryKeys) {
            primaryKeys.push(attr);
            dataTypeString = dataType.replace(/PRIMARY KEY/, 'NOT NULL');
          }
        }
        attrArray.push(this.quoteIdentifier(attr) + ' ' + dataTypeString);
      }
    }

    const table = this.quoteTable(tableName);
    let attrStr = attrArray.join(', ');
    const pkString = primaryKeys.map(pk => this.quoteIdentifier(pk)).join(', ');

    if (options.uniqueKeys) {
      Utils._.each(options.uniqueKeys, columns => {
        if (!columns.singleField) { // If it's a single field its handled in column def, not as an index
          attrStr += ', UNIQUE (' + columns.fields.map(field => this.quoteIdentifier(field)).join(', ') + ')';
        }
      });
    }

    if (pkString.length > 0) {
      attrStr += ', PRIMARY KEY (' + pkString + ')';
    }

    const sql = `CREATE TABLE IF NOT EXISTS ${table} (${attrStr});`;
    return this.replaceBooleanDefaults(sql);
  },

  booleanValue(value) {
    return value ? 1 : 0;
  },

  /**
   * Check whether the statmement is json function or simple path
   *
   * @param   {String}  stmt  The statement to validate
   * @returns {Boolean}       true if the given statement is json function
   * @throws  {Error}         throw if the statement looks like json function but has invalid token
   */
  checkValidJsonStatement(stmt) {
    if (!_.isString(stmt)) {
      return false;
    }

    // https://sqlite.org/json1.html
    const jsonFunctionRegex = /^\s*(json(?:_[a-z]+){0,2})\([^)]*\)/i;
    const tokenCaptureRegex = /^\s*((?:([`"'])(?:(?!\2).|\2{2})*\2)|[\w\d\s]+|[().,;+-])/i;

    let currentIndex = 0;
    let openingBrackets = 0;
    let closingBrackets = 0;
    let hasJsonFunction = false;
    let hasInvalidToken = false;

    while (currentIndex < stmt.length) {
      const string = stmt.substr(currentIndex);
      const functionMatches = jsonFunctionRegex.exec(string);
      if (functionMatches) {
        currentIndex += functionMatches[0].indexOf('(');
        hasJsonFunction = true;
        continue;
      }

      const tokenMatches = tokenCaptureRegex.exec(string);
      if (tokenMatches) {
        const capturedToken = tokenMatches[1];
        if (capturedToken === '(') {
          openingBrackets++;
        } else if (capturedToken === ')') {
          closingBrackets++;
        } else if (capturedToken === ';') {
          hasInvalidToken = true;
          break;
        }
        currentIndex += tokenMatches[0].length;
        continue;
      }

      break;
    }

    // Check invalid json statement
    hasInvalidToken |= openingBrackets !== closingBrackets;
    if (hasJsonFunction && hasInvalidToken) {
      throw new Error('Invalid json statement: ' + stmt);
    }

    // return true if the statement has valid json function
    return hasJsonFunction;
  },

  /**
   * Generates an SQL query that extract JSON property of given path.
   *
   * @param   {String}               column  The JSON column
   * @param   {String|Array<String>} [path]  The path to extract (optional)
   * @returns {String}                       The generated sql query
   * @private
   */
  jsonPathExtractionQuery(column, path) {
    const paths = _.toPath(path);
    const pathStr = this.escape(['$']
      .concat(paths)
      .join('.')
      .replace(/\.(\d+)(?:(?=\.)|$)/g, (_, digit) => `[${digit}]`));

    const quotedColumn = this.isIdentifierQuoted(column) ? column : this.quoteIdentifier(column);
    return `json_extract(${quotedColumn}, ${pathStr})`;
  },

  handleSequelizeMethod(smth, tableName, factory, options, prepend) {
    if (smth instanceof Utils.Json) {
      // Parse nested object
      if (smth.conditions) {
        const conditions = this.parseConditionObject(smth.conditions).map(condition =>
          `${this.jsonPathExtractionQuery(_.first(condition.path), _.tail(condition.path))} = '${condition.value}'`
        );

        return conditions.join(' AND ');
      } else if (smth.path) {
        let str;

        // Allow specifying conditions using the sqlite json functions
        if (this.checkValidJsonStatement(smth.path)) {
          str = smth.path;
        } else {
          // Also support json property accessors
          const paths = _.toPath(smth.path);
          const column = paths.shift();
          str = this.jsonPathExtractionQuery(column, paths);
        }

        if (smth.value) {
          str += util.format(' = %s', this.escape(smth.value));
        }

        return str;
      }
    } else if (smth instanceof Utils.Cast) {
      if (/timestamp/i.test(smth.type)) {
        smth.type = 'datetime';
      }
    }
    return AbstractQueryGenerator.handleSequelizeMethod.call(this, smth, tableName, factory, options, prepend);
  },

  addColumnQuery(table, key, dataType) {
    const attributes = {};
    attributes[key] = dataType;
    const fields = this.attributesToSQL(attributes, { context: 'addColumn' });
    const attribute = this.quoteIdentifier(key) + ' ' + fields[key];

    const sql = `ALTER TABLE ${this.quoteTable(table)} ADD ${attribute};`;

    return this.replaceBooleanDefaults(sql);
  },

  showTablesQuery() {
    return "SELECT name FROM `sqlite_master` WHERE type='table' and name!='sqlite_sequence';";
  },

  upsertQuery(tableName, insertValues, updateValues, where, model, options) {
    options.ignoreDuplicates = true;

    const sql = this.insertQuery(tableName, insertValues, model.rawAttributes, options) + ' ' + this.updateQuery(tableName, updateValues, where, options, model.rawAttributes);

    return sql;
  },

  updateQuery(tableName, attrValueHash, where, options, attributes) {
    options = options || {};
    _.defaults(options, this.options);

    attrValueHash = Utils.removeNullValuesFromHash(attrValueHash, options.omitNull, options);

    const modelAttributeMap = {};
    const values = [];

    if (attributes) {
      _.each(attributes, (attribute, key) => {
        modelAttributeMap[key] = attribute;
        if (attribute.field) {
          modelAttributeMap[attribute.field] = attribute;
        }
      });
    }

    for (const key in attrValueHash) {
      const value = attrValueHash[key];
      values.push(this.quoteIdentifier(key) + '=' + this.escape(value, modelAttributeMap && modelAttributeMap[key] || undefined, { context: 'UPDATE' }));
    }

    return `UPDATE ${this.quoteTable(tableName)} SET ${values.join(',')} ${this.whereQuery(where, options)}`;
  },

  deleteQuery(tableName, where, options, model) {
    options = options || {};
    _.defaults(options, this.options);

    let whereClause = this.getWhereConditions(where, null, model, options);
    if (whereClause) {
      whereClause = ' WHERE ' + whereClause;
    }

    return `DELETE FROM ${this.quoteTable(tableName)}${whereClause}`;
  },

  attributesToSQL(attributes) {
    const result = {};

    for (const name in attributes) {
      const dataType = attributes[name];
      const fieldName = dataType.field || name;

      if (Utils._.isObject(dataType)) {
        let sql = dataType.type.toString();

        if (dataType.hasOwnProperty('allowNull') && !dataType.allowNull) {
          sql += ' NOT NULL';
        }

        if (Utils.defaultValueSchemable(dataType.defaultValue)) {
          // TODO thoroughly check that DataTypes.NOW will properly
          // get populated on all databases as DEFAULT value
          // i.e. mysql requires: DEFAULT CURRENT_TIMESTAMP
          sql += ' DEFAULT ' + this.escape(dataType.defaultValue, dataType);
        }

        if (dataType.unique === true) {
          sql += ' UNIQUE';
        }

        if (dataType.primaryKey) {
          sql += ' PRIMARY KEY';

          if (dataType.autoIncrement) {
            sql += ' AUTOINCREMENT';
          }
        }

        if (dataType.references) {
          const referencesTable = this.quoteTable(dataType.references.model);

          let referencesKey;
          if (dataType.references.key) {
            referencesKey = this.quoteIdentifier(dataType.references.key);
          } else {
            referencesKey = this.quoteIdentifier('id');
          }

          sql += ` REFERENCES ${referencesTable} (${referencesKey})`;

          if (dataType.onDelete) {
            sql += ' ON DELETE ' + dataType.onDelete.toUpperCase();
          }

          if (dataType.onUpdate) {
            sql += ' ON UPDATE ' + dataType.onUpdate.toUpperCase();
          }

        }

        result[fieldName] = sql;
      } else {
        result[fieldName] = dataType;
      }
    }

    return result;
  },

  showIndexesQuery(tableName) {
    return `PRAGMA INDEX_LIST(${this.quoteTable(tableName)})`;
  },

  showConstraintsQuery(tableName, constraintName) {
    let sql =  `SELECT sql FROM sqlite_master WHERE tbl_name='${tableName}'`;

    if (constraintName) {
      sql += ` AND sql LIKE '%${constraintName}%'`;
    }

    return sql + ';';
  },

  removeIndexQuery(tableName, indexNameOrAttributes) {
    let indexName = indexNameOrAttributes;

    if (typeof indexName !== 'string') {
      indexName = Utils.underscore(tableName + '_' + indexNameOrAttributes.join('_'));
    }

    return `DROP INDEX IF EXISTS ${this.quoteIdentifier(indexName)}`;
  },

  describeTableQuery(tableName, schema, schemaDelimiter) {
    const table = {
      _schema: schema,
      _schemaDelimiter: schemaDelimiter,
      tableName
    };
    return `PRAGMA TABLE_INFO(${this.quoteTable(this.addSchema(table))});`;
  },

  describeCreateTableQuery(tableName) {
    return `SELECT sql FROM sqlite_master WHERE tbl_name='${tableName}';`;
  },

  removeColumnQuery(tableName, attributes) {

    attributes = this.attributesToSQL(attributes);

    let backupTableName;
    if (typeof tableName === 'object') {
      backupTableName = {
        tableName: tableName.tableName + '_backup',
        schema: tableName.schema
      };
    } else {
      backupTableName = tableName + '_backup';
    }

    const quotedTableName = this.quoteTable(tableName);
    const quotedBackupTableName = this.quoteTable(backupTableName);
    const attributeNames = Object.keys(attributes).map(attr => this.quoteIdentifier(attr)).join(', ');

    return this.createTableQuery(backupTableName, attributes).replace('CREATE TABLE', 'CREATE TEMPORARY TABLE')
      + `INSERT INTO ${quotedBackupTableName} SELECT ${attributeNames} FROM ${quotedTableName};`
      + `DROP TABLE ${quotedTableName};`
      + this.createTableQuery(tableName, attributes)
      + `INSERT INTO ${quotedTableName} SELECT ${attributeNames} FROM ${quotedBackupTableName};`
      + `DROP TABLE ${quotedBackupTableName};`;
  },

  _alterConstraintQuery(tableName, attributes, createTableSql) {
    let backupTableName;

    attributes = this.attributesToSQL(attributes);

    if (typeof tableName === 'object') {
      backupTableName = {
        tableName: tableName.tableName + '_backup',
        schema: tableName.schema
      };
    } else {
      backupTableName = tableName + '_backup';
    }
    const quotedTableName = this.quoteTable(tableName);
    const quotedBackupTableName = this.quoteTable(backupTableName);
    const attributeNames = Object.keys(attributes).map(attr => this.quoteIdentifier(attr)).join(', ');

    return createTableSql.replace(`CREATE TABLE ${quotedTableName}`, `CREATE TABLE ${quotedBackupTableName}`)
      + `INSERT INTO ${quotedBackupTableName} SELECT ${attributeNames} FROM ${quotedTableName};`
      + `DROP TABLE ${quotedTableName};`
      + `ALTER TABLE ${quotedBackupTableName} RENAME TO ${quotedTableName};`;
  },

  renameColumnQuery(tableName, attrNameBefore, attrNameAfter, attributes) {

    let backupTableName;

    attributes = this.attributesToSQL(attributes);

    if (typeof tableName === 'object') {
      backupTableName = {
        tableName: tableName.tableName + '_backup',
        schema: tableName.schema
      };
    } else {
      backupTableName = tableName + '_backup';
    }

    const quotedTableName = this.quoteTable(tableName);
    const quotedBackupTableName = this.quoteTable(backupTableName);
    const attributeNamesImport = Object.keys(attributes).map(attr =>
      attrNameAfter === attr ? this.quoteIdentifier(attrNameBefore) + ' AS ' + this.quoteIdentifier(attr) : this.quoteIdentifier(attr)
    ).join(', ');
    const attributeNamesExport = Object.keys(attributes).map(attr => this.quoteIdentifier(attr)).join(', ');

    return this.createTableQuery(backupTableName, attributes).replace('CREATE TABLE', 'CREATE TEMPORARY TABLE')
      + `INSERT INTO ${quotedBackupTableName} SELECT ${attributeNamesImport} FROM ${quotedTableName};`
      + `DROP TABLE ${quotedTableName};`
      + this.createTableQuery(tableName, attributes)
      + `INSERT INTO ${quotedTableName} SELECT ${attributeNamesExport} FROM ${quotedBackupTableName};`
      + `DROP TABLE ${quotedBackupTableName};`;
  },

  startTransactionQuery(transaction) {
    if (transaction.parent) {
      return 'SAVEPOINT ' + this.quoteIdentifier(transaction.name) + ';';
    }

    return 'BEGIN ' + transaction.options.type + ' TRANSACTION;';
  },

  setAutocommitQuery() {
    // SQLite does not support SET autocommit
    return null;
  },

  setIsolationLevelQuery(value) {
    switch (value) {
      case Transaction.ISOLATION_LEVELS.REPEATABLE_READ:
        return '-- SQLite is not able to choose the isolation level REPEATABLE READ.';
      case Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED:
        return 'PRAGMA read_uncommitted = ON;';
      case Transaction.ISOLATION_LEVELS.READ_COMMITTED:
        return 'PRAGMA read_uncommitted = OFF;';
      case Transaction.ISOLATION_LEVELS.SERIALIZABLE:
        return "-- SQLite's default isolation level is SERIALIZABLE. Nothing to do.";
      default:
        throw new Error('Unknown isolation level: ' + value);
    }
  },

  replaceBooleanDefaults(sql) {
    return sql.replace(/DEFAULT '?false'?/g, 'DEFAULT 0').replace(/DEFAULT '?true'?/g, 'DEFAULT 1');
  },

  quoteIdentifier(identifier) {
    if (identifier === '*') return identifier;
    return Utils.addTicks(Utils.removeTicks(identifier, '`'), '`');
  },

  /**
   * Generates an SQL query that returns all foreign keys of a table.
   *
   * @param  {String} tableName  The name of the table.
   * @return {String}            The generated sql query.
   * @private
   */
  getForeignKeysQuery(tableName) {
    return `PRAGMA foreign_key_list(${tableName})`;
  }
};

module.exports = QueryGenerator;


/***/ }),
/* 106 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 106;

/***/ }),
/* 107 */
/***/ (function(module, exports) {

module.exports = {"name":"sequelize","description":"Multi dialect ORM for Node.JS","version":"4.8.2","author":"Sascha Depold <sascha@depold.com>","contributors":[{"name":"Sascha Depold","email":"sascha@depold.com"},{"name":"Jan Aagaard Meier","email":["janzeh@gmail.com","jmei@itu.dk"]},{"name":"Daniel Durante","email":"me@danieldurante.com"},{"name":"Mick Hansen","email":"mick.kasper.hansen@gmail.com"},{"name":"Sushant Dhiman","email":"sushantdhiman@outlook.com"}],"repository":{"type":"git","url":"https://github.com/sequelize/sequelize.git"},"bugs":{"url":"https://github.com/sequelize/sequelize/issues"},"dependencies":{"bluebird":"^3.4.6","cls-bluebird":"^2.0.1","debug":"^3.0.0","depd":"^1.1.0","dottie":"^2.0.0","generic-pool":"^3.1.6","inflection":"1.12.0","lodash":"^4.17.1","moment":"^2.13.0","moment-timezone":"^0.5.4","retry-as-promised":"^2.0.0","semver":"^5.0.1","terraformer-wkt-parser":"^1.1.2","toposort-class":"^1.0.1","uuid":"^3.0.0","validator":"^8.0.0","wkx":"^0.4.1"},"devDependencies":{"chai":"^3.5.0","chai-as-promised":"^5.3.0","chai-datetime":"^1.4.1","chai-spies":"^0.7.1","cheerio":"^1.0.0-rc.2","commitizen":"^2.9.6","continuation-local-storage":"^3.2.0","cross-env":"^5.0.5","cz-conventional-changelog":"^2.0.0","env-cmd":"^5.1.0","esdoc":"^0.5.2","eslint":"^4.6.0","hints":"^1.1.0","husky":"^0.14.2","istanbul":"^0.4.5","lcov-result-merger":"^1.2.0","mocha":"^3.0.2","mysql2":"^1.4.1","pg":"^6.1.0","pg-hstore":"^2.3.2","pg-native":"^1.10.0","pg-types":"^1.11.0","rimraf":"^2.5.4","semantic-release":"^7.0.2","sinon":"^1.17.6","sinon-chai":"^2.13.0","sqlite3":"^3.1.4","tedious":"1.14.0","uuid-validate":"^0.0.2","validate-commit-msg":"^2.12.2"},"keywords":["mysql","sqlite","postgresql","postgres","mssql","orm","nodejs","object relational mapper"],"main":"index","scripts":{"lint":"eslint lib test --quiet","test":"npm run teaser && npm run test-unit && npm run test-integration","test-docker":"npm run test-docker-unit && npm run test-docker-integration","test-docker-unit":"env-cmd ./test/config/.docker.env npm run test-unit","test-docker-integration":"env-cmd ./test/config/.docker.env npm run test-integration","docs":"esdoc && cp docs/ROUTER esdoc/ROUTER","teaser":"node -e \"console.log('#'.repeat(process.env.DIALECT.length + 22) + '\\n# Running tests for ' + process.env.DIALECT + ' #\\n' + '#'.repeat(process.env.DIALECT.length + 22))\"","test-unit":"mocha --globals setImmediate,clearImmediate --ui tdd --check-leaks --colors -t 30000 --reporter spec \"test/unit/**/*.js\"","test-unit-mysql":"cross-env DIALECT=mysql npm run test-unit","test-unit-postgres":"cross-env DIALECT=postgres npm run test-unit","test-unit-postgres-native":"cross-env DIALECT=postgres-native npm run test-unit","test-unit-sqlite":"cross-env DIALECT=sqlite npm run test-unit","test-unit-mssql":"cross-env DIALECT=mssql npm run test-unit","test-unit-all":"npm run test-unit-mysql && npm run test-unit-postgres && npm run test-unit-postgres-native && npm run test-unit-mssql && npm run test-unit-sqlite","test-integration":"mocha --globals setImmediate,clearImmediate --ui tdd --check-leaks --colors -t 30000 --reporter spec \"test/integration/**/*.test.js\"","test-integration-mysql":"cross-env DIALECT=mysql npm run test-integration","test-integration-postgres":"cross-env DIALECT=postgres npm run test-integration","test-integration-postgres-native":"cross-env DIALECT=postgres-native npm run test-integration","test-integration-sqlite":"cross-env DIALECT=sqlite npm run test-integration","test-integration-mssql":"cross-env DIALECT=mssql npm run test-integration","test-integration-all":"npm run test-integration-mysql && npm run test-integration-postgres && npm run test-integration-postgres-native && npm run test-integration-mssql && npm run test-integration-sqlite","test-mysql":"cross-env DIALECT=mysql npm test","test-sqlite":"cross-env DIALECT=sqlite npm test","test-postgres":"cross-env DIALECT=postgres npm test","test-pgsql":"npm run test-postgres","test-postgres-native":"cross-env DIALECT=postgres-native npm test","test-postgresn":"npm run test-postgres-native","test-mssql":"cross-env DIALECT=mssql npm test","test-all":"npm run test-mysql && npm run test-sqlite && npm run test-postgres && npm run test-postgres-native && npm run test-mssql","cover":"rimraf coverage && npm run teaser && npm run cover-integration && npm run cover-unit && npm run merge-coverage","cover-integration":"cross-env COVERAGE=true node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -t 60000 --ui tdd \"test/integration/**/*.test.js\" && node -e \"require('fs').renameSync('coverage/lcov.info', 'coverage/integration.info')\"","cover-unit":"cross-env COVERAGE=true node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -t 30000 --ui tdd \"test/unit/**/*.test.js\" && node -e \"require('fs').renameSync('coverage/lcov.info', 'coverage/unit.info')\"","merge-coverage":"lcov-result-merger \"coverage/*.info\" \"coverage/lcov.info\"","sscce":"docker-compose run sequelize /bin/sh -c \"node sscce.js\"","sscce-mysql":"cross-env DIALECT=mysql npm run sscce","sscce-postgres":"cross-env DIALECT=postgres npm run sscce","sscce-sqlite":"cross-env DIALECT=sqlite npm run sscce","semantic-release":"./node_modules/.bin/semantic-release pre && npm publish && ./node_modules/.bin/semantic-release post","commitmsg":"validate-commit-msg"},"engines":{"node":">=4.0.0"},"license":"MIT","config":{"commitizen":{"path":"./node_modules/cz-conventional-changelog"}}}

/***/ }),
/* 108 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__(15).config();

var _process$env = process.env,
    _process$env$DATABASE = _process$env.DATABASE_DIALECT,
    DATABASE_DIALECT = _process$env$DATABASE === undefined ? 'mysql' : _process$env$DATABASE,
    _process$env$DATABASE2 = _process$env.DATABASE_STORAGE,
    DATABASE_STORAGE = _process$env$DATABASE2 === undefined ? './db.sqlite' : _process$env$DATABASE2,
    _process$env$DATABASE3 = _process$env.DATABASE_HOST,
    DATABASE_HOST = _process$env$DATABASE3 === undefined ? '127.0.0.1' : _process$env$DATABASE3,
    _process$env$DATABASE4 = _process$env.DATABASE_PORT,
    DATABASE_PORT = _process$env$DATABASE4 === undefined ? 3306 : _process$env$DATABASE4,
    _process$env$DATABASE5 = _process$env.DATABASE_NAME,
    DATABASE_NAME = _process$env$DATABASE5 === undefined ? 'piper' : _process$env$DATABASE5,
    DATABASE_USER = _process$env.DATABASE_USER,
    DATABASE_PASSWORD = _process$env.DATABASE_PASSWORD,
    DATABASE_URL = _process$env.DATABASE_URL;


var base = {
  "username": DATABASE_USER,
  "password": DATABASE_PASSWORD,
  "database": DATABASE_NAME,
  "host": DATABASE_HOST,
  "port": DATABASE_PORT,
  "dialect": DATABASE_DIALECT,
  "storage": DATABASE_STORAGE,
  "url": DATABASE_URL
};

/* harmony default export */ __webpack_exports__["a"] = ({
  "development": base,
  "test": base,
  "production": base
});

/***/ }),
/* 109 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* jshint indent: 2 */

/* harmony default export */ __webpack_exports__["a"] = (function (sequelize, DataTypes) {
  var changelog = sequelize.define('changelog', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    action: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    page_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    items: {
      type: DataTypes.STRING(10240),
      allowNull: true,
      defaultValue: ''
    },
    create_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'changelog'
  });

  changelog.associate = function (models) {
    changelog.belongsTo(models.pages, { foreignKey: 'page_id' });
    changelog.belongsTo(models.users, { foreignKey: 'create_by' });
  };

  return changelog;
});;

/***/ }),
/* 110 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* jshint indent: 2 */

/* harmony default export */ __webpack_exports__["a"] = (function (sequelize, DataTypes) {
  var pages = sequelize.define('pages', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    cover: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: ''
    },
    config: {
      type: DataTypes.STRING(512),
      allowNull: false,
      defaultValue: ''
    },
    items: {
      type: DataTypes.STRING(10240),
      allowNull: false
    },
    create_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    is_publish: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    is_delete: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    publish_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.NOW
    }
  }, {
    tableName: 'pages'
  });

  pages.associate = function (models) {
    pages.hasOne(models.changelog, { foreignKey: 'page_id' });
    pages.belongsTo(models.users, { foreignKey: 'create_by' });
  };

  return pages;
});;

/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* jshint indent: 2 */

/* harmony default export */ __webpack_exports__["a"] = (function (sequelize, DataTypes) {
  var users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    github_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    avatar: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: ''
    }
  }, {
    tableName: 'users'
  });

  users.associate = function (models) {
    users.hasOne(models.changelog, { foreignKey: 'create_by' });
    users.hasOne(models.pages, { foreignKey: 'create_by' });
  };

  return users;
});;

/***/ }),
/* 112 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models__ = __webpack_require__(6);


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this.url = '/count';
  }

  _createClass(_class, [{
    key: 'get',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx) {
        var _ref2, _ref3, result;

        return __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return __WEBPACK_IMPORTED_MODULE_1__models__["a" /* default */].pages.findAll({
                  attributes: [[__WEBPACK_IMPORTED_MODULE_1__models__["a" /* default */].sequelize.fn('COUNT', __WEBPACK_IMPORTED_MODULE_1__models__["a" /* default */].sequelize.literal('CASE WHEN is_publish = 0 THEN 1 ELSE NULL END')), 'working'], [__WEBPACK_IMPORTED_MODULE_1__models__["a" /* default */].sequelize.fn('COUNT', __WEBPACK_IMPORTED_MODULE_1__models__["a" /* default */].sequelize.literal('CASE WHEN is_publish = 1 THEN 1 ELSE NULL END')), 'published']],
                  where: {
                    is_delete: 0
                  }
                });

              case 2:
                _ref2 = _context.sent;
                _ref3 = _slicedToArray(_ref2, 1);
                result = _ref3[0];


                ctx.body = result;

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get(_x) {
        return _ref.apply(this, arguments);
      }

      return get;
    }()
  }]);

  return _class;
}();

/* harmony default export */ __webpack_exports__["a"] = (_class);
;

/***/ }),
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_async_busboy__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_async_busboy___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_async_busboy__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_publish__ = __webpack_require__(39);


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this.url = '/files';
  }

  _createClass(_class, [{
    key: 'post',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx) {
        var _ref2, files, fields, uploadRes;

        return __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return __WEBPACK_IMPORTED_MODULE_1_async_busboy___default()(ctx.req);

              case 2:
                _ref2 = _context.sent;
                files = _ref2.files;
                fields = _ref2.fields;
                _context.next = 7;
                return Object(__WEBPACK_IMPORTED_MODULE_2__lib_publish__["a" /* default */])(files);

              case 7:
                uploadRes = _context.sent;


                ctx.body = uploadRes;

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function post(_x) {
        return _ref.apply(this, arguments);
      }

      return post;
    }()
  }]);

  return _class;
}();

/* harmony default export */ __webpack_exports__["a"] = (_class);
;

/***/ }),
/* 114 */
/***/ (function(module, exports) {

module.exports = require("async-busboy");

/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

__webpack_require__(15).config();
var _ = __webpack_require__(0);
var qiniu = __webpack_require__(116);

var _process$env = process.env,
    QINIU_ACCESS_KEY = _process$env.QINIU_ACCESS_KEY,
    QINIU_SECRET_KEY = _process$env.QINIU_SECRET_KEY,
    QINIU_BUCKET = _process$env.QINIU_BUCKET,
    QINIU_BASEURL = _process$env.QINIU_BASEURL;


qiniu.conf.ACCESS_KEY = QINIU_ACCESS_KEY;
qiniu.conf.SECRET_KEY = QINIU_SECRET_KEY;

var getUptoken = function getUptoken(key) {
  if (_.isEmpty(key)) return;

  var putPolicy = new qiniu.rs.PutPolicy(QINIU_BUCKET + ':' + key);
  return putPolicy.token();
};

var upload = function upload(uptoken, localFile) {

  if (_.isEmpty(uptoken)) return;

  var extra = new qiniu.io.PutExtra();

  return new Promise(function (resolve, reject) {
    qiniu.io.putFile(uptoken, localFile, localFile, extra, function (err, ret) {
      if (!err) {
        resolve({
          hash: ret.hash,
          key: ret.key,
          url: QINIU_BASEURL + '/' + ret.key
        });
      } else {
        console.log("upload error", err, localFile);
        reject(err);
      }
    });
  });
};

/* harmony default export */ __webpack_exports__["a"] = ((function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(files) {
    var tasks;
    return __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(QINIU_ACCESS_KEY === 'YOUR QINIU AK' || QINIU_SECRET_KEY === 'YOUR QINIU SK' || QINIU_BUCKET === 'YOUR QINIU BUCKET' || QINIU_BASEURL === 'YOUR QINIU URL')) {
              _context.next = 2;
              break;
            }

            throw { status: 404, name: 'UPLOAD_ERROR_CONFIG', message: '请在 process.env 里配置 qiniu 上传相关的配置: QINIU_ACCESS_KEY/QINIU_SECRET_KEY/QINIU_BUCKET/QINIU_BASEURL' };

          case 2:
            tasks = files.map(function (file, key) {
              return upload(getUptoken(file.path), file.path);
            });
            _context.next = 5;
            return Promise.all(tasks);

          case 5:
            return _context.abrupt('return', _context.sent);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());

/***/ }),
/* 116 */
/***/ (function(module, exports) {

module.exports = require("qiniu");

/***/ }),
/* 117 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models__ = __webpack_require__(6);


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this.url = '/pages';
  }

  _createClass(_class, [{
    key: 'get',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx) {
        var _ctx$query, page, size, title, isPublish, start, limit, where, result;

        return __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ctx$query = ctx.query, page = _ctx$query.page, size = _ctx$query.size, title = _ctx$query.title, isPublish = _ctx$query.isPublish;

                page = parseInt(page, 10);
                size = parseInt(size, 10);
                start = (page - 1) * size;
                limit = size;
                where = {
                  is_delete: 0
                };

                if (title) {
                  where['title'] = {
                    $like: '%' + title + '%'
                  };
                }
                if (isPublish != -1) {
                  where['is_publish'] = isPublish;
                }
                _context.next = 10;
                return __WEBPACK_IMPORTED_MODULE_2__models__["a" /* default */].pages.findAndCountAll({
                  include: [{
                    model: __WEBPACK_IMPORTED_MODULE_2__models__["a" /* default */].users,
                    attributes: ['name']
                  }],
                  offset: start,
                  limit: limit,
                  where: where,
                  order: [['create_at', 'DESC']]
                });

              case 10:
                result = _context.sent;


                ctx.body = {
                  total: result.count,
                  page: page,
                  size: size,
                  data: result.rows
                };

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get(_x) {
        return _ref.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: 'put',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2(ctx) {
        var _ctx$request$body, _ctx$request$body$tit, title, _ctx$request$body$con, config, _ctx$request$body$ite, items, _ref3, _ref4, page, created;

        return __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _ctx$request$body = ctx.request.body, _ctx$request$body$tit = _ctx$request$body.title, title = _ctx$request$body$tit === undefined ? '' : _ctx$request$body$tit, _ctx$request$body$con = _ctx$request$body.config, config = _ctx$request$body$con === undefined ? '' : _ctx$request$body$con, _ctx$request$body$ite = _ctx$request$body.items, items = _ctx$request$body$ite === undefined ? '' : _ctx$request$body$ite;

                title = title.trim();

                if (title) {
                  _context2.next = 4;
                  break;
                }

                throw { status: 400, name: 'ERROR_PARAMS', message: 'Title 不能为空' };

              case 4:
                items = JSON.stringify(items);

                if (!(items.length > __WEBPACK_IMPORTED_MODULE_1__constants__["a" /* default */].VALUE_MAX_LENGTH)) {
                  _context2.next = 7;
                  break;
                }

                throw __WEBPACK_IMPORTED_MODULE_1__constants__["a" /* default */].VALUE_TOO_LONG;

              case 7:
                config = JSON.stringify(config);

                _context2.next = 10;
                return __WEBPACK_IMPORTED_MODULE_2__models__["a" /* default */].pages.findOrCreate({
                  where: {
                    is_delete: 0,
                    title: title
                  },
                  defaults: {
                    title: title,
                    config: config,
                    items: items,
                    create_by: ctx.state.user.id
                  }
                });

              case 10:
                _ref3 = _context2.sent;
                _ref4 = _slicedToArray(_ref3, 2);
                page = _ref4[0];
                created = _ref4[1];

                if (!(page && !created)) {
                  _context2.next = 16;
                  break;
                }

                throw { status: 400, name: 'DUP', message: '记录已存在' };

              case 16:
                _context2.next = 18;
                return __WEBPACK_IMPORTED_MODULE_2__models__["a" /* default */].changelog.create({
                  action: 1,
                  page_id: page.id,
                  items: items,
                  create_by: ctx.state.user.id
                });

              case 18:

                ctx.body = {
                  message: 'Save success',
                  item: page
                };

              case 19:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function put(_x2) {
        return _ref2.apply(this, arguments);
      }

      return put;
    }()
  }]);

  return _class;
}();

/* harmony default export */ __webpack_exports__["a"] = (_class);
;

/***/ }),
/* 118 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__page__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_path__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_fs__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_fs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_mkdirp__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_mkdirp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_mkdirp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__lib_publish__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_webshot__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_webshot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_webshot__);


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }









var protocol = 'http://';

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this.url = '/publish/:id';
  }

  _createClass(_class, [{
    key: 'put',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx) {
        var id, _ref2, _ref3, page, dir, shotUrl, options;

        return __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return new __WEBPACK_IMPORTED_MODULE_1__page__["a" /* default */]().put(ctx);

              case 2:
                id = ctx.params.id;
                _context.next = 5;
                return __WEBPACK_IMPORTED_MODULE_2__models__["a" /* default */].pages.findAll({
                  where: {
                    is_delete: 0,
                    id: id
                  }
                });

              case 5:
                _ref2 = _context.sent;
                _ref3 = _slicedToArray(_ref2, 1);
                page = _ref3[0];

                if (page) {
                  _context.next = 10;
                  break;
                }

                throw { status: 404, name: 'PAGES_NOT_FOUND', message: 'page is not found' };

              case 10:
                _context.next = 12;
                return __WEBPACK_IMPORTED_MODULE_2__models__["a" /* default */].pages.update({
                  is_publish: 1,
                  publish_at: Date.now()
                }, {
                  where: {
                    id: id
                  }
                });

              case 12:
                _context.next = 14;
                return __WEBPACK_IMPORTED_MODULE_2__models__["a" /* default */].changelog.create({
                  action: 4,
                  page_id: id,
                  items: null,
                  create_by: ctx.state.user.id
                });

              case 14:
                dir = 'public/' + id;


                if (!__WEBPACK_IMPORTED_MODULE_4_fs___default.a.existsSync(dir)) {

                  __WEBPACK_IMPORTED_MODULE_5_mkdirp___default()(dir, function (err) {
                    if (err) {
                      console.error(err);
                    }
                  });
                }

                _context.prev = 16;

                page.config = JSON.parse(page.config);
                page.items = JSON.parse(page.items);
                _context.next = 24;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context['catch'](16);
                throw { status: 500, name: 'JSON_PARSE_ERROR', message: 'json parse error' };

              case 24:
                ;

                shotUrl = 'http://127.0.0.1:3000/view/' + id;
                options = {
                  screenSize: {
                    width: 375,
                    height: 375
                  },
                  shotSize: {
                    width: 375,
                    height: 'all'
                  },
                  userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)' + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
                };


                __WEBPACK_IMPORTED_MODULE_7_webshot___default()(shotUrl, dir + '/cover.png', options, function (err) {
                  if (err) {
                    throw { status: 404, name: 'WEBSHOT_ERR', message: 'webshot failed' };
                  }

                  Object(__WEBPACK_IMPORTED_MODULE_6__lib_publish__["a" /* default */])([__WEBPACK_IMPORTED_MODULE_4_fs___default.a.createReadStream(dir + '/cover.png')]).then(function (coverRes) {
                    __WEBPACK_IMPORTED_MODULE_2__models__["a" /* default */].pages.update({
                      cover: protocol + coverRes[0].url
                    }, {
                      where: {
                        id: id
                      }
                    });
                  });
                });

                ctx.body = {
                  url: shotUrl
                };

              case 29:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[16, 21]]);
      }));

      function put(_x) {
        return _ref.apply(this, arguments);
      }

      return put;
    }()
  }]);

  return _class;
}();

/* harmony default export */ __webpack_exports__["a"] = (_class);

/***/ }),
/* 119 */
/***/ (function(module, exports) {

module.exports = require("mkdirp");

/***/ }),
/* 120 */
/***/ (function(module, exports) {

module.exports = require("webshot");

/***/ }),
/* 121 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models__ = __webpack_require__(6);


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this.url = '/users';
  }

  _createClass(_class, [{
    key: 'get',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx) {
        var users;
        return __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return __WEBPACK_IMPORTED_MODULE_1__models__["a" /* default */].users.findAll();

              case 2:
                users = _context.sent;

                ctx.body = users;

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get(_x) {
        return _ref.apply(this, arguments);
      }

      return get;
    }()
  }]);

  return _class;
}();

/* harmony default export */ __webpack_exports__["a"] = (_class);
;

/***/ }),
/* 122 */
/***/ (function(module, exports) {

module.exports = require("koa-session");

/***/ }),
/* 123 */
/***/ (function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ }),
/* 124 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models__ = __webpack_require__(6);


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

__webpack_require__(15).config();
var passport = __webpack_require__(42);


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(id, done) {
    var user;
    return __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return __WEBPACK_IMPORTED_MODULE_1__models__["a" /* default */].users.findById(id);

          case 3:
            user = _context.sent;

            done(null, user);
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);

            done(_context.t0);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 7]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

var GitHubStrategy = __webpack_require__(125).Strategy;
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CLIENT_CALLBACK_URL
}, function (accessToken, refreshToken, profile, cb) {
  var _profile$_json = profile._json,
      name = _profile$_json.name,
      email = _profile$_json.email,
      id = _profile$_json.id,
      avatar_url = _profile$_json.avatar_url;

  __WEBPACK_IMPORTED_MODULE_1__models__["a" /* default */].users.findOrCreate({ where: { github_id: id }, defaults: {
      name: name,
      email: email,
      avatar: avatar_url
    } }).spread(function (user, created) {
    return cb(null, user);
  }).catch(function (err) {
    console.log(err);
  });
}));

/***/ }),
/* 125 */
/***/ (function(module, exports) {

module.exports = require("passport-github");

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(10);

module.exports = {
  srcDir: 'client/',
  /*
  ** Router config
  */
  router: {
    middleware: ['check-auth']
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Piper',
    meta: [{ charset: 'utf-8' }, { hid: 'viewport', name: 'viewport', content: 'width=device-width, initial-scale=1' }, { hid: 'description', name: 'description', content: 'A drag-and-drop mobile website builder base on Vue.' }],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
  ** Global CSS
  */
  css: ['@/assets/main.css', 'element-ui/lib/theme-default/index.css'],
  modules: ['@nuxtjs/pwa', '@nuxtjs/component-cache'],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build
  */
  build: {
    vendor: ['axios', 'element-ui', 'interactjs', 'lodash', 'qr.js', 'feather-icons']
  },
  plugins: ['@/plugins/filters.js', '@/plugins/element-ui.js', '@/plugins/axios-defaults']
};

/***/ })
/******/ ]);
//# sourceMappingURL=main.map