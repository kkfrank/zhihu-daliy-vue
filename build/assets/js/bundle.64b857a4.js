webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = normalizeComponent;
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.formatDate = formatDate;
exports.formatDate2 = formatDate2;
exports.parseDate = parseDate;
exports.addDays = addDays;
exports.listenScrollBottom = listenScrollBottom;
exports.removeListenScrollBottom = removeListenScrollBottom;
exports.addTouchEvent = addTouchEvent;
function formatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    return year + month + day;
}

function formatDate2(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
}

function parseDate(str) {
    if (!/^(\d){8}$/.test(str)) throw "invalid date";
    var y = str.substr(0, 4),
        m = str.substr(4, 2) - 1,
        d = str.substr(6, 2);
    return new Date(y, m, d);
}

function addDays(date, n) {
    var time = date.getTime();
    var changedDate = new Date(time + n * 24 * 60 * 60 * 1000);
    var newDate = new Date();
    newDate.setTime(changedDate.getTime());
    return newDate;
}

var scrollHandler;
function listenScrollBottom(callback) {
    scrollHandler = function scrollHandler() {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop !== 0 && scrollTop + document.documentElement.clientHeight === document.documentElement.scrollHeight) {
            callback();
        }
    };
    window.addEventListener('scroll', scrollHandler);
}

function removeListenScrollBottom() {
    window.removeEventListener('scroll', scrollHandler);
}

var startX = void 0,
    startY = void 0,
    prevX = 0,
    prevY = 0;
function addTouchEvent(el, callback) {
    el.addEventListener('touchstart', function (ev) {
        startX = prevX = ev.touches[0].pageX;
        startY = prevY = ev.touches[0].pageY;
    });

    el.addEventListener('touchmove', function (ev) {
        var x = ev.touches[0].pageX;
        var y = ev.touches[0].pageY;
        var changedX = x - prevX;
        var changedY = y - prevY;

        prevX = x;
        prevY = y;

        if (changedX <= 2 && changedY <= 2) {
            return;
        }

        var directionX = changedX < 0 ? 'left' : 'right';
        var directionY = changedY < 0 ? 'bottom' : 'top';

        callback({
            type: 'touchmove',
            directionX: directionX,
            directionY: directionY,
            changedX: changedX,
            changedY: changedY
        });
    });

    el.addEventListener('touchend', function (ev) {
        var x = ev.changedTouches[0].pageX;
        var y = ev.changedTouches[0].pageY;

        var changedX = x - startX;
        var changedY = y - startY;

        if (Math.abs(changedX) < 5 && Math.abs(changedY) < 5) {
            return;
        }
        var directionX = changedX < 0 ? 'left' : 'right';
        var directionY = changedY < 0 ? 'bottom' : 'top';

        callback({
            type: 'touchend',
            directionX: directionX,
            directionY: directionY,
            changedX: changedX,
            changedY: changedY
        });
    });
}

/***/ }),
/* 4 */,
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__TopHeader_vue_vue_type_template_id_7efcc8d8___ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__TopHeader_vue_vue_type_script_lang_js___ = __webpack_require__(20);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__TopHeader_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__TopHeader_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__TopHeader_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__ = __webpack_require__(1);






/* normalize component */

var component = Object(__WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_1__TopHeader_vue_vue_type_script_lang_js___["default"],
  __WEBPACK_IMPORTED_MODULE_0__TopHeader_vue_vue_type_template_id_7efcc8d8___["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_0__TopHeader_vue_vue_type_template_id_7efcc8d8___["b" /* staticRenderFns */],
  false,
  null,
  null,
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = __webpack_require__(40);

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var corsUrl = 'https://cors-anywhere.herokuapp.com/';
//https://news-at.zhihu.com/api/4/news/latest
var BaseUrl = 'http://127.0.0.1:9001/api/4';
if (true) {
    BaseUrl = corsUrl + 'https://news-at.zhihu.com/api/4';
}

exports.default = {
    get: function get(url) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        return new Promise(function (resolve, reject) {
            _axios2.default.get(BaseUrl + url, { params: params }).then(function (res) {
                resolve(res.data);
            }).catch(function (err) {
                reject(err);
            });
        });
    },
    post: function post(url) {
        return new Promise(function (resolve, reject) {
            _axios2.default.post(BaseUrl + url).then(function (res) {
                resolve(res.data);
            }).catch(function (err) {
                reject(err);
            });
        });
    }
};

// export default {
//     post(url, data, params){
//         return new Promise((resolve, reject) => {
//              fetch(BaseUrl + url, { method: 'POST' })
//                 .then(res => resolve(res.json()))
//                 .catch(err => {
//                     reject({
//                         message: err
//                     })
//                 })
//         })
//     },
//     get(url, params = {}){
//         return new Promise((resolve, reject) => {
//             fetch(BaseUrl + url, { method: 'GET' })
//                 .then(res => resolve(res.json()))
//                 .catch(err => reject({ message: err }))
//         })
//     }
// }

/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js___ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Modal = __webpack_require__(51);

var _Modal2 = _interopRequireDefault(_Modal);

var _Loading = __webpack_require__(55);

var _Loading2 = _interopRequireDefault(_Loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
	created: function created() {},

	computed: {
		loading: function loading() {
			return this.$store.state.loadingError.loading;
		},
		errorMsg: function errorMsg() {
			return this.$store.state.loadingError.errorMsg;
		}
	},
	methods: {
		handleOk: function handleOk() {
			this.$store.commit('clearErrorMsg');
		},
		handleCancel: function handleCancel() {
			this.$store.commit('clearErrorMsg');
		}
	},
	components: {
		Modal: _Modal2.default,
		Loading: _Loading2.default
	}
};

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_script_lang_js___ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
    props: ['visible', 'title', 'confirmLoading'],
    methods: {
        handleOk: function handleOk() {
            this.$emit('on-ok', '');
        },
        handleCancel: function handleCancel() {
            this.$emit('on-cancel', '');
        },
        handleKeyDown: function handleKeyDown(event) {
            if (event.keyCode === 27) {
                // esc
                this.handleCancel();
            }
        }
    },
    data: function data() {
        return {
            defaultTitle: '提示'
        };
    }
};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_script_lang_js___ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//

