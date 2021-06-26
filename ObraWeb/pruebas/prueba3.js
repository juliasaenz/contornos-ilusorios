import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'; //'../threegit/build/three.module.js';;//'https://unpkg.com/three@0.118.3/build/three.module.js';//'../threeLibs/build/three.module.js';
import {
  Mundo
} from '../Clases/Mundo.js';
import {
  PointerLockControls
} from 'https://unpkg.com/three@0.121.1/examples/jsm/controls/PointerLockControls.js'

///// ThreeJS
var mundo;
var obj, obj2;

//////
let raycaster;
let controls;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();


function inicializar() {
  mundo = new Mundo();
  mundo.crearFondo();

  controls = new PointerLockControls(mundo.camara, document.body);

  var va = false;
  document.addEventListener('mousedown', function() {
    //controls.lock();
  });
  document.addEventListener('mouseup', function() {
    //controls.unlock();
    console.log(controls.getObject())
  });

  mundo.escena.add(controls.getObject());

  //////////////////////////////// OBJETO
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5, 8, 8, 8);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  });
  obj = new THREE.Mesh(geometry, material);
  obj.position.set(0, -0.5, -1);
  mundo.escena.add(obj);
  /////////////////////////////// OBJETO

  const onKeyDown = function(event) {

    switch (event.code) {

      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;

      case 'Space':
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;

    }

  };
  const onKeyUp = function(event) {

    switch (event.code) {

      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;

    }

  };
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

  console.log(controls.getObject().position)
}

function animar() {
  requestAnimationFrame(animar);
  const time = performance.now();

  ///
  //raycaster.ray.origin.copy(controls.getObject().position);
  //raycaster.ray.origin.y -= 10;

  //const intersections = raycaster.intersectObjects(objects);

  //const onObject = intersections.length > 0;

  const delta = (time - prevTime) / 1000;

  velocity.x -= velocity.x * 15.0 * delta;
  velocity.z -= velocity.z * 15.0 * delta;

  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize(); // this ensures consistent movements in all directions


  if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
  if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);

  controls.getObject().position.y += (velocity.y * delta); // new behavior*/
  const pos = controls.getObject().position;
  obj.position.x = pos.x;
  obj.position.z = pos.z - 2.5;

  prevTime = time;

  ///



  mundo.renderizar();
}

///// Programa Principal
inicializar();
animar();
