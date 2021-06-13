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
  bloomStrength: 1.5,
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
    this.renderizador.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderizador.domElement);

    //////// Efectos
    this.compositor = new EffectComposer(this.renderizador); //compositor

    var renderPass = new RenderPass(this.escena, this.camara); //Pass de escena

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    this.compositor.addPass(renderPass);
    this.compositor.addPass(bloomPass);
    renderPass.renderToScreen = true;


    ///// Controls
    this.controles = new OrbitControls(this.camara, this.renderizador.domElement);
    this.controles.enabled = false;


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
    //this.escena.fog = new THREE.Fog(0x010102, 1, 30);

    this.camara.rotation.x = Math.PI * 0.39;

    //controles
    this.controles.enabled = true;
    this.controles.enablePan = false;
    this.controles.enableZoom = false;
    this.controles.minPolarAngle = Math.PI * 0.39; // radians
    this.controles.maxPolarAngle = Math.PI * 0.39; // radians
    this.controles.update();

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
  crearOrbitControl() {
    this.controls = new OrbitControls(this.camara, this.renderizador.domElement);
    this.controls.minDistance = 0;
    this.controls.maxDistance = 1000;
  }
  renderizar() {
    //this.renderizador.render(this.escena, this.camara);
    this.compositor.render();
  }
}
