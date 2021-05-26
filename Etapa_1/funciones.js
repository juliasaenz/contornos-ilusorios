import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';

////////////////////////////////////// THREEJS ////////////////////////////////////////////////
export function crearInstancia(forma, color, x, y, z) {
  //Crea objeto 3D
  const material = new THREE.MeshPhongMaterial({
    color
  });

  var geometria;
  if (forma == 'cubo') {
    geometria = new THREE.BoxGeometry(1, 1, 1); // Geometria 1
  } else {
    geometria = new THREE.ConeGeometry(0.7, 1, 12); // Geometria 2
  }

  const instancia = new THREE.Mesh(geometria, material);
  instancia.position.x = x;
  instancia.position.y = y;
  instancia.position.z = z;
  return instancia;
}

export function actualizarPosicion(objeto, x, z) {
  //actualiza posicion de objeto 3D
  objeto.position.x = x;
  objeto.position.z = z;
}

////////////////////////////////////// OTRAS /////////////////////////////////////////////
export function vista(vistaCenital, camara, x, z) {
  if (!vistaCenital) {
    camara.position.x = x;
    camara.position.z = z + 1.5;
    camara.position.y = 0.5;
    camara.rotation.x = 0;
  } else {
    camara.position.x = 0;
    camara.position.y = 40;
    camara.position.z = 0;
    camara.rotation.x = -1.5;
  }

}


export function distancia(x1, y1, z1, x2, y2, z2) {
  // P1 = (x1, y1, z1); P2 = (x2, y2, z2)

  var a = x2 - x1;
  var b = y2 - y1;
  var c = z2 - z1;

  var distance = Math.sqrt(a * a + b * b + c * c);
  if (distance < 10) {
    return true;
  }
  return false;
}
