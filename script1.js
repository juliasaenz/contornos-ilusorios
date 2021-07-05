import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'; //'../threegit/build/three.module.js';;//'https://unpkg.com/three@0.118.3/build/three.module.js';//'../threeLibs/build/three.module.js';
import {
  PointerLockControls
} from 'https://unpkg.com/three@0.121.1/examples/jsm/controls/PointerLockControls.js'
import {
  Mundo
} from './Clases/Mundo.js';
import {
  Figura
} from './Clases/Figura.js'
import {
  crearFormaUsuario,
  figurasAleatorias,
  figuraPrueba,
  figurasFijas,
  agregarModelos,
  agregarModelosCurado,
  moveteSiNosParecemos,
  posInicioUsuario,
  crearTexto
} from './Funciones/modelos3D.js';
import {
  aviso,
  crearFormasInicio,
  crearBotones,
  clickCustomizacionA,
  clickCustomizacionB,
  tecladoCustomizacionB,
  rotarObjeto3D
} from './Funciones/customizacion.js'
import {
  clickEtapa3,
  hoverEtapa4,
  tecladoEtapa1,
  tecladoEtapa2,
  contemplacion,
  vistaTotalModelos,
  recargarVistaCurada
} from './Funciones/espacio3D.js'

///////////////////////////// Variables

// Estados: Aviso -> CustomizaciónA -> CustomizaciónB -> Etapa 1 -> Etapa2 -> Etapa 3 -> Etapa 4 -> Contemplación
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

var seguir = false;
var texto, nom;
var btn;

/// movimiento
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


/// instrucciones
var cargo = true;
var play = true;

///borrar
var prevI = -1;

///////////////////////////////////////////// Inicializar Estados
export function customizaciónA() {
  estado = "customizaciónA";
  // Elimino si habia otras
  while (mundo.escena.children.length > 1) {
    mundo.escena.remove(mundo.escena.children[1]);
  }

  let inputVal = document.getElementById("nombre");
  if (inputVal != null) {
    document.body.removeChild(inputVal);
  }

  crearFormasInicio(mundo.escena);
  seguir = false;
  usuario.sonido = "ninguno";
}

export function customizaciónB(seleccion) {
  instrucciones("");
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
  mundo.escena.add(crearBotones(mundo.listener));

  crearTexto(mundo.escena, "<", -2.2, 0.85, 0)

  btn = document.getElementById("bContinuar");
  btn.value = "Comenzar";
  btn.style.color = "grey";

  nom = document.createElement("p");
  nom.setAttribute("id", "nombre");
  nom.style.color = "white";
  nom.innerText = "";
  document.body.appendChild(nom);

}

export function etapa1() {
  bajarVolumen();
  // Instrucciones
  instrucciones(" Mover: WASD o Flechas \n\n ");

  //
  let inputVal = document.getElementById("nombre");
  usuario.nombre = inputVal.innerText;
  usuario.crearID();
  document.body.removeChild(inputVal);

  // Elimino si habia otras
  estado = "etapa1";

  while (mundo.escena.children.length > 1) {
    if(mundo.escena.children[1].type == "Object3D"){
      var botones = mundo.escena.children[1];
      for(var j= 0; j < botones.children.length; j++){
        if (botones.children[j].children.length > 0){ // busco hijos con audio
          const audio = botones.children[j].children[0];
          if (audio.isPlaying){
            audio.stop();
          }
        }
      }
    }
    mundo.escena.remove(mundo.escena.children[1]);
  }

  mundo.crearFondo();

  // modelo3D usuario
  modeloUsuario = crearFormaUsuario(mundo.escena, mundo.listener, usuario);

  // red de usuarios pasados
  modelosRed = new THREE.Object3D;

  //////////////// Pruebas
  //figuraPrueba(red);
  //figurasAleatorias(red);
  figurasFijas(red);
  //agregarModelos(mundo.listener, red, modelosRed)
  agregarModelosCurado(mundo.listener, red, modelosRed, indicesSimilitud, usuario)

  mundo.escena.add(modelosRed);

  /////////// tiempo
  usuario.tiempo = usuario.tiempo + mundo.reloj.getElapsedTime();
  //console.log("Tiempo en la obra", usuario.tiempo);
  mundo.reloj.start();
  seguir = false;
  btn.removeEventListener("click", etapa1);
  btn.value = "";
  btn.style.color = "white";

  //////////////////////////////////////// CAMARA
  mundo.camara.position.y = 2;
  mundo.camara.lookAt({
    x: usuario.x,
    y: usuario.y,
    z: usuario.z
  });

  mov = Math.PI;

  //
  mundo.bloomPass.strength = 4;
}

