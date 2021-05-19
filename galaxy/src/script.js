import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  PointsMaterial,
} from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 360 });

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const parameters = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
};

let geometry, material, points;

const generateGalaxy = () => {
  const { count, size, branches, spin } = parameters;

  const VERTEX_PARAMS = 3;
  const FULL_CIRCLE = Math.PI * 2;

  if (points) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  geometry = new BufferGeometry();
  const positions = new Float32Array(count * VERTEX_PARAMS);
  const colors = new Float32Array(count * VERTEX_PARAMS);

  const colorInside = new Color(parameters.insideColor);
  const colorOutside = new Color(parameters.outsideColor);

  for (let i = 0, i3 = 0; i < count; ++i, i3 = i * VERTEX_PARAMS) {
    // position
    const x = i3;
    const y = i3 + 1;
    const z = i3 + 2;

    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * spin;
    const branchAngle = ((i % branches) / branches) * FULL_CIRCLE;

    const randomnessBaseOnRadius = parameters.randomness * radius;
    const getRandomSign = () => (Math.random() < 0.5 ? -1 : 1);

    // get random value from 0 to 1 and minimize all the low values
    const randomNumPowered = () => Math.pow(Math.random(), parameters.randomnessPower);

    const randomX = randomNumPowered() * randomnessBaseOnRadius * getRandomSign();
    const randomY = randomNumPowered() * randomnessBaseOnRadius * getRandomSign();
    const randomZ = randomNumPowered() * randomnessBaseOnRadius * getRandomSign();

    positions[x] = Math.sin(branchAngle + spinAngle) * radius + randomX;
    positions[z] = Math.cos(branchAngle + spinAngle) * radius + randomZ;
    positions[y] = randomY;

    // color
    const red = i3;
    const green = i3 + 1;
    const blue = i3 + 2;

    const mixedColor = colorInside.clone().lerp(colorOutside, radius / parameters.radius);

    colors[red] = mixedColor.r;
    colors[green] = mixedColor.g;
    colors[blue] = mixedColor.b;
  }
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));

  /**
   * Material
   */
  material = new PointsMaterial({
    size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexColors: true,
  });

  points = new Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);

gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

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
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
