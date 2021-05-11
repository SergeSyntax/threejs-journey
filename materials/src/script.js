import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import {
  AmbientLight,
  BackSide,
  BufferAttribute,
  CubeTextureLoader,
  DoubleSide,
  FrontSide,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  NearestFilter,
  PlaneGeometry,
  PointLight,
  SphereGeometry,
  TextureLoader,
  TorusGeometry,
  Vector3,
} from 'three';

/**
 * DEBUG
 */
const gui = new dat.GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Textures

const textureLoader = new TextureLoader();
const cubeTextureLoader = new CubeTextureLoader();

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const matcapTexture = textureLoader.load('/textures/matcaps/3.png');
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');
gradientTexture.minFilter = NearestFilter;
gradientTexture.magFilter = NearestFilter;
gradientTexture.mipmaps = false;

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
]);

/**
 * Objects
 */
// const material = new MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color.set(0x00ff00);
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = doorAlphaTexture;
// material.side = FrontSide; // default
// material.side = BackSide;
// material.side = DoubleSide;

// const material = new MeshNormalMaterial();
// material.flatShading = true;

// const material = new MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new MeshDepthMaterial();

// const material = new MeshLambertMaterial();

// const material = new MeshPhongMaterial();
// material.shininess = 1000;
// material.specular.set(0x1188ff);
// const material = new MeshToonMaterial();
// material.gradientMap = gradientTexture;

// const material = new MeshStandardMaterial();
// material.metalness = 0;
// material.roughness = 1;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorColorTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

const material = new MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentMapTexture;

gui.add(material, 'metalness').min(0).max(1).step(0.001);
gui.add(material, 'roughness').min(0).max(1).step(0.001);
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.001);
gui.add(material, 'displacementScale').min(0).max(10).step(0.001);
gui.add(material.normalScale, 'x').min(0).max(1).step(0.001).name('normal x scale');
gui.add(material.normalScale, 'y').min(0).max(1).step(0.001).name('normal y scale');

const sphere = new Mesh(new SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;

const plane = new Mesh(new PlaneGeometry(1, 1, 100, 100), material);
const torus = new Mesh(new TorusGeometry(0.3, 0.2, 64, 146), material);
torus.position.x = 1.5;

sphere.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
plane.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
torus.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

scene.add(sphere, plane, torus);

/**
 * Light
 */
const ambientLight = new AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.z = 4;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.y = 0.15 * elapsedTime;
  plane.rotation.y = 0.15 * elapsedTime;
  torus.rotation.y = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
