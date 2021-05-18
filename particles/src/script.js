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
  SphereGeometry,
} from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load('/textures/particles/2.png');
/**
 * Particles
 */
// Geometry
// const particlesGeometry = new SphereGeometry(1, 32, 32);
const particlesGeometry = new BufferGeometry();
const count = 20000;
// Multiply by 3 because each position is composed of 3 values (x, y, z)
const position = new Float32Array(count * 3)
  // Math.random() - 0.5 to have a random value between -0.5 and +0.5
  .map(() => (Math.random() - 0.5) * 10);

const colors = new Float32Array(count * 3).map(() => Math.random());

// Create the Three.js BufferAttribute and specify that each information is composed of 3 values
particlesGeometry.setAttribute('position', new BufferAttribute(position, 3));
particlesGeometry.setAttribute('color', new BufferAttribute(colors, 3));
// Material
const particlesMaterial = new PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
});

particlesMaterial.size = 0.1;
// particlesMaterial.color = new Color('#ff88cc');
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particlesTexture;
particlesMaterial.vertexColors = true;

// particlesMaterial.alphaTest = 0.001;
// only if there no more object and the particles with the same color
// particlesMaterial.depthTest = false;
particlesMaterial.depthWrite = false;
particlesMaterial.blending = AdditiveBlending;

// Pints
const particles = new Points(particlesGeometry, particlesMaterial);
scene.add(particles);

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

  // Update particles
  //   particles.rotation.y = -elapsedTime * 0.02;

  for (
    let xIndex = 0, yIndex = 1;
    xIndex < particlesGeometry.attributes.position.array.length;
    xIndex += 3, yIndex += 3
  ) {
    const xValue = particlesGeometry.attributes.position.array[xIndex];
    particlesGeometry.attributes.position.array[yIndex] = Math.sin(elapsedTime + xValue);
    particlesGeometry.attributes.position.needsUpdate = true;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
