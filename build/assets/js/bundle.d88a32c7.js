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
/* 2 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = addStylesClient;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__listToStyles__ = __webpack_require__(59);
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = Object(__WEBPACK_IMPORTED_MODULE_0__listToStyles__["a" /* default */])(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = Object(__WEBPACK_IMPORTED_MODULE_0__listToStyles__["a" /* default */])(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 4 */,
/* 5 */,
/* 6 */
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
/* 7 */,
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__TopHeader_vue_vue_type_template_id_7efcc8d8___ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__TopHeader_vue_vue_type_script_lang_js___ = __webpack_require__(23);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__TopHeader_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__TopHeader_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__TopHeader_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(73);
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = __webpack_require__(43);

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var corsUrl = 'https://cors-anywhere.herokuapp.com/';
//https://news-at.zhihu.com/api/4/news/latest
var BaseUrl = 'http://127.0.0.1:9001/api/4';

if (process.env === 'production') {
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 10 */,
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js___ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Modal = __webpack_require__(54);

var _Modal2 = _interopRequireDefault(_Modal);

var _Loading = __webpack_require__(60);

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
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_script_lang_js___ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_script_lang_js____default.a); 

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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(58);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("7633acca", content, true, {});

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_script_lang_js___ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 17 */
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(64);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("092574bc", content, true, {});

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(66);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("6fc42afc", content, true, {});

/***/ }),
/* 20 */,
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js___ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _TopHeader = __webpack_require__(8);

var _TopHeader2 = _interopRequireDefault(_TopHeader);

var _Slider = __webpack_require__(75);

var _Slider2 = _interopRequireDefault(_Slider);

var _NewsList = __webpack_require__(80);

var _NewsList2 = _interopRequireDefault(_NewsList);

var _utils = __webpack_require__(6);

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
			console.log('to bttom hhhh');
			that.$store.dispatch({ type: "getBeforeNews" });
		});
	},
	destroyed: function destroyed() {
		console.log('newlist  destroyed');
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
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_script_lang_js___ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 24 */
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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(74);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("5d536bea", content, true, {});

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_script_lang_js___ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = __webpack_require__(6);

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
            console.log(event);
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(79);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("f306174e", content, true, {});

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_script_lang_js___ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 30 */
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
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(84);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("ce4a6fce", content, true, {});

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_script_lang_js___ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_script_lang_js____default.a); 

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

var _TopHeader = __webpack_require__(8);

var _TopHeader2 = _interopRequireDefault(_TopHeader);

var _vuex = __webpack_require__(7);

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
		console.log(from);
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
		console.log(to);
		var path = to.path;
		next(function (vm) {
			if (path === '/') {
				console.log('mmmmmmmmmm');
				vm.$store.commit('clearNewsDetail');
			}
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
			this.$router.back();
		}
	},
	created: function created() {
		var id = this.$route.params.id;
		var _$store$state$newsDet = this.$store.state.newsDetail,
		    body = _$store$state$newsDet.body,
		    scrollTop = _$store$state$newsDet.scrollTop;

		console.log('bidy', body);
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
		console.log('newDetail destroyed');
		//this.$store.commit('clearNewsDetail')
	},
	components: {
		TopHeader: _TopHeader2.default
	}
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(89);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("6a025afa", content, true, {});

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_script_lang_js___ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 36 */
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

var _vuex = __webpack_require__(7);

var _TopHeader = __webpack_require__(8);

var _TopHeader2 = _interopRequireDefault(_TopHeader);

var _CommentItem = __webpack_require__(93);

var _CommentItem2 = _interopRequireDefault(_CommentItem);

var _utils = __webpack_require__(6);

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
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_script_lang_js___ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = __webpack_require__(6);

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
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(97);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("2a9b0f98", content, true, {});

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(99);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("62cd210a", content, true, {});

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_script_lang_js___ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_script_lang_js____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_script_lang_js___);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_script_lang_js____default.a); 

/***/ }),
/* 42 */
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
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(5);

var _vue2 = _interopRequireDefault(_vue);

var _App = __webpack_require__(51);

var _App2 = _interopRequireDefault(_App);

var _index = __webpack_require__(67);

var _index2 = _interopRequireDefault(_index);

var _index3 = __webpack_require__(103);

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Icon from 'vue-awesome/components/Icon.vue'

