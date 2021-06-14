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

export function elegirSonidoAzar() {
  const n1 = parseInt(Math.random() * 6 + 1).toString();
  //const n1 = "6"
  return "./data/sonidosB/Sonido (".concat(n1, ").wav");
}

export function colorRandom() {
  /*const n1 = parseInt(Math.random() * 200).toString(16);
  const n2 = parseInt(Math.random() * 200).toString(16);
  const n3 = parseInt(Math.random() * 200).toString(16);
  var c = "#".concat(n1, n2, n3);
  while (c.length < 7) {
    c = c.concat("0");
  }*/
  const m = parseInt(Math.random() * (Object.keys(colores).length - 1));
  return Object.values(colores)[m];
}

export function colorOscuro(color){
  var colorN = 0x010101;
  if (color.r > color.g && color.r > color.b){
    colorN = 0x050101;
  } else if (color.b > color.r && color.b > color.g){
    colorN = 0x020104;
  } else {
    colorN = 0x010301;
  }
  return colorN
}

export function booleanRandom(){
  const m = Math.random();
  if (m > 0.8){
    return true;
  } else {
    return false;
  }
}

export function scale(number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
