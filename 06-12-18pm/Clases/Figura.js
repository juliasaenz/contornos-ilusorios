import { crearInstanciaB } from '../Funciones/modelos3D.js'
import { scale } from '../Funciones/calculos.js'

export class Figura {
  constructor(id, forma = 'cubo', color = '#FF0000', x = 0, z = 0, nombre = "juph", sonido = '../Sonidos/thwknd.mp3', activo = false) {
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
  }
  _crearID(id){
    //crea una ID unica de usuario usando el nombre + numeros random
    if (id != -1){
      return id;
    }
    const n = parseInt(Math.random() * 999);
    return this.nombre.concat("-",n.toString());
  }
  _distancia(x, y, z) {
    //calculo de distancia entre una figura y el usuario
    var a = this.x - x;
    var b = this.y - y;
    var c = this.z - z;

    var distance = a * a + b * b + c * c;
    if (distance < Math.pow(this.radio,2)) {
      return true;
    }
    return false;
  }
  calcularConexiones(figuras) {
    //Calcular la distancia de todas las figuras y guardar las que esten dentro de la distancia determinada
    for (var i = 0; i < figuras.length; i++) {
      if (this._distancia(figuras[i].x, figuras[i].y, figuras[i].z)) {
        var found = this.conexiones.findIndex(f => f.id === figuras[i].id);
        if (found === -1) {
          this.conexiones.push(figuras[i]);
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
  calcularConexionesVisual(figuras, mundo, objetosFiguras){
    //Visualizar cuales son las figuras conectadas al usuario
    for (var i = 0; i < figuras.length; i++) {
      if (this._distancia(figuras[i].x, figuras[i].y, figuras[i].z)) {
        var found = this.conexiones.findIndex(f => f.id === figuras[i].id);
        if (found === -1) {
          this.conexiones.push(figuras[i]);
          mundo.escena.add(objetosFiguras[i][0]);
          mundo.escena.add(objetosFiguras[i][1]);
        }
      } else {
        var found = this.conexiones.findIndex(f => f.id === figuras[i].id);
        if (found != -1) {
          this.conexiones.splice(found, 1);
          mundo.escena.remove(objetosFiguras[i][0]);
          mundo.escena.remove(objetosFiguras[i][1]);
        }
      }
    }
    //console.log(this.conexiones.length);
  }
  ecuacionDeUsuarioA(otro){
    var m = 0;
    var t = "";
    if (this.forma == otro.forma){
      m += 5;
      t = t.concat("forma, ");
    }
    if (this.color == otro.color) {
      m += 2;
      t = t.concat("color, ");
    }
    if (this.activo == otro.activo){
      m += 1;
      t = t.concat("activo, ");
    }
    if (this.sonido == otro.sonido){
      m += 0.5;
      t = t.concat("sonido, ");
    }
    if (this.conexiones.length == otro.conexiones.length){
      m+= 0.5;
      t = t.concat("length");
    }
    const res = scale(m,0,10,0,1);
    //console.log(t,res);
    return res;
  }
}