// import 'vue-awesome/icons'
_vue2.default.config.productionTip = true;
//Vue.component('icon',Icon)//全局组件

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
/* 50 */,
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__App_vue_vue_type_template_id_9adadc14___ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App_vue_vue_type_script_lang_js___ = __webpack_require__(11);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__App_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__App_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__App_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(65);
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
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_template_id_9adadc14___ = __webpack_require__(53);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_template_id_9adadc14___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_template_id_9adadc14___["b"]; });


/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"app"}},[_c('Modal',{attrs:{"visible":_vm.errorMsg!==""},on:{"on-ok":_vm.handleOk,"on-cancel":_vm.handleCancel}},[_c('p',{attrs:{"slot":"content"},slot:"content"},[_vm._v(" "+_vm._s(_vm.errorMsg))])]),_vm._v(" "),_c('Loading',{attrs:{"loading":_vm.loading}}),_vm._v(" "),_c('router-view')],1)}
var staticRenderFns = []



/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Modal_vue_vue_type_template_id_7f6eb66c___ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Modal_vue_vue_type_script_lang_js___ = __webpack_require__(13);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__Modal_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__Modal_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Modal_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(57);
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
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_template_id_7f6eb66c___ = __webpack_require__(56);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_template_id_7f6eb66c___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_template_id_7f6eb66c___["b"]; });


/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.visible),expression:"visible"}],staticClass:"modal-box"},[_c('div',{staticClass:"modal-mask",on:{"click":_vm.handleCancel}}),_vm._v(" "),_c('div',{staticClass:"modal-content",attrs:{"tabIndex":"0"},on:{"keydown":_vm.handleKeyDown}},[_c('div',{staticClass:"modal-header"},[_vm._v("\n            "+_vm._s(_vm.title || _vm.defaultTitle)+"\n            "),_c('i',{staticClass:"right",on:{"click":_vm.handleCancel}},[_vm._v("x")])]),_vm._v(" "),_c('div',{staticClass:"modal-body"},[_vm._t("content")],2),_vm._v(" "),_c('div',{staticClass:"modal-footer"},[_c('button',{staticClass:"btn default mr10",on:{"click":_vm.handleCancel}},[_vm._v("取消")]),_vm._v(" "),_c('button',{class:("btn " + (_vm.confirmLoading ? 'disabled' : '')),on:{"click":_vm.handleOk}},[_vm._v("确定")])])])])}
var staticRenderFns = []



/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_style_index_0_lang_scss____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_style_index_0_lang_scss___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Modal_vue_vue_type_style_index_0_lang_scss____default.a); 

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".modal-box{position:fixed;z-index:9999}.modal-box .modal-mask{position:fixed;top:0;right:0;bottom:0;left:0;height:100%;background-color:rgba(0,0,0,0.45)}.modal-box .modal-content{position:fixed;left:50%;top:50%;min-width:280px;max-width:500px;background-color:#fff;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,0.15);margin-top:-100px;transform:translate(-50%);outline:0}.modal-box .modal-header{padding:16px 24px;border-bottom:1px solid #e8e8e8}.modal-box .modal-header i{cursor:pointer;position:absolute;right:0;top:0;padding:10px 18px;font-size:20px}.modal-box .modal-body{padding:24px}.modal-box .modal-footer{padding:10px 16px;text-align:right}\n", ""]);

// exports


/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = listToStyles;
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Loading_vue_vue_type_template_id_329b6237___ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Loading_vue_vue_type_script_lang_js___ = __webpack_require__(16);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__Loading_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__Loading_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Loading_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(63);
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
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_template_id_329b6237___ = __webpack_require__(62);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_template_id_329b6237___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_template_id_329b6237___["b"]; });


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.loading),expression:"loading"}],staticClass:"loading"})}
var staticRenderFns = []



/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_style_index_0_lang_css____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_style_index_0_lang_css___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loading_vue_vue_type_style_index_0_lang_css____default.a); 

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "\n.loading{\n    position: fixed;\n    width: 40px;\n    height: 40px;\n    z-index: 1;\n    left: 44%;\n    top: 46%;\n    border: 4px solid #00a2ea;\n    border-radius: 50%;\n    border-right: 4px solid transparent;\n    border-top: 4px solid transparent;\n    transform: rotate(45deg);\n    animation: rotate .6s infinite linear;\n    margin-top: 10px;\n}\n@keyframes rotate{\nfrom {\n        transform: rotate(45deg);\n}\nto{\n        transform: rotate(405deg);\n}\n}\n", ""]);

