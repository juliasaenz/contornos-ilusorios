import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'; //'../threegit/build/three.module.js';;//'https://unpkg.com/three@0.118.3/build/three.module.js';//'../threeLibs/build/three.module.js';
import {
  agregarModelo,
  agregarModelos,
  agregarModelosCurado,
  crearTexto
} from './modelos3D.js'
import {
  scale
} from './calculos.js'
////////////////////////////////// Interacción con click

export function hoverEtapa4(lista, red_, raycaster_, mouse, indicesSimilitud, prev) {
  var intersects = raycaster_.intersectObjects(lista);
  if (intersects.length > 0) {
    const int = intersects[0].object;
    const index = lista.indexOf(int);

    const posX = scale(mouse.x, -1, 1, 0, window.innerWidth) - parseInt(Math.random() * 20);
    const posY = scale(-mouse.y, -1, 1, 0, window.innerHeight) + parseInt(Math.random() * 20);

    if (index != prev) {
      const t = document.createElement('p');
      t.setAttribute('id', 'dato');
      t.style.left = posX.toString() + "px";
      t.style.top = posY.toString() + "px";
      t.style.opacity = 1;
      t.innerText = red_[index].texto(0, "estático", indicesSimilitud[index]);;
      document.body.append(t);
    }

    return index;
  }
}

export function clickEtapa3(lista, red_, raycaster_, mouse, indicesSimilitud) {
  var intersects = raycaster_.intersectObjects(lista);
  if (intersects.length > 0) {
    const int = intersects[0].object;
    const index = lista.indexOf(int);

    const posX = scale(mouse.x, -1, 1, 0, window.innerWidth) - 10;
    const posY = scale(-mouse.y, -1, 1, 0, window.innerHeight) - 10;

    const t = document.createElement('p');
    t.setAttribute('id', 'dato');
    t.style.left = posX.toString() + "px";
    t.style.top = posY.toString() + "px";
    t.style.opacity = 1;
    t.innerText = red_[index].texto(0, "estático", indicesSimilitud[index]);
    document.body.append(t);

    return index;
  }
  return -1;

}

////////////////////////////////// Interacción Teclado

export function tecladoEtapa1(e, usuario) {
  switch (e.keyCode) {
    case 37:
    case 65:
      //derecha
      usuario.x -= 0.2;
      break;
    case 38:
    case 87:
      //arriba
      usuario.z -= 0.2;
      break;
    case 39:
    case 68:
      //izquierda
      usuario.x += 0.2;
      break;
    case 40:
    case 83:
      //abajo
      usuario.z += 0.2;
      break
  }
}

export function tecladoEtapa2(orientacion, e, usuario, colision, lastKey) {
  switch (e.keyCode) {
    //derecha
    case 37:
    case 65:
      if (e.keyCode != colision) {
        switch (orientacion) {
          case "frente":
            usuario.x -= 0.4;
            break;
          case "izquierda":
            usuario.z += 0.4;
            break;
          case "derecha":
            usuario.z -= 0.4;
            break;
          case "espalda":
            usuario.x += 0.4;
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
            usuario.z -= 0.4;
            break;
          case "izquierda":
            usuario.x -= 0.4;
            break;
          case "derecha":
            usuario.x += 0.4;
            break;
          case "espalda":
            usuario.z += 0.4;
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
            usuario.x += 0.4;
            break;
          case "izquierda":
            usuario.z -= 0.4;
            break;
          case "derecha":
            usuario.z += 0.4;
            break;
          case "espalda":
            usuario.x -= 0.4;
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
            usuario.z += 0.4;
            break;
          case "izquierda":
            usuario.x += 0.4;
            break;
          case "derecha":
            usuario.x -= 0.4;
            break;
          case "espalda":
            usuario.z -= 0.4;
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
  return estado;
}

export function recargarVistaCurada(listener, red, modelos, indicesSimilitud, usuario) {
  for (var i = 0; i < red.length; i++) {
    if (indicesSimilitud[i] <= 0.6) {
      red[i].pos = -1;
    }
  }
  while (modelos.children.length > 0) {
    modelos.children[modelos.children.length - 1].children[1].stop();
    modelos.remove(modelos.children[modelos.children.length - 1])
  }
  agregarModelosCurado(listener, red, modelos, indicesSimilitud, usuario);
}

export function vistaTotalModelos(listener, red, modelos, usuario, indicesSimilitud) {
  while (modelos.children.length > 0) {
    modelos.children[modelos.children.length - 1].children[1].stop();
    modelos.remove(modelos.children[modelos.children.length - 1])
  }
  agregarModelos(listener, red, modelos, usuario, indicesSimilitud);
}
