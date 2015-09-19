let Cruncher = require('worker!./cruncher.js');

let canvas;
let context;
let worker;

let actions = {
	setup: (params) => worker.postMessage(stepCommand),
	step: (params) => drawFrame(params)
}

let setupCommand = {
	action: 'setup',
	params: {
		resolution: 1000,
		width: window.innerWidth,
		height: window.innerHeight
	}
};

let stepCommand = {'action': 'step'};

let init = () => {
	canvas = document.createElement('canvas');
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	canvas.id = 'canvas';
	canvas.style.zIndex = -2;
	document.body.appendChild(canvas);

	context = canvas.getContext('2d');
	context.strokeStyle = 'hsla(200, 75%, 75%, 0.5)';
	context.lineWidth = 1;

	worker = new Cruncher();
	worker.onmessage = parseMessage;
	worker.postMessage(setupCommand);
};

let parseMessage = (event) => {
	let data = event.data;

	if ('action' in data && data.action in actions) {
		actions[data.action](data.params);
	}
};

let step = () => worker.postMessage(stepCommand);

let drawFrame = (set) => {
	context.save();
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.beginPath();

	set.forEach((point) => context.lineTo(point.x, point.y));

	context.stroke();
	context.restore();

	requestAnimationFrame(step);
};

window.onresize = () => setTimeout(() => location.reload(), 25);

init();
