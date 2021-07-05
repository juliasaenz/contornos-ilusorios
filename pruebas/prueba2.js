import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'; //'../threegit/build/three.module.js';;//'https://unpkg.com/three@0.118.3/build/three.module.js';//'../threeLibs/build/three.module.js';
import {
  OrbitControls
} from 'https://unpkg.com/three@0.121.1/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer;
var text;
var texto;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 0, 100);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const loader = new THREE.FontLoader();
  loader.load('Fredoka One_Regular.json', function(font) {
    const matLite = new THREE.MeshBasicMaterial({
      color: 0x020202,
    });

    const message = "Continuar";
    const shapes = font.generateShapes(message, 3);
    const geometry = new THREE.ShapeGeometry(shapes);

    geometry.computeBoundingBox();
    const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);

    text = new THREE.Mesh(geometry, matLite);
    text.position.set(0,0,0)
    scene.add(text);

  }); //end load function

  texto = document.createElement('p');
  document.body.append(texto);

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  texto.innerText = "texto loco mágico místico";

  window.addEventListener('resize', onWindowResize);

} // end init

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

  requestAnimationFrame(animate);



  render();

}

function render() {

  renderer.render(scene, camera);

}
