import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'; //'../threegit/build/three.module.js';;//'https://unpkg.com/three@0.118.3/build/three.module.js';//'../threeLibs/build/three.module.js';
import {
  Mundo
} from '../Clases/Mundo.js';
import {
  PointerLockControls
} from 'https://unpkg.com/three@0.121.1/examples/jsm/controls/PointerLockControls.js'
import {
  SVGLoader
} from 'https://unpkg.com/three@0.121.1/examples/jsm/loaders/SVGLoader.js';

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
var btn;
var play = false;

var texto;



function inicializar() {
  btn = document.createElement("p");
  btn.innerHTML = "prueba"
  //document.body.appendChild(btn);
  /////////////////////////////
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
  //
  var cant = false;
  document.onpointerdown = function(event) {
    if (play) {
      mueve = true;
      mouse.x = (event.clientX / mundo.renderizador.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / mundo.renderizador.domElement.clientHeight) * 2 + 1;
      console.log(mouse.y)
    }
  };
  var oldX, oldY = 0;
  document.onmousemove = function(e) {
    mouse.x = (event.clientX / mundo.renderizador.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / mundo.renderizador.domElement.clientHeight) * 2 + 1;
    if (mueve) {
      if (mouse.x < oldX) {
        i += 0.1;
      } else if (mouse.x > oldX) {
        i -= 0.1;
      }
      /*if (mouse.y > oldY && mundo.camara.position.y > -0.9){
        mundo.camara.position.y -= 0.1;
      } else if ( mouse.y < oldY && mundo.camara.position.y < 0.6){
        mundo.camara.position.y += 0.1;
      }*/
    }
    oldX = mouse.x;
    oldY = mouse.y;
  }
  document.addEventListener('wheel', function(event){
     event.preventDefault();
     if (event.deltaY > 0 && mundo.camara.position.y > -0.9){
       mundo.camara.position.y -= 0.1;
     } else if (event.deltaY < 0 && mundo.camara.position.y < 0.6) {
       mundo.camara.position.y += 0.1;
     }
  });
  document.onmouseup = function() {
    mueve = false;
    btn.innerHTML = mundo.camara.position.x + " " + mundo.camara.position.z + " - " + obj.position.x + " " + obj.position.z;
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
  //
  mundo.camara.position.x = obj.position.x + 2 * Math.cos(0);
  mundo.camara.position.z = obj.position.z + 2 * Math.sin(0);
  mundo.camara.lookAt(obj.position);
  //
  const onKeyDown = function(event) {
    if (play) {
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
    }
  };
  const onKeyUp = function(event) {
    if (play) {
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
        case 'Escape':
          console.log("escapeee");
          const instructions = document.getElementById("instructions");
          const blocker = document.getElementById("blocker");
          instructions.style.display = 'flex';
          blocker.style.display = '';
          play = false;
      }
    }
  };
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  //instrucciones
  /*const block = document.getElementById("blocker");
  const instr = document.getElementById("instructions");
  blocker.addEventListener('click', function() {
    play = true;
    instr.style.display = 'none';
    block.style.display = 'none';
  });*/
  play = true;
  //
  mundo.escena.fog = null;
  //textoEnElCielo();
  texto = document.createElement("p");
  texto.style.top = '45%';
  texto.style.left = '60%';
  document.body.append(texto);

  ///
  verCodigo(obj);
}

function verCodigo(x,y,z) {
  const loader = new THREE.TextureLoader();
  const texture = loader.load('../data/imagenes/cod02.png');

  const planeGeo = new THREE.PlaneGeometry(300, 420);
  const planeMat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  mesh.position.set(0,100,-200);
  mesh.lookAt(x,y,z);
  mundo.escena.add(mesh);
}

function animar() {
  requestAnimationFrame(animar);
  const time = performance.now();
  const delta = (time - prevTime) / 1000;

  //
  if (!mueve) {
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 100.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 100.0 * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    var angulo = Math.atan2(mundo.camara.getWorldDirection().z, mundo.camara.getWorldDirection().x)
    obj.position.x = mundo.camara.position.x + 2 * Math.cos(angulo);
    obj.position.z = mundo.camara.position.z + 2 * Math.sin(angulo);
    obj.position.y = -0.5;

    prevTime = time;
  } else {
    mundo.camara.position.x = obj.position.x + 2 * Math.cos(0.5 * i);
    mundo.camara.position.z = obj.position.z + 2 * Math.sin(0.5 * i);
    mundo.camara.lookAt(obj.position);
  }

  texto.innerText = parseInt(obj.position.x) + " " + parseInt(obj.position.y) + " " + parseInt(obj.position.z) + "  " + mundo.camara.position.y;
  //
  mundo.renderizar();
}

///// Programa Principal
inicializar();
animar();
