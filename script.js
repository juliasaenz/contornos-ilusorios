import * as THREE from "https://unpkg.com/three@0.121.1/build/three.module.js";
import { Mundo } from "./Clases/Mundo.js";
import { Usuario, Red } from "./Clases/Usuario.js";
import { Media } from "./Clases/Media.js";
import {
  crearP,
  modificarP,
  cargarDatos,
  administrarSalas
} from "./funciones.js";
import {
  inicioCustomizacionA,
  animarCustomizacionA,
  inicioCustomizacionB,
  animarCustomizacionB,
  inicioEtapa1,
  inicioEtapa2,
  animarEtapa2,
  inicioEtapa3,
  animarEtapa3,
  inicioEtapa4,
  animarEtapa4,
  inicioContemplacion,
  animarContemplacion,
} from "./estados.js";

let mundo;
let media;
let usuario;
let salas = [];
let int = {
  play: false,
  raycaster: null,
  mouse: null,
  oldX: -90,
  estado: "intro",
  distancia: 0,
  modo: "php",
  guardar: true,
  salas: 1,
  salaAct: 0,
  maxUsuarios: 50,
};
let mov = {
  adelante: false,
  atras: false,
  izquierda: false,
  derecha: false,
  velocidad: null,
  direccion: null,
  controls: null,
  prevTime: performance.now(),
  rota: false,
  mov: Math.PI,
  dir: 1,
  movs: Math.PI,
};

function inicializar() {
  mundo = new Mundo();
  mundo.reloj.start();
  media = new Media(mundo.listener);
  usuario = new Usuario(media.colores);
  // Controles e Interacción
  int.raycaster = new THREE.Raycaster();
  int.mouse = new THREE.Vector2();
  // Evento Resize y Condición de Salida
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("beforeunload", function (e) {
    if (int.estado != "contemplacion") {
      let confirmationMessage = "La experiencia aun no termina";
      (e || window.event).returnValue = confirmationMessage; //Gecko + IE
      return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    }
  });
  // Cargar JSON
  salas[0] = new Red();
  cargarDatos(salas[0], int);
  // instrucciones
  const ins = document.getElementById("instructions");
  const bl = document.getElementById("blocker");
  bl.addEventListener("click", function () {
    if (media.cargo && salas[0].lista.length > 0) {
      // aca habria que hacer las salas
      if (int.estado == "intro") {
        administrarSalas(salas, int);
      }
      ins.style.display = "none";
      bl.style.display = "none";
      int.play = true;
    }
  });
  // para debugeo
  crearP("log", "--");
  THREE.DefaultLoadingManager.onProgress = function (
    url,
    itemsLoaded,
    itemsTotal
  ) {
    //console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  };
}

function animar() {
  requestAnimationFrame(animar);
  modificarP("log", "");
  if (int.estado === "intro") {
    // Intro --> Carga de archivos
    if (!media.cargo) {
      if(salas[0].lista.length > 0 && media.sonidosEnUso.length == 0){
        media.traerRed(salas[0].lista, mundo.listener);
      } else if(media.sonidosEnUso.length > 0) {
        media.cargo = media.actualizar();
      }
    } else {
      modificarP("play", "\n\n\n\n Se recomienda usar auriculares para esta experiencia \n\n Click para comenzar");
      const bl = document.getElementById("play");
      const ins = document.getElementById("instructions");
      const pp = document.getElementById("blocker");
      pp.addEventListener("click", function () {
        if (media.cargo && salas[0].lista.length > 0) {
        // aca habria que hacer las salas
          if (int.estado == "intro") {
            administrarSalas(salas, int);
          }
          ins.style.display = "none";
          bl.style.display = "none";
          int.play = true;
        }
      });
      if (int.play) {
        int.play = false;
        for (let i = 0; i < salas.length; i++) {
          salas[i].cargarUsuarios(media.colores);
        }
        inicioCustomizacionA(mundo, int, usuario.estilo, media.colores);
      }
    }
  } else if (int.estado === "customizacionA") {
    document.getElementById("titulo").style.zIndex = "-2"
    // Customización A -->
    animarCustomizacionA(mundo.escena);
    if (usuario.estilo.forma != "--") {
      int.estado = "customizacionB";
      inicioCustomizacionB(mundo, usuario.estilo, media, int);
    }
  } else if (int.estado === "customizacionB") {
    // Customización B -->
    animarCustomizacionB(mundo.escena, usuario);
    if (int.play) {
      inicioEtapa1(
        mundo,
        usuario,
        int,
        media.sonidos,
        mov,
        media.colores,
        salas[int.salaAct]
      );
      mundo.contador.empezarReloj();
      media.ubicarCodigo(mundo.escena);
      int.play = false;
    }
  } else if (int.estado === "etapa1") {
    // Etapa 1 -->
    if (int.play) {
      inicioEtapa2(int, usuario, mundo, mov, salas);
      mundo.contador.empezarReloj();
      int.play = false;
    }
  } else if (int.estado === "etapa2") {
    // Etapa 2 -->
    animarEtapa2();
    if (int.play) {
      mundo.escena.fog.near = 20;
      inicioEtapa3(mundo, int, mov, usuario, salas[int.salaAct], media.sonidos);
      mundo.contador.empezarReloj();
      int.play = false;
    }
  } else if (int.estado === "etapa3") {
    // Etapa 3 -->
    animarEtapa3(mov, int);
    if (int.play) {
      inicioEtapa4(int, mundo, usuario, media, salas);
      mundo.contador.empezarReloj();
      int.play = false;
    }
  } else if (int.estado === "etapa4") {
    // Etapa4 -->
    animarEtapa4(int, mov, mundo, usuario, salas[int.salaAct], media.sonidos);
    if (int.play) {
      inicioContemplacion(int, mundo.camara, usuario);
      int.play = false;
    }
  } else if (int.estado === "contemplacion") {
    // Contemplación
    animarContemplacion(
      mundo.camara,
      usuario.estilo.pos,
      mov,
      usuario.modelo.position
    );
  }
  // mov de la figura en espacio3D
  if (int.estado.includes("etapa")) {
    // contador
    if (mundo.contador.pasoTiempo()) {
      if (int.estado != "etapa4") {
        document.getElementById("botonC").disabled = false;
      } else {
        if (!salas[int.salaAct].completa) {
          document.getElementById("botonC").disabled = false;
        }
      }
    }
    // movimiento
    usuario.mover(mundo.camara, mov);
    usuario.actualizarPos(mundo.camara, usuario.limite(195));
    if (int.estado != "etapa1") {
      modificarP(
        "dato",
        usuario.texto(mundo.reloj.getElapsedTime(), -1, int.salaAct),
        "55%",
        "55%"
      );
      usuario.calcularDistancias(
        salas[int.salaAct].usuarios,
        salas[int.salaAct].visible
      );
      salas[int.salaAct].calcularDistanciasRed(usuario);
    }
  }
  mundo.renderizar();
}

/// Programa Principal
///// Programa Principal
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  texto = document.createElement("p");
  document.body.append(texto);
  texto.innerText = "Por favor use una computadora para ver esta página";
  document.getElementById("play").innerText = "";
} else {
  inicializar();
  animar();
}

/// Eventos
function onWindowResize() {
  // Reacomodar cuando se cambia tamaño de ventana
  mundo.camara.aspect = window.innerWidth / window.innerHeight;
  mundo.camara.updateProjectionMatrix();
  mundo.renderizador.setSize(window.innerWidth, window.innerHeight);
}