exports.default = {
    props: ['loading']
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 16 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 17 */,
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js___ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _TopHeader = __webpack_require__(5);

var _TopHeader2 = _interopRequireDefault(_TopHeader);

var _Slider = __webpack_require__(67);

var _Slider2 = _interopRequireDefault(_Slider);

var _NewsList = __webpack_require__(71);

var _NewsList2 = _interopRequireDefault(_NewsList);

var _utils = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
	created: function created() {
		var that = this;
		if (this.newsList.length > 0) {
			return;
		}
		this.$store.dispatch({ type: "getHomeLatest" }).then(function () {
			that.$store.dispatch({ type: 'getBeforeNews' });
		}).catch(function (err) {
			console.log('errrrrr', err);
		});
	},
	mounted: function mounted() {
		var that = this;
		document.documentElement.scrollTop = this.scrollTop;
		(0, _utils.listenScrollBottom)(function () {
			console.log('to bttom');
			that.$store.dispatch({ type: "getBeforeNews" });
		});
	},
	destroyed: function destroyed() {
		(0, _utils.removeListenScrollBottom)();
	},
	methods: {},
	components: {
		TopHeader: _TopHeader2.default,
		Slider: _Slider2.default,
		NewsList: _NewsList2.default
	},
	computed: {
		scrollTop: function scrollTop() {
			return this.$store.state.home.scrollTop;
		},
		newsList: function newsList() {
			return this.$store.state.home.storyList;
		},
		sliderList: function sliderList() {
			return this.$store.state.home.topStoryList;
		}
	}
};

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_script_lang_js___ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
//
//
//
//
//
//
//
//

exports.default = {
	props: ['title']
};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_script_lang_js___ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = __webpack_require__(3);

exports.default = {
    props: ['list', "defaultActive"],
    data: function data() {
        return {
            active: this.defaultActive
        };
    },

    mounted: function mounted() {
        var that = this;
        (0, _utils.addTouchEvent)(document.querySelector('.slider-box'), function (event) {
            if (event.type === 'touchend') {
                if (event.directionX === 'left') {
                    if (that.active === that.list.length - 1) {
                        return;
                    }
                    that.active = that.active + 1;
                } else if (event.directionX === 'right') {
                    if (that.active === 0) {
                        return;
                    }
                    that.active = that.active - 1;
                }
            }
        });
    },
    computed: {
        leftPostion: function leftPostion() {
            return -(this.active * 100) + '%';
        }
    },
    methods: {
        jumpTo: function jumpTo(page) {
            this.active = page;
        }
    }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 25 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_script_lang_js___ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
							value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
							props: ['list']
};

