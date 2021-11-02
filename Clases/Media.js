import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';

export class Media {
  constructor(listener) {
    this.cant = 70;

    this.imagenes = [];
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
    /* nuevo */
    this.sonidosEnUso = []; // nuevo
    this.archivos = []
    this.sonidos = {}
    this.cargando = {}
    this.cargo = false;
  }
  traerRed(red, listener){
    /* agrega a la lista todos los nombres de sonidos que se estan usando */
    console.log("estos son todos los usuarios: ",red.length)
    for(let i = 0; i < red.length; i++){
      this.sonidosEnUso[i] = red[i].estilo.sonido
    }
    this.sonidos5()
    console.log(this.sonidosEnUso)
    this.guardarURLS()
    this.cargarSonidos(listener)
    this.elegir5()
  }
  sonidos5(){
    /* elige 5 sonidos random que no se esten usando */
    for (var i = 0; i < 5; i++) {
      console.log("ping")
      const n = (parseInt(Math.random() * this.cant + 1)).toString();
      let clave = "a".concat((i + 1).toString(), "_", n);
      if(!this.sonidosEnUso.includes(clave)){
        //si el sonido no existe
        this.sonidosEnUso.push(clave)
      } else {
        i--
      }
    }
  }
  elegir5(){
    //devuelve los ultimos 5 sonidos (los elegidos para la custom)
    var lista = []
    for (var i = this.sonidosEnUso.length-5; i < this.sonidosEnUso.length; i++) {
      this.sonidos[this.sonidosEnUso[i]].name = this.sonidosEnUso[i]
      lista.push(this.sonidos[this.sonidosEnUso[i]])
    }
    console.log("lista custom: ", lista)
    return lista
  }
  guardarURLS(){
    for(let i = 0; i < this.sonidosEnUso.length; i++){
      //recorro todos los sonidos en uso
      if(this.sonidosEnUso[i].length == 4){
        this.archivos.push( this.sacarURL(this.sonidosEnUso[i][1], this.sonidosEnUso[i][3]))
      } else {
        let n = this.sonidosEnUso[i].substr(3,2)
        this.archivos.push( this.sacarURL(this.sonidosEnUso[i][1], n))
      }
      this.sonidos[this.sonidosEnUso[i]] = {};
    }
  }
  cargarSonidos(listener){
    var i = 0;
    for (var key in this.sonidos) {
      this.sonidos[key] = this.cargarSonido(listener, this.archivos[i]);
      this.cargando[this.archivos[i]] = false;
      i++;
    }
  }
  actualizar(){
    for (var key in this.cargando) {
      if (!this.cargando[key]) {
        return false;
      }
    }
    return true;
  }
  cargarSonido(listener, archivo) {
    const audioLoader = new THREE.AudioLoader();
    const sonido = new THREE.PositionalAudio(listener);
    let c = this.cargando;
    audioLoader.load(archivo, function(buffer) {
      sonido.setBuffer(buffer);

      sonido.setRefDistance(1.2); // A que distancia empieza a reducir el volumen
      sonido.setRolloffFactor(0.9); // A que velocidad disminuye el volumen
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
  sacarURL(carpeta, archivo) {
    return "./data/sonidos/".concat(carpeta.toString(), "/Sonido (", archivo.toString(), ").mp3");
  }

  /* codigo */
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

  // Fin
}
