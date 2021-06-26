import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'; //'../threegit/build/three.module.js';;//'https://unpkg.com/three@0.118.3/build/three.module.js';//'../threeLibs/build/three.module.js';
import {
  crearInstancia,
  cargarSonido,
  eliminarSonido
} from './modelos3D.js'
import {
  elegirSonidoAzar
} from './calculos.js'
import {
  customizaciónA,
  customizaciónB,
  etapa1
} from '../script1.js'

var colores = {
  rosa: "#EC90BF",
  rosita: "#F15733",
  fucsia: "#FC3DC9",
  naranja: "#FDA449",
  anaranjado: "#F2B361",
  amarillo: "#E4BE5B",
  verde: "#7DFF9B",
  celeste: "#00FFF9",
  cian: "#39C7CB",
  azul: "#016DF6",
  violeta: "#9F34D8",
  lila: "#C86DDE"
}
var sonidos = [];

////////////////////////////////// Iniciar Customización ///////////////////////////////////

export function aviso() {
  // Aca deberia haber algun texto o algo
  //alert("aviso")
}

export function customizaciónAA(estado, escena) {
  // Hacer cutom
  estado = "customizaciónA";

  // Elimino si habia otras
  if (escena.children.length > 1) {
    if (escena.children[1].children.length > 1) {
      escena.children[1].children[1].stop();
      escena.children[1].remove(mundo.escena.children[1].children[1])
    }
    escena.remove(escena.children[1]);
    escena.remove(escena.children[1]);
  }

  crearFormasInicio(escena);
} // No funciona

function customizaciónBB(seleccion, lista, usuario, escena, listener, estado) {
  estado = "customizaciónB";

  // Guardo forma elegida
  if (seleccion.position.x < 0) {
    usuario.forma = "cubo";
  } else {
    usuario.forma = "cono";
  }

  // Eliminar objetos 3D no deseados
  for (var i = 1; i < lista.length; i++) {
    if (lista[i] != seleccion) {
      escena.remove(lista[i]);
    }
  }

  // Cambiar visualización
  seleccion.position.x = 0;
  seleccion.scale.set(1.5, 1.5, 1.5);

  // Botones
  escena.add(crearBotones(listener));
} // no funciona

////////////////////////////////// Interacción Customización ///////////////////////////////

export function clickCustomizacionA(lista, raycaster_, usuario, listener, escena, estado) {
  var intersects = raycaster_.intersectObjects(lista);
  if (intersects.length > 0) {
    const int = intersects[0].object;
    customizaciónB(int);
    //customizaciónBB(int, lista, usuario, escena, listener, estado);
  }
}

export function clickCustomizacionB(lista, raycaster_, usuario_, listener) {
  var botones = lista[2].children
  var intersects = raycaster_.intersectObjects(botones);
  if (intersects.length > 0) {
    const int = intersects[0].object;
    const index = botones.indexOf(int);
    if (index < Object.keys(colores).length) {
      // Toque botón color
      lista[1].material.color.set(int.material.color);
      usuario_.color = int.material.color;
    } else if (index == botones.length - 1) {
      // Toque botón volver
      customizaciónA();
    } else {
      /// elegir sonido
      for (var i = Object.keys(colores).length; i < botones.length - 1; i++) {
        botones[i].material.color.set(0xAAAAAA)
      }
      int.material.color.set(0x777777)
      if (lista[1].children.length > 1) {
        lista[1].children[1].stop();
        lista[1].remove(lista[1].children[1])
      }
      const pos = index - Object.keys(colores).length;
      const sonido = cargarSonido(listener, sonidos[pos], null);
      usuario_.sonido = sonidos[pos];
      lista[1].add(sonido);

    }
  }
}

////////////////////////////////// Funciones de Customización //////////////////////////////

export function crearFormasInicio(escena) {
  /// Crea las dos formas que se ven en customización A
  const cubo = crearInstancia('cubo', "#FFFFFF", -3, 0.5, -4);
  escena.add(cubo[0]);
  cubo[1].position.set(0, 0, 0);
  cubo[0].add(cubo[1]);

  const cono = crearInstancia('cono', "#FFFFFF", 3, 0.5, -4);
  escena.add(cono[0]);
  cono[1].position.set(0, 0.2, 0);
  cono[0].add(cono[1]);
}

export function rotarObjeto3D(obj) {
  obj.rotation.x -= 0.005;
  obj.rotation.y -= 0.01;
}

export function crearBotones(listener) {
  var botones = new THREE.Object3D;
  botonesColor(colores, botones);
  botonesSonido(listener, botones);
  botonVolver(botones);
  //botonContinuar(botones)
  return botones;
}

function botonesColor(colores, botones) {
  var i = 0;
  const geometry = new THREE.PlaneGeometry(0.06, 0.18);
  for (const key in colores) {
    const material = new THREE.MeshBasicMaterial({
      color: colores[key]
    });
    const circle = new THREE.Mesh(geometry, material);
    circle.position.set(-1.8, 1 - i * 0.18, 0);
    i++;
    botones.add(circle);
  }
}

function botonesSonido(listener, botones) {
  for (var i = 0; i < 5; i++) {
    const geometry = new THREE.CircleGeometry(0.04, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xAAAAAA
    });
    const circle = new THREE.Mesh(geometry, material);
    circle.position.set(1.8, 0.5 - i * 0.22, 0);

    botones.add(circle);
    sonidos[i] = elegirSonidoAzar(i + 1);
  }
}

function botonVolver(botones) {
  /* FLECHA
  const material = new THREE.LineBasicMaterial({
    color: 0xFAFAFA,
  });
  const boton = new THREE.Line(_geometria(), material);
  boton.position.set(-2.3, 0.95, 0);
  */

  const geometry = new THREE.PlaneGeometry(0.12, 0.12);
  const material = new THREE.MeshBasicMaterial({
    color: 0x040404
  });
  const boton = new THREE.Mesh(geometry, material);
  boton.position.set(-2.18, 0.9, 0);

  botones.add(boton);
}

function _geometria() {
  const vertices = new Float32Array([
    0.09, 0.05, 0,
    0, 0, 0,
    0.09, -0.05, 0,
    0, 0, 0,
    0.2, 0, 0,
  ]);

  const geoCono = new THREE.BufferGeometry();
  geoCono.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  return geoCono;
}

function botonContinuar(botones) {
  const geometry = new THREE.PlaneGeometry(1, 0.2);
  const material = new THREE.MeshBasicMaterial({
    color: 0x040404
  });
  const boton = new THREE.Mesh(geometry, material);
  boton.position.set(0, -0.7, 0);

  botones.add(boton);

  //////////////////////
}
