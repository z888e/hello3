"use strict";

// ----------------------------------------------------- SETUP

const renderer = new THREE.WebGLRenderer({
  antialias: true
}); 
renderer.setClearColor(0x101010);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  composer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
};

// ----------------------------------------------------- LOADING SCREEN

const animatedIn = document.querySelectorAll('.welcome, .enter, #social, #about');
function onTransitionEnd(event) {
  event.target.remove();
  [...animatedIn].forEach((animatedIn) => {
      animatedIn.classList.add('in'); 
  });
}

const loadingScreen = document.querySelector('#loading-screen');
const loadingManager = new THREE.LoadingManager(() => {
  loadingScreen.classList.add('fade');
  loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
});

// ----------------------------------------------------- BACKGROUND

const sphere = new THREE.SphereGeometry(33, 12, 12);
const cloudy = new THREE.MeshLambertMaterial({
  color: 0x262728,
  opacity: 0.42,
  transparent: true,
  side: THREE.DoubleSide
});
const bulle = new THREE.Mesh(sphere, cloudy);
scene.add(bulle);

// ----------------------------------------------------- LIGHTS

const ambLight = new THREE.AmbientLight(0xFCF3DD, 1.7);
ambLight.position.set(-10, 10, 10);
scene.add(ambLight);

const niceLight1 = new THREE.SpotLight(0xffffff, 2.5, 33)
niceLight1.position.set(3, 6, 20);
niceLight1.angle = Math.PI/2.8;
scene.add(niceLight1);

const niceLight2 = new THREE.SpotLight(0xffffff, 2.3, 33)
niceLight2.position.set(18, 7, -0.5);
scene.add(niceLight2);

const niceLight3 = new THREE.SpotLight(0xffffff, 2.3, 33)
niceLight3.position.set(-5, -9, -16);
scene.add(niceLight3);

// ----------------------------------------------------- CAMERA

const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  70
);
camera.position.set(0, 5, 28);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minDistance = 13;
controls.maxDistance = 28;

// ----------------------------------------------------- STARS

let star = [];
const starLoader = new THREE.GLTFLoader();
const stars = new THREE.Group();
const starLights = new THREE.Group();

function setStar(){
  star.material = new THREE.MeshPhongMaterial({color: 0x705C00});
  star.scale.set(0.053, 0.073, 0.053)
  star.position.x = (Math.random() * 29 - Math.random() * 29);
  star.position.y = (Math.random() * 29 - Math.random() * 29);
  star.position.z = (Math.random() * 29 - Math.random() * 29);
  star.rotation.y = (Math.random() - Math.random()) * 10;
  stars.add(star);
}

for (let i = 0; i < 7; i++) {
  starLoader.load('/3D/star43.glb', star_load);
  function star_load(gltf) {
    star = gltf.scene.children[0];
    setStar(star);
    const starLight = new THREE.SpotLight(0xfff3ab, 1.90, 46);
    starLight.position.set(star.position.x, star.position.y, star.position.z);
    starLights.add(starLight);
  }
}

for (let i = 0; i < 25; i++) {
  starLoader.load('/3D/star43.glb', star_load);
  function star_load(gltf) {
    star = gltf.scene.children[0];
    setStar(star);
  }
}

scene.add(stars, starLights);

// ----------------------------------------------------- BALL

let hem1, hem2;
const loader = new THREE.GLTFLoader(loadingManager);

loader.load('/3D/honeycomb66m.gltf', center_load);
function center_load(gltf) {
  hem1 = gltf.scene.children[0];
  hem1.scale.set(10.55, 10.55, 10.55);
  hem1.position.set(0, 0.01, 0);
  scene.add(hem1);
}

loader.load('/3D/honeycomb66m.gltf', center_load2);
function center_load2(gltf) {
  hem2 = gltf.scene.children[0];
  hem2.scale.set(hem1.scale.x, hem1.scale.y, hem1.scale.z);
  hem2.position.set(0, 0.2, 0);
  hem2.rotation.set(0, 0.01, 3.14);
  scene.add(hem2);
}

// ----------------------------------------------------- OPENING

function di_load(gltf) {
  const di = gltf.scene.children[2];
  di.material = new THREE.MeshPhongMaterial({
    color: 0x7b7269,
    side: THREE.DoubleSide,
  });
  di.scale.set(7, 7, 7);
  di.position.set(0, 1.7, 0);
  di.rotation.set(0, 0.21, 0);
  scene.add(di);
}
const diLoader = new THREE.GLTFLoader();
diLoader.load('/3D/py12.glb', di_load);

const btn = document.querySelector('#gate');
let open = false;
btn.addEventListener('click', function() {
  open = true;
  btn.classList.add('out');
});

// ----------------------------------------------------- POSTPROCESSING

renderer.autoClear = false;
const composer = new THREE.EffectComposer(renderer);
const renderPass = new THREE.RenderPass(scene, camera);
renderPass.renderToScreen = true;
composer.addPass(renderPass);

const effectFilm = new THREE.FilmPass(0.34, 0.001, 648, false);
effectFilm.renderToScreen = true;
composer.addPass(effectFilm);

// ----------------------------------------------------- RENDERING

let speed = 0.005;

function render() {
  camera.position.x -= speed*2;

  if (stars) {
    stars.rotation.y += speed/33;
  }

  if (open) {
    if (hem1.position.y < 8) {
      hem1.position.y += speed*3;
      hem1.rotation.y += speed/50;
    }
    hem1.rotation.y += speed/10;
    if (hem2.position.y > -7.7) {
      hem2.position.y -= speed*3;
      hem2.rotation.y -= speed/50;
    }
    hem2.rotation.y -= speed/5;
  }

  controls.update();
  requestAnimationFrame(render);
  composer.render();
  renderer.render(scene, camera);
}

render();