function etapa2() {
  bajarVolumen();
  instrucciones(" Mover: WASD o Flechas \n Rotar: Click & Drag \n\n ");

  estado = "etapa2";
  //console.log("pasando a vista total")
  vistaTotalModelos(mundo.listener, red, modelosRed, usuario, indicesSimilitud);
  mundo.escena.fog.near = 20;
  mundo.bloomPass.strength -= 0.9;

  // Tiempo
  usuario.tiempo = usuario.tiempo + mundo.reloj.getElapsedTime();
  console.log("Tiempo en la obra", usuario.tiempo);
  mundo.reloj.start();

  // Botón
  btn.value = " ";
  btn.removeEventListener("click", etapa2);
  seguir = false;
}

function etapa3() {
  bajarVolumen();
  estado = "etapa3";
  mundo.bloomPass.strength -= 0.9;

  instrucciones(" Mover: WASD o Flechas \n Rotar: Click & Drag \n Ver: Click \n\n ");
  cargo = true;

  // Tiempo
  usuario.tiempo = usuario.tiempo + mundo.reloj.getElapsedTime();
  console.log("Tiempo en la obra", usuario.tiempo);
  mundo.reloj.start();

  // Botón
  btn.value = " ";
  btn.removeEventListener("click", etapa3);
  seguir = false;

  // Texto
  texto.style.top = '45%';
  texto.style.left = '60%';
}

function etapa4() {
  bajarVolumen();
  borrarDatos();
  instrucciones(" Mover: WASD o Flechas \n Rotar: Click & Drag \n Inclinación: Ruedita \n Ver: Click \n\n ");
  cargo = true;

  estado = "etapa4";
  mundo.bloomPass.strength -= 0.9;

  // Tiempo
  usuario.tiempo = usuario.tiempo + mundo.reloj.getElapsedTime();
  console.log("Tiempo en la obra", usuario.tiempo);
  mundo.reloj.start();

  // Botón
  btn.value = " ";
  btn.removeEventListener("click", etapa4);
  seguir = false;

  mundo.escena.fog = null;

  //Código
  verCodigo();

  //Scroll
  document.addEventListener('wheel', function(event) {
    event.preventDefault();
    if (event.deltaY > 0 && mundo.camara.position.y > -0.9) {
      mundo.camara.position.y -= 0.1;
    } else if (event.deltaY < 0 && mundo.camara.position.y < 1.5) {
      mundo.camara.position.y += 0.1;
    }
    mundo.camara.lookAt(modeloUsuario.position);
  });
}

///////////////////////////////////////////// Estas idealmente se irian de aca

function bajarVolumen(){
  for(var i = 1; i > 0; i -= 0.01){
    mundo.listener.setMasterVolume(i);
  }
}

function verCodigo() {
  const alt = 130;
  var m = cargarImagen('../tesina/data/imagenes/01cod.png')
  m.position.set(0, alt, -200);
  mundo.escena.add(m);

  var m2 = cargarImagen('../tesina/data/imagenes/02cod.png')
  m2.position.set(200, alt, 0);
  m2.rotation.y = -Math.PI / 2;
  mundo.escena.add(m2);

  var m3 = cargarImagen('../tesina/data/imagenes/03cod.png')
  m3.position.set(0, alt, 200);
  m3.rotation.y = Math.PI;
  mundo.escena.add(m3);

  var m4 = cargarImagen('../tesina/data/imagenes/04cod.png')
  m4.position.set(-200, alt, 0);
  m4.rotation.y = Math.PI / 2;
  mundo.escena.add(m4);
}

function cargarImagen(url) {
  const loader = new THREE.TextureLoader();
  const texture = loader.load(url);

  const planeGeo = new THREE.PlaneGeometry(400, 285);
  const planeMat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  return mesh;
}

function instrucciones(texto) {
  const instructions = document.getElementById("instructions");
  const blocker = document.getElementById("blocker");
  instructions.style.display = 'flex';
  const t = document.getElementById("tins");
  t.style.top = "30%";
  t.innerText = texto;
  t.style.textAlign = "center";

  blocker.style.display = '';

  mundo.listener.setMasterVolume(0);

  if (estado != "etapa3") {
    const p = document.getElementById("play");
    p.innerText = " \n\n\n Preparando espacio";
    cargo = false;
  }
  play = false;
}

