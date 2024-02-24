import * as THREE from './three.module.js';
import { FontLoader } from './FontLoader.js';  
import { TextGeometry } from './TextGeometry.js';  

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let cubeMesh = new THREE.Mesh();
let stars, starGeo;
let textMesh;

lighting();
text();
particles();

function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  let starMaterial = new THREE.PointsMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateParticles() {
  for (let i = 0; i < starGeo.attributes.position.array.length; i += 3) {
    starGeo.attributes.position.array[i + 1] -= 0.9;

    if (starGeo.attributes.position.array[i + 1] < -300) {
      starGeo.attributes.position.array[i + 1] = 300;
    }
  }
  starGeo.attributes.position.needsUpdate = true;
}

function text() {
  const loader = new FontLoader(); 
  loader.load('assets/fonts/Roboto_Regular.json', function (font) {
    const textGeometry = new TextGeometry('Kobe', {
      font: font,
      size: 6,
      height: 1,
    });
    textGeometry.center();

    const texture = new THREE.TextureLoader().load('assets/textures/wooden.jpg');
    const textMaterial = new THREE.MeshBasicMaterial({ map: texture });
    textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textMesh.position.z = -5;
    camera.position.z = 15;

    scene.add(textMesh);
  });
}

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

function changeParticleColor() {
  const newColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  stars.material.color = newColor;
}

changeParticleColor();

setInterval(changeParticleColor, 3000);

function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  textMesh.rotation.x += 0.008;
  textMesh.rotation.y += 0.008; 
  renderer.render(scene, camera);
}

animate();
