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
/***/ function(module, exports) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var sin = Math.sin;
	var cos = Math.cos;
	var tan = Math.tan;
	var ln = Math.log;
	var log = Math.LOG10E;
	var pi = Math.PI;
	var max = Math.max;
	var min = Math.min;
	var ceil = Math.ceil;
	var rand = Math.random;
	var abs = Math.abs;

	var config = undefined;
	var i = undefined,
	    i2 = undefined,
	    i3 = undefined;

	var A = undefined;
	var B = undefined;

	var randomIn = function randomIn(range) {
		return ceil(rand() * (range[1] - range[0]) + range[0]);
	};

	var f = function f(t) {
		return config.amplitude * (cos(t / A) * cos(t + i3) * 2 + sin(t + i2));
	};
	var g = function g(t) {
		return config.amplitude * (sin(t / B) * sin(t) * 2 - cos(t + i2));
	};

	var done = function done(action) {
		return function (params) {
			return postMessage({ action: action, params: params });
		};
	};

	var transform = function transform(_ref) {
		var x = _ref.x;
		var y = _ref.y;

		x += config.width / 2;
		y *= -1;
		y += config.height / 2;

		return { x: x, y: y };
	};

	var setup = function setup(configData, done) {
		config = _extends({}, config, configData);
		config.amplitude = 1 / 30 * (min(config.width + config.height) + max(config.width + config.height));

		A = config.A || A || randomIn([5, 50]);
		B = config.B || B || randomIn([5, 50]);

		// intentionally left in
		console.log('Parameters: ' + A + ', ' + B);

		done(config);
	};

	var step = function step(params, done) {
		var set = [];
		var a = -max(A, B) * pi;
		var b = -a;
		var dt = (b - a) / (pi * config.resolution);
		var j = 0;

		i = new Date().getTime() / 20000;
		i2 = -3 * i;
		i3 = 4 * i;

		for (var t = a; t < b; t += dt) {
			var x = f(t);
			var y = g(t);

			set[j++] = transform({ x: x, y: y });
		}

		done(set);
	};

	var actions = { setup: setup, step: step };

	onmessage = function (event) {
		var data = event.data;

		if ('action' in data) {
			if (data.action in actions) {
				actions[data.action](data.params, done(data.action));
			} else {
				postMessage('error: action does not exist');
			}
		} else {
			postMessage('error: no action specified');
		}
	};

/***/ }
/******/ ]);