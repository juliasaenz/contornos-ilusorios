import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'; //'../threegit/build/three.module.js';;//'https://unpkg.com/three@0.118.3/build/three.module.js';//'../threeLibs/build/three.module.js';
import {
  Mundo
} from '../Clases/Mundo.js';
import {
  OrbitControls
} from 'https://unpkg.com/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import {
  EffectComposer
} from 'https://unpkg.com/three@0.121.1/examples/jsm/postprocessing/EffectComposer.js';
import {
  RenderPass
} from 'https://unpkg.com/three@0.121.1/examples/jsm/postprocessing/RenderPass.js';
import {
  BloomPass
} from 'https://unpkg.com/three@0.121.1/examples/jsm/postprocessing/BloomPass.js';
import {
  FilmPass
} from 'https://unpkg.com/three@0.121.1/examples/jsm/postprocessing/FilmPass.js';

var mundo;
let line;
let matLine;

function inicializar() {
  mundo = new Mundo();
  mundo.crearOrbitControl();
  mundo.crearFondo();

  const composer = new EffectComposer(renderer);
  const bloomPass = new BloomPass(
    1, // strength
    25, // kernel size
    4, // sigma ?
    256, // blur render target resolution
  );
  composer.addPass(bloomPass);
  const filmPass = new FilmPass(
    0.35, // noise intensity
    0.025, // scanline intensity
    648, // scanline count
    false, // grayscale
  );
  filmPass.renderToScreen = true;
  composer.addPass(filmPass);
}

function animar() {
  requestAnimationFrame(animar);
  mundo.renderizar();
}


////////////////////////////////
inicializar();
animar();
