import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';

export class Media {
  constructor(listener) {
    this.archivos = [];
    this.cant = 1;
    this.sonidos = {};
    this.imagenes = [];
    this.cargo = false;
    this.cargando = {}
    this.cargarSonidos(listener);
    this.cargarImagenes();
    this.colores = {
      rojo: "#FB3030",
      fucsia: "#F43F5E",
      rosa: "#FC3DC9",
      naranja: "#F97316",
      oro: "#F2B311",
      amarillo: "#FBFF20",
      verde: "#A3E635",
      esmeralda: "#4ADE80",
      celeste: "#00FFF9",
      azul: "#016DF6",
      violeta: "#9F34D8",
      lila: "#C86DDE"
    }
  }
  actualizar() {
    for (var key in this.cargando) {
      if (!this.cargando[key]) {
        return false;
      }
    }
    return true;
  }
  mostrarCodigo(escena) {
    for (let i = 0; i < 4; i++) {
      const id = "codigo".concat(i.toString());
      escena.getObjectByName(id).visible = true;
    }
  }
  ubicarCodigo(escena) {
    const alt = 130;
    this.imagenes[0].position.set(0, alt, -200);
    this.imagenes[1].position.set(200, alt, 0);
    this.imagenes[1].rotation.y = -Math.PI / 2;
    this.imagenes[2].position.set(0, alt, 200);
    this.imagenes[2].rotation.y = Math.PI;
    this.imagenes[3].position.set(-200, alt, 0);
    this.imagenes[3].rotation.y = Math.PI / 2;
    for (var i = 0; i < 4; i++) {
      this.imagenes[i].name = "codigo".concat(i.toString());
      this.imagenes[i].visible = false;
      escena.add(this.imagenes[i]);
    }
  }
  cargarImagenes() {
    for (var i = 0; i < 4; i++) {
      this.imagenes[i] = this.cargarImagen("0".concat((i + 1).toString(), "cod"));
    }
  }
  cargarImagen(nombre) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load("./data/imagenes/".concat(nombre, ".png"));

    const planeGeo = new THREE.PlaneGeometry(400, 285);
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    return mesh;
  }
  elegir5() {
    var lista = [];
    for (var i = 0; i < 5; i++) {
      const n = (parseInt(Math.random() * this.cant + 1)).toString();
      const clave = "a".concat((i + 1).toString(), "_", n);
      this.sonidos[clave].name = clave;
      lista.push(this.sonidos[clave]);
    }
    return lista;
  }
  cargarSonidos(listener) {
    this.guardarURLS();
    var i = 0;
    for (var key in this.sonidos) {
      console.log(key)
      this.sonidos[key] = this.cargarSonido(listener, this.archivos[i]);
      this.cargando[this.archivos[i]] = false;
      i++;
    }
  }
  cargarSonido(listener, archivo) {
    const audioLoader = new THREE.AudioLoader();
    const sonido = new THREE.PositionalAudio(listener);
    let c = this.cargando;
    audioLoader.load(archivo, function(buffer) {
      sonido.setBuffer(buffer);

      sonido.setRefDistance(0.9); // A que distancia empieza a reducir el volumen
      sonido.setRolloffFactor(1.1); // A que velocidad disminuye el volumen
      sonido.setDistanceModel("exponential");
      sonido.setMaxDistance(1000);

      sonido.setLoop(true);
      sonido.setVolume(1);
      sonido.play();
      sonido.stop();
      c[archivo] = true;
    });

    return sonido;
  }
  guardarURLS() {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < this.cant; j++) {
        this.archivos.push(this.sacarURL(i + 1, j + 1));
        const clave = "a".concat((i + 1).toString(), "_", (j + 1).toString());
        this.sonidos[clave] = {};
      }
    }
  }
  sacarURL(carpeta, archivo) {
    return "./data/sonidos/".concat(carpeta.toString(), "/Sonido (", archivo.toString(), ").mp3");
  }
  // Fin
}