/***/ }),
/* 28 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_script_lang_js___ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var _TopHeader = __webpack_require__(5);

var _TopHeader2 = _interopRequireDefault(_TopHeader);

var _vuex = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	computed: _extends({
		storyId: function storyId() {
			return this.$route.params.id;
		}
	}, (0, _vuex.mapState)({
		body: function body(state) {
			return state.newsDetail.body;
		},
		title: function title(state) {
			return state.newsDetail.title;
		},
		image: function image(state) {
			return state.newsDetail.image;
		},
		imageSource: function imageSource(state) {
			return state.newsDetail.imageSource;
		},
		extra: function extra(state) {
			return state.newsDetail.extra;
		}
	})),
	beforeRouteEnter: function beforeRouteEnter(to, from, next) {
		var scrollTop = document.documentElement.scrollTop;
		next(function (vm) {
			if (from.path === '/') {
				// from list page, clear detail data and save before scrollTop postion
				vm.$store.commit('setNewsListScrollTop', scrollTop);
				//                    vm.$store.commit('clearNewsDetail')
			}
		});
	},
	beforeRouteLeave: function beforeRouteLeave(to, from, next) {
		var scrollTop = document.documentElement.scrollTop;
		var path = to.path;
		next(function (vm) {
			//                if(path === '/'){
			//                    vm.$store.commit('clearNewsDetail')
			//				}
			//				if(to.path.test(/^\/details\/[\d]+\/comments/)){// to commnets page, save scrollTop postion
			//                    console.log('not clearNewsDetail')
			//                    vm.$store.commit('setNewsDetailScrollTop', scrollTop)
			//				}else{
			//				    console.log('clearNewsDetail')
			//                    vm.$store.commit('clearNewsDetail')
			//				}
		});
	},

	methods: {
		goBack: function goBack() {
			this.$store.commit('clearNewsDetail');
			this.$router.back();
		}
	},
	created: function created() {
		var id = this.$route.params.id;
		var _$store$state$newsDet = this.$store.state.newsDetail,
		    body = _$store$state$newsDet.body,
		    scrollTop = _$store$state$newsDet.scrollTop;

		if (body) {
			document.documentElement.scrollTop = scrollTop;
			return;
		}
		document.documentElement.scrollTop = 0;
		this.$store.dispatch({ type: "getNewsDetail", id: id });
		this.$store.dispatch({ type: "getNewsExtra", id: id });
	},
	mounted: function mounted() {
		//document.documentElement.scrollTop = 0
	},
	destroyed: function destroyed() {
		//this.$store.commit('clearNewsDetail')
	},
	components: {
		TopHeader: _TopHeader2.default
	}
};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_script_lang_js___ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var _vuex = __webpack_require__(4);

var _TopHeader = __webpack_require__(5);

var _TopHeader2 = _interopRequireDefault(_TopHeader);

var _CommentItem = __webpack_require__(82);

var _CommentItem2 = _interopRequireDefault(_CommentItem);

var _utils = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    computed: _extends({
        storyId: function storyId() {
            return this.$route.params.id;
        }
    }, (0, _vuex.mapState)({
        shortCommentList: function shortCommentList(state) {
            return state.commentList.shortCommentList;
        },
        longCommentList: function longCommentList(state) {
            return state.commentList.longCommentList;
        },
        extra: function extra(state) {
            return state.newsDetail.extra;
        }
    })),
    methods: {
        goBack: function goBack() {
            this.$router.back();
            //                this.$store.commit('clearDetailAll')
        }
    },
    created: function created() {
        document.documentElement.scrollTop = 0;
        this.$store.dispatch({ type: "getLongCommentList", id: this.storyId });
        this.$store.dispatch({ type: "getShortCommentList", id: this.storyId });
        this.$store.dispatch({ type: "getNewsExtra", id: this.storyId });
    },
    mounted: function mounted() {
        var that = this;
        (0, _utils.listenScrollBottom)(function () {
            that.$store.dispatch({ type: "getShortCommentListBefore", id: that.storyId });
        });
    },
    destroyed: function destroyed() {
        console.log('CommentList destroyed');
        this.$store.commit('clearCommentList');
        (0, _utils.removeListenScrollBottom)();
    },
    components: {
        TopHeader: _TopHeader2.default,
        CommentItem: _CommentItem2.default
    }
};

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_script_lang_js___ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = __webpack_require__(3);

exports.default = {
    props: ['comment'],
    mounted: function mounted() {},
    methods: {
        formatTime: function formatTime(time) {
            (0, _utils.formatDate2)(new Date(time + '000' - 0));
        }
    }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 36 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 37 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_script_lang_js___ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
//
//
//
//
//
//
//
//
//

exports.default = {
	data: function data() {
		return {
			name: "范凯凯",
			email: "360305993@qq.com"
		};
	}
};

/***/ }),
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(2);

var _vue2 = _interopRequireDefault(_vue);

var _App = __webpack_require__(48);

var _App2 = _interopRequireDefault(_App);

var _index = __webpack_require__(60);

var _index2 = _interopRequireDefault(_index);

var _index3 = __webpack_require__(90);

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.config.productionTip = true;

new _vue2.default({
	el: '#root',
	router: _index2.default,
	store: _index4.default,
	// template: '<App/>',
	// components: { App },
	render: function render(h) {
		return h(_App2.default);
	}
});

/***/ }),
/* 47 */,
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__App_vue_vue_type_template_id_9adadc14___ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App_vue_vue_type_script_lang_js___ = __webpack_require__(8);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__App_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__App_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__App_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__ = __webpack_require__(1);






/* normalize component */

var component = Object(__WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_1__App_vue_vue_type_script_lang_js___["default"],
  __WEBPACK_IMPORTED_MODULE_0__App_vue_vue_type_template_id_9adadc14___["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_0__App_vue_vue_type_template_id_9adadc14___["b" /* staticRenderFns */],
  false,
  null,
  null,
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_template_id_9adadc14___ = __webpack_require__(50);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_template_id_9adadc14___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_template_id_9adadc14___["b"]; });


/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"app"}},[_c('Modal',{attrs:{"visible":_vm.errorMsg!==""},on:{"on-ok":_vm.handleOk,"on-cancel":_vm.handleCancel}},[_c('p',{attrs:{"slot":"content"},slot:"content"},[_vm._v(" "+_vm._s(_vm.errorMsg))])]),_vm._v(" "),_c('Loading',{attrs:{"loading":_vm.loading}}),_vm._v(" "),_c('router-view')],1)}
var staticRenderFns = []



