import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'; //'../threegit/build/three.module.js';;//'https://unpkg.com/three@0.118.3/build/three.module.js';//'../threeLibs/build/three.module.js';
import {
  agregarModelos,
  agregarModelosCurado
} from './modelos3D.js'
////////////////////////////////// Interacción con click

export function clickEtapa1(lista, red_, raycaster_) {
  var intersects = raycaster_.intersectObjects(lista);
  if (intersects.length > 0) {
    const int = intersects[0].object;
    const index = lista.indexOf(int);
    console.log(red_[index]);
  }
}

////////////////////////////////// Interacción Teclado

export function tecladoEtapa1(e, usuario) {
  switch (e.keyCode) {
    case 37:
      //derecha
      usuario.x -= 0.2;
      break;
    case 38:
      //arriba
      usuario.z -= 0.2;
      break;
    case 39:
      //izquierda
      usuario.x += 0.2;
      break;
    case 40:
      //abajo
      usuario.z += 0.2;
      break
  }
}

export function tecladoEtapa2(orientacion, e, usuario, colision, lastKey) {
  switch (e.keyCode) {
    //derecha
    case 37:
      if (e.keyCode != colision) {
        switch (orientacion) {
          case "frente":
            usuario.x -= 0.2;
            break;
          case "izquierda":
            usuario.z += 0.2;
            break;
          case "derecha":
            usuario.z -= 0.2;
            break;
          case "espalda":
            usuario.x += 0.2;
            break;
        }
      }
      break;
      //arriba
    case 38:
      if (e.keyCode != colision) {
        switch (orientacion) {
          case "frente":
            usuario.z -= 0.2;
            break;
          case "izquierda":
            usuario.x -= 0.2;
            break;
          case "derecha":
            usuario.x += 0.2;
            break;
          case "espalda":
            usuario.z += 0.2;
            break;
        }
      }
      break;
      //izquierda
    case 39:
      if (e.keyCode != colision) {
        switch (orientacion) {
          case "frente":
            usuario.x += 0.2;
            break;
          case "izquierda":
            usuario.z -= 0.2;
            break;
          case "derecha":
            usuario.z += 0.2;
            break;
          case "espalda":
            usuario.x -= 0.2;
            break;
        }
      }
      break;
      //abajo
    case 40:
      if (e.keyCode != colision) {
        switch (orientacion) {
          case "frente":
            usuario.z += 0.2;
            break;
          case "izquierda":
            usuario.x += 0.2;
            break;
          case "derecha":
            usuario.x -= 0.2;
            break;
          case "espalda":
            usuario.z -= 0.2;
            break;
        }
      }
      break;
  }
  lastKey = e.keyCode;
}

////////////////////////////////// Vistas
export function contemplacion(estado) {
  if (estado != "contemplacion") {
    estado = "contemplacion";
  } else {
    estado = "etapa1";
  }
  console.log(estado)
  return estado;
}

export function cambiarVistaModelos(listener, red, modelos, indicesSimilitud, usuario) {
  if (red.length > modelos.children.length) {
    console.log("Paso a vista total")
    while (modelos.children.length > 0) {
      modelos.children[modelos.children.length - 1].children[1].stop();
      modelos.remove(modelos.children[modelos.children.length - 1])
    }
    agregarModelos(listener, red, modelos);
  } else {
    console.log("Paso a vista curada")
    while (modelos.children.length > 0) {
      modelos.children[modelos.children.length - 1].children[1].stop();
      modelos.remove(modelos.children[modelos.children.length - 1])
    }
    agregarModelosCurado(listener, red, modelos, indicesSimilitud, usuario);
  }
}
