import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'; //'../threegit/build/three.module.js';;//'https://unpkg.com/three@0.118.3/build/three.module.js';//'../threeLibs/build/three.module.js';
import {
  Mundo
} from './Clases/Mundo.js';
import {
  Figura
} from './Clases/Figura.js'
import {
  crearFormasInicio,
  crearFormaUsuario,
  crearBotones,
  cargarSonido,
  figurasAleatorias,
  figuraPrueba,
  agregarModelos,
  agregarModelosCurado,
  moveteSiNosParecemos,
  crearInstancia,
  posInicioUsuario,
  rotacion,
} from './Funciones/modelos3D.js';

///// Variables
var estado = "aviso";
var mundo;

var raycaster, mouse //Interacción con mouse
var orientacion = "frente";
var mov = 0;
var rota = false;

var usuario, modeloUsuario;
var red = [];
var indicesSimilitud = [];
var modelosRed;

var colision = -1;
var lastKey = -1;

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

///// Estados
function aviso() {
  console.log(" Aviso ");
}

function customizaciónA() {
  estado = "customizaciónA";

  // Elimino si habia otras
  if (mundo.escena.children.length > 1) {
    mundo.escena.remove(mundo.escena.children[1]);
    mundo.escena.remove(mundo.escena.children[1]);
  }

  console.log(mundo.escena.children)
  crearFormasInicio(mundo.escena);
}

function customizaciónB(seleccion) {
  estado = "customizaciónB";

  // Guardo forma elegida
  if (seleccion.position.x < 0) {
    usuario.forma = "cubo";
  } else {
    usuario.forma = "cono";
  }

  // Eliminar objetos 3D no deseados
  for (var i = 1; i < mundo.escena.children.length; i++) {
    if (mundo.escena.children[i] != seleccion) {
      mundo.escena.remove(mundo.escena.children[i]);
    }
  }

  // Cambiar visualización
  seleccion.position.x = 0;
  seleccion.scale.set(1.5, 1.5, 1.5);

  // Botones
  const botones = new THREE.Object3D;
  crearBotones(botones, mundo.listener, colores);
  mundo.escena.add(botones);

}

function espacio3D() {
  // Elimino si habia otras
  estado = "espacio3D";
  if (mundo.escena.children.length > 1) {
    mundo.escena.remove(mundo.escena.children[1]);
    mundo.escena.remove(mundo.escena.children[1]);
  }
  mundo.crearFondo();

  // modelo3D usuario
  modeloUsuario = crearFormaUsuario(mundo.escena, mundo.listener, usuario);

  // red de usuarios pasados
  modelosRed = new THREE.Object3D;

  //////////////// Pruebas
  figuraPrueba(red);
  //figurasAleatorias(red);
  //agregarModelos(mundo.listener, red, modelosRed)
  agregarModelosCurado(mundo.listener, red, modelosRed, indicesSimilitud, usuario)
  //posInicioUsuario(usuario, red, indicesSimilitud);

  mundo.escena.add(modelosRed);


  //////////////////////////////////////// CAMARA
  mundo.camara.position.y = 2;
  mundo.camara.lookAt({
    x: usuario.x,
    y: usuario.y,
    z: usuario.z
  });

  mov = Math.PI;

}

function vistaCenital() {
  /////////////////////////// ROTO
  if (mundo.camara.position.y != 40) {
    estado = "vistaCenital";
    //Activar vista cenital
    mundo.camara.position.y = 40;
    mundo.camara.rotation.x = -1.5;
  } else {
    estado = "espacio3D";
    //Desactivar vista cenital
    mundo.camara.rotation.x = -0.1;
    mundo.camara.position.set(usuario.x, usuario.y, usuario.z + 2.5);
  }
  console.log(estado);
} // ROTO

///// Interacción con click
function onDocumentMouseDown(event) {
  event.preventDefault();

  mouse.x = (event.clientX / mundo.renderizador.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / mundo.renderizador.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, mundo.camara);

  if (estado == "customizaciónA") {
    var intersects = raycaster.intersectObjects(mundo.escena.children);
    if (intersects.length > 0) {
      const int = intersects[0].object;
      customizaciónB(int);
    }
  } else if (estado == "customizaciónB") {
    var botones = mundo.escena.children[2].children
    var intersects = raycaster.intersectObjects(botones);
    if (intersects.length > 0) {
      const int = intersects[0].object;
      const index = botones.indexOf(int);
      if (index < Object.keys(colores).length) {
        // Toque botón color
        mundo.escena.children[1].material.color.set(int.material.color);
        usuario.color = int.material.color;
      } else if (index == botones.length - 1) {
        console.log("aca siguiente etapa");
        espacio3D();
      } else {
        console.log(mundo.escena.children[1].children)
        if (mundo.escena.children[1].children.length > 1) {
          mundo.escena.children[1].children[1].stop();
          mundo.escena.children[1].remove(mundo.escena.children[1].children[1])
        }
        const pos = index - Object.keys(colores).length;
        const sonido = cargarSonido(mundo.listener, sonidos[pos]);
        usuario.sonido = sonidos[pos];
        mundo.escena.children[1].add(sonido);
      }
    }
  } else if (estado == "espacio3D") {
    console.log("espacio 3D click funciona")
    var intersects = raycaster.intersectObjects(modelosRed.children);
    if (intersects.length > 0) {
      const int = intersects[0].object;
      const index = modelosRed.children.indexOf(int);
      console.log(index, red[index], int);
    }
    rota = true;
  }

}

function contemplacion() {
  if (estado != "contemplacion") {
    estado = "contemplacion";
  } else {
    calcularCara();
    estado = "espacio3D";
  }
  console.log("pling!", estado)
}

