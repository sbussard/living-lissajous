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
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Cruncher = __webpack_require__(2);

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

	var setupCommand = {
		action: 'setup',
		params: {
			resolution: 1000,
			width: window.innerWidth,
			height: window.innerHeight
		}
	};

	var stepCommand = { 'action': 'step' };

	var init = function init() {
		canvas = document.createElement('canvas');
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
		canvas.id = 'canvas';
		canvas.style.zIndex = -2;
		document.body.appendChild(canvas);

		context = canvas.getContext('2d');
		context.strokeStyle = 'hsla(0, 0%, 0%, 0.75)';
		context.lineWidth = 1;
		context.translate(0.5, 0.5);

		worker = new Cruncher();
		worker.onmessage = parseMessage;
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

	window.onresize = function () {
		return setTimeout(function () {
			return location.reload();
		}, 25);
	};

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

	module.exports = __webpack_require__.p + "index.html"

/***/ }
/******/ ]);