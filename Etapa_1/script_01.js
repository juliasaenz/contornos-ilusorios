import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'; //'../threegit/build/three.module.js';;//'https://unpkg.com/three@0.118.3/build/three.module.js';//'../threeLibs/build/three.module.js';
import {
  Mundo
} from '../Clases/Mundo.js';
import {
  Figura
} from '../Clases/Figura.js';
import {
  crearInstancia,
  distancia,
  actualizarPosicion,
  vista
} from './funciones.js';

var mundo;
var usuario, objetoUsuario;
var figuras = [];
var conexiones = [];

// Control
var vistaCenital = false;

function inicializar() {
  mundo = new Mundo();
  mundo.crearFondo();

  /////// Datos y ObjetoUsuario
  usuario = new Figura(0, 'cubo', 0x000055);
  objetoUsuario = crearInstancia(usuario.forma, usuario.color, usuario.x, usuario.y, usuario.z);
  mundo.escena.add(objetoUsuario);

  ////// Figuras
  for (var i = 0; i <= 15; i++) {
    var ran = Math.floor(Math.random() * (1 - 0 + 1) + 0);
    var tipo = 'cubo';
    if (ran >= 1) {
      tipo = 'cono';
    }
    var f = new Figura(i + 1, tipo, 0x550000, 15 - Math.random() * 30, 15 - Math.random() * 30)
    figuras.push(f);
    var obj = crearInstancia(f.forma, f.color, f.x, f.y, f.z);
    mundo.escena.add(obj);
  }

}

function animar() {
  requestAnimationFrame(animar);
  document.onkeydown = function(e) { //Movimiento usuario
    switch (e.keyCode) {
      case 37:
        usuario.x -= 0.1;
        break;
      case 38:
        usuario.z -= 0.1;
        break;
      case 39:
        usuario.x += 0.1;
        break;
      case 40:
        usuario.z += 0.1;
        break;
      case 81:
        //q
        vistaCenital = !vistaCenital;
    }
  };
  actualizarPosicion(objetoUsuario, usuario.x, usuario.z); //Mover el objetoUsuario
  vista(vistaCenital, mundo.camara, usuario.x, usuario.z); //Cambiar de cámara POV a cámara cenital

  // MEDIDOR DE DISTANCIA
  for (var i = 0; i < figuras.length; i++) {
    if (distancia(usuario.x, usuario.y, usuario.z, figuras[i].x, figuras[i].y, figuras[i].z)) {
        var found = conexiones.findIndex(f => f.id === figuras[i].id);
        if (found === -1) {
          conexiones.push(figuras[i]);
        }
    } else {
      var found = conexiones.findIndex(f => f.id === figuras[i].id);
      if (found != -1) {
        conexiones.splice(found, 1);
      }
    }

  }
  console.log(conexiones.length);

  //
  mundo.renderizar();
}


////////////////////////////////
inicializar();
animar();
