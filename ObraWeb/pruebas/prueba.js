import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'; //'../threegit/build/three.module.js';;//'https://unpkg.com/three@0.118.3/build/three.module.js';//'../threeLibs/build/three.module.js';
import {
  Mundo
} from '../Clases/Mundo.js';

///// ThreeJS
var mundo;
var obj;
var i = 1;
var mueve = false;
var orientacion = "frente";
var objetos = [];


var lastKey = "none";
var colision = -1;

function intersectObjMas(obj, lista) {
  const x = obj.position.x;
  const z = obj.position.z;
  const w = obj.geometry.parameters.width / 2;
  const d = obj.geometry.parameters.depth / 2;
  for (var i = 0; i < lista.length; i++) {
    const xL = lista[i].position.x;
    const zL = lista[i].position.z;
    const wL = lista[i].geometry.parameters.width / 2 + 0.01;
    const dL = lista[i].geometry.parameters.depth / 2 + 0.01;

    if (x - w > xL - wL && x - w < xL + wL || x + w > xL - wL && x + w < xL + wL) {
      //x adentro
      if (z - d > zL - dL && z - d < zL + dL || z + d > zL - dL && z + d < zL + dL) {
        //z adentro
        console.log("bonk")
        colision = lastKey;
      } else {
        colision = -1;
      }
    } else {
      colision = -1;
    }

  }
}

function inicializar() {
  mundo = new Mundo();
  mundo.crearFondo();

  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5, 8, 8, 8);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  });
  obj = new THREE.Mesh(geometry, material);
  obj.position.set(0, -0.5, -1);
  mundo.escena.add(obj);

  var obj2 = new THREE.Mesh(geometry, material);
  obj2.position.set(0.5, -0.5, -2);
  mundo.escena.add(obj2);
  objetos.push(obj2)


  mundo.camara.position.x = obj.position.x + 2 * Math.cos(0);
  mundo.camara.position.z = obj.position.z + 2 * Math.sin(0);
  mundo.camara.lookAt(obj.position);

  var box = obj.geometry.computeBoundingBox();
  console.log(box)

  document.onkeydown = function(e) {
    switch (e.keyCode) {
      //derecha
      case 37:
        if (e.keyCode != colision) {
          switch (orientacion) {
            case "frente":
              obj.position.x -= 0.2;
              break;
            case "izquierda":
              obj.position.z += 0.2;
              break;
            case "derecha":
              obj.position.z -= 0.2;
              break;
            case "espalda":
              obj.position.x += 0.2;
              break;
          }
        }
        break;
        //arriba
      case 38:
        if (e.keyCode != colision) {
          switch (orientacion) {
            case "frente":
              obj.position.z -= 0.2;
              break;
            case "izquierda":
              obj.position.x -= 0.2;
              break;
            case "derecha":
              obj.position.x += 0.2;
              break;
            case "espalda":
              obj.position.z += 0.2;
              break;
          }
        }
        break;
        //izquierda
      case 39:
        if (e.keyCode != colision) {
          switch (orientacion) {
            case "frente":
              obj.position.x += 0.2;
              break;
            case "izquierda":
              obj.position.z -= 0.2;
              break;
            case "derecha":
              obj.position.z += 0.2;
              break;
            case "espalda":
              obj.position.x -= 0.2;
              break;
          }
        }
        break;
        //abajo
      case 40:
        if (e.keyCode != colision) {
          switch (orientacion) {
            case "frente":
              obj.position.z += 0.2;
              break;
            case "izquierda":
              obj.position.x += 0.2;
              break;
            case "derecha":
              obj.position.x -= 0.2;
              break;
            case "espalda":
              obj.position.z -= 0.2;
              break;
          }
        }
        break;
    }
    lastKey = e.keyCode;
  };

  var mouse = new THREE.Vector2();
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
    const v = [Math.abs(0 - i), Math.abs(Math.PI - i), Math.abs(Math.PI * 2 - i), Math.abs(Math.PI * 3 - i)];
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
    }
  }

  i = Math.PI;

  }

  function animar() {
    requestAnimationFrame(animar);




    intersectObjMas(obj, objetos)
    //////////// camara
    mundo.camara.position.x = obj.position.x + 2 * Math.cos(0.5 * i);
    mundo.camara.position.z = obj.position.z + 2 * Math.sin(0.5 * i);
    mundo.camara.lookAt(obj.position);
    mundo.renderizar();
  }

  ///// Programa Principal
  inicializar();
  animar();