/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Modal_vue_vue_type_template_id_7f6eb66c___ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Modal_vue_vue_type_script_lang_js___ = __webpack_require__(10);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__Modal_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__Modal_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Modal_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__ = __webpack_require__(1);






/* normalize component */

var component = Object(__WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_1__Modal_vue_vue_type_script_lang_js___["default"],
  __WEBPACK_IMPORTED_MODULE_0__Modal_vue_vue_type_template_id_7f6eb66c___["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_0__Modal_vue_vue_type_template_id_7f6eb66c___["b" /* staticRenderFns */],
  false,
  null,
  null,
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_template_id_7f6eb66c___ = __webpack_require__(53);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_template_id_7f6eb66c___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_template_id_7f6eb66c___["b"]; });


/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.visible),expression:"visible"}],staticClass:"modal-box"},[_c('div',{staticClass:"modal-mask",on:{"click":_vm.handleCancel}}),_vm._v(" "),_c('div',{staticClass:"modal-content",attrs:{"tabIndex":"0"},on:{"keydown":_vm.handleKeyDown}},[_c('div',{staticClass:"modal-header"},[_vm._v("\n            "+_vm._s(_vm.title || _vm.defaultTitle)+"\n            "),_c('i',{staticClass:"right",on:{"click":_vm.handleCancel}},[_vm._v("x")])]),_vm._v(" "),_c('div',{staticClass:"modal-body"},[_vm._t("content")],2),_vm._v(" "),_c('div',{staticClass:"modal-footer"},[_c('button',{staticClass:"btn default mr10",on:{"click":_vm.handleCancel}},[_vm._v("取消")]),_vm._v(" "),_c('button',{class:("btn " + (_vm.confirmLoading ? 'disabled' : '')),on:{"click":_vm.handleOk}},[_vm._v("确定")])])])])}
var staticRenderFns = []



/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_style_index_0_lang_scss____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_style_index_0_lang_scss___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_style_index_0_lang_scss____default.a); 

/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Loading_vue_vue_type_template_id_329b6237___ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Loading_vue_vue_type_script_lang_js___ = __webpack_require__(13);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__Loading_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__Loading_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Loading_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__ = __webpack_require__(1);






/* normalize component */

var component = Object(__WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_1__Loading_vue_vue_type_script_lang_js___["default"],
  __WEBPACK_IMPORTED_MODULE_0__Loading_vue_vue_type_template_id_329b6237___["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_0__Loading_vue_vue_type_template_id_329b6237___["b" /* staticRenderFns */],
  false,
  null,
  null,
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_template_id_329b6237___ = __webpack_require__(57);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_template_id_329b6237___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_template_id_329b6237___["b"]; });


/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.loading),expression:"loading"}],staticClass:"loading"})}
var staticRenderFns = []



/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_style_index_0_lang_css____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_style_index_0_lang_css___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_style_index_0_lang_css____default.a); 

/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_css____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_css___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_css____default.a); 

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _vue = __webpack_require__(2);

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = __webpack_require__(17);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _Home = __webpack_require__(61);

var _Home2 = _interopRequireDefault(_Home);

var _NewsDetail = __webpack_require__(75);

var _NewsDetail2 = _interopRequireDefault(_NewsDetail);

var _CommentList = __webpack_require__(79);

var _CommentList2 = _interopRequireDefault(_CommentList);

var _About = __webpack_require__(87);

var _About2 = _interopRequireDefault(_About);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueRouter2.default);

var routes = [{
	path: '/about',
	component: _About2.default
}, {
	path: '/details/:id',
	component: _NewsDetail2.default
}, {
	path: '/details/:id/comments',
	component: _CommentList2.default
}, {
	path: '/',
	component: _Home2.default
}];

exports.default = new _vueRouter2.default({
	routes: routes
});

/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Home_vue_vue_type_template_id_e55c7dac___ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Home_vue_vue_type_script_lang_js___ = __webpack_require__(18);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__Home_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__Home_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_componentNormalizer_js__ = __webpack_require__(1);





/* normalize component */

var component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_componentNormalizer_js__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_1__Home_vue_vue_type_script_lang_js___["default"],
  __WEBPACK_IMPORTED_MODULE_0__Home_vue_vue_type_template_id_e55c7dac___["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_0__Home_vue_vue_type_template_id_e55c7dac___["b" /* staticRenderFns */],
  false,
  null,
  null,
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_e55c7dac___ = __webpack_require__(63);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_e55c7dac___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_e55c7dac___["b"]; });


/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"container"},[_c('TopHeader',{attrs:{"title":"知乎日报"}},[_c('div',{staticClass:"navbar-right",attrs:{"slot":"right"},slot:"right"})]),_vm._v(" "),_c('div',{staticClass:"main"},[_c('Slider',{attrs:{"list":_vm.sliderList,"defaultActive":0}}),_vm._v(" "),_c('NewsList',{attrs:{"list":_vm.newsList}})],1)],1)}
var staticRenderFns = []



/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_template_id_7efcc8d8___ = __webpack_require__(65);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_template_id_7efcc8d8___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_template_id_7efcc8d8___["b"]; });


