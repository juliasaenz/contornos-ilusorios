import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';
import {
  BufferGeometryUtils
} from 'https://unpkg.com/three@0.121.1/examples/jsm/utils/BufferGeometryUtils.js';
import {
  Red
} from './Clases/Usuario.js';
// Salas CSS
export function crearGrupo(int, salas, escena, media, user) {
  // grupo salas
  let div = document.createElement('div')
  div.setAttribute('id', 'btn_grupo')
  div.setAttribute('class', 'grupo')
  let cant = salas.length
  for (let i = 0; i < cant; i++) {
    let b = document.createElement("button")
    b.setAttribute('class', 'salas')
    b.setAttribute('type', 'button')
    b.setAttribute('id', (i).toString())
    b.innerHTML = (i).toString()
    div.appendChild(b)
  }
  div.style.display = 'none' // empieza oculta
  document.body.appendChild(div)
  // boton para salas
  let b = document.createElement("button")
  b.setAttribute('type', 'button')
  b.setAttribute('id', 'abrirSalas')
  b.innerHTML = '+'
  document.body.appendChild(b)
  // eventos 
  let btn = document.getElementById('abrirSalas')
  let b_salas = document.getElementById('btn_grupo')

  btn.onclick = function () {
    btn.style.display = 'none'
    b_salas.style.display = 'flex'
  }

  b_salas.onclick = function () {
    const nueSala = event["target"].id
    if (nueSala != 'btn_grupo') {
      b_salas.style.display = 'none'
      btn.style.display = 'flex'
      // cambio de sala 
      if(nueSala != int.salaAct){
        salas[int.salaAct].mostrarEnMundo(escena,media.sonidos,200);
        int.salaAct = nueSala
        salas[int.salaAct].reiniciarRed(media.colores, user, escena, media.sonidos);
        let x = salas[int.salaAct].contarVisibles().toString();
        let y = salas[int.salaAct].lista.length.toString();
        modificarP("stats", "viendo " + x + " de " + y + " figuras");
        // click info
        // Boton continuar
        if(y == int.maxUsuarios){ /// MAX
          document.getElementById("botonC").disabled = true
        } else {
          document.getElementById("botonC").disabled = false
        }
      }
    } 
  }
}
// Administración de salas
export function administrarSalas(salas, int) {
  let usuarios = salas[0].lista
  salas[0].lista = []
  for (let i = 0; i < usuarios.length; i++) {
    // Recorrer todos los usuarios
    let sala = usuarios[i].sala
    if (sala > salas.length) {
      // Crear sala
      let red = new Red()
      salas.push(red)
    }
    salas[sala - 1].lista.push(usuarios[i]) // agregar usuario a sala correspondiente
  }
  // dar opción de nueva sala?
  let completas = 0
  for (let i = 0; i < salas.length; i++) {
    if (salas[i].lista.length >= int.maxUsuarios) {
      completas++
      salas[i].completa = true
    }
  }
  if (completas > (salas.length / 3)*2) {
    // mas de dos tercios de las salas completas
    let red = new Red() // creo una nueva
    salas.push(red)
  }
  int.salaAct = parseInt(Math.random() * salas.length);
}
// CSS Slider
export function armarSlider(reloj) {
  crearSlider();

  let rangeInput = document.querySelector(".range-input input");
  let rangeValue = document.querySelector(".range-input .value div");

  let start = parseFloat(rangeInput.min);
  let end = parseFloat(rangeInput.max);
  let step = parseFloat(rangeInput.step);

  for (let i = start; i <= end; i += step) {
    rangeValue.innerHTML += '<div>' + i + ' % similitud' + '</div>';
  }

  rangeInput.addEventListener("input", function () {
    let top = parseFloat(rangeInput.value) / step * -40;
    rangeValue.style.marginTop = top + "px";
  });
}
function crearSlider() {
  let div = document.createElement('div')
  div.setAttribute('class', 'range-input')
  let input = document.createElement('input')
  input.setAttribute('type', 'range')
  input.setAttribute('min', '0')
  input.setAttribute('max', '100')
  input.setAttribute('value', '0')
  input.setAttribute('step', '5')
  let div2 = document.createElement('div')
  div2.setAttribute('class', 'value')
  let div3 = document.createElement('div')
  div2.appendChild(div3)
  div.appendChild(input)
  div.appendChild(div2)
  document.body.appendChild(div)
}
// Cargar JSON y PHP
export function cargarDatos(red, int) {
  var xhr = new XMLHttpRequest();
  if (int.modo == "php") {
    recibirPHP(red.lista);
  }
  if (int.modo == "json") {
    xhr.open('GET', './data/figuras.json', true);
    xhr.onload = function () {
      if (this.status == 200) {
        red.lista = JSON.parse(this.responseText);
      }
    }
    xhr.onerror = function () {
      console.log("hubo un error cargando el JSON")
    }
    xhr.send();
  }
}
export function enviarPHP(dato) {
  let xhr = new XMLHttpRequest()
  xhr.open("POST", "./php/enviar.php", true)
  xhr.onload = function () {
    if (this.status == 200) {
      //console.log(this.responseText);
    }
  }
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(dato))
}