// exports


/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_css____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_css___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_css____default.a); 

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "\nhtml,body{\n\twidth: 100%;\n\theight:100%;\n}\n*{\n\tmargin: 0;\n\tpadding: 0;\n\tbox-sizing:border-box;\n}\na{\n\ttext-decoration: none;\n}\nli{\n\tlist-style: none;\n}\n.btn{\n\tcolor: #fff;\n\tbackground-color: #1890ff;\n\tborder: 1px solid #1890ff;\n\tpadding: 6px 12px;\n\tborder-radius: 4px;\n\tcursor: pointer;\n\twhite-space: nowrap;\n\toutline: 0;\n}\n.btn:hover{\n\tcolor: #fff;\n\tbackground-color: #40a9ff;\n\tborder-color: #40a9ff;\n}\n.btn.default{\n\tbackground-color: #fff;\n\tborder-color: #d9d9d9;\n\tcolor: rgba(0,0,0,0.65);\n}\n.btn.disabled{\n\tcolor: rgba(0,0,0,0.25);\n\tbackground-color: #f5f5f5;\n\tborder-color: #d9d9d9;\n\tcursor: not-allowed;\n}\n.hide{ display: none;\n}\n.clear:after { visibility: hidden; display: block; font-size: 0; content: \" \"; clear: both; height: 0;\n}\n", ""]);

// exports


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _vue = __webpack_require__(5);

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = __webpack_require__(20);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _Home = __webpack_require__(68);

var _Home2 = _interopRequireDefault(_Home);

var _NewsDetail = __webpack_require__(85);

var _NewsDetail2 = _interopRequireDefault(_NewsDetail);

var _CommentList = __webpack_require__(90);

var _CommentList2 = _interopRequireDefault(_CommentList);

var _About = __webpack_require__(100);

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
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Home_vue_vue_type_template_id_6ed6b914___ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Home_vue_vue_type_script_lang_js___ = __webpack_require__(21);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__Home_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__Home_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_componentNormalizer_js__ = __webpack_require__(1);





/* normalize component */

var component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_componentNormalizer_js__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_1__Home_vue_vue_type_script_lang_js___["default"],
  __WEBPACK_IMPORTED_MODULE_0__Home_vue_vue_type_template_id_6ed6b914___["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_0__Home_vue_vue_type_template_id_6ed6b914___["b" /* staticRenderFns */],
  false,
  null,
  null,
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_6ed6b914___ = __webpack_require__(70);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_6ed6b914___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_6ed6b914___["b"]; });


/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"container"},[_c('TopHeader',{attrs:{"title":"知乎日报"}},[_c('div',{staticClass:"navbar-right",attrs:{"slot":"right"},slot:"right"})]),_vm._v(" "),_c('div',{staticClass:"main"},[_c('Slider',{attrs:{"list":_vm.sliderList,"defaultActive":0}}),_vm._v(" "),_c('NewsList',{attrs:{"list":_vm.newsList}})],1)],1)}
var staticRenderFns = []



/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_template_id_7efcc8d8___ = __webpack_require__(72);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_template_id_7efcc8d8___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_template_id_7efcc8d8___["b"]; });


/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('header',{staticClass:"navbar"},[_vm._t("left"),_vm._v(" "),_c('h1',{directives:[{name:"show",rawName:"v-show",value:(_vm.title!=null),expression:"title!=null"}],staticClass:"navbar-title"},[_vm._v(_vm._s(_vm.title))]),_vm._v(" "),_vm._t("right")],2)}
var staticRenderFns = []



