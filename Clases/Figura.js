export class Figura {
  constructor(id, forma, color, x = 0, z = 0) {
    this.id = id;
    this.forma = forma;
    this.color = color;
    this.x = x;
    this.y = -0.5;
    this.z = z;
    ///// estos porahora no importan
    this.sonido = 'nada';
    this.activo = false;
    this.cantConexiones = 0;
    this.radio = 1;
  }

  function distancia(x, y, z) {
    var a = x - this.x;
    var b = y - this.y;
    var c = z - this.z;

    var distance = Math.sqrt(a * a + b * b + c * c);
    if (distance < 10) {
      return true;
    }
    return false;
  }
}