/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('header',{staticClass:"navbar"},[_vm._t("left"),_vm._v(" "),_c('h1',{directives:[{name:"show",rawName:"v-show",value:(_vm.title!=null),expression:"title!=null"}],staticClass:"navbar-title"},[_vm._v(_vm._s(_vm.title))]),_vm._v(" "),_vm._t("right")],2)}
var staticRenderFns = []



/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_style_index_0_lang_scss____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_style_index_0_lang_scss___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_style_index_0_lang_scss____default.a); 

/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Slider_vue_vue_type_template_id_9885a82c___ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Slider_vue_vue_type_script_lang_js___ = __webpack_require__(23);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__Slider_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__Slider_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Slider_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__ = __webpack_require__(1);






/* normalize component */

var component = Object(__WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_1__Slider_vue_vue_type_script_lang_js___["default"],
  __WEBPACK_IMPORTED_MODULE_0__Slider_vue_vue_type_template_id_9885a82c___["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_0__Slider_vue_vue_type_template_id_9885a82c___["b" /* staticRenderFns */],
  false,
  null,
  null,
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_template_id_9885a82c___ = __webpack_require__(69);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_template_id_9885a82c___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_template_id_9885a82c___["b"]; });


/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"slider-box"},[_c('div',{staticClass:"slider-inner",style:({width:_vm.list.length+'00%',left: _vm.leftPostion})},_vm._l((_vm.list),function(item){return _c('router-link',{key:item.id,staticClass:"slider-link",style:({backgroundImage:'url('+item.image+')'}),attrs:{"to":'/details/'+item.id}},[_c('div',{staticClass:"detail-overlay"}),_vm._v(" "),_c('h3',[_vm._v(_vm._s(item.title))])])})),_vm._v(" "),_c('ul',{staticClass:"slider-nums"},_vm._l((_vm.list.length),function(i){return _c('li',{class:{ on: _vm.active === i-1 },on:{"click":function($event){_vm.jumpTo(i-1)}}})}))])}
var staticRenderFns = []



/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_style_index_0_lang_css____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_style_index_0_lang_css___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_style_index_0_lang_css____default.a); 

/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__NewsList_vue_vue_type_template_id_27eb43b2___ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__NewsList_vue_vue_type_script_lang_js___ = __webpack_require__(26);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__NewsList_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__NewsList_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__NewsList_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__ = __webpack_require__(1);






/* normalize component */

var component = Object(__WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_1__NewsList_vue_vue_type_script_lang_js___["default"],
  __WEBPACK_IMPORTED_MODULE_0__NewsList_vue_vue_type_template_id_27eb43b2___["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_0__NewsList_vue_vue_type_template_id_27eb43b2___["b" /* staticRenderFns */],
  false,
  null,
  null,
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_template_id_27eb43b2___ = __webpack_require__(73);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_template_id_27eb43b2___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_template_id_27eb43b2___["b"]; });


/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"list-box"},_vm._l((_vm.list),function(data,index){return _c('div',[_c('h3',{staticClass:"list-title"},[_vm._v("\n\t\t\t"+_vm._s(index===0 ? '' : data.date)+"\n\t\t")]),_vm._v(" "),_c('ul',_vm._l((data.stories),function(item){return _c('li',[_c('router-link',{attrs:{"to":("/details/" + (item.id))}},[_c('span',[_vm._v(_vm._s(item.title))]),_vm._v(" "),(item.images)?_c('img',{attrs:{"src":item.images[0]}}):_vm._e()])],1)}))])}))}
var staticRenderFns = []



/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_style_index_0_lang_css____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_style_index_0_lang_css___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_0_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_style_index_0_lang_css____default.a); 

/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__NewsDetail_vue_vue_type_template_id_e12ffb64___ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__NewsDetail_vue_vue_type_script_lang_js___ = __webpack_require__(29);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__NewsDetail_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__NewsDetail_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__NewsDetail_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__ = __webpack_require__(1);






/* normalize component */

var component = Object(__WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_1__NewsDetail_vue_vue_type_script_lang_js___["default"],
  __WEBPACK_IMPORTED_MODULE_0__NewsDetail_vue_vue_type_template_id_e12ffb64___["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_0__NewsDetail_vue_vue_type_template_id_e12ffb64___["b" /* staticRenderFns */],
  false,
  null,
  null,
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_template_id_e12ffb64___ = __webpack_require__(77);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_template_id_e12ffb64___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_template_id_e12ffb64___["b"]; });


/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('TopHeader',{staticClass:"detail-header header"},[_c('span',{staticClass:"navbar-left",attrs:{"slot":"left"},on:{"click":_vm.goBack},slot:"left"},[_c('i',{staticClass:"fa fa-chevron-left"})]),_vm._v(" "),_c('div',{staticClass:"navbar-right-detail",attrs:{"slot":"right"},slot:"right"},[_c('router-link',{attrs:{"to":("/details/" + _vm.storyId + "/comments")}},[_c('i',{staticClass:"fa fa-comment-o"}),_vm._v(" "),_c('span',{staticClass:"ml-6"},[_vm._v(_vm._s(_vm.extra.commentCount))])]),_vm._v(" "),_c('div',{staticClass:"func-btn"},[_c('i',{staticClass:"fa fa-thumbs-o-up"}),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.extra.popularityCount))])])],1)]),_vm._v(" "),_c('div',{staticClass:"detial-box"},[_c('div',{staticClass:"detail-img-box"},[_c('img',{attrs:{"src":_vm.image,"alt":"picture"}}),_vm._v(" "),_c('div',{staticClass:"detail-overlay"}),_vm._v(" "),_c('h2',[_vm._v(_vm._s(_vm.title))]),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.imageSource))])]),_vm._v(" "),_c('div',{staticClass:"detail-content-box",domProps:{"innerHTML":_vm._s(_vm.body)}})])],1)}
var staticRenderFns = []



