let {
  PI,
  sin,
  cos,
  min,
  max,
  random,
  ceil
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
let renderer = new WebGLRenderer({ antialias: true });
let material = new LineBasicMaterial({ color: 0xffffff });

let toThreeVector = coordinates => new Vector3(...coordinates);

let P = ceil(random() * 48);
let Q = ceil(random() * 40);

let getSet = ms => {
  let amplitude = 5;
  let resolution = 1200;

  let a = -max(P, Q) * PI;
  let b = -a;
  let dt = (b - a) / (PI * resolution);

  let i = ms / 20000;
  let i2 = -3 * i;
  let i3 = 4 * i;

  let f = t => amplitude * (cos(t / P) * cos(t + i3) * 2 + sin(t + i2));
  let g = t => amplitude * (sin(t / Q) * sin(t) * 2 - cos(t + i2));
  let h = t => 0;

  let set = [];

  for (let t = a; t < b; t += dt) {
    set.push([f(t), g(t), h(t)]);
  }

  return set;
};

let getFrame = ({ ms }) => {
  let geometry = new Geometry();
  geometry.vertices = getSet(ms).map(toThreeVector);
  return new Line(geometry, material);
};

let renderFrame = frame => {
  scene.add(frame);
  renderer.render(scene, camera);
};

let clearFrame = frame => {
  scene.remove(frame);
};

let animate = () => {
  let ms = new Date().getTime();
  let frame = getFrame({ ms });

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = 50;

  renderFrame(frame);
  requestAnimationFrame(() => {
    clearFrame(frame);
    animate(frame);
  });
};

document.body.appendChild(renderer.domElement);

animate();