function recibirPHP(listaFinal) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "./php/recibir.php", true);
  xhr.onload = function () {
    if (this.status == 200) {
      let lista = JSON.parse(this.responseText);
      configurarUsuarios(lista, listaFinal);
    }
  }
  xhr.send();
}

function configurarUsuarios(l, lf) {
  for (let i = 0; i < l.length; i++) {
    let user = {
      id: l[i].id,
      nombre: l[i].nombre,
      estilo: {
        forma: l[i].estilo_forma,
        color: l[i].estilo_color,
        pos: {
          x: l[i].estilo_pos_x,
          y: 0.1,
          z: l[i].estilo_pos_z
        },
        sonido: l[i].estilo_sonido
      },
      tiempo: l[i].tiempo,
      sala: l[i].sala
    };
    lf.push(user);
  }
}
// Instrucciones
export function mostrarInstucciones(int) {
  document.getElementById("botonC").disabled = true;
  const instructions = document.getElementById("instructions");
  const blocker = document.getElementById("blocker");
  instructions.style.display = 'flex';
  blocker.style.display = '';
  let texto;
  switch (int.estado) {
    case "customizacionB":
      texto = "WASD o Flechas: Mover \n\n Haga click para continuar"
      break;
    case "etapa1":
      texto = "Click: Ver \n\n Haga click para continuar"
      break
    case "etapa2":
      texto = "Click & Drag: Rotar \n\n Haga click para continuar";
      break
    case "etapa3":
      texto = "Scroll: Inclinar \n\n Haga click para continuar";
      break
    case "etapa4":
      instructions.style.display = 'none';
      blocker.style.display = 'none';
      int.play = true;
      texto = "";
      break
    default:
      texto = "tuve un problema en: ".concat(int.estado);
  }
  modificarP("play", texto);
}
// Mapear valores
export function scale(number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
// Texto html
export function mostrarDatos(vel = 0.02) {
  const te = document.getElementById("uDato");
  if (te != null && te.style.opacity > 0) {
    te.style.opacity -= vel;
  } else if (te != null && te.style.opacity <= 0) {
    te.remove();
  }
}
export function borrarDatos() {
  var te = document.getElementById("uDato");
  while (te != null) {
    te.remove();
    te = document.getElementById("uDato");
  }
}
export function modificarP(id, texto, x = "", y = "") {
  var nueP = document.getElementById(id);
  nueP.innerText = texto;
  if (x !== "") {
    nueP.style.left = x;
  }
  if (y != "") {
    nueP.style.top = y;
  }
}
export function crearP(id, texto, x = '0%', y = '0%') {
  var nueP = document.createElement("p");
  nueP.id = id;
  nueP.innerText = texto;
  nueP.style.top = y;
  nueP.style.left = x;
  nueP.style.opacity = 1;
  document.body.appendChild(nueP);
}
// Armar modelo 3D
export function armarModelo(id = "indefinido", estilo, colores) {
  var linea;
  var geometria;

  if (estilo.forma === "cubo") {
    linea = geometriaCubo();
    geometria = new THREE.BoxGeometry(2 * 0.96, 2 * 0.96, 2 * 0.96);
  } else {
    linea = geometriaCono();
    geometria = new THREE.ConeGeometry(1.2 * 0.99, 2.4 * 0.99, 8, 8);
  }

  let colorcito;
  // si no tiene color definido
  if (estilo.color == "--") {
    colorcito = "#FAFAFA";
  } else {
    colorcito = colores[estilo.color];
  }
  const materialLinea = new THREE.LineBasicMaterial({
    color: colorcito
  });
  const meshLinea = new THREE.Line(linea, materialLinea);
  meshLinea.position.x = estilo.pos.x;
  meshLinea.position.y = estilo.pos.y;
  meshLinea.position.z = estilo.pos.z;

  const materialForma = new THREE.MeshStandardMaterial({
    color: 0x010101
  });
  const meshForma = new THREE.Mesh(geometria, materialForma);

  if (estilo.forma === "cono") {
    meshForma.rotation.y = 1;
  }

  meshLinea.name = id;
  meshLinea.add(meshForma);

  return meshLinea;
}
// Creación de líneas
function geometriaCubo() {
  // Crea geometría líneas Cubo
  const geo = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0 - 0.66, 1.0,
    -1.0, 1.0 - 0.66, 1.0,
    -1.0, 1.0 - (0.66 * 2), 1.0,
    1.0, 1.0 - (0.66 * 2), 1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0 + 0.66, 1.0, 1.0,
    -1.0 + 0.66, -1.0, 1.0,
    -1.0 + (0.66 * 2), -1.0, 1.0,
    -1.0 + (0.66 * 2), 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    -1.0 + (0.66 * 2), 1.0, -1.0,
    -1.0 + (0.66 * 2), -1.0, -1.0,
    -1.0 + 0.66, -1.0, -1.0,
    -1.0 + 0.66, 1.0, -1.0,
    -1.0, 1.0, -1.0,
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, 1.0 - (0.66 * 2), -1.0,
    -1.0, 1.0 - (0.66 * 2), -1.0,
    -1.0, 1.0 - 0.66, -1.0,
    1.0, 1.0 - 0.66, -1.0,
    1.0, 1.0, -1.0,
    -1.0, 1.0, -1.0,
  ]);

  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  const geo2 = new THREE.BufferGeometry();
  geo2.copy(geo);
  const geo3 = new THREE.BufferGeometry();
  geo3.copy(geo2);
  geo2.rotateY(-Math.PI * 0.5);
  geo3.rotateX(-Math.PI * 0.5);
  return BufferGeometryUtils.mergeBufferGeometries([geo, geo2, geo3]);
}