/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_style_index_0_lang_scss____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_style_index_0_lang_scss___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TopHeader_vue_vue_type_style_index_0_lang_scss____default.a); 

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".navbar{position:fixed;top:0;left:0;width:100%;align-items:center;height:50px;line-height:50px;background-color:#00a2ea;color:#fff;z-index:1}.navbar-title{float:left;font-size:17px;font-weight:normal;text-align:center;width:calc(100% - 80px)}.navbar-left{float:left;display:inline-block;width:50px;text-align:center;cursor:pointer}.navbar-left:hover{background-color:#0589c3}.navbar-right{float:right}.navbar-right span{margin-right:22px}.navbar-right-detail{float:right;flex:3;text-align:right}\n", ""]);

// exports


/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Slider_vue_vue_type_template_id_138dcff0___ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Slider_vue_vue_type_script_lang_js___ = __webpack_require__(26);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__Slider_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__Slider_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Slider_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__ = __webpack_require__(1);






/* normalize component */

var component = Object(__WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_1__Slider_vue_vue_type_script_lang_js___["default"],
  __WEBPACK_IMPORTED_MODULE_0__Slider_vue_vue_type_template_id_138dcff0___["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_0__Slider_vue_vue_type_template_id_138dcff0___["b" /* staticRenderFns */],
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_template_id_138dcff0___ = __webpack_require__(77);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_template_id_138dcff0___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_template_id_138dcff0___["b"]; });


/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"slider-box"},[_c('div',{staticClass:"slider-inner",style:({width:_vm.list.length+'00%',left: _vm.leftPostion})},_vm._l((_vm.list),function(item){return _c('router-link',{key:item.id,staticClass:"slider-link",style:({backgroundImage:'url('+item.image+')'}),attrs:{"to":'/details/'+item.id}},[_c('div',{staticClass:"detail-overlay"}),_vm._v(" "),_c('h3',[_vm._v(_vm._s(item.title))])])})),_vm._v(" "),_c('ul',{staticClass:"slider-nums"},_vm._l((_vm.list.length),function(i){return _c('li',{class:{ on: _vm.active === i-1 },on:{"click":function($event){_vm.jumpTo(i-1)}}})}))])}
var staticRenderFns = []



/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_style_index_0_lang_css____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_style_index_0_lang_css___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Slider_vue_vue_type_style_index_0_lang_css____default.a); 

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "\n.slider-box{\n\t\tposition: relative;\n\t\twidth: 100%;\n\t\theight: 300px;\n\t\toverflow: hidden;\n\t\tmargin-top: 50px;\n}\n.slider-box .slider-inner{\n\t\tposition: absolute;\n\t\t/*width: 500%;*/\n\t\theight: 100%;\n}\n.slider-box img{\n\t\theight: 300px;\n    \twidth: 100%;\n}\n.slider-inner .slider-link{\n\t    display: flex;\n    \tjustify-content: center;\n\t    position: relative;\n\t\tfloat: left;\n\t\twidth: 20%;\n\t\theight: 100%;\n\t\tbackground-size: cover;\n}\n.slider-link div{\n\t\twidth: 100%;\n\t\theight: 100%;\n}\n.slider-link h3{\n\t    position: absolute;\n\t    bottom: 26px;\n\t    color: #fff;\n\t    padding: 0 20px;\n}\n.slider-nums{\n\t\tposition: absolute;\n\t    bottom: 10px;\n\t    right: 50%;\n\t    transform: translate(50%,0);\n}\n.slider-nums li{\n\t\twidth: 8px;\n\t    height: 8px;\n\t    border-radius: 50%;\n\t    background-color: #aaa;\n\t    float: left;\n\t    list-style: none;\n\t    margin: 0 4px;\n}\n.slider-nums li.on{\n\t    background-color: #fff;\n}\n", ""]);

// exports


/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__NewsList_vue_vue_type_template_id_27eb43b2___ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__NewsList_vue_vue_type_script_lang_js___ = __webpack_require__(29);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__NewsList_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__NewsList_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__NewsList_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(83);
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
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_template_id_27eb43b2___ = __webpack_require__(82);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_template_id_27eb43b2___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_template_id_27eb43b2___["b"]; });


/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"list-box"},_vm._l((_vm.list),function(data,index){return _c('div',[_c('h3',{staticClass:"list-title"},[_vm._v("\n\t\t\t"+_vm._s(index===0 ? '' : data.date)+"\n\t\t")]),_vm._v(" "),_c('ul',_vm._l((data.stories),function(item){return _c('li',[_c('router-link',{attrs:{"to":("/details/" + (item.id))}},[_c('span',[_vm._v(_vm._s(item.title))]),_vm._v(" "),(item.images)?_c('img',{attrs:{"src":item.images[0]}}):_vm._e()])],1)}))])}))}
var staticRenderFns = []