/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_style_index_0_lang_scss____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_style_index_0_lang_scss___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_style_index_0_lang_scss____default.a); 

/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CommentList_vue_vue_type_template_id_963691f2___ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CommentList_vue_vue_type_script_lang_js___ = __webpack_require__(32);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__CommentList_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__CommentList_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CommentList_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__ = __webpack_require__(1);






/* normalize component */

var component = Object(__WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_1__CommentList_vue_vue_type_script_lang_js___["default"],
  __WEBPACK_IMPORTED_MODULE_0__CommentList_vue_vue_type_template_id_963691f2___["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_0__CommentList_vue_vue_type_template_id_963691f2___["b" /* staticRenderFns */],
  false,
  null,
  null,
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_template_id_963691f2___ = __webpack_require__(81);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_template_id_963691f2___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_template_id_963691f2___["b"]; });


/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('TopHeader',{attrs:{"title":((_vm.extra.commentCount) + "条评论")}},[_c('span',{staticClass:"navbar-left",attrs:{"slot":"left"},on:{"click":_vm.goBack},slot:"left"},[_c('i',{staticClass:"fa fa-chevron-left"})])]),_vm._v(" "),_c('div',{staticClass:"comment-box"},[(_vm.longCommentList.length > 0)?_c('div',{staticClass:"comment-title"},[_vm._v(_vm._s(_vm.extra.longCommentCount)+" 条长评")]):_vm._e(),_vm._v(" "),_vm._l((_vm.longCommentList),function(item){return [_c('CommentItem',{attrs:{"comment":item}})]}),_vm._v(" "),(_vm.shortCommentList.length >0)?_c('div',{staticClass:"comment-title"},[_vm._v(_vm._s(_vm.extra.shortCommentCount)+" 条短评")]):_vm._e(),_vm._v(" "),_vm._l((_vm.shortCommentList),function(item){return [_c('CommentItem',{attrs:{"comment":item}})]})],2)],1)}
var staticRenderFns = []



/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CommentItem_vue_vue_type_template_id_891e0c8a___ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CommentItem_vue_vue_type_script_lang_js___ = __webpack_require__(34);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__CommentItem_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__CommentItem_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CommentItem_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__ = __webpack_require__(1);






/* normalize component */

var component = Object(__WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_1__CommentItem_vue_vue_type_script_lang_js___["default"],
  __WEBPACK_IMPORTED_MODULE_0__CommentItem_vue_vue_type_template_id_891e0c8a___["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_0__CommentItem_vue_vue_type_template_id_891e0c8a___["b" /* staticRenderFns */],
  false,
  null,
  null,
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_template_id_891e0c8a___ = __webpack_require__(84);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_template_id_891e0c8a___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_template_id_891e0c8a___["b"]; });


/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"comment-item clear"},[_c('img',{staticClass:"avatar",attrs:{"src":_vm.comment.avatar}}),_vm._v(" "),_c('div',{staticClass:"comment-detail"},[_c('div',{staticClass:"comment-author"},[_vm._v(_vm._s(_vm.comment.author))]),_vm._v(" "),_c('p',{staticClass:"comment-content"},[_vm._v(_vm._s(_vm.comment.content))]),_vm._v(" "),(_vm.comment.reply_to)?_c('div',{staticClass:"replay-to"},[_c('div',[_vm._v("// "+_vm._s(_vm.comment.reply_to.author)+": "+_vm._s(_vm.comment.reply_to.content))])]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"comment-other clear"},[_c('span',{staticClass:"time"},[_vm._v(_vm._s(_vm.formatTime(_vm.comment.time)))]),_vm._v(" "),_vm._m(0),_vm._v(" "),_c('div',{staticClass:"comment-like"},[_c('span',[_vm._v(_vm._s(_vm.comment.likes))]),_c('i',{staticClass:"fa fa-thumbs-o-up"})])])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"comment-judge"},[_c('i',{staticClass:"fa fa-comment-o"})])}]



/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_style_index_0_lang_scss____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_style_index_0_lang_scss___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_style_index_0_lang_scss____default.a); 

/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_style_index_0_lang_scss____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_style_index_0_lang_scss___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_extract_text_webpack_plugin_dist_loader_js_ref_1_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_style_index_0_lang_scss____default.a); 

/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__About_vue_vue_type_template_id_c1267732___ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__About_vue_vue_type_script_lang_js___ = __webpack_require__(38);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__About_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__About_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_componentNormalizer_js__ = __webpack_require__(1);





/* normalize component */

