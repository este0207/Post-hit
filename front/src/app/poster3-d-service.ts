import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { FetchService } from './fetch-service';
// @ts-ignore
import { OrbitControls } from 'three-stdlib';
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
  private borderMaterials: THREE.MeshBasicMaterial[] = [];
  private outlineColorSubject = new BehaviorSubject<string>('#222222');
  outlineColor$ = this.outlineColorSubject.asObservable();

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
    const borderColor = 0xff0000;
    loader.load(
      afficheUrl,
      (texture) => {
        const posterGeometry = new THREE.BoxGeometry(2, 3, 0.1);
        const borderMaterials = [
          new THREE.MeshBasicMaterial({ color: borderColor }), // droite
          new THREE.MeshBasicMaterial({ color: borderColor }), // gauche
          new THREE.MeshBasicMaterial({ color: borderColor }), // haut
          new THREE.MeshBasicMaterial({ color: borderColor }), // bas
          new THREE.MeshBasicMaterial({ map: texture }),    // avant (face visible)
          new THREE.MeshBasicMaterial({ color: borderColor })  // arrière
        ];
        // Sauvegarde les matériaux de bordure pour pouvoir les modifier plus tard
        this.borderMaterials = [
          borderMaterials[0],
          borderMaterials[1],
          borderMaterials[2],
          borderMaterials[3],
          borderMaterials[5]
        ];
        const poster = new THREE.Mesh(posterGeometry, borderMaterials);
        poster.position.set(0, 0, 0);
        this.scene.add(poster);

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

  setOutlineColor(color: string) {
    this.outlineColorSubject.next(color);
  }
}