/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_style_index_0_lang_css___ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_style_index_0_lang_css____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_style_index_0_lang_css___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsList_vue_vue_type_style_index_0_lang_css____default.a); 

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "\na{\n\t\ttext-decoration: none;\n\t\tcolor: #000;\n}\n.list-box{\n\t\tbackground-color:#eee;\n}\n.list-box .list-title{\n\t    display: flex;\n\t    height: 40px;\n\t    line-height: 40px;\n\t    padding-left: 20px;\n\t    align-items: center;\n}\n.list-box .list-title{\n\t\tfont-weight: normal;\n\t    color: #333;\n       font-size: 16px;\n}\n.list-box .list-title img{\n\t\twidth: 24px;\n\t    height: 24px;\n\t    vertical-align: middle;\n\t    border-radius: 50%;\n\t    margin-left: 10px;\n}\n.list-box ul{\n\t\tdisplay: flex;\n\t\tflex-direction:column;\n}\n.list-box li{\n\t\tdisplay: flex;\n\t\tpadding: 10px;\n\t    background-color: #fff;\n\t    margin: 8px;\n}\n.list-box li a{\n\t\tdisplay: flex;\n\t\tflex:1;\n}\n.list-box span{\n\t\tflex:1;\n\t\tpadding-right: 10px;\n}\n.list-box ul img{\n\t\t/*flex:1;*/\n\t\twidth: 80px;\n\t\theight: 80px;\n}\n", ""]);

// exports


/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__NewsDetail_vue_vue_type_template_id_50f1c8f0___ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__NewsDetail_vue_vue_type_script_lang_js___ = __webpack_require__(32);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__NewsDetail_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__NewsDetail_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__NewsDetail_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__ = __webpack_require__(1);






/* normalize component */

var component = Object(__WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_1__NewsDetail_vue_vue_type_script_lang_js___["default"],
  __WEBPACK_IMPORTED_MODULE_0__NewsDetail_vue_vue_type_template_id_50f1c8f0___["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_0__NewsDetail_vue_vue_type_template_id_50f1c8f0___["b" /* staticRenderFns */],
  false,
  null,
  null,
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_template_id_50f1c8f0___ = __webpack_require__(87);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_template_id_50f1c8f0___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_template_id_50f1c8f0___["b"]; });


/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('TopHeader',{staticClass:"detail-header header"},[_c('span',{staticClass:"navbar-left",attrs:{"slot":"left"},on:{"click":_vm.goBack},slot:"left"},[_c('i',{staticClass:"fa fa-chevron-left"})]),_vm._v(" "),_c('div',{staticClass:"navbar-right-detail",attrs:{"slot":"right"},slot:"right"},[_c('router-link',{attrs:{"to":("/details/" + _vm.storyId + "/comments")}},[_c('i',{staticClass:"fa fa-comment-o"}),_vm._v(" "),_c('span',{staticClass:"ml-6"},[_vm._v(_vm._s(_vm.extra.commentCount))])]),_vm._v(" "),_c('div',{staticClass:"func-btn"},[_c('i',{staticClass:"fa fa-thumbs-o-up"}),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.extra.popularityCount))])])],1)]),_vm._v(" "),_c('div',{staticClass:"detial-box"},[_c('div',{staticClass:"detail-img-box"},[_c('img',{attrs:{"src":_vm.image,"alt":"picture"}}),_vm._v(" "),_c('div',{staticClass:"detail-overlay"}),_vm._v(" "),_c('h2',[_vm._v(_vm._s(_vm.title))]),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.imageSource))])]),_vm._v(" "),_c('div',{staticClass:"detail-content-box",domProps:{"innerHTML":_vm._s(_vm.body)}})])],1)}
var staticRenderFns = []



