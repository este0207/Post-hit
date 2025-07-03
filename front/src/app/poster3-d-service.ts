import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { FetchService } from './fetch-service';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Poster3DService {

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  public rendererContainer!: { nativeElement: HTMLElement };
  private imageNameSubject = new BehaviorSubject<string>('Portal In Out');
  imageName$ = this.imageNameSubject.asObservable();

  constructor(private fetchService: FetchService) { }

  private initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.rendererContainer.nativeElement.clientWidth / this.rendererContainer.nativeElement.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(
      this.rendererContainer.nativeElement.clientWidth,
      this.rendererContainer.nativeElement.clientHeight
    );
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 100;
    this.controls.maxPolarAngle = Math.PI / 2;

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  private async loadPosterAndAddToScene() {
    // Récupère l'URL de l'affiche via le service
    const imageName = this.imageNameSubject.value;
    const afficheUrl = await this.fetchService.getAffiche(imageName);

    // Charge la texture et ajoute le mesh à la scène
    const loader = new THREE.TextureLoader();
    loader.load(
      afficheUrl,
      (texture) => {
        const posterGeometry = new THREE.BoxGeometry(2, 3, 0.1);
        const materials = [
          new THREE.MeshBasicMaterial({ color: 0x222222 }), // droite
          new THREE.MeshBasicMaterial({ color: 0x222222 }), // gauche
          new THREE.MeshBasicMaterial({ color: 0x222222 }), // haut
          new THREE.MeshBasicMaterial({ color: 0x222222 }), // bas
          new THREE.MeshBasicMaterial({ map: texture }),    // avant (face visible)
          new THREE.MeshBasicMaterial({ color: 0x222222 })  // arrière
        ];
        const poster = new THREE.Mesh(posterGeometry, materials);
        poster.position.set(0, 0, 0);
        this.scene.add(poster);

        // Ajout d'un cadre blanc autour de la face avant du poster
        const width = 2;
        const height = 3;
        const depth = 0.1;
        const borderThickness = 0.05;
        const borderColor = 0xffffff; // blanc

        // Bordures horizontales (haut et bas)
        const horizontalBorderGeometry = new THREE.BoxGeometry(width + borderThickness * 2, borderThickness, borderThickness);
        const topBorder = new THREE.Mesh(horizontalBorderGeometry, new THREE.MeshBasicMaterial({ color: borderColor }));
        topBorder.position.set(0, height / 2 + borderThickness / 2, depth / 2 + borderThickness / 2);
        const bottomBorder = new THREE.Mesh(horizontalBorderGeometry, new THREE.MeshBasicMaterial({ color: borderColor }));
        bottomBorder.position.set(0, -height / 2 - borderThickness / 2, depth / 2 + borderThickness / 2);

        // Bordures verticales (gauche et droite)
        const verticalBorderGeometry = new THREE.BoxGeometry(borderThickness, height, borderThickness);
        const leftBorder = new THREE.Mesh(verticalBorderGeometry, new THREE.MeshBasicMaterial({ color: borderColor }));
        leftBorder.position.set(-width / 2 - borderThickness / 2, 0, depth / 2 + borderThickness / 2);
        const rightBorder = new THREE.Mesh(verticalBorderGeometry, new THREE.MeshBasicMaterial({ color: borderColor }));
        rightBorder.position.set(width / 2 + borderThickness / 2, 0, depth / 2 + borderThickness / 2);

        this.scene.add(topBorder, bottomBorder, leftBorder, rightBorder);
      },
      undefined,
      (err) => {
        console.error('Erreur lors du chargement de la texture', err);
      }
    );
  }

  setImageName(name: string) {
    this.imageNameSubject.next(name);
  }
}