export function elegirSonidoAzar() {
  const n1 = parseInt(Math.random() * 6 + 1).toString();
  //const n1 = "6"
  return "./data/sonidosB/Sonido (".concat(n1, ").wav");
}

export function colorRandom() {
  const n1 = parseInt(Math.random() * 200).toString(16);
  const n2 = parseInt(Math.random() * 200).toString(16);
  const n3 = parseInt(Math.random() * 200).toString(16);
  var c = "#".concat(n1, n2, n3);
  while (c.length < 7) {
    c = c.concat("0");
  }
  return c;
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
