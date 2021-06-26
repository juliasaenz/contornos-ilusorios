import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'; //'../threegit/build/three.module.js';;//'https://unpkg.com/three@0.118.3/build/three.module.js';//'../threeLibs/build/three.module.js';
import {
  Mundo
} from '../Clases/Mundo.js';
import {
  PointerLockControls
} from 'https://unpkg.com/three@0.121.1/examples/jsm/controls/PointerLockControls.js'

///// ThreeJS
var mundo;
var obj;
var i = 1;
var mueve = false;
var orientacion = "frente";
var objetos = [];

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

var mov = true;


function inicializar() {
  mundo = new Mundo();
  mundo.crearFondo();
  mundo.bloomPass.strength = 0.3;

  // crar objeto
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5, 8, 8, 8);
  const material = new THREE.MeshBasicMaterial({
    color: 0x10b308
  });
  obj = new THREE.Mesh(geometry, material);
  obj.position.set(0, -0.5, -2);
  //obj.rotation.x = -1;
  mundo.escena.add(obj);
  //mundo.camara.add(obj)
  //
  var mouse = new THREE.Vector2();

  var cant = false;
  document.onpointerdown = function(event) {
    mueve = true;
    mouse.x = (event.clientX / mundo.renderizador.domElement.clientWidth) * 2 - 1;
  };
  document.onmousemove = function() {
    if (mueve) {
      if (mouse.x < 0 && i < Math.PI * 3) {
        i += 0.1;
      } else if (mouse.x > 0 && i > 0) {
        i -= 0.1;
      }
    }
  }
  document.onmouseup = function() {
    mueve = false;
    /*const v = [Math.abs(0 - i), Math.abs(Math.PI - i), Math.abs(Math.PI * 2 - i), Math.abs(Math.PI * 3 - i)];
    const index = v.indexOf(Math.min(...v))

    if (index == 0) {
      console.log("izquierda")
      orientacion = "izquierda"
      i = 0;
    } else if (index == 1) {
      console.log("frente")
      orientacion = "frente"
      i = Math.PI;
    } else if (index == 2) {
      console.log("derecha")
      orientacion = "derecha"
      i = Math.PI * 2;
    } else {
      console.log("espalda")
      orientacion = "espalda"
      i = Math.PI * 3;
    }*/
  }

  //// CONTROLES
  controls = new PointerLockControls(mundo.camara, document.body);
  mundo.escena.add(controls.getObject());

  mundo.camara.position.x = obj.position.x + 2 * Math.cos(0);
  mundo.camara.position.z = obj.position.z + 2 * Math.sin(0);
  mundo.camara.lookAt(obj.position);

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

}

function animar() {
  requestAnimationFrame(animar);
  const time = performance.now();
  const delta = (time - prevTime) / 1000;

  //
  if (!mueve) {
    velocity.x -= velocity.x * 15.0 * delta;
    velocity.z -= velocity.z * 15.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    const pos = controls.getObject().position;
    //obj.position.x = mundo.camara.position.x + 3 * Math.cos(mundo.camara.rotation.z - Math.Pi*0.5);
    //obj.position.z = mundo.camara.position.z + 3 * Math.sin(mundo.camara.rotation.z);
    prevTime = time;
  } else {
    mundo.camara.position.x = obj.position.x + 2 * Math.cos(0.5 * i);
    mundo.camara.position.z = obj.position.z + 2 * Math.sin(0.5 * i);
    mundo.camara.lookAt(obj.position);
  }
  //

  //////////// camara
  //mundo.camara.position.x = obj.position.x + 2 * Math.cos(0.5 * i);
  //mundo.camara.position.z = obj.position.z + 2 * Math.sin(0.5 * i);
  //mundo.camara.lookAt(obj.position);
  mundo.renderizar();
}

///// Programa Principal
inicializar();
animar();