/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_style_index_0_lang_scss____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_style_index_0_lang_scss___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_NewsDetail_vue_vue_type_style_index_0_lang_scss____default.a); 

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".detail-header.header .func-btn,.detail-header.header a{float:left;display:inline-block;min-width:50px;padding:1px 16px 0;text-align:center;height:100%;cursor:pointer;color:#fff}.detail-header.header .func-btn:hover,.detail-header.header a:hover{background-color:#0589c3}.detail-header.header .func-btn .fa,.detail-header.header a .fa{color:#fff}.detail-header.header .func-btn .fa-comment-o,.detail-header.header .func-btn .fa-thumbs-o-up,.detail-header.header a .fa-comment-o,.detail-header.header a .fa-thumbs-o-up{font-size:19px;font-weight:700}.detail-header.header .func-btn span,.detail-header.header a span{font-size:12px;margin-top:-2px;display:inline-block;vertical-align:top;margin-left:4px}.detail-box{margin-top:50px}.detail-img-box{position:relative;height:370px;width:100%}.detail-img-box:after{content:\"\";position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.05);border-radius:inherit;pointer-events:none}.detail-img-box h2{position:absolute;color:#fff;bottom:50px;padding:0 20px;font-size:22px;font-weight:500}.detail-img-box span{position:absolute;right:20px;bottom:14px;color:#eee;font-size:12px}.detail-img-box img{width:100%;height:100%}.detail-img-box .detail-overlay{background-image:linear-gradient(0, #416d7a, rgba(65,109,122,0.9), rgba(65,109,122,0));width:100%;height:50%;position:absolute;left:0;bottom:0}.detail-content-box{background-color:#fff;padding:18px 18px 30px 18px}.detail-content-box .answer .meta{padding:20px 0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.detail-content-box .answer .meta span{vertical-align:middle}.detail-content-box .avatar{height:28px;width:28px;margin-right:6px;border-radius:50%;display:inline-block}.detail-content-box .content p,.detail-content-box .content hr,.detail-content-box .content blockquote{margin-bottom:20px}.detail-content-box blockquote{border-left:2px solid #63bbe2;padding-left:8px}.detail-content-box a{color:#01a3ea}.detail-content-box .heading{color:#999;margin-bottom:6px}.detail-content-box .heading-content{color:#333}.detail-content-box .view-more{width:100%;height:44px;border-radius:22px;background:#03a9f4;font-size:14px;text-align:center;line-height:44px;display:block;font-weight:600;color:#fff;margin-bottom:20px}.detail-content-box .view-more a{color:#fff}.detail-content-box .question-title{font-size:1.2em}.detail-content-box .content-image{width:100%}.navbar-icon .ml-6{margin-left:6px}\n", ""]);

// exports


/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CommentList_vue_vue_type_template_id_963691f2___ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CommentList_vue_vue_type_script_lang_js___ = __webpack_require__(35);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__CommentList_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__CommentList_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CommentList_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(98);
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
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_template_id_963691f2___ = __webpack_require__(92);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_template_id_963691f2___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_template_id_963691f2___["b"]; });


/***/ }),
/* 92 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('TopHeader',{attrs:{"title":((_vm.extra.commentCount) + "条评论")}},[_c('span',{staticClass:"navbar-left",attrs:{"slot":"left"},on:{"click":_vm.goBack},slot:"left"},[_c('i',{staticClass:"fa fa-chevron-left"})])]),_vm._v(" "),_c('div',{staticClass:"comment-box"},[(_vm.longCommentList.length > 0)?_c('div',{staticClass:"comment-title"},[_vm._v(_vm._s(_vm.extra.longCommentCount)+" 条长评")]):_vm._e(),_vm._v(" "),_vm._l((_vm.longCommentList),function(item){return [_c('CommentItem',{attrs:{"comment":item}})]}),_vm._v(" "),(_vm.shortCommentList.length >0)?_c('div',{staticClass:"comment-title"},[_vm._v(_vm._s(_vm.extra.shortCommentCount)+" 条短评")]):_vm._e(),_vm._v(" "),_vm._l((_vm.shortCommentList),function(item){return [_c('CommentItem',{attrs:{"comment":item}})]})],2)],1)}
var staticRenderFns = []



/***/ }),
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CommentItem_vue_vue_type_template_id_891e0c8a___ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CommentItem_vue_vue_type_script_lang_js___ = __webpack_require__(37);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_1__CommentItem_vue_vue_type_script_lang_js___) if(["default","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_1__CommentItem_vue_vue_type_script_lang_js___[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CommentItem_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(96);
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
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_template_id_891e0c8a___ = __webpack_require__(95);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_template_id_891e0c8a___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_template_id_891e0c8a___["b"]; });


