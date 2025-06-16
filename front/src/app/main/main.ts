import { Component, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Button } from "../button/button";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [Button],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main implements OnInit, OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;
  private animationFrameId!: number;
  private model!: THREE.Group;

  ngOnInit(): void {
    const main = document.querySelector(".main") as HTMLElement;
    if(main){
      setTimeout(() => {
        main.classList.add("active");
      }, 600);
    }

    this.initThree();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initThree(): void {
    // Initialisation de la scène
    this.scene = new THREE.Scene();
    this.scene.background = null;
    
    // Configuration de la caméra
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // Configuration du renderer
    const canvas = document.querySelector('.model_screen') as HTMLCanvasElement;
    // const canvasDIV = document.querySelector('.model') as HTMLElement;
    this.renderer = new THREE.WebGLRenderer({ canvas });
    // this.renderer.setSize(canvasDIV.clientWidth, canvasDIV.clientHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Ajout de lumières pour mieux voir le modèle
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Chargement du modèle
    this.loadModel();

    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private loadModel(): void {
    const loader = new GLTFLoader();
    
    // Remplacez 'assets/models/votre_modele.gltf' par le chemin vers votre modèle
    loader.load(
      '/models/mars_poster.glb',
      (glb) => {
        this.model = glb.scene;
        this.scene.add(this.model);
        
        // Centrer et ajuster la taille du modèle
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Ajuster la position de la caméra
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
        this.camera.position.z = cameraZ * 1.5;
        
        // Centrer le modèle
        this.model.position.sub(center);
        
        // Mettre à jour les contrôles si nécessaire
        this.camera.updateProjectionMatrix();
      },
      (progress) => {
        console.log('Chargement en cours:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Erreur lors du chargement du modèle:', error);
      }
    );
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (this.model) {
      this.model.rotation.y += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
