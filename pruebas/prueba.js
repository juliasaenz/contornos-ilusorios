import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'; //'../threegit/build/three.module.js';;//'https://unpkg.com/three@0.118.3/build/three.module.js';//'../threeLibs/build/three.module.js';
import {
  Mundo
} from '../Clases/Mundo.js';

///// ThreeJS
var mundo;
var obj, obj2;
var i = 1;
var mueve = false;
var orientacion = "frente";
var objetos = [];


var lastKey = "none";
var colision = -1;

var texto;
var play = false;

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
  //var audio = cargarSonido(mundo.listener, '../data/sonidos/1/Sonido (1).wav');
  //obj.add(audio);

  obj2 = new THREE.Mesh(geometry, material);
  obj2.position.set(0.5, -0.5, -2);
  mundo.escena.add(obj2);
  objetos.push(obj2)
  var audio = cargarSonido(mundo.listener, '../data/sonidos/1/Sonido (1).wav');
  obj2.add(audio);



  mundo.camara.position.x = obj.position.x + 2 * Math.cos(0);
  mundo.camara.position.z = obj.position.z + 2 * Math.sin(0);
  mundo.camara.lookAt(obj.position);

  document.onkeydown = function(e) {
    switch (e.keyCode) {
      //derecha
      case 37:
      case 65:
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
      case 87:
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
      case 68:
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
      case 83:
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
      case 81:
        play = !play;
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

  ///////////
  texto = document.createElement("p");
  texto.style.top = '45%';
  texto.style.left = '60%';
  document.body.append(texto);

}

export function cargarSonido(listener, archivo) {
  const audioLoader = new THREE.AudioLoader();

  const sonido = new THREE.PositionalAudio(listener);
  audioLoader.load(archivo, function(buffer) {
    sonido.setBuffer(buffer);

    sonido.setRefDistance(0.7); // A que distancia empieza a reducir el volumen
    sonido.setRolloffFactor(1.2); // A que velocidad disminuye el volumen
    sonido.setMaxDistance(1000);

    sonido.play();
    sonido.setLoop(true);
    sonido.setVolume(1);
    sonido.setDistanceModel("exponential");
  });

  return sonido;
}

function distancia(obj1, obj2) {
  const audio = obj2.children[0];

  var a = obj.position.x - obj2.position.x;
  var b = obj.position.y - obj2.position.y;
  var c = obj.position.z - obj2.position.z;

  var distance = a * a + b * b + c * c;
  texto.innerText = distance + " " + Math.pow(6, 2) + " " + audio.isPlaying + " " + play;

  if (distance < Math.pow(6, 2)) {
    if (!audio.isPlaying) {
      audio.play();
    }
  } else {
    if (audio.isPlaying) {
      audio.stop();
    }
  }
}

function animar() {
  requestAnimationFrame(animar);

  //texto.innerText = obj.position.x + "  " + obj.position.y;

  //////////// camara
  mundo.camara.position.x = obj.position.x + 2 * Math.cos(0.5 * i);
  mundo.camara.position.z = obj.position.z + 2 * Math.sin(0.5 * i);
  mundo.camara.lookAt(obj.position);

  if (play) {
    distancia(obj, obj2);
  }
  mundo.renderizar();
}

///// Programa Principal
inicializar();
animar();