/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"comment-item clear"},[_c('img',{staticClass:"avatar",attrs:{"src":_vm.comment.avatar}}),_vm._v(" "),_c('div',{staticClass:"comment-detail"},[_c('div',{staticClass:"comment-author"},[_vm._v(_vm._s(_vm.comment.author))]),_vm._v(" "),_c('p',{staticClass:"comment-content"},[_vm._v(_vm._s(_vm.comment.content))]),_vm._v(" "),(_vm.comment.reply_to)?_c('div',{staticClass:"replay-to"},[_c('div',[_vm._v("// "+_vm._s(_vm.comment.reply_to.author)+": "+_vm._s(_vm.comment.reply_to.content))])]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"comment-other clear"},[_c('span',{staticClass:"time"},[_vm._v(_vm._s(_vm.formatTime(_vm.comment.time)))]),_vm._v(" "),_vm._m(0),_vm._v(" "),_c('div',{staticClass:"comment-like"},[_c('span',[_vm._v(_vm._s(_vm.comment.likes))]),_c('i',{staticClass:"fa fa-thumbs-o-up"})])])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"comment-judge"},[_c('i',{staticClass:"fa fa-comment-o"})])}]



/***/ }),
/* 96 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_style_index_0_lang_scss____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_style_index_0_lang_scss___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentItem_vue_vue_type_style_index_0_lang_scss____default.a); 

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".comment-item{border-bottom:1px solid #eee;padding:14px 0}.avatar{float:left;width:30px;border-radius:50%}.comment-detail{margin-left:44px}.comment-detail .comment-author{font-weight:600;margin-bottom:6px}.comment-detail .comment-content{font-size:14px;margin-bottom:10px;white-space:pre-line}.comment-detail .comment-other{color:#666;font-size:14px}.comment-detail .comment-other .time{font-size:12px}.comment-detail .comment-like{cursor:pointer;float:right;margin-right:30px}.comment-detail .comment-like span{margin-right:4px;font-size:12px}.comment-detail .comment-judge{cursor:pointer;float:right}.comment-detail .replay-to{color:#666;font-size:12px;margin-bottom:16px}\n", ""]);

// exports


/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_style_index_0_lang_scss___ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_style_index_0_lang_scss____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_style_index_0_lang_scss___);
/* unused harmony reexport namespace */
 /* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentList_vue_vue_type_style_index_0_lang_scss____default.a); 

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".comment-box{padding:50px 10px}.comment-box .comment-title{font-size:14px;font-weight:600;margin-top:10px}\n", ""]);

// exports


/***/ }),
/* 100 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__About_vue_vue_type_template_id_c1267732___ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__About_vue_vue_type_script_lang_js___ = __webpack_require__(41);
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
/* 101 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_template_id_c1267732___ = __webpack_require__(102);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_template_id_c1267732___["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_About_vue_vue_type_template_id_c1267732___["b"]; });


/***/ }),
/* 102 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('ul',[_c('li',[_vm._v(_vm._s(_vm.name))]),_vm._v(" "),_c('li',[_vm._v(_vm._s(_vm.email))])])])}
var staticRenderFns = []



/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _vue = __webpack_require__(5);

var _vue2 = _interopRequireDefault(_vue);

var _vuex = __webpack_require__(7);

var _vuex2 = _interopRequireDefault(_vuex);

var _home = __webpack_require__(104);

var _home2 = _interopRequireDefault(_home);

var _news_detail = __webpack_require__(123);

var _news_detail2 = _interopRequireDefault(_news_detail);

var _loading_error = __webpack_require__(124);

var _loading_error2 = _interopRequireDefault(_loading_error);

var _comment_list = __webpack_require__(126);

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
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // import API from '../api/index.js'


var _connection = __webpack_require__(9);

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
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _connection = __webpack_require__(9);

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
            console.log(',setNewsDetailScrollTop', data);
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
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _loading_error = __webpack_require__(125);

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
/* 125 */
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
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _connection = __webpack_require__(9);

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
],[49]);