function geometriaCono() {
  // Crea geometría líneas cono
  const vertices = new Float32Array([
    0, 1.5, 0,
    -0.5, -1, 1.2, //izq
    0.5, -1, 1.2, //derecha
    0, 1.5, 0, //arriba
    //1 triangulo
    -0.5, -1, -1.2, //izq
    0.5, -1, -1.2, // derecha
    0, 1.5, 0, //ariba
  ]);

  const geoCono = new THREE.BufferGeometry();
  geoCono.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  const geoCono2 = new THREE.BufferGeometry();
  geoCono2.copy(geoCono)
  geoCono2.rotateY(-Math.PI * 0.5)

  const geoCono3 = new THREE.BufferGeometry();
  geoCono3.copy(geoCono2)
  geoCono3.rotateY(-Math.PI * 0.25)

  const geoCono4 = new THREE.BufferGeometry();
  geoCono4.copy(geoCono2)
  geoCono4.rotateY(Math.PI * 0.25)

  const geoFinalCono = BufferGeometryUtils.mergeBufferGeometries([geoCono, geoCono2, geoCono3, geoCono4]);
  return geoFinalCono;
}
// Control Teclado
export function movimientoTeclas(play, mov) {
  // Movimiento teclas
  const onKeyDown = function (event) {
    if (play) {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          mov.adelante = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          mov.izquierda = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          mov.atras = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          mov.derecha = true;
          break;
      }
    }
  };
  const onKeyUp = function (event) {
    if (play) {
      switch (event.code) {

        case 'ArrowUp':
        case 'KeyW':
          mov.adelante = false;
          break;

        case 'ArrowLeft':
        case 'KeyA':
          mov.izquierda = false;
          break;

        case 'ArrowDown':
        case 'KeyS':
          mov.atras = false;
          break;

        case 'ArrowRight':
        case 'KeyD':
          mov.derecha = false;
          break;

      }
    }
  };
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
}