function calcularCaraB() {
  const v = [Math.abs(0 - mov), Math.abs(Math.PI - mov), Math.abs(Math.PI * 2 - mov), Math.abs(Math.PI * 3 - mov)];
  const index = v.indexOf(Math.min(...v))

  if (index == 0) {
    orientacion = "izquierda"
    mov = 0;
  } else if (index == 1) {
    orientacion = "frente"
    mov = Math.PI;
  } else if (index == 2) {
    orientacion = "derecha"
    mov = Math.PI * 2;
  } else {
    orientacion = "espalda"
    mov = Math.PI * 3;
  }

}

function botonSeguir(reloj) {
  if (play && reloj.getElapsedTime() > 15) {
    seguir = !seguir;
    if (seguir) {

      btn = document.getElementById("bContinuar");
      btn.value = "Continuar";
      if (estado == "etapa1") {
        btn.addEventListener("click", etapa2);
      } else if (estado == "etapa2") {
        btn.addEventListener("click", etapa3);
      } else if (estado == "etapa3") {
        btn.addEventListener("click", etapa4);
      } else if (estado == "etapa4") {
        btn.addEventListener("click", function() {
          estado = "contemplacion";
          btn.remove();
          borrarDatos();
        });
        btn.value = "Terminar";
      }

    } else {
      seguir = true;
    }
  }
}

function borde(x, z) {
  if (x > 195 || x < -195) {
    x = 0;
  }
  if (z > 195 || x < -195) {
    z = 0;
  }
  return x, z;
}

function mostrarDatos(vel) {
  const te = document.getElementById("dato");
  if (te != null && te.style.opacity > 0) {
    te.style.opacity -= vel;
  } else if (te != null && te.style.opacity == 0) {
    te.remove();
  }
}

function borrarDatos() {
  var te = document.getElementById("dato");
  while (te != null) {
    te.remove();
    te = document.getElementById("dato");
  }
}
///// ThreeJS

function distancia(obj, obj2) {
  const audio = obj2.children[1];

  var a = obj.position.x - obj2.position.x;
  var b = obj.position.y - obj2.position.y;
  var c = obj.position.z - obj2.position.z;

  var distance = a * a + b * b + c * c;

  if (distance < 100) {
    if (!audio.isPlaying) {
      audio.play();
    }
  } else {
    if (audio.isPlaying) {
      audio.stop();
    }
  }
}

function distanciaSonidos(obj, modelos) {
  for (var i = 0; i < modelos.length; i++) {
    distancia(obj, modelos[i]);
  }
}

