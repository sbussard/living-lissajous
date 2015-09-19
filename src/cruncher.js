let sin = Math.sin;
let cos = Math.cos;
let tan = Math.tan;
let ln = Math.log;
let log = Math.LOG10E;
let pi = Math.PI;
let max = Math.max;
let min = Math.min;
let ceil = Math.ceil;
let rand = Math.random;
let abs = Math.abs;

let config;
let i, i2, i3;

let A;
let B;

let randomIn = (range) => ceil(rand() * (range[1] - range[0]) + range[0]);

let f = (t) => config.amplitude * (cos(t / A) * cos(t + i3) * 2 + sin(t + i2));
let g = (t) => config.amplitude * (sin(t / B) * sin(t) * 2 - cos(t + i2));

let done = (action) => (params) => postMessage({action, params});

let transform = (point) => {
	let x = config.width / 2 + point.x + 0.5;
	let y = config.height / 2 - point.y + 0.5;
	let newPoint = { x, y };

	return newPoint;
};

let actions = {};

actions.setup = function(configData, done) {
	config = configData;
	config.amplitude = (1/30.) * (min(config.width + config.height) + max(config.width + config.height));

	A = randomIn([5, 50]);
	B = randomIn([5, 50]);

	// intentionally left in
	console.log(A, B);

	done(configData);
};

actions.step = function(params, done) {
	let set = [];
	let a = -max(A, B) * pi;
	let b = -a;
	let dt = (b - a) / (pi * config.resolution);
	let j = 0;

	i = (new Date()).getTime() / 20000;
	i2 = -3 * i;
	i3 = 4 * i;

	for (let t = a; t < b; t += dt) {
		let point = { x: f(t), y: g(t) };

		set[j++] = transform(point);
	}

	done(set);
};

onmessage = function(event) {
	let data = event.data;

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
