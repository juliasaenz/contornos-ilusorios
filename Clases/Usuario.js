import { armarModelo, scale } from "../funciones.js";

export class Usuario {
  constructor(colores, id = -1, nombre = "", tiempo = 0, estilo = null) {
    this.nombre = nombre;
    this.id = id;
    this.estilo;

    if (estilo != null) {
      this.estilo = estilo;
    } else {
      this.estilo = {
        forma: "--",
        color: "",
        pos: { x: 0, y: 0.1, z: 0 },
        sonido: ""
      }
    }
    this.modelo;
    //this.modelo = armarModelo(this.id, this.estilo, colores);
    this.tiempo = tiempo;
    this.conexiones = [];
    this.vel = 30.0;
    this.filtro = 0.3;
    this.sala = 0;
  }
  setSala(num){
    this.sala = num + 1;
  }
  randomPosInicial(){
    this.estilo.pos.x = parseInt(Math.random() * 140 - 70)
    this.estilo.pos.z = parseInt(Math.random() * 140 - 70)
  }
  crearID() {
    //Crea una id única a partir del nombre y un número random
    console.log("id: ", this.id);
    if (this.id == -1) {
      const n = parseInt(Math.random() * 9999);
      this.id = this.nombre.concat("_", n.toString());
    }
  }
  crearModelo(colores) {
    this.modelo = armarModelo(this.id, this.estilo, colores);
  }
  distancia(pos) {
    // Calcula la distancia entre el usuario y otra figura
    let a = this.estilo.pos.x - pos.x;
    let b = this.estilo.pos.y - pos.z;
    let c = this.estilo.pos.z - pos.z;
    let distancia = a * a + b * b + c * c;
    if (distancia < Math.pow(8, 2)) {
      return true;
    } else {
      return false;
    }
  }
  calcularDistancias(usuarios, visible) {
    for (let i = 0; i < usuarios.length; i++) {
      let esta = this.conexiones.findIndex(f => f.id === usuarios[i].id);
      if (this.distancia(usuarios[i].estilo.pos) && visible[i]) {
        if (esta === -1 && usuarios[i].id != this.id) {
          this.conexiones.push(usuarios[i]);
        }
      } else {
        if (esta != -1){
          this.conexiones.splice(esta, 1);
        }
      }
    }
  }
  ecuacionDeUsuario(otro) {
    // Calcula que tan similares al usuario es otra figura
    let m = 0;
    let t = "";
    if (this.estilo.forma == otro.estilo.forma) {
      m += 5;
      t = t.concat("forma, ");
    }
    if (this.estilo.color == otro.estilo.color) {
      m += 2;
      t = t.concat("color, ");
    }
    if (this.estilo.sonido == otro.estilo.sonido) {
      m += 4;
      t = t.concat("sonido, ");
    }
    const res = scale(m, 0, 11, 0, 1);
    return res;
  }
  texto(reloj = -1, similitud = -1) {
    // Pasa la similitud a texto
    const t = "Usuario: ".concat(this.nombre, "\n");
    const t2 = "ID: ".concat(this.id, "\n");
    const t3 = "Forma: ".concat(this.estilo.forma, "\n");
    const t4 = "Color: ".concat(this.estilo.color, "\n");
    const t5 = "Posición: ".concat(parseInt(this.estilo.pos.x), ", ", parseInt(this.estilo.pos.y), ", ", parseInt(this.estilo.pos.z), "\n");
    const t6 = "Sonido: ".concat(this.estilo.sonido, "\n");
    //const t7 = "Formas cerca: ".concat(this.conexiones.length, "\n");
    const t7 = ""
    const t10 = "Sala: ".concat(this.sala, "\n");
    let t8 = "";
    if (reloj != -1) {
      t8 = "Tiempo: ".concat(parseInt(this.tiempo + reloj), "\n");
    } else {
      t8 = "Tiempo: ".concat(this.tiempo.toString(), "\n");
    }
    let t9 = "";
    if (similitud != -1) {
      t9 = "Similitud con usuario: ".concat(similitud * 100, "%\n");
    }
    const tFinal = t.concat(t2, t3, t4, t5, t6, t7, t8, t9, t10);
    return tFinal;
  }
  limite(lim) {
    // Calcula si el usuario llegó a los límites del espacio
    if (this.estilo.pos.x > lim) {
      this.estilo.pos.x = -lim + 5;
      return true;
    } else if (this.estilo.pos.x < -lim) {
      this.estilo.pos.x = lim - 5;
      return true;
    }
    if (this.estilo.pos.z > lim) {
      this.estilo.pos.z = -lim + 5;
      return true;
    } else if (this.estilo.pos.z < -lim) {
      this.estilo.pos.z = lim - 5;
      console.log("PAM")
      return true;
    }
    return false;
  }
  actualizarPos(camara, limite) {
    this.modelo.position.set(this.estilo.pos.x, this.estilo.pos.y, this.estilo.pos.z);
    if (limite) {
      camara.position.x = this.estilo.pos.x + 4 * Math.cos(0.5 * Math.PI);
      camara.position.z = this.estilo.pos.z + 4 * Math.sin(0.5 * Math.PI);
    }
  }
  mover(camara, mov) {
    const time = performance.now();
    const delta = (time - mov.prevTime) / 1000;
    // mov de usuario
    if (mov.rota) {
      // rota;
      camara.position.x = this.estilo.pos.x + 4 * Math.cos(0.5 * mov.movs);
      camara.position.z = this.estilo.pos.z + 4 * Math.sin(0.5 * mov.movs);
      camara.lookAt(this.modelo.position)
    } else {
      mov.velocidad.x -= mov.velocidad.x * this.vel * delta;
      mov.velocidad.z -= mov.velocidad.z * this.vel * delta;

      mov.direccion.z = Number(mov.adelante) - Number(mov.atras);
      mov.direccion.x = Number(mov.derecha) - Number(mov.izquierda);
      mov.direccion.normalize(); // this ensures consistent movements in all directions

      if (mov.adelante || mov.atras) mov.velocidad.z -= mov.direccion.z * 100.0 * delta;
      if (mov.izquierda || mov.derecha) mov.velocidad.x -= mov.direccion.x * 100.0 * delta;

      mov.controls.moveRight(-mov.velocidad.x * delta);
      mov.controls.moveForward(-mov.velocidad.z * delta);

      let angulo = Math.atan2(camara.getWorldDirection().z, camara.getWorldDirection().x)
      this.estilo.pos.x = camara.position.x + 4 * Math.cos(angulo);
      this.estilo.pos.z = camara.position.z + 4 * Math.sin(angulo);

      mov.prevTime = time;
    }
  }
  agregarSonido(sonidos) {
    let audio = sonidos[this.estilo.sonido];
    this.modelo.add(audio);
    if (!audio.isPlaying) {
      audio.play();
    }
  }
  sacarSonido() {
    for (let i = 0; i < this.modelo.children.length; i++) {
      if (this.modelo.children[i].name == this.estilo.sonido) {
        if (this.modelo.children[i].isPlaying) {
          this.modelo.children[i].stop();
        }
        this.modelo.remove(this.modelo.children[i]);
        return
      }
    }
  }
  // Fin clase
}