var component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_componentNormalizer_js__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_1__About_vue_vue_type_script_lang_js___["default"],
  __WEBPACK_IMPORTED_MODULE_0__About_vue_vue_type_template_id_c1267732___["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_0__About_vue_vue_type_template_id_c1267732___["b" /* staticRenderFns */],
  false,
  null,
  null,
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_template_id_c1267732___ = __webpack_require__(89);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_template_id_c1267732___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_template_id_c1267732___["b"]; });


/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('ul',[_c('li',[_vm._v(_vm._s(_vm.name))]),_vm._v(" "),_c('li',[_vm._v(_vm._s(_vm.email))])])])}
var staticRenderFns = []



/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _vue = __webpack_require__(2);

var _vue2 = _interopRequireDefault(_vue);

var _vuex = __webpack_require__(4);

var _vuex2 = _interopRequireDefault(_vuex);

var _home = __webpack_require__(91);

var _home2 = _interopRequireDefault(_home);

var _news_detail = __webpack_require__(111);

var _news_detail2 = _interopRequireDefault(_news_detail);

var _loading_error = __webpack_require__(112);

var _loading_error2 = _interopRequireDefault(_loading_error);

var _comment_list = __webpack_require__(114);

var _comment_list2 = _interopRequireDefault(_comment_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vuex2.default);

var store = new _vuex2.default.Store({
	modules: {
		home: _home2.default,
		newsDetail: _news_detail2.default,
		commentList: _comment_list2.default,
		loadingError: _loading_error2.default
	}
	// state:{
	// 	loading:false,
	// },
	// mutations:{
	// 	setScrollTop(state){
	// 		document.body.scrollTop=state.prevScrollTop
	// 	},
	// 	setLoading(state,loading){
	// 		state.loading=loading
	// 	}
	// }
});

exports.default = store;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // import API from '../api/index.js'


var _connection = __webpack_require__(6);

var _connection2 = _interopRequireDefault(_connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	state: {
		nowDate: null,
		scrollTop: 0,
		topStoryList: [],
		storyList: []
	},
	getters: {},
	mutations: {
		setLatestNews: function setLatestNews(state, data) {
			state.nowDate = data.date;
			state.topStoryList = data.top_stories;
			state.storyList.push(_extends({}, data));
			//state.storyList = [...state.storyList, ...addDateToStory(data.stories, data.date)]
		},
		setBeforeNews: function setBeforeNews(state, data) {
			state.nowDate = data.date;
			state.storyList.push(_extends({}, data));
		},
		setNewsListScrollTop: function setNewsListScrollTop(state, data) {
			state.scrollTop = data;
		}
	},
	actions: {
		getHomeLatest: function getHomeLatest(context) {
			document.body.scrollTop = 0;
			context.commit('showLoading');
			return new Promise(function (resolve, reject) {
				_connection2.default.get('/news/latest').then(function (data) {
					context.commit('hideLoading');
					context.commit('setLatestNews', data);
					// context.dispatch('getBeforeNews')
					resolve(data);
				}).catch(function (err) {
					context.commit('setErrorMsg', err.message);
					context.commit('hideLoading');
					reject(err);
				});
			});
		},
		getBeforeNews: function getBeforeNews(_ref) {
			var state = _ref.state,
			    rootState = _ref.rootState,
			    commit = _ref.commit;

			var date = state.nowDate;
			var loading = rootState.loadingError.loading;

			if (loading || !date) {
				return;
			}
			commit('showLoading');
			_connection2.default.get('/news/before/' + date).then(function (data) {
				commit('hideLoading');
				commit('setBeforeNews', data);
			}).catch(function (err) {
				commit('setErrorMsg', err.message);
			});
		}
	}
};


function addDateToStory(storyList, date) {
	return storyList.map(function (item) {
		return _extends({}, item, {
			date: date
		});
	});
}

/***/ }),
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _connection = __webpack_require__(6);

var _connection2 = _interopRequireDefault(_connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    state: {
        scrollTop: 0,
        body: '',
        title: '',
        image: '',
        imageSource: '',
        extra: {
            commentCount: 0,
            longCommentCount: 0,
            shortCommentCount: 0,
            popularityCount: 0
        }
    },
    mutations: {
        setNewsDetail: function setNewsDetail(state, data) {
            state.body = data.body;
            state.title = data.title;
            state.image = data.image;
            state.imageSource = data.imageSource;
            state.body = data.body;
        },
        setNewsExtra: function setNewsExtra(state, data) {
            state.extra.longCommentCount = data.long_comments;
            state.extra.shortCommentCount = data.short_comments;
            state.extra.commentCount = data.comments;
            state.extra.popularityCount = data.popularity;
        },
        setNewsDetailScrollTop: function setNewsDetailScrollTop(state, data) {
            state.scrollTop = data;
        },
        clearNewsDetail: function clearNewsDetail(state) {
            state.body = '';
            state.title = '';
            state.image = '';
            state.imageSource = '';
            state.extra.commentCount = 0;
            state.extra.longCommentCount = 0;
            state.extra.longCommentCount = 0;
            state.extra.popularityCount = 0;
        }
    },
    actions: {
        getNewsDetail: function getNewsDetail(_ref, _ref2) {
            var commit = _ref.commit;
            var id = _ref2.id;

            commit('showLoading');
            _connection2.default.get('/news/' + id).then(function (data) {
                commit('hideLoading');
                commit('setNewsDetail', data);
            }).catch(function (err) {
                commit('hideLoading');
                commit('setErrorMsg', err.message);
            });
        },
        getNewsExtra: function getNewsExtra(_ref3, _ref4) {
            var commit = _ref3.commit;
            var id = _ref4.id;

            commit('showLoading');
            _connection2.default.get('/story-extra/' + id).then(function (data) {
                commit('hideLoading');
                commit('setNewsExtra', data);
            }).catch(function (err) {
                commit('hideLoading');
                commit('setErrorMsg', err.message);
            });
        }
    }
};

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _loading_error = __webpack_require__(113);