function inicializar() {
  ///// texto
  texto = document.createElement('p');
  document.body.append(texto);

  // Mundo
  mundo = new Mundo();
  mundo.crearFondoCustomizacion();

  // usuario
  usuario = new Figura();

  // Interacción
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Interacción click y teclado
  document.addEventListener('mousedown', function(event) {
    if (play) {
      event.preventDefault();
      // mouse
      mouse.x = (event.clientX / mundo.renderizador.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / mundo.renderizador.domElement.clientHeight) * 2 + 1;
      oldX = mouse.x;
      raycaster.setFromCamera(mouse, mundo.camara);

      if (estado == "customizaciónA") {
        clickCustomizacionA(mundo.escena.children, raycaster, usuario, mundo.listener, mundo.escena, estado);
      } else if (estado == "customizaciónB") {
        clickCustomizacionB(mundo.escena.children, raycaster, usuario, mundo.listener);

      } else if (estado == "etapa2" || estado == "etapa4") {
        rota = true;
      } else if (estado == "etapa3") {
        clickEtapa3(modelosRed.children, red, raycaster, mouse, indicesSimilitud);
        rota = true;
      }
    }
  }, false); // Mouse
  var oldX, oldY = 0;

  /////
  var der, izq;
  der = document.createElement("p");
  der.style.top = '45%';
  der.style.left = '80%';
  der.style.fontSize = '32px';
  der.innerText = "";
  document.body.append(der);
  izq = document.createElement("p");
  izq.style.top = '45%';
  izq.style.left = '20%';
  izq.style.fontSize = '32px';
  izq.innerText = "";
  document.body.append(izq);
  ///////
  var prevI = -1;

  document.onpointermove = function() {
    var dir = 1;
    if ((estado == "etapa2" || estado == "etapa3") && rota) {
      if (mouse.x > oldX && mov < Math.PI * 3) {
        dir = 1;
      } else if (mouse.x < oldX && mov > 0) {
        dir = -1;
      }
      mov += 0.1 * dir;

    } else if (estado == "etapa4") {
      if (rota) {
        if (mouse.x > oldX) {
          dir = 1;
        } else if (mouse.x < oldX) {
          dir = -1;
        }
        mov += 0.3 * dir;
      }
      //raycaster.setFromCamera(mouse, mundo.camara);
      //prevI = hoverEtapa4(modelosRed.children, red, raycaster, mouse, indicesSimilitud, prevI);
    }
    oldX = mouse.x;
    oldY = mouse.y;
    mouse.x = (event.clientX / mundo.renderizador.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / mundo.renderizador.domElement.clientHeight) * 2 + 1;
  };

  document.onpointerup = function() {
    if (estado == "etapa2" || estado == "etapa3") {
      rota = false;
      calcularCaraB();
      izq.innerText = "";
      der.innerText = "";
    } else if (estado == "etapa4") {
      rota = false;
    }
  };
  document.onkeydown = function(e) {
    if (play) {
      if (estado == "customizaciónB") {
        nom.innerText = tecladoCustomizacionB(nom.innerText);
      }
      if (estado == "etapa1") {
        tecladoEtapa1(e, usuario);
      } else if (estado == "etapa2" || estado == "etapa3") {
        tecladoEtapa2(orientacion, e, usuario, colision, lastKey)
      }
    }
  };

  // Resize
  window.addEventListener('resize', onWindowResize);
  window.addEventListener("beforeunload", function(e) {

    if (estado != "contemplacion") {
      var confirmationMessage = 'La experiencia aun no termina';

      (e || window.event).returnValue = confirmationMessage; //Gecko + IE
      return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    }
  });

  // Movimiento cámara
  controls = new PointerLockControls(mundo.camara, document.body);
  mundo.escena.add(controls.getObject());

  // Movimiento teclas
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

      }
    }
  };
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  // Instrucciones
  const ins = document.getElementById("instructions");
  const bl = document.getElementById("blocker");
  bl.addEventListener('click', function() {
    if (cargo) {
      play = true;
      ins.style.display = 'none';
      bl.style.display = 'none';
      mundo.listener.setMasterVolume(1);

      usuario.tiempo = usuario.tiempo + mundo.reloj.getElapsedTime();
      mundo.reloj.start();

      if (estado == "aviso") {
        customizaciónA();
      }
    }
  });

}

