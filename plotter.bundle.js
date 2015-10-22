/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(5);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Cruncher = __webpack_require__(2);
	var debounce = __webpack_require__(3);

	var canvas = undefined;
	var context = undefined;
	var worker = undefined;

	var actions = {
		setup: function setup(params) {
			return worker.postMessage(stepCommand);
		},
		step: function step(params) {
			return drawFrame(params);
		}
	};

	var stepCommand = { 'action': 'step' };

	var init = function init() {
		var resolution = 1000;
		var width = window.innerWidth;
		var height = window.innerHeight;
		var setupCommand = {
			action: 'setup',
			params: { resolution: resolution, width: width, height: height }
		};

		if (canvas) {
			canvas.parentNode.removeChild(canvas);
		}

		canvas = document.createElement('canvas');
		canvas.height = height;
		canvas.width = width;
		canvas.id = 'canvas';
		canvas.style.zIndex = -2;

		document.body.appendChild(canvas);

		context = canvas.getContext('2d');
		context.strokeStyle = 'hsla(0, 0%, 0%, 0.75)';
		context.lineWidth = 1;
		context.translate(0.5, 0.5);

		if (!worker) {
			worker = new Cruncher();
			worker.onmessage = parseMessage;
		}

		worker.postMessage(setupCommand);
	};

	var parseMessage = function parseMessage(event) {
		var data = event.data;

		if ('action' in data && data.action in actions) {
			actions[data.action](data.params);
		}
	};

	var step = function step() {
		return worker.postMessage(stepCommand);
	};

	var drawFrame = function drawFrame(set) {
		context.save();
		context.clearRect(-0.5, -0.5, canvas.width + 0.5, canvas.height + 0.5);
		context.beginPath();
		context.moveTo(set[0].x, set[0].y);

		set.forEach(function (point) {
			return context.lineTo(point.x, point.y);
		});

		context.stroke();
		context.restore();

		requestAnimationFrame(step);
	};

	window.setParameters = function (A, B) {
		return worker.postMessage({ action: 'setup', params: { A: A, B: B } });
	};
	window.onresize = debounce(init, 200);

	init();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		return new Worker(__webpack_require__.p + "worker.js");
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var now = __webpack_require__(4);

	/**
	 * Returns a function, that, as long as it continues to be invoked, will not
	 * be triggered. The function will be called after it stops being called for
	 * N milliseconds. If `immediate` is passed, trigger the function on the
	 * leading edge, instead of the trailing.
	 *
	 * @source underscore.js
	 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
	 * @param {Function} function to wrap
	 * @param {Number} timeout in ms (`100`)
	 * @param {Boolean} whether to execute at the beginning (`false`)
	 * @api public
	 */

	module.exports = function debounce(func, wait, immediate){
	  var timeout, args, context, timestamp, result;
	  if (null == wait) wait = 100;

	  function later() {
	    var last = now() - timestamp;

	    if (last < wait && last > 0) {
	      timeout = setTimeout(later, wait - last);
	    } else {
	      timeout = null;
	      if (!immediate) {
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      }
	    }
	  };

	  return function debounced() {
	    context = this;
	    args = arguments;
	    timestamp = now();
	    var callNow = immediate && !timeout;
	    if (!timeout) timeout = setTimeout(later, wait);
	    if (callNow) {
	      result = func.apply(context, args);
	      context = args = null;
	    }

	    return result;
	  };
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = Date.now || now

	function now() {
	    return new Date().getTime()
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "index.html"

/***/ }
/******/ ]);