exports.default = {
	state: {
		loading: false,
		errorMsg: ''
	},
	mutations: {
		showLoading: function showLoading(state) {
			state.loading = true;
			state.errorMsg = '';
		},
		hideLoading: function hideLoading(state) {
			state.loading = false;
		},
		setErrorMsg: function setErrorMsg(state, errorMsg) {
			state.errorMsg = errorMsg;
			state.loading = false;
		},
		clearErrorMsg: function clearErrorMsg(state) {
			state.errorMsg = '';
		}
	}
};

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SHOW_LOADING = exports.SHOW_LOADING = 'SHOW_LOADING';
var HIDE_LOADING = exports.HIDE_LOADING = 'HIDE_LOADING';
var SET_ERROR_MSG = exports.SET_ERROR_MSG = 'SET_ERROR_MSG';
var CLEAR_ERROR_MSG = exports.CLEAR_ERROR_MSG = 'CLEAR_ERROR_MSG';

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _connection = __webpack_require__(6);

var _connection2 = _interopRequireDefault(_connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = {
    state: {
        shortCommentList: [],
        longCommentList: []
    },
    mutations: {
        setShortCommentList: function setShortCommentList(state, data) {
            state.shortCommentList = data;
        },
        setLongCommentList: function setLongCommentList(state, data) {
            state.longCommentList = data;
        },
        setShortCommentListBefore: function setShortCommentListBefore(state, data) {
            state.shortCommentList = [].concat(_toConsumableArray(state.shortCommentList), _toConsumableArray(data));
        },
        setLongCommentListBefore: function setLongCommentListBefore(state, data) {
            state.longCommentList = [].concat(_toConsumableArray(state.longCommentList), _toConsumableArray(data));
        },
        clearCommentList: function clearCommentList(state) {
            state.shortCommentList = [];
            state.longCommentList = [];
        }
    },
    actions: {
        getShortCommentList: function getShortCommentList(_ref, _ref2) {
            var commit = _ref.commit,
                dispatch = _ref.dispatch;
            var id = _ref2.id;

            commit('showLoading');
            _connection2.default.get('/story/' + id + '/short-comments').then(function (data) {
                commit('hideLoading');
                commit('setShortCommentList', data.comments);
            }).catch(function (err) {
                commit('hideLoading');
                commit('setErrorMsg', err.message);
            });
        },
        getLongCommentList: function getLongCommentList(_ref3, _ref4) {
            var commit = _ref3.commit,
                dispatch = _ref3.dispatch;
            var id = _ref4.id;

            commit('showLoading');
            _connection2.default.get('/story/' + id + '/long-comments').then(function (data) {
                commit('hideLoading');
                commit('setLongCommentList', data.comments);
            }).catch(function (err) {
                commit('hideLoading');
                commit('setErrorMsg', err.message);
            });
        },
        getShortCommentListBefore: function getShortCommentListBefore(_ref5, _ref6) {
            var commit = _ref5.commit,
                dispatch = _ref5.dispatch,
                state = _ref5.state,
                rootState = _ref5.rootState;
            var id = _ref6.id;
            var loading = rootState.loadingError.loading;

            if (loading) {
                return;
            }

            commit('showLoading');
            var lastCommentId = state.shortCommentList[state.shortCommentList.length - 1].id;
            _connection2.default.get('/story/' + id + '/short-comments/before/' + lastCommentId).then(function (data) {
                commit('hideLoading');
                commit('setShortCommentListBefore', data.comments);
            }).catch(function (err) {
                commit('hideLoading');
                commit('setErrorMsg', err.message);
            });
        },
        getLongCommentListBefore: function getLongCommentListBefore(_ref7, _ref8) {
            var commit = _ref7.commit,
                dispatch = _ref7.dispatch,
                state = _ref7.state,
                rootState = _ref7.rootState;
            var id = _ref8.id;
            var loading = rootState.loadingError.loading;

            if (loading) {
                return;
            }
            commit('showLoading');
            var lastCommentId = state.longCommentList[state.shortCommentList.length - 1].id;
            _connection2.default.get('/story/' + id + '/long-comments/before' + lastCommentId).then(function (data) {
                commit('hideLoading');
                commit('setLongCommentListBefore', data.comments);
            }).catch(function (err) {
                commit('hideLoading');
                commit('setErrorMsg', err.message);
            });
        }
    }
};

/***/ })
],[46]);