import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';
import {
  RGBELoader
} from 'https://unpkg.com/three@0.121.1/examples/jsm/loaders/RGBELoader.js';
import {
  OrbitControls
} from 'https://unpkg.com/three@0.121.1/examples/jsm/controls/OrbitControls.js';

//////////////////////
import {
  EffectComposer
} from 'https://unpkg.com/three@0.121.1/examples/jsm/postprocessing/EffectComposer.js';
import {
  RenderPass
} from 'https://unpkg.com/three@0.121.1/examples/jsm/postprocessing/RenderPass.js';
import {
  ShaderPass
} from 'https://unpkg.com/three@0.121.1/examples/jsm/postprocessing/ShaderPass.js';
import {
  UnrealBloomPass
} from 'https://unpkg.com/three@0.121.1/examples/jsm/postprocessing/UnrealBloomPass.js';

const params = {
  exposure: -1,
  bloomStrength: 0.3,
  bloomThreshold: 0,
  bloomRadius: 0,
  scene: "Scene with Glow"
};


export class Mundo {
  constructor() {
    /////////// Escena
    this.escena = new THREE.Scene();

    /////////// Cámara
    this.camara = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camara.position.z = 1.5;
    this.camara.position.y = 0.5;

    ////////// Listener
    this.listener = new THREE.AudioListener();
    this.camara.add(this.listener);

    ////////// Renderizador
    this.renderizador = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderizador.setPixelRatio(window.devicePixelRatio);
    this.renderizador.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderizador.domElement);

    //////// Efectos
    this.compositor = new EffectComposer(this.renderizador); //compositor

    var renderPass = new RenderPass(this.escena, this.camara); //Pass de escena

    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    this.bloomPass.threshold = params.bloomThreshold;
    this.bloomPass.strength = params.bloomStrength;
    this.bloomPass.radius = params.bloomRadius;

    this.compositor.addPass(renderPass);
    this.compositor.addPass(this.bloomPass);
    renderPass.renderToScreen = true;

    ////////// Reloj
    this.reloj = new THREE.Clock();
    this.reloj.start();

  }
  crearFondoCustomizacion() {
    this.escena.background = new THREE.Color(0x030002);
    const light = new THREE.HemisphereLight(0xB4AFB0, 0x040406, 1); //Luz
    light.position.set(-2, 2, 6);
    this.escena.add(light);

    this.camara.rotation.y = 0;
    this.camara.position.set(0,0,1.5);
  }
  crearFondo() {
    this.escena.background = new THREE.Color(0x030002);
    this.escena.fog = new THREE.Fog(0x010102, 0.1, 50);

    this.bloomPass.strength = params.bloomStrength + 1;

    const planeSize = 400;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('../data/imagenes/cubo_fondo_006.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    mesh.position.y = -1;
    this.escena.add(mesh);

    const light = new THREE.HemisphereLight(0xB4AFB0, 0x040406, 1); //Luz
    light.position.set(-2, 2, 6);
    this.escena.add(light);

  }
  renderizar() {
    //this.renderizador.render(this.escena, this.camara);
    this.compositor.render();
  }
}