export class Red {
  constructor() {
    this.lista = []; // Lista figuras
    this.usuarios = []; // Lista usuarios
    this.visible = []; // Lista de booleanos
    this.similitud = []; // Lista de similitud con Usuario Actual
    this.completa = false // Si esta completa
  }
  cargarUsuarios(colores) {
    for (let i = 0; i < this.lista.length; i++) {
      let f = new Usuario(colores, this.lista[i]["id"], this.lista[i]["nombre"], this.lista[i]["tiempo"], this.lista[i]["estilo"]);
      f.crearModelo(colores);
      this.usuarios.push(f);
      this.visible.push(false);
    }
    //console.log(this.lista.length, this.usuarios.length, this.visible.length);
  }
  calcularSimilitud(actual) {
    for (let i = 0; i < this.usuarios.length; i++) {
      this.similitud.push(this.usuarios[i].ecuacionDeUsuario(actual));
    }
  }
  calcularDistanciasRed(usuario){
    for(let i = 0; i < this.usuarios.length; i++){
      if(this.visible[i]){
        this.usuarios[i].calcularDistancias(this.usuarios, this.visible);
        this.usuarios[i].calcularDistancias([usuario],[true]);
      }
    }
  }
  contarVisibles(){
    let cant = 0;
    for(let i = 0; i < this.visible.length; i++){
      if(this.visible[i]){
        cant++
      }
    }
    return cant;
  }
  mostrarEnMundo(escena, sonidos, indice = 0) {
    for (let i = 0; i < this.visible.length; i++) {
      if (this.similitud[i] >= indice) {
        if (!this.visible[i]) {
          // agregar al mundo
          this.usuarios[i].agregarSonido(sonidos);
          escena.add(this.usuarios[i].modelo);
          this.visible[i] = true;
        }
      } else {
        if (this.visible[i]) {
          // sacar del mundo
          this.usuarios[i].sacarSonido();
          escena.remove(escena.getObjectByName(this.usuarios[i].id));
          this.visible[i] = false;
        }
      }
    }
    //console.log(this.visible)
    console.log("Estoy entrando a mostrar en mundo y estos quedan visibles: ", this.visible.length)
  }
  sacarModelos() {
    let mods = [];
    for (let i = 0; i < this.usuarios.length; i++) {
      mods.push(this.usuarios[i].modelo);
    }
    return mods;
  }
  reiniciarRed(colores, user, escena, sonidos){
    //this.cargarUsuarios(colores)
    this.calcularSimilitud(user)
    this.mostrarEnMundo(escena, sonidos, user.filtro)
    console.log("Reinicie Red")
  }
  //Fin clase
}
