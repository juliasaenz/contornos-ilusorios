import {
  crearInstanciaB
} from '../Funciones/modelos3D.js'
import {
  scale
} from '../Funciones/calculos.js'

export class Figura {
  constructor(id = -1, forma = 'cubo', color = '#FF0000', x = 0, z = 0, nombre = "juph", sonido = '../data/sonidos/1/Sonido (1).wav', activo = false) {
    this.nombre = nombre;
    this.id = this._crearID(id);
    this.forma = forma;
    this.color = color;
    this.x = x;
    this.y = 0.1;
    this.z = z;
    this.pos = -1 //posicion en el arreglo de modelos
    ///// estos porahora no importan
    this.sonido = sonido;
    this.activo = activo;
    this.radio = 9;
    this.conexiones = [];
    this.tiempo = 0;
  }
  _crearID(id) {
    //crea una ID unica de usuario usando el nombre + numeros random
    if (id != -1) {
      return id;
    }
    const n = parseInt(Math.random() * 999);
    return this.nombre.concat("-", n.toString());
  }
  _distancia(x, y, z) {
    //calculo de distancia entre una figura y el usuario
    var a = this.x - x;
    var b = this.y - y;
    var c = this.z - z;

    var distance = a * a + b * b + c * c;
    if (distance < Math.pow(this.radio, 2)) {
      return true;
    }
    return false;
  }
  calcularConexiones(figuras, todas = false) {
    //Calcular la distancia de todas las figuras y guardar las que esten dentro de la distancia determinada
    for (var i = 0; i < figuras.length; i++) {
      if (this._distancia(figuras[i].x, figuras[i].y, figuras[i].z)) {
        var found = this.conexiones.findIndex(f => f.id === figuras[i].id);
        if (found === -1) {
          if (todas || figuras[i].pos != -1) {
            //Si veo todas las formas o si veo solo las formas parecidas
            this.conexiones.push(figuras[i]);
          }
        }
      } else {
        var found = this.conexiones.findIndex(f => f.id === figuras[i].id);
        if (found != -1) {
          this.conexiones.splice(found, 1);
        }
      }

    }
    //console.log("conexiones usuario: ",this.conexiones.length);
  }
  ecuacionDeUsuarioA(otro) {
    var m = 0;
    var t = "";
    if (this.forma == otro.forma) {
      m += 5;
      t = t.concat("forma, ");
    }
    if (this.color == otro.color) {
      m += 2;
      t = t.concat("color, ");
    }
    if (this.activo == otro.activo) {
      m += 0.5;
      t = t.concat("activo, ");
    }
    //console.log("hewo",this.sonido[16],"-",otro.sonido[15])
    if (this.sonido[16] == otro.sonido[15]) {
      m += 2;
      t = t.concat("sonido, ");
    }
    if (this.conexiones.length == otro.conexiones.length) {
      m += 0.5;
      t = t.concat("length");
    }
    const res = scale(m, 0, 10, 0, 1);
    //console.log(t,res);
    return res;
  }
  texto(reloj, orientacion = "estático"){
    const t = "Usuario: ".concat(this.nombre,"\n");
    const t2 = "ID: ".concat(this.id,"\n");
    const t3 = "Forma: ".concat(this.forma,"\n");
    const t4 = "Color: ".concat(this.color,"\n");
    const t5 = "Posición: ".concat(parseInt(this.x),", ",parseInt(this.y),", ",parseInt(this.z),"\n");
    const t9 = "Rotación: ".concat(orientacion,"\n");
    const t6 = "Sonido: ".concat(this.sonido,"\n");
    const t7 = "Conexiones: ".concat(this.conexiones.length,"\n");
    const t8 = "Tiempo: ".concat(parseInt(this.tiempo+reloj),"\n");
    const tFinal = t.concat(t2,t3,t4,t5,t9,t6,t7,t8);
    //console.log(tFinal)
    return tFinal;
  }
}
