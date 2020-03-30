let { PI, sin, cos, min, max, random, ceil } = Math;

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

let camera;
let scene = new Scene();
let renderer = new WebGLRenderer({ antialias: true });

let P = ceil(random() * 48);
let Q = ceil(random() * 40);

let amplitude = 1;
let resolution = 1200;

let a = -max(P, Q) * PI;
let b = -a;
let dt = (b - a) / (PI * resolution);

let getFrame = (i, color) => {
  const geometry = new Geometry();
  let i2 = -3 * i;
  let i3 = 4 * i;

  for (let t = a; t <= b + dt; t += dt) {
    geometry.vertices.push(
      new Vector3(
        amplitude * (cos(t / P) * cos(t + i3) * 2 + sin(t + i2)),
        amplitude * (sin(t / Q) * sin(t) * 2 - cos(t + i2)),
        0
      )
    );
  }

  return new Line(geometry, new LineBasicMaterial({ color }));
};

let animate = () => {
  let i = new Date().getTime() / 20000;
  let frame = getFrame(i, 0xffffff);

  scene.add(frame);
  renderer.render(scene, camera);
  requestAnimationFrame(() => {
    animate(frame);
    scene.remove(frame);
  });
};

let setPositioning = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  let aspect = window.innerWidth / window.innerHeight;
  camera = new PerspectiveCamera(10, aspect, 1, 100);
  camera.position.z = 50;
};

setPositioning();
animate();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', setPositioning);
