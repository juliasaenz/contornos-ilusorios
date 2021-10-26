import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';

export class Reloj {
   constructor(tiempo){
      this.tiempo = tiempo
      this.reloj = new THREE.Clock(false)
   }
   empezarReloj(){
      this.reloj.start()
   }
   pasoTiempo(){
      if(this.reloj.running && this.reloj.getElapsedTime() >= this.tiempo){
         console.log("paso el tiempo")
         this.reloj.stop()
         return true
      } 
      return false
   }
 // fin clase  
}