function calcularCara() {
  const v = [Math.abs(0 - mov), Math.abs(Math.PI - mov), Math.abs(Math.PI * 2 - mov), Math.abs(Math.PI * 3 - mov)];
  const index = v.indexOf(Math.min(...v))

  if (index == 0) {
    console.log("izquierda")
    orientacion = "izquierda"
    mov = 0;
  } else if (index == 1) {
    console.log("frente")
    orientacion = "frente"
    mov = Math.PI;
  } else if (index == 2) {
    console.log("derecha")
    orientacion = "derecha"
    mov = Math.PI * 2;
  } else {
    console.log("espalda")
    orientacion = "espalda"
    mov = Math.PI * 3;
  }
}

function colisiones(obj, lista) {
  const x = obj.position.x;
  const z = obj.position.z;
  const w = obj.geometry.boundingBox.max.x + 0.1;
  const d = obj.geometry.boundingBox.max.z + 0.1;
  for (var i = 0; i < lista.length; i++) {
    const xL = lista[i].position.x;
    const zL = lista[i].position.z;
    const wL = lista[i].geometry.boundingBox.max.x;
    const dL = lista[i].geometry.boundingBox.max.z;

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
  //console.log(colision)
}

///// ThreeJS

function inicializar() {
  // Mundo
  mundo = new Mundo();
  mundo.crearFondoCustomizacion();

  // usuario
  usuario = new Figura();

  // Interacción
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  /// Control Ventana
  document.addEventListener('mousedown', onDocumentMouseDown, false); // Mouse
  document.onpointermove = function() {
    if (rota) {
      if (mouse.x < 0 && mov < Math.PI * 3) {
        mov += 0.1;
      } else if (mouse.x > 0 && mov > 0) {
        mov -= 0.1;
      }
    }
  };
  document.onpointerup = function() {
    rota = false;

    /// Calcula la cara a la que va a moverse
    calcularCara();

  };

  window.addEventListener('resize', function() {
    mundo.camara.aspect = window.innerWidth / window.innerHeight;
    mundo.camara.updateProjectionMatrix();

    mundo.renderizador.setSize(window.innerWidth, window.innerHeight);
  }, false); // Resize

  document.onkeydown = function(e) {
    switch (e.keyCode) {
      case 81:
        //q
        if (estado == "aviso" || estado == "customizaciónB") {
          customizaciónA();
        } else if (estado == "espacio3D" || estado == "vistaCenital") {
          console.log(modelosRed.children.length, red.length)
          if (modelosRed.children.length == red.length) {
            // curar
            console.log("vista curada")
            while (modelosRed.children.length > 0) {
              modelosRed.children[modelosRed.children.length - 1].children[1].stop();
              modelosRed.remove(modelosRed.children[modelosRed.children.length - 1])
            }
            agregarModelosCurado(mundo.listener, red, modelosRed, indicesSimilitud, usuario)
          } else {
            // ver todos
            console.log("vista total")
            while (modelosRed.children.length > 0) {
              modelosRed.children[modelosRed.children.length - 1].children[1].stop();
              modelosRed.remove(modelosRed.children[modelosRed.children.length - 1])
            }
            agregarModelos(mundo.listener, red, modelosRed)
          }
        }
        break;
      case 65:
        //a
        console.log("Datos usuario: ", usuario);
        break;
      case 87:
        //w
        vistaCenital();
        break;
      case 69:
        //e
        if (estado == "espacio3D" || estado == "contemplacion") {
          contemplacion();
        }
        break;
    }
    if (estado == "espacio3D" || estado == "vistaCenital") {
      //rotacion(orientacion, e, usuario, colision, lastKey);
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
  }; // Teclado

  if (estado == "espacio3D") {
    espacio3D();
  } // Para cuando me quiero saltar la customizacion

}

function animar() {
  requestAnimationFrame(animar);

  if (estado == "aviso") {
    console.log(" Aviso ");
  } else if (estado == "customizaciónA") {
    mundo.escena.children[1].rotation.x -= 0.005;
    mundo.escena.children[1].rotation.y -= 0.01;
    mundo.escena.children[2].rotation.x += 0.005;
    mundo.escena.children[2].rotation.y += 0.01;
  } else if (estado == "customizaciónB") {
    mundo.escena.children[1].rotation.x -= 0.005;
    mundo.escena.children[1].rotation.y -= 0.01;
  } else if (estado == "espacio3D") {
    //espacio3D
    modeloUsuario.position.set(usuario.x, usuario.y, usuario.z);
    usuario.calcularConexiones(red);

    /*if (red.length > modelosRed.children.length) {
      moveteSiNosParecemos(modelosRed.children, indicesSimilitud);
    }*/

    THREE.DefaultLoadingManager.onLoad = function() {
      console.log('Loading Complete!');
    };

    colisiones(modeloUsuario, modelosRed.children);

    mundo.camara.position.x = usuario.x + 3 * Math.cos(0.5 * mov);
    mundo.camara.position.z = usuario.z + 3 * Math.sin(0.5 * mov);
    mundo.camara.lookAt(modeloUsuario.position);

  } else if (estado == "contemplacion") {
    mov += 0.01;
    mundo.camara.position.x = usuario.x + 5 * Math.cos(0.5 * mov);
    mundo.camara.position.z = usuario.z + 5 * Math.sin(0.5 * mov);
    mundo.camara.lookAt(modeloUsuario.position);
  } // espacio3D

  //
  mundo.renderizar();
}

///// Programa Principal
inicializar();
animar();
