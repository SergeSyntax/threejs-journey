import './style.css';
import * as THREE from 'three';
import { AxesHelper, BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three';

// Scene
const scene = new THREE.Scene();

// Object
const group = new Group();
scene.add(group);
cube1.position.set(2, 0, 0);

const cube1 = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0xff0000 }));
group.add(cube1);
cube1.position.set(2, 0, 0);

const cube2 = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0x00ff00 }));
group.add(cube2);
cube1.position.set(-2, 0, 0);

const cube3 = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0x00ff00 }));
group.add(cube3);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);
// // position
// // mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;
// mesh.position.set(0.7, -0.6, 1);

// scale
// mesh.scale.x = 2;
// mesh.scale.y = 2.5;
// // mesh.scale.z = 0.5;
// // mesh.scale.set(2, 0.5, 0.5);

// // rotation
// mesh.rotation.reorder('YXZ');
// mesh.rotation.x = Math.PI / 2;
// mesh.rotation.y = Math.PI / 2;

// scene.add(mesh);

// Helper
const axesHelper = new AxesHelper();
// mesh.add(axesHelper);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 4;
scene.add(camera);

// camera.lookAt(mesh.position);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas.webgl'),
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
