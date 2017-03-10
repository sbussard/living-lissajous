let {
  PI,
  sin,
  cos,
  min,
  max
} = Math;

let {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshNormalMaterial,
  Mesh,
  LineBasicMaterial,
  Geometry,
  Line,
  Vector3
} = THREE;

let scene = new Scene();
let aspect = window.innerWidth / window.innerHeight;
let camera = new PerspectiveCamera(50, aspect, 1, 100);
let renderer = new WebGLRenderer();

let renderStar = ({ms, radius, speed}) => {
  let geometry = new BoxGeometry(1, 1, 1);
  let material = new MeshNormalMaterial();
  let shape = new Mesh(geometry, material);

  let smooth = 0.00001;
  let i1 = smooth * PI * speed * ms;
  let i2 = 0.5 * sin(5 * i1) - 2;

  shape.position.x = (radius + i2) * cos(i1 + cos(i1));
  shape.position.y = (radius + i2) * sin(i1 + cos(i1));
};

let step = (ms) => {
  let x = (t) => (radius + i2) * cos(i1 + cos(i1));
  let y = (t) => (radius + i2) * cos(i1 + cos(i1));

  let amplitude = 5;
  let resolution = 120;

  let A = 4;
  let B = 5;

	let set = [];
	let a = -max(A, B) * PI;
	let b = -a;
	let dt = (b - a) / (PI * resolution);
	let j = 0;

	let i = ms / 20000;
	let i2 = -3 * i;
	let i3 = 4 * i;

  let f = (t) => amplitude * (cos(t / A) * cos(t + i3) * 2 + sin(t + i2));
  let g = (t) => amplitude * (sin(t / B) * sin(t) * 2 - cos(t + i2));

	for (let t = a; t < b; t += dt) {
		let x = f(t);
		let y = g(t);

		set[j++] = [x, y, 0];
	}

  return set;
};

let toThreeVector = (coordinates) => new Vector3(...coordinates);
let material = new LineBasicMaterial({color: 0xffffff});

let getFrame = ({ms}) => {
  let geometry = new Geometry();
  geometry.vertices = step(ms).map(toThreeVector);
  return new Line(geometry, material);
};

let render = (oldframe) => {
  let ms = (new Date()).getTime();
  if (oldframe) {
    scene.remove(oldframe);
  }

  // let shape = renderStar({
  //   ms,
  //   radius: 10,
  //   speed: 10
  // });

  let frame = getFrame({ms});
  scene.add(frame);
  renderer.render(scene, camera);
  requestAnimationFrame(() => render(frame));
};

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 50;
// scene.add(shape);

render();
