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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(14);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__db_js__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__changelog__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pages__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__users__ = __webpack_require__(20);
__webpack_require__(3).config();
var fs = __webpack_require__(4);
var path = __webpack_require__(2);
var Sequelize = __webpack_require__(16);
var env = "development" || "development";
// const config    = require('../../config/db.js')[env];

var config = __WEBPACK_IMPORTED_MODULE_0__db_js__["a" /* default */][env];





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
  sequelize = new Sequelize(config.url, params);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, params);
}

var db = {};

[__WEBPACK_IMPORTED_MODULE_1__changelog__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__pages__["a" /* default */], __WEBPACK_IMPORTED_MODULE_3__users__["a" /* default */]].forEach(function (md) {
  var model = md(sequelize, Sequelize);
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/* harmony default export */ __webpack_exports__["a"] = (db);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("koa-router");

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__qiniu__ = __webpack_require__(24);

// import opads from './opads'

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__qiniu__["a" /* default */]);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models__ = __webpack_require__(1);


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
/* 8 */
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
/* 9 */
/***/ (function(module, exports) {

module.exports = require("koa-passport");

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nuxt__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nuxt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_nuxt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_api__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models__ = __webpack_require__(1);





var app = new __WEBPACK_IMPORTED_MODULE_0_koa___default.a();
var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || 3000;

app.keys = ['i-love-piper'];
app.use(__webpack_require__(32)({}, app));

app.use(__webpack_require__(33)());
// app.use(require('./lib/errorlog'));

// authentication
__webpack_require__(34);
var passport = __webpack_require__(9);
app.use(passport.initialize());
app.use(passport.session());

var router = __webpack_require__(5)();

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
var config = __webpack_require__(36);
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
/* 11 */
/***/ (function(module, exports) {

module.exports = require("koa");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("nuxt");

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa_router__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_koa_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fs__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_fs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_path__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__controllers_changelogs__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__controllers_count__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__controllers_files__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__controllers_page__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__controllers_pages__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__controllers_publish__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__controllers_users__ = __webpack_require__(31);


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
/* 14 */
/***/ (function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models__ = __webpack_require__(1);


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
/* 16 */
/***/ (function(module, exports) {

module.exports = require("sequelize");

/***/ }),
/* 17 */,
/* 18 */
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
/* 19 */
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
/* 20 */
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
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models__ = __webpack_require__(1);


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
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_async_busboy__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_async_busboy___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_async_busboy__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_publish__ = __webpack_require__(6);


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
/* 23 */
/***/ (function(module, exports) {

module.exports = require("async-busboy");

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

__webpack_require__(3).config();
var _ = __webpack_require__(25);
var qiniu = __webpack_require__(26);

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
/* 25 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("qiniu");

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models__ = __webpack_require__(1);


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
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__page__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_path__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_fs__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_fs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_mkdirp__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_mkdirp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_mkdirp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__lib_publish__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_webshot__ = __webpack_require__(30);
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
/* 29 */
/***/ (function(module, exports) {

module.exports = require("mkdirp");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("webshot");

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models__ = __webpack_require__(1);


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
/* 32 */
/***/ (function(module, exports) {

module.exports = require("koa-session");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_fireyy_Works_piper_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models__ = __webpack_require__(1);


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

__webpack_require__(3).config();
var passport = __webpack_require__(9);


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

var GitHubStrategy = __webpack_require__(35).Strategy;
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
/* 35 */
/***/ (function(module, exports) {

module.exports = require("passport-github");

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {var path = __webpack_require__(2);

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
  css: ['@/assets/main.css'],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build
  */
  build: {
    vendor: ['axios', 'element-ui', 'interactjs', 'lodash', 'qr.js', 'feather-icons'],
    extend: function extend(config, _ref) {
      var dev = _ref.dev,
          isClient = _ref.isClient;

      config.resolve.alias['_variable.less'] = path.join(__dirname, './assets/skin/_variable.less'), config.resolve.alias['_base.less'] = path.join(__dirname, './assets/skin/_base.less');
    }
  },
  plugins: ['@/plugins/filters.js', '@/plugins/element-ui.js', '@/plugins/axios-defaults']
};
/* WEBPACK VAR INJECTION */}.call(exports, ""))

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__(3).config();

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

/***/ })
/******/ ]);
//# sourceMappingURL=main.map