function animar() {
  requestAnimationFrame(animar);

  if (estado == "aviso") {
    // Aca iria imagen o algo
    texto.innerText = "";
  } else if (estado == "customizaciónA") {
    rotarObjeto3D(mundo.escena.children[1]);
    rotarObjeto3D(mundo.escena.children[2]);
    texto.innerText = " ";
  } else if (estado == "customizaciónB") {
    rotarObjeto3D(mundo.escena.children[1]);
    texto.innerText = " ";

    if (usuario.color != '#FF0000' && usuario.sonido != 'ninguno' && nom.innerText != "escriba su nombre" && nom.innerText.length > 0) {
      // Botón para siguiente etapa
      seguir = !seguir;
      if (seguir) {
        btn.style.color = "white";
        btn.addEventListener("click", etapa1);
      } else {
        seguir = true;
      }
    }

  } else if (estado == "etapa1" || estado == "etapa2" || estado == "etapa3") {
    modeloUsuario.position.set(usuario.x, usuario.y, usuario.z);
    usuario.limite(195);
    usuario.calcularConexiones(red);
    moveteSiNosParecemos(modelosRed.children, indicesSimilitud);

    mundo.camara.position.x = usuario.x + 3.5 * Math.cos(0.5 * mov);
    mundo.camara.position.z = usuario.z + 3.5 * Math.sin(0.5 * mov);
    mundo.camara.lookAt(modeloUsuario.position);

    botonSeguir(mundo.reloj);
    const audio = modeloUsuario.children[1];
    if (!audio.isPlaying){
      //audio.play();
    }

    /////
    distanciaSonidos(modeloUsuario, modelosRed.children);
    /////


    if (estado == "etapa3") {
      if (play) {
        texto.innerText = usuario.texto(mundo.reloj.getElapsedTime(), orientacion);
      } else {
        texto.innerText = "";
      }
      mostrarDatos(0.02);
    } else {
      texto.innerText = " ";
    }

  } else if (estado == "etapa4") {
    usuario.calcularConexiones(red);
    moveteSiNosParecemos(modelosRed.children, indicesSimilitud);
    botonSeguir(mundo.reloj);

    if (play) {
      texto.innerText = usuario.texto(mundo.reloj.getElapsedTime(), "libre");
    } else {
      texto.innerText = "";
    }
    mostrarDatos(0.01);

    /////
    distanciaSonidos(modeloUsuario, modelosRed.children);
    /////

    /// movimiento
    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    if (rota) {
      mundo.camara.position.x = usuario.x + 3.5 * Math.cos(0.5 * mov);
      mundo.camara.position.z = usuario.z + 3.5 * Math.sin(0.5 * mov);
      mundo.camara.lookAt(modeloUsuario.position);
    } else {
      velocity.x -= velocity.x * 8.0 * delta;
      velocity.z -= velocity.z * 8.0 * delta;

      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveRight) - Number(moveLeft);
      direction.normalize(); // this ensures consistent movements in all directions

      if (moveForward || moveBackward) velocity.z -= direction.z * 100.0 * delta;
      if (moveLeft || moveRight) velocity.x -= direction.x * 100.0 * delta;

      controls.moveRight(-velocity.x * delta);
      controls.moveForward(-velocity.z * delta);

      var angulo = Math.atan2(mundo.camara.getWorldDirection().z, mundo.camara.getWorldDirection().x)
      usuario.x = mundo.camara.position.x + 3.5 * Math.cos(angulo);
      usuario.z = mundo.camara.position.z + 3.5 * Math.sin(angulo);

      prevTime = time;
    }

    if (usuario.limite(200)) {
      mundo.camara.position.x = usuario.x + 3.5 * Math.cos(0.5 * mov);
      mundo.camara.position.z = usuario.z + 3.5 * Math.sin(0.5 * mov);
    }

    modeloUsuario.position.set(usuario.x, usuario.y, usuario.z);

    ////////
    raycaster.setFromCamera(mouse, mundo.camara);
    prevI = hoverEtapa4(modelosRed.children, red, raycaster, mouse, indicesSimilitud, prevI);
    ////////
  } else if (estado == "contemplacion") {
    mov += 0.01;
    mundo.camara.position.x = usuario.x + 5 * Math.cos(0.5 * mov);
    mundo.camara.position.y = 2;
    mundo.camara.position.z = usuario.z + 5 * Math.sin(0.5 * mov);
    mundo.camara.lookAt(modeloUsuario.position);
    texto.innerText = " ";
  } // etapa1

  ////////
  THREE.DefaultLoadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
    console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    mundo.reloj.getDelta();

    if (estado != "customizaciónB") {
      mundo.listener.setMasterVolume(0);
    }

  };
  THREE.DefaultLoadingManager.onLoad = function() {
    mundo.reloj.getDelta();
    console.log('Loading Complete!');
    const bl = document.getElementById("blocker");
    const ins = document.getElementById("play");
    if (estado == "etapa1" || estado == "etapa2") {
      //console.log("entre", mundo.reloj.getElapsedTime())
      while (mundo.reloj.getElapsedTime() < 3) {
        ins.innerText = ("\n\n\n Preparando el espacio");
      }
      cargo = true;
      ins.innerText = ("\n\n\n Hace click para empezar");
    } else if (estado == "customizaciónB"){
      nom = document.getElementById("nombre");
      nom.innerText = "escriba su nombre";
      cargo = true;
      play = true;
      //ins.style.display = 'none';
      bl.style.display = 'none';
      mundo.listener.setMasterVolume(1);
    }
  };

  ////////
  mundo.renderizar();
}

function onWindowResize() {

  mundo.camara.aspect = window.innerWidth / window.innerHeight;
  mundo.camara.updateProjectionMatrix();

  mundo.renderizador.setSize(window.innerWidth, window.innerHeight);

}

///// Programa Principal
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  // true for mobile device
  //console.log("celular");
  texto = document.createElement('p');
  document.body.append(texto);
  texto.innerText = "Por favor use una computadora para ver esta página";
  document.getElementById("play").innerText = "";

} else {
  // false for not mobile device
  //console.log("web");
  inicializar();